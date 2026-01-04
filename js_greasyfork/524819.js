// ==UserScript==
// @name         2025-寒期教师研修
// @namespace
// @version      2025.02.05
// @description  [优化版]自动播放视频，静音，倍速(默认2x)，按G键有几率秒过。增加加载检测和详细日志
// @author       sndcyp
// @match        https://basic.smartedu.cn/*
// @icon         https://basic.smartedu.cn/favicon.ico
// @grant        GM_log
// @run-at       document-idle
// @namespace https://greasyfork.org/users/781530
// @downloadURL https://update.greasyfork.org/scripts/524819/2025-%E5%AF%92%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/524819/2025-%E5%AF%92%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE.meta.js
// ==/UserScript==

/* 常量配置 */
const COURSE_URLS = [
    // 学习贯彻全国教育大会精神
    "https://basic.smartedu.cn/teacherTraining/courseDetail?courseId=2c5f7bc2-699a-4433-b650-b5e554ed15e3&tag=2025%E5%B9%B4%E5%AF%92%E5%81%87%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=2025%E5%B9%B4%E5%AF%92%E5%81%87%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE&resourceId=1503e96a-e01d-446a-9e82-d61fce960ea9",
    // 深化教育综合改革
    "https://basic.smartedu.cn/teacherTraining/courseDetail?courseId=4b35be2e-b78c-474b-9e27-85a0bb5757bf&tag=2025%E5%B9%B4%E5%AF%92%E5%81%87%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=2025%E5%B9%B4%E5%AF%92%E5%81%87%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE&resourceId=1c0f64c2-5588-4c80-b5d5-f4a69d01d84e",
    // 推进教育国际交流合作
    "https://basic.smartedu.cn/teacherTraining/courseDetail?courseId=5a72caa9-d09e-4af1-be30-7d970c125038&tag=2025%E5%B9%B4%E5%AF%92%E5%81%87%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=2025%E5%B9%B4%E5%AF%92%E5%81%87%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE&resourceId=c7ca4806-fc6c-483e-8f04-ace93289cada"
];

// 各课程需要学习的视频数量
const COURSE_VIDEO_COUNTS = [5, 4, 3];

// 状态变量
let isFirstExpand = true;    // 是否首次展开视频列表
let isVideoPlaying = true;   // 视频播放状态控制

/**
 * 工具函数：移除字符串中所有空格
 * @param {string} str - 原始字符串
 * @returns {string} 处理后的字符串
 */
function removeAllSpaces(str) {
    console.log('[工具函数] 正在移除字符串空格...');
    return str.replace(/\s+/g, '');
}

/**
 * 主业务逻辑：处理课程播放页面
 */
function handleCoursePage() {
    console.log('[课程页面] 开始处理课程播放页...');

    // 处理模态对话框
    const modal = document.querySelector(".fish-modal-body");
    if (modal) {
        console.log('[弹窗处理] 发现模态对话框，点击确认...');
        modal.querySelector("button").click();
    }

    // 展开视频列表
    const collapseHeaders = document.getElementsByClassName("fish-collapse-header");
    if (collapseHeaders.length > 0 && isFirstExpand) {
        console.log('[视频列表] 展开所有章节...');
        Array.from(collapseHeaders).forEach(header => header.click());
        isFirstExpand = false;
    }

    // 自动处理练习题
    const exerciseBtn = document.querySelector('.size');
    if (exerciseBtn) {
        console.log('[练习题] 发现未完成练习，自动提交...');
        exerciseBtn.click();
        const submitBtn = document.querySelectorAll('button')[document.querySelectorAll('button').length - 1];
        submitBtn?.click();
    }

    // 视频播放逻辑
    const currentUrl = window.location.href;
    const courseIndex = COURSE_URLS.indexOf(currentUrl);
    const statusIcons = document.querySelectorAll('div.status-icon > i');

    for (let i = 0; i < statusIcons.length; i++) {
        if (statusIcons[i].title !== "已学完") {
            if (i < COURSE_VIDEO_COUNTS[courseIndex]) {
                console.log(`[视频播放] 开始播放第 ${i + 1} 个未完成视频...`);
                statusIcons[i].click();
                startVideoPlayback();
                return;
            }
            if (i >= COURSE_VIDEO_COUNTS[courseIndex]) {
                console.log('[课程完成] 当前课程已完成，跳转回列表页...');
                window.location.href = "https://basic.smartedu.cn/training/2025hjpx";
                return;
            }
        }
    }
}

