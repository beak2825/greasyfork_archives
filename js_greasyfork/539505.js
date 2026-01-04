// ==UserScript==
// @name         瓶子说 - 匿名聊天无限制 (手动修复版)
// @namespace    http://tampermonkey.net/
// @version      1.9.0
// @description  【手动修复版】修复了消息仅在本地显示而对方收不到的BUG。点击按钮即可完美破解。
// @author       GPT-4 & Claude-3
// @match        *://*.pingzishuo.com/*
// @match        *://*.shushubuyue.net/*
// @match        *://*.unclenoway.net/*
// @match        *://*.chuangzhiwl.top/*
// @match        *://*.jnhotu.cn/*
// @match        *://*.whyhjkj.cn/*
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/539505/%E7%93%B6%E5%AD%90%E8%AF%B4%20-%20%E5%8C%BF%E5%90%8D%E8%81%8A%E5%A4%A9%E6%97%A0%E9%99%90%E5%88%B6%20%28%E6%89%8B%E5%8A%A8%E4%BF%AE%E5%A4%8D%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/539505/%E7%93%B6%E5%AD%90%E8%AF%B4%20-%20%E5%8C%BF%E5%90%8D%E8%81%8A%E5%A4%A9%E6%97%A0%E9%99%90%E5%88%B6%20%28%E6%89%8B%E5%8A%A8%E4%BF%AE%E5%A4%8D%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('瓶子说无限制脚本 v1.9.0: 启动，等待用户手动触发...');

    function applyPatch() {
        const chatElement = document.getElementById('chat');
        const chatVm = chatElement ? chatElement.__vue__ : null;

        if (chatVm && typeof chatVm.msgSend === 'function') {
            if (chatVm.msgSend.isPatched) {
                console.log('瓶子说无限制脚本: 已经破解过了。');
                return true;
            }

            const newMsgSend = function() {
                if (!chatVm.msgInput.trim()) {
                    $.toast("不可发送空消息", 500);
                    return;
                }

                const msgInput = chatVm.msgInput.trim();
                chatVm.msgInput = "";

                const messageOptions = {
                    emitPartner: true,
                    animate: store.get("animate") || undefined,
                    chatId: chatVm.chatId,
                    updateInfo: 0 === chatVm.sendCounter ? {
                        gender: chatVm.gender,
                        age: store.get("ageNew"),
                        labels: store.get("labels") && store.get("labels").filter(t => t.chosen),
                        province: chatVm.isShowLocation && chatVm.province || ""
                    } : null
                };

                // 本地显示
                chatVm.appendMessage(msgInput, chatVm.Config.MSG_TYPE_SELF, messageOptions);

                // 【已修复】网络发送
                if (chatVm.sockets && typeof chatVm.sockets.emit === 'function') {
                     chatVm.sockets.emit("clientMessage", {
                        content: msgInput,
                        options: messageOptions
                    });
                } else {
                    console.error('瓶子说无限制脚本: socket 对象或 emit 方法未找到，消息无法发送到网络。');
                }

                // 更新状态
                chatVm.sendCounter++;
                chatVm.sendCounterThisSession++;
                chatVm.isWatchSamePosition = true;
                chatVm.msgIndex = 0;
                if (window.popupEmoji) window.popupEmoji.hide();
            };

            newMsgSend.isPatched = true;
            chatVm.msgSend = newMsgSend;

            console.log('瓶子说无限制脚本: 注入成功！发送限制已移除。');
            return true;
        }

        console.error('瓶子说无限制脚本: 未找到目标函数，请确保已进入聊天界面。');
        return false;
    }

    function createPatchButton() {
        if (document.getElementById('patch-button')) return;
        GM_addStyle(`
            #patch-button { position: fixed; bottom: 80px; right: 20px; z-index: 99999; padding: 8px 12px; background-color: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 14px; box-shadow: 0 2px 5px rgba(0,0,0,0.2); }
            #patch-button:hover { background-color: #0056b3; }
        `);
        const button = document.createElement('button');
        button.id = 'patch-button';
        button.textContent = '启动无限制';
        button.addEventListener('click', () => {
            if (applyPatch()) {
                button.textContent = '破解成功 ✓';
                button.style.backgroundColor = '#28a745';
                setTimeout(() => button.remove(), 2000);
            } else {
                button.textContent = '破解失败 ✗ 请先开始聊天';
                button.style.backgroundColor = '#dc3545';
            }
        });
        document.body.appendChild(button);
        console.log('瓶子说无限制脚本: 触发按钮已创建。');
    }

    createPatchButton();

})();