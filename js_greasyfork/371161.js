// ==UserScript==
// @namespace   VA_i
// @version     4.0.0.20180814
// @grant       unsafeWindow
// @include     /^https?://(?:tieba\.baidu\.com|www\.tieba\.com)//
// @include     /^https?://dq.tieba.com//
// @run-at      document-start
// @name        Baidu Tieba: No Login
// @name:zh-CN  百度贴吧：不登录即可看贴
// @name:zh-TW  百度贴吧：不登入即可看貼
// @description View Baidu Tieba without login.
// @description:zh-CN 百度贴吧看贴（包括楼中楼）无须登录。
// @description:zh-TW 百度贴吧看貼（包括樓中樓）無須登入。
// @downloadURL https://update.greasyfork.org/scripts/371161/Baidu%20Tieba%3A%20No%20Login.user.js
// @updateURL https://update.greasyfork.org/scripts/371161/Baidu%20Tieba%3A%20No%20Login.meta.js
// ==/UserScript==

unsafeWindow.Object.freeze = null;

document.addEventListener('DOMContentLoaded', function (event) {
  try {
    unsafeWindow.PageData.user.is_login = 1;
  } catch (error) {
    //alert(error);
  }
}, true);
