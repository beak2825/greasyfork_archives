// ==UserScript==
// @name        随缘居关键词屏蔽
// @namespace   https://tampermonkey.net/
// @version     0.1
// @description 屏蔽网站中包含指定关键词的条目
// @author      musuyushi
// @match       http*://www.mtslash.xyz/search.php*
// @match       http*://www.mtslash.xyz/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/513869/%E9%9A%8F%E7%BC%98%E5%B1%85%E5%85%B3%E9%94%AE%E8%AF%8D%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/513869/%E9%9A%8F%E7%BC%98%E5%B1%85%E5%85%B3%E9%94%AE%E8%AF%8D%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // 自行设置关键词列表，格式如下
  let blockWordsArray = ['标题关键词1','标题关键词2','作者id1','作者id2'];

  // 屏蔽帖子函数，适用于主页和搜索页面
  function blockPosts() {
    // 获取搜索结果页的条目
    const threadList = document.getElementById("threadlist");
    if (threadList) {
      const threads = threadList.querySelectorAll("li.pbw");

      // 遍历每个搜索结果条目
      threads.forEach(function(thread) {
        const title = thread.querySelector("h3.xs3 a");
        blockWordsArray.forEach(word => {
          if (title.textContent.includes(word)) {
            thread.style.display = "none";
            return;
          }
        });
      });
    }

    // 获取主页的帖子
    let elementsArray = Array.from(document.getElementsByTagName('tbody'));
    elementsArray = elementsArray.filter(el => el.id && el.id.startsWith('normalthread_'));

    for (let el of elementsArray) {
      let elementText = el.textContent.toLowerCase();
      for (let word of blockWordsArray) {
        if (elementText.includes(word.toLowerCase())) {
          el.style.display = 'none';
          console.log(`帖子已隐藏`);
          break;
        }
      }
    }
  }

  // 初次执行屏蔽逻辑
  blockPosts();

  // 监听 DOM 变化的回调函数
  const observer = new MutationObserver((mutationsList) => {
    for (let mutation of mutationsList) {
      if (mutation.type === 'childList') {
        blockPosts(); // 当新内容加载时重新执行屏蔽
      }
    }
  });

  // 监听页面内容变化
  observer.observe(document.body, { childList: true, subtree: true });

  // 添加样式隐藏特定元素
  var style = document.createElement('style');
  style.innerHTML = `
    .mtw.mbw {
        display: none;
    }
  `;
  document.head.appendChild(style);

})();

