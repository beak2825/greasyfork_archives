// ==UserScript==
// @name         学习公社（自用）
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  自动播放下一集，自动点击未完成课程
// @author       nkwuqm
// @license      MIT
// @match        https://study.enaea.edu.cn/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512971/%E5%AD%A6%E4%B9%A0%E5%85%AC%E7%A4%BE%EF%BC%88%E8%87%AA%E7%94%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/512971/%E5%AD%A6%E4%B9%A0%E5%85%AC%E7%A4%BE%EF%BC%88%E8%87%AA%E7%94%A8%EF%BC%89.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 执行主函数
    window.setInterval(doit, 5000);

    // 待学习课程网页（必修）
    var strMustCourse = 'https://study.enaea.edu.cn/circleIndexRedirect.do?action=toNewMyClass&type=course&circleId=263738&syllabusId=1593948&isRequired=true';

    // 当前网页地址
    var strHref = window.location.href;

    // 待学习课程列表网页地址
    var strCourse = strMustCourse;

    // 主函数
    function doit() {

        if (strHref==strCourse) {
            clickMustCourse();
        }else if (isPlayOver()) {
            clickNext();
        }
        printTime("doit")
    }

    //  在必修课列表中选择未学完的课程
    function clickMustCourse() {


        $(".customcur-tab")[1].click();

        setTimeout(function(){
            var allCourse = $(".odd,.even");

            for (var i = 0; i <= allCourse.length; i++) {
                printTime(allCourse[i].innerText);
                var a = allCourse[i].children[4];
                var b = allCourse[i].children[5].children[0].getAttribute("data-vurl");
                var c = "https://study.enaea.edu.cn";
                printTime(a.innerText);
                if (a.innerText!="100%") {
                    window.open(c + b,"_self");
                    return;
                }
            }
            printTime("clickMustCourse")
        }, 2000);


    }

    // 判断当前视频是否播放完毕
    function isPlayOver() {
        return true;
    }

    //  视频播放完毕后点击下一集，如果全部播放完则返回课程列表
    function clickNext() {
        //处理播放器事件
        if (document.querySelector("video")) {
            let playerH5 = document.querySelector("video");
            playerH5.volume = 0; //不想听声音
            if (playerH5.paused) {
                playerH5.play(); //不要暂停，播下去
            }
        }
        var allCourse = $(".cvtb-MCK-CsCt-info");
        if (allCourse[allCourse.length-1].children[1].innerText == "100%")  window.open(strCourse,"_self");
        printTime("clickNext");
    }


    function printTime(string) {
        const now = new Date();
        const year = now.getFullYear();
        const month = ('0' + (now.getMonth() + 1)).slice(-2);
        const day = ('0' + now.getDate()).slice(-2);
        const hours = ('0' + now.getHours()).slice(-2);
        const minutes = ('0' + now.getMinutes()).slice(-2);
        const seconds = ('0' + now.getSeconds()).slice(-2);
        const formattedTime = year + "-" + month + "-" + day + "  " + hours + ":" + minutes + ":" + seconds;
        console.log(string + " at " + formattedTime);
    }

})();


