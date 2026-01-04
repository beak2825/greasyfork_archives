// ==UserScript==
// @name         快捷键搜索：Quick Search or Open URL
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  使用百度搜索选定文本或在新选项卡中打开URL Search selected text with Baidu or open URL in a new tab
// @author       chatgpt
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/499317/%E5%BF%AB%E6%8D%B7%E9%94%AE%E6%90%9C%E7%B4%A2%EF%BC%9AQuick%20Search%20or%20Open%20URL.user.js
// @updateURL https://update.greasyfork.org/scripts/499317/%E5%BF%AB%E6%8D%B7%E9%94%AE%E6%90%9C%E7%B4%A2%EF%BC%9AQuick%20Search%20or%20Open%20URL.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function isValidURL(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'e') {
            e.preventDefault(); // 阻止默认行为
            let selectedText = window.getSelection().toString().trim();
            if (selectedText) {
                if (isValidURL(selectedText)) {
                    if (!selectedText.startsWith('http')) {
                        selectedText = 'http://' + selectedText;
                    }
                    window.open(selectedText, '_blank');
                } else {
                    let searchUrl = `https://www.baidu.com/s?wd=${encodeURIComponent(selectedText)}`;
                    window.open(searchUrl, '_blank');
                }
            }
        }
    });
})();
