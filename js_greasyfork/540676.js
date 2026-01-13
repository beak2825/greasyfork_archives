// ==UserScript==
// @name         LD 丑化脚本
// @namespace    http://tampermonkey.net/
// @version      1.31
// @description  替换文字、图片、链接，并隐藏指定元素
// @author       chengdu
// @match        https://linux.do/*
// @grant        none
// @run-at       document-idle
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/540676/LD%20%E4%B8%91%E5%8C%96%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/540676/LD%20%E4%B8%91%E5%8C%96%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /* ---------- 文字替换规则 ---------- */
  const textReplacements = [
    { oldText: /Where possible begins\./g, newText: '遇事不决，可问春风。' },
    { oldText: /Where possible begins/g,  newText: '遇事不决，可问春风。' },
    { oldText: /常见问题解答/g,         newText: '社区准则' },
    { oldText: /我的帖子/g,             newText: '帖子' },
    { oldText: /我的消息/g,             newText: '消息' },
    { oldText: /近期活动/g,             newText: '分发' },
    { oldText: /Leaderboard/g,          newText: '活跃度' },
    { oldText: /外部链接/g,             newText: '外链' },
    { oldText: /类别/g,                 newText: '版块' },
    { oldText: /搞七捻三/g,             newText: '朋友圈' },
    { oldText: /运营反馈/g,             newText: '运营' },
    { oldText: /深海幽域/g,             newText: '深海' },
    { oldText: /直接消息/g,             newText: '聊天' },
    { oldText: /举报/g,                 newText: '检举' },
    { oldText: /翻墙/g,                 newText: '上网' },
    { oldText: /虫洞广场/g,             newText: '虫洞' },
  ];

  /* ---------- 图片替换规则 ---------- */
  const imageReplacements = [
    {
      oldSrc: 'https://linux.do/user_avatar/linux.do/neo/288/12_2.png',
      newSrc: 'https://s2.loli.net/2025/07/07/x6TdsjPHtv3Op8U.jpg'
    },
    {
      oldSrc: 'https://linux.do/user_avatar/linux.do/neo/96/12_2.png',
      newSrc: 'https://s2.loli.net/2025/07/07/x6TdsjPHtv3Op8U.jpg'
    },
    {
      oldSrc: 'https://linux.do/user_avatar/linux.do/neo/48/12_2.png',
      newSrc: 'https://s2.loli.net/2025/07/07/x6TdsjPHtv3Op8U.jpg'
    }
  ];

  /* ---------- 链接修改规则 ---------- */
  const linkReplacements = [
    {
      selector: '[data-link-name="upcoming-events"]',
      newHref:  'https://cdk.linux.do',
      newTitle: '分发',
      newTarget: '_blank'
    }
  ];

  /* ---------- 要隐藏的元素 ---------- */
  const hideSelectors = [
    '.menu-content.wrap',
    // ↓↓↓ 版块分类行拦截
    'tr[data-category-id="49"]',
    'tr[data-category-id="30"]',
    'tr[data-category-id="63"]',
    'tr[data-category-id="64"]',
    'tr[data-category-id="65"]',
    // ↓↓↓ 隐藏无限符号图标
    'svg use[href="#infinity"]',
      // ✅ 新增：隐藏侧边栏 AI 机器人入口
    'li[data-list-item-name="ai-bot"]',
    // ✅ 新增：隐藏整个「频道」板块
    'div[data-section-name="chat-channels"]',
    // ✅ 新增：隐藏 聊天搜索 (Search Chat)
    'div[data-section-name="chat-search"]',
    // ✅ 新增：隐藏「资源」板块
    // 注意：这里直接用了中文属性值，浏览器是完全支持的哦！
    'div[data-section-name="资源"]',
    // 🏷️ ✅ 新增：隐藏 标签 (Tags) 版块
    'div[data-section-name="tags"]',
    // ✅ 新增：隐藏顶部全局公告 (真诚、友善...)
    '#global-notice-alert-global-notice'


  ];

  /* ---------- 文本节点替换 ---------- */
  function replaceInTextNodes(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
    let node;
    while ((node = walker.nextNode())) {
      let text = node.nodeValue;
      textReplacements.forEach(({ oldText, newText }) => {
        text = text.replace(oldText, newText);
      });
      node.nodeValue = text;
    }
  }

  /* ---------- 图片 src 替换 ---------- */
  function replaceImageSources(root) {
    root.querySelectorAll('img').forEach(img => {
      imageReplacements.forEach(({ oldSrc, newSrc }) => {
        if (img.src === oldSrc) {
          img.src = newSrc;
          console.log(`🖼️ 图片已替换: ${oldSrc} → ${newSrc}`);
        }
      });
    });
  }

  /* ---------- 链接属性修改 ---------- */
  function replaceLinks(root) {
    linkReplacements.forEach(({ selector, newHref, newTitle, newTarget }) => {
      root.querySelectorAll(selector).forEach(element => {
        const oldHref  = element.getAttribute('href');
        const oldTitle = element.getAttribute('title');
        element.setAttribute('href', newHref);
        element.setAttribute('title', newTitle);
        if (newTarget) {
          element.setAttribute('target', newTarget);
          element.setAttribute('rel', 'noopener noreferrer');
        }
        console.log(`🔗 链接已修改: ${oldHref} → ${newHref}`);
        console.log(`📝 标题已修改: ${oldTitle} → ${newTitle}`);
      });
    });
  }

  /* ---------- 隐藏指定元素（CSS 注入） ---------- */
  function hideElements() {
    const style = document.createElement('style');
    style.textContent = hideSelectors
      .map(s => `${s} { display: none !important; }`)
      .join('\n');
    document.head.appendChild(style);
    console.log('🚫 指定元素已隐藏：', hideSelectors.join(', '));
  }

  /* ---------- 综合替换 ---------- */
  function performReplacements(root) {
    replaceInTextNodes(root);
    replaceImageSources(root);
    replaceLinks(root);
  }

  /* ---------- 初始执行 ---------- */
  function init() {
    performReplacements(document.body);
    hideElements();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* ---------- 监听动态内容 ---------- */
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          performReplacements(node);
        }
      });
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();
