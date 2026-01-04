// ==UserScript==
// @name         YouTube Custom Material Design Style
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Apply Material Design Lite styling to YouTube
// @match        *://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/515658/YouTube%20Custom%20Material%20Design%20Style.user.js
// @updateURL https://update.greasyfork.org/scripts/515658/YouTube%20Custom%20Material%20Design%20Style.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add custom styles to the document
    const style = document.createElement('style');
    style.textContent = `
        /* Import Material Design Lite CSS and Roboto Font */
        @import url('https://code.getmdl.io/1.3.0/material.indigo-pink.min.css');
        @import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500,700');

        /* Root variables */
        :root {
            --showRtcConnectionStatusIcon: block; /* Show video call ping/status icon */
            --jumboEmojiSize: 2rem; /* Old size: 2rem | New size: 3rem */
        }

        /* Example Material Design Lite styles */
        body {
            font-family: 'Roboto', sans-serif;
        }

        /* Resize jumbo emojis */
        .jumbo-emoji {
            font-size: var(--jumboEmojiSize);
        }

        /* Other custom styles can be added here */
    `;
    document.head.appendChild(style);
})();
