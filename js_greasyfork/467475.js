// ==UserScript==
// @license MIT
// @name         Reddit r/all Button
// @namespace    http://tampermonkey.net/
// @version      0.1.6-Beta
// @description  Adds a button to go to r/all
// @author       Daniel Vasquez
// @match        https://*.reddit.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467475/Reddit%20rall%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/467475/Reddit%20rall%20Button.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Create a new button
    let button = document.createElement("button");
    button.textContent = "Go to r/all";
    button.style.position = "fixed";
    button.style.top = "6px";
    button.style.right = "10px";
    button.style.zIndex = "999";
    button.style.padding = "10px";
    button.style.backgroundColor = "#FF4500";
    button.style.border = "none";
    button.style.color = "white";
    button.style.borderRadius = "5px";
    button.style.cursor = "pointer";
    button.onclick = function() {
        window.location.href = 'https://www.reddit.com/r/all/';
    };

    // Append button to the body
    document.body.appendChild(button);
})();
