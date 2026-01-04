// ==UserScript==
// @name         bilibili动态首页布局优化
// @namespace    http://tampermonkey.net/
// @version      0.2.0
// @description  改变哔哩哔哩动态首页布局
// @author       tuntun
// @match        https://t.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?domain=bilibili.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/438739/bilibili%E5%8A%A8%E6%80%81%E9%A6%96%E9%A1%B5%E5%B8%83%E5%B1%80%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/438739/bilibili%E5%8A%A8%E6%80%81%E9%A6%96%E9%A1%B5%E5%B8%83%E5%B1%80%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function () {
  "use strict";
  let styleStr = `
    .bili-dyn-home--member {
      width: 1524px !important;
    }

    main {
      width: 1272px !important;
    }

    aside[class="right"] {
      display: none !important;
    }

    .most-viewed-panel {
      margin-bottom: 8px !important;
    }

    .bili-dyn-list__items {
      display: flex !important;
      flex-wrap: wrap !important;
      justify-content: space-between !important;
      width: 100% !important;
    }

    .bili-dyn-list__item {
      width: calc(50% - 4px) !important;
      /* margin-right: 8px !important; */
    }

    .bili-dyn-list__item .bili-dyn-item {
      width: calc(50% - 4px) !important;
      height: calc(100%) !important;
    }

    .bili-dyn-list__notification {
      margin-top: 8px !important;
      flex-basis:100% !important;
    }

    @media screen and (min-width: 1921px) {
      .bili-dyn-home--member {
        width: 1524px !important;
      }
    }

    @media screen and (min-width: 1921px) {
      main {
        width: 1272px !important;;
      }
    }
  `
  let body = document.body;
  let styleDom = document.createElement('style');
  styleDom.id = 'tuntun-bilibili-index'
  styleDom.innerHTML = styleStr;
  body.appendChild(styleDom);
})();