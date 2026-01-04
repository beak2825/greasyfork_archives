// ==UserScript==
// @name         移除笔趣阁多余的空格
// @namespace    http://www.biquxs.com/
// @version      0.4
// @description  移除多余空格并且在手动滚动到最底部并且至少在本页面停留5秒后再次滚动则会跳转到下一章
// @author       zsjng
// @match        http://www.biquxs.com/*
// @match        http://www.xsbiquge.la/*
// @grant        none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/485842/%E7%A7%BB%E9%99%A4%E7%AC%94%E8%B6%A3%E9%98%81%E5%A4%9A%E4%BD%99%E7%9A%84%E7%A9%BA%E6%A0%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/485842/%E7%A7%BB%E9%99%A4%E7%AC%94%E8%B6%A3%E9%98%81%E5%A4%9A%E4%BD%99%E7%9A%84%E7%A9%BA%E6%A0%BC.meta.js
// ==/UserScript==


(function() {
    'use strict';

    var lastScrollTime = 0;

    // 获取所有文本节点
    function getAllTextNodes(element) {
        var walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
        var nodes = [];
        while (walker.nextNode()) {
            nodes.push(walker.currentNode);
        }
        return nodes;
    }

    // 替换连续的8个&nbsp;为一个空格
    function replaceConsecutiveNbsp() {
        var textNodes = getAllTextNodes(document.body);
        for (var i = 0; i < textNodes.length; i++) {
            var textNode = textNodes[i];
            textNode.nodeValue = textNode.nodeValue.replace(/(\u00A0){8}/g, ' ');
        }
    }

    // 移除<div class="content">下的所有<br>元素
    function removeBrElementsInContent() {
        var contentDivs = document.querySelectorAll('div.content');
        for (var i = 0; i < contentDivs.length; i++) {
            var contentDiv = contentDivs[i];
            var brElements = contentDiv.querySelectorAll('br');
            for (var j = 0; j < brElements.length; j++) {
                var brElement = brElements[j];
                brElement.parentNode.removeChild(brElement);
            }
        }
    }

    // 自动点击下一章链接
    function autoClickNextChapter() {
        var nextChapterLink = document.querySelector('a.next');
        if (nextChapterLink) {
            nextChapterLink.click();
        }
    }

    // 滚动到页面底部时自动点击下一章链接
    function handleScroll() {
        var currentTime = new Date().getTime();
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight && (currentTime - lastScrollTime) > 5000) {
            autoClickNextChapter();
            lastScrollTime = currentTime;
        }
    }

    // 页面加载完成后执行替换和移除操作
    window.addEventListener('load', function() {
        replaceConsecutiveNbsp();
        removeBrElementsInContent();
    });

    // 在页面变化时，例如异步加载内容时，继续执行替换和移除操作
    var observer = new MutationObserver(function() {
        replaceConsecutiveNbsp();
        removeBrElementsInContent();
    });
    observer.observe(document.body, { subtree: true, childList: true });

    // 滚动到页面底部时自动点击下一章链接
    window.addEventListener('scroll', handleScroll);
})();
