// ==UserScript==
// @name         YouTube Subtitles Loader
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Carica sottotitoli personalizzati su YouTube
// @author       Flejta
// @match        *://www.youtube.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/522151/YouTube%20Subtitles%20Loader.user.js
// @updateURL https://update.greasyfork.org/scripts/522151/YouTube%20Subtitles%20Loader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Funzione di utilità per attendere elementi del DOM
    function waitForKeyElements(selectorOrFunction, callback, waitOnce = true, interval = 300, maxIntervals = -1) {
        let targetNodes = (typeof selectorOrFunction === "function")
            ? selectorOrFunction()
            : document.querySelectorAll(selectorOrFunction);

        let targetsFound = targetNodes && targetNodes.length > 0;
        if (targetsFound) {
            targetNodes.forEach(function(targetNode) {
                let alreadyFound = targetNode.getAttribute("data-userscript-alreadyFound") || false;
                if (!alreadyFound) {
                    let cancelFound = callback(targetNode);
                    if (cancelFound) {
                        targetsFound = false;
                    } else {
                        targetNode.setAttribute("data-userscript-alreadyFound", true);
                    }
                }
            });
        }

        if (maxIntervals !== 0 && !(targetsFound && waitOnce)) {
            maxIntervals -= 1;
            setTimeout(function() {
                waitForKeyElements(selectorOrFunction, callback, waitOnce, interval, maxIntervals);
            }, interval);
        }
    }

    class SubtitleManager {
        constructor() {
            this.subtitles = [];
            this.currentSubIndex = -1;
            this.lastTime = 0;
            this.lastSubtitleText = '';
            this.isSpeaking = false;
            this.setupInterface();
        }

        setupInterface() {
            waitForKeyElements('div#title.style-scope.ytd-watch-metadata', (titleElem) => {
                // Crea il container per i controlli
                const container = document.createElement('div');
                container.id = 'custom-subtitle-controls';
                container.style.cssText = `
                    margin: 10px 0;
                    padding: 10px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    flex-wrap: wrap;
                `;

                // Input file
                const fileInput = document.createElement('input');
                fileInput.type = 'file';
                fileInput.accept = '.vtt';
                fileInput.style.display = 'none';
                fileInput.id = 'subtitle-file-input';

                // Pulsante per attivare l'input file
                const loadButton = document.createElement('button');
                loadButton.textContent = 'Carica Sottotitoli';
                loadButton.style.cssText = `
                    padding: 8px 16px;
                    background: #065fd4;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                `;
                loadButton.onclick = () => fileInput.click();

                // Pulsante per creare sottotitoli
                const createButton = document.createElement('button');
                createButton.textContent = 'Crea Sottotitoli';
                createButton.style.cssText = `
                    padding: 8px 16px;
                    background: #065fd4;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                `;
                createButton.onclick = () => {
                    const videoUrl = window.location.href;
                    navigator.clipboard.writeText(videoUrl).then(() => {
                        console.log('Link del video copiato nella clipboard');
                        window.open('https://www.subeasy.ai/workspace', '_blank');
                    }).catch(err => {
                        console.error('Errore nel copiare il link: ', err);
                    });
                };

                // Pulsante per leggere i sottotitoli
                const ttsButton = document.createElement('button');
                ttsButton.textContent = 'Leggi Sottotitoli';
                ttsButton.style.cssText = `
                    padding: 8px 16px;
                    background: #4caf50; /* Colore verde per distinguerlo */
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                `;
                ttsButton.onclick = () => {
                    const display = document.getElementById('custom-subtitle-display');
                    if (display) {
                        this.speak(display.textContent);
                    }
                };
                ttsButton.disabled = true; // Disabilita inizialmente

                // Combobox per selezionare la voce
                const voiceSelect = document.createElement('select');
                voiceSelect.id = 'voice-select';
                voiceSelect.style.cssText = `
                    padding: 8px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    font-size: 14px;
                    width: 200px;  // Larghezza fissa
                `;
                voiceSelect.disabled = true; // Disabilita inizialmente
                this.populateVoiceList(voiceSelect);

                // Display nome file
                const fileDisplay = document.createElement('span');
                fileDisplay.style.cssText = `
                    color: #606060;
                    font-size: 14px;
                `;

                // Container sottotitoli
                const subtitleDisplay = document.createElement('div');
                subtitleDisplay.id = 'custom-subtitle-display';
                subtitleDisplay.style.cssText = `
                    margin-bottom: 10px;
                    padding: 10px;
                    background: #f9f9f9;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    color: #333;
                    font-size: 16px;
                    text-align: center;
                    min-height: 50px;  // Altezza fissa
                    display: block;
                `;
                subtitleDisplay.textContent = 'Carica un file di sottotitoli per iniziare';

                // Gestione caricamento file
                fileInput.onchange = async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;

                    fileDisplay.textContent = `File caricato: ${file.name}`;
                    subtitleDisplay.textContent = 'I sottotitoli sono in elaborazione. Potrebbe volerci qualche minuto...';
                    subtitleDisplay.style.color = 'red';
                    const reprocessedSubtitles = await this.reprocessSubtitlesWithAI(file);
                    this.subtitles = this.parseVTTSubtitles(reprocessedSubtitles);
                    this.setupTimeTracking();
                    subtitleDisplay.style.color = '#333';
                    subtitleDisplay.textContent = 'Carica un file di sottotitoli per iniziare';
                    ttsButton.disabled = false; // Abilita il pulsante "Leggi Sottotitoli"
                    voiceSelect.disabled = false; // Abilita il combobox per la voce
                };

                // Assembla l'interfaccia
                container.appendChild(createButton);
                container.appendChild(loadButton);
                container.appendChild(ttsButton);
                container.appendChild(voiceSelect);
                container.appendChild(fileInput);
                container.appendChild(fileDisplay);
                titleElem.after(container);

                // Inserisci il display dei sottotitoli prima del container dei controlli
                container.parentNode.insertBefore(subtitleDisplay, container);
            });
        }

        timeToSeconds(timeStr) {
            const [hours, minutes, seconds] = timeStr.split(':').map(Number);
            return hours * 3600 + minutes * 60 + seconds;
        }

        setupTimeTracking() {
            // Traccia il tempo dal player video
            const video = document.querySelector('video');
            if (video) {
                video.addEventListener('timeupdate', () => {
                    this.updateSubtitles(video.currentTime);
                });
            }

            // Backup: traccia anche l'elemento di visualizzazione del tempo
            const timeObserver = new MutationObserver(() => {
                const currentTimeEl = document.querySelector('.ytp-time-current');
                if (currentTimeEl) {
                    const currentTime = this.timeToSeconds(currentTimeEl.textContent);
                    if (currentTime !== this.lastTime) {
                        this.lastTime = currentTime;
                        this.updateSubtitles(currentTime);
                    }
                }
            });

            const timeWrapper = document.querySelector('.ytp-time-wrapper');
            if (timeWrapper) {
                timeObserver.observe(timeWrapper, {
                    subtree: true,
                    characterData: true,
                    childList: true
                });
            }
        }

        findSubtitleForTime(currentTime) {
            return this.subtitles.find(sub =>
                currentTime >= sub.start && currentTime <= sub.end
            );
        }

        updateSubtitles(currentTime) {
            const display = document.getElementById('custom-subtitle-display');
            if (!display) return;

            const currentSub = this.findSubtitleForTime(currentTime);
            const newText = currentSub ? currentSub.text : this.lastSubtitleText;

            if (newText !== this.lastSubtitleText) {
                console.log('Nuovo testo dei sottotitoli:', newText);
                display.textContent = newText;
                this.lastSubtitleText = newText;
                this.speak(newText);
            }
        }

        async reprocessSubtitlesWithAI(file) {
            const text = await file.text();
            const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer gu7JIlIXZ1etUr82SCAsi2Bqk0mpI6pM'
                },
                body: JSON.stringify({
                    model: 'mistral-medium',
                    messages: [
                        {
                            role: 'system',
                            content: 'Sei un esperto di elaborazione di sottotitoli. Il tuo compito è di riunire i sottotitoli in frasi complete e fluide, effettuando raggruppamenti anche più grandi di una frase. Parti di testo brevi, a meno che nel timing non siano chiaramente molto isolate, è bene che vengano raggruppate o con ciò che viene prima o ciò che viene dopo. Stessa cosa per quelle parti dove si capisce che non c\'è chiaramente sufficiente tempo perché siano pronunciate. Restituisci solo il file dei sottotitoli rielaborato nel formato VTT.'
                        },
                        { role: 'user', content: text }
                    ]
                })
            });
            const data = await response.json();
            return data.choices[0].message.content;
        }

        parseVTTSubtitles(text) {
            const lines = text.split('\n');
            const subtitles = [];
            let currentSub = null;

            lines.forEach(line => {
                if (line.trim() === '') {
                    if (currentSub) {
                        subtitles.push(currentSub);
                        currentSub = null;
                    }
                } else if (line.includes('-->')) {
                    const [start, end] = line.split('-->').map(timeStr => this.timeToSeconds(timeStr.trim().split(' ')[0]));
                    currentSub = { start, end, text: '' };
                } else if (currentSub) {
                    currentSub.text += line + '\n';
                }
            });

            return subtitles;
        }

        calculateSpeechRate(text, duration) {
            const words = text.split(/\s+/).length;
            const defaultRate = 1; // Velocità di lettura normale
            const requiredRate = (words / duration) / defaultRate;
            return Math.min(Math.max(requiredRate, 0.5), 2); // Limita la velocità tra 0.5 e 2
        }

        speak(text) {
            if (this.isSpeaking) {
                console.log('Interrompo la sintesi vocale corrente');
                speechSynthesis.cancel();
            }

            const voiceSelect = document.getElementById('voice-select');
            const selectedVoice = speechSynthesis.getVoices().find(voice => voice.name === voiceSelect.value);
            const currentSub = this.findSubtitleForTime(this.lastTime);
            const rate = currentSub ? this.calculateSpeechRate(currentSub.text, currentSub.end - currentSub.start) : 1;
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.voice = selectedVoice;
            utterance.rate = rate;
            utterance.onstart = () => {
                console.log('Sintesi vocale iniziata');
                this.isSpeaking = true;
            };
            utterance.onend = () => {
                console.log('Sintesi vocale completata');
                this.isSpeaking = false;
            };
            utterance.onerror = (event) => {
                console.error('Errore durante la sintesi vocale:', event.error);
                this.isSpeaking = false;
            };
            window.speechSynthesis.speak(utterance);
        }

        populateVoiceList(voiceSelect) {
            const voices = speechSynthesis.getVoices();
            voices.forEach(voice => {
                const option = document.createElement('option');
                option.value = voice.name;
                option.textContent = `${voice.name} (${voice.lang})`;
                voiceSelect.appendChild(option);
                // Imposta la voce di Google Italiano come predefinita
                if (voice.name === 'Google italiano') {
                    option.selected = true;
                }
            });
        }
    }

    // Inizializza quando il documento è pronto
    if (document.body) {
        new SubtitleManager();
    }

    // Reinizializza quando si naviga tra i video
    window.addEventListener('yt-navigate-start', () => {
        new SubtitleManager();
    });

    // Aggiorna la lista delle voci quando sono disponibili
    speechSynthesis.onvoiceschanged = () => {
        const voiceSelect = document.getElementById('voice-select');
        if (voiceSelect) {
            const subtitleManager = new SubtitleManager();
            subtitleManager.populateVoiceList(voiceSelect);
        }
    };
})();