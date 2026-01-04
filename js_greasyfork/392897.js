// ==UserScript==
// @name         Discuz！论坛跳转到打印页面
// @namespace    http://tampermonkey.net/
// @description  Discuz！论坛跳转到打印页面，目前仅支持轻国论坛和500
// @author       小凉弱弱
// @include      *//www.lightnovel.cn/thread*
// @include      *//bbs.yamibo.com/thread*
// @include      *//bbs.yamibo.com/forum.php?mod=viewthread&tid*
// @version      0.21
// @grant        none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/392897/Discuz%EF%BC%81%E8%AE%BA%E5%9D%9B%E8%B7%B3%E8%BD%AC%E5%88%B0%E6%89%93%E5%8D%B0%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/392897/Discuz%EF%BC%81%E8%AE%BA%E5%9D%9B%E8%B7%B3%E8%BD%AC%E5%88%B0%E6%89%93%E5%8D%B0%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
  "use strict";
  //https://bbs.yamibo.com/thread-501512-1-1.html
  //https://bbs.yamibo.com/forum.php?mod=viewthread&tid=494251&highlight=%D1%A9%CE%B2
  const url = location.href.toString();
  const mainUrl = url.match(/.+\.com\//g);
  const isPrint = /print/.test(url);
  let tid;
  if (!isPrint) {
    if (/thread-/.test(url)) {
      tid = url.match(/(?!thread-)\d+(?=-1-1)/);
    } else if (/mod=viewthread&tid=/.test(url)) {
      tid = url.match(/(?!mod=viewthread&tid=)\d+/);
    } else {
      console.error("有误");
    }
    const printUrl =
      mainUrl + "forum.php?mod=viewthread&action=printable&tid=" + tid;
    // console.log(printUrl);

    if (printUrl !== url) {
      location.assign(printUrl);
    }
  }
})();
