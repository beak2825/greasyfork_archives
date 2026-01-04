// ==UserScript==
// @name         CSDN论坛自动签到抽奖
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @description:ZH-CN   打开自动签到的页面，然后让脚本在后台自动处理所有工作！
// @author       大西瓜一块五一斤
// @match        https://i.csdn.net*/*
// @grant        none
// @requrie      https://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/395087/CSDN%E8%AE%BA%E5%9D%9B%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0%E6%8A%BD%E5%A5%96.user.js
// @updateURL https://update.greasyfork.org/scripts/395087/CSDN%E8%AE%BA%E5%9D%9B%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0%E6%8A%BD%E5%A5%96.meta.js
// ==/UserScript==
(function() {
    'use strict';

    function clicker() {
        setTimeout(function() {
            var has_sign = $(".has_sign");
            console.log(has_sign);
            if (has_sign.length == 0) {
                var sign = $(".to_sign");
                console.log(sign[0]);
                sign[0].click();
                setTimeout(function() {
                    var close = $(".close");
                    console.log(close[0]);
                    close[0].click();
                },
                2000);
            }
        },
        2000);
        setTimeout(function() {
            var reward = $(".to_reward");
            console.log(reward);
            if (reward.length > 0) {
                console.log(reward[0]);
                reward[0].click();
                setTimeout(function() {
                    var group = $(".btn_group");
                    console.log(group[0].children[0]);
                    group[0].children[0].click();
                    setTimeout(function() {
                        var close1 = $(".close");
                        console.log(close1[0]);
                        close1[0].click();
                    },
                    8000);
                },
                2000);
            }
        },
        5000);
    }
    function refresher() {
       window.location.href="https://i.csdn.net/#/uc/reward";
       window.location.reload(true);
    }

    window.addEventListener("load", clicker);
    setInterval(refresher, 60*30*1000);
})();