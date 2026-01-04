// ==UserScript==
// @name         The movie for you
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Embed video from vidsrc.xyz on IMDB pages
// @author       N3ON
// @match        https://m.imdb.com/title/tt*/*
// @match        https://www.imdb.com/title/tt*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/493395/The%20movie%20for%20you.user.js
// @updateURL https://update.greasyfork.org/scripts/493395/The%20movie%20for%20you.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get the movie/series ID from the URL
    const urlParts = window.location.href.split('/');
    const idWithTT = urlParts[urlParts.length - 2]; // Extract the ID with 'tt'

    // Create iframe element
    const iframeElement = document.createElement('iframe');
    iframeElement.src = `https://vidsrc.xyz/embed/${idWithTT}/color-F5C518`;
    iframeElement.width = '100%';
    iframeElement.height = '400px';
    iframeElement.frameBorder = '0';
    iframeElement.allowFullscreen = true;

    // Create buttons with CSS
    const createButton = (text, onClick) => {
        const button = document.createElement('button');
        button.innerText = text;
        button.style.backgroundColor = '#F5C518'; // IMDb yellow
        button.style.color = '#000'; // Black text
        button.style.borderRadius = '5px';
        button.style.marginRight = '10px';
        button.style.height = '50px'; // Set height
        button.style.fontFamily = 'Arial, sans-serif'; // Set font
        button.onclick = onClick;
        return button;
    };

    const hideShowButton = createButton('Hide/Show', () => {
        // Toggle the display of the iframe
        if (iframeElement.style.display === 'none') {
            iframeElement.style.display = 'block';
        } else {
            iframeElement.style.display = 'none';
        }
    });

    const openNewTabButton = createButton('Open in New Tab', () => {
        // Open the video in a new tab
        window.open(iframeElement.src, '_blank');
    });

    // Create container for iframe and buttons
    const container = document.createElement('div');
    container.appendChild(iframeElement);
    container.appendChild(hideShowButton);
    container.appendChild(openNewTabButton);

    // Find the main content area to insert the container
    const mainContent = document.querySelector('body');

    if (mainContent) {
        // Insert the container at the very top of the body
        mainContent.insertBefore(container, mainContent.firstChild);
    }
})();