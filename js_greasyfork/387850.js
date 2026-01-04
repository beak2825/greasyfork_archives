// ==UserScript==
// @name               『净网卫士』在线翻译
// @name:zh-CN         『净网卫士』在线翻译
// @namespace          ttps://github.com/Hunlongyu
// @version            0.2.1
// @author             Hunlongyu
// @description        Block ads on Baidu's translation interface, streamline pages, and optimize layout.
// @description:zh-CN  精简页面，移除广告，优化布局。适配：百度翻译、谷歌翻译、有道翻译、金山词霸、必应翻译、搜狗翻译、DeepL翻译。。
// @license            MIT
// @copyright          Copyright (c) [2024] [hunlongyu]
// @icon               https://i.loli.net/2019/04/22/5cbd720718fdb.png
// @homepageURL        https://github.com/Hunlongyu/userscript
// @supportURL         https://github.com/Hunlongyu/userscript/issues
// @match              *://fanyi.baidu.com/*
// @match              *://www.iciba.com/translate
// @match              *://translate.google.com/*
// @match              *://fanyi.youdao.com/*
// @match              *://*.bing.com/translator*
// @match              *://fanyi.sogou.com/*
// @match              *://*.deepl.com/translator*
// @match              *://*.deepl.com/*
// @grant              GM_addStyle
// @run-at             document-start
// @downloadURL https://update.greasyfork.org/scripts/485552/%E3%80%8E%E5%87%80%E7%BD%91%E5%8D%AB%E5%A3%AB%E3%80%8F%E5%9C%A8%E7%BA%BF%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/485552/%E3%80%8E%E5%87%80%E7%BD%91%E5%8D%AB%E5%A3%AB%E3%80%8F%E5%9C%A8%E7%BA%BF%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==

(function () {
  'use strict';

  var _GM_addStyle = /* @__PURE__ */ (() => typeof GM_addStyle != "undefined" ? GM_addStyle : void 0)();
  const sites = [
    {
      name: "baidu",
      css: `
      #header{display:none !important;}
      .trans-domain-btn{display: none !important;}
      .ai-trans-btn{display: none !important;}
      .manual-trans-btn{display: none !important;}
      .collection-btn{display: none !important;}
      .op-trans-fb{display: none !important;}
      #app-read{display: none !important;}
      .footer{display: none !important;}
      .note-expand-btn{display: none !important;}
      .trans-other-right{display: none;}
      .app-guide{display: none !important;}
      .desktop-guide-wrapper{display: none !important;}
      `
    },
    {
      name: "iciba",
      css: `
      nav{display: none !important;}
      [class^="translate_header"] ul:nth-child(2){display: none !important;}
      `
    },
    {
      name: "google",
      css: `
      .app-download-bar, #gb{display: none !important;}
      `
    },
    {
      name: "youdao",
      css: `
      .top, .banner, .footer, .sticky-sidebar{
        display:none !important;
      }
      .tab-header{
        display:none !important;
      }
      .index{
        background: url("") !important;
      }
      `
    },
    {
      name: "bing",
      css: `
      .desktop_header, .desktop_header_menu, #b_footer{display: none !important;}
      #tt_translatorHome{width: 96% !important;}
      `
    },
    {
      name: "sogou",
      css: `
      .translate-pc-header, .header-pc, .trans-type, .img-banner, .footer-pc{display: none !important;}
      .trans-box{margin-top: 20px;}
      `
    },
    {
      name: "deepl",
      css: `
      [data-testid="dl-footer"], [data-testid="write-promo-banner"], [data-testid="pro_ad_content"], [data-testid="app_banner_content"],
      [data-testid="dl-header"], aside, #cookieBanner{
        display: none !important;
      }
      `
    }
  ];
  const url = window.location.href;
  for (let i = 0; i < sites.length; i++) {
    if (url.includes(sites[i].name)) {
      _GM_addStyle(sites[i].css);
      break;
    }
  }

})();