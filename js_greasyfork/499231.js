// ==UserScript==
// @name         cashfly short
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  cashfly
// @author       LTW
// @license      none
// @match        https://chillfaucet.in/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chillfaucet.in
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499231/cashfly%20short.user.js
// @updateURL https://update.greasyfork.org/scripts/499231/cashfly%20short.meta.js
// ==/UserScript==

(function() {
    'use strict';
const c = setInterval(async () => {
    const t = document.getElementById("timer");

    if (t && t.style.display === "none") {
         var d = document.querySelector('.iconcaptcha-modal__body-title');
        if (!d) {
        clearInterval(c);
        setTimeout(function () { check2(); }, 2000);
        setTimeout(function () { check3(); }, 2000);
        } else {
         if (d && d.innerText.toLowerCase() === 'verification complete.') {
        clearInterval(c);
        setTimeout(function () { check2(); }, 2000);
        setTimeout(function () { check3(); }, 2000);
          }
        }
    }
}, 2000);
})();