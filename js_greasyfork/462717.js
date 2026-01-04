// ==UserScript==
// @name         Gixen Timer Bypass
// @namespace    http://gixen.com/
// @version      0.3
// @description  Bypasses the 20/60 second timer that nags you to get Gixen Mirror
// @author       Skyfall
// @match        https://www.gixen.com/main/home_2.php?sessionid=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gixen.com
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/462717/Gixen%20Timer%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/462717/Gixen%20Timer%20Bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let buttons = document.querySelectorAll("form#g_id input#gbutton");
    let button = buttons[0];

    // Sanity check
    if (buttons.length === 1) {
        // The button is the right one. Undisable the button and click it.
        button.disabled = false;
        button.click();
    }
})();
