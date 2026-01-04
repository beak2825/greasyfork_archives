// ==UserScript==
// @name         知乎答主H指数统计
// @version      1.2
// @description  在知乎答主主页统计回答的h-index
// @author       @高耗氧动物
// @namespace    https://www.zhihu.com/people/czarja
// @match        https://www.zhihu.com/people/*/answers*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531406/%E7%9F%A5%E4%B9%8E%E7%AD%94%E4%B8%BBH%E6%8C%87%E6%95%B0%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/531406/%E7%9F%A5%E4%B9%8E%E7%AD%94%E4%B8%BBH%E6%8C%87%E6%95%B0%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';


    GM_addStyle(`
        .stats-loader {
            padding: 12px 16px;
            border-bottom: 1px solid #f0f2f7;
            cursor: pointer;
            color: #0084ff;
            font-weight: 600;
            display: flex;
            align-items: center;
        }
        .stats-loader:hover {
            background-color: #f6f6f6;
        }
        .stats-loader svg {
            margin-right: 8px;
        }
        .stats-container {
            padding: 12px 16px;
            border-bottom: 1px solid #f0f2f7;
        }
        .stats-item {
            margin-bottom: 8px;
            display: flex;
            justify-content: space-between;
        }
    `);

    // 等待页面加载完成
    window.addEventListener('load', function() {
        const cardHeader = document.querySelector('.Card .Card-header');
        if (!cardHeader) return;

        // 找到Card-header的父元素
        // const card = cardHeader.parentElement;
        // if (!card) return;

        // 创建加载按钮
        const loader = document.createElement('div');
        loader.className = 'stats-loader';
        loader.innerHTML = `
            <svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
            </svg>
            点击加载统计
        `;

        // 创建统计结果容器
        const statsContainer = document.createElement('div');
        statsContainer.className = 'stats-container';
        statsContainer.style.display = 'none';

        // 在Card-header之后插入元素
        cardHeader.insertAdjacentElement('afterend', statsContainer);
        cardHeader.insertAdjacentElement('afterend', loader);


        let hIndex = 0;
        loader.addEventListener('click', function() {
            if (statsContainer.style.display === 'none') {
                loader.innerHTML = `
                    <svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46A7.93 7.93 0 0 0 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74A7.93 7.93 0 0 0 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
                    </svg>
                    正在加载统计...
                `;

                // 设置一个间隔检查，因为有些内容可能是异步加载的
                const interval = setInterval(function() {
                    // 查找所有可能的排序按钮
                    const buttons = document.querySelectorAll('#Popover4-toggle');
                    if (buttons[0].innerText.trim() !== "按赞同排序") {
                        buttons[0].click(); // 如果不是，则点击按钮
                        const buttons2 = document.querySelectorAll('#Select1-1');
                        buttons2[0].click()
                    }
                    clearInterval(interval);
                    (async () => {
                        const hIndex = await startAutoScroll();
                        //console.log(`finished with h= ${hIndex}`);

                        statsContainer.innerHTML = `
                         <div class="stats-item"><span>h-index:</span><span>${hIndex}</span></div>`;

                        statsContainer.style.display = 'block';

                        loader.innerHTML = `
                        <svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                        </svg>
                        回答统计
                        `;

                        // 滚动回顶部
                        window.scrollTo({
                            top: 0,
                            behavior: 'smooth' // 平滑滚动
                        });

                        simulateEscapeKey();
                    })();

                    //console.log(`finished with h= ${hIndex}`);
                }, 500); // 每500毫秒检查一次

                // 10秒后如果还没找到，停止检查
                setTimeout(() => clearInterval(interval), 10000);
            } else {
                statsContainer.style.display = 'none';
                loader.innerHTML = `
                <svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                </svg>
               点击加载统计
                `;
            }
        });
    });

    function simulateEscapeKey() {
        // 创建键盘事件
        const escEvent = new KeyboardEvent('keydown', {
            key: 'Escape',
            code: 'Escape',
            keyCode: 27, // ESC 键的 keyCode
            bubbles: true, // 允许事件冒泡
            cancelable: true // 允许事件被取消
        });

        // 触发事件（通常在 document 或特定元素上）
        document.dispatchEvent(escEvent);
    }

    function startAutoScroll() {
        return new Promise((resolve) => {
            let scrollAttempts = 0;
            const maxAttempts = 100;
            const scrollDelay = 1500;
            let hIndex = 0;
            let prevAnswerLen = 0;
            let curAnswerLen = 0;

            const scrollInterval = setInterval(() => {
                if (scrollAttempts >= maxAttempts) {
                    clearInterval(scrollInterval);
                    //console.log('已达到最大滚动次数，停止自动加载');
                    resolve(hIndex);
                    return;
                }

                window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: 'smooth'
                });

                //console.log(`第 ${scrollAttempts + 1} 次滚动到底部，等待新内容加载...`);

                setTimeout(() => {
                    scrollAttempts++;
                }, scrollDelay);

                [hIndex, curAnswerLen] = extractData();
                //console.log(hIndex, curAnswerLen)

                if (hIndex < curAnswerLen) {
                    clearInterval(scrollInterval);
                    resolve(hIndex);
                    return;
                } else {
                    prevAnswerLen = curAnswerLen;
                }

            }, scrollDelay + 500);
        });
    }

    function extractData () {
        const answers = [];
        document.querySelectorAll('.ContentItem').forEach(item => {
            const upvoteMeta = item.querySelector('meta[itemprop="upvoteCount"]');
            const upvotes = upvoteMeta ? parseInt(upvoteMeta.getAttribute('content')) : 0;
            answers.push(upvotes);
        });
        let hIndex = 0;
        const n = answers.length;

        for (let i = 0; i < n; i++) {
            if (answers[i] >= i + 1) {
                hIndex = i + 1;
            } else {
                break;
            }
        }
        return [hIndex, n];
    };

})();