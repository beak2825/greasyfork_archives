// ==UserScript==
// @name         直播 - 抖音直播终极增强
// @namespace    http://tampermonkey.net/
// @version      3.0
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

    console.log("🔥 v25.0 脚本已注入：弹幕物理拦截模式已开启。");

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
        const nativeCounter = document.querySelector('.ClV317pr[data-e2e="live-room-audience"]');
        if (nativeCounter) nativeCounter.innerText = count;
    }

    function injectChatMessage(userName, content) {
        const listContainer = document.querySelector('.webcast-chatroom___list div[style*="transform: translateY"]');
        const chatWrapper = document.querySelector('.S3vewJ9R.Ij9il8sm.webcast-chatroom___list');
        if (!listContainer || !chatWrapper) return;

        const messageWrapper = document.createElement('div');
        messageWrapper.innerHTML = `
            <div class="webcast-chatroom___item">
                <div class="Cl4EfhXg">
                    <div class="NkS2Invn">
                        <span style="color: #FFA500; font-weight: bold;">[弹幕:]</span>
                        <span style="color: #8ce1ff;">${userName}：</span>
                        <span style="color: #fff;">${content}</span>
                    </div>
                </div>
            </div>
        `;
        listContainer.appendChild(messageWrapper);
        chatWrapper.scrollTop = chatWrapper.scrollHeight;
    }

    // ==========================================
    // 3. WebSocket 核心劫持 (物理剔除弹幕)
    // ==========================================
    const ORIGIN_WS = window.WebSocket;
    window.WebSocket = function(...args) {
        const ws = new ORIGIN_WS(...args);
        if (args[0]?.includes(TARGET_URL_KEY)) {
            const listeners = [];
            ws.addEventListener = function(type, handler, options) {
                if (type === 'message') listeners.push(handler);
                else ORIGIN_WS.prototype.addEventListener.call(ws, type, handler, options);
            };

            ORIGIN_WS.prototype.addEventListener.call(ws, 'message', async (e) => {
                if (e.data instanceof ArrayBuffer || e.data instanceof Blob) {
                    try {
                        const buf = e.data instanceof Blob ? await e.data.arrayBuffer() : e.data;
                        const pf = PushFrame.decode(new Uint8Array(buf));
                        let payload = pf.payload;

                        // 解压数据
                        if (payload[0] === 0x1f && payload[1] === 0x8b) {
                            payload = pako.inflate(payload);
                        }

                        const res = Response.decode(payload);
                        const filteredMessages = [];

                        // 遍历消息列表：自己渲染弹幕，并从原生列表中删除
                        res.messagesList?.forEach(msg => {
                            if (msg.method === 'WebcastChatMessage') {
                                const data = ChatMessage.decode(msg.payload);
                                injectChatMessage(data.user?.nickName || "游客", data.content);
                                // 此处不将 msg 放入 filteredMessages，实现原生拦截
                            } else {
                                if (msg.method === 'WebcastRoomUserSeqMessage') {
                                    const data = RoomUserSeqMessage.decode(msg.payload);
                                    updateOnlineCount(data.total || 0);
                                }
                                filteredMessages.push(msg); // 非弹幕消息保留
                            }
                        });

                        // 重新打包：伪造一份没有弹幕的 Response 给抖音原生代码
                        res.messagesList = filteredMessages;
                        pf.payload = Response.encode(res).finish();
                        pf.payloadEncoding = "";
                        const newBuf = PushFrame.encode(pf).finish();

                        // 分发伪造后的事件
                        const newEvent = new MessageEvent('message', {
                            data: newBuf.buffer,
                            origin: e.origin,
                            lastEventId: e.lastEventId,
                            source: e.source,
                            ports: e.ports
                        });
                        listeners.forEach(l => l(newEvent));

                    } catch(err) {
                        // 发生错误时保底转发原始数据，防止直播间卡死
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
        const selectors = ['.J1oLRAwo .xMYYJi25', '.RC5nBmmY .xJMJ5DRo'];
        const settingsBtn = document.querySelector('[data-e2e="common-settings-area"]');
        if (settingsBtn) settingsBtn.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));

        for (let sel of selectors) {
            const items = Array.from(document.querySelectorAll(sel)).map(x => ({ text: x.textContent.trim(), el: x }));
            const priority = ["原画", "蓝光", "超清", "高清"];
            for (let p of priority) {
                const target = items.find(i => i.text.includes(p));
                if (target) {
                    const isCurrent = target.el.classList.contains('active') || target.el.getAttribute('aria-checked') === 'true';
                    if (!isCurrent) {
                        target.el.click();
                        console.log("[画质] 已切换到:", target.text);
                    }
                    return true;
                }
            }
        }
        return false;
    }

    function removeUnwantedElements() {
        const keywords = ["赠送", "小心心", "人气票", "热气球", "棒棒糖"];
        waitForElement('div', (div) => {
            const text = div.textContent.trim();
            if (keywords.some(k => text.includes(k))) {
                let container = div;
                for (let i = 0; i < 5; i++) {
                    if (!container || container.id === "BottomLayout" || container.dataset?.e2e === "gifts-container") {
                        container?.remove();
                        break;
                    }
                    container = container.parentElement;
                }
            }
        }, true);
    }

    // 启动初始化
    removeUnwantedElements();

    window.addEventListener('load', () => {
        let hasPressedB = false;
        const initInterval = setInterval(() => {
            switchToHighestQuality();

            // 自动关闭屏幕弹幕层 (B键)
            const videoElement = document.querySelector('video');
            if (videoElement && !hasPressedB) {
                simulateKey('b', 66);
                hasPressedB = true;
                console.log("[系统] 已自动按 B 键关闭原系统屏幕弹幕");
            }

            if (hasPressedB) {
                setTimeout(() => clearInterval(initInterval), 5000);
            }
        }, 2000);
    });

})();