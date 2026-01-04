// ==UserScript==
// @name               『净网卫士』网盘净化
// @name:zh-CN         『净网卫士』网盘净化
// @namespace          ttps://github.com/Hunlongyu
// @version            0.0.1
// @author             Hunlongyu
// @description        Block advertisements, pop ups, promotions, shopping malls, etc
// @description:zh-CN  屏蔽广告、弹框、推广、商场等
// @license            MIT
// @copyright          Copyright (c) [2024] [hunlongyu]
// @icon               https://i.loli.net/2019/04/22/5cbd720718fdb.png
// @homepageURL        https://github.com/Hunlongyu/userscript
// @supportURL         https://github.com/Hunlongyu/userscript/issues
// @match              https://www.123pan.com/*
// @match              https://*.lanzoul.com/*
// @match              https://*.lanzouo.com/*
// @match              https://pan.quark.cn/*
// @match              https://pan.baidu.com/*
// @match              https://www.aliyundrive.com/*
// @match              http://ct.ghpym.com/*
// @grant              GM_addStyle
// @run-at             document-start
// @downloadURL https://update.greasyfork.org/scripts/485619/%E3%80%8E%E5%87%80%E7%BD%91%E5%8D%AB%E5%A3%AB%E3%80%8F%E7%BD%91%E7%9B%98%E5%87%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/485619/%E3%80%8E%E5%87%80%E7%BD%91%E5%8D%AB%E5%A3%AB%E3%80%8F%E7%BD%91%E7%9B%98%E5%87%80%E5%8C%96.meta.js
// ==/UserScript==

(function () {
  'use strict';

  var _GM_addStyle = /* @__PURE__ */ (() => typeof GM_addStyle != "undefined" ? GM_addStyle : void 0)();
  const parseUrl = () => {
    const url = window.location.href;
    if (url.includes("123pan")) {
      runWith123Pan();
    } else if (url.includes("lanzou")) {
      runWithLanzou();
    } else if (url.includes("quark")) {
      runWithQuark();
    } else if (url.includes("baidu")) {
      runWithBaidu();
    } else if (url.includes("aliyundrive")) {
      runWithAliYun();
    } else if (url.includes("ghpym")) {
      runWithGhpym();
    }
  };
  const runWith123Pan = () => {
    const css = `
    .mfy-main-layout__head{display: none !important;}
    .banner-container-pc{display: none !important;}
    /* 手机 */
    .banner-container-h5{display: none !important;}
  `;
    _GM_addStyle(css);
    localStorage.setItem("linearModal", '"off"');
  };
  const runWithLanzou = () => {
    const css = `
    .foot_info{display: none !important;}
  `;
    _GM_addStyle(css);
  };
  const runWithQuark = () => {
    const css = `
    .feature-screen{display: none !important;}
    [class^="DetailLayout--header-wrap"]{display: none !important;}
    .share-right-side-content{display: none !important;}
    [class^="CommonFooter--footer"]{display: none !important;}
    #ice-container{background-color: #f3f6fe;}
    [class^="DetailLayout--content"]{width: 90% !important; max-width: 1280px;}
  `;
    _GM_addStyle(css);
  };
  const runWithBaidu = () => {
    const css = `
    .module-sidebar-business-ad{display: none !important;}
    #bd-main .bd-left{margin: 0 !important;}
    .module-share-footer{display: none !important;}
  `;
    _GM_addStyle(css);
  };
  const runWithAliYun = () => {
    const css = `
    [class^="share-list-banner"]{display: none !important;}
  `;
    _GM_addStyle(css);
  };
  const runWithGhpym = () => {
    const css = `
    [class^="share-list-banner"]{display: none !important;}
    footer{display: none !important;}
    .search-box{display: none !important;}
    `;
    _GM_addStyle(css);
  };
  parseUrl();

})();