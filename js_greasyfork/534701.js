// ==UserScript==
// @name         noVNC Paste - MidMouseButton Paste
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Pastes simple text into a noVNC window(with middle mouseButton)
// @author       A Cat
// @match        https://*
// @include      /^.*novnc.*/
// @include      /^.*vnc.php.*/
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534701/noVNC%20Paste%20-%20MidMouseButton%20Paste.user.js
// @updateURL https://update.greasyfork.org/scripts/534701/noVNC%20Paste%20-%20MidMouseButton%20Paste.meta.js
// ==/UserScript==
const delay = 50;
let isPVETerminal = [...document.head.querySelectorAll('link')].map(one=>one.href).join(';').includes('pve');
console.log('当前机器', isPVETerminal ? '是 PVE环境' : '其他');

~(function() {
  'use strict';
  const charToKeyName = {
    // 基本符号（对应物理按键）
    ' ': 'Space',
    '!': 'Digit1',        // Shift+1
    '"': 'Quote',         // 双引号（美式键盘）
    '#': 'Digit3',        // Shift+3（英式键盘）
    '$': 'Digit4',        // Shift+4
    '%': 'Digit5',        // Shift+5
    '&': 'Digit7',        // Shift+7
    '\'': 'Quote',        // 单引号
    '(': 'Digit9',        // Shift+9
    ')': 'Digit0',        // Shift+0
    '*': 'Digit8',        // Shift+8
    '+': 'Equal',         // Shift+=
    ',': 'Comma',         // 逗号
    '-': 'Minus',         // 减号
    '.': 'Period',        // 句号
    '/': 'Slash',         // 斜杠

    // 数字（直接对应）
    '0': 'Digit0',
    '1': 'Digit1',
    '2': 'Digit2',
    '3': 'Digit3',
    '4': 'Digit4',
    '5': 'Digit5',
    '6': 'Digit6',
    '7': 'Digit7',
    '8': 'Digit8',
    '9': 'Digit9',

    // 符号（基于物理按键）
    ':': 'Semicolon',     // Shift+;
    ';': 'Semicolon',
    '<': 'Comma',         // Shift+, （这才是物理按键的真实名称）
    '=': 'Equal',
    '>': 'Period',        // Shift+.
    '?': 'Slash',         // Shift+/
    '@': 'Digit2',        // Shift+2（美式键盘）

    // 其他符号
    '[': 'BracketLeft',
    '\\': 'Backslash',
    ']': 'BracketRight',
    '^': 'Digit6',        // Shift+6
    '_': 'Minus',         // Shift+-
    '`': 'Backquote',
    '{': 'BracketLeft',   // Shift+[
    '|': 'Backslash',     // Shift+\
    '}': 'BracketRight',  // Shift+]
    '~': 'Backquote',     // Shift+`

    // 中文符号映射到对应的物理按键
    '，': 'Comma',
    '。': 'Period',
    '；': 'Semicolon',
    '：': 'Semicolon',    // Shift+;
    '？': 'Slash',        // Shift+/
    '！': 'Digit1',       // Shift+1
    '、': 'Slash',
    '（': 'Digit9',       // Shift+9
    '）': 'Digit0',       // Shift+0
    '【': 'BracketLeft',
    '】': 'BracketRight',
    '「': 'Quote',
    '」': 'Quote',
    '『': 'Quote',        // Shift+'
    '』': 'Quote',        // Shift+'
    '￥': 'Backslash',    // 中文键盘反斜杠位置
    '……': 'Digit6',       // Shift+6（常见输入法）
    '——': 'Minus',        // Shift+-
    '～': 'Backquote'     // Shift+`
  };
  window.sendString = function(text) {
    const el = document.querySelector("canvas");
    if (!el) {
      console.error("Canvas element not found!");
      return;
    }

    el.focus();

    let i = 0;

    function sendNextChar() {
      if (i >= text.length) return;

      const char = text[i++];
      const needsShift = /[A-Z!@#$%^&*()_\-+{}:"<>?~|；“”？《》！：（）「」『』￥…—～]/.test(char);

      const sendEvent = (type, key, modifiers = {}) => {
        
        const code = (() => {
          if (key in charToKeyName) return charToKeyName[key];
          return /^[a-zA-Z]$/.test(key) ? `Key${key.toUpperCase()}` : undefined;
        })();
        
        const event = new KeyboardEvent(type, {
          key: key,
          code: code,
          keyCode: key.charCodeAt(0),
          which: key.charCodeAt(0),
          bubbles: true,
          cancelable: true,
          composed: true,
          ...modifiers
        });

        el.dispatchEvent(event);
      };

      if (needsShift) {
        sendEvent('keydown', 'Shift', { shiftKey: true });
        isPVETerminal && sendEvent('keydown', char, { shiftKey: true });
        
        sendEvent('keypress', char, { shiftKey: true });

        isPVETerminal && sendEvent('keyup', char, { shiftKey: true });
        sendEvent('keyup', 'Shift', { shiftKey: false });
      } else {
        isPVETerminal && sendEvent('keydown', char);
        sendEvent('keypress', char);
        isPVETerminal && sendEvent('keyup', char);
      }

      console.log(`已发送: ${char} (Shift: ${needsShift})`);
      setTimeout(sendNextChar, delay);
    }

    sendNextChar();
  };

  setTimeout(() => {
    console.log("Starting up noVNC Copy/Paste (for Proxmox)");

    const canvas = document.querySelector("canvas")
    if(canvas) {
      canvas.addEventListener("mousedown", (e) => {
        if (e.button === 1) {
          navigator.clipboard.readText().then(text => {
            console.log("从剪贴板获取内容:", text);
            window.sendString(text);
          }).catch(err => {
            console.error("无法读取剪贴板:", err);
          });
        }
      });
    }
    
  }, 2000);
})();
