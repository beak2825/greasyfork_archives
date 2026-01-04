// ==UserScript==
// @name         畅想之星id助手
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  在资源页面显示ruid
// @author       Xinconan
// @match        https://www.cxstar.com/Book/*
// @match        https://cxstar.com/Book/*
// @match        https://*/interlibSSO/goto/*/++9bwrs-q9bnl/*
// @match        http://*/interlibSSO/goto/*/++9bwrs-q9bnl/*
// @match        http://*/vpn/54/https/www.cxstar.com/Book/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cxstar.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474174/%E7%95%85%E6%83%B3%E4%B9%8B%E6%98%9Fid%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/474174/%E7%95%85%E6%83%B3%E4%B9%8B%E6%98%9Fid%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const customStyles = `
  .book-list-item,.subject_container{
  position:relative;
  }
  .book-ruid{
    position: absolute;
    right: 15px;
    top: 60px;
    color:#ff1a14;
    font-size: 16px;
  }
  `;

  function insertId(node) {
    const dataId = node.getAttribute('data-id');
    if (dataId) {
      // 将 data-id 值插入到列表中
      const listItem = document.createElement('div');
      listItem.classList = 'book-ruid';
      listItem.textContent = `${dataId}`;
      node.appendChild(listItem);
    }
  }

  function observe(targetList) {
    if (!targetList) {
      return;
    }
    // 创建一个监听器来监视节点插入和属性变化
    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.type === 'childList') {
          // 当有新节点插入时，找到插入的节点并提取 data-id 值
          mutation.addedNodes.forEach(function (node) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              insertId(node);
            }
          });
        }
      });
    });

    // 开始监听列表的变化
    observer.observe(targetList, { childList: true, subtree: true });

    // 对于已经存在的元素，也进行处理
    const elements = targetList.querySelectorAll('[data-id]');
    if (elements) {
      elements.forEach((item) => {
        insertId(item);
      });
    }
  }

  // 监听列表变化的函数
  function watchListChanges() {
    const searchList = document.querySelector('.search-main-list');
    const subjectList = document.querySelector('.subject-main-list');
    observe(searchList);
    observe(subjectList);
  }

  // 使用GM_addStyle函数添加样式
  GM_addStyle(customStyles);

  // 在页面加载完成后调用监听函数
  window.addEventListener('load', watchListChanges);
})();
