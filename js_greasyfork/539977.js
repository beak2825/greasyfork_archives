// ==UserScript==
// @name         SIHF Hockey Minutaz Tracker - Vylepšená verze
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Sleduje hokejovou minutáž podle třetiny, možnost ruční úpravy, podporuje pauzu
// @author       Michal
// @match        https://*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539977/SIHF%20Hockey%20Minutaz%20Tracker%20-%20Vylep%C5%A1en%C3%A1%20verze.user.js
// @updateURL https://update.greasyfork.org/scripts/539977/SIHF%20Hockey%20Minutaz%20Tracker%20-%20Vylep%C5%A1en%C3%A1%20verze.meta.js
// ==/UserScript==

(function () {
    'use strict';

    setTimeout(() => {
        console.log("📢 Spouštím Hockey Minutaz Tracker...");

        const timerDiv = document.createElement("div");
        timerDiv.style.position = "fixed";
        timerDiv.style.top = "20px";
        timerDiv.style.left = "20px";
        timerDiv.style.background = "#222";
        timerDiv.style.color = "#fff";
        timerDiv.style.padding = "15px";
        timerDiv.style.fontSize = "20px";
        timerDiv.style.borderRadius = "12px";
        timerDiv.style.boxShadow = "4px 4px 12px rgba(0, 0, 0, 0.6)";
        timerDiv.style.zIndex = "1000";
        timerDiv.style.fontFamily = "Arial, sans-serif";
        timerDiv.innerHTML = `
            <table style='border-collapse: collapse; width: 200px; text-align: center;'>
                <tr>
                    <th style='background: #444; color: #ffcc00; padding: 10px; border-radius: 8px 8px 0 0; font-size: 18px;'>🏒 Hokejový Čas</th>
                </tr>
                <tr>
                    <td id='hockeyPeriod' style='background: #ffcc00; color: black; padding: 12px; font-size: 22px; font-weight: bold; border-bottom: 3px solid black;'>-</td>
                </tr>
                <tr>
                    <td style="display: flex; align-items: center; justify-content: center; background: white; color: black; padding: 10px; font-size: 24px; font-weight: bold; border-radius: 0 0 8px 8px;">
                        <button id="minuteUp" style="background: #4CAF50; color: white; border: none; padding: 5px 10px; font-size: 18px; cursor: pointer; border-radius: 5px;">▲</button>
                        <span id='hockeyMinute' style="margin: 0 10px;">-</span>
                        <button id="minuteDown" style="background: #f44336; color: white; border: none; padding: 5px 10px; font-size: 18px; cursor: pointer; border-radius: 5px;">▼</button>
                    </td>
                </tr>
            </table>`;
        document.body.appendChild(timerDiv);
        console.log("📢 Tabulka minutáže byla přidána do DOM.");

        let hockeyPeriod = "";
        let hockeyMinute = 1;
        let lastDetectedPeriod = "";
        let timerRunning = false;
        let countdownTimeout;

        function adjustMinute(change) {
            hockeyMinute = Math.min(20, Math.max(1, hockeyMinute + change));
            document.getElementById("hockeyMinute").innerText = hockeyMinute;
            console.log(`🛠 Ručně nastavena minutáž na: ${hockeyMinute}`);
        }

        document.getElementById("minuteUp").addEventListener("click", () => adjustMinute(1));
        document.getElementById("minuteDown").addEventListener("click", () => adjustMinute(-1));

        function startTimer() {
            if (!timerRunning) return;
            clearTimeout(countdownTimeout);

            countdownTimeout = setTimeout(() => {
                hockeyMinute++;
                if (hockeyMinute > 20) {
                    console.log("🏁 Třetina ukončena, zastavuji počítání.");
                    timerRunning = false;
                    return;
                }
                console.log(`🏒 Aktualizuji minutáž na hodnotu: ${hockeyMinute}`);
                document.getElementById("hockeyMinute").innerText = hockeyMinute;
                startTimer();
            }, 120000); // 120 sekund (2 minuty)
        }

        function detectPeriod() {
            let periodElement = document.querySelector(".text-icon__content");
            if (!periodElement) return null;

            let periodText = periodElement.innerText.trim();
            if (periodText.includes("1. Drittel")) return "1. třetina";
            if (periodText.includes("2. Drittel")) return "2. třetina";
            if (periodText.includes("3. Drittel")) return "3. třetina";
            if (periodText.includes("Pause")) return "Pause";
            return null;
        }

        function checkPeriod() {
            let detectedPeriod = detectPeriod();

            if (detectedPeriod === "Pause") {
                console.log(`⏸️ Pauza detekována, zastavuji minutáž.`);
                document.getElementById("hockeyPeriod").innerText = "⏸️ PAUZA";
                document.getElementById("hockeyMinute").innerText = "-";
                clearTimeout(countdownTimeout);
                timerRunning = false;
                return;
            }

            if (detectedPeriod && detectedPeriod !== lastDetectedPeriod) {
                console.log(`📢 Zjištěna nová třetina: ${detectedPeriod}`);
                lastDetectedPeriod = detectedPeriod;
                hockeyPeriod = detectedPeriod;
                hockeyMinute = 1;
                document.getElementById("hockeyPeriod").innerText = hockeyPeriod;
                document.getElementById("hockeyMinute").innerText = hockeyMinute;

                timerRunning = true;
                startTimer();
            }
        }

        // Místo každé sekundy kontrolujeme třetinu každých 5 sekund (nižší zátěž)
        setInterval(checkPeriod, 5000);

        console.log("📢 Nastaven interval na kontrolu třetiny každých 5 sekund...");
    }, 3000);
})();
