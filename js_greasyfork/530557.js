// ==UserScript==
// @name         InfoWars Black Hat Hax0r Mode
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  A dark mode for Drudge Report with a 1337 |-|4><0R æsthetic
// @author       Theodric Æðelfriþ
// @license      WTFPL
// @match        https://www.infowars.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530557/InfoWars%20Black%20Hat%20Hax0r%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/530557/InfoWars%20Black%20Hat%20Hax0r%20Mode.meta.js
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

        /* General text color fallback to amber for non-green text */
        * {
            color: inherit !important;
        }

        *:not(a):not(span):not(td) {
            color: #FFBF00 !important;
        }

        ::placeholder {
            color: #FFBF00 !important;
        }

        input, textarea {
            color: #FFBF00 !important;
        }
    `;

    document.head.appendChild(style);
})();

