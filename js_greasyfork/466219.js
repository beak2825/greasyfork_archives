// ==UserScript==
// @name Long Doge Scroller
// @description Automatically scroll down the long doge challenge with this script!
// @match https://longdogechallenge.com
// @license MIT
// @version 1.1.1
// @namespace https://greasyfork.org/users/1078195
// @downloadURL https://update.greasyfork.org/scripts/466219/Long%20Doge%20Scroller.user.js
// @updateURL https://update.greasyfork.org/scripts/466219/Long%20Doge%20Scroller.meta.js
// ==/UserScript==

(function() {
    var scrollDistance = 1000; // distance to scroll in pixels
    var scrollDelay = 10; // delay between each scroll step in milliseconds
    var scrollInterval;

    function startScrolling() {
        scrollInterval = setInterval(scrollPage, scrollDelay);
    }

    function stopScrolling() {
        clearInterval(scrollInterval);
    }

    function scrollPage() {
        window.scrollBy(0, scrollDistance);
    }

    function handleKeyPress(event) {
        var keyCode = event.keyCode || event.which;
        var key = String.fromCharCode(keyCode);

        if (key === 's') {
            startScrolling();
        } else if (key === 'x') {
            stopScrolling();
        }
    }

    console.log('Press "s" to start scrolling, "x" to stop scrolling.');

    window.addEventListener('keypress', handleKeyPress);
})();