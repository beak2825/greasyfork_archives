// ==UserScript==
// @name         Evades.io CoolOptions
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Your region only with Ancient Abyss showing Vast Void, scaling of lb and chat, mouse interaction with lb and chat toggle, icons visibility toggle, settings saved between sessions, settings menu, chat height adjustment, autoscroll chat fixed.
// @author       JoniJoni
// @match        *://evades.io/*
// @match        *://evades.online/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541227/Evadesio%20CoolOptions.user.js
// @updateURL https://update.greasyfork.org/scripts/541227/Evadesio%20CoolOptions.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let leaderboard = null;
    let chatBox = null;
    let observer = null;
    let uiObserver = null;
    let filterEnabled = false;
    let myRegion = null;
    let settingsPanel = null;
    let mutationObserver = null;
    let filterToggleDot = null;
    let wasAtBottom = true;
    let lastScrollOffsetFromBottom = 0;

    const uiSelectors = ['.settings-launcher', '.quests-launcher', '.mod-tools-launcher'];

    const defaultSettings = {
        leaderboardScale: 1,
        chatScale: 1,
        chatHeight: null,
        mouseBlockLeaderboard: false,
        mouseBlockChat: false,
        hideUI: false,
        showFilterDot: true
    };

    const settingsKey = "evades_ui_enhancer_settings";
    const settings = loadSettings();

    function saveSettings() {
        localStorage.setItem(settingsKey, JSON.stringify(settings));
    }

    function loadSettings() {
        const saved = localStorage.getItem(settingsKey);
        return saved ? { ...defaultSettings, ...JSON.parse(saved) } : { ...defaultSettings };
    }

    function findMyRegionByBoldName() {
        if (!leaderboard) return null;
        let currentRegion = null;
        let detectedRegion = null;
        for (const child of leaderboard.children) {
            if (child.classList.contains("leaderboard-title-break")) {
                currentRegion = child.textContent.trim();
            } else {
                const bold = child.querySelector("b, strong");
                if (bold) {
                    detectedRegion = currentRegion;
                    break;
                }
            }
        }
        return detectedRegion;
    }

    function filterLeaderboard() {
        if (!leaderboard || !myRegion) return;
        let inRegion = false;
        for (const child of leaderboard.children) {
            if (child.classList.contains("leaderboard-title-break")) {
                const regionName = child.textContent.trim();
                if (myRegion === "Ancient Abyss") {
                    inRegion = (regionName === "Ancient Abyss" || regionName === "Vast Void");
                } else {
                    inRegion = (regionName.toLowerCase() === myRegion.toLowerCase());
                }
                child.style.display = inRegion ? "" : "none";
            } else {
                child.style.display = inRegion ? "" : "none";
            }
        }
    }

    function showFullLeaderboard() {
        Array.from(leaderboard.children).forEach(child => {
            child.style.display = "";
        });
    }

    function toggleFilter() {
        if (!leaderboard) return;
        if (!filterEnabled) {
            myRegion = findMyRegionByBoldName();
            if (!myRegion) return;
            filterLeaderboard();
            startObserving();
        } else {
            stopObserving();
            showFullLeaderboard();
        }
        filterEnabled = !filterEnabled;
    }


