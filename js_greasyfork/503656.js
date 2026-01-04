// ==UserScript==
// @name        hidan etc dark mode
// @namespace   Violentmonkey Scripts
// @match       *://hidan.co/*, *://fuckingfast.co/*, *://hidan.sh/*
// @grant       none
// @run-at      document-body
// @description dark mode for hidan and related domains
// @license MIT
// @version 0.0.1.20240814162002
// @downloadURL https://update.greasyfork.org/scripts/503656/hidan%20etc%20dark%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/503656/hidan%20etc%20dark%20mode.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Create the style element
    var style = document.createElement('style');
    style.textContent = `
       @media (prefers-color-scheme: dark) {
        :root { color-scheme: dark; }
        a { color:#FFF!important }
      }
    `;

    // Append the style element to the head
    document.head.insertBefore(style, document.head.firstChild);
})();