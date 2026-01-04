// ==UserScript==
// @name         TLS Contact Appointment Checker (Full UI + Timer)
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Vérifie les créneaux TLScontact avec notifications, interface dynamique, timer visible, bouton de vérification manuelle et sauvegarde des préférences.
// @author       Super-game17
// @license      MIT
// @match        https://visas-be.tlscontact.com/appointment* <--- Change this to your specific TLS contact URL
// @grant        GM_notification
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/541790/TLS%20Contact%20Appointment%20Checker%20%28Full%20UI%20%2B%20Timer%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541790/TLS%20Contact%20Appointment%20Checker%20%28Full%20UI%20%2B%20Timer%29.meta.js
// ==/UserScript==
/*MIT License

Copyright (c) 2025 Super-game17

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files the code , to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.*/

(function () {
    "use strict";

    // ----- UI ELEMENTS -----
    const uiBox = document.createElement("div");
    uiBox.style.position = "fixed";
    uiBox.style.top = "10px";
    uiBox.style.left = "10px";
    uiBox.style.padding = "10px";
    uiBox.style.background = "rgba(0, 0, 0, 0.85)";
    uiBox.style.color = "white";
    uiBox.style.zIndex = "9999";
    uiBox.style.fontSize = "13px";
    uiBox.style.borderRadius = "8px";
    uiBox.style.maxWidth = "280px";
    uiBox.style.boxShadow = "2px 2px 6px rgba(0,0,0,0.5)";
    uiBox.style.fontFamily = "Arial, sans-serif";

    uiBox.innerHTML = `
        <div><b>🎯 TLScontact Checker</b></div>
        <label>📅 Début : <input type="date" id="startDateInput" style="width: 130px;"></label><br>
        <label>📅 Fin : <input type="date" id="endDateInput" style="width: 130px;"></label><br>
        <label>⏱️ Intervalle (min) : <input type="number" id="intervalInput" value="5" min="1" style="width:50px;"></label><br>
        <label><input type="checkbox" id="scriptToggle"> ✅ Activer la vérification</label><br>
        <button id="saveBtn" style="margin-top:5px;width:100%">💾 Sauvegarder</button>
        <button id="checkNowBtn" style="margin-top:5px;width:100%">🔍 Vérifier maintenant</button>
        <div id="statusDisplay" style="margin-top:5px;font-size:12px;"></div>
        <div id="timerDisplay" style="margin-top:2px;font-size:11px;color:#aaa;"></div>
        <div id="slotsDisplay" style="margin-top:6px;font-size:12px;color:#ffd700"></div>
    `;
    document.body.appendChild(uiBox);

    // ----- UI ELEMENTS -----
    const startInput = document.getElementById("startDateInput");
    const endInput = document.getElementById("endDateInput");
    const intervalInput = document.getElementById("intervalInput");
    const toggleCheckbox = document.getElementById("scriptToggle");
    const statusDisplay = document.getElementById("statusDisplay");
    const timerDisplay = document.getElementById("timerDisplay");
    const slotsDisplay = document.getElementById("slotsDisplay");
    // Load preferences
    startInput.value = localStorage.getItem("tls_start_date") || "2025-07-05";
    endInput.value = localStorage.getItem("tls_end_date") || "2025-07-10";
    intervalInput.value = localStorage.getItem("tls_interval") || "5";
    toggleCheckbox.checked = localStorage.getItem("tls_script_enabled") === "true";

    // Save button
    document.getElementById("saveBtn").addEventListener("click", () => {
        localStorage.setItem("tls_start_date", startInput.value);
        localStorage.setItem("tls_end_date", endInput.value);
        localStorage.setItem("tls_interval", intervalInput.value);
        localStorage.setItem("tls_script_enabled", toggleCheckbox.checked);
        updateStatus("✅ Paramètres enregistrés", "orange");
    });

    // Manual check button
    document.getElementById("checkNowBtn").addEventListener("click", () => {
    localStorage.setItem("tls_manual_check", "1");
    location.reload();
});

    function updateStatus(text, color = "lightgreen") {
        statusDisplay.innerHTML = `🔄 État : <span style="color:${color}">${text}</span>`;
    }

    // Date checker
    function isWithinAllowedDates() {
        const now = new Date();
        const start = new Date(startInput.value + "T00:00:00");
        const end = new Date(endInput.value + "T23:59:59");
        return now >= start && now <= end;
    }

    function shouldRun() {
        return toggleCheckbox.checked && isWithinAllowedDates();
    }

    function playSound(url) {
        const audio = new Audio(url);
        audio.play();
    }

    // Availability checker
    let slotsList = [];
let currentSlotIndex = 0;

function renderSlotNavigation() {
    if (slotsList.length === 0) {
        slotsDisplay.innerHTML = "";
        return;
    }
    const slot = slotsList[currentSlotIndex];
    slotsDisplay.innerHTML = `
        <b>Créneau ${currentSlotIndex + 1} / ${slotsList.length}</b><br>
        <span style="font-weight:bold;color:#0f0">${slot.dateStr} à ${slot.time}</span><br>
        <button id="prevSlot" ${currentSlotIndex === 0 ? "disabled" : ""}>&lt;</button>
        <button id="nextSlot" ${currentSlotIndex === slotsList.length - 1 ? "disabled" : ""}>&gt;</button>
    `;
    document.getElementById("prevSlot").onclick = () => {
        if (currentSlotIndex > 0) {
            currentSlotIndex--;
            renderSlotNavigation();
        }
    };
    document.getElementById("nextSlot").onclick = () => {
        if (currentSlotIndex < slotsList.length - 1) {
            currentSlotIndex++;
            renderSlotNavigation();
        }
    };
}

function checkForAvailability(force = false) {
    console.log("🔍 Vérification en cours (analyse du tableau)...");
    slotsDisplay.innerHTML = ""; // reset la liste
    slotsList = [];
    currentSlotIndex = 0;

    if (!force && !shouldRun()) {
        console.log("❌ Vérification ignorée (désactivé ou hors période)");
        updateStatus("⏸️ Inactif (hors période ou désactivé)", "gray");
        return;
    }

    let found = false;
    const columns = document.querySelectorAll('.tls-time-group--slot');
    columns.forEach(col => {
        const dateHeader = col.querySelector('.tls-time-group--header-title');
        if (!dateHeader) return;
        const dateText = dateHeader.textContent.trim(); // ex: "JUI. 25"
        const match = dateText.match(/([A-ZÉÛ\.]+)\s*(\d{2})/i);
        if (!match) return;
        const moisTxt = match[1].replace('.', '').toUpperCase();
        const jour = match[2];
        const moisMap = {
            'JAN': 1, 'FÉV': 2, 'FEV': 2, 'MAR': 3, 'AVR': 4, 'MAI': 5, 'JUI': 6, 'JUIL': 7, 'AOÛ': 8, 'AOU': 8, 'SEP': 9, 'OCT': 10, 'NOV': 11, 'DÉC': 12, 'DEC': 12
        };
        let moisNum = 0;
        Object.keys(moisMap).forEach(mois => {
            if (moisTxt.startsWith(mois)) moisNum = moisMap[mois];
        });
        if (!moisNum) return;
        const year = (new Date()).getFullYear();
        const colDate = new Date(`${year}-${String(moisNum).padStart(2, '0')}-${jour}T00:00:00`);
        const start = new Date(startInput.value + "T00:00:00");
        const end = new Date(endInput.value + "T23:59:59");
        if (colDate >= start && colDate <= end) {
            const slots = col.querySelectorAll('button.tls-time-unit.-available');
            slots.forEach(slot => {
                found = true;
                slotsList.push({
                    date: colDate,
                    dateStr: `${jour}/${String(moisNum).padStart(2, '0')}/${year}`,
                    time: slot.textContent.trim()
                });
            });
        }
    });

    if (found) {
        // Trie par date et heure
        slotsList.sort((a, b) => {
            if (a.date - b.date !== 0) return a.date - b.date;
            return a.time.localeCompare(b.time);
        });
        renderSlotNavigation();
        updateStatus("✅ Rendez-vous disponible dans la plage !", "lime");
        if (typeof GM_notification === "function") {
            GM_notification({
                title: "Rendez-vous disponible !",
                text: "Allez sur le site et réservez maintenant !",
                timeout: 10000
            });
        }
        playSound('https://proxy.notificationsounds.com/standard-ringtones/oringz-w427-371/download/file-0b_oringz-pack-nine-07.mp3');
    } else {
        updateStatus("❌ Aucun rendez-vous disponible dans la plage.", "red");
        slotsDisplay.innerHTML = "";
    }
}
    // Countdown & Refresh
    let countdown = 0;

    function startCountdown() {
        const intervalMin = parseInt(intervalInput.value || "5");
        countdown = intervalMin * 60;
        updateTimerDisplay();
        const countdownInterval = setInterval(() => {
            if (countdown > 0) {
                countdown--;
                updateTimerDisplay();
            } else {
                clearInterval(countdownInterval);
            }
        }, 1000);
    }

    function updateTimerDisplay() {
        const min = Math.floor(countdown / 60);
        const sec = countdown % 60;
        timerDisplay.innerText = `⏳ Prochaine vérif auto dans : ${min}m ${sec}s`;
    }

    function scheduleRefresh() {
    const delay = (parseInt(intervalInput.value || "5") * 60 * 1000);
    startCountdown();

    setTimeout(() => {
        if (shouldRun()) {
            // Déclenche un rechargement comme la vérif manuelle
            localStorage.setItem("tls_manual_check", "1");
            location.reload();
        } else {
            updateStatus("⏸️ Inactif (hors période ou désactivé)", "gray");
            scheduleRefresh();
        }
    }, delay);
}

    // Démarrage
    window.addEventListener('load', () => {
    if (localStorage.getItem("tls_manual_check") === "1") {
        localStorage.removeItem("tls_manual_check");
        // Attendre que le calendrier soit chargé
        const waitForCalendar = setInterval(() => {
            if (document.querySelector('.tls-time-group--slot')) {
                clearInterval(waitForCalendar);
                checkForAvailability(true);
                scheduleRefresh(); // <-- Ajoute cette ligne pour relancer le timer
            }
        }, 300);
        return;
    }
    if (shouldRun()) {
        setTimeout(() => {
            console.log("⏱️ Première vérification...");
            checkForAvailability();
        }, 5000);
    } else {
        updateStatus("⏸️ Script inactif (hors période ou désactivé)", "gray");
    }
    scheduleRefresh();
});
})();
