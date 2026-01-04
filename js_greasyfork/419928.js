// ==UserScript==
// @name        Speedport PLUS Cosmote
// @namespace    http://tampermonkey.net/
// @match *://192.168.1.1/*
// @run-at document-start
// @grant    GM_addStyle
// @version     0.1
// @author      nikant
// @description Cosmote Speedport PLUS mods
// @downloadURL https://update.greasyfork.org/scripts/419928/Speedport%20PLUS%20Cosmote.user.js
// @updateURL https://update.greasyfork.org/scripts/419928/Speedport%20PLUS%20Cosmote.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var path = location.pathname;

    switch (true) {

        /* ----- Status page ----- */
        case path.includes('/html/login/status.html'):
        GM_addStyle("div.c2c:nth-of-type(5):not(#invalid_var_wlan_ssid), div.c2c:nth-of-type(6):not(#invalid_var_fon_ssid) { display: block !important; }");
        break;

        /* ----- Telephony page ----- */
        case path.includes('/html/content/phone/'):
        GM_addStyle("ul li:nth-of-type(3):not(.keepfont) { display: block !important; }");
        break;
    }

})();
