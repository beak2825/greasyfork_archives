// ==UserScript==
// @name TwitchEmotes.com – Dark Enhanced [Ath]
// @namespace athari
// @version 1.0.0
// @description Dark theme for TwitchEmotes.com with several enhancements: compact layout, no ads.
// @author Athari (https://github.com/Athari)
// @homepageURL https://github.com/Athari/AthariUserCSS
// @supportURL https://github.com/Athari/AthariUserCSS/issues
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.twitchemotes.com/*
// @downloadURL https://update.greasyfork.org/scripts/536246/TwitchEmotescom%20%E2%80%93%20Dark%20Enhanced%20%5BAth%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/536246/TwitchEmotescom%20%E2%80%93%20Dark%20Enhanced%20%5BAth%5D.meta.js
// ==/UserScript==

(function() {
let css = `
  :root {
    color-scheme: dark;
  }

  body {
    color: #ccc;
    background: #000;
  }
  #ad,
  #ad ~ * {
    display: none;
  }
  .navbar {
    position: absolute;
    inset: 4px 0 auto auto;
    z-index: 1;
    background: #0000 !important;
  }
  .container {
    max-width: none;
    width: auto;
    br {
      display: none;
    }
  }
  .card {
    background: #111;
    border-color: #222;
    border-radius: 10px 10px 0 0;
  }
  .card-header {
    padding: 0;
    background: #333;
    border-color: #222;
    border-radius: 10px 10px 0 0;
    h3 {
      font-size: 20px;
      margin: 8px 12px;
      a {
        color: #a27ed8;
        &::after {
          content: " (" attr(href) ")";
        }
      }
    }
  }
  .card-body {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, auto));
    gap: 8px;
    padding: 16px;
    hr {
      display: none;
    }
    h4 {
      grid-column: 1 / -1;
      background: #222;
      border: solid 1px #444;
      border-width: 1px 0;
      padding: 6px 16px;
      margin: 0 -16px;
    }
    .row {
      display: contents;
      .col-md-2 {
        display: contents;
        img {
          display: block;
        }
      }
    }
  }
  .form-control {
    color: #ccc;
    background: #111;
    border-color: #222;
    &:focus {
      color: #ccc;
      background: #333;
      border-color: #444;
    }
  }
  center {
    display: flex;
    flex-flow: column;
    align-items: center;
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
