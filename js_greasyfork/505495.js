// ==UserScript==
// @name        More space for titles on hianime.to
// @namespace   Violentmonkey Scripts
// @match       https://hianime.to/*
// @grant       none
// @version     1.0
// @author      Kozinc
// @license     MIT
// @description Adds a custom CSS style to the anime list elements.
// @downloadURL https://update.greasyfork.org/scripts/505495/More%20space%20for%20titles%20on%20hianimeto.user.js
// @updateURL https://update.greasyfork.org/scripts/505495/More%20space%20for%20titles%20on%20hianimeto.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a new style element
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
        .film_list .film_list-wrap .flw-item .film-detail .film-name {
            -webkit-line-clamp: 5 !important;
        }
    `;

    // Append the style element to the head of the document
    document.head.appendChild(style);
})();