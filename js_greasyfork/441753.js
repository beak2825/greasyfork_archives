// ==UserScript==
// @name         toggle fullscreen
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  try to take over the world!
// @author       You
// @match        https://m.youtube.com/watch*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @require http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/441753/toggle%20fullscreen.user.js
// @updateURL https://update.greasyfork.org/scripts/441753/toggle%20fullscreen.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    $(document).ready(
        function() {

            // get window width height
            var ht = $(window).height();
            var wd = $(window).width();

            window.setTimeout(function(){
                $('.player-placeholder').after(
                    '<div id="blockingdiv" style="width:100%; height:200px; background-color: pink;" ></div>'
                );

                $('#blockingdiv').on('click', function(){


                    // play video
                    window.setTimeout(function(){
                        // Get the element
                        let element = document.querySelector('.ytp-large-play-button');

                        // Create a new 'click' event
                        let clickEvent = new MouseEvent("click", {
                            bubbles: true,
                            cancelable: true,
                            view: window
                        });

                        element.dispatchEvent(clickEvent);
                    }, 1000);


                    // show double tap buttons
                    window.setTimeout(function(){
                        document.querySelector('.player-controls-content').click();
                    }, 2000);


                    // double tap rewind
                    window.setTimeout(function(){
                        // Get the element
                        let seek = document.querySelector('.player-controls-double-tap-to-seek-static-circle');

                        // Create a new 'click' event
                        let clickEvent2 = new MouseEvent("click", {
                            bubbles: true,
                            cancelable: true,
                            view: window
                        });

                        // Function to dispatch the event
                        function doubleTap() {
                            seek.dispatchEvent(clickEvent2);
                            setTimeout(() => {
                                seek.dispatchEvent(clickEvent2);
                            }, 200); // 200ms delay between taps
                        }

                        // Execute the double tap
                        doubleTap();
                    }, 2000);


                    // window.setTimeout(function(){
                    //     $('.fullscreen-icon').find('path').trigger('click');
                    // }, 500);

                });

            }, 1000);





        }
    );

})();