// ==UserScript==
// @name         学习通章节学习次数—i-New谢志浩
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  🥇支持学习通的学习次数自动刷新增加！打开学习通中任意课程的章节内容，自动刷新，增加学习次数。
// @author       haibing
// @match        *://mooc1.chaoxing.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/468288/%E5%AD%A6%E4%B9%A0%E9%80%9A%E7%AB%A0%E8%8A%82%E5%AD%A6%E4%B9%A0%E6%AC%A1%E6%95%B0%E2%80%94i-New%E8%B0%A2%E5%BF%97%E6%B5%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/468288/%E5%AD%A6%E4%B9%A0%E9%80%9A%E7%AB%A0%E8%8A%82%E5%AD%A6%E4%B9%A0%E6%AC%A1%E6%95%B0%E2%80%94i-New%E8%B0%A2%E5%BF%97%E6%B5%A9.meta.js
// ==/UserScript==

(function() {
  'use strict';

  setInterval(() => {
    window.location.reload(true)
  }, 30000)
})();