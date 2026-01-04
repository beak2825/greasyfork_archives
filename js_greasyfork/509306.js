// ==UserScript==
// @name         推特仿生阅读
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  根据单词长度智能加粗推特推文和评论中的词根部分，小于3个字母的单词只加粗第一个字母
// @author       yitong233
// @match        https://x.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/509306/%E6%8E%A8%E7%89%B9%E4%BB%BF%E7%94%9F%E9%98%85%E8%AF%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/509306/%E6%8E%A8%E7%89%B9%E4%BB%BF%E7%94%9F%E9%98%85%E8%AF%BB.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 常见后缀字典
    const suffixes = [
    'ly', 'ion', 'ness', 'ed', 'al', 'ive', 'ing', 'ar', 'er', 'ir', 'or', 'ur',
    'itude', 'able', 'ible', 'ary', 'ate', 'ess', 'less', 'ship', 'fy', 'ic', 'um',
    'us', 'ty', 'ity', 'ant', 'ent', 'end', 'and', 'ance', 'ence', 'ancy', 'ency',
    'id', 'te', 'ize', 'ise', 'ous', 'hood', 'icle', 'cle', 'et', 'kin', 'let', 'y',
    'ward', 'wise', 'dom', 'craft', 'cracy', 'ice', 'ology', 'graphy', 'ry', 'ment',
    'ship', 'fy', 'en', 'ate', 'ish'
    ];


    // 检查单词是否有常见后缀，并返回词根与后缀的分割
    function splitRootAndSuffix(word) {
        for (let suffix of suffixes) {
            if (word.toLowerCase().endsWith(suffix) && word.length > suffix.length + 2) { // 确保词根长度至少为2
                let root = word.slice(0, word.length - suffix.length); // 获取词根
                return { root, suffix }; // 返回词根和后缀
            }
        }
        return { root: word, suffix: '' }; // 没有常见后缀时，整个单词视作词根
    }

    // 格式化单词：根据单词长度加粗不同数量的字母
    function formatWord(word) {
        let { root, suffix } = splitRootAndSuffix(word);
        let boldLength;

        // 根据单词长度决定加粗字母的数量
        if (root.length <= 3) {
            boldLength = 1; // 1-3长度的单词加粗第一个字母
        } else {
            boldLength = Math.min(4, root.length); // 其他单词最多加粗4个字母
        }

        let boldPart = root.slice(0, boldLength);
        let restPart = root.slice(boldLength) + suffix; // 剩余部分加上后缀
        return `<b>${boldPart}</b>${restPart}`;
    }

    // 处理单个文本节点
    function processTextNode(textNode) {
        const words = textNode.textContent.split(/\s+/);
        const formattedWords = words.map(word => formatWord(word)).join(' ');

        // 用于将HTML插入到文本节点
        const span = document.createElement('span');
        span.innerHTML = formattedWords;

        // 替换当前的文本节点
        textNode.replaceWith(span);
    }

    // 遍历元素的子节点，处理其中的文本节点
    function traverseAndFormatText(node) {
        node.childNodes.forEach(child => {
            if (child.nodeType === Node.TEXT_NODE && child.textContent.trim().length > 0) {
                // 处理文本节点
                processTextNode(child);
            } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== 'SCRIPT' && child.tagName !== 'STYLE') {
                // 递归处理子节点
                traverseAndFormatText(child);
            }
        });
    }

    // 应用到推文和评论的节点
    function applyBionicReading(batchSize = 10) {
        let tweetContents = document.querySelectorAll('article div[lang]:not([data-bionic-processed])'); // 仅选择未处理的推文
        let processedCount = 0;

        tweetContents.forEach(content => {
            if (processedCount >= batchSize) return; // 一次只处理一定数量的推文
            traverseAndFormatText(content); // 处理推文中的文本节点
            content.setAttribute('data-bionic-processed', 'true'); // 标记为已处理
            processedCount++;
        });
    }

    // 延迟执行以防止瞬间处理过多数据
    function debounce(fn, delay) {
        let timer;
        return function () {
            clearTimeout(timer);
            timer = setTimeout(() => {
                fn();
            }, delay);
        };
    }

    // 初次运行
    applyBionicReading();

    // 监听推特页面动态加载的变化，使用节流避免卡顿
    let observer = new MutationObserver(debounce(() => {
        applyBionicReading(5); // 每次只处理5条推文
    }, 500)); // 每500ms检查一次新内容

    observer.observe(document.body, { childList: true, subtree: true });
})();
