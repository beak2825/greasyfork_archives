// ==UserScript==
// @name         LLresearch and Law of One Dark Theme
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Change dark theme colors for LLresearch and LawOfOne website
// @match        https://www.lawofone.info/*
// @match        https://www.llresearch.org/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/516969/LLresearch%20and%20Law%20of%20One%20Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/516969/LLresearch%20and%20Law%20of%20One%20Dark%20Theme.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* Lawofone.info */
    GM_addStyle(`
        :root {
            --background-body: #202020 !important;
            --background: #282828 !important;
            --background-alt: #303030 !important;
            --selection: #68a7a7 !important;
            --text-main: #bfbfbf !important;
            --text-bright: #e0e0e0 !important;
            --text-muted: #909090 !important;
            --links: #68a7a7 !important;
            --focus: #68a7a7ab !important;
            --border: #404040 !important;
            --code: #d4a76a !important;
            --button-base: #303030 !important;
            --button-hover: #404040 !important;
            --scrollbar-thumb: var(--button-hover) !important;
            --scrollbar-thumb-hover: #505050 !important;
            --form-placeholder: #808080 !important;
            --form-text: #bfbfbf !important;
        }
    `);

    /* LLresearch.org */
    GM_addStyle(`
        .dark body {
            color: #bfbfbf !important;
            background-color: #202020 !important;
        }
        .dark .\\~bg-yellow {
            background-color: inherit !important;
        }
        .dark .\\~text-rosegold {
            color: inherit !important;
        }
        a {
            color : #68a7a7 !important;
        }
        .nav-icon {
            color: inherit;
        }
        *,:before,:after {
            --tw-ring-color:  #68a7a7 !important;
        }
    `);

})();