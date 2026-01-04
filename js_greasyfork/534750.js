// ==UserScript==
// @name             YouTube Five Videos in Row
// @namespace        https://github.com/ikelax/userscripts
// @match            https://www.youtube.com/
// @grant            GM_addStyle
// @version          0.1.0
// @author           Alexander Ikonomou
// @description      A userscript that changes the style of YouTube's homepage such that five videos are shown in a row instead of three
// @license          MIT
// @supportURL       https://github.com/ikelax/userscripts/issues
// @copyright        2025, Alexander Ikonomou (https://github.com/ikelax)
// @homepageURL      https://github.com/ikelax/userscripts
// @homepage         https://github.com/ikelax/userscripts
// @contributionURL  https://github.com/ikelax/userscripts
// @collaborator     ikelax
// @icon             https://img.icons8.com/bubbles/100/youtube-squared.png
// @run-at           document-start
// @downloadURL https://update.greasyfork.org/scripts/534750/YouTube%20Five%20Videos%20in%20Row.user.js
// @updateURL https://update.greasyfork.org/scripts/534750/YouTube%20Five%20Videos%20in%20Row.meta.js
// ==/UserScript==

(() => {
  "use strict";

  GM_addStyle(
    `
      div {
        --ytd-rich-grid-items-per-row: 5 !important;
        --ytd-rich-grid-posts-per-row: 5 !important;
    }
    `,
  );
})();
