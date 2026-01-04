// ==UserScript==
// @name         摸鱼物品名称
// @version      v0.0.1
// @description  摸鱼物品名称显示
// @namespace    https://github.com/fzdwx
// @author       like
// @license      MIT
// @match        https://www.moyu-idle.com/*
// @match        https://moyu-idle.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=moyu-idle.com
// @require      https://cdn.jsdelivr.net/npm/pako@2.1.0/dist/pako.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540569/%E6%91%B8%E9%B1%BC%E7%89%A9%E5%93%81%E5%90%8D%E7%A7%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/540569/%E6%91%B8%E9%B1%BC%E7%89%A9%E5%93%81%E5%90%8D%E7%A7%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';


    const globalState = {
        // 缓存的事件名称
        "eventName": "",
        // 解析消息的事件名称
        "includeEvent": [
            "inventoryUpdated",
            "dispatchInventoryInfo"
        ],
        "user": {
            "uuid": "",
            "name": "",
            "isVisitor": false,
            "firstResetPassword": false,
            "isGm": false
        }
    }

    // —— 辅助：检测压缩格式 ——
    function detectCompression(buf) {
        const b = new Uint8Array(buf);
        if (b.length >= 2) {
            if (b[0] === 0x1f && b[1] === 0x8b) return 'gzip';
            if (b[0] === 0x78 && (((b[0] << 8) | b[1]) % 31) === 0) return 'zlib';
        }
        return 'deflate';
    }

    const NativeWS = window.WebSocket;
    const OriginalWebSocket = window.WebSocket;
    fetch("/api/_auth/session", {
        headers: {
            "cookie": document.cookie
        }
    }).then(response => {
        response.json().then(data => {
            globalState.user = data.user;
        })
    })
    window.WebSocket = function (url, protocols) {
        const ws = protocols ? new OriginalWebSocket(url, protocols) : new OriginalWebSocket(url);

        // 保存当前WebSocket实例
        window.currentWS = ws;

        // —— 拦截发送的消息 ——
        const originalSend = ws.send;
        ws.send = function (data) {
            // 正常发送消息
            originalSend.call(this, data);
        };

        ws.addEventListener('message', ev => {
            if (ev.data instanceof String || typeof ev.data === 'string') {
                if (ev.data.startsWith("451-")) {
                    // 451-["battle:fullInfo:success",{"_placeholder":true,"num":0}]
                    // parse the message
                    const message = ev.data.slice(4);
                    const parsedMessage = JSON.parse(message);
                    if ((Array.isArray(parsedMessage) && parsedMessage.length > 1) === false) {
                        return
                    }
                    if (globalState.includeEvent.includes(parsedMessage[0]) === false) {
                        return
                    }
                    globalState.eventName = parsedMessage[0]
                }
            }
            if (ev.data instanceof ArrayBuffer) {
                try {
                    const format = detectCompression(ev.data);
                    let text;
                    switch (format) {
                        case 'gzip':
                            text = pako.ungzip(new Uint8Array(ev.data), {to: 'string'});
                            break;
                        case 'zlib':
                            text = pako.inflate(new Uint8Array(ev.data), {to: 'string'});
                            break;
                        default:
                            text = pako.inflateRaw(new Uint8Array(ev.data), {to: 'string'});
                    }
                    if (globalState.eventName !== "") {
                        let eventName = globalState.eventName;
                        globalState.eventName = "";
                        let event = new CustomEvent(eventName, {detail: JSON.parse(text)});
                        window.dispatchEvent(event);
                    }
                } catch (err) {
                    // 解压失败，忽略
                    console.warn('WebSocket消息解压失败:', err);
                }
            } else {
            }
        });
        return ws;
    };
    window.WebSocket.prototype = OriginalWebSocket.prototype;
    Object.getOwnPropertyNames(OriginalWebSocket).forEach(prop => {
        if (!(prop in window.WebSocket)) {
            window.WebSocket[prop] = OriginalWebSocket[prop];
        }
    });


    // Adds floating names to items in the inventory.
    async function addItemNames() {
        const items = document.querySelectorAll('.el-tabs__content .el-tooltip__trigger');
        items.forEach(item => {
            // Find the tooltip element associated with the item
            const dialog = item.nextElementSibling?.querySelector('[role="dialog"]');
            const itemName = dialog?.getAttribute('aria-label');
            if (!itemName) {
                return
            }

            // update name
            if (item.querySelector('.cus-item-name-label')) {
                item.querySelector('.cus-item-name-label').textContent = itemName
                return;
            }


            if (itemName) {
                // Create and style the name label
                const nameLabel = document.createElement('div');
                nameLabel.className = 'cus-item-name-label';
                nameLabel.textContent = itemName;
                nameLabel.style.position = 'absolute';
                nameLabel.style.left = '2px';
                nameLabel.style.top = '2px';
                nameLabel.style.fontSize = '10px';
                nameLabel.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                nameLabel.style.color = 'white';
                nameLabel.style.padding = '1px 3px';
                nameLabel.style.borderRadius = '3px';

                // Add the label to the item container
                item.appendChild(nameLabel);
                item.style.position = 'relative'; // Ensure proper positioning
            }
        });
    }

    let listener = function (ev) {
        setTimeout(() => {
            addItemNames()
        }, 50)
    };
    window.addEventListener("inventoryUpdated", listener)
    window.addEventListener('dispatchInventoryInfo', listener)
    window.addEventListener('load', listener)
    window.addEventListener('click', ()=>{
        setTimeout(()=>{
            listener()
        },100)
    })

})();
