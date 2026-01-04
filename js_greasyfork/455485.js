// ==UserScript==
// @name         学习通自动下一课
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动刷学习次数，打开课程第一个然后挂机即可，次数在统计中查看
// @author       Ljcbaby
// @match        https://*.chaoxing.com/mycourse/studentstudy?*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455485/%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/455485/%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E8%AF%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

  // Your code here...
  setInterval(() => {
    var btn=document.querySelector('#prevNextFocusNext');
    btn.click();
  }, 15000) // 15000代表每15000毫秒会刷新一次
})();