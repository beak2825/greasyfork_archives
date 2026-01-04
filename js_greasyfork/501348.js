// ==UserScript==
// @name         优化掘金的样式
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      0.1.0
// @description  优化掘金的样式，去除了一些ai的广告
// @icon         https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web//static/favicons/favicon-32x32.png
// @author       leftover
// @run-at       document-start
// @match        https://juejin.cn/*
// @downloadURL https://update.greasyfork.org/scripts/501348/%E4%BC%98%E5%8C%96%E6%8E%98%E9%87%91%E7%9A%84%E6%A0%B7%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/501348/%E4%BC%98%E5%8C%96%E6%8E%98%E9%87%91%E7%9A%84%E6%A0%B7%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    const style = document.createElement("style");
    style.id = "leftover";
    style.innerHTML = `
     .context-menu {
     display: none !important;
     }
     .adverts-list {
      display: none !important;
     }
     .sidebar-block.wechat-sidebar-block.pure.wechat-ad {
        display: none !important;
     }
     .btn.btn-ai {
     display: none !important;
     }
     .more-btn {
       display: none !important;
     }
    `
     document.head.appendChild(style);
})();