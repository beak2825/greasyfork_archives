// ==UserScript==
// @name         Less Addicting YouTube
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  Removes some distractions from YouTube with just CSS
// @author       Andrew Rosiclair <git@arosiclair>
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524140/Less%20Addicting%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/524140/Less%20Addicting%20YouTube.meta.js
// ==/UserScript==

(function () {
  "use strict";

  console.log("[Less Addicting YouTube] cleaning");

  const styles = [
    // Hide categories at the top of the homepage
    "ytd-feed-filter-chip-bar-renderer[component-style=\"FEED_FILTER_CHIP_BAR_STYLE_TYPE_DEFAULT\"] { display: none; } #frosted-glass.with-chipbar.ytd-app { height: 56px; }",

    // Hide special recommendations like Shorts on the homepage
    "ytd-rich-section-renderer { display: none; }",

    // Hide categories at the top of search results
    "#chip-bar { visibility: hidden; }",

    // Hide Shorts in search results
    "grid-shelf-view-model { display: none!important; }",

    // Hide commenter avatars
    "#author-thumbnail { display: none; }",

    // Hide recommendations at the end of videos
    ".html5-endscreen, .ytp-fullscreen-grid, .ytp-ce-element, .ytp-ce-hide-button-container { visibility: hidden!important; }",

    // Hide recommendations on the side of the video page
    "#secondary { visibility: hidden; }",

    // Adjust the indent on comment replies
    "ytd-comment-replies-renderer { margin-left: 0px; } .expander-header { margin-bottom: 8px; } #expander-contents { margin-left: 24px; } ytd-comment-view-model { margin-bottom: 12px; }",

    // Hide reels in the description
    "ytd-reel-shelf-renderer { display: none; }",
  ];

  GM_addStyle(styles.join(" "));

  console.log("[Less Addicting YouTube] cleaned");
})();
