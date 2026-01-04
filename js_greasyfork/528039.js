// ==UserScript==
// @name         Anthropic Console Theme Changer
// @version      0.1.1
// @description  将 Anthropic Console 改回浅色模式 switch the Anthropic Console to light mode
// @author       chesha1
// @license      GPL-3.0-only
// @match        https://console.anthropic.com/*
// @grant        none
// @homepageURL  https://github.com/chesha1/anthropic-console-theme-changer
// @supportURL   https://github.com/chesha1/anthropic-console-theme-changer/issues
// @namespace https://greasyfork.org/users/1422393
// @downloadURL https://update.greasyfork.org/scripts/528039/Anthropic%20Console%20Theme%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/528039/Anthropic%20Console%20Theme%20Changer.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 立即执行一次修改
  function changeTheme() {
    const htmlElement = document.documentElement;
    if (htmlElement.getAttribute('data-theme') === 'console') {
      htmlElement.setAttribute('data-theme', 'claude');
      console.log('主题已从 console 更改为 claude');
    }
  }

  // 页面加载完成后执行
  changeTheme();

  // 使用 MutationObserver 监听可能的动态变化
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.attributeName === 'data-theme'
        && document.documentElement.getAttribute('data-theme') === 'console') {
        changeTheme();
      }
    });
  });

  // 配置 observer 监听 HTML 元素的属性变化
  observer.observe(document.documentElement, { attributes: true });
})();
