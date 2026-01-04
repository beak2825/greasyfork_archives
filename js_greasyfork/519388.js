// ==UserScript==
// @name         Drift Boss Hack
// @namespace    http://tampermonkey.net/
// @version      2.5.7
// @description  Version 2.5.7 - Pretty much done, wont be doing anything else to this script -Final version
// @author       GDev
// @match        https://www.mathplayground.com/mobile_overlay.html?gameUrl=drift-boss-v3%2Findex.html&gameWidth=1700&gameHeight=960
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/519388/Drift%20Boss%20Hack.user.js
// @updateURL https://update.greasyfork.org/scripts/519388/Drift%20Boss%20Hack.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // Wait for the page to load
    window.addEventListener('load', function() {
        // Delay execution for 3 seconds
        setTimeout(function() {
            // Set the desired game data including coins and boosters
            localStorage.setItem('mjs-drift-boss-game-v1.0.1-dailyreward', '{"sound":0.7,"music":0.3,"score":0,"hasShownTutorial":false,"collectedCoin":10000000,"cars":[0,1,2,3,4,5,6,7],"currentCar":7,"currentTip":0,"booster1":10000000,"booster2":10000000,"booster3":10000000,"ko":0,"hasShownBoosterTutorial":false}');
            console.log('Hack Successful!');
        }, 2000); // 3000 milliseconds = 3 seconds
    });
})();
 