//turtleeeeeeeeeee
    function toggleMouseBlockLeaderboard() {
        if (!leaderboard) return;
        settings.mouseBlockLeaderboard = !settings.mouseBlockLeaderboard;
        leaderboard.style.pointerEvents = settings.mouseBlockLeaderboard ? "none" : "";
        saveSettings();
        updateSettingsPanelCheckbox();
    }

    function toggleMouseBlockChat() {
        if (!chatBox) return;
        settings.mouseBlockChat = !settings.mouseBlockChat;
        chatBox.style.pointerEvents = settings.mouseBlockChat ? "none" : "";
        saveSettings();
        updateSettingsPanelCheckbox();
    }

    function applyUIVisibility() {
        uiSelectors.forEach(selector => {
            const els = document.querySelectorAll(selector);
            els.forEach(el => {
                el.style.display = settings.hideUI ? "none" : "";
                el.style.pointerEvents = settings.hideUI ? "none" : "";
            });
        });
    }

    function enforceUIVisibility() {
        if (!settings.hideUI) return;
        uiSelectors.forEach(selector => {
            const els = document.querySelectorAll(selector);
            els.forEach(el => {
                el.style.display = "none";
                el.style.pointerEvents = "none";
            });
        });
    }

    function toggleUIVisibility() {
        settings.hideUI = !settings.hideUI;
        applyUIVisibility();
        saveSettings();
        updateSettingsPanelCheckbox();
    }

    function applyLeaderboardScale(scale) {
        if (!leaderboard || isNaN(scale)) return;
        settings.leaderboardScale = scale;
        leaderboard.style.zoom = scale === 1 ? "" : scale;
        saveSettings();
    }

    function applyChatScale(scale) {
        if (!chatBox || isNaN(scale)) return;
        settings.chatScale = scale;
        chatBox.style.zoom = scale === 1 ? "" : scale;
        saveSettings();
    }

    function applyAllScales() {
        applyLeaderboardScale(settings.leaderboardScale);
        applyChatScale(settings.chatScale);
        applyChatHeight(settings.chatHeight);
    }

    function showScaleSliderBox({ title, initial, min = 0.3, max = 1.5, step = 0.01, onChange }) {
        const overlay = document.createElement("div");
        Object.assign(overlay.style, {
            position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
            background: "rgba(0, 0, 0, 0.6)", display: "flex",
            alignItems: "center", justifyContent: "center", zIndex: 10000
        });

        const box = document.createElement("div");
        Object.assign(box.style, {
            background: "#111", padding: "20px", borderRadius: "10px", border: "2px solid white",
            color: "#0f0", fontFamily: "monospace", textAlign: "center", minWidth: "300px"
        });

        const label = document.createElement("div");
        label.textContent = `${title}: ${initial}`;
        label.style.marginBottom = "10px";

        const slider = document.createElement("input");
        Object.assign(slider, {
            type: "range", min, max, step, value: initial
        });
        slider.style.width = "100%";
        slider.addEventListener("input", () => {
            const val = parseFloat(slider.value);
            label.textContent = `${title}: ${val}`;
            onChange(val);
        });

        box.appendChild(label);
        box.appendChild(slider);
        overlay.appendChild(box);
        document.body.appendChild(overlay);

        overlay.addEventListener("click", e => {
            if (e.target === overlay) overlay.remove();
        });
        document.addEventListener("keydown", function escClose(e) {
            if (e.key === "Escape") {
                overlay.remove();
                document.removeEventListener("keydown", escClose);
            }
        });
    }

    function showLeaderboardScaleSliderBox() {
        showScaleSliderBox({
            title: "Leaderboard Scale",
            initial: settings.leaderboardScale,
            onChange: applyLeaderboardScale
        });
    }

    function showChatScaleSliderBox() {
        showScaleSliderBox({
            title: "Chat Scale",
            initial: settings.chatScale,
            onChange: applyChatScale
        });
    }

    function applyChatHeight(heightPx) {
        if (heightPx == null) return;

        const chatWindow = document.getElementById("chat-window");
        const chatInput = document.getElementById("chat-input");
        if (!chatBox || !chatWindow || !chatInput) return;

        chatBox.style.height = `${heightPx}px`;
        chatWindow.style.height = `${heightPx - 10}px`;
        chatInput.style.top = `${heightPx}px`;

        settings.chatHeight = heightPx;
        saveSettings();
    }

    function showChatHeightSliderBox() {
        const currentHeight = chatBox ? parseInt(getComputedStyle(chatBox).height) : 150;
        showScaleSliderBox({
            title: "Chat Height (px)",
            initial: currentHeight,
            min: 50,
            max: 2000,
            step: 5,
            onChange: applyChatHeight
        });
    }

    function toggleShowFilterDot() {
        settings.showFilterDot = !settings.showFilterDot;
        if (settings.showFilterDot) {
            if (!filterToggleDot) createFilterToggleDot();
            else filterToggleDot.style.display = "block";
        } else {
            filterToggleDot?.remove();
            filterToggleDot = null;
        }
        saveSettings();
        updateSettingsPanelCheckbox();
    }

    function createFilterToggleDot() {
        if (filterToggleDot) return;
        filterToggleDot = document.createElement("div");
        Object.assign(filterToggleDot.style, {
            position: "fixed", top: "6px", right: "6px", width: "10px", height: "10px",
            borderRadius: "50%", background: "grey", zIndex: 9999, cursor: "pointer"
        });
        filterToggleDot.title = "Toggle Region Filter (Alt+Shift+B)";
        filterToggleDot.addEventListener("click", toggleFilter);
        document.body.appendChild(filterToggleDot);
    }

    function updateSettingsPanelCheckbox() {
        if (!settingsPanel) return;
        const toggles = settingsPanel.querySelectorAll("[data-setting]");
        toggles.forEach(el => {
            const key = el.getAttribute("data-setting");
            const val = settings[key];
            const labels = {
                mouseBlockChat: "Mouse interaction with chat",
                mouseBlockLeaderboard: "Mouse interaction with lb",
                hideUI: "Hide icons",
                showFilterDot: "Show region filter dot"
            };
            if (key.startsWith("mouseBlock")) {
                el.textContent = `[${val ? "✘" : "✔"}] ${labels[key]}`;
            } else {
                el.textContent = `[${val ? "✔" : "✘"}] ${labels[key]}`;
            }
        });
    }

    function createSettingsPanel() {
        settingsPanel = document.createElement("div");
        Object.assign(settingsPanel.style, {
            position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
            background: "#111", border: "2px solid #0f0", borderRadius: "10px",
            padding: "16px 20px 10px", fontFamily: "monospace", color: "#0f0",
            display: "none", zIndex: 9998, minWidth: "280px", textAlign: "left",
            boxShadow: "0 0 20px #0f0"
        });

        const closeBtn = document.createElement("div");
        Object.assign(closeBtn.style, {
            position: "absolute", top: "8px", right: "10px", cursor: "pointer",
            color: "#f00", fontSize: "16px"
        });
        closeBtn.textContent = "✖";
        closeBtn.title = "Close";
        closeBtn.addEventListener("click", () => settingsPanel.style.display = "none");

        function createToggleOption(settingKey, toggleFunc) {
            const div = document.createElement("div");
            div.style.cursor = "pointer";
            div.style.marginBottom = "8px";
            div.setAttribute("data-setting", settingKey);
            div.addEventListener("click", toggleFunc);
            return div;
        }

        function createActionOption(label, action) {
            const div = document.createElement("div");
            div.textContent = `▶ ${label}`;
            div.style.cursor = "pointer";
            div.style.marginBottom = "8px";
            div.addEventListener("click", action);
            return div;
        }

        settingsPanel.appendChild(closeBtn);
        settingsPanel.appendChild(createToggleOption("mouseBlockChat", toggleMouseBlockChat));
        settingsPanel.appendChild(createToggleOption("mouseBlockLeaderboard", toggleMouseBlockLeaderboard));
        settingsPanel.appendChild(createActionOption("Click to scale chat", showChatScaleSliderBox));
        settingsPanel.appendChild(createActionOption("Click to scale lb", showLeaderboardScaleSliderBox));
        settingsPanel.appendChild(createActionOption("Click to change height of chat", showChatHeightSliderBox));
        settingsPanel.appendChild(createToggleOption("hideUI", toggleUIVisibility));
        settingsPanel.appendChild(createToggleOption("showFilterDot", toggleShowFilterDot));

        document.body.appendChild(settingsPanel);
        updateSettingsPanelCheckbox();
    }

    function toggleSettingsPanel() {
        if (!settingsPanel) createSettingsPanel();
        settingsPanel.style.display = settingsPanel.style.display === "none" ? "block" : "none";
        updateSettingsPanelCheckbox();
    }

    function startObserving() {
        if (observer) observer.disconnect();
        observer = new MutationObserver(() => {
            if (filterEnabled && myRegion) filterLeaderboard();
        });
        observer.observe(leaderboard, { childList: true, subtree: true });
    }

    function stopObserving() {
        observer?.disconnect();
    }

    function startUIObserver() {
        uiObserver?.disconnect();
        uiObserver = new MutationObserver(enforceUIVisibility);
        uiObserver.observe(document.body, { childList: true, subtree: true });
    }

    function startScaleObserver() {
        mutationObserver?.disconnect();
        mutationObserver = new MutationObserver(() => {
            leaderboard = document.getElementById("leaderboard");
            chatBox = document.getElementById("chat");
            applyAllScales();
            if (settings.mouseBlockLeaderboard) leaderboard.style.pointerEvents = "none";
            if (settings.mouseBlockChat) chatBox.style.pointerEvents = "none";
        });
        mutationObserver.observe(document.body, { childList: true, subtree: true });

        setInterval(() => {
            const lb = document.getElementById("leaderboard");
            const cb = document.getElementById("chat");
            if (lb && cb) {
                leaderboard = lb;
                chatBox = cb;
                applyAllScales();
                if (settings.mouseBlockLeaderboard) leaderboard.style.pointerEvents = "none";
                if (settings.mouseBlockChat) chatBox.style.pointerEvents = "none";
            }
        }, 1000);
    }

    function startChatAutoScrollFix() {
        const chatWindow = document.getElementById("chat-window");
        if (!chatWindow) return;

        if (wasAtBottom) {
            chatWindow.scrollTop = chatWindow.scrollHeight;
        } else {
            chatWindow.scrollTop = chatWindow.scrollHeight - chatWindow.clientHeight - lastScrollOffsetFromBottom;
        }

        chatWindow.addEventListener("scroll", () => {
            wasAtBottom = chatWindow.scrollTop + chatWindow.clientHeight >= chatWindow.scrollHeight;
            lastScrollOffsetFromBottom = chatWindow.scrollHeight - chatWindow.clientHeight - chatWindow.scrollTop;
        });

        const observer = new MutationObserver(() => {
            if (wasAtBottom) {
                chatWindow.scrollTop = chatWindow.scrollHeight;
            } else {
                chatWindow.scrollTop = chatWindow.scrollHeight - chatWindow.clientHeight - lastScrollOffsetFromBottom;
            }
        });

        observer.observe(chatWindow, { childList: true, subtree: true });
    }

    function waitForElements() {
        leaderboard = document.getElementById("leaderboard");
        chatBox = document.getElementById("chat");
        if (!leaderboard || !chatBox) {
            setTimeout(waitForElements, 500);
        } else {
            applyAllScales();
            if (settings.mouseBlockLeaderboard) leaderboard.style.pointerEvents = "none";
            if (settings.mouseBlockChat) chatBox.style.pointerEvents = "none";
            applyUIVisibility();
            if (settings.hideUI) startUIObserver();
            startScaleObserver();
            if (settings.showFilterDot) createFilterToggleDot();
            startChatAutoScrollFix();
        }
    }

    window.addEventListener("keydown", (e) => {
        if (e.altKey && e.shiftKey) {
            switch (e.code) {
                case "KeyB": toggleFilter(); break;
                case "KeyN": toggleMouseBlockLeaderboard(); break;
                case "KeyG": toggleMouseBlockChat(); break;
                case "KeyV": toggleUIVisibility(); break;
                case "KeyM": showLeaderboardScaleSliderBox(); break;
                case "KeyF": showChatScaleSliderBox(); break;
                case "KeyE": e.preventDefault(); toggleSettingsPanel(); break;
                case "KeyH": e.preventDefault(); showChatHeightSliderBox(); break;
            }
        }
    });

    waitForElements();
})();
