// ==UserScript==
// @name         Autoclick ChatGPT Stay Logged Out
// @name:zh-TW   自動點擊 ChatGPT 保持登出狀態
// @name:zh-CN   自动点击 ChatGPT 保持登出状态
// @name:ja      ChatGPT自動ログアウト維持
// @namespace    https://github.com/April-15/tampermonkey-scripts/blob/main/Autoclick_ChatGPT_Stay_Logged_Out.js
// @version      0.1.1
// @description  This script automatically clicks "Stay Logged Out" when ChatGPT login tips appear, skipping the tip.
// @description:ja  ChatGPTのログインヒントが表示された際に「ログアウト状態を維持」を自動でクリックし、ヒントをスキップするスクリプトです。
// @description:zh-TW  當出現 ChatGPT 登入提示時，此腳本會自動點擊“保持登出狀態”，跳過提示。
// @description:zh-CN  当出现 ChatGPT 登录提示时，此脚本会自动点击“保持注销状态”，跳过提示。
// @author       April 15th
// @match        https://chatgpt.com/
// @icon         https://chatgpt.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532941/Autoclick%20ChatGPT%20Stay%20Logged%20Out.user.js
// @updateURL https://update.greasyfork.org/scripts/532941/Autoclick%20ChatGPT%20Stay%20Logged%20Out.meta.js
// ==/UserScript==


(function() {
    'use strict';

    let isDone = false;

    function clickStayLoggedOut() {
        const trigger = document.querySelector('.text-token-text-secondary.underline');
        if (trigger) {
            trigger.click();
            isDone = true;
        } else {}
    }

    function focusInput() {
        const inputElement = document.querySelector("#prompt-textarea");
        if (inputElement) {
            inputElement.focus();
        } else {}
    }

    function listener4SLO() {
        return new Promise((resolve) => {
            const observer = new MutationObserver(() => {
                if (!isDone) {
                    clickStayLoggedOut();
                } else {
                    observer.disconnect();
                    focusInput();
                    resolve(true);
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        });
    }

    window.addEventListener('load', listener4SLO());

})();
