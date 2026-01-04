// ==UserScript==
// @name         同济大学党旗飘飘刷课工具
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  自动播放、倍速控制、进度统计、学习时长添加，理论上适用于所有学校
// @icon         data:image/png;base64,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
// @author       Hyoung（https://github.com/Flesymeb）
// @match        *://*/*/play*
// @match        *://*/*/user/lesson*
// @require      https://code.jquery.com/jquery-3.4.0.min.js
// @require      https://lib.baomitu.com/jquery-cookie/1.4.1/jquery.cookie.min.js
// @grant        GM_notification
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533901/%E5%90%8C%E6%B5%8E%E5%A4%A7%E5%AD%A6%E5%85%9A%E6%97%97%E9%A3%98%E9%A3%98%E5%88%B7%E8%AF%BE%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/533901/%E5%90%8C%E6%B5%8E%E5%A4%A7%E5%AD%A6%E5%85%9A%E6%97%97%E9%A3%98%E9%A3%98%E5%88%B7%E8%AF%BE%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const originAddListener = Document.prototype.addEventListener;
    Document.prototype.addEventListener = function (type, listener, options) {
        if (type === "visibilitychange") return;
        return originAddListener.call(this, type, listener, options);
    };
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => false });
    Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'visible' });

    if (!window.location.href.includes("play")) return;

    const style = document.createElement("style");
    style.innerHTML = `
    .gpt-btn {
        padding: 6px 15px;
        font-size: 14px;
        font-weight: bold;
        color: white;
        background: linear-gradient(to right, #43cea2, #185a9d);
        border: none;
        border-radius: 6px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        cursor: pointer;
        transition: transform 0.1s ease;
    }
    .gpt-btn:hover {
        transform: scale(1.03);
        background: linear-gradient(to right, #2bc0e4, #eaecc6);
    }
    .gpt-btn.stop { background: #e74c3c; }
    select.gpt-btn {
        background-color: #ffffff;
        color: #000000;
        border: 1px solid #ccc;
        border-radius: 6px;
        padding: 6px 10px;
        font-weight: bold;
        appearance: menulist;
    }
    .gpt-controls, .gpt-extra-controls {
        display: flex;
        gap: 10px;
        margin: 10px 0;
        flex-wrap: wrap;
        align-items: center;
    }
    .gpt-status {
        padding: 10px;
        font-family: Consolas, monospace;
        background: #f9f9f9;
        border-left: 4px solid #2ecc71;
        border-radius: 6px;
        font-size: 13px;
        color: #333;
        white-space: pre-line;
    }`;
    document.head.appendChild(style);

    const setCookie = (name, value, days) => {
        const d = new Date();
        d.setTime(d.getTime() + days * 864e5);
        document.cookie = `${name}=${value}; expires=${d.toGMTString()}`;
    };
    const getCookie = name => {
        const prefix = name + "=";
        return document.cookie.split(';').map(c => c.trim()).find(c => c.startsWith(prefix))?.slice(prefix.length) || "";
    };

    const checkUserCookie = () => {
        let user = getCookie("username");
        if (!user) {
            GM_notification({ text: '刷课系统已就绪，欢迎使用！', timeout: 3000 });
            user = prompt("请输入你的名字:", "哈喽~~");
            if (user) setCookie("username", user, 30);
        }
    };

    const targetContainer = document.querySelector(".video_cont") || document.body;
    const controlsWrapper = document.createElement("div");
    controlsWrapper.className = "gpt-controls";

    let autoStarted = false;
    let completedIndex = 0;

    const btnStartAuto = document.createElement("button");
    btnStartAuto.textContent = "▶️ 开始刷课";
    btnStartAuto.className = "gpt-btn";
    btnStartAuto.onclick = () => {
        $.cookie('autoPlayEnabled', 1);
        startAutoLearning();
    };

    const btnStopAuto = document.createElement("button");
    btnStopAuto.textContent = "⏸️ 暂停刷课";
    btnStopAuto.className = "gpt-btn stop";
    btnStopAuto.onclick = () => {
        $.cookie('autoPlayEnabled', 0);
        clearInterval(window.start);
        document.querySelector("video")?.pause();
        GM_notification({ text: "⏸️ 已暂停自动刷课", timeout: 3000 });
        autoStarted = false;
    };

    const selectPlaybackRate = document.createElement("select");
    selectPlaybackRate.className = "gpt-btn";
    [0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 4.0, 8.0, 16.0].forEach(rate => {
        const opt = document.createElement("option");
        opt.value = rate;
        opt.textContent = rate + "x";
        selectPlaybackRate.appendChild(opt);
    });
    const savedRate = parseFloat($.cookie('playback_rate') || 1.5);
    selectPlaybackRate.value = savedRate;
    selectPlaybackRate.onchange = () => {
        const video = document.querySelector("video");
        if (video) {
            video.playbackRate = parseFloat(selectPlaybackRate.value);
            $.cookie('playback_rate', video.playbackRate, { expires: 7 });
        }
    };

    controlsWrapper.appendChild(btnStartAuto);
    controlsWrapper.appendChild(btnStopAuto);
    controlsWrapper.appendChild(selectPlaybackRate);
    targetContainer.prepend(controlsWrapper);

    const extraControls = document.createElement("div");
    extraControls.className = "gpt-extra-controls";

    const timeLabel = document.createElement("span");
    timeLabel.textContent = "🕒 增加学习时长：";
    timeLabel.style.fontWeight = "bold";
    extraControls.appendChild(timeLabel);

    const selectTime = document.createElement("select");
    selectTime.className = "gpt-btn";
    [5, 10, 15, 20, 30].forEach(min => {
        const opt = document.createElement("option");
        opt.value = min;
        opt.textContent = `➕ ${min} 分钟`;
        selectTime.appendChild(opt);
    });

    const btnAddTime = document.createElement("button");
    btnAddTime.className = "gpt-btn";
    btnAddTime.textContent = "添加";

    const getRid = () => {
        try {
            if (typeof studyTime !== 'undefined') {
                const str = studyTime.toString();
                const match = str.match(/rid:\s*["']?(\d+)["']?/);
                if (match) return match[1];
            }
            const html = document.documentElement.innerHTML;
            const match2 = html.match(/rid\s*[:=]\s*["']?(\d+)["']?/);
            return match2 ? match2[1] : null;
        } catch {
            return null;
        }
    };

    btnAddTime.onclick = () => {
        const rid = getRid();
        const minutes = parseInt(selectTime.value);
        const _xsrf = $(':input[name="_xsrf"]').val() || "";
        if (!rid) return GM_notification({ text: "❌ 未找到 rid", timeout: 3000 });

        $.ajax({
            type: "POST",
            url: "/jjfz/lesson/study_time",
            data: {
                rid: rid,
                study_time: minutes * 60 * 1000,
                _xsrf: _xsrf
            },
            complete: res => {
                if (res.status === 200) {
                    GM_notification({ text: `✅ 为 rid ${rid} 增加 ${minutes} 分钟`, timeout: 3000 });
                } else {
                    GM_notification({ text: `❌ 增加失败（状态码 ${res.status}）`, timeout: 3000 });
                }
            }
        });
    };

    extraControls.appendChild(selectTime);
    extraControls.appendChild(btnAddTime);
    targetContainer.appendChild(extraControls);

    const statusBox = document.createElement("div");
    statusBox.className = "gpt-status";

    const updateStatus = () => {
        const total = document.querySelectorAll(".video_lists ul li").length;
        const rate = parseFloat($.cookie("playback_rate") || 1.0);
        statusBox.innerHTML = `🎓 Hello~ ${getCookie("username") || "同学"}
📺 状态：${$.cookie('autoPlayEnabled') == 1 ? "自动刷课中" : "未开启"}
⏩ 倍速：${rate}x
📊 进度：${completedIndex}/${total}（剩余 ${total - completedIndex}）
🌐 标签检测：已屏蔽
💡 <a href="https://github.com/Flesymeb" target="_blank">Made by Flesymeb↗</a>`;
    };
    setInterval(updateStatus, 3000);
    targetContainer.appendChild(statusBox);

    setInterval(() => {
        const video = document.querySelector("video");
        const currentRate = parseFloat($.cookie("playback_rate") || 1.0);
        if (video && video.playbackRate !== currentRate) {
            video.playbackRate = currentRate;
        }
    }, 1000);

    const startAutoLearning = () => {
        if (autoStarted || $.cookie('autoPlayEnabled') != 1) return;
        autoStarted = true;

        window.start = setInterval(() => {
            const video = document.querySelector("video");
            const current = document.querySelector(".video_red1")?.closest("li");
            const next = current?.nextElementSibling;

            if (!video || !current) return;

            const progress = video.currentTime / (video.duration || 1);
            const ended = video.ended;

            if (ended || progress > 0.98) {
                completedIndex++;
                if (next && next.querySelector("a")) {
                    next.querySelector("a").click();
                } else {
                    GM_notification({ text: '✅ 本章播放完成，跳转课程列表页~', timeout: 4000 });
                    clearInterval(window.start);
                    location.href = `https://${location.host}/jjfz/lesson`;
                }
                return;
            }

            if (video.paused) video.play();
            document.querySelector(".public_cancel")?.click();
            document.querySelector(".public_submit")?.click();
        }, 1500);
    };

    checkUserCookie();
    setTimeout(() => {
        if ($.cookie('autoPlayEnabled') == 1) startAutoLearning();
    }, 1000);
})();