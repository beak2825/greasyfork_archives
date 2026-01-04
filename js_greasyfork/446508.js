// ==UserScript==
// @name         5.1 Rotator faucet (free-bits.xyz)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  rotator free-bits.xyz
// @author          Grizon
// @copyright       2021, Grizon
// @match        https://free-bits.xyz/faucet.php
// @icon         https://free-bits.xyz/img/icon.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/446508/51%20Rotator%20faucet%20%28free-bitsxyz%29.user.js
// @updateURL https://update.greasyfork.org/scripts/446508/51%20Rotator%20faucet%20%28free-bitsxyz%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
setInterval(function() {
    if  (grecaptcha.getResponse().length > 0) {
        document.querySelector('button[class="claimbtn"]').click();
    }
}, 2000);
setTimeout(function() {
    if (document.querySelector('div[class="success"]')) {
        document.querySelectorAll('button[class="selectbtn "]')[1].click();
    }
}, 1000);
})();