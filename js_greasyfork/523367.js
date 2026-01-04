// ==UserScript==
// @name         删除淘宝/天猫默认评论
// @namespace    http://tampermonkey.net/
// @version      2.1.1
// @description  删除淘宝/天猫包含指定关键词的评论
// @author       oldip
// @match        https://item.taobao.com/item.htm?*
// @match        https://detail.tmall.com/item.htm?*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523367/%E5%88%A0%E9%99%A4%E6%B7%98%E5%AE%9D%E5%A4%A9%E7%8C%AB%E9%BB%98%E8%AE%A4%E8%AF%84%E8%AE%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/523367/%E5%88%A0%E9%99%A4%E6%B7%98%E5%AE%9D%E5%A4%A9%E7%8C%AB%E9%BB%98%E8%AE%A4%E8%AF%84%E8%AE%BA.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 需要完全匹配的关键词
  const keywords = [
    "评价方未及时做出评价,系统默认好评!",
    "此用户没有填写评价。",
    "系统默认评论",
    "15天内买家未作出评价",
    "该用户未及时主动评价，系统默认好评",
    "该用户觉得商品非常好，给出好评",
    "该用户觉得商品非常好，给出5星好评",
    "该用户未填写评价内容"
  ];

  // 统一选择器（新旧类名都支持）
  const SELECTORS = {
    content: '[class^="content--"], [class*="--content--_"]',
    comment: '[class^="Comment--"], [class*="--Comment--_"]',
    photo:   '[class^="photo--"],   [class*="--photo--"]'
  };

  function removeDefaultFeedback(root = document) {
    const contentElements = root.querySelectorAll(SELECTORS.content);
    contentElements.forEach((contentEl) => {
      const text = contentEl.innerText.trim();
      if (!keywords.includes(text)) return;

      const parentComment = contentEl.closest(SELECTORS.comment);
      if (!parentComment) return;

      // 父容器里包含多个纯文本内容块（可能有追评/商家回复等），就跳过
      const contentItems = parentComment.querySelectorAll(SELECTORS.content);
      if (contentItems.length > 1) return;

      // 有图片/视频等媒体则跳过
      if (parentComment.querySelector(SELECTORS.photo)) return;

      parentComment.remove();
    });
  }

  // 处理动态加载
  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (node.nodeType === 1) removeDefaultFeedback(node);
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // 初次执行
  removeDefaultFeedback();
})();
