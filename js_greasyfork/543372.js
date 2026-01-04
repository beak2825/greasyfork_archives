// ==UserScript==
// @name         Tandro chat spammer
// @namespace    http://tampermonkey.net/
// @icon         https://i.ibb.co/BKwQLg9P/logo-small-4.png
// @version      1.4
// @author       ##########
// @license      MIT
// @description  Sendet automatisch alle X Sekunden eine Chat-Nachricht mit Start/Stopp-Steuerung
// @match        https://tandro.de/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543372/Tandro%20chat%20spammer.user.js
// @updateURL https://update.greasyfork.org/scripts/543372/Tandro%20chat%20spammer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let settings = JSON.parse(localStorage.getItem("autoChatSettings")) || {
        message: "Hello from Tampermonkey!",
        intervalSec: 30,  // seconds between sends
        spamming: false,
    };

    let spamIntervalId = null;

    function sendMessage(text) {
        const input = document.querySelector('.message-text[contenteditable="true"]');
        if (!input) return console.warn("[AutoSender] Message input not found");

        input.innerText = text;
        input.dispatchEvent(new Event("input", { bubbles: true }));

        setTimeout(() => {
            input.dispatchEvent(new KeyboardEvent("keydown", {
                bubbles: true,
                cancelable: true,
                key: "Enter",
                code: "Enter"
            }));
            console.log(`[AutoSender] Message sent at ${new Date().toLocaleTimeString()}`);
        }, 100);
    }

    function startSpamming() {
        if (spamIntervalId) return; // already running
        spamIntervalId = setInterval(() => {
            sendMessage(settings.message);
        }, settings.intervalSec * 1000);
        settings.spamming = true;
        saveSettings();
        updateButtons();
        console.log("[AutoSender] Started spamming.");
    }

    function stopSpamming() {
        if (spamIntervalId) {
            clearInterval(spamIntervalId);
            spamIntervalId = null;
        }
        settings.spamming = false;
        saveSettings();
        updateButtons();
        console.log("[AutoSender] Stopped spamming.");
    }

    function saveSettings() {
        localStorage.setItem("autoChatSettings", JSON.stringify(settings));
    }

    function updateButtons() {
        const startBtn = document.getElementById("autoChatStart");
        const stopBtn = document.getElementById("autoChatStop");

        if (settings.spamming) {
            startBtn.disabled = true;
            stopBtn.disabled = false;
        } else {
            startBtn.disabled = false;
            stopBtn.disabled = true;
        }
    }

    function createUI() {
        if (document.getElementById("autoChatPanel")) return; // Prevent duplicates

        const panel = document.createElement("div");
        panel.id = "autoChatPanel";
        panel.style = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #222;
            color: white;
            border: 1px solid #555;
            padding: 10px;
            border-radius: 10px;
            z-index: 9999;
            width: 270px;
            font-family: sans-serif;
            box-shadow: 0 0 10px rgba(0,0,0,0.7);
            pointer-events: auto;
        `;

        panel.innerHTML = `
            <strong>🕒 Spammer Settings</strong><br>
            <label>Message:</label><br>
            <textarea id="autoChatMsg" style="width: 100%; height: 50px; background:#333; color: white; border: 1px solid #888; resize: vertical;"></textarea><br>
            <label>Interval (seconds):</label><br>
            <input id="autoChatInterval" type="number" min="1" step="1" style="width: 100%; background:#333; color: white; border: 1px solid #888;"><br>
            <button id="autoChatSave" style="margin-top: 5px; width: 100%;">💾 Save Settings</button><br>
            <button id="autoChatStart" style="margin-top: 5px; width: 48%; float: left;">▶️ Start Spamming</button>
            <button id="autoChatStop" style="margin-top: 5px; width: 48%; float: right;">⏹ Stop Spamming</button>
            <div style="clear: both;"></div>
        `;

        document.body.appendChild(panel);

        const msgTextarea = document.getElementById("autoChatMsg");
        const intervalInput = document.getElementById("autoChatInterval");

        msgTextarea.value = settings.message;
        intervalInput.value = settings.intervalSec;

        [msgTextarea, intervalInput].forEach(el => {
            el.disabled = false;
            el.readOnly = false;
            el.style.pointerEvents = "auto";
            el.style.userSelect = "text";
        });

        document.getElementById("autoChatSave").onclick = () => {
            const msg = msgTextarea.value.trim();
            const intervalVal = parseInt(intervalInput.value, 10);

            if (!msg) {
                alert("⚠️ Please enter a message.");
                return;
            }
            if (isNaN(intervalVal) || intervalVal < 1) {
                alert("⚠️ Please enter a valid interval (seconds, >=1).");
                return;
            }

            settings.message = msg;
            settings.intervalSec = intervalVal;
            saveSettings();

            alert("✅ Settings saved!");
        };

        document.getElementById("autoChatStart").onclick = () => {
            startSpamming();
        };

        document.getElementById("autoChatStop").onclick = () => {
            stopSpamming();
        };

        updateButtons();
        makeDraggable(panel);
    }

    function makeDraggable(el) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        el.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            if (e.target !== el) return;
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
            el.style.bottom = "auto";
            el.style.right = "auto";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    // Initialize UI and load saved state, restore spamming if enabled
    setTimeout(() => {
        console.log("[AutoSender] UI and spam controls initialized.");
        createUI();
        if (settings.spamming) {
            startSpamming();
        }
    }, 5000);
})();
