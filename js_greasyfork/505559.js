// ==UserScript==
// @name         知识星球样式优化(自用)
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  修改知识星球样式（自用）
// @match        https://wx.zsxq.com/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/505559/%E7%9F%A5%E8%AF%86%E6%98%9F%E7%90%83%E6%A0%B7%E5%BC%8F%E4%BC%98%E5%8C%96%28%E8%87%AA%E7%94%A8%29.user.js
// @updateURL https://update.greasyfork.org/scripts/505559/%E7%9F%A5%E8%AF%86%E6%98%9F%E7%90%83%E6%A0%B7%E5%BC%8F%E4%BC%98%E5%8C%96%28%E8%87%AA%E7%94%A8%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 添加自定义样式
  GM_addStyle(`
      .group-list-container {
          transition: transform 0.2s ease-out;
          background: #fff;
          z-index: 10;
      }
      #toggle-sidebar {
          height: 20px;
          font-size: 12px;
          margin-left: 10px;
          padding: 0px 6px;
          border-radius: 4px;
          cursor: pointer;
          color: rgb(80, 234, 203);
          background-color: rgba(52, 146, 112, 0.05);
          border: 1px solid rgba(65,183,140,.2);
      }
      #toggle-sidebar:hover {
          background-color: #e0e0e0;
      }
  `);

  function addRedBorder() {
    const listItems = document.querySelectorAll('.ng-star-inserted');
    listItems.forEach((item) => {
      const headerContainer = item.querySelector('.header-container');
      if (headerContainer) {
        const topicFlag = headerContainer.querySelector('.topic-flag');
        if (topicFlag) {
          const digestElement = topicFlag.querySelector('.digest');
          if (digestElement) {
            const topicContainer = item.querySelector('.topic-container');
            if (topicContainer) {
              topicContainer.style.border = '1px solid rgb(80, 234, 203)';
              topicContainer.style.backgroundColor = 'rgba(80, 234, 203, 0.1)';
            }
          }
        }
      }
    });
  }

  function setupSidebarToggle() {
    const sidebar = document.querySelector('.group-list-container');
    const logoContainer = document.querySelector('.logo-container');
    if (!sidebar || !logoContainer) return;

    const toggleButton = document.createElement('button');
    toggleButton.id = 'toggle-sidebar';
    toggleButton.textContent = '切换目录';
    logoContainer.appendChild(toggleButton);

    // 获取视口宽度
    const clientWidth = document.documentElement.clientWidth;
    const transX = clientWidth - 1526 / 2;

    // 默认隐藏侧边栏
    sidebar.classList.add('hide');
    // 设置hide样式
    if (sidebar.classList.contains('hide')) {
      sidebar.style.transform = 'translateX(calc(-100% - ' + transX + 'px))';
    } else {
      sidebar.style.transform = 'translateX(0)';
    }

    toggleButton.addEventListener('click', () => {
      sidebar.classList.toggle('hide');

      if (sidebar.classList.contains('hide')) {
        sidebar.style.transform = 'translateX(calc(-100% - ' + transX + 'px))';
      } else {
        sidebar.style.transform = 'translateX(0)';
      }
    });
  }

  function hideElements() {
    // 头部
    const headerContainer = document.querySelector('.header-container');

    if (headerContainer) {
      const redirect = headerContainer.querySelector('.redirect');
      const userAvatar = headerContainer.querySelector('.user-avatar');

      if (redirect) {
        redirect.style.display = 'none';
      }
      if (userAvatar) {
        userAvatar.style.display = 'none';
      }
    }

    const leftLogo = document.querySelector('.logo-container .left');
    const noteLogo = document.querySelector('.logo-container .note');
    if (leftLogo) {
      leftLogo.style.display = 'none';
    }
    if (noteLogo) {
      noteLogo.style.display = 'none';
    }

    // .topic-flow-container
    const topicFlowContainer = document.querySelector('.topic-flow-container');
    if (topicFlowContainer) {
      topicFlowContainer.style.setProperty('width', '100%', 'important');
      topicFlowContainer.style.setProperty('padding-left', '100px', 'important');
      topicFlowContainer.style.setProperty('padding-right', '100px', 'important');
    }

    // 主体上部分
    const topicContainer = document.querySelector('.topic-container');
    if (topicContainer) {
      const ngStarInserted = topicContainer.querySelector('.ng-star-inserted');
      if (ngStarInserted) {
        ngStarInserted.style.display = 'none';
      }
    }

    // 主体中部分
    const mainContentContainer = document.querySelector('.main-content-container');
    if (mainContentContainer) {
      mainContentContainer.style.setProperty('margin-left', '10%', 'important');
      mainContentContainer.style.setProperty('margin-right', '10%', 'important');
    }

    // 右侧边栏
    const groupPreviewContainer = document.querySelector('.group-preview-container');

    if (groupPreviewContainer) {
      groupPreviewContainer.style.display = 'none';
      // const groupInfoContainer = groupPreviewContainer.querySelector('.group-info-container');
      // const askContainer = groupPreviewContainer.querySelector('.ask-container');
      // const groupContent = groupPreviewContainer.querySelector('.group-content');

      // if (groupInfoContainer) {
      //   groupInfoContainer.style.display = 'none';
      // }

      // if (askContainer) {
      //   askContainer.style.display = 'none';
      // }

      // if (groupContent) {
      //   groupContent.style.display = 'none';
      // }
    }
  }

  function init() {
    console.log('init------------');
    hideElements();
    addRedBorder();
    setupSidebarToggle();
  }

  // 在页面加载完成后执行
  window.addEventListener('load', init);

  // 为了处理动态加载的内容,每隔一段时间检查一次
  setInterval(addRedBorder, 5000);
})();
