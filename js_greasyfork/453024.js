// ==UserScript==
// @name         *最新版* 全国高校教师网络培训中心-自动刷课
// @namespace    https://onlinenew.enetedu.com/
// @version      0.8
// @description  适用于网址是 https://onlinenew.enetedu.com/ 的网站自动刷课，您需要手动打开课程播放页面，程序会监测视频是否暂停，自动点击播放，当前视频播放完成则自动播放下一个视频。
// @author       Praglody
// @match        https://onlinenew.enetedu.com/*/MyTrainCourse/ChoiceCourse*
// @match        https://onlinenew.enetedu.com/*/MyTrainCourse/OnlineCourse*
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/453024/%2A%E6%9C%80%E6%96%B0%E7%89%88%2A%20%E5%85%A8%E5%9B%BD%E9%AB%98%E6%A0%A1%E6%95%99%E5%B8%88%E7%BD%91%E7%BB%9C%E5%9F%B9%E8%AE%AD%E4%B8%AD%E5%BF%83-%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/453024/%2A%E6%9C%80%E6%96%B0%E7%89%88%2A%20%E5%85%A8%E5%9B%BD%E9%AB%98%E6%A0%A1%E6%95%99%E5%B8%88%E7%BD%91%E7%BB%9C%E5%9F%B9%E8%AE%AD%E4%B8%AD%E5%BF%83-%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function randomNum(minNum, maxNum) {
        switch (arguments.length) {
            case 1:
                return parseInt(Math.random() * minNum + 1, 10);
                break;
            case 2:
                return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
                break;
            default:
                return 0;
                break;
        }
    }
    window.onload=function(){
        let pppplay = setInterval(function(){
            if($(".classcenter-chapter1 iframe").contents().find(".layui-layer-content iframe").length > 0){
                setTimeout(function(){
                    $(".classcenter-chapter1 iframe").contents().find(".layui-layer-content iframe").contents().find("#questionid~div button").trigger("click")
                }, randomNum(15, 40) * 100);
            } else {
                $(".classcenter-chapter1 iframe").contents().find("video").trigger("play")
            }
            console.log(new Date().getTime(), $(".classcenter-chapter1 iframe").length, $(".classcenter-chapter1 iframe").contents().find(".layui-layer-content iframe").length)
        },5000);
        setTimeout(function(){
            $(".classcenter-chapter1 iframe").contents().find("video").on("timeupdate",function(){
                if(Math.ceil(this.currentTime) >= Math.ceil(this.duration)) {
                    //clearInterval(pppplay);
                    let flag = false;
                    $(".classcenter-chapter2 ul li").each(function(t){
                        console.log($(this).css("background-color") == "rgb(204, 197, 197)")
                        if ($(this).css("background-color") != "rgb(204, 197, 197)") {
                            if ($(this).find("span").text() != "[100%]") {
                                flag = true;
                                $(this).trigger("click");
                                return false;
                            }
                        }
                    });
                    if(!flag) {
                        clearInterval(pppplay);
                    }
                }
            })
        },8000);
    }
})();