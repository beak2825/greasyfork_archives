// ==UserScript==
// @name        渣渣辉学习通自动刷新页面
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动刷学习次数，点击随机一个视频挂机即可，次数在统计中查看
// @author       Nonesuch
// @match        https://*.chaoxing.com/mycourse/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444747/%E6%B8%A3%E6%B8%A3%E8%BE%89%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/444747/%E6%B8%A3%E6%B8%A3%E8%BE%89%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

  // Your code here...
  setInterval(() => {
    window.location.reload(true)
  }, 15000) // 15000代表每15000毫秒会刷新一次
})();