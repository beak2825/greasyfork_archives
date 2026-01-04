// ==UserScript==
// @name         kc.zhixueyun.com multi-open
// @namespace    https://tampermonkey.net/
// @version      0.1.9
// @author       none
// @license      MIT
// @description  kc.zhixueyun.com multi-open (WebSocket with wsHook and BroadcastChannel disabled)
// @match        *://kc.zhixueyun.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/504351/kczhixueyuncom%20multi-open.user.js
// @updateURL https://update.greasyfork.org/scripts/504351/kczhixueyuncom%20multi-open.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 禁用 BroadcastChannel
    window.BroadcastChannel = class MockBroadcastChannel {
        constructor(channel) {
            console.log('Mock BroadcastChannel created for channel:', channel);
        }
        postMessage(message) {
            console.log('Mock BroadcastChannel postMessage:', message);
        }
        addEventListener() {}
        removeEventListener() {}
        close() {}
    };

    // wsHook - WebSocket 钩子
    var wsHook = {
        before: function(data, url, wsObject) {
            // 在发送消息之前拦截
            console.log('WS发送:', data);
            return data;
        },
        after: function(messageEvent, url, wsObject) {
            // 在接收消息之后拦截
            console.log('WS接收:', messageEvent.data);
            
            // 检查消息是否包含 1002、1003 或 匹配 数字/course-study 模式
            if (typeof messageEvent.data === 'string' && 
                (messageEvent.data.includes('1002') || 
                 messageEvent.data.includes('1003') || 
                 /\d+\/course-study/.test(messageEvent.data))) {
                
                console.log('拦截到多客户端检测消息或课程学习消息');
                // 返回固定消息 '3'
                return {
                    data: '3',
                    origin: messageEvent.origin,
                    lastEventId: messageEvent.lastEventId,
                    source: messageEvent.source,
                    ports: messageEvent.ports,
                };
            }
            
            return messageEvent;
        }
    };

    // 重写 WebSocket
    window.WebSocket = new Proxy(window.WebSocket, {
        construct: function(target, args) {
            const ws = new target(...args);
            
            ws.addEventListener('message', function(event) {
                const modifiedEvent = wsHook.after(event, args[0], ws);
                if (modifiedEvent) {
                    Object.defineProperty(event, 'data', {value: modifiedEvent.data});
                } else {
                    event.stopImmediatePropagation();
                }
            });

            const oldSend = ws.send;
            ws.send = function(data) {
                const modifiedData = wsHook.before(data, args[0], ws);
                if (modifiedData) {
                    oldSend.call(this, modifiedData);
                }
            };

            return ws;
        }
    });

    // 覆盖可能的多开检测函数
    window.addEventListener('load', function() {
        if (window.WS && window.WS.multipleClientStudy) {
            window.WS.multipleClientStudy = function() {
                console.log('多客户端学习检测已绕过');
            };
        }

        if (window.WS && window.WS.otherClientStudy) {
            window.WS.otherClientStudy = function() {
                console.log('其他客户端学习提醒已绕过');
            };
        }

        console.log('kc.zhixueyun.com 多开脚本已加载');
    });
})();