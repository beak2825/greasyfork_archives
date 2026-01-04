// ==UserScript==
// @name        V2free 自动签到
// @namespace   Violentmonkey Scripts
// @match       https://w1.v2ai.top/user
// @grant       none
// @version     1.0
// @author      liguang
// @description 2023/10/21 00:04:06
// @downloadURL https://update.greasyfork.org/scripts/477872/V2free%20%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/477872/V2free%20%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(function(){
    'use stric'
    setTimeout(function(){
        document.getElementById("result_ok").click();
        // 选中签到按钮并点击
        const button = document.querySelector("#checkin");
        if (button) button.click();
        window.close();
    }, 3000);
})();