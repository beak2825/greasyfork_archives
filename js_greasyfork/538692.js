// ==UserScript==
// @name         Auto Liker Fotka.com
// @namespace    https://fotka.com/
// @version      0.11
// @description  Automatycznie klika "Like" na profilach fotka.com
// @match        https://fotka.com/profil/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538692/Auto%20Liker%20Fotkacom.user.js
// @updateURL https://update.greasyfork.org/scripts/538692/Auto%20Liker%20Fotkacom.meta.js
// ==/UserScript==

/*
MIT License

Copyright (c) 2025

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
*/

(function() {
    'use strict';

    const targetElementSelector = '.s_aH5EvuW43P8xFw9zlg';
    const refreshPageAfterClick = false;
    const speedMultiplier = 0.01;
    const baseClickDelayAfterLoad = 2000;
    const baseCycleDelay = 4000;
    const baseClickAttemptInterval = 400;
    const profileChangeTimeout = 3000;
    const urlMonitorPollingInterval = 500;

    const clickDelayAfterLoad = baseClickDelayAfterLoad * speedMultiplier;
    const cycleDelay = baseCycleDelay * speedMultiplier;
    const clickAttemptInterval = baseClickAttemptInterval * speedMultiplier;

    let clickIntervalId = null;
    let urlMonitorTimeoutId = null;
    let urlCheckIntervalId = null;
    let currentProfileUsername = null;

    function simulateClick(element) {
        if (!element) return false;
        if (typeof element.click === 'function') {
            element.click();
            console.log("[Auto Liker] Kliknięcie metodą .click()");
            return true;
        }
        const mouseEvent = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
        });
        try {
            element.dispatchEvent(mouseEvent);
            console.log("[Auto Liker] Kliknięcie zasymulowane zdarzeniem");
            return true;
        } catch (e) {
            console.error("[Auto Liker] Błąd przy kliknięciu:", e);
            return false;
        }
    }

    function resetRedirectTimer() {
        if (urlMonitorTimeoutId) clearTimeout(urlMonitorTimeoutId);
        urlMonitorTimeoutId = setTimeout(() => {
            console.warn(`[Auto Liker] Brak zmiany URL przez ${profileChangeTimeout / 1000}s. Przekierowanie.`);
            window.location.href = 'https://fotka.com/profil';
        }, profileChangeTimeout);
    }

    function getUsernameFromUrl(url) {
        const match = url.match(/\/profil\/([^/?#]+)/);
        return match && match[1] ? match[1] : null;
    }

    function monitorProfileUrl() {
        const usernameInUrl = getUsernameFromUrl(window.location.href);
        if (usernameInUrl && usernameInUrl !== currentProfileUsername) {
            console.log(`[Auto Liker] Zmiana profilu: ${currentProfileUsername || 'brak'} -> ${usernameInUrl}`);
            currentProfileUsername = usernameInUrl;
            resetRedirectTimer();
        } else if (!usernameInUrl && currentProfileUsername !== null) {
            console.log("[Auto Liker] Opuszczono profil");
            currentProfileUsername = null;
            if (urlMonitorTimeoutId) clearTimeout(urlMonitorTimeoutId);
        } else if (usernameInUrl && currentProfileUsername === null) {
            console.log(`[Auto Liker] Wejście na profil: ${usernameInUrl}`);
            currentProfileUsername = usernameInUrl;
            resetRedirectTimer();
        }
    }

    function findAndClickElement() {
        const element = document.querySelector(targetElementSelector);
        if (element) {
            const style = window.getComputedStyle(element);
            if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0' || element.offsetWidth === 0 || element.offsetHeight === 0) {
                return false;
            }
            console.log(`[Auto Liker] Klikam element: ${targetElementSelector}`);
            if (simulateClick(element)) {
                resetRedirectTimer();
                return true;
            }
        }
        return false;
    }

    function startMainCycle() {
        console.log("[Auto Liker] Start cyklu");
        if (clickIntervalId) clearInterval(clickIntervalId);
        if (urlCheckIntervalId) clearInterval(urlCheckIntervalId);
        urlCheckIntervalId = setInterval(monitorProfileUrl, urlMonitorPollingInterval);
        monitorProfileUrl();
        clickIntervalId = setInterval(() => {
            if (findAndClickElement()) {
                clearInterval(clickIntervalId);
                if (refreshPageAfterClick) {
                    console.log(`[Auto Liker] Odświeżenie za ${cycleDelay}ms`);
                    setTimeout(() => location.reload(), cycleDelay);
                } else {
                    console.log(`[Auto Liker] Kolejny cykl za ${cycleDelay}ms`);
                    setTimeout(startMainCycle, cycleDelay);
                }
            }
        }, clickAttemptInterval);
    }

    window.onload = function() {
        console.log("[Auto Liker] Strona załadowana");
        startMainCycle();
    };

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        console.log("[Auto Liker] Strona już gotowa");
        startMainCycle();
    } else {
        console.log("[Auto Liker] Oczekiwanie na onload");
    }

    console.log("[Auto Liker] Skrypt uruchomiony");
    console.log(`[Auto Liker] Odświeżanie: ${refreshPageAfterClick}, Prędkość: ${speedMultiplier}`);
    console.log(`[Auto Liker] Przekierowanie po ${profileChangeTimeout / 1000}s braku zmiany URL`);
})();
