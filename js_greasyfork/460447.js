// ==UserScript==
// @name         Youtube Auto "I understand and wish to proceed"
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Auto click the "I understand and wish to proceed" in age-restricted videos.
// @author       khaled-0
// @match        https://www.youtube.com/*
// @grant        none
// @license       GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/460447/Youtube%20Auto%20%22I%20understand%20and%20wish%20to%20proceed%22.user.js
// @updateURL https://update.greasyfork.org/scripts/460447/Youtube%20Auto%20%22I%20understand%20and%20wish%20to%20proceed%22.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(function() {
        const consentBtn = document.querySelector("[aria-label=\"I understand and wish to proceed\"]");
        if(consentBtn == null) return;
        consentBtn.click();
        consentBtn.remove();
    }, 10)();
})();