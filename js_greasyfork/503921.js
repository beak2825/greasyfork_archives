// ==UserScript==
// @name         修改元梦之星标题
// @namespace    http://tampermonkey.net/
// @version      2024.08.19
// @description  修改腾讯先锋云游戏-元梦之星的网页标题
// @author       张瓜皮
// @match        https://gamer.qq.com/v2/game/96897
// @icon         https://pp.myapp.com/ma_icon/0/icon_54326199_1721181759/256
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/503921/%E4%BF%AE%E6%94%B9%E5%85%83%E6%A2%A6%E4%B9%8B%E6%98%9F%E6%A0%87%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/503921/%E4%BF%AE%E6%94%B9%E5%85%83%E6%A2%A6%E4%B9%8B%E6%98%9F%E6%A0%87%E9%A2%98.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var btn_t = document.createElement("button");
    btn_t.innerHTML = "设置窗口标题"; // 设置按钮文本
    btn_t.style.position = "absolute";
    btn_t.style.left = "0";
    btn_t.style.bottom = "0";
    document.body.appendChild(btn_t);
    btn_t.addEventListener('click', function () {
        var userName = window.prompt('请输入窗口标题', '').replace(/\s/g, "");
        if (userName != null) {
            document.title = "元梦之星 - " + userName;
        }
    });
})();