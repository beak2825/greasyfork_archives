// ==UserScript==
// @name         掘金课程返现助手
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  修改课程列表页面链接，达到购买掘金课程返现功能
// @author       Xinconan
// @match        https://juejin.cn/course
// @icon         https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/static/favicons/favicon-32x32.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/496512/%E6%8E%98%E9%87%91%E8%AF%BE%E7%A8%8B%E8%BF%94%E7%8E%B0%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/496512/%E6%8E%98%E9%87%91%E8%AF%BE%E7%A8%8B%E8%BF%94%E7%8E%B0%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function insertId(node) {
    const clsName = node.getAttribute('class');
    if (clsName && clsName.includes('book-item')) {
      const href = node.getAttribute('href').replace('utm_source=course_list', '');
      node.setAttribute('href', href + 'suid=3227821869634334&source=android')
    }
  }

  function observe(targetList) {
    if (!targetList) {
      return;
    }
    // 创建一个监听器来监视节点插入和属性变化
    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.type === 'childList') {
          // 当有新节点插入时，找到插入的节点
          mutation.addedNodes.forEach(function (node) {
            if (node.nodeType === Node.ELEMENT_NODE && node.nodeName.toLowerCase() === 'a') {
              // console.log(node.nodeName, node)
              insertId(node);
            }
          });
        }
      });
    });

    // 开始监听列表的变化
    observer.observe(targetList, { childList: true, subtree: true });

    // 对于已经存在的元素，也进行处理
    const elements = targetList.querySelectorAll('.book-item');
    if (elements) {
      elements.forEach((item) => {
        insertId(item);
      });
    }
  }

  // 监听列表变化的函数
  function watchListChanges() {
    const searchList = document.querySelector('.books-view');
    observe(searchList);
  }

  // 在页面加载完成后调用监听函数
  window.addEventListener('load', watchListChanges);
})();