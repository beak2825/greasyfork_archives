// ==UserScript==
// @name         Touch UI back and forward buttons for FireFox
// @namespace    userscript@fabian.dk
// @version      0.2
// @description  Fixing FireFox Touch navigation
// @author       Tony Fabian
// @include      *://*/*
// @grant        none
// @license MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/440013/Touch%20UI%20back%20and%20forward%20buttons%20for%20FireFox.user.js
// @updateURL https://update.greasyfork.org/scripts/440013/Touch%20UI%20back%20and%20forward%20buttons%20for%20FireFox.meta.js
// ==/UserScript==
(function () {
    // Register touchstart and touchend listeners for element 'source'
    var src = document.getElementsByTagName("body")[0];
    var clientX, clientY;
    src.addEventListener('touchstart', function (e) {
        // Cache the client X/Y coordinates
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    }, false);
    src.addEventListener('touchend', function (e) {
        var deltaX, deltaY;
        // Compute the change in X and Y coordinates.
        // The first touch point in the changedTouches
        // list is the touch point that was just removed from the surface.
        deltaX = e.changedTouches[0].clientX - clientX;
        deltaY = e.changedTouches[0].clientY - clientY;
        if (deltaX <= -75) {
            console.log("navigate back");
            history.back();
        }
        if (deltaX >= 75) {
            console.log("navigate forward");
            history.forward();
        }
    }, false);
})();
