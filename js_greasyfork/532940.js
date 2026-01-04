// ==UserScript==
// @name         Remove DeepSeek Overlay
// @name:zh-TW   移除 DeepSeek 的生日填寫提醒與遮罩
// @name:zh-CN   移除 DeepSeek 的生日填写提醒与遮罩
// @name:ja     DeepSeekの誕生日入力リマインダーとマスクを削除
// @namespace    https://github.com/April-15/tampermonkey-scripts/blob/main/Remove_DeepSeek_Overlay.js
// @version      0.1.1
// @description  This script is used to remove DeepSeek's birthday filling reminder and mask.
// @description:zh-TW  此腳本用於移除DeepSeek的生日填寫提醒及蒙版。
// @description:zh-CN  此脚本用于移除DeepSeek的生日填写提醒和遮罩。
// @description:ja   DeepSeekの誕生日入力リマインダーとマスクを削除するスクリプトです。
// @author       April 15th
// @match        https://chat.deepseek.com/
// @icon         https://chat.deepseek.com/favicon.svg
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532940/Remove%20DeepSeek%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/532940/Remove%20DeepSeek%20Overlay.meta.js
// ==/UserScript==


(function() {
    'use strict';

    function elementLoaded() {
        waitForElement("body > div.ds-modal-overlay").then(() => {
            removeElement("body > div.ds-modal-overlay");
        });
        waitForElement("body > div.ds-theme.ds-modal-wrapper").then(() => {
            removeElement("body > div.ds-theme.ds-modal-wrapper");
            const inputElement = document.querySelector("#chat-input");
            if (inputElement) {
                inputElement.focus();
            }
        });

        waitForElement("#chat-input").then(() => {
            const inputElement = document.querySelector("#chat-input");
            if (inputElement) {
                inputElement.focus();
            }
        });
    }

    function removeElement(element) {
        const element2Remove = document.querySelector(element);
        if (element2Remove) {
            element2Remove.remove();
        }
    }

    function waitForElement(selector) {
        return new Promise((resolve) => {
            const observer = new MutationObserver(() => {
                const element = document.querySelector(selector);
                if (element) {
                    observer.disconnect();
                    resolve(element);
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        });
    }
    window.addEventListener('load', elementLoaded);
})();
