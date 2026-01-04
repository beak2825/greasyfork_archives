// ==UserScript==
// @name         Nitro Type Race Enhancements
// @namespace    https://www.youtube.com/@InternetTyper
// @version      1.12.6
// @license MIT
// @description  Rainbow mode, customizable colors, custmoizable zoom on the race text via slider, custmizable font, and customizable auto reload and delay BUILT IN, as well as "perfect nitros" TW: Perfect Nitros does NOT work whenever you use the rainbow text option. Subscribe To Internet Typer Plz?
// @author       InternetTyper
// @match        https://www.nitrotype.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/537783/Nitro%20Type%20Race%20Enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/537783/Nitro%20Type%20Race%20Enhancements.meta.js
// ==/UserScript==

(function() {
    "use strict";


    const fontLink = document.createElement("link");
    fontLink.href = "https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@700&family=Fira+Code:wght@700&family=JetBrains+Mono:wght@700&display=swap";
    fontLink.rel = "stylesheet";
    document.head.appendChild(fontLink);

    let raceTextColor       = localStorage.getItem("raceTextColor") || "#67d802";
    let raceBackgroundColor = localStorage.getItem("raceBackgroundColor") || "#1d1e23";
    let autoReloadMS        = parseInt(localStorage.getItem("autoReloadMS"), 10) || 475;

    let perfectNitrosEnabled = localStorage.getItem("perfectNitrosEnabled");
    if (perfectNitrosEnabled === null) {
        perfectNitrosEnabled = "true";
        localStorage.setItem("perfectNitrosEnabled", "true");
    }

    let autoReloadEnabled = localStorage.getItem("autoReloadEnabled");
    if (autoReloadEnabled === null) {
        autoReloadEnabled = "true";
        localStorage.setItem("autoReloadEnabled", "true");
    }

    let animatedGradientTextEnabled = localStorage.getItem("animatedGradientTextEnabled");
    if (animatedGradientTextEnabled === null) {
        animatedGradientTextEnabled = "false";
        localStorage.setItem("animatedGradientTextEnabled", "false");
    }

    let raceTextZoom = parseInt(localStorage.getItem("raceTextZoom"), 10) || 28;


    let raceFont = localStorage.getItem("raceFont") || "Roboto Mono";


    let customRaceSettingsEnabled = localStorage.getItem("customRaceSettingsEnabled");
    if (customRaceSettingsEnabled === null) {
        customRaceSettingsEnabled = "true";
        localStorage.setItem("customRaceSettingsEnabled", "true");
    }

    function updateRaceBoxStyle() {
        let styleEl = document.getElementById("raceBoxStyle");
        if (!styleEl) {
            styleEl = document.createElement("style");
            styleEl.id = "raceBoxStyle";
            document.head.appendChild(styleEl);
        }
        if (customRaceSettingsEnabled === "true") {
            styleEl.textContent = `
                .dash-copyContainer {
                    background: ${raceBackgroundColor} !important;
                    -webkit-box-shadow: 0px 1px 157px 10px rgba(0,0,0,0.78) !important;
                    box-shadow: 0px 1px 157px 10px rgba(0,0,0,0.78) !important;
                    border-radius: 5px !important;
                    flex: 1 !important;
                    overflow: hidden !important;
                    padding: 15px !important;
                    display: flex !important;
                }
                .dash-copy {
                    color: ${raceTextColor} !important;
                    font-family: "${raceFont}", "Courier New", Courier, "Lucida Sans Typewriter", "Lucida Typewriter", monospace !important;
                    font-size: ${raceTextZoom}px !important;
                    font-weight: 700 !important;
                }
                ::selection {
                    background-color: #1976c6;
                    color: white;
                }
            `;
        } else {

            styleEl.textContent = "";
        }
    }
    updateRaceBoxStyle();

    function updateAnimatedGradientText() {
        let styleEl = document.getElementById("animatedGradientTextStyle");
        if (!styleEl) {
            styleEl = document.createElement("style");
            styleEl.id = "animatedGradientTextStyle";
            document.head.appendChild(styleEl);
        }
        if (animatedGradientTextEnabled === "true") {
            styleEl.textContent = `
                .dash-word {
                    text-align: center;
                    text-decoration: underline;
                    font-size: 32px;
                    font-family: monospace;
                    letter-spacing: 5px;
                    background: linear-gradient(to left, #f00, orange, yellow, #09ec09, #9898b9, #a783c1, violet);
                    background-repeat: repeat;
                    -webkit-background-clip: text;
                    background-clip: text;
                    color: transparent;
                    animation: animated_text 6s ease-in-out infinite;
                    background-size: 400% 100%;
                }
                @keyframes animated_text {
                    0%,100% { background-position: 0 0; }
                    50% { background-position: 100% 0; }
                }
                .dash-copyContainer {
                    background: #1d1e23;
                    box-shadow: 0 1px 157px 10px rgba(0, 0, 0, 0.78);
                }
                .dash-letter.is-correct.is-typed {
                    opacity: 0;
                }
            `;
        } else {
            styleEl.textContent = "";
        }
    }
    updateAnimatedGradientText();

    const nitrosOptions = {
        highlightColor: 'white',
        intervalMs: 100
    };

    function perfectNitrosClient() {
        if (document.body.contains(document.querySelector('.dash-letter'))) {
            clearInterval(perfectNitrosIntervalId);
            let wordList = [];
            for (let wordElem of document.getElementsByClassName('dash-word')) {
                wordList.push(wordElem.textContent.replace(/\s/g, ''));
            }
            let largestWords = [];
            for (let word of wordList) {
                if (typeof largestWords[0] === 'undefined' || largestWords[0].length === word.length) {
                    largestWords.push(word);
                }
                if (word.length > largestWords[0].length) {
                    largestWords = [word];
                }
            }
            Array.prototype.indexesOf = function(value) {
                let indexes = [];
                for (let i = this.length - 1; i >= 0; i--) {
                    if (this[i] === value) {
                        indexes.unshift(i);
                    }
                }
                return indexes;
            };
            let largestWordIndexes = [];
            for (let text of wordList.values()) {
                if (largestWords.includes(text)) {
                    largestWordIndexes.push(wordList.indexesOf(text));
                }
            }
            largestWordIndexes = [...new Set(largestWordIndexes.flat())];
            for (let idx of largestWordIndexes) {
                document.getElementsByClassName('dash-word')[idx].style.backgroundColor = nitrosOptions.highlightColor;
            }
        }
    }

    let perfectNitrosIntervalId = null;
    function startPerfectNitros() {
        if (!perfectNitrosIntervalId) {
            perfectNitrosIntervalId = setInterval(perfectNitrosClient, nitrosOptions.intervalMs);
            console.info("Perfect Nitros Activated.");
        }
    }
    function stopPerfectNitros() {
        if (perfectNitrosIntervalId) {
            clearInterval(perfectNitrosIntervalId);
            perfectNitrosIntervalId = null;
            console.info("Perfect Nitros Deactivated.");
        }
    }
    if (perfectNitrosEnabled === "true") {
        startPerfectNitros();
    } else {
        stopPerfectNitros();
    }

    const raceResultObserver = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1 && node.classList.contains("race-results")) {
                    if (autoReloadEnabled === "true") {
                        console.info(`Race results detected. Reloading in ${autoReloadMS} ms.`);
                        setTimeout(() => location.reload(), autoReloadMS);
                    } else {
                        console.info("Race results detected but auto reload is disabled.");
                    }
                    raceResultObserver.disconnect();
                }
            });
        }
    });
    raceResultObserver.observe(document.body, { childList: true, subtree: true });


    const settingsGUI = document.createElement("div");
    settingsGUI.id = "customSettingsGUI";
    settingsGUI.style.position = "fixed";
    settingsGUI.style.top = "20px";
    settingsGUI.style.left = "20px";
    settingsGUI.style.background = "rgba(0, 0, 0, 0.85)";
    settingsGUI.style.border = "1px solid #fff";
    settingsGUI.style.borderRadius = "5px";
    settingsGUI.style.color = "#fff";
    settingsGUI.style.fontFamily = "Arial, sans-serif";
    settingsGUI.style.zIndex = "1001";

    function updateSettingsGuiStyle() {
        settingsGUI.style.boxShadow = "0 0 10px 2px " + raceTextColor;
        settingsGUI.style.width = "300px";
        settingsGUI.style.padding = "10px";
    }
    updateSettingsGuiStyle();

    settingsGUI.innerHTML = `
        <div id="customSettingsHeader" style="cursor:move; text-align:center; font-size:20px; font-weight:bold; margin-bottom:10px;">
            Race Enhancements
        </div>
        <div style="margin-bottom:10px;">
            <label>Custom Race Settings Enabled: </label>
            <input type="checkbox" id="customRaceSettingsCheckbox" ${customRaceSettingsEnabled === "true" ? "checked" : ""}>
            <br>
            <label>Auto Reload Enabled: </label>
            <input type="checkbox" id="autoReloadCheckbox" ${autoReloadEnabled === "true" ? "checked" : ""}>
            <br>
            <label>Perfect Nitros Enabled: </label>
            <input type="checkbox" id="perfectNitrosCheckbox" ${perfectNitrosEnabled === "true" ? "checked" : ""}>
            <br>
            <label>RAINBOW Text: </label>
            <input type="checkbox" id="animatedGradientTextCheckbox" ${animatedGradientTextEnabled === "true" ? "checked" : ""}>
        </div>
        <div style="margin-bottom:10px;">
            <label>Race Text Color: </label>
            <input type="color" id="raceTextColorInput" value="${raceTextColor}">
            &nbsp;&nbsp;
            <label>Race Background Color: </label>
            <input type="color" id="raceBackgroundColorInput" value="${raceBackgroundColor}">
        </div>
        <div style="margin-bottom:10px;">
            <label>Race Text Zoom (px): </label>
            <input type="range" id="raceTextZoomInput" min="20" max="60" step="1" value="${raceTextZoom}">
            <span id="raceTextZoomDisplay">${raceTextZoom}</span>px
        </div>
        <div style="margin-bottom:10px;">
            <label style="color: #fff;">Auto Reload Delay (ms): </label>
            <input type="number" id="autoReloadInput" value="${autoReloadMS}" style="width:80px; color: black; background-color: #fff;">
            &nbsp;&nbsp;
            <label>Race Font: </label>
            <select id="raceFontSelect" style="color: black; background-color: #fff;">
                <option value="Roboto Mono" ${raceFont === "Roboto Mono" ? "selected" : ""}>Roboto Mono</option>
                <option value="Fira Code" ${raceFont === "Fira Code" ? "selected" : ""}>Fira Code</option>
                <option value="JetBrains Mono" ${raceFont === "JetBrains Mono" ? "selected" : ""}>JetBrains Mono</option>
            </select>
        </div>
        <div style="font-size:12px; margin-top:5px; text-align:center;">
            Press Ctrl+Q to toggle this panel
        </div>
        <div style="font-size:18px; margin-top:5px; margin-bottom:0; text-align:center;">
            Created by <a href="https://www.youtube.com/@InternetTyper" target="_blank" style="color: ${raceTextColor}; text-decoration: underline;">@InternetTyper on YouTube</a>
        </div>
    `;

    document.body.appendChild(settingsGUI);


    let savedVisibility = localStorage.getItem("settingsGUIVisible");
    settingsGUI.style.display = (savedVisibility === "none") ? "none" : "block";

    function autoSaveSettings() {
        customRaceSettingsEnabled    = document.getElementById("customRaceSettingsCheckbox").checked ? "true" : "false";
        autoReloadEnabled            = document.getElementById("autoReloadCheckbox").checked ? "true" : "false";
        perfectNitrosEnabled         = document.getElementById("perfectNitrosCheckbox").checked ? "true" : "false";
        animatedGradientTextEnabled  = document.getElementById("animatedGradientTextCheckbox").checked ? "true" : "false";
        raceTextColor                = document.getElementById("raceTextColorInput").value;
        raceBackgroundColor          = document.getElementById("raceBackgroundColorInput").value;
        raceTextZoom                 = parseInt(document.getElementById("raceTextZoomInput").value, 10) || 28;
        autoReloadMS                 = parseInt(document.getElementById("autoReloadInput").value, 10) || 475;
        raceFont                     = document.getElementById("raceFontSelect").value;

        localStorage.setItem("customRaceSettingsEnabled", customRaceSettingsEnabled);
        localStorage.setItem("raceTextColor", raceTextColor);
        localStorage.setItem("raceBackgroundColor", raceBackgroundColor);
        localStorage.setItem("raceTextZoom", raceTextZoom);
        localStorage.setItem("autoReloadMS", autoReloadMS);
        localStorage.setItem("perfectNitrosEnabled", perfectNitrosEnabled);
        localStorage.setItem("autoReloadEnabled", autoReloadEnabled);
        localStorage.setItem("animatedGradientTextEnabled", animatedGradientTextEnabled);
        localStorage.setItem("raceFont", raceFont);

        updateRaceBoxStyle();
        updateSettingsGuiStyle();
        updateAnimatedGradientText();

        if (perfectNitrosEnabled === "true") {
            startPerfectNitros();
        } else {
            stopPerfectNitros();
        }

        console.info("Settings autosaved.");
    }

    document.getElementById("customRaceSettingsCheckbox").addEventListener("change", autoSaveSettings);
    document.getElementById("autoReloadCheckbox").addEventListener("change", autoSaveSettings);
    document.getElementById("perfectNitrosCheckbox").addEventListener("change", autoSaveSettings);
    document.getElementById("animatedGradientTextCheckbox").addEventListener("change", autoSaveSettings);
    document.getElementById("raceTextColorInput").addEventListener("change", autoSaveSettings);
    document.getElementById("raceBackgroundColorInput").addEventListener("change", autoSaveSettings);
    document.getElementById("raceTextZoomInput").addEventListener("input", function() {
        document.getElementById("raceTextZoomDisplay").textContent = this.value;
        autoSaveSettings();
    });
    document.getElementById("autoReloadInput").addEventListener("change", autoSaveSettings);
    document.getElementById("raceFontSelect").addEventListener("change", autoSaveSettings);

    function makeDraggable(el) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const header = document.getElementById("customSettingsHeader");
        (header || el).onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            el.style.top = (el.offsetTop - pos2) + "px";
            el.style.left = (el.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
            localStorage.setItem("settingsGUIPos", JSON.stringify({ top: el.style.top, left: el.style.left }));
        }
    }
    const savedPos = localStorage.getItem("settingsGUIPos");
    if (savedPos) {
        try {
            const { top, left } = JSON.parse(savedPos);
            settingsGUI.style.top = top;
            settingsGUI.style.left = left;
        } catch(e) {}
    }
    makeDraggable(settingsGUI);

    document.addEventListener("keydown", e => {
        if (e.ctrlKey && e.key.toLowerCase() === "q") {
            if (settingsGUI.style.display === "none") {
                settingsGUI.style.display = "block";
                localStorage.setItem("settingsGUIVisible", "block");
            } else {
                settingsGUI.style.display = "none";
                localStorage.setItem("settingsGUIVisible", "none");
            }
        }
    });
})();
