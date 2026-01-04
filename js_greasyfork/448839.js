// ==UserScript==
// @name         2022年庆阳市专业技术人员继续教育刷课油猴脚本[3]（自动播放、自动点击“建议休息”确定、自动下一节、播放完当前课程后，自动播放下一课）
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  2022年庆阳市专业技术人员继续教育刷课油猴脚本[3]（1.当视频播放超时“建议休息”时，自动点击确定，并且开始播放；2.播放完当前小节后，自动播放下一节；3.播放完当前课程后，自动播放下一课。）
// @author       弱鸟
// @match        https://*.zgzjzj.com/*
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/448839/2022%E5%B9%B4%E5%BA%86%E9%98%B3%E5%B8%82%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%88%B7%E8%AF%BE%E6%B2%B9%E7%8C%B4%E8%84%9A%E6%9C%AC%5B3%5D%EF%BC%88%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E3%80%81%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E2%80%9C%E5%BB%BA%E8%AE%AE%E4%BC%91%E6%81%AF%E2%80%9D%E7%A1%AE%E5%AE%9A%E3%80%81%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E8%8A%82%E3%80%81%E6%92%AD%E6%94%BE%E5%AE%8C%E5%BD%93%E5%89%8D%E8%AF%BE%E7%A8%8B%E5%90%8E%EF%BC%8C%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E4%B8%8B%E4%B8%80%E8%AF%BE%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/448839/2022%E5%B9%B4%E5%BA%86%E9%98%B3%E5%B8%82%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%88%B7%E8%AF%BE%E6%B2%B9%E7%8C%B4%E8%84%9A%E6%9C%AC%5B3%5D%EF%BC%88%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E3%80%81%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E2%80%9C%E5%BB%BA%E8%AE%AE%E4%BC%91%E6%81%AF%E2%80%9D%E7%A1%AE%E5%AE%9A%E3%80%81%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E8%8A%82%E3%80%81%E6%92%AD%E6%94%BE%E5%AE%8C%E5%BD%93%E5%89%8D%E8%AF%BE%E7%A8%8B%E5%90%8E%EF%BC%8C%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E4%B8%8B%E4%B8%80%E8%AF%BE%EF%BC%89.meta.js
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
            $("video.vjs-tech").prop("muted",false);
            //console.log(b)
            if(document.querySelector('.el-progress-bar__inner').style.width == "98%"){
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
                        //console.log("ok")
           }else if($("div.el-message-box__wrapper").css("display")!=="none"){
                   $("div.el-message-box__btns").children("button.el-button").click()
                }
            }
        }, 3000);
    })
})();