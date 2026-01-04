// ==UserScript==
// @name         掘金清爽界面
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  juejin clean interface
// @author       qixuan.yu
// @match        https://juejin.cn/*
// @icon         https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web//static/favicons/favicon-32x32.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/468555/%E6%8E%98%E9%87%91%E6%B8%85%E7%88%BD%E7%95%8C%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/468555/%E6%8E%98%E9%87%91%E6%B8%85%E7%88%BD%E7%95%8C%E9%9D%A2.meta.js
// ==/UserScript==

(function () {
  "use strict";
  const removeDom = (queryDom) => {
    const doms = document.querySelectorAll(queryDom);
    if (doms.length) {
      doms.forEach((dom) => {
        dom.remove();
      });
    }
  };

  const style = document.createElement("style");
  document.head.appendChild(style);
  style.innerText = `
    .timeline-entry-list { margin-right: 0 !important; }
    .timeline-container { margin: 0 !important; }
    .index-nav { top: 0 !important; }
    .main-container { max-width: 920px !important; }
  `;


    removeDom(".main-header-box");
    removeDom("aside");
    removeDom(".meiqia-btn");
    removeDom(".article-sidebar");

})();
