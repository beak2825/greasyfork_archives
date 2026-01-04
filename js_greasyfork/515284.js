// ==UserScript==
// @name         水源自贴表情筛选（Beta版）
// @version      0.22b
// @namespace    http://tampermonkey.net/
// @description  Detect if a user has posted a retort for their own post.
// @author       Rosmontis & Sinsimito
// @match        https://shuiyuan.sjtu.edu.cn/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/515284/%E6%B0%B4%E6%BA%90%E8%87%AA%E8%B4%B4%E8%A1%A8%E6%83%85%E7%AD%9B%E9%80%89%EF%BC%88Beta%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/515284/%E6%B0%B4%E6%BA%90%E8%87%AA%E8%B4%B4%E8%A1%A8%E6%83%85%E7%AD%9B%E9%80%89%EF%BC%88Beta%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 更新的计数器
  let retortCount = 1;

  // CSS样式
  const style = document.createElement("style");
  style.textContent = `
    .post-retort.post-retort--own {
      background-color: var(--highlight-medium);
    }
  `;
  document.head.appendChild(style);

  // 处理帖子
  function processPost(post) {
    if (post.getAttribute("data-retort-count") === retortCount.toString())
      return;
    post.setAttribute("data-retort-count", retortCount);

    const usernameElement = post.querySelector(".username a");
    if (!usernameElement) return;
    const username = usernameElement.textContent.trim();
    const retorts = post.querySelectorAll(".post-retort");

    retorts.forEach((retort) => {
      const firstUser = retort
        .querySelector(".post-retort__tooltip")
        .textContent.split("，")[0]
        .split(" ")[0]
        .trim();
      if (firstUser === username) {
        // 给自己的表情加上类名
        retort.classList.add("post-retort--own");
      } else if (retort.classList.contains("post-retort--own")) {
        // 移除之前加上的类名
        retort.classList.remove("post-retort--own");
      }

      // 添加点击事件监听器
      retort.removeEventListener("click", () => {});
      retort.addEventListener("click", () => {
        // 处理点击事件时延时并调用 processPost
        retortCount++;
        setTimeout(() => {
          processPost(post);
        }, 500);
      });
    });
  }

  function processNode(node) {
    if (
      node.nodeType === Node.ELEMENT_NODE &&
      node.classList.contains("post-retort")
    ) {
      // 处理新增的表情
      processNewRetort(node);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const posts = node.querySelectorAll(".row");
      // 处理所有新的帖子
      if (posts.length) {
        posts.forEach(processPost);
      } else {
        const retort = node.querySelectorAll(".post-retort");
        // 处理所有新的表情
        retort.forEach(processNewRetort);
      }
    }
  }

  // 处理新的表情
  function processNewRetort(retort) {
    // 检测目前的更新计数器
    const row = retort.closest(".row");
    if (!row) return;
    // 处理帖子
    processPost(row);
  }

  // 改为监视新的表情
  function handleNewRetorts(mutationsList, observer) {
    retortCount++;
    for (let mutation of mutationsList) {
      if (mutation.type === "childList") {
        mutation.addedNodes.forEach(processNode);
        mutation.removedNodes.forEach((node) => {
          if (
            node.nodeType === Node.ELEMENT_NODE &&
            node.classList.contains("post-retort")
          ) {
            // 处理删除的表情
            processNode(mutation.target);
          }
        });
      }
    }
  }

  // 初始化：处理所有已有的表情
  document.querySelectorAll(".post-retort").forEach(processNewRetort);

  // 设置MutationObserver来监视新表情
  const observer = new MutationObserver(handleNewRetorts);
  observer.observe(document.body, { childList: true, subtree: true });
})();
