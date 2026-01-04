// ==UserScript==
// @name         拼题A pintia 强制解除粘贴限制（PTA）
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  用来解除PTA禁止复制粘贴的功能（拼题A、pintia、PTA、程序设计类实验辅助教学平台、PROGRAMMING TEACHING ASSISTANT）
// @author       NellPoi
// @match        https://pintia.cn/problem-sets/*/exam/problems/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pintia.cn
// @grant        none
// @license        MIT 
// @downloadURL https://update.greasyfork.org/scripts/494356/%E6%8B%BC%E9%A2%98A%20pintia%20%E5%BC%BA%E5%88%B6%E8%A7%A3%E9%99%A4%E7%B2%98%E8%B4%B4%E9%99%90%E5%88%B6%EF%BC%88PTA%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/494356/%E6%8B%BC%E9%A2%98A%20pintia%20%E5%BC%BA%E5%88%B6%E8%A7%A3%E9%99%A4%E7%B2%98%E8%B4%B4%E9%99%90%E5%88%B6%EF%BC%88PTA%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const original = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function (type, listener) {
        if (type === "input" && listener.toString().includes("粘贴")) {
            return;
        }
        original.call(this, type, listener);
    };
})();