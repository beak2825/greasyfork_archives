// ==UserScript==
// @name            Twitter｜X 图片查看增强
// @name:zh-CN      Twitter｜X 图片查看增强
// @name:zh-TW      Twitter｜X 圖片檢視增強
// @name:en         Twitter | X Image Viewer Enhancement
// @namespace       https://dream.com
// @version         2024.12.02
// @description     在查看图片时，点击图片可直接关闭
// @description:zh-CN 在查看图片时，点击图片可直接关闭
// @description:zh-TW 在查看圖片時，點擊圖片即可直接關閉
// @description:en  When viewing an image, click on the image to close it directly.
// @author          Dream <dreamprostudio@yeah.net>
// @icon            https://icdn.binmt.cc/2412/674c9b73549a3.png@slim
// @license         MIT
// @include         *://x.com/*
// @include         *://twitter.com/*
// @grant           none
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/519493/Twitter%EF%BD%9CX%20%E5%9B%BE%E7%89%87%E6%9F%A5%E7%9C%8B%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/519493/Twitter%EF%BD%9CX%20%E5%9B%BE%E7%89%87%E6%9F%A5%E7%9C%8B%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(() => {
  'use strict';

  /**
   * 检查目标元素是否是 Twitter 图片查看中的图片
   * @param {HTMLElement} el
   * @returns {boolean}
   */
  const isTwitterImg = el => el.tagName === 'IMG' && window.location.pathname.includes('/photo/');

  // 监听点击事件，检查目标是否为图片并触发关闭按钮
  document.addEventListener(
    'click',
    e => {
      if (isTwitterImg(e.target)) {
        // 查找所有可能的关闭按钮（多语言兼容）
        const closeButton =
          document.querySelector('[aria-label="Close"]') || // 英语
          document.querySelector('[aria-label="关闭"]') || // 简体中文
          document.querySelector('[aria-label="關閉"]');   // 繁体中文
        if (closeButton) {
          closeButton.click();
          e.stopPropagation(); // 阻止事件进一步传播
        }
      }
    },
    { capture: true, passive: false }
  );
})();