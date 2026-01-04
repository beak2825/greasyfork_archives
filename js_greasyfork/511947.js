// ==UserScript==
// @name         迷深阅读体验优化脚本
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  自用。自动繁体转简体，并将着重号改为标注在文本上方。
// @match        https://masiro.me/admin/novelReading*
// @grant        none
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/511947/%E8%BF%B7%E6%B7%B1%E9%98%85%E8%AF%BB%E4%BD%93%E9%AA%8C%E4%BC%98%E5%8C%96%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/511947/%E8%BF%B7%E6%B7%B1%E9%98%85%E8%AF%BB%E4%BD%93%E9%AA%8C%E4%BC%98%E5%8C%96%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let observer;
  let debounceTimer;

  // 异步加载脚本
  function loadScript(url) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  // 转换函数
  function convertToSimplified(OpenCC) {
    const contentElement = document.querySelector('.nvl-content');
    if (!contentElement) return;

    // 暂时断开观察器
    if (observer) {
      observer.disconnect();
    }

    let traditionalText = contentElement.innerHTML;
    const converter = OpenCC.Converter({ from: 'tw', to: 'cn' });
    let simplifiedText = converter(traditionalText);

    // 添加强调处理
    simplifiedText = simplifiedText.replace(/([^，。！？\n<>]+)/g, function (sentence) {
      return sentence.replace(/([\u4e00-\u9fa5]·)+[\u4e00-\u9fa5]/g, function (match) {
        if (match.split('·').length >= 3 && match.split('·').every(char => char.length === 1)) {
          const emphasizedText = match.replace(/·/g, '');
          return `<span style="text-emphasis: dot;">${emphasizedText}</span>`;
        }
        return match;
      });
    });

    contentElement.innerHTML = simplifiedText;

    // 重新连接观察器
    if (observer) {
      observer.observe(contentElement, { childList: true, subtree: true, characterData: true });
    }
  }

  // 添加监测函数
  function observeContentChanges(OpenCC) {
    const contentElement = document.querySelector('.nvl-content');
    if (!contentElement) return;

    observer = new MutationObserver((mutations) => {
      let shouldConvert = false;
      for (let mutation of mutations) {
        if (mutation.type === 'childList' || mutation.type === 'characterData') {
          shouldConvert = true;
          break;
        }
      }
      if (shouldConvert) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          convertToSimplified(OpenCC);
        }, 300); // 300毫秒的延迟
      }
    });

    observer.observe(contentElement, { childList: true, subtree: true, characterData: true });
  }

  // 主函数
  async function main() {
    try {
      await loadScript('https://cdn.jsdelivr.net/npm/opencc-js@1.0.5/dist/umd/t2cn.js');

      // 确保 OpenCC 对象已加载
      if (typeof OpenCC === 'undefined') {
        throw new Error('OpenCC 未正确加载');
      }

      // 确保 DOM 完全加载
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          convertToSimplified(OpenCC);
          observeContentChanges(OpenCC);
        });
      } else {
        convertToSimplified(OpenCC);
        observeContentChanges(OpenCC);
      }
    } catch (error) {
      console.error('加载 OpenCC 或执行转换时出错:', error);
    }
  }

  // 执行主函数
  main();
})();
