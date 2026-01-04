// ==UserScript==
    // @name         V2EX Ad Blocker
    // @namespace    http://tampermonkey.net/
    // @version      1.0
    // @description  Remove Phi Browser ad from V2EX
    // @author       Jonty
    // @license      GPL License
    // @match        https://www.v2ex.com/*
    // @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541406/V2EX%20Ad%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/541406/V2EX%20Ad%20Blocker.meta.js
    // ==/UserScript==

    (function() {
        'use strict';
        const targetDiv = document.querySelector('div.box#pro-campaign-container');
        if (targetDiv) {
            targetDiv.remove();
        }
    })();