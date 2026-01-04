// ==UserScript==
// @name         Coinsmasters Auto Claim
// @namespace    coinmasters.auto.claim
// @version      0.1
// @description  Made in Trinidad
// @author       stealtosvra
// @match        https://coinmasters.online/bonusclaim
// @icon         https://www.google.com/s2/favicons?sz=64&domain=coinmasters.online
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493595/Coinsmasters%20Auto%20Claim.user.js
// @updateURL https://update.greasyfork.org/scripts/493595/Coinsmasters%20Auto%20Claim.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function redirect() {
        window.location.href = "https://coinmasters.online/bonusclaim/claim";
    }
    setTimeout(function() {
        document.querySelector('.buttonbutton.border-0.mt-4').click();
    }, 21 * 60 * 1000);
    
})();