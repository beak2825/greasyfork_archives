// ==UserScript==
// @name         Save Div Text to TXT
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Save text from a specified div to a txt file.
// @author       You
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/471393/Save%20Div%20Text%20to%20TXT.user.js
// @updateURL https://update.greasyfork.org/scripts/471393/Save%20Div%20Text%20to%20TXT.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // 默认的 div 选择器
  let divSelector = GM_getValue('divSelector', '#yourDivSelector');

  // 保存文本到 txt 文件
  function saveTextToTxt(text, filename) {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  }

  // 从指定 div 中获取文本并保存到 txt 文件
  function saveDivTextToTxt() {
    const divElement = document.querySelector(divSelector);
    if (divElement) {
      const text = divElement.innerText;
      saveTextToTxt(text, 'div_text.txt');
    } else {
      console.error('Div not found with selector:', divSelector);
    }
  }

  // 注册菜单命令，用于启用功能和更改 div 选择器
  GM_registerMenuCommand('Enable Div Text Save', () => {
    GM_setValue('divSelector', divSelector);
    saveDivTextToTxt();
  });

  GM_registerMenuCommand('Change Div Selector', () => {
    const newSelector = prompt('Enter the new div selector (e.g., "#newDivSelector"):');
    if (newSelector) {
      GM_setValue('divSelector', newSelector);
      divSelector = newSelector;
    }
  });

  // 设置界面，用于配置网址规则和对应的 div 选择器
  GM_registerMenuCommand('Configure Div Selector for Website', () => {
    const websiteUrlPattern = prompt('Enter the website URL pattern (regular expression):');
    if (!websiteUrlPattern) return;

    const divSelectorInput = prompt('Enter the div selector for this website (e.g., "#yourDivSelector"):');
    if (!divSelectorInput) return;

    // 保存网址规则和对应的 div 选择器
    GM_setValue('divSelector_' + websiteUrlPattern, divSelectorInput);

    // 如果当前打开的网页匹配了新的网址规则，则更新当前的 div 选择器
    if (new RegExp(websiteUrlPattern).test(location.href)) {
      divSelector = divSelectorInput;
    }
});

  // 在每次打开新页面时检查是否有匹配的网址规则，并更新 div 选择器
  const websiteUrls = Object.keys(GM_getValue());
  for (const websiteUrl of websiteUrls) {
    const websiteUrlPattern = websiteUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // 转义正则特殊字符
    if (new RegExp(websiteUrlPattern).test(location.href)) {
      divSelector = GM_getValue(websiteUrl, '#yourDivSelector');
      break;
    }
  }
})();
