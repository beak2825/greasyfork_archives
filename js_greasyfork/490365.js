// ==UserScript==
// @name         gplinks auto-skip
// @author       BlazeFTL
// @namespace    http://tampermonkey.net/
// @description  Remove the adclick nag and auto-click the buttons.
// @version      2.3
// @match        *://*/*
// @supportURL   https://github.com/uBlockOrigin/uAssets/discussions/27472#discussioncomment-12725221
// @icon         https://www.google.com/s2/favicons?domain=gplinks.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490365/gplinks%20auto-skip.user.js
// @updateURL https://update.greasyfork.org/scripts/490365/gplinks%20auto-skip.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const button1 = document.querySelector('#VerifyBtn');
    const button2 = document.querySelector('#NextBtn');
    if (button1 && button2){


    const INTERVAL_2S = 2000;
    const INTERVAL_1S = 1000;
    const smileyExists = !!document.querySelector('.SmileyBanner');

    // 1. Set cookie_pub_plan_id to 12
    window.cookie_pub_plan_id = 12;

    // 2. Create and focus fake iframe ONCE
    (function focusIframeOnce() {
        const i = document.createElement('iframe');
        i.style = 'height:0;width:0;border:0;';
        i.id = 'a';
        document.body.appendChild(i);
        i.focus();
        setTimeout(() => window.focus(), 500); // Refocus main window shortly after
    })();

    // 3. Ensure ad cookie is set
    function SetAdCookie() {
        const expireTime = new Date(new Date().getTime() + 2 * 60 * 1000); // 2 mins
        document.cookie = `adexp=1; path=/; expires=${expireTime.toUTCString()}`;
    }
    SetAdCookie();

    // 4. Click logic
    let verifyClicked = false;
    let nextClicked = false;

    function clickIfVisible(el) {
        if (el && el.offsetParent !== null) {
            el.click();
            return true;
        }
        return false;
    }

    function clickWithRetry(selector, flagName, callback) {
        const el = document.querySelector(selector);
        if (!el) return;

        if (!window[flagName]) {
            const clicked = clickIfVisible(el);
            if (clicked) {
                window[flagName] = true;
                if (callback) callback();
            } else {
                setTimeout(() => clickWithRetry(selector, flagName, callback), 1000);
            }
        }
    }

    function clickNextAndCheckHash() {
        clickWithRetry('.NextBtn', 'nextClicked', () => {
            setTimeout(() => {
                if (window.location.href.endsWith('#')) {
                    // Click again if URL ends with #
                    window.nextClicked = false;
                    clickWithRetry('.NextBtn', 'nextClicked');
                }
            }, 1500);
        });
    }

    if (smileyExists) {
        const verifyBtn = document.querySelector('#VerifyBtn');
        const placeholder = document.createElement('div');
        placeholder.style.color = 'black';
        placeholder.style.fontWeight = 'bold';
        placeholder.id = 'countdown-replace';
        verifyBtn.parentNode.insertBefore(placeholder, verifyBtn);
        verifyBtn.style.display = 'none';

        let countdown = 15;
        placeholder.innerText = `Please wait ${countdown} seconds`;

        const timer = setInterval(() => {
            countdown--;
            placeholder.innerText = `Please wait ${countdown} seconds`;

            if (countdown <= 0) {
                clearInterval(timer);
                verifyBtn.style.display = 'inline-block';
                placeholder.remove();
                clickWithRetry('#VerifyBtn', 'verifyClicked');
                setTimeout(clickNextAndCheckHash, 1000);
            }
        }, INTERVAL_1S);
    } else {
        setTimeout(() => {
            clickWithRetry('#VerifyBtn', 'verifyClicked');
            setTimeout(clickNextAndCheckHash, 1000);
        }, 16000);
    }
    }
})();