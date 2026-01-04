// ==UserScript==
// @name         ElevenLabs test
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Validate ElevenLabs API key, list voices/models, and generate speech with adjustable settings.
// @author       Your Name
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      api.elevenlabs.io
// @downloadURL https://update.greasyfork.org/scripts/543457/ElevenLabs%20test.user.js
// @updateURL https://update.greasyfork.org/scripts/543457/ElevenLabs%20test.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let allVoicesData = [];
    let currentAudio = null; // To keep track of the currently playing audio
    let elevenLabsApiKey = '';

    // --- 🎨 UI and CSS Injection ---
    GM_addStyle(`
        #elevenlabs-panel {
            position: fixed; top: 10px; right: 10px; width: 320px;
            background-color: #f0f0f0; border: 1px solid #ccc; padding: 15px;
            border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            font-family: Arial, sans-serif; z-index: 9999; max-height: 95vh; overflow-y: auto;
        }
        #elevenlabs-panel h3 { margin-top: 0; color: #333; text-align: center; }
        #elevenlabs-panel button {
            background-color: #007bff; color: white; padding: 10px 15px;
            border: none; border-radius: 4px; cursor: pointer; margin-top: 10px; width: 100%;
        }
        #elevenlabs-panel button:hover { background-color: #0056b3; }
        #elevenlabs-panel button#generateSpeechBtn { background-color: #28a745; }
        #elevenlabs-panel button#generateSpeechBtn:hover { background-color: #218838; }
        #elevenlabs-panel button:disabled { background-color: #cccccc; cursor: not-allowed; }
        #elevenlabs-panel .status { margin-top: 10px; font-weight: bold; }
        #elevenlabs-panel .status.success { color: green; }
        #elevenlabs-panel .status.error { color: red; }
        #elevenlabs-panel select, #elevenlabs-panel textarea {
            width: 100%; padding: 8px; margin-top: 5px; border-radius: 4px;
            border: 1px solid #ddd; box-sizing: border-box;
        }
        #elevenlabs-panel textarea { resize: vertical; min-height: 80px; }
        #elevenlabs-panel label { display: block; margin-top: 12px; font-weight: bold; }
        .slider-container { margin-top: 10px; }
        .slider-container label { font-weight: normal; margin-top: 5px; }
        .slider-container input[type="range"] { width: 100%; margin-top: 2px; }
        .checkbox-container { display: flex; align-items: center; margin-top: 15px; }
        .checkbox-container label { margin-left: 8px; font-weight: normal; margin-top: 0; }
    `);

    const panel = document.createElement('div');
    panel.id = 'elevenlabs-panel';
    panel.innerHTML = `
        <h3>ElevenLabs API Explorer 🚀</h3>
        <button id="validateApiKeyBtn">Enter & Validate API Key</button>
        <p class="status" id="apiStatus"></p>

        <div id="controlsSection" style="display:none;">
            <div id="voicesSection">
                <label for="elevenlabs-voice-select">Available Voices:</label>
                <select id="elevenlabs-voice-select"></select>
            </div>
            <div id="modelsSection">
                <label for="elevenlabs-model-select">Available Models:</label>
                <select id="elevenlabs-model-select"></select>
            </div>

            <div id="ttsSection">
                <label for="tts-text-area">Text to Generate:</label>
                <textarea id="tts-text-area" placeholder="Enter text here..."></textarea>

                <div class="slider-container">
                    <label id="speed-label">Playback Speed: 100%</label>
                    <input type="range" id="speed-slider" min="5" max="200" value="100">
                </div>
                <div class="slider-container">
                    <label id="stability-label">Stability: 75%</label>
                    <input type="range" id="stability-slider" min="0" max="100" value="75">
                </div>
                <div class="slider-container">
                    <label id="similarity-label">Similarity Boost: 75%</label>
                    <input type="range" id="similarity-slider" min="0" max="100" value="75">
                </div>
                 <div class="slider-container">
                    <label id="style-label">Style: 0%</label>
                    <input type="range" id="style-slider" min="0" max="100" value="0">
                </div>

                <div class="checkbox-container">
                    <input type="checkbox" id="speaker-boost-checkbox" checked>
                    <label for="speaker-boost-checkbox">Use Speaker Boost</label>
                </div>

                <button id="generateSpeechBtn">Generate Speech</button>
                <p class="status" id="ttsStatus"></p>
            </div>
        </div>
    `;
    document.body.appendChild(panel);

    // ---  DOM Element References ---
    const validateApiKeyBtn = document.getElementById('validateApiKeyBtn');
    const apiStatus = document.getElementById('apiStatus');
    const controlsSection = document.getElementById('controlsSection');
    const voiceSelect = document.getElementById('elevenlabs-voice-select');
    const modelSelect = document.getElementById('elevenlabs-model-select');
    const ttsTextArea = document.getElementById('tts-text-area');
    const generateSpeechBtn = document.getElementById('generateSpeechBtn');
    const ttsStatus = document.getElementById('ttsStatus');

    // Sliders and Checkbox
    const speedSlider = document.getElementById('speed-slider');
    const stabilitySlider = document.getElementById('stability-slider');
    const similaritySlider = document.getElementById('similarity-slider');
    const styleSlider = document.getElementById('style-slider');
    const speakerBoostCheckbox = document.getElementById('speaker-boost-checkbox');

    const speedLabel = document.getElementById('speed-label');
    const stabilityLabel = document.getElementById('stability-label');
    const similarityLabel = document.getElementById('similarity-label');
    const styleLabel = document.getElementById('style-label');

    // --- 🌐 API Request Function ---
    function elevenLabsApiRequest(options) {
        const { method, endpoint, apiKey, params = {}, data = null, responseType = 'json' } = options;
        let url = `https://api.elevenlabs.io${endpoint}`;
        if (Object.keys(params).length > 0) {
            url += `?${new URLSearchParams(params).toString()}`;
        }

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: method,
                url: url,
                headers: { "xi-api-key": apiKey, "Content-Type": "application/json" },
                data: data ? JSON.stringify(data) : null,
                responseType: responseType,
                onload: function(response) {
                    if (response.status === 200) {
                        resolve(responseType === 'json' ? JSON.parse(response.responseText) : response.response);
                    } else {
                        let errorMessage = `Error: ${response.status}`;
                        try {
                            const errorDetail = JSON.parse(response.responseText).detail;
                            if(typeof errorDetail === 'string') errorMessage = errorDetail;
                            else if (errorDetail[0]?.msg) errorMessage = errorDetail[0].msg;
                        } catch (e) { /* Ignore parsing error */ }
                        reject({ status: response.status, message: errorMessage });
                    }
                },
                onerror: function(error) {
                    reject({ status: 0, message: `Network error: ${error.statusText || 'Unknown'}` });
                }
            });
        });
    }

    // --- 🎤 Core API Logic ---
    async function validateApiKey(apiKey) {
        try {
            await elevenLabsApiRequest({ method: "GET", endpoint: "/v1/models", apiKey });
            return { isValid: true, message: "API Key Valid!" };
        } catch (error) {
            return { isValid: false, message: `API Key validation failed: ${error.message}` };
        }
    }

    async function getAndDisplayVoices(apiKey) {
        voiceSelect.innerHTML = '';
        allVoicesData = [];
        try {
            const response = await elevenLabsApiRequest({ method: "GET", endpoint: "/v1/voices", apiKey });
            allVoicesData = response.voices || [];
            // Basic categorization
            const categorized = { 'Premade': [], 'Cloned': [] };
            allVoicesData.forEach(v => {
                if(v.category === 'premade') categorized.Premade.push(v);
                else categorized.Cloned.push(v);
            });

            Object.keys(categorized).forEach(category => {
                const voices = categorized[category];
                if(voices.length > 0){
                    const optgroup = document.createElement('optgroup');
                    optgroup.label = `${category} (${voices.length})`;
                    voices.forEach(voice => {
                        const option = document.createElement('option');
                        option.value = voice.voice_id;
                        option.textContent = voice.name;
                        option.dataset.previewUrl = voice.preview_url;
                        optgroup.appendChild(option);
                    });
                    voiceSelect.appendChild(optgroup);
                }
            });
        } catch (error) {
            throw `Failed to retrieve voices: ${error.message}`;
        }
    }

    async function getAndDisplayModels(apiKey) {
        try {
            const models = await elevenLabsApiRequest({ method: "GET", endpoint: "/v1/models", apiKey });
            const ttsModels = models.filter(model => model.can_do_text_to_speech);
            modelSelect.innerHTML = '';
            ttsModels.forEach(model => {
                const option = document.createElement('option');
                option.value = model.model_id;
                option.textContent = model.name;
                modelSelect.appendChild(option);
            });
        } catch (error) {
            throw `Failed to retrieve models: ${error.message}`;
        }
    }

    async function generateAndPlaySpeech() {
        if (!ttsTextArea.value.trim()) {
            ttsStatus.textContent = "Please enter some text to generate.";
            ttsStatus.className = "status error";
            return;
        }

        const voiceId = voiceSelect.value;
        generateSpeechBtn.disabled = true;
        ttsStatus.textContent = "Generating audio...";
        ttsStatus.className = "status";

        const requestBody = {
            text: ttsTextArea.value,
            model_id: modelSelect.value,
            voice_settings: {
                stability: stabilitySlider.value / 100,
                similarity_boost: similaritySlider.value / 100,
                style: styleSlider.value / 100,
                use_speaker_boost: speakerBoostCheckbox.checked
            }
        };

        try {
            const audioData = await elevenLabsApiRequest({
                method: 'POST',
                endpoint: `/v1/text-to-speech/${voiceId}`,
                apiKey: elevenLabsApiKey,
                data: requestBody,
                responseType: 'arraybuffer'
            });

            const blob = new Blob([audioData], { type: 'audio/mpeg' });
            const audioUrl = URL.createObjectURL(blob);
            stopCurrentAudio();
            currentAudio = new Audio(audioUrl);
            currentAudio.playbackRate = speedSlider.value / 100; // Apply client-side speed
            currentAudio.play();
            ttsStatus.textContent = "Audio playing!";
            ttsStatus.className = "status success";
        } catch (error) {
            ttsStatus.textContent = `Generation failed: ${error.message}`;
            ttsStatus.className = "status error";
        } finally {
            generateSpeechBtn.disabled = false;
        }
    }

    // --- 🔊 Audio Handling ---
    function stopCurrentAudio() {
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.src = ''; // Release resource
            currentAudio = null;
        }
    }

    function playVoiceSample(previewUrl) {
        if (!previewUrl) return;
        stopCurrentAudio();
        currentAudio = new Audio(previewUrl);
        currentAudio.play().catch(e => console.error("Error playing sample:", e));
    }


    // --- 🎬 Event Listeners ---
    validateApiKeyBtn.addEventListener('click', async () => {
        const inputKey = prompt("Please enter your ElevenLabs API Key:");
        if (!inputKey) {
            apiStatus.textContent = "API Key input cancelled.";
            apiStatus.className = "status error";
            return;
        }

        elevenLabsApiKey = inputKey;
        apiStatus.textContent = "Validating API Key...";
        apiStatus.className = "status";
        validateApiKeyBtn.disabled = true;
        controlsSection.style.display = 'none';

        try {
            const validationResult = await validateApiKey(elevenLabsApiKey);
            apiStatus.textContent = validationResult.message;
            apiStatus.className = `status ${validationResult.isValid ? 'success' : 'error'}`;

            if (validationResult.isValid) {
                await Promise.all([
                    getAndDisplayVoices(elevenLabsApiKey),
                    getAndDisplayModels(elevenLabsApiKey)
                ]);
                controlsSection.style.display = 'block';
                if(voiceSelect.options.length > 0) {
                     playVoiceSample(voiceSelect.options[voiceSelect.selectedIndex].dataset.previewUrl);
                }
            }
        } catch (error) {
            apiStatus.textContent = error.message || "An unknown error occurred.";
            apiStatus.className = "status error";
        } finally {
            validateApiKeyBtn.disabled = false;
        }
    });

    voiceSelect.addEventListener('change', (event) => {
        const previewUrl = event.target.options[event.target.selectedIndex].dataset.previewUrl;
        playVoiceSample(previewUrl);
    });

    generateSpeechBtn.addEventListener('click', generateAndPlaySpeech);

    // Slider value display updaters
    speedSlider.addEventListener('input', () => speedLabel.textContent = `Playback Speed: ${speedSlider.value}%`);
    stabilitySlider.addEventListener('input', () => stabilityLabel.textContent = `Stability: ${stabilitySlider.value}%`);
    similaritySlider.addEventListener('input', () => similarityLabel.textContent = `Similarity Boost: ${similaritySlider.value}%`);
    styleSlider.addEventListener('input', () => styleLabel.textContent = `Style: ${styleSlider.value}%`);

})();