// ==UserScript==
// @name         Custom Styling for Manning LiveBook
// @namespace    http://tampermonkey.net/
// @version      0.16
// @description  Apply custom CSS to improve readability on Manning LiveBook
// @match        https://livebook.manning.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/511940/Custom%20Styling%20for%20Manning%20LiveBook.user.js
// @updateURL https://update.greasyfork.org/scripts/511940/Custom%20Styling%20for%20Manning%20LiveBook.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add Google Fonts link
    const linkElement = document.createElement('link');
    linkElement.rel = 'stylesheet';
    linkElement.href = 'https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,200..900;1,8..60,200..900&display=swap';
    document.head.appendChild(linkElement);

    GM_addStyle(`
        @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,200..900;1,8..60,200..900&display=swap');

        div.text-marginalia-item {
            font-size: 15px;
            font-family: 'Source Serif 4', serif;
            font-weight: 350;
            line-height: 22px;
            color: #cccccc;
        }

        span.highlighted-note-text, span.highlighted-text {
            background-repeat: no-repeat !important;
            background-size: 100% 90% !important;
            background-position: 0 75% !important;
            color: rgb(255, 255, 255) !important;
        }
        
        span.highlighted-text {
            background-color: hsl(50deg 100% 50% / 15%) !important;
            border-bottom-color: hsl(50deg 100% 50% / 80%) !important;
        }
        
        span.highlighted-note-text {
          background-color: hsl(50deg 100% 50% / 15%) !important;
          border-bottom-color: hsl(40deg 100% 50% / 80%) !important;
        }
        
        div.note-content-container.note-content-container-can-edit {
          line-height: 20px;
        }

        #main-page-content {
            background-color: #151c23;
            font-size: 15px;
        }

        #book-markup-container {
            max-width: 760px;
            margin-left: auto;
            margin-right: auto;
        }

        div div p, li {
              font-family: 'Source Serif 4';
              color: rgb(193, 199, 206);
              line-height: 22px;
              font-weight: 350;
              font-size: 15px;
              font-feature-settings: "kern", "liga", "clig", "calt", "onum";
              font-variation-settings: "opsz" 16;
              font-kerning: auto;
              text-rendering: optimizelegibility;
              font-optical-sizing: auto;
        }
        
        li {
            line-height: 28px;
        }

        div p i {
          font-family: 'Source Serif 4' !important;
          font-weight: 550 !important;
          font-style: italic !important;
        }
    `);
})();