// ==UserScript==
// @name         Winding Road highscore hacl
// @namespace    http://tampermonkey.net/
// @version      2024-02-10
// @description  hehe 917 high score. No more updates. Also you might have to reload the page
// @author       GDev
// @match        https://www.mathplayground.com/pg_winding_road.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mathplayground.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487041/Winding%20Road%20highscore%20hacl.user.js
// @updateURL https://update.greasyfork.org/scripts/487041/Winding%20Road%20highscore%20hacl.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Wait for the page to load
    window.addEventListener('load', function() {
        // Delay execution for 3 seconds
        setTimeout(function() {
            // Set the desired game data including coins and boosters
            localStorage.setItem('MJS-WindingRoad-v1.0.0', '{"sound":0.7,"music":0.3,"hasShownTutorial":false,"score":917}');
            console.log('Hack Successful!');
        }, 500); // 3000 milliseconds = 3 seconds
    });
})();


//Credit required.