// ==UserScript==
// @name         2023年QY市专业技术人员继续教育学习油猴脚本（堪称完美，一键开启，一路绿灯，一气呵成。没有做不到，只有想不到！）
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  2023年QY市专业技术人员继续教育学习油猴脚本（1.当视频播放超时“建议休息”时，自动点击确定，并且开始播放；2.循环播放当前课程某一小节，直至该课程完成；3.当前课程完成后，自动播放下一个课程。）
// @author       弱鸟
// @match        https://*.zgzjzj.com/*
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/449742/2023%E5%B9%B4QY%E5%B8%82%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%AD%A6%E4%B9%A0%E6%B2%B9%E7%8C%B4%E8%84%9A%E6%9C%AC%EF%BC%88%E5%A0%AA%E7%A7%B0%E5%AE%8C%E7%BE%8E%EF%BC%8C%E4%B8%80%E9%94%AE%E5%BC%80%E5%90%AF%EF%BC%8C%E4%B8%80%E8%B7%AF%E7%BB%BF%E7%81%AF%EF%BC%8C%E4%B8%80%E6%B0%94%E5%91%B5%E6%88%90%E3%80%82%E6%B2%A1%E6%9C%89%E5%81%9A%E4%B8%8D%E5%88%B0%EF%BC%8C%E5%8F%AA%E6%9C%89%E6%83%B3%E4%B8%8D%E5%88%B0%EF%BC%81%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/449742/2023%E5%B9%B4QY%E5%B8%82%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%AD%A6%E4%B9%A0%E6%B2%B9%E7%8C%B4%E8%84%9A%E6%9C%AC%EF%BC%88%E5%A0%AA%E7%A7%B0%E5%AE%8C%E7%BE%8E%EF%BC%8C%E4%B8%80%E9%94%AE%E5%BC%80%E5%90%AF%EF%BC%8C%E4%B8%80%E8%B7%AF%E7%BB%BF%E7%81%AF%EF%BC%8C%E4%B8%80%E6%B0%94%E5%91%B5%E6%88%90%E3%80%82%E6%B2%A1%E6%9C%89%E5%81%9A%E4%B8%8D%E5%88%B0%EF%BC%8C%E5%8F%AA%E6%9C%89%E6%83%B3%E4%B8%8D%E5%88%B0%EF%BC%81%EF%BC%89.meta.js
// ==/UserScript==
(function() {
    'use strict';
    jQuery.noConflict(); // 将变量$的控制权让渡给给其他插件或库
 
    jQuery(document).ready(function () {
        $(".vjs-big-play-button").click();
        setInterval(function(){
            if($(".vjs-play-progress").attr("style")){
                var a = $(".vjs-play-progress").attr("style");
                var b = a.substring(7);
            }
            $("video.vjs-tech").prop("muted",true);
            //console.log(b)
            if(document.querySelector('.el-progress-bar__inner').style.width == "100%"){
                var list_menu = $(".swiper-slide");
                //console.log(list_menu)
                var list_length = list_menu.length;
                //console.log(list_length)
                for(var i = 0;i<list_length;i++){
                    if(list_menu[i].className.includes("active")){
                        console.log("active");
                        document.querySelectorAll('.el-image__inner')[i+1].click();
                        //jQuery(".image__inner")[i+1].click();
                    }
                }
            }else{
                if($(".vjs-play-control").attr("title") == "Play"){//自动播放
                    $(".vjs-play-control").click();
                 }else if($(".vjs-play-control").attr("title") == "Replay"){//重新播放
                    $(".vjs-play-control").click();
                        //console.log("ok")
           }else if($("div.el-message-box__wrapper").css("display")!=="none"){
                   $("div.el-message-box__btns").children("button.el-button").click()
                }
            }
        }, 3000);
    })
})();