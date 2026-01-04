// ==UserScript==
// @name         Handhelds自動點擊確認使用者的「確定」按鈕
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  當彈出確認使用者的對話框時，自動點擊「確定」按鈕
// @author       shanlan(ChatGPT o3-mini)
// @match        https://docs.google.com/*/1irg60f9qsZOkhp0cwOU7Cy4rJQeyusEUzTNQzhoTYTU/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542742/Handhelds%E8%87%AA%E5%8B%95%E9%BB%9E%E6%93%8A%E7%A2%BA%E8%AA%8D%E4%BD%BF%E7%94%A8%E8%80%85%E7%9A%84%E3%80%8C%E7%A2%BA%E5%AE%9A%E3%80%8D%E6%8C%89%E9%88%95.user.js
// @updateURL https://update.greasyfork.org/scripts/542742/Handhelds%E8%87%AA%E5%8B%95%E9%BB%9E%E6%93%8A%E7%A2%BA%E8%AA%8D%E4%BD%BF%E7%94%A8%E8%80%85%E7%9A%84%E3%80%8C%E7%A2%BA%E5%AE%9A%E3%80%8D%E6%8C%89%E9%88%95.meta.js
// ==/UserScript==
new MutationObserver((_, obs) => {
  const d = document.querySelector('.modal-dialog.active-account-dialog'),
        b = document.querySelector("button[name='ok']");
  if (d) d.style.display = 'none';
  if (b) { b.click(); obs.disconnect(); }
}).observe(document.documentElement, { childList: true, subtree: true });