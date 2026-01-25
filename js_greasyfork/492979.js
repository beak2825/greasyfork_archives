// ==UserScript==
// @name         Block-Retweet
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Block Retweet
// @author       dsx137
// @match        https://x.com/*
// @match        https://twitter.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      AGPLv3
// @downloadURL https://update.greasyfork.org/scripts/492979/Block-Retweet.user.js
// @updateURL https://update.greasyfork.org/scripts/492979/Block-Retweet.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const style = `
        div[data-testid="cellInnerDiv"]:has(article [data-testid="socialContext"]) {
            display: none !important;
        }
    `;

  const styleTag = document.createElement("style");
  styleTag.innerHTML = style;
  document.head.appendChild(styleTag);
})();
