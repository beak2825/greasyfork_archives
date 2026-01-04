// ==UserScript==
// @name            Hide watched Youtube Videos
// @namespace       SomeYoutubeFan
// @version         0.0.1
// @description     When viewing a playlist or channel, hide videos with a progress bar showing you have previously opened the video. Also hide videos that require payment to watch.
// @author          Some youtube fan
// @license MIT
// @match           https://www.youtube.com/*list=*
// @match           https://www.youtube.com/*@*/videos
// @match           https://www.youtube.com/*@*/streams
// @exclude         https://*PL2kLQQ3EnVhBv8jD2sUh75GlrfBY0qJAz
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/484467/Hide%20watched%20Youtube%20Videos.user.js
// @updateURL https://update.greasyfork.org/scripts/484467/Hide%20watched%20Youtube%20Videos.meta.js
// ==/UserScript==

(() => {
	"use strict";

	const requiredRegexes = [
        /\d.:\d./i,
	];


    function clearWatchedInDiv(contentDiv) {

        var counter = 0;

        var prevDiv = null;

        // This is for playlists
        contentDiv.querySelectorAll("ytd-playlist-video-renderer").forEach(videoDiv => {
            if(prevDiv) {
                prevDiv.style.display = 'none';
            }
            if(videoDiv.querySelector("ytd-thumbnail-overlay-resume-playback-renderer, .badge-style-type-members-only, .badge-style-type-ypc")) {
                // Found a progress bar!
                // console.log("Div #" + counter + " has progress bar or wants payment and will be removed (unless it is last)")
                prevDiv = videoDiv;
            } else {

                // console.log("Div #" + counter + " does not have a progress bar or want payment and will remain")
            }
            counter++;

        });

        // This is for channels (currently paid videos don't show here, so I don't need to remove them)
        contentDiv.querySelectorAll("ytd-rich-grid-row").forEach(gridDiv => {
            if(prevDiv) {
                prevDiv.style.display = 'none';
            }
            var allHaveProgressBars = true;
            gridDiv.querySelectorAll("ytd-rich-grid-media").forEach(videoDiv => {

                if(videoDiv.querySelector("ytd-thumbnail-overlay-resume-playback-renderer")) {
                    // Found a progress bar!
                } else {
                    allHaveProgressBars = false;
                }
            });
            if(allHaveProgressBars) {
                // console.log("Grid #" + counter + " has only videos with progress bars and can be removed (unless it is last)")
                prevDiv = gridDiv;
            } else {
                // console.log("Grid #" + counter + " has at least one video without a progress bar and will remain")
            }

            counter++;

        });

    }

	// Wait for the content to load.
	const interval = setInterval(() => {

        var foundContent = false;
        var divCount = 0;
        document.querySelectorAll("div.ytd-playlist-video-list-renderer, div.ytd-rich-grid-renderer").forEach(contentDiv => {
            foundContent = true;
            clearInterval(interval);

            divCount++;
            clearWatchedInDiv(contentDiv);

            new MutationObserver(() => {
                clearWatchedInDiv(contentDiv);
            }).observe(contentDiv, { childList: true, subtree: true });
       });
       if(!foundContent) {
           // console.log("Content not loaded yet")
       }
	}, 1000);

})();