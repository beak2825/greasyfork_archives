// ==UserScript==
// @name         KIMI、DeepSeek、豆包清空历史
// @namespace    http://tampermonkey.net/
// @version      2025-08-6
// @description  一个一个手动清太麻烦啦！
// @author       madderscientist
// @match        https://www.kimi.com/*
// @match        https://chat.deepseek.com/*
// @match        https://www.doubao.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/544812/KIMI%E3%80%81DeepSeek%E3%80%81%E8%B1%86%E5%8C%85%E6%B8%85%E7%A9%BA%E5%8E%86%E5%8F%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/544812/KIMI%E3%80%81DeepSeek%E3%80%81%E8%B1%86%E5%8C%85%E6%B8%85%E7%A9%BA%E5%8E%86%E5%8F%B2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    async function asyncDelay(time) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, time);
        });
    }

    let config;
    if (window.location.host.includes("kimi"))
        config = {
            // 按钮容器
            "btn_container_class": ".sidebar",
            // 存放历史记录的容器
            "more_btn_container_class": ".latest-history-list",
            // 更多按钮，点击后会弹出删除按钮
            "more_btn_class": ".more-btn",
            // 删除按钮，点击后会弹出确认删除的弹窗
            "delete_btn_class": ".opt-item.delete",
            // 确认删除按钮，点击后会删除历史记录
            "confirm_btn_class": ".kimi-button.danger"
        };
    else if (window.location.host.includes("deepseek"))
        config = {
            "btn_container_class": ".ebaea5d2",
            "more_btn_container_class": "._77cdc67._8a693f3",
            "more_btn_class": ".ds-icon",
            "delete_btn_class": ".ds-dropdown-menu-option.ds-dropdown-menu-option--error",
            "confirm_btn_class": ".ds-button.ds-button--error.ds-button--filled.ds-button--rect.ds-button--m"
        };
    else if(window.location.host.includes("doubao"))
        config = {
            "btn_container_class": ".flex.flex-col.h-full.select-none",
            "more_btn_container_class": ".collapse-content-uFEpZ8",
            "more_btn_class": ".semi-icon.semi-icon-default.text-s-color-text-quaternary",
            "delete_btn_class": ".remove-btn-TOaQi0.select-none.semi-dropdown-item",
            "confirm_btn_class": ".semi-button.semi-button-primary.samantha-button-Gqjh9l.danger-primary-XKkX_5.medium-MN8t8q"
        };
    const mousedownEvent = new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true,
        view: window,
        button: 0      // 左键
    });
    async function deleteAllChats() {
        let morebtns = document.querySelector(config["more_btn_container_class"]);
        if (morebtns != null) morebtns = morebtns.querySelectorAll(config["more_btn_class"]);
        else morebtns = document.querySelectorAll(config["more_btn_class"]);
        if (morebtns.length == 0) return;
        for (const btn of morebtns) {
            btn.click();
            await asyncDelay(100);
            // 豆包没有click事件，观察发现按下鼠标就响应，于是发现模拟按下事件就可以
            document.querySelector(config["delete_btn_class"]).dispatchEvent(mousedownEvent);
            document.querySelector(config["delete_btn_class"]).click();
            await asyncDelay(100);
            document.querySelector(config["confirm_btn_class"]).dispatchEvent(mousedownEvent);
            document.querySelector(config["confirm_btn_class"]).click();
            await asyncDelay(100);
        }
        deleteAllChats();
    }

    window.addEventListener('load', async function() {
        let divContainer = null;
        while(!divContainer) {
            await asyncDelay(512);
            divContainer = document.querySelector(config["btn_container_class"]);
        }
        let btn = document.createElement("button");
        btn.innerHTML = "清空历史";
        btn.onclick = deleteAllChats;
        btn.style.background = "transparent";
        btn.style.border = "none";
        btn.style.color = "red";
        btn.style.cursor = "pointer";
        divContainer.appendChild(btn);
    });
})();