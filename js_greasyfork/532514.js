// ==UserScript==
// @name         斗鱼全民星推荐自动领取
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  自动打开、领取并切换直播间处理全民星推荐活动红包，并尝试自动暂停视频。
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
    const CHECK_INTERVAL = 5000;
    const POPUP_WAIT_TIMEOUT = 15000;
    const POPUP_CHECK_INTERVAL = 1000;
    const CLOSE_POPUP_DELAY = 4000;
    const PANEL_WAIT_TIMEOUT = 10000;
    const ELEMENT_WAIT_TIMEOUT = 30000;
    const LOAD_DELAY_THRESHOLD = 3;
    const MIN_DELAY = 1000;
    const MAX_DELAY = 2500;
    const OPEN_TAB_DELAY = 1000;
    const CLOSE_TAB_DELAY = 1500;
    const INITIAL_SCRIPT_DELAY = 3000;
    const DRAGGABLE_BUTTON_ID = 'douyu-qmx-starter-button';
    const BUTTON_POS_STORAGE_KEY = 'douyu_qmx_button_position';
    const API_URL = "https://www.douyu.com/japi/livebiznc/web/anchorstardiscover/redbag/square/list";

    const MAX_TAB_LIFETIME_MS = 10 * 60 * 1000;

    // 自动暂停相关配置
    const AUTO_PAUSE_ENABLED = true; // 是否启用自动暂停
    const AUTO_PAUSE_CHECK_INTERVAL = 2000; // 检查是否需要暂停的间隔 (ms)
    const AUTO_PAUSE_DELAY_AFTER_ACTION = 5000; // 执行红包操作后，延迟多久再开始检查暂停 (ms)

    // --- 选择器 ---
    const SELECTORS = {
        redEnvelopeContainer: "#layout-Player-aside div.LiveNewAnchorSupportT-enter",
        countdownTimer: "span.LiveNewAnchorSupportT-enter--bottom",
        popupModal: "body > div.LiveNewAnchorSupportT-pop",
        openButton: "div.LiveNewAnchorSupportT-singleBag--btnOpen",
        closeButton: "div.LiveNewAnchorSupportT-pop--close",
        criticalElement: "#js-player-video", // 视频播放器容器
        // 新增：播放/暂停按钮选择器
        pauseButton: "div.pause-c594e8:not(.removed-9d4c42)", // 播放中状态的暂停按钮
        playButton: "div.play-8dbf03:not(.removed-9d4c42)",   // 暂停中状态的播放按钮
    };

    // --- 状态变量 ---
    let mainIntervalId = null;
    let pauseIntervalId = null; // 新增：暂停循环定时器
    let isWaitingForPopup = false;
    let isSwitchingRoom = false;
    let notFoundCounter = 0;
    let isDragging = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;
    let openedRoomIds = new Set();
    let tabStartTime = 0;
    let isPausedByScript = false; // 新增：标记是否由脚本暂停
    let lastActionTime = 0; // 新增：记录上次红包操作时间

    // --- 辅助函数 ---
    function log(message) {
        GM_log(`${SCRIPT_PREFIX} ${message}`);
        console.log(`${SCRIPT_PREFIX} ${message}`);
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function getRandomDelay(min = MIN_DELAY, max = MAX_DELAY) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    async function safeClick(element, description, delayBefore = true, delayAfter = true) {
        if (!element) {
            log(`[点击失败] 无法找到元素: ${description}`);
            return false;
        }
        try {
            const style = window.getComputedStyle(element);
            if (style.display === 'none' || style.visibility === 'hidden' || element.offsetParent === null || element.disabled) {
                log(`[点击失败] 元素存在但不可见或不可交互: ${description}`);
                return false;
            }
            if (delayBefore) {
                const waitBefore = getRandomDelay(MIN_DELAY / 2, MAX_DELAY / 2);
                // log(`准备点击 ${description}，先等待 ${waitBefore}ms`); // 减少日志输出
                await sleep(waitBefore);
            }
            log(`尝试点击: ${description}`);
            element.click();
            if (delayAfter) {
                const waitAfter = getRandomDelay();
                log(`点击 ${description} 后等待 ${waitAfter}ms`);
                await sleep(waitAfter);
            }
            return true;
        } catch (error) {
            log(`[点击异常] ${description} 时发生错误: ${error.message}`);
            console.error(`Click error on ${description}:`, error);
            return false;
        }
    }

    async function findElement(selector, timeout = PANEL_WAIT_TIMEOUT, parent = document) {
        // log(`开始查找元素: ${selector} (超时 ${timeout}ms)`); // 减少日志输出
        const startTime = Date.now();
        while (Date.now() - startTime < timeout) {
            const element = parent.querySelector(selector);
            if (element) {
                const style = window.getComputedStyle(element);
                // 检查元素是否真实可见
                if (style.display !== 'none' && style.visibility !== 'hidden' && element.offsetWidth > 0 && element.offsetHeight > 0) {
                    // log(`找到可见元素: ${selector}`); // 减少日志输出
                    return element;
                }
            }
            await sleep(300);
        }
        log(`查找元素超时: ${selector}`);
        return null;
    }

    // --- API 调用 ---
    function getRoomsFromApi(count, sourceRid) {
        return new Promise((resolve, reject) => {
            if (!sourceRid) {
                const errorMsg = "API 调用失败：必须提供一个来源房间ID (sourceRid)。";
                log(errorMsg);
                return reject(new Error(errorMsg));
            }

            // 动态构建 API URL
            const apiUrlWithParams = `${API_URL}?rid=${sourceRid}`;

            // 动态构建 Referer，使其与 sourceRid 匹配
            const refererUrl = `https://www.douyu.com/${sourceRid}`;

            log(`开始调用 API: ${apiUrlWithParams}`);
            log(`使用的 Referer: ${refererUrl}`);

            GM_xmlhttpRequest({
                method: "GET",
                url: apiUrlWithParams,
                headers: {
                    'Referer': refererUrl,
                    'User-Agent': navigator.userAgent
                },
                responseType: "json",
                timeout: 10000,
                onload: function (response) {
                    log(`API 响应状态: ${response.status}`);
                    if (response.status >= 200 && response.status < 300 && response.response) {
                        const data = response.response;
                        if (data.error === 0 && data.data && Array.isArray(data.data.redBagList)) {
                            log(`API 返回成功，找到 ${data.data.redBagList.length} 个房间。`);
                            const roomUrls = data.data.redBagList
                                .map(item => item.rid)
                                .filter(rid => rid)
                                .slice(0, count * 2)
                                .map(rid => `https://www.douyu.com/${rid}`);
                            log(`提取到 ${roomUrls.length} 个 URL。`);
                            resolve(roomUrls);
                        } else {
                            log(`API 返回数据格式错误或 error 不为 0: error=${data.error}, msg=${data.msg}`);
                            reject(new Error(`API 数据错误: ${data.msg || '未知错误'}`));
                        }
                    } else {
                        log(`API 请求失败，状态码: ${response.status}`);
                        reject(new Error(`API 请求失败，状态码: ${response.status}`));
                    }
                },
                onerror: function (error) {
                    log(`API 请求网络错误: ${error.statusText || '未知网络错误'}`);
                    console.error("API onerror:", error);
                    reject(new Error(`API 网络错误: ${error.statusText || '未知'}`));
                },
                ontimeout: function () {
                    log("API 请求超时。");
                    reject(new Error("API 请求超时"));
                }
            });
        });
    }

    // --- 标签页关闭函数 ---
    async function closeCurrentTab() {
        // ... (与原脚本相同)
        log("尝试关闭当前标签页...");
        if (mainIntervalId) {
            log("关闭前停止主循环定时器。");
            clearInterval(mainIntervalId);
            mainIntervalId = null;
        }
        if (pauseIntervalId) { // 新增
            log("关闭前停止暂停循环定时器。");
            clearInterval(pauseIntervalId);
            pauseIntervalId = null;
        }
        await sleep(500); // 确保定时器已清除
        try {
            log("优先尝试 GM_closeTab()...");
            GM_closeTab();
            log("GM_closeTab() 已调用 (若标签页未关闭，则无效或被阻止)。");
        } catch (e) {
            log(`GM_closeTab() 失败或不可用: ${e.message}`);
            log("尝试备用方法: window.close()...");
            try {
                window.close();
                log("备用关闭方法 window.close() 已调用。");
            } catch (e2) {
                log(`备用关闭方法也失败: ${e2.message}`);
            }
        }
    }

    // --- 控制页面 相关函数 ---
    function makeDraggable(element) {
        // ... (与原脚本相同)
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const savedPos = GM_getValue(BUTTON_POS_STORAGE_KEY);
        if (savedPos && savedPos.top && savedPos.left) {
            element.style.top = savedPos.top;
            element.style.left = savedPos.left;
            log(`恢复按钮位置: top=${savedPos.top}, left=${savedPos.left}`);
        } else {
            // 默认位置
            element.style.top = '100px';
            element.style.left = '20px';
        }
        element.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            if (e.button !== 0) return; // 仅左键拖动
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
            isDragging = true;
            element.style.cursor = 'grabbing';
            log("开始拖拽按钮");
        }

        function elementDrag(e) {
            if (!isDragging) return;
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;

            let newTop = element.offsetTop - pos2;
            let newLeft = element.offsetLeft - pos1;

            // 边界检测
            newTop = Math.max(0, Math.min(window.innerHeight - element.offsetHeight, newTop));
            newLeft = Math.max(0, Math.min(window.innerWidth - element.offsetWidth, newLeft));

            element.style.top = newTop + "px";
            element.style.left = newLeft + "px";
        }

        function closeDragElement(e) {
            // 确保只有在拖拽开始后才执行
            if (e.button !== 0 && isDragging) return; // 如果是其他鼠标按钮释放，且正在拖拽，则不处理
            document.onmouseup = null;
            document.onmousemove = null;
            if (isDragging) { // 只有当拖拽发生时才保存
                isDragging = false;
                element.style.cursor = 'grab';
                log("结束拖拽按钮");
                GM_setValue(BUTTON_POS_STORAGE_KEY, { top: element.style.top, left: element.style.left });
                log(`保存按钮位置: top=${element.style.top}, left=${element.style.left}`);
            } else {
                // 如果没有拖拽，只是点击，也恢复鼠标样式
                element.style.cursor = 'grab';
            }
        }
    }

    async function openOneNewTab() {
        const startButton = document.getElementById(DRAGGABLE_BUTTON_ID);
        if (!startButton || startButton.disabled) return;

        startButton.disabled = true;
        startButton.innerHTML = '正在查找... <span class="count">(已开: ' + openedRoomIds.size + ')</span>';
        log("开始通过 API 查找下一个可打开的房间...");

        try {
            // 确定用于 API 请求的来源 rid
            let sourceRid = TEMP_CONTROL_ROOM_RID; // 默认新版
            if (window.location.href.includes(`/${CONTROL_ROOM_ID}`)) {
                sourceRid = CONTROL_ROOM_ID; // 如果是旧版 URL，则用旧版 ID
            }
            log(`使用控制页面的 RID [${sourceRid}] 作为 API 请求来源。`);

            const apiRoomList = await getRoomsFromApi(10, sourceRid);
            let foundNewUrl = null;
            let foundNewRid = null;

            if (apiRoomList && apiRoomList.length > 0) {
                log(`API 返回 ${apiRoomList.length} 个房间，开始查找未打开的...`);
                for (const url of apiRoomList) {
                    const ridMatch = url.match(/\/(\d+)/);
                    if (ridMatch && ridMatch[1]) {
                        const rid = ridMatch[1];
                        if (!openedRoomIds.has(rid)) {
                            foundNewUrl = url;
                            foundNewRid = rid;
                            log(`找到未打开的房间: rid=${rid}, url=${url}`);
                            break;
                        }
                    }
                }
            } else {
                log("API 未返回有效的房间列表。");
            }

            if (foundNewUrl && foundNewRid) {
                log(`准备打开新标签页: ${foundNewUrl}`);
                try {
                    GM_openInTab(foundNewUrl, { active: false, setParent: true });
                    openedRoomIds.add(foundNewRid);
                    log(`房间 rid=${foundNewRid} 已添加到打开列表。当前列表大小: ${openedRoomIds.size}`);
                    startButton.innerHTML = '再打开一个 <span class="count">(已开: ' + openedRoomIds.size + ')</span>';
                    await sleep(OPEN_TAB_DELAY);
                } catch (e) {
                    log(`打开标签页 ${foundNewUrl} 时出错: ${e.message}`);
                    startButton.innerHTML = '打开出错，重试？ <span class="count">(已开: ' + openedRoomIds.size + ')</span>';
                }
            } else {
                log("在 API 列表中未能找到新的、未打开的房间。");
                startButton.innerHTML = '无新房间可开 <span class="count">(已开: ' + openedRoomIds.size + ')</span>';
                await sleep(2000);
                if (!startButton.disabled) {
                    startButton.innerHTML = '再打开一个 <span class="count">(已开: ' + openedRoomIds.size + ')</span>';
                }
            }
        } catch (error) {
            log(`查找或打开房间时发生错误: ${error.message}`);
            startButton.innerHTML = '查找出错，重试？ <span class="count">(已开: ' + openedRoomIds.size + ')</span>';
        } finally {
            startButton.disabled = false;
            log("按钮已恢复可用。");
        }
    }

    function setupLauncherUI() {
        // ... (与原脚本相同)
        log("设置控制页面 UI...");
        GM_addStyle(`
            #${DRAGGABLE_BUTTON_ID} {
                position: fixed;
                z-index: 99999;
                background-color: #ff5d23; /* 斗鱼橙色 */
                color: white;
                border: none;
                padding: 10px 15px;
                border-radius: 5px;
                cursor: grab;
                font-size: 14px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                transition: background-color 0.2s, opacity 0.3s;
                opacity: 0.9; /* 轻微透明，不那么突兀 */
            }
            #${DRAGGABLE_BUTTON_ID}:hover {
                background-color: #e04a10; /* 鼠标悬停颜色加深 */
                opacity: 1;
            }
            #${DRAGGABLE_BUTTON_ID}:active {
                cursor: grabbing;
                background-color: #c8400a; /* 点击时颜色再加深 */
            }
            #${DRAGGABLE_BUTTON_ID}:disabled {
                background-color: #cccccc;
                cursor: not-allowed;
                opacity: 0.7;
            }
            #${DRAGGABLE_BUTTON_ID} span.count {
                font-size: 10px;
                margin-left: 5px;
                opacity: 0.7;
            }
        `);

        // 防止重复创建按钮
        if (document.getElementById(DRAGGABLE_BUTTON_ID)) {
            log("启动按钮已存在。");
            return;
        }

        const button = document.createElement('button');
        button.id = DRAGGABLE_BUTTON_ID;
        button.innerHTML = '打开一个房间 <span class="count">(已开: 0)</span>'; // 初始计数为0
        button.onclick = openOneNewTab; // 点击事件

        document.body.appendChild(button);
        makeDraggable(button); // 使按钮可拖拽
        log("启动按钮已创建并可拖拽。");
    }

    // --- 工作页面 相关函数 ---

    // 新增：自动暂停视频函数
    async function autoPauseVideo() {
        if (!AUTO_PAUSE_ENABLED) return; // 如果未启用则跳过
        if (isWaitingForPopup || isSwitchingRoom) return; // 如果正在进行其他操作，不暂停

        // 检查距离上次红包操作时间是否足够长
        if (Date.now() - lastActionTime < AUTO_PAUSE_DELAY_AFTER_ACTION) {
            // log("距离上次红包操作时间较近，暂时不执行自动暂停。");
            return;
        }

        const pauseBtn = document.querySelector(SELECTORS.pauseButton);
        if (pauseBtn) { // 如果能找到暂停按钮，说明视频正在播放
            log("检测到视频正在播放，尝试自动暂停...");
            if (await safeClick(pauseBtn, "暂停按钮", false, false)) { // 点击暂停时不加额外延迟
                isPausedByScript = true;
                log("视频已通过脚本暂停。");
            } else {
                log("尝试点击暂停按钮失败。");
            }
        } else {
            // log("视频已暂停或暂停按钮不可见。"); // 减少日志
        }
    }

    async function waitForPopupAndClick() {
        log("开始等待中间红包弹窗...");
        isWaitingForPopup = true;
        const popup = await findElement(SELECTORS.popupModal, POPUP_WAIT_TIMEOUT);
        if (!popup) {
            log("等待红包弹窗超时或未找到。");
            isWaitingForPopup = false;
            return false;
        }
        log("红包弹窗已出现。查找打开按钮...");
        const openBtn = popup.querySelector(SELECTORS.openButton);
        if (await safeClick(openBtn, "红包弹窗的打开按钮")) {
            lastActionTime = Date.now(); // 记录操作时间
            log(`红包打开按钮已点击，等待 ${CLOSE_POPUP_DELAY}ms 后尝试关闭弹窗...`);
            await sleep(CLOSE_POPUP_DELAY);
            log("尝试关闭领取结果弹窗...");
            const finalPopup = document.querySelector(SELECTORS.popupModal); // 重新获取，弹窗可能已变
            if (finalPopup) {
                const closeBtn = finalPopup.querySelector(SELECTORS.closeButton);
                if (!await safeClick(closeBtn, "领取结果弹窗的关闭按钮", true, false)) { // 关闭时不加延后延迟
                    log("关闭按钮未找到或点击失败。");
                } else {
                    log("关闭按钮已点击。");
                }
            } else {
                log("领取结果弹窗似乎已自动消失或无法重新找到。");
            }
            isWaitingForPopup = false;
            return true;
        } else {
            log("错误：找到了弹窗，但找不到或无法点击打开按钮。");
            // 尝试关闭弹窗，避免卡住
            const closeBtn = popup.querySelector(SELECTORS.closeButton);
            if (closeBtn) {
                log("尝试关闭无法操作的红包弹窗...");
                await safeClick(closeBtn, "无法操作的红包弹窗的关闭按钮", false, false);
            }
            isWaitingForPopup = false;
            return false;
        }
    }

    async function handleSwitchRoom() {
        if (isSwitchingRoom) {
            log("已在执行切换房间操作，本次跳过。");
            return;
        }
        isSwitchingRoom = true;
        log("开始尝试通过 API 获取下一个房间并切换...");

        try {
            const currentRoomId = window.location.pathname.match(/\/(\d+)/)?.[1] || window.location.search.match(/rid=(\d+)/)?.[1];

            if (!currentRoomId) {
                log("错误：无法从当前 URL 中解析出房间ID。无法继续切换，将关闭此页面。");
                isSwitchingRoom = false; // 重置状态
                await sleep(2000);
                await closeCurrentTab();
                return;
            }

            log(`当前房间 ID: ${currentRoomId}`);
            const roomList = await getRoomsFromApi(5, currentRoomId); // 传入当前房间ID
            let nextUrl = null;

            if (roomList && roomList.length > 0) {
                for (const url of roomList) {
                    const nextRoomId = url.match(/\/(\d+)/)?.[1];
                    if (nextRoomId && nextRoomId !== currentRoomId) {
                        log(`找到下一个不同的房间: ${url}`);
                        nextUrl = url;
                        break;
                    }
                }
                if (!nextUrl && roomList.length > 0 && roomList[0].match(/\/(\d+)/)?.[1] !== currentRoomId) {
                    log("未找到与当前不同的房间，但API列表非空，尝试使用列表第一个（如果它不是当前房间）");
                    nextUrl = roomList[0];
                }
            }

            if (nextUrl) {
                log(`确定下一个房间链接: ${nextUrl}`);
                log("准备打开新标签页并关闭当前页...");
                try {
                    GM_openInTab(nextUrl, { active: false, setParent: true });
                    log(`新标签页打开指令已发送: ${nextUrl}`);
                    if (mainIntervalId) {
                        clearInterval(mainIntervalId);
                        mainIntervalId = null;
                        log("当前页主循环已停止。");
                    }
                    if (pauseIntervalId) {
                        clearInterval(pauseIntervalId);
                        pauseIntervalId = null;
                        log("当前页暂停循环已停止。");
                    }
                    await sleep(CLOSE_TAB_DELAY + getRandomDelay(0, 500));
                    await closeCurrentTab();
                } catch (tabError) {
                    log(`打开或关闭标签页时发生错误: ${tabError.message}`);
                    if (mainIntervalId) clearInterval(mainIntervalId);
                    if (pauseIntervalId) clearInterval(pauseIntervalId);
                    isSwitchingRoom = false;
                }
            } else {
                log("未能从 API 获取到合适的下一个房间链接。可能没有其他活动房间了。停止当前页面脚本。");
                if (mainIntervalId) clearInterval(mainIntervalId);
                if (pauseIntervalId) clearInterval(pauseIntervalId);
                mainIntervalId = null;
                pauseIntervalId = null;
                isSwitchingRoom = false;
                log("尝试关闭这个最后的标签页...");
                await sleep(CLOSE_TAB_DELAY);
                await closeCurrentTab();
            }
        } catch (error) {
            log(`通过 API 切换房间时发生严重错误: ${error.message}`);
            console.error(error);
            isSwitchingRoom = false;
            if (mainIntervalId) {
                clearInterval(mainIntervalId);
                mainIntervalId = null;
                log("因错误停止当前页主循环。");
            }
            if (pauseIntervalId) {
                clearInterval(pauseIntervalId);
                pauseIntervalId = null;
                log("因错误停止当前页暂停循环。");
            }
        }
    }

    async function mainLoop() {
        try {
            if (isWaitingForPopup || isSwitchingRoom) {
                return;
            }

            if (tabStartTime && (Date.now() - tabStartTime > MAX_TAB_LIFETIME_MS)) {
                log(`标签页已达到最大生存时间 (${MAX_TAB_LIFETIME_MS / 60000} 分钟)，准备切换。`);
                await handleSwitchRoom();
                return;
            }

            const redEnvelopeDiv = document.querySelector(SELECTORS.redEnvelopeContainer);
            if (!redEnvelopeDiv) {
                notFoundCounter++;
                if (notFoundCounter === 1) log("首次未找到红包区域，可能已领完或加载中...");
                if (notFoundCounter >= LOAD_DELAY_THRESHOLD) {
                    log(`红包区域连续 ${notFoundCounter} 次未找到，判定为活动结束或页面异常，触发切换房间。`);
                    notFoundCounter = 0;
                    await handleSwitchRoom();
                }
                return;
            }
            if (notFoundCounter > 0) {
                log("重新找到了红包区域。");
                notFoundCounter = 0;
            }

            // 检查红包区域是否可见
            const style = window.getComputedStyle(redEnvelopeDiv);
            if (style.display === 'none' || style.visibility === 'hidden' || redEnvelopeDiv.offsetParent === null) {
                // log("红包区域不可见，等待下次检查..."); // 减少不必要的日志
                return;
            }

            const statusSpan = redEnvelopeDiv.querySelector(SELECTORS.countdownTimer);
            if (statusSpan) {
                const statusText = statusSpan.textContent.trim();
                if (statusText.includes(':')) {
                    // log(`等待倒计时: ${statusText}`);
                } else if (statusText.includes('抢') || statusText.includes('领')) {
                    log(`检测到可点击状态: "${statusText}"`);
                    // 在点击红包前，如果视频是脚本暂停的，不需要主动恢复，因为点击会打断暂停
                    // isPausedByScript = false; // 重置标记，因为用户（脚本）即将交互
                    if (await safeClick(redEnvelopeDiv, "右下角红包区域")) {
                        await waitForPopupAndClick();
                        // 红包操作完成后，重置上次操作时间，以便autoPauseVideo可以重新计时
                        lastActionTime = Date.now();
                    } else {
                        log("尝试点击右下角红包区域失败。");
                        await sleep(getRandomDelay()); // 失败后稍作等待
                    }
                } else if (statusText === "") {
                    // log("红包状态文本为空，可能在加载中，等待下次检查...");
                }
                else {
                    log(`红包区域状态未知: "${statusText}"，等待下次检查...`);
                }
            } else {
                log("警告：在红包区域内找不到状态元素 (span.LiveNewAnchorSupportT-enter--bottom)。");
            }
        } catch (error) {
            log(`主循环发生未捕获错误: ${error.message}`);
            console.error("Main loop error:", error);
            // 发生错误时，也尝试停止定时器
            if (mainIntervalId) {
                log("因主循环错误，停止定时器。");
                clearInterval(mainIntervalId);
                mainIntervalId = null;
            }
            if (pauseIntervalId) { // 新增
                log("因主循环错误，停止暂停循环定时器。");
                clearInterval(pauseIntervalId);
                pauseIntervalId = null;
            }
        }
    }

    // --- 脚本初始化 ---
    async function initializeScript() {
        log("脚本初始化...");
        const currentUrl = window.location.href;

        const isOldControlRoom = currentUrl.includes(`/${CONTROL_ROOM_ID}`);
        const isNewControlRoom = currentUrl.includes(`/topic/`) && currentUrl.includes(`rid=${TEMP_CONTROL_ROOM_RID}`);

        if (isOldControlRoom || isNewControlRoom) {
            let controlRoomType = isOldControlRoom ? `旧版 (${CONTROL_ROOM_ID})` : `新版 (rid=${TEMP_CONTROL_ROOM_RID})`;
            log(`当前是控制页面 (${controlRoomType})。`);
            setupLauncherUI();
        } else if (currentUrl.match(/douyu\.com\/(\d+)/) || currentUrl.match(/douyu\.com\/topic\/.*rid=(\d+)/)) {
            log("当前是工作页面。");
            tabStartTime = Date.now();
            lastActionTime = Date.now(); // 初始化上次操作时间

            log(`等待关键元素 "${SELECTORS.criticalElement}" 出现 (最长 ${ELEMENT_WAIT_TIMEOUT / 1000} 秒)...`);
            const criticalElement = await findElement(SELECTORS.criticalElement, ELEMENT_WAIT_TIMEOUT);

            if (criticalElement) {
                log(`关键元素已找到。`);

                // 启动主循环
                if (mainIntervalId) clearInterval(mainIntervalId);
                await sleep(CHECK_INTERVAL); // 给页面更多渲染时间
                log("开始主循环...");
                mainIntervalId = setInterval(mainLoop, CHECK_INTERVAL);

                // 启动自动暂停循环 (如果启用)
                if (AUTO_PAUSE_ENABLED) {
                    if (pauseIntervalId) clearInterval(pauseIntervalId);
                    log("自动暂停功能已启用，开始暂停检查循环...");
                    pauseIntervalId = setInterval(autoPauseVideo, AUTO_PAUSE_CHECK_INTERVAL);
                }

            } else {
                log(`等待关键元素 "${SELECTORS.criticalElement}" 超时或未找到。脚本在当前页面可能无法正常工作。`);
                log("尝试关闭此无法正常初始化的标签页...");
                await sleep(CLOSE_TAB_DELAY);
                await closeCurrentTab();
            }
        } else {
            log("当前页面不是指定的控制页或直播间工作页，脚本不活动。 URL:", currentUrl);
        }
    }

    // --- 启动 ---
    log(`脚本将在 ${INITIAL_SCRIPT_DELAY}ms 后开始初始化...`);
    setTimeout(initializeScript, INITIAL_SCRIPT_DELAY);

})();