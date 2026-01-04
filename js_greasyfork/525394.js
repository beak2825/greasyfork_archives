// ==UserScript==
// @name         Courseskipper
// @version      1.6.3
// @description  Autocomplete_Moodle_section_SCORM
// @author       Elena Corner (mod)
// @match        *://*/*/mod/scorm/*
// @grant        none
// @license      MIT
// @run-at       document-end
// @namespace https://greasyfork.org/users/1429342
// @downloadURL https://update.greasyfork.org/scripts/525394/Courseskipper.user.js
// @updateURL https://update.greasyfork.org/scripts/525394/Courseskipper.meta.js
// ==/UserScript==

(function completeCourse(win) {
    let logMessages = [];
    const countdownSeconds = 20; // SECONDS TO WAIT BEFORE COMPLETITION DON'T SET BELOW 10 
    const redirectDelay = 2; // SECONDS TO WAIT FOR REDIRECT
    let remainingSeconds = countdownSeconds;
    let countdownInterval;

    function createPopup() {
        let popup = document.createElement("div");
        popup.id = "scorm-popup";
        popup.style.position = "fixed";
        popup.style.bottom = "20px";
        popup.style.right = "20px";
        popup.style.background = "rgba(0, 0, 0, 0.8)";
        popup.style.color = "#fff";
        popup.style.padding = "15px 20px 15px 15px";
        popup.style.borderRadius = "8px";
        popup.style.fontSize = "14px";
        popup.style.zIndex = "9999";
        popup.style.maxWidth = "300px";
        popup.style.boxShadow = "0px 4px 8px rgba(0, 0, 0, 0.2)";
        popup.style.display = "block";

        let closeButton = document.createElement("span");
        closeButton.innerHTML = "✖";
        closeButton.style.position = "absolute";
        closeButton.style.top = "5px";
        closeButton.style.right = "10px";
        closeButton.style.cursor = "pointer";
        closeButton.style.fontSize = "16px";
        closeButton.title = "Close";

        closeButton.onclick = function () {
            popup.style.display = "none";
        };

        let countdownLabel = document.createElement("div");
        countdownLabel.id = "scorm-countdown";
        countdownLabel.style.marginBottom = "10px";
        countdownLabel.innerText = `Auto completion in ${remainingSeconds} seconds`;

        let logContainer = document.createElement("div");
        logContainer.id = "scorm-log";

        popup.appendChild(closeButton);
        popup.appendChild(countdownLabel);
        popup.appendChild(logContainer);
        document.body.appendChild(popup);
        return popup;
    }

    function showPopupLog() {
        let popup = document.getElementById("scorm-popup") || createPopup();
        let logContainer = document.getElementById("scorm-log");
        if (logContainer) {
            logContainer.innerHTML = logMessages.join("<br>");
        }
        popup.style.display = "block";
    }

    function logMessage(message) {
        console.log(message);
        logMessages.push(message);
        showPopupLog();
    }

    function updateCountdown() {
        let countdownLabel = document.getElementById("scorm-countdown");
        if (countdownLabel) {
            countdownLabel.innerText = `Auto completion in ${remainingSeconds} seconds`;
        }
    }

    // Funzione per il reindirizzamento con countdown
    function redirectToPreviousPage() {
        let redirectCountdown = redirectDelay;
        let countdownLabel = document.getElementById("scorm-countdown");
        
        if (countdownLabel) {
            const updateRedirectCountdown = () => {
                countdownLabel.innerText = `🔄 Redirecting to main page in ${redirectCountdown} seconds...`;
                redirectCountdown--;
                
                if (redirectCountdown < 0) {
                    window.history.back();
                } else {
                    setTimeout(updateRedirectCountdown, 1000);
                }
            };
            
            setTimeout(updateRedirectCountdown, 1000);
        }
    }

    function completeScorm12(api) {
        const sessionTime = generateSessionTimeFromTitle();
        api.LMSSetValue("cmi.core.entry", "ab-initio");
        api.LMSSetValue("cmi.core.lesson_status", "passed");
        api.LMSSetValue("cmi.core.score.raw", "100");
        api.LMSSetValue("cmi.core.exit", "");
        api.LMSCommit("");
        api.LMSFinish("");
        logMessage(`✅ Module completed`);
        
        // Avvia il reindirizzamento dopo il completamento
        redirectToPreviousPage();
    }

    function findScormAPI(win) {
        if (win.API) {
            completeScorm12(win.API);
        } else {
            logMessage("⚠️ SCORM API not found - contact the author");
        }
    }

    function startCountdown() {
        createPopup();
        updateCountdown();
        countdownInterval = setInterval(() => {
            remainingSeconds--;
            updateCountdown();
            if (remainingSeconds <= 0) {
                clearInterval(countdownInterval);
                findScormAPI(win);
            }
        }, 1000);
    }

    startCountdown();

})(window);