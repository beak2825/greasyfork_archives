// ==UserScript==
// @name         外链直接跳转(CSDN、掘金、简书、知乎...)
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  自动跳转，CSDN、掘金、简书、知乎、LeetCode等网站的跳转询问界面的自动跳转
// @author       荣顶
// @icon         https://greasyfork.org/packs/media/images/blacklogo16-5421a97c75656cecbe2befcec0778a96.png
// @license      MIT
// @match        *://link.csdn.net/*
// @match        *://link.juejin.cn/*
// @match        *://link.zhihu.com/*
// @match        *://www.jianshu.com/go-wild*
// @match        *://leetcode-cn.com/link/?target=*
// @match        *://leetcode.cn/link/?target=*

// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/447084/%E5%A4%96%E9%93%BE%E7%9B%B4%E6%8E%A5%E8%B7%B3%E8%BD%AC%28CSDN%E3%80%81%E6%8E%98%E9%87%91%E3%80%81%E7%AE%80%E4%B9%A6%E3%80%81%E7%9F%A5%E4%B9%8E%29.user.js
// @updateURL https://update.greasyfork.org/scripts/447084/%E5%A4%96%E9%93%BE%E7%9B%B4%E6%8E%A5%E8%B7%B3%E8%BD%AC%28CSDN%E3%80%81%E6%8E%98%E9%87%91%E3%80%81%E7%AE%80%E4%B9%A6%E3%80%81%E7%9F%A5%E4%B9%8E%29.meta.js
// ==/UserScript==

(function () {
  'use strict';
  // Your code here...
  const url = document.URL;
  let target = '';
  if (url.match(/jianshu.com\/go-wild/)) {
    target = url.split('url=')[1];
  } else {
    target = url.split('target=')[1];
  }
  target = decodeURIComponent(target);
  window.location.href = target;
})();
