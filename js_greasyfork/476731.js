// ==UserScript==
// @name         Auto Accept Button Clicker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically clicks the accept button every second on csgo-clicker website.
// @author       charliecheats
// @match        https://kingofkfcjamal.github.io/CaseClicker/
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/476731/Auto%20Accept%20Button%20Clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/476731/Auto%20Accept%20Button%20Clicker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function() {
        var acceptButton = document.getElementById('acceptButton');
        acceptButton.click();
    }, 1);
})();