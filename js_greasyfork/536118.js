// ==UserScript==
// @name         Auto Click Moving Blue Ball
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Clicks a moving blue ball when detected on the screen
// @author       YourName
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/536118/Auto%20Click%20Moving%20Blue%20Ball.user.js
// @updateURL https://update.greasyfork.org/scripts/536118/Auto%20Click%20Moving%20Blue%20Ball.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function clickBlueBall() {
        const blueBall = document.querySelector('.blue-ball'); // Adjust if needed
        if (blueBall) {
            blueBall.click();
            console.log('Clicked the blue ball!');
        }
    }

    setInterval(clickBlueBall, 100); // Check for the ball every 100ms
})();
