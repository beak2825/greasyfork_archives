// ==UserScript==
// @name         屏蔽minecraft.net官网的网易弹窗
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  屏蔽minecraft.net官网的网易弹窗，支持旧版和新版的弹窗
// @author       kzyqq00-Player
// @match        https://www.minecraft.net/*
// @license      MIT
// @icon         https://www.minecraft.net/etc.clientlibs/minecraftnet/clientlibs/clientlib-site/resources/favicon-96x96.png
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/520654/%E5%B1%8F%E8%94%BDminecraftnet%E5%AE%98%E7%BD%91%E7%9A%84%E7%BD%91%E6%98%93%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/520654/%E5%B1%8F%E8%94%BDminecraftnet%E5%AE%98%E7%BD%91%E7%9A%84%E7%BD%91%E6%98%93%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const BUTTON_ELEMENT_SELECTOR_TEXT = 'div.MC_modal_actions_container.MC_modalA_contentPanel_actions.MC_modal_actions_singlerow > button:nth-child(2)';
    const LEGACY_DIALOG_ELEMENT_SELECTOR_TEXT = '.netease-promotion-popup';

    const buttonElement = document.querySelector(BUTTON_ELEMENT_SELECTOR_TEXT); // 先尝试使用新版按钮
    if (!buttonElement) {
        const legacyDialog = document.querySelector(LEGACY_DIALOG_ELEMENT_SELECTOR_TEXT);
        if (!legacyDialog) { // 如果找不到旧版弹窗，就监测页面变动，一旦监测到了新版按钮出现就点击/旧版弹窗出现就移除
            new Promise((resolve, reject) => {
                const observer = new MutationObserver(() => {
                    const _button = document.querySelector(BUTTON_ELEMENT_SELECTOR_TEXT);
                    const _legacyDialog = document.querySelector(LEGACY_DIALOG_ELEMENT_SELECTOR_TEXT);
                    if (_button || _legacyDialog) { // 如果新版或旧版按钮任意一个存在，则resolve
                        clearTimeout(id);
                        resolve([_button || _legacyDialog, Boolean(_button)]);
                        observer.disconnect();
                    }
                });

                const config = {
                    childList: true,
                    subtree: true
                };
                try {
                    observer.observe(document.querySelector('div.xfpage.page.basicpage'), config); // 尝试监听范围更小的元素；如果没有，则监听body
                } catch (_) {
                    observer.observe(document.body, config);
                }

                const id = setTimeout(() => {
                    observer.disconnect();
                    reject(); // 超时就reject
                }, 1000); // 超时1秒
            })
                .then((res) => {
                    if (res[1]) { // 新版按钮
                        res[0].click(); // 把resolve过来的按钮元素点击
                    } else { // 旧版弹窗
                        document.body.classList.remove('modal-open');

                        res[0].remove();
                    }
                })
                .catch(() => {
                    alert('尝试获取按钮/弹窗失败，可能是因为油猴脚本版本过旧，请尝试更新到最新版本；如果已经是最新版本，请反馈给作者，不需要有其他的描述，给这个弹窗的截图就好');
                    throw new TypeError('Get button element failed');
                });
        } else { // 如果直接找到了旧版弹窗就直接移除
            legacyDialog.remove();
        }
    } else {
        buttonElement.click();
    }
})();