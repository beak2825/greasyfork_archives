// ==UserScript==
// @name         Automatisk timeboks
// @namespace    https://www.skyskraber.dk/
// @version      1.6
// @description  Automatisk timeboksklikker med tilsvarende GUI
// @match        https://www.skyskraber.dk/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546443/Automatisk%20timeboks.user.js
// @updateURL https://update.greasyfork.org/scripts/546443/Automatisk%20timeboks.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Global værdier
    let wsInstance = null;
    let moodTimer = null;
    let currentMood = "happy";
    let nextPingDelayMinutes = null;


    let settings = {
        autoHourEnabled: false,
        hourDelay: 1000,
        pingEnabled: false,
        pingIntervalBase: 12,
        autoMoodEnabled: false,
        moodIntervalBase: 12,
        moodShiftEnabled: false,
        relogEnabled: false,
        hourClickCount: 0
    };

    let pingTimer = null;
    let wsCheckInterval = null;

    function saveSettings() {
        localStorage.setItem('hourSpySettings', JSON.stringify(settings));
    }

    function loadSettings() {
        const stored = localStorage.getItem('hourSpySettings');
        if (stored) {
            try {
                const data = JSON.parse(stored);
                Object.assign(settings, data);
            } catch (e) {
                console.warn("Kunne ikke loade settings:", e);
            }
        }
    }

    function updateNextPing(text) {
        const nextPing = document.getElementById('hour-spy-next-ping');
        if (nextPing) nextPing.textContent = text;
    }

    function startPingTimer() {
        stopPingTimer();
        if (!settings.pingEnabled) {
            updateNextPing('Ping er deaktiveret');
            return;
        }
        scheduleNextPing();
    }

    function scheduleNextPing() {
        const base = settings.pingIntervalBase;
        if (isNaN(base) || base <= 0) {
            console.log("❌ Ugyldigt besked-interval.");
            updateNextPing('');
            return;
        }

        const min = Math.max(1, base - 6);
        const max = base + 6;
        const delayMinutes = Math.floor(Math.random() * (max - min + 1)) + min;
        const delayMs = delayMinutes * 60 * 1000;

        nextPingDelayMinutes = delayMinutes;
        updateNextPing(`Næste besked om: ${delayMinutes} min`);

        pingTimer = setTimeout(() => {
            if (wsInstance && wsInstance.readyState === WebSocket.OPEN) {
                const messageData = {
                    type: "chat",
                    data: { message: "." }
                };
                wsInstance.send(JSON.stringify(messageData));
                console.log(`⚡ Besked sendt kl. ${new Date().toLocaleTimeString()}`);
            } else {
                console.log("❌ WebSocket ikke klar til ping.");
            }
            scheduleNextPing();
        }, delayMs);
    }


    function updatePingStatusText() {
        const pingStatus = document.getElementById('hour-spy-ping-status');
        if (pingStatus) {
            const active = settings.pingEnabled;
            const statusText = active
            ? '<span style="color:#32cd32;">Aktiv</span>'
            : '<span style="color:#dc2626;">Deaktiv</span>';
            pingStatus.innerHTML = `Chatbesked: ${statusText}`;
        }
    }


    function updateMoodStatusText() {
        const moodStatus = document.getElementById('hour-spy-mood-status');
        if (moodStatus) {
            const active = settings.moodShiftEnabled;
            const statusText = active
            ? '<span style="color:#32cd32;">Aktiv</span>'
            : '<span style="color:#dc2626;">Deaktiv</span>';
            moodStatus.innerHTML = `Humørskift: ${statusText}`;
        }
    }



    function stopPingTimer() {
        if (pingTimer) clearTimeout(pingTimer);
    }

    function startMoodTimer() {
        stopMoodTimer();
        if (!settings.autoMoodEnabled) return;
        scheduleNextMood();
    }

    function stopMoodTimer() {
        if (moodTimer) clearTimeout(moodTimer);
    }

    function scheduleNextMood() {
        const base = settings.moodIntervalBase;
        if (isNaN(base) || base <= 0) return;

        const min = Math.max(1, base - 6);
        const max = base + 6;
        const delayMinutes = Math.floor(Math.random() * (max - min + 1)) + min;
        const delayMs = delayMinutes * 60 * 1000;

        moodTimer = setTimeout(() => {
            if (wsInstance && wsInstance.readyState === WebSocket.OPEN) {
                currentMood = currentMood === "happy" ? "mad" : "happy";
                const moodMsg = {
                    type: "mood",
                    data: { mood: currentMood }
                };
                wsInstance.send(JSON.stringify(moodMsg));
                console.log(`🎭 Humør sendt: ${currentMood} kl. ${new Date().toLocaleTimeString()}`)
            }
            scheduleNextMood();
        }, delayMs);
    }

    function updateRelogStatusText() {
        const relogStatus = document.getElementById('hour-spy-relog-status');
        if (relogStatus) {
            const active = settings.relogEnabled; // Eller en anden variabel, der styrer relog
            const statusText = active
            ? '<span style="color:#32cd32;">Aktiv</span>'
            : '<span style="color:#dc2626;">Deaktiv</span>';
            relogStatus.innerHTML = `Relog: ${statusText}`;
        }
    }

    function startRelog() {
        if (!wsCheckInterval) {
            wsCheckInterval = setInterval(() => {
                if (wsInstance && wsInstance.readyState === WebSocket.CLOSED) {
                    console.warn("WebSocket lukket - genindlæser siden...");
                    location.reload();
                }
            }, 5000);
        }
        updateRelogStatusText();
    }

    function stopRelog() {
        if (wsCheckInterval) {
            clearInterval(wsCheckInterval);
            wsCheckInterval = null;
        }
        updateRelogStatusText();
    }

    function updateHourCountText() {
        const el = document.getElementById('hour-spy-hour-count');
        if (el) {
            el.textContent = `Antal timer samlet: ${settings.hourClickCount}`;
        }
    }


    function startWebSocketMonitor() {
        if (wsCheckInterval) clearInterval(wsCheckInterval);
        wsCheckInterval = setInterval(() => {
            if (wsInstance && wsInstance.readyState === WebSocket.CLOSED) {
                console.warn("WebSocket lukket - genindlæser siden...");
                location.reload();
            }
        }, 5000);
    }

    const WebSocketOrig = window.WebSocket;
    window.WebSocket = new Proxy(WebSocketOrig, {
        construct(target, args) {
            const ws = new target(...args);
            wsInstance = ws;
            startWebSocketMonitor();
            updateWebSocketStatus();

            ws.addEventListener('message', (event) => {
                let data;
                try {
                    data = JSON.parse(event.data);
                } catch {
                    return;
                }

                if (data?.player?.newHour && settings.autoHourEnabled) {
                    setTimeout(() => {
                        if (ws.readyState === WebSocket.OPEN) {
                            ws.send(JSON.stringify({ type: "hour" }));
                            settings.hourClickCount++;
                            saveSettings();
                            updateHourCountText();
                            console.log(`⏰ Hour sendt kl. ${new Date().toLocaleTimeString()}`);
                        }
                    }, settings.hourDelay);
                }

            });

            ws.addEventListener('open', () => updateWebSocketStatus());
            ws.addEventListener('close', () => updateWebSocketStatus());
            ws.addEventListener('error', () => updateWebSocketStatus());

            return ws;
        }
    });

    function waitForElement(selector, callback, intervalTime = 300, maxAttempts = 20) {
        let attempts = 0;
        const interval = setInterval(() => {
            const el = document.querySelector(selector);
            if (el) {
                clearInterval(interval);
                callback(el);
            } else if (++attempts >= maxAttempts) {
                clearInterval(interval);
                console.warn(`Element ${selector} ikke fundet efter ${maxAttempts} forsøg.`);
            }
        }, intervalTime);
    }

    function applyTheme() {
        const theme = localStorage.getItem("theme") || "light";
        const popup = document.getElementById('hour-spy-popup');
        if (!popup) return;
        if (theme === "dark") {
            popup.style.backgroundColor = "#1e293b";
            popup.style.color = "#e2e8f0";
            popup.style.border = "1px solid #334155";
        } else {
            popup.style.backgroundColor = "#ffffff";
            popup.style.color = "#1f2937";
            popup.style.border = "1px solid #e5e7eb";
        }
    }

    function createPopup() {
        if (document.getElementById('hour-spy-popup')) return;

        const popup = document.createElement('div');
        popup.id = 'hour-spy-popup';
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.zIndex = 9999;
        popup.style.padding = '1rem';
        popup.style.borderRadius = '0.5rem';
        popup.style.boxShadow = '0 10px 15px rgba(0,0,0,0.1)';
        popup.style.minWidth = '250px';
        popup.style.maxWidth = '90%';
        popup.style.fontSize = '14px';

        popup.innerHTML = `
            <div style="margin-bottom: 0.5rem; font-weight: bold;">Auto timeboks indstillinger</div>
            <label><input type="checkbox" id="auto-hour-toggle" style="transform: translateY(20%); margin-right: 5px;
"> Tag automatisk timeboks</label><br>
            <label>Forsinkelse (ms): <input type="number" id="hour-delay" min="0" step="100" style="
    padding: 0px 5px;
"></label><br><br>

            <label><input type="checkbox" id="ping-toggle" style="transform: translateY(20%); margin-right: 5px;
"> Aktiver chatbesked (± 6 minutter)</label><br>
            <label>Chat interval (min): <input type="number" id="ping-interval" min="1" step="1" style="
    padding: 0px 5px;
"></label><br><br>

            <label><input type="checkbox" id="mood-toggle" style="transform: translateY(20%); margin-right: 5px;
"> Aktiver humørskift (± 6 minutter)</label><br>
<label>Humør interval (min): <input type="number" id="mood-interval" min="1" step="1" style="
    padding: 0px 5px;
"></label><br><br>

<label><input type="checkbox" id="relog-toggle" style="transform: translateY(20%); margin-right: 5px;
"> Aktiver Relog</label>

<br><br>

<hr style="border-color: #838c98"> <br>
            <div id="hour-spy-next-ping" style="font-size: 12px; opacity: 0.7;"></div>
            <div id="hour-spy-status" style="font-size: 12px; opacity: 0.7;"></div>
            <div id="hour-spy-ping-status" style="font-size: 12px; opacity: 0.7;"></div>
            <div id="hour-spy-mood-status" style="font-size: 12px; opacity: 0.7;"></div>
            <div id="hour-spy-relog-status" style="font-size: 12px; opacity: 0.7;"></div>
            <div id="hour-spy-hour-count" style="font-size: 12px; opacity: 0.7;"></div>

        `;

        document.body.appendChild(popup);
        applyTheme();

        if (nextPingDelayMinutes !== null) {
            updateNextPing(`Næste besked sendes om: ${nextPingDelayMinutes} min`);
        }

        updatePingStatusText();

        document.getElementById('auto-hour-toggle').checked = settings.autoHourEnabled;
        document.getElementById('hour-delay').value = settings.hourDelay;
        document.getElementById('ping-toggle').checked = settings.pingEnabled;
        document.getElementById('ping-interval').value = settings.pingIntervalBase;
        document.getElementById('mood-toggle').checked = settings.autoMoodEnabled;
        document.getElementById('mood-interval').value = settings.moodIntervalBase;
        document.getElementById('mood-toggle').checked = settings.moodShiftEnabled;



        document.getElementById('mood-toggle').onchange = (e) => {
            settings.autoMoodEnabled = e.target.checked;
            saveSettings();
            if (settings.autoMoodEnabled) startMoodTimer(); else stopMoodTimer();
        };

        document.getElementById('mood-interval').oninput = (e) => {
            const val = parseInt(e.target.value);
            if (!isNaN(val) && val > 0) {
                settings.moodIntervalBase = val;
                saveSettings();
                if (settings.autoMoodEnabled) startMoodTimer();
            }
        };

        document.getElementById('mood-toggle').onchange = (e) => {
    settings.moodShiftEnabled = e.target.checked;
    saveSettings();
    updateMoodStatusText();
};



        document.getElementById('auto-hour-toggle').onchange = (e) => {
            settings.autoHourEnabled = e.target.checked;
            saveSettings();
        };
        document.getElementById('hour-delay').oninput = (e) => {
            settings.hourDelay = parseInt(e.target.value) || 0;
            saveSettings();
        };
        document.getElementById('ping-toggle').onchange = (e) => {
            settings.pingEnabled = e.target.checked;
            saveSettings();
            updatePingStatusText(); // <-- HER
            if (settings.pingEnabled) startPingTimer(); else stopPingTimer();
        };
        document.getElementById('ping-interval').oninput = (e) => {
            const val = parseInt(e.target.value);
            if (!isNaN(val) && val > 0) {
                settings.pingIntervalBase = val;
                saveSettings();
                if (settings.pingEnabled) startPingTimer();
            }
        };

        const relogToggle = document.getElementById('relog-toggle');
        relogToggle.checked = settings.relogEnabled;

        relogToggle.onchange = (e) => {
            settings.relogEnabled = e.target.checked;
            saveSettings();
            if (settings.relogEnabled) {
                startRelog();
            } else {
                stopRelog();
            }
        };


       relogToggle.onchange = (e) => {
    settings.relogEnabled = e.target.checked;
    saveSettings();
    if (settings.relogEnabled) {
        startRelog();
    } else {
        stopRelog();
    }
};


        // Opdater samtlige funktioner, når pop-up åbnes
        updatePingStatusText();
        updateMoodStatusText();
        updateRelogStatusText();
        updateHourCountText();
        updateWebSocketStatus()

        document.addEventListener("click", function handler(e) {
            if (!popup.contains(e.target) && e.target.id !== 'hour-spy-btn') {
                popup.remove();
                document.removeEventListener("click", handler);
            }
        });

    }

    function updateWebSocketStatus() {
        const statusDiv = document.getElementById('hour-spy-status');
        if (!statusDiv) return;

        if (!wsInstance) {
            statusDiv.innerHTML = `WebSocket status: <span style="color:#dc2626;">Ikke tilsluttet</span>`;
            return;
        }

        const state = wsInstance.readyState;
        let textPrefix = "WebSocket: ";
        let statusText = "";
        let color = "";

        switch (state) {
            case WebSocket.CONNECTING:
                statusText = "Forbinder...";
                color = "#eab308"; // gul
                break;
            case WebSocket.OPEN:
                statusText = "Aktiv";
                color = "#32cd32"; // limegrøn
                break;
            case WebSocket.CLOSING:
                statusText = "Lukker...";
                color = "#eab308"; // gul
                break;
            case WebSocket.CLOSED:
                statusText = "Lukket";
                color = "#dc2626"; // rød
                break;
            default:
                statusText = "Ukendt";
                color = "#6b7280"; // grå
        }

        statusDiv.innerHTML = `${textPrefix}<span style="color:${color};">${statusText}</span>`;
    }


    loadSettings();
    if (settings.autoMoodEnabled) startMoodTimer();
    if (settings.pingEnabled) startPingTimer();
    if (settings.relogEnabled) startRelog();


    updateWebSocketStatus();
    if (settings.pingEnabled) startPingTimer();

    if (settings.relogEnabled) startRelog();

    // Opdater websocket status i popup hvert sekund
    setInterval(() => {
        if (document.getElementById('hour-spy-popup')) {
            updateWebSocketStatus();
        }
    }, 200);

    // Vent på refresh-knappen med SVG class lucide-refresh
    waitForElement('button > svg.lucide-refresh-cw', (svgIcon) => {
    const refreshBtn = svgIcon.closest('button');
    if (!refreshBtn) return;
    const container = refreshBtn.parentElement;
    if (!container) return;

    if (document.getElementById('hour-spy-btn')) return;

    const spyBtn = document.createElement('button');
    spyBtn.id = 'hour-spy-btn';
    spyBtn.title = "Auto ⚡";
    spyBtn.className = refreshBtn.className; // samme styling som refresh-knap
    spyBtn.textContent = '⚡';

    container.insertBefore(spyBtn, refreshBtn);

    spyBtn.addEventListener('click', () => {
        createPopup();
    });
});


})();
