// ==UserScript==
// @name         Chaturbate Full Page Video
// @version      1.30
// @description  Display the webcam video over the whole page (without fullscreen), in the correct ratio, with its controls.
// @author       James Koss
// @match        https://chaturbate.com/*/
// @supportURL   https://greasyfork.org/en/scripts/29745-chaturbate-full-page-video/feedback
// @run-at       document-start
// @namespace    http://www.JamesKoss.com/
// @downloadURL https://update.greasyfork.org/scripts/29745/Chaturbate%20Full%20Page%20Video.user.js
// @updateURL https://update.greasyfork.org/scripts/29745/Chaturbate%20Full%20Page%20Video.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var vidElement = null;
    var vidHolder = null;
    var vid = null;
    var ratio;
    var maximized = true; // true is full page, false is normal.
    var resizeLimit = false;
    var hasVideo = true; // false if no video source, because stream blocked for any reason.

    function startTimer() {
        // Start the timer on load. Keep trying to detect the video element.
        var timer = setInterval(function() {
            try {
                // Only when page has focus, so it can act.
                if (!document.hasFocus()) return;

                vidElement = document.querySelector('video[autoplay]');

                // Used for video element ratio sizing.
                vidHolder = vidElement.parentNode.parentNode;

                // Video element parent to display over the full page.
                vid = vidElement.parentNode;

                // Must have a src to continue.
                if (vid.src === "") return;

                // Show controls always.
                vidElement.controls = true;

                // Start maximized.
                //console.log('called from var timer = setInterval(function')
                resizeVideo();

                // Track if video goes offline.
                videoDown();

                console.log('[Chaturbate Full Page Video] Video found!'); // maximized: ' + maximized);

                // Stop timer.
                clearInterval(timer);
            } catch(e) {
                //console.log('[Chaturbate Full Page Video] Cant find video: ' + e);
                //console.log(e);
            }
        }, 1000);
    }

    function videoDown() {
        // Check continuously to see if stream is down.
        setInterval(function() {
            // Only when page has focus, so it can act.
            if (!document.hasFocus()) return;

            let vidSrc = document.querySelector('video[autoplay]');

            if (vidSrc) {
                if (maximized) {
                    if (vidSrc.src === "") {
                        hasVideo = false;
                        maximized = false;

                        //console.log('called from window.setInterval(function')
                        resizeVideo();
                    }
                }
            }
        }, 1000);
    }

    document.addEventListener('DOMContentLoaded', function() {
        // Add toggle button for script.
        var toggle = document.createElement("div");

        toggle.style.color = "black";
        toggle.style.backgroundColor = "white";
        toggle.style.borderRadius = "100px";
        toggle.style.border = "1px solid pink";
        toggle.style.zIndex = 999999;
        toggle.style.position = "fixed";
        toggle.style.top = 0;
        toggle.style.right = 0;
        toggle.style.cursor = "pointer";
        toggle.style['user-select'] = 'none';
        toggle.style.width = "30px";
        toggle.style.height = "30px";
        toggle.style.margin = "4px";
        toggle.style.textAlign = "center";
        toggle.style.verticalAlign = "middle";
        toggle.style.lineHeight = "30px";
        toggle.style.fontSize = "30px";
        toggle.innerHTML = "☩";
        document.body.appendChild(toggle);

        toggle.addEventListener('mouseover', function(e) {
            toggle.style.opacity = "0.9";
        });

        toggle.addEventListener('mouseout', function(e) {
            toggle.style.opacity = "1.0";
        });

        toggle.addEventListener('click', function(e) {
            // Left click only.
            if (e.which !== 1) return;
            // Toggle full page video.
            maximized = !maximized;
            //console.log('called from toggle.addEventListener(click')
            resizeVideo();
        });

        // Create background cover element.
        var d = document.createElement("div");
        d.id = "blackCover";
        d.style.backgroundColor = "black";
        d.style.zIndex = 998;
        d.style.position = "fixed";
        d.style.top = 0;
        d.style.left = 0;
        d.style.width = "100%";
        d.style.height = "100%";
        d.style.display = "none";
        document.body.appendChild(d);

        startTimer();

        // On window resized, match video ratio.
        window.addEventListener('resize', function() {
            // Script must be ready.
            if (!vid) return;

            // Update sizes.
            if (!resizeLimit) {
                resizeLimit = true;
                setTimeout(function() {
                    //console.log('called from window.addEventListener(resize,')
                    resizeVideo();
                    resizeLimit = false;
                }, 500);
            }
        }, true);
    }, false);

    function resizeVideo() {
        let blackCover = document.getElementById("blackCover");

        // Restore video size.
        if (!maximized && vid && blackCover) {
            vid.style.position = "relative";
            vid.style.top = "";
            vid.style.left = "";
            vid.style.width = "100%";
            vid.style.height = "100%";
            blackCover.style.display = "none";
            document.body.style.overflow = "";
            return;
        }

        // Place over full page.
        vid.style.position = "fixed";
        vid.style.zIndex = 999;
        vid.style.top = 0;
        vid.style.left = 0;
        vid.style.width = "100%";
        vid.style.height = "100%";

        // Keep width ratio.
        if (!ratio) {
            ratio = vidHolder.clientWidth / vidHolder.clientHeight;
        }

        var wWidth = window.innerWidth;
        var wHeight = window.innerHeight;

        vid.style.height = "100% !important";
        vid.style.top = 0;

        var correctWidth = vid.clientHeight * ratio;
        var correctMarginLeft = (wWidth - correctWidth) / 2;

        vid.style.width = correctWidth + 'px';
        vid.style.left = correctMarginLeft + 'px';

        // Decrease height if window less wide than video.
        if (correctMarginLeft < 1) {
            vid.style.width = "100%";
            vid.style.left = 0;

            var correctHeight = vid.clientWidth / ratio;
            var correctMarginTop = (wHeight - correctHeight) / 2;

            vid.style.height = correctHeight + "px";
            vid.style.top = correctMarginTop + 'px';
        }

        // Hide scrollbars in body.
        document.body.style.overflow = "hidden";

        // Hide background elements.
        blackCover.style.display = "";
    }
})();