// ==UserScript==
// @name           知乎屏蔽登录
// @namespace      http://tampermonkey.net/
// @version        1.0
// @description    屏蔽知乎的登录界面
// @author         Howxcheng
// @match          *://*.zhihu.com/*
// @homepageURL    https://github.com/howxcheng/RemoveZhihuLogin
// @supportURL     https://github.com/howxcheng/RemoveZhihuLogin/issues
// @icon           https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://zhihu.com&size=16
// @license        MIT
// @run-at         document-start
// @grant          unsafeWindow
// @grant          GM_xmlhttpRequest
// @grant          GM_getResourceText
// @grant          GM_notification
// @grant          GM_openInTab
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/454873/%E7%9F%A5%E4%B9%8E%E5%B1%8F%E8%94%BD%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/454873/%E7%9F%A5%E4%B9%8E%E5%B1%8F%E8%94%BD%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function () {
  "use strict";
  var count = 0;
  var timer = setInterval(changeEvent, 300);
  function changeEvent() {
    if (document.readyState === "complete") {
      count++;
      var dialog = document.querySelector("div[class='Modal-inner']");
      if (dialog !== null) {
        var close_button = document.querySelector("button[class='Button Modal-closeButton Button--plain']");
        if (close_button !== null) {
          close_button.click();
          clearInterval(timer);
          return;
        }
      }
      if (count > 10) {
        clearInterval(timer);
        return;
      }
    }
  }
})();
