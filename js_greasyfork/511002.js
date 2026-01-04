// ==UserScript==
// @name         YouTube Shorts Cleaner UI (obsolete)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Moves Elements Off The Video To The Side.
// @author       Nate2898
// @match        *://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @license MIT
// @grant        none
// @namespace https://greasyfork.org/en/users/1083698
// @downloadURL https://update.greasyfork.org/scripts/511002/YouTube%20Shorts%20Cleaner%20UI%20%28obsolete%29.user.js
// @updateURL https://update.greasyfork.org/scripts/511002/YouTube%20Shorts%20Cleaner%20UI%20%28obsolete%29.meta.js
// ==/UserScript==
(function() {
    'use strict';

    let lastUrl = location.href;

    //function applies the CSS rules dynamically
    function applyCustomCSS() {
        const customCSS = `
            ytd-reel-video-renderer:not([showing-expanded-overlay]) .overlay.ytd-reel-video-renderer {
                overflow: visible;
            }

            .metadata-container.ytd-reel-player-overlay-renderer {
                position: relative;
                transform: translateX(-100%);
                width:60%;
                top:-60%;
            }
        `;


        const styleSheet = document.createElement("style");

        //Set the inner text of the style element to the custom CSS
        styleSheet.type = "text/css";
        styleSheet.innerText = customCSS;

        //Append the style element to the head of the document
        document.head.appendChild(styleSheet);
    }



    //function to detect URL changes to ensure CSS is applied
    function observeUrlChange() {
        setInterval(() => {
            const currentUrl = location.href;
            if (currentUrl !== lastUrl) {
                lastUrl = currentUrl;
                applyCustomCSS();
            }
        }, 1000); //checks every few secs
    }


    applyCustomCSS();


    observeUrlChange();

})();
