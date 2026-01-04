// ==UserScript==
// @name         IDriveSafely.com Timer Bypass
// @namespace    Timer Bypass
// @version      1.0
// @description  Bypass the timer on IDriveSafely.com
// @author       Ryan Montgomery
// @match        https://www.idrivesafely.com/course/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382372/IDriveSafelycom%20Timer%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/382372/IDriveSafelycom%20Timer%20Bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';
var scriptContent = "vTimeReq = 0;"
var script = document.createElement('script')
script.appendChild(document.createTextNode(scriptContent));
document.getElementsByTagName('head')[0].appendChild(script);
})();