// ==UserScript==
// @name         知乎增强
// @namespace    https://gitee.com/linhq1999/OhMyScript
// @version      1.1
// @description  去除广告和快速折叠
// @author       LinHQ
// @match        https://www.zhihu.com/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/429460/%E7%9F%A5%E4%B9%8E%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/429460/%E7%9F%A5%E4%B9%8E%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==
'use strict';
let ads = document.getElementsByClassName("TopstoryItem--advertCard"), side_ads = document.getElementsByClassName("Pc-card Card"), btns = document.getElementsByTagName("button"), modal = document.getElementsByClassName('Button Modal-closeButton Button--plain');
function scan() {
    var _a;
    // 移除 “范围” 上的图片
    (_a = document.querySelector(".GlobalSideBar-category img")) === null || _a === void 0 ? void 0 : _a.remove();
    // 移除侧边栏广告
    for (const sad of side_ads) {
        sad.remove();
    }
    // 移除主要广告
    for (const adv of ads) {
        adv.remove();
    }
}
(function () {
    var _a;
    document.body.addEventListener("keydown", e => {
        var _a, _b, _c;
        if (e.ctrlKey && e.key == 'c') {
            GM_setClipboard((_b = (_a = window.getSelection()) === null || _a === void 0 ? void 0 : _a.toString().trim()) !== null && _b !== void 0 ? _b : "");
        }
        if (e.key == 'c' && e.altKey) {
            // 先检查弹出式评论
            if (modal.length != 0) {
                modal[0].click();
                return;
            }
            if (btns.length != 0) {
                for (const btn of btns) {
                    if (btn != null && ((_c = btn.textContent) === null || _c === void 0 ? void 0 : _c.includes("收起"))) {
                        btn.click();
                    }
                }
            }
        }
        e.stopImmediatePropagation();
    });
    try {
        new MutationObserver((cl, ob) => {
            scan();
        }).observe((_a = document.querySelector("#root")) !== null && _a !== void 0 ? _a : document.body, { subtree: true, childList: true });
    }
    catch (error) {
        // 某些网站覆盖了 api，可以解决但我不想写了
        console.warn("Fallback to interval!");
        setInterval(scan, 1000);
    }
})();