/**
 * 正常播放视频逻辑
 */
function startVideoPlayback() {
    console.group('[视频控制] 启动视频播放流程');
    const video = document.querySelector('video');

    if (!video) {
        console.warn('[视频控制] 未找到video元素');
        return;
    }

    if (video.paused) {
        console.log('→ 设置播放速率：2x');
        video.playbackRate = 2;

        console.log('→ 静音状态：已启用');
        video.muted = true;

        console.log('→ 开始播放视频...');
        video.play().catch(err => console.error('播放失败:', err));
    }
    console.groupEnd();
}

/**
 * 秒过视频逻辑（G键触发）
 */
function quickCompleteVideo() {
    console.group('[快捷键] 触发秒过视频功能');
    const video = document.querySelector('video');

    if (!video) {
        console.warn('[秒过功能] 未找到video元素');
        return;
    }

    isVideoPlaying = false;
    const remainingTime = video.duration - video.currentTime;

    if (remainingTime > 10) {
        console.log('→ 视频剩余时间超过10秒，执行快进操作');
        video.muted = true;
        video.currentTime = video.duration - 5;
        video.play().catch(err => console.error('快进播放失败:', err));
    } else {
        console.log('→ 视频即将结束，正常播放');
        video.muted = true;
        video.play().catch(err => console.error('正常播放失败:', err));
    }

    isVideoPlaying = true;
    console.groupEnd();
}

/**
 * 处理课程选择页面
 */
function handleCourseSelection() {
    console.log('[课程列表] 开始处理课程选择页...');
    const courseCards = document.querySelectorAll('.index-module_box_tpPEe');

    for (let i = 0; i < courseCards.length; i++) {
        if (COURSE_VIDEO_COUNTS[i] > 0) {
            if (i < 3) {
                if (courseCards[i].innerText.includes("已认定")) {
                    const statusText = courseCards[i].querySelectorAll("span")[2]?.innerText;
                    const completedHours = Number(statusText.match(/\d+/)[0]);
                    const totalHours = Number(courseCards[i].querySelectorAll("span")[3]?.innerText.match(/\d+/)[0]);

                    console.log(`[课程检查] 课程 ${i + 1} 完成进度：${completedHours}/${totalHours}`);

                    if (completedHours < totalHours) {
                        console.log(`[课程跳转] 跳转到未完成课程: ${COURSE_URLS[i]}`);
                        window.location.href = COURSE_URLS[i];
                        return;
                    }
                }
            } else if (i > 2) {
                const phaseMain = document.querySelector('.index-module_phase_main_v27u1');
                if (phaseMain) {
                    const statusText = phaseMain.innerText;
                    const completedHours = Number(phaseMain.querySelector('span').innerText);
                    const totalHours = Number(statusText.substring(statusText.indexOf('/认定') + 3, statusText.indexOf('学时')));

                    console.log(`[课程检查] 课程 ${i + 1} 完成进度：${completedHours}/${totalHours}`);

                    if (completedHours < totalHours) {
                        console.log(`[课程跳转] 跳转到未完成课程: ${COURSE_URLS[i]}`);
                        window.location.href = COURSE_URLS[i];
                        return;
                    }
                }
            }
        }
    }
}


// 页面加载完成监听
window.addEventListener('load', () => {
    console.log('[系统] 页面完全加载完成，启动主逻辑');

    // 配置MutationObserver监听DOM变化
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                checkPageType();
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 初始检查
    checkPageType();
});

/**
 * 根据当前URL路由到不同处理逻辑
 */
function checkPageType() {
    console.log('[路由检测] 当前路径:', window.location.pathname);

    if (location.pathname.includes('/teacherTraining/courseDetail')) {
        console.log('[路由检测] 进入课程详情页');
        handleCoursePage();
    } else if (location.href.includes('training/2025hjpx')) {
        console.log('[路由检测] 进入课程列表页');
        handleCourseSelection();
    } else if (location.href.includes('training/5aa28de6-ad0a-4c92-aebd-632b9d7165f0')) {
        console.log('[路由检测] 进入课程列表页');
        handleCourseSelection();
    }
}

// 键盘事件监听
document.addEventListener('keydown', event => {
    if (event.key.toLowerCase() === 'g') {
        console.log('[快捷键] 检测到G键按下');
        quickCompleteVideo();
    }
});

console.log('[系统] 脚本已成功加载');