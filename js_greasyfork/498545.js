// ==UserScript==
// @name         Comic sans is life
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Comic sans is life, More support for sites soon, im adding sites currently
// @author       Guy
// @match        https://chatgpt.com/*
// @match        https://youtube.com/*
// @match        https://picsart.com/*
// @match        https://facebook.com/*
// @match        https://x.com/*
// @match        https://twitter.com/*
// @grant        none
// @license CC-BY-4.0
// @downloadURL https://update.greasyfork.org/scripts/498545/Comic%20sans%20is%20life.user.js
// @updateURL https://update.greasyfork.org/scripts/498545/Comic%20sans%20is%20life.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a new style element
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = '* { font-family: "Comic Sans MS", "Comic Sans", cursive !important; }';

    // Append the style element to the head of the document
    document.head.appendChild(style);
})();
