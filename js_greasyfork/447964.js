// ==UserScript==
// @name         2022年庆阳市专业技术人员继续教育刷课油猴脚本（自动播放、自动点击“建议休息”确定、自动下一节）
// @namespace    https://www.zgzjzj.com/
// @version      2.0
// @description  2022年庆阳市专业技术人员继续教育刷课油猴脚本（自动播放、当视频播放超时建议休息时，自动点击确定，并且开始播放、监听到播放完当前小节后，自动播放下一节）
// @author       弱鸟
// @match        *://*.zgzjzj.com/*
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447964/2022%E5%B9%B4%E5%BA%86%E9%98%B3%E5%B8%82%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%88%B7%E8%AF%BE%E6%B2%B9%E7%8C%B4%E8%84%9A%E6%9C%AC%EF%BC%88%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E3%80%81%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E2%80%9C%E5%BB%BA%E8%AE%AE%E4%BC%91%E6%81%AF%E2%80%9D%E7%A1%AE%E5%AE%9A%E3%80%81%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E8%8A%82%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/447964/2022%E5%B9%B4%E5%BA%86%E9%98%B3%E5%B8%82%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%88%B7%E8%AF%BE%E6%B2%B9%E7%8C%B4%E8%84%9A%E6%9C%AC%EF%BC%88%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E3%80%81%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E2%80%9C%E5%BB%BA%E8%AE%AE%E4%BC%91%E6%81%AF%E2%80%9D%E7%A1%AE%E5%AE%9A%E3%80%81%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E8%8A%82%EF%BC%89.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    $(".vjs-big-play-button").click();
    setInterval(function(){
        if($(".vjs-play-progress").attr("style")){
           var a  = $(".vjs-play-progress").attr("style");
           var b = a.substring(7);
        }
        $("video.vjs-tech").prop("muted",true);
        //console.log(b)
        if($(".vjs-play-control").attr("title") == "Play"){
           $(".vjs-play-control").click();
           }else if(b == "100%;"){
           $("div.navigate > ul > li").children().eq(2).click();
               //console.log("ok")
           }else if($("div.el-message-box__wrapper").css("display")!=="none"){
                   $("div.el-message-box__btns").children("button.el-button").click()
         }
    }, 3000);
})();