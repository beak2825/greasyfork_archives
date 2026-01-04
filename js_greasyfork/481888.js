// ==UserScript==
// @name Twitter/Reddit embed fixes
// @namespace zezombye.dev
// @version 1.0.0
// @description Removes the trash from the Twitter & Reddit embeds
// @author Zezombye
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.platform.twitter.com/*
// @match *://*.embed.reddit.com/*
// @downloadURL https://update.greasyfork.org/scripts/481888/TwitterReddit%20embed%20fixes.user.js
// @updateURL https://update.greasyfork.org/scripts/481888/TwitterReddit%20embed%20fixes.meta.js
// ==/UserScript==

(function() {
let css = "";
if ((location.hostname === "platform.twitter.com" || location.hostname.endsWith(".platform.twitter.com"))) {
  css += `
      /* Embed fixes */
      
      div[data-testid="tweetText"] {
          font-size: 15px;
          line-height: 20px;
      }
      
      #app > div > div > div {
          border-width: 0px;
      }
      
      article {
          background-color: #2b2d31 !important;
      }
      
      div {
          border-color: rgb(76, 79, 87) !important;
      }
      
      #app > div > div > div > article > div:last-child {
          display: none;
      }
      
      article > div:has(> div div[data-testid^="UserAvatar-Container-"]) > div:nth-child(2) {
          padding-left: 6px;
      }
      
      article > div > div:has(> div > div[data-testid^="UserAvatar-Container-"]) > div:nth-child(2) {
          background-color: rgb(76, 79, 87);
      }
      
      div:has(> a[href^="https://twitter.com/intent/follow"]) {
          display: none;
      }
      
      a[aria-label="View on X"] {
          display: none;
      }
      div[aria-label="View on X"] {
          display: none;
      }
      a[aria-label="Watch on X"] {
          display: none;
      }
      a[aria-label="Continue watching on X"] {
          display: none;
      }
      a[aria-label="X Ads info and privacy"] {
          visibility: hidden;
      }
      div:has(> a[href^="https://twitter.com/intent/like"]) {
          display: none;
      }
      
      /* Fix verified color */
      
      svg[data-testid="icon-verified"] {
          color: rgb(29, 155, 240);
      }
      
      /* Dim the opacity of the play button so we can see the full video */
      
      div[aria-label^="Play Video"] {
          background-color: rgba(29, 155, 240, 0.5);
          border-color: white !important;
      }
      div[aria-label^="Play Video"]:hover {
          background-color: rgba(26, 140, 216, 0.5);
      }
  `;
}
if ((location.hostname === "embed.reddit.com" || location.hostname.endsWith(".embed.reddit.com"))) {
  css += `
      #reddit-logo {
          display: none;
      }
      hr {
          display: none;
      }
      a.join-btn {
          display: none;
      }
      a.media-view-more-on-reddit-button {
          display: none;
      }
      a.embed-background-cta {
          display: none !important;
      }
      a[data-testid="comments"] {
          display: none;
      }
      faceplate-tracker {
          display: flex;
      }
      .h-\\[80px\\] {
          height: auto;
      }
      .h-\\[60px\\] {
          height: auto;
      }
      #embed-title {
          margin-top: 1rem;
      }
      .mt-xs {
          margin-top: 1rem;
      }
      #embed-container {
          background-color: #2b2d31 !important;
      }
      .text-neutral-content-weak, .text-secondary-weak, .text-global-brand-orangered {
          color: rgb(139, 152, 165);
      }
      div[id$="-embed-wrapper"] {
          border: none;
      }
      h1.font-bold {
          font-weight: normal;
      }
      img.h-full.w-full.object-contain.relative {
          max-height: 530px;
      }
      div.h-full.w-full.object-containborder-none {
          height: auto;
      }
      embed-img {
          display: none;
      }
  `;
}
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
