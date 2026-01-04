// ==UserScript==
// @name         哔哩哔哩小黑屋（封禁）体验
// @namespace    http://tampermonkey.net/
// @version      0.2
// @icon         https://www.bilibili.com/favicon.ico
// @description  哔哩哔哩（bilibili.com）小黑屋（封禁）体验，当然不是真正的封禁，关闭本脚本即可恢复。
// @author       kylin
// @grant    GM_addStyle
// @match        *://*.bilibili.com/*
// @downloadURL https://update.greasyfork.org/scripts/423352/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%B0%8F%E9%BB%91%E5%B1%8B%EF%BC%88%E5%B0%81%E7%A6%81%EF%BC%89%E4%BD%93%E9%AA%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/423352/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%B0%8F%E9%BB%91%E5%B1%8B%EF%BC%88%E5%B0%81%E7%A6%81%EF%BC%89%E4%BD%93%E9%AA%8C.meta.js
// ==/UserScript==

(function() {
  'use strict';
  let css =`
  .mini-upload,.bilibili-player-video-inputbar,.comment-send,.elec{
    display:none !important
  }

  #arc_toolbar_report,.btn-hover,.like,.hate,.btn-panel,.message,.h-action{
    visibility: hidden !important
  }

  `
  GM_addStyle(css)

})();