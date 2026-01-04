// ==UserScript==
// @name         国家智慧教育公共服务平台 | 高等教育教师专业发展 | 2025年暑期教师研修 | 自动挂机
// @version      2025.07.31
// @description  自动识别课程并挂机播放视频，完成指定学时自动跳转下一门课程。
// @author       FlowPeakFish
// @match        https://core.teacher.vocational.smartedu.cn/p/course/*
// @icon         https://teacher.vocational.smartedu.cn/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @namespace https://greasyfork.org/users/1497801
// @downloadURL https://update.greasyfork.org/scripts/543469/%E5%9B%BD%E5%AE%B6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%85%AC%E5%85%B1%E6%9C%8D%E5%8A%A1%E5%B9%B3%E5%8F%B0%20%7C%20%E9%AB%98%E7%AD%89%E6%95%99%E8%82%B2%E6%95%99%E5%B8%88%E4%B8%93%E4%B8%9A%E5%8F%91%E5%B1%95%20%7C%202025%E5%B9%B4%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%20%7C%20%E8%87%AA%E5%8A%A8%E6%8C%82%E6%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/543469/%E5%9B%BD%E5%AE%B6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%85%AC%E5%85%B1%E6%9C%8D%E5%8A%A1%E5%B9%B3%E5%8F%B0%20%7C%20%E9%AB%98%E7%AD%89%E6%95%99%E8%82%B2%E6%95%99%E5%B8%88%E4%B8%93%E4%B8%9A%E5%8F%91%E5%B1%95%20%7C%202025%E5%B9%B4%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%20%7C%20%E8%87%AA%E5%8A%A8%E6%8C%82%E6%9C%BA.meta.js
// ==/UserScript==

// ==============================
// 🔧 课程名称与链接配置
// ==============================

const courseTitles = [
    "大力弘扬教育家精神",
    "数字素养提升",
    "科学素养提升",
    "心理健康教育能力提升",
    "教学科研能力提升"
];

const courseLinks = [
    "https://core.teacher.vocational.smartedu.cn/p/course/vocational/v_1006809341534883840?itemId=1003784879729774592&type=1&segId=1003784832051576832&projectId=1003784624690925568&orgId=608196190709395456&originP=1",
    "https://core.teacher.vocational.smartedu.cn/p/course/vocational/v_1006809341547466752?itemId=1003784976377577472&type=1&segId=1003784928350146560&projectId=1003784624690925568&orgId=608196190709395456&originP=1",
    "https://core.teacher.vocational.smartedu.cn/p/course/vocational/v_1006809341560049664?itemId=1003785080355917824&type=1&segId=1003785029070618624&projectId=1003784624690925568&orgId=608196190709395456&originP=1",
    "https://core.teacher.vocational.smartedu.cn/p/course/vocational/v_1006809341572632576?itemId=1003785177923817472&type=1&segId=1003785131789123584&projectId=1003784624690925568&orgId=608196190709395456&originP=1",
    "https://core.teacher.vocational.smartedu.cn/p/course/vocational/v_1006809341585215488?itemId=1003785287292944384&type=1&segId=1003785243122728960&projectId=1003784624690925568&orgId=608196190709395456&originP=1",
    "https://teacher.higher.smartedu.cn/h/subject/summer2025/",
];

// 每门课程所需学时（单位：学时，1 学时 = 45 分钟）
const courseRequiredPeriods = [2, 2, 1, 2, 3];

// ==============================
// 🚀 脚本入口：识别课程并启动定时器
// ==============================

(function () {
    'use strict';
    const currentURL = window.location.href;

    // 只在课程播放页执行
    if (currentURL.includes("/p/course/vocational/v")) {
        const courseTitle = document.querySelector("h1")?.textContent?.trim();
        if (courseTitle) {
            const index = courseTitles.findIndex(t => courseTitle.includes(t));
            if (index !== -1) {
                GM_setValue("下标", index);
                createLogBox();
                addLog(`✅ 识别课程标题：${courseTitle}（第 ${index+1} 个课程）`);
                setInterval(mainLoop, 5000);
            } else {
                createLogBox();
                addLog(`⚠️ 未匹配课程标题：${courseTitle}`);
            }
        } else {
            createLogBox();
            addLog(`⚠️ 页面未找到课程标题（h1 标签）`);
        }
    }
})();

// ==============================
// 🎬 主执行循环函数
// ==============================

function mainLoop() {
    switchToNextUnfinishedVideo();
    ensureVideoIsPlaying();
    checkIfStudyTimeComplete();
    clickConfirmIfPopupVisible();
}

// ==============================
// 🎯 切换下一个未播放完的视频
// ==============================

