// ==UserScript==
// @name         autoplay and rewind - fix stutter jjj66
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  force auto open in new tab
// @author       You
// @match      https://m.youtube.com/watch*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @require http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/492444/autoplay%20and%20rewind%20-%20fix%20stutter%20jjj66.user.js
// @updateURL https://update.greasyfork.org/scripts/492444/autoplay%20and%20rewind%20-%20fix%20stutter%20jjj66.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...\
    $(document).ready(
        function() {

            window.setTimeout(function(){
                // Get the element
                let element = document.querySelector('.ytp-unmute-icon');

                // Create a new 'click' event
                let clickEvent = new MouseEvent("click", {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });

                element.dispatchEvent(clickEvent);
            }, 1000);

            window.setTimeout(function(){
                // Get the element
                let element = document.querySelector('.player-controls-content');

                // Create a new 'click' event
                let clickEvent = new MouseEvent("click", {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });

                element.dispatchEvent(clickEvent);
            }, 2000);


            window.setTimeout(function(){
                // Get the element
                let element = document.querySelector('.player-controls-double-tap-to-seek-static-circle');

                // Create a new 'click' event
                let clickEvent = new MouseEvent("click", {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });

                // Function to dispatch the event
                function doubleTap() {
                    element.dispatchEvent(clickEvent);
                    setTimeout(() => {
                        element.dispatchEvent(clickEvent);
                    }, 200); // 200ms delay between taps
                }

                // Execute the double tap
                doubleTap();
            }, 2000);

        }
    );
})();