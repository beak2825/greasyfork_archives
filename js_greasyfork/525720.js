// ==UserScript==
// @name         屏蔽指定论坛并带解锁倒计时（点击10次显示按钮）
// @namespace    http://your.namespace.com
// @version      1.10
// @description  屏蔽指定论坛页面，默认屏蔽提示页面隐藏解锁选项，需点击任意处10次后显示“解锁1分钟”、“解锁10分钟”和“解锁30分钟”三个选项（附每日点击上限与剩余次数显示）。解锁后在页面右上角显示倒计时，倒计时结束后重新屏蔽。
// @author       YourName
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525720/%E5%B1%8F%E8%94%BD%E6%8C%87%E5%AE%9A%E8%AE%BA%E5%9D%9B%E5%B9%B6%E5%B8%A6%E8%A7%A3%E9%94%81%E5%80%92%E8%AE%A1%E6%97%B6%EF%BC%88%E7%82%B9%E5%87%BB10%E6%AC%A1%E6%98%BE%E7%A4%BA%E6%8C%89%E9%92%AE%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/525720/%E5%B1%8F%E8%94%BD%E6%8C%87%E5%AE%9A%E8%AE%BA%E5%9D%9B%E5%B9%B6%E5%B8%A6%E8%A7%A3%E9%94%81%E5%80%92%E8%AE%A1%E6%97%B6%EF%BC%88%E7%82%B9%E5%87%BB10%E6%AC%A1%E6%98%BE%E7%A4%BA%E6%8C%89%E9%92%AE%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /** 
     * 请在此处填写需要屏蔽的网址（域名部分，例如："bbs.example.com" 表示屏蔽该域名及其子域名）。
     */
    const bannedSites = [
        'reddit.com',
        'v2ex.com',
        'youtube.com',
        'linux.do',
        'x.com'
        // 如需添加其他网站，请在此处加入完整域名
    ];


    // 判断当前 host 是否在屏蔽名单内（支持完整匹配或子域名匹配）
    function isBannedSite(host) {
        return bannedSites.some(site => host === site || host.endsWith("." + site));
    }

    const currentHost = window.location.host;
    if (!isBannedSite(currentHost)) {
        // 非屏蔽网站直接退出脚本
        return;
    }

    // 检查是否存在有效解锁截止时间
    const now = Date.now();
    const unlockUntilStr = localStorage.getItem("unlockUntil");
    const unlockUntil = unlockUntilStr ? parseInt(unlockUntilStr, 10) : null;

    if (unlockUntil && now < unlockUntil) {
        // 处于解锁状态，将保留页面内容，且在右上角显示倒计时
        addCountdownTimer(unlockUntil);
        return;
    }

    // 无解锁状态，显示屏蔽页面
    showBlockPage();

    /** 
     * 显示屏蔽页面函数：
     * 清空页面并显示提示信息，同时绑定页面点击事件统计。
     * 当点击累计 10 次后显示解锁选项按钮，并显示各按钮每日限制剩余次数：
     * “解锁1分钟”（每日10次），“解锁10分钟”（每日2次）和“解锁30分钟”（每日1次）。
     */
    function showBlockPage() {
        // 清空整个页面内容
        document.documentElement.innerHTML = "";
        // 添加内联样式
        const style = document.createElement("style");
        style.type = "text/css";
        style.innerHTML = `
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
                background: linear-gradient(135deg, #72EDF2 10%, #5151E5 100%);
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                color: #fff;
            }
            .message-box {
                text-align: center;
                padding: 40px;
                background: rgba(0, 0, 0, 0.3);
                border: 2px solid rgba(255,255,255,0.5);
                border-radius: 12px;
                box-shadow: 0 0 20px rgba(0,0,0,0.2);
                animation: fadeIn 1s ease-out;
            }
            .message-box h1 {
                font-size: 3em;
                margin-bottom: 20px;
            }
            .message-box p {
                font-size: 1.5em;
                margin-bottom: 20px;
            }
            .unlock-btn-container {
                margin-top: 20px;
                display: none;
            }
            .unlock-btn {
                padding: 10px 20px;
                font-size: 1em;
                border: none;
                border-radius: 8px;
                background-color: #fff;
                color: #333;
                cursor: pointer;
                transition: background-color 0.3s;
                margin: 0 10px;
            }
            .unlock-btn:disabled {
                background-color: #ccc;
                cursor: not-allowed;
            }
            .unlock-btn:hover:not(:disabled) {
                background-color: #f2f2f2;
            }
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
        `;
        document.head.appendChild(style);

        // 创建屏蔽提示框
        const box = document.createElement("div");
        box.className = "message-box";
        box.innerHTML = `
            <h1>请好好学习</h1>
            <p>离开无益的网站，专注于你的目标！</p>
            <div class="unlock-btn-container"></div>
        `;
        document.body.appendChild(box);

        // 辅助函数：获取日期字符串 YYYY-MM-DD
        function getTodayString() {
            const d = new Date();
            return d.getFullYear() + "-" +
                   String(d.getMonth() + 1).padStart(2, '0') + "-" +
                   String(d.getDate()).padStart(2, '0');
        }

        // 辅助函数：获取每日使用记录（全网站共享），格式如：
        // { date: "2025-02-03", "1m": 今日点击次数, "10m": 今日点击次数, "30m": 今日点击次数 }
        function getDailyUsageCounts() {
            let data = localStorage.getItem("unlockUsageCounts");
            const today = getTodayString();
            if (data) {
                try {
                    let obj = JSON.parse(data);
                    if (obj.date === today) {
                        return obj;
                    }
                } catch (e) {}
            }
            let newObj = { date: today, "1m": 0, "10m": 0, "30m": 0 };
            localStorage.setItem("unlockUsageCounts", JSON.stringify(newObj));
            return newObj;
        }
        // 更新每日使用记录
        function updateDailyUsageCounts(obj) {
            localStorage.setItem("unlockUsageCounts", JSON.stringify(obj));
        }

        // 监听页面点击事件，累计点击次数（用于显示解锁按钮的入口）
        let clickCount = 0;
        function handleClick() {
            clickCount++;
            if (clickCount >= 10) {
                // 显示解锁选项按钮，并显示每日使用情况
                const container = document.querySelector(".unlock-btn-container");
                if (container) {
                    // 每日总使用限制
                    const max1m = 10;
                    const max10m = 2;
                    const max30m = 1;
                    const usageCounts = getDailyUsageCounts();
                    const remaining1m = Math.max(0, max1m - usageCounts["1m"]);
                    const remaining10m = Math.max(0, max10m - usageCounts["10m"]);
                    const remaining30m = Math.max(0, max30m - usageCounts["30m"]);
                    
                    container.style.display = "block";
                    container.innerHTML = `
                        <button class="unlock-btn" data-duration="60000" ${remaining1m <= 0 ? 'disabled' : ''}>
                            解锁1分钟 (剩余${remaining1m}次)
                        </button>
                        <button class="unlock-btn" data-duration="${10 * 60 * 1000}" ${remaining10m <= 0 ? 'disabled' : ''}>
                            解锁10分钟 (剩余${remaining10m}次)
                        </button>
                        <button class="unlock-btn" data-duration="${30 * 60 * 1000}" ${remaining30m <= 0 ? 'disabled' : ''}>
                            解锁30分钟 (剩余${remaining30m}次)
                        </button>
                    `;
                    // 为每个按钮分别绑定点击事件
                    container.querySelectorAll(".unlock-btn").forEach(btn => {
                        btn.addEventListener("click", function(e) {
                            e.stopPropagation();  // 阻止事件冒泡以免再次计数
                            const duration = parseInt(btn.getAttribute("data-duration"), 10);
                            let type = "";
                            if (duration === 60000) {
                                type = "1m";
                            } else if (duration === 10 * 60 * 1000) {
                                type = "10m";
                            } else if (duration === 30 * 60 * 1000) {
                                type = "30m";
                            }
                            let maxLimit;
                            if (type === "1m") {
                                maxLimit = max1m;
                            } else if (type === "10m") {
                                maxLimit = max10m;
                            } else if (type === "30m") {
                                maxLimit = max30m;
                            }
                            const usage = getDailyUsageCounts();
                            if (usage[type] >= maxLimit) {
                                alert("今天该按钮的解锁次数已达上限！");
                                return;
                            }
                            // 更新使用记录，增加对应按钮的使用次数
                            usage[type]++;
                            updateDailyUsageCounts(usage);

                            const newUnlockUntil = Date.now() + duration;
                            localStorage.setItem("unlockUntil", newUnlockUntil);

                            // 获取当前时间并格式化为 YY-MM-DD HH:mm 格式
                            const nowDate = new Date();
                            const timestamp = `${nowDate.getFullYear().toString().slice(-2)}-${String(nowDate.getMonth() + 1).padStart(2, '0')}-${String(nowDate.getDate()).padStart(2, '0')} ${String(nowDate.getHours()).padStart(2, '0')}:${String(nowDate.getMinutes()).padStart(2, '0')}`;

                            // 发送请求到后端 API 记录点击，同时记录当前解锁网站及解锁时的时间
                            fetch('http://your-server-address/api/log-click', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    duration: duration,
                                    timestamp: timestamp,
                                    website: currentHost
                                })
                            }).catch(error => console.error('Error logging click:', error));

                            location.reload();
                        });
                    });
                }
                document.removeEventListener("click", handleClick);
            }
        }
        document.addEventListener("click", handleClick);
    }

    /**
     * 添加倒计时显示函数：
     * 在页面右上角（现修改为水平居中）创建一个倒计时浮层，背景透明度50%；
     * 每秒更新剩余解锁时间，倒计时结束时刷新页面恢复屏蔽。
     */
    function addCountdownTimer(untilTime) {
        const timerEl = document.createElement("div");
        timerEl.className = "unlock-countdown";
        // 添加倒计时样式：水平居中、透明度50%
        const timerStyle = document.createElement("style");
        timerStyle.type = "text/css";
        timerStyle.innerHTML = `
            .unlock-countdown {
                position: fixed;
                top: 10px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(255, 0, 0, 0.5);
                color: #fff;
                padding: 10px 15px;
                border-radius: 8px;
                font-size: 18px;
                z-index: 99999;
                font-weight: bold;
            }
        `;
        document.head.appendChild(timerStyle);
        document.body.appendChild(timerEl);

        function updateTimer() {
            const nowTime = Date.now();
            const remaining = untilTime - nowTime;
            if (remaining <= 0) {
                localStorage.removeItem("unlockUntil");
                location.reload();
            } else {
                const minutes = Math.floor(remaining / (60 * 1000));
                const seconds = Math.floor((remaining / 1000) % 60);
                const mm = minutes < 10 ? "0" + minutes : minutes;
                const ss = seconds < 10 ? "0" + seconds : seconds;
                timerEl.textContent = `解锁剩余时间: ${mm}:${ss}`;
            }
        }
        updateTimer();
        setInterval(updateTimer, 1000);
    }
})();
