// ==UserScript==
// @name         Torn double Tap Reload
// @namespace    http://tampermonkey.net/
// @version      0.1.01
// @description  Reloads the page on double tap on www.torn.com
// @author       You
// @match        https://www.torn.com/loader*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471621/Torn%20double%20Tap%20Reload.user.js
// @updateURL https://update.greasyfork.org/scripts/471621/Torn%20double%20Tap%20Reload.meta.js
// ==/UserScript==

(function() {
    let lastTapTime = 0;
    const tripleTapInterval = 300; // Set the time window within which three taps should be considered a triple tap (in milliseconds).

    document.addEventListener('click', function() {
        const currentTime = Date.now();
        if (currentTime - lastTapTime <= tripleTapInterval) {
            // Perform the reload action here
            location.reload();
        }
        lastTapTime = currentTime;
    });
})();

