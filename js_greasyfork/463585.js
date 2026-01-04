// ==UserScript==
// @name            AtCoder Style Optimizer for Single Display
// @name:ja         AtCoder Style Optimizer for Single Display
// @namespace       https://github.com/xe-o
// @version         0.4
// @description     Overrides AtCoder styles for single display
// @description:ja  シングルディスプレイ向けにAtCoderのスタイルを最適化します
// @author          XERO
// @license         MIT
// @match           https://atcoder.jp/*
// @run-at          document-start
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/463585/AtCoder%20Style%20Optimizer%20for%20Single%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/463585/AtCoder%20Style%20Optimizer%20for%20Single%20Display.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const css = `
    @media (max-width: 1100px) {
      .container {
        width: 100%;
      }

      #main-container {
        padding: 30px 20px 10px;
      }

      #main-div.float-container {
        background: none;
      }

      .float-container > #main-container {
        box-shadow: none;
      }

      .h2 {
        font-size: 20px;
      }

      h3 {
        font-size: 20px;
      }

      #main-container > div.row > div:nth-child(2) > span.h2 > a {
        font-size: 11px;
        padding: 2px 6px;
        margin-left: 8px;
      }

      #contest-nav-tabs > div > small.back-to-home.pull-right {
        display: none !important;
      }

      #contest-nav-tabs > ul > li {
        width: auto;
      }

      #contest-nav-tabs > ul > li > a {
        font-size: 12px;
        padding: 6px 8px;
      }
    }

    @media screen and (min-width: 768px) {
      #header .header-page, .header-lang {
        display: -webkit-box !important;
      }
    }
  `;

  const styleNode = document.createTextNode(css);
  document.head.insertAdjacentHTML("beforeend", "<style></style>");
  document.head.lastElementChild.appendChild(styleNode);
})();
