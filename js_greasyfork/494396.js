// ==UserScript==
// @name         Bilibili UP主更新周期显示
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  尝试找出真正高产的优秀up主！
// @author       卧波云龙
// @match        *://space.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/494396/Bilibili%20UP%E4%B8%BB%E6%9B%B4%E6%96%B0%E5%91%A8%E6%9C%9F%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/494396/Bilibili%20UP%E4%B8%BB%E6%9B%B4%E6%96%B0%E5%91%A8%E6%9C%9F%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function processVideoItems(){
        // 查找ID为page-video的div元素
        const videoPageContainer = document.getElementById('page-video');
        // 确保找到了ID为page-video的元素
        if (videoPageContainer) {
            // 在ID为page-video的元素内部查找所有的视频项
            const videoItems = videoPageContainer.querySelectorAll('.small-item.fakeDanmu-item');
            console.log(`找到的视频项数量: ${videoItems.length}`);
            if (videoItems.length === 0) {
                console.warn('在指定的容器内没有找到视频项，检查选择器或页面结构是否正确。');
            } else {
                let videosDate = []; // 用于存储视频发布日期
                // 转换字符串日期为日期对象
/*                 videoItems.forEach((item, index) => {
                    const timeSpan = item.querySelector('span.time');
                    if (timeSpan) {
                        const dateStr = timeSpan.textContent.trim(); // 移除字符串两端的空白字符
                        // 正则表达式匹配提供的日期格式
                        const dateRegex = /^(?:(\d{4})-)?(\d{1,2})-(\d{1,2})$/;
                        const match = dateStr.match(dateRegex);
                        if (match) {
                            let year, month, day;
                            // 如果日期字符串中包含年份
                            if (match[1]) {
                                year = match[1];
                            } else {
                                // 如果没有年份，使用当前年份
                                year = new Date().getFullYear();
                            }
                            // 月份和日期，确保是两位数
                            month = String(match[2]).padStart(2, '0');
                            day = String(match[3]).padStart(2, '0');
                            // 构建完整的日期字符串
                            const fullDateStr = `${year}-${month}-${day}`;
                            // 使用构建的日期字符串创建Date对象
                            const releaseDate = new Date(fullDateStr);
                            const sixMonthsAgo = new Date();
                            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
                            if (releaseDate >= sixMonthsAgo && !isNaN(releaseDate.getTime())) {
                                videosDate.push(releaseDate);
                            }
                        }
                        else
                        {
                            console.warn('日期转化失败:',dateStr);
                        }
                    }
                }); */
                 // 转换字符串日期为日期对象
                videoItems.forEach((item, index) => {
                    const timeSpan = item.querySelector('span.time');
                    if (timeSpan) {
                        const dateStr = timeSpan.textContent.trim();
                        // 正则表达式匹配提供的日期格式或包含"分钟"、"小时"、"昨天"的字符串
                        const dateRegex = /^(?:(\d{4})-)?(\d{1,2})-(\d{1,2})$/;
                        const recentRegex = /分钟|小时|昨天/;
                        let releaseDate;
                        if (dateStr.match(recentRegex)) {
                            // 如果包含"分钟"、"小时"、"昨天"，则使用当前日期
                            releaseDate = new Date();
                        } else {
                            const match = dateStr.match(dateRegex);
                            if (match) {
                                let year, month, day;
                                if (match[1]) {
                                    year = match[1];
                                } else {
                                    year = new Date().getFullYear();
                                }
                                month = String(match[2]).padStart(2, '0');
                                day = String(match[3]).padStart(2, '0');
                                const fullDateStr = `${year}-${month}-${day}`;
                                releaseDate = new Date(fullDateStr);
                            }
                        }
                        if (releaseDate && !isNaN(releaseDate.getTime())) {
                            const sixMonthsAgo = new Date();
                            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
                            if (releaseDate >= sixMonthsAgo) {
                                videosDate.push(releaseDate);
                            }
                        } else {
                            console.warn('日期转化失败:', dateStr);
                        }
                    }
                });
                // 确保至少有两个日期数据以进行计算
                if (videosDate.length >= 2) {
                    // 将日期对象转换为时间戳
                    const dates = videosDate.map(date => date.getTime());
                    // 计算第一个和最后一个日期之间的天数差
                    const diffInDays = (dates[0] - dates[dates.length - 1]) / (1000 * 60 * 60 * 24);
                    // 计算平均更新周期，结果为平均多少天更新一次视频
                    const averageUpdatePeriod = diffInDays / videosDate.length;
                    // 保留一位小数
                    const averageUpdatePeriodRounded = averageUpdatePeriod.toFixed(1);
                    if (0 <= averageUpdatePeriod &&averageUpdatePeriod <= 1) {
                        displayResult("发现更新狂魔一枚");
                    } else {
                        displayResult(`平均更新周期: ${averageUpdatePeriodRounded} 天`);
                    }
                    console.log('脚本加载完成');
                }
                else {
                    displayResult('视频数量不足以计算平均更新周期');
                }
            }
        } else {
            console.warn('未找到ID为page-video的元素，请检查页面结构是否正确。');
        }
    }
    function displayResult(message) {
        const targetElement = document.querySelector('h4.h-sign');
        if (targetElement) {
            targetElement.textContent += ` | ${message}`;
        } else {
            console.warn('未找到h4.h-sign元素，无法显示结果。');
        }
    }
     function setupObserver() {
        const observer = new MutationObserver((mutations, obs) => {
            const videoPageContainer = document.getElementById('page-video');
            if (videoPageContainer) {
                processVideoItems();
                obs.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    window.addEventListener('load', setupObserver);

})();