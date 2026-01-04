// ==UserScript==
// @name         Goofy YouTube meme Mode
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Adds funny animations and modifications to YouTube.
// @author       sabit
// @match        https://www.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/467751/Goofy%20YouTube%20meme%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/467751/Goofy%20YouTube%20meme%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add CSS styles for funny animations and modifications
    var styles = `
        /* Add funny modifications to YouTube */
        body {
            background-color: #ffff00 !important;
            font-family: 'Comic Sans MS', cursive !important;
        }

        /* Make video titles move in random directions */
        #video-title {
            animation: move 2s linear infinite;
        }

        @keyframes move {
            0% {
                transform: translate(0, 0);
            }
            25% {
                transform: translate(10px, 10px);
            }
            50% {
                transform: translate(-10px, -10px);
            }
            75% {
                transform: translate(-10px, 10px);
            }
            100% {
                transform: translate(10px, -10px);
            }
        }

        /* Make video thumbnails spin in random directions */
        .ytd-thumbnail {
            animation: spin 2s linear infinite;
        }

        @keyframes spin {
            0% {
                transform: rotate(0deg);
            }
            25% {
                transform: rotate(90deg);
            }
            50% {
                transform: rotate(180deg);
            }
            75% {
                transform: rotate(270deg);
            }
            100% {
                transform: rotate(360deg);
            }
        }

        /* Make comments grow and shrink */
        .comment-renderer-text-content {
            animation: pulse 1s ease-in-out infinite;
        }

        @keyframes pulse {
            0% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.2);
            }
            100% {
                transform: scale(1);
            }
        }

        /* Make subtitles rotate */
        .ytp-caption-segment {
            animation: rotate 2s linear infinite;
        }

        @keyframes rotate {
            0% {
                transform: rotate(0deg);
            }
            100% {
                transform: rotate(360deg);
            }
        }

        /* Make buttons wiggle */
        .yt-icon-button {
            animation: wiggle 1s ease-in-out infinite;
        }

        @keyframes wiggle {
            0% {
                transform: rotate(0deg);
            }
            25% {
                transform: rotate(5deg);
            }
            50% {
                transform: rotate(-5deg);
            }
            75% {
                transform: rotate(5deg);
            }
            100% {
                transform: rotate(0deg);
            }
        }

        /* Make text inputs shake */
        input[type="text"], input[type="search"], textarea {
            animation: shake 0.5s linear infinite;
        }

        @keyframes shake {
            0% {
                transform: translateX(0);
            }
            25% {
                transform: translateX(-10px);
            }
            75% {
                transform: translateX(10px);
            }
            100% {
                transform: translateX(0);
            }
        }

        /* Make the page blink */
        @keyframes blink {
            0% {
                visibility: visible;
            }
            50% {
                visibility: hidden;
            }
            100% {
                visibility: visible;
            }
        }

        /* Apply the blink animation to the page */
        body {
            animation: blink 1s infinite;
        }

        /* Make the page flip */
        @keyframes flip {
            0% {
                transform: scaleX(1);
            }
            50% {
                transform: scaleX(-1);
            }
            100% {
                transform: scaleX(1);
            }
        }

        /* Apply the flip animation to the page */
        body {
            animation: flip 3s infinite;
        }

        /* Make the page shake */
        @keyframes shakePage {
            0% {
                transform: translate(0);
            }
            25% {
                transform: translate(-5px, 0);
            }
            50% {
                transform: translate(5px, 0);
            }
            75% {
                transform: translate(-5px, 0);
            }
            100% {
                transform: translate(0);
            }
        }

        /* Apply the shakePage animation to the page */
        body {
            animation: shakePage 1s linear infinite;
        }
    `;

    var styleSheet = document.createElement('style');
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
})();
