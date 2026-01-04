// ==UserScript==
// @name         Evades.io FPS Cap Controller
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Controls FPS and lessens Delay
// @author       JimmyJimmy
// @match        *://*.evades.io/*
// @match        *://evades.io/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536351/Evadesio%20FPS%20Cap%20Controller.user.js
// @updateURL https://update.greasyfork.org/scripts/536351/Evadesio%20FPS%20Cap%20Controller.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const DEFAULT_FPS = 60;  // Default FPS cap
    const FPS_PRESETS = [30, 60, 120, 144, 240, 0]; // 0 means uncapped

    // Wait for game to load
    const checkGameLoaded = setInterval(function() {
        if (typeof window.requestAnimationFrame !== 'undefined') {
            clearInterval(checkGameLoaded);
            initFPSController();
        }
    }, 1000);

    function initFPSController() {
        // Variables to control FPS
        let targetFPS = DEFAULT_FPS;
        let fpsCapEnabled = true;
        let lastFrameTime = 0;
        let frameDelay = 1000 / targetFPS;

        // Store the original requestAnimationFrame
        const originalRAF = window.requestAnimationFrame;

        // Create UI for FPS control
        createFPSControlUI();

        // Override requestAnimationFrame
        window.requestAnimationFrame = function(callback) {
            if (!fpsCapEnabled || targetFPS === 0) {
                // If cap is disabled or set to 0 (uncapped), use original RAF
                return originalRAF(callback);
            }

            const currentTime = performance.now();
            const timeUntilNextFrame = Math.max(0, frameDelay - (currentTime - lastFrameTime));

            return setTimeout(function() {
                lastFrameTime = performance.now();
                callback(lastFrameTime);
            }, timeUntilNextFrame);
        };

        // Functions to update FPS settings
        function setFPS(fps) {
            targetFPS = fps;
            frameDelay = targetFPS > 0 ? 1000 / targetFPS : 0;
            updateFPSDisplay();

            // Save to localStorage
            localStorage.setItem('evades_custom_fps', fps);
        }

        function toggleFPSCap() {
            fpsCapEnabled = !fpsCapEnabled;
            updateFPSDisplay();

            // Save to localStorage
            localStorage.setItem('evades_fps_cap_enabled', fpsCapEnabled ? '1' : '0');
        }

        // Load saved settings
        const savedFPS = localStorage.getItem('evades_custom_fps');
        const savedCapEnabled = localStorage.getItem('evades_fps_cap_enabled');

        if (savedFPS) setFPS(parseInt(savedFPS));
        if (savedCapEnabled) fpsCapEnabled = savedCapEnabled === '1';

        // Create UI elements
        function createFPSControlUI() {
            const controlPanel = document.createElement('div');
            controlPanel.id = 'fps-control-panel';
            controlPanel.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                background-color: rgba(0, 0, 0, 0.7);
                color: white;
                padding: 10px;
                border-radius: 5px;
                z-index: 10000;
                font-family: Arial, sans-serif;
                user-select: none;
                display: flex;
                flex-direction: column;
                gap: 5px;
            `;

            const fpsDisplay = document.createElement('div');
            fpsDisplay.id = 'fps-display';
            controlPanel.appendChild(fpsDisplay);

            const toggleButton = document.createElement('button');
            toggleButton.textContent = 'Toggle FPS Cap';
            toggleButton.onclick = toggleFPSCap;
            toggleButton.style.cssText = `
                padding: 5px;
                margin-top: 5px;
                cursor: pointer;
            `;
            controlPanel.appendChild(toggleButton);

            const customFpsInput = document.createElement('input');
            customFpsInput.type = 'number';
            customFpsInput.min = '1';
            customFpsInput.placeholder = 'Custom FPS';
            customFpsInput.style.cssText = `
                width: 100%;
                padding: 5px;
                margin-top: 5px;
            `;
            customFpsInput.onchange = function() {
                const customFps = parseInt(this.value);
                if (customFps > 0) setFPS(customFps);
            };
            controlPanel.appendChild(customFpsInput);

            const presetContainer = document.createElement('div');
            presetContainer.style.cssText = `
                display: flex;
                flex-wrap: wrap;
                gap: 5px;
                margin-top: 5px;
            `;

            FPS_PRESETS.forEach(fps => {
                const presetButton = document.createElement('button');
                presetButton.textContent = fps === 0 ? 'Uncap' : fps + ' FPS';
                presetButton.onclick = function() { setFPS(fps); };
                presetButton.style.cssText = `
                    flex: 1;
                    min-width: 60px;
                    padding: 3px;
                    cursor: pointer;
                `;
                presetContainer.appendChild(presetButton);
            });

            controlPanel.appendChild(presetContainer);

            // Add minimize button
            const minimizeBtn = document.createElement('button');
            minimizeBtn.textContent = '−';
            minimizeBtn.style.cssText = `
                position: absolute;
                top: 5px;
                right: 5px;
                width: 20px;
                height: 20px;
                padding: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                background: none;
                border: none;
                color: white;
                font-size: 16px;
            `;

            let minimized = false;
            const contentElements = [fpsDisplay, toggleButton, customFpsInput, presetContainer];

            minimizeBtn.onclick = function() {
                minimized = !minimized;
                minimizeBtn.textContent = minimized ? '+' : '−';

                contentElements.forEach(el => {
                    el.style.display = minimized ? 'none' : '';
                });

                if (minimized) {
                    controlPanel.style.padding = '5px 25px 5px 10px';
                } else {
                    controlPanel.style.padding = '10px';
                }
            };

            controlPanel.appendChild(minimizeBtn);
            document.body.appendChild(controlPanel);

            // Initial update
            updateFPSDisplay();
        }

        function updateFPSDisplay() {
            const display = document.getElementById('fps-display');
            if (display) {
                display.textContent = `FPS Cap: ${fpsCapEnabled ? (targetFPS === 0 ? 'Uncapped' : targetFPS) : 'Disabled'}`;
                display.style.color = fpsCapEnabled ? '#8ff' : '#f88';
            }
        }

        // Add accurate actual FPS counter using game loop detection
        let frameTimestamps = [];
        let actualFps = 0;

        // Create FPS display element
        const fpsCounter = document.createElement('div');
        fpsCounter.id = 'actual-fps-display';
        fpsCounter.style.cssText = `
            position: fixed;
            top: 0px;
            left: 0px;
            background-color: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 0px 0px;
            border-radius: 0px;
            z-index: 10000;
            font-family: Arial, sans-serif;
        `;
        fpsCounter.textContent = `Actual FPS: 0`;
        document.body.appendChild(fpsCounter);

        // Hook into the game's rendering cycle
        const originalDate = Date.now;
        const originalPerformanceNow = performance.now;

        // Create a more accurate frame counter by intercepting game loop timing functions
        function monitorGameFrames() {
            // Track canvas drawing operations
            const originalGetContext = HTMLCanvasElement.prototype.getContext;
            HTMLCanvasElement.prototype.getContext = function() {
                const context = originalGetContext.apply(this, arguments);
                if (arguments[0] === '2d' && context) {
                    const originalDrawImage = context.drawImage;
                    context.drawImage = function() {
                        recordFrame();
                        return originalDrawImage.apply(this, arguments);
                    };

                    const originalFillRect = context.fillRect;
                    context.fillRect = function() {
                        recordFrame();
                        return originalFillRect.apply(this, arguments);
                    };

                    const originalClearRect = context.clearRect;
                    context.clearRect = function() {
                        recordFrame();
                        return originalClearRect.apply(this, arguments);
                    };
                }
                return context;
            };

            // Monitor WebGL rendering too
            const originalRenderingContextClear = WebGLRenderingContext.prototype.clear;
            WebGLRenderingContext.prototype.clear = function() {
                recordFrame();
                return originalRenderingContextClear.apply(this, arguments);
            };

            if (typeof WebGL2RenderingContext !== 'undefined') {
                const originalWebGL2ContextClear = WebGL2RenderingContext.prototype.clear;
                WebGL2RenderingContext.prototype.clear = function() {
                    recordFrame();
                    return originalWebGL2ContextClear.apply(this, arguments);
                };
            }
        }

        // Record frame and calculate FPS
        function recordFrame() {
            const now = originalPerformanceNow.call(performance);
            frameTimestamps.push(now);

            // Keep only frames from the last second
            while (frameTimestamps.length > 0 && now - frameTimestamps[0] > 1000) {
                frameTimestamps.shift();
            }

            // Calculate FPS based on number of frames in the last second
            actualFps = frameTimestamps.length;

            // Update display at most 10 times per second to avoid performance issues
            if (Math.floor(now / 100) !== Math.floor((now - 16) / 100)) {
                fpsCounter.textContent = `Actual FPS: ${actualFps}`;
            }
        }

        // Start monitoring
        monitorGameFrames();

        console.log('[Evades.io FPS Cap Controller] Initialized');
    }
})();