// ==UserScript==
// @name         山东省教师教育网2025中小学远程研修
// @namespace    http://tampermonkey.net/
// @version      3.8
// @author       由 Gemini 优化，感谢founderqiang的脚本
// @description  基于山东省教师教育网2024中小学远程研修（全自动学习）优化，增加了新功能：在点击进入课程后，自动刷新主列表页面，以确保课程状态能及时更新。
// @match        *://www.qlteacher.com/
// @match        *://yxjc.qlteacher.com/project/yey*/*
// @match        *://yxjc.qlteacher.com/project/xx*/*
// @match        *://yxjc.qlteacher.com/project/cz*/*
// @match        *://yxjc.qlteacher.com/project/gz*/*
// @match        *://player.qlteacher.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qlteacher.com
// @license      桥风rewrite
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/541326/%E5%B1%B1%E4%B8%9C%E7%9C%81%E6%95%99%E5%B8%88%E6%95%99%E8%82%B2%E7%BD%912025%E4%B8%AD%E5%B0%8F%E5%AD%A6%E8%BF%9C%E7%A8%8B%E7%A0%94%E4%BF%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/541326/%E5%B1%B1%E4%B8%9C%E7%9C%81%E6%95%99%E5%B8%88%E6%95%99%E8%82%B2%E7%BD%912025%E4%B8%AD%E5%B0%8F%E5%AD%A6%E8%BF%9C%E7%A8%8B%E7%A0%94%E4%BF%AE.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // =========================================================================
    //  记忆功能模块 (与v3.8相同)
    // =========================================================================
    const COMPLETED_COURSES_KEY = 'completed_courses_list';
    async function getCompletedCourses() { const listJson = await GM_getValue(COMPLETED_COURSES_KEY, '[]'); return JSON.parse(listJson); }
    async function addCourseToCompleted(courseTitle) { if (!courseTitle) return; let completedList = await getCompletedCourses(); if (!completedList.includes(courseTitle)) { completedList.push(courseTitle); await GM_setValue(COMPLETED_COURSES_KEY, JSON.stringify(completedList)); console.log(`[记忆功能] 已将课程 "${courseTitle}" 标记为完成。`); } }
    GM_registerMenuCommand("清空已完成课程记录", async () => { await GM_setValue(COMPLETED_COURSES_KEY, '[]'); alert("已完成课程的学习记录已清空！刷新页面后脚本会重新学习所有课程。"); location.reload(); });


    // =========================================================================
    //  主课程列表页面逻辑 (yxjc.qlteacher.com) - 【增加刷新功能】
    // =========================================================================
    async function processMainListPage() {
        if (document.hidden) return;

        const completedCourses = await getCompletedCourses();
        console.log("[记忆功能] 已记录的完成课程: ", completedCourses);

        setTimeout(async () => {
            console.log("主列表页: 正在用终极智能模式寻找课程...");
            const clickables = document.querySelectorAll('button, a');
            const searchTerms = ["继续学习", "开始学习"];

            for (const term of searchTerms) {
                for (const el of clickables) {
                    if (el.innerText && el.innerText.includes(term)) {
                        let parentContainer = el;
                        for(let i=0; i<5; i++) { if(parentContainer.parentElement) { parentContainer = parentContainer.parentElement; } else { break; } }
                        const titleEl = parentContainer.querySelector('.ft-16, .font-semibold, [class*="title"]');
                        if (titleEl && titleEl.innerText) {
                             const courseTitle = titleEl.innerText.trim();
                             if (completedCourses.includes(courseTitle)) {
                                 console.log(`主列表页: 课程 "${courseTitle}" 已在记忆中，跳过。`);
                                 continue;
                             }

                             console.log(`主列表页: 找到可点击项 "${el.innerText.trim()}"，智能关联到课程: "${courseTitle}"，准备点击...`);
                             el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                             setTimeout(() => {
                                 el.click();

                                 // --- 【新增功能】 ---
                                 // 在点击打开新学习窗口后，延迟3秒刷新当前的主列表页面
                                 console.log("主列表页: 已点击课程，将在3秒后刷新本页面以更新课程状态...");
                                 setTimeout(() => {
                                     location.reload();
                                 }, 3000);

                             }, 1500);
                             return; // 找到并处理后，终止所有循环
                        }
                    }
                }
            }
            console.log("主列表页: 未找到新的可学习课程。");
        }, 3000);
    }


    // =========================================================================
    //  视频/测验播放器页面逻辑 (player.qlteacher.com) - (与v3.8相同)
    // =========================================================================
    async function processPlayerPage() {
        const allButtonsInPlayer = document.getElementsByTagName("button");
        for (const btn of allButtonsInPlayer) {
            const btnText = btn.innerText.trim();
            if ((btnText === "继续学习" || btnText === "开始学习") && btn.classList.contains("ant-btn-primary")) {
                const videoElement = document.querySelector('video');
                if (!videoElement) { console.log(`播放器(章节列表页): 找到蓝色的'${btnText}'按钮，点击进入...`); btn.click(); return; }
            }
        }
        const multiChoice = document.getElementsByClassName("ant-checkbox");
        if (multiChoice.length > 0) { console.log("播放器: 检测到多选题..."); for (let i = 0; i < multiChoice.length; i++) { if (Math.random() > 0.5) multiChoice[i].click(); } const submitBtn1 = document.querySelector(".ant-btn.radius-4.px-lg.py0.ant-btn-primary"); if (submitBtn1) submitBtn1.click(); return; }
        const singleChoice = document.getElementsByClassName("ant-radio-input");
        if (singleChoice.length > 0) { console.log("播放器: 检测到单选题..."); const randomIndex = Math.floor(Math.random() * singleChoice.length); singleChoice[randomIndex].click(); const submitBtn2 = document.querySelector(".ant-btn.radius-4.px-lg.py0.ant-btn-primary"); if (submitBtn2) submitBtn2.click(); return; }
        const testTitle = document.querySelector(".mt-32.ft-16");
        if (testTitle && testTitle.innerText.includes('[标准化测试]')) { console.log("播放器: 检测到标准化测试页面..."); const tests = document.getElementsByClassName("mb-16.ng-star-inserted"); for (let t = 0; t < tests.length; t++) { const firstLabel = tests[t].querySelector("label"); if (firstLabel) firstLabel.click(); } const buttons = document.querySelectorAll("button"); for (const btn of buttons) { if (btn.innerText.includes("提交")) { btn.click(); break; } } setTimeout(() => { for (const btn of buttons) { if (btn.innerText.includes("确定")) { btn.click(); break; } } }, 1000); }
        const video = document.querySelector('video');
        if (video && video.paused) { console.log("播放器: 视频已暂停，自动播放..."); video.muted = true; video.play().catch(e => console.error("播放失败:", e)); }
        const progressElement = document.querySelector('span.d-inline-block.mt-xs.ft-16.text-primary');
        const isCompleted = (progressElement && progressElement.textContent.trim() === '100%') || (document.querySelector('.count-down.ng-star-inserted')?.innerText === "已完成");
        if (isCompleted) {
            console.log("播放器: 本小节已完成，尝试寻找 '下一节' 按钮...");
            let nextButtonFound = false;
            const allButtons = document.getElementsByTagName("button");
            for (let i = 0; i < allButtons.length; i++) { if (allButtons[i].innerText.includes("下一节") || allButtons[i].innerText.includes("下一课")) { console.log("播放器: 找到 '下一节' 按钮，点击进入..."); allButtons[i].click(); nextButtonFound = true; break; } }
            if (!nextButtonFound) {
                console.log("播放器: 未找到 '下一节' 按钮，此大课程判定为已完成。");
                const courseTitleOnPlayer = document.querySelector('div.text-white.ft-24')?.innerText.trim();
                await addCourseToCompleted(courseTitleOnPlayer);
                console.log("播放器: 关闭窗口返回课程列表。");
                window.close();
            }
        }
    }


    // =========================================================================
    //  主执行逻辑 (与v3.8相同)
    // =========================================================================
    const url = window.location.href;
    if (url.includes('player.qlteacher.com')) {
        setInterval(processPlayerPage, 2000);
    } else if (url.includes('yxjc.qlteacher.com/project/')) {
        setInterval(processMainListPage, 5000);
    }
})();