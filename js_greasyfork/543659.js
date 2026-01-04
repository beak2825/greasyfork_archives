// ==UserScript==
// @name        Twitter system font
// @namespace   Violentmonkey Scripts
// @match       https://x.com/*
// @grant       none
// @version     1.0
// @author      -
// @description 7/25/2025, 7:56:33 PM
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/543659/Twitter%20system%20font.user.js
// @updateURL https://update.greasyfork.org/scripts/543659/Twitter%20system%20font.meta.js
// ==/UserScript==

const style = document.createElement('style');
style.textContent = `
    .r-37j5jr {
        font-family: 'system-ui' !important;
    }
`;
document.head.appendChild(style);