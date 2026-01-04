// ==UserScript==
// @name         一键加载gitee中更多评论
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  一键展开gitee的pr中的更多评论
// @author       JavaZeroo
// @match        https://gitee.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gitee.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/538486/%E4%B8%80%E9%94%AE%E5%8A%A0%E8%BD%BDgitee%E4%B8%AD%E6%9B%B4%E5%A4%9A%E8%AF%84%E8%AE%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/538486/%E4%B8%80%E9%94%AE%E5%8A%A0%E8%BD%BDgitee%E4%B8%AD%E6%9B%B4%E5%A4%9A%E8%AF%84%E8%AE%BA.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 尝试查找“加载更多”按钮，带重试机制
    function findLoadMoreButton(maxAttempts = 10, interval = 1000) {
        let attempts = 0;
        return new Promise((resolve) => {
            const tryFind = () => {
                const loadMoreBtn = document.querySelector('.expand-more-action .main-box a');
                if (loadMoreBtn) {
                    console.log('找到“加载更多”按钮');
                    resolve(loadMoreBtn);
                } else if (attempts < maxAttempts) {
                    attempts++;
                    console.log(`未找到“加载更多”按钮，第 ${attempts} 次尝试...`);
                    setTimeout(tryFind, interval);
                } else {
                    console.log('达到最大尝试次数，仍未找到“加载更多”按钮');
                    resolve(null);
                }
            };
            tryFind();
        });
    }

    // 主逻辑
    async function init() {
        console.log('脚本开始运行，等待页面加载...');

        // 等待找到“加载更多”按钮
        const loadMoreBtn = await findLoadMoreButton();

        if (loadMoreBtn) {
            // 创建“一键加载更多”按钮
            const autoLoadBtn = document.createElement('a');
            autoLoadBtn.href = 'javascript:;';
            autoLoadBtn.textContent = '一键加载更多';
            autoLoadBtn.style.marginLeft = '10px';
            autoLoadBtn.style.color = '#007bff';
            autoLoadBtn.style.cursor = 'pointer';

            // 插入按钮
            loadMoreBtn.insertAdjacentElement('afterend', autoLoadBtn);
            console.log('已添加“一键加载更多”按钮');

            // 为新按钮添加点击事件
            autoLoadBtn.addEventListener('click', async () => {
                console.log('开始一键加载更多');
                autoLoadBtn.textContent = '加载中...';
                autoLoadBtn.style.pointerEvents = 'none';

                while (true) {
                    const btn = document.querySelector('.expand-more-action .main-box a');
                    if (!btn) {
                        console.log('所有内容已加载完成');
                        autoLoadBtn.textContent = '加载完成';
                        break;
                    }
                    console.log('点击“加载更多”');
                    btn.click();
                    // 等待 AJAX 加载完成
                    await new Promise(resolve => setTimeout(resolve, 2000));
                }
            });
        } else {
            console.log('无法添加“一键加载更多”按钮，因为未找到“加载更多”按钮');
        }
    }

    // 在页面加载后启动，或延迟执行以应对AJAX
    window.addEventListener('load', () => {
        console.log('页面加载完成，开始初始化脚本');
        setTimeout(init, 2000); // 延迟2秒启动，等待AJAX加载
    });
})();