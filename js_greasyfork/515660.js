// ==UserScript==
// @name         YouTube with Material Design Lite
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Replace YouTube's CSS with Material Design Lite styling
// @match        *://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/515660/YouTube%20with%20Material%20Design%20Lite.user.js
// @updateURL https://update.greasyfork.org/scripts/515660/YouTube%20with%20Material%20Design%20Lite.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Remove all existing stylesheets in the <head> element
    const head = document.head || document.getElementsByTagName('head')[0];
    const links = head.querySelectorAll('link[rel="stylesheet"], style');

    links.forEach(link => link.remove());

    // Import Material Design Lite CSS and Google Fonts
    const mdlLink = document.createElement('link');
    mdlLink.rel = 'stylesheet';
    mdlLink.href = 'https://code.getmdl.io/1.3.0/material.indigo-pink.min.css';
    head.appendChild(mdlLink);

    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700';
    head.appendChild(fontLink);

    // Additional custom styles to align with Material Design
    const style = document.createElement('style');
    style.textContent = `
        /* Root variables for custom elements */
        :root {
            --showRtcConnectionStatusIcon: block;
            --jumboEmojiSize: 2rem;
        }

        /* Apply Roboto font */
        body {
            font-family: 'Roboto', sans-serif;
        }

        /* Example styling for YouTube elements */
        .youtube-header {
            background-color: #3f51b5; /* Material Indigo */
            color: white;
            padding: 10px;
        }

        .youtube-content {
            margin: 20px;
            padding: 10px;
            background-color: #ffffff;
            border-radius: 4px;
            box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
        }

        /* Material Design for buttons */
        .yt-button {
            font-size: 16px;
            color: #fff;
            background-color: #ff4081;
            padding: 10px 20px;
            text-transform: uppercase;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }

        /* Resize jumbo emojis */
        .jumbo-emoji {
            font-size: var(--jumboEmojiSize);
        }

        /* Hide or adjust other elements as necessary */
    `;
    head.appendChild(style);

})();
