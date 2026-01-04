// ==UserScript==
// @name         屏蔽 leetcode 的 Ctrl + S 按键，与烦人的banner。
// @namespace    http://tampermonkey.net/
// @version      0.4.0
// @description  try to take over the world!
// @author       ermao
// @match      *://*.leetcode.com/*
// @run-at document-body
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39944/%E5%B1%8F%E8%94%BD%20leetcode%20%E7%9A%84%20Ctrl%20%2B%20S%20%E6%8C%89%E9%94%AE%EF%BC%8C%E4%B8%8E%E7%83%A6%E4%BA%BA%E7%9A%84banner%E3%80%82.user.js
// @updateURL https://update.greasyfork.org/scripts/39944/%E5%B1%8F%E8%94%BD%20leetcode%20%E7%9A%84%20Ctrl%20%2B%20S%20%E6%8C%89%E9%94%AE%EF%BC%8C%E4%B8%8E%E7%83%A6%E4%BA%BA%E7%9A%84banner%E3%80%82.meta.js
// ==/UserScript==
// 参考 https://stackoverflow.com/questions/11000826/ctrls-preventdefault-in-chrome 上 BumbleB2na 用户的回答。

document.addEventListener('DOMContentLoaded', () => {
  // Create an observer instance
  const observer = new MutationObserver(mutationsList => {
    for (let mutation of mutationsList) {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(node => {
          if (node.classList && node.classList.contains("border-border-tertiary") && node.classList.contains("cn-guide-banner")) {
            node.remove();
          }
          if (node.className == "border-border-tertiary dark:border-border-tertiary  items-center justify-center border-b-[1px] border-solid  bannerForCn__1dgb"
            || node.className == "border-border-tertiary dark:border-border-tertiary  items-center justify-center border-b-[1px] border-solid  C6UnP"
          ){
            node.remove();
          }
        });
      }
    }
  });

  // Start observing the document body for added nodes
  observer.observe(document.body, { childList: true, subtree: true });
});