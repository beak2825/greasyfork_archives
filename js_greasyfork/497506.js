// ==UserScript==
// @name         new free-ltc-info.com claim
// @namespace    http://tampermonkey.net/
// @version      2024-06-06
// @description  claim FLI and withdraw coins!
// @author       Danik Odze
// @match        https://free-ltc-info.com/claim
// @icon         https://www.google.com/s2/favicons?sz=64&domain=free-ltc-info.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497506/new%20free-ltc-infocom%20claim.user.js
// @updateURL https://update.greasyfork.org/scripts/497506/new%20free-ltc-infocom%20claim.meta.js
// ==/UserScript==

(function () {
    'use strict';
    document.addEventListener("visibilitychange", function () {
        if (document.hidden) {
            console.log(new Date().toLocaleTimeString());
            console.log('Вкладка не активна');
        } else {
            console.log(new Date().toLocaleTimeString());
            console.log('Вкладка активна');
        }
    });
    var Okclaim = setInterval(function () {
        var Okbutton = document.querySelector("body > div.swal2-container.swal2-center.swal2-backdrop-show > div > div.swal2-actions > button.swal2-confirm.swal2-styled");
        if (Okbutton) {
            Okbutton.click();
            clearInterval(Okclaim);
        }
    }, 5000);
    var captchaInterval = setInterval(function () {
        document.querySelector("#fauform > button").click();
        clearInterval(captchaInterval);
    }, 17000);
})();