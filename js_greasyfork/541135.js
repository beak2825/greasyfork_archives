// ==UserScript==
// @name         XP Minigame
// @namespace    https://skyskraber.dk
// @version      3.5
// @description  XP & Level system med rank og med kommandoer
// @author       Deus
// @match        https://www.skyskraber.dk/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/541135/XP%20Minigame.user.js
// @updateURL https://update.greasyfork.org/scripts/541135/XP%20Minigame.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Læs tema fra localStorage (forventet 'light' eller 'dark')
let theme = localStorage.getItem("theme") || "dark";


// Farveopsætning pr. tema
const colors = {
    dark: {
        background: "rgb(30 41 59 / var(--tw-bg-opacity, 1))",
        border: "#334155",
        text: "#FAFAFA",
        progressBarBg: "#004d2b",
        progressBarFill: "#00ff7b",
        popupBg: "#a7e7b8",
        popupBorder: "#0c8d10",
        popupText: "#1a1a1a",
        settingsBg: "#1e293b",
        settingsBorder: "#334155",
        buttonBg: "#005f36",
        buttonText: "white"
    },
    light: {
        background: "#e0f2fe",
        border: "#d1d5db",
        text: "#1f2937",
        progressBarBg: "#bbf7d0",
        progressBarFill: "#22c55e",
        popupBg: "#d1fae5",
        popupBorder: "#16a34a",
        popupText: "#065f46",
        settingsBg: "#ffffff",
        settingsBorder: "#d1d5db",
        buttonBg: "#22c55e",
        buttonText: "#065f46"
    }
};


    const settingsKey = "skysk_settings";
    let settings = JSON.parse(localStorage.getItem(settingsKey)) || {
        xpPerMessage: 1,
        levelMultiplier: 10,
        showPopup: true
    };

    function saveSettings() {
        localStorage.setItem(settingsKey, JSON.stringify(settings));
    }

    let xp = parseInt(localStorage.getItem("skysk_xp")) || 0;
    let level = parseInt(localStorage.getItem("skysk_level")) || 1;
    let messagesSent = parseInt(localStorage.getItem("skysk_msgs")) || 0;

    const levelsPerRank = 4;

    const ranks = [
    "Medarbejder",
    "Specialist",
    "Senior Specialist",
    "Teamleder",
    "Afdelingsleder",
    "Projektleder",
    "Kontorchef",
    "Driftschef",
    "Senior Manager",
    "Regionchef",
    "Direktørassistent",
    "Operations Manager",
    "Vice Direktør",
    "Adm. Direktør",
    "Bestyrelsesmedlem",
    "Vicepræsident",
    "Præsident",
    "CEO",
    "Direktør"
];

    function getRank(lvl) {
        let idx = Math.floor((lvl - 1) / levelsPerRank);
        if (idx >= ranks.length) idx = ranks.length -1;
        return ranks[idx];
    }

    const getXPForNextLevel = lvl => 10 + lvl * settings.levelMultiplier;

    function gainXP(amount = 1) {
        xp += amount;
        messagesSent++;
        const needed = getXPForNextLevel(level);
        if (xp >= needed) {
            xp -= needed;
            level++;
            if (settings.showPopup) showLevelUpPopup();
        }
        updateDisplay();
        saveData();
    }

    function saveData() {
        localStorage.setItem("skysk_xp", xp);
        localStorage.setItem("skysk_level", level);
        localStorage.setItem("skysk_msgs", messagesSent);
    }

    let xpBox, settingsPanel;

    function updateDisplay() {
        if (!xpBox) return;

        const progressPercent = Math.floor((xp / getXPForNextLevel(level)) * 100);

       const c = colors[theme]; // shorthand

xpBox.innerHTML = `
<div style="font-size: 12px; display: flex; justify-content: space-between; align-items: center;">
        <div style="font-size: 12px; color: ${c.text};"><strong>Level ${level}: ${getRank(level)}</strong></div>
        <button id="toggleSettingsBtn" style="background: none; border: none; font-size: 16px; cursor: pointer; color: ${c.text};">⚙️</button>
    </div>
    <div style="display: flex; justify-content: space-between; margin-top: 8px; font-size: 11px; font-weight: bold; gap: 5px; color: ${c.text};">
        <div style="flex: 1; display: flex; justify-content: flex-start;">🧪 XP: ${xp} / ${getXPForNextLevel(level)}</div>
        <div style="flex: 1; display: flex; justify-content: flex-end">💬 Beskeder: ${messagesSent}</div>
    </div>
    <div style="margin-top: 6px; width: 100%; height: 6px; background: ${c.progressBarBg}; border-radius: 4px; overflow: hidden;">
        <div style="width: ${progressPercent}%; height: 100%; background: ${c.progressBarFill};"></div>
    </div>
`;
        const toggleBtn = document.getElementById("toggleSettingsBtn");
        if (toggleBtn) {
            toggleBtn.onclick = () => {
                settingsPanel.style.display = settingsPanel.style.display === "none" ? "block" : "none";
            };
        }


        if (!settingsPanel || !settingsPanel.parentNode) {
            settingsPanel = createSettingsPanel();
            xpBox.appendChild(settingsPanel);
        }
    }


    function showLevelUpPopup() {
        const el = document.createElement("div");
        el.textContent = `🎉 Du nåede Level ${level}!`;
        Object.assign(el.style, {
    position: "fixed",
    top: "50px",
    left: "50%",
    transform: "translateX(-50%)",
    background: colors[theme].popupBg,
    color: colors[theme].popupText,
    border: `2px solid ${colors[theme].popupBorder}`,
    padding: "10px 20px",
    fontWeight: "bold",
    zIndex: 99999,
    boxShadow: `0 0 10px ${colors[theme].progressBarFill}`,
    borderRadius: "8px",
    fontFamily: "sans-serif",
    fontSize: "16px"
});

        document.body.appendChild(el);
        setTimeout(() => el.remove(), 3000);
    }

    function createSettingsPanel() {
        const panel = document.createElement("div");
        panel.style.display = "none";
        panel.style.border = `1px solid ${colors[theme].settingsBorder}`;
        panel.style.background = colors[theme].settingsBg;
        panel.style.color = colors[theme].text;
        panel.style.padding = "10px";
        panel.style.marginTop = "10px";
        panel.style.borderRadius = "6px";
        panel.style.fontFamily = "sans-serif";
        panel.style.fontSize = "13px";
        panel.style.width = "100%";
        panel.style.boxSizing = "border-box";
        panel.style.lineHeight = "1.6";


        panel.innerHTML = `
            <label>
                <input id="popupCheck" type="checkbox" ${settings.showPopup ? "checked" : ""}>
                Vis 🎉 level-up popup
            </label><br><br>
            <button id="saveBtn" style="cursor: pointer;">💾 Gem</button>
            <button id="resetBtn" style="cursor: pointer; color: red; margin-left: 10px;">🔁 Nulstil</button>

            <hr style="margin: 10px 0; border-color: #006622;">

            <div style="display: flex; gap: 10px; margin-bottom: 6px;">
    <button id="toggleRanksBtn" style="flex: 1; background: #15803d; border: none; padding: 6px 12px; border-radius: 4px; color: white; cursor: pointer; font-size: 13px;">
        Vis ranks
    </button>
    <button id="toggleCommandsBtn" style="flex: 1; background: #15803d; border: none; padding: 6px 12px; border-radius: 4px; color: white; cursor: pointer; font-size: 13px;">
        Vis kommandoer
    </button>
</div>
<div id="ranksList" style="display:none; margin-top: 8px; max-height: 175px; overflow-y: auto; padding: 6px; border-radius: 4px; font-size: 12px;">
    ${ranks.map((r, i) => `<div>${i * levelsPerRank + 1} - ${r}</div>`).join('')}
</div>
<div id="commandsList" style="display:none; margin-top: 8px; max-height: 175px; overflow-y: auto; padding: 6px; border-radius: 4px; font-size: 12px; white-space: nowrap;">
    <div><strong>/stats:</strong> Vis nuværende statistik</div>
    <div><strong>/rank:</strong> Vis nuværende rank</div>
    <div><strong>/nr:</strong> Vis næste rank</div>
    <div><strong>/xp:</strong> Vis dine XP</div>
    <div><strong>/direktør:</strong> Antal beskeder til Direktør rank</div>
    <div><strong>/info:</strong> Kort fortalt hvad XP Minigame er</div>
    <br>
    <div style="font-weight: bold;">OBS: 27.000 beskeder for at blive Direktør.</div>
</div>

        `;

        setTimeout(() => {
            document.getElementById("saveBtn").onclick = () => {
                settings.showPopup = document.getElementById("popupCheck").checked;
                saveSettings();
                updateDisplay();
                alert("Indstillinger gemt!");
            };

            document.getElementById("resetBtn").onclick = () => {
                if (confirm("Er du sikker på, at du vil nulstille alt?")) {
                    xp = 0;
                    level = 1;
                    messagesSent = 0;
                    saveData();
                    updateDisplay();
                    alert("XP, level og beskeder er nulstillet.");
                }
            };

            const toggleRanksBtn = document.getElementById("toggleRanksBtn");
            const ranksList = document.getElementById("ranksList");
            toggleRanksBtn.onclick = () => {
                if (ranksList.style.display === "none") {
                    ranksList.style.display = "block";
                    toggleRanksBtn.textContent = "Skjul ranks";
                } else {
                    ranksList.style.display = "none";
                    toggleRanksBtn.textContent = "Vis ranks";
                }
            };

            const toggleCommandsBtn = document.getElementById("toggleCommandsBtn");
            const commandsList = document.getElementById("commandsList");
            toggleCommandsBtn.onclick = () => {
                if (commandsList.style.display === "none") {
                    commandsList.style.display = "block";
                    toggleCommandsBtn.textContent = "Skjul kommandoer";
                } else {
                    commandsList.style.display = "none";
                    toggleCommandsBtn.textContent = "Vis kommandoer";
                }
            };
        }, 100);

        return panel;
    }


    function injectXPBox() {
        const chatContainer = document.querySelector('[data-radix-scroll-area-viewport]');
        if (!chatContainer) return;

        xpBox = document.createElement("div");
        xpBox.id = "xpLevelBox";
        Object.assign(xpBox.style, {
    backgroundColor: colors[theme].background,
    border: `1px solid ${colors[theme].border}`,
    color: colors[theme].text,
    padding: "10px",
    marginBottom: "8px",
    borderRadius: "6px",
    fontFamily: "sans-serif",
    fontSize: "13px",
    width: "100%",
    boxSizing: "border-box",
    zIndex: "10"
});

        if (chatContainer.firstChild) {
            chatContainer.insertBefore(xpBox, chatContainer.firstChild);
        } else {
            chatContainer.appendChild(xpBox);
        }

        updateDisplay();
    }




    // WebSocket override
    let WebSocketOrig = window.WebSocket;
    window.WebSocket = new Proxy(WebSocketOrig, {
        construct(target, args) {
            const ws = new target(...args);
            const originalSend = ws.send;

            ws.send = function (data) {
                try {
                    const parsed = JSON.parse(data);
                    if (parsed.type === "chat" && parsed.data?.message) {
                        const msg = parsed.data.message.trim();
                        if (!msg.startsWith("/")) {
                            gainXP(settings.xpPerMessage);
                        }
                        // Kommandoer til chatten

                        if (msg === "/stats") {
                            const reply = `[Bruger Info] Level: ${level}, XP: ${xp} / ${getXPForNextLevel(level)}, Rank: ${getRank(level)}, Beskeder: ${messagesSent}`;
                            ws.send(JSON.stringify({
                                type: "chat",
                                data: { message: reply }
                            }));
                            return false;
                        }

                        if (msg === "/level" || msg === "/levels") {
                            const reply = `[Level Info] Level: ${level}`;
                            ws.send(JSON.stringify({
                                type: "chat",
                                data: { message: reply }
                            }));
                            return false;
                        }

                        if (msg === "/rank") {
                            const reply = `[Rank Info] Jeg har rank: ${getRank(level)} på level ${level}.`;
                            ws.send(JSON.stringify({
                                type: "chat",
                                data: { message: reply }
                            }));
                            return false;
                        }

                        if (msg === "/nr") {
                            const needed = getXPForNextLevel(level) - xp;
                            const nextRankName = getRank(level + 1);
                            const reply = `[Næste Rank] Næste rank hedder ${nextRankName} og jeg mangler ${needed} XP`;
                            ws.send(JSON.stringify({
                                type: "chat",
                                data: { message: reply }
                            }));
                            return false;
                        }

                        if (msg === "/næste") {
                            const needed = getXPForNextLevel(level) - xp;
                            const reply = `[Næste Level] Du mangler ${needed} XP for at nå næste level.`;
                            ws.send(JSON.stringify({
                                type: "chat",
                                data: { message: reply }
                            }));
                            return false;
                        }


                        if (msg === "/info") {
                            const needed = getXPForNextLevel(level) - xp;
                            const reply = `[XP Minigame] Et minispil, hvor du kan stige i rank og blive den ultimative Direktør.`;
                            ws.send(JSON.stringify({
                                type: "chat",
                                data: { message: reply }
                            }));
                            return false;
                        }


                        if (msg === "/xp") {
    const needed = getXPForNextLevel(level) - xp;
    const reply = `[XP info] Jeg har ${xp} XP. Mangler ${needed} XP til næste level.`;
    ws.send(JSON.stringify({
        type: "chat",
        data: { message: reply }
    }));
    return false;
}

                        if (msg === "/direktør") {
    const neededMessages = 27000 - messagesSent;
    const reply = neededMessages > 0
        ? `[Direktør info] Du mangler ${neededMessages} beskeder for at blive Direktør.`
        : `[Direktør] Tillykke! Du er allerede Direktør.`;
    ws.send(JSON.stringify({
        type: "chat",
        data: { message: reply }
    }));
    return false;
}
                    }
                } catch (e) { }
                return originalSend.call(this, data);
            };

            return ws;
        }
    });

    // Init
    function init() {
        injectXPBox();
    }

    // Lyt på temaændringer i localStorage fra andre faner/vinduer
