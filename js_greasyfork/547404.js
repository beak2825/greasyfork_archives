// ==UserScript==
// @name         Hoobs Slither Mod – Hunter Edition [No Background | Zoom with mouse scroll]
// @namespace    http://tampermonkey.net/
// @version      0.9.7
// @description  Slither.io mod with modern glassmorphic UI
// @author       hoobs
// @match        http://slither.com/io
// @license      MIT
// @run-at       document-start
// @grant        unsafeWindow

// @downloadURL https://update.greasyfork.org/scripts/547404/Hoobs%20Slither%20Mod%20%E2%80%93%20Hunter%20Edition%20%5BNo%20Background%20%7C%20Zoom%20with%20mouse%20scroll%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/547404/Hoobs%20Slither%20Mod%20%E2%80%93%20Hunter%20Edition%20%5BNo%20Background%20%7C%20Zoom%20with%20mouse%20scroll%5D.meta.js
// ==/UserScript==

(function (win) {
    "use strict";

    /********** CORE MOD VARIABLES **********/
    const UNIQUE_MOD_VERSION = "v0.9.7";
    const DEFAULT_BG_COLOR = "#2a2a2a";
    let CURSOR_SIZE = 32;
    let CURSOR_OPACITY = 0.4;
    let backupBgImage = null;
    let originalBodyStyle = null;
    let customZoomLevel = 0.9;
    let connectAttempts = 0;
    let isInitialized = false;
    let gameStarted = false;
    let customBackgroundPattern = null;
    let backgroundNeedsUpdate = true;

    // Constants for physics
    const TURN_RATE = 0.1;
    const REACTION_FRAMES = 2;
    const PROJECTION_FRAMES = 3;
    const MAP_SIZE = 50000;
    const TURN_DURATION = 200;

    /********** HUD ELEMENTS **********/
    const HUD_CSS = `
        color: #FFF;
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        font-size: 14px;
        position: fixed;
        opacity: 0.35;
        z-index: 9999;
    `;
    let hudCoords = null;
    let hudServerInfo = null;
    let hudFrames = null;

    /********** HUNTER FEATURE VARIABLES **********/
    let harvestedPlayers = {};
    let friendsList = [];
    let currentTargetFriend = "";
    let lastKnownLocation = null;
    let blockedPlayers = {};
    let targetInfo = {};
    let autoAvoidEnabled = false;
    let avoidanceSensitivity = 50;
    let showDebugOverlay = false;
    let autoEatEnabled = false;
    let foodSearchRadius = 5000;
    let foodTarget = null;
    let isTurning = false;
    let turnDirection = 0;
    let turnStartTime = 0;
    let turnPurpose = null;

    /********** UI Elements **********/
    let nickInputElem = null;
    let sensitivitySliderContainer = null;

    // Arrow and not-found images
    let arrowImg = new Image();
    arrowImg.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><path fill="#A0A0A0" d="M64 1L17.9 127 64 99.8l46.1 27.2L64 1zM64 21.4l32.6 89.2L64 91.3V21.4z"/></svg>`);

    let notFoundImg = new Image();
    notFoundImg.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(`<svg style="fill: rgba(255,255,255,0.76);" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><path d="M642.077 960.295c0-175.276 142.637-317.913 317.912-317.913 68.458 0 130.45 23.632 182.27 60.721L702.8 1142.564c-37.09-51.82-60.722-113.812-60.722-182.27ZM1717.257 128l75.027 75.027-573.726 573.62-442.216 442.216-573.62 573.726-75.027-75.027 283.79-283.684c-26.811-17.273-54.151-35.924-82.128-57.118C199.225 1275.346 89.651 1139.597 11.87 984.032L0 960.401l11.763-23.738C199.437 559.09 562.81 324.47 959.989 324.47c111.376 0 220.314 18.545 323.847 54.999 42.282 13.246 85.519 32.003 128.649 53.409L1717.257 128Zm-121.422 421.16C1723 648.666 1831.091 783.355 1908.45 937.013l11.55 23.313-11.55 23.208c-187.675 378.422-551.049 612.617-948.44 612.617-111.269 0-220.419-18.015-324.27-55.105l-23.314-8.477 266.199-266.305c26.069 7.1 52.985 11.975 81.386 11.975 175.275 0 317.912-142.637 317.912-317.913 0-28.4-4.875-55.316-11.869-81.385Z"/></svg>`);

    /********** Manage Hunt Popup Variables **********/
    let huntPopup = null;
    let huntGridHarvested, huntGridTargets;

    /********** Icons **********/
    const iconAdd = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='%23ffffff'><g data-name='51.Add'><path d='M12 24a12 12 0 1 1 12-12 12.013 12.013 0 0 1-12 12zm0-22a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2z'/><path d='M11 6h2v12h-2z'/><path d='M6 11h12v2H6z'/></g></svg>`;
    const iconDelete = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 22 22' fill='%23ffffff'><path d='M11 22A11 11 0 1 0 0 11a11 11 0 0 0 11 11zM5 10h12v2H5z'/></svg>`;
    const iconBlock = `data:image/svg+xml;utf8,<svg fill='%23fff' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><path d='M12 22A10 10 0 1 1 12 2a10 10 0 0 1 0 20zm6-10a6 6 0 0 0-6-6 5.96 5.96 0 0 0-4.247 1.753l8.494 8.494A5.96 5.96 0 0 0 18 12zm-12 0a6 6 0 0 0 6 6 5.96 5.96 0 0 0 4.247-1.753l-8.494-8.494A5.96 5.96 0 0 0 6 12z'/></svg>`;

    /********** Persistence **********/
    const STORAGE_KEYS = {
        harvested: "hsm_harvestedPlayers",
        friends: "hsm_friendsList",
        blocked: "hsm_blockedPlayers",
        lastKnown: "hsm_lastKnownLocation",
        targetInfo: "hsm_targetInfo",
        defaultBgEnabled: "hsm_defaultBgEnabled",
        bgColor: "hsm_bgColor",
        cursorSize: "hsm_cursorSize",
        cursorOpacity: "hsm_cursorOpacity",
        autoAvoid: "hsm_autoAvoidEnabled",
        avoidanceSensitivity: "hsm_avoidanceSensitivity",
        showDebugOverlay: "hsm_showDebugOverlay",
        autoEat: "hsm_autoEatEnabled",
        foodSearchRadius: "hsm_foodSearchRadius"
    };

    function updateSliderValue(slider, event, min, max, callback, isFloat = false) {
        const rect = slider.getBoundingClientRect();
        const width = rect.width;
        let position = (event.clientX - rect.left) / width;
        position = Math.max(0, Math.min(1, position));
        const range = max - min;
        let value = min + position * range;
        if (slider.step) {
            const step = parseFloat(slider.step);
            value = Math.round(value / step) * step;
        }
        value = Math.max(min, Math.min(max, value));
        slider.value = value;
        callback(isFloat ? parseFloat(value.toFixed(1)) : Math.round(value));
    }

 function waitForCanvas() {
    let canvas = document.querySelector('canvas.nsi') || document.getElementsByTagName('canvas')[0];
    if (canvas) {
        //console.log('Canvas found:', canvas);
        win.gameCanvas = canvas;
        initialize();
        return;
    }

    console.warn('Canvas not found, retrying...');
    setTimeout(waitForCanvas, 100);
}

    function setCustomBackgroundColor(color) {
        if (!win.bgi2 || !(win.bgi2 instanceof HTMLCanvasElement)) {
            console.warn("[setCustomBackgroundColor] win.bgi2 is invalid or missing. Reinitializing...");
            win.bgi2 = document.createElement("canvas");
            win.bgi2.width = window.innerWidth;
            win.bgi2.height = window.innerHeight;
            win.bgi2.style.display = "none";
            document.body.appendChild(win.bgi2);
        }
        if (win.bgi2.width === 0 || win.bgi2.height === 0) {
            win.bgi2.width = window.innerWidth;
            win.bgi2.height = window.innerHeight;
        }
        const bgCanvas = win.bgi2.getContext("2d");
        if (!bgCanvas) {
            console.error("[setCustomBackgroundColor] Error: Could not get 2D context for win.bgi2.");
            return;
        }
        bgCanvas.clearRect(0, 0, win.bgi2.width, win.bgi2.height);
        bgCanvas.fillStyle = color;
        bgCanvas.fillRect(0, 0, win.bgi2.width, win.bgi2.height);
        if (typeof win.setBgp2 === "function") {
            win.setBgp2(win.bgi2);
        } else {
            win.bgp2 = win.bgi2;
        }
        customBackgroundPattern = null;
        backgroundNeedsUpdate = false;
        document.body.style.background = "none";
        document.body.style.backgroundColor = color;
    }

    function loadPersistentData() {
        try {
            let data;
            data = win.localStorage.getItem(STORAGE_KEYS.harvested); if (data) harvestedPlayers = JSON.parse(data);
            data = win.localStorage.getItem(STORAGE_KEYS.friends); if (data) friendsList = JSON.parse(data);
            data = win.localStorage.getItem(STORAGE_KEYS.blocked); if (data) blockedPlayers = JSON.parse(data);
            data = win.localStorage.getItem(STORAGE_KEYS.lastKnown); if (data) lastKnownLocation = JSON.parse(data);
            data = win.localStorage.getItem(STORAGE_KEYS.targetInfo); if (data) targetInfo = JSON.parse(data);
            data = win.localStorage.getItem(STORAGE_KEYS.bgColor); if (!data) win.localStorage.setItem(STORAGE_KEYS.bgColor, DEFAULT_BG_COLOR);
            data = win.localStorage.getItem(STORAGE_KEYS.cursorSize); CURSOR_SIZE = data ? parseInt(data) : 32;
            data = win.localStorage.getItem(STORAGE_KEYS.cursorOpacity); CURSOR_OPACITY = data ? parseFloat(data) : 0.4;
            data = win.localStorage.getItem(STORAGE_KEYS.autoAvoid); autoAvoidEnabled = data ? JSON.parse(data) : false;
            data = win.localStorage.getItem(STORAGE_KEYS.avoidanceSensitivity); avoidanceSensitivity = data ? parseInt(data) : 50;
            data = win.localStorage.getItem(STORAGE_KEYS.showDebugOverlay); showDebugOverlay = data ? JSON.parse(data) : false;
            data = win.localStorage.getItem(STORAGE_KEYS.autoEat); autoEatEnabled = data ? JSON.parse(data) : false;
            data = win.localStorage.getItem(STORAGE_KEYS.foodSearchRadius); foodSearchRadius = data ? parseInt(data) : 5000;
        } catch (e) {
            console.error("[persist] Error loading data:", e);
        }
    }

    function savePersistentData() {
        try {
            win.localStorage.setItem(STORAGE_KEYS.harvested, JSON.stringify(harvestedPlayers));
            win.localStorage.setItem(STORAGE_KEYS.friends, JSON.stringify(friendsList));
            win.localStorage.setItem(STORAGE_KEYS.blocked, JSON.stringify(blockedPlayers));
            win.localStorage.setItem(STORAGE_KEYS.lastKnown, JSON.stringify(lastKnownLocation));
            win.localStorage.setItem(STORAGE_KEYS.targetInfo, JSON.stringify(targetInfo));
            win.localStorage.setItem(STORAGE_KEYS.cursorSize, CURSOR_SIZE);
            win.localStorage.setItem(STORAGE_KEYS.cursorOpacity, CURSOR_OPACITY);
            win.localStorage.setItem(STORAGE_KEYS.autoAvoid, JSON.stringify(autoAvoidEnabled));
            win.localStorage.setItem(STORAGE_KEYS.avoidanceSensitivity, avoidanceSensitivity);
            win.localStorage.setItem(STORAGE_KEYS.showDebugOverlay, JSON.stringify(showDebugOverlay));
            win.localStorage.setItem(STORAGE_KEYS.autoEat, JSON.stringify(autoEatEnabled));
            win.localStorage.setItem(STORAGE_KEYS.foodSearchRadius, foodSearchRadius);
        } catch (e) {
            console.error("[persist] Error saving data:", e);
        }
    }

    /********** Helper Functions **********/
    function createDiv(id, className, style) {
        const divElem = document.createElement("div");
        if (id) divElem.id = id;
        if (className) divElem.className = className;
        if (style) divElem.style = style;
        document.body.appendChild(divElem);
    }

    function initializeSlithers() {
        const snakeArray = findSnakeArray();
        if (snakeArray) {
            win.slithers = snakeArray;
        } else {
            win.slithers = [];
        }
    }

    function findSnakeArray() {
        const possibleNames = ["slithers", "snakes", "allSnakes", "snakeArray"];
        for (const name of possibleNames) {
            if (win[name] && Array.isArray(win[name]) && win[name].length > 0 && win[name][0]?.nk) {
                return win[name];
            }
        }
        setTimeout(findSnakeArray, 1000);
        return null;
    }

    function createModInfo() {
        if (document.getElementById("mod-info")) return;
        const loginDiv = document.getElementById("login") || document.body;
        if (!loginDiv) return;

        const modInfoDiv = document.createElement("div");
        modInfoDiv.id = "mod-info";
        modInfoDiv.style.position = "relative";
        modInfoDiv.style.textAlign = "center";
        modInfoDiv.style.margin = "20px auto";
        modInfoDiv.style.padding = "15px";
        modInfoDiv.style.background = "rgba(20, 20, 30, 0.85)";
        modInfoDiv.style.color = "#FFF";
        modInfoDiv.style.border = "1px solid rgba(255,255,255,0.4)";
        modInfoDiv.style.borderRadius = "10px";
        modInfoDiv.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
        modInfoDiv.style.zIndex = "10000";
        modInfoDiv.style.width = "fit-content";
        modInfoDiv.style.boxShadow = "0px 0px 15px rgba(0,0,0,0.5)";
        loginDiv.insertBefore(modInfoDiv, loginDiv.firstChild);

        const title = document.createElement("div");
        title.textContent = `Hoobs Slither Mod – Hunter Edition ${UNIQUE_MOD_VERSION}`;
        title.style.fontSize = "18px";
        title.style.marginBottom = "10px";
        modInfoDiv.appendChild(title);

        const author = document.createElement("div");
        author.textContent = "Author: hoobs";
        author.style.fontSize = "14px";
        author.style.marginBottom = "10px";
        modInfoDiv.appendChild(author);

        const shortcuts = document.createElement("div");
        shortcuts.style.fontSize = "14px";
        shortcuts.style.marginBottom = "15px";
        shortcuts.innerHTML = `
            <strong>Shortcuts:</strong><br>
            Tab: Manage Hunt<br>
            Esc: Quick Respawn<br>
            Q: Quit to Menu<br>
            Z: Restore Zoom<br>
            E: Toggle Auto-Eat<br>
            C: Toggle Auto-Avoid
        `;
        modInfoDiv.appendChild(shortcuts);

        const manageHuntBtn = document.createElement("button");
        manageHuntBtn.textContent = "Manage Hunt";
        manageHuntBtn.style.background = "#4CAF50";
        manageHuntBtn.style.color = "#FFF";
        manageHuntBtn.style.border = "none";
        manageHuntBtn.style.borderRadius = "5px";
        manageHuntBtn.style.padding = "8px 16px";
        manageHuntBtn.style.cursor = "pointer";
        manageHuntBtn.style.fontSize = "14px";
        manageHuntBtn.onclick = toggleHuntPopup;
        modInfoDiv.appendChild(manageHuntBtn);
    }

    function setupPlayButton() {
        const playButton = document.getElementById("playh");
        if (!playButton) {
            setTimeout(setupPlayButton, 100);
            return;
        }

        const originalOnClick = playButton.onclick || function() {
            if (win.connect) win.connect();
        };

        playButton.onclick = function(e) {
            if (!win.connect || !win.bso || !win.snake) {
                return;
            }
            originalOnClick.call(playButton, e);
            win.forcing = true;
        };

        const nickInput = document.getElementById("nick");
        if (nickInput) {
            const storedNick = win.localStorage.getItem("nick") || "";
            nickInput.value = storedNick;
        }
    }

    function loadSettings() {
        try {
            const storedNick = win.localStorage.getItem("nick");
            if (storedNick !== null && nickInputElem) nickInputElem.value = storedNick;
        } catch (err) {
            console.error("Error in loadSettings:", err);
        }
    }

    /********** Sensitivity Slider **********/
    function createSensitivitySlider() {
        sensitivitySliderContainer = document.createElement("div");
        sensitivitySliderContainer.id = "sensitivity-slider-container";
        sensitivitySliderContainer.style.position = "fixed";
        sensitivitySliderContainer.style.top = "10px";
        sensitivitySliderContainer.style.left = "50%";
        sensitivitySliderContainer.style.transform = "translateX(-50%)";
        sensitivitySliderContainer.style.display = "flex";
        sensitivitySliderContainer.style.alignItems = "center";
        sensitivitySliderContainer.style.gap = "10px";
        sensitivitySliderContainer.style.background = "rgba(20, 20, 30, 0.85)";
        sensitivitySliderContainer.style.padding = "5px 10px";
        sensitivitySliderContainer.style.border = "1px solid rgba(255,255,255,0.4)";
        sensitivitySliderContainer.style.borderRadius = "5px";
        sensitivitySliderContainer.style.zIndex = "10002";
        sensitivitySliderContainer.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
        sensitivitySliderContainer.style.color = "#FFF";
        document.body.appendChild(sensitivitySliderContainer);

        const label = document.createElement("span");
        label.textContent = "Auto-Avoid Sensitivity: Aggressive | Defensive";
        label.style.fontSize = "12px";
        label.title = "Slide left for aggressive play (minimal avoidance, closer to snakes) or right for defensive play (maximum avoidance, keeps well away).";
        sensitivitySliderContainer.appendChild(label);

        const sliderWrapper = document.createElement("div");
        sliderWrapper.style.position = "relative";
        sliderWrapper.style.width = "150px";
        sensitivitySliderContainer.appendChild(sliderWrapper);

        const gradientOverlay = document.createElement("div");
        gradientOverlay.style.position = "absolute";
        gradientOverlay.style.top = "0";
        gradientOverlay.style.left = "0";
        gradientOverlay.style.width = "100%";
        gradientOverlay.style.height = "100%";
        gradientOverlay.style.background = "linear-gradient(to right, red, yellow, green)";
        gradientOverlay.style.opacity = "0.3";
        gradientOverlay.style.pointerEvents = "none";
        sliderWrapper.appendChild(gradientOverlay);

        const slider = document.createElement("input");
        slider.type = "range";
        slider.min = "0";
        slider.max = "100";
        slider.value = avoidanceSensitivity;
        slider.style.width = "150px";
        slider.style.position = "relative";
        slider.style.zIndex = "1";
        sliderWrapper.appendChild(slider);

        const valueDisplay = document.createElement("span");
        valueDisplay.textContent = avoidanceSensitivity;
        valueDisplay.style.fontSize = "12px";
        sensitivitySliderContainer.appendChild(valueDisplay);

        const resetButton = document.createElement("button");
        resetButton.textContent = "Reset";
        resetButton.style.background = "#444";
        resetButton.style.color = "#fff";
        resetButton.style.border = "none";
        resetButton.style.borderRadius = "5px";
        resetButton.style.cursor = "pointer";
        resetButton.style.padding = "2px 6px";
        resetButton.style.fontSize = "12px";
        resetButton.onclick = function(e) {
            e.stopPropagation();
            avoidanceSensitivity = 50;
            slider.value = avoidanceSensitivity;
            valueDisplay.textContent = avoidanceSensitivity;
            win.localStorage.setItem(STORAGE_KEYS.avoidanceSensitivity, avoidanceSensitivity);
        };
        sensitivitySliderContainer.appendChild(resetButton);

        const debugToggleContainer = document.createElement("div");
        debugToggleContainer.style.display = "flex";
        debugToggleContainer.style.alignItems = "center";
        sensitivitySliderContainer.appendChild(debugToggleContainer);

        const debugToggle = document.createElement("input");
        debugToggle.type = "checkbox";
        debugToggle.id = "toggle-debug-overlay";
        debugToggle.checked = showDebugOverlay;
        debugToggle.style.marginRight = "4px";
        debugToggle.onchange = function(e) {
            e.stopPropagation();
            showDebugOverlay = debugToggle.checked;
            win.localStorage.setItem(STORAGE_KEYS.showDebugOverlay, JSON.stringify(showDebugOverlay));
        };
        debugToggleContainer.appendChild(debugToggle);

        const debugLabel = document.createElement("label");
        debugLabel.textContent = "Debug Overlay";
        debugLabel.style.color = "#fff";
        debugLabel.style.fontSize = "12px";
        debugLabel.setAttribute("for", "toggle-debug-overlay");
        debugToggleContainer.appendChild(debugLabel);

        let isDraggingSensitivity = false;
        slider.addEventListener("mousedown", (e) => {
            e.stopPropagation();
            isDraggingSensitivity = true;
            updateSliderValue(slider, e, 0, 100, (value) => {
                avoidanceSensitivity = value;
                valueDisplay.textContent = avoidanceSensitivity;
                win.localStorage.setItem(STORAGE_KEYS.avoidanceSensitivity, avoidanceSensitivity);
            });
        });

        document.addEventListener("mousemove", (e) => {
            if (isDraggingSensitivity) {
                e.stopPropagation();
                updateSliderValue(slider, e, 0, 100, (value) => {
                    avoidanceSensitivity = value;
                    valueDisplay.textContent = avoidanceSensitivity;
                    win.localStorage.setItem(STORAGE_KEYS.avoidanceSensitivity, avoidanceSensitivity);
                });
            }
        });

        document.addEventListener("mouseup", (e) => {
            if (isDraggingSensitivity) {
                e.stopPropagation();
                isDraggingSensitivity = false;
            }
        });

        function updateSliderVisibility() {
            sensitivitySliderContainer.style.display = autoAvoidEnabled ? "flex" : "none";
        }
        updateSliderVisibility();

        const autoAvoidToggle = huntPopup?.querySelector("#toggle-auto-avoid");
        if (autoAvoidToggle) {
            autoAvoidToggle.onchange = function(e) {
                autoAvoidEnabled = this.checked;
                console.log(`Auto Avoid toggle changed.  autoEatEnabled is now: ${autoEatEnabled}`); // Add this
                savePersistentData();
                updateSliderVisibility();
            };
        }
    }

    /********** Overlay Canvas **********/
    let overlayCanvas = null;
    let overlayCtx = null;

    function createOverlayCanvas() {
        overlayCanvas = document.createElement("canvas");
        overlayCanvas.id = "hunter-overlay";
        overlayCanvas.style.position = "absolute";
        overlayCanvas.style.left = "0";
        overlayCanvas.style.top = "0";
        overlayCanvas.style.pointerEvents = "none";
        overlayCanvas.style.zIndex = "10000";
        document.body.appendChild(overlayCanvas);
        resizeOverlayCanvas();

        window.addEventListener("resize", resizeOverlayCanvas);
        requestAnimationFrame(updateHunterOverlay);
    }

    function resizeOverlayCanvas() {
        if (overlayCanvas) {
            overlayCanvas.width = window.innerWidth;
            overlayCanvas.height = window.innerHeight;
            overlayCtx = overlayCanvas.getContext("2d");
            if (!overlayCtx) {
                console.error("[overlay] Failed to get 2D context for overlayCanvas");
            }
        }
    }

    /********** Zoom Handling **********/
function modifyResize() {
    if (win.resize) {
        const originalResize = win.resize;
        win.resize = function() {
            const currentZoom = customZoomLevel || 0.9;
            originalResize.apply(win, arguments);
            win.gsc = customZoomLevel = currentZoom;
            // Fallback: Force gsc in case Slither.io overrides it immediately
            setTimeout(() => {
                if (win.gsc !== customZoomLevel) {
                    win.gsc = customZoomLevel;
                }
            }, 0);
        };
    } else {
        console.warn('[modifyResize] resize function not found, retrying...');
        setTimeout(modifyResize, 100);
    }
}

    modifyResize();

   

    function handleZoom(e) {
        try {
            if (!win.gsc || !win.playing) return;
            customZoomLevel *= Math.pow(0.9, e.wheelDelta / -120 || e.detail / 2 || 0);
            win.gsc = customZoomLevel;
        } catch (err) {
            console.error("Error in handleZoom:", err);
        }
    }

    function restoreZoom() {
        try {
            customZoomLevel = 0.9;
            win.gsc = customZoomLevel;
        } catch (err) {
            console.error("Error in restoreZoom:", err);
        }
    }

    /********** Key Bindings **********/
    function handleKeyBindings(ev) {
        try {
            switch (ev.keyCode) {
                case 27: quickRespawn(); break;
                case 81: quitToMenu(); break;
                case 90: restoreZoom(); break;
                case 9: toggleHuntPopup(); break;
                case 69: // E key for Auto-Eat
                    autoEatEnabled = !autoEatEnabled;
                    console.log(`E Key Pressed - autoEatEnabled is now: ${autoEatEnabled}`);

                    savePersistentData();
                    updateFoodSearchSliderVisibility();
                    break;
                case 67: // C key for Auto-Avoid
                    autoAvoidEnabled = !autoAvoidEnabled;
                    console.log(`C Key Pressed - autoAvoidEnabled is now: ${autoAvoidEnabled}`); // <--- Correct variable here

                    savePersistentData();
                    updateAvoidanceSliderVisibility();
                    break;
            }
        } catch (err) {
            console.error("Error in handleKeyBindings:", err);
        }
    }

  /********** Left-Click Nearest Player Selection **********/
     function selectNearestPlayer(e) {
         // Ignore clicks not originating from left mouse button, clicks inside the popup, or if slithers array is not ready
         if (e.button !== 0 || e.target.closest("#hunt-popup") || !win.slithers || !Array.isArray(win.slithers)) {
             console.log("[selectNearestPlayer]: Selection aborted: Invalid click target or slithers not ready."); // Debug log
             return;
         }

         // Ensure the player's snake object and its ID are available
         if (!win.snake || typeof win.snake.id === 'undefined') {
            console.log("[selectNearestPlayer]: Selection aborted: Player snake or ID not available."); // Debug log
            return; // Can't reliably check for self if player snake info is missing
         }
         const myId = win.snake.id; // Get the player's unique snake ID

         // --- Optional: Add for debugging ---
         console.log(`[selectNearestPlayer]: Click registered. My ID: ${myId}`);
         // --- End Debugging ---


         const clickX = e.clientX;
         const clickY = e.clientY;
         let nearest = null;
         let nearestDistSq = Infinity;


         for (const s of win.slithers) {

             // --- Optional: Add for debugging ---
             if (s.id === myId) {
                  console.log(`[selectNearestPlayer]: Checking self (ID: ${s.id}). Should be skipped.`);
             }
             // --- End Debugging ---

             // Skip if:
             // 1. Snake has no name (!s.nk) - Still useful for basic validity
             // 2. Snake has invalid coordinates (typeof checks)
             // 3. *** The snake's ID (s.id) matches the player's ID (myId) ***
             if (!s.nk || typeof s.xx !== "number" || typeof s.yy !== "number" || typeof s.id === 'undefined' || s.id === myId) {
                 continue; // Go to the next snake in the loop
             }

             // Calculate snake's position on screen
             const screenX = (s.xx - (win.view_xx || 0)) * (win.gsc || 1) + window.innerWidth / 2;
             const screenY = (s.yy - (win.view_yy || 0)) * (win.gsc || 1) + window.innerHeight / 2;

             // Calculate distance from click to this snake
             const dx = screenX - clickX;
             const dy = screenY - clickY;
             const distSq = dx * dx + dy * dy;

             // If this snake is closer than the current nearest, update nearest
             if (distSq < nearestDistSq) {
                 nearestDistSq = distSq;
                 nearest = s;
             }
         }

         // If a nearest snake (that is not self) was found
         if (nearest) {
             // --- Optional: Add for debugging ---
             console.log(`[selectNearestPlayer]: Selected nearest snake: ${nearest.nk} (ID: ${nearest.id})`);
             // --- End Debugging ---

             // Add the nearest snake's name to the friends list if not already present
             if (!friendsList.includes(nearest.nk)) {
                 friendsList.push(nearest.nk);
             }
             // Set this snake as the current target
             currentTargetFriend = nearest.nk;
             // Save the updated lists
             savePersistentData();
             // Optionally update the hunt popup if it's open
             if (huntPopup && huntPopup.style.display === "block") {
                 updateHuntPopup();
             }
         } else {
              // --- Optional: Add for debugging ---
             console.log("[selectNearestPlayer]: No valid nearest snake found.");
             // --- End Debugging ---
         }
     }

    document.addEventListener("click", selectNearestPlayer, false);

    /********** Update Harvested Players / Target Info **********/
    function updateHarvestedPlayers() {
        if (win.slithers && Array.isArray(win.slithers)) {
            win.slithers.forEach((s) => {
                if (s.nk && typeof s.nk === "string") {
                    if (friendsList.includes(s.nk)) {
                        targetInfo[s.nk] = { lastSeen: Date.now(), x: s.xx, y: s.yy };
                    } else {
                        harvestedPlayers[s.nk] = { lastSeen: Date.now(), x: s.xx, y: s.yy };
                    }
                }
            });
            savePersistentData();
            updateHuntPopup();
        }
    }

    /********** Format Time Ago **********/
    function formatTimeAgo(timestamp) {
        const now = Date.now();
        const diffDays = (now - timestamp) / (1000 * 3600 * 24);
        if (diffDays < 1) return "today";
        if (diffDays < 2) return "1 day ago";
        if (diffDays < 7) return `${Math.floor(diffDays)} days ago`;
        if (diffDays < 30) return "more than a week ago";
        if (diffDays < 180) return "more than a month ago";
        if (diffDays < 365) return "more than 6 months ago";
        return "more than 12 months ago";
    }

    /********** Manage Hunt Popup **********/
    function createHuntPopup() {
        huntPopup = document.createElement("div");
        huntPopup.id = "hunt-popup";
        huntPopup.style.position = "fixed";
        huntPopup.style.top = "20%";
        huntPopup.style.left = "20%";
        huntPopup.style.width = "60%";
        huntPopup.style.height = "60%";
        huntPopup.style.background = "rgba(20, 20, 30, 0.85)";
        huntPopup.style.color = "#FFF";
        huntPopup.style.zIndex = "10003";
        huntPopup.style.border = "1px solid rgba(255,255,255,0.4)";
        huntPopup.style.borderRadius = "10px";
        huntPopup.style.padding = "15px";
        huntPopup.style.overflowY = "auto";
        huntPopup.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
        huntPopup.style.boxShadow = "0px 0px 15px rgba(0,0,0,0.5)";
        huntPopup.style.display = "none";
        document.body.appendChild(huntPopup);

        const titleBar = document.createElement("div");
        titleBar.style.display = "flex";
        titleBar.style.justifyContent = "space-between";
        titleBar.style.alignItems = "center";
        titleBar.style.marginBottom = "10px";
        huntPopup.appendChild(titleBar);

        let title = document.createElement("div");
        title.textContent = "Hunter Target Management";
        title.style.fontSize = "22px";
        title.style.flex = "1";
        title.style.textAlign = "center";
        titleBar.appendChild(title);

        let closeBtn = document.createElement("button");
        closeBtn.textContent = "Close";
        closeBtn.style.background = "#900";
        closeBtn.style.color = "#FFF";
        closeBtn.style.border = "none";
        closeBtn.style.borderRadius = "5px";
        closeBtn.style.cursor = "pointer";
        closeBtn.style.padding = "5px 10px";
        closeBtn.onclick = toggleHuntPopup;
        titleBar.appendChild(closeBtn);

        const optionsBar = document.createElement("div");
        optionsBar.style.display = "flex";
        optionsBar.style.alignItems = "center";
        optionsBar.style.gap = "15px";
        optionsBar.style.padding = "10px";
        optionsBar.style.background = "rgba(0, 0, 0, 0.2)";
        optionsBar.style.borderRadius = "5px";
        optionsBar.style.marginBottom = "15px";
        huntPopup.appendChild(optionsBar);

        let bgToggleContainer = document.createElement("div");
        bgToggleContainer.style.display = "flex";
        bgToggleContainer.style.alignItems = "center";
        optionsBar.appendChild(bgToggleContainer);

        let bgToggle = document.createElement("input");
        bgToggle.type = "checkbox";
        bgToggle.id = "toggle-default-bg";
        let storedBgToggle = win.localStorage.getItem(STORAGE_KEYS.defaultBgEnabled) || "false";
        bgToggle.checked = storedBgToggle === "true";
        bgToggle.style.marginRight = "4px";
        bgToggle.onchange = function() {
            win.localStorage.setItem(STORAGE_KEYS.defaultBgEnabled, bgToggle.checked ? "true" : "false");
            if (win.playing) backgroundNeedsUpdate = true;
        };
        bgToggleContainer.appendChild(bgToggle);

        let bgToggleLabel = document.createElement("label");
        bgToggleLabel.textContent = "Default BG";
        bgToggleLabel.style.color = "#fff";
        bgToggleLabel.style.fontSize = "12px";
        bgToggleLabel.setAttribute("for", "toggle-default-bg");
        bgToggleContainer.appendChild(bgToggleLabel);

        const colorPickerContainer = document.createElement("div");
        colorPickerContainer.style.display = "flex";
        colorPickerContainer.style.alignItems = "center";
        colorPickerContainer.style.position = "relative";
        optionsBar.appendChild(colorPickerContainer);

        const colorLabel = document.createElement("span");
        colorLabel.textContent = "BG Color:";
        colorLabel.style.marginRight = "8px";
        colorLabel.style.fontSize = "12px";
        colorPickerContainer.appendChild(colorLabel);

        const colorSwatch = document.createElement("div");
        colorSwatch.style.width = "20px";
        colorSwatch.style.height = "20px";
        colorSwatch.style.border = "1px solid rgba(255,255,255,0.6)";
        colorSwatch.style.borderRadius = "4px";
        colorSwatch.style.cursor = "pointer";
        colorSwatch.style.backgroundColor = win.localStorage.getItem(STORAGE_KEYS.bgColor) || DEFAULT_BG_COLOR;
        colorPickerContainer.appendChild(colorSwatch);

        const colorPicker = document.createElement("div");
        colorPicker.style.position = "absolute";
        colorPicker.style.top = "30px";
        colorPicker.style.left = "0";
        colorPicker.style.background = "rgba(30, 30, 40, 0.95)";
        colorPicker.style.border = "1px solid rgba(255,255,255,0.3)";
        colorPicker.style.borderRadius = "6px";
        colorPicker.style.padding = "10px";
        colorPicker.style.display = "none";
        colorPicker.style.zIndex = "10004";
        colorPicker.style.width = "200px";
        colorPickerContainer.appendChild(colorPicker);

        const swatchTypeContainer = document.createElement("div");
        swatchTypeContainer.style.marginBottom = "10px";
        colorPicker.appendChild(swatchTypeContainer);

        const swatchTypeLabel = document.createElement("span");
        swatchTypeLabel.textContent = "Swatch Type: ";
        swatchTypeLabel.style.marginRight = "5px";
        swatchTypeContainer.appendChild(swatchTypeLabel);

        const swatchTypeSelect = document.createElement("select");
        swatchTypeSelect.style.background = "rgba(255,255,255,0.1)";
        swatchTypeSelect.style.color = "#FFF";
        swatchTypeSelect.style.border = "1px solid #666";
        swatchTypeSelect.style.borderRadius = "4px";
        swatchTypeSelect.style.padding = "2px";
        swatchTypeContainer.appendChild(swatchTypeSelect);

        const swatchTypes = [
            { value: "darkGrey", label: "Dark Grey Tones" },
            { value: "lightGrey", label: "Light Grey Tones" },
            { value: "rainbow", label: "Rainbow" },
            { value: "fullSpectrum", label: "Full Spectrum" }
        ];
        swatchTypes.forEach(type => {
            const option = document.createElement("option");
            option.value = type.value;
            option.textContent = type.label;
            swatchTypeSelect.appendChild(option);
        });

        const swatchOptions = {
            darkGrey: ["#0A0A0A", "#141414", "#1E1E1E", "#282828", "#323232", "#3C3C3C", "#464646", "#505050", "#5A5A5A", "#646464", "#6E6E6E", "#787878", "#828282", "#8C8C8C", "#969696", "#2D2D2D", "#373737", "#414141"],
            lightGrey: ["#AAAAAA", "#BBBBBB", "#CCCCCC", "#DDDDDD", "#EEEEEE", "#F5F5F5", "#999999", "#A9A9A9", "#B9B9B9", "#C9C9C9", "#D9D9D9", "#E9E9E9"],
            rainbow: ["#FF0000", "#FF7F00", "#FFFF00", "#00FF00", "#0000FF", "#4B0082", "#8A2BE2", "#FF00FF", "#FF1493", "#00CED1", "#FFD700", "#ADFF2F"],
            fullSpectrum: ["#FF0000", "#FF4500", "#FFA500", "#FFFF00", "#ADFF2F", "#00FF00", "#00CED1", "#00B7EB", "#0000FF", "#8A2BE2", "#FF00FF", "#FF1493"]
        };

        const swatchContainer = document.createElement("div");
        swatchContainer.style.display = "grid";
        swatchContainer.style.gridTemplateColumns = "repeat(6, 20px)";
        swatchContainer.style.gap = "4px";
        swatchContainer.style.marginBottom = "10px";
        colorPicker.appendChild(swatchContainer);

        function updateSwatches(type) {
            swatchContainer.innerHTML = "";
            const colors = swatchOptions[type] || swatchOptions.darkGrey;
            colors.forEach(color => {
                const swatch = document.createElement("div");
                swatch.style.width = "20px";
                swatch.style.height = "20px";
                swatch.style.backgroundColor = color;
                swatch.style.border = "1px solid rgba(255,255,255,0.2)";
                swatch.style.borderRadius = "2px";
                swatch.style.cursor = "pointer";
                swatch.onclick = (e) => {
                    e.stopPropagation();
                    updateColor(color);
                };
                swatchContainer.appendChild(swatch);
            });
        }

        updateSwatches(swatchTypeSelect.value);
        swatchTypeSelect.onchange = () => updateSwatches(swatchTypeSelect.value);

        const colorInputContainer = document.createElement("div");
        colorInputContainer.style.display = "flex";
        colorInputContainer.style.flexDirection = "column";
        colorInputContainer.style.gap = "8px";
        colorPicker.appendChild(colorInputContainer);

        const hexContainer = document.createElement("div");
        hexContainer.style.display = "flex";
        hexContainer.style.alignItems = "center";
        hexContainer.style.gap = "5px";
        colorInputContainer.appendChild(hexContainer);

        const hexLabel = document.createElement("span");
        hexLabel.textContent = "Hex:";
        hexLabel.style.width = "30px";
        hexContainer.appendChild(hexLabel);

        const hexInput = document.createElement("input");
        hexInput.type = "text";
        hexInput.placeholder = "#2a2a2a";
        hexInput.style.width = "80px";
        hexInput.style.padding = "3px";
        hexInput.style.border = "1px solid #666";
        hexInput.style.borderRadius = "4px";
        hexInput.style.background = "rgba(255,255,255,0.1)";
        hexInput.style.color = "#FFF";
        hexContainer.appendChild(hexInput);

        const rgbContainer = document.createElement("div");
        rgbContainer.style.display = "flex";
        rgbContainer.style.gap = "5px";
        colorInputContainer.appendChild(rgbContainer);

        const rInput = document.createElement("input");
        rInput.type = "number";
        rInput.min = "0";
        rInput.max = "255";
        rInput.placeholder = "R";
        rInput.style.width = "50px";
        rInput.style.padding = "3px";
        rInput.style.border = "1px solid #666";
        rInput.style.borderRadius = "4px";
        rInput.style.background = "rgba(255,255,255,0.1)";
        rInput.style.color = "#FFF";
        rgbContainer.appendChild(rInput);

        const gInput = document.createElement("input");
        gInput.type = "number";
        gInput.min = "0";
        gInput.max = "255";
        gInput.placeholder = "G";
        gInput.style.width = "50px";
        gInput.style.padding = "3px";
        gInput.style.border = "1px solid #666";
        gInput.style.borderRadius = "4px";
        gInput.style.background = "rgba(255,255,255,0.1)";
        gInput.style.color = "#FFF";
        rgbContainer.appendChild(gInput);

        const bInput = document.createElement("input");
        bInput.type = "number";
        bInput.min = "0";
        bInput.max = "255";
        bInput.placeholder = "B";
        bInput.style.width = "50px";
        bInput.style.padding = "3px";
        bInput.style.border = "1px solid #666";
        bInput.style.borderRadius = "4px";
        bInput.style.background = "rgba(255,255,255,0.1)";
        bInput.style.color = "#FFF";
        rgbContainer.appendChild(bInput);

        function updateColor(color) {
            color = color.toLowerCase();
            if (/^#[0-9A-Fa-f]{6}$/.test(color)) {
                const r = parseInt(color.slice(1, 3), 16);
                const g = parseInt(color.slice(3, 5), 16);
                const b = parseInt(color.slice(5, 7), 16);
                hexInput.value = color;
                rInput.value = r;
                gInput.value = g;
                bInput.value = b;
                colorSwatch.style.backgroundColor = color;
                win.localStorage.setItem(STORAGE_KEYS.bgColor, color);
                if (win.playing && !bgToggle.checked) {
                    setCustomBackgroundColor(color);
                }
            }
        }

        function updateFromHex() {
            let hex = hexInput.value.trim().replace(/^#/, "");
            if (/^[0-9A-Fa-f]{6}$/.test(hex)) {
                updateColor(`#${hex}`);
            }
        }

        function updateFromRGB() {
            const r = Math.min(255, Math.max(0, parseInt(rInput.value) || 0));
            const g = Math.min(255, Math.max(0, parseInt(gInput.value) || 0));
            const b = Math.min(255, Math.max(0, parseInt(bInput.value) || 0));
            const hex = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
            updateColor(hex);
        }

        function loadColor() {
            const color = win.localStorage.getItem(STORAGE_KEYS.bgColor) || DEFAULT_BG_COLOR;
            updateColor(color);
        }

        colorSwatch.onclick = (e) => {
            e.stopPropagation();
            const isHidden = colorPicker.style.display === "none" || colorPicker.style.display === "";
            colorPicker.style.display = isHidden ? "block" : "none";
            if (isHidden) loadColor();
        };

        hexInput.oninput = updateFromHex;
        rInput.oninput = updateFromRGB;
        gInput.oninput = updateFromRGB;
        bInput.oninput = updateFromRGB;

        document.addEventListener("click", (e) => {
            if (!colorPickerContainer.contains(e.target) && colorPicker.style.display === "block") {
                colorPicker.style.display = "none";
            }
        });

        const cursorSizeContainer = document.createElement("div");
        cursorSizeContainer.style.display = "flex";
        cursorSizeContainer.style.alignItems = "center";
        cursorSizeContainer.style.gap = "8px";
        optionsBar.appendChild(cursorSizeContainer);

        const cursorSizeLabel = document.createElement("span");
        cursorSizeLabel.textContent = "Cursor Size:";
        cursorSizeLabel.style.fontSize = "12px";
        cursorSizeContainer.appendChild(cursorSizeLabel);

        const cursorSizeSlider = document.createElement("input");
        cursorSizeSlider.type = "range";
        cursorSizeSlider.min = "8";
        cursorSizeSlider.max = "64";
        cursorSizeSlider.value = CURSOR_SIZE;
        cursorSizeSlider.style.width = "100px";
        cursorSizeContainer.appendChild(cursorSizeSlider);

        const cursorSizeValue = document.createElement("span");
        cursorSizeValue.textContent = CURSOR_SIZE;
        cursorSizeValue.style.fontSize = "12px";
        cursorSizeContainer.appendChild(cursorSizeValue);

        let isDraggingSize = false;
        cursorSizeSlider.addEventListener("mousedown", (e) => {
            e.stopPropagation();
            isDraggingSize = true;
            updateSliderValue(cursorSizeSlider, e, 8, 64, (value) => {
                CURSOR_SIZE = value;
                cursorSizeValue.textContent = CURSOR_SIZE;
                win.localStorage.setItem(STORAGE_KEYS.cursorSize, CURSOR_SIZE);
                updateCursor();
            });
        });

        document.addEventListener("mousemove", (e) => {
            if (isDraggingSize) {
                e.stopPropagation();
                updateSliderValue(cursorSizeSlider, e, 8, 64, (value) => {
                    CURSOR_SIZE = value;
                    cursorSizeValue.textContent = CURSOR_SIZE;
                    win.localStorage.setItem(STORAGE_KEYS.cursorSize, CURSOR_SIZE);
                    updateCursor();
                });
            }
        });

        document.addEventListener("mouseup", (e) => {
            if (isDraggingSize) {
                e.stopPropagation();
                isDraggingSize = false;
            }
        });

        const cursorOpacityContainer = document.createElement("div");
        cursorOpacityContainer.style.display = "flex";
        cursorOpacityContainer.style.alignItems = "center";
        cursorOpacityContainer.style.gap = "8px";
        optionsBar.appendChild(cursorOpacityContainer);

        const cursorOpacityLabel = document.createElement("span");
        cursorOpacityLabel.textContent = "Cursor Opacity:";
        cursorOpacityLabel.style.fontSize = "12px";
        cursorOpacityContainer.appendChild(cursorOpacityLabel);

        const cursorOpacitySlider = document.createElement("input");
        cursorOpacitySlider.type = "range";
        cursorOpacitySlider.min = "0.1";
        cursorOpacitySlider.max = "1.0";
        cursorOpacitySlider.step = "0.1";
        cursorOpacitySlider.value = CURSOR_OPACITY;
        cursorOpacitySlider.style.width = "100px";
        cursorOpacityContainer.appendChild(cursorOpacitySlider);

        const cursorOpacityValue = document.createElement("span");
        cursorOpacityValue.textContent = CURSOR_OPACITY.toFixed(1);
        cursorOpacityValue.style.fontSize = "12px";
        cursorOpacityContainer.appendChild(cursorOpacityValue);

        let isDraggingOpacity = false;
        cursorOpacitySlider.addEventListener("mousedown", (e) => {
            e.stopPropagation();
            isDraggingOpacity = true;
            updateSliderValue(cursorOpacitySlider, e, 0.1, 1.0, (value) => {
                CURSOR_OPACITY = value;
                cursorOpacityValue.textContent = CURSOR_OPACITY.toFixed(1);
                win.localStorage.setItem(STORAGE_KEYS.cursorOpacity, CURSOR_OPACITY);
                updateCursor();
            }, true);
        });

        document.addEventListener("mousemove", (e) => {
            if (isDraggingOpacity) {
                e.stopPropagation();
                updateSliderValue(cursorOpacitySlider, e, 0.1, 1.0, (value) => {
                    CURSOR_OPACITY = value;
                    cursorOpacityValue.textContent = CURSOR_OPACITY.toFixed(1);
                    win.localStorage.setItem(STORAGE_KEYS.cursorOpacity, CURSOR_OPACITY);
                    updateCursor();
                }, true);
            }
        });

        document.addEventListener("mouseup", (e) => {
            if (isDraggingOpacity) {
                e.stopPropagation();
                isDraggingOpacity = false;
            }
        });

        const autoAvoidContainer = document.createElement("div");
        autoAvoidContainer.style.display = "flex";
        autoAvoidContainer.style.alignItems = "center";
        optionsBar.appendChild(autoAvoidContainer);

        const autoAvoidToggle = document.createElement("input");
        autoAvoidToggle.type = "checkbox";
        autoAvoidToggle.id = "toggle-auto-avoid";
        autoAvoidToggle.checked = autoAvoidEnabled;
        autoAvoidToggle.style.marginRight = "4px";
        autoAvoidToggle.onchange = function() {
            autoAvoidEnabled = this.checked;
            console.log(`AVOID CHECKBOX HANDLER: autoAvoidEnabled set to: ${autoAvoidEnabled}`);
            savePersistentData();
            updateAvoidanceSliderVisibility();
        };
        autoAvoidContainer.appendChild(autoAvoidToggle);

        const autoAvoidLabel = document.createElement("label");
        autoAvoidLabel.textContent = "Auto-Avoid";
        autoAvoidLabel.style.color = "#fff";
        autoAvoidLabel.style.fontSize = "12px";
        autoAvoidLabel.setAttribute("for", "toggle-auto-avoid");
        autoAvoidContainer.appendChild(autoAvoidLabel);

        const autoEatContainer = document.createElement("div");
        autoEatContainer.style.display = "flex";
        autoEatContainer.style.alignItems = "center";
        optionsBar.appendChild(autoEatContainer);

        const autoEatToggle = document.createElement("input");
        autoEatToggle.type = "checkbox";
        autoEatToggle.id = "toggle-auto-eat";
        autoEatToggle.checked = autoEatEnabled;
        autoEatToggle.style.marginRight = "4px";
        autoEatToggle.onchange = function() {
            autoEatEnabled = this.checked;
            console.log(`EAT CHECKBOX HANDLER: autoEatEnabled set to: ${autoEatEnabled}`);
            savePersistentData();
            updateFoodSearchSliderVisibility();
        };
        autoEatContainer.appendChild(autoEatToggle);

        const autoEatLabel = document.createElement("label");
        autoEatLabel.textContent = "Auto Eat";
        autoEatLabel.style.color = "#fff";
        autoEatLabel.style.fontSize = "12px";
        autoEatLabel.setAttribute("for", "toggle-auto-eat");
        autoEatContainer.appendChild(autoEatLabel);

        const avoidanceSliderContainer = document.createElement("div");
        avoidanceSliderContainer.id = "avoidance-slider-container";
        avoidanceSliderContainer.style.position = "fixed";
        avoidanceSliderContainer.style.top = "50px";
        avoidanceSliderContainer.style.left = "50%";
        avoidanceSliderContainer.style.transform = "translateX(-50%)";
        avoidanceSliderContainer.style.display = autoAvoidEnabled ? "flex" : "none";
        avoidanceSliderContainer.style.alignItems = "center";
        avoidanceSliderContainer.style.gap = "10px";
        avoidanceSliderContainer.style.background = "rgba(20, 20, 30, 0.85)";
        avoidanceSliderContainer.style.padding = "5px 10px";
        avoidanceSliderContainer.style.border = "1px solid rgba(255,255,255,0.4)";
        avoidanceSliderContainer.style.borderRadius = "5px";
        avoidanceSliderContainer.style.zIndex = "10002";
        avoidanceSliderContainer.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
        avoidanceSliderContainer.style.color = "#FFF";
        document.body.appendChild(avoidanceSliderContainer);

        const foodSearchSliderContainer = document.createElement("div");
        foodSearchSliderContainer.id = "food-search-slider-container";
        foodSearchSliderContainer.style.position = "fixed";
        foodSearchSliderContainer.style.top = "50px";
        foodSearchSliderContainer.style.left = "50%";
        foodSearchSliderContainer.style.transform = "translateX(-50%)";
        foodSearchSliderContainer.style.display = autoEatEnabled ? "flex" : "none";
        foodSearchSliderContainer.style.alignItems = "center";
        foodSearchSliderContainer.style.gap = "10px";
        foodSearchSliderContainer.style.background = "rgba(20, 20, 30, 0.85)";
        foodSearchSliderContainer.style.padding = "5px 10px";
        foodSearchSliderContainer.style.border = "1px solid rgba(255,255,255,0.4)";
        foodSearchSliderContainer.style.borderRadius = "5px";
        foodSearchSliderContainer.style.zIndex = "10002";
        foodSearchSliderContainer.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
        foodSearchSliderContainer.style.color = "#FFF";
        document.body.appendChild(foodSearchSliderContainer);

        const foodSearchLabel = document.createElement("span");
        foodSearchLabel.textContent = "Food Search Radius:";
        foodSearchLabel.style.fontSize = "12px";
        foodSearchLabel.title = "Adjust the radius to search for food clusters.";
        foodSearchSliderContainer.appendChild(foodSearchLabel);

        const foodSearchSlider = document.createElement("input");
        foodSearchSlider.type = "range";
        foodSearchSlider.min = "500";
        foodSearchSlider.max = "10000";
        foodSearchSlider.value = foodSearchRadius;
        foodSearchSlider.style.width = "150px";
        foodSearchSliderContainer.appendChild(foodSearchSlider);

        const foodSearchValue = document.createElement("span");
        foodSearchValue.textContent = foodSearchRadius;
        foodSearchValue.style.fontSize = "12px";
        foodSearchSliderContainer.appendChild(foodSearchValue);

        const foodSearchResetButton = document.createElement("button");
        foodSearchResetButton.textContent = "Reset";
        foodSearchResetButton.style.background = "#444";
        foodSearchResetButton.style.color = "#fff";
        foodSearchResetButton.style.border = "none";
        foodSearchResetButton.style.borderRadius = "5px";
        foodSearchResetButton.style.cursor = "pointer";
        foodSearchResetButton.style.padding = "2px 6px";
        foodSearchResetButton.style.fontSize = "12px";
        foodSearchResetButton.onclick = function(e) {
            e.stopPropagation();
            foodSearchRadius = 5000;
            foodSearchSlider.value = foodSearchRadius;
            foodSearchValue.textContent = foodSearchRadius;
            win.localStorage.setItem(STORAGE_KEYS.foodSearchRadius, foodSearchRadius);
        };
        foodSearchSliderContainer.appendChild(foodSearchResetButton);

        let isDraggingFoodSearch = false;
        foodSearchSlider.addEventListener("mousedown", (e) => {
            e.stopPropagation();
            isDraggingFoodSearch = true;
            updateSliderValue(foodSearchSlider, e, 500, 10000, (value) => {
                foodSearchRadius = value;
                foodSearchValue.textContent = foodSearchRadius;
                win.localStorage.setItem(STORAGE_KEYS.foodSearchRadius, foodSearchRadius);
            });
        });

        document.addEventListener("mousemove", (e) => {
            if (isDraggingFoodSearch) {
                e.stopPropagation();
                updateSliderValue(foodSearchSlider, e, 500, 10000, (value) => {
                    foodSearchRadius = value;
                    foodSearchValue.textContent = foodSearchRadius;
                    win.localStorage.setItem(STORAGE_KEYS.foodSearchRadius, foodSearchRadius);
                });
            }
        });

        document.addEventListener("mouseup", (e) => {
            if (isDraggingFoodSearch) {
                e.stopPropagation();
                isDraggingFoodSearch = false;
            }
        });

        let container = document.createElement("div");
        container.style.display = "flex";
        container.style.gap = "15px";
        container.style.height = "calc(100% - 80px)";
        huntPopup.appendChild(container);

        let leftSection = document.createElement("div");
        leftSection.id = "hunt-harvested";
        leftSection.style.flex = "1";
        leftSection.style.background = "rgba(0,0,0,0.3)";
        leftSection.style.border = "1px solid rgba(255,255,255,0.3)";
        leftSection.style.borderRadius = "8px";
        leftSection.style.padding = "10px";
        leftSection.style.overflowY = "auto";
        container.appendChild(leftSection);

        let leftHeader = document.createElement("div");
        leftHeader.style.display = "flex";
        leftHeader.style.justifyContent = "space-between";
        leftHeader.style.alignItems = "center";
        leftHeader.style.marginBottom = "8px";
        leftHeader.style.fontSize = "16px";
        leftHeader.textContent = "Harvested Players";
        leftSection.appendChild(leftHeader);

        let clearHarvestedBtn = document.createElement("button");
        clearHarvestedBtn.textContent = "Clear";
        clearHarvestedBtn.style.background = "#444";
        clearHarvestedBtn.style.color = "#fff";
        clearHarvestedBtn.style.border = "none";
        clearHarvestedBtn.style.borderRadius = "5px";
        clearHarvestedBtn.style.cursor = "pointer";
        clearHarvestedBtn.style.padding = "2px 6px";
        clearHarvestedBtn.onclick = function() {
            harvestedPlayers = {};
            updateHuntPopup();
            savePersistentData();
        };
        leftHeader.appendChild(clearHarvestedBtn);

        let leftFilter = document.createElement("input");
        leftFilter.type = "text";
        leftFilter.placeholder = "Filter harvested...";
        leftFilter.style.width = "100%";
        leftFilter.style.marginBottom = "8px";
        leftFilter.style.border = "1px solid #666";
        leftFilter.style.borderRadius = "4px";
        leftFilter.style.padding = "3px 5px";
        leftSection.appendChild(leftFilter);

        huntGridHarvested = document.createElement("div");
        huntGridHarvested.id = "hunt-grid-harvested";
        huntGridHarvested.style.display = "grid";
        huntGridHarvested.style.gridTemplateColumns = "repeat(auto-fill, minmax(120px, 1fr))";
        huntGridHarvested.style.gap = "8px";
        leftSection.appendChild(huntGridHarvested);
        leftFilter.addEventListener("input", updateHuntPopup);

        let rightSection = document.createElement("div");
        rightSection.id = "hunt-targets";
        rightSection.style.flex = "1";
        rightSection.style.background = "rgba(0,0,0,0.3)";
        rightSection.style.border = "1px solid rgba(255,255,255,0.3)";
        rightSection.style.borderRadius = "8px";
        rightSection.style.padding = "10px";
        rightSection.style.overflowY = "auto";
        container.appendChild(rightSection);

        let rightHeader = document.createElement("div");
        rightHeader.style.display = "flex";
        rightHeader.style.justifyContent = "space-between";
        rightHeader.style.alignItems = "center";
        rightHeader.style.marginBottom = "8px";
        rightHeader.style.fontSize = "16px";
        rightHeader.textContent = "Target List / Friend List";
        rightSection.appendChild(rightHeader);

        let clearTargetsBtn = document.createElement("button");
        clearTargetsBtn.textContent = "Clear";
        clearTargetsBtn.style.background = "#444";
        clearTargetsBtn.style.color = "#fff";
        clearTargetsBtn.style.border = "none";
        clearTargetsBtn.style.borderRadius = "5px";
        clearTargetsBtn.style.cursor = "pointer";
        clearTargetsBtn.style.padding = "2px 6px";
        clearTargetsBtn.onclick = function() {
            friendsList = [];
            updateHuntPopup();
            savePersistentData();
        };
        rightHeader.appendChild(clearTargetsBtn);

        let rightFilter = document.createElement("input");
        rightFilter.type = "text";
        rightFilter.placeholder = "Filter targets...";
        rightFilter.style.width = "100%";
        rightFilter.style.marginBottom = "8px";
        rightFilter.style.border = "1px solid #666";
        rightFilter.style.borderRadius = "4px";
        rightFilter.style.padding = "3px 5px";
        rightSection.appendChild(rightFilter);

        huntGridTargets = document.createElement("div");
        huntGridTargets.id = "hunt-grid-targets";
        huntGridTargets.style.display = "grid";
        huntGridTargets.style.gridTemplateColumns = "repeat(auto-fill, minmax(120px, 1fr))";
        huntGridTargets.style.gap = "8px";
        rightSection.appendChild(huntGridTargets);
        rightFilter.addEventListener("input", updateHuntPopup);
    }

    function updateAvoidanceSliderVisibility() {
        const sliderContainer = document.getElementById("avoidance-slider-container");
        if (sliderContainer) sliderContainer.style.display = autoAvoidEnabled ? "flex" : "none";
    }

    function updateFoodSearchSliderVisibility() {
        const sliderContainer = document.getElementById("food-search-slider-container");
        if (sliderContainer) sliderContainer.style.display = autoEatEnabled ? "flex" : "none";
    }

    function findBestFoodCluster(mySnake) {
        if (!mySnake || !win.foods || !Array.isArray(win.foods) || typeof mySnake.xx !== "number" || typeof mySnake.yy !== "number") return null;

        const snakeX = mySnake.xx;
        const snakeY = mySnake.yy;
        const radius = foodSearchRadius;

        const nearbyFoods = win.foods.filter(food => {
            if (!food || typeof food.xx !== "number" || typeof food.yy !== "number" || typeof food.sz !== "number") return false;
            const dx = food.xx - snakeX;
            const dy = food.yy - snakeY;
            return Math.hypot(dx, dy) <= radius;
        });

        if (nearbyFoods.length === 0) return null;

        const CLUSTER_RADIUS = 200;
        const clusters = [];
        const used = new Set();

        nearbyFoods.forEach((food, i) => {
            if (used.has(i)) return;
            const cluster = { foods: [food], totalValue: food.sz, xSum: food.xx * food.sz, ySum: food.yy * food.sz };
            used.add(i);

            nearbyFoods.forEach((otherFood, j) => {
                if (i === j || used.has(j)) return;
                const dx = food.xx - otherFood.xx;
                const dy = food.yy - otherFood.yy;
                const dist = Math.hypot(dx, dy);
                if (dist <= CLUSTER_RADIUS) {
                    cluster.foods.push(otherFood);
                    cluster.totalValue += otherFood.sz;
                    cluster.xSum += otherFood.xx * otherFood.sz;
                    cluster.ySum += otherFood.yy * otherFood.sz;
                    used.add(j);
                }
            });

            clusters.push(cluster);
        });

        if (clusters.length === 0) return null;

        let bestCluster = null;
        let bestScore = -Infinity;

        clusters.forEach(cluster => {
            const centerX = cluster.xSum / cluster.totalValue;
            const centerY = cluster.ySum / cluster.totalValue;
            const dx = centerX - snakeX;
            const dy = centerY - snakeY;
            const distance = Math.hypot(dx, dy);
            const density = cluster.totalValue / (CLUSTER_RADIUS * CLUSTER_RADIUS);
            const score = cluster.totalValue / (distance + 1) + density * 10;

            if (score > bestScore) {
                bestScore = score;
                bestCluster = { x: centerX, y: centerY, value: cluster.totalValue };
            }
        });

        return bestCluster ? { x: bestCluster.x, y: bestCluster.y } : null;
    }

    function updateHuntPopup() {
        if (!huntPopup || !huntGridHarvested || !huntGridTargets) return;
        const leftFilter = huntPopup.querySelector("#hunt-harvested input[type=text]");
        const rightFilter = huntPopup.querySelector("#hunt-targets input[type=text]");
        const harvestedFilter = leftFilter.value.toLowerCase();
        const targetsFilter = rightFilter.value.toLowerCase();

        huntGridHarvested.innerHTML = "";
        huntGridTargets.innerHTML = "";

        for (const name in harvestedPlayers) {
            if (harvestedFilter && !name.toLowerCase().includes(harvestedFilter)) continue;
            if (blockedPlayers[name] || friendsList.includes(name)) continue;

            const item = document.createElement("div");
            item.style.border = "1px solid rgba(255,255,255,0.4)";
            item.style.borderRadius = "6px";
            item.style.padding = "5px";
            item.style.textAlign = "center";
            item.style.fontSize = "12px";
            item.style.color = "#fff";
            if (name === currentTargetFriend) item.style.borderColor = "#0f0";
            const nameDiv = document.createElement("div");
            nameDiv.textContent = name;
            nameDiv.style.marginBottom = "6px";
            item.appendChild(nameDiv);

            const iconRow = document.createElement("div");
            iconRow.style.marginTop = "4px";
            iconRow.style.display = "flex";
            iconRow.style.justifyContent = "space-around";

            const moveIcon = document.createElement("img");
            moveIcon.src = iconAdd;
            moveIcon.title = "Move to Targets";
            moveIcon.style.width = "16px";
            moveIcon.style.cursor = "pointer";
            moveIcon.onclick = function(e) {
                e.stopPropagation();
                if (!friendsList.includes(name)) {
                    friendsList.push(name);
                    targetInfo[name] = { lastSeen: Date.now(), x: harvestedPlayers[name].x, y: harvestedPlayers[name].y };
                    savePersistentData();
                    updateHuntPopup();
                }
            };
            iconRow.appendChild(moveIcon);

            const delIcon = document.createElement("img");
            delIcon.src = iconDelete;
            delIcon.title = "Delete from Harvested";
            delIcon.style.width = "20px";
            delIcon.style.cursor = "pointer";
            delIcon.onclick = function(e) {
                e.stopPropagation();
                delete harvestedPlayers[name];
                savePersistentData();
                updateHuntPopup();
            };
            iconRow.appendChild(delIcon);

            item.appendChild(iconRow);
            huntGridHarvested.appendChild(item);
        }

        friendsList.forEach((name) => {
            if (targetsFilter && !name.toLowerCase().includes(targetsFilter)) return;

            const item = document.createElement("div");
            item.style.border = "1px solid rgba(255,255,255,0.4)";
            item.style.borderRadius = "6px";
            item.style.padding = "5px";
            item.style.textAlign = "center";
            item.style.fontSize = "12px";
            item.style.color = "#fff";
            if (name === currentTargetFriend) item.style.borderColor = "#0f0";
            const nameDiv = document.createElement("div");
            nameDiv.textContent = name;
            item.appendChild(nameDiv);

            const locDiv = document.createElement("div");
            locDiv.style.fontSize = "11px";
            locDiv.style.marginTop = "3px";
            locDiv.style.marginBottom = "6px";
            if (targetInfo[name] && typeof targetInfo[name].x === "number" && typeof targetInfo[name].y === "number") {
                let hx = targetInfo[name].x | 0;
                let hy = targetInfo[name].y | 0;
                locDiv.textContent = `X: ${hx} Y: ${hy}`;
                locDiv.style.color = "#ccc";
                let timeLabel = document.createElement("div");
                timeLabel.style.fontSize = "10px";
                timeLabel.style.marginTop = "2px";
                timeLabel.style.color = "#aaa";
                timeLabel.textContent = formatTimeAgo(targetInfo[name].lastSeen);
                locDiv.appendChild(timeLabel);
            } else {
                locDiv.textContent = "location unknown";
                locDiv.style.color = "red";
            }
            item.appendChild(locDiv);

            item.onclick = function() {
                let found = false;
                if (win.slithers && Array.isArray(win.slithers)) {
                    for (const s of win.slithers) {
                        if (s.nk === name) {
                            found = true;
                            break;
                        }
                    }
                }
                if (found) currentTargetFriend = name;
                savePersistentData();
                updateHuntPopup();
            };

            const iconRow = document.createElement("div");
            iconRow.style.marginTop = "4px";
            iconRow.style.display = "flex";
            iconRow.style.justifyContent = "center";

            const delIcon = document.createElement("img");
            delIcon.src = iconDelete;
            delIcon.title = "Remove from Targets";
            delIcon.style.width = "20px";
            delIcon.style.cursor = "pointer";
            delIcon.onclick = function(e) {
                e.stopPropagation();
                friendsList = friendsList.filter((n) => n !== name);
                delete targetInfo[name];
                savePersistentData();
                updateHuntPopup();
            };
            iconRow.appendChild(delIcon);

            item.appendChild(iconRow);
            huntGridTargets.appendChild(item);
        });
    }

    function toggleHuntPopup() {
        if (!huntPopup) createHuntPopup();
        huntPopup.style.display = huntPopup.style.display === "none" ? "block" : "none";
        if (huntPopup.style.display === "block") updateHuntPopup();
    }

    /********** Smoothing for Target Indicator **********/
    let smoothedTargetPos = null;
    function updateSmoothedTarget(target) {
        const smoothingFactor = 0.2;
        if (!smoothedTargetPos) {
            smoothedTargetPos = { x: target.x, y: target.y };
        } else {
            smoothedTargetPos.x += (target.x - smoothedTargetPos.x) * smoothingFactor;
            smoothedTargetPos.y += (target.y - smoothedTargetPos.y) * smoothingFactor;
        }
    }

    /********** Overlay / Compass / Arrow Drawing **********/
    function drawQuestionMark(baseX, baseY, friendName) {
        if (!overlayCtx) return;
        overlayCtx.save();
        overlayCtx.translate(baseX, baseY);
        overlayCtx.font = "16px Orbitron, sans-serif";
        overlayCtx.fillStyle = "red";
        overlayCtx.fillText("?", 0, 0);
        overlayCtx.restore();
    }

    function drawGoldStar(x, y) {
        if (!overlayCtx) return;
        overlayCtx.save();
        overlayCtx.translate(x, y);
        overlayCtx.beginPath();
        const spikes = 5, outerRadius = 15, innerRadius = 7;
        let rot = Math.PI / 2 * 3;
        let cx = 0, cy = 0;
        const step = Math.PI / spikes;
        overlayCtx.moveTo(cx, cy - outerRadius);
        for (let i = 0; i < spikes; i++) {
            cx = Math.cos(rot) * outerRadius;
            cy = Math.sin(rot) * outerRadius;
            overlayCtx.lineTo(cx, cy);
            rot += step;
            cx = Math.cos(rot) * innerRadius;
            cy = Math.sin(rot) * innerRadius;
            overlayCtx.lineTo(cx, cy);
            rot += step;
        }
        overlayCtx.lineTo(0, -outerRadius);
        overlayCtx.closePath();
        overlayCtx.fillStyle = "gold";
        overlayCtx.fill();
        overlayCtx.restore();
    }

    function drawDirectionalIndicator(targetPos, isFound) {
        if (!overlayCtx) return;

        const myX = win.snake ? win.snake.xx : win.view_xx;
        const myY = win.snake ? win.snake.yy : win.view_yy;
        if (typeof myX !== "number" || typeof myY !== "number") return;

        const dx = targetPos.x - myX;
        const dy = targetPos.y - myY;
        const dist = Math.floor(Math.hypot(dx, dy));

        const compassX = 60;
        const compassY = 60;
        const compassRadius = 50;

        overlayCtx.save();
        overlayCtx.translate(compassX, compassY);

        overlayCtx.beginPath();
        overlayCtx.arc(0, 0, compassRadius, 0, 2 * Math.PI);
        overlayCtx.strokeStyle = "#FFF";
        overlayCtx.lineWidth = 3;
        overlayCtx.stroke();
        overlayCtx.closePath();

        if (isFound) {
            const angle = Math.atan2(dy, dx);
            overlayCtx.rotate(angle + Math.PI + Math.PI / 2 + Math.PI);
            const arrowScale = 0.5;
            const arrowSize = 128 * arrowScale;
            overlayCtx.drawImage(arrowImg, -arrowSize / 2, -arrowSize / 2, arrowSize, arrowSize);
        } else {
            const scale = 0.45;
            const w = notFoundImg.width * scale;
            const h = notFoundImg.height * scale;
            overlayCtx.drawImage(notFoundImg, -w / 2, -h / 2, w, h);
        }

        overlayCtx.restore();

        overlayCtx.save();
        overlayCtx.font = "14px Orbitron, sans-serif";
        overlayCtx.fillStyle = "lightgrey";
        overlayCtx.textAlign = "left";
        overlayCtx.fillText(`${dist}u`, compassX + compassRadius + 10, compassY - 5);
        overlayCtx.fillText(currentTargetFriend, compassX + compassRadius + 10, compassY + 15);
        overlayCtx.restore();
    }

   function drawDebugOverlay(mySnake, avoidanceDistance, threats = [], avoidanceVector = { x: 0, y: 0 }, showDebugOverlay = false) {
    if (!overlayCtx || !mySnake || !win.gsc) return;

    let viewX = win.view_xx || (mySnake.xx - (window.innerWidth / 2) / win.gsc);
    let viewY = win.view_yy || (mySnake.yy - (window.innerHeight / 2) / win.gsc);
    const screenX = (mySnake.xx - viewX) * win.gsc + window.innerWidth / 2;
    const screenY = (mySnake.yy - viewY) * win.gsc + window.innerHeight / 2;
    const baseRadius = avoidanceDistance * win.gsc;

    overlayCtx.save();

    // Core collision effects (always drawn when autoAvoidEnabled is true)
    if (avoidanceDistance > 0) {
        // Draw avoidance radius
        overlayCtx.beginPath();
        overlayCtx.arc(screenX, screenY, baseRadius, 0, 2 * Math.PI);
        overlayCtx.strokeStyle = "rgba(255, 0, 0, 0.5)";
        overlayCtx.lineWidth = 2;
        overlayCtx.stroke();
        overlayCtx.closePath();

        // Draw threats
        threats.forEach(threat => {
            if (typeof threat.x !== "number" || typeof threat.y !== "number") return;
            const threatScreenX = (threat.x - viewX) * win.gsc + window.innerWidth / 2;
            const threatScreenY = (threat.y - viewY) * win.gsc + window.innerHeight / 2;
            overlayCtx.beginPath();
            overlayCtx.arc(threatScreenX, threatScreenY, 10, 0, 2 * Math.PI);
            overlayCtx.fillStyle = "rgba(255, 0, 0, 0.7)";
            overlayCtx.fill();
            overlayCtx.closePath();
        });
    }

    // Additional debug info (drawn only when showDebugOverlay is true)
    if (showDebugOverlay) {
        if (avoidanceVector.x !== 0 || avoidanceVector.y !== 0) {
            const vectorLength = Math.hypot(avoidanceVector.x, avoidanceVector.y);
            if (vectorLength > 0) {
                const scale = 50 / vectorLength;
                const endX = screenX + avoidanceVector.x * scale;
                const endY = screenY + avoidanceVector.y * scale;
                overlayCtx.beginPath();
                overlayCtx.moveTo(screenX, screenY);
                overlayCtx.lineTo(endX, endY);
                overlayCtx.strokeStyle = "rgba(0, 255, 0, 0.7)";
                overlayCtx.lineWidth = 2;
                overlayCtx.stroke();
                overlayCtx.closePath();
            }
        }

        if (foodTarget) {
            const foodScreenX = (foodTarget.x - viewX) * win.gsc + window.innerWidth / 2;
            const foodScreenY = (foodTarget.y - viewY) * win.gsc + window.innerHeight / 2;
            overlayCtx.beginPath();
            overlayCtx.arc(foodScreenX, foodScreenY, 15, 0, 2 * Math.PI);
            overlayCtx.fillStyle = "rgba(255, 215, 0, 0.7)";
            overlayCtx.fill();
            overlayCtx.closePath();
        }
    }

    overlayCtx.restore();
}
   function updateHunterOverlay() {
    if (!overlayCtx || !overlayCanvas || !overlayCanvas.getContext) {
        // Attempt to recreate if context is lost (less likely, but safe)
        createOverlayCanvas();
        if (!overlayCtx) {
            requestAnimationFrame(updateHunterOverlay); // Try again next frame
            return;
        }
    }

    // Determine if the game is actively being played
    const isPlaying = win.playing || (win.snake && typeof win.snake.xx === "number" && typeof win.snake.yy === "number") ||
                      (win.slithers && win.slithers.length > 0 && win.slithers.some(s => s && typeof s.xx === "number"));

    if (!isPlaying) {
        // Reset cursor on landing page/when not playing
        document.body.style.cursor = "default";
        const canvases = document.getElementsByTagName("canvas");
        for (let canvas of canvases) {
            canvas.style.cursor = "default";
        }
        overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height); // Clear overlay when not playing
        requestAnimationFrame(updateHunterOverlay);
        return;
    }

    // Apply custom cursor during gameplay
    updateCursor();

    // Clear the overlay canvas for the new frame
    overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

    // Get current view and player position (handle potential nulls)
    let myX = win.snake ? win.snake.xx : (win.view_xx || 0);
    let myY = win.snake ? win.snake.yy : (win.view_yy || 0);
    let viewX = win.view_xx || (myX - (window.innerWidth / 2) / (win.gsc || 1));
    let viewY = win.view_yy || (myY - (window.innerHeight / 2) / (win.gsc || 1));

    // --- Target Indicator Logic ---
    if (currentTargetFriend && win.slithers && Array.isArray(win.slithers)) {
        let targetSnake = null;
        for (const s of win.slithers) {
            if (s.nk === currentTargetFriend && typeof s.xx === "number" && typeof s.yy === "number") {
                targetSnake = s;
                // Update last known info when seen
                targetInfo[s.nk] = { lastSeen: Date.now(), x: s.xx, y: s.yy };
                break;
            }
        }

        let targetPos;
        let isFound = false;
        if (targetSnake) {
            // Target is currently visible
            targetPos = { x: targetSnake.xx, y: targetSnake.yy };
            isFound = true;
            updateSmoothedTarget(targetPos); // Update smooth position only when found
        } else if (targetInfo[currentTargetFriend]) {
            // Target not visible, use last known position
            targetPos = { x: targetInfo[currentTargetFriend].x, y: targetInfo[currentTargetFriend].y };
            // Don't update smoothed target here, let it stay at the last known smoothed spot
        } else {
            // No info, use default or last known overall location
            targetPos = lastKnownLocation || { x: MAP_SIZE / 2, y: MAP_SIZE / 2 };
        }

        // Draw compass/arrow indicator towards targetPos
        drawDirectionalIndicator(targetPos, isFound);

        // Draw on-screen marker (star or question mark) at the smoothed position
        if (smoothedTargetPos) {
            const screenX = (smoothedTargetPos.x - viewX) * (win.gsc || 1) + window.innerWidth / 2;
            const screenY = (smoothedTargetPos.y - viewY) * (win.gsc || 1) + window.innerHeight / 2;
            // Check if the smoothed position is within the screen bounds
            if (screenX >= 0 && screenX <= overlayCanvas.width && screenY >= 0 && screenY <= overlayCanvas.height) {
                if (isFound) {
                    drawGoldStar(screenX, screenY);
                } else {
                    drawQuestionMark(screenX, screenY, currentTargetFriend);
                }
            }
        }
    } else {
         // Reset smoothed target if no target is selected
         smoothedTargetPos = null;
    }

    // --- Auto-Avoidance / Debug Overlay Logic ---
    // Calculate avoidance data IF autoAvoidEnabled is true, otherwise provide default zero data.
    const avoidanceData = autoAvoidEnabled ? calculateAvoidance(win.snake) : { distance: 0, threats: [], vector: { x: 0, y: 0 } };

    // Call the drawing function IF EITHER autoAvoid OR showDebugOverlay is enabled.
    if (autoAvoidEnabled || showDebugOverlay) {
        // Pass the calculated avoidance distance (will be >0 only if autoAvoid is enabled).
        // Pass the threats and vector (will be empty/zero if autoAvoid is disabled).
        // Crucially, pass the *actual state* of showDebugOverlay to control the EXTRA debug visuals (vector, food).

//console.log(`Calling drawDebugOverlay: distance=${avoidanceData.distance}, showDebugOverlay=${showDebugOverlay}`);
        drawDebugOverlay(win.snake, avoidanceData.distance, avoidanceData.threats, avoidanceData.vector, showDebugOverlay);
    }

    // Request the next frame
    requestAnimationFrame(updateHunterOverlay);
}
    /********** Auto-Avoidance and Navigation **********/
    function calculateAvoidance(mySnake) {
        if (!mySnake || !win.slithers || !Array.isArray(win.slithers)) return { distance: 0, threats: [], vector: { x: 0, y: 0 } };

        const myX = mySnake.xx;
        const myY = mySnake.yy;
        const myAngle = mySnake.ang;
        const mySpeed = mySnake.sp || 5;
        const avoidanceDistance = Math.max(200, 300 - (avoidanceSensitivity * 2));

        let threats = [];
        let avoidanceVector = { x: 0, y: 0 };

        for (const s of win.slithers) {
            if (s === mySnake || typeof s.xx !== "number" || typeof s.yy !== "number") continue;
            if (blockedPlayers[s.nk]) continue;

            const dx = s.xx - myX;
            const dy = s.yy - myY;
            const dist = Math.hypot(dx, dy);
            const threatRadius = (s.tch || s.sc || 1) * 100 + avoidanceDistance;

            if (dist < threatRadius) {
                const relativeAngle = Math.atan2(dy, dx) - myAngle;
                const threatWeight = (threatRadius - dist) / threatRadius;
                avoidanceVector.x -= Math.cos(relativeAngle) * threatWeight * 100;
                avoidanceVector.y -= Math.sin(relativeAngle) * threatWeight * 100;
                threats.push({ x: s.xx, y: s.yy });
            }
        }

        return { distance: avoidanceDistance, threats, vector: avoidanceVector };
    }

    function navigateToTarget(mySnake, targetX, targetY) {

        console.log(`navigateToTarget called`);

        if (!mySnake || typeof mySnake.xx !== "number" || typeof mySnake.yy !== "number" || typeof targetX !== "number" || typeof targetY !== "number") return;

        const dx = targetX - mySnake.xx;
        const dy = targetY - mySnake.yy;
        const targetAngle = Math.atan2(dy, dx);
        let angleDiff = targetAngle - mySnake.ang;

        angleDiff = ((angleDiff + Math.PI) % (2 * Math.PI)) - Math.PI;

        if (Math.abs(angleDiff) > TURN_RATE && !isTurning) {
            isTurning = true;
            turnDirection = angleDiff > 0 ? 1 : -1;
            turnStartTime = Date.now();
            turnPurpose = "navigate";
        }
    }

    function applyTurn(mySnake) {
        console.log(`applyTurn called`);
        if (!isTurning || !mySnake) return;

        const elapsed = Date.now() - turnStartTime;
        if (elapsed >= TURN_DURATION || turnPurpose === null) {
            isTurning = false;
            turnDirection = 0;
            turnPurpose = null;
            return;
        }

        const turnProgress = elapsed / TURN_DURATION;
        const turnAmount = TURN_RATE * turnDirection * turnProgress;

        mySnake.ang += turnAmount;
        mySnake.ang = ((mySnake.ang + 2 * Math.PI) % (2 * Math.PI));
    }

    /********** Game Loop and Automation **********/
    function gameLoop() {

        // (re)grab the live array if we haven’t yet
        if (!win.slithers || win.slithers.length === 0) {
            const s = findSnakeArray();
            if (s) win.slithers = s;
        }
    // console.log("gameLoop tick"); // Optional: Keep or remove this log

    // Guard Clause: Check for playing state AND a valid snake object with valid coordinates
    // Use optional chaining (?.) for safer access to snake properties during the check
    if (!win.playing || !win.snake || typeof win.snake?.xx !== 'number' || typeof win.snake?.yy !== 'number') {
        // Snake not ready or not playing, wait and try again
        // console.log(`gameLoop exiting early...`); // We know why now, can remove or keep commented
        setTimeout(gameLoop, 50); // Use a slightly longer delay when not ready
        return; // Exit this tick
    }

    // --- If execution reaches here, win.snake is valid ---

    // Assign the snake object AFTER the check passes
    const mySnake = win.snake;

    // This log should now appear and show the correct flag states
    console.log(`Loop Check - Playing: ${win.playing}, Snake: ${!!mySnake}, autoAvoid: ${autoAvoidEnabled}, autoEat: ${autoEatEnabled}, isTurning: ${isTurning}`);

    // Call this after the check too
    updateHarvestedPlayers();

    // --- Feature Logic ---
    if (autoAvoidEnabled) {
        const avoidance = calculateAvoidance(mySnake);
        // Only log if avoidance is active
        console.log(`Avoidance Result:`, JSON.stringify(avoidance));

        if (avoidance.vector.x !== 0 || avoidance.vector.y !== 0) {
            const avoidAngle = Math.atan2(avoidance.vector.y, avoidance.vector.x);
            let angleDiff = avoidAngle - mySnake.ang;
            angleDiff = ((angleDiff + Math.PI) % (2 * Math.PI)) - Math.PI;

            // Avoid initiating a turn if already turning for another reason
            if (Math.abs(angleDiff) > TURN_RATE && !isTurning) {
                console.log(`Initiating Avoid Turn`);
                isTurning = true;
                turnDirection = angleDiff > 0 ? 1 : -1;
                turnStartTime = Date.now();
                turnPurpose = "avoid";
            }
        }
    }

    // Apply any active turn
    if (isTurning) {
        applyTurn(mySnake);
    }

    // Check for auto-eat only if not currently turning
    if (autoEatEnabled && !isTurning) {
        // Re-evaluate food target if current one is missing or reached
        if (!foodTarget || Math.hypot(mySnake.xx - foodTarget.x, mySnake.yy - foodTarget.y) < 50) {
            foodTarget = findBestFoodCluster(mySnake);
            // Log only if eating is enabled
            console.log(`Food Target Result:`, foodTarget ? JSON.stringify(foodTarget) : `null`);
        }

        // Navigate if there's a food target
        if (foodTarget) {
            console.log(`Initiating Eat Navigation`);
            navigateToTarget(mySnake, foodTarget.x, foodTarget.y);
        }
    // Check for friend targeting only if not turning AND not auto-eating
    } else if (currentTargetFriend && !isTurning) {
        let targetSnake = null;
        if (win.slithers && Array.isArray(win.slithers)) {
            targetSnake = win.slithers.find(s => s.nk === currentTargetFriend && typeof s.xx === "number" && typeof s.yy === "number");
        }
        const targetPos = targetSnake ? { x: targetSnake.xx, y: targetSnake.yy } : (targetInfo[currentTargetFriend] ? { x: targetInfo[currentTargetFriend].x, y: targetInfo[currentTargetFriend].y } : null);
        if (targetPos) {
            console.log(`Initiating Target Navigation`);
            navigateToTarget(mySnake, targetPos.x, targetPos.y);
        }
    }

    // Schedule the next loop iteration
    setTimeout(gameLoop, 16); // Regular loop speed
}
    /********** Quick Respawn and Quit **********/
    function quickRespawn() {
        if (win.playing) {
            win.want_close_socket = true;
            win.dead_mtm = -1;
        }
        setTimeout(() => {
            if (win.connect) win.connect();
        }, 100);
    }

    function quitToMenu() {
        if (win.playing) {
            win.want_close_socket = true;
            win.dead_mtm = -1;
            win.playing = false;
            document.getElementById("login").style.display = "block";
            document.getElementById("game_area_wrapper").style.display = "none";
        }
    }

function updateCursor() {
    const halfSize = CURSOR_SIZE / 2;
    const cursorSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${CURSOR_SIZE}" height="${CURSOR_SIZE}" viewBox="0 0 ${CURSOR_SIZE} ${CURSOR_SIZE}">
            <g opacity="${CURSOR_OPACITY}">
                <line x1="${halfSize}" y1="0" x2="${halfSize}" y2="${CURSOR_SIZE}" stroke="white" stroke-width="2"/>
                <line x1="0" y1="${halfSize}" x2="${CURSOR_SIZE}" y2="${halfSize}" stroke="white" stroke-width="2"/>
            </g>
        </svg>
    `;
    const cursorDataUri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(cursorSvg)}`;
    const cursorStyle = `url("${cursorDataUri}") ${halfSize} ${halfSize}, crosshair`;

    document.body.style.cursor = cursorStyle;

    const canvases = document.getElementsByTagName("canvas");
    for (let canvas of canvases) {
        canvas.style.cursor = cursorStyle;
    }
}
 function hookRenderLoop() {
    if (win.redraw) {
        const originalRedraw = win.redraw;
        win.redraw = function (...args) {
            originalRedraw.apply(this, args);
            if (win.gsc !== customZoomLevel) {
                //console.log(`[hookRenderLoop] Enforcing gsc, expected:`, customZoomLevel, `actual:`, win.gsc);
                win.gsc = customZoomLevel;
            }
        };
        //console.log('[hookRenderLoop] Successfully hooked into redraw');
    } else {
        console.warn(`[hookRenderLoop] redraw function not found, falling back to requestAnimationFrame`);
        function applyZoomOnFrame() {
            if (win.gsc !== customZoomLevel) {
                //console.log(`[hookRenderLoop] Enforcing gsc, expected:`, customZoomLevel, 'actual:', win.gsc);
                win.gsc = customZoomLevel;
            }
            requestAnimationFrame(applyZoomOnFrame);
        }
        applyZoomOnFrame();
    }
}
    /********** Initialization **********/

   function initialize() {
    if (isInitialized || !document.body) {
        setTimeout(initialize, 100);
        return;
    }
    isInitialized = true;

    loadPersistentData();
    originalBodyStyle = document.body.style.cssText;
    backupBgImage = win.bgi;

    nickInputElem = document.getElementById("nick");
    if (nickInputElem) {
        nickInputElem.addEventListener("input", () => {
            win.localStorage.setItem("nick", nickInputElem.value);
        });
    }

    createModInfo();
    setupPlayButton();
    loadSettings();
    createOverlayCanvas();
    createSensitivitySlider();
    createHuntPopup();
    initializeSlithers();

    hookRenderLoop();

    document.addEventListener("wheel", handleZoom, { passive: false, capture: true });
window.addEventListener("keydown", handleKeyBindings);

    setInterval(() => {
        if (win.playing && backgroundNeedsUpdate) {
            const useDefaultBg = win.localStorage.getItem(STORAGE_KEYS.defaultBgEnabled) === "true";
            if (useDefaultBg && backupBgImage) {
                win.bgi = backupBgImage;
                document.body.style.background = "";
                document.body.style.backgroundColor = "";
            } else {
                const bgColor = win.localStorage.getItem(STORAGE_KEYS.bgColor) || DEFAULT_BG_COLOR;
                setCustomBackgroundColor(bgColor);
            }
            backgroundNeedsUpdate = false;
        }
    }, 100);

    setTimeout(gameLoop, 500);
}


    waitForCanvas();

    })(unsafeWindow);