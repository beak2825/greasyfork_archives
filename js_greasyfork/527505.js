// ==UserScript==
// @name         Linux.do 显示楼层号
// @name:en      Linux.do Floor Number Display
// @namespace    https://greasyfork.org/zh-TW/users/1252908-eep
// @version      0.2.0
// @description  在 Linux.do 论坛帖子中显示楼层号，并处理过长的用户名显示
// @description:en  Display floor numbers in Linux.do forum posts and handle long usernames
// @author       EEP
// @license      MIT
// @match        https://linux.do/*
// @icon         https://linux.do/favicon.ico
// @grant        none
// @run-at       document-end
// @supportURL   https://github.com/[你的GitHub用户名]/[仓库名]/issues
// @homepageURL  https://github.com/[你的GitHub用户名]/[仓库名]
// @tag          linux
// @tag          linux.do
// @tag          forum
// @tag          discourse
// @downloadURL https://update.greasyfork.org/scripts/527505/Linuxdo%20%E6%98%BE%E7%A4%BA%E6%A5%BC%E5%B1%82%E5%8F%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/527505/Linuxdo%20%E6%98%BE%E7%A4%BA%E6%A5%BC%E5%B1%82%E5%8F%B7.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 修改样式部分
  const style = document.createElement('style');
  style.textContent = `
        .floor-number {
            margin-left: 8px;
            color: #666;
            font-size: 12px;
        }
        .names.trigger-user-card {
            display: flex;
            align-items: center;
        }
        .first.full-name {
            max-width: 200px;
        }
        .first.full-name a {
            display: block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        /* 添加对 post-infos 中用户名的控制 */
        .post-infos a {
            max-width: 200px;
            display: inline-block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            vertical-align: bottom;
        }
    `;
  document.head.appendChild(style);

  // 主函数
  function addFloorNumbers() {
    const posts = document.querySelectorAll('.topic-post');
    const postOwner = document.querySelectorAll('.topic-owner');

    postOwner.forEach((post) => {
      const namesDiv = post.querySelector('.names.trigger-user-card');
      const usernameSpan = namesDiv.querySelector('span.first');
      if (!usernameSpan.querySelector('.op-marker')) {
        const opMark = document.createElement('b');
        opMark.className = 'op-marker';
        opMark.textContent = '楼主';
        opMark.style.color = 'red';
        opMark.style.fontWeight = 'bold';
        opMark.style.marginLeft = '5px';
        opMark.style.fontSize = '12px';
        opMark.style.padding = '2px 4px';
        opMark.style.borderRadius = '4px';
        opMark.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
        opMark.style.display = 'inline-block';
        opMark.style.textAlign = 'center';
        usernameSpan.appendChild(opMark);
      }
    })

    posts.forEach((post) => {
      const article = post.querySelector('article');
      if (!article) return;

      const floorNumber = article.id.replace('post_', '');
      const namesDiv = post.querySelector('.names.trigger-user-card');

      if (namesDiv && !namesDiv.querySelector('.floor-number')) {
        const floorSpan = document.createElement('span');
        floorSpan.className = 'floor-number';
        floorSpan.textContent = `#${floorNumber}`;
        namesDiv.appendChild(floorSpan);
      }
    });
  }

  // 初始执行
  addFloorNumbers();

  // 监听动态加载的内容
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length) {
        addFloorNumbers();
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
})();
