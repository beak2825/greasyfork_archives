// ==UserScript==
// @name RedirectChineseWikipediaFix
// @name:zh-CN 中文维基重定向修复
// @namespace https://zh.wikipedia.org
// @include https://zh.wikipedia.org/wiki/*
// @include https://zh.wikipedia.org/zh/*
// @include https://zh.wikipedia.org/zh-hk/*
// @include https://zh.wikipedia.org/zh-mo/*
// @include https://zh.wikipedia.org/zh-tw/*
// @include https://zh.wikipedia.org/zh-my/*
// @include https://zh.wikipedia.org/zh-sg/*
// @include https://zh.wikipedia.org/zh-hans/*
// @include https://zh.m.wikipedia.org/wiki/*
// @include https://zh.m.wikipedia.org/zh/*
// @include https://zh.m.wikipedia.org/zh-hk/*
// @include https://zh.m.wikipedia.org/zh-mo/*
// @include https://zh.m.wikipedia.org/zh-tw/*
// @include https://zh.m.wikipedia.org/zh-my/*
// @include https://zh.m.wikipedia.org/zh-sg/*
// @include https://zh.m.wikipedia.org/zh-cn/*
// @include https://zh.m.wikipedia.org/zh-hans/*
// @version 1.0
// @description Force redirect Chinese Wikipedia from other locales to zh-cn (and also from mobile ver to desktop ver)
// @description:zh-CN 重定向中文维基的其他版本（繁体中文等）到简体中文，同时重定向手机端页面到桌面端页面。
// @author imbytecat
// @icon https://zh.wikipedia.org/favicon.ico
// @license MIT
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/451824/RedirectChineseWikipediaFix.user.js
// @updateURL https://update.greasyfork.org/scripts/451824/RedirectChineseWikipediaFix.meta.js
// ==/UserScript==

(function () {
  'use strict';
  let variants = ["wiki/", "zh/", "zh-hk/", "zh-mo/", "zh-tw/", "zh-my/", "zh-sg/", "zh-hans/"];
  let url = window.location.href;
  let desturl = url;
  let header = "zh.wikipedia.org/";
  let mobile_header = "zh.m.wikipedia.org/";
  if (url.search(mobile_header) != -1) desturl = url.replace(mobile_header, header);

  let target = header + "zh-cn/";
  for (let i = 0; i < variants.length; i++) {
    let searchstr = header + variants[i];
    if (desturl.search(searchstr) != -1) {
      desturl = desturl.replace(searchstr, target);
      break;
    }
  }
  window.location.replace(desturl);
})();
