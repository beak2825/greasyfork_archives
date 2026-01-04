// ==UserScript==
// @name         I HATE YOUTUBE SHORTS
// @description  Removes shorts from most places (search/home/related) in Youtube
// @namespace    https://faulty.equipment/
// @version      1
// @author       Hamcha
// @match        https://www.youtube.com/*
// @grant        GM_addStyle
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @license      GNU AGPLv3
// @downloadURL https://update.greasyfork.org/scripts/490693/I%20HATE%20YOUTUBE%20SHORTS.user.js
// @updateURL https://update.greasyfork.org/scripts/490693/I%20HATE%20YOUTUBE%20SHORTS.meta.js
// ==/UserScript==

(function() {
    GM_addStyle(`ytd-rich-shelf-renderer, ytd-reel-shelf-renderer, ytd-video-renderer:has(ytd-thumbnail-overlay-time-status-renderer[overlay-style="SHORTS"]) { display: none!important; }`);
})();