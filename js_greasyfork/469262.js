// ==UserScript==
// @name         Video Background Play
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Allows background play on most websites.
// @author       w4t3r1ily
// @match        http://*/*
// @match        https://*/*
// @icon         https://opu.peklo.biz/p/23/07/12/1689165131-32015.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469262/Video%20Background%20Play.user.js
// @updateURL https://update.greasyfork.org/scripts/469262/Video%20Background%20Play.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener("visibilitychange", function(event) {
        event.stopImmediatePropagation();
    }, true);

    window.addEventListener("webkitvisibilitychange", function(event) {
        event.stopImmediatePropagation();
    }, true);
})();