window.addEventListener("storage", e => {
    if (e.key === "theme") {
        let newTheme = e.newValue || "dark";
        if (newTheme !== theme) {
            // Opdater farver i scriptet og genopfrisk UI
            // theme er en const, så vi kan ikke re-assign, så vi gør det sådan her:
            // I stedet laver vi en funktion til at opdatere UI farver baseret på ny theme
            updateTheme(newTheme);
        }
    }
});

function updateTheme(newTheme) {
    theme = newTheme;

    if (xpBox) {
        xpBox.style.backgroundColor = colors[theme].background;
        xpBox.style.border = `1px solid ${colors[theme].border}`;
        xpBox.style.color = colors[theme].text;
    }
    if (settingsPanel) {
        settingsPanel.style.background = colors[theme].settingsBg;
        settingsPanel.style.border = `1px solid ${colors[theme].settingsBorder}`;
        settingsPanel.style.color = colors[theme].text;

        const ranksList = settingsPanel.querySelector("#ranksList");
        const commandsList = settingsPanel.querySelector("#commandsList");

        if (ranksList) {
            ranksList.style.background = colors[theme].settingsBg;
            ranksList.style.color = colors[theme].text;
        }
        if (commandsList) {
            commandsList.style.background = colors[theme].settingsBg;
            commandsList.style.color = colors[theme].text;
        }
    }

    updateDisplay();
}


setInterval(() => {
    const storedTheme = localStorage.getItem("theme") || "dark";
    if (storedTheme !== theme) {
        updateTheme(storedTheme);
    }
}, 100);



// Overvåg ændringer i DOM'en for at sikre at chatContainer er tilgængelig
const observer = new MutationObserver(() => {
    const chatContainer = document.querySelector('[data-radix-scroll-area-viewport]');
    if (chatContainer && !document.getElementById("xpLevelBox")) {
        injectXPBox();
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

})();