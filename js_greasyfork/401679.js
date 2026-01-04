// ==UserScript==
// @name         Hi, Jira 🚀
// @namespace    https://xianghongai.github.io/
// @version      1.2.2
// @description  作者在 Jira v8.13.15 编写和应用，其它版本可能需要调整源码。另外，需要调整域名匹配规则。
// @author       Nicholas Hsiang
// @icon         https://www.feature.com/favicon.ico
// @match        *://jira.feature-inc.cn/*
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/401679/Hi%2C%20Jira%20%F0%9F%9A%80.user.js
// @updateURL https://update.greasyfork.org/scripts/401679/Hi%2C%20Jira%20%F0%9F%9A%80.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /**
   * 🚀 可编辑字段禁止点击文本编辑，只能通过点击编辑按钮图标操作
   */

  function editableField(event) {
    const targetEle = event.target;

    // i. 点击的是“编辑”按钮图标
    const isEdit = hasClass(targetEle, 'aui-iconfont-edit');

    // ii. 点击的是图片、链接
    // img
    // a
    const inWhitelist = ['img', 'a'].includes(targetEle.tagName.toLowerCase());

    if (inWhitelist || isEdit) {
      return true;
    }

    // 1. 父层为可编辑字段 (非 Description)
    const editableFieldParent = getParents(
      targetEle,
      '.editable-field:not(#description-val)'
    );
    const isEditableFieldParent =
      editableFieldParent && hasClass(editableFieldParent, 'inactive');

    // 2. 当前层为可编辑字段 (非 Description)
    const isEditableField =
      hasClass(targetEle, 'editable-field') && hasClass(targetEle, 'inactive');

    // 3. Description 字段
    const isDescriptionField = getParents(targetEle, '.user-content-block');

    if (isEditableFieldParent || isEditableField || isDescriptionField) {
      event.preventDefault();
      event.stopPropagation();

      return false;
    }
  }

  /**
   * 🚀 快捷功能
   */

  function keyboardShortcut(event) {
    // 在 macOS 上，Option (ALT) 键有特殊功能，它用于输入特殊字符和符号。
    // 按下 Option+T 时，macOS 可能将其解释为一个特殊字符输入，而不是单纯的修饰键+字母组合，
    // 这就导致 JavaScript 事件系统接收到的不是标准的按键事件，而是 "Unidentified"。
    // event.code 表示物理按键的位置，与键盘布局无关。

    // 按 ALT+L 添加 Link
    if (
      event.altKey &&
      ((event.key === 'Unidentified' && event.code === 'KeyL') ||
        event.key.toLowerCase() === 'l')
    ) {
      document.querySelector('#link-issue')?.click();
    }
  }

  /**
   * 🚀 DOM 事件
   */

  function click(event) {
    editableField(event);
  }

  document.addEventListener('click', click, true);

  function keydown(event) {
    keyboardShortcut(event);
  }

  document.addEventListener('keydown', keydown, true);

  // #region COMMON
  function hasClass(el, className) {
    if (el.classList) {
      return el.classList.contains(className);
    }
    return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
  }

  function getParents(elem, selector) {
    for (; elem && elem !== document; elem = elem.parentNode) {
      if (elem.matches(selector)) return elem;
    }
    return null;
  }
  // #endregion
})();
