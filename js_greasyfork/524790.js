// ==UserScript==
// @name         GeoGuessr ChatGPT Assistant
// @namespace    http://tampermonkey.net/
// @version      2025-01-25
// @description  Analyzes GeoGuessr scenes using OpenAI Vision API
// @author       elmulinho
// @match        https://www.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @grant        GM_xmlhttpRequest
// @grant        window.navigator.mediaDevices
// @connect      api.openai.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/524790/GeoGuessr%20ChatGPT%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/524790/GeoGuessr%20ChatGPT%20Assistant.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration - Replace these with your values
    const CONFIG = {
        TIMEOUT: 5000,
        SAFE_MODE: false,
        OPENAI_API_KEY: 'YOUR-API-KEY',
        MODEL: 'gpt-4o',
        MAX_TOKENS: 2000,
        PROMPT: 'You are a Geoguessr bot. You will receive an image that is a round of Geoguessr. Your job is to provide the user with the correct answer to the given round. The possible countries: USA, Russia, Brazil, Indonesia, Australia, Mexico, Canada, Argentina, India, South Africa, Japan, Turkey, Peru, France, Spain, Chile, Colombia, Kazakhstan, Thailand, New Zealand, Philippines, Nigeria, Norway, Italy, Malaysia, United Kingdom, Kenya, Germany, Sweden, Ukraine, Romania',
        RESPONSE_FORMAT: {
            "type": "json_schema",
            "json_schema": {
                "name": "guess_response",
                "schema": {
                "type": "object",
                "properties": {
                    "country": {
                    "type": "string",
                    "description": "The country name based on the guess."
                    },
                    "province": {
                    "type": "string",
                    "description": "Province in the guessed country where you think the location is from."
                    },
                    "explanation": {
                    "type": "string",
                    "description": "Explanation detailing why this country was chosen and where in country could this location be."
                    },
                    "coordinates": {
                    "type": "object",
                    "properties": {
                        "latitude": {
                        "type": "number",
                        "description": "Latitude coordinate of the guessed country in the guessed province. They should be very precise, at least 5 decimal digits."
                        },
                        "longitude": {
                        "type": "number",
                        "description": "Longitude coordinate of the guessed country in the guessed province. They should be very precise, at least 5 decimal digits."
                        }
                    },
                    "required": [
                        "latitude",
                        "longitude"
                    ],
                    "additionalProperties": false
                    },
                    "confidence": {
                    "type": "number",
                    "description": "Confidence level of how sure you are in your guess expressed as a percentage."
                    }
                },
                "required": [
                    "country",
                    "province",
                    "explanation",
                    "coordinates",
                    "confidence"
                ],
                "additionalProperties": false
                },
                "strict": true
            }
        }
    };

    // Create info panel
    function createInfoPanel() {
        const panel = document.createElement('div');
        panel.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 15px;
            border-radius: 8px;
            font-family: Arial, sans-serif;
            z-index: 10000;
            max-width: 300px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        `;
        return panel;
    }

    // Update info panel with analysis results
    function updateInfoPanel(analysis) {
        // Remove existing panel if present
        const existingPanel = document.querySelector('#gpt-info-panel');
        if (existingPanel) {
            existingPanel.remove();
        }

        const panel = createInfoPanel();
        panel.id = 'gpt-info-panel';
        document.body.appendChild(panel);

        // Set timeout to remove panel after 5 seconds
        setTimeout(() => {
            panel.remove();
        }, CONFIG.TIMEOUT);

        const confidenceColor = analysis.confidence >= 80 ? '#4CAF50' :
                              analysis.confidence >= 50 ? '#FFC107' : '#F44336';

        panel.innerHTML = `
            <div style="margin-bottom: 10px; font-size: 16px; font-weight: bold;">
                ${analysis.country}${analysis.province ? ` - ${analysis.province}` : ''}
            </div>
            <div style="margin-bottom: 10px; font-size: 14px;">
                ${analysis.explanation}
            </div>
            <div style="display: flex; align-items: center; gap: 10px;">
                <div style="flex-grow: 1; height: 20px; background: #444; border-radius: 10px; overflow: hidden;">
                    <div style="width: ${analysis.confidence}%; height: 100%; background: ${confidenceColor};"></div>
                </div>
                <div style="font-size: 14px; font-weight: bold;">
                    ${Math.round(analysis.confidence)}%
                </div>
            </div>
        `;
    }

    // Function to find Street View canvas
    async function findStreetViewIframe(timeout = 10000) {
        const startTime = Date.now();

        while (Date.now() - startTime < timeout) {
            const canvases = document.querySelectorAll('canvas');
            const mainCanvas = Array.from(canvases).find(canvas =>
                canvas.className.includes('mapsConsumerUiSceneCoreScene__canvas') &&
                !canvas.className.includes('impressCanvas')
            );

            if (mainCanvas) {
                return mainCanvas;
            }

            await new Promise(resolve => setTimeout(resolve, 100));
        }

        return null;
    }

    // Function to capture screenshot
    async function captureScreenshot() {
        try {
            const streetViewIframe = await findStreetViewIframe();
            if (!streetViewIframe) {
                throw new Error('Street View iframe not found');
            }

            const rect = streetViewIframe.getBoundingClientRect();

            // Request screen capture
            const stream = await navigator.mediaDevices.getDisplayMedia({
                preferCurrentTab: true,
                video: {
                    width: rect.width,
                    height: rect.height
                }
            });

            // Create video element to capture the stream
            const video = document.createElement('video');
            video.srcObject = stream;
            await new Promise(resolve => video.onloadedmetadata = resolve);
            await video.play();

            // Create canvas and capture frame
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = video.videoWidth;
            tempCanvas.height = video.videoHeight;

            const ctx = tempCanvas.getContext('2d');
            ctx.drawImage(video, 0, 0);

            // Stop the stream
            stream.getTracks().forEach(track => track.stop());

            const screenshot = tempCanvas;

            const dataUrl = screenshot.toDataURL('image/png');
            return dataUrl;
        } catch (error) {
            console.error('❌ Error capturing screenshot:', error);
            return null;
        }
    }

    // Function to place marker on the map
    async function placeMarker(coordinates, safeMode) {
        const { latitude: lat, longitude: lng } = coordinates;

        let finalLat = lat;
        let finalLng = lng;

        if (safeMode) { // applying random values to received coordinates
            const sway = [Math.random() > 0.5, Math.random() > 0.5];
            const multiplier = Math.random() * 4;
            const horizontalAmount = Math.random() * multiplier;
            const verticalAmount = Math.random() * multiplier;
            finalLat = sway[0] ? lat + verticalAmount : lat - verticalAmount;
            finalLng = sway[1] ? lng + horizontalAmount : lng - horizontalAmount;
        }

        let element = document.querySelectorAll('[class^="guess-map_canvas__"]')[0];
        if (!element) {
            console.error('❌ Map canvas not found');
            return;
        }

        const latLngFns = {
            latLng: {
                lat: () => finalLat,
                lng: () => finalLng,
            }
        };

        try {
            // Fetching Map Element and Props to extract place function
            const reactKeys = Object.keys(element);
            const reactKey = reactKeys.find(key => key.startsWith("__reactFiber$"));
            const elementProps = element[reactKey];
            const mapElementClick = elementProps.return.return.memoizedProps.map.__e3_.click;
            const mapElementPropKey = Object.keys(mapElementClick)[0];
            const mapClickProps = mapElementClick[mapElementPropKey];
            const mapClickPropKeys = Object.keys(mapClickProps);

            for (let i = 0; i < mapClickPropKeys.length; i++) {
                if (typeof mapClickProps[mapClickPropKeys[i]] === "function") {
                    mapClickProps[mapClickPropKeys[i]](latLngFns);
                }
            }
        } catch (error) {
            console.error('❌ Error placing marker:', error);
        }
    }

    // Function to send image to OpenAI Vision API
    async function analyzeImage(imageData) {
        const base64Image = imageData.split(',')[1];

        const requestData = {
            model: CONFIG.MODEL,
            messages: [
                {
                    role: "user",
                    content: [
                        { type: "text", text: CONFIG.PROMPT },
                        { type: "image_url", image_url: { url: `data:image/jpeg;base64,${base64Image}` } }
                    ]
                }
            ],
            max_tokens: CONFIG.MAX_TOKENS,
            response_format: CONFIG.RESPONSE_FORMAT,
            store: true
        };

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${CONFIG.OPENAI_API_KEY}`
                },
                body: JSON.stringify(requestData)
            });

            const data = await response.json();

            if (data.error) {
                console.error('❌ API Error:', data.error);
                return null;
            }

            return data.choices[0].message.content;
        } catch (error) {
            console.error('❌ Error analyzing image:', error);
            return null;
        }
    }

    // Function to wait for game elements to load
    async function waitForGame(timeout = 10000) {
        const startTime = Date.now();
        while (Date.now() - startTime < timeout) {
            const elements = document.querySelectorAll('iframe, div[class*="game"], div[class*="street"]');
            if (elements.length > 0) {
                console.log('✅ Game elements found');
                return true;
            }
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        console.error('❌ Timeout waiting for game elements');
        return false;
    }

    // Event listener for key press
    document.addEventListener('keydown', async function(event) {
        if (event.key === '1') {
            console.log('🎮 Key "1" pressed - Starting process...');

            console.log('⏳ Waiting for game to load...');
            const gameLoaded = await waitForGame();
            if (!gameLoaded) {
                console.error('❌ Game not loaded');
                return;
            }
            // Debug log to show available elements
            console.log('Available elements:', {
                gameLayout: document.querySelector('.game-layout'),
                nextDiv: document.querySelector('#__next div[class*="game-layout"]'),
                streetView: document.querySelector('#street-view'),
                canvasContainer: document.querySelector('#canvas-container')
            });

            const screenshot = await captureScreenshot();
            if (screenshot) {
                console.log('✅ Screenshot captured successfully');
                const analysis = await analyzeImage(screenshot);
                if (analysis) {
                    try {
                        const parsedAnalysis = JSON.parse(analysis);
                        updateInfoPanel(parsedAnalysis);
                        console.log(`Coordinates: ${parsedAnalysis.coordinates.latitude}, ${parsedAnalysis.coordinates.longitude}`);
                        await placeMarker(parsedAnalysis.coordinates, CONFIG.SAFE_MODE);
                    } catch (e) {
                        console.error('❌ Error parsing JSON response:', e);
                    }
                } else {
                    console.error('❌ Analysis failed');
                }
            } else {
                console.error('❌ Screenshot capture failed');
            }
        }
    });
})();
