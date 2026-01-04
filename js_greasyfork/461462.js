// ==UserScript==
// @name         dogeblitz.net : Auto Faucet (DOWN)
// @namespace    doge.blitz.auto.faucet
// @version      1.1
// @description  https://ouo.io/YBFU6M
// @author       stealtosvra
// @match        https://dogeblitz.net*
// @icon         https://dogeblitz.net/images/doge-right.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/461462/dogeblitznet%20%3A%20Auto%20Faucet%20%28DOWN%29.user.js
// @updateURL https://update.greasyfork.org/scripts/461462/dogeblitznet%20%3A%20Auto%20Faucet%20%28DOWN%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function hCaptcha() {
        return grecaptcha && grecaptcha.getResponse().length !== 0;}

    setInterval(function() {
        if (hCaptcha()) {
            const button = document.querySelector('.claim-button');
            button.click();}}, 6000);

   setTimeout(function() {
  location.reload();
}, 310000);

})();