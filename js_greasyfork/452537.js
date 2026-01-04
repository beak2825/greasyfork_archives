// ==UserScript==
// @name         专技天下-星亚科技版
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  1.当视频播放超时建议休息时，自动点击确定，并且开始播放。2.播放完当前小节后，自动播放下一节。3.播放完当前课程后，自动播放下一课
// @author       XY-Technology
// @match        https://*.zgzjzj.com/*
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452537/%E4%B8%93%E6%8A%80%E5%A4%A9%E4%B8%8B-%E6%98%9F%E4%BA%9A%E7%A7%91%E6%8A%80%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/452537/%E4%B8%93%E6%8A%80%E5%A4%A9%E4%B8%8B-%E6%98%9F%E4%BA%9A%E7%A7%91%E6%8A%80%E7%89%88.meta.js
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
                    //current_video.playbackRate = 0.9
                }else if(b == "100%;"){//完成一个视频，点击下一节
                    $("div.navigate > ul > li").children().eq(2).click();
                }else if($("div.el-message-box__wrapper").css("display")!=="none"){
                   $("div.el-message-box__btns").children("button.el-button").click()
         }
            }
        }, 3000);
    })
})();