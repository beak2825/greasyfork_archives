// ==UserScript==
// @name         Chzzk Hide Scrollbar (visual only)
// @namespace    https://greasyfork.org/
// @version      1.0
// @description  Hide scrollbar visually only on chzzk.naver.com
// @match        https://chzzk.naver.com/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547195/Chzzk%20Hide%20Scrollbar%20%28visual%20only%29.user.js
// @updateURL https://update.greasyfork.org/scripts/547195/Chzzk%20Hide%20Scrollbar%20%28visual%20only%29.meta.js
// ==/UserScript==

(function() {
    const css = `
        /* Chrome, Edge, Safari */
        ::-webkit-scrollbar {
            display: none;
        }
        /* Firefox */
        html {
            scrollbar-width: none !important;
        }
        body {
            -ms-overflow-style: none; /* IE, Edge (legacy) */
        }
    `;
    const style = document.createElement("style");
    style.textContent = css;
    document.documentElement.appendChild(style);
})();