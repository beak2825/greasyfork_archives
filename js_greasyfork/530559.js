// ==UserScript==
// @name         Drudge Report Black Hat Hax0r Mode
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  A dark mode for Drudge Report with a 1337 |-|4><0R æsthetic
// @author       Theodric Æðelfriþ
// @license       WTFPL
// @match        https://drudgereport.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530559/Drudge%20Report%20Black%20Hat%20Hax0r%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/530559/Drudge%20Report%20Black%20Hat%20Hax0r%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Apply global styles
    const style = document.createElement('style');
    style.textContent = `
        body {
            background-color: #000000 !important;
            background-image: url('https://upload.wikimedia.org/wikipedia/commons/8/80/Plasmakristall.gif') !important;
            background-size: auto !important;
            background-repeat: repeat !important;
            color: #00FF00 !important;
            font-family: "Courier New", Courier, monospace !important;
        }

        a {
            color: #00FF00 !important;
            text-decoration: none !important;
        }

        a:visited {
            color: #FFBF00 !important;
        }

        a:hover {
            text-decoration: underline !important;
        }

        table {
            background-color: #000000 !important;
        }

        td {
            border-color: #00FF00 !important;
        }
    `;

    document.head.appendChild(style);
})();
