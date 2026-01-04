// ==UserScript==
// @name         MiniClient - Syringe
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Enhance your MiniBlox experience
// @author       Syringe (Drapinqs)
// @match        https://miniblox.io/*
// @icon         https://cdn.discordapp.com/attachments/741464074986192918/1266539478781136958/miniclient75.png?ex=66a5844e&is=66a432ce&hm=8b9f2b3837225050260a044829102506f44cc6fd6b8ffa706052de573e626feb&
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/501877/MiniClient%20-%20Syringe.user.js
// @updateURL https://update.greasyfork.org/scripts/501877/MiniClient%20-%20Syringe.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Initial settings
    if (!GM_getValue("settings")) {
        GM_setValue("settings", JSON.stringify({
            inverted: false,
            showFps: true,  // Set default to true to show FPS by default
            showCrosshair: false,
            crosshairUrl: '',
            imageUrl: ''
        }));
    }

    // Add styles
    GM_addStyle(`
        .mbclient-settings {
            display: flex;
            padding: 10px;
            flex-direction: column;
            width: 95%;
            color: white;
            text-shadow: 1px 1px 0 black;
            background-color: rgba(31, 31, 31, 0.9);
            border: 3px solid rgb(174, 0, 255);
            border-radius: 10px;
            cursor: move;
        }

        .mbclient-setting {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: full;
            padding: 0.25rem;
        }

        .checkbox-round {
            width: 1.3em;
            height: 1.3em;
            background-color: rgb(255, 87, 87);
            border-radius: 20%;
            vertical-align: middle;
            border: 1px solid #ddd;
            appearance: none;
            -webkit-appearance: none;
            outline: none;
            cursor: pointer;
            transition: all ease 0.3s;
        }

        .checkbox-round:checked {
            background-color: rgb(134, 255, 78);
        }

        #fps-container {
            background-color: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 5px;
            border: 3px solid rgb(174, 0, 255);
            border-radius: 5px;
            font-size: 14px;
            position: fixed;
            top: 4px;
            left: 918px;
            z-index: 9999;
            cursor: move;
            display: block; /* Set to block by default */
        }

        /* Inverted colors */
        .inverted {
            filter: invert(1) hue-rotate(180deg);
        }

        /* Crosshair */
        #crosshair {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            pointer-events: none;
            z-index: 9999;
            display: none;
        }
    `);

    // Function to create settings panel
    function createSettingsPanel() {
        const settingsHTML = `
            <div id="settings" class="mbclient-settings">
                <p style="font-weight: bold; text-align: center; line-height: 95%; font-size: 140%;">MiniClient<br>by Syringe</p>
                <p style="text-align: center; font-size: 100%; color: rgb(219, 60, 48);"><i>use F8 to show/hide</i></p>
                <div class="mbclient-setting">
                    <label for="image-url">Custom Background</label>
                    <input style="width: 40%; border: 2px solid rgb(174, 0, 255); border-radius: 10px;" id="image-url" type="text" placeholder=" Enter image URL" />
                </div>
                <div class="mbclient-setting">
                    <label for="crosshair-url">Custom Crosshair</label>
                    <input style="width: 40%; border: 2px solid rgb(174, 0, 255); border-radius: 10px;" id="crosshair-url" type="text" placeholder=" Enter image URL" />
                </div>
                <div class="mbclient-setting">
                    <label for="inverted">Inverted Colors</label>
                    <input id="inverted" data-setting="inverted" type="checkbox" class="checkbox-round" value="false" />
                </div>
                <div class="mbclient-setting">
                    <label for="show-fps">Show FPS</label>
                    <input id="show-fps" data-setting="showFps" type="checkbox" class="checkbox-round" />
                </div>
            </div>
        `;
        const settingsElement = document.createElement('div');
        settingsElement.innerHTML = settingsHTML;
        settingsElement.style.position = "fixed";
        settingsElement.style.zIndex = "9999";
        settingsElement.style.top = "1rem";
        settingsElement.style.left = "1rem";
        document.body.appendChild(settingsElement);

        // Make sure settingsElement exists before trying to make it draggable
        if (settingsElement) {
            makeDraggable(settingsElement, "settingsTop", "settingsLeft");
        }

        // Add event listener for toggling the settings panel
        document.addEventListener('keydown', (event) => {
            if (event.key === "F8") {
                settingsElement.style.display = settingsElement.style.display === "none" ? "block" : "none";
            }
        });

        // Handle image URL input
        handleImageUrlInput();
        // Handle crosshair URL input
        handleCrosshairUrlInput();
        // Handle inverted colors
        handleInvertedColors();
        // Handle Show FPS
        handleShowFps();
    }

    // Function to make an element draggable
    function makeDraggable(element, localStorageKeyTop, localStorageKeyLeft) {
        let isDragging = false;
        let offsetX, offsetY;

        element.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - element.getBoundingClientRect().left;
            offsetY = e.clientY - element.getBoundingClientRect().top;
            element.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const newX = e.clientX - offsetX;
                const newY = e.clientY - offsetY;
                const rect = element.getBoundingClientRect();
                const parentRect = document.documentElement.getBoundingClientRect();

                // Prevent the element from being dragged out of the viewport
                const maxX = parentRect.width - rect.width;
                const maxY = parentRect.height - rect.height;

                const clampedX = Math.max(0, Math.min(newX, maxX));
                const clampedY = Math.max(0, Math.min(newY, maxY));

                element.style.left = `${clampedX}px`;
                element.style.top = `${clampedY}px`;

                // Save the position in GM storage
                GM_setValue(localStorageKeyTop, `${clampedY}px`);
                GM_setValue(localStorageKeyLeft, `${clampedX}px`);
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            element.style.cursor = 'move';
        });

        // Restore position from GM storage
        const savedTop = GM_getValue(localStorageKeyTop, '4px');
        const savedLeft = GM_getValue(localStorageKeyLeft, '918px');
        element.style.top = savedTop;
        element.style.left = savedLeft;
    }

    // Function to handle image URL input
    function handleImageUrlInput() {
        const urlInput = document.getElementById('image-url');
        const defaultImage = 'https://cdn.discordapp.com/attachments/741464074986192918/1266326290475122791/default-92b37f60.png';

        if (urlInput) {
            const settings = JSON.parse(GM_getValue('settings'));
            urlInput.value = settings.imageUrl || '';

            urlInput.addEventListener('input', () => {
                const newUrl = urlInput.value.trim();
                settings.imageUrl = newUrl || defaultImage;
                GM_setValue('settings', JSON.stringify(settings));
                replaceImageSource(settings.imageUrl);
            });

            if (settings.imageUrl && settings.imageUrl !== defaultImage) {
                replaceImageSource(settings.imageUrl);
            }
        }
    }

    // Function to replace image source
    function replaceImageSource(newUrl) {
        const imgElements = document.querySelectorAll('img.chakra-image');
        imgElements.forEach(img => {
            if (img.src.includes('/assets/default-92b37f60.png')) {
                img.src = newUrl;
            }
        });
    }

    // Function to handle crosshair URL input
    function handleCrosshairUrlInput() {
        const crosshairInput = document.getElementById('crosshair-url');
        const settings = JSON.parse(GM_getValue('settings'));

        if (crosshairInput) {
            crosshairInput.value = settings.crosshairUrl || '';

            crosshairInput.addEventListener('input', () => {
                const newUrl = crosshairInput.value.trim();
                settings.crosshairUrl = newUrl;
                GM_setValue('settings', JSON.stringify(settings));
                updateCrosshair(newUrl);
            });

            if (settings.crosshairUrl) {
                updateCrosshair(settings.crosshairUrl);
            }
        }
    }

    // Function to update crosshair
    function updateCrosshair(url) {
        let crosshair = document.getElementById('crosshair');

        if (!crosshair) {
            crosshair = document.createElement('img');
            crosshair.id = 'crosshair';
            document.body.appendChild(crosshair);
        }

        crosshair.src = url;
        crosshair.style.display = url ? 'block' : 'none';
    }

    // Function to handle color inversion
    function handleInvertedColors() {
        const invertedCheckbox = document.getElementById('inverted');
        const settings = JSON.parse(GM_getValue('settings'));

        if (invertedCheckbox) {
            invertedCheckbox.checked = settings.inverted;

            invertedCheckbox.addEventListener('change', () => {
                settings.inverted = invertedCheckbox.checked;
                GM_setValue('settings', JSON.stringify(settings));
                document.body.classList.toggle('inverted', settings.inverted);
            });

            // Apply initial state
            if (settings.inverted) {
                document.body.classList.add('inverted');
            }
        }
    }

    // Function to handle Show FPS checkbox
    function handleShowFps() {
        const showFpsCheckbox = document.getElementById('show-fps');
        const settings = JSON.parse(GM_getValue('settings'));

        if (showFpsCheckbox) {
            showFpsCheckbox.checked = settings.showFps;

            showFpsCheckbox.addEventListener('change', () => {
                settings.showFps = showFpsCheckbox.checked;
                GM_setValue('settings', JSON.stringify(settings));
                toggleFpsDisplay(settings.showFps);
            });

            // Apply initial state
            if (settings.showFps) {
                toggleFpsDisplay(true);
            }
        }
    }

    // Function to show or hide FPS display
    function toggleFpsDisplay(show) {
        let fpsContainer = document.getElementById('fps-container');
        if (show) {
            if (!fpsContainer) {
                fpsContainer = document.createElement('div');
                fpsContainer.id = 'fps-container';
                fpsContainer.style.position = 'fixed';
                fpsContainer.style.top = '4px';
                fpsContainer.style.left = '918px';
                fpsContainer.style.zIndex = '9999';
                fpsContainer.style.cursor = 'move';
                fpsContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                fpsContainer.style.color = 'white';
                fpsContainer.style.padding = '5px';
                fpsContainer.style.border = '3px solid rgb(174, 0, 255)';
                fpsContainer.style.borderRadius = '5px';
                fpsContainer.style.fontSize = '14px';
                document.body.appendChild(fpsContainer);

                // Make the fpsContainer draggable
                makeDraggable(fpsContainer, 'fpsTop', 'fpsLeft');
            }
            fpsContainer.style.display = 'block';
            showFps(); // Start FPS monitoring
        } else {
            if (fpsContainer) {
                fpsContainer.style.display = 'none';
            }
        }
    }

    // Function to show FPS
    function showFps() {
        const fpsContainer = document.getElementById('fps-container');
        if (!fpsContainer) return;

        let lastTime = performance.now();
        let frameCount = 0;
        let fps = 0;

        // Update FPS display
        const updateFpsDisplay = () => {
            fpsContainer.innerHTML = `<span id="fps">${fps}</span> FPS`;
        };

        // Calculate FPS based on frame count and time elapsed
        const calculateFps = () => {
            const now = performance.now();
            const deltaTime = now - lastTime;

            if (deltaTime > 0) {
                fps = Math.round((frameCount * 1000) / deltaTime);
                lastTime = now;
                frameCount = 0;
                updateFpsDisplay();
            }
        };

        // Request animation frame callback
        const frameCallback = () => {
            frameCount++;
            requestAnimationFrame(frameCallback);
        };

        // Start counting frames
        requestAnimationFrame(frameCallback);

        // Update FPS every 500 milliseconds
        setInterval(calculateFps, 500);
    }

    // Check settings and initialize
    function init() {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                const settings = JSON.parse(GM_getValue('settings'));
                console.log('Loaded settings:', settings); // Debug

                // Initialize settings panel
                createSettingsPanel();

                // Apply initial settings
                handleImageUrlInput();
                handleCrosshairUrlInput();
                handleInvertedColors();
                handleShowFps();
            }, 1000); // Apply settings after 1 second
        });
    }

    init();
})();
