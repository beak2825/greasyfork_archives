// ==UserScript==
// @name         YouTube 评论区难词翻译 (嵌入式)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动翻译 YouTube 评论中的生词，并将翻译结果嵌入原评论中
// @author       喜乐 bb844785535@gmail.com
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520792/YouTube%20%E8%AF%84%E8%AE%BA%E5%8C%BA%E9%9A%BE%E8%AF%8D%E7%BF%BB%E8%AF%91%20%28%E5%B5%8C%E5%85%A5%E5%BC%8F%29.user.js
// @updateURL https://update.greasyfork.org/scripts/520792/YouTube%20%E8%AF%84%E8%AE%BA%E5%8C%BA%E9%9A%BE%E8%AF%8D%E7%BF%BB%E8%AF%91%20%28%E5%B5%8C%E5%85%A5%E5%BC%8F%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const apiUrl = 'https://v.api.aa1.cn/api/api-fanyi-yd/index.php?msg='; // 这个是免费的api，然后也别乱用。整个代码基本ai写的，大神们自己优化一下

    // 定义单词频率阈值，低于此频率的单词被视为生词
    const wordFreqThreshold = 5000;

    let wordList = null;

    // 加载单词频率表
    fetch('https://raw.githubusercontent.com/mahavivo/vocabulary/master/vocabulary/COCA60000.txt')
        .then(response => response.text())
        .then(text => {
            wordList = text.split(/\s+/);
            console.log('Word frequency list loaded.');
        });

    // 监控评论加载，翻译每个评论的难词
    const observer = new MutationObserver(() => {
        const commentNodes = document.querySelectorAll('#content-text:not([data-translated])');
        commentNodes.forEach(async (node) => {
            node.dataset.translated = 'true'; // 防止重复处理
            const originalText = node.textContent;
            const translatedText = await translateDifficultWords(originalText);
            if (translatedText) {
                node.textContent = translatedText; // 直接修改评论文本
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    // 翻译难词并插入到原句中
    async function translateDifficultWords(comment) {
        const words = comment.split(/\s+/).map(word => word.replace(/[^a-zA-Z']/g, '')); // 清理单词
        const uniqueWords = [...new Set(words)];
        const difficultWords = uniqueWords.filter(word => isDifficultWord(word));
        if (difficultWords.length === 0) return comment; // 无需翻译

        const translations = await Promise.all(
            difficultWords.map(word => fetchTranslation(word))
        );

        const translationMap = {};
        difficultWords.forEach((word, i) => {
            translationMap[word.toLowerCase()] = translations[i] || word;
        });

        return words
            .map(word => {
                const cleanWord = word.replace(/[^a-zA-Z']/g, '').toLowerCase();
                const translation = translationMap[cleanWord];
                return translation ? `${word} (${translation})` : word;
            })
            .join(' ');
    }

    // 判断是否为难词
    function isDifficultWord(word) {
        if (!wordList) return false;
        const index = wordList.indexOf(word.toLowerCase());
        return index === -1 || index > wordFreqThreshold;
    }

    // 调用翻译 API
    async function fetchTranslation(word) {
        try {
            const response = await fetch(`${apiUrl}${encodeURIComponent(word)}&type=3`);
            const text = await response.text();
            const match = text.match(/"text":\s*"(.*?)"/);
            return match ? match[1] : word;
        } catch (error) {
            console.error('Translation API error:', error);
            return word;
        }
    }
})();
