// ==UserScript==
// @name        路由器显示隐藏设置
// @namespace   Violentmonkey Scripts
// @match       http://192.168.*.*/*
// @grant       none
// @version     1.0
// @author      lqs1848
// @run-at       document-end.
// @description 2025/8/1 13:33:00
// @supportURL  https://blog.lqs1848.top/
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/544259/%E8%B7%AF%E7%94%B1%E5%99%A8%E6%98%BE%E7%A4%BA%E9%9A%90%E8%97%8F%E8%AE%BE%E7%BD%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/544259/%E8%B7%AF%E7%94%B1%E5%99%A8%E6%98%BE%E7%A4%BA%E9%9A%90%E8%97%8F%E8%AE%BE%E7%BD%AE.meta.js
// ==/UserScript==
'use strict';

function removeDisplayNone(){
  const allElements = document.querySelectorAll('tr');
  allElements.forEach(element => {
      const computedStyle = window.getComputedStyle(element);
      if (computedStyle.display === 'none') {
          element.style.display = '';
      }
  });
}

const targetNode = document;
const config = { attributes: true, childList: true, subtree: true};
const callback = function(mutationsList, observer) {
    removeDisplayNone();
};
const observer = new MutationObserver(callback);
observer.observe(targetNode, config);
