// ==UserScript==
// @name         新国开答题脚本
// @namespace    http://tampermonkey.net/
// @version      0.27
// @description  学习新思想，争做新青年！
// @author       DMC52859
// @match        https://lms.ouchn.cn/exam/*
// @match        https://lms.ouchn.cn/course/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ouchn.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/454680/%E6%96%B0%E5%9B%BD%E5%BC%80%E7%AD%94%E9%A2%98%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/454680/%E6%96%B0%E5%9B%BD%E5%BC%80%E7%AD%94%E9%A2%98%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var jsonData;
    // setTimeout(function(){
    //     jsonData = func()
    //     console.log(jsonData)
    //     console.log('调用成功')
    //  },3000)
     window.addEventListener('load',function(){
        var test_url = window.location.href
        // console.log(test_url)
        if(test_url.includes('learning-activity#/exam')){
            console.log('这是考试结束界面')
            window.open(localStorage.getItem("URL"),'_selft')
        }
        var class_url = window.location.href
        if(class_url.includes('full-screen')){
            console.log('这是刷课界面')
            localStorage.setItem("URL",class_url)
        }
        let fun = function(){
            var file = document.getElementsByClassName('file-name ng-binding')
            var test = document.getElementsByClassName('button button-green take-exam ng-scope')
            var next = document.getElementsByClassName('next-btn ivu-btn ivu-btn-default')[0]
            var content = document.getElementsByClassName('activity-content-bd material-box')
            // console.log(next)
            //var audio = document.querySelectorAll("#root > div > section > div > div > div > div > div:nth-child(2) > section > div > div > div > div > div > div > div.render-detail-article-content > div.render-detail-content.cke-mode > div > audio")
            if(file.length>0 && content.length>0){
                // console.log('这是文件')
                document.getElementsByClassName('font font-table-edit-view')[0].click()
                try{
                    var video1 = document.getElementsByTagName('video')[0]
                    video1.play();
                    video1.muted = true;
                    setTimeout("document.getElementsByClassName('font font-close')[0].click()", 5000)
                    next.click();
                }catch(error){
                    console.log(error)
                    setTimeout("document.getElementsByClassName('font font-close')[0].click()", 5000)
                    next.click();
                }
            }else if($('video').length>0){
                // console.log('这是视频')
                var video = document.getElementsByTagName('video')[0];
                var start = document.getElementsByClassName('mvp-fonts mvp-fonts-play')[0]
                console.log(start)
                var time = video.duration // 视频总时长
                var currenttime = video.currentTime // 当前时长
                video.play()
                // var control_btn = document.querySelector("#multi-player-d345b19d-d118-40cb-9dc3-466beafafc02 > div > div > div > div.mvp-replay-player-all-controls > div.mvp-controls-left-area > button > i")
                if(document.querySelector('video').paused){
                        // control_btn.click()
                        // video.play()
                        start.click()
                        video.playbackRate = 1 ; //控制视频播放速度：2倍速
                        video.muted = true;
                        if(currenttime == time){
                            document.getElementsByClassName('next-btn ivu-btn ivu-btn-default')[0].click();
                        }
                    }else if(document.querySelector('video').played){
                        start.click()
                        video.playbackRate = 1 ; //控制视频播放速度：2倍速
                        video.muted = true;
                        if(currenttime == time){
                        document.getElementsByClassName('next-btn ivu-btn ivu-btn-default')[0].click();
                        }
                    }
            }else if(test.length>0){
                //console.log('进入考试')
                if(document.querySelectorAll("body > div.wrapper > div.main-content.gtm-category > div:nth-child(9) > div > div.activity-area.clearfix.exam-area > div.activity-content-wrapper > div.___content > div > div > div > div > div > div:nth-child(1) > div > div.bd > div.submission-list.exam-area.ng-scope > div > ul > li:nth-child(1)").length<1){
                    setTimeout(function(){
                        try{
                            document.getElementsByName('confirm')[0].click();
                            document.getElementsByClassName('button button-green medium ng-binding')[0].click();
                        }catch(error){
                            next.click();
                        }
                    },8000)
                }else if(document.querySelectorAll("body > div.wrapper > div.main-content.gtm-category > div:nth-child(9) > div > div.activity-area.clearfix.exam-area > div.activity-content-wrapper > div.___content > div > div > div > div > div > div:nth-child(1) > div > div.bd > div.submission-list.exam-area.ng-scope > div > ul > li:nth-child(1)").length>=1){
                    document.getElementsByClassName('next-btn ivu-btn ivu-btn-default')[0].click();
                }
                //next.click();
            }else if(document.querySelectorAll("body > div.wrapper > div.main-content.gtm-category > div.content-under-nav-2.with-loading.exam-activity-container.ng-scope > div.bd > div > div > div.exam-area-content > div > div.paper-content.card > div").length>0){
                //console.log('开始考试')
                $('.exam-subjects ol li').each(function(){
                        var self1 = $(this)
                        var classname = self1.attr('class')
                        //console.log(classname)
                        if(classname == 'subject ng-scope single_selection'){
                            console.log('这是单选题')
                            // 获取题目
                            var q1 = self1.children('div').children('div').children('div').children('span').children('p')
                            var que1 = q1.text().replace(/[–!.?&\|\\\*^%$#@\-_—。，“”"" 【】→（  ）、()­？：\s+]/g,"")
                            console.log(que1)
                            // 获取JSON答案
                            var da_an1 = jsonData[que1]
                            console.log('答案：'+da_an1)
                            // 获取选项
                            var xuanxiang1;
                            if(self1.children('div').children('div').eq(1).children('ol').children('li').children('label').children('div').children('span').children('p').length==0){
                                xuanxiang1 = self1.children('div').children('div').eq(1).children('ol').children('li').children('label').children('div').children('span')
                            }else{
                                xuanxiang1 = self1.children('div').children('div').eq(1).children('ol').children('li').children('label').children('div').children('span').children('p')
                            }
                            //var xx = self1.children('div').children('div').eq(1).children('ol').children('li')
                            var ans1 = [];
                            for(var i=0;i<xuanxiang1.length;i++){
                                ans1[i] = xuanxiang1[i].innerText.replace(/[，、,''""‘’“”.。|\n\s+]/g,"")
                                console.log(ans1[i])
                            }
                            for(var a=0;a<ans1.length;a++){
                                // console.log(ans1[a])
                                if(ans1[a] == da_an1){
                                    console.log('匹配成功')
                                    var xx1 = self1.children('div').children('div').eq(1).children('ol').children('li').children('label')[a]
                                    xx1.click();
                                    console.log(xx1)
                                }
                            }
                        }else if(classname == 'subject ng-scope multiple_selection'){
                            console.log('这是多选题')
                            // 获取题目
                            var q2 = self1.children('div').children('div').children('div').children('span').children('p')
                            console.log(q2)
                            var que2 = q2.text().replace(/[–!.?&\|\\\*^%$#@\-_—。，“”"" 【】→（  ）、()­？：\s+]/g,"")
                            console.log(que2)
                            var da_an2 = jsonData[que2]
                            console.log(da_an2)
                            var xuanxiang2;
                            if(self1.children('div').children('div').eq(1).children('ol').children('li').children('label').children('div').children('span').children('p').length==0){
                                xuanxiang2 = self1.children('div').children('div').eq(1).children('ol').children('li').children('label').children('div').children('span')
                            }else{
                                xuanxiang2 = self1.children('div').children('div').eq(1).children('ol').children('li').children('label').children('div').children('span').children('p')
                            }
                            // var xuanxiang2 = self1.children('div').children('div').eq(1).children('ol').children('li').children('label').children('div').children('span').children('p')
                            console.log(xuanxiang2)
                            var ans2 = []
                            for(var b=0;b<xuanxiang2.length;b++){
                                ans2[b] = xuanxiang2[b].innerText.replace(/[，、,''""‘’“”.。|\n\s+]/g,"")
                                console.log(ans2[b])
                                var reg = new RegExp(ans2[b])
                                if(reg.test(da_an2)){
                                    console.log('匹配成功')
                                    var xx2 = self1.children('div').children('div').eq(1).children('ol').children('li').children('label')[b]
                                    xx2.click();
                                }else{
                                    console.log('匹配失败')
                                }
                            }

                        }else if(classname == 'subject ng-scope true_or_false'){
                            console.log('这是判断题')
                            // 获取题目
                            var q3 = self1.children('div').children('div').children('div').children('span').children('p')
                            console.log(q3)
                            var que3 = q3.text().replace(/[–!.?&\|\\\*^%$#@\-_—。，“”"" 【】→（  ）、()­？：\s+]/g,"")
                            console.log(que3)
                            // 获取答案
                            var da_an3 = jsonData[que3]
                            console.log(da_an3)
                            // 获取选项
                            var xuanxiang3 = self1.children('div').children('div').eq(1).children('ol').children('li').children('label').children('div').children('span')
                            console.log(xuanxiang3)
                            var ans3 = []
                            for(var c=0;c<xuanxiang3.length;c++){
                                ans3[c] = xuanxiang3[c].innerText.replace(/[，、,''""‘’“”.。|\n\s+]/g,"")
                                console.log(ans3[c])
                            }
                            for(var d=0;d<ans3.length;d++){
                                if(ans3[d]==da_an3){
                                    console.log('匹配成功')
                                    var xx3 = self1.children('div').children('div').eq(1).children('ol').children('li').children('label')[d]
                                    console.log(xx3)
                                    xx3.click()
                                }else{
                                    //console.log('匹配失败')
                                }
                            }

                        }
                    })
                    //document.querySelector("body > div.wrapper > div.main-content.gtm-category > div.content-under-nav-2.with-loading.exam-activity-container.ng-scope > div.bd > div > div > div.exam-area-content > div > div.paper-footer > a")
                    setTimeout(function(){
                        // document.querySelector("#submit-exam-confirmation-popup > div > div.popup-footer > div > button.button.button-green.medium").click();
                    },3000)
                //next.click();
            }else{
                next.click();
            }
        }
        setInterval(function(){
            fun();
        }, 5000)
        var status = this.document.getElementsByClassName('toast-message')
        setInterval(function(){
            if(status.length>0){
                status[0].click()
            }
        })
    })
})();