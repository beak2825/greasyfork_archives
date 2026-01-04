// ==UserScript==
// @name         Brainly Unlocker
// @namespace    https://gradyn.com
// @version      1.1
// @description  Bypass brainly paywall, updated by ExtraTankz
// @author       ExtraTankz & Gradyn Wursten
// @match        https://brainly.com/question/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422892/Brainly%20Unlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/422892/Brainly%20Unlocker.meta.js
// ==/UserScript==

(function() {
    'use strict';
    localStorage.clear()
    window.onload = function () {
    	document.getElementsByClassName("brn-expanded-bottom-banner")[0].remove()
    	document.getElementsByClassName("brn-brainly-plus-box")[0].remove()
    	document.getElementsByClassName("brn-fullscreen-toplayer")[0].remove()
    	document.getElementsByClassName("sg-overlay sg-overlay--dark")[0].remove()
    }
})();

