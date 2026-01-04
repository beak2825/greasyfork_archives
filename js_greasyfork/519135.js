// ==UserScript==
// @name         水源帖子信息复制工具
// @namespace    https://github.com/xzcxzcyy
// @version      0.5
// @description  复制帖子信息，包括主题ID、帖子ID和用户名
// @match        https://shuiyuan.sjtu.edu.cn/*
// @grant        none
// @author       xzcxzcyy
// @homepage     https://github.com/xzcxzcyy
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519135/%E6%B0%B4%E6%BA%90%E5%B8%96%E5%AD%90%E4%BF%A1%E6%81%AF%E5%A4%8D%E5%88%B6%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/519135/%E6%B0%B4%E6%BA%90%E5%B8%96%E5%AD%90%E4%BF%A1%E6%81%AF%E5%A4%8D%E5%88%B6%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 创建样式
  const style = document.createElement('style');
  style.textContent = `
    .post-avatar {
        width: auto !important;
        position: relative;
    }
    .copy-post-info-button {
        position: absolute;
        bottom: 7px; /* 调整按钮位置 */
        right: 48px;
        font-size: 10px; /* 调整字体大小 */
        padding: 4px 8px; /* 调整按钮内边距 */
        background-color: rgba(240, 240, 240, 0.9);
        border: 1px solid #ccc;
        border-radius: 5px;
        cursor: pointer;
        z-index: 10;
    }
    .copy-post-info-button:hover {
        background-color: #e0e0e0;
    }
  `;
  document.head.appendChild(style);

  // 复制信息的函数
  function copyPostInfo(postElement) {
    const topicId = postElement.getAttribute('data-topic-id');
    const postId = postElement.getAttribute('id').split('_')[1];
    const username = postElement.querySelector('.topic-avatar a').getAttribute('data-user-card');

    if (topicId && postId && username) {
      var postInfo;
      if (postId === "1") {
        postInfo = `话题编号：${topicId}\n\n账号：@${username}`;
      } else {
        postInfo = `帖子编号：${topicId}/${postId}\n\n账号：@${username}`;
      }
      copyToClipboard(postInfo);
      alert(`${postInfo}`);
    }
  }

  // 将信息复制到剪贴板的辅助函数
  function copyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  }

  // 为每个帖子添加复制信息按钮
  function addCopyButton(postElement) {
    if (postElement.querySelector('.copy-post-info-button')) return; // 防止重复添加按钮

    const button = document.createElement('button');
    button.textContent = '复制';
    button.className = 'copy-post-info-button';
    button.onclick = function (e) {
      e.preventDefault();
      e.stopPropagation();
      copyPostInfo(postElement);
    };

    const postAvatar = postElement.querySelector('.post-avatar');
    if (postAvatar) {
      postAvatar.appendChild(button);
    }
  }

  // 处理页面上所有现有的帖子
  function processPosts() {
    document.querySelectorAll('.boxed.onscreen-post').forEach(addCopyButton);
  }

  // 初始处理
  processPosts();

  // 使用 MutationObserver 监视新添加的内容
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        processPosts();
      }
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
