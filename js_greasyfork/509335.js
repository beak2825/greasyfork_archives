// ==UserScript==
// @name         仿生阅读(Bionic Reading)
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  通过Alt+B（Mac为Control+B）开关的通用仿生阅读脚本，只作用于英文内容，优先处理字典中的词，并根据单词长度进行加粗
// @author       yitong233
// @match        *://*/*
// @license      MIT
// @icon         https://cdn.icon-icons.com/icons2/869/PNG/64/read_mode_icon-icons.com_68002.png
// @homepageURL  https://greasyfork.org/zh-CN/scripts/509335-%E4%BB%BF%E7%94%9F%E9%98%85%E8%AF%BB-bionic-reading
// @supportURL   https://greasyfork.org/zh-CN/scripts/509335-%E4%BB%BF%E7%94%9F%E9%98%85%E8%AF%BB-bionic-reading/feedback
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/509335/%E4%BB%BF%E7%94%9F%E9%98%85%E8%AF%BB%28Bionic%20Reading%29.user.js
// @updateURL https://update.greasyfork.org/scripts/509335/%E4%BB%BF%E7%94%9F%E9%98%85%E8%AF%BB%28Bionic%20Reading%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let isEnabled = false; // 初始状态为关闭

    // 常见后缀字典
    const suffixes = [
        'ly', 'ion', 'ness', 'ed', 'al', 'ive', 'ing', 'ar', 'er', 'ir', 'or', 'ur',
        'itude', 'able', 'ible', 'ary', 'ate', 'ess', 'less', 'ship', 'fy', 'ic', 'um',
        'us', 'ty', 'ity', 'ant', 'ent', 'end', 'and', 'ance', 'ence', 'ancy', 'ency',
        'id', 'te', 'ize', 'ise', 'ous', 'hood', 'icle', 'cle', 'et', 'kin', 'let', 'y',
        'ward', 'wise', 'dom', 'craft', 'cracy', 'ice', 'ology', 'graphy', 'ry', 'ment',
        'ship', 'fy', 'en', 'ate', 'ish'
    ];

    // 介词和常用词字典
    const prepositions = [
        'the', 'and', 'in', 'on', 'at', 'by', 'with', 'about', 'against', 'between', 'into',
        'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down',
        'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where',
        'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some'
    ];

    // 判断是否为介词或常用词
    function isPreposition(word) {
        return prepositions.includes(word.toLowerCase());
    }

    // 格式化单词：根据单词长度加粗不同数量的字母，并根据介词或句首单词进行特殊处理
    function formatWord(word, isFirstWord) {
        if (!word) {
            return ''; // 处理空字符串的情况
        }
        else{
            // 如果是介词或者句子的第一个单词，只加粗第一个字母
        if (isPreposition(word) || isFirstWord) {
            return `<b>${word[0]}</b>${word.slice(1)}`;
        }

        let boldLength;
        const wordLength = word.length;

        // 根据单词长度决定加粗字母的数量
        if (wordLength <= 2) {
            boldLength = 1; // 1-2长度的单词加粗第一个字母
        } else if (wordLength <= 5) {
            boldLength = 2; // 3-5长度的单词加粗前两个字母
        } else {
            boldLength = Math.min(4, wordLength); // 6个及以上的单词加粗前三到四个字母
        }

        let boldPart = word.slice(0, boldLength);
        let restPart = word.slice(boldLength);
        return `<b>${boldPart}</b>${restPart}`;
        }
    }

    // 处理单个文本节点
    function processTextNode(textNode) {
        const sentences = textNode.textContent.split(/(?<=\.)\s+/); // 以句子分割
        let formattedText = sentences.map(sentence => {
            const words = sentence.split(/\s+/);
            return words.map((word, index) => formatWord(word, index === 0)).join(' '); // 句首单词特殊处理
        }).join(' ');

        // 用于将HTML插入到文本节点
        const span = document.createElement('span');
        span.innerHTML = formattedText;

        // 替换当前的文本节点
        textNode.replaceWith(span);
    }

    // 遍历元素的子节点，处理其中的文本节点
    function traverseAndFormatText(node) {
        node.childNodes.forEach(child => {
            if (child.nodeType === Node.TEXT_NODE && child.textContent.trim().length > 0) {
                // 处理文本节点
                processTextNode(child);
            } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== 'SCRIPT' && child.tagName !== 'STYLE' && child.tagName !== 'PRE') {
                // 递归处理子节点
                traverseAndFormatText(child);
            }
        });
    }

    // 应用到整个网页的英文内容
    function applyBionicReading() {
        const bodyContents = document.body; // 获取整个页面的内容
        traverseAndFormatText(bodyContents); // 处理文本节点
    }

    // 启用或禁用仿生阅读功能
    function toggleBionicReading() {
        isEnabled = !isEnabled; // 切换状态
        if (isEnabled) {
            applyBionicReading();
            console.log("Bionic Reading 已启用");
        } else {
            location.reload(); // 重新加载页面恢复原始状态
            console.log("Bionic Reading 已禁用");
        }
    }
     // 判断操作系统
        var isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    // 监听键盘事件，根据操作系统选择不同的快捷键
    document.addEventListener('keydown', function (e) {
        if ((isMac && e.ctrlKey && e.key === 'b') || (!isMac && e.altKey && e.key === 'b')) {
            toggleBionicReading();
        }
    });
})();