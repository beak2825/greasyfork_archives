// ==UserScript==
// @name         Claude Auto-TTS (Enhanced Fusion)
// @namespace    http://tampermonkey.net/
// @version      3.0.1
// @description  Combina sintesi vocale automatica stabile con controlli manuali per messaggio, selezione vocale e impostazioni avanzate per Claude.ai.
// @author       Flejta & AI Assistant
// @match        https://claude.ai/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536060/Claude%20Auto-TTS%20%28Enhanced%20Fusion%29.user.js
// @updateURL https://update.greasyfork.org/scripts/536060/Claude%20Auto-TTS%20%28Enhanced%20Fusion%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("Claude Auto-TTS (Enhanced Fusion) v3.0.1 initialized");

    //#region Configuration
    const config = {
        defaultVoiceNameSubstrings: ['isabella', 'google', 'italiano'],
        rate: 1.0,
        pitch: 1.0,
        volume: 1.0,
        iconSize: '24px',
        iconButtonPadding: '4px',
        iconButtonBorderRadius: '6px',
        ttsButtonIconColor: 'currentColor',
        preferredChunkLength: 200,
        criticalChunkLength: 300,
        pauseBetweenChunks: 200,
        minPauseBetweenMessages: 500
    };
    //#endregion

    //#region Global Variables
    let autoTTSState = false;
    let autoTTSButton = null;
    let selectedVoice = null;
    let availableVoices = [];
    let areVoicesLoaded = false;
    let isApiPrimedByUserAction = false;
    let lastTTSTime = 0;
    let isCurrentlySpeaking = false;
    let isPausedManually = false;

    let voiceSelectorDropdown = null;
    let activeManualPlayButton = null;

    const AUTO_TTS_BUTTON_ID = 'stable-light-auto-tts-button-v223';
    //#endregion

    //#region Voice Management
    function loadVoices() {
        availableVoices = speechSynthesis.getVoices();
        if (availableVoices.length === 0) {
            areVoicesLoaded = false;
            console.warn('AutoTTS_Voice: No voices loaded yet. Waiting for onvoiceschanged.');
            return;
        }
        areVoicesLoaded = true;
        console.log('AutoTTS_Voice: Voices loaded. Count:', availableVoices.length);

        const italianVoices = availableVoices.filter(v => v.lang.toLowerCase().startsWith('it'));
        let foundVoice = null;
        for (const sub of config.defaultVoiceNameSubstrings) {
            foundVoice = italianVoices.find(v => v.name.toLowerCase().includes(sub.toLowerCase()));
            if (foundVoice) break;
        }
        selectedVoice = foundVoice || italianVoices[0] || availableVoices.find(v => v.default && v.lang.toLowerCase().startsWith('it')) || availableVoices.find(v => v.default) || availableVoices[0];

        if (!selectedVoice) console.error("AutoTTS_Voice: CRITICAL - Could not select any voice.");
        else console.log('AutoTTS_Voice: Default selected voice:', selectedVoice.name, `(${selectedVoice.lang})`);

        updateVoiceSelectorDropdown();
        return !!selectedVoice;
    }

    function updateVoiceSelectorDropdown() {
        if (!voiceSelectorDropdown) return;
        voiceSelectorDropdown.innerHTML = '';
        if (availableVoices.length === 0) {
            const noVoiceOption = document.createElement('option');
            noVoiceOption.textContent = 'Nessuna voce disponibile';
            noVoiceOption.disabled = true;
            voiceSelectorDropdown.appendChild(noVoiceOption);
            return;
        }
        const groupVoicesByLanguage = (voices) => voices.reduce((acc, voice) => {
            const lang = voice.lang.split('-')[0];
            if (!acc[lang]) acc[lang] = [];
            acc[lang].push(voice);
            return acc;
        }, {});
        const groupedVoices = groupVoicesByLanguage(availableVoices);
        if (groupedVoices['it']) {
            const italianGroup = document.createElement('optgroup');
            italianGroup.label = 'Italiano';
            groupedVoices['it'].forEach(voice => {
                const option = document.createElement('option');
                option.value = voice.name;
                option.textContent = `${voice.name.replace(/Microsoft |Google /gi, '')} (${voice.lang})`;
                if (selectedVoice && voice.name === selectedVoice.name) option.selected = true;
                italianGroup.appendChild(option);
            });
            voiceSelectorDropdown.appendChild(italianGroup);
        }
        Object.keys(groupedVoices).sort().forEach(langCode => {
            if (langCode === 'it') return;
            const langVoices = groupedVoices[langCode];
            const langGroup = document.createElement('optgroup');
            try { langGroup.label = new Intl.DisplayNames(['it'], { type: 'language' }).of(langCode) || langCode.toUpperCase(); }
            catch (e) { langGroup.label = langCode.toUpperCase(); }
            langVoices.slice(0, 15).forEach(voice => {
                const option = document.createElement('option');
                option.value = voice.name;
                option.textContent = `${voice.name.replace(/Microsoft |Google /gi, '')} (${voice.lang})`;
                if (selectedVoice && voice.name === selectedVoice.name) option.selected = true;
                langGroup.appendChild(option);
            });
            voiceSelectorDropdown.appendChild(langGroup);
        });
    }
    //#endregion

    //#region Speech API Priming and Text Cleaning
    function primeSpeechAPIOnUserAction() {
        if (isApiPrimedByUserAction || speechSynthesis.speaking || speechSynthesis.pending) return;
        if (!areVoicesLoaded) { if (!loadVoices()) { console.warn("AutoTTS_Prime: Cannot prime API, voices not loaded."); return; } }
        if (!selectedVoice) { console.warn("AutoTTS_Prime: Cannot prime API, no voice selected."); return; }
        console.log("AutoTTS_Prime: Priming Speech API due to user action...");
        const primer = new SpeechSynthesisUtterance(" ");
        primer.voice = selectedVoice; primer.lang = selectedVoice.lang; primer.volume = 0.01;
        primer.onend = () => { isApiPrimedByUserAction = true; console.log("AutoTTS_Prime: Speech API primed."); };
        primer.onerror = (e) => { console.error("AutoTTS_Prime: Error priming API:", e.error); isApiPrimedByUserAction = false; };
        speechSynthesis.speak(primer);
    }

    function cleanTextForTTS(text) {
        let cleaned = text.replace(/<[^>]*>/g, ' ').replace(/```[\s\S]*?```/g, ' Blocco di codice. ').replace(/`([^`]+)`/g, '$1').replace(/(\*\*|__)(.*?)\1/g, '$2').replace(/(\*|_)(.*?)\1/g, '$2').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/#{1,6}\s+/g, '').replace(/‑/g, '-').replace(/—/g, '. ').replace(/\s*<br\s*\/?>\s*/gi, '\n').replace(/ /g, ' ');
        cleaned = cleaned.replace(/\n\s*\n/g, '\n').replace(/ (?=\n)/g, '').replace(/ +/g, ' ');
        return cleaned.trim();
    }
    //#endregion

    //#region Smart Chunking and Speech Synthesis Core
    function smartCreateChunks(text, preferredMaxLength = config.preferredChunkLength, criticalMaxLength = config.criticalChunkLength) {
        const chunks = []; let remainingText = text; const sentenceEndRegex = /([.!?])(\s+|\n|$)/g;
        while (remainingText.length > 0) {
            if (remainingText.length <= preferredMaxLength) { chunks.push(remainingText.trim()); break; }
            let bestCutPoint = -1; let tempSegment = remainingText.substring(0, preferredMaxLength);
            let match = Array.from(tempSegment.matchAll(sentenceEndRegex)).pop();
            if (match) bestCutPoint = match.index + match[1].length + (match[2] ? match[2].length : 0);
            if (bestCutPoint < preferredMaxLength / 3) { let newlineIndex = tempSegment.lastIndexOf('\n'); if (newlineIndex > preferredMaxLength / 4) bestCutPoint = newlineIndex + 1; }
            if (bestCutPoint < preferredMaxLength / 2) { const weakPunctuationRegex = /([,;:·])(\s+|$)/g; match = Array.from(tempSegment.matchAll(weakPunctuationRegex)).pop(); if (match && (match.index + match[1].length > preferredMaxLength / 3)) bestCutPoint = match.index + match[1].length + (match[2] ? match[2].length : 0); }
            if (bestCutPoint < preferredMaxLength / 2) { let spaceIndex = tempSegment.lastIndexOf(' '); if (spaceIndex > preferredMaxLength / 3) bestCutPoint = spaceIndex + 1; }
            if (bestCutPoint <= 0 || bestCutPoint > preferredMaxLength) { if (remainingText.length > criticalMaxLength) { bestCutPoint = preferredMaxLength; let spaceIndexAtMax = remainingText.substring(0, bestCutPoint).lastIndexOf(' '); if (spaceIndexAtMax > bestCutPoint / 2) bestCutPoint = spaceIndexAtMax + 1; } else { bestCutPoint = remainingText.length; } }
            if (bestCutPoint === 0 && remainingText.length > 0) bestCutPoint = Math.min(remainingText.length, preferredMaxLength);
            let currentChunk = remainingText.substring(0, bestCutPoint).trim(); if (currentChunk) chunks.push(currentChunk);
            remainingText = remainingText.substring(bestCutPoint).trim();
        }
        return chunks.filter(chunk => chunk.length > 0);
    }

    async function speakTextChunks(fullText, triggeringButton = null, isAutoPlay = false) {
        console.log(`AutoTTS_Speak: Called. isAutoPlay: ${isAutoPlay}, autoTTSState: ${autoTTSState}, isCurrentlySpeaking (at start): ${isCurrentlySpeaking}, triggeringButton: ${triggeringButton ? 'yes' : 'no'}`);

        if (!fullText || !selectedVoice) {
            console.warn("AutoTTS_Speak: Prerequisites not met (no text or no voice). Bailing out.");
            // No need to set isCurrentlySpeaking to false here as it's done at the start or if it was already false.
            if (triggeringButton && document.body.contains(triggeringButton)) triggeringButton.innerHTML = getPlayIconSVG();
            if (activeManualPlayButton === triggeringButton) activeManualPlayButton = null;
            return;
        }

        if (isAutoPlay && !autoTTSState) {
            console.log("AutoTTS_Speak: Auto play request, but autoTTSState is now false. Cancelling (early check).");
            return;
        }

        speechSynthesis.cancel(); // Cancel any ongoing/pending speech first.
        // isCurrentlySpeaking will be set to true inside the try block if we proceed.
        // isPausedManually is reset before speech attempt.
        isPausedManually = false;

        if (triggeringButton && activeManualPlayButton && activeManualPlayButton !== triggeringButton) {
            if (document.body.contains(activeManualPlayButton)) activeManualPlayButton.innerHTML = getPlayIconSVG();
        }
        if (triggeringButton) activeManualPlayButton = triggeringButton;

        const textToChunk = cleanTextForTTS(fullText);
        if (!textToChunk) {
            console.warn("AutoTTS_Speak: Text became empty after cleaning.");
            if (triggeringButton && document.body.contains(triggeringButton)) triggeringButton.innerHTML = getPlayIconSVG();
            if (activeManualPlayButton === triggeringButton) activeManualPlayButton = null;
            return;
        }

        const chunks = smartCreateChunks(textToChunk);
        if (chunks.length === 0) {
            console.warn("AutoTTS_Speak: No chunks created from text.");
            if (triggeringButton && document.body.contains(triggeringButton)) triggeringButton.innerHTML = getPlayIconSVG();
            if (activeManualPlayButton === triggeringButton) activeManualPlayButton = null;
            return;
        }

        console.log(`AutoTTS_Speak: Text to speak (cleaned, ${chunks.length} chunks): "${textToChunk.substring(0, 70)}..."`);

        try {
            isCurrentlySpeaking = true; // Set flag now that we are committed to speaking.
            console.log(`AutoTTS_Speak: (Inside Try) isCurrentlySpeaking set to true. isAutoPlay: ${isAutoPlay}`);
            if (triggeringButton && document.body.contains(triggeringButton)) {
                triggeringButton.innerHTML = getPauseIconSVG();
            }

            if (isAutoPlay) {
                const now = Date.now();
                const timeSinceLastTTS = now - lastTTSTime;
                if (lastTTSTime > 0 && timeSinceLastTTS < config.minPauseBetweenMessages) {
                    const waitTime = config.minPauseBetweenMessages - timeSinceLastTTS;
                    console.log(`AutoTTS_Speak: AutoPlay cooldown, waiting ${waitTime}ms.`);
                    await new Promise(resolve => setTimeout(resolve, waitTime));
                }
                lastTTSTime = Date.now();
            }

            for (let i = 0; i < chunks.length; i++) {
                if (isAutoPlay && !autoTTSState) {
                    console.log("AutoTTS_Speak: Auto speech interrupted during loop (autoTTSState is false).");
                    speechSynthesis.cancel(); break;
                }
                if (!isCurrentlySpeaking && !isPausedManually) {
                     console.log("AutoTTS_Speak: Speech interrupted during loop (isCurrentlySpeaking is false, not paused).");
                     break;
                }
                while (isPausedManually && isCurrentlySpeaking) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                    if (!isCurrentlySpeaking) {console.log("AutoTTS_Speak: Stopped while paused."); break;}
                }
                if (!isCurrentlySpeaking) break;

                const utterance = new SpeechSynthesisUtterance(chunks[i]);
                utterance.voice = selectedVoice; utterance.lang = selectedVoice.lang;
                utterance.rate = config.rate; utterance.pitch = config.pitch; utterance.volume = config.volume;

                // console.log(`AutoTTS_Speak: Speaking chunk ${i+1}/${chunks.length}`);
                await new Promise((resolve) => {
                    utterance.onstart = () => { if (i === 0) console.log("AutoTTS_Speak: First chunk speech started."); };
                    utterance.onend = () => resolve();
                    utterance.onerror = (e) => { console.error("AutoTTS_Speak: Utterance error on chunk", i + 1, ":", e.error); resolve(); };
                    speechSynthesis.speak(utterance);
                });
                if (i < chunks.length - 1 && isCurrentlySpeaking && !isPausedManually) {
                     await new Promise(resolve => setTimeout(resolve, config.pauseBetweenChunks));
                }
            }
        } catch (error) {
            console.error("AutoTTS_Speak: Error in speakTextChunks main try block:", error);
        } finally {
            console.log(`AutoTTS_Speak: (Finally block) isCurrentlySpeaking (before reset): ${isCurrentlySpeaking}, isAutoPlay: ${isAutoPlay}`);
            isCurrentlySpeaking = false;
            isPausedManually = false;
            if (triggeringButton && document.body.contains(triggeringButton)) {
                triggeringButton.innerHTML = getPlayIconSVG();
            }
            if (activeManualPlayButton === triggeringButton) {
                activeManualPlayButton = null;
            }
            console.log(`AutoTTS_Speak: (Finally block) isCurrentlySpeaking (after reset): ${isCurrentlySpeaking}`);
        }
    }

    function stopAllSpeech(resetGlobalActiveButton = true) {
        console.log(`AutoTTS_StopAll: Called. isCurrentlySpeaking (before): ${isCurrentlySpeaking}, resetGlobalActiveButton: ${resetGlobalActiveButton}`);
        speechSynthesis.cancel();
        isCurrentlySpeaking = false;
        isPausedManually = false;
        if (resetGlobalActiveButton && activeManualPlayButton) {
            if (document.body.contains(activeManualPlayButton)) {
                activeManualPlayButton.innerHTML = getPlayIconSVG();
            }
            activeManualPlayButton = null;
        }
        console.log(`AutoTTS_StopAll: All speech stopped. isCurrentlySpeaking (after): ${isCurrentlySpeaking}`);
    }
    //#endregion

    //#region UI Creation - Auto-TTS Button & General
    function updateAutoTTSButtonDisplay() {
        if (autoTTSButton && document.body.contains(autoTTSButton)) {
            autoTTSButton.textContent = autoTTSState ? 'Sintesi Auto: ON' : 'Sintesi Auto: OFF';
            autoTTSButton.style.backgroundColor = autoTTSState ? '#4CAF50' : '#e0e0e0';
            autoTTSButton.style.color = autoTTSState ? 'white' : 'black';
            autoTTSButton.setAttribute('aria-pressed', autoTTSState.toString());
        } else autoTTSButton = null;
    }

    function findInputToolbar() {
        const selectors = [ 'button[aria-label="Invia messaggio"]', 'button[aria-label="Send message"]', 'button[data-testid="model-selector-dropdown"]', 'div[contenteditable="true"]' ];
        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element) {
                let toolbar = element.closest('.flex.items-center.w-full.gap-2'); if (toolbar && toolbar.querySelector('button[aria-label="Invia messaggio"], button[aria-label="Send message"]')) return toolbar;
                toolbar = element.closest('.flex.items-center.w-full'); if (toolbar && toolbar.querySelector('button[aria-label="Invia messaggio"], button[aria-label="Send message"]')) return toolbar;
                toolbar = element.closest('div.flex.flex-col > div.flex.items-center'); if (toolbar && toolbar.querySelector('button[aria-label="Invia messaggio"], button[aria-label="Send message"]')) return toolbar;
                toolbar = element.closest('fieldset > div.flex.flex-col > div.flex.items-center.w-full'); if (toolbar && toolbar.querySelector('button[aria-label="Invia messaggio"], button[aria-label="Send message"]')) return toolbar;
                const sendBtn = document.querySelector('button[aria-label="Invia messaggio"], button[aria-label="Send message"]'); if (sendBtn && sendBtn.parentElement && sendBtn.parentElement.classList.contains('flex')) return sendBtn.parentElement;
            }
        }
        console.warn("AutoTTS_UI: Could not reliably find input toolbar.");
        return document.querySelector('form .flex.items-end .flex.items-center') || document.querySelector('div[contenteditable="true"]')?.parentElement?.parentElement;
    }

    function ensureAutoTTSButtonExists() {
        const inputToolbar = findInputToolbar();
        if (!inputToolbar) { if (autoTTSButton && autoTTSButton.parentElement) { autoTTSButton.remove(); autoTTSButton = null; } return; }
        let buttonExisted = false;
        if (autoTTSButton && inputToolbar.contains(autoTTSButton)) buttonExisted = true;
        else { const existingButtonById = inputToolbar.querySelector(`#${AUTO_TTS_BUTTON_ID}`); if (existingButtonById) { autoTTSButton = existingButtonById; buttonExisted = true; } }
        if (!buttonExisted) {
            autoTTSButton = document.createElement('button'); autoTTSButton.id = AUTO_TTS_BUTTON_ID;
            autoTTSButton.style.cssText = 'margin-left: 8px; padding: 5px 10px; border: 1px solid #888; border-radius: 6px; cursor: pointer; font-size: 12px; background-color: #f0f0f0; color: black; height: 32px; display:inline-flex; align-items:center; white-space: nowrap;';
            const sendButton = inputToolbar.querySelector('button[aria-label="Invia messaggio"], button[aria-label="Send message"]');
            const modelSelectorButton = inputToolbar.querySelector('button[data-testid="model-selector-dropdown"]');
            let referenceNodeForInsert = sendButton || modelSelectorButton || inputToolbar.firstChild;
            if (referenceNodeForInsert && referenceNodeForInsert.parentNode === inputToolbar) inputToolbar.insertBefore(autoTTSButton, referenceNodeForInsert);
            else inputToolbar.appendChild(autoTTSButton);
            console.log("AutoTTS_UI: Auto-TTS button created and added.");
        }
        if (autoTTSButton && !autoTTSButton.dataset.listenerAttached) {
            autoTTSButton.addEventListener('click', (event) => {
                event.stopPropagation(); autoTTSState = !autoTTSState;
                localStorage.setItem('claudeAutoTTSState', autoTTSState.toString());
                updateAutoTTSButtonDisplay();
                console.log(`AutoTTS_Button: Clicked. New autoTTSState: ${autoTTSState}, isCurrentlySpeaking: ${isCurrentlySpeaking}`);
                if (autoTTSState && !isApiPrimedByUserAction) primeSpeechAPIOnUserAction();
                if (!autoTTSState) {
                    console.log("AutoTTS_Button: AutoTTS turned OFF. Calling stopAllSpeech.");
                    stopAllSpeech(true);
                }
            });
            autoTTSButton.dataset.listenerAttached = 'true';
        }
        updateAutoTTSButtonDisplay();
    }
    //#endregion

    //#region UI Creation - Per-Message Controls & Settings Popup
    function getPlayIconSVG() { return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="${config.ttsButtonIconColor}" viewBox="0 0 256 256"><path d="M240,128a15.79,15.79,0,0,1-10.54,15.08l-160,80A16,16,0,0,1,48,208V48a16,16,0,0,1,21.46-15.08l160,80A15.79,15.79,0,0,1,240,128Z"></path></svg>`; }
    function getPauseIconSVG() { return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="${config.ttsButtonIconColor}" viewBox="0 0 256 256"><path d="M208,48v160a16,16,0,0,1-32,0V48a16,16,0,0,1,32,0ZM80,48v160a16,16,0,0,1-32,0V48a16,16,0,0,1,32,0Z"></path></svg>`; }
    function getSettingsIconSVG() { return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="${config.ttsButtonIconColor}" viewBox="0 0 256 256"><path d="M216.68,116.61l-27.23-13.61a11.33,11.33,0,0,0-4-.89,88.31,88.31,0,0,0-11.16-27.37l4.69-29.21a11.28,11.28,0,0,0-5.51-12.36L149.21,18.9A11.21,11.21,0,0,0,137,22.59l-14.1,26.23a88.25,88.25,0,0,0-29.74,0L79,22.59a11.21,11.21,0,0,0-12.23-3.69L42.49,33.17a11.28,11.28,0,0,0-5.51,12.36l4.69,29.21A88.31,88.31,0,0,0,30.51,102.11a11.33,11.33,0,0,0-4,.89L9.32,116.61A11.24,11.24,0,0,0,0,127.13a11.34,11.34,0,0,0,9.32,10.52l27.23,13.61a11.33,11.33,0,0,0,4,.89,88.31,88.31,0,0,0,11.16,27.37l-4.69,29.21a11.28,11.28,0,0,0,5.51,12.36l24.27,14.27a11.21,11.21,0,0,0,12.23-3.69l14.1-26.23a88.25,88.25,0,0,0,29.74,0l14.1,26.23a11.21,11.21,0,0,0,12.23,3.69l24.27-14.27a11.28,11.28,0,0,0,5.51-12.36l-4.69-29.21a88.31,88.31,0,0,0,11.16-27.37a11.33,11.33,0,0,0,4-.89l27.23-13.61A11.34,11.34,0,0,0,256,127.13,11.24,11.24,0,0,0,216.68,116.61ZM128,168a40,40,0,1,1,40-40A40,40,0,0,1,128,168Z"></path></svg>`; }

    function createPerMessageTTSIcons(aiMessageContainer, textContentElement) {
        let claudeActionBar = aiMessageContainer.querySelector('.absolute.bottom-0.right-2 > div > div.text-text-300');
        if (!claudeActionBar) { claudeActionBar = aiMessageContainer.querySelector('.absolute.bottom-0.right-2 > div'); if (!claudeActionBar) { console.warn("AutoTTS_UI: Claude's action bar not found. Creating new."); const newBarContainer = document.createElement('div'); newBarContainer.style.cssText = `position: absolute; bottom: 8px; right: 8px; display: flex;`; aiMessageContainer.appendChild(newBarContainer); claudeActionBar = document.createElement('div'); claudeActionBar.style.cssText = `display: flex; align-items: center; gap: 4px;`; newBarContainer.appendChild(claudeActionBar); aiMessageContainer.style.position = 'relative'; } }
        const ttsIconContainer = document.createElement('div'); ttsIconContainer.className = 'claude-tts-icon-container'; ttsIconContainer.style.cssText = `display: flex; align-items: center; gap: 4px; margin-left: 6px;`;
        const createIconButton = (innerHTML, title, onClick) => { const button = document.createElement('button'); button.innerHTML = innerHTML; button.title = title; button.style.cssText = `width: ${config.iconSize}; height: ${config.iconSize}; padding: ${config.iconButtonPadding}; background: transparent; border: 1px solid transparent; border-radius: ${config.iconButtonBorderRadius}; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--text-text-300, #555); transition: all 0.2s ease;`; button.addEventListener('mouseenter', () => { button.style.backgroundColor = 'var(--bg-bg-300, #e0e0e0)'; button.style.borderColor = 'var(--border-border-300, #ccc)'; }); button.addEventListener('mouseleave', () => { button.style.backgroundColor = 'transparent'; button.style.borderColor = 'transparent'; }); button.addEventListener('click', onClick); return button; };
        const playButton = createIconButton(getPlayIconSVG(), 'Leggi / Pausa Messaggio', (e) => {
            e.stopPropagation(); const text = textContentElement.textContent || textContentElement.innerText;
            console.log(`AutoTTS_UI_PlayButton: Clicked. isCurrentlySpeaking: ${isCurrentlySpeaking}, isPausedManually: ${isPausedManually}, activeManualPlayButton === this: ${activeManualPlayButton === playButton}`);
            if (isCurrentlySpeaking) {
                if (activeManualPlayButton === playButton) { // This button's message is active
                    if (isPausedManually) { speechSynthesis.resume(); isPausedManually = false; playButton.innerHTML = getPauseIconSVG(); console.log("AutoTTS_UI_PlayButton: Manual resume."); }
                    else { speechSynthesis.pause(); isPausedManually = true; playButton.innerHTML = getPlayIconSVG(); console.log("AutoTTS_UI_PlayButton: Manual pause."); }
                } else { // Another speech is active, stop it and start this one
                    console.log("AutoTTS_UI_PlayButton: Different speech active. Stopping old, starting new.");
                    stopAllSpeech(true); // Stop current speech, reset its button
                    speakTextChunks(text, playButton, false);
                }
            } else speakTextChunks(text, playButton, false); // No speech active, start this one
        });
        const settingsButton = createIconButton(getSettingsIconSVG(), 'Impostazioni Voce', (e) => { e.stopPropagation(); showVoiceSettingsPopup(e); });
        ttsIconContainer.appendChild(playButton); ttsIconContainer.appendChild(settingsButton);
        if (claudeActionBar.firstChild && claudeActionBar.children.length > 0) { const separator = document.createElement('div'); separator.style.cssText = `width: 1px; height: 16px; background-color: var(--border-border-300, #ccc); margin: 0 4px;`; claudeActionBar.appendChild(separator); }
        claudeActionBar.appendChild(ttsIconContainer); return ttsIconContainer;
    }

    function showVoiceSettingsPopup(event) {
        const existingPopup = document.querySelector('.claude-tts-settings-popup'); if (existingPopup) { existingPopup.remove(); return; }
        const popup = document.createElement('div'); popup.className = 'claude-tts-settings-popup'; const rect = event.target.closest('button').getBoundingClientRect();
        popup.style.cssText = `position: fixed; top: ${rect.bottom + 5}px; left: ${Math.max(0, rect.left - 150 + (rect.width / 2))}px; width: 300px; max-height: 400px; background: var(--bg-bg-000, white); border: 1px solid var(--border-border-300, #ccc); border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); z-index: 10001; overflow: hidden; display: flex; flex-direction: column;`;
        const header = document.createElement('div'); header.textContent = 'Impostazioni Voce'; header.style.cssText = `padding: 12px; background: var(--bg-bg-100, #f5f5f5); color: var(--text-text-100, #333); font-weight: bold; border-bottom: 1px solid var(--border-border-200, #eee); text-align: center;`;
        const contentWrapper = document.createElement('div'); contentWrapper.style.cssText = `overflow-y: auto; padding: 12px; flex-grow: 1; display: flex; flex-direction: column; gap: 12px;`;
        voiceSelectorDropdown = document.createElement('select'); voiceSelectorDropdown.style.cssText = `width: 100%; padding: 8px; font-size: 14px; border: 1px solid var(--border-border-300, #ddd); border-radius: 4px; background-color: var(--bg-bg-200, #fff); color: var(--text-text-100, #333);`;
        updateVoiceSelectorDropdown();
        voiceSelectorDropdown.addEventListener('change', (e) => { const newVoice = availableVoices.find(voice => voice.name === e.target.value); if (newVoice) { selectedVoice = newVoice; console.log('AutoTTS_UI_Settings: Voice changed to:', selectedVoice.name); } });
        const createSliderControl = (labelText, min, max, step, currentValueKey, onChangeCallback) => { const container = document.createElement('div'); container.style.cssText = 'display: flex; align-items: center; justify-content: space-between;'; const label = document.createElement('label'); label.textContent = labelText; label.style.cssText = 'font-size: 13px; color: var(--text-text-200, #555); flex-shrink: 0; margin-right: 8px;'; const slider = document.createElement('input'); slider.type = 'range'; slider.min = min; slider.max = max; slider.step = step; slider.value = config[currentValueKey]; slider.style.cssText = 'flex-grow: 1; margin: 0 8px; accent-color: var(--accent-main-000, #007bff);'; const valueDisplay = document.createElement('span'); valueDisplay.textContent = config[currentValueKey].toFixed(1); valueDisplay.style.cssText = 'font-size: 13px; color: var(--text-text-100, #333); min-width: 30px; text-align: right;'; slider.addEventListener('input', (e) => { const newValue = parseFloat(e.target.value); config[currentValueKey] = newValue; valueDisplay.textContent = newValue.toFixed(1); if (onChangeCallback) onChangeCallback(newValue); }); container.appendChild(label); container.appendChild(slider); container.appendChild(valueDisplay); return container; };
        contentWrapper.appendChild(voiceSelectorDropdown);
        contentWrapper.appendChild(createSliderControl('Velocità:', 0.5, 2, 0.1, 'rate'));
        contentWrapper.appendChild(createSliderControl('Tono:', 0.5, 2, 0.1, 'pitch'));
        contentWrapper.appendChild(createSliderControl('Volume:', 0, 1, 0.1, 'volume'));
        popup.appendChild(header); popup.appendChild(contentWrapper); document.body.appendChild(popup);
        setTimeout(() => { document.addEventListener('click', function closePopupOnClickOutside(e) { if (!popup.contains(e.target) && !e.target.closest('.claude-tts-icon-container button')) { popup.remove(); voiceSelectorDropdown = null; document.removeEventListener('click', closePopupOnClickOutside); } }, { capture: true, once: true }); }, 0);
    }
    //#endregion

    //#region UI Creation - Live TTS Button (Placeholder)
    function addLiveTTSButtonToInputBar() {
        const inputBar = findInputToolbar(); if (!inputBar) { console.warn("AutoTTS_UI: Input bar not found for Live TTS button."); return; }
        if (inputBar.querySelector('.claude-live-tts-button')) return;
        const liveTTSButton = document.createElement('button'); liveTTSButton.className = 'claude-live-tts-button';
        liveTTSButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256"><path d="M128,176a48.05,48.05,0,0,0,48-48V64a48,48,0,0,0-96,0v64A48.05,48.05,0,0,0,128,176ZM96,64a32,32,0,0,1,64,0v64a32,32,0,0,1-64,0Zm40,143.6V224a8,8,0,0,1-16,0v-16.4A72.12,72.12,0,0,1,56,128a8,8,0,0,1,16,0,56,56,0,0,0,112,0,8,8,0,0,1,16,0A72.12,72.12,0,0,1,136,207.6Z"></path></svg>`;
        liveTTSButton.title = "Leggi testo durante la generazione (Prossimamente)";
        const attachButton = inputBar.querySelector('button[aria-label*="Allega"], button[aria-label*="Attach"]');
        if (attachButton) { liveTTSButton.className = attachButton.className + ' claude-live-tts-button'; ['data-state', 'aria-expanded', 'aria-haspopup', 'aria-controls', 'id'].forEach(attr => liveTTSButton.removeAttribute(attr)); }
        else { liveTTSButton.style.cssText = `display: inline-flex; align-items: center; justify-content: center; position: relative; flex-shrink: 0; border: 0.5px solid var(--border-border-300, #ccc); transition: all 0.2s; height: 32px; min-width: 32px; border-radius: 0.5rem; padding: 0 7.5px; color: var(--text-text-300, #555);`; }
        liveTTSButton.style.cursor = 'not-allowed';
        liveTTSButton.addEventListener('click', (e) => { e.stopPropagation(); alert("La funzionalità di lettura live del testo durante la generazione sarà implementata in futuro."); });
        const sendButton = inputBar.querySelector('button[aria-label="Invia messaggio"], button[aria-label="Send message"]');
        if (sendButton) sendButton.parentElement.insertBefore(liveTTSButton, sendButton);
        else if (autoTTSButton && autoTTSButton.nextSibling) autoTTSButton.parentElement.insertBefore(liveTTSButton, autoTTSButton.nextSibling);
        else inputBar.appendChild(liveTTSButton);
    }
    //#endregion

    //#region Initialization and MutationObserver
    function initialize() {
        const savedState = localStorage.getItem('claudeAutoTTSState'); if (savedState !== null) autoTTSState = (savedState === 'true');
        console.log("AutoTTS_Init: Initial autoTTSState loaded:", autoTTSState);
        if (speechSynthesis.onvoiceschanged !== undefined) { speechSynthesis.onvoiceschanged = () => { console.log("AutoTTS_Init: onvoiceschanged event fired."); if (!areVoicesLoaded) loadVoices(); else updateVoiceSelectorDropdown(); }; }
        setTimeout(() => { if (!areVoicesLoaded) loadVoices(); }, 700);
        ensureAutoTTSButtonExists(); addLiveTTSButtonToInputBar();
        setTimeout(() => {
            document.querySelectorAll('div[data-is-streaming="false"]').forEach(container => { const textContentElement = container.querySelector('.font-claude-message'); if (textContentElement && !container.querySelector('.claude-tts-icon-container')) createPerMessageTTSIcons(container, textContentElement); });
            if (!document.getElementById(AUTO_TTS_BUTTON_ID)) ensureAutoTTSButtonExists();
            if (!document.querySelector('.claude-live-tts-button')) addLiveTTSButtonToInputBar();
        }, 2000);
    }

    const observer = new MutationObserver((mutations) => {
        let significantUIChange = false; let newMessagesObserved = false;
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'data-is-streaming') {
                const element = mutation.target;
                if (element.matches('div[data-is-streaming]') && element.getAttribute('data-is-streaming') === 'false') {
                    console.log(`AutoTTS_Observer: data-is-streaming is false. autoTTSState: ${autoTTSState}, isCurrentlySpeaking: ${isCurrentlySpeaking}`);
                    if (autoTTSState && !isCurrentlySpeaking) {
                        const messageElement = element.querySelector('.font-claude-message');
                        const text = messageElement?.textContent?.trim();
                        if (text) {
                            console.log("AutoTTS_Observer: Conditions met for auto-play. Text found. Calling speakTextChunks.");
                            speakTextChunks(text, null, true);
                        } else console.log("AutoTTS_Observer: Conditions met for auto-play, but no text found in .font-claude-message.");
                    } else console.log("AutoTTS_Observer: Conditions NOT met for auto-play (autoTTSState false or isCurrentlySpeaking true).");
                    const textContentElement = element.querySelector('.font-claude-message');
                    if (textContentElement && !element.querySelector('.claude-tts-icon-container')) { createPerMessageTTSIcons(element, textContentElement); newMessagesObserved = true; }
                }
            }
            if (mutation.addedNodes.length > 0) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const aiMessageContainers = node.matches('div[data-is-streaming]') ? [node] : node.querySelectorAll('div[data-is-streaming]');
                        aiMessageContainers.forEach(container => { const textContentElement = container.querySelector('.font-claude-message'); if (textContentElement && !container.querySelector('.claude-tts-icon-container')) { createPerMessageTTSIcons(container, textContentElement); newMessagesObserved = true; } });
                        if (node.querySelector('div[contenteditable="true"], button[aria-label="Invia messaggio"], button[aria-label="Send message"]') || node.matches('div[contenteditable="true"], button[aria-label="Invia messaggio"], button[aria-label="Send message"]')) significantUIChange = true;
                    }
                }
            }
            if (!significantUIChange && mutation.removedNodes.length > 0) { for (const node of mutation.removedNodes) { if (node.nodeType === 1 && (node.id === AUTO_TTS_BUTTON_ID || (autoTTSButton && node.contains(autoTTSButton)))) { autoTTSButton = null; significantUIChange = true; break; } } }
        });
        if (significantUIChange || !autoTTSButton || (autoTTSButton && !document.body.contains(autoTTSButton))) ensureAutoTTSButtonExists();
        if (significantUIChange || newMessagesObserved || !document.querySelector('.claude-live-tts-button')) addLiveTTSButtonToInputBar();
    });

    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-is-streaming'] });
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize); else initialize();
    setTimeout(() => { if (!document.getElementById(AUTO_TTS_BUTTON_ID)) ensureAutoTTSButtonExists(); if (!document.querySelector('.claude-live-tts-button')) addLiveTTSButtonToInputBar(); }, 3500);
    console.log("AutoTTS (Enhanced Fusion) v3.0.1: Setup complete. Waiting for Claude interface.");
})();