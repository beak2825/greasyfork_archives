// ==UserScript==
// @name         简书推荐屏蔽
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  屏蔽简书右侧和正文下方的垃圾推荐
// @author       Annunx
// @match        *://www.jianshu.com/p/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jianshu.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/460107/%E7%AE%80%E4%B9%A6%E6%8E%A8%E8%8D%90%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/460107/%E7%AE%80%E4%B9%A6%E6%8E%A8%E8%8D%90%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(function () {
  'use strict';
  window.onload = function () {
    removeJanshuRecommend()
    automaticOpening()
  }

  // 清理元素
  function removeJanshuRecommend() {
    document.getElementsByTagName('aside')[0].remove()
    const sections = document.querySelectorAll('section')
    if (sections.length > 0) {
      sections[1].remove()
    }
  }
  // 长文自动展开
  function automaticOpening() {
    const btn = document.querySelector(".close-collapse-btn")
    if (btn) {
      btn.click()
    }
  }
})();
