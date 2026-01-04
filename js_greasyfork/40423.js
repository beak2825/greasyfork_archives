// ==UserScript==
// @name モノタロウ AutoPagerize 画像ローダー
// @description モノタロウ www.monotaro.com の検索ページでAutoPagerizeを使ったとき、自動で継ぎ足されたページの画像が表示されない問題を修正します。
// @namespace Violentmonkey Scripts
// @match https://www.monotaro.com/*
// @grant none
// @version 0.0.1.20180408134235
// @downloadURL https://update.greasyfork.org/scripts/40423/%E3%83%A2%E3%83%8E%E3%82%BF%E3%83%AD%E3%82%A6%20AutoPagerize%20%E7%94%BB%E5%83%8F%E3%83%AD%E3%83%BC%E3%83%80%E3%83%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/40423/%E3%83%A2%E3%83%8E%E3%82%BF%E3%83%AD%E3%82%A6%20AutoPagerize%20%E7%94%BB%E5%83%8F%E3%83%AD%E3%83%BC%E3%83%80%E3%83%BC.meta.js
// ==/UserScript==

window.addEventListener('GM_AutoPagerizeNextPageLoaded', (e) => {
  console.log("GM_AutoPagerizeNextPageLoaded", e);
  var imgs = document.querySelectorAll("img[data-rep-img-src]");
  Array.from(imgs).forEach(img => {
    img.src = img.getAttribute("data-rep-img-src");
  });
}, false);
