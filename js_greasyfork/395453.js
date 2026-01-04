// ==UserScript==
// @name         百度贴吧自动签到
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  百度贴吧每天自动签到，打开想要签到的贴吧首页，然后让脚本在后台自动处理所有工作！
// @author       大西瓜一块五一斤
// @match        https://tieba.baidu.com/f?*
// @match        http://tieba.baidu.com/f?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395453/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/395453/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Your code here...
    function clicker() {
        setTimeout(function() {
            var signstar_wrapper = document.getElementById("signstar_wrapper");
            console.log(signstar_wrapper);
            var sign = signstar_wrapper.children[0];
            console.log(sign);
            console.log(sign.title);
            if (sign.title != '签到完成') {
                sign.click();
                if (sign.title != '签到完成') {
                    sign.click();
                }
            }
        },
        2000)
    }

    function refresher() {
        window.location.reload(true);
    }

    window.addEventListener("load", clicker);
    setInterval(refresher, 30 * 60 * 1000);
})();