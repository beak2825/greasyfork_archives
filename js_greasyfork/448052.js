// ==UserScript==
// @name         kiddyearner
// @namespace    https://kiddyearner.com/
// @version      0.1
// @description  https://www.youtube.com/channel/UCm2XoBbuIVSgMagy3Q01tSw
// @author       Laravandro
// @match        https://kiddyearner.com/quize
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kiddyearner.com
// @grant        none
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/448052/kiddyearner.user.js
// @updateURL https://update.greasyfork.org/scripts/448052/kiddyearner.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...

    setTimeout(() => window.open("https://kiddyearner.com/quize", "_self"), 15000);
    const calc = fn => new Function('return ' + fn)();
    if (document.querySelector(".swal2-container")) document.querySelector(".swal2-container").remove();
    const param = document.querySelector("form > div.wrapper > p").innerText.replace('=', '');
    document.title = param;
    document.querySelectorAll("input[id^='option']").forEach(item => {
        if (calc(param) == item.value) {
            document.title += ` = ${item.value}`;
            item.click();
            setTimeout(() => document.querySelector("form#quize_form").submit(), 1500);
        }
    });

})();
