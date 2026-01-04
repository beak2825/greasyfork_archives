// ==UserScript==
// @name         屏蔽GitHub上反动内容的仓库
// @namespace    http://tampermonkey.net/
// @version      1.5.2
// @description  由于直播时查看github搜索正常内容时出现反动内容而被封直播间，特此屏蔽GitHub上反动内容的仓库。
// @author       cangerjun
// @match        https://github.com/*  
// @grant        none
// @icon         https://github.com/fluidicon.png
// @downloadURL https://update.greasyfork.org/scripts/513572/%E5%B1%8F%E8%94%BDGitHub%E4%B8%8A%E5%8F%8D%E5%8A%A8%E5%86%85%E5%AE%B9%E7%9A%84%E4%BB%93%E5%BA%93.user.js
// @updateURL https://update.greasyfork.org/scripts/513572/%E5%B1%8F%E8%94%BDGitHub%E4%B8%8A%E5%8F%8D%E5%8A%A8%E5%86%85%E5%AE%B9%E7%9A%84%E4%BB%93%E5%BA%93.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 初始化关键词列表
    let keywords = JSON.parse(localStorage.getItem('blockedKeywords')) || [];

    // 从GitHub仓库中获取关键词列表
    function fetchKeywords() {
        fetch('https://raw.githubusercontent.com/cangerjun/No-Reactionaries/main/list.txt')
            .then(response => response.text())
            .then(data => {
                keywords = data.split('\n').map(line => line.trim()).filter(line => line !== '');
                localStorage.setItem('blockedKeywords', JSON.stringify(keywords));
                hideDivsWithKeywordInSpan();
            })
            .catch(error => {
                console.error('Error fetching the keyword list:', error);
            });
    }

    // 创建正则表达式用于匹配关键词
    function createKeywordRegex(keywords) {
        return new RegExp(keywords.map(keyword => keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'i');
    }

    // 查找并隐藏包含关键词span的div元素
    function hideDivsWithKeywordInSpan() {
        const keywordRegex = createKeywordRegex(keywords);

        // 获取目标div元素
        const targetDivs = document.querySelectorAll('[class*="Box-sc-g0xbh4-0"]');

        // 遍历每个目标div
        targetDivs.forEach(targetDiv => {
            // 获取当前div下的所有span元素
            const spans = targetDiv.querySelectorAll('span');

            // 遍历每个span
            for (let span of spans) {
                // 检查span的内容是否包含关键词
                if (keywordRegex.test(span.textContent)) {
                    // 如果包含，则隐藏该div，并替换其内容
                    targetDiv.innerHTML = '<span style="color: red;">🚫该内容不符合法律法规已被封印无法解除🚫</span>';
                    targetDiv.style.display = 'none';
                    break; // 跳出循环，避免不必要的检查
                }
            }
        });
    }

    // 监听DOM变化
    function setupMutationObserver() {
        const observer = new MutationObserver(() => {
            hideDivsWithKeywordInSpan();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // 如果关键词列表为空，则从GitHub获取
    if (keywords.length === 0) {
        fetchKeywords();
    } else {
        // 立即执行一次
        hideDivsWithKeywordInSpan();
    }

    // 设置监听器
    setupMutationObserver();
})();
