// ==UserScript==
// @name         百度贴吧自动一键签到
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  百度贴吧每天一键签到，打开贴吧首页https://tieba.baidu.com/index.html，然后让脚本在后台自动处理所有工作！
// @author       大西瓜一块五一斤
// @match        https://tieba.baidu.com/index.html*
// @match        http://tieba.baidu.com/index.html*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397818/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E8%87%AA%E5%8A%A8%E4%B8%80%E9%94%AE%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/397818/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E8%87%AA%E5%8A%A8%E4%B8%80%E9%94%AE%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Your code here...
    function clicker() {
        setTimeout(function() {
            var onekey_btn = document.getElementsByClassName("onekey_btn");
            console.log(onekey_btn);
            var osign = onekey_btn[0];
            console.log(osign);
            osign.click();
            setTimeout(function() {
                var sign = document.getElementsByClassName("sign_btn");
                console.log(sign);
                var tsign = sign[0];
                console.log(tsign);
                if (tsign.innerText != '签到成功'&&tsign.innerText != '签到失败') {
                    setTimeout(function() {
                        var j_sign_btn = document.getElementsByClassName("j_sign_btn");
                        console.log(j_sign_btn);
                        var jsign = j_sign_btn[0];
                        console.log(jsign);
                        jsign.click();
                    },
                    2000)
                }
            },
            2000)
        },
        2000)

    }

    function refresher() {
        window.location.reload(true);
    }

    window.addEventListener("load", clicker);
    setInterval(refresher, 30 * 60 * 1000);
})();