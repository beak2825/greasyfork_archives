// ==UserScript==
// @name         艾迪学堂云学院
// @namespace    laowang
// @license      MIT
// @version      0.1
// @description  艾迪学堂云学院 自动挂课脚本
// @author       none
// @match        *.zjttv.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zjttv.cn
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/447685/%E8%89%BE%E8%BF%AA%E5%AD%A6%E5%A0%82%E4%BA%91%E5%AD%A6%E9%99%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/447685/%E8%89%BE%E8%BF%AA%E5%AD%A6%E5%A0%82%E4%BA%91%E5%AD%A6%E9%99%A2.meta.js
// ==/UserScript==

// 这里是课程id,请打开课程列表查看url后面的id, 并填写进去，
var classId = "xxxx";

(function() {
    'use strict';

    $(function(){
        console.clear();
        setInterval(function (){
            console.log("脚本运行中");
            // 判断弹窗,如果有，则点击确定按钮
            var btn = $(".okBtn.ant-btn:visible")[0];
            if(btn){
                console.log("发现弹窗");
                btn.click();
                var video = $("video")[0];
                if(video && video.ended){
                  console.log("播放结束");
                  location.href = "http://ymxx.zjttv.cn/class/catalog?id="+classId;
                }
            }else{
              var v1 = $("video")[0];
                if(v1){
                    // 如果发现暂停则播放
                    if(v1.paused){
                        console.log("尝试播放");
                        v1.play();
                        //$(video).click();
                        $(".prism-big-play-btn").click();
                    }
                }
            }
            var progress = $(".classes-wrap .classes-item .progress:visible span:last-child");
            if(progress){
                // 课程列表
                var notFound = false;
                for(var i = 0; i < progress.length; i ++){
                    console.log($(progress[i]).text());
                    if($(progress[i]).text() != "已完成" ){
                        console.log("发现未学习");
                        notFound = false;
                        $(progress[i]).parent().parent().parent().click();
                        break;
                    }
                    notFound = true;
                }
                if(notFound){
                    window.scrollTo(0, document.body.scrollHeight);
                }
            }

            var gobtn = $(".go-btn-wrap:visible button:visible")[0];
            if(gobtn){
                console.log("点击去学习");
                $(gobtn).click();
            }
        },3000);
    });
})();