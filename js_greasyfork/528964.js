// ==UserScript==
// @name         Hi, Confluence 🚀
// @namespace    https://xinlu.ink/
// @version      1.0.0
// @description  行内代码添加高亮样式；支持快捷访问‘页面信息’。作者是在 Confluence 7.13.3 编写和应用，其它版本可能需要调整源码。另外，需要调整域名匹配规则。
// @author       Nicholas Hsiang
// @icon         https://www.feature.com/favicon.ico
// @match        *://wiki.feature-inc.cn/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528964/Hi%2C%20Confluence%20%F0%9F%9A%80.user.js
// @updateURL https://update.greasyfork.org/scripts/528964/Hi%2C%20Confluence%20%F0%9F%9A%80.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /**
   * 🚀 Highlight inline code
   */

  function addClassName() {
    const preEles = [
      ...document.querySelectorAll('p > code'),
      ...document.querySelectorAll('li > code'),
    ];

    preEles.forEach((tiem) => {
      tiem.classList.add('__x-code__');
    });
  }

  function createStyleSheet() {
    const style = `
.__x-code__ {
  padding: .2em .4em;
  margin: 0;
  white-space: break-spaces;
  background-color: rgba(175, 184, 193, 0.25);
  border-radius: 6px;
}

.wiki-content ul li { line-height: 1.6; }
  `;

    GM_addStyle(style);
  }

  createStyleSheet();
  addClassName();

  /**
   * 🚀 快捷功能
   */
  function keyboardShortcut(event) {
    // 在 macOS 上，Option (ALT) 键有特殊功能，它用于输入特殊字符和符号。
    // 按下 Option+T 时，macOS 可能将其解释为一个特殊字符输入，而不是单纯的修饰键+字母组合，
    // 这就导致 JavaScript 事件系统接收到的不是标准的按键事件，而是 "Unidentified"。
    // event.code 表示物理按键的位置，与键盘布局无关。

    // 按 ALT+I 查看页面信息
    if (
      event.altKey &&
      ((event.key === 'Unidentified' && event.code === 'KeyI') ||
        event.key.toLowerCase() === 'i')
    ) {
      return document.querySelector('#view-page-info-link')?.click();
    }

    // 按 ALT+P 查看页面
    if (
      event.altKey &&
      ((event.key === 'Unidentified' && event.code === 'KeyP') ||
        event.key.toLowerCase() === 'p')
    ) {
      return document.querySelector('#viewPageLink')?.click();
    }
  }

  function keydown(event) {
    keyboardShortcut(event);
  }

  document.addEventListener('keydown', keydown, true);
})();
