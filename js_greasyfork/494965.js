// ==UserScript==
// @name         Auto Click "I'm not a robot"
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Automatically clicks the "I'm not a robot" checkbox on reCaptcha V2, reCaptcha V2 callback, reCaptcha V2 Enterprise, and hCaptcha captchas
// @author       JJJ
// @match        *://*/*
// @icon         https://pngimg.com/uploads/robot/robot_PNG96.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/494965/Auto%20Click%20%22I%27m%20not%20a%20robot%22.user.js
// @updateURL https://update.greasyfork.org/scripts/494965/Auto%20Click%20%22I%27m%20not%20a%20robot%22.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Constants for selectors and attributes
    const CHECKBOX = "#checkbox";
    const ARIA_CHECKED = "aria-checked";

    // Utility function to select a single element
    function qSelector(selector) {
        return document.querySelector(selector);
    }

    // Utility function to check if an element is hidden
    function isHidden(el) {
        return (el.offsetParent === null);
    }

    // Handler for reCaptcha V2
    const reCaptchaV2Handler = {
        // Find the checkbox element for reCaptcha V2
        findCheckboxElement() {
            return document.querySelector('.recaptcha-checkbox-border') ||
                document.querySelector('[role="checkbox"][aria-labelledby="recaptcha-anchor-label"]') ||
                qSelector(CHECKBOX);
        },
        // Solve the reCaptcha V2 by clicking the checkbox
        solve() {
            const checkbox = this.findCheckboxElement();
            if (checkbox && !isHidden(checkbox) && checkbox.getAttribute(ARIA_CHECKED) !== "true") {
                checkbox.click();
            }
        }
    };

    // Handler for reCaptcha V2 callback
    const reCaptchaV2CallbackHandler = {
        // Find the callback function for reCaptcha V2
        findCallbackFunction() {
            if (typeof ___grecaptcha_cfg !== 'undefined') {
                const keys = Object.keys(___grecaptcha_cfg.clients).filter(key => key !== 'load');
                for (const key of keys) {
                    const client = ___grecaptcha_cfg.clients[key];
                    if (client && typeof client.hl?.l?.callback === 'function') {
                        return client.hl.l.callback;
                    }
                }
            }
            return null;
        },
        // Solve the reCaptcha V2 by invoking the callback function
        solve() {
            const callbackFn = this.findCallbackFunction();
            if (typeof callbackFn === 'function') {
                callbackFn();
            }
        }
    };

    // Handler for reCaptcha V2 Enterprise
    const reCaptchaV2EnterpriseHandler = {
        // Find the checkbox element for reCaptcha V2 Enterprise
        findEnterpriseCheckboxElement() {
            return document.querySelector('.enterprise-checkbox') ||
                document.querySelector('[aria-labelledby="recaptcha-accessible-status"]');
        },
        // Solve the reCaptcha V2 Enterprise by clicking the checkbox
        solve() {
            const checkbox = this.findEnterpriseCheckboxElement();
            if (checkbox && !isHidden(checkbox) && checkbox.getAttribute(ARIA_CHECKED) !== "true") {
                checkbox.click();
            }
        }
    };

    // Handler for hCaptcha
    const hCaptchaHandler = {
        // Find the checkbox element for hCaptcha
        findCheckboxElement() {
            return document.querySelector('.hcaptcha-checkbox') ||
                document.querySelector('[aria-labelledby="hcaptcha-anchor-label"]');
        },
        // Solve the hCaptcha by clicking the checkbox
        solve() {
            const checkbox = this.findCheckboxElement();
            if (checkbox && !isHidden(checkbox) && checkbox.getAttribute(ARIA_CHECKED) !== "true") {
                checkbox.click();
            }
        }
    };

    // Main captcha solver that tries to solve all types of captchas
    const captchaSolver = {
        solve() {
            reCaptchaV2Handler.solve();
            reCaptchaV2CallbackHandler.solve();
            reCaptchaV2EnterpriseHandler.solve();
            hCaptchaHandler.solve();
        }
    };

    // Initialize a MutationObserver to detect changes in the DOM
    function initializeObserver() {
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    captchaSolver.solve();
                }
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Initialize the script
    function init() {
        captchaSolver.solve();

        // Periodically try to solve captchas
        setInterval(() => {
            captchaSolver.solve();
        }, 1000);
    }

    // Check if the document is still loading
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initializeObserver();
            init();
        });
    } else {
        initializeObserver();
        init();
    }

    // Compatibility check for supported browsers
    const userAgent = navigator.userAgent.toLowerCase();
    const isCompatibleBrowser = ['chrome', 'edg', 'brave', 'firefox'].some(browser => userAgent.includes(browser));

    console.log(isCompatibleBrowser ? 'Running on a compatible browser' : 'Running on an unsupported browser');
})();