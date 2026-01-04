// ==UserScript==
// @name         重庆专业技术人员继续教育公需科目
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  静音自动播放视频
// @author       hui
// @match        https://cqrl.21tb.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/451511/%E9%87%8D%E5%BA%86%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%85%AC%E9%9C%80%E7%A7%91%E7%9B%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/451511/%E9%87%8D%E5%BA%86%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%85%AC%E9%9C%80%E7%A7%91%E7%9B%AE.meta.js
// ==/UserScript==

(function () {
    var class_open_ok=false;
    var href_check=setInterval(function(){
        let hre = location.href;
        //课程页
        if (hre.includes("https://cqrl.21tb.com/nms-frontend/index.html#/org/courseDetail?roadMapId")) {
            if(document.querySelector(".progress-text").innerText!="100%"){
                document.getElementsByClassName("btn-item cursor")[2].click()//未完成
                setTimeout(function(){
                    var class_list=document.querySelector("#pane-MUST > div.text-box > div > span")//检测“必修”是否全部学完
                    if(class_list.innerText=="没有内容"){
                        document.querySelector("#tab-SELECTIVE").click();//点击“选修”
                        document.getElementsByClassName("btn-item cursor")[2].click()//未完成
                                                    }
                },2000)//第一个视频
                setTimeout(function(){
                    var class_video=document.querySelector("#pane-MUST > div > div > div:nth-child(1) > img")
                    if(class_video){class_video.click();class_open_ok=true;}
                },2000)//第一个视频
            }
            if(document.querySelector(".progress-text").innerText=="100%"){clearInterval(href_check)}
        }
        //成功点击后关闭页面
        if(class_open_ok){window.opener=null;window.open("about:blank","_top").close()}
        //视频页
        if (hre.includes("https://cqrl.21tb.com/els/html/courseStudyItem/courseStudyItem.learn.do")) {seevideo();clearInterval(href_check);}
        //选课页
        if (hre.includes("https://cqrl.21tb.com/nms-frontend/index.html#/org/course/list")) {choose_class()}
    },5000)

    function choose_class(){
        setTimeout(() => {
            //document.querySelector(".btn-item.cursor:nth-child(3)").click();
            //setTimeout(() => {
            //document.querySelector(".text-item.cursor").click();
            //}, 2000);
            var class_num=0
            for(var i=0;i<3;i++){
                var class_video_year=document.getElementsByClassName("num")[i]
               console.log(class_video_year)
                if(class_video_year!="100%"){
                    class_num=i;
                    console.log(class_num)
                    var class_video=document.querySelector("#searchBar > section > div > div.right-container > section > div.course__list--content > section:nth-child("+(class_num-1)+") > section > div:nth-child(1) > div > button.enter-btn")
                    if(class_video){class_video.click()}
                }
            }
        }, 3000);
    }


    function seevideo(){
        var iframe_choose
        var iframe
        var iframe2020
        var vid
        var dom
        var class_ok
        var class_num
        var issuccess=setInterval(function(){
            iframe = document.querySelector("#aliPlayerFrame");
            iframe2020 = document.querySelector("#iframe_aliplayer");
            if (iframe) {
                dom = iframe.contentWindow.document;
                class_ok=dom.getElementsByClassName("finish-tig").length
                class_num=dom.getElementsByClassName("section-title").length
                vid = dom.querySelector("#J_prismPlayer > video");
                var check_class_ok=setInterval(function(){
                    vid.playbackRate=2;//2倍速
                    vid.volume=0;//音量
                    var class_active=dom.querySelector(".first-line.active").getElementsByClassName("finish-tig")[0].innerText
                    if(class_active='已完成'){
                        class_ok=dom.getElementsByClassName("finish-tig").length
                        if(class_ok!=class_num){
                            dom.getElementsByClassName("section-title")[class_ok].click();
                        }
                        if(class_ok==class_num){
                            clearInterval(check_class_ok)
                            location.href="https://cqrl.21tb.com/nms-frontend/index.html#/org/course/list";
                        }
                    }
                },5000)
                if (vid) {
                    vid.muted = true;
                    if (vid.paused) {
                        vid.play();

                    }
                }
            }
           /* //2020年
            if(iframe2020){
                dom = iframe2020.contentWindow.document;
                var check_class2020_ok=setInterval(function(){
                    vid = dom.querySelector("video");
                    vid.playbackRate=2;//2倍速
                    vid.volume=0;//音量
                    if (vid) {
                    vid.muted = true;
                    if (vid.paused) {
                        vid.play();

                    }
                }
                    var class2020_active=document.querySelector("#courseItemId > ol > li > div > a > span").innerText
                    if(class2020_active=="【已完成】"||class2020_active=="【已学完】"){
                        location.href="https://cqrl.21tb.com/nms-frontend/index.html#/org/course/list";
                    }
                },5000)
                }*/
        },2000)
        }})();
