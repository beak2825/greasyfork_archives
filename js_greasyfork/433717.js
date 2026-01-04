// ==UserScript==
// @name         Hide Unavailable Services For WHMCS
// @namespace    http://tampermonkey.net
// @version      1.0.0
// @description  A script to hide unavailable services in the Client Area.
// @author       uxh
// @match        https://bandwagonhost.com/clientarea.php?action=products*
// @match        https://bwh1.net/clientarea.php?action=products*
// @match        https://bwh8.net/clientarea.php?action=products*
// @match        https://bwh81.net/clientarea.php?action=products*
// @match        https://bwh88.net/clientarea.php?action=products*
// @match        https://bwh89.net/clientarea.php?action=products*
// @match        https://billing.virmach.com/clientarea.php?action=services*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433717/Hide%20Unavailable%20Services%20For%20WHMCS.user.js
// @updateURL https://update.greasyfork.org/scripts/433717/Hide%20Unavailable%20Services%20For%20WHMCS.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var a1 = document.getElementsByTagName("strike");
    for (var i1=0; i1<a1.length; i1++) {
            a1[i1].parentNode.parentNode.parentNode.style.display="none";
    };

    var a2 = document.getElementsByClassName("status-terminated");
    for (var i2=0; i2<a2.length; i2++) {
            a2[i2].parentNode.parentNode.style.display="none";
    };

})()
