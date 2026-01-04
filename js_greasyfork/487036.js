// ==UserScript==
// @name         Electron Dash Highscore Hack
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Get 89332 as your highscore lol. --no more updates
// @author       You
// @match        https://www.mathplayground.com/pg_electron_dash.html
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487036/Electron%20Dash%20Highscore%20Hack.user.js
// @updateURL https://update.greasyfork.org/scripts/487036/Electron%20Dash%20Highscore%20Hack.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for the page to load
    window.addEventListener('load', function() {
        // Delay execution for 3 seconds
        setTimeout(function() {
            // Set the desired game data including coins and boosters
            localStorage.setItem('MJS-Electron-Dash-v1.0.0', '{"sound":0.7,"music":0.2,"score":89332,"hasShownTutorial":false}');
            console.log('Hack Successful!');
        }, 500);
    });
})();


//Credit required.