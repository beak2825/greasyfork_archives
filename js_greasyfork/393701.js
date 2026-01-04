// ==UserScript==
// @name         Zhihu Smart Block
// @namespace    https://duanyll.com/
// @version      0.1
// @description  按每天使用时间屏蔽知乎, 不屏蔽从百度谷歌必应打开的知乎页面以便查找资料
// @author       Duanyll
// @match        http://*.zhihu.com/*
// @match        https://*.zhihu.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/393701/Zhihu%20Smart%20Block.user.js
// @updateURL https://update.greasyfork.org/scripts/393701/Zhihu%20Smart%20Block.meta.js
// ==/UserScript==

(function () {
    'use strict';
    if (localStorage.getItem("timeLimit") === null) {
        var timeLimit = "";
        timeLimit = prompt("请设置限制时间(秒), 请自觉保证它是一个整数")
        localStorage.setItem("timeLimit", timeLimit);
        console.log(`限制时间设置为 ${timeLimit} 秒`);
    }

    if ((document.referrer.includes("baidu.com") || document.referrer.includes("google.com") || document.referrer.includes("bing.cn"))
        && window.location.href.includes("question")) {
        console.log("不限制从搜索引擎打开的知乎页面");
        return;
    }

    var isBlocked = false;

    function checkTime() {
        function getNowFormatDate() {
            var date = new Date();
            var seperator1 = "-";
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            var currentdate = year + seperator1 + month + seperator1 + strDate;
            return currentdate;
        }
        var lastDate = localStorage.getItem("lastDate");
        if (lastDate === getNowFormatDate()) {
            var timeUsed = Number.parseInt(localStorage.getItem("timeUsed"));
            if (isNaN(timeUsed)) timeUsed = 0;
            timeUsed += secondBetweenCheck;
            var timeLimit = Number.parseInt(localStorage.getItem("timeLimit"));
            if (timeUsed > timeLimit) {
                if (!isBlocked) {
                    alert('今天的知乎使用时间已到, 按确定关闭知乎.');
                    document.body.innerHTML = "<h1>知乎已屏蔽</h1>";
                    isBlocked = true;
                }
            } else {
                localStorage.setItem("timeUsed", timeUsed.toString());
            }
        } else {
            localStorage.setItem("lastDate", getNowFormatDate());
            localStorage.setItem("timeUsed", "0");
            console.log("这是今天第一次打开知乎");
        }
    }

    var secondBetweenCheck = 2;
    var intervalOutput = setInterval(checkTime, secondBetweenCheck * 1000);
    window.onblur = () => clearInterval(intervalOutput);
    window.onfocus = () => {
        intervalOutput = setInterval(checkTime, secondBetweenCheck * 1000);
    }
    console.log("已加载知乎限制脚本.");
})();