// ==UserScript==
// @name         Upsilon Simulator Auto Fullscreen
// @namespace    https://greasyfork.org/en/users/1380971
// @version      1.0
// @description  Automatically fullscreens the Online Upsilon Simulator (https://getupsilon.web.app/simulator)
// @author       MigPro
// @license      GPL3
// @icon         https://getupsilon.web.app/favicon.ico
// @match        https://getupsilon.web.app/simulator/simulator.dark.html
// @match        https://getupsilon.web.app/simulator/simulator.light.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512649/Upsilon%20Simulator%20Auto%20Fullscreen.user.js
// @updateURL https://update.greasyfork.org/scripts/512649/Upsilon%20Simulator%20Auto%20Fullscreen.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Toggle fullscreen mode (Same code the fullscreen button executes when clicked)
    document.body.className = document.body.className === "fullscreen" ? "" : "fullscreen";
})();
