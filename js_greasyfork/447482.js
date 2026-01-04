(function() {
    'use strict';


// ==UserScript==
// @name YouTube Comment & Thumb-bar HIDE
// @version 1.2
// @description Annoyed of Comments & Thumb-bar? This script hides them and offers a carefree YouTube-experience. FOR VIEWERS ONLY 
// @match        https://www.youtube.com/*
// @license MIT 
// @grant        GM_addStyle
// @namespace https://greasyfork.org/users/932859
// @downloadURL https://update.greasyfork.org/scripts/447482/YouTube%20Comment%20%20Thumb-bar%20HIDE.user.js
// @updateURL https://update.greasyfork.org/scripts/447482/YouTube%20Comment%20%20Thumb-bar%20HIDE.meta.js
// ==/UserScript==

GM_addStyle("ytd-toggle-button-renderer {display:none}"); // HIDES THUMB-BAR & BUTTON 
GM_addStyle("ytd-comments {display:none}");   // HIDES COMMENT-SECTION
GM_addStyle("ytd-comments-entry-point-header-renderer[has-chevron] {display:none}"); // HIDES COMMENT-TEASER


})();