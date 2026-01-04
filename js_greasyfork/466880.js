// ==UserScript==
// @name        [Huggingface] Text to Video Brute-Forcer
// @namespace   onlypuppy7
// @match       https://damo-vilab-modelscope-text-to-video-synthesis.hf.space/*
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_addStyle
// @grant       GM_registerMenuCommand
// @grant       GM_unregisterMenuCommand
// @grant       GM_getResourceText
// @grant       GM_getResourceURL
// @grant       GM_addElement
// @grant       GM_openInTab
// @version     1.0
// @author      onlypuppy7
// @description Clicks the generate button until success
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/466880/%5BHuggingface%5D%20Text%20to%20Video%20Brute-Forcer.user.js
// @updateURL https://update.greasyfork.org/scripts/466880/%5BHuggingface%5D%20Text%20to%20Video%20Brute-Forcer.meta.js
// ==/UserScript==

(() => {
    const intervalMs = 200;
    let isScriptInitiated = false;
    let framesSliderValue = GM_getValue("framesSliderValue", 32);

    let configMenu;
    let isMinimized = false;

    const observeSlider = setInterval(() => {
        const labelWrap = document.querySelector('.label-wrap');
        if (labelWrap) {
            labelWrap.click();
            const framesSlider = document.querySelector("#range_id_1");
            if (framesSlider) {
                clearInterval(observeSlider);
                setFramesSliderValue(framesSliderValue);
            }
        }
    }, 100);
    function checkForText() {
        if (isScriptInitiated) {
            const text = document.documentElement.textContent;
            if (text.includes("queue: ")) {
                console.log("Text found! Stopping...");
                setStatus("done");
                return;
            }

            const button = document.querySelector("#component-6");
            if (button) {
                button.click();
                console.log("Button clicked. Waiting for the next attempt...");
            }

            setTimeout(checkForText, intervalMs);
        }
    }

    function setFramesSliderValue(value) {
        const framesSlider = document.querySelector("#range_id_1");
        if (framesSlider) {
            framesSlider.value = value;
            framesSlider.dispatchEvent(new Event("input", { bubbles: true }));
            console.log(`Frames slider set to ${value}.`);
        }
    }

    function handleKeyPress(event) {
        if (event.key === "Enter") {
            startBruteForcer();
        }
    }

    function updateFramesSliderValue(newValue) {
        framesSliderValue = newValue;
        GM_setValue("framesSliderValue", newValue);
    }

    function minimizeMenu() {
        isMinimized = !isMinimized;
        const contentContainer = document.getElementById("config-menu-content");
        const minimizeButton = document.getElementById("minimize-button");
        if (contentContainer && minimizeButton) {
            contentContainer.style.display = isMinimized ? "none" : "block";
            minimizeButton.textContent = isMinimized ? "+" : "-";
        }
    }

    function createConfigMenu() {
        configMenu = document.createElement("div");
        configMenu.id = "config-menu";
        configMenu.style.position = "fixed";
        configMenu.style.top = "20px";
        configMenu.style.left = "20px";
        configMenu.style.zIndex = "9999";
        configMenu.style.background = "rgba(255, 255, 255, 0.9)";
        configMenu.style.border = "1px solid #ccc";
        configMenu.style.borderRadius = "5px";
        configMenu.style.padding = "10px";
        configMenu.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.2)";
        configMenu.innerHTML = `
            <div id="config-menu-header" style="display: flex; justify-content: space-between; align-items: center;">
                <span id="config-menu-title" style="font-weight: bold;">Brute-Forcer Config  </span>
                <button id="minimize-button" style="font-size: 16px; cursor: pointer;">-</button>
            </div>
            <div id="config-menu-content">
                <div>
                    <label for="frames-slider">Frames:</label>
                    <input type="number" id="frames-slider" min="16" max="32" step="1" style="width: 40px;">
                </div>
                <div>
                    <label>Press Enter to Start</label>
                </div>
                <button id="start-button">Start Brute-Forcer</button>
                <button id="download-button">Download MP4</button>
                <div id="status-area"></div>
            </div>
        `;

        document.body.appendChild(configMenu);

        const framesSlider = document.getElementById("frames-slider");
        if (framesSlider) {
            framesSlider.value = framesSliderValue;
            framesSlider.addEventListener("input", (event) => {
                const newValue = parseInt(event.target.value);
                updateFramesSliderValue(newValue);
            });
        }
        const startButton = document.getElementById("start-button");
        startButton.addEventListener("click", () => {
            startBruteForcer();
        });

        const downloadButton = document.getElementById("download-button");
        downloadButton.addEventListener("click", () => {
            const videoElement = document.querySelector('video');
            const filenameInput = document.querySelector('input[data-testid="textbox"]');
            if (videoElement && filenameInput) {
                const videoUrl = videoElement.getAttribute('src');
                const filename = filenameInput.value.trim();
                const pattern = /[^a-zA-Z0-9-_]/g;
                const sanitizedFilename = filename.replace(pattern, '_');
                if (sanitizedFilename) {
                    const anchorElement = document.createElement('a');
                    anchorElement.href = videoUrl;
                    anchorElement.download = sanitizedFilename + '.mp4';
                    anchorElement.click();
                } else {
                    console.log('Invalid filename.');
                }
            } else {
                console.log('Video element or filename input not found.');
            }

            function sanitizeFilename(filename) {
                // Regex pattern to replace invalid filename characters with underscores
            }
        });

        const minimizeButton = document.getElementById("minimize-button");
        minimizeButton.addEventListener("click", () => {
            minimizeMenu();
        });
    }

    function setStatus(status) {
        const statusArea = document.getElementById("status-area");
        if (statusArea) {
            statusArea.textContent = "";
            const statusIcon = document.createElement("span");
            statusIcon.className = "status-icon";
            statusArea.appendChild(statusIcon);
            statusArea.classList.remove("idle", "brute-forcing", "done");
            if (status === "idle") {
                statusArea.classList.add("idle");
            } else if (status === "brute-forcing") {
                statusArea.classList.add("brute-forcing");
                const loader = document.createElement("span");
                loader.className = "loader";
                statusArea.appendChild(loader);
            } else if (status === "done") {
                statusArea.classList.add("done");
            }
        }
    }

    function startBruteForcer() {
        console.log("Script initiated.");
        isScriptInitiated = true;
        setStatus("brute-forcing");
        checkForText();
    }

    function initializeScript() {
        GM_addStyle(`
            #config-menu {
                font-family: Arial, sans-serif;
                font-size: 14px;
                background-color: #fff;
                border: 1px solid #ccc;
                border-radius: 5px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
                padding: 10px;
                position: absolute;
                top: 20px;
                left: 20px;
                z-index: 9999;
            }

            #config-menu-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                background-color: #f0f0f0;
                padding: 5px;
                border-bottom: 1px solid #ccc;
            }

            #config-menu-content {
                margin-top: 10px;
            }

            #frames-slider,
            #frames-slider-value {
                display: inline-block;
            }

            #enter-toggle-checkbox {
                margin-left: 5px;
            }

            #start-button {
                margin-top: 10px;
            }

            #status-area {
                margin-top: 20px;
                display: flex;
                align-items: center;
            }

            .status-icon {
                display: inline-block;
                width: 10px;
                height: 10px;
                border-radius: 50%;
                margin-right: 5px;
            }

            .idle .status-icon {
                background-color: gray;
            }

            .brute-forcing .status-icon {
                background-color: darkblue;
            }

            .done .status-icon {
                background-color: green;
            }

            .loader {
                border: 3px solid #f3f3f3;
                border-top: 3px solid #3498db;
                border-radius: 50%;
                width: 10px;
                height: 10px;
                animation: spin 0.5s linear infinite;
                margin-left: 5px;
            }

            @keyframes spin {
                0% {
                    transform: rotate(0deg);
                }
                100% {
                    transform: rotate(360deg);
                }
            }
        `);

        createConfigMenu();
        setStatus("idle");
        document.addEventListener("keydown", handleKeyPress);
    }

    initializeScript();
})();
