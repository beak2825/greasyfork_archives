// ==UserScript==
// @name         修复福建校讯通
// @description  使福建校讯通网站在现代浏览器上正常显示
// @namespace    https://greasyfork.org/users/197529
// @version      1.2
// @author       kkocdko
// @license      Unlicense
// @match        *://www.xxtyd.fj.cn/mhnew/htm/all.htm
// @match        *://www.xxt.fj.chinamobile.com/mhnew/htm/all.htm
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/370505/%E4%BF%AE%E5%A4%8D%E7%A6%8F%E5%BB%BA%E6%A0%A1%E8%AE%AF%E9%80%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/370505/%E4%BF%AE%E5%A4%8D%E7%A6%8F%E5%BB%BA%E6%A0%A1%E8%AE%AF%E9%80%9A.meta.js
// ==/UserScript==
"use strict";

Object.defineProperty(this.unsafeWindow || window, "dyniframesize", {
  writable: false,
  value() {
    const iframe = document.querySelector("#rightiframe");
    iframe.height = iframe.contentDocument.scrollingElement.scrollHeight;
  },
});
