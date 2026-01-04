// ==UserScript==
// @name         Apple Hungarian Keyboard Layout to Hungarian PC Layout
// @namespace    apple-hun-keyboard-layout-to-pc-hun-layout
// @version      1.0
// @description  Replaces special characters as you type with the equivalent regular 101-button Hungarian PC keyboard characters.
// @author       hlorand.hu
// @match        https://*/*
// @exclude      https://vscode.dev/*
// @exclude      https://github.dev/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license      https://creativecommons.org/licenses/by-nc-sa/4.0/
// @downloadURL https://update.greasyfork.org/scripts/539239/Apple%20Hungarian%20Keyboard%20Layout%20to%20Hungarian%20PC%20Layout.user.js
// @updateURL https://update.greasyfork.org/scripts/539239/Apple%20Hungarian%20Keyboard%20Layout%20to%20Hungarian%20PC%20Layout.meta.js
// ==/UserScript==

//'use strict';

(function () {

// Error FIX: This document requires 'TrustedScript' assignment.
window.trustedTypes.createPolicy('default', {createHTML: (string, sink) => string})

  const map = {
    'Ķ': '<',
    ';': '>',
    '|': '<',
    '«': '>',
    //'–': '*',// altgr + -
    '^': '*', // changed from alrgr + - to altgr + á
    '”': '{',
    '~': '}', // not working
    'ń': '[',
    '©': ']',
    'ę': '|',
    '»': '#',
    'ć': '&',
    '„': '@',
    '…': '$',
    '–': ';', // not working on original pos
    '£': '^',
    '{': '`',
    '@': '\\',
    '&' : '~'
  };

  function isEditable(el) {
    return el.isContentEditable || ['INPUT', 'TEXTAREA'].includes(el.tagName);
  }

  function handleInput(e) {
    const el = e.target;
    if (!isEditable(el)) return;

    if (el.isContentEditable) {
      const sel = window.getSelection();
      if (!sel.rangeCount) return;

      const range = sel.getRangeAt(0);
      const node = range.startContainer;

      if (node.nodeType === 3) { // text node
        const text = node.nodeValue;
        const lastChar = text[text.length - 1];
        const replacement = map[lastChar];
        if (replacement) {
          node.nodeValue = text.slice(0, -1) + replacement;
          range.setStart(node, node.nodeValue.length);
          range.collapse(true);
          sel.removeAllRanges();
          sel.addRange(range);
        }
      }
    } else {
      const value = el.value;
      const pos = el.selectionStart;
      const lastChar = value[pos - 1];
      const replacement = map[lastChar];
      if (replacement) {
        el.value = value.slice(0, pos - 1) + replacement + value.slice(pos);
        el.setSelectionRange(pos, pos); // preserve caret
      }
    }
  }

  document.addEventListener('input', handleInput);
})();