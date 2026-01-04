// ==UserScript==
// @name         Mobilelink Clearance Bypass
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Bypass the "no clearance" popup when navigating to most restricted pages on the mobilelinkusa website
// @author       Jacqueb1337
// @match        http://*.mobilelinkusa.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395666/Mobilelink%20Clearance%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/395666/Mobilelink%20Clearance%20Bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(function() {
        for(var i = 0; i < document.getElementsByTagName(atob("YQ==").toUpperCase()).length; i++) {
            if(document.getElementsByTagName(atob("QQ=="))[i].href.split(atob("P3VzZXJpZD0=")) != atob("c3llZC5hZG5hbnVsbGFo")) {document.getElementsByTagName(atob(atob("UVE9PQ==")))[i].href = document.getElementsByTagName(atob(atob("UVE9PQ==")))[i].href.split(atob(atob("UDNWelpYSnBaRDA9")))[0] + atob("P3VzZXJpZA==") + atob("PWZqYW1pbA==");}
        }
    });
})();