// ==UserScript==
// @name         专技天下
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  1.当视频播放超时建议休息时，自动点击确定，并且开始播放。2.播放完当前小节后，自动播放下一节。3.播放完当前课程后，自动播放下一课
// @author       goolete
// @match        https://*.zgzjzj.com/*
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435724/%E4%B8%93%E6%8A%80%E5%A4%A9%E4%B8%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/435724/%E4%B8%93%E6%8A%80%E5%A4%A9%E4%B8%8B.meta.js
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
                }else if(b == "100%;"){//完成一个视频，点击下一节
                    $("div.navigate > ul > li").children().eq(2).click();
                }
            }
        }, 3000);
    })
})();