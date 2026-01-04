// ==UserScript==
// @name         Bilibili 哔哩哔哩阻止动态点击正文跳转
// @icon         https://www.bilibili.com/favicon.ico
// @namespace    https://lolicon.app/
// @version      1.2.0
// @description  阻止动态点击正文跳转动态页面
// @author       Jindai Kirin
// @match        https://t.bilibili.com/*
// @match        https://space.bilibili.com/*
// @match        https://www.bilibili.com/v/topic/detail/*
// @license      MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/436888/Bilibili%20%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E9%98%BB%E6%AD%A2%E5%8A%A8%E6%80%81%E7%82%B9%E5%87%BB%E6%AD%A3%E6%96%87%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/436888/Bilibili%20%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E9%98%BB%E6%AD%A2%E5%8A%A8%E6%80%81%E7%82%B9%E5%87%BB%E6%AD%A3%E6%96%87%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const css = ([style]) => GM_addStyle(style);

  css`
    .bili-dyn-content__orig__desc:not(
        .bili-dyn-content__orig.reference .bili-dyn-content__orig__desc
      ),
    .dyn-card-opus__summary:not(.bili-dyn-content__orig.reference .dyn-card-opus__summary),
    .bili-dyn-content__forw__desc,
    .dyn-card-opus__title {
      cursor: unset !important;
    }
    .bili-rich-text-emoji,
    .opus-text-rich-emoji img {
      -webkit-user-drag: none;
    }
  `;

  const contentSelector = [
    // 一般正文
    '.dyn-card-opus__summary',
    // 动态标题
    '.dyn-card-opus__title',
    // 视频正文
    '.bili-dyn-content__orig__desc',
    // 转发正文
    '.bili-dyn-content__forw__desc',
  ].join(',');

  const skipSelector = [
    // 展开收起
    '.dyn-card-opus__summary__action',
    // 链接等
    '.opus-text-rich-hl',
    '.bili-rich-text-module',
    // 话题
    '.bili-rich-text-topic',
  ].join(',');

  /**
   * @param {HTMLElement} element
   */
  const isSkipElement = element => element.closest(skipSelector);

  document.addEventListener(
    'click',
    e => {
      const el = e.target;
      if (!(el instanceof HTMLElement)) return;

      // 不处理动态链接
      if (isSkipElement(el)) return;

      // 转发内容不处理，因为没有其他适合的途径打开转发原文
      if (el.closest('.bili-dyn-content__orig.reference')) return;

      // 阻止点击正文跳转到动态页面
      if (el.closest(contentSelector)) {
        e.stopPropagation();
      }
    },
    { capture: true }
  );
})();
