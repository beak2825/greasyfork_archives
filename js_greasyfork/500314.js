// ==UserScript==
// @name         ChatGPT Ctrl+Enter 以發送
// @name:en      ChatGPT Ctrl+Enter to Send
// @name:zh-CN   ChatGPT Ctrl+Enter 以发送
// @name:ja      ChatGPT Ctrl+Enter で送信
// @namespace    http://tampermonkey.net/
// @version      9.8.1
// @description  在 ChatGPT 網頁按下 Ctrl+Enter 或 Cmd+Enter 發送訊息，單獨按 Enter 只換行
// @description:en  Press Ctrl+Enter or Cmd+Enter to send a message on the ChatGPT webpage. Pressing Enter alone will only insert a line break.
// @description:zh-cn 在 ChatGPT 网页按下 Ctrl+Enter 或 Cmd+Enter 发送消息，单独按 Enter 只换行
// @description:ja ChatGPTのウェブページでCtrl+EnterまたはCmd+Enterを押してメッセージを送信します。Enterキーだけを押すと改行されます
// @author       SoizoKtantas & ChatGPT
// @match        https://chatgpt.com/*
// @icon         https://www.google.com/s2/favicons?domain=openai.com
// @license      Apache License 2.0
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://update.greasyfork.org/scripts/411512/864854/GM_createMenu.js
// @downloadURL https://update.greasyfork.org/scripts/500314/ChatGPT%20Ctrl%2BEnter%20%E4%BB%A5%E7%99%BC%E9%80%81.user.js
// @updateURL https://update.greasyfork.org/scripts/500314/ChatGPT%20Ctrl%2BEnter%20%E4%BB%A5%E7%99%BC%E9%80%81.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // 定義語言
    const languages = {
        "zh-TW": {
            enterEnabled: "Enter 換行啓用中",
            enterDisabled: "Enter 換行停用中",
            ctrlEnterEnabled: "Ctrl+Enter 啓用中",
            ctrlEnterDisabled: "Ctrl+Enter 停用中",
            enterEnabledAlert: "Enter 換行已啓用",
            enterDisabledAlert: "Enter 換行已停用",
            ctrlEnterEnabledAlert: "Ctrl+Enter 發送已啓用",
            ctrlEnterDisabledAlert: "Ctrl+Enter 發送已停用",
        },
        "zh-CN": {
            enterEnabled: "Enter 换行启用中",
            enterDisabled: "Enter 换行停用中",
            ctrlEnterEnabled: "Ctrl+Enter 启用中",
            ctrlEnterDisabled: "Ctrl+Enter 停用中",
            enterEnabledAlert: "Enter 换行已启用",
            enterDisabledAlert: "Enter 换行已停用",
            ctrlEnterEnabledAlert: "Ctrl+Enter 发送已启用",
            ctrlEnterDisabledAlert: "Ctrl+Enter 发送已停用",
        },
        en: {
            enterEnabled: "Enter for newline enabled",
            enterDisabled: "Enter for newline disabled",
            ctrlEnterEnabled: "Ctrl+Enter to send enabled",
            ctrlEnterDisabled: "Ctrl+Enter to send disabled",
            enterEnabledAlert: "Enter for newline enabled",
            enterDisabledAlert: "Enter for newline disabled",
            ctrlEnterEnabledAlert: "Ctrl+Enter to send enabled",
            ctrlEnterDisabledAlert: "Ctrl+Enter to send disabled",
        },
        ja: {
            enterEnabled: "Enter 改行が有効",
            enterDisabled: "Enter 改行が無効",
            ctrlEnterEnabled: "Ctrl+Enter 送信が有効",
            ctrlEnterDisabled: "Ctrl+Enter 送信が無効",
            enterEnabledAlert: "Enter 改行が有効になりました",
            enterDisabledAlert: "Enter 改行が無効になりました",
            ctrlEnterEnabledAlert: "Ctrl+Enter 送信が有効になりました",
            ctrlEnterDisabledAlert: "Ctrl+Enter 送信が無効になりました",
        },
    };

    // 獲取語言
    const userLang = navigator.language || navigator.userLanguage;
    const lang = languages[userLang] || languages["zh-TW"];

    // 初始化開關狀態
    let isEnterEnabled = GM_getValue("isEnterEnabled", true);
    let isCtrlEnterEnabled = GM_getValue("isCtrlEnterEnabled", true);

    // 定義開關菜單
    GM_createMenu.add([
        {
            on: {
                name: lang.enterEnabled,
                callback: function () {
                    isEnterEnabled = true;
                    GM_setValue("isEnterEnabled", true);
                    alert(lang.enterEnabledAlert);
                },
            },
            off: {
                name: lang.enterDisabled,
                callback: function () {
                    isEnterEnabled = false;
                    GM_setValue("isEnterEnabled", false);
                    alert(lang.enterDisabledAlert);
                },
            },
            load: function (menuStatus) {
                if (menuStatus === "on") {
                    isEnterEnabled = true;
                } else {
                    isEnterEnabled = false;
                }
            },
            default: isEnterEnabled,
        },
        {
            on: {
                name: lang.ctrlEnterEnabled,
                callback: function () {
                    isCtrlEnterEnabled = true;
                    GM_setValue("isCtrlEnterEnabled", true);
                },
            },
            off: {
                name: lang.ctrlEnterDisabled,
                callback: function () {
                    isCtrlEnterEnabled = false;
                    GM_setValue("isCtrlEnterEnabled", false);
                },
            },
            load: function (menuStatus) {
                if (menuStatus === "on") {
                    isCtrlEnterEnabled = true;
                } else {
                    isCtrlEnterEnabled = false;
                }
            },
            default: isCtrlEnterEnabled,
        },
    ]);
    GM_createMenu.create({ storage: true });

    // 添加事件監聽器到文檔，使用 capture 階段
    document.addEventListener(
        "keydown",
        function (e) {
            // 獲取焦點元素
            const activeElement = document.activeElement;

            // 檢查焦點是否在 #prompt-textarea 上
            if (activeElement && activeElement.id === "prompt-textarea") {
                if (e.key === "Enter") {
                    if (!isCtrlEnterEnabled && (e.ctrlKey || e.metaKey)) {
                        e.preventDefault(); // 防止默認行為
                        e.stopImmediatePropagation(); // 阻止其他事件處理器
                        // 查找發送按鈕
                        const sendButton = activeElement
                            // .closest("#prompt-textarea")
                            .parentElement.parentElement.querySelector(
                                "button[data-testid='send-button']"
                            );

                        if (sendButton) {
                            // 模擬點擊發送按鈕
                            sendButton.click();
                        }
                    }
                    if (!isEnterEnabled) {
                        e.preventDefault(); // 防止默認行為
                        e.stopImmediatePropagation(); // 阻止其他事件處理器
                        // 插入換行
                        const textarea = activeElement;
                        const start = textarea.selectionStart;
                        const end = textarea.selectionEnd;
                        textarea.value =
                            textarea.value.substring(0, start) +
                            "\n" +
                            textarea.value.substring(end);
                        // 將光標位置調整到換行後
                        textarea.selectionStart = textarea.selectionEnd =
                            start + 1;

                        if (textarea.selectionStart === textarea.value.length) {
                            // 滑动到最底部
                            textarea.scrollTop = textarea.scrollHeight;
                        }
                        // 手動觸發 input 事件
                        const event = new Event("input", { bubbles: true });
                        textarea.dispatchEvent(event);
                    }
                }
            } else {
                // 檢查其他輸入框
                if (e.key === "Enter") {
                    if (!isCtrlEnterEnabled && (e.ctrlKey || e.metaKey)) {
                        const parent = activeElement.closest(
                            "div.group\\/conversation-turn"
                        );
                        if (parent) {
                            // console.log(parent)
                            e.preventDefault(); // 防止默認行為
                            e.stopImmediatePropagation(); // 阻止其他事件處理器

                            const sendButton = parent.querySelector(
                                "div > div > div > div:last-of-type > button:last-of-type"
                            );
                            if (sendButton) {
                                // console.log(sendButton);
                                sendButton.click();
                            }
                        }
                    }
                }
            }
        },
        true
    ); // 使用 capture 階段
})();
