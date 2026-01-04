// ==UserScript==
// @name        Wechat Read better TOC
// @description A userscript that enhance wechat read toc experence.
// @version     0.1.0
// @license     MIT
// @author      bingtsingw
// @namespace   https://github.com/bingtsingw
// @match       https://weread.qq.com/web/reader/*
// @run-at      document-idle
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/422274/Wechat%20Read%20better%20TOC.user.js
// @updateURL https://update.greasyfork.org/scripts/422274/Wechat%20Read%20better%20TOC.meta.js
// ==/UserScript==

GM_addStyle(`
  #routerView {
    display: flex;
    flex-direction: row-reverse;
  }

  .readerContent {
    min-height: 100%;
    height: unset;
  }

  .app_content {
    width: 100%;
    margin-left: 10px;
  }

  .wr_mask {
    width: 0;
    height: 0;
  }

  .readerCatalog {
    display: block !important;
    max-height: 100%;
    overflow-y: scroll;
    left: unset;
    top: unset;
    bottom: unset;
    z-index: unset;
  }

  .readerControls {
    margin-left: 618px;
  }
`);

(() => {
  document.getElementsByClassName('readerCatalog')[0].parentElement.style.width = '520px';
})();
