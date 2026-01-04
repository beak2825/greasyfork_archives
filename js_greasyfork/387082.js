// ==UserScript==
// @name         Reddit Horizontal Voting Arrows
// @namespace    https://greasyfork.org/users/65414
// @version      1.0
// @description  Horizontal alignment for upvoting/downvoting buttons on desktop.
// @match        https://www.reddit.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/387082/Reddit%20Horizontal%20Voting%20Arrows.user.js
// @updateURL https://update.greasyfork.org/scripts/387082/Reddit%20Horizontal%20Voting%20Arrows.meta.js
// ==/UserScript==

(function() {
  GM_addStyle (`
    @media (min-width: 639px) {
      .Post > :nth-child(2), [data-test-id="post-content"] {
        margin-left: -40px;
      }
      .Post[style] > :nth-child(2) > :first-child > :last-child {
        margin-left: 3px;
      }
      .Post:not([style]) > div:nth-child(2) > :last-child > :last-child:not([data-click-id="body"]), [data-test-id="post-content"] > :last-child {
          padding: 0 8px 0 88px;
      }
      .Post[style] > div:nth-child(2) > :first-child > :first-child {
          order: 1;
      }
      .Post[style] > div:nth-child(2) > :first-child > :last-child > :last-child {
          left: 63px;
      }
      .Post > div:nth-child(2) > :first-child > :last-child > :last-child > button:first-child {
          display: none;
      }
      div:not(.Comment) > div[id*="vote-arrows"] > * {
          margin: -4px 2px;
      }
      div[id*="vote-arrows"] {
          flex-direction: row !important;
      }
    }
    .Post > div:first-child:not(:only-child), [data-test-id="post-content"] > :first-child {
      padding: 0;
      width: 83px !important;
      bottom: 8px;
      top: unset;
    }
    .Post > :first-child:not(:only-child) > :first-child {
      flex-flow: unset;
      z-index: 1
    }
    [data-test-id*="comment"]+div > div[id*="vote-arrows"] > .voteButton {
      position: unset;
    }`);
})();