// ==UserScript==
// @name         rancher log collect [rancher日志收集]
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  用于收集rancher中pod的日志
// @author       maple.
// @match        https://rancher.indata.cc/dashboard/*
// @icon         https://www.rancher.com/assets/img/favicon.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/513072/rancher%20log%20collect%20%5Brancher%E6%97%A5%E5%BF%97%E6%94%B6%E9%9B%86%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/513072/rancher%20log%20collect%20%5Brancher%E6%97%A5%E5%BF%97%E6%94%B6%E9%9B%86%5D.meta.js
// ==/UserScript==


(function () {
    'use strict';

    // 需要hook的ws包含url
    const TARGET_URL = 'exec';
    const originalWebSocket = window.WebSocket;

    let wsIdIncr = 0;

    /**
     * rancher exec ws中，发送消息前缀是0; 接受消息前缀是1
     */
    class WebSocketProxy extends originalWebSocket {

        wsId = 0;
        url = '';

        constructor(...args) {
            super(...args);

            // 检查是否需要hook这个WebSocket连接
            if (!this.shouldHook(args[0])) {
                return this;
            }

            this.wsId = ++wsIdIncr;
            this.shellExt = new ShellExt()
            this.hookMain()
        }

        shouldHook(url) {
            this.url = url;
            return typeof TARGET_URL === 'string'
                ? url.includes(TARGET_URL)
                : TARGET_URL.test(url);
        }

        hookMain() {
            console.log(`Hook-WS [${this.wsId}]:`, this.url);
            this.hookOnMessage(this.onMessage.bind(this));
            this.hookSend(this.onSend.bind(this));
        }

        onMessage(event) {
            // console.log('接收:', event.data);
            if (!this.shellExt.openCollectLog()) {
                return;
            }

            // 过滤回车
            if (event.data === '1DQo=') {
                return;
            }

            let base64Result = atob(event.data.substring(1));

            // 过滤：]
            if (base64Result.startsWith("]0;") && base64Result.includes("")) {
                console.log("过滤数据", base64Result)
                return;
            }
            // 替换颜色
            let result1 = base64Result.replaceAll(/\[\d+;*\d+m/g, "");
            // 查找字符串前缀颜色
            let result2 = result1.replaceAll(/\[K/g, "");
            let result3 = result2.replaceAll(/\[m/g, "");
            // 解码中文base64结果
            let result = this.decodeBase64(result3)
            // console.log("解析数据\n", result)
            this.shellExt.collectResult(result)
        }

        decodeBase64(binaryString) {
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            // 将二进制数据解码为文本
            return new TextDecoder("utf-8").decode(bytes);
        }

        onSend(data) {
            // console.log('发送:', data);
            // 发送回车，从等待采集变更为采集中
            if (this.shellExt.status === 1 && data === "0DQ==") {
                this.shellExt.changeBtnStatus()
            }
        }

        hookOnMessage(onMessage) {
            // 保存原始的onmessage
            const originalOnMessage = this.onmessage;
            // Hook onmessage
            Object.defineProperty(this, 'onmessage', {
                set: function (fn) {
                    return this.addEventListener('message', function (event) {
                        onMessage(event);
                        // 执行原始的消息处理
                        fn.call(this, event);
                    });
                },
                get: function () {
                    return originalOnMessage;
                }
            });
        }

        hookSend(onSend) {
            // Hook send
            const originalSend = this.send;
            this.send = function (data) {
                onSend(data)
                // 执行原始的发送操作
                return originalSend.call(this, data);
            };
        }
    }

    class ShellExt {

        collectLogBtn = null
        status = 0;
        result = "";

        constructor() {
            this.renderCollectBtn()
        }


        openCollectLog() {
            return this.status === 2
        }

        renderCollectBtn() {
            let btnCssText = "display: inline-block;border-radius: 4px;background: #e5f8f8;color: #00a6a7; text-decoration: none;padding: 6px 12px;cursor: pointer";
            let collectLogBtn = DOMApi.createTag("div", "采集日志", btnCssText);
            collectLogBtn.classList.add("collect-log-btn");
            this.collectLogBtn = collectLogBtn
            DOMApi.eventListener(collectLogBtn, "click", () => {
                this.collectLogHandler()
            })

            setTimeout(() => {
                let bottomTitleList = document.querySelectorAll(".title.clearfix");
                bottomTitleList.forEach(bottomTitle => {
                    let collectBtn = bottomTitle.querySelector(".collect-log-btn");
                    if (collectBtn) {
                        return;
                    }
                    bottomTitle.append(this.collectLogBtn)
                })
            }, 500)
        }

        collectLogHandler() {
            if (this.status === 2) {
                this.copyToClipboard(this.result)
                this.result = ''
            }
            this.changeBtnStatus()
        }

        collectResult(segmentStr) {
            if (!this.openCollectLog()) {
                return;
            }

            this.result += segmentStr;
        }

        changeBtnStatus() {
            // 未开启
            if (this.status === 0) {
                this.collectLogBtn.innerHTML = "等待回车开始采集"
                this.collectLogBtn.style.backgroundColor = "rgb(251,224,224)";
                this.collectLogBtn.style.color = "rgb(191,110,75)";
                this.status = 1
                // 等待采集
            } else if (this.status === 1) {
                this.collectLogBtn.innerHTML = "采集中"
                this.collectLogBtn.style.backgroundColor = "rgb(184,53,53)";
                this.collectLogBtn.style.color = "rgb(57,40,40)";
                this.status = 2
                // 采集中
            } else if (this.status === 2) {
                this.collectLogBtn.innerHTML = "采集日志"
                this.collectLogBtn.style.backgroundColor = "rgb(215,254,195)";
                this.collectLogBtn.style.color = "rgb(2,180,6)";
                this.status = 0
            }
        }

        copyToClipboard(text) {
            if (navigator.clipboard) {
                navigator.clipboard.writeText(text).then(() => {
                    console.log('Text copied to clipboard');
                    this.showMessage("日志内容已经复制到剪切板", 2000)
                }).catch(err => {
                    console.error('Failed to copy text to clipboard', err);
                });
            } else {
                console.log('Clipboard API not available');
            }
        }

        showMessage(text, duration) {
            // 创建一个div元素作为消息提示
            let message = document.createElement('div');
            message.style.position = 'fixed';
            message.style.top = '15%';
            message.style.left = '50%';
            message.style.transform = 'translate(-50%, -50%)';
            message.style.padding = '10px';
            message.style.border = '1px solid #ccc';
            message.style.backgroundColor = '#e1dcdc';
            message.style.zIndex = '1000';
            message.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
            message.style.borderRadius = '5px';
            message.style.fontSize = '16px';
            message.style.fontWeight = 'bold';
            message.style.color = '#ba6868';
            message.style.textAlign = 'center';
            message.style.maxWidth = '300px';
            message.style.boxSizing = 'border-box';
            message.style.visibility = 'hidden'; // 初始不可见

            // 设置消息文本
            message.textContent = text;

            // 将消息元素添加到body中
            document.body.appendChild(message);

            // 显示消息
            message.style.visibility = 'visible';

            // 指定时间后消失
            setTimeout(function () {
                message.style.visibility = 'hidden';
                setTimeout(function () {
                    document.body.removeChild(message);
                }, 300); // 等待300毫秒后移除元素，以确保过渡效果
            }, duration);
        }
    }

    class DOMApi {

        static createTag(tag, name, style) {
            let htmlTag = document.createElement(tag);
            if (name) {
                htmlTag.innerHTML = name;
            }
            if (style) {
                htmlTag.style.cssText = style;
            }
            return htmlTag;
        }

        static eventListener(tag, eventType, func) {
            tag.addEventListener(eventType, func)
        }
    }

    window.WebSocket = WebSocketProxy;
})();