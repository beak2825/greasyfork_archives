// ==UserScript==
// @name         AutoStudyLowSpeed
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  0.1倍慢速播放，满足学习时长。自动跳过确认按钮，可以挂机一直学，并且在学习时长满足后自动结束本节课学习
// @Author       AkkunYo
// @match        http://study.teacheredu.cn/*
// @match        http://course.teacheredu.cn/*
// @license      MIT
// @grant        none
// @grant        unsafeWindow
// @grant        GM_addStyle
// @require      https://static.hdslb.com/js/jquery.min.js
// @icon         http://cas.study.teacheredu.cn/auth/selfHost/personCenter/logo.png
// @downloadURL https://update.greasyfork.org/scripts/502938/AutoStudyLowSpeed.user.js
// @updateURL https://update.greasyfork.org/scripts/502938/AutoStudyLowSpeed.meta.js
// ==/UserScript==
//run-at       document-start

(function () {
    'use strict';
 
    let weburl = window.location.href;
 
    if (weburl.indexOf('study.teacheredu.cn') != -1) {
        window.alert = function () {
            return 1;
        }
        window.confirm = function () {
            return 1;
        }
    }
    if (weburl.indexOf('course.teacheredu.cn') != -1) {
        let rate = 0.1; //倍速
        setTimeout(function () {
            document.querySelector('video').volume = 0;
            document.querySelector('video').click();
        }, 2000)
        setTimeout(function () {
            document.querySelector('video').playbackRate = rate;
        }, 3000)
    }

    let totalTimeNode = document.getElementsByClassName("introduce_list")[3];
    var totalTime = parseInt(totalTimeNode.textContent.match(/\d+/)[0], 10) * 60;
    if (totalTime < 10) {
        totalTime = 3000;
    }

    let tishiBar = document.getElementById("benci").parentNode;
    let leijiNode = document.getElementById('leiji');
    let passedtimeNode = document.getElementById('passedtime');
    var leiji = leijiNode.value;
    var passedtime = passedtimeNode.value;
    var total = parseInt(leiji) + parseInt(passedtime);
    var percent = total * 100 / totalTime;
    var childNode = document.createElement("i");
    childNode.setAttribute("id", "childNode");
    childNode.innerHTML = "当前总计：" + parseInt(total / 60) + "/" + parseInt(totalTime / 60) + "分钟," + parseInt(percent) + "%";
    tishiBar.appendChild(childNode);

    function repeat() {
        setInterval(function () {
            leiji = leijiNode.value;
            passedtime = passedtimeNode.value;
            total = parseInt(leiji) + parseInt(passedtime);
            percent = total * 100 / totalTime;
            var ext = "";
            if (parseInt(percent) == 100) {
                ext = ",完成处理中...";
            }
            childNode.innerHTML = "当前总计：" + parseInt(total / 60) + "/" + parseInt(totalTime / 60) + "分钟," + parseInt(percent) + "%" + ext;
         
            if (total > totalTime) {
                $('a:contains(结束学习)')[0].click();
            }
        }, 10000);
    }

    setTimeout(function () {
        if (leiji > totalTime) {
            $('a:contains(结束学习)')[0].click();
        } else {
            repeat();
        }
    }, 1000);

})();

 
