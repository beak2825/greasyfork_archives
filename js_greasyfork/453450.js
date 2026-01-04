// ==UserScript==
// @name         E学院自动挂学时+下载课件
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  E学院课程挂满学时后自动提交和评价，增加手动下载课件按钮。
// @author       You
// @match        http://e-learning.sichuanair.com/myCourse/study.html*
// @grant        none
// @license      MIT     
// @downloadURL https://update.greasyfork.org/scripts/453450/E%E5%AD%A6%E9%99%A2%E8%87%AA%E5%8A%A8%E6%8C%82%E5%AD%A6%E6%97%B6%2B%E4%B8%8B%E8%BD%BD%E8%AF%BE%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/453450/E%E5%AD%A6%E9%99%A2%E8%87%AA%E5%8A%A8%E6%8C%82%E5%AD%A6%E6%97%B6%2B%E4%B8%8B%E8%BD%BD%E8%AF%BE%E4%BB%B6.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...

    //判断在学习页面
    if (GetUrlRelativePath() === "/myCourse/study.html") {
        //延时5s执行
        window.setTimeout(function () {
            //添加下载课件功能
            $("#finish").after("<a id='defile'>下载课件</a>")
            $("#defile").click(function(){$('iframe').contents().find('iframe').contents().find("#download").click()})
            //每隔一分钟
            setInterval(showLogin, "60000");

        }, 10000)

    }

    // 获取当前窗口相对路径
    function GetUrlRelativePath() {
        return window.location.pathname
    }

    function showLogin() {
        var timeText = $("#time").text().split(":");
        var periodText = $("#periodTime").text().split(":");
        //学习时间
        var studyTimeSecondd = parseInt(timeText[0]) * 60;
        //要求时间
        var periodSecondd = parseInt(periodText[0]) * 60;

        if (studyTimeSecondd > periodSecondd) {
            $("#finish").click();
            window.setTimeout(function () {
                if ($("#discuss").css("display") === 'block') {
                    document.getElementById("discussBtn").click();
                }
            }, 3000)
        }
    }

})();