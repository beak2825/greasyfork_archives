// ==UserScript==
// @name         poke ilmot ja timers
// @namespace    http://tampermonkey.net/
// @version      2.41.4
// @description  jätä auki ja afkaa tms
// @author       res
// @match        https://kuplahotelli.com/game/nitro*
// @match        https://www.kuplahotelli.com/client/dist/index.html*
// @all_frames   true
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526629/poke%20ilmot%20ja%20timers.user.js
// @updateURL https://update.greasyfork.org/scripts/526629/poke%20ilmot%20ja%20timers.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Determine whether we are running in an iframe (game client) or in the top window (UI)
    const isIframe = window !== window.top;
    const CHANNEL = 'spawn_notifier_channel';

    if (isIframe) {
        // === IFRAME CONTEXT (Game Client) ===

        // Selector for the in-game spawn notification element.
        const notifSelector = "#root > div > div.animate__animated > div > div.nitro-right-side.animate__animated.animate__backInDown > div > div:nth-child(3) > div > div > div.d-inline.text-white.nitro-small-size-text.text-wrap";

        let lastNotified = "";
        let debounceTimer = null;

        function checkForKeywords() {
            const elements = document.querySelectorAll(notifSelector);
            elements.forEach(element => {
                const message = element.textContent.trim();
                if (!message) return;
                // Ignore messages with unwanted text.
                if (message.toLowerCase().includes("nappasit pokemonin")) return;
                if (message === lastNotified) return;
                lastNotified = message;
                if (debounceTimer) clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    window.top.postMessage({
                        channel: CHANNEL,
                        type: 'spawn',
                        message: message
                    }, '*');
                    debounceTimer = null;
                }, 300);
            });
        }

        const observer = new MutationObserver(checkForKeywords);
        observer.observe(document.body, { childList: true, subtree: true });
    } else {
        // === TOP WINDOW CONTEXT (UI) ===

        /* ====== Persistence & Defaults ====== */
        const persisted = JSON.parse(localStorage.getItem("spawnTimerSettings") || "{}");
        let flashDuration = persisted.flashDuration || 1; // seconds
        let windowScale = persisted.windowScale || 1;
        let notifyAllShinies = (persisted.notifyAllShinies === undefined) ? true : persisted.notifyAllShinies;
        let keywordList = persisted.keywordList || ["gengar", "rayquaza", "haunter", "shiny"];
        let timerWindowPosition = JSON.parse(localStorage.getItem("spawnTimersWindowPosition") || "null");
        let lastShinyName = persisted.lastShinyName || "";
        let keywordModes = persisted.keywordModes || {};

        /* ====== Global Freeze State ====== */
        // When frozen==true, the timers should not update (i.e. remain frozen).
        let frozen = false;
        // freezeDelta will store, for each keyword, the elapsed time at the moment of minimizing.
        let freezeDelta = {};

        /* ====== Insert CSS Animations ====== */
        if (!document.getElementById("spawn-notifier-style")) {
            const styleElem = document.createElement("style");
            styleElem.id = "spawn-notifier-style";
            styleElem.innerHTML = `
                @keyframes pulse {
                    0% { opacity: 1; }
                    50% { opacity: 0.5; }
                    100% { opacity: 1; }
                }
                @keyframes slotMachine {
                    0% { opacity: 1; transform: scale(1); filter: hue-rotate(0deg); }
                    20% { opacity: 1; transform: scale(1.2); filter: hue-rotate(60deg); }
                    40% { opacity: 1; transform: scale(1.4); filter: hue-rotate(120deg); }
                    60% { opacity: 1; transform: scale(1.2); filter: hue-rotate(180deg); }
                    80% { opacity: 1; transform: scale(1.1); filter: hue-rotate(240deg); }
                    100% { opacity: 1; transform: scale(1); filter: hue-rotate(360deg); }
                }
            `;
            document.head.appendChild(styleElem);
        }

        // Listen for spawn messages.
        window.addEventListener('message', (event) => {
            if (event.data?.channel !== CHANNEL) return;
            if (event.data.type === 'spawn') {
                handleSpawnMessage(event.data.message);
            }
        });

        /* ====== Helper: Compute Overlay Color ====== */
        function getOverlayColor(keyword) {
            if (keyword === "shiny") {
                return "linear-gradient(45deg, rgba(255,127,80,0.3), rgba(255,215,0,0.3), rgba(50,205,50,0.3), rgba(30,144,255,0.3), rgba(255,105,180,0.3))";
            }
            let hash = 0;
            for (let i = 0; i < keyword.length; i++) {
                hash = keyword.charCodeAt(i) + ((hash << 5) - hash);
            }
            const r = (hash >> 0) & 0xFF;
            const g = (hash >> 8) & 0xFF;
            const b = (hash >> 16) & 0xFF;
            const mix = 0.5;
            const rPastel = Math.floor((r + 255 * mix) / (1 + mix));
            const gPastel = Math.floor((g + 255 * mix) / (1 + mix));
            const bPastel = Math.floor((b + 255 * mix) / (1 + mix));
            return `rgba(${rPastel}, ${gPastel}, ${bPastel}, 0.3)`;
        }

        /* ====== State Variables ====== */
        let isFlashing = false;
        let overlayInstance = null;
        const startTime = Date.now();
        const lastSeenTimes = {};
        keywordList.forEach(kw => {
            lastSeenTimes[kw] = (persisted.lastSeenTimes && persisted.lastSeenTimes[kw]) || startTime;
        });
        let keywordRows = {};

        /* ====== Utility: Format Time ====== */
        function formatTime(seconds) {
            const h = Math.floor(seconds / 3600);
            const m = Math.floor((seconds % 3600) / 60);
            const s = seconds % 60;
            return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        }

        /* ====== Process Incoming Spawn Message ====== */
        function handleSpawnMessage(message) {
            // If frozen (minimized), ignore spawn events (and remove any overlay).
            let content = document.getElementById("spawn-timers-content");
            if (content && content.style.display === "none") {
                if (overlayInstance && document.body.contains(overlayInstance)) {
                    document.body.removeChild(overlayInstance);
                    overlayInstance = null;
                    isFlashing = false;
                }
                return;
            }
            // When not frozen, process the spawn event.
            const textContent = message.toLowerCase();
            let matchedKeyword = null;
            for (const keyword of keywordList) {
                if (textContent.includes(keyword)) {
                    matchedKeyword = keyword;
                    break;
                }
            }
            if (!matchedKeyword) return;
            // Update internal timer state.
            lastSeenTimes[matchedKeyword] = Date.now();
            if (matchedKeyword === "shiny") {
                const match = message.match(/^(.*?)\s*\(shiny\)/i);
                lastShinyName = match?.[1]?.trim() || "Shiny";
            }
            if (message.includes("(shiny)")) {
                flashScreen(getOverlayColor(matchedKeyword), message, "flashExtra");
            } else {
                if (keywordModes[matchedKeyword] === "shinyOnly") {
                    return;
                } else {
                    flashScreen(getOverlayColor(matchedKeyword), message, "animated");
                }
            }
        }

        /* ====== Flash Overlay on Screen ====== */
        function flashScreen(color, message, flashType) {
            // Do not trigger overlays if frozen.
            let content = document.getElementById("spawn-timers-content");
            if (content && content.style.display === "none") {
                if (overlayInstance && document.body.contains(overlayInstance)) {
                    document.body.removeChild(overlayInstance);
                    overlayInstance = null;
                    isFlashing = false;
                }
                return;
            }
            if (overlayInstance) return;
            isFlashing = true;
            overlayInstance = document.createElement("div");
            overlayInstance.id = "spawn-notification-overlay";
            Object.assign(overlayInstance.style, {
                position: "fixed",
                top: "0",
                left: "0",
                width: "100%",
                height: "100%",
                background: color,
                zIndex: "100000",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                pointerEvents: "all"
            });
            if (flashType === "flashExtra") {
                overlayInstance.style.animation = "slotMachine 1s ease-in-out infinite";
            } else if (flashType === "animated") {
                overlayInstance.style.animation = "pulse 1s ease-in-out infinite";
            }
            const messageElement = document.createElement("div");
            messageElement.textContent = message;
            Object.assign(messageElement.style, {
                fontSize: "2.5rem",
                color: "white",
                fontWeight: "bold",
                textShadow: "2px 2px 4px rgba(0,0,0,0.7)",
                textAlign: "center",
                padding: "10px",
                backgroundColor: "rgba(0,0,0,0.3)",
                borderRadius: "8px",
                pointerEvents: "none"
            });
            overlayInstance.appendChild(messageElement);
            document.body.appendChild(overlayInstance);

            function removeOverlay() {
                if (overlayInstance && document.body.contains(overlayInstance)) {
                    document.body.removeChild(overlayInstance);
                    overlayInstance = null;
                    isFlashing = false;
                }
            }
            overlayInstance.addEventListener("click", e => {
                e.stopImmediatePropagation();
                removeOverlay();
            });
            window.addEventListener("keydown", function escListener(e) {
                if (e.key === "Escape") {
                    removeOverlay();
                    window.removeEventListener("keydown", escListener, true);
                }
            });
            setTimeout(removeOverlay, flashDuration * 1000);
        }

        /* ====== Create Timer Window UI ====== */
        if (!document.getElementById("spawn-timers-window")) {
            const timerWindow = document.createElement("div");
            timerWindow.id = "spawn-timers-window";
            if (timerWindowPosition) {
                timerWindow.style.top = timerWindowPosition.top;
                timerWindow.style.left = timerWindowPosition.left;
                timerWindow.style.right = "";
            } else {
                timerWindow.style.top = "10px";
                timerWindow.style.right = "10px";
            }
            Object.assign(timerWindow.style, {
                position: "fixed",
                width: "250px",
                backgroundColor: "#2b2b2b",
                color: "#ddd",
                border: "none",
                borderRadius: "10px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
                fontFamily: "'Ubuntu Condensed', sans-serif",
                fontWeight: "500",
                fontSize: "1rem",
                zIndex: "100001",
                overflow: "hidden",
                transform: "scale(" + windowScale + ")",
                transformOrigin: "top right"
            });

            const timerHeader = document.createElement("div");
            timerHeader.id = "spawn-timers-header";
            Object.assign(timerHeader.style, {
                padding: "8px 10px",
                backgroundColor: "#3a3a3a",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "move",
                userSelect: "none"
            });

            const headerLeft = document.createElement("div");
            headerLeft.style.display = "flex";
            headerLeft.style.flexDirection = "column";
            headerLeft.style.justifyContent = "center";

            const titleLine = document.createElement("div");
            titleLine.textContent = "Spawn Timers";

            const sessionLine = document.createElement("div");
            sessionLine.id = "spawn-timers-session";
            sessionLine.textContent = "Session: 00:00:00";

            headerLeft.appendChild(titleLine);
            headerLeft.appendChild(sessionLine);

            const headerRight = document.createElement("div");
            headerRight.style.display = "flex";
            headerRight.style.alignItems = "center";

            const toggleButton = document.createElement("span");
            toggleButton.id = "spawn-timers-toggle";
            // Always start minimized – show "[+]"
            toggleButton.textContent = "[+]";
            Object.assign(toggleButton.style, {
                cursor: "pointer",
                padding: "0 8px",
                marginRight: "8px"
            });
            // When toggling, record or restore the freeze state.
            toggleButton.addEventListener('mousedown', e => e.stopPropagation());
            toggleButton.addEventListener("click", e => {
                e.stopPropagation();
                const content = document.getElementById("spawn-timers-content");
                if (content.style.display !== "none") {
                    // Minimizing: record freezeDelta for each keyword.
                    Object.keys(keywordRows).forEach(keyword => {
                        freezeDelta[keyword] = Date.now() - lastSeenTimes[keyword];
                    });
                    content.style.display = "none";
                    toggleButton.textContent = "[+]";
                    frozen = true;
                } else {
                    // Expanding: adjust lastSeenTimes so that elapsed remains frozen.
                    Object.keys(keywordRows).forEach(keyword => {
                        if (freezeDelta[keyword] !== undefined) {
                            lastSeenTimes[keyword] = Date.now() - freezeDelta[keyword];
                        }
                    });
                    content.style.display = "block";
                    toggleButton.textContent = "[-]";
                    frozen = false;
                    freezeDelta = {};
                }
            });

            const settingsButton = document.createElement("span");
            settingsButton.id = "spawn-timers-settings-button";
            settingsButton.textContent = "⚙";
            Object.assign(settingsButton.style, {
                cursor: "pointer",
                padding: "0 8px"
            });
            settingsButton.addEventListener('mousedown', e => e.stopPropagation());
            settingsButton.addEventListener("click", () => openSettingsWindow());

            headerRight.appendChild(toggleButton);
            headerRight.appendChild(settingsButton);
            timerHeader.appendChild(headerLeft);
            timerHeader.appendChild(headerRight);
            timerWindow.appendChild(timerHeader);

            // Always start minimized – hide content.
            const timerContent = document.createElement("div");
            timerContent.id = "spawn-timers-content";
            Object.assign(timerContent.style, {
                padding: "8px 10px",
                display: "none"
            });

            // Build timer list rows.
            function buildKeywordRows() {
                keywordRows = {};
                timerContent.innerHTML = "";
                let listToUse;
                if (notifyAllShinies) {
                    listToUse = [...new Set([...keywordList, "shiny"])];
                } else {
                    listToUse = [...new Set(keywordList.filter(kw => kw !== "shiny"))];
                }
                listToUse.forEach(keyword => {
                    if (!keywordModes.hasOwnProperty(keyword)) {
                        keywordModes[keyword] = "all";
                    }
                    const row = document.createElement("div");
                    row.style.marginBottom = "6px";
                    row.style.display = "flex";
                    row.style.justifyContent = "space-between";
                    row.style.alignItems = "center";

                    const label = document.createElement("span");
                    if (keyword === "shiny") {
                        label.textContent = "Last seen shiny:";
                    } else {
                        label.textContent = (keywordModes[keyword] === "shinyOnly") ?
                            (keyword.charAt(0).toUpperCase() + keyword.slice(1) + " (shiny):") :
                            (keyword.charAt(0).toUpperCase() + keyword.slice(1) + ":");
                    }
                    label.style.color = "#ddd";

                    const timerDisplay = document.createElement("span");
                    timerDisplay.textContent = (keyword === "shiny") ? (lastShinyName || "Shiny") : "00:00:00";

                    if (keyword !== "shiny") {
                        if (keywordModes[keyword] === "shinyOnly") {
                            row.style.backgroundColor = "rgba(255,215,0,0.2)";
                        } else {
                            row.style.backgroundColor = "";
                        }
                        row.addEventListener("click", (e) => {
                            if (e.ctrlKey) {
                                e.preventDefault();
                                e.stopPropagation();
                                let previewMessage;
                                if (keywordModes[keyword] === "shinyOnly") {
                                    previewMessage = `${keyword} (shiny) preview`;
                                    flashScreen(getOverlayColor(keyword), previewMessage, "flashExtra");
                                } else {
                                    previewMessage = `${keyword} preview`;
                                    flashScreen(getOverlayColor(keyword), previewMessage, "animated");
                                }
                            } else {
                                if (keywordModes[keyword] === "shinyOnly") {
                                    keywordModes[keyword] = "all";
                                    label.textContent = keyword.charAt(0).toUpperCase() + keyword.slice(1) + ":";
                                    row.style.backgroundColor = "";
                                } else {
                                    keywordModes[keyword] = "shinyOnly";
                                    label.textContent = keyword.charAt(0).toUpperCase() + keyword.slice(1) + " (shiny):";
                                    row.style.backgroundColor = "rgba(255,215,0,0.2)";
                                }
                            }
                        });
                    }
                    row.appendChild(label);
                    row.appendChild(timerDisplay);
                    timerContent.appendChild(row);
                    keywordRows[keyword] = timerDisplay;
                });
            }

            buildKeywordRows();
            timerWindow.appendChild(timerContent);
            document.body.appendChild(timerWindow);

            // Make the timer window draggable.
            (function makeDraggable(dragHandle, dragTarget) {
                let offsetX = 0, offsetY = 0;
                dragHandle.addEventListener('mousedown', dragMouseDown);
                function dragMouseDown(e) {
                    if (["spawn-timers-toggle", "spawn-timers-settings-button"].includes(e.target.id)) return;
                    e.preventDefault();
                    const computedStyle = window.getComputedStyle(dragTarget);
                    if (computedStyle.bottom !== "auto" && computedStyle.right !== "auto") {
                        let bottom = parseInt(computedStyle.bottom, 10) || 0;
                        let right = parseInt(computedStyle.right, 10) || 0;
                        let newTop = window.innerHeight - dragTarget.offsetHeight - bottom;
                        let newLeft = window.innerWidth - dragTarget.offsetWidth - right;
                        dragTarget.style.top = newTop + "px";
                        dragTarget.style.left = newLeft + "px";
                    }
                    dragTarget.style.bottom = "";
                    dragTarget.style.right = "";
                    offsetX = e.clientX - parseInt(dragTarget.style.left, 10);
                    offsetY = e.clientY - parseInt(dragTarget.style.top, 10);
                    document.addEventListener('mousemove', elementDrag);
                    document.addEventListener('mouseup', closeDragElement);
                }
                function elementDrag(e) {
                    e.preventDefault();
                    let newLeft = e.clientX - offsetX;
                    let newTop = e.clientY - offsetY;
                    const effectiveWidth = dragTarget.offsetWidth * windowScale;
                    const effectiveHeight = dragTarget.offsetHeight * windowScale;
                    newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - effectiveWidth));
                    newTop = Math.max(0, Math.min(newTop, window.innerHeight - effectiveHeight));
                    dragTarget.style.left = newLeft + "px";
                    dragTarget.style.top = newTop + "px";
                }
                function closeDragElement() {
                    document.removeEventListener('mousemove', elementDrag);
                    document.removeEventListener('mouseup', closeDragElement);
                    const pos = { top: dragTarget.style.top, left: dragTarget.style.left };
                    localStorage.setItem("spawnTimersWindowPosition", JSON.stringify(pos));
                }
            })(timerHeader, timerWindow);

            // Update the timer window every second.
            setInterval(function updateTimerWindow() {
                const now = Date.now();
                const sessionSeconds = Math.floor((now - startTime) / 1000);
                document.getElementById("spawn-timers-session").textContent = "Session: " + formatTime(sessionSeconds);
                let content = document.getElementById("spawn-timers-content");
                if (content && content.style.display !== "none" && !frozen) {
                    Object.keys(keywordRows).forEach(keyword => {
                        if (keyword === "shiny") {
                            keywordRows[keyword].textContent = lastShinyName || "Shiny";
                        } else {
                            const secondsElapsed = Math.floor((now - lastSeenTimes[keyword]) / 1000);
                            keywordRows[keyword].textContent = formatTime(secondsElapsed);
                        }
                    });
                } else if (content && content.style.display === "none") {
                    // When minimized, do nothing (display remains frozen)
                    // Also remove any active overlay.
                    if (overlayInstance && document.body.contains(overlayInstance)) {
                        document.body.removeChild(overlayInstance);
                        overlayInstance = null;
                        isFlashing = false;
                    }
                }
            }, 1000);

            // Settings window functionality.
            let settingsWindow = null;
            function openSettingsWindow() {
                if (settingsWindow) {
                    settingsWindow.remove();
                    settingsWindow = null;
                    return;
                }
                settingsWindow = document.createElement("div");
                settingsWindow.id = "spawn-timers-settings-window";
                Object.assign(settingsWindow.style, {
                    position: "fixed",
                    top: "50px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "320px",
                    backgroundColor: "#1a1a1a",
                    color: "#ddd",
                    border: "none",
                    borderRadius: "10px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
                    fontFamily: "'Ubuntu Condensed', sans-serif",
                    fontWeight: "500",
                    fontSize: "1rem",
                    zIndex: "100002",
                    padding: "10px",
                    cursor: "default"
                });

                const settingsHeader = document.createElement("div");
                settingsHeader.textContent = "Settings";
                Object.assign(settingsHeader.style, {
                    padding: "8px",
                    backgroundColor: "#333",
                    color: "#fff",
                    cursor: "move",
                    userSelect: "none",
                    borderRadius: "8px 8px 0 0",
                    marginBottom: "10px"
                });

                const settingsContent = document.createElement("div");
                settingsContent.style.padding = "10px";

                // Overlay duration input (in seconds).
                const overlayLabel = document.createElement("label");
                overlayLabel.textContent = "Overlay Duration (seconds): ";
                const overlayInput = document.createElement("input");
                overlayInput.type = "number";
                overlayInput.value = flashDuration;
                overlayInput.style.width = "80px";
                overlayInput.style.backgroundColor = "#222";
                overlayInput.style.color = "#ddd";
                overlayInput.style.border = "1px solid #444";
                overlayLabel.appendChild(overlayInput);
                settingsContent.appendChild(overlayLabel);
                settingsContent.appendChild(document.createElement("br"));

                // Keywords textarea.
                const keywordsLabel = document.createElement("label");
                keywordsLabel.textContent = "Keywords (one per line):";
                settingsContent.appendChild(keywordsLabel);
                settingsContent.appendChild(document.createElement("br"));
                const keywordsTextarea = document.createElement("textarea");
                keywordsTextarea.value = keywordList.join("\n");
                Object.assign(keywordsTextarea.style, {
                    width: "100%",
                    height: "80px",
                    backgroundColor: "#222",
                    color: "#ddd",
                    border: "1px solid #444"
                });
                settingsContent.appendChild(keywordsTextarea);
                settingsContent.appendChild(document.createElement("br"));

                // Scale slider.
                const scaleLabel = document.createElement("label");
                scaleLabel.textContent = "Window Scale: ";
                const scaleSlider = document.createElement("input");
                scaleSlider.type = "range";
                scaleSlider.min = "0.5";
                scaleSlider.max = "2";
                scaleSlider.step = "0.1";
                scaleSlider.value = windowScale;
                scaleSlider.style.width = "100%";
                scaleLabel.appendChild(scaleSlider);
                settingsContent.appendChild(scaleLabel);
                settingsContent.appendChild(document.createElement("br"));

                // Shiny notify checkbox.
                const shinyLabel = document.createElement("label");
                shinyLabel.textContent = "Notify for all shinies: ";
                const shinyCheckbox = document.createElement("input");
                shinyCheckbox.type = "checkbox";
                shinyCheckbox.checked = notifyAllShinies;
                shinyLabel.appendChild(shinyCheckbox);
                settingsContent.appendChild(shinyLabel);
                settingsContent.appendChild(document.createElement("br"));

                // Buttons.
                const btnContainer = document.createElement("div");
                btnContainer.style.marginTop = "10px";
                btnContainer.style.textAlign = "right";
                const buttonStyle = "background-color:#444; color:#fff; border:1px solid #555; border-radius:4px; padding:4px 8px; cursor:pointer;";
                const saveButton = document.createElement("button");
                saveButton.textContent = "Save";
                saveButton.style.cssText = buttonStyle;
                const cancelButton = document.createElement("button");
                cancelButton.textContent = "Cancel";
                cancelButton.style.cssText = buttonStyle + " margin-left:10px;";
                btnContainer.appendChild(saveButton);
                btnContainer.appendChild(cancelButton);
                settingsContent.appendChild(btnContainer);

                settingsWindow.appendChild(settingsHeader);
                settingsWindow.appendChild(settingsContent);
                document.body.appendChild(settingsWindow);

                (function makeDraggableSettings(dragHandle, dragTarget) {
                    let offsetX = 0, offsetY = 0;
                    dragHandle.addEventListener('mousedown', dragMouseDown);
                    function dragMouseDown(e) {
                        e.preventDefault();
                        const rect = dragTarget.getBoundingClientRect();
                        offsetX = e.clientX - rect.left;
                        offsetY = e.clientY - rect.top;
                        document.addEventListener('mousemove', elementDrag);
                        document.addEventListener('mouseup', closeDragElement);
                    }
                    function elementDrag(e) {
                        e.preventDefault();
                        let newLeft = e.clientX - offsetX;
                        let newTop = e.clientY - offsetY;
                        newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - dragTarget.offsetWidth));
                        newTop = Math.max(0, Math.min(newTop, window.innerHeight - dragTarget.offsetHeight));
                        dragTarget.style.left = newLeft + "px";
                        dragTarget.style.top = newTop + "px";
                    }
                    function closeDragElement() {
                        document.removeEventListener('mousemove', elementDrag);
                        document.removeEventListener('mouseup', closeDragElement);
                    }
                })(settingsHeader, settingsWindow);

                scaleSlider.addEventListener("input", function() {
                    document.getElementById("spawn-timers-window").style.transform = "scale(" + scaleSlider.value + ")";
                });

                saveButton.addEventListener("click", function() {
                    const newDuration = parseFloat(overlayInput.value);
                    if (!isNaN(newDuration) && newDuration > 0) {
                        flashDuration = newDuration;
                    }
                    const lines = keywordsTextarea.value.split("\n");
                    let newList = [];
                    lines.forEach(line => {
                        const kw = line.trim().toLowerCase();
                        if (kw) {
                            newList.push(kw);
                            if (!lastSeenTimes.hasOwnProperty(kw)) {
                                lastSeenTimes[kw] = Date.now();
                            }
                        }
                    });
                    if (shinyCheckbox.checked) {
                        if (!newList.includes("shiny")) newList.push("shiny");
                    } else {
                        newList = newList.filter(kw => kw !== "shiny");
                    }
                    keywordList = newList;
                    buildKeywordRows();
                    windowScale = parseFloat(scaleSlider.value);
                    document.getElementById("spawn-timers-window").style.transform = "scale(" + windowScale + ")";
                    notifyAllShinies = shinyCheckbox.checked;
                    localStorage.setItem("spawnTimerSettings", JSON.stringify({
                        flashDuration,
                        windowScale,
                        keywordList,
                        lastSeenTimes,
                        notifyAllShinies,
                        lastShinyName,
                        keywordModes
                    }));
                    settingsWindow.remove();
                    settingsWindow = null;
                });
                cancelButton.addEventListener("click", function() {
                    settingsWindow.remove();
                    settingsWindow = null;
                });
            }
        }
    }
})();
