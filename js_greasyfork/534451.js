// ==UserScript==
// @name                Hide YouTube Dislike
// @icon                https://www.youtube.com/img/favicon_48.png
// @author              ElectroKnight22
// @namespace           electroknight22_namespace
// @version             0.0.1
// @match               *://www.youtube.com/*
// @grant               GM.addStyle
// @noframes
// @run-at              document-start
// @license             MIT
// @description         Hides the YouTube dislike button.
// @downloadURL https://update.greasyfork.org/scripts/534451/Hide%20YouTube%20Dislike.user.js
// @updateURL https://update.greasyfork.org/scripts/534451/Hide%20YouTube%20Dislike.meta.js
// ==/UserScript==

/*jshint esversion: 11 */

(function () {
    "use strict";

    GM.addStyle(`
        dislike-button-view-model {
            display: none !important;
        }
        .yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--segmented-start {
            border-radius: 18px !important;
        }
        .yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--segmented-start::after {
            display: none !important;
        }
    `);
})();