// ==UserScript==
// @name         斗鱼全民星推荐自动领取
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  自动领取斗鱼全民星推荐红包
// @author       ysl
// @match        *://www.douyu.com/6657*
// @match        *://www.douyu.com/*
// @match        *://www.douyu.com/topic/*?rid=[0-9]*
// @grant        GM_openInTab
// @grant        GM_closeTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_log
// @grant        GM_xmlhttpRequest
// @connect      list-www.douyu.com
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/532514/%E6%96%97%E9%B1%BC%E5%85%A8%E6%B0%91%E6%98%9F%E6%8E%A8%E8%8D%90%E8%87%AA%E5%8A%A8%E9%A2%86%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/532514/%E6%96%97%E9%B1%BC%E5%85%A8%E6%B0%91%E6%98%9F%E6%8E%A8%E8%8D%90%E8%87%AA%E5%8A%A8%E9%A2%86%E5%8F%96.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- 常量与配置 ---
    const CONTROL_ROOM_ID = "6657";
    const TEMP_CONTROL_ROOM_RID = "6979222";
    const SCRIPT_PREFIX = "[全民星推荐助手]";
    const CHECK_INTERVAL = 3000;
    const CLOSE_POPUP_DELAY = 2000;
    const PANEL_WAIT_TIMEOUT = 10000;
    const ELEMENT_WAIT_TIMEOUT = 30000;
    const LOAD_DELAY_THRESHOLD = 5;
    const DRAGGABLE_BUTTON_ID = 'douyu-qmx-starter-button';
    const API_URL = "https://www.douyu.com/japi/livebiznc/web/anchorstardiscover/redbag/square/list";

    // 自动暂停配置
    const AUTO_PAUSE_ENABLED = true;
    const AUTO_PAUSE_CHECK_INTERVAL = 2000;
    const AUTO_PAUSE_DELAY_AFTER_ACTION = 5000;

    // --- 选择器 ---
    const SELECTORS = {
        // 入口图标
        entryIcon: "div.activeContainer__8Qxzw div.boxIconWrap__cFDhA",

        // 弹窗相关
        popupContent: "div.LiveNewAnchorSupportT-pop--bagWrap",
        popupContainer: "div.LiveNewAnchorSupportT-pop",
        popupWaitBtn: "div.LiveNewAnchorSupportT-singleBag--btn",
        popupOpenBtn: "div.LiveNewAnchorSupportT-singleBag--btnOpen",
        closeButton: "div.LiveNewAnchorSupportT-pop--close",

        // 页面关键元素
        criticalElement: "#js-player-video",

        // 播放器控制栏容器
        controlBar: "#js-player-controlbar"
    };

    // --- 状态变量 ---
    let mainIntervalId = null;
    let pauseIntervalId = null;
    let isProcessingRedBag = false;
    let isSwitchingRoom = false;
    let notFoundCounter = 0;
    let openedRoomIds = new Set();
    let tabStartTime = 0;
    let lastActionTime = 0;

    // --- 辅助函数 ---
    function log(message) {
        GM_log(`${SCRIPT_PREFIX} ${message}`);
        console.log(`${SCRIPT_PREFIX} ${message}`);
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function safeClick(element, description) {
        if (!element) return false;
        try {
            element.click();
            return true;
        } catch (error) {
            log(`点击 ${description} 失败: ${error.message}`);
            return false;
        }
    }

    async function findElement(selector, timeout = 5000) {
        const start = Date.now();
        while (Date.now() - start < timeout) {
            const el = document.querySelector(selector);
            if (el && window.getComputedStyle(el).display !== 'none') return el;
            await sleep(500);
        }
        return null;
    }

    // --- 核心逻辑 ---

    // 1. 自动暂停
    function autoPauseVideo() {
        if (!AUTO_PAUSE_ENABLED) return;

        // 查找控制栏
        const controlBar = document.querySelector(SELECTORS.controlBar);
        if (!controlBar) return;

        // 查找包含特定暂停路径的 path 元)
        const pausePath = controlBar.querySelector('path[d^="M9.5 7"]');

        if (pausePath) {
            // 找到了暂停图标，说明正在播放 -> 点击它的父级按钮进行暂停
            // 通常 path -> svg -> i (按钮)
            const btn = pausePath.closest('i') || pausePath.closest('div[role="button"]');
            if (btn) {
                log("检测到视频正在播放，执行暂停。");
                btn.click();
                return true;
            }
        }
        return false;
    }

    // 2. API 获取房间
    function getRoomsFromApi(count, sourceRid) {
        return new Promise((resolve, reject) => {
            if (!sourceRid) return reject(new Error("无 RID"));
            GM_xmlhttpRequest({
                method: "GET",
                url: `${API_URL}?rid=${sourceRid}`,
                headers: { 'Referer': `https://www.douyu.com/${sourceRid}` },
                responseType: "json",
                onload: (res) => {
                    if (res.status === 200 && res.response?.error === 0) {
                        const list = res.response.data.redBagList || [];
                        resolve(list.map(i => `https://www.douyu.com/${i.rid}`).slice(0, count));
                    } else reject(new Error("API Error"));
                },
                onerror: reject
            });
        });
    }

    // 3. 关闭当前页
    function closeCurrentTab() {
        if (mainIntervalId) clearInterval(mainIntervalId);
        if (pauseIntervalId) clearInterval(pauseIntervalId);
        setTimeout(() => {
            try { window.close(); } catch(e){}
            try { GM_closeTab(); } catch(e){}
            // 兜底
            setTimeout(() => { window.location.href = "about:blank"; }, 1000);
        }, 500);
    }

    // 4. 切换房间
    async function handleSwitchRoom() {
        if (isSwitchingRoom) return;
        isSwitchingRoom = true;
        log("准备切换房间...");
        try {
            const currentRid = window.location.pathname.match(/\/(\d+)/)?.[1] || TEMP_CONTROL_ROOM_RID;
            const rooms = await getRoomsFromApi(5, currentRid);
            const nextUrl = rooms.find(u => !u.includes(currentRid)) || rooms[0];
            if (nextUrl) {
                GM_openInTab(nextUrl, { active: false, setParent: true });
            }
        } catch (e) {
            log(`API 失败: ${e.message}`);
        } finally {
            await sleep(1000);
            closeCurrentTab();
        }
    }

    // 5. 弹窗等待逻辑
    async function waitAndClaimRedBag() {
        log("进入等待...");
        const MAX_WAIT = 185 * 1000;
        const start = Date.now();
        while (Date.now() - start < MAX_WAIT) {
            const popup = document.querySelector(SELECTORS.popupContainer);
            if (!popup) return false;

            const openBtn = popup.querySelector(SELECTORS.popupOpenBtn);
            if (openBtn && window.getComputedStyle(openBtn).display !== 'none') {
                log("【可领取】点击！");
                await sleep(500);
                openBtn.click();
                await sleep(CLOSE_POPUP_DELAY);
                const closeBtn = document.querySelector(SELECTORS.closeButton);
                if (closeBtn) closeBtn.click();
                return true;
            }

            const waitBtn = popup.querySelector(SELECTORS.popupWaitBtn);
            if (waitBtn && Date.now() % 5000 < 500) log(`倒计时: ${waitBtn.textContent}`);

            await sleep(1000);
        }
        return false;
    }

    // 6. 主循环
    async function mainLoop() {
        if (isProcessingRedBag || isSwitchingRoom) return;

        if (Date.now() - tabStartTime > 10 * 60 * 1000) {
            handleSwitchRoom();
            return;
        }

        const icon = document.querySelector(SELECTORS.entryIcon);
        if (!icon) {
            notFoundCounter++;
            if (notFoundCounter > LOAD_DELAY_THRESHOLD) {
                handleSwitchRoom();
            }
            return;
        }

        notFoundCounter = 0;
        isProcessingRedBag = true;

        // 在打开红包前，尝试暂停
        autoPauseVideo();
        await sleep(500);

        log("点击红包入口...");
        if (safeClick(icon, "入口图标")) {
            await sleep(2000);
            const popupContent = await findElement(SELECTORS.popupContent, 5000);

            if (popupContent) {
                const success = await waitAndClaimRedBag();
                log(success ? "领取完成" : "领取未完成");
                await sleep(1000);
                handleSwitchRoom();
            } else {
                log("未检测到弹窗内容。");
                const closeBtn = document.querySelector(SELECTORS.closeButton);
                if (closeBtn) closeBtn.click();
                await sleep(1000);
                handleSwitchRoom();
            }
        } else {
            isProcessingRedBag = false;
        }
    }

    // --- 控制面板 ---
    function setupLauncherUI() {
        if (document.getElementById(DRAGGABLE_BUTTON_ID)) return;
        GM_addStyle(`#${DRAGGABLE_BUTTON_ID} { position: fixed; top:100px; left:20px; z-index: 99999; background: #ff5d23; color: white; border: none; padding: 10px; cursor: pointer; }`);
        const btn = document.createElement('button');
        btn.id = DRAGGABLE_BUTTON_ID;
        btn.innerHTML = '启动检测';
        btn.onclick = async () => {
            try {
                const urls = await getRoomsFromApi(5, TEMP_CONTROL_ROOM_RID);
                if(urls[0]) GM_openInTab(urls[0], {active: false});
            } catch(e) {}
        };
        document.body.appendChild(btn);
    }

    // --- 初始化 ---
    async function init() {
        const url = window.location.href;
        if (url.includes(CONTROL_ROOM_ID) || url.includes(TEMP_CONTROL_ROOM_RID)) {
            setupLauncherUI();
        } else if (url.match(/douyu\.com\/\d+/)) {
            log("工作页启动");
            tabStartTime = Date.now();
            const video = await findElement(SELECTORS.criticalElement, ELEMENT_WAIT_TIMEOUT);
            if (video) {
                // 页面加载后立即尝试一次暂停
                setTimeout(autoPauseVideo, 2000);

                mainIntervalId = setInterval(mainLoop, CHECK_INTERVAL);

                // 周期性检查暂停 (防止自动播放恢复)
                if (AUTO_PAUSE_ENABLED) {
                    pauseIntervalId = setInterval(() => {
                        // 如果没有正在处理红包，或者正在倒计时等待中，都强制检查暂停
                        // 避免在等待3分钟倒计时期间视频一直放
                        if (!isSwitchingRoom) {
                            autoPauseVideo();
                        }
                    }, AUTO_PAUSE_CHECK_INTERVAL);
                }
            } else {
                closeCurrentTab();
            }
        }
    }

    setTimeout(init, 2000);
})();