// ==UserScript==
// @name         Comick Dark Mode Enhancer
// @namespace    https://github.com/GooglyBlox
// @version      1.1
// @description  Simplifies the dark mode on Comick.dev
// @author       GooglyBlox
// @match        https://comick.dev/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539869/Comick%20Dark%20Mode%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/539869/Comick%20Dark%20Mode%20Enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const BG = '#1a1a1a';
    const style = document.createElement('style');
    style.id = 'comick-dark-enhancer';
    style.textContent = `
        html.dark, body.dark,
        .dark [class*="bg-gray-800"],
        .dark header,
        .dark #navbar,
        .dark #comment-section,
        .dark .comic-desc,
        .dark ul.scrollbox,
        .dark div.scrollbox {
            background-color: ${BG} !important;
            background: ${BG} !important;
        }
    `;
    document.head.append(style);
})();
