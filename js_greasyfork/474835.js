// ==UserScript==
// @name         高校教师岗前培训（自用）
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  自动播放下一集
// @author       wuqm
// @license      MIT
// @match        *.enetedu.com/GqCourse/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/474835/%E9%AB%98%E6%A0%A1%E6%95%99%E5%B8%88%E5%B2%97%E5%89%8D%E5%9F%B9%E8%AE%AD%EF%BC%88%E8%87%AA%E7%94%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/474835/%E9%AB%98%E6%A0%A1%E6%95%99%E5%B8%88%E5%B2%97%E5%89%8D%E5%9F%B9%E8%AE%AD%EF%BC%88%E8%87%AA%E7%94%A8%EF%BC%89.meta.js
// ==/UserScript==
// 引入 jquery
//this.$ = this.jQuery = jQuery.noConflict(true);


(function() {
    'use strict';

    // Your code here...

    var strHref = window.location.href;

    var strMustCourse = 'https://shanxi.enetedu.com/GqCourse/MustCourse?subid=2'; // id 1-4

    var strOptionalCourse = "https://shanxi.enetedu.com/GqCourse/XxIndex";

    var strCourse = strOptionalCourse;

    // 执行函数
    window.setInterval(doit, 10000);


    function doit() {

        if (strHref==strCourse) {
            clickOptionalCourse();
        }else if (isPlayOver()) {
            clickNext();
        }
        printTime("doit")
    }


    //  在选修课列表中选择未学完的课程
    function clickOptionalCourse() {

        var allCourse =  $("a");

        for (var i = 1; i <= allCourse.length; i++) {

            var a = allCourse[i];
            if (a.innerText=="进入学习") {
                a.click();
                //break;
            }
        }
        printTime("clickOptionalCourse")
    }


    //  在必修课列表中选择未学完的课程
    function clickMustCourse() {

        var allCourse = document.querySelector("body > div:nth-child(1) > table > tbody > tr > td > table:nth-child(5) > tbody > tr > td > table:nth-child(2) > tbody > tr > td:nth-child(2) > table > tbody > tr > td:nth-child(3) > table:nth-child(3) > tbody").children;

        for (var i = 1; i <= allCourse.length; i++) {

            var a = allCourse[i].children[3].children[0].children[0];
            if (a.innerText!="已学完") {
                a.click();
                //break;
            }
        }
        printTime("clickMustCourse")
    }


    //  视频播放完毕后点击下一集，如果全部播放完则返回课程列表
    function clickNext() {

        var rgb1 = "rgb(143, 179, 17)"; //学完 未学完 未开始 正在学习（
        var rgb2 = "rgb(39, 143, 206)";
        var rgb3 = "rgb(242, 242, 242)";
        var rgb4 = "rgb(222, 222, 222)";

        // 长度为视频数+6，下标为5到长度-2
        var children = document.querySelector("#form1 > div > table > tbody > tr > td > table > tbody > tr > td > table:nth-child(5) > tbody > tr > td > table:nth-child(2) > tbody > tr > td:nth-child(2) > table:nth-child(3) > tbody > tr > td > table > tbody > tr > td:nth-child(3)").children;

        for (var i = 5; i <= children.length-2; i++) {

            var bgColor = children[i].children[0].children[0].children[2].style.backgroundColor

            if (bgColor == rgb2 || bgColor == rgb3) {
                //console.log(i + "      "+ children[i].innerText);
                children[i].children[0].children[0].children[2].children[1].click();
                break;
            }else{
                window.open(strCourse,"_self");
            }
        }
        printTime("clickNext");
    }



    // 判断当前视频是否播放完毕
    function isPlayOver() {
        var barcurr = document.getElementsByClassName('qplayer-barcurr')[0].style.width; // 值为  0%-100%
        if (parseInt(barcurr)<95) {
            console.log(barcurr);
            return false;
        } else {
            return true;
        }
    }


    function printTime(string) {

        var timestamp = Date.parse(new Date());
        var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1):date.getMonth()+1) + '-';
        var D = (date.getDate()< 10 ? '0'+date.getDate():date.getDate())+ ' ';
        var h = (date.getHours() < 10 ? '0'+date.getHours():date.getHours())+ ':';
        var m = (date.getMinutes() < 10 ? '0'+date.getMinutes():date.getMinutes()) + ':';
        var s = date.getSeconds() < 10 ? '0'+date.getSeconds():date.getSeconds();
        console.log(string + " at "+ Y+M+D+h+m+s);
    }
























    //  code over...
})();


