// ==UserScript==
// @name         YT Embed Hide Controls
// @namespace    http://vk.com/alx
// @version      1.2
// @description  Hide all YT controls
// @author       Alex
// @match        https://www.youtube.com/embed/*
// @grant    GM_addStyle
// @run-at   document-start
// @downloadURL https://update.greasyfork.org/scripts/385135/YT%20Embed%20Hide%20Controls.user.js
// @updateURL https://update.greasyfork.org/scripts/385135/YT%20Embed%20Hide%20Controls.meta.js
// ==/UserScript==

GM_addStyle ( `
    .ytp-gradient-top {display: none !important;}
    .ytp-watermark {display: none !important;}
    .ytp-show-cards-title {display: none !important;}
    .ytp-pause-overlay {display: none !important;}
    .html5-endscreen {display: none !important;}
    .video-annotations {display: none !important;}
    .video-custom-annotations  {display: none !important;}
    .video-legacy-annotations {display: none !important;}
    .captions-text {display: none !important;}
` );