// ==UserScript==
// @name Sploop Advanced Hat Switcher
// @description A script that includes a hat macro & a custom movable menu
// @version 1.4
// @icon https://sploop.io/img/ui/favicon.png
// @match *://sploop.io/*
// @license MIT
// @namespace https://greasyfork.org/users/1311498
// @downloadURL https://update.greasyfork.org/scripts/497301/Sploop%20Advanced%20Hat%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/497301/Sploop%20Advanced%20Hat%20Switcher.meta.js
// ==/UserScript==

let customSocket;
let macroEnabled = true;
let kills = 0;

function initSocket(customSocket) {
    window.customSocket = customSocket;
}

WebSocket.prototype.originalSend = WebSocket.prototype.send;

window.WebSocket = new Proxy(window.WebSocket, {
    construct(target, args) {
        const instance = new target(...args);
        if (args[0].includes("sploop")) {
            initSocket(instance);
        }
        return instance;
    }
});

WebSocket.prototype.send = function(data) {
    this.originalSend(data);
    if (customSocket !== this) customSocket = this;
};

const HATS_CONFIG = {
    WarriorHelmet: { id: 2, key: "KeyW" },
    MysticHelmet: { id: 4, key: "KeyM" },
    EngineerHelmet: { id: 11, key: "KeyE" },
    DefenderHelmet: { id: 5, key: "KeyD" },
    SpeedsterHelmet: { id: 7, key: "KeyS" },
    DiverHelmet: { id: 9, key: "KeyV" }
};

// Load saved settings from localStorage
function loadSettings() {
    const savedSettings = JSON.parse(localStorage.getItem("hatSwitcherSettings"));
    if (savedSettings) {
        for (const [hat, config] of Object.entries(savedSettings)) {
            if (HATS_CONFIG[hat]) {
                HATS_CONFIG[hat].key = config.key;
            }
        }
        if (savedSettings.customMessage) {
            customMessage = savedSettings.customMessage;
        }
        if (typeof savedSettings.macroEnabled !== 'undefined') {
            macroEnabled = savedSettings.macroEnabled;
        }
    }
}

// Save settings to localStorage
function saveSettings() {
    localStorage.setItem("hatSwitcherSettings", JSON.stringify({
        ...HATS_CONFIG,
        customMessage,
        macroEnabled
    }));
}

loadSettings();

function switchHat(id) {
    if (macroEnabled) {
        customSocket.send(new Uint8Array([5, id, 1]));
        customSocket.send(new Uint8Array([5, id, 0]));
    }
}

document.addEventListener("keypress", function(event) {
    const pressedKey = event.code;
    for (const [hat, config] of Object.entries(HATS_CONFIG)) {
        if (config.key === pressedKey) {
            switchHat(config.id);
            break;
        }
    }
});

let customMessage = "Trolled: {kills}";

customSocket.addEventListener("message", function(event) {
    const data = new Uint8Array(event.data);
    const hk = new window.hatKey(data);
    if (hk.type === 0x1c) {
        const ht = document.querySelector("#chat-0").value;
        if (ht.trim() === "") {
            return;
        }
        kills++;
        customSocket.send(new Uint8Array([0, 3, 0]));
        customSocket.send(new TextEncoder().encode(customMessage.replace("{kills}", kills)));
    }
});

const menu = document.createElement("div");
menu.id = "hatSwitcherMenu";
menu.innerHTML = `
    <div class="menu-container">
        <h2 style="color: #1E8449; text-align: center; font-size: 20px;">Custom Hat Switcher</h2>
        ${Object.entries(HATS_CONFIG).map(([hat, config]) => `
            <div class="menu-item">
                <label for="${hat}" style="color: #FFFFFF;">${hat}:</label>
                <input type="text" id="${hat}" value="${config.key}" style="padding: 8px; border-radius: 5px; border: 1px solid #1E8449; background-color: #A9DFBF; color: #21618C;">
            </div>`).join('')}
        <button id="toggleMacroButton" style="margin-top: 10px; padding: 10px; background-color: #1E8449; color: #FFFFFF; border: none; border-radius: 5px; cursor: pointer;">${macroEnabled ? "Disable Macros" : "Enable Macros"}</button>
        <button id="menuCloseButton" style="margin-top: 10px; padding: 10px; background-color: #1E8449; color: #FFFFFF; border: none; border-radius: 5px; cursor: pointer;">Close Menu</button>
        <div class="menu-item">
            <label for="customMessage" style="color: #FFFFFF;">Custom Message:</label>
            <input type="text" id="customMessage" value="${customMessage}" style="padding: 8px; border-radius: 5px; border: 1px solid #1E8449; background-color: #A9DFBF; color: #21618C;">
        </div>
        <div class="menu-item" style="text-align: center; margin-top: 20px;">
            <a id="discordLink" href="https://discord.gg/your-discord-link" target="_blank" style="color: #1E8449; text-decoration: none; font-weight: bold;">Join our Discord</a>
        </div>
    </div>`;
menu.style.cssText = `
    position: fixed;
    top: 100px;
    left: 100px;
    background-color: #EAF2F8;
    border: 2px solid #1E8449;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
    z-index: 10000;
    max-width: 300px;`;

document.body.appendChild(menu);

document.getElementById("menuCloseButton").addEventListener("click", () => {
    menu.style.display = "none";
});

document.getElementById("toggleMacroButton").addEventListener("click", () => {
    macroEnabled = !macroEnabled;
    document.getElementById("toggleMacroButton").textContent = macroEnabled ? "Disable Macros" : "Enable Macros";
    saveSettings();
});

Object.entries(HATS_CONFIG).forEach(([hat, config]) => {
    document.getElementById(hat).addEventListener("change", (event) => {
        const newKey = event.target.value;
        // Check if the new key is already assigned to another hat
        if (Object.values(HATS_CONFIG).some(cfg => cfg.key === newKey && cfg !== config)) {
            alert(`The key ${newKey} is already assigned to another hat. Please choose a different key.`);
            event.target.value = config.key; // Reset to the previous value
        } else {
            config.key = newKey;
            saveSettings();
        }
    });
});

document.getElementById("customMessage").addEventListener("change", (event) => {
    customMessage = event.target.value;
    saveSettings();
});
