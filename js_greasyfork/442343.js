// ==UserScript==
// @name         新版bilibili动态页分栏与净化
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  新版哔哩哔哩动态首页分栏与净化
// @author       yaorelax
// @match        https://t.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/442343/%E6%96%B0%E7%89%88bilibili%E5%8A%A8%E6%80%81%E9%A1%B5%E5%88%86%E6%A0%8F%E4%B8%8E%E5%87%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/442343/%E6%96%B0%E7%89%88bilibili%E5%8A%A8%E6%80%81%E9%A1%B5%E5%88%86%E6%A0%8F%E4%B8%8E%E5%87%80%E5%8C%96.meta.js
// ==/UserScript==


(function () {
  "use strict";
  let styleStr = `
    aside[class="left"],
    .bili-dyn-up-list,
    .bili-dyn-publishing,
    .bili-dyn-item__interaction,
    .bili-dyn-item__footer,
    .bili-dyn-card-video__stat,
    .bili-dyn-content__orig__topic,
    .bili-dyn-item__ornament,
    .bili-dyn-time,
    .bili-dyn-content__orig__additional,
    .bili-backtop,
    .bili-dyn-content__dispute,
    .bili-dyn-item__more,
    div.bili-dyn-item__avatar > div > div > span {
      display: none !important;
    }

    .bili-dyn-item__body {
      margin-bottom: 16px !important;
      margin-top: 0px !important;
    }

    .bili-dyn-content__orig__major.gap {
      margin-top: 0px !important;
    }

    .bili-dyn-content__orig {
      text-align: left !important;
      display: inline-flex !important;
      flex-direction: column-reverse !important;
    }

    .bili-dyn-content__orig__desc {
      margin-top: 8px !important;
      background:-webkit-linear-gradient(top, #FF0000, #00FF00);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }


    .bili-dyn-content,
    .bili-dyn-content__orig__major {
      width: 100% !important;
    }

    .bili-dyn-home--member {
      width: 1650px !important;
    }

    main {
      width: 100% !important;
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
      width: calc(100% - 4px) !important;
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
  styleDom.id = 'yaorelax-bilibili-index'
  styleDom.innerHTML = styleStr;
  body.appendChild(styleDom);
  const url = window.location.href;
  if (url.search("spm_id_from") != -1 || url == "https://t.bilibili.com/") {
    window.location.href = "https://t.bilibili.com/?tab=video";
  }
})();