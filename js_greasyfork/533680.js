// ==UserScript==
// @name         CPP摊位状态监控
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  每60秒自动刷新一次网页并检测摊位状态是否有变化
// @match        https://www.allcpp.cn/mng/apply.do?t=1&pageNo=1
// @grant        none
// @license      MIT
// @author       liyasan
// @downloadURL https://update.greasyfork.org/scripts/533680/CPP%E6%91%8A%E4%BD%8D%E7%8A%B6%E6%80%81%E7%9B%91%E6%8E%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/533680/CPP%E6%91%8A%E4%BD%8D%E7%8A%B6%E6%80%81%E7%9B%91%E6%8E%A7.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const INTERVAL = 60000;
    const ID0 = "position-status0";
    const ID1 = "position-status1";
    const STORAGE_KEY = "cpp_status_record";

    // 通知权限申请
    if (Notification.permission !== "granted") {
        Notification.requestPermission();
    }

    // 提取 span 内容
    function getSpanStatus() {
        const s0 = document.getElementById(ID0)?.textContent.trim() || "";
        const s1 = document.getElementById(ID1)?.textContent.trim() || "";
        return { s0, s1 };
    }

    // 读取历史状态
    function loadLastStatus() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
        } catch {
            return {};
        }
    }

    // 保存当前状态
    function saveStatus(status) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(status));
    }

    // 弹出系统通知
    function notifyChange(name, from, to) {
        if (Notification.permission === "granted") {
            new Notification("摊位状态发生变化", {
                body: `${name}：\n${from} → ${to}`,
                icon: "https://www.allcpp.cn/favicon.ico"
            });
        }
        console.log(`🛎 ${name}变化：${from} -> ${to}`);
    }

    // 状态对比并通知
    function checkAndNotify() {
        const current = getSpanStatus();
        const last = loadLastStatus();

        if (last.s0 && last.s0 !== current.s0) {
            notifyChange(ID0, last.s0, current.s0);
        }
        if (last.s1 && last.s1 !== current.s1) {
            notifyChange(ID1, last.s1, current.s1);
        }

        saveStatus(current);
    }

    // 添加视觉时钟（调试用）
    function showClock() {
        const box = document.createElement("div");
        box.style = "position:fixed;top:0;left:0;background:#000;color:#0f0;font-size:12px;padding:2px 4px;z-index:9999";
        setInterval(() => {
            box.textContent = "监控中 " + new Date().toLocaleTimeString();
        }, 1000);
        document.body.appendChild(box);
    }

    // 定时刷新（即便在后台）
    function keepAliveLoop() {
        setInterval(() => {
            console.log("🔁 页面强制刷新...");
            location.reload(true);
        }, INTERVAL);
    }

    // 主流程
    function main() {
        showClock();
        checkAndNotify();
        keepAliveLoop(); // 每次加载都绑定刷新定时器
    }

    // 加载后延迟执行
    window.addEventListener("load", () => {
        setTimeout(main, 2000);
    });
})();