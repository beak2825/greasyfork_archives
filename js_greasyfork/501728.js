// ==UserScript==
// @name         Acellus Video Skip
// @namespace https://greasyfork.org/en/users/1291009
// @version      0.0.3
// @description  Doesnt work fully
// @author       BadOrBest
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @icon         https://www.google.com/s2/favicons?sz=64&domain=acellus.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/501728/Acellus%20Video%20Skip.user.js
// @updateURL https://update.greasyfork.org/scripts/501728/Acellus%20Video%20Skip.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Desired acceleration rate (adjust as needed)
    var accelerationRate = 5; // Accelerate to 5x the normal speed

    // Interval for adjusting media elements (milliseconds)
    var adjustmentInterval = 100; // Adjust every 100 milliseconds for smoother effect

    // Keep track of the start time
    var startTime = Date.now();

    // Function to calculate how much to increment currentTime
    function getIncrementAmount() {
        return accelerationRate * (adjustmentInterval / 1000); // Calculate increment based on interval
    }

    // Periodically adjust media elements
    setInterval(adjustMediaPlayback, adjustmentInterval);

    function adjustMediaPlayback() {
        var mediaElements = document.querySelectorAll('video, audio');

        mediaElements.forEach(function(media) {
            if (media.duration === Infinity || isNaN(media.duration)) {
                console.warn('Media duration is not available.');
                return;
            }

            var incrementAmount = getIncrementAmount();
            var currentTime = media.currentTime;

            // Calculate the new currentTime with acceleration
            var newTime = currentTime + incrementAmount;

            // Prevent going beyond the end of the media
            if (newTime >= media.duration) {
                media.currentTime = media.duration;
                media.pause(); // Pause the media if it reaches the end
            } else {
                media.currentTime = newTime;
            }
        });
    }

})();