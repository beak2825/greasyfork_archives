// ==UserScript==
// @name         xuetangx-remove-qrcode
// @namespace    https://github.com/DuckSoft
// @version      0.2.1
// @description  移除学堂在线课程的强制微信扫码关注
// @author       DuckSoft
// @match        *://www.xuetangx.com/courses/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/368784/xuetangx-remove-qrcode.user.js
// @updateURL https://update.greasyfork.org/scripts/368784/xuetangx-remove-qrcode.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 移除遮罩层方法
    let remove_fun = () => {
        let mask;
        if (mask = document.querySelector(".course_mask")) {
            mask.remove()
        }
    };
    // 绑定窗口加载完毕事件
    (f => {
        if (document.addEventListener) window.addEventListener("load", f, false);
        else if (window.attachEvent) window.attachEvent("onload", f);
    })(remove_fun);
    // 双击页面立即移除（适用于网络加载缓慢时）
    (f => window.addEventListener("dblclick", f, false))(remove_fun);
})();
