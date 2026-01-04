// ==UserScript==
// @name         TU_Wien_Login_hohes_passwortalter
// @namespace    https://greasyfork.org/de/users/157797-lual
// @version      0.2
// @description  ok, my pw is old, but i use 2 factor auth with OTP - this script just clicks the warning away
// @author       lual
// @match        https://idp.zid.tuwien.ac.at/simplesaml/module.php/oldPW/confirmOldPW.php*
// @icon         https://www.tuwien.at/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/462861/TU_Wien_Login_hohes_passwortalter.user.js
// @updateURL https://update.greasyfork.org/scripts/462861/TU_Wien_Login_hohes_passwortalter.meta.js
// ==/UserScript==
// changes:        2023-03-29 initial

(function() {
    'use strict';
    setTimeout(function() {
        document.querySelector('#yesbutton').click()
    }, 1000)
})();