// ==UserScript==
// @name         Change Website Font (Online Hosting)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Use an externally hosted font on all websites
// @author       You
// @match        https://www.milkywayidle.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531647/Change%20Website%20Font%20%28Online%20Hosting%29.user.js
// @updateURL https://update.greasyfork.org/scripts/531647/Change%20Website%20Font%20%28Online%20Hosting%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Use a font from GitHub or Dropbox
    const fontURL = "https://raw.githubusercontent.com/MatoAsakura/fontsupport.github.io/main/ComicNeue-Bold.ttf"; // Replace with your direct link

    const fontName = "MyOnlineFont";
    const fontSize = "14px";

    let style = document.createElement('style');
    style.innerHTML = `
        @font-face {
            font-family: '${fontName}';
            src: url('${fontURL}') format('woff2');
            font-weight: normal;
            font-style: normal;
        }

        * {
            font-family: '${fontName}', sans-serif !important;
            font-weight: 550 !important;
            font-size: ${fontSize} !important;
        }
    `;
    document.head.appendChild(style);
})();