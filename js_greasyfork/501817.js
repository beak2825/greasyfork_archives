// ==UserScript==
// @name        New script foundersc
// @namespace   Violentmonkey Scripts
// @match       http://eoa.foundersc.com/sys/attachment/sys_att_main/sysAttMain.do*
// @grant       none
// @version     1.0
// @author      -
// @description 2020/5/26 08:47:37
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/501817/New%20script%20foundersc.user.js
// @updateURL https://update.greasyfork.org/scripts/501817/New%20script%20foundersc.meta.js
// ==/UserScript==
(function() {
  'use strict';
  const hideElements = () => {
    // 隐藏class为'mask_div'的元素
    const maskDivs = document.querySelectorAll('.mask_div');
    for (const maskDiv of maskDivs) {
      maskDiv.style.display = 'none';
    }
    // // 隐藏id为'readerTop'的元素
    // const readerTop = document.getElementById('readerTop');
    // if (readerTop) {
    //   readerTop.style.display = 'none';
    // }
    // // 隐藏id为'readerBottom'的元素
    // const readerBottom = document.getElementById('readerBottom');
    // if (readerBottom) {
    //   readerBottom.style.display = 'none';
    // }
  };
  // 创建一个MutationObserver实例来监听DOM变化
  const observer = new MutationObserver(hideElements);
  // 开始观察document.body的变化，特别是子元素列表和子树
  observer.observe(document.body, { childList: true, subtree: true });
  // 初始调用，以隐藏页面上已有的元素
  hideElements();
})();