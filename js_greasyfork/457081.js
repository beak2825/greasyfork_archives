// ==UserScript==
// @name           hCapcha Locale Setter (English)
// @name:en        hCapcha Locale Setter (English)
// @license        MIT
// @namespace      https://docs.hcaptcha.com/languages/
// @version        0.0.4
// @description    hCapchaの言語を強制的に英語に変更します
// @description:en Force hCapcha to change its language to English
// @author         iniimi2170
// @require        https://code.jquery.com/jquery-3.6.1.min.js
// @match          https://*/*
// @run-at         document-idle
// @downloadURL https://update.greasyfork.org/scripts/457081/hCapcha%20Locale%20Setter%20%28English%29.user.js
// @updateURL https://update.greasyfork.org/scripts/457081/hCapcha%20Locale%20Setter%20%28English%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(function() {
        let elems = document.getElementsByClassName("option")
        for (let elem of elems) {
            if (elem.firstElementChild && elem.firstElementChild.textContent === "English") {
                elem.click()
            }
        }
    }, 3000);
})();