// ==UserScript==
// @name         pcrclan
// @namespace    pcrclan
// @version      1.0
// @description  Add additional information to ranking list entries.
// @author       You
// @match        https://game.bilibili.com/tool/pcr/chart
// @match        https://game.bilibili.com/tool/pcr/rank
// @match        https://game.bilibili.com/tool/pcr/search
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/513922/pcrclan.user.js
// @updateURL https://update.greasyfork.org/scripts/513922/pcrclan.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const rankingListContainerSelector = '.chart-rank-list';
    let isDataLoading = false; // 标志变量记录数据是否正在加载

    function debounce(func, wait, immediate) {
        let timeout;
        return function() {
            const context = this,
                args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    function getScoreFromText(txtDiv) {
        try {
            const scoreText = txtDiv.find('div:contains("分数：")').text();
            const scoreMatch = scoreText.match(/分数：(\d+)/);
            if (scoreMatch && scoreMatch[1]) {
                return parseInt(scoreMatch[1], 10);
            } else {
                console.error('无法从文本中提取分数:', scoreText);
                return null;
            }
        } catch (e) {
            console.error('Error getting score:', e);
            return null;
        }
    }

    function calculateWeekAndRemainingHP(score) {
        let week = [1, 1]; // 初始周目
        let remainingHp = 0;
        let currentHP = 6000000;
        const lap_num = [3, 10, 30, 38, 999];
        const hp = [
            [6000000, 8000000, 10000000, 12000000, 15000000],
            [6000000, 8000000, 10000000, 12000000, 15000000],
            [12000000, 14000000, 17000000, 19000000, 22000000],
            [22000000, 23000000, 27000000, 29000000, 31000000],
            [145000000, 150000000, 175000000, 195000000, 210000000]
        ];
        const multiple = [
            [1.2, 1.2, 1.3, 1.4, 1.5],
            [1.6, 1.6, 1.8, 1.9, 2],
            [2, 2, 2.4, 2.4, 2.6],
            [3.5, 3.5, 3.7, 3.8, 4],
            [3.5, 3.5, 3.7, 3.8, 4]
        ];

        while (score >= 0) {
            let lapIndex = lap_num.findIndex(lap => week[0] <= lap);

            let kingIndex = week[1] - 1;
            currentHP = hp[lapIndex][kingIndex];
            let currentMultiple = multiple[lapIndex][kingIndex];

            if (score - currentHP * currentMultiple < 0) {
                remainingHp = Math.round(currentHP - score / currentMultiple); // 四舍五入
                break;
            }
            score -= currentHP * currentMultiple;

            if (++week[1] > 5) {
                week[1] = 1;
                week[0]++;
            }
        }

        return { week: week, remainingHp: remainingHp, currentHP: currentHP };
    }

    function modifyRankingList() {
        const rankingListContainer = $(rankingListContainerSelector);

        if (rankingListContainer.length > 0) {
            rankingListContainer.find('.week-info').remove();
            rankingListContainer.find('.remainingHp-info').remove();

            rankingListContainer.find('ul li').each((index, element) => {
                const $element = $(element);
                const boxDiv = $element.find('.box');

                if (boxDiv.length > 0) {
                    const txtDiv = boxDiv.find('.txt');

                    if (txtDiv.length > 0) {
                        const score = getScoreFromText(txtDiv);

                        if (score !== null) {
                            const result = calculateWeekAndRemainingHP(score);
                            const remainingHpElement = $('<div class="remainingHp-info">血量：' + result.remainingHp + ' / ' + result.currentHP + '</div>');
                            const weekElement = $('<div class="week-info"><div>周目：' + result.week.join('-') + '</div></div>');

                            txtDiv.append(remainingHpElement);
                            boxDiv.append(weekElement);
                        }
                    }
                }
            });

            console.log('Ranking list modified successfully.');
        } else {
            console.error('Ranking list container not found.');
        }
    }

    function addRefreshButton() {
        const button = $('<button id="refresh-button" style="position: fixed; top: 10px; right: 10px; color: #5f96f0; font-size: 0.6875rem; padding: 0 0.9375rem; height: 1.625rem; border-radius: 1.625rem; cursor: pointer; background: #fff; border: none;">刷新计算</button>');
        $('body').prepend(button);

        $('#refresh-button').on('click', () => {
            modifyRankingList();
        });
    }

    $(document).ready(() => {
        // 在文档加载完成时立即执行一次
        modifyRankingList();

        // 添加刷新按钮
        addRefreshButton();

        const observerCallback = function(mutationsList, observer) {
            mutationsList.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node instanceof Element && node.classList.contains('jq-loading')) {
                            console.log('Loading indicator added:', node);
                            isDataLoading = true; // 设置标志为 true 表示数据正在加载
                        }
                    });
                    mutation.removedNodes.forEach(node => {
                        if (node instanceof Element && node.classList.contains('jq-loading')) {
                            console.log('Loading indicator removed:', node);
                            if (isDataLoading) {
                                isDataLoading = false; // 数据加载完成，设置标志为 false
                                modifyRankingList(); // 触发更新逻辑
                            }
                        }
                    });
                }
            });
        };

        const observer = new MutationObserver(debounce(observerCallback, 10));
        observer.observe(document.body, { childList: true, subtree: true });

        // 使用定时器检查 .jq-loading 的状态
        const checkLoadingStatus = setInterval(() => {
            if ($('.jq-loading').length > 0) {
                console.log('Loading indicator detected in the document.');
                isDataLoading = true;
            } else if (isDataLoading) {
                console.log('Loading indicator removed by checking status.');
                isDataLoading = false;
                modifyRankingList(); // 触发更新逻辑
            }
        }, 500); // 每500毫秒检查一次

        // 清除定时器
        window.addEventListener('beforeunload', () => {
            clearInterval(checkLoadingStatus);
            observer.disconnect();
        });

        // 检查初始状态
        if ($('.jq-loading').length > 0) {
            console.log('Initial loading indicator found, setting isDataLoading to true');
            isDataLoading = true;
        }
    });
})();