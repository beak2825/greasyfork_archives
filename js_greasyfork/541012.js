// ==UserScript==
// @name         Fake Robux Display (Persistent)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Change visible Robux amount on Roblox (just for fun)
// @author       You
// @match        https://www.roblox.com/*
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/541012/Fake%20Robux%20Display%20%28Persistent%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541012/Fake%20Robux%20Display%20%28Persistent%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const targetAmount = '13M+';
    const selector = '#nav-robux-amount';

    function setFakeRobux() {
        const robuxEl = document.querySelector(selector);
        if (robuxEl && robuxEl.textContent.trim() !== targetAmount) {
            robuxEl.textContent = targetAmount;
        }
    }

    // Try every 500ms for 10 seconds max
    let attempts = 0;
    const maxAttempts = 20;
    const interval = setInterval(() => {
        setFakeRobux();
        attempts++;
        if (attempts >= maxAttempts) clearInterval(interval);
    }, 500);

    // MutationObserver as backup (Roblox is very dynamic)
    const observer = new MutationObserver(() => setFakeRobux());
    observer.observe(document.body, { childList: true, subtree: true });
})();