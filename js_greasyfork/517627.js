// ==UserScript==
// @name         YouTube Chinese to Italian Translator
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Translate Chinese YouTube videos to Italian
// @author       Flejta Claude
// @match        https://www.youtube.com/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/517627/YouTube%20Chinese%20to%20Italian%20Translator.user.js
// @updateURL https://update.greasyfork.org/scripts/517627/YouTube%20Chinese%20to%20Italian%20Translator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const API_KEY = 'AIzaSyCA5QJ26nAEGEc8fgabAFsSt8LZCA2P8AM'; // Inserisci la tua API key
    let audioContext;
    let workletNode;
    let isRecording = false;

    function addButton() {
        if (document.getElementById('translate-btn')) return;

        const container = document.createElement('div');
        container.id = 'translate-btn';
        container.style.cssText = 'position:fixed;top:10px;right:300px;z-index:9999;';

        const button = document.createElement('button');
        button.textContent = '中 → IT';
        button.style.cssText = 'padding:5px 10px;background:#cc0000;color:white;border:none;cursor:pointer;';
        button.onclick = toggleCapture;

        container.appendChild(button);
        document.body.appendChild(container);

        // Aggiungi indicatore audio
        const audioIndicator = document.createElement('div');
        audioIndicator.id = 'audio-indicator';
        audioIndicator.style.cssText = `
            position: fixed;
            top: 40px;
            right: 300px;
            width: 50px;
            height: 5px;
            background: #333;
            display: none;
        `;
        document.body.appendChild(audioIndicator);
    }

    async function setupAudioProcessing() {
        const video = document.querySelector('video');
        if (!video) return false;

        try {
            audioContext = new AudioContext();

            // Carica il processore audio
            await audioContext.audioWorklet.addModule(URL.createObjectURL(new Blob([`
                class AudioProcessor extends AudioWorkletProcessor {
                    constructor() {
                        super();
                        this.audioChunks = [];
                        this.sampleRate = 44100;
                    }

                    process(inputs, outputs) {
                        const input = inputs[0];
                        if (input.length > 0) {
                            const audioData = input[0];
                            this.audioChunks = this.audioChunks.concat(Array.from(audioData));

                            // Process every 3 seconds
                            if (this.audioChunks.length >= this.sampleRate * 3) {
                                this.port.postMessage({
                                    audioData: this.audioChunks.slice(0, this.sampleRate * 3),
                                    volume: this.calculateVolume(this.audioChunks)
                                });
                                this.audioChunks = this.audioChunks.slice(this.sampleRate * 3);
                            }
                        }
                        return true;
                    }

                    calculateVolume(data) {
                        const sum = data.reduce((acc, val) => acc + Math.abs(val), 0);
                        return sum / data.length;
                    }
                }
                registerProcessor('audio-processor', AudioProcessor);
            `], { type: 'text/javascript' })));

            const stream = video.captureStream();
            const source = audioContext.createMediaStreamSource(stream);
            workletNode = new AudioWorkletNode(audioContext, 'audio-processor');

            workletNode.port.onmessage = async (event) => {
                const { audioData, volume } = event.data;
                updateAudioIndicator(volume);
                await processAudioChunk(audioData);
            };

            source.connect(workletNode);
            workletNode.connect(audioContext.destination);

            console.log('Audio processing setup completed');
            return true;
        } catch (error) {
            console.error('Error setting up audio processing:', error);
            return false;
        }
    }

    function updateAudioIndicator(volume) {
        const indicator = document.getElementById('audio-indicator');
        if (indicator) {
            indicator.style.display = 'block';
            indicator.style.width = Math.min(volume * 200, 50) + 'px';
            indicator.style.backgroundColor = volume > 0.01 ? '#00ff00' : '#ff0000';
        }
    }

    async function processAudioChunk(audioData) {
        try {
            console.log('Processing audio chunk:', {
                length: audioData.length,
                averageVolume: calculateVolume(audioData)
            });

            // Converti i dati audio nel formato corretto
            const audioBuffer = convertFloat32ToInt16(audioData);
            const wavBuffer = createWAVBuffer(audioBuffer, 44100);
            const base64Audio = arrayBufferToBase64(wavBuffer);

            console.log('Sending audio data of size:', base64Audio.length);

            // Richiesta a Cloud Speech-to-Text
            const sttResponse = await fetch(`https://speech.googleapis.com/v1/speech:recognize?key=${API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    config: {
                        encoding: 'LINEAR16',
                        sampleRateHertz: 44100,
                        languageCode: 'zh-CN',
                        model: 'default',
                        audioChannelCount: 1
                    },
                    audio: {
                        content: base64Audio
                    }
                })
            });

            const sttData = await sttResponse.json();
            console.log('Speech-to-Text full response:', sttData);

            if (sttData.results && sttData.results[0] && sttData.results[0].alternatives[0]) {
                const text = sttData.results[0].alternatives[0].transcript;
                console.log('Recognized text:', text);

                const translation = await translateText(text);
                if (translation) {
                    showSubtitles(translation);
                }
            }
        } catch (error) {
            console.error('Error processing audio:', error);
        }
    }

    function convertFloat32ToInt16(float32Array) {
        const int16Array = new Int16Array(float32Array.length);
        for (let i = 0; i < float32Array.length; i++) {
            const s = Math.max(-1, Math.min(1, float32Array[i]));
            int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }
        return int16Array;
    }

    function createWAVBuffer(samples, sampleRate) {
        const buffer = new ArrayBuffer(44 + samples.byteLength);
        const view = new DataView(buffer);

        // WAV Header
        writeString(view, 0, 'RIFF');
        view.setUint32(4, 36 + samples.byteLength, true);
        writeString(view, 8, 'WAVE');
        writeString(view, 12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        view.setUint16(22, 1, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * 2, true);
        view.setUint16(32, 2, true);
        view.setUint16(34, 16, true);
        writeString(view, 36, 'data');
        view.setUint32(40, samples.byteLength, true);

        // Copy audio data
        const samplesData = new Uint8Array(buffer, 44);
        const samplesBytes = new Uint8Array(samples.buffer);
        samplesData.set(samplesBytes);

        return buffer;
    }

    function writeString(view, offset, string) {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    }

    function arrayBufferToBase64(buffer) {
        const bytes = new Uint8Array(buffer);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }

    function calculateVolume(data) {
        const sum = data.reduce((acc, val) => acc + Math.abs(val), 0);
        return sum / data.length;
    }

    async function translateText(text) {
        const url = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    q: text,
                    source: 'zh',
                    target: 'it',
                    format: 'text'
                })
            });

            const data = await response.json();
            console.log('Full translation response:', data);

            if (data.data && data.data.translations && data.data.translations[0]) {
                return data.data.translations[0].translatedText;
            }
            throw new Error('Translation failed');
        } catch (error) {
            console.error('Translation error:', error);
            return null;
        }
    }

    function showSubtitles(text) {
        let subtitleContainer = document.getElementById('custom-subtitles');
        if (!subtitleContainer) {
            subtitleContainer = document.createElement('div');
            subtitleContainer.id = 'custom-subtitles';
            subtitleContainer.style.cssText = `
                position: fixed;
                bottom: 100px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 10px 20px;
                border-radius: 5px;
                z-index: 9999;
                text-align: center;
                font-size: 18px;
                max-width: 80%;
                transition: opacity 0.3s;
            `;
            document.body.appendChild(subtitleContainer);
        }

        subtitleContainer.textContent = text;
        subtitleContainer.style.display = 'block';
        subtitleContainer.style.opacity = '1';

        // Log per debug
        console.log('Showing subtitles:', text);
    }

    async function toggleCapture() {
        const button = document.querySelector('#translate-btn button');
        const indicator = document.getElementById('audio-indicator');

        if (isRecording) {
            button.style.background = '#cc0000';
            isRecording = false;
            if (audioContext) {
                await audioContext.close();
                audioContext = null;
            }
            if (indicator) {
                indicator.style.display = 'none';
            }
            const subtitles = document.getElementById('custom-subtitles');
            if (subtitles) {
                subtitles.style.display = 'none';
            }
        } else {
            button.style.background = '#00cc00';
            isRecording = true;
            const success = await setupAudioProcessing();
            if (!success) {
                button.style.background = '#cc0000';
                isRecording = false;
                alert('Failed to setup audio capture');
            }
        }
    }

    // Initial setup
    if (window.location.href.includes('watch?v=')) {
        setTimeout(() => {
            addButton();
            addTestButton(); // Aggiunto pulsante di test
        }, 2000);
    }

    // Observe navigation
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            if (url.includes('watch?v=')) {
                setTimeout(addButton, 2000);
            }
        }
    }).observe(document, {subtree: true, childList: true});
})();