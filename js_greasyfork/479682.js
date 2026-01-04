// ==UserScript==
// @name Twitter fixes
// @namespace zezombye.dev
// @version 1.0.1
// @description Display whole images, display whole tweets, and various enhancements here and there
// @author Zezombye
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.twitter.com/*
// @downloadURL https://update.greasyfork.org/scripts/479682/Twitter%20fixes.user.js
// @updateURL https://update.greasyfork.org/scripts/479682/Twitter%20fixes.meta.js
// ==/UserScript==

(function() {
let css = `
    
    /*Display the whole images*/
    
    .r-4gszlv {
        background-size: contain;
    }
    
    /* Remove image border radius */
    
    article[data-testid="tweet"] > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) >  div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) {
        border-radius: 0;
    }
    
    /* Remove quote tweet border radius */
    
    article[data-testid="tweet"] > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) >  div:nth-child(3) > div > div[tabindex="0"][role="link"] {
        border-radius: 0;
    }
    
    /* Hide "subscribe to premium"*/
    
    div[aria-label="Trending"] > div > div:has(> aside[aria-label="Subscribe to Premium"]) {
        display: none;
    }
    
    /* Hide trending tab */
    
    div[aria-label="Trending"] > div > div:has(> div > section > div[aria-label="Timeline: Trending now"]) {
        display: none;
    }
    div[aria-label="Trending"] > div > div:has(> div > div > div[aria-label="Loading timeline"]) {
        display: none;
    }
    
    /* Hide tos, privacy policy, etc */
    
    div[aria-label="Trending"] > div > div:has(> nav[aria-label="Footer"]) {
        display: none;
    }
    
    /* Hide "new tweets" thing */
    
    div[aria-label="New posts are available. Push the period key to go to the them."] {
        display: none;
    }
    
    /* Hide "unread items" home icon */
    
    nav[role="navigation"] > a[data-testid="AppTabBar_Home_Link"] div[aria-label="undefined unread items"] {
        display: none;
    }
    
    /* Dim the opacity of the play button so we can see the full video */
    
    div[aria-label="Play this video"][data-testid="playButton"] {
        background-color: rgba(29, 155, 240, 0.5);
    }
    div[aria-label="Play this video"][data-testid="playButton"]:hover {
        background-color: rgba(26, 140, 216, 0.5);
    }
    
    /* Remove line clamp on long tweets */
    
    div[data-testid="tweetText"] {
        -webkit-line-clamp: unset !important;
    }
    
    /* Remove "show more" link */
    
    div[data-testid="tweet-text-show-more-link"] {
        display: none;
    }
    
    /* Unstick "for you/following" */
    
    div[aria-label="Home timeline"] > div:nth-child(1) {
        position: unset;
    }
    
    /* Remove post prompt on home timeline */
    
    div[aria-label="Home timeline"] > div:nth-child(3) > div:has(label[data-testid="tweetTextarea_0_label"]) {
        display: none;
    }
    
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
