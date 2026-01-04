// ==UserScript==
// @name         YT_Toggle_Video_Overlay
// @description  Toggle the visibility of Title and Playback on Youtube
// @version      1.0

// @author       Fiesty-Cushion
// @match        https://www.youtube.com/*
// @run-at       document-start
// @license      N/A

// @namespace    https://google.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494761/YT_Toggle_Video_Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/494761/YT_Toggle_Video_Overlay.meta.js
// ==/UserScript==

/*
    Author: Fiesty-Cushion
*/

(function() {
    'use strict';

    document.addEventListener("keydown", (event) => {
        const keyName = event.key;

        if (keyName === "Control") {
            // do not alert when only Control key is pressed.
            return;
        }

        if (event.ctrlKey && keyName === "z") {
            // hide the contents when ctrl + z pressed
            const videoTitle = document.querySelector(".ytp-chrome-top");
            const progressBar = document.querySelector(".ytp-chrome-bottom");

            if (
                videoTitle.style.visibility === "hidden" ||
                progressBar.style.visibility === "hidden"
            ) {
                videoTitle.style.visibility = "visible";
                progressBar.style.visibility = "visible";

                return;
            }

            videoTitle.style.visibility = "hidden";
            progressBar.style.visibility = "hidden";
        }
    });

})();