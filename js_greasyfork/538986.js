// ==UserScript==
// @name         CSDN 内容清爽版
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  解除CSDN复制限制，移除广告和推荐，仅保留正文区域
// @author       独孤歌
// @match        *://blog.csdn.net/*
// @license MIT
// @icon         https://csdnimg.cn/public/favicon.ico
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/538986/CSDN%20%E5%86%85%E5%AE%B9%E6%B8%85%E7%88%BD%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/538986/CSDN%20%E5%86%85%E5%AE%B9%E6%B8%85%E7%88%BD%E7%89%88.meta.js
// ==/UserScript==

(function () {
  'use strict';
    GM_addStyle(`
    body, html {
      margin: 0 !important;
      padding: 0 !important;
      overflow-x: hidden !important;
    }

    /* 隐藏一切不相关的区域 */
    #csdn-toolbar,
    .csdn-side-toolbar,
    #toolBarBox,
    .recommend-right,
    #recommendAdBox,
    .recommend-box,
    .blog-footer-bottom,
    aside,
    .operate-box,
    #treeSkill,
    .csdn-side-toolbar,
    .tool-box,
    .csdn-toolbar,
    .passport-login-container,
    .meau-gotop-box,
    .comment-box,
    footer,
    .tool-box,
    #asideFooter,
    .left-toolbox,
    .second-recommend-box,
    .blog_container_aside {
      display: none !important;
    }

    main { width: auto !important }


    /* 让 code 和 pre 块可以复制 */
    pre, code {
      user-select: text !important;
    }
  `);

  // 移除广告和推荐区域
  const removeElements = () => {
    const selectors = [
      '#csdn-toolbar',         // 顶部工具栏
      '.csdn-side-toolbar',    // 右下角悬浮按钮
      '#toolBarBox',           // 悬浮工具条
      '.recommend-right',      // 右侧推荐
      '#recommendAdBox',       // 推荐广告
      '.recommend-box',        // 阅读推荐
      '.blog-footer-bottom',   // 脚部信息
      'aside',                 // 侧边栏
      '.operate-box',          // 点赞收藏
      '#treeSkill',            // 左侧目录树
      '.csdn-side-toolbar',    // 边栏按钮
      '.comment-box',          // 评论区（可选）
      '.tool-box',             // 顶部小工具
      '.csdn-toolbar',         // 顶部横幅
      '.passport-login-container', // 登录弹窗
      '.meau-gotop-box',       // 返回顶部
    ];

    selectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach(el => el.remove());
    });

    // 处理正文区域宽度
    const content = document.querySelector('.blog-content-box');
    if (content) {
      content.style.margin = '0 auto';
      content.style.width = '100%';
    }


    // 清理 body 限制复制的事件
    ['copy', 'cut', 'contextmenu', 'selectstart', 'keydown'].forEach(event => {
      document.documentElement.addEventListener(event, e => e.stopPropagation(), true);
    });

    // 解除代码复制限制
    document.querySelectorAll('pre, code').forEach(el => {
      el.style.userSelect = 'text';
    });

    // 展开阅读全文按钮（有些文章存在）
    const readMoreBtn = document.querySelector('.btn-readmore');
    if (readMoreBtn) {
      readMoreBtn.click();
    }
  };

  // 初始触发一次
  removeElements();


})();
