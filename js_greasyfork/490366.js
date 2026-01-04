// ==UserScript==
// @name         Epic Games Captcha Bypasser
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Bypass Captcha on Epic Games website
// @author       Your Name
// @match        https://www.epicgames.com/id/link/facebook/email*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490366/Epic%20Games%20Captcha%20Bypasser.user.js
// @updateURL https://update.greasyfork.org/scripts/490366/Epic%20Games%20Captcha%20Bypasser.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var captchaElements = document.getElementsByClassName("captcha");
    if (captchaElements.length > 0) {
        for (var i = 0; i < captchaElements.length; i++) {
            captchaElements[i].style.display = "none";
        }
    }
})();