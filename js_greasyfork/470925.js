// ==UserScript==
// @name         Go Glitch Edit Page
// @namespace    GoGlitchEditPage
// @version      1.0.4
// @description  Go Glitch Edit Page!
// @author       Runterya
// @homepage     https://github.com/Runteryaa
// @match        *://*.glitch.me/*
// @grant        none
// @license      MIT
// @compatible   chrome
// @compatible   edge
// @compatible   firefox
// @compatible   opera
// @compatible   safari
// @downloadURL https://update.greasyfork.org/scripts/470925/Go%20Glitch%20Edit%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/470925/Go%20Glitch%20Edit%20Page.meta.js
// ==/UserScript==

// Add a button to the top right corner of the page that redirects to the Glitch editor.
(function() {
    'use strict';

    // Check if the current domain is "glitch.me"
    if (window.location.hostname.endsWith("glitch.me")) {
        // Create the GEP button
        var gepButton = document.createElement('button');
        gepButton.innerHTML = 'GEP';
        gepButton.title = 'Go Glitch Edit Page';
        gepButton.style.position = 'fixed';
        gepButton.style.top = '3px';
        gepButton.style.right = '3px';
        gepButton.style.zIndex = '9999';
        gepButton.style.fontSize = '10px';
        gepButton.style.padding = '.5px 1px';

        // Add an event listener to redirect on button click
        gepButton.addEventListener('click', function() {
            var projectName = window.location.hostname.split('.')[0];
            var redirectUrl = 'https://glitch.com/edit/#!/' + projectName;
            window.location.href = redirectUrl;
        });

        // Append the button to the body
        document.body.appendChild(gepButton);
    }

    // Loaded
    console.log("Go Glitch Edit Page");
})();