// ==UserScript==
// @name         Torn Spam Trade Chat
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Auto-recruit messages in Torn trade chat with start/stop, sound, and 125-char limit
// @match        https://www.torn.com/*
// @grant        GM_setClipboard
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/544786/Torn%20Spam%20Trade%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/544786/Torn%20Spam%20Trade%20Chat.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let timerId = null;
    let isRunning = false;

    // --- Load saved message ---
    let savedMessage = localStorage.getItem("tornRecruitMessage") || "Sweet Shop ⭐ Recruiting, min salary 35k, any stats, FREE ROTATIONAL TRAIN https://acortar.link/Z6uuLt";

    // --- UI Container ---
    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.top = "10px";
    container.style.right = "10px";
    container.style.zIndex = "9999";
    container.style.background = "rgba(0, 102, 204, 0.9)";
    container.style.padding = "10px";
    container.style.borderRadius = "8px";
    container.style.color = "white";
    container.style.fontSize = "14px";
    container.style.fontFamily = "Arial, sans-serif";
    container.style.boxShadow = "0 0 5px rgba(0,0,0,0.5)";

    // --- Input Field ---
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Enter recruitment message...";
    input.style.width = "250px";
    input.style.marginBottom = "5px";
    input.maxLength = 125; // ✅ limit to 125 chars
    input.value = savedMessage;
    container.appendChild(input);
    container.appendChild(document.createElement("br"));

    // Save input changes
    input.addEventListener("input", () => {
        localStorage.setItem("tornRecruitMessage", input.value);
    });

    // --- Buttons ---
    const copyBtn = document.createElement("button");
    copyBtn.textContent = "📋 Copy";
    copyBtn.style.marginRight = "5px";

    const toggleBtn = document.createElement("button");
    toggleBtn.textContent = "▶ Start";

    [copyBtn, toggleBtn].forEach(btn => {
        btn.style.background = "#fff";
        btn.style.color = "#0066cc";
        btn.style.border = "none";
        btn.style.padding = "5px 10px";
        btn.style.borderRadius = "5px";
        btn.style.cursor = "pointer";
        btn.style.fontWeight = "bold";
    });

    container.appendChild(copyBtn);
    container.appendChild(toggleBtn);
    document.body.appendChild(container);

    // --- Sound ---
    const sound = new Audio("https://www.soundjay.com/buttons/sounds/beep-07.mp3");

    // --- Functions ---
    function notifyAndCopy() {
        let message = input.value.trim();
        if (message.length > 125) {
            alert("⚠ Message exceeds 125 characters!");
            return;
        }
        GM_setClipboard(message);
        sound.play();
        GM_notification({
            title: "Recruit Reminder",
            text: "Message copied! Paste it in Trade Chat.",
            timeout: 5000
        });
    }

    function startReminders() {
        if (isRunning) return;
        isRunning = true;
        toggleBtn.textContent = "⏹ Stop";
        runCycle();
    }

    function stopReminders() {
        isRunning = false;
        toggleBtn.textContent = "▶ Start";
        clearTimeout(timerId);
    }

    function runCycle() {
        if (!isRunning) return;
        notifyAndCopy();
        let randomDelay = (62 + Math.floor(Math.random() * 4)) * 1000; // 62–65 seconds
        timerId = setTimeout(runCycle, randomDelay);
    }

    // --- Event Listeners ---
    copyBtn.addEventListener("click", () => notifyAndCopy());

    toggleBtn.addEventListener("click", () => {
        if (isRunning) {
            stopReminders();
        } else {
            startReminders();
        }
    });
})();
