// ==UserScript==
// @name         徐州继续教育挂课时
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  111
// @author       You
// @match        https://plat.xzjxjy.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xzjxjy.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469174/%E5%BE%90%E5%B7%9E%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E6%8C%82%E8%AF%BE%E6%97%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/469174/%E5%BE%90%E5%B7%9E%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E6%8C%82%E8%AF%BE%E6%97%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (location.href.indexOf("course_study") > -1) { //列表页
        setTimeout(liebiaoye, 5000); //延时5秒开始查找未完成课程
    }
    else if (location.href.indexOf("onlineVideo") > -1) { //视频页
        var jishu = 1;
        setInterval(shipinye, 60000); //每分钟检测一次进度
    }

    function liebiaoye() {
        var hongbg = document.getElementsByClassName("hongbg")[0]; //查找未完成课程
        if (hongbg) {
            window.location.href = hongbg.previousSibling.previousSibling.href; //打开查找到的课程
        } else {
            alert('全部课时已学完！');
        }
    }

    function shipinye() {
        if (jishu == 1) playerPause(); //暂停视频
        if (jd_box.textContent == '已完成') { //如果进度完成，则延时5秒后退并刷新
            setTimeout(function () {
                window.location.href=document.referrer
            }, 5000)
        }
        console.log(jishu++);
    }
    // Your code here...
})();