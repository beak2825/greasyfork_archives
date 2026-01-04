// ==UserScript==
// @name         Adbx, Adbits
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Bypass
// @author       LTW
// @license      none
// @match        https://news.blog24.me/*
// @match        https://blog24.me/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=blog24.me
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501623/Adbx%2C%20Adbits.user.js
// @updateURL https://update.greasyfork.org/scripts/501623/Adbx%2C%20Adbits.meta.js
// ==/UserScript==

(function() {
    'use strict';
if(window.location.href.includes('/process')){
        let countdown = 3;
        function updateCountdown() {
            document.getElementById('countdown').innerText = countdown;
            if (countdown === 0) {
                if(window.location.href.includes('https://news.blog24.me/process')){
                window.location.href = 'https://news.blog24.me/blog/10-ways-to-invest-to-get-maximum-profit';
                } else {window.location.href = 'https://blog24.me/blog/10-ways-to-invest-to-get-maximum-profit';}
            } else {
                countdown--;
                setTimeout(updateCountdown, 1000);
            }
        }

            setTimeout(function() {
            updateCountdown();
            }, 3000);
}
if(window.location.href.includes('/blog/')){
setTimeout(function() {
    var elements = document.getElementsByClassName("title ttu tc-light");
    var targetElement = null;

    for (var i = 0; i < elements.length; i++) {
        if (elements[i].textContent.trim() === "Verify Captcha") {
            targetElement = elements[i];
            break;
        }
    }

    if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
    }
}, 5000);
(() => {
    setTimeout(function() {
        const turnstileResponseInput = document.querySelector('input[name="cf-turnstile-response"]')

        if (turnstileResponseInput && turnstileResponseInput.value.trim() !== '') {
        setTimeout(function () { check2(); }, 2000);
        setTimeout(function () { check3(); }, 2000);
        }
    }, 30000);
})();
}
})();