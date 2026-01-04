// ==UserScript==
// @name         2024年深圳市对口帮扶地区中小学校长全员培训项目
// @namespace    http://tampermonkey.net/
// @version      2024-03-23-002
// @description  自动点击
// @author       You
// @match        https://ipx.yanxiu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yanxiu.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/490474/2024%E5%B9%B4%E6%B7%B1%E5%9C%B3%E5%B8%82%E5%AF%B9%E5%8F%A3%E5%B8%AE%E6%89%B6%E5%9C%B0%E5%8C%BA%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%A0%A1%E9%95%BF%E5%85%A8%E5%91%98%E5%9F%B9%E8%AE%AD%E9%A1%B9%E7%9B%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/490474/2024%E5%B9%B4%E6%B7%B1%E5%9C%B3%E5%B8%82%E5%AF%B9%E5%8F%A3%E5%B8%AE%E6%89%B6%E5%9C%B0%E5%8C%BA%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%A0%A1%E9%95%BF%E5%85%A8%E5%91%98%E5%9F%B9%E8%AE%AD%E9%A1%B9%E7%9B%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var log = console.log;
    function click(){
        var now = new Date();
        log("click", now.toLocaleString());
        // 继续学习
        var btn_study = document.getElementsByClassName("alarmClock-wrapper")[0];
        if (btn_study) {
            btn_study.click();
            log("btn_study", btn_study);
        }
        // 评分
        var btn_rate = document.getElementsByClassName("rate-item")[9];
        if (btn_rate) {
            btn_rate.dispatchEvent(new Event("mousemove"));
            btn_rate.click();
            log("btn_rate", btn_rate);
            var btn_commit = document.querySelector("div.scoring-wrapper > div > div.commit > button");
            if (btn_commit) {
                btn_commit.click();
                log("btn_commit", btn_commit);
            }
        }
        // 下一集
        var mask = document.getElementsByClassName("ended-mask")[0];
        if (!mask.style.display.includes("none")){
            var btn_next = document.getElementsByClassName("next")[0];
            if (btn_next) {
            btn_next.click();
            log("btn_next", btn_next);
            }
        }
    }
    var interval = 3;
    var intervalID = setInterval(click, interval * 1000);
})();