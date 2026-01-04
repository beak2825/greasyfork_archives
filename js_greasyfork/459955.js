// ==UserScript==
// @name         TLSContact Slot Helper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Style for TLSContact website to avoid scrolling the time table, makes slots easier to find.
// @author       Yue Kang
// @match        https://*.tlscontact.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tlscontact.com
// @grant        GM_addStyle
// @supportURL   https://github.com/kangyue92/tlscontact-slot-helper
// @downloadURL https://update.greasyfork.org/scripts/459955/TLSContact%20Slot%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/459955/TLSContact%20Slot%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (document.getElementsByClassName("form_status").length) {
        GM_addStyle('a.appt-table-btn.full {background-color: red;}');
        GM_addStyle('.container {max-width: fit-content !important;}');
        GM_addStyle('div.take_appointment,div.card {height: 1400px !important; width: 5000px !important;}');
    }

    // For UK Site
    setTimeout(() => {
        if (document.getElementById("normal_button")) {
            document.getElementById("normal_button").click()
        }
    }, 100);
    setTimeout(() => {
        if (document.getElementById("pta_button")) {
            document.getElementById("pta_button").click()
        }
    }, 3000);

})();
