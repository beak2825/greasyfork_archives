// ==UserScript==
// @name         Hover-click on TMT mod.
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  A simple script for Hover-click upgrades in TMT mod, like Synergism
// @author       You
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?domain=github.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427981/Hover-click%20on%20TMT%20mod.user.js
// @updateURL https://update.greasyfork.org/scripts/427981/Hover-click%20on%20TMT%20mod.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (typeof TMT_VERSION === 'undefined') return;
    console.log("Hover-click on TMT mod activated.");
    document.body.addEventListener('mouseover', event => {
        var e = e || window.event;
        var targetElem = e.target || e.srcElement;
        if (targetElem.classList.contains("upg") && targetElem.classList.contains("can")) {
            targetElem.click();
        }
        if (targetElem.classList.contains("buyable") && targetElem.classList.contains("can") && !targetElem._timeoutId) {
            targetElem._timeoutId = setInterval(function(){targetElem.click();}, 100);
        }
    })
    document.body.addEventListener('mouseout', event => {
        var e = e || window.event;
        var targetElem = e.target || e.srcElement;
        if (targetElem._timeoutId) {
            clearInterval(targetElem._timeoutId);
            targetElem._timeoutId = null;
        }
    })
})();