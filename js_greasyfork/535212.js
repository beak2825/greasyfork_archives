// ==UserScript==
// @name         禁用网站强制自动全屏
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  禁用全屏功能，防止网站调用全屏模式
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535212/%E7%A6%81%E7%94%A8%E7%BD%91%E7%AB%99%E5%BC%BA%E5%88%B6%E8%87%AA%E5%8A%A8%E5%85%A8%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/535212/%E7%A6%81%E7%94%A8%E7%BD%91%E7%AB%99%E5%BC%BA%E5%88%B6%E8%87%AA%E5%8A%A8%E5%85%A8%E5%B1%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 禁用全屏请求
    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen = function() {
            console.log("全屏请求已被禁用！");
            return Promise.reject("全屏请求已被禁用");
        };
    }



    // 也可以禁用其他可能的全屏触发事件，如通过按键等
    document.addEventListener('keydown', function(event) {
        if (event.key === "F11" || (event.ctrlKey && event.key === "F")) {
            event.preventDefault();
            console.log("全屏快捷键已禁用！");
        }
    });
})();
