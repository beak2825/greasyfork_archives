// ==UserScript==
// @name         Scratch to TurboWarp
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a button to Scratch projects that links to TurboWarp
// @author       c00lk1dha4k3r -- a scratch user
// @match        https://scratch.mit.edu/projects/*
// @icon         https://www.turbowarp.org/favicon.ico
// @grant        none
// @license GNU
// @downloadURL https://update.greasyfork.org/scripts/499881/Scratch%20to%20TurboWarp.user.js
// @updateURL https://update.greasyfork.org/scripts/499881/Scratch%20to%20TurboWarp.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create the TurboWarp button
    function createTurboWarpButton() {
        const projectId = window.location.pathname.split('/')[2];
        const turboWarpUrl = `https://www.turbowarp.org/${projectId}`;

        const button = document.createElement('a');
        button.href = turboWarpUrl;
        button.innerText = 'Open in TurboWarp';
        button.style.position = 'absolute';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.padding = '10px 20px';
        button.style.backgroundColor = '#ff9500';
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

    // Wait until the page content is fully loaded
    window.addEventListener('load', createTurboWarpButton);
})();
