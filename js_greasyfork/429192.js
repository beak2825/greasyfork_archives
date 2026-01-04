// ==UserScript==
// @name         Youtube Enhancements
// @namespace    https://kyleschwartz.ca
// @version      1.0.0
// @description  Disbale autoplay and default to theatre mode
// @author       Kyle Schwartz
// @match        https://www.youtube.com/watch?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429192/Youtube%20Enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/429192/Youtube%20Enhancements.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (document.querySelector("[data-tooltip-target-id='ytp-autonav-toggle-button']").title === "Autoplay is on") {
        document.querySelector("[data-tooltip-target-id='ytp-autonav-toggle-button']").click();
    }

    if (document.querySelector("[aria-label='Theater mode (t)']").title === "Theater mode (t)") {
        document.querySelector("[aria-label='Theater mode (t)']").click();
    }
})();