/* global $ */
// ==UserScript==
// @name         Detect
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.ha-lab.com/adDone?adKey=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/368833/Detect.user.js
// @updateURL https://update.greasyfork.org/scripts/368833/Detect.meta.js
// ==/UserScript==

(function() {
    setTimeout(function() {
        window.location.href = "https://www.ha-lab.com/games/dragon-city";
    }, 500);
})();