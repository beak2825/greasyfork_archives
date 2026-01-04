// ==UserScript==
// @name         AlohaQ Auto Retry Appointment
// @namespace    http://tampermonkey.net/
// @version      2025-06-06
// @description  Automatically retry appointment selection, handle failures, refresh if no availability at AlohaQ site.
// @author       You
// @match        https://alohaq.honolulu.gov/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539873/AlohaQ%20Auto%20Retry%20Appointment.user.js
// @updateURL https://update.greasyfork.org/scripts/539873/AlohaQ%20Auto%20Retry%20Appointment.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const preferredTimes = ["13:00:00", "13:15:00", "12:30:00","12:45:00"];
    let busy = false;

    function triggerInput(el, value) {
        const lastValue = el.value;
        el.value = value;
        const event = new Event('input', { bubbles: true });
        const changeEvent = new Event('change', { bubbles: true });
        const tracker = el._valueTracker;
        if (tracker) tracker.setValue(lastValue);
        el.dispatchEvent(event);
        el.dispatchEvent(changeEvent);
    }

    function autofillAndSubmit() {
        const fname = document.querySelector('#fname');
        const lname = document.querySelector('#lname');
        const number = document.querySelector('#number');

        if (fname && lname && number) {
            const today = new Date();
            const m = today.getMonth() + 1;
            const d = today.getDate();

            triggerInput(fname, 'City Auto');
            triggerInput(lname, `${m}/${d}`);
            triggerInput(number, '8082192442');

            console.log("✅ Autofilled form.");

            const signupBtn = document.querySelector('div.submit.button-look');
            if (signupBtn) {
                console.log("👉 Clicking Sign Up...");
                signupBtn.click();
            } else {
                console.warn("❗ Submit button not found");
                busy = false;
            }
        } else {
            setTimeout(autofillAndSubmit, 100); // Wait until inputs are ready
        }
    }

    function trySelectPreferredTime() {
        const timeButtons = Array.from(document.querySelectorAll("div.time"));
        for (const pref of preferredTimes) {
            const match = timeButtons.find(btn => btn.dataset.time === pref);
            if (match) {
                console.log(`🕒 Found preferred time: ${pref}`);
                busy = true;
                match.click();
                setTimeout(autofillAndSubmit, 200);
                return true;
            }
        }
        return false;
    }

    function handleErrorPopup() {
        const popup = document.querySelector('#popup_inner');
        if (popup && popup.textContent.includes("Appointment no longer available")) {
            console.log("❌ Appointment failed. Closing popup...");
            const closeBtn = document.querySelector('.fa-times.fa-stack-1x');
            if (closeBtn) closeBtn.click();
            setTimeout(() => {
                busy = false;
            }, 500); // Retry quickly
        }
    }

    function checkNoAppointments() {
        const noAppt = document.querySelector('h4#headerSub');
        return noAppt && noAppt.textContent.trim().toLowerCase() === "there are no open appointments at this location";
    }

    function forceReload() {
        console.log("🔄 Reloading due to no appointments...");
        window.location.href = window.location.href;
    }

    function mainLoop() {
        setInterval(() => {
            if (busy) {
                handleErrorPopup();
                return;
            }

            if (checkNoAppointments()) {
                forceReload();
                return;
            }

            trySelectPreferredTime();
        }, 500);
    }

    window.addEventListener('load', () => {
        console.log("✅ AlohaQ Auto Retry Loaded.");
        busy = false;
        mainLoop();
    });
})();
