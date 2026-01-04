// ==UserScript==
// @name               『净网卫士』百度翻译
// @name:zh-CN         『净网卫士』百度翻译
// @namespace          ttps://github.com/Hunlongyu
// @version            0.3.3
// @author             Hunlongyu
// @description        Block ads on Baidu's translation interface, streamline pages, and optimize layout.
// @description:zh-CN  页面精简，去除广告，只保留主要功能的部分。
// @license            MIT
// @copyright          Copyright (c) [2024] [hunlongyu]
// @icon               https://i.loli.net/2019/04/22/5cbd720718fdb.png
// @homepage           https://github.com/Hunlongyu/userscript
// @supportURL         https://github.com/Hunlongyu/userscript/issues
// @match              *://fanyi.baidu.com/mtpe-individual/*
// @match              *://fanyi.baidu.com/*
// @grant              GM_addStyle
// @grant              GM_log
// @run-at             document-start
// @downloadURL https://update.greasyfork.org/scripts/485534/%E3%80%8E%E5%87%80%E7%BD%91%E5%8D%AB%E5%A3%AB%E3%80%8F%E7%99%BE%E5%BA%A6%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/485534/%E3%80%8E%E5%87%80%E7%BD%91%E5%8D%AB%E5%A3%AB%E3%80%8F%E7%99%BE%E5%BA%A6%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==

(function () {
  'use strict';

  var _GM_addStyle = /* @__PURE__ */ (() => typeof GM_addStyle != "undefined" ? GM_addStyle : void 0)();
  var _GM_log = /* @__PURE__ */ (() => typeof GM_log != "undefined" ? GM_log : void 0)();
  const css = `
    .MMqloUXF{display:none !important;}
    .ZqJhu4sT{display:none !important;}
    .UzOvH9bK{display:none !important;}
    .Hu5qsRSB{display:none !important;}
    .qphmPPyw{display:none !important;}
    .tk4FR4Cn{display:none !important;}
    .rfhEM3lg{display:none !important;}

    #header{display:none !important;}
    .nav-dxy-logo{display:none !important;}
    #app-read{display:none !important;}
    .footer{display:none !important;}
    .trans-domain-btn{display:none !important;}
    .trans-btn-zh{display:none !important;}
    .ai-trans-btn{display:none !important;}
    .manual-trans-btn{display:none !important;}
  `;
  try {
    _GM_addStyle(css);
  } catch (e) {
    _GM_log(new Error("GM_addStyle stopped working！"));
  }

})();