// ==UserScript==
// @name         ReScene narrowed
// @version      0.1
// @description  Center, width, color
// @author       ChatGPT
// @match        http://rescene.wikidot.com/*
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/users/766635
// @downloadURL https://update.greasyfork.org/scripts/488476/ReScene%20narrowed.user.js
// @updateURL https://update.greasyfork.org/scripts/488476/ReScene%20narrowed.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add custom CSS styles
    let customStyles = `
        body {
        	max-width: 95em;
        	margin: 0 auto; /* Center the body horizontally */
        }

        #container-wrap{
        	background-color:#e6e6f2;

        }
    `;

    // Create style element and append to head
    let styleElement = document.createElement('style');
    styleElement.innerHTML = customStyles;
    document.head.appendChild(styleElement);
})();