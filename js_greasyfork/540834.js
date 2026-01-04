// ==UserScript==
// @name         holla.world Gender Auto Skipper Interceptor, Almost Free Plus
// @namespace    http://tampermonkey.net/
// @version      2025-06-26
// @description  Clicks NEXT button when match_with_gender is not F & handles main-bottom logic, chimes on F, auto-sends message
// @author       Bob
// @match        https://www.holla.world/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=holla.world
// @grant        none
// @license      Apache License 2.0
// @downloadURL https://update.greasyfork.org/scripts/540834/hollaworld%20Gender%20Auto%20Skipper%20Interceptor%2C%20Almost%20Free%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/540834/hollaworld%20Gender%20Auto%20Skipper%20Interceptor%2C%20Almost%20Free%20Plus.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === CONFIGURE YOUR PREDEFINED MESSAGE HERE ===
    const predefinedMessage = "Hi there! 😊";

    let lastStartOfMatchTime = 0;
    let mainBottomInterval = null;
    let mainBottomTimeout = null;

    function playChime() {
        // Simple beep using Web Audio API
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.type = 'sine';
            o.frequency.value = 880; // Chime frequency in Hz
            g.gain.value = 0.1;
            o.connect(g);
            g.connect(ctx.destination);
            o.start();
            setTimeout(() => {
                o.stop();
                ctx.close();
            }, 250); // 250ms chime
        } catch (e) {
            console.warn("Could not play chime:", e);
        }
    }

    function clickNextButton() {
        const nextButtons = document.querySelectorAll('.next-button');
        if (nextButtons.length > 0) {
            console.log('Clicking NEXT button');
            nextButtons[0].click();
        } else {
            console.log('NEXT button not found');
        }
        // Start 5s timer to check for main-bottom
        startMainBottomTimeout();
    }

    function clickMainBottom() {
        const btn = document.querySelector('.main-bottom');
        if (btn && isElementInViewport(btn)) {
            console.log('Clicking .main-bottom button');
            btn.click();
            return true;
        }
        return false;
    }

    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    function startMainBottomTimeout() {
        clearTimeout(mainBottomTimeout);
        clearInterval(mainBottomInterval);

        mainBottomTimeout = setTimeout(() => {
            mainBottomInterval = setInterval(() => {
                if (clickMainBottom()) {
                    clearInterval(mainBottomInterval);
                }
            }, 3000);
        }, 5000);
    }

    function resetMainBottomTimers() {
        clearTimeout(mainBottomTimeout);
        clearInterval(mainBottomInterval);
    }

    function isTargetUrl(url) {
        return url.includes('https://apiv2.getchacha.com/api/MatchRoom/startOfMatch');
    }

    // --- Auto-send message when connected ---
    function sendPredefinedMessage() {
        // Try to find a visible textarea or input for the message box
        // You may need to adjust the selector if HOLLA changes its UI
        const input = document.querySelector('textarea, input[type="text"]');
        if (input && input.offsetParent !== null) { // Checks if visible
            input.value = predefinedMessage;
            input.dispatchEvent(new Event('input', { bubbles: true }));

            // Try to simulate Enter key
            const enterEvent = new KeyboardEvent('keydown', {
                bubbles: true,
                cancelable: true,
                key: 'Enter',
                code: 'Enter',
                which: 13,
                keyCode: 13
            });
            input.dispatchEvent(enterEvent);

            // If Enter doesn't work, try clicking a send button (uncomment and adjust selector if needed)
            // const sendBtn = document.querySelector('.send-button-class');
            // if (sendBtn) sendBtn.click();

            console.log('Predefined message sent!');
            return true;
        }
        return false;
    }

    // Utility: Try to send message every 500ms for up to 5 seconds, then stop
    function trySendPredefinedMessage() {
        let tries = 0;
        const maxTries = 10;
        const interval = setInterval(() => {
            if (sendPredefinedMessage() || ++tries >= maxTries) {
                clearInterval(interval);
            }
        }, 500);
    }

    // Intercept fetch
    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
        if (args[0] && isTargetUrl(args[0])) {
            lastStartOfMatchTime = Date.now();
            resetMainBottomTimers();
        }
        const response = await originalFetch.apply(this, args);

        if (args[0] && isTargetUrl(args[0])) {
            const cloned = response.clone();
            cloned.json().then(json => {
                try {
                    const events = json.analytics?.events || [];
                    if (events.length > 0) {
                        const gender = events[0].properties?.match_with_gender;
                        if (gender === "F") {
                            console.log('F gender detected:', gender);
                            playChime();
                            trySendPredefinedMessage();
                        } else if (gender !== "F") {
                            console.log('Non-F gender detected:', gender);
                            clickNextButton();
                        }
                    }
                } catch (e) {
                    console.error('Error processing response', e);
                }
            });
        }
        return response;
    };

    // Intercept XMLHttpRequest
    const origOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, ...rest) {
        this._isTarget = isTargetUrl(url);
        if (this._isTarget) {
            lastStartOfMatchTime = Date.now();
            resetMainBottomTimers();
        }
        return origOpen.call(this, method, url, ...rest);
    };

    const origSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function(...args) {
        if (this._isTarget) {
            this.addEventListener('load', function() {
                try {
                    const json = JSON.parse(this.responseText);
                    const events = json.analytics?.events || [];
                    if (events.length > 0) {
                        const gender = events[0].properties?.match_with_gender;
                        if (gender === "F") {
                            console.log('F gender detected:', gender);
                            playChime();
                            trySendPredefinedMessage();
                        } else if (gender !== "F") {
                            console.log('Non-F gender detected:', gender);
                            clickNextButton();
                        }
                    }
                } catch (e) {
                    console.error('Error processing response', e);
                }
            });
        }
        return origSend.apply(this, args);
    };

    // ESC key restarts by clicking .main-bottom
    document.addEventListener('keydown', function(e) {
        if (e.key === "Escape") {
            console.log('ESC pressed, clicking .main-bottom');
            clickMainBottom();
        }
    });

    // Watch for button appearance using MutationObserver (unchanged)
    const observer = new MutationObserver(() => {
        if (window.pendingGenderCheck && window.pendingGenderCheck !== "F") {
            clickNextButton();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();
