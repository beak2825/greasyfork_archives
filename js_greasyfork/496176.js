// ==UserScript==
// @name         FOODSHORT
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  FOODSHORT Bypass
// @author       ltw
// @match        https://blog.fooduai.com.br/*
// @license      none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fooduai.com.br
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496176/FOODSHORT.user.js
// @updateURL https://update.greasyfork.org/scripts/496176/FOODSHORT.meta.js
// ==/UserScript==

(function() {
    'use strict';
        const submitButton = document.querySelector('button[type="submit"]');

    if (!grecaptcha) {
        setTimeout(() => {
            if (submitButton && !submitButton.disabled) {
                document.getElementById('form-continue').submit();
            }
        }, 5000);
    } else {
        const intervalo = setInterval(() => {
            if (grecaptcha.getResponse().length !== 0) {
                setTimeout(() => {
                   if (submitButton && !submitButton.disabled) {
                    document.getElementById('link-view').submit();
                    clearInterval(intervalo);
                   }
                }, 5000);
            }
        }, 3000);
    }
setTimeout(function () {location.reload();}, 120000);
})();
