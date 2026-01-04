// ==UserScript==
// @name         X-Trench-Run Hack
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  no more updates from now on. look at your highscore.
// @author       You
// @match        https://www.mathplayground.com/pg_x_trench_run.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487043/X-Trench-Run%20Hack.user.js
// @updateURL https://update.greasyfork.org/scripts/487043/X-Trench-Run%20Hack.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for the page to load
    window.addEventListener('load', function() {
        // Delay execution for 3 seconds
        setTimeout(function() {
            // Set the desired game data including coins and boosters
            localStorage.setItem('mjs-x-trench-run-v1.0.3', '{"sound":1,"music":0.5,"score":142543,"hasShownTutorial":false,"hasShownLaserGateTutorial":false,"laserGateTargetCount":6}');
            console.log('Hack Successful!');
        }, 500);
    });
})();