// ==UserScript==
// @name         Ctrl+Alt+Click to Copy Text
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  按alt键或ctrl+alt组合键复制文本
// @author       delfino
// @match        http://*.cooco.net.cn/*
// @match        https://www.zujuan.com/question*
// @match        *://*.csdn.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/461575/Ctrl%2BAlt%2BClick%20to%20Copy%20Text.user.js
// @updateURL https://update.greasyfork.org/scripts/461575/Ctrl%2BAlt%2BClick%20to%20Copy%20Text.meta.js
// ==/UserScript==

(function () {
  'use strict';

  document.addEventListener('click', listener, true);

  function listener(event) {
    if (event.altKey && event.ctrlKey || event.altKey) {
      event.preventDefault();
      event.stopPropagation();
      let text = event.ctrlKey ? event.target.parentNode.parentNode.innerText:event.target.innerText;
      text=text.replace(/(\n[\s\t]*\r*\n)/g, '\n')
      copyTextToClipboard(text);
      return false;
    }
  }
  function fallbackCopyTextToClipboard(text) {
    let textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      var successful = document.execCommand('copy');
    } catch (err) {
    }
    document.body.removeChild(textArea);
  }

  function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
      fallbackCopyTextToClipboard(text);
      return;
    }
    navigator.clipboard.writeText(text)
  }
})();