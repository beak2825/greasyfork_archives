// ==UserScript==
// @name         [掘金]样式优化
// @namespace    http://tampermonkey.net/
// @version      0.4.0
// @author       sutie
// @description  优化掘金的页面样式.
// @license      MIT
// @icon         https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web//static/favicons/favicon-32x32.png
// @match        https://juejin.cn/*
// @grant        none
// @run-at       document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/457897/%5B%E6%8E%98%E9%87%91%5D%E6%A0%B7%E5%BC%8F%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/457897/%5B%E6%8E%98%E9%87%91%5D%E6%A0%B7%E5%BC%8F%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
  "use strict";
  const name = "juejin-style-pref";
  function insertStyle(id) {
    const style = document.createElement("style");
    style.id = id;
    style.innerHTML = `
.nav-item.link-item.download-icon,
.nav-item.vip-entry,
.special-activity,
.add-group > svg,
.timeline-content > .aside,
.btn.meiqia-btn {
  display: none !important;
}
.timeline-entry-list {
  margin-right: 0 !important;
}
#juejin > .view-container.container {
  max-width: 100% !important;
}
#juejin > .view-container.container > .container.with-view-nav {
  max-width: calc(100% - 2rem) !important;
}
#juejin > .view-container > .container.main-container {
  max-width: calc(100% - 7rem) !important;
  margin-right: 1rem;
}
.article-suspended-panel {
  margin-left: -5rem !important;
}
.main-area.article-area,
.main-area.recommended-area {
  width: auto !important;
  margin-right: 26rem !important;
}
.timeline-entry-list {
  width: auto !important;
}
#comment-box {
  max-width: 100% !important;
}  
`;
    document.head.appendChild(style);
  }
  function main() {
    const id = `id-${name}`;
    let times = 10;
    let timer = setInterval(() => {
      const style = document.getElementById(id);
      if (!style) {
        insertStyle(id);
      }
      if (document.readyState === "complete") {
        times -= 1;
      }
      if (times < 0) {
        clearInterval(timer);
      }
    }, 300);
  }
  main();
})();