function switchToNextUnfinishedVideo() {
    const current = document.querySelector('.video-title.clearfix.on .four')?.textContent;
    if (current === '100%') {
        const all = document.getElementsByClassName('video-title clearfix');
        for (let i = 1; i < all.length; i++) {
            const four = all[i].querySelector('.four')?.textContent;
            if (four !== '100%') {
                all[i].click();
                addLog(`➡️ 切换至未完成视频：第 ${i + 1} 个`);
                break;
            }
        }
    }
}

// ==============================
// ⏱️ 学时统计与自动跳转下一门课
// ==============================

function checkIfStudyTimeComplete() {
    const index = GM_getValue("下标");
    const requiredPeriods = courseRequiredPeriods[index]; // 学时
    const videoDivs = document.getElementsByClassName("video-title");

    let totalSeconds = 0;
    for (let videoDiv of videoDivs) {
        const percent = videoDiv.querySelector(".four")?.textContent?.trim();
        const time = videoDiv.querySelector(".three")?.textContent?.trim();
        if (percent === "100%" && time) {
            const [hh, mm, ss] = time.replace(/[()]/g, "").split(":").map(Number);
            totalSeconds += hh * 3600 + mm * 60 + ss;
        }
    }

    const completedPeriods = totalSeconds / 2700; // ✅ 1 学时 = 2700 秒 = 45 分钟
    addLog(`⏳ 当前已完成 ${(completedPeriods).toFixed(2)} 学时 / 目标 ${requiredPeriods} 学时`);

    if (completedPeriods >= requiredPeriods) {
        const nextIndex = index + 1;
        if (courseLinks[nextIndex]) {
            GM_setValue("下标", nextIndex);
            addLog(`✅ 学时达标，准备跳转下一课程：下标 ${nextIndex}`);
            setTimeout(() => {
                window.location.href = courseLinks[nextIndex];
            }, 500);
        } else {
            addLog("🎉 所有课程已完成！");
        }
    }
}

// ==============================
// 📺 强制播放视频（静音避免浏览器限制）
// ==============================

function ensureVideoIsPlaying() {
    const video = document.querySelector("#video-Player > video");

    if (!video) {
        addLog("⚠️ 未找到视频元素");
        return;
    }

    // 如果没有静音，自动设置为静音
    if (!video.muted) {
        video.muted = true;
        addLog("🔇 自动设置为静音");
    }

    // 如果播放速率为 1，则改为 2
    if (video.playbackRate === 1) {
        video.playbackRate = 2;
        addLog("⏩ 播放速率设置为 2 倍速");
    }

    if (!video.paused) {
        addLog("📡 正在挂机中...");
        return;
    }

    video.play().then(() => {
        addLog("🎬 视频恢复播放");
    }).catch(err => {
        addLog("⚠️ 视频播放失败：" + err.message);
    });
}

// ==============================
// ✅ 弹窗检测与“确定”按钮点击处理
// ==============================

function clickConfirmIfPopupVisible() {
    const confirmBtn = document.querySelector(".layui-layer-btn .layui-layer-btn0");
    if (confirmBtn) {
        confirmBtn.click();
        addLog("🧩 检测到弹窗，已自动点击“确定”按钮");
    }
}

// ==============================
// 🪵 日志输出框与记录函数
// ==============================

function createLogBox() {
    const box = document.createElement('div');
    box.id = 'logBox';
    Object.assign(box.style, {
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        width: '420px',
        height: '260px',
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        color: '#00FF00',
        border: '2px solid #00FF00',
        borderRadius: '10px',
        boxShadow: '0 0 10px #00FF00',
        overflowY: 'auto',
        padding: '12px',
        fontFamily: 'monospace',
        fontSize: '14px',
        zIndex: '99999',
        lineHeight: '1.5',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
    });

    box.innerHTML = `<div style="font-weight:bold;font-size:16px;margin-bottom:8px;color:#00FFFF;
    border-bottom:1px solid #00FF00;padding-bottom:4px">📋 智慧教育挂机日志</div>`;

    const style = document.createElement('style');
    style.textContent = `
        #logBox::-webkit-scrollbar {
            width: 8px;
        }
        #logBox::-webkit-scrollbar-thumb {
            background: #00ff00;
            border-radius: 4px;
            box-shadow: inset 0 0 6px rgba(0,255,0,0.5);
        }
        #logBox::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.3);
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(box);
}

function addLog(message) {
    const log = document.getElementById('logBox');
    if (!log) return;
    const time = new Date().toLocaleTimeString('zh-CN', { hour12: false });
    const line = document.createElement('div');
    line.textContent = `[${time}] ${message}`;
    log.appendChild(line);
    log.scrollTop = log.scrollHeight;
    console.log(`[${time}] ${message}`);
}
