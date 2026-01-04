// ==UserScript==
// @name         Word/Character Count for Selected Text 字数统计器
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Display word count for English or character count for Chinese in the selected text
// @author       Welcome21984
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482608/WordCharacter%20Count%20for%20Selected%20Text%20%E5%AD%97%E6%95%B0%E7%BB%9F%E8%AE%A1%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/482608/WordCharacter%20Count%20for%20Selected%20Text%20%E5%AD%97%E6%95%B0%E7%BB%9F%E8%AE%A1%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建显示字数的元素
    var countDiv = document.createElement('div');
    countDiv.style.position = 'fixed';
    countDiv.style.bottom = '20px';
    countDiv.style.right = '20px';
    countDiv.style.backgroundColor = 'rgba(0,0,0,0.5)';
    countDiv.style.color = 'white';
    countDiv.style.padding = '5px';
    countDiv.style.borderRadius = '5px';
    countDiv.style.zIndex = '1000';
    countDiv.style.display = 'none';
    document.body.appendChild(countDiv);

    // 检查是否包含中文字符
    function containsChinese(text) {
        return /[\u4e00-\u9fa5]/.test(text);
    }

    // 获取字数
    function getWordCount(text) {
        if (containsChinese(text)) {
            // 中文字符计数
            return text.length;
        } else {
            // 英文单词计数
            return text.trim().split(/\s+/).length;
        }
    }

    document.addEventListener('mouseup', function() {
        var selectedText = window.getSelection().toString();
        if (selectedText.length > 0) {
            var count = getWordCount(selectedText);
            countDiv.textContent = containsChinese(selectedText) ? "Character count: " + count : "Word count: " + count;
            countDiv.style.display = 'block';
        } else {
            countDiv.style.display = 'none';
        }
    });
})();
