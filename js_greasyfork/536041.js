// ==UserScript==
// @name         [银河奶牛] 法外之地
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  使用在线聊天室嵌入牛牛聊天室，不装插件无法看到消息，兼容聊天图片插件
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @grant        GM_xmlhttpRequest
// @connect      api.lolicon.app
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536041/%5B%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%5D%20%E6%B3%95%E5%A4%96%E4%B9%8B%E5%9C%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/536041/%5B%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%5D%20%E6%B3%95%E5%A4%96%E4%B9%8B%E5%9C%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const channel = "milkywayidle";
    let ws = null;
    let savedStyle = null; // 保存提取的样式

    // 自动获取当前用户名（用于作为 Hack.Chat 的 nick）
    function getCurrentUsername() {
        const nameEl = document.querySelector('.CharacterName_name__1amXp[data-name]');
        if (nameEl) {
            return nameEl.getAttribute('data-name') || "Anon";
        }
        return "Anon";
    }

    // 从聊天记录中提取当前用户的样式
    function extractUserStyle(username) {
        const messages = document.querySelectorAll('.ChatMessage_chatMessage__2wev4');
        for (const msg of messages) {
            const nameDiv = msg.querySelector('.CharacterName_name__1amXp[data-name]');
            if (!nameDiv) continue;
            const name = nameDiv.getAttribute('data-name');
            if (name !== username) continue;

            const colorClass = [...nameDiv.classList].find(c => c.startsWith('CharacterName_') && c.includes('_'));
            const icons = msg.querySelectorAll('.CharacterName_chatIcon__22lxV use');
            const iconList = Array.from(icons).map(use => use.getAttribute('href')?.split('#')[1]).filter(Boolean);

            return {
                color: colorClass || null,
                icon: iconList[1] || null,
                soecIcon: iconList[0] || null
            };
        }
        return null;
    }

    // 尝试注入消息到聊天室
    function injectHackMessage(nick, text) {
        // if (!savedStyle) {
        //     const style = extractUserStyle(nick);
        //     if (style) {
        //         savedStyle = style;
        //         console.log("✨ Saved style:", savedStyle);
        //     } else {
        //         console.log("⚠️ No style found for", nick);
        //     }
        // }
        const unpack = unpackMessage(text);
        if (!unpack) return null

        // 禁止修改名字装扮，否则可能会引起管理封禁和插件停用，强制装扮的目的是为了鉴别聊天来源，以免受骗！！
        const fakeMessage = {
            id: 'hc_' + Date.now(),
            chan: unpack.chan,
            cId: 'inject_' + Date.now(),
            sName: nick,
            m: unpack.text,
            t: Date.now(),
            specIcon: '/chat_icons/admin',
            // icon: '/chat_icons/enhancing',
            // color: '/chat_color/iron',
            color: '/chat_color/yellow',
            // gm: 'standard'
        };

        const exampleChat = document.querySelector('.ChatMessage_chatMessage__2wev4');
        if (!exampleChat) {
            if (ws && ws.readyState === WebSocket.OPEN) {
                ws.close();
                console.log("[HackChat] Force disconnection from game.");
            }
            return console.warn("❌ Chat message DOM not found.");
        };

        const fiberKey = Object.keys(exampleChat).find(k => k.startsWith("__reactFiber$"));
        if (!fiberKey) return console.warn("❌ React Fiber key not found.");

        const fiberNode = exampleChat[fiberKey];

        function findHandler(fiber) {
            while (fiber) {
                const instance = fiber.stateNode;
                if (instance && typeof instance.handleMessageChatMessageReceived === "function") {
                    return instance;
                }
                fiber = fiber.return;
            }
            return null;
        }


        const handler = findHandler(fiberNode);

        if (handler) {
            handler.handleMessageChatMessageReceived({
                type: "chat_message_received",
                message: fakeMessage
            });
            // console.log("✅ Injected:", fakeMessage);
            // 标记样式逻辑
            setTimeout(() => {
                const timestamp = `[${new Date(fakeMessage.t).toTimeString().slice(0, 8)}]`;
                const timestamps = document.querySelectorAll('.ChatMessage_timestamp__1iRZO');
                for (const ts of timestamps) {
                    if (ts.textContent.trim() === timestamp) {
                        const msgEl = ts.closest('.ChatMessage_chatMessage__2wev4');
                        if (!msgEl) continue;

                        const nameEl = msgEl.querySelector('.CharacterName_name__1amXp');
                        if (nameEl?.getAttribute('data-name') === nick) {
                            msgEl.classList.add('hackchat-message');
                            break;
                        }
                    }
                }
            }, 200);
        } else {
            console.warn("❌ Chat handler not found.");
        }

    }
    function injectCustomCSS() {
        const style = document.createElement("style");
        style.textContent = `
    .hackchat-message {
        color:rgb(252, 199, 120) !important;
    }
    `;
        document.head.appendChild(style);
    }

    function getCurrentChannel() {
        // 获取频道
        function findInput(fiber) {
            while (fiber) {
                const instance = fiber.stateNode;
                if (instance && typeof instance.renderChatInput === "function") {
                    return instance;
                }
                fiber = fiber.return;
            }
            return null;
        }

        const exampleChat = document.querySelector('.ChatMessage_chatMessage__2wev4');
        if (!exampleChat) {
            if (ws && ws.readyState === WebSocket.OPEN) {
                ws.close();
                console.log("[HackChat] Force disconnection from game.");
            }
            return console.warn("❌ Chat message DOM not found.");
        };

        const fiberKey = Object.keys(exampleChat).find(k => k.startsWith("__reactFiber$"));
        if (!fiberKey) return console.warn("❌ React Fiber key not found.");

        const fiberNode = exampleChat[fiberKey];
        const inp = findInput(fiberNode)
        let chan = '/chat_channel_types/chinese';
        // 试图打印频道信息
        if (inp?.state?.channelTypeHrid) {
            // console.log("📌 当前频道 channelTypeHrid:", inp.state.channelTypeHrid);
            chan = inp.state.channelTypeHrid;
        }
        return chan
    }

    function packMessage(text, chan) {
        return `::${chan}::${text}`
    }

    function unpackMessage(packed) {
        const match = packed.match(/^::(.*?)::([\s\S]*)$/);
        if (!match) return null;
        return {
            chan: match[1],
            text: match[2]
        };
    }


    // 插入调试输入窗口
    function addDebugUI() {
        const panel = document.createElement("div");
        panel.style.position = "fixed";
        panel.style.bottom = "10px";
        panel.style.right = "10px";
        panel.style.zIndex = 9999;
        panel.style.background = "#222";
        panel.style.padding = "10px";
        panel.style.borderRadius = "8px";
        panel.style.color = "#fff";
        panel.style.fontSize = "14px";

        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = "Send to hack.chat";
        input.style.marginRight = "5px";
        input.style.padding = "4px";

        const btn = document.createElement("button");
        btn.innerText = "Send";
        btn.onclick = () => {
            const val = input.value.trim();
            const chan = getCurrentChannel();

            if (val && ws && ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ cmd: "chat", text: packMessage(val, chan)}));
                input.value = "";
            }
        };

        panel.appendChild(input);
        panel.appendChild(btn);
        document.body.appendChild(panel);
    }

    function waitForReadyStateAndStart() {
        const checkReady = setInterval(() => {
            const nick = getCurrentUsername();
            const chatReady = document.querySelector('.ChatMessage_chatMessage__2wev4');

            if (nick !== "Anon" && chatReady) {
                injectCustomCSS();
                clearInterval(checkReady);
                console.log("[HackChat] Found username:", nick);
                connectToHackChat(nick);
                // addDebugUI();
                hookGameSocket();
            }
        }, 1000);
    }

    function connectToHackChat(nick) {
        ws = new WebSocket("wss://hack.chat/chat-ws");

        ws.onopen = () => {
            ws.send(JSON.stringify({ cmd: "join", channel, nick }));
            console.log("[HackChat] Connected and joined:", channel, "as", nick);
            addHackChatTextInput();
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.cmd === "chat") {
                const sender = data.nick;
                const text = data.text;
                injectHackMessage(sender, text);
            }
        };

        ws.onerror = (e) => {
            console.error("[HackChat] WebSocket error:", e);
        };

        ws.onclose = () => {
            console.warn("[HackChat] Disconnected.");
        };
    }

        // 监听游戏主 WebSocket 关闭并同步关闭 HackChat 的连接
    function hookGameSocket() {
        const knownSockets = new Set();
        knownSockets.add(ws);
        const originalSend = WebSocket.prototype.send;
        WebSocket.prototype.send = function(...args) {
            // 记录所有可能是游戏的 socket
            if (!knownSockets.has(this)) {
                knownSockets.add(this);

                const originalClose = this.onclose;
                this.onclose = function(event) {
                    console.log("[Game] WebSocket closed, syncing...");
                    if (typeof originalClose === 'function') originalClose.call(this, event);
                    if (ws && ws.readyState === WebSocket.OPEN) {
                        ws.close();
                        console.log("[HackChat] Synced disconnection from game.");
                    }
                };
            }

            return originalSend.apply(this, args);
        };

        console.log("[HackChat] hookGameSocket: Hooked WebSocket.prototype.send.");
    }

    // 添加新的文字输入框（仅在 WS 连接成功后）
    function addHackChatTextInput() {
        const chatInput = document.querySelector('.Chat_chatInputContainer__2euR8');
        if (!chatInput) {
            console.warn("⚠️ Chat input not found, retrying...");
            setTimeout(addHackChatTextInput, 1000);
            return;
        }

        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.justifyContent = 'flex-end';
        container.style.marginBottom = '5px';

        const textInput = document.createElement('input');
        textInput.type = 'text';
        textInput.placeholder = '输入消息...';
        textInput.style.width = '50%';
        textInput.style.padding = '4px';
        textInput.style.marginRight = '5px';

        const sendBtn = document.createElement('button');
        sendBtn.innerText = '发送';
        sendBtn.onclick = () => {
            const val = textInput.value.trim();
            if (val && ws && ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ cmd: "chat", text: packMessage(val, getCurrentChannel()) }));
                // console.log("📤 Sent to Hack.Chat:", val);
                textInput.value = "";
            }
        };
        // 监听回车键发送到 hack.chat
        textInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                sendBtn.click();
            }
        });

        // 随机图片
        const fetchBtn = document.createElement('button');
        fetchBtn.innerText = 'setu';
        fetchBtn.style.marginRight = '5px';
        fetchBtn.onclick = () => {
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://api.lolicon.app/setu/v2",
                responseType: "json",
                onload: function (res) {
                    const json = res.response;
                    const imgUrl = json?.data?.[0]?.urls?.original;

                    if (!imgUrl) {
                        console.warn("⚠️ 没找到图片链接");
                        return;
                    }

                    textInput.value = imgUrl;
                    // console.log("✅ 获取到图片链接:", imgUrl);
                },
                onerror: function (err) {
                    console.error("❌ 获取图片失败:", err);
                }
            });
        };



        container.appendChild(fetchBtn); // 插入到输入框前
        container.appendChild(textInput);
        container.appendChild(sendBtn);

        const inputContainer = document.querySelector('.Chat_chatInputContainer__2euR8');
        if (inputContainer) {
            inputContainer.parentNode.insertBefore(container, inputContainer);
            console.log("💬 Hack.Chat input inserted above game chat.");
        }
    }




    window.addEventListener("load", waitForReadyStateAndStart);
})();