// ==UserScript==
// @name         c站触发词一键保存
// @namespace    civitai-exporter
// @version      1.2
// @description  将 Civitai 内容导出，并包含触发词和源网址。
// @author       江誉镠
// @match        https://civitai.com/models/*
// @grant        GM_download
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/464565/c%E7%AB%99%E8%A7%A6%E5%8F%91%E8%AF%8D%E4%B8%80%E9%94%AE%E4%BF%9D%E5%AD%98.user.js
// @updateURL https://update.greasyfork.org/scripts/464565/c%E7%AB%99%E8%A7%A6%E5%8F%91%E8%AF%8D%E4%B8%80%E9%94%AE%E4%BF%9D%E5%AD%98.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function extractCopiedTexts() {
    const copiedTexts = [];

    const nodes = document.querySelectorAll('.mantine-Group-root.mantine-i72d0e');
    nodes.forEach((node) => {
      const content = node.textContent.trim();
      copiedTexts.push(content);
    });

    return copiedTexts;
  }

  function checkEnglishAlphabet(text) {
    // 英文字母正则表达式
    const regex = /^[a-zA-Z]+$/;
    return regex.test(text);
  }

  function exportCopiedTexts() {
    const nodes = document.querySelectorAll('.mantine-Text-root.mantine-Title-root.mantine-g96yxx');
    let filename = '未命名的触发词文档';
    if (nodes.length > 0) {
      const title = nodes[0].textContent.trim();
      filename = title;
    }
    const copiedTexts = extractCopiedTexts();

    // 检查是否含有非英文字母的触发词
    let nonEnglishTriggerWords = '';
    for (let i = 0; i < copiedTexts.length; i++) {
      const triggerWord = copiedTexts[i].split('：')[0];
      if (!checkEnglishAlphabet(triggerWord)) {
        nonEnglishTriggerWords += triggerWord + ' ';
      }
    }

    if (nonEnglishTriggerWords !== '') {
      alert('导出触发词失败！是不是用了翻译!\n请还原英文界面后再次导出。');
      return;
    }

    const triggerWord = '触发词：';
    const sourceUrl = '原网址：' + window.location.href + '\n';
    const content = copiedTexts.join('\n触发词：') + '\n';
    filename += '.txt';
    const dataUrl = 'data:text/plain;charset=utf-8,' + encodeURIComponent(sourceUrl + triggerWord + content);

    GM_download(dataUrl, filename);
  }

  GM_registerMenuCommand('导出触发词', exportCopiedTexts);
})();
