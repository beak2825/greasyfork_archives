// ==UserScript==
// @name         Set Slope Speed and Set Points
// @namespace    http://yourwebsite.com/
// @version      0.1
// @description  Sets the speed and set points for a slope game
// @author       Your Name
// @match        https://sites.google.com/site/unblockedgame76/SLOPE
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490193/Set%20Slope%20Speed%20and%20Set%20Points.user.js
// @updateURL https://update.greasyfork.org/scripts/490193/Set%20Slope%20Speed%20and%20Set%20Points.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Set the desired speed and set points here
    const desiredSpeed = 5;
    const desiredSetPoints = 10;

    // Wait for the page to load
    window.addEventListener('load', () => {
        // Find the elements that control the speed and set points
        const speedElement = document.querySelector('[name="speed"]');
        const setPointsElement = document.querySelector('[name="setPoints"]');

        // Check if the elements were found
        if (speedElement && setPointsElement) {
            // Set the speed and set points to the desired values
            speedElement.value = desiredSpeed;
            setPointsElement.value = desiredSetPoints;

            // Trigger a change event to apply the new values
            const event = new Event('change');
            speedElement.dispatchEvent(event);
            setPointsElement.dispatchEvent(event);
        }
    });
})();