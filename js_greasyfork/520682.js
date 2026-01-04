// ==UserScript==
// @name         Duolingo KN Points Increment
// @namespace    https://greasyfork.org/users/YOUR_USERNAME
// @version      1.0
// @description  A simple script to increment and display KN points in Duolingo style every second.
// @author       YOUR_NAME
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520682/Duolingo%20KN%20Points%20Increment.user.js
// @updateURL https://update.greasyfork.org/scripts/520682/Duolingo%20KN%20Points%20Increment.meta.js
// ==/UserScript==

(function() {
    'use strict';

    
    const knContainer = document.createElement('div');
    knContainer.style.fontFamily = 'Arial, sans-serif';
    knContainer.style.textAlign = 'center';
    knContainer.style.marginTop = '50px';
    knContainer.innerHTML = `
        <h1>Duolingo KN Points</h1>
        <p>Your current points:</p>
        <div id="kn-points" style="
            font-size: 48px;
            font-weight: bold;
            color: #4CAF50;
        ">0</div>
    `;
    document.body.prepend(knContainer);

    let knPoints = 0;
    const knPointsElement = document.getElementById('kn-points');

    
    function updateKnPoints() {
        knPoints += 100000000; 
        knPointsElement.textContent = knPoints.toLocaleString(); 
    }

    setInterval(updateKnPoints, 1000);
})();
