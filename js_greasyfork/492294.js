// ==UserScript==
// @name         lecture-utils
// @namespace    MEDS 201
// @version      1.0
// @description  Only shows the slide player controls and turns the background black
// @author       Ethan Logue
// @match        https://rit4.cipcourses.com/*/lectures/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cipcourses.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492294/lecture-utils.user.js
// @updateURL https://update.greasyfork.org/scripts/492294/lecture-utils.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(function() {
        // custom css rules
        var style = document.createElement('style');

        style.innerHTML = `
            body {
                background-color: #000;
            }

            #Slide_Container, #Slide_Player, #Slide_Container:not(.jp-video-full) #Slide_Player {
                min-height: 0 !important;
                height: 0 !important;
            }

            #slidetitle {
                color: #676767;
            }
        `;

        document.head.appendChild(style);
    }, 2000);

    // TODO: Set volume to 0 and speed to 2x
})();