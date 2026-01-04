// ==UserScript==
// @name         DH/VL ALERT
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Plays an alert sound when 3 Down block gets DH/VL
// @author       MiseryOG
// @match        https://www.dfprofiler.com/bossmap
// @match        http://www.dfprofiler.com/bossmap
// @match        dfprofiler.com/bossmap
// @match        test2.dfprofiler.com/bossmap
// @match        https://test2.dfprofiler.com/bossmap
// @match        http://test2.dfprofiler.com/bossmap
// @icon         https://www.google.com/s2/favicons?sz=64&domain=example.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493722/DHVL%20ALERT.user.js
// @updateURL https://update.greasyfork.org/scripts/493722/DHVL%20ALERT.meta.js
// ==/UserScript==

(function() {
    var alertCount = 0; // Counter for alert plays

    // Function to check for changes in the DOM
    function checkForChanges() {
        var targetTd = document.querySelector('#boss-table .coord.x1016.y1022');
        if (targetTd) {
            // Check if the class has changed to 'boss-cycle'
            if (targetTd.classList.contains('boss-cycle')) {
                // Play alert sound
                playAlertSound();
            }
        }
    }
    
    // Function to play the alert sound
    function playAlertSound() {
        if (alertCount < 3) { // Play the alert sound only 3 times
            var audio = new Audio('https://dl.sndup.net/85jb/DH%20ALERT.mp3'); // Path to your alert sound file
            audio.volume = 0.5; // Set the volume to 50% (0.5)
            audio.play();
            alertCount++;
        } else {
            alertCount = 0; // Reset alert count if it reaches 3
            // Start checking for changes again after a delay
            setTimeout(checkForChanges, 5000); // Delay set to 5 seconds (adjust as needed)
        }
    }

    // Play alert sound on user click
    document.addEventListener('click', function() {
        playAlertSound();
    }, { once: true }); // Listen for only one click event

    // Check for changes initially
    checkForChanges();
})();