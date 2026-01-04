// ==UserScript==
// @name         TurboWarp to Scratch
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds a button on TurboWarp projects that links back to Scratch
// @author       c00lk1dha4k3r1 -- a scratch user
// @match        https://turbowarp.org/*
// @icon         https://scratch.mit.edu/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/499884/TurboWarp%20to%20Scratch.user.js
// @updateURL https://update.greasyfork.org/scripts/499884/TurboWarp%20to%20Scratch.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create the Scratch button
    function createScratchButton() {
        const projectId = window.location.pathname.split('/')[1];
        const scratchUrl = `https://scratch.mit.edu/projects/${projectId}`;

        const button = document.createElement('a');
        button.href = scratchUrl;
        button.innerText = 'Open in Scratch';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.padding = '10px 20px';
        button.style.backgroundColor = '#4d97ff';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.textDecoration = 'none';
        button.style.fontSize = '16px';
        button.style.fontWeight = 'bold';
        button.style.cursor = 'pointer';
        button.style.zIndex = '1000';

        document.body.appendChild(button);
    }

    // Check if the document is fully loaded
    function checkLoaded() {
        if (document.readyState === 'complete') {
            createScratchButton();
        } else {
            window.addEventListener('load', createScratchButton);
        }
    }

    checkLoaded();
})();
