// ==UserScript==
// @name         Auto-Click Blogger Sensitive Content Button
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically clicks through sensitive content warnings on Blogger
// @author       You
// @match        *://*.blogger.com/*
// @match        *://*.blogspot.com/*
// @grant        none
// @license      CC BY-NC-SA 4.0
// @downloadURL https://update.greasyfork.org/scripts/522745/Auto-Click%20Blogger%20Sensitive%20Content%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/522745/Auto-Click%20Blogger%20Sensitive%20Content%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const MAX_ATTEMPTS = 5;
    const ATTEMPT_INTERVAL = 1000;
    const MAX_OBSERVE_TIME = 10000;
    let attempts = 0;

    function clickThroughWarning() {
        const buttonSelectors = [
            'a.maia-button.maia-button-primary',
            'a[text="I UNDERSTAND AND I WISH TO CONTINUE"]',
            'div#maia-main p a.maia-button.maia-button-primary'
        ];

        for (const selector of buttonSelectors) {
            const buttons = document.querySelectorAll(selector);
            for (const button of buttons) {
                if (button.textContent.includes('I UNDERSTAND AND I WISH TO CONTINUE')) {
                    button.click();
                    return true;
                }
            }
        }

        const xpathResult = document.evaluate(
            '/html/body/div[2]/p[2]/a[1]',
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        );

        if (xpathResult.singleNodeValue) {
            xpathResult.singleNodeValue.click();
            return true;
        }

        return false;
    }

    function attemptClick() {
        if (attempts >= MAX_ATTEMPTS) {
            return;
        }

        attempts++;
        if (!clickThroughWarning() && attempts < MAX_ATTEMPTS) {
            setTimeout(attemptClick, ATTEMPT_INTERVAL);
        }
    }

    function initObserver() {
        const observer = new MutationObserver((mutations) => {
            if (clickThroughWarning()) {
                observer.disconnect();
                return;
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        setTimeout(() => {
            observer.disconnect();
        }, MAX_OBSERVE_TIME);
    }

    attemptClick();
    initObserver();
})();