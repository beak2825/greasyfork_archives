// ==UserScript==
// @name Internet Roadtrip - Solo Ride Simulator
// @namespace me.netux.site/user-styles/internet-roadtrip/hide-chat
// @version 1.1.0
// @description Forget about the other drivers, and just enjoy the scenery.
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match https://neal.fun/internet-roadtrip/*
// @downloadURL https://update.greasyfork.org/scripts/542231/Internet%20Roadtrip%20-%20Solo%20Ride%20Simulator.user.js
// @updateURL https://update.greasyfork.org/scripts/542231/Internet%20Roadtrip%20-%20Solo%20Ride%20Simulator.meta.js
// ==/UserScript==

(function() {
let css = `
.container {
  .drivers,
  .options,
  .chat-container,
  .results-content,
  .car-radio .control-button,
  .voted {
    display: none !important;
  }

  .results {
    top: 10px;
    padding: 7px 10px;
    width: auto;
    min-width: 0;
    height: 33px;
    
    .container:has(.irf-g3AoUI) & {
      right: 48px;
    }
    
    .results-title {
      &:has(.time-remaining) {
        font-size: 0;

        .time-remaining {
          font-size: 16px;

          &::before {
            content: "Moving in ";
          }
        }
      }
    
      &:not(:has(.time-remaining)) {
        font-size: 0;

        &::before {
          content: "Moving...";
          font-size: 16px;
        }
      }
    }
  }
  
  .car-radio .volume-controls {
    width: 100%;
    
    & .power-button {
      margin-right: auto;
    }
  }

  /* Combined Votes Count UI */
  .cvcui-results-content-toggle-button, .cvcui-vote-count {
    display: none !important;
  }
  
  /* Vote History */
  .vh-vote-history {
    .vh-vote-history-entry {
      font-size: 0;
      
      .vh-vote-history-entry__time {
        font-size: 0.7rem;
        margin-left: 0;
        color: white;
      }
    }
  }
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
