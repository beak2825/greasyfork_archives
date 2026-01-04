// ==UserScript==
// @name         Chaturbate Full Page Video
// @version      1.2
// @description  Display the webcam video over the whole page (without fullscreen), in the correct ratio, with its controls.
// @author       James Koss
// @match        http://xvcams.com/*/
// @supportURL   https://greasyfork.org/en/scripts/29745-chaturbate-full-page-video/feedback
// @run-at       document-start
// @namespace http://www.JamesKoss.com/
// @downloadURL https://update.greasyfork.org/scripts/373442/Chaturbate%20Full%20Page%20Video.user.js
// @updateURL https://update.greasyfork.org/scripts/373442/Chaturbate%20Full%20Page%20Video.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var vidHolder = null;
    var vid = null;
    var ratio;
    var first = true;
    var mode = true; // true is full page, false is normal.
    var resizeLimit = false;
    var hasVideo = true; // false if no video source, because stream blocked for any reason.

    // Should run after page has loaded entirely.
    // DOMContentLoaded
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
            // Toggle full page video in toggled mode.
            mode = !mode;
            resizeVideo();
        });

        // Start by default. Delay.
        if (mode === true) setTimeout(function () { resizeVideo(); }, 1000);
    }, false);

    function resizeVideo() {
        // Used for video element ratio sizing.
        vidHolder = document.getElementById("still_video2");
        // Actual video element repositioned over page,
        // if video source available.
        if (hasVideo) {
            vid = document.getElementById("still_video_container");
        }

        // Ignore unmatching pages.
        if (vidHolder === null) return;

        // Wait for loading.
        if (vid === null) {
            setTimeout(function() { resizeVideo(); }, 1000);
            return;
        }

        // Restore video size.
        if (!mode) {
            vid.style.position = "";
            vid.style.top = "";
            vid.style.left = "";
            vid.style.width = "";
            document.getElementById("blackCover").style.display = "none";
            document.body.style.overflow = "";
            return;
        }

        // Place over full page.
        // Element is already set as 100% height and width.
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
        if (first === true) {
            var d = document.createElement("div");
            d.id = "blackCover";
            d.style.backgroundColor = "black";
            d.style.zIndex = 998;
            d.style.position = "fixed";
            d.style.top = 0;
            d.style.left = 0;
            d.style.width = "100%";
            d.style.height = "100%";
            document.body.appendChild(d);
            first = false;
        }
        document.getElementById("blackCover").style.display = "";
    }

    // On window resized, match video ration.
    window.addEventListener('resize', function() {
        // Script must be ready.
        if (vid === null) return;
        // Update sizes.
        if (!resizeLimit) {
            resizeLimit = true;
            setTimeout(function() {
                resizeVideo();
                resizeLimit = false;
            }, 500);
        }
    }, true);

    // Check continuously to see if stream is up again.
    window.setInterval(function() {
        // Display div for private show if vid is empty.
        let vidSrc = document.getElementById("still_video_object_html5_api");
        if (hasVideo && vidSrc.children[0] && !vidSrc.children[0].getAttribute('src')) {
            // Text info element, such as "private show."
            vid = document.getElementById("player_text_container");
            hasVideo = false;
            resizeVideo();
        } else if (!hasVideo) {
            hasVideo = true;
            resizeVideo();
        }
    }, 1000)
})();