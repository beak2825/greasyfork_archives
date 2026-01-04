// ==UserScript==
// @name         更多搜索引擎
// @namespace    https://sbtool.us.kg
// @license MIT
// @version      1.0
// @description  自动将URL中的key参数填入界面
// @author       🍟
// @match        https://duckduckgo.com/*
// @match        https://chat.deepseek.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525308/%E6%9B%B4%E5%A4%9A%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E.user.js
// @updateURL https://update.greasyfork.org/scripts/525308/%E6%9B%B4%E5%A4%9A%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E.meta.js
// ==/UserScript==

const configs = {
  'duckduckgo.com': {
    input: '.JRDRiEf5NPKWK43sArdC',
    button: '.aCZEC_jysXHQfHp97pov',
    inputMethod: 'event',
    clickDelay: 400
  },
  'chat.deepseek.com': {
    input: '#chat-input',
    button: '.f286936b',
    inputMethod: 'execCommand',
    clickDelay: 0             
  }
};

(function() {
  'use strict';
  const config = configs[location.host];
  const key = new URLSearchParams(location.search).get('key');
  if (!key) return;
  const input = document.querySelector(config.input);
  const button = document.querySelector(config.button);
      if (config.inputMethod === 'event') {
        input.value = key;
        input.dispatchEvent(new Event('input', { bubbles: true }));
      } else {
        input.focus();
        document.execCommand('insertText', false, key);
      }
      setTimeout(() => button.click(), config.clickDelay);
})();