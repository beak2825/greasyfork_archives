// ==UserScript==
// @name         直播 - 抖音直播终极增强
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  弹幕拦截 / 画质自动切换 / 实时精确人数监控 / 礼物栏视觉净化 / 弹幕层一键清爽控制
// @match        https://*.douyin.com/*
// @run-at       document-idle
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502481/%E7%9B%B4%E6%92%AD%20-%20%E6%8A%96%E9%9F%B3%E7%9B%B4%E6%92%AD%E7%BB%88%E6%9E%81%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/502481/%E7%9B%B4%E6%92%AD%20-%20%E6%8A%96%E9%9F%B3%E7%9B%B4%E6%92%AD%E7%BB%88%E6%9E%81%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const TARGET_URL_KEY = "/im/push/v2/";

    console.log("🔥 v11.1 脚本已注入：沉浸式拦截模式已开启 (修复滚动与性能问题)。");

    // ==========================================
    // 0. 全局样式注入 (防止原生背景色残留)
    // ==========================================
    const style = document.createElement('style');
    style.innerHTML = `
        .webcast-chatroom___list, .webcast-chatroom___items, .webcast-chatroom___bottom-message {
            background-color: transparent !important;
        }
        /* 隐藏原生可能残留的滚动条背景 */
        ::-webkit-scrollbar-track {
            background: transparent !important;
        }
    `;
    document.head.appendChild(style);

    // ==========================================
    // 1. Protobuf 定义与类型初始化
    // ==========================================
    const protoStr = `
    syntax = "proto3";
    message PushFrame { uint64 seqId = 1; uint64 logId = 2; bytes payload = 8; string payloadEncoding = 6; }
    message Response { repeated Message messagesList = 1; }
    message Message { string method = 1; bytes payload = 2; }
    message ChatMessage { Common common = 1; User user = 2; string content = 3; }
    message User { uint64 id = 1; string nickName = 3; }
    message Common { string method = 1; uint64 msg_id = 2; }
    message RoomUserSeqMessageContributor { uint64 score = 1; User user = 2; }
    message RoomUserSeqMessage {
        Common common = 1;
        repeated RoomUserSeqMessageContributor ranksList = 2;
        int64 total = 3;
        string popStr = 4;
        repeated RoomUserSeqMessageContributor seatsList = 5;
        int64 popularity = 6;
        int64 totalUser = 7;
        string totalUserStr = 8;
        string totalStr = 9;
    }
    `;

    let root = null;
    try {
        root = protobuf.parse(protoStr).root;
    } catch (e) {
        console.error("❌ Protobuf 解析失败:", e);
        return;
    }

    const PushFrame = root.lookupType("PushFrame");
    const Response = root.lookupType("Response");
    const ChatMessage = root.lookupType("ChatMessage");
    const RoomUserSeqMessage = root.lookupType("RoomUserSeqMessage");

    // ==========================================
    // 2. DOM 工具与渲染函数
    // ==========================================

    function waitForElement(selector, callback, multiple = false) {
        const check = () => {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
                multiple ? elements.forEach(el => callback(el)) : callback(elements[0]);
                return true;
            }
            return false;
        };
        if (!check()) {
            const observer = new MutationObserver(() => {
                if (check() && !multiple) observer.disconnect();
            });
            observer.observe(document.documentElement, { childList: true, subtree: true });
        }
    }

    function updateOnlineCount(count) {
        // [修复] 优先使用精准选择器，避免全页面遍历
        let el = document.querySelector('[data-e2e="live-room-audience"]');

        // [优化] 如果精准匹配失败，仅在 Header 区域内寻找，极大降低CPU消耗
        if (!el) {
            const header = document.querySelector('header') || document.getElementById('livePlayerHeader');
            if (header) {
                const candidates = header.querySelectorAll('div');
                for (let cand of candidates) {
                    // 匹配纯数字或带"万"的格式
                    if (/^[\d.]+(万)?\+?$/.test(cand.innerText.trim())) {
                        el = cand;
                        break;
                    }
                }
            }
        }

        if (el) {
            const newText = count.toString();
            if (el.innerText !== newText) {
                el.innerText = newText;
            }
        }
    }

    function injectChatMessage(userName, content) {
        // 1. 查找滚动容器
        const chatWrapper = document.querySelector('[class*="webcast-chatroom___list"]');
        if (!chatWrapper) return;

        // 2. 查找消息挂载点
        const listContainer = chatWrapper.querySelector('div[style*="transform: translateY"]');
        if (!listContainer) return;

        // [修复] 智能滚动判断：只有当用户在底部附近时才自动滚动 (容差 80px)
        const threshold = 80;
        const isNearBottom = chatWrapper.scrollHeight - chatWrapper.scrollTop - chatWrapper.clientHeight <= threshold;

        // 3. 创建消息元素
        const messageWrapper = document.createElement('div');
        messageWrapper.className = "webcast-chatroom___item"; // 保持通用类名以便 CSS 隐藏背景

        // 4. 注入 HTML (沉浸式样式：无背景，带阴影)
        messageWrapper.innerHTML = `
            <div style="padding: 4px 12px; font-size: 14px; line-height: 1.5; word-break: break-all;">
                <span style="color: #FFA500; font-weight: bold; margin-right: 4px; text-shadow: 1px 1px 1px rgba(0,0,0,0.9);">[弹幕]</span>
                <span style="color: #8ce1ff; font-weight: 500; text-shadow: 1px 1px 1px rgba(0,0,0,0.9);">${userName}：</span>
                <span style="color: #ffffff; text-shadow: 1px 1px 1px rgba(0,0,0,0.9);">${content}</span>
            </div>
        `;

        // 5. 插入元素
        listContainer.appendChild(messageWrapper);

        // 6. 条件滚动
        if (isNearBottom) {
            chatWrapper.scrollTop = chatWrapper.scrollHeight;
        }
    }

    // ==========================================
    // 3. WebSocket 核心劫持 (物理剔除弹幕)
    // ==========================================
    const ORIGIN_WS = window.WebSocket;
    window.WebSocket = function(...args) {
        const ws = new ORIGIN_WS(...args);
        // 仅劫持包含特定路径的连接
        if (args[0]?.includes(TARGET_URL_KEY)) {
            const listeners = [];

            // 劫持 addEventListener
            ws.addEventListener = function(type, handler, options) {
                if (type === 'message') listeners.push(handler);
                else ORIGIN_WS.prototype.addEventListener.call(ws, type, handler, options);
            };

            // 监听原始消息并进行过滤
            ORIGIN_WS.prototype.addEventListener.call(ws, 'message', async (e) => {
                if (e.data instanceof ArrayBuffer || e.data instanceof Blob) {
                    try {
                        const buf = e.data instanceof Blob ? await e.data.arrayBuffer() : e.data;
                        const pf = PushFrame.decode(new Uint8Array(buf));
                        let payload = pf.payload;

                        // gzip 解压
                        if (payload[0] === 0x1f && payload[1] === 0x8b) {
                            payload = pako.inflate(payload);
                        }

                        const res = Response.decode(payload);
                        const filteredMessages = [];

                        // 遍历并处理消息
                        res.messagesList?.forEach(msg => {
                            if (msg.method === 'WebcastChatMessage') {
                                // 拦截弹幕：解码 -> 自行渲染 -> 不推给原生
                                const data = ChatMessage.decode(msg.payload);
                                injectChatMessage(data.user?.nickName || "游客", data.content);
                            } else {
                                // 拦截人数更新：更新 UI -> 允许推给原生(为了保持其他状态同步，也可选择不推)
                                if (msg.method === 'WebcastRoomUserSeqMessage') {
                                    const data = RoomUserSeqMessage.decode(msg.payload);
                                    updateOnlineCount(data.total || 0);
                                }
                                // 非弹幕消息放行
                                filteredMessages.push(msg);
                            }
                        });

                        // 重新打包 Response
                        res.messagesList = filteredMessages;
                        pf.payload = Response.encode(res).finish();
                        pf.payloadEncoding = ""; // 清除可能的编码标记
                        const newBuf = PushFrame.encode(pf).finish();

                        // 分发修改后的数据
                        const newEvent = new MessageEvent('message', {
                            data: newBuf.buffer,
                            origin: e.origin,
                            lastEventId: e.lastEventId,
                            source: e.source,
                            ports: e.ports
                        });
                        listeners.forEach(l => l(newEvent));

                    } catch(err) {
                        console.error("WsHook Error:", err);
                        // 出错时保底放行原始数据
                        listeners.forEach(l => l(e));
                    }
                } else {
                    listeners.forEach(l => l(e));
                }
            });
        }
        return ws;
    };
    Object.assign(window.WebSocket, ORIGIN_WS);

    // ==========================================
    // 4. 自动化任务逻辑 (画质、UI清理)
    // ==========================================

    function simulateKey(keyChar, keyCode) {
        const event = new KeyboardEvent('keydown', {
            key: keyChar, code: `Key${keyChar.toUpperCase()}`, keyCode: keyCode, which: keyCode, bubbles: true, cancelable: true
        });
        document.dispatchEvent(event);
    }

    function switchToHighestQuality() {
        const container = document.querySelector('[data-e2e="quality-selector"]');
        if (!container) {
            const settingsBtn = document.querySelector('[data-e2e="common-settings-area"]');
            if (settingsBtn) settingsBtn.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
            return false;
        }

        const priority = ["原画", "蓝光", "超清", "高清"];
        const items = Array.from(container.querySelectorAll('div'));

        for (let label of priority) {
            const target = items.find(el =>
                el.children.length === 0 && el.textContent.trim() === label
            );
            if (target) {
                // 简单的颜色判断，可能会随抖音更新失效，但目前有效
                const style = window.getComputedStyle(target);
                // 选中状态通常是纯白，未选中可能是灰色或半透明
                if (style.color !== 'rgb(255, 255, 255)' && style.color !== '#ffffff') {
                     target.click();
                     console.log(`[画质] 切换至: ${label}`);
                }
                return true;
            }
        }
        return false;
    }

    function removeUnwantedElements() {
        const keywords = ["赠送", "小心心", "人气票", "热气球", "棒棒糖", "粉丝团"];
        waitForElement('div', (div) => {
            const text = div.textContent.trim();
            if (keywords.some(k => text.includes(k))) {
                let container = div;
                // 向上查找以删除整行，防止误删
                for (let i = 0; i < 5; i++) {
                    if (!container) break;
                    // 特征判断，避免误删主界面
                    if (container.id === "BottomLayout" || container.dataset?.e2e === "gifts-container") {
                        container.remove();
                        break;
                    }
                    container = container.parentElement;
                }
            }
        }, true);
    }

    removeUnwantedElements();

    window.addEventListener('load', () => {
        let hasPressedB = false;
        const initInterval = setInterval(() => {
            const success = switchToHighestQuality();

            // 自动关闭屏幕弹幕层 (B键)
            const videoElement = document.querySelector('video');
            if (videoElement && !hasPressedB) {
                simulateKey('b', 66);
                hasPressedB = true;
                console.log("[系统] 尝试自动关闭原系统屏幕弹幕");
            }

            if (success && hasPressedB) {
                setTimeout(() => clearInterval(initInterval), 5000);
            }
        }, 2000);
    });

})();