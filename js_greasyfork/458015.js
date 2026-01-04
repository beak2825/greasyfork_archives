// ==UserScript==
// @name         [掘金]外链直达
// @namespace    http://tampermonkey.net/
// @version      0.4.0
// @author       sutie
// @description  掘金文章中的外链点击直接跳转.
// @license      MIT
// @icon         https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web//static/favicons/favicon-32x32.png
// @match        https://juejin.cn/post/*
// @grant        none
// @run-at       document-body
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/458015/%5B%E6%8E%98%E9%87%91%5D%E5%A4%96%E9%93%BE%E7%9B%B4%E8%BE%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/458015/%5B%E6%8E%98%E9%87%91%5D%E5%A4%96%E9%93%BE%E7%9B%B4%E8%BE%BE.meta.js
// ==/UserScript==

(function() {
  "use strict";
  function callback(a) {
    const href = new URLSearchParams(
      new URL(decodeURIComponent(a.href)).search.slice(1)
    ).get("target");
    if (href) {
      a.href = href;
      a.title = a.href;
    }
  }
  function main() {
    let mutateTimes = 10;
    let timer = setInterval(() => {
      const postWrap = document.querySelector(".article-content");
      if (!postWrap) {
        return;
      }
      document.querySelectorAll(
        'a[href^="https://link.juejin.cn/?target="]'
      ).forEach(callback);
      document.querySelectorAll(
        'a[href^="https://link.juejin.cn?target="]'
      ).forEach(callback);
      mutateTimes -= 1;
      if (mutateTimes < 0) {
        clearInterval(timer);
      }
    }, 500);
  }
  main();
})();
