// ==UserScript==
// @name         YouTube Player with Red Progress Bar and No Gradients
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Customize YouTube player on watch page to remove gradients and keep a solid red progress bar
// @author       GPT
// @match        https://www.youtube.com/watch*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/515507/YouTube%20Player%20with%20Red%20Progress%20Bar%20and%20No%20Gradients.user.js
// @updateURL https://update.greasyfork.org/scripts/515507/YouTube%20Player%20with%20Red%20Progress%20Bar%20and%20No%20Gradients.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Apply custom CSS styling to modify the YouTube player appearance
    GM_addStyle(`
        /* Remove gradients from the progress bar */
        .ytp-swatch-background-color, 
        .ytp-progress-bar-container, 
        .ytp-progress-bar-padding {
            background: transparent !important;
        }

        /* Set progress bar to solid red */
        .ytp-play-progress {
            background-color: #FF0000 !important;
            background-image: none !important;
        }

        /* Additional customization to minimize gradients on controls */
        .ytp-chrome-top, 
        .ytp-chrome-controls, 
        .ytp-gradient-bottom, 
        .ytp-gradient-top, 
        .ytp-chrome-bottom {
            background: none !important;
        }
    `);

    console.log("Custom YouTube player styling applied: solid red progress bar, no gradients.");

})();
