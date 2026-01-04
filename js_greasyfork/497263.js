// ==UserScript==
// @name         *2024版继续教育*全国高校教师网络培训中心-自动刷课
// @namespace    https://onlinenew.enetedu.com/
// @version      1.1
// @description  适用于网址是 https://onlinenew.enetedu.com/ 的网站自动刷课，自动点击播放，检查当前视频是否已经是播放完毕的，当前视频播放完成的则自动播放下一个视频，列表播放完毕后自动返回目录。
// @author       Praglody,vampirehA
// @match        onlinenew.enetedu.com/*/MyTrainCourse/*
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/497263/%2A2024%E7%89%88%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%2A%E5%85%A8%E5%9B%BD%E9%AB%98%E6%A0%A1%E6%95%99%E5%B8%88%E7%BD%91%E7%BB%9C%E5%9F%B9%E8%AE%AD%E4%B8%AD%E5%BF%83-%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/497263/%2A2024%E7%89%88%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%2A%E5%85%A8%E5%9B%BD%E9%AB%98%E6%A0%A1%E6%95%99%E5%B8%88%E7%BD%91%E7%BB%9C%E5%9F%B9%E8%AE%AD%E4%B8%AD%E5%BF%83-%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function randomNum(minNum, maxNum) {
        return Math.floor(Math.random() * (maxNum - minNum + 1) + minNum);
    }
    window.onload = function() {
        let pageTitle=document.title;
        console.log(pageTitle);
        if(pageTitle=="课程学习"){
            let pppplay = setInterval(function() {
                let iframe = $(".classcenter-chapter1 iframe").contents();
                if (iframe.find(".layui-layer-content iframe").length > 0) {
                    setTimeout(function() {
                        console.log("点击确定按钮。");
                        iframe.find(".layui-layer-content iframe").contents().find("#questionid~div button").trigger("click");
                    }, randomNum(15, 40) * 100);
                } else {
                    console.log("开始播放");
                    iframe.find("video").trigger("play");
                }
                console.log(new Date().getTime(), iframe.length, iframe.find(".layui-layer-content iframe").length);
            }, 5000);

            setTimeout(function() {
                let iframe = $(".classcenter-chapter1 iframe").contents();
                iframe.find("video").on("timeupdate", function() {

                    if (Math.ceil(this.currentTime) >= Math.ceil(this.duration)) {
                        let flag = false;
                        $(".classcenter-chapter2 ul li").each(function() {
                            if ($(this).css("background-color") !== "rgb(204, 197, 197)") {
                                if ($(this).find("span").text() !== "[100%]") {
                                    flag = true;
                                    $(this).trigger("click");
                                    return false;
                                }
                            }
                        });
                        if (!flag) {
                            clearInterval(pppplay);
                        }
                    }
                    else{
                        //播放中的视频检查是否是100%进度的
                        let clickNextFlag=false;
                        let clickRedBtn=false;
                        $(".classcenter-chapter2 ul li").each(function() {

                            if ($(this).css("background-color") == "rgb(204, 197, 197)" && $(this).find("span").text() == "[100%]") {
                                clickNextFlag = true;
                                clickRedBtn=true;
                            }
                            if ($(this).css("background-color") !== "rgb(204, 197, 197)" && $(this).find("span").text() !== "[100%]" && clickNextFlag == true) {
                                clickNextFlag=false;
                                clickRedBtn=false;
                                $(this).trigger("click");
                                console.log("这个视频看完了，继续下一个未完成视频。");
                                return false;
                            }
                        });

                        if(clickRedBtn==true){
                            $(".buttonmore-red").attr();
                            console.log("看完了这个课程，返回课程目录。");
                        }
                    }
                });
            }, 8000);
        }
        else if (pageTitle=="课单-课程列表"){
            $(".per-class2 dl").each(function() {
                let classStatusSpan=$($(this).find("dd span")[0]).html();
                console.log(classStatusSpan);
                if(classStatusSpan=="学习中"){
                    let classLink="https://onlinenew.enetedu.com/"+$($(this).find("dt a")[0]).attr("href");
                    window.location.href=classLink;
                }


            });
        }
    };
})();