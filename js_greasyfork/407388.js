// ==UserScript==
// @name         pixhost.to Bypass
// @namespace    http://hide-me.online/
// @version      0.1
// @description  pixhost.to Bypass!
// @author       You
// @match        https://pixhost.to/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407388/pixhostto%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/407388/pixhostto%20Bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var theDiv = document.getElementById("js");
    theDiv.getElementsByTagName("a").click();


})();