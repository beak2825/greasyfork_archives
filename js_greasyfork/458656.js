// ==UserScript==
// @name         盐城工学院学习脚本-左手
// @namespace    http://tampermonkey.net/
// @version      23.01.22
// @description  打开视频播放页面课程
// @author       左手天才
// @match        https://yancheng.zgzjzj.com/secondary
// @match        https://yancheng.zgzjzj.com/learncenter/buycourse
// @match        https://yancheng.zgzjzj.com/learncenter/play?*
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458656/%E7%9B%90%E5%9F%8E%E5%B7%A5%E5%AD%A6%E9%99%A2%E5%AD%A6%E4%B9%A0%E8%84%9A%E6%9C%AC-%E5%B7%A6%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/458656/%E7%9B%90%E5%9F%8E%E5%B7%A5%E5%AD%A6%E9%99%A2%E5%AD%A6%E4%B9%A0%E8%84%9A%E6%9C%AC-%E5%B7%A6%E6%89%8B.meta.js
// ==/UserScript==
(function () {
    'use strict';
    infos()
    function infos(){
        var urlInfos = window.location.href.split("/");
        console.log("网址第一次处理后数据: "+urlInfos)
        var urlTip = urlInfos[urlInfos.length - 1].split("?")[0];
        if (window.location.href.indexOf("zgzjzj") != -1) {
            console.log("网址处理后数据: "+urlTip)
            if (urlTip == "play") {
                console.log("当前页面: 视频播放 ")
                Video()
            } else if (urlTip == "buycourse") {
                console.log("当前页面: 课程列表 ")
                Course ()
            } else if (urlTip == "secondary") {
                console.log("当前页面: 网站首页 ")
                Secondary ()

            }
        }
    };


    function Secondary(){
        setTimeout(function () {
            console.log("3")
            if(document.getElementsByClassName("userName")[0]){
                console.log("4")
                var len=document.getElementsByClassName("userName")[0].innerText.length;
                console.log("姓名长度"+len)
                while(len>10){
                    console.log("5")
                    console.log("姓名 "+document.getElementsByClassName("userName")[0].innerText)
                    location.href="https://yancheng.zgzjzj.com/learncenter/buycourse"
                    setTimeout(function () {
                        infos()
                    },5000)
                    return
                    break
                }
            }
            Secondary()
        },5000)
    };

    function Course(){

        setTimeout(function () {
            if(document.getElementsByClassName("buyCoure_typeName")[1]){
                document.getElementsByClassName("buyCoure_typeName")[1].click()
                Course1()
                return
            }
            Course()
        },3000);
    };

    function Course1(){

        setTimeout(function () {
            //如果第一个学习进度不等于100%，哪么就学习第一个课程
            var bfl = document.getElementsByClassName("progress_text")[0].innerText
            console.log(bfl)
            if(bfl != "100%") {
                console.log("发现未学课程，正在学习")
                document.getElementsByClassName('buyCourse_classStudy')[0].click()
                Video()
                return
            } else {
                console.log("课程已全部完成")
                return
            }
            Course1()
        },3000);

    };


    function Video(){
        console.log("当前页面: 视频播放页面 ")
        jQuery.noConflict(); // 将变量$的控制权让渡给给其他插件或库
        //循环开始
        jQuery(document).ready(() => {
            $(".vjs-big-play-button").click();
            var time = 3000
            setInterval(function() {
                if ($(".vjs-play-progress").attr("style")) {
                    var a = $(".vjs-play-progress").attr("style");
                    var b = a.substring(7);
                }
                $("video.vjs-tech").prop("muted", true);
                console.log(b)
                //检测是否有开始部分
                var img = document.querySelectorAll("img").length
                if(img>48){
                    setTimeout(function () {
                        for(var i = 0; i<=51 ; i++ ) {
                            console.log(i)
                            var src = document.querySelectorAll("img")[i].src
                            if (src === "https://yancheng.zgzjzj.com/static/img/playad.371b3f7.png"){
                                document.querySelectorAll("img")[i].click()
                                break
                            }
                        }
                    },15000)
                }

                var urlInfos = window.location.href.split("/");
                console.log("网址检测中 ")
                var urlTip = urlInfos[urlInfos.length - 1].split("?")[0];
                if (urlTip != "play") {
                    infos()
                }
                if (document.querySelector('.el-progress-bar__inner').style.width == "100%") {
                    console.log("本课程完成");
                    location.href="https://yancheng.zgzjzj.com/learncenter/buycourse"
                    setTimeout(function () {
                        infos()
                    },5000)
                    var list_menu = $(".swiper-slide");
                    //console.log(list_menu)
                    var list_length = list_menu.length;
                    //console.log(list_length)
                    for (var i = 0; i < list_length; i++) {
                        if (list_menu[i].className.includes("active")) {
                            console.log("active");
                            document.querySelectorAll('.el-image__inner')[i + 1].click();
                            //jQuery(".image__inner")[i+1].click();
                        }
                    }
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
            }, 5000);
        })
    }

    // Your code here...
})();