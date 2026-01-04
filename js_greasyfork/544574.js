// ==UserScript==
// @name         AIStudio Google 回车发送 + 清理UI完整版本
// @namespace    https://greasyfork.org/users/123456  // ← 可替换为你的用户页
// @version      2.4
// @description  回车发送，Ctrl+回车换行；按钮只显示“发送”；去掉图标、Ctrl提示、gap间距；兼容 run-button-content 样式修正。
// @author       zw
// @license      MIT
// @match        *://aistudio.google.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/544574/AIStudio%20Google%20%E5%9B%9E%E8%BD%A6%E5%8F%91%E9%80%81%20%2B%20%E6%B8%85%E7%90%86UI%E5%AE%8C%E6%95%B4%E7%89%88%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/544574/AIStudio%20Google%20%E5%9B%9E%E8%BD%A6%E5%8F%91%E9%80%81%20%2B%20%E6%B8%85%E7%90%86UI%E5%AE%8C%E6%95%B4%E7%89%88%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function waitAndPatch() {
    const textarea = document.querySelector('textarea');
    const runBtn = document.querySelector('button.run-button');
    const runBtnContent = document.querySelector('.run-button-content');

    // 修改按钮文字、删除 Ctrl+图标
    if (runBtn && !runBtn.dataset._patchedText) {
      const labelSpan = runBtn.querySelector('span.label');
      if (labelSpan) {
        labelSpan.textContent = '发送';
        console.log('[油猴] 按钮文字已改为发送');
      }

      const ctrlSpan = runBtn.querySelector('span.secondary-key');
      if (ctrlSpan) {
        ctrlSpan.remove();
        console.log('[油猴] 删除 Ctrl 提示');
      }

      const icon = runBtn.querySelector('mat-icon');
      if (icon) {
        icon.remove();
        console.log('[油猴] 删除图标');
      }

      runBtn.dataset._patchedText = 'true';
    }

    // 去除 gap 样式：作用于 run-button-content
    if (runBtnContent && !runBtnContent.dataset._gapFixed) {
      runBtnContent.style.gap = '0px';
      runBtnContent.style.columnGap = '0px';
      runBtnContent.dataset._gapFixed = 'true';
      console.log('[油猴] run-button-content 的 gap 已去除');
    }

    // 绑定键盘事件
    if (textarea && !textarea.dataset._patched) {
      textarea.dataset._patched = 'true';

      textarea.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          if (e.ctrlKey) {
            const { selectionStart, selectionEnd } = this;
            const val = this.value;
            this.value = val.slice(0, selectionStart) + '\n' + val.slice(selectionEnd);
            this.selectionStart = this.selectionEnd = selectionStart + 1;
            e.preventDefault();
          } else {
            e.preventDefault();
            if (runBtn) {
              runBtn.click();
              console.log('[油猴] 触发发送');
            }
          }
        }
      });
    }

    setTimeout(waitAndPatch, 500); // 持续监听
  }

  window.addEventListener('load', () => {
    console.log('[油猴] 启动：AIStudio 回车发送 UI 优化');
    waitAndPatch();
  });
})();
