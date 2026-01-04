// ==UserScript==
// @name         Youtube - Random Fixes
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Tweak some stuff (like the volume slider) that messes up when you use Chrome's Dark Theme and some other neat features
// @author       Threeskimo
// @match        *://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/455111/Youtube%20-%20Random%20Fixes.user.js
// @updateURL https://update.greasyfork.org/scripts/455111/Youtube%20-%20Random%20Fixes.meta.js
// ==/UserScript==

// ========================================================================================================================================
// Add total Time to Watch Later Playlist
// ========================================================================================================================================

var dostuff = function() {

    // Find the second div w/ specific class to get the video playlist header
    //[OLD]let headerDiv = document.querySelectorAll('div.header.style-scope.ytd-playlist-panel-renderer')[2];
    //[NEW]let headerDiv = document.getElementById('header-contents');
    //console.log(headerDiv);

    // Find the div with the word lock badge + "Private"
    //let messageSpan = headerDiv.querySelector('div.badge.badge-style-type-medium-grey.style-scope.ytd-badge-supported-renderer');
    let messageSpan = document.querySelector('div#content.style-scope.ytd-app ytd-page-manager#page-manager.style-scope.ytd-app ytd-watch-flexy.style-scope.ytd-page-manager.watch-root-element.hide-skeleton div#columns.style-scope.ytd-watch-flexy div#secondary.style-scope.ytd-watch-flexy div#secondary-inner.style-scope.ytd-watch-flexy ytd-playlist-panel-renderer#playlist.style-scope.ytd-watch-flexy div#container.style-scope.ytd-playlist-panel-renderer div.header.style-scope.ytd-playlist-panel-renderer div#header-contents.style-scope.ytd-playlist-panel-renderer div#header-top-row.style-scope.ytd-playlist-panel-renderer div#header-description.style-scope.ytd-playlist-panel-renderer div#publisher-container.style-scope.ytd-playlist-panel-renderer ytd-badge-supported-renderer.style-scope.ytd-playlist-panel-renderer div.badge-shape.style-scope.ytd-badge-supported-renderer');
    console.log(messageSpan);

    // Find the div with the playlist
    //const itemsDiv = document.querySelectorAll('div.playlist-items.style-scope.ytd-playlist-panel-renderer')[1];
    const itemsDiv = document.querySelectorAll('div.playlist-items.style-scope.ytd-playlist-panel-renderer')[0];
    console.log(itemsDiv);

    // Find all the elements with the specified class name
    const timeElements = itemsDiv.querySelectorAll('.yt-badge-shape__text');
    console.log(timeElements);

    // Initialize total time to 0
    let totalTime = 0;
    // Loop through all the time elements and add up the total time
    timeElements.forEach((timeElement) => {
        // Get the time value from the element's text content
        const timeValue = timeElement.textContent.trim();
        //console.log(timeValue);

        //Skip any "UPCOMING" videos that may have been added to the "Watch Later" playlist
        if (timeValue != "UPCOMING") {
            // Split the time value into hours, minutes and seconds (or just minutes and seconds if no hours are present)
            var [hours = 0, minutes, seconds] = timeValue.split(':').map(Number);

            //Determine if looking at a 00:00 time
            if (isNaN(seconds)) {
                //set seconds to bad minutes time
                seconds = minutes;
                //set minutes to bad hours time
                minutes = hours;
                //set hours to 0 since there are no hours in a 00:00 time
                hours = 0;
            }

            // Calculate the total time in seconds
            totalTime += hours * 60 * 60 + minutes * 60 + seconds;
            //console.log(totalTime);
        }
    });

    // Convert the total time to hours, minutes and seconds
    const totalHours = Math.floor(totalTime / 3600);
    const totalMinutes = Math.floor(totalTime % 3600 / 60);
    const totalSeconds = totalTime % 60;

    // Create a new span to hold the total time message
    const totalTimeSpan = document.createElement('span');
    totalTimeSpan.textContent = `\xa0\xa0\xa0\xa0 [${totalHours}:${String(totalMinutes).padStart(2, '0')}:${String(totalSeconds).padStart(2, '0')}] \xa0\xa0\xa0\xa0`;

    // Remove any previous total time span
    const previousTotalTimeSpan = messageSpan.parentNode.querySelector('span.total-time');
    if (previousTotalTimeSpan) {
        previousTotalTimeSpan.remove();
    }

    // Add a class to the total time span
    totalTimeSpan.classList.add('total-time');
    totalTimeSpan.style.color = 'white';

    // Append the total time message to the message span inside the header div
    messageSpan.parentNode.appendChild(totalTimeSpan);
};

