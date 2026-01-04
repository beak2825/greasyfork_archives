// ==UserScript==
// @name         Upsilon Simulator Auto Fullscreen (Alternative)
// @namespace    https://greasyfork.org/en/users/1380971
// @version      1.0
// @description  Automatically fullscreens the Online Upsilon Simulator (alternative which clicks a button, but has a delay because the button only works after the simulator loads in)
// @author       MigPro
// @license      GPL3
// @icon         https://getupsilon.web.app/favicon.ico
// @match        https://getupsilon.web.app/simulator/simulator.dark.html
// @match        https://getupsilon.web.app/simulator/simulator.light.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512653/Upsilon%20Simulator%20Auto%20Fullscreen%20%28Alternative%29.user.js
// @updateURL https://update.greasyfork.org/scripts/512653/Upsilon%20Simulator%20Auto%20Fullscreen%20%28Alternative%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function() {
        setTimeout(function() {
            const fullscreenButton = document.querySelector('#action-fullscreen');
            if (fullscreenButton) {
                fullscreenButton.click();
            }
        }, 1000);

    });

})();
