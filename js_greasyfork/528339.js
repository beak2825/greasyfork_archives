// ==UserScript==
// @name         CHL - minutáž (finální)
// @namespace    http://tampermonkey.net/
// @version      4.5
// @description  Finální skript pro live použití: sleduje status a správně zobrazuje minutáž (1–20) s auto-incrementem, prioritou statusu a ochranou proti stažení hodnoty. 🏒✅
// @author       Michal
// @match        https://chl.ca/ohl/gamecentre/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528339/CHL%20-%20minut%C3%A1%C5%BE%20%28fin%C3%A1ln%C3%AD%29.user.js
// @updateURL https://update.greasyfork.org/scripts/528339/CHL%20-%20minut%C3%A1%C5%BE%20%28fin%C3%A1ln%C3%AD%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const AUTO_INCREMENT_INTERVAL = 100; // v sekundách
    let hockeyMinute = null;
    let lastUpdateTime = Date.now();
    let lastStatusText = "";
    let timerInterval = null;
    let countdownInterval = null;
    let countdown = AUTO_INCREMENT_INTERVAL;
    let timerRunning = false;

    const save = (val) => sessionStorage.setItem("hockeyMinute", val);
    const load = () => parseInt(sessionStorage.getItem("hockeyMinute"), 10);

    const updateUI = () => {
        const el = document.getElementById("hockeyMinute");
        if (el) el.innerText = hockeyMinute !== null ? hockeyMinute : "-";
        save(hockeyMinute);
    };

    const extractMinute = (text) => {
        const match = text.match(/(1st|2nd|3rd)\s*-\s*(\d{1,2}):(\d{2})/);
        if (!match) return null;

        const period = match[1];
        const minLeft = parseInt(match[2], 10);
        const secLeft = parseInt(match[3], 10);
        if (minLeft === 20 && secLeft === 0) return null;

        const minute = 20 - minLeft;
        if (minute < 0 || minute > 20) return null;
        return minute;
    };

    const autoIncrement = () => {
        if (!timerRunning || hockeyMinute === null || hockeyMinute >= 20) return;

        const now = Date.now();
        const elapsed = (now - lastUpdateTime) / 1000;

        if (elapsed >= AUTO_INCREMENT_INTERVAL) {
            hockeyMinute++;
            lastUpdateTime = now;
            countdown = AUTO_INCREMENT_INTERVAL;
            updateUI();
            console.log(`⏱️ Auto navýšeno na: ${hockeyMinute}`);
        }
    };

    const watchStatus = () => {
        const statusDiv =
            document.querySelector(".status .d-flex.justify-content-evenly") ||
            document.querySelector(".game-centre-status");
        if (!statusDiv) return;

        const newStatus = statusDiv.innerText.trim();
        if (!newStatus || newStatus === "") return;

        if (newStatus === lastStatusText) return; // Zabránit opětovnému zpracování
        lastStatusText = newStatus;

        const extractedMinute = extractMinute(newStatus);
        if (extractedMinute !== null) {
            console.log(`📥 Nový status: '${newStatus}' → Minutáž: ${extractedMinute}`);
            hockeyMinute = extractedMinute;
            updateUI();
            lastUpdateTime = Date.now();
            countdown = AUTO_INCREMENT_INTERVAL;

            clearInterval(timerInterval);
            clearInterval(countdownInterval);
            timerInterval = setInterval(autoIncrement, 1000);
            countdownInterval = setInterval(() => countdown--, 1000);
            timerRunning = true;
        } else {
            console.log(`❌ Status ignorován nebo nevhodný: '${newStatus}'`);
        }
    };

    const createUI = () => {
        const timerDiv = document.createElement("div");
        timerDiv.style.position = "fixed";
        timerDiv.style.top = "10px";
        timerDiv.style.left = "10px";
        timerDiv.style.background = "black";
        timerDiv.style.color = "white";
        timerDiv.style.padding = "10px";
        timerDiv.style.fontSize = "14px";
        timerDiv.style.borderRadius = "10px";
        timerDiv.style.zIndex = "9999";
        timerDiv.style.boxShadow = "2px 2px 10px rgba(0,0,0,0.5)";
        timerDiv.innerHTML = `
            <div style='margin-bottom:5px; font-weight:bold;'>CHL Minutáž</div>
            <div style='margin-bottom:10px; font-size:24px; background:white; color:black; padding:5px; border-radius:5px;' id='hockeyMinute'>-</div>
        `;
        document.body.appendChild(timerDiv);
    };

    setTimeout(() => {
        console.log("📡 CHL skript spuštěn...");
        createUI();
        const saved = load();
        if (!isNaN(saved)) {
            hockeyMinute = saved;
            updateUI();
            console.log(`💾 Načtena uložená minutáž: ${hockeyMinute}`);
        }
        setInterval(() => {
            watchStatus();
            autoIncrement();
        }, 1000);
    }, 3000);
})();