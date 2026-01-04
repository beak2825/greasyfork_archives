// ==UserScript==
// @name         OrlyGift Auto LogIn
// @namespace    https://github.com/tkhquang
// @version      0.1
// @description  Automatically click the steam login button.
// @author       AleksT.
// @license      MIT; https://raw.githubusercontent.com/tkhquang/userscripts/master/LICENSE
// @homepage     https://greasyfork.org/en/scripts/369277-orlygift-auto-login
// @match        https://www.orlygift.com/giveaway
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369277/OrlyGift%20Auto%20LogIn.user.js
// @updateURL https://update.greasyfork.org/scripts/369277/OrlyGift%20Auto%20LogIn.meta.js
// ==/UserScript==

//Intended to use with this script: https://greasyfork.org/en/scripts/29634-steam-auto-sign-in

(function () {
    "use strict";

    const steamLogInBtn = document.getElementsByClassName("btn-steam");
    if (steamLogInBtn.length === 0 || steamLogInBtn[0].hidden === true) {
        console.log("You are logged in");
        return;
    }
    steamLogInBtn[0].click();
    console.log("Auto Login Function!");
}());