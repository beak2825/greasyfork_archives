// ==UserScript==
// @name         b站大会员1080p弹窗去除
// @namespace    agan
// @version      0.1
// @description  删除b站大会员1080p弹窗
// @author       agan
// @match        *.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?domain=bilibili.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435592/b%E7%AB%99%E5%A4%A7%E4%BC%9A%E5%91%981080p%E5%BC%B9%E7%AA%97%E5%8E%BB%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/435592/b%E7%AB%99%E5%A4%A7%E4%BC%9A%E5%91%981080p%E5%BC%B9%E7%AA%97%E5%8E%BB%E9%99%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';



const app = document.querySelector('#app');
const config = { childList: true, subtree: true };

const callback = (mutationsList) => {
  mutationsList.forEach((record) => {
    const { type, addedNodes } = record;
    if (type == 'childList') {
      if (addedNodes.length > 0) {
        console.log(addedNodes);
        [...addedNodes].forEach((node) => {
          if (node.className.includes('popup-1080p-wrapper')) {
            node.remove();
          }
        });
      }
    }
  });
};

const observer = new MutationObserver(callback);

// 以上述配置开始观察目标节点
observer.observe(app, config);


  // Your code here...
})();