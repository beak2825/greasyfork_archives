// ==UserScript==
// @name         百度网盘分享页面默认按修改日期排序
// @namespace    http://tampermonkey.net/
// @version      0.1.3.7
// @description  在分享的百度网盘页面自动按修改日期排序
// @author       15d23
// @match        *://pan.baidu.com/s/*
// @match        *://pan.baidu.com/share/*
// @description 2025/1/15 23:00:19
// @run-at       document-end
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/523861/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E5%88%86%E4%BA%AB%E9%A1%B5%E9%9D%A2%E9%BB%98%E8%AE%A4%E6%8C%89%E4%BF%AE%E6%94%B9%E6%97%A5%E6%9C%9F%E6%8E%92%E5%BA%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/523861/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E5%88%86%E4%BA%AB%E9%A1%B5%E9%9D%A2%E9%BB%98%E8%AE%A4%E6%8C%89%E4%BF%AE%E6%94%B9%E6%97%A5%E6%9C%9F%E6%8E%92%E5%BA%8F.meta.js
// ==/UserScript==
(function() {
    'use strict';

    let isManualClick = false;

    function findAndClickDateSort() {
        console.log('开始查找排序按钮');

        // 等待页面加载完成
        function waitForElements() {
            // 查找包含"已全部加载"的元素，确认列表已加载
            const loadStatus = document.querySelector('.FcucHsb');
            if (!loadStatus || (!loadStatus.textContent.includes('已全部加载') && !loadStatus.textContent.match(/已加载\d+个/))) {
                console.log('等待文件列表加载完成...');
                setTimeout(waitForElements, 500);
                return;
            }

            // 查找修改日期按钮
            const spans = document.querySelectorAll('span.text');
            let dateSpan = null;
            for (const span of spans) {
                if (span.textContent === '修改日期') {
                    dateSpan = span;
                    break;
                }
            }

            if (!dateSpan) {
                console.log('未找到修改日期按钮，重试中...');
                setTimeout(waitForElements, 500);
                return;
            }

            // 找到包含修改日期的li元素
            const dateLi = dateSpan.closest('li[data-key="time"]');
            if (!dateLi) {
                console.log('未找到排序按钮的父元素，重试中...');
                setTimeout(waitForElements, 500);
                return;
            }

            // 添加点击事件监听器
            dateLi.addEventListener('click', () => {
                isManualClick = true;
                setTimeout(colorGroupByDate, 300);
            });

            // 检查class数量
            const classCount = dateLi.classList.length;
            console.log('找到排序按钮，class数量:', classCount);

            // 添加300ms延时后执行
            setTimeout(() => {
                // 如果class数量不等于3且不是手动点击才执行点击
                if (classCount !== 3 && !isManualClick) {
                    console.log('执行点击操作');
                    dateLi.click();
                } else {
                    console.log('class数量为3或手动点击，跳过点击');
                }
                // 保持原有的染色延时为1000ms，确保颜色能正常显示
                setTimeout(colorGroupByDate, 300);
            }, 300);
        }

        waitForElements();
    }

    // 添加按日期分组着色函数
    function colorGroupByDate() {
        console.log('开始执行颜色分组...');
        const colors = [
            '#f0f7ff', // 浅蓝
            '#fff7f0', // 浅橙
            '#f5fff0', // 浅绿
            '#fff0f7', // 浅粉
            '#f0ffff', // 浅青
        ];

        // 先找到所有日期单元格，然后通过它们找到对应的行
        const dateCells = document.querySelectorAll('.ctime');
        console.log('找到日期单元格数量:', dateCells.length);

        let currentDate = '';
        let colorIndex = 0;

        dateCells.forEach((dateCell, index) => {
            // 获取父行元素（dd标签）
            const row = dateCell.closest('dd');
            if (row) {
                const dateText = dateCell.textContent.split(' ')[0]; // 只取日期部分
                console.log(`第${index + 1}行 - 日期: ${dateText}, 当前颜色索引: ${colorIndex}`);

                // 如果日期变化，切换颜色
                if (dateText !== currentDate) {
                    currentDate = dateText;
                    colorIndex = (colorIndex + 1) % colors.length;
                    console.log(`日期变化 - 新日期: ${dateText}, 新颜色索引: ${colorIndex}, 颜色值: ${colors[colorIndex]}`);
                }

                // 应用背景色
                row.style.backgroundColor = colors[colorIndex];
                // 确保背景色可见
                row.style.position = 'relative';
                row.style.zIndex = '1';
                console.log(`应用颜色到第${index + 1}行: ${colors[colorIndex]}`);
            } else {
                console.log(`第${index + 1}个日期单元格未找到对应的行元素`);
            }
        });

        console.log('颜色分组完成');
    }

    // 页面加载完成后执行
    console.log('页面加载完成，开始执行脚本');
    setTimeout(findAndClickDateSort, 1000);

    // 监听URL变化
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            isManualClick = false; // URL变化时重置手动点击状态
            console.log('检测到URL变化，重新执行排序');
            setTimeout(() => {
                findAndClickDateSort();
            }, 1000);
        }
    }).observe(document, {subtree: true, childList: true});

})();
