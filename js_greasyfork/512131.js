// ==UserScript==
// @name         Change Fonts and Styles
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Change all fonts on Claude.ai to Arial and set background color to blue
// @author       Your Name
// @match        https://claude.ai/*
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/512131/Change%20Fonts%20and%20Styles.user.js
// @updateURL https://update.greasyfork.org/scripts/512131/Change%20Fonts%20and%20Styles.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Apply Arial font and background color to the entire document
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
        * {
            font-family: Arial !important;
        }
        *, *:after, *:before {
            --tw-gradient-from-position: none !important;
        }

        .-mb-6 {
            margin-bottom: 0rem !important;
        }

        .bg {
            background-image: linear-gradient(to bottom, hsl(0deg 0% 36.89% / 85%) 0%, hsl(0deg 0% 36.89% / 85%) 0%) !important;
        }
    `;
    document.head.appendChild(style);
})();
