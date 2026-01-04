// ==UserScript==
// @name         学习通学习次数
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  🥇支持学习通的学习次数自动刷新增加！打开学习通中任意课程的章节内容，自动刷新，增加学习次数。
// @author       haibing
// @match        *://mooc1.chaoxing.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/445916/%E5%AD%A6%E4%B9%A0%E9%80%9A%E5%AD%A6%E4%B9%A0%E6%AC%A1%E6%95%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/445916/%E5%AD%A6%E4%B9%A0%E9%80%9A%E5%AD%A6%E4%B9%A0%E6%AC%A1%E6%95%B0.meta.js
// ==/UserScript==

(function() {
  'use strict';

  setInterval(() => {
    window.location.reload(true)
  }, 10000)//10000为刷新的间隔时间，单位为毫秒
})();