// ==UserScript==
// @name         Custom CNZZ Script
// @namespace    Violentmonkey Scripts
// @version      1.0
// @description  Custom script for CNZZ
// @author       Your Name
// @match        https://5aqmmo.mwtksrp.com/home.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478224/Custom%20CNZZ%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/478224/Custom%20CNZZ%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var um = document.createElement("script");
    um.src = "https://s4.cnzz.com/z.js?id=1281312497&async=1";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(um, s);
})();