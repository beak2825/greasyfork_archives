// ==UserScript==
// @name         Bilibili自动开启字幕
// @namespace    http://tampermonkey.net/
// @version      2024-09-19
// @description  自动开启Bilibili字幕
// @author       initsnow
// @license GPL-3.0
// @match        https://www.bilibili.com/video/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/508858/Bilibili%E8%87%AA%E5%8A%A8%E5%BC%80%E5%90%AF%E5%AD%97%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/508858/Bilibili%E8%87%AA%E5%8A%A8%E5%BC%80%E5%90%AF%E5%AD%97%E5%B9%95.meta.js
// ==/UserScript==


const BVID = getCurrentlyBVID();
var whitelist = GM_getValue("whitelist", []);

if (whitelist.includes(BVID)) {
    enable();
}

registerMenu();

function registerMenu() {
    whitelist = GM_getValue("whitelist", []);
    const isWhitelisted = whitelist.includes(BVID);
    const menuLabel = `${isWhitelisted ? '✅' : '❌'}自动开启`;

    const menuId = GM_registerMenuCommand(menuLabel, () => {
        toggleWhitelist(isWhitelisted);
        GM_unregisterMenuCommand(menuId);
        registerMenu();
    });
}

function toggleWhitelist(isWhitelisted) {
    whitelist = GM_getValue("whitelist", []);
    const updatedList = isWhitelisted
    ? whitelist.filter(e => e !== BVID)
    : [...whitelist, BVID];
    GM_setValue("whitelist", updatedList);

    if (!isWhitelisted) {
        enable();
    }
}

function getCurrentlyBVID() {
    return location.pathname.match(/\/video\/(BV\w+)\//)[1];
}

function enable() {
    enableSubtitle();
    history.pushState = bindHistoryEvent("pushState");
    window.addEventListener("pushState", function (e) {
        enableSubtitle();
    });
}

function enableSubtitle() {
    const interval = setInterval(() => {
        const subtitleIcon = document.querySelector(".bpx-player-ctrl-subtitle .bpx-common-svg-icon");
        if (subtitleIcon) {
            clearInterval(interval);
            subtitleIcon.click();
        }
    }, 800);
}

// function bindEventForEpisodic() {
//     const interval = setInterval(() => {
//         const episodes = document.querySelector("#multi_page .list-box");
//         if (episodes && episodes.childElementCount > 0) {
//             clearInterval(interval);
//             document.querySelectorAll(".router-link-active>.clickitem").forEach(e => {
//                 e.addEventListener("click", enableSubtitle);
//             });
//         }
//     }, 800);
// }

// from https://juejin.cn/post/7039605917284843534
function bindHistoryEvent(method) {
    const originMethod = history[method];
    if (!originMethod) {
        throw new Error("history has not this method named " + method);
    }
    // 闭包处理
    return function () {
        let result = null;
        try {
            originMethod.apply(this, arguments);
            //这里也可以把事件名称写死，后面做对应的监听即可
            const evt = new Event(method);
            evt.arguments = arguments;
            //分发事件
            window.dispatchEvent(evt);
            originMethod.apply(this, arguments);
        } catch (error) {
            throw new Error("执行出错");
        }
        return result;
    };
}

