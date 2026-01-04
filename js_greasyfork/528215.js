// ==UserScript==
// @name         自动跳转intercom链接
// @namespace    http://tampermonkey.net/
// @description  用于临时测试帮助文档是否可访问。
// @version      2025-02-27
// @description  try to take over the world!
// @author       liaw
// @match        https://help.jodoo.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jodoodevelop.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528215/%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%ACintercom%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/528215/%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%ACintercom%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';
  const pathname = window.location.pathname;
  const domin = 'https://help-test.jodoodevelop.com';
  const url = domin + pathname;
  window.location.href = url;
})();