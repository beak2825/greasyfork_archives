// ==UserScript==
// @name         华医网助手（跳过考试直接下一个）v2.2.6
// @namespace    http://tampermonkey.net/
// @version      2.2.6
// @description  自动播放华医网视频，跳过弹窗，状态面板，视频结束后检测考试按钮并跳转下一个视频。作者：Yik Liu
// @author       Yik Liu
// @match        *://*.91huayi.com/course_ware/course_ware_polyv.aspx?*
// @match        *://*.91huayi.com/course_ware/course_list.aspx?*
// @match        https://cme28.91huayi.com/pages/exam_result.aspx?cwid=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537939/%E5%8D%8E%E5%8C%BB%E7%BD%91%E5%8A%A9%E6%89%8B%EF%BC%88%E8%B7%B3%E8%BF%87%E8%80%83%E8%AF%95%E7%9B%B4%E6%8E%A5%E4%B8%8B%E4%B8%80%E4%B8%AA%EF%BC%89v226.user.js
// @updateURL https://update.greasyfork.org/scripts/537939/%E5%8D%8E%E5%8C%BB%E7%BD%91%E5%8A%A9%E6%89%8B%EF%BC%88%E8%B7%B3%E8%BF%87%E8%80%83%E8%AF%95%E7%9B%B4%E6%8E%A5%E4%B8%8B%E4%B8%80%E4%B8%AA%EF%BC%89v226.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let examErrorCount = 0;

    function createStatusPanel() {
        const panel = document.createElement("div");
        panel.id = "huayi-status";
        panel.style.cssText = `
            position: fixed;
            right: 10px;
            bottom: 10px;
            z-index: 9999;
            background: rgba(0,0,0,0.75);
            color: #fff;
            padding: 10px;
            border-radius: 10px;
            font-size: 14px;
            max-width: 250px;
        `;
        panel.innerHTML = `
            <div><b>华医网助手状态</b></div>
            <div id="h-status">状态: 启动中</div>
            <div id="h-action">操作: -</div>
            <div id="h-exam">考试按钮: -</div>
            <div id="h-error">异常检测: 0 次</div>
            <div id="h-title">当前视频: -</div>
            <button id="h-next" style="margin-top:5px;">强制下一课</button>
        `;
        document.body.appendChild(panel);
        document.getElementById("h-next").onclick = () => autoJumpToLearningVideo();
    }

    function updateStatusPanel(status, action, exam, errors, title) {
        const set = (id, text) => {
            const el = document.getElementById(id);
            if (el) el.innerText = text;
        };
        set("h-status", `状态: ${status}`);
        set("h-action", `操作: ${action}`);
        set("h-exam", `考试按钮: ${exam}`);
        set("h-error", `异常检测: ${errors} 次`);
        set("h-title", `当前视频: ${title}`);
    }

    function autoSkipPopup() {
        setInterval(() => {
            try {
                document.querySelector(".pv-ask-skip")?.click();
                document.querySelector(".signBtn")?.click();
                document.querySelector("button[onclick='closeProcessbarTip()']")?.click();
                document.querySelector("button.btn_sign")?.click();
                if (document.querySelector("#floatTips")?.style.display !== "none") {
                    window.closeFloatTips?.();
                }
            } catch (err) {}
        }, 2000);
    }

    function autoPlayVideo() {
        const video = document.querySelector("video");
        if (!video) return;
        video.volume = 0;
        video.muted = true;
        setInterval(() => {
            if (video.paused) video.play().catch(() => {});
        }, 1000);

        video.addEventListener("play", () => {
            updateStatusPanel("监控中", "播放中", "检测中", examErrorCount, document.title);
        });

        // 只在视频播放结束后检测考试按钮
        video.addEventListener("ended", () => {
            updateStatusPanel("监控中", "播放结束，检测考试按钮", "检测中", examErrorCount, document.title);
            setTimeout(() => {
                const examBtn = document.getElementById("jrks");
                if (examBtn && !examBtn.disabled && examBtn.offsetParent !== null) {
                    updateStatusPanel("检测中", "发现可点击考试按钮 → 跳转下一个", "已激活", examErrorCount, document.title);
                    autoJumpToLearningVideo();
                }
            }, 1000);
        });
    }

    function monitorInactivity() {
        let lastActivityTime = Date.now();
        setInterval(() => {
            const now = Date.now();
            const video = document.querySelector("video");
            const time = video?.currentTime || 0;
            if (now - lastActivityTime > 3 * 60 * 1000 || time === 0) {
                examErrorCount++;
                updateStatusPanel("无响应", "无操作/暂停", "检测中", examErrorCount, document.title);
                if (video?.paused) video.play();
            }
            lastActivityTime = now;
        }, 3 * 60 * 1000);
    }

    function autoJumpToLearningVideo() {
        const items = document.querySelectorAll('li.lis-inside-content');
        let target = null, status = '', index = -1;

        // 优先找未学习
        for (let i = 0; i < items.length; i++) {
            const text = items[i].innerText;
            if (text.includes('未学习')) {
                target = items[i];
                status = '未学习';
                index = i;
                break;
            }
        }

        // 没有未学习则找学习中
        if (!target) {
            for (let i = 0; i < items.length; i++) {
                const text = items[i].innerText;
                if (text.includes('学习中')) {
                    target = items[i];
                    status = '学习中';
                    index = i;
                    break;
                }
            }
        }

        if (!target) {
            updateStatusPanel("待命", "所有课程完成", "-", examErrorCount, document.title);
            return;
        }

        const h2 = target.querySelector('h2.must-text');
        if (h2) {
            h2.click();
            updateStatusPanel("跳转中", `点击第 ${index + 1} 个【${status}】`, "-", examErrorCount, document.title);
        }
    }

    function clickFirstImmediateLearn() {
        const buttons = document.querySelectorAll("input.state_lis_btn");
        for (const btn of buttons) {
            const val = btn.value.trim().replace(/\s/g, '');
            if (val === "立即学习") {
                btn.click();
                return;
            }
        }
    }

    function createContactPanel() {
        const panel = document.createElement("div");
        panel.style.cssText = `
            position: fixed;
            left: 10px;
            bottom: 10px;
            z-index: 9999;
            background: rgba(255,255,255,0.9);
            color: #000;
            padding: 10px;
            border-radius: 10px;
            font-size: 14px;
            box-shadow: 0 0 8px rgba(0,0,0,0.2);
            text-align: center;
        `;
        panel.innerHTML = `
            <div style="font-weight: bold; color: red; font-size: 16px;">如果没有时间可加v：xxsrjbhyw</div>
            <div><img src="https://i.ibb.co/CKgvr8WW/20250601161310.jpg" alt="打赏二维码" width="130" style="margin-top:5px; border-radius: 8px;" /></div>
            <div style="margin-top:5px; font-size: 12px;">创作不易，感谢买咖啡的钱 ☕</div>
        `;
        document.body.appendChild(panel);
    }

    function init() {
        const url = window.location.href;
        if (url.includes("course_ware/course_ware_polyv.aspx")) {
            setTimeout(() => {
                if (!document.querySelector("video")) return;
                createStatusPanel();
                createContactPanel();
                autoSkipPopup();
                autoPlayVideo();
                monitorInactivity();
                updateStatusPanel("运行中", "初始化完成", "检测中", examErrorCount, document.title);
            }, 2000);
        }

        if (url.includes("course_ware/course_list.aspx")) {
            setTimeout(() => {
                autoJumpToLearningVideo();
            }, 3000);
        }

        if (url.includes("/exam_result.aspx")) {
            setTimeout(() => {
                clickFirstImmediateLearn();
            }, 2000);
        }
    }

    init();
})();
