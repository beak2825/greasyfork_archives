// ==UserScript==
// @name         Sourcegraph Reference Code Syntax
// @namespace    http://www.dosk.win/
// @version      0.2
// @description  Make Sourcegraph LSP again !
// @author       SpringHack
// @match        https://code.feishu.cn.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/422223/Sourcegraph%20Reference%20Code%20Syntax.user.js
// @updateURL https://update.greasyfork.org/scripts/422223/Sourcegraph%20Reference%20Code%20Syntax.meta.js
// ==/UserScript==

(function() {
  'use strict';
  GM_addStyle(`
    .hover-overlay__contents {
      display: block;
      padding: 2px;
      unicode-bidi: embed;
      font-family: monospace;
      white-space: pre;
      margin: 10px;
    }
    .btn.btn-secondary.hover-overlay__action.e2e-tooltip-find-impl {
      display: none;
    }
  `);
})();