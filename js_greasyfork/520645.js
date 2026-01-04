// ==UserScript==
// @name         bilibili - 去除热搜
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  去除bilibili热搜
// @author       removing400
// @run-at document-start
// @match      *://www.bilibili.com/*
// @match      *://t.bilibili.com/*
// @icon         https://i0.hdslb.com/bfs/static/jinkela/long/images/favicon.ico
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/520645/bilibili%20-%20%E5%8E%BB%E9%99%A4%E7%83%AD%E6%90%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/520645/bilibili%20-%20%E5%8E%BB%E9%99%A4%E7%83%AD%E6%90%9C.meta.js
// ==/UserScript==

(function () {
  "use strict";
  const MutationObserver = window.MutationObserver;
  const config = {
    childList: true,
    subtree: true,
  }; 
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        Array.from(mutation.addedNodes).map(node=>{
          if (node instanceof Element &&node.innerHTML.includes("bilibili热搜")) {
            node.hidden=true
          }
          if (node instanceof Element &&node.nodeName==="SECTION"&&node.className.includes("sticky")) {
             node.remove()
          }
        })
      }
    }
  });
    // 等待指定元素加载
    const waitForElement = (selector, timeout = 10000) => {
      return new Promise((resolve, reject) => {
        const interval = 100; // 检测间隔
        let elapsed = 0;
  
        const check = setInterval(() => {
          const element = document.querySelector(selector);
          if (element) {
            clearInterval(check);
            resolve(element);
          } else if (elapsed >= timeout) {
            clearInterval(check);
            reject(`元素 ${selector} 超时未加载`);
          } else {
            elapsed += interval;
          }
        }, interval);
      });
    };
  document.addEventListener("DOMContentLoaded", function () {
    observer.observe(document.body, config);
    if(window.location.href.includes("://t.bilibili.com")){
      waitForElement('aside.right').then(e=>{
        e.hidden=true
      })
    }

  })
})();
