// ==UserScript==
// @name        Don't Change YouTube Speed on Long Click
// @namespace   Violentmonkey Scripts
// @description Stops YouTube from changing video speed to 2x when you hold down the mouse button.
// @match       https://*.youtube.com/*
// @include     https://www.youtube.com/*
// @include     https://m.youtube.com/*
// @grant       none
// @version     1.3
// @author      Jupiter Liar
// @license     CC BY
// @description 05/04/2024, 10:25:00 PM
// @downloadURL https://update.greasyfork.org/scripts/493048/Don%27t%20Change%20YouTube%20Speed%20on%20Long%20Click.user.js
// @updateURL https://update.greasyfork.org/scripts/493048/Don%27t%20Change%20YouTube%20Speed%20on%20Long%20Click.meta.js
// ==/UserScript==

var speedmasterVisibility = false;
var debug = true;

if (speedmasterVisibility == false) {
    // Create a stylesheet
    var style = document.createElement('style');
    style.id = "speedmaster-hide";
    style.type = 'text/css';

    // Create a text node containing the CSS rule
    var cssText = document.createTextNode('.ytp-speedmaster-overlay { display: none; }');

    // Append the text node to the style element
    style.appendChild(cssText);

    // Append the stylesheet to the head
    document.head.appendChild(style);
}


// Function to log messages with a timestamp
function log(message) {
    if (debug) {
        console.log(`[${new Date().toLocaleTimeString()}] ${message}`);
    }
}

// Function to monitor playback speed changes
function monitorPlaybackSpeed() {
    // Store the previous computed display property value
    var previousDisplay = '';

    // Store the previous playback speed
    var previousSpeed = '';
    var revertSpeed = '';

    // Function to check if playback speed has changed to 2 and revert if necessary
    function checkPlaybackSpeed(revertIfNeeded = false) {
        var currentSpeed;
        if (document.querySelector("video")) {
            currentSpeed = document.querySelector("video").playbackRate;
        }
        log("revertIfNeeded: " + revertIfNeeded);

        // Log the current playback speed
        log(`Current playback speed: ${currentSpeed}`);

        // Function to handle mouse-up and touchend events
        function handleMouseUpOrTouchEnd() {
            // Play the video
            if (document.querySelector("video")) {
                document.querySelector("video").play();
                document.querySelector("video").playbackRate = revertSpeed;
            } else {
                log("No video found.");
            }

            // Detach the event listeners
            document.removeEventListener('mouseup', handleMouseUpOrTouchEnd);
            document.removeEventListener('touchend', handleMouseUpOrTouchEnd);

            // Revert the playback speed to the previous value
            localStorage.setItem("yt_playbackspeed", revertSpeed);
            if (document.querySelector("video")) {
                document.querySelector("video").playbackRate = revertSpeed;
            } else {
                log("No video found.");
            }
        }

        // Check if the playback speed has changed to 2
        if (revertIfNeeded) {
            log("Playback speed changed to 2 detected. Reverting...");
            revertSpeed = previousSpeed;

            // Revert the playback speed to the previous value
            localStorage.setItem("yt_playbackspeed", revertSpeed);
            if (document.querySelector("video")) {
                document.querySelector("video").playbackRate = revertSpeed;
            } else {
                log("No video found.");
            }

            // Log the playback speed to which it has been reverted
            log(`Playback speed reverted to ${revertSpeed}.`);

            // Set up event listeners for mouse-up and touchend events
            document.addEventListener('mouseup', handleMouseUpOrTouchEnd);
            document.addEventListener('touchend', handleMouseUpOrTouchEnd);
        }

        // Update the previous playback speed
        previousSpeed = currentSpeed;
    }

// Function to handle mutation events
function handleMutation(mutationsList) {
    log("Handling mutations...");
    mutationsList.forEach(function(mutation) {
        // log("Mutation type:", mutation.type);
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
            // Get the computed style of the child element of .ytp-speedmaster-overlay
            log("Mutation observed. Looking for child element...");
            var childElement = document.querySelector('.ytp-speedmaster-overlay > *');
            log("Child element:", childElement);
            var playerControlChildren = document.querySelectorAll('#player-control-container ytm-custom-control .tooltip-container');
            if (childElement) {
                var computedStyle = window.getComputedStyle(childElement);
                var currentDisplay = computedStyle.getPropertyValue('display');

                // Check if the computed display property has changed
                if (currentDisplay !== previousDisplay) {
                    log(`Computed display property changed to: ${currentDisplay}`);
                    // Update the previous display value
                    previousDisplay = currentDisplay;

                    // Check if the display property is no longer "none"
                    if (currentDisplay !== 'none') {
                        log("Speedmaster overlay detected. Checking playback speed...");
                        // Pass true to indicate reverting should be performed
                        checkPlaybackSpeed(true);
                    }
                }
            } else if (playerControlChildren) {
                // Check if the player control container exists

                // Loop through all child elements of the player control container
                playerControlChildren.forEach(function(child) {
                    // Check if any child element contains the text "2x"
                    if (child.innerText.includes('2x')) {
                        log("Playback speed increased detected in player control container.");
                        checkPlaybackSpeed(true);
                    }
                });
            }
        }
    });
}



    // Function to check if the speedmaster overlay exists
    function checkSpeedmasterOverlay() {
        var speedmasterOverlay = document.querySelector('.ytp-speedmaster-overlay > *');
        return speedmasterOverlay !== null;
    }

// Define a flag to track whether the overlay has been detected
var overlayDetected = false;

  	// Monitor for changes to the style attribute of the speedmaster overlay's child element
	var speedmasterObserver = new MutationObserver(function (mutationsList) {
		log("Mutation observed.");
		handleMutation(mutationsList);
	});

// Create an observer for changes to the document
var observer = new MutationObserver(function(mutationsList) {
    mutationsList.forEach(function(mutation) {
        if (mutation.type === 'childList' && !overlayDetected) {
            // Check if the speedmaster overlay exists whenever a node is added
            if (checkSpeedmasterOverlay()) {
                log("Speedmaster overlay detected.");
                // Set the flag to true to indicate detection
                overlayDetected = true;
                // Disconnect the observer before handling mutations
                observer.disconnect();
                speedmasterObserver.observe(document.querySelector('.ytp-speedmaster-overlay'), {
			attributes: true,
			subtree: true
		});
            }
        }
    });
});


// Start observing the document
observer.observe(document.documentElement, { childList: true, subtree: true });

    // Function to check playback speed when user interaction occurs
    function handleUserInteraction() {
        log("User interaction detected. Checking playback speed...");
        checkPlaybackSpeed(); // Pass true to indicate reverting should be performed
    }

    // List of event types to listen for
    var eventTypes = ['mousedown', 'touchstart', 'keydown'];

    // Add event listeners for each event type
    eventTypes.forEach(function(eventType) {
        document.addEventListener(eventType, handleUserInteraction);
    });
}

// Call the function to monitor playback speed
monitorPlaybackSpeed();
