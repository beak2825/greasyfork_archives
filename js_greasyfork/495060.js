// ==UserScript==
// @name         CloudFlare Challenge Optimized
// @version      0.3
// @description  Automates solving Cloudflare Challenges with optimal performance and maintainability
// @author       AstralRift
// @namespace    https://greasyfork.org/users/1300060
// @match        https://challenges.cloudflare.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/495060/CloudFlare%20Challenge%20Optimized.user.js
// @updateURL https://update.greasyfork.org/scripts/495060/CloudFlare%20Challenge%20Optimized.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let observer = null;
    let intervalId = null;

    function attemptChallenge() {
        const targets = [
            "#cf-stage > div.ctp-checkbox-container > label > span",
            "input[value='Verify you are human']",
            ".ctp-checkbox-label"
        ];

        for (let selector of targets) {
            const element = document.querySelector(selector);
            if (element) {
                element.click();
                return true;
            }
        }
        return false;
    }

    function setupObserver() {
        observer = new MutationObserver(() => {
            if (attemptChallenge()) {
                disconnectObserver();
                clearInterval(intervalId);
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    function disconnectObserver() {
        if (observer) {
            observer.disconnect();
            observer = null;
        }
    }

    function setupInterval() {
        const intervalFunction = () => {
            if (attemptChallenge()) {
                clearInterval(intervalId);
                disconnectObserver();
            }
        };

        intervalId = setInterval(intervalFunction, 1000);

        setTimeout(() => {
            clearInterval(intervalId);
            disconnectObserver();
        }, 60000);
    }

    function handleChallenge() {
        if (!attemptChallenge()) {
            setupObserver();
            setupInterval();
        }
    }

    handleChallenge();
})();
