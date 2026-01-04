// ==UserScript==
// @name         PubMedPro检索结果自动翻译
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在pubmed.pro网站上自动点击所有英汉翻译按钮
// @author       wyek1n
// @match        https://www.pubmed.pro/*
// @match        https://pubmed.pro/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/537279/PubMedPro%E6%A3%80%E7%B4%A2%E7%BB%93%E6%9E%9C%E8%87%AA%E5%8A%A8%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/537279/PubMedPro%E6%A3%80%E7%B4%A2%E7%BB%93%E6%9E%9C%E8%87%AA%E5%8A%A8%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 延迟执行函数，等待页面完全加载
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 点击翻译按钮的函数
    function clickTranslateButtons() {
        // 使用两种选择器来查找翻译按钮
        const selectors = [
            'span.el-switch__core[style*="width: 40px"]',
            '#pane-pubmed span.el-switch__core',
            '.articleList span.el-switch__core',
            '.translate span.el-switch__core'
        ];

        let clickedCount = 0;

        selectors.forEach(selector => {
            const buttons = document.querySelectorAll(selector);
            buttons.forEach(button => {
                // 检查按钮是否已经被点击过（通过检查父元素的状态）
                const switchElement = button.closest('.el-switch');
                if (switchElement && !switchElement.classList.contains('is-checked')) {
                    try {
                        button.click();
                        clickedCount++;
                        console.log(`点击了翻译按钮: ${selector}`);
                    } catch (error) {
                        console.log(`点击按钮时出错: ${error}`);
                    }
                }
            });
        });

        if (clickedCount > 0) {
            console.log(`总共点击了 ${clickedCount} 个翻译按钮`);
        }

        return clickedCount;
    }

    // 观察DOM变化的函数
    function observeChanges() {
        const observer = new MutationObserver((mutations) => {
            let shouldCheck = false;
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // 检查是否有新的文章列表项被添加
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.classList && (
                                node.classList.contains('articleList') ||
                                node.querySelector && node.querySelector('.articleList') ||
                                node.classList.contains('translate') ||
                                node.querySelector && node.querySelector('.translate')
                            )) {
                                shouldCheck = true;
                            }
                        }
                    });
                }
            });

            if (shouldCheck) {
                setTimeout(clickTranslateButtons, 1000); // 延迟1秒后点击新出现的按钮
            }
        });

        // 开始观察整个文档的变化
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        console.log('开始观察页面变化...');
    }

    // 主执行函数
    async function main() {
        console.log('Pubmed.pro 自动翻译脚本已启动');

        // 等待页面加载
        await delay(2000);

        // 第一次点击已存在的按钮
        clickTranslateButtons();

        // 开始观察页面变化
        observeChanges();

        // 定期检查新的翻译按钮（用于处理延迟加载的内容）
        setInterval(() => {
            clickTranslateButtons();
        }, 5000); // 每5秒检查一次
    }

    // 当页面加载完成时执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }

})(); 