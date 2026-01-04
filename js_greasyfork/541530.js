// ==UserScript==
// @name                YouTube Hide Sidebar Preview
// @icon                https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @author              ElectroKnight22
// @namespace           electroknight22_youtube_hide_sidebar_preview_namespace
// @version             0.0.2
// @match               *://www.youtube.com/*
// @noframes
// @grant               GM.addStyle
// @run-at              document-start
// @license             MIT
// @description         Hides the GIF preview that happens when you hover videos in the sidebar.
// @downloadURL https://update.greasyfork.org/scripts/541530/YouTube%20Hide%20Sidebar%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/541530/YouTube%20Hide%20Sidebar%20Preview.meta.js
// ==/UserScript==

/*jshint esversion: 11 */

(function () {
    'use strict';
    const hidePreviewCss = `
        ytd-moving-thumbnail-renderer {
            display: none !important;
        }
    `

    if (typeof GM !== 'undefined' && typeof GM.addStyle === 'function') {
        GM.addStyle(hidePreviewCss);
    } else {
        // Fallback for older script managers or if the function is not available.
        const styleNode = document.createElement('style');
        styleNode.textContent = hidePreviewCss;
        document.head.appendChild(styleNode);
    }
})();