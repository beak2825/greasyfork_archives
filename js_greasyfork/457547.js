// ==UserScript==
// @name         专技天下-测试版
// @namespace    http://tampermonkey.net/
// @version      23.01.03
// @description  打开视频播放页面课程
// @author       左手天才
//进入视频播放
// @match        https://yancheng.zgzjzj.com/learncenter/play?*
//进入课程列表
// @match        https://yancheng.zgzjzj.com/learncenter/buycourse
//进入首页
// @match        https://yancheng.zgzjzj.com/secondary
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/457547/%E4%B8%93%E6%8A%80%E5%A4%A9%E4%B8%8B-%E6%B5%8B%E8%AF%95%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/457547/%E4%B8%93%E6%8A%80%E5%A4%A9%E4%B8%8B-%E6%B5%8B%E8%AF%95%E7%89%88.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var k=0
    var urlInfos = window.location.href.split("/");
    var urlTip = urlInfos[urlInfos.length - 1].split("?")[0];
    if (window.location.href.indexOf("zgzjzj") != -1) {

        if (urlTip == "play") {
            console.log("当前页面: 视频播放 ")
            ShiPinBoFang ()
        } else if (urlTip == "buycourse") {
            console.log("当前页面: 课程列表 ")
            KeChengLieBiao ()
        }
    }


    function KeChengLieBiao() {
        //等待10秒按公需课按钮
        setTimeout(function () {
            document.getElementsByClassName('buyCoure_typeName')[1].click()
        },5000)

        setTimeout(function () {
            //如果第一个学习进度不等于100%，哪么就学习第一个课程
            var bfl = document.getElementsByClassName("progress_text")[0].innerText
            console.log(bfl)
            if(bfl != "100%") {
                console.log("999")
                document.getElementsByClassName('buyCourse_classStudy')[0].click()
                ShiPinBoFang ()
            } else {
                console.log("课程已全部完成")
            }

        },10000)

    };


    function ShiPinBoFang() {
        console.log("当前页面: 视频播放页面 ")
        jQuery.noConflict(); // 将变量$的控制权让渡给给其他插件或库
        //循环开始

        jQuery(document).ready(() => {
            $(".vjs-big-play-button").click();
            setInterval(function() {
                if ($(".vjs-play-progress").attr("style")) {
                    var a = $(".vjs-play-progress").attr("style");
                    var b = a.substring(7);
                }
                $("video.vjs-tech").prop("muted", true);
                //console.log(b)
                if (document.querySelector('.el-progress-bar__inner').style.width == "100%") {
                    console.log("本课程完成");
                    location.href="https://yancheng.zgzjzj.com/learncenter/buycourse"
                    setTimeout(function () {
                        reload()
                    },5000)
                    //                         var list_menu = $(".swiper-slide");
                    //                         //console.log(list_menu)
                    //                         var list_length = list_menu.length;
                    //                         //console.log(list_length)
                    //                         for (var i = 0; i < list_length; i++) {
                    //                             if (list_menu[i].className.includes("active")) {
                    //                                 console.log("active");
                    //                                 document.querySelectorAll('.el-image__inner')[i + 1].click();
                    //                                 //jQuery(".image__inner")[i+1].click();
                    //                             }
                    //                         }
                } else {
                    if ($(".vjs-play-control").attr("title") == "Play") { //自动播放
                        $(".vjs-play-control").click();
                        //current_video.playbackRate = 0.9
                    } else if (b == "100%;") { //完成一个视频，点击下一节
                        $("div.navigate > ul > li").children().eq(2).click();
                    } else if ($("div.el-message-box__wrapper").css("display") !== "none") {
                        $("div.el-message-box__btns").children("button.el-button").click();
                    }
                }
            }, 3000);
        })
    }



    // Your code here...
})();