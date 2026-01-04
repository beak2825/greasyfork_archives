// ==UserScript==
// @name         Change Website Font
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Change website font to Google Sans Text
// @author       Your Name
// @match        *://*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/508165/Change%20Website%20Font.user.js
// @updateURL https://update.greasyfork.org/scripts/508165/Change%20Website%20Font.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        @font-face {
            font-family: 'Google Sans Text';
            src: url('https://fonts.gstatic.com/s/googlesanstext/v16/5aUu9-KzpRiLCAt4Unrc-xIKmCU5qEp2iw.woff2') format('woff2');
            font-weight: normal;
            font-style: normal;
        }

        @font-face {
            font-family: 'Google Sans Text';
            src: url('https://fonts.gstatic.com/s/googlesanstext/v16/5aUp9-KzpRiLCAt4Unrc-xIKmCU5oPFTnmhjtg.woff2') format('woff2');
            font-weight: bold;
            font-style: normal;
        }

        body {
            font-family: 'Google Sans Text', sans-serif !important;
        }

        b, strong {
            font-weight: bold !important;
        }
    `);
})();
