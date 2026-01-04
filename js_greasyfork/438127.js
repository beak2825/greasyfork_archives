// ==UserScript==
// @name         掘金跳转净化
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  监听全局点击时间，阻止默认跳转，直接打开链接网页
// @author       Sage Kwun
// @match        https://juejin.cn/post/*
// @icon         https://www.google.com/s2/favicons?domain=juejin.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438127/%E6%8E%98%E9%87%91%E8%B7%B3%E8%BD%AC%E5%87%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/438127/%E6%8E%98%E9%87%91%E8%B7%B3%E8%BD%AC%E5%87%80%E5%8C%96.meta.js
// ==/UserScript==

(function () {
  "use strict";

  window.addEventListener(
    "click",
    (e) => {
      if (e.target?.href?.startsWith("https://link.juejin.cn/?target=")) {
        e.preventDefault();
        open(
          decodeURIComponent(
            e.target.href.replace("https://link.juejin.cn/?target=", "")
          )
        );
      }
    },
    true
  );
})();
