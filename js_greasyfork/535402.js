// ==UserScript==
// @name         Writo-TTS-V2 Improved Reader
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Generate and play audio sequentially with progressive chunking and buffered generation.
// @author       Flejta (con modifiche AI)
// @match        https://sdxdlgz-writo-tts-v2.hf.space/*
// @match        https://huggingface.co/spaces/sdxdlgz/Writo-TTS-V2*
// @grant        GM_download
// @grant        GM_info
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535402/Writo-TTS-V2%20Improved%20Reader.user.js
// @updateURL https://update.greasyfork.org/scripts/535402/Writo-TTS-V2%20Improved%20Reader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //#region Configuration
    const config = {
        chunkSize: 9000,
        testChunkSize: 2000,
        initialChunkSizes: [2500, 4000, 6000], // Dimensioni per i primi X chunk (se non in test mode)
        delayBetweenChunks: 5000, // Delay standard tra generazioni (quando non si riempie il buffer)
        shortDelayAfterInitialChunks: 1500, // Delay più breve dopo i primissimi chunk più piccoli
        audioGenerationTimeout: 120000,
        debug: true,
        useTestMode: false,
        maxRetriesForGeneration: 2,
        audioGenerationLookahead: 3, // Quanti chunk audio generare in anticipo (oltre a quello corrente/successivo)
        bufferCheckInterval: 2500, // Ogni quanto controllare se generare il prossimo chunk (in ms)
    };
    //#endregion

    //#region Global variables
    let textChunks = [];
    let audioQueue = []; // Array di oggetti {text, fullText, url, fileName, error?}
    let currentAudioIndex = 0; // Indice del chunk audio attualmente in play o prossimo da riprodurre
    let isProcessing = false; // Flag se la generazione di tutti i chunk è attiva
    let currentAudioPlayer = null;
    let isAudioPaused = false; // Pausa esplicita dell'utente
    let finishedProcessingChunks = 0; // Conta i chunk audio generati con successo
    let lastInputText = ""; // Per monitorare cambiamenti nell'input dell'utente
    let inputChangeTimeout = null;

    let panel, statusArea, progressBar;

    let previousAudioUrl = null;
    let processedAudioUrlsGlobalSet = new Set();
    //#endregion

    //#region Core Functions
    function splitTextIntoChunks(text) {
        if (!text) return [];

        const chunks = [];
        let textRemaining = text;
        let chunkIndexForSizing = 0; // Per tracciare l'uso di initialChunkSizes

        const getCurrentEffectiveChunkSize = () => {
            if (config.useTestMode) {
                return config.testChunkSize;
            }
            if (config.initialChunkSizes && chunkIndexForSizing < config.initialChunkSizes.length) {
                return config.initialChunkSizes[chunkIndexForSizing];
            }
            return config.chunkSize;
        };

        while (textRemaining.length > 0) {
            let effectiveChunkSize = getCurrentEffectiveChunkSize();
            if (textRemaining.length <= effectiveChunkSize) {
                chunks.push(textRemaining);
                textRemaining = "";
                break;
            }

            let currentChunkText = textRemaining.slice(0, effectiveChunkSize);
            let lastBreakPoint = -1;

            // Cerca di spezzare per paragrafo
            lastBreakPoint = currentChunkText.lastIndexOf("\n\n");
            if (lastBreakPoint === -1) { // Poi per frase
                const sentenceEndMatch = Array.from(currentChunkText.matchAll(/[.!?]\s+/g)).pop();
                if (sentenceEndMatch) {
                    lastBreakPoint = sentenceEndMatch.index + sentenceEndMatch[0].length -1;
                }
            }
            if (lastBreakPoint === -1) { // Poi per spazio (ultima risorsa prima del taglio netto)
                 lastBreakPoint = currentChunkText.lastIndexOf(" ");
            }

            if (lastBreakPoint > effectiveChunkSize * 0.6) { // Se il punto di rottura non è troppo vicino all'inizio
                currentChunkText = currentChunkText.slice(0, lastBreakPoint + 1);
            } else {
                // Se non si trova un buon punto di rottura, usa la dimensione effettiva (taglio netto)
                // currentChunkText rimane textRemaining.slice(0, effectiveChunkSize)
            }

            chunks.push(currentChunkText.trim());
            textRemaining = textRemaining.slice(currentChunkText.length).trimStart();
            chunkIndexForSizing++;
        }

        logMessage(`splitTextIntoChunks: Created ${chunks.length} chunks. Initial sizes used for up to ${config.initialChunkSizes ? config.initialChunkSizes.length : 0} chunks (if not in test mode).`, "debug");
        if (!config.useTestMode && config.initialChunkSizes) {
            chunks.slice(0, config.initialChunkSizes.length).forEach((c, i) => {
                logMessage(`  - Initial chunk ${i+1} length: ${c.length} (target: ${config.initialChunkSizes[i] || 'N/A'})`, "debug");
            });
        }
        return chunks.filter(chunk => chunk.length > 0); // Rimuovi chunk vuoti
    }


    function resetApp() {
        stopProcessing();
        if (currentAudioPlayer) {
            currentAudioPlayer.pause();
            currentAudioPlayer.onended = null;
            currentAudioPlayer.onerror = null;
            currentAudioPlayer = null;
        }
        textChunks = [];
        audioQueue = [];
        currentAudioIndex = 0;
        isAudioPaused = false;
        finishedProcessingChunks = 0;
        previousAudioUrl = null;
        processedAudioUrlsGlobalSet.clear();

        if (document.getElementById('writo-input')) {
             document.getElementById('writo-input').value = "";
             lastInputText = "";
        }
        updateProgress(0, 1);
        updateAudioList();
        updateControls();
        logMessage("Application reset complete", "info");
    }

    function findTextInput() { /* ... (invariato) ... */
        let input = document.querySelector('textarea[data-testid="textbox"]');
        if (!input) {
            const textareas = document.querySelectorAll('textarea');
            for (const textarea of textareas) {
                if (textarea.placeholder?.toLowerCase().includes('text') ||
                    textarea.parentElement?.textContent?.toLowerCase().includes('input')) {
                    input = textarea;
                    break;
                }
            }
        }
        return input;
    }
    function findGenerateButton() { /* ... (invariato) ... */
        const buttons = document.querySelectorAll('button');
        for (const button of buttons) {
            const text = button.textContent.toLowerCase();
            if (text.includes('generate') || text.includes('submit') ||
                text.includes('create') || text.includes('convert')) {
                return button;
            }
        }
        return null;
    }
    function injectText(text) { /* ... (invariato) ... */
        const input = findTextInput();
        if (!input) {
            logMessage("Text input field not found on page", "error");
            return false;
        }
        const nativeValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
        nativeValueSetter.call(input, text);
        input.dispatchEvent(new Event('input', { bubbles: true }));
        return true;
     }
    function clickGenerateButton() { /* ... (invariato) ... */
        const button = findGenerateButton();
        if (!button) {
            logMessage("Generate button not found on page", "error");
            return false;
        }
        button.click();
        return true;
    }

    function waitForAudio() {
        return new Promise((resolve, reject) => {
            let overallTimeoutId = null;
            let audioDetectionInterval = null;
            let originalXHROpen = XMLHttpRequest.prototype.open;
            let originalFetch = window.fetch;
            let hasFinalized = false;

            let domCandidateUrl = null;
            let domCandidateConfirmTimeout = null;

            const existingAudiosOnPageStart = Array.from(document.querySelectorAll('audio[src], source[src*=".mp3"], a[href*=".mp3"]'))
                                                .map(el => el.src || el.href)
                                                .filter(url => url && typeof url === 'string');
            // logMessage(`waitForAudio: Initial existing URLs on page: ${existingAudiosOnPageStart.length}`, "debug");


            const cleanupAndRestore = () => {
                clearTimeout(overallTimeoutId);
                clearInterval(audioDetectionInterval);
                clearTimeout(domCandidateConfirmTimeout);
                domCandidateConfirmTimeout = null;
                XMLHttpRequest.prototype.open = originalXHROpen;
                window.fetch = originalFetch;
            };

            const finalizeAndResolve = (url) => {
                if (hasFinalized) return;
                hasFinalized = true;
                logMessage(`waitForAudio: Finalizing with URL: ${url.substring(0, 70)}...`, "debug");
                cleanupAndRestore();
                resolve(url);
            };

            const finalizeAndReject = (errorMessage) => {
                if (hasFinalized) return;
                hasFinalized = true;
                logMessage(`waitForAudio: Finalizing with Error: ${errorMessage}`, "error");
                cleanupAndRestore();
                reject(new Error(errorMessage));
            };

            const isNewUrl = (url) => {
                if (!url || typeof url !== 'string') return false;
                return !existingAudiosOnPageStart.includes(url);
            };

            audioDetectionInterval = setInterval(() => {
                if (hasFinalized) return;
                let bestDomSignalThisCycle = null;
                let bestDomSourceThisCycle = null;

                const audioElements = document.querySelectorAll('audio[src]');
                for (const audio of audioElements) {
                    if (audio.src && isNewUrl(audio.src)) {
                        bestDomSignalThisCycle = audio.src;
                        bestDomSourceThisCycle = "DOM-Audio";
                        break;
                    }
                }
                if (!bestDomSignalThisCycle) {
                    const sourceElements = document.querySelectorAll('source[src*=".mp3"]');
                    for (const source of sourceElements) {
                        if (source.src && isNewUrl(source.src)) {
                            bestDomSignalThisCycle = source.src;
                            bestDomSourceThisCycle = "DOM-Source";
                            break;
                        }
                    }
                }

                if (bestDomSignalThisCycle) {
                    logMessage(`waitForAudio: Strong DOM signal (${bestDomSourceThisCycle}) for ${bestDomSignalThisCycle.substring(0,50)}. Finalizing.`, "debug");
                    finalizeAndResolve(bestDomSignalThisCycle);
                    return;
                }

                const linkElements = document.querySelectorAll('a[href*=".mp3"]');
                for (const link of linkElements) {
                    if (link.href && isNewUrl(link.href)) {
                        bestDomSignalThisCycle = link.href;
                        bestDomSourceThisCycle = "DOM-Link";
                        break;
                    }
                }
                if (bestDomSignalThisCycle) {
                    if (domCandidateUrl !== bestDomSignalThisCycle || domCandidateConfirmTimeout === null) {
                        domCandidateUrl = bestDomSignalThisCycle;
                        logMessage(`waitForAudio: New/Updated DOM candidate (DOM-Link): ${domCandidateUrl.substring(0,50)}. Setting/Resetting confirm (1.5s).`, "debug");
                        clearTimeout(domCandidateConfirmTimeout);
                        domCandidateConfirmTimeout = setTimeout(() => {
                            if (!hasFinalized && domCandidateUrl) {
                                logMessage(`waitForAudio: Confirming DOM candidate (DOM-Link) after 1.5s: ${domCandidateUrl.substring(0,50)}...`, "info");
                                finalizeAndResolve(domCandidateUrl);
                            }
                        }, 1500);
                    }
                }
            }, 400);

            XMLHttpRequest.prototype.open = function(method, url, ...args) { /* ... (invariato dalla v0.5) ... */
                const boundOriginalOpen = originalXHROpen.bind(this);
                if (!hasFinalized && typeof url === 'string' && url.includes('.mp3')) {
                    this.addEventListener('load', function() {
                        if (hasFinalized) return;
                        if (this.readyState === 4 && (this.status === 200 || this.status === 206 )) {
                            const responseUrl = this.responseURL || url;
                            if (responseUrl.includes('.mp3') && isNewUrl(responseUrl)) {
                                logMessage(`waitForAudio: XHR-Load-OK signal for ${responseUrl.substring(0,50)}. Finalizing.`, "debug");
                                clearTimeout(domCandidateConfirmTimeout); domCandidateConfirmTimeout = null;
                                domCandidateUrl = null;
                                finalizeAndResolve(responseUrl);
                            }
                        }
                    });
                     this.addEventListener('error', function() {
                        if (hasFinalized) return;
                        logMessage(`waitForAudio: XHR error for ${String(url).substring(0,30)}...`, "warning");
                    });
                }
                return boundOriginalOpen.apply(this, [method, url, ...args]);
            };
            window.fetch = function(resource, init) { /* ... (invariato dalla v0.5) ... */
                const boundOriginalFetch = originalFetch.bind(this);
                const requestUrl = (typeof resource === 'string' ? resource : (resource && resource.url));
                if (!hasFinalized && typeof requestUrl === 'string' && requestUrl.includes('.mp3')) {
                    return boundOriginalFetch(resource, init).then(response => {
                        if (!hasFinalized && response.ok) {
                            const responseUrl = response.url;
                            if (responseUrl && responseUrl.includes('.mp3') && isNewUrl(responseUrl)) {
                                logMessage(`waitForAudio: Fetch-Response-OK signal for ${responseUrl.substring(0,50)}. Finalizing.`, "debug");
                                clearTimeout(domCandidateConfirmTimeout); domCandidateConfirmTimeout = null;
                                domCandidateUrl = null;
                                finalizeAndResolve(responseUrl);
                            }
                        }
                        return response;
                    }).catch(error => {
                        if (!hasFinalized) {
                            logMessage(`waitForAudio: Fetch error for ${String(requestUrl).substring(0,30)}...: ${error.message}`, "warning");
                        }
                        throw error;
                    });
                }
                return boundOriginalFetch(resource, init);
            };

            overallTimeoutId = setTimeout(() => {
                if (hasFinalized) return;
                if (domCandidateUrl && isNewUrl(domCandidateUrl)) {
                    logMessage(`waitForAudio: Main Timeout. Using last valid DOM candidate URL: ${domCandidateUrl.substring(0, 50)}...`, "info");
                    finalizeAndResolve(domCandidateUrl);
                } else {
                    finalizeAndReject("Timeout waiting for audio, no new valid URL consistently detected.");
                }
            }, config.audioGenerationTimeout);
        });
    }

    async function generateAudio(text, retriesLeft = config.maxRetriesForGeneration) {
        try {
            logMessage(`Generating audio for text: "${text.substring(0, 30)}..." (Retries left: ${retriesLeft})`, "info");
            if (!injectText(text)) throw new Error("Failed to inject text into page input");
            await new Promise(r => setTimeout(r, 500));
            if (!clickGenerateButton()) throw new Error("Failed to click page's generate button");
            const audioUrl = await waitForAudio();

            if (audioUrl === previousAudioUrl) logMessage(`Generated URL identical to previous. Acceptable.`, "info");
            else if (processedAudioUrlsGlobalSet.has(audioUrl)) logMessage(`Generated URL already seen globally. Acceptable.`, "info");
            previousAudioUrl = audioUrl;
            processedAudioUrlsGlobalSet.add(audioUrl);
            logMessage(`Audio for "${text.substring(0,30)}..." generated: ${audioUrl.substring(0,50)}`, "success");
            return {
                text: text.substring(0, 50) + (text.length > 50 ? "..." : ""),
                fullText: text,
                url: audioUrl,
                fileName: `writo-tts-chunk-${Date.now()}.mp3`
            };
        } catch (error) {
            logMessage(`Error generating for "${text.substring(0,30)}...": ${error.message}`, "error");
            if (retriesLeft > 0) {
                logMessage(`Retrying for "${text.substring(0,30)}..." (${retriesLeft} left)...`, "warning");
                await new Promise(r => setTimeout(r, 4000 + Math.random() * 2000));
                return generateAudio(text, retriesLeft - 1);
            } else {
                logMessage(`Failed for "${text.substring(0,30)}..." after all retries.`, "error");
                throw error; // Questo errore sarà catturato da processAllChunks
            }
        }
    }
    //#endregion

    //#region Core Functions (Continued - Playback, Processing Logic)
    async function processAllChunks() {
        if (isProcessing || textChunks.length === 0) {
            logMessage("Process: Already running or no chunks.", "info");
            return;
        }

        isProcessing = true;
        finishedProcessingChunks = 0;
        let currentlyGeneratingTextChunkIndex = 0; // Indice del chunk di TESTO che stiamo provando a generare

        updateControls();
        updateProgress(0, textChunks.length);
        logMessage(`Process: Starting for ${textChunks.length} chunks. Lookahead: ${config.audioGenerationLookahead}.`, "info");

        const initialAudioQueueLengthAtStartOfBatch = audioQueue.length;

        const getAheadAudioCount = () => {
            let count = 0;
            // Considera "ahead" gli audio pronti a partire dall'indice successivo a quello corrente (se in play)
            // o da currentAudioIndex se il player è fermo.
            const startIndex = (currentAudioPlayer && !currentAudioPlayer.paused && !isAudioPaused) ? currentAudioIndex + 1 : currentAudioIndex;
            for (let i = startIndex; i < audioQueue.length; i++) {
                if (audioQueue[i] && audioQueue[i].url) {
                    count++;
                }
            }
            return count;
        };

        while (isProcessing && currentlyGeneratingTextChunkIndex < textChunks.length) {
            const aheadCount = getAheadAudioCount();
            const shouldGenerate = aheadCount < config.audioGenerationLookahead;

            if (shouldGenerate) {
                const textChunkToProcess = textChunks[currentlyGeneratingTextChunkIndex];
                // Assicura che la audioQueue abbia una lunghezza sufficiente, riempiendo con null se necessario
                // Questo è per gestire il caso in cui un tentativo precedente per questo indice è fallito
                // e l'indice non è stato pushato.
                while (audioQueue.length <= currentlyGeneratingTextChunkIndex) {
                    audioQueue.push(null); // Placeholder per garantire la corrispondenza degli indici
                }

                logMessage(`Process: Attempting text chunk ${currentlyGeneratingTextChunkIndex + 1}/${textChunks.length}. Ahead: ${aheadCount}. Text: "${textChunkToProcess.substring(0,30)}..."`, "info");

                try {
                    const audio = await generateAudio(textChunkToProcess);
                    audioQueue[currentlyGeneratingTextChunkIndex] = audio; // Sovrascrive il placeholder (o null precedente)
                    finishedProcessingChunks++;
                } catch (error) {
                    logMessage(`Process: Failed text chunk ${currentlyGeneratingTextChunkIndex + 1} after retries. Error: ${error.message}. Storing error placeholder.`, "error");
                    audioQueue[currentlyGeneratingTextChunkIndex] = {
                        text: textChunkToProcess.substring(0, 50) + (textChunkToProcess.length > 50 ? "..." : ""),
                        fullText: textChunkToProcess,
                        url: null,
                        error: error.message,
                        fileName: `failed-chunk-${currentlyGeneratingTextChunkIndex + 1}.mp3`
                    };
                }

                updateAudioList();
                updateProgress(finishedProcessingChunks, textChunks.length);

                // Logica di avvio/ripresa riproduzione
                if (currentAudioPlayer === null && !isAudioPaused && audioQueue[currentlyGeneratingTextChunkIndex] && audioQueue[currentlyGeneratingTextChunkIndex].url) {
                    logMessage("Process: Player was idle & new audio ready. Attempting to play.", "info");
                    // Se currentAudioIndex punta a un audio precedente, o a un fallimento,
                    // prova a partire dall'audio appena generato se è il primo valido.
                    let playStartIndex = initialAudioQueueLengthAtStartOfBatch;
                    if (audioQueue[playStartIndex] === null || !audioQueue[playStartIndex].url) {
                        playStartIndex = audioQueue.findIndex(a => a && a.url); // Trova il primo valido
                    }
                    if (playStartIndex !== -1 && (currentAudioIndex < playStartIndex || (audioQueue[currentAudioIndex] && !audioQueue[currentAudioIndex].url) ) ) {
                        currentAudioIndex = playStartIndex;
                    } else if (currentAudioIndex >= audioQueue.length) { // Se l'indice era oltre la coda
                        currentAudioIndex = Math.max(0, audioQueue.findIndex(a => a && a.url));
                    }
                    if (currentAudioIndex === -1) currentAudioIndex = 0; // Fallback

                    if(audioQueue[currentAudioIndex] && audioQueue[currentAudioIndex].url) {
                         playNextAudio();
                    } else {
                        logMessage("Process: Could not start player, no valid audio at current/calculated index.", "warning");
                    }
                }

                currentlyGeneratingTextChunkIndex++; // Passa al prossimo chunk di testo

                if (isProcessing && currentlyGeneratingTextChunkIndex < textChunks.length) {
                     // Decidi il ritardo prima del prossimo tentativo di generazione
                    const isInitialPhase = currentlyGeneratingTextChunkIndex < (config.initialChunkSizes ? config.initialChunkSizes.length : 0);
                    const delayToApply = isInitialPhase ? config.shortDelayAfterInitialChunks : config.delayBetweenChunks;

                    // Se il buffer non è ancora pieno, usa un ritardo più breve per riempirlo velocemente
                    const nextAheadCount = getAheadAudioCount();
                    if (nextAheadCount < config.audioGenerationLookahead) {
                        logMessage(`Process: Buffer not full (ahead: ${nextAheadCount}). Short delay (${Math.min(delayToApply, config.shortDelayAfterInitialChunks)/1000}s) before next gen.`, "debug");
                        await new Promise(r => setTimeout(r, Math.min(delayToApply, config.shortDelayAfterInitialChunks)));
                    } else {
                        logMessage(`Process: Buffer full. Standard delay (${delayToApply/1000}s) if next gen needed soon.`, "debug");
                        // Il loop esterno con bufferCheckInterval gestirà l'attesa se il buffer è pieno.
                        // Ma se il loop principale continua, questo delay si applica.
                         await new Promise(r => setTimeout(r, delayToApply));
                    }
                }

            } else { // Buffer di lookahead pieno o fine testo
                if (!isProcessing || currentlyGeneratingTextChunkIndex >= textChunks.length) break;
                logMessage(`Process: Lookahead buffer full (Ahead: ${aheadCount} >= Target: ${config.audioGenerationLookahead}). Waiting ${config.bufferCheckInterval/1000}s...`, "debug");
                await new Promise(r => setTimeout(r, config.bufferCheckInterval));
            }
        }

        updateProgress(finishedProcessingChunks, textChunks.length);
        logMessage(`Process: Loop finished. Successfully generated audio for ${finishedProcessingChunks}/${textChunks.length} text chunks.`, "success");

        if (!isAudioPlayingOrPaused() && audioQueue.some(item => item && item.url) && finishedProcessingChunks > 0) {
             logMessage("Process: Playback not active. Press Play All or select an item.", "info");
        }

        isProcessing = false;
        updateControls();
    }

    function isAudioPlayingOrPaused() { /* ... (invariato dalla v0.5) ... */
         return currentAudioPlayer !== null;
    }
    function playNextAudio() { /* ... (invariato dalla v0.5, ma assicurati che gestisca audioItem.error se esiste) ... */
        if (currentAudioPlayer && !currentAudioPlayer.paused && !isAudioPaused) {
            // logMessage("playNextAudio called while an audio is already playing and not paused. Ignoring.", "debug");
            return;
        }

        if (currentAudioIndex >= audioQueue.length) {
            if (isProcessing) {
                logMessage("Reached end of current audio queue, but still processing. Player will wait.", "info");
                updateControls();
                highlightPlayingItem();
                return;
            }
            logMessage("Reached end of audio queue (all chunks processed or processing stopped).", "info");
            if (currentAudioPlayer) {
                currentAudioPlayer.pause();
                currentAudioPlayer.onended = null;
                currentAudioPlayer.onerror = null;
            }
            currentAudioPlayer = null;
            isAudioPaused = false;
            updateControls();
            highlightPlayingItem();
            return;
        }

        const audioItem = audioQueue[currentAudioIndex];
        if (!audioItem || !audioItem.url) { // Gestisce null o item con errore
            logMessage(`Skipping invalid/failed audio item at index ${currentAudioIndex}. Error: ${audioItem ? audioItem.error : 'No data'}. Attempting next.`, "warning");
            currentAudioIndex++;
            setTimeout(playNextAudio, 100);
            return;
        }

        logMessage(`Playing audio ${currentAudioIndex + 1}/${audioQueue.length}: ${audioItem.text}`, "info");

        if (currentAudioPlayer) {
            currentAudioPlayer.pause();
            currentAudioPlayer.onended = null;
            currentAudioPlayer.onerror = null;
        }

        currentAudioPlayer = new Audio(audioItem.url);
        currentAudioPlayer.onended = () => {
            // logMessage(`Audio ${currentAudioIndex + 1} ended.`, "debug");
            currentAudioIndex++;
            playNextAudio();
        };
        currentAudioPlayer.onerror = (e) => {
            logMessage(`Error playing audio ${currentAudioIndex + 1} (URL: ${audioItem.url.substring(0,50)}): ${e.message || 'Unknown error'}. Attempting next.`, "error");
            currentAudioIndex++;
            playNextAudio();
        };

        updateControls();
        highlightPlayingItem();

        currentAudioPlayer.play().then(() => {
            isAudioPaused = false;
            updateControls();
        }).catch(err => {
            logMessage(`Error trying to play audio ${currentAudioIndex + 1}: ${err.message}`, "error");
            updateControls();
        });
     }
    function pausePlayback() { /* ... (invariato dalla v0.5) ... */
        if (currentAudioPlayer && !currentAudioPlayer.paused) {
            currentAudioPlayer.pause();
            isAudioPaused = true;
            logMessage("Playback paused by user.", "info");
            updateControls();
        }
    }
    function resumePlayback() { /* ... (invariato dalla v0.5) ... */
        if (currentAudioPlayer && (currentAudioPlayer.paused || isAudioPaused) ) {
            currentAudioPlayer.play().then(() => {
                isAudioPaused = false;
                logMessage("Playback resumed by user.", "info");
                updateControls();
            }).catch(err => {
                logMessage(`Error resuming playback: ${err.message}`, "error");
            });
        } else if (!currentAudioPlayer && audioQueue.length > 0) {
            logMessage("No active audio to resume. Starting from current/next in queue.", "info");
            if (currentAudioIndex >= audioQueue.length && audioQueue.length > 0) {
                 currentAudioIndex = audioQueue.findIndex(a=> a && a.url); // Trova il primo valido
                 if(currentAudioIndex === -1) currentAudioIndex = 0; // Fallback
            }
            else if (audioQueue.length === 0) { logMessage("Queue is empty.", "info"); return; }
            isAudioPaused = false;
            if(audioQueue[currentAudioIndex] && audioQueue[currentAudioIndex].url) playNextAudio();
            else {
                logMessage("Cannot resume, current audio index points to invalid item.", "warning");
                currentAudioIndex++; // Prova il prossimo
                if(currentAudioIndex < audioQueue.length && audioQueue[currentAudioIndex] && audioQueue[currentAudioIndex].url) playNextAudio();
            }
        }
    }
    function stopProcessing() { /* ... (invariato dalla v0.5) ... */
        if (isProcessing) {
            isProcessing = false;
            logMessage("Stopping audio generation process... Current chunk may finish or timeout.", "warning");
            updateControls();
        }
    }
    function downloadAllAudio() { /* ... (invariato dalla v0.5) ... */
         if (audioQueue.length === 0) {
            logMessage("No audio files to download.", "warning");
            return;
        }
        logMessage(`Preparing to download ${audioQueue.filter(a=>a && a.url).length} audio files...`, "info");

        let downloadCount = 0;
        const totalToDownload = audioQueue.filter(a => a && a.url).length;
        if (totalToDownload === 0) {
            logMessage("No valid audio URLs to download.", "warning");
            return;
        }

        audioQueue.forEach((audio, index) => {
            if (!audio || !audio.url) {
                // logMessage(`Skipping download for item ${index+1}: No URL.`, "warning");
                return;
            }
            setTimeout(() => {
                try {
                    const sanitizedText = (audio.fullText || audio.text).replace(/[^a-z0-9 _-]/gi, '_').slice(0,30);
                    const fileName = audio.fileName || `chunk-${String(index + 1).padStart(3, '0')}-${sanitizedText}.mp3`;
                    // logMessage(`Initiating download for: ${fileName} (URL: ${audio.url.substring(0,30)}...)`, "debug");
                    if (typeof GM_download === 'function') {
                        GM_download({
                            url: audio.url,
                            name: fileName,
                            onload: () => {
                                downloadCount++;
                                if (downloadCount === totalToDownload) logMessage("All GM_downloads initiated.", "success");
                            },
                            onerror: (e) => logMessage(`GM_download error for ${fileName}: ${e.error || 'Unknown error'}`, "error"),
                            ontimeout: () => logMessage(`GM_download timeout for ${fileName}`, "error")
                        });
                    } else {
                        const a = document.createElement('a');
                        a.href = audio.url;
                        a.download = fileName;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        downloadCount++;
                        if (downloadCount === totalToDownload) logMessage("All fallback downloads initiated.", "success");
                    }
                } catch (e) {
                    logMessage(`Error initiating download for chunk ${index + 1}: ${e.message}`, "error");
                }
            }, index * 350);
        });
    }
    //#endregion

    //#region UI Functions
    function logMessage(message, type = "info") { /* ... (invariato dalla v0.5, ma puoi togliere il timestamp se preferisci) ... */
        const prefix = "[Writo-TTS] ";
        if (type === "error") console.error(prefix + message);
        else if (type === "warning") console.warn(prefix + message);
        else if (type === "debug" && config.debug) console.log(prefix + "DEBUG: " + message);
        else if (type !== "debug") console.log(prefix + message);

        if (statusArea) {
            const line = document.createElement("div");
            line.className = `writo-log writo-${type}`;
            const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            line.textContent = `[${timestamp}] ${message}`;
            while (statusArea.children.length > 150) {
                statusArea.removeChild(statusArea.firstChild);
            }
            statusArea.appendChild(line);
            statusArea.scrollTop = statusArea.scrollHeight;
        }
    }
    function updateProgress(current, total) { /* ... (invariato dalla v0.5) ... */
        if (!progressBar ) return;
        if (total === 0 || (current === 0 && total === 1) ) {
             progressBar.style.width = `0%`;
             progressBar.textContent = (total === 1 && current === 0) ? `0%` : `0% (0/0)`;
             return;
        }
        const percent = Math.max(0, Math.min(100, Math.floor((current / total) * 100)));
        progressBar.style.width = `${percent}%`;
        progressBar.textContent = `${percent}% (${current} ok / ${total} total)`;
    }
    function updateAudioList() { /* ... (invariato dalla v0.5, ma la gestione dell'errore è già lì) ... */
        const list = document.getElementById("writo-audio-list");
        if (!list) return;
        list.innerHTML = "";

        const title = document.getElementById("writo-audio-title");
        // Conta quanti chunk di testo sono stati *tentati* (lunghezza di audioQueue)
        const attemptedChunks = audioQueue.length;
        if (title) title.textContent = `Generated Audio (${finishedProcessingChunks} successful / ${attemptedChunks} attempted)`;


        audioQueue.forEach((audio, index) => {
            const item = document.createElement("div");
            item.className = "writo-audio-item";
            item.dataset.index = index; // Questo è l'indice nell'array audioQueue

            // Il testo da mostrare è dal chunk di testo originale, non dall'oggetto audio se è fallito
            const originalTextChunk = textChunks[index] || "Chunk text unavailable";
            const displayText = originalTextChunk.substring(0,50) + (originalTextChunk.length > 50 ? "..." : "");


            if (!audio || !audio.url) {
                 item.innerHTML = `<span class="writo-audio-index" style="background-color:#E57373;">${index + 1}</span>
                                   <span class="writo-audio-text" style="color:#aaa;" title="${originalTextChunk}\nError: ${audio ? audio.error : 'Unknown error'}">${displayText} (Failed)</span>
                                   <div class="writo-audio-actions">
                                        <button class="writo-btn-retry" data-index="${index}" title="Retry this chunk">🔁</button>
                                   </div>`;
            } else {
                item.innerHTML = `
                    <span class="writo-audio-index">${index + 1}</span>
                    <span class="writo-audio-text" title="${audio.fullText || audio.text}">${audio.text}</span>
                    <div class="writo-audio-actions">
                        <button class="writo-btn-play" data-index="${index}" title="Play this chunk">▶️</button>
                        <button class="writo-btn-download" data-index="${index}" title="Download this chunk">💾</button>
                    </div>
                `;
            }
            list.appendChild(item);
        });

        document.querySelectorAll(".writo-btn-play").forEach(btn => {
            btn.addEventListener("click", () => {
                const indexToPlay = parseInt(btn.dataset.index);
                if (audioQueue[indexToPlay] && audioQueue[indexToPlay].url) {
                    currentAudioIndex = indexToPlay;
                    isAudioPaused = false;
                    playNextAudio();
                } else {
                    logMessage(`Cannot play item ${indexToPlay + 1}: Audio data is missing or invalid.`, "error");
                }
            });
        });
        document.querySelectorAll(".writo-btn-download").forEach(btn => {
            btn.addEventListener("click", () => {
                const index = parseInt(btn.dataset.index);
                const audio = audioQueue[index];
                if (audio && audio.url) {
                    const sanitizedText = (audio.fullText || audio.text).replace(/[^a-z0-9 _-]/gi, '_').slice(0,30);
                    const fileName = audio.fileName || `chunk-${String(index + 1).padStart(3, '0')}-${sanitizedText}.mp3`;
                    if (typeof GM_download === 'function') {
                        GM_download({ url: audio.url, name: fileName,
                            onload: () => logMessage(`Downloaded ${fileName}`, "success"),
                            onerror: (e) => logMessage(`Error downloading ${fileName}: ${e.error || 'Unknown'}`, "error")
                        });
                    } else {
                        const a = document.createElement('a'); a.href = audio.url; a.download = fileName;
                        document.body.appendChild(a); a.click(); document.body.removeChild(a);
                        logMessage(`Fallback download initiated for ${fileName}`, "info");
                    }
                } else {
                    logMessage(`Cannot download item ${index+1}: No audio URL.`, "error");
                }
            });
        });
        // NUOVO: Bottone Retry
        document.querySelectorAll(".writo-btn-retry").forEach(btn => {
            btn.addEventListener("click", async () => {
                if (isProcessing) {
                    logMessage("Cannot retry individual chunk while main processing is active. Please Stop first.", "warning");
                    return;
                }
                const indexToRetry = parseInt(btn.dataset.index);
                if (indexToRetry < 0 || indexToRetry >= textChunks.length) {
                    logMessage(`Invalid index for retry: ${indexToRetry}`, "error");
                    return;
                }

                const textChunkToRetry = textChunks[indexToRetry];
                logMessage(`Retrying generation for failed chunk ${indexToRetry + 1}: "${textChunkToRetry.substring(0,30)}..."`, "info");
                btn.disabled = true; // Disabilita il bottone durante il tentativo
                btn.textContent = "⏳";

                try {
                    const audio = await generateAudio(textChunkToRetry); // generateAudio gestisce i suoi retry interni
                    audioQueue[indexToRetry] = audio;
                    finishedProcessingChunks++; // Se prima era fallito, ora è un successo
                    logMessage(`Successfully regenerated audio for chunk ${indexToRetry + 1}.`, "success");
                } catch (error) {
                    logMessage(`Failed to regenerate audio for chunk ${indexToRetry + 1} on manual retry. Error: ${error.message}`, "error");
                    // audioQueue[indexToRetry] rimane l'oggetto errore o viene aggiornato da generateAudio se lancia
                    if (audioQueue[indexToRetry] && audioQueue[indexToRetry].url === null) { // Se era fallito e generateAudio ha fallito di nuovo
                         audioQueue[indexToRetry].error = `Retry failed: ${error.message}`;
                    }
                } finally {
                    updateAudioList(); // Aggiorna la UI
                    updateProgress(finishedProcessingChunks, textChunks.length);
                    updateControls();
                    // btn.disabled = false; // Riabilita il bottone, ma updateAudioList lo ricreerà
                }
            });
        });
        highlightPlayingItem();
    }
    function highlightPlayingItem() { /* ... (invariato dalla v0.5) ... */
        document.querySelectorAll('.writo-audio-item').forEach(item => item.classList.remove('writo-playing'));
        if (currentAudioPlayer && !currentAudioPlayer.paused && !isAudioPaused && currentAudioIndex < audioQueue.length) {
            if (audioQueue[currentAudioIndex] && audioQueue[currentAudioIndex].url) { // Solo se l'item corrente è valido
                const currentItem = document.querySelector(`.writo-audio-item[data-index="${currentAudioIndex}"]`);
                if (currentItem) {
                    currentItem.classList.add('writo-playing');
                    currentItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            }
        }
    }
    function updateControls() { /* ... (invariato dalla v0.5) ... */
        const analyzeBtn = document.getElementById('writo-analyze');
        const generateBtn = document.getElementById('writo-generate');
        const stopBtn = document.getElementById('writo-stop');
        const playBtn = document.getElementById('writo-play');
        const pauseBtn = document.getElementById('writo-pause');
        const resumeBtn = document.getElementById('writo-resume');
        const downloadBtn = document.getElementById('writo-download');
        const resetBtn = document.getElementById('writo-reset');
        const testModeCheckbox = document.getElementById('writo-test-mode');

        const hasValidAudioItems = audioQueue.some(item => item && item.url);
        const isCurrentlyPlaying = currentAudioPlayer && !currentAudioPlayer.paused && !isAudioPaused;
        const isCurrentlyPausedByUser = currentAudioPlayer && isAudioPaused;

        if (analyzeBtn) analyzeBtn.disabled = isProcessing;
        if (generateBtn) generateBtn.disabled = isProcessing || textChunks.length === 0;
        if (stopBtn) stopBtn.disabled = !isProcessing;
        if (resetBtn) resetBtn.disabled = isProcessing;

        if (playBtn) playBtn.disabled = isProcessing || !hasValidAudioItems || isCurrentlyPlaying;
        if (pauseBtn) pauseBtn.disabled = isProcessing || !isCurrentlyPlaying;
        if (resumeBtn) resumeBtn.disabled = isProcessing || !hasValidAudioItems || isCurrentlyPlaying || !isCurrentlyPausedByUser ;

        if (downloadBtn) downloadBtn.disabled = isProcessing || !hasValidAudioItems;

        if (testModeCheckbox) testModeCheckbox.checked = config.useTestMode;

        highlightPlayingItem();
    }
    function setupInputMonitoring() { /* ... (invariato dalla v0.5) ... */
        const input = document.getElementById('writo-input');
        if (!input) return;

        input.addEventListener('input', () => {
            clearTimeout(inputChangeTimeout);
            inputChangeTimeout = setTimeout(() => {
                const newText = input.value.trim();
                if (newText !== lastInputText && !isProcessing) {
                    if (textChunks.length > 0 || audioQueue.length > 0) {
                        logMessage("Input text changed. Current chunks/audio may be outdated. Please 'Analyze Text' again or 'Reset'.", "warning");
                        textChunks = [];
                        if (document.getElementById('writo-generate')) {
                            document.getElementById('writo-generate').disabled = true;
                        }
                        updateControls();
                    }
                }
            }, 1200);
        });
    }
    function createUI() { /* ... (Stili e struttura HTML in gran parte invariati, ma il titolo della lista audio è aggiornato da updateAudioList) ... */
        const style = document.createElement('style');
        style.textContent = `
            #writo-panel { position: fixed; top: 20px; right: 20px; width: 380px; background: rgba(20,20,30,0.92); color: #e0e0e0; font-family: Arial, sans-serif; border-radius: 8px; box-shadow: 0 6px 20px rgba(0,0,0,0.5); z-index: 10001; display: flex; flex-direction: column; max-height: calc(100vh - 40px); overflow: hidden; resize: both; min-width: 320px; min-height: 480px; border: 1px solid #101018; }
            #writo-header { display: flex; justify-content: space-between; align-items: center; padding: 10px 15px; background: #2a2a3a; border-bottom: 1px solid #445; cursor: move; user-select: none; }
            #writo-title { font-size: 16px; font-weight: bold; margin: 0; color: #6caeff; }
            #writo-close { background: none; border: none; color: #aaa; font-size: 22px; cursor: pointer; padding: 0 5px; line-height: 1; }
            #writo-close:hover { color: #fff; }
            #writo-content { padding: 15px; display: flex; flex-direction: column; gap: 12px; overflow-y: auto; flex: 1; scrollbar-width: thin; scrollbar-color: #6caeff #2a2a3a; }
            #writo-input { width: 100%; box-sizing: border-box; height: 120px; min-height: 60px; resize: vertical; background: #1c1c26; color: #d0d0d0; border: 1px solid #445; border-radius: 4px; padding: 10px; font-family: inherit; font-size: 13px; }
            .writo-button-group { display: flex; gap: 8px; flex-wrap: wrap; }
            .writo-button { flex-grow: 1; flex-basis: 0; min-width: 80px; padding: 9px 12px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; transition: all 0.15s; font-size: 12px; background-color: #394055; color: #dde2f0; text-align: center;}
            .writo-button:hover:not(:disabled) { background-color: #4f5877; color: #fff; transform: translateY(-1px); box-shadow: 0 2px 4px rgba(0,0,0,0.2); }
            .writo-button:active:not(:disabled) { transform: translateY(0px); box-shadow: inset 0 1px 3px rgba(0,0,0,0.2); }
            .writo-button:disabled { opacity: 0.6; cursor: not-allowed; background-color: #2f3445; color: #777c88; }
            .writo-button.primary { background: #5c9aff; color: white; } .writo-button.primary:hover:not(:disabled) { background: #70aeff; }
            .writo-button.success { background: #4CAF50; color: white; } .writo-button.success:hover:not(:disabled) { background: #66BB6A; }
            .writo-button.danger { background: #F44336; color: white; } .writo-button.danger:hover:not(:disabled) { background: #E57373; }
            .writo-button.warning { background: #FF9800; color: white; } .writo-button.warning:hover:not(:disabled) { background: #FFB74D; }
            #writo-progress-container { width: 100%; height: 18px; background: #252530; border-radius: 9px; overflow: hidden; border: 1px solid #445; margin-top: 5px; }
            #writo-progress-bar { height: 100%; width: 0%; background: linear-gradient(90deg, #5c9aff, #4787dd); color: white; text-align: center; font-size: 10px; line-height: 18px; transition: width 0.4s ease-in-out; box-shadow: inset 0 1px 3px rgba(0,0,0,0.2); white-space: nowrap; }
            #writo-status { background: #181820; border-radius: 4px; padding: 10px; max-height: 150px; min-height: 50px; overflow-y: auto; font-size: 11px; border: 1px solid #333; line-height: 1.45; scrollbar-width: thin; scrollbar-color: #6caeff #181820; }
            .writo-log { margin-bottom: 5px; word-break: break-word; }
            .writo-info { color: #7bbfff; } .writo-success { color: #81C784; } .writo-warning {color: #FFB74D; } .writo-error { color: #E57373; font-weight: bold; } .writo-debug { color: #999; }
            #writo-audio-container { display: flex; flex-direction: column; gap: 8px; margin-top: 5px; }
            #writo-audio-title { font-weight: bold; margin: 5px 0; padding-bottom: 6px; border-bottom: 1px solid #445; font-size: 14px; color: #6caeff; }
            #writo-audio-list { display: flex; flex-direction: column; gap: 6px; max-height: 200px; min-height: 50px; overflow-y: auto; scrollbar-width: thin; scrollbar-color: #6caeff #2a2a3a; padding-right: 5px; background: #1c1c26; border-radius: 4px; border: 1px solid #333; padding: 8px; }
            .writo-audio-item { display: flex; align-items: center; background: #2e2e3c; border-radius: 4px; padding: 8px 10px; border-left: 3px solid transparent; transition: background-color 0.2s, border-color 0.2s; }
            .writo-audio-item:hover { background-color: #3b3b4f; }
            .writo-audio-item.writo-playing { background: #405075; border-left: 3px solid #81C784; font-weight: bold; color: #fff; }
            .writo-audio-index { background: #6caeff; color: white; width: 22px; height: 22px; border-radius: 50%; display: flex; justify-content: center; align-items: center; margin-right: 10px; font-size: 11px; flex-shrink: 0; }
            .writo-audio-text { flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 12px; }
            .writo-audio-actions { display: flex; gap: 8px; margin-left: 8px; }
            .writo-audio-actions button { background: none; border: none; font-size: 16px; cursor: pointer; padding: 0; color: #a0a8c0; transition: color 0.2s; }
            .writo-audio-actions button:hover { color: #fff; }
            .writo-btn-retry { font-size: 14px !important; } /* Stile per il bottone retry */
            #writo-show-button { position: fixed; bottom: 20px; right: 20px; background: #5c9aff; color: white; border: none; border-radius: 4px; padding: 10px 15px; font-weight: bold; cursor: pointer; z-index: 10000; display: none; box-shadow: 0 2px 8px rgba(0,0,0,0.3); }
            .writo-switch-container { display: flex; align-items: center; justify-content: space-between; padding: 6px 10px; background: #252530; border-radius: 4px; border: 1px solid #445; }
            .writo-switch-label { font-size: 12px; margin-right: 10px; color: #b0b8d0; }
            .writo-switch { position: relative; display: inline-block; width: 38px; height: 20px; } .writo-switch input { opacity: 0; width: 0; height: 0; }
            .writo-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #454a59; transition: .3s; border-radius: 20px; }
            .writo-slider:before { position: absolute; content: ""; height: 14px; width: 14px; left: 3px; bottom: 3px; background-color: white; transition: .3s; border-radius: 50%; }
            input:checked + .writo-slider { background-color: #4CAF50; } input:checked + .writo-slider:before { transform: translateX(18px); }
            .writo-chunk-size-display { font-size: 11px; color: #999; margin-top: 3px; text-align: right; padding-right: 5px; }
        `;
        document.head.appendChild(style);
        panel = document.createElement('div');
        panel.id = 'writo-panel';
        panel.innerHTML = `
            <div id="writo-header"><h2 id="writo-title">Writo-TTS Reader</h2><button id="writo-close" title="Hide Panel">×</button></div>
            <div id="writo-content">
                <textarea id="writo-input" placeholder="Paste your long text here..."></textarea>
                <div class="writo-switch-container">
                    <span class="writo-switch-label">Test Mode:</span>
                    <label class="writo-switch"><input type="checkbox" id="writo-test-mode"><span class="writo-slider"></span></label>
                </div>
                <div class="writo-chunk-size-display">Chunk Size: <span id="writo-chunk-size">${config.useTestMode ? config.testChunkSize : (config.initialChunkSizes[0] || config.chunkSize)}</span> chars (initially)</div>
                <div class="writo-button-group">
                    <button id="writo-analyze" class="writo-button primary" title="Split text into manageable chunks">Analyze Text</button>
                    <button id="writo-generate" class="writo-button success" title="Generate audio for all analyzed chunks" disabled>Generate All</button>
                </div>
                 <div class="writo-button-group">
                    <button id="writo-stop" class="writo-button danger" title="Stop current audio generation process" disabled>Stop Gen</button>
                    <button id="writo-reset" class="writo-button warning" title="Reset script state and clear audio queue">Reset All</button>
                </div>
                <div id="writo-progress-container"><div id="writo-progress-bar">0%</div></div>
                <div id="writo-status">Script loaded. Waiting for input.</div>
                <div class="writo-button-group">
                    <button id="writo-play" class="writo-button success" title="Play all generated audio sequentially" disabled>Play All</button>
                    <button id="writo-pause" class="writo-button" title="Pause current playback" disabled>Pause</button>
                    <button id="writo-resume" class="writo-button" title="Resume paused playback" disabled>Resume</button>
                    <button id="writo-download" class="writo-button primary" title="Download all generated audio files" disabled>Download All</button>
                </div>
                <div id="writo-audio-container">
                    <h3 id="writo-audio-title">Generated Audio (0 successful / 0 attempted)</h3>
                    <div id="writo-audio-list"></div>
                </div>
            </div>
        `;
        document.body.appendChild(panel);

        let offsetX, offsetY, isDragging = false;
        const header = document.getElementById('writo-header');
        header.addEventListener('mousedown', (e) => { /* ... (invariato) ... */
            if (e.target.id === 'writo-close' || e.target.tagName === 'BUTTON') return;
            isDragging = true;
            offsetX = e.clientX - panel.offsetLeft;
            offsetY = e.clientY - panel.offsetTop;
            panel.style.cursor = 'grabbing';
            e.preventDefault();
        });
        document.addEventListener('mousemove', (e) => { /* ... (invariato) ... */
             if (!isDragging) return;
            panel.style.left = `${e.clientX - offsetX}px`;
            panel.style.top = `${e.clientY - offsetY}px`;
        });
        document.addEventListener('mouseup', () => { /* ... (invariato) ... */
            if(isDragging) {
                isDragging = false;
                panel.style.cursor = 'default';
            }
        });

        const showButton = document.createElement('button');
        showButton.id = 'writo-show-button';
        showButton.textContent = 'TTS Reader';
        document.body.appendChild(showButton);

        statusArea = document.getElementById('writo-status');
        progressBar = document.getElementById('writo-progress-bar');

        document.getElementById('writo-close').addEventListener('click', () => { panel.style.display = 'none'; showButton.style.display = 'block'; });
        showButton.addEventListener('click', () => { panel.style.display = 'flex'; showButton.style.display = 'none'; });

        document.getElementById('writo-analyze').addEventListener('click', () => { /* ... (invariato dalla v0.5) ... */
            const text = document.getElementById('writo-input').value.trim();
            if (!text) { logMessage("Input text is empty.", "warning"); return; }
            if (isProcessing) { logMessage("Cannot analyze while processing. Stop first.", "warning"); return; }
            if (currentAudioPlayer) { currentAudioPlayer.pause(); currentAudioPlayer = null; isAudioPaused = false; }
            lastInputText = text;
            textChunks = splitTextIntoChunks(text);
            logMessage(`Text analyzed: ${textChunks.length} chunks created. Ready to generate.`, "success");
            audioQueue = []; currentAudioIndex = 0; finishedProcessingChunks = 0;
            updateAudioList();
            updateProgress(0, textChunks.length > 0 ? textChunks.length : 1);
            updateControls();
            document.getElementById('writo-generate').disabled = textChunks.length === 0;
        });
        document.getElementById('writo-generate').addEventListener('click', processAllChunks);
        document.getElementById('writo-stop').addEventListener('click', stopProcessing);
        document.getElementById('writo-reset').addEventListener('click', resetApp);
        document.getElementById('writo-play').addEventListener('click', () => { /* ... (invariato dalla v0.5) ... */
            if (audioQueue.some(item => item && item.url)) {
                currentAudioIndex = audioQueue.findIndex(a => a && a.url); // Inizia dal primo audio valido
                if (currentAudioIndex === -1) { // Nessun audio valido
                    logMessage("No valid audio in the queue to play.", "warning");
                    return;
                }
                isAudioPaused = false;
                playNextAudio();
            } else {
                logMessage("No audio in the queue to play.", "warning");
            }
        });
        document.getElementById('writo-pause').addEventListener('click', pausePlayback);
        document.getElementById('writo-resume').addEventListener('click', resumePlayback);
        document.getElementById('writo-download').addEventListener('click', downloadAllAudio);

        const testModeCheckbox = document.getElementById('writo-test-mode');
        const chunkSizeDisplay = document.getElementById('writo-chunk-size');
        testModeCheckbox.addEventListener('change', () => { /* ... (invariato dalla v0.5) ... */
             if (isProcessing) {
                logMessage("Cannot change test mode while processing. Stop first.", "warning");
                testModeCheckbox.checked = config.useTestMode;
                return;
            }
            config.useTestMode = testModeCheckbox.checked;
            const displayChunkSize = config.useTestMode ? config.testChunkSize : (config.initialChunkSizes[0] || config.chunkSize);
            chunkSizeDisplay.textContent = `${displayChunkSize} chars (initially if not test mode)`;
            logMessage(`Test mode ${config.useTestMode ? 'enabled' : 'disabled'}. Chunk size: ${displayChunkSize} chars. Re-analyze if text is present.`, "info");
            const currentInputText = document.getElementById('writo-input').value.trim();
            if (currentInputText === lastInputText && currentInputText !== "") {
                textChunks = splitTextIntoChunks(currentInputText);
                 logMessage(`Text re-analyzed due to mode change: ${textChunks.length} chunks.`, "info");
                 if (currentAudioPlayer) currentAudioPlayer.pause();
                 currentAudioPlayer = null; isAudioPaused = false; audioQueue = []; currentAudioIndex = 0; finishedProcessingChunks = 0;
                 updateAudioList();
                 updateProgress(0, textChunks.length > 0 ? textChunks.length : 1);
                 document.getElementById('writo-generate').disabled = textChunks.length === 0;
            } else if (currentInputText !== "") {
                logMessage("Test mode changed. Text differs or not analyzed. Please 'Analyze Text'.", "info");
                textChunks = [];
                document.getElementById('writo-generate').disabled = true;
            }
            updateControls();
        });

        setupInputMonitoring();
        updateControls();
        logMessage("Writo-TTS Reader UI created. Version " + (typeof GM_info !== 'undefined' ? GM_info.script.version : 'N/A'), "success");
    }
    //#endregion

    function initialize() {
        if (typeof GM_info === 'undefined' || !GM_info.script) {
            window.GM_info = { script: { version: '0.6' } };
        }
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            setTimeout(createUI, 1500);
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(createUI, 1500);
            });
        }
    }
    initialize();
})();