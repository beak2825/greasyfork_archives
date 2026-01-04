// ==UserScript==
// @name         HTM刷课脚本
// @namespace    youzhu
// @license      MIT
// @version      1.0
// @description  自动挂课脚本
// @author       none
// @match        *.zjttv.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zjttv.cn
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/448034/HTM%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/448034/HTM%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

// 这里是课程id,请打开课程列表查看url后面的id, 并填写进去，本人不是计算机专业，暂时只能做到自动点击播放过程中的弹窗
//1、打开课程列表，复制课程id, 侯然填入到下面脚本的classId后面，
//2，然后启动脚本，打开课程列表，就开始自动刷课了，最好不要关闭窗口和让窗口失去焦点

var classId = "2127";

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
                  location.href = "http://xinguo.zjttv.cn/class/catalog?id="+classId;
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
        },3000);
    });
})();