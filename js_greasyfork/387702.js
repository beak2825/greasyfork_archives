// ==UserScript==
// @name         Scroll Bar Enabler
// @namespace    https://greasyfork.org/users/313414
// @version      1.1
// @description  Re-enables the scroll bar for sites that use anti-adblock scripts.
// @author       Matt-RJ
// @match        *://*/*
// @grant        unsafeWindow
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/387702/Scroll%20Bar%20Enabler.user.js
// @updateURL https://update.greasyfork.org/scripts/387702/Scroll%20Bar%20Enabler.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /*
    Whether the script runs automatically on every page.
    If set to false, use the extension button -> enable scrolling to run manually.
    */
    var automaticallyEnable = true;

    /*
    Some sites disable scrolling after the page has loaded. enableDelay is how long, in ms,
    before the script runs automatically to enable scrolling again.
    */
    var automaticEnableDelay = 500;

    if (automaticallyEnable) {
        setTimeout(function() {
            enableScrolling();
        }, automaticEnableDelay);
    }

    GM_registerMenuCommand("Enable Scrolling", function() {
        enableScrolling();
    }, 'r');

    function enableScrolling() {
        var body = document.getElementsByTagName("BODY")[0];
        body.style.overflow = "visible";
    }

})();