// Call function every 5 seconds
setInterval(dostuff, 5000);


// ========================================================================================================================================
// Styling Updates
// ========================================================================================================================================

//Append styling for red volume slider and tracker dot in HEAD tag
//And make the playlist DIV resizable
$('head').append('<style>div.ytp-volume-slider-handle:before{background:red !important;} div.ytp-volume-slider-handle{background:red !important;} #items {resize: vertical; overflow:auto;} </style>');

// ========================================================================================================================================
// Show the time left in the video at current video new speed
// ========================================================================================================================================

//When using Shift + , or . to change playback speed, show the time left in the video at the new speed. (If you get to youtube from your Sub page (etc.), you may have to refresh when you watching a video so this script functions)

//Change the var below to the correct selector path for the div that shows playback speed when something messes up. (F12 > Right click DIV w/ class "ytp-bezel-text" > Copy > CSS selector)
const divwrapper = '.ytp-bezel-text';

const targetNode = document.querySelector('.ytp-bezel-text');
const observer = new MutationObserver((mutationsList) => {
  for (let mutation of mutationsList) {
    if (mutation.type === 'childList' || mutation.type === 'characterData') {

        console.log('Speed changed:', targetNode.textContent);

        //Grab the playback speed (ie. 1.5x) when the user changes the playback speed
        var text = $(divwrapper).text();
        //Remove the "x" in the speed (ie. 1.5x -> 1.5)
        var speed = text.slice(0, -1);

        //Sometimes the script grabs null values, let's make sure we don't act on the nulls.
        if (!speed) {
            //Do Nothing if speed is null
        } else {
            //Grab total playtime and currenttime of the video
            var playTime = $('.ytp-time-duration').text();
            var currentTime = $('.ytp-time-current').text();

            //Convert both playTime and currentTime to seconds
            var a = playTime.split(':'); // split it at the colons
            if (typeof a[2] === "undefined") { a[2] = a[1]; a[1] = a[0]; a[0] = 0;} // if video is less than hour (ie. 10m30s), hours will be undefined, therefore re-arrange split so that hours = 0 (ie. 0h10m30s)
            var PTseconds = (((a[0]) * 60) * 60) + (a[1]*60) + (a[2]*1); // calc time in seconds

            var b = currentTime.split(':'); // split it at the colons
            if (typeof b[2] === "undefined") { b[2] = b[1]; b[1] = b[0]; b[0] = 0;} // if video is less than hour (ie. 10m30s), hours will be undefined, therefore re-arrange split so that hours = 0 (ie. 0h10m30s)
            var CTseconds = (((b[0]) * 60) * 60) + (b[1]*60) + (b[2]*1); // calc time in seconds

            //Subtract currentTime from playTime to get timeLeft
            var timeLeft = PTseconds - CTseconds;

            //Divide it by Speed to show how much time is left at the current speed (in seconds)
            currentTimeLeftSeconds = timeLeft/speed;

            //Convert this back to 00:00:00 format
            var date = new Date(null);
            date.setSeconds(currentTimeLeftSeconds);
            var result = date.toISOString().substr(11, 8);

            //Apend the timeleft at current speed (result) to the speed pop-up div (and write to console too for debugging purposes)
            $(divwrapper).append("<br>("+result+")");
        }


    }
  }
});

observer.observe(targetNode, { childList: true, characterData: true, subtree: true });

// ========================================================================================================================================
// Shift+Arrow keys moves ahead and back by 1 minutes (instead of 10 seconds)
// ========================================================================================================================================

(function() {
    'use strict';

    var arrowPressed = {
        right: false,
        left: false
    };

    // Define key presses that will be used to display the current playback speed to be used in the functions below
    document.addEventListener('keydown', function(event) {
        if (event.shiftKey) {
            if (event.keyCode === 39) { // Shift+Right Arrow
                event.preventDefault(); // Prevent default behavior
                if (!arrowPressed.right) {
                    arrowPressed.right = true;
                    //Grab the playback speed and see if we need to press arrow 5 times (for 2x speed, since it forward 10s) or 11 times (for anything else, since it forwards only 5s)
                    var ytp = $(divwrapper).text();
                    var findX = ytp.indexOf("x");
                    var ytpp = ytp.substring(0, findX); // Take characters up to "x"
                    //var ytpp = ytp.substring(0, 2); // Take the first 2 characters
                    if (ytpp == "2") {
                        simulateKeyPress(39, 5); // Trigger Arrow key  (plus the actual key press for 6 total)
                    } else if (ytpp == "1") {
                        simulateKeyPress(39, 11); // Trigger Arrow key  (plus the actual key press for 12 total)
                    } else if (ytpp == "1.25") {
                        simulateKeyPress(39, 9); // Trigger  Arrow key  (plus the actual key press for 10 total)
                    } else if (ytpp == "1.5") {
                        simulateKeyPress(39, 7); // Trigger Arrow key  (plus the actual key press for 8 total)
                    } else if (ytpp == "1.75") {
                        simulateKeyPress(39, 6); // Trigger Arrow key  (plus the actual key press for 7 total)
                    } else {
                        simulateKeyPress(39, 7); // Pretend we're at 1.5
                    }
                }
            } else if (event.keyCode === 37) { // Shift+Left Arrow
                event.preventDefault(); // Prevent default behavior

                if (!arrowPressed.left) {
                    arrowPressed.left = true;
                    //Grab the playback speed and see if we need to press arrow 5 times (for 2x speed, since it forward 10s) or 11 times (for anything else, since it forwards only 5s)
                    var ytp = $(divwrapper).text();
                    var findX = ytp.indexOf("x");
                    var ytpp = ytp.substring(0, findX); // Take characters up to "x"
                    // var ytpp = ytp.substring(0, 2); // Take the first 2 characters
                    if (ytpp == "2") {
                        simulateKeyPress(37, 5); // Trigger Arrow key  (plus the actual key press for 6 total)
                    } else if (ytpp == "1") {
                        simulateKeyPress(37, 11); // Trigger Arrow key  (plus the actual key press for 12 total)
                    } else if (ytpp == "1.25") {
                        simulateKeyPress(37, 9); // Trigger  Arrow key  (plus the actual key press for 10 total)
                    } else if (ytpp == "1.5") {
                        simulateKeyPress(37, 7); // Trigger Arrow key  (plus the actual key press for 8 total)
                    } else if (ytpp == "1.75") {
                        simulateKeyPress(37, 6); // Trigger Arrow key  (plus the actual key press for 7 total)
                    } else {
                        simulateKeyPress(37, 7); // Pretend we're at 1.5
                    }
                }
            }
        }
    });

    // When releasing the arrow keys, set arrowPressed var to false
    document.addEventListener('keyup', function(event) {
        if (event.keyCode === 39) { // Right Arrow
            arrowPressed.right = false;
        } else if (event.keyCode === 37) { // Left Arrow
            arrowPressed.left = false;
        }
    });

    // Function to simulate a key press
    function simulateKeyPress(keyCode, times) {
        var event = new KeyboardEvent('keydown', { 'keyCode': keyCode });

        for (var i = 0; i < times; i++) {
            document.dispatchEvent(event);
        }
    }

})();