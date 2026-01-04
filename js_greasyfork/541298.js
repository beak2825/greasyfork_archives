// ==UserScript==
// @name         Auto Click Cloudflare CAPTCHA
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Automatically click Cloudflare CAPTCHA checkbox (iframe version)
// @author       Zaw (based on NWater)
// @match        https://challenges.cloudflare.com/cdn-cgi/challenge-platform/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541298/Auto%20Click%20Cloudflare%20CAPTCHA.user.js
// @updateURL https://update.greasyfork.org/scripts/541298/Auto%20Click%20Cloudflare%20CAPTCHA.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function waitFor(selector, timeout = 20000) {
        return new Promise((resolve, reject) => {
            const start = Date.now();
            const interval = setInterval(() => {
                const el = document.querySelector(selector);
                if (el && el.offsetParent !== null && !el.disabled) {
                    clearInterval(interval);
                    resolve(el);
                } else if (Date.now() - start > timeout) {
                    clearInterval(interval);
                    reject("Timeout waiting for " + selector);
                }
            }, 300);
        });
    }

    async function autoClickCaptcha() {
        try {
            console.log("[AutoCaptcha] Waiting for checkbox...");
            const checkbox = await waitFor("input[type='checkbox']");
            checkbox.click();
            console.log("[AutoCaptcha] Checkbox clicked.");

            const mark = await waitFor("span.mark");
            mark.click();
            console.log("[AutoCaptcha] Mark clicked.");
        } catch (err) {
            console.warn("[AutoCaptcha] Failed:", err);
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", autoClickCaptcha);
    } else {
        autoClickCaptcha();
    }
})();
