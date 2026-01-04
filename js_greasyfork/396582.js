// ==UserScript==
// @name         计蒜客助手 Jisuanke Helper
// @namespace    http://tampermonkey.net/
// @version      1.2.2
// @description  1. 取消复制限制； 2. 选择题显示序号（一般情况最小的几个是答案）； 3. 跳过强制等待； 4. 双击单行或块代码区域复制代码； 5. 跳过点击直接复制提示内容
// @author       yusanshi
// @source       https://gist.github.com/yusanshi/981b5926851d4cde3d67536b279cbf34
// @match        http://www.jisuanke.com/course/*
// @match        https://www.jisuanke.com/course/*
// @grant        none
// @run-at       document-start
// @require      https://cdn.jsdelivr.net/gh/colxi/getEventListeners/src/getEventListeners.min.js
// @downloadURL https://update.greasyfork.org/scripts/396582/%E8%AE%A1%E8%92%9C%E5%AE%A2%E5%8A%A9%E6%89%8B%20Jisuanke%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/396582/%E8%AE%A1%E8%92%9C%E5%AE%A2%E5%8A%A9%E6%89%8B%20Jisuanke%20Helper.meta.js
// ==/UserScript==

/* eslint-disable no-use-before-define */
/* eslint-disable strict */

(function () {
  'use strict';

  // Run continually
  setInterval(() => {
    // Remove disabled and oncopy attribute
    removeCls('jsk-disabled');
    ['disabled', 'oncopy', 'oncut'].forEach((elem) => {
      removeAttr(elem);
    });

    // Delete line numbers to avoid its being copied
    ['#guide', '#container-content'].forEach((selector) => {
      document.querySelectorAll(
        `${selector} .CodeMirror-linenumber`,
      ).forEach((elem) => elem.remove());
    });


    // Remove mousedown event handler
    ['#guide', '#container-content'].forEach((selector) => {
      document.querySelectorAll(
        `${selector} .CodeMirror-scroll`,
      ).forEach((elem) => { customRemoveEventLister(elem, 'mousedown'); });
    });


    // Remove selectstart event handler
    ['#guide', '#container-content'].forEach((selector) => {
      document.querySelectorAll(
        `${selector} .CodeMirror-lines`,
      ).forEach((elem) => {
        customRemoveEventLister(elem.querySelector('div'), 'selectstart');
      });
    });


    // Double click to copy
    ['#guide', '#container-content'].forEach((i) => {
      ['code', '.CodeMirror-scroll'].forEach((j) => {
        document.querySelectorAll(`${i} ${j}`).forEach((elem) => {
          elem.ondblclick = () => {
            copyTextWithFeedback(elem.innerText);
          };
        });
      });
    });

    // Skip waiting
    document.querySelectorAll('[data-unlocked]').forEach((elem) => {
      elem.setAttribute('data-unlocked', '999');
    });
  }, 500);

  window.onload = () => {
    // Add number prompts for multiple choice problem
    document.querySelectorAll('[num]').forEach((elem) => {
      const span = document.createElement('span');
      span.style.color = 'green';
      span.innerText = elem.getAttribute('num');
      elem.insertAdjacentElement('afterbegin', span);
    });

    // Skip clicking hint to copy its text directly
    const hint = document.querySelector('#hint');
    if (hint) {
      const button = document.createElement('button');
      button.innerText = 'Copy hint directly';
      button.className = 'jsk-btn jsk-btn-success hint-btn';
      button.style.marginBottom = '0.5rem';
      button.onclick = () => {
        // Simulate clicking and closing the popup window, in order to
        // make hint.querySelector('.CodeMirror-scroll') fullfilled.
        // Looks argly, a better approach may exist
        document.querySelector('#hint-btn').click();
        hint.querySelector('.jsk-close').click();
        hint.querySelectorAll('.CodeMirror-linenumber').forEach((elem) => {
          elem.remove();
        });
        // Copy last code area if multiple code areas in #hint are present
        const allCode = hint.querySelectorAll('.CodeMirror-scroll');
        copyTextWithFeedback(allCode[allCode.length - 1].innerText);
      };
      hint.insertAdjacentElement('afterbegin', button);
    }
  };

  function customRemoveEventLister(target, listenerType) {
    const listeners = target.getEventListeners(listenerType);
    if (typeof listeners !== 'undefined') {
      listeners.forEach((event) => {
        target.removeEventListener(
          event.type,
          event.listener,
          event.useCapture,
        );
      });
    }
  }


  function removeCls(cls) {
    document.querySelectorAll(`.${cls}`).forEach((elem) => {
      elem.classList.remove(cls);
    });
  }

  function removeAttr(attr) {
    document.querySelectorAll(`[${attr}]`).forEach((elem) => {
      elem.removeAttribute(attr);
    });
  }

  function copyTextWithFeedback(text) {
    copyTextToClipboardAsync(text).then(
      () => {
        // window.alertSuccess('Copied successfully');
      },
      () => {
        window.alertError('Failed to copy');
      },
    );
  }

  // Based on https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
  function copyTextToClipboardAsync(text) {
    if (navigator.clipboard) {
      return navigator.clipboard.writeText(text);
    }
    // Async copying is not available, turn to sync copying
    return fallbackCopyTextToClipboard(text)
      ? Promise.resolve()
      : Promise.reject();
  }

  function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed'; // avoid scrolling to bottom
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    let returnValue;
    try {
      document.execCommand('copy');
      returnValue = true;
    } catch (err) {
      returnValue = false;
    }
    document.body.removeChild(textArea);
    return returnValue;
  }
}());
