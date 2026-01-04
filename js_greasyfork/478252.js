// ==UserScript==
// @name         Auto Claim Free Case
// @namespace    Free Case
// @version      1.0
// @description  Открывает 24 часовой кейс
// @author       Role_Play
// @match        https://grib-free.xyz/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478252/Auto%20Claim%20Free%20Case.user.js
// @updateURL https://update.greasyfork.org/scripts/478252/Auto%20Claim%20Free%20Case.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function clickButton() {
        const button = document.querySelector('button.bg-orange-300');
        if (button) {
            button.click();
        }
    }

    window.addEventListener('load', clickButton);
})();