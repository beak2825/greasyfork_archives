// ==UserScript==
// @name         splunk search
// @name:zh-CN   splunk快速搜索
// @namespace    http://tampermonkey.net/
// @version      0.15
// @description  通过键入 `option + r` 来实现splunk快速搜索!
// @author       https://github.com/zzailianlian
// @license      MIT
// @match        http://splunk.ali.plt.babytree-inc.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=babytree-inc.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442300/splunk%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/442300/splunk%20search.meta.js
// ==/UserScript==

(function () {
  'use strict';
  document.onkeydown = function (event) {
    var e = event || window.event;
    console.log(e, e.keyCode);
    if (e && e.altKey && e.keyCode == 82) {
      // 按 Mac 的 option + r 或者 Windows 的Alt + r
      // 重新搜索splunk
      document.querySelector("body > div.shared-page > div.main-section-body > div > div.section-padded.section-header > div.search-bar-wrapper.shared-searchbar > form > table > tbody > tr > td.search-button > a").click()
    }
    if (e && e.keyCode == 27) { // 按 Esc
      //...
    }
    if (e && e.keyCode == 113) { // 按 F2
      //...
    }
    if (e && e.keyCode == 13) { // enter 键
      //...
    }
  };
})();