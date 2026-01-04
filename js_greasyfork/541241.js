// ==UserScript==
// @name         Auto Claim Earnbitmoon
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Auto Roll
// @author       nubiebot
// @match        https://earnbitmoon.club/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541241/Auto%20Claim%20Earnbitmoon.user.js
// @updateURL https://update.greasyfork.org/scripts/541241/Auto%20Claim%20Earnbitmoon.meta.js
// ==/UserScript==

(function () {
    'use strict';
    (function clickJackpotButtonOnce() {
        const jackpotButton = document.querySelector('button[data-target="#modal2my"]');
        if (jackpotButton) {
            setTimeout(() => {
                jackpotButton.click();
            }, 5000);
        }
    })();

    const forceSelectCaptcha5 = () => {
        const captchaSelect = document.querySelector('#toggleCaptcha');
        if (captchaSelect && captchaSelect.value !== '5') {
            captchaSelect.value = '5';
            captchaSelect.dispatchEvent(new Event('change', { bubbles: true }));
        }
    };

    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function (method, url) {
        this._url = url;
        return originalOpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function (body) {
        if (this._url && this._url.includes('/system/ajax.php')) {
            if (typeof body === 'string' && body.includes('captcha=3')) {
                body = body.replace('captcha=3', 'captcha=5');
            }
        }
        return originalSend.call(this, body);
    };

    let alreadyClicked = false;

    function simulateClick(elem) {
        const evt = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        });
        elem.dispatchEvent(evt);
    }

    const checkInterval = setInterval(() => {
        forceSelectCaptcha5();
        const turnstileInfo = document.querySelector('.captcha-solver-info');
        const isSolved = turnstileInfo && turnstileInfo.textContent.trim().toLowerCase() === 'turnstile solved!';
        if (isSolved && !alreadyClicked) {
            const pressWinBtn = document.querySelector('button.zxz[onclick="starzRoll3();"]');
            if (pressWinBtn) {
                alreadyClicked = true;
                setTimeout(() => {
                    simulateClick(pressWinBtn);

                    setTimeout(() => {
                        const closeBtn = document.querySelector('button.btn.btn-default[data-dismiss="modal"]');
                        if (closeBtn) {
                            simulateClick(closeBtn);
                        }
                    }, 5000);

                }, 2000);
            }
        }
    }, 1000);
})();
