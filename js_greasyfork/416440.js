// ==UserScript==
// @name         Diep.io Custom Points Upgrader - Optimized
// @namespace    http://tampermonkey.net/
// @version      10.09
// @homepage     https://greasyfork.org/scripts/416440
// @description  NEW! custom upgrade builds update! Your upgrade builds will save now!
// @author       -{Abyss⌬}-ora
// @match        https://diep.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/416440/Diepio%20Custom%20Points%20Upgrader%20-%20Optimized.user.js
// @updateURL https://update.greasyfork.org/scripts/416440/Diepio%20Custom%20Points%20Upgrader%20-%20Optimized.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // ========== CONSTANTS ==========
    const MAX_POINTS = 33;
    const MAX_ATTRIBUTE_LEVEL = 7;

    const STORAGE_KEYS = {
        USERNAME: "quickSpawnUsername",
        SAVED_NAMES: "savedNames",
        SAVED_BUTTONS: "savedButtons",
        REMOVED_DEFAULTS: "removedDefaults",
        BACKUP_DATA: "backupData",
        SCRIPT_VERSION: "scriptVersion",
        MENU_POSITION: "menuPosition"
    };

    const ATTRIBUTES = [
        { name: "Health Regen", color: "rgb(232, 188, 157)", maxLevel: 10 },
        { name: "Max Health", color: "rgb(230, 128, 234)", maxLevel: 10 },
        { name: "Body Damage", color: "rgb(165, 128, 234)", maxLevel: 10 },
        { name: "Bullet Speed", color: "rgb(128, 162, 234)", maxLevel: 7 },
        { name: "Bullet Penetration", color: "rgb(234, 215, 128)", maxLevel: 7 },
        { name: "Bullet Damage", color: "rgb(234, 128, 128)", maxLevel: 7 },
        { name: "Reload", color: "rgb(164, 234, 128)", maxLevel: 7 },
        { name: "Movement Speed", color: "rgb(128, 234, 230)", maxLevel: 10 }
    ];

    const BACKGROUND_IMAGE = "url('https://media.tenor.com/images/f3f5354b7c304bc61882dbb1183885e7/tenor.gif')";

    // Minimap constants (percentages based on 2560×1440 fullscreen measurements)
    const MINIMAP_BASELINE = {
        minimapXPercent: 2303 / 2560,
        minimapYPercent: 1183 / 1440,
        minimapSizePercent: 226 / 2560
    };
    const MINIMAP_BASE_SIZE_PX = 2560 * MINIMAP_BASELINE.minimapSizePercent; // 226

    // Adjustable minimap ring/core config
    const MINIMAP_CONFIG = {
        BASE_CORE_DIAMETER_PX: 6,          // inner dot diameter at 2560 width
        BASE_RING_DIAMETER_PX: 28,         // outer ring diameter at 2560 width
        GLOBAL_SCALE: 1.0,                 // uniform scale multiplier for both
        RING_COLOR: 'rgba(0,0,0,0.3)',
        RING_BORDER: '1px solid white',
        RING_SHADOW: '0 0 6px rgba(255,0,0,0.5), 0 0 10px rgba(255,255,255,0.25)',
        RING_OPACITY: 0.6,
        CORE_COLOR: 'rgba(0,0,0,0.5)',
        CORE_BORDER: 'none',
        CORE_SHADOW: 'none',
        CORE_OPACITY: 1
    };

    // Derived ratios from adjustable config
    const MINIMAP_DOT_RATIO  = (MINIMAP_CONFIG.BASE_CORE_DIAMETER_PX  * MINIMAP_CONFIG.GLOBAL_SCALE) / MINIMAP_BASE_SIZE_PX;
    const MINIMAP_RING_RATIO = (MINIMAP_CONFIG.BASE_RING_DIAMETER_PX * MINIMAP_CONFIG.GLOBAL_SCALE) / MINIMAP_BASE_SIZE_PX;

    // ========== HELPER FUNCTIONS ==========
    const getStorage = (key) => localStorage.getItem(key);
    const setStorage = (key, value) => localStorage.setItem(key, value);
    const getStorageJSON = (key) => JSON.parse(getStorage(key) || "null") || [];
    const setStorageJSON = (key, value) => setStorage(key, JSON.stringify(value));

    const createElement = (tag, className, attributes = {}) => {
        const el = document.createElement(tag);
        if (className) el.className = className;
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'style') {
                Object.assign(el.style, value);
            } else {
                el[key] = value;
            }
        });
        return el;
    };

    const applyStyles = (element, styles) => Object.assign(element.style, styles);

    const toggleVisibility = (element) => {
        if (element) {
            element.style.display = element.style.display === "none" ? "block" : "none";
        }
    };

    function getScriptVersion() {
        const metadataBlock = `
// ==UserScript==
// @version      10.09
// ==/UserScript==`;
        const versionMatch = metadataBlock.match(/@version\s+([\d.]+)/);
        return versionMatch ? versionMatch[1] : null;
    }

    function saveDataBeforeUpdate() {
        const dataToSave = Object.fromEntries(
            Object.entries(STORAGE_KEYS)
            .filter(([key]) => key !== 'BACKUP_DATA' && key !== 'SCRIPT_VERSION')
            .map(([_, value]) => [value, getStorage(value)])
        );
        setStorageJSON(STORAGE_KEYS.BACKUP_DATA, dataToSave);
    }

    function retrieveDataAfterUpdate() {
        const backupData = getStorageJSON(STORAGE_KEYS.BACKUP_DATA);
        if (backupData && Object.keys(backupData).length) {
            Object.entries(backupData).forEach(([key, value]) => {
                if (value) setStorage(key, value);
            });
        }
    }

    function checkAndUpdateVersion() {
        const currentVersion = getScriptVersion();
        const savedVersion = getStorage(STORAGE_KEYS.SCRIPT_VERSION);

        if (!savedVersion || savedVersion < currentVersion) {
            retrieveDataAfterUpdate();
            setStorage(STORAGE_KEYS.SCRIPT_VERSION, currentVersion);
        }
    }

    function spawnWithBuild(cmd) {
        const spawnName = userInput.value.trim();
        window.input.execute(`game_spawn ${spawnName}`);
        window.input.execute(`game_stats_build ${cmd}`);
        toggleVisibility(document.getElementById("myhover"));
    }

    function dragElement(elmnt) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const header = document.getElementById(elmnt.id + "Header");
        (header || elmnt).onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    function adjustFontSize(element) {
        let fontSize = 16;
        element.style.fontSize = fontSize + "px";
        while (element.scrollWidth > element.clientWidth && fontSize > 6) {
            element.style.fontSize = --fontSize + "px";
        }
    }

    // New: small utilities for performance
    const debounce = (fn, delay = 80) => {
        let t;
        return (...args) => {
            clearTimeout(t);
            t = setTimeout(() => fn.apply(null, args), delay);
        };
    };

    // New: single-pass allocation counter (avoids N regex scans)
    function countAllocations(code) {
        const counts = new Array(ATTRIBUTES.length).fill(0);
        for (let i = 0; i < code.length; i++) {
            const idx = code.charCodeAt(i) - 49; // '1' -> 0
            if (idx >= 0 && idx < counts.length) {
                const maxL = ATTRIBUTES[idx].maxLevel || MAX_ATTRIBUTE_LEVEL;
                if (counts[idx] < maxL) counts[idx]++;
            }
        }
        const total = counts.reduce((a, c) => a + c, 0);
        const isSmasher = counts.some((c, idx) => {
            const maxL = ATTRIBUTES[idx].maxLevel || MAX_ATTRIBUTE_LEVEL;
            return maxL > MAX_ATTRIBUTE_LEVEL && c > MAX_ATTRIBUTE_LEVEL;
        });
        return { counts, total, isSmasher };
    }

    // ========== ATTRIBUTE EDITOR CREATION ==========
    function createAttributeEditor(popupId = "", initialCode = "", onUpdate) {
        const container = createElement("div");
        let code = initialCode;
        let totalPoints = MAX_POINTS;

        const pointsCounter = createElement("div", null, {
            id: `pointsCounter${popupId ? '-' + popupId : ''}`,
            textContent: `Points: ${MAX_POINTS}`,
            style: {
                display: "inline-block",
                padding: "2px 6px",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                borderRadius: "5px",
                marginBottom: "5px"
            }
        });

        const codeString = createElement("input", null, {
            id: `codeString${popupId ? '-' + popupId : ''}`,
            type: "text",
            value: code,
            style: {
                display: "block",
                width: "80%",
                margin: "0 auto 10px auto",
                textAlign: "center",
                fontSize: "18px"
            }
        });

        function updateAttributes() {
            // Single-pass count
            const { counts, total, isSmasher } = countAllocations(code);
            totalPoints = MAX_POINTS - total;

            ATTRIBUTES.forEach((attribute, index) => {
                const attributeRow = document.getElementById(`attributeRow-${popupId}-${index}`);
                if (!attributeRow) return;

                const maxLevel = attribute.maxLevel || MAX_ATTRIBUTE_LEVEL;
                const attributeCount = counts[index];

                // minus visual
                const minusButton = attributeRow.children[0];
                minusButton.style.backgroundColor = attributeCount > 0 ? attribute.color : "gray";

                // base 7 squares
                for (let i = 0; i < MAX_ATTRIBUTE_LEVEL; i++) {
                    const square = attributeRow.children[i + 1];
                    const filled = i < Math.min(attributeCount, MAX_ATTRIBUTE_LEVEL);
                    square.style.backgroundColor = filled ? attribute.color : "gray";
                    square.style.border = filled ? "1px solid black" : "0";
                }

                // bonus squares (beyond 7 up to 10)
                const desiredBonus = Math.max(0, attributeCount - MAX_ATTRIBUTE_LEVEL);
                const existingBonusSquares = attributeRow.querySelectorAll('.bonus-square');
                const toAdd = desiredBonus - existingBonusSquares.length;

                if (toAdd > 0) {
                    const frag = document.createDocumentFragment();
                    for (let i = 0; i < toAdd; i++) {
                        const bonusSquare = createElement("div", "bonus-square", {
                            style: {
                                border: "1px solid black",
                                backgroundColor: attribute.color,
                                width: "30px",
                                height: "30px",
                                display: "inline-block",
                                position: "relative",
                                padding: "0 5px",
                                animation: "bounceIn 0.3s ease-out"
                            }
                        });
                        frag.appendChild(bonusSquare);
                    }
                    attributeRow.insertBefore(frag, attributeRow.lastChild);
                } else if (toAdd < 0) {
                    // remove extra
                    const allBonus = Array.from(existingBonusSquares);
                    for (let i = desiredBonus; i < allBonus.length; i++) {
                        allBonus[i].remove();
                    }
                }
            });

            // points display
            if (isSmasher || totalPoints < 0 || totalPoints > MAX_POINTS) {
                pointsCounter.textContent = `Points: modified for Smashers`;
            } else {
                pointsCounter.textContent = `Points: ${totalPoints}`;
            }

            if (onUpdate) onUpdate(code, totalPoints);
        }

        function createAttributeRow(attribute, index) {
            const attributeRow = createElement("div", "attribute", {
                id: `attributeRow-${popupId}-${index}`,
                style: { position: "relative" }
            });

            const minusButton = createElement("button", null, {
                textContent: "-",
                style: {
                    padding: "0 5px",
                    border: "1px solid black",
                    borderRadius: "50px 0 0 50px",
                    width: "32px",
                    height: "32px",
                    color: "black",
                    fontWeight: "bold",
                    backgroundColor: "gray"
                }
            });

            // Fix: remove last occurrence of this attribute from code
            minusButton.onclick = () => {
                const pos = code.lastIndexOf(String(index + 1));
                if (pos !== -1) {
                    code = code.slice(0, pos) + code.slice(pos + 1);
                    codeString.value = code;
                    updateAttributes();
                }
            };

            attributeRow.appendChild(minusButton);

            // base squares and label
            for (let i = 0; i < MAX_ATTRIBUTE_LEVEL; i++) {
                const colorDiv = createElement("div", null, {
                    style: {
                        border: "0",
                        backgroundColor: "gray",
                        width: "30px",
                        height: "30px",
                        display: "inline-block",
                        position: "relative",
                        padding: "0 5px"
                    }
                });
                if (i === 3) {
                    const textSpan = createElement("span", null, {
                        textContent: attribute.name,
                        style: {
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            color: "white",
                            pointerEvents: "none",
                            whiteSpace: "nowrap",
                            zIndex: "1",
                            textShadow: "1px 1px #000, 2px 2px #555, -1px -1px #000, -2px -2px #555"
                        }
                    });
                    colorDiv.appendChild(textSpan);
                }
                attributeRow.appendChild(colorDiv);
            }

            const plusButton = createElement("button", null, {
                textContent: "+",
                style: {
                    padding: "0 5px",
                    border: "1px solid black",
                    borderRadius: "0 50px 50px 0",
                    width: "32px",
                    height: "32px",
                    color: "black",
                    fontWeight: "bold",
                    backgroundColor: attribute.color
                }
            });

            // Use current counts to enforce maxLevel without regex
            plusButton.onclick = () => {
                const maxLevel = attribute.maxLevel || MAX_ATTRIBUTE_LEVEL;
                const { counts } = countAllocations(code);
                if (counts[index] < maxLevel) {
                    code += (index + 1);
                    codeString.value = code;
                    updateAttributes();
                }
            };

            attributeRow.appendChild(plusButton);
            return attributeRow;
        }

        // Debounce code input to reduce DOM churn
        codeString.addEventListener("input", debounce((event) => {
            code = event.target.value;
            updateAttributes();
        }, 80));

        container.appendChild(pointsCounter);
        container.appendChild(codeString);

        // Faster initial build using a fragment
        const frag = document.createDocumentFragment();
        ATTRIBUTES.forEach((attribute, index) => {
            frag.appendChild(createAttributeRow(attribute, index));
        });
        container.appendChild(frag);

        setTimeout(() => updateAttributes(), 0);

        return {
            container,
            getCode: () => code,
            pointsCounter,
            codeString
        };
    }

    // ========== POPUP CREATION ==========
    function createPopup(title, popupId = `popup-${Date.now()}`) {
        const popup = createElement("div", "popup", {
            id: popupId,
            innerHTML: `<div class="popup-header" id="${popupId}Header">${title}</div>`
        });

        const closeButton = createElement("button", "close-btn", {
            textContent: "X",
            onclick: () => document.body.removeChild(popup)
        });

        popup.appendChild(closeButton);
        document.body.appendChild(popup);
        dragElement(popup);

        return popup;
    }

    function createEditPopup(buttonContainer, buttonData) {
        const popupId = `editPopup-${Date.now()}`;
        const popup = createPopup("Drag me", popupId);

        const buildNameInput = createElement("input", null, {
            type: "text",
            placeholder: "Build Name",
            value: buttonData.name,
            style: {
                display: "block",
                width: "80%",
                margin: "0 auto 10px auto"
            }
        });

        popup.appendChild(buildNameInput);

        const { container, getCode } = createAttributeEditor(popupId, buttonData.cmd);
        popup.appendChild(container);

        // Trigger update after container is in DOM
        setTimeout(() => {
            const event = new Event('input', { bubbles: true });
            popup.querySelector(`#codeString-${popupId}`).dispatchEvent(event);
        }, 10);

        const saveChangesButton = createElement("button", null, {
            textContent: "Save Changes",
            style: {
                display: "block",
                margin: "10px auto",
                width: "80%",
                fontSize: "14px",
                padding: "8px",
                backgroundColor: "white",
                border: "2px solid black",
                borderRadius: "5px",
                cursor: "pointer"
            },
            onclick: () => {
                const buildName = buildNameInput.value.trim();
                if (!buildName) {
                    alert("Please enter a build name.");
                    return;
                }

                buttonData.name = buildName;
                buttonData.cmd = getCode();

                buttonContainer.querySelector(".button").textContent = buildName;

                const savedButtons = getStorageJSON(STORAGE_KEYS.SAVED_BUTTONS);
                const updatedButtons = savedButtons.map(b =>
                                                        b.cmd === buttonData.cmd && b.name !== buildName ? b :
                                                        b.name === buttonData.name || b.cmd === buttonData.cmd ? buttonData : b
                                                       );
                setStorageJSON(STORAGE_KEYS.SAVED_BUTTONS, updatedButtons);

                document.body.removeChild(popup);
            }
        });

        const deleteButton = createElement("button", null, {
            textContent: "Delete Build",
            style: {
                display: "block",
                margin: "10px auto",
                width: "80%",
                fontSize: "14px",
                padding: "8px",
                backgroundColor: "white",
                border: "2px solid black",
                borderRadius: "5px",
                cursor: "pointer"
            },
            onclick: () => {
                const confirmPopup = createPopup("Drag Me", `confirmDelete-${popupId}`);

                const message = createElement("div", null, {
                    textContent: "Are you sure you want to delete this build?",
                    style: {
                        textAlign: "center",
                        marginBottom: "20px"
                    }
                });

                const btnContainer = createElement("div", null, {
                    style: {
                        display: "flex",
                        justifyContent: "space-between"
                    }
                });

                const noBtn = createElement("button", "button", {
                    textContent: "NO",
                    onclick: () => document.body.removeChild(confirmPopup)
                });

                const yesBtn = createElement("button", "button", {
                    textContent: "YES",
                    onclick: () => {
                        buttonContainer.remove();
                        const savedButtons = getStorageJSON(STORAGE_KEYS.SAVED_BUTTONS);
                        setStorageJSON(STORAGE_KEYS.SAVED_BUTTONS,
                                       savedButtons.filter(b => b.name !== buttonData.name)
                                      );
                        document.body.removeChild(confirmPopup);
                        document.body.removeChild(popup);
                    }
                });

                btnContainer.appendChild(noBtn);
                btnContainer.appendChild(yesBtn);
                confirmPopup.appendChild(message);
                confirmPopup.appendChild(btnContainer);
            }
        });

        popup.appendChild(saveChangesButton);
        popup.appendChild(deleteButton);
    }

    // ========== INITIALIZATION ==========
    saveDataBeforeUpdate();
    checkAndUpdateVersion();

    // ========== STYLES ==========
    const style = createElement("style", null, {
        textContent: `
        #myhover a {
            z-index: 999;
            position: absolute;
            top: 300px;
            transition: 0.3s;
            width: 250px;
            padding: 45px 15px 15px 15px; /* extra top space for drag bar */
            background-image: ${BACKGROUND_IMAGE};
            background-color: #555;
            text-decoration: none;
            font-size: 10px;
            font-family: 'Monoton', cursive;
            text-shadow: 1px 1px #000, 2px 2px #555;
            color: white;
            border: double thick white;
            border-radius: 20px;
            /* cursor removed to allow normal pointer except drag header */
        }
                /* Drag header inside main menu */
                #myhover a .main-drag-header {
                    position: absolute;
                    top: 5px;
                    left: 5px;
                    right: 45px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: rgba(5,5,5,0.85);
                    color: #fff;
                    font-size: 12px;
                    font-family: 'Monoton', cursive;
                    text-shadow: 1px 1px #000, 2px 2px #555;
                    border: 1px solid white;
                    border-radius: 12px;
                    cursor: grab;
                    user-select: none;
                }
                #myhover a .main-drag-header:active { cursor: grabbing; }
        /* Right side (default) */
        #myhover a.snap-right { right: -260px; left: auto; }
        #myhover a.snap-right:hover { right: 0; }
        /* Left side */
        #myhover a.snap-left { left: -260px; right: auto; }
        #myhover a.snap-left:hover { left: 0; }
        /* During drag: disable hover and let JS control position */
        .dragging,
        .dragging * {
            transform: none !important;
            transition: none !important;
        }
        .dragging:hover {
            transform: none !important;
            transition: none !important;
        }
        /* Magnet snap animation - ease in (slow start) then ease out (slow end) with bounce */
        #myhover a.magnet-snap {
            transition: left 0.6s cubic-bezier(0.34, 1.56, 0.64, 1),
                        right 0.6s cubic-bezier(0.34, 1.56, 0.64, 1),
                        top 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .button {
            display: block;
            margin: 5px auto;
            width: 90%;
            text-align: center;
            font-size: 18px;
            font-family: 'Jersey 10', sans-serif;
            color: black;
            background-color: white;
            border-radius: 5px;
            transition: 0.4s;
            cursor: pointer;
        }
        .button:hover { transform: translateX(-10px); }
        #userInput {
            margin: 5px auto;
            width: 90%;
            padding: 8px;
            font-family: 'Monoton', cursive;
            text-align: center;
        }
        #specialButton {
            display: block;
            margin: 5px auto;
            width: 90%;
            text-align: center;
            font-size: 18px;
            font-family: 'Jersey 10', sans-serif;
            color: white;
            background-color: black;
            border-radius: 5px;
            border-color: white;
            transition: 0.4s;
            cursor: pointer;
            opacity: 0.8;
        }
        #specialButton:hover {
            color: black;
            background-color: darkgray;
            transform: translateX(-10px);
        }
        .popup {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 300px;
            background-image: ${BACKGROUND_IMAGE};
            background-color: white;
            border: double thick white;
            border-radius: 10px;
            padding: 20px;
            padding-top: 50px;
            z-index: 1000;
            text-shadow: 1px 1px #000, 2px 2px #555;
        }
        .attribute {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
        }
        .close-btn {
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            top: 1px;
            right: 0px;
            width: 40px;
            height: 35px;
            color: white;
            cursor: pointer;
            font-size: 18px;
            transition: background-color 0.3s;
            text-shadow: 1px 1px #000, 2px 2px #555;
            border-radius: 10px;
            background-color: rgba(0, 0, 0, 0.8);
            z-index: 10;
        }
        .close-btn:hover { background-color: red; }
        #topRightButton {
            position: absolute;
            top: 5px;
            right: 5px;
            width: 30px;
            height: 30px;
            padding: 0;
            background-color: rgba(5,5,5,0.85);
            color: white;
            border: 1px solid white;
            border-radius: 12px;
            cursor: pointer;
            font-size: 16px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: 'Monoton', cursive;
            text-shadow: 1px 1px #000, 2px 2px #555;
            transition: background-color 0.3s;
            z-index: 1001;
        }
        #topRightButton:hover { background-color: rgba(255,0,0,0.85); }
        #buildButtonsContainer {
            max-height: 400px;
            overflow-y: scroll;
            margin-left: 5px;
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
        ::-webkit-scrollbar { width: 10px; }
        ::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover { background: #555; }
        .popup-header {
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            top: 1px;
            left: 0px;
            right: 35px;
            height: 30px;
            cursor: grabbing;
            z-index: 10;
            background-color: rgba(5, 5, 5, 0.8);
            color: #fff;
            font-size: 10px;
            font-family: 'Monoton', cursive;
            text-shadow: 1px 1px #000, 2px 2px #555;
            border-radius: 10px;
            margin-bottom: 10px;
        }
        .edit-button {
            background-color: gray;
            border: none;
            color: white;
            font-size: 18px;
            cursor: pointer;
            width: 30px;
            height: 30px;
            margin-right: 5px;
            transition: background-color 0.3s;
        }
        .edit-button:hover { background-color: lightgray; }
        @keyframes bounceIn {
            0% { transform: scale(0); opacity: 0; }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); opacity: 1; }
        }
        #minimap-center-dot {
            position: fixed;
            pointer-events: none;
            z-index: 9999;
            border: ${MINIMAP_CONFIG.RING_BORDER};
            background: ${MINIMAP_CONFIG.RING_COLOR};
            box-shadow: ${MINIMAP_CONFIG.RING_SHADOW};
            border-radius: 50%;
            opacity: ${MINIMAP_CONFIG.RING_OPACITY};
        }
        #minimap-center-dot .core {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%,-50%);
            background: ${MINIMAP_CONFIG.CORE_COLOR};
            border: ${MINIMAP_CONFIG.CORE_BORDER};
            box-shadow: ${MINIMAP_CONFIG.CORE_SHADOW};
            opacity: ${MINIMAP_CONFIG.CORE_OPACITY};
            border-radius: 50%;
        }
        `});
    document.head.appendChild(style);

    // Extra styles for build preview tooltip
    const previewStyle = createElement("style", null, {
        textContent: `
        .build-preview {
            position: fixed;
            background: rgba(0,0,0,0.85);
            border: 1px solid white;
            border-radius: 8px;
            padding: 8px;
            z-index: 3000;
            pointer-events: none;
            box-shadow: 0 4px 12px rgba(0,0,0,0.4);
            color: white;
            font-family: 'Monoton', cursive;
        }
        .build-preview-row {
            display: flex;
            align-items: center;
            margin: 2px 0;
        }
        .build-preview-label {
            font-size: 10px;
            width: 110px;
            margin-right: 6px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            text-shadow: 1px 1px #000, 2px 2px #555;
        }
        .build-preview-square {
            width: 14px;
            height: 14px;
            background: gray;
            margin-right: 3px;
            border: 1px solid transparent;
        }
        .build-preview-square.filled {
            border: 1px solid black;
        }
        .build-preview-bonus {
            width: 10px;
            height: 10px;
            margin-left: 2px;
            border: 1px solid black;
        }
        `
    });
    document.head.appendChild(previewStyle);

    // ========== MINIMAP CENTER DOT ==========
    function createMinimapDot() {
        const dot = createElement('div', null, { id: 'minimap-center-dot' });
        const core = createElement('div','core',{});
        dot.appendChild(core);
        document.body.appendChild(dot);
        return dot;
    }

    function isFullscreen() {
        // Works for F11 fullscreen and element requestFullscreen
        return !!document.fullscreenElement ||
               (window.innerWidth === screen.width && window.innerHeight === screen.height);
    }

    function updateMinimapDotPosition() {
        const dot = document.getElementById('minimap-center-dot');
        if (!dot) return;
        if (!isFullscreen()) { dot.style.display = 'none'; return; }
        dot.style.display = 'block';

        const W = window.innerWidth;
        const H = window.innerHeight;
        const minimapX = W * MINIMAP_BASELINE.minimapXPercent;
        const minimapY = H * MINIMAP_BASELINE.minimapYPercent;
        const minimapSize = W * MINIMAP_BASELINE.minimapSizePercent;

        const ringSize = minimapSize * MINIMAP_RING_RATIO;
        const coreSize = minimapSize * MINIMAP_DOT_RATIO;

        // Ensure perfect circle
        dot.style.width = ringSize + 'px';
        dot.style.height = ringSize + 'px';
        dot.style.borderRadius = '50%';

        const centerX = minimapX + minimapSize / 2;
        const centerY = minimapY + minimapSize / 2;
        dot.style.left = (centerX - ringSize / 2) + 'px';
        dot.style.top  = (centerY - ringSize / 2) + 'px';

        const coreEl = dot.querySelector('.core');
        if (coreEl) {
            coreEl.style.width = coreSize + 'px';
            coreEl.style.height = coreSize + 'px';
            coreEl.style.borderRadius = '50%';
        }
    }

    // New: throttle minimap updates to a frame
    let minimapUpdateQueued = false;
    function scheduleMinimapUpdate() {
        if (minimapUpdateQueued) return;
        minimapUpdateQueued = true;
        requestAnimationFrame(() => {
            minimapUpdateQueued = false;
            updateMinimapDotPosition();
        });
    }

    // Create and position the minimap dot
    const minimapDot = createMinimapDot();
    updateMinimapDotPosition();

    // Replace direct calls with throttled scheduler
    window.addEventListener('resize', scheduleMinimapUpdate);
    document.addEventListener('fullscreenchange', scheduleMinimapUpdate);
    window.addEventListener('orientationchange', scheduleMinimapUpdate);

    // ========== MENU CREATION ==========
    const hoverMenu = createElement("div", "hover", { id: "myhover" });
    const modMenu = createElement("a", null, { id: "modtab" });
    // Start snapped to right by default
    modMenu.classList.add('snap-right');

    // ===== Build Preview helpers =====
    let buildPreviewEl = null;
    function removeBuildPreview() {
        if (buildPreviewEl && buildPreviewEl.parentNode) {
            buildPreviewEl.parentNode.removeChild(buildPreviewEl);
        }
        buildPreviewEl = null;
    }

    function createBuildPreviewElement(code) {
        const el = createElement('div', 'build-preview');
        const { counts } = countAllocations(code); // New: single-pass counts
        ATTRIBUTES.forEach((attr, idx) => {
            const maxLevel = attr.maxLevel || MAX_ATTRIBUTE_LEVEL;
            const count = Math.min(counts[idx], maxLevel);
            const row = createElement('div', 'build-preview-row');
            const label = createElement('div', 'build-preview-label', { textContent: attr.name });
            row.appendChild(label);
            for (let i = 0; i < MAX_ATTRIBUTE_LEVEL; i++) {
                const filled = i < Math.min(count, MAX_ATTRIBUTE_LEVEL);
                const sq = createElement(
                    'div',
                    'build-preview-square' + (filled ? ' filled' : ''),
                    { style: { backgroundColor: filled ? attr.color : 'gray' } }
                );
                row.appendChild(sq);
            }
            if (count > MAX_ATTRIBUTE_LEVEL) {
                const bonus = count - MAX_ATTRIBUTE_LEVEL;
                for (let i = 0; i < bonus; i++) {
                    const b = createElement('div', 'build-preview-bonus', {
                        style: { backgroundColor: attr.color }
                    });
                    row.appendChild(b);
                }
            }
            el.appendChild(row);
        });
        return el;
    }

    function showBuildPreview(anchorEl, code) {
        removeBuildPreview();
        buildPreviewEl = createBuildPreviewElement(code);
        document.body.appendChild(buildPreviewEl);
        // Position next to anchor, clamped to viewport
        const rect = anchorEl.getBoundingClientRect();
        const prefLeft = rect.right + 8;
        let left = prefLeft;
        let top = rect.top;
        const vw = window.innerWidth, vh = window.innerHeight;
        const pw = buildPreviewEl.offsetWidth, ph = buildPreviewEl.offsetHeight;
        if (left + pw > vw - 8) {
            left = Math.max(8, rect.left - pw - 8);
        }
        if (top + ph > vh - 8) {
            top = Math.max(8, vh - ph - 8);
        }
        if (top < 8) top = 8;
        buildPreviewEl.style.left = left + 'px';
        buildPreviewEl.style.top = top + 'px';
    }

    window.addEventListener('scroll', removeBuildPreview, { passive: true });
    window.addEventListener('resize', removeBuildPreview, { passive: true });

    const dragHeader = createElement('div','main-drag-header',{textContent:'Drag Menu'});
    const menuHeader = createElement("h1");
    const versionText = createElement("small");
    const smallerVersionText = createElement("small", null, {
        textContent: `Version: ${getScriptVersion()}`
    });
    versionText.appendChild(smallerVersionText);
    menuHeader.appendChild(versionText);
    menuHeader.appendChild(document.createElement("br"));
    menuHeader.appendChild(document.createTextNode("-{Abyss⌬}-ora's Mod Menu beta"));
    modMenu.appendChild(dragHeader);
    modMenu.appendChild(menuHeader);

    // Enable drag & snap behavior for main menu anchor
    (function enableDragAndSnap(el, handle){
        let dragging = false;
        let offsetX = 0;
        let offsetY = 0;

        // Load saved position
        function loadPosition() {
            const saved = getStorageJSON(STORAGE_KEYS.MENU_POSITION);
            if (saved && saved.snapSide) {
                el.classList.remove('snap-right', 'snap-left');
                el.classList.add(saved.snapSide);
                if (saved.top !== undefined) {
                    el.style.top = saved.top + 'px';
                }
            }
        }

        // Save position
        function savePosition(snapSide, top) {
            setStorageJSON(STORAGE_KEYS.MENU_POSITION, { snapSide, top });
        }

        // Keep menu on screen when window resizes
        function keepOnScreen() {
            if (dragging) return;

            const saved = getStorageJSON(STORAGE_KEYS.MENU_POSITION);
            const rect = el.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const menuHeight = rect.height;

            // Always try to use saved position if it exists
            let targetTop = saved && saved.top !== undefined ? saved.top : rect.top;

            // Check if saved position would fit on screen
            let newTop = targetTop;

            // If menu doesn't fit on screen at all, show top part
            if (menuHeight > viewportHeight) {
                newTop = 0;
            } else {
                // Clamp to viewport bounds
                if (targetTop + menuHeight > viewportHeight) {
                    newTop = viewportHeight - menuHeight;
                }
                if (targetTop < 0) {
                    newTop = 0;
                }
            }

            // Apply position with bounce animation if changed
            if (newTop !== rect.top) {
                el.classList.add('magnet-snap');
                el.style.top = newTop + 'px';
                setTimeout(() => { el.classList.remove('magnet-snap'); }, 600);
            }
            // Note: We don't save here - only save when user manually moves it
        }

        function onMouseDown(e){
            if(e.button !== 0) return;

            dragging = true;

            // Freeze all transforms so visuals match reality
            el.classList.add("dragging");

            // Get actual pixel position on screen ignoring transforms
            const rect = el.getBoundingClientRect();

            // Calculate offset from mouse to element
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;

            // Remove snap classes
            el.classList.remove('snap-right', 'snap-left');

            // Switch to absolute positioning locked to the screen location
            el.style.position = "absolute";
            el.style.left = rect.left + "px";
            el.style.top = rect.top + "px";
            el.style.right = "auto";

            e.preventDefault();
        }

        function onMouseMove(e){
            if (!dragging) return;

            // Move EXACTLY with the mouse but constrain to viewport
            const newLeft = e.clientX - offsetX;
            const newTop = e.clientY - offsetY;

            // Get element dimensions
            const rect = el.getBoundingClientRect();
            const maxLeft = window.innerWidth - rect.width;
            const maxTop = window.innerHeight - rect.height;

            // Constrain position within viewport bounds
            el.style.left = Math.max(0, Math.min(newLeft, maxLeft)) + "px";
            el.style.top = Math.max(0, Math.min(newTop, maxTop)) + "px";
        }

        function onMouseUp(){
            if (!dragging) return;

            dragging = false;
            el.classList.remove("dragging");

            // Determine snap side based on center position
            const rect = el.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const mid = window.innerWidth / 2;

            let snapRight = centerX > mid;
            let snapSide = snapRight ? 'snap-right' : 'snap-left';

            // Apply magnet snap animation
            el.classList.add('magnet-snap');
            if(snapRight){
                el.classList.add('snap-right');
                el.style.left = 'auto';
                el.style.right = '';
            } else {
                el.classList.add('snap-left');
                el.style.right = 'auto';
                el.style.left = '';
            }

            // Save position
            savePosition(snapSide, rect.top);

            setTimeout(() => { el.classList.remove('magnet-snap'); }, 600);
        }

        handle.addEventListener('mousedown', onMouseDown);
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        window.addEventListener('resize', keepOnScreen);

        // Load saved position on init
        loadPosition();
        // Check position after a brief delay to ensure DOM is ready
        setTimeout(keepOnScreen, 100);
    })(modMenu, dragHeader);

    // ========== USERNAME INPUT ==========
    const inputContainer = createElement("div", null, {
        style: {
            position: "relative",
            width: "90%",
            margin: "5px auto"
        }
    });

    const heartIcon = createElement("span", null, {
        textContent: "♥",
        style: {
            position: "absolute",
            left: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            cursor: "pointer",
            fontSize: "18px",
            color: "black"
        }
    });

    const userInput = createElement("input", null, {
        id: "userInput",
        type: "text",
        placeholder: "Enter Username",
        value: getStorage(STORAGE_KEYS.USERNAME) || "",
        style: {
            width: "100%",
            padding: "8px 30px",
            border: "2px solid black",
            borderRadius: "5px",
            boxSizing: "border-box",
            fontFamily: "'Monoton', cursive",
            textAlign: "center"
        }
    });

    const dropdownArrow = createElement("span", null, {
        textContent: "▼",
        style: {
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            cursor: "pointer",
            fontSize: "14px",
            color: "black"
        }
    });

    const dropdown = createElement("div", null, {
        id: "dropdownMenu",
        style: {
            position: "absolute",
            width: "100%",
            top: "100%",
            left: "0",
            backgroundImage: BACKGROUND_IMAGE,
            border: "4px double white",
            borderTop: "none",
            display: "none",
            zIndex: "100",
            maxHeight: "150px",
            overflowY: "auto"
        }
    });

    function updateDropdown(names) {
        dropdown.innerHTML = "";
        names.forEach(name => {
            const optionContainer = createElement("div", null, {
                style: {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px",
                    cursor: "pointer",
                    fontFamily: "'Monoton', cursive",
                    textAlign: "center",
                    fontSize: "18px",
                    backgroundImage: BACKGROUND_IMAGE,
                    transition: "background 0.3s"
                }
            });

            const option = createElement("div", null, {
                textContent: name,
                style: { flexGrow: "1", textAlign: "left" }
            });

            option.addEventListener("mouseover", () => {
                optionContainer.style.backgroundColor = "rgba(169, 169, 169, 0.8)";
            });

            option.addEventListener("mouseout", () => {
                optionContainer.style.backgroundColor = "transparent";
            });

            option.addEventListener("click", () => {
                userInput.value = name;
                dropdown.style.display = "none";
                setStorage(STORAGE_KEYS.USERNAME, name);
                updateHeartIcon();
            });

            optionContainer.appendChild(option);
            dropdown.appendChild(optionContainer);
        });
    }

    function updateHeartIcon() {
        const name = userInput.value.trim();
        const savedNames = getStorageJSON(STORAGE_KEYS.SAVED_NAMES);
        heartIcon.style.color = savedNames.includes(name) ? "red" : "black";
    }

    dropdownArrow.addEventListener("click", () => toggleVisibility(dropdown));

    document.addEventListener("click", (event) => {
        if (!inputContainer.contains(event.target)) {
            dropdown.style.display = "none";
        }
    });

    userInput.addEventListener("input", (event) => {
        setStorage(STORAGE_KEYS.USERNAME, event.target.value);
        updateHeartIcon();
    });

    heartIcon.addEventListener("click", () => {
        const name = userInput.value.trim();
        if (!name) return;

        const savedNames = getStorageJSON(STORAGE_KEYS.SAVED_NAMES);
        const nameIndex = savedNames.indexOf(name);

        if (nameIndex === -1) {
            savedNames.push(name);
            heartIcon.style.color = "red";
        } else {
            savedNames.splice(nameIndex, 1);
            heartIcon.style.color = "black";
        }

        setStorageJSON(STORAGE_KEYS.SAVED_NAMES, savedNames);
        updateDropdown(savedNames);
    });

    inputContainer.appendChild(heartIcon);
    inputContainer.appendChild(userInput);
    inputContainer.appendChild(dropdownArrow);
    inputContainer.appendChild(dropdown);
    modMenu.appendChild(inputContainer);

    const savedNames = getStorageJSON(STORAGE_KEYS.SAVED_NAMES);
    updateDropdown(savedNames);
    updateHeartIcon();

    // ========== BUILD BUTTONS CONTAINER ==========
    const buildButtonsContainer = createElement("div", null, { id: "buildButtonsContainer" });
    modMenu.appendChild(buildButtonsContainer);

    function createButton(buttonData) {
        const buttonContainer = createElement("div", null, {
            style: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }
        });

        const editButton = createElement("button", "edit-button", {
            textContent: "🖉",
            onclick: () => { removeBuildPreview(); createEditPopup(buttonContainer, buttonData); }
        });

        // Hover preview for build attributes
        editButton.addEventListener('mouseenter', () => showBuildPreview(editButton, buttonData.cmd));
        editButton.addEventListener('mouseleave', removeBuildPreview);
        editButton.addEventListener('blur', removeBuildPreview);

        const button = createElement("button", "button", {
            textContent: buttonData.name,
            style: { backgroundColor: buttonData.color },
            onclick: () => spawnWithBuild(buttonData.cmd)
        });

        buttonContainer.appendChild(editButton);
        buttonContainer.appendChild(button);
        buildButtonsContainer.appendChild(buttonContainer);
    }

    // Load saved buttons
    const savedButtons = getStorageJSON(STORAGE_KEYS.SAVED_BUTTONS);
    savedButtons.forEach(createButton);

    // ========== ADD BUILD BUTTON ==========
    const specialButton = createElement("button", null, {
        id: "specialButton",
        textContent: "[+]",
        onclick: () => {
            const popupId = "createBuildPopup";
            const popup = createPopup("Drag me", popupId);

            const buildNameInput = createElement("input", null, {
                type: "text",
                placeholder: "Build Name",
                style: {
                    display: "block",
                    width: "80%",
                    margin: "0 auto 10px auto"
                }
            });

            popup.appendChild(buildNameInput);

            const { container, getCode } = createAttributeEditor(popupId);
            popup.appendChild(container);

            const createBuildButton = createElement("button", null, {
                textContent: "Create Build",
                style: {
                    display: "block",
                    margin: "20px auto 0 auto",
                    width: "80%",
                    fontSize: "18px",
                    padding: "10px",
                    backgroundColor: "white",
                    border: "2px solid black",
                    borderRadius: "5px",
                    cursor: "pointer"
                },
                onclick: () => {
                    const buildName = buildNameInput.value.trim();
                    if (!buildName) {
                        alert("Please enter a build name.");
                        return;
                    }

                    const newButtonData = {
                        name: buildName,
                        color: "#C0C0C0",
                        cmd: getCode()
                    };

                    const savedButtons = getStorageJSON(STORAGE_KEYS.SAVED_BUTTONS);
                    savedButtons.push(newButtonData);
                    setStorageJSON(STORAGE_KEYS.SAVED_BUTTONS, savedButtons);

                    createButton(newButtonData);
                    document.body.removeChild(popup);
                }
            });

            popup.appendChild(createBuildButton);
        }
    });

    modMenu.appendChild(specialButton);

    // ========== RESET BUTTON ==========
    const topRightButton = createElement("button", null, {
        id: "topRightButton",
        textContent: "↻",
        onclick: () => {
            const resetPopup = createPopup("Reset Confirmation");

            const confirmationMessage = createElement("div", null, {
                textContent: "Do you really want to reset to default builds?",
                style: {
                    textAlign: "center",
                    marginBottom: "20px"
                }
            });

            const buttonsContainer = createElement("div", null, {
                style: {
                    display: "flex",
                    justifyContent: "space-between"
                }
            });

            const noButton = createElement("button", "button", {
                textContent: "NO",
                onclick: () => document.body.removeChild(resetPopup)
            });

            const yesButton = createElement("button", "button", {
                textContent: "YES",
                onclick: () => {
                    localStorage.removeItem(STORAGE_KEYS.SAVED_BUTTONS);
                    localStorage.removeItem(STORAGE_KEYS.REMOVED_DEFAULTS);
                    location.reload();
                }
            });

            buttonsContainer.appendChild(noButton);
            buttonsContainer.appendChild(yesButton);
            resetPopup.appendChild(confirmationMessage);
            resetPopup.appendChild(buttonsContainer);
        }
    });

    modMenu.appendChild(topRightButton);
    hoverMenu.appendChild(modMenu);
    document.body.appendChild(hoverMenu);

    // ========== KEYBOARD SHORTCUT ==========
    document.addEventListener("keydown", (event) => {
        if ((event.key === "r" || event.key === "R") &&
            !["INPUT", "TEXTAREA"].includes(event.target.tagName)) {
            toggleVisibility(document.getElementById("myhover"));
        }
    });
})();