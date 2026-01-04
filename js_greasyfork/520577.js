// ==UserScript==
// @name         教育研修网刷课
// @namespace    刷课脚本
// @version      0.1
// @description  自动看课程（仅限于研修教学网）
// @author       lswei
// @match        https://ipx.yanxiu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520577/%E6%95%99%E8%82%B2%E7%A0%94%E4%BF%AE%E7%BD%91%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/520577/%E6%95%99%E8%82%B2%E7%A0%94%E4%BF%AE%E7%BD%91%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    // 页面刷新函数
    function refreshPage() {
        window.location.reload();
    }

    // 主页面逻辑
    function handleMainPage() {
        const unfinishedItems = document.querySelectorAll('.item-infos.default');
        if (unfinishedItems.length > 0) {
            unfinishedItems[0].previousElementSibling.click();
            setTimeout(refreshPage, 300000);
            clearInterval(intervalId);
        } else {
            const nextPageBtn = document.querySelector('.ivu-page-next');
            if (nextPageBtn) nextPageBtn.click();
        }
    }

    // 等待函数
    function waitTimeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function handleReplay() {
        // 查找结束窗口
        const endedMask = document.querySelector('.ended-mask');
        if (endedMask && endedMask.style.display === "") {
            // 结束窗口可见时，查找并点击“重新播放”按钮
            const replayBtn = document.querySelector('.replay');
            if (replayBtn) {
                replayBtn.click();
            }
        }
    }

    function handleNextLesson() {
        // 查找结束窗口
        const endedMask = document.querySelector('.ended-mask');
        if (endedMask && endedMask.style.display === "") {
            // 结束窗口可见时，查找“点击观看下一节课程”按钮
            const nextBtn = document.querySelector('.btns .next');
            if (nextBtn) {
                nextBtn.click();
            }
        }
    }
    function muteVideo() {
        // 查找视频元素
        const video = document.querySelector('video');
        if (video) {
            video.volume = 0; // 静音视频
        }
    }

    function handleContinueTiming() {
        // 查找“继续计时”窗口
        const alarmClock = document.querySelector('.alarmClock-wrapper');
        if (alarmClock) {
            // 检查是否显示
            const isVisible = getComputedStyle(alarmClock).display !== 'none';
            if (isVisible) {
                // 查找并点击“点我继续计时”的区域
                const continueButton = alarmClock.querySelector('.text p');
                if (continueButton && continueButton.innerText.includes("点我")) {
                    continueButton.click();
                    console.log("已点击继续计时按钮！");
                } else {
                    console.error("未找到符合条件的继续计时按钮！");
                }
            } else {
                console.log("计时窗口存在但未显示！");
            }
        } else {
            console.log("未找到继续计时窗口！");
        }
    }




    // 次页面逻辑
    async function handleSubPage() {
        const infoRate = document.querySelector('.scoring-wrapper .info-rate:not([style*="display: none"])');
        const submitButton = Array.from(document.querySelectorAll('button')).find(el => el.textContent.trim() === "提交");

        if (infoRate && submitButton) {
            const rateItem = infoRate.querySelector('.rate-item:last-child');
            if (rateItem) {
                rateItem.dispatchEvent(new MouseEvent("mouseleave", { bubbles: true }));
                await waitTimeout(500);
                rateItem.click();
                await waitTimeout(500);
                submitButton.click();
            } else {
                console.error("评分星星未找到！");
            }
        } else {
            console.error("评分区域或提交按钮未找到！");
        }
        // 检查是否需要点击“下一节”
        handleReplay(); //修改为重复播放
        // 视频静音
        muteVideo();
        //点击继续计时
        handleContinueTiming();
    }

    // 自动化任务
    async function automationTask() {
        if (document.URL.includes('train2')) {
            handleMainPage();
        } else if (document.URL.includes('grain')) {
            await handleSubPage();
        }
    }

    const intervalId = setInterval(automationTask, 3000);
})();

