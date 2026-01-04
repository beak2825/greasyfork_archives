// ==UserScript==
// @name         填写答案不提交脚本
// @namespace    http://tampermonkey.net/
// @version      8.1
// @description  学习新思想
// @author       JWZ
// @match        https://lms.ouchn.cn/exam/*
// @match        https://lms.ouchn.cn/course/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ouchn.cn
// @require      https://greasyfork.org/scripts/467010-%E9%A2%98%E5%BA%93/code/%E9%A2%98%E5%BA%93.js?version=1211199
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/468331/%E5%A1%AB%E5%86%99%E7%AD%94%E6%A1%88%E4%B8%8D%E6%8F%90%E4%BA%A4%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/468331/%E5%A1%AB%E5%86%99%E7%AD%94%E6%A1%88%E4%B8%8D%E6%8F%90%E4%BA%A4%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var jsonData;
    setTimeout(function(){
        jsonData =func()
        const jsonlength = Object.keys(jsonData).length;
        console.log(jsonlength);
        // console.log(jsonData)
        console.log('调用成功')
    },3000)
    window.addEventListener('load',function(){
        var test_url = window.location.href
        console.log(test_url)
        if(test_url.includes('learning-activity#/exam')){
            console.log('这是考试结束界面')
            window.open(localStorage.getItem("URL"),'_self')
        }
        var class_url = window.location.href
        if(class_url.includes('full-screen')){
            console.log('这是刷课界面')
            localStorage.setItem("URL",class_url)
        }
        let fun = function(){
            var file = document.getElementsByClassName('file-name ng-binding')
            var test = document.getElementsByClassName('button button-green take-exam ng-scope')
            var next = document.getElementsByClassName('next ng-binding ng-scope')[0]
            var content = document.getElementsByClassName('activity-content-bd material-box')
            var popbox = document.getElementsByClassName('reveal-modal prerequisites-confirmation-popup popup-area popup-480 ng-scope open')
            //var audio = document.querySelectorAll("#root > div > section > div > div > div > div > div:nth-child(2) > section > div > div > div > div > div > div > div.render-detail-article-content > div.render-detail-content.cke-mode > div > audio")
            if(file.length>0 && content.length>0){
                //console.log('这是文件')
                document.getElementsByClassName('font font-table-edit-view')[0].click()
                try{
                    var video1 = document.getElementsByTagName('video')[0]
                    video1.play();
                    video1.muted = true;
                    setTimeout("document.getElementsByClassName('font font-close')[0].click()", 5000)
                    next.click();
                }catch(error){
                    setTimeout("document.getElementsByClassName('font font-close')[0].click()", 5000)
                    next.click();
                }
            }else if($('video').length>0){
                //console.log('这是视频')
                var video = document.getElementsByTagName('video')[0];
                var time = video.duration // 视频总时长
                var currenttime = video.currentTime // 当前时长
                if(document.querySelector('video').paused){
                    try{
                    document.getElementsByClassName('mvp-fonts mvp-fonts-play')[0].click();
                    }catch(error){
                    document.getElementsByClassName('mvp-fonts mvp-fonts-pause')[0].click();
                    }
                    video.playbackRate = 16 ; //控制视频播放速度：2倍速
                    video.muted = true;
                    if(currenttime == time){
                        document.getElementsByClassName('next ng-binding ng-scope')[0].click();
                    }
                }else if(document.querySelector('video').played){
                    if(currenttime == time){
                        document.getElementsByClassName('next ng-binding ng-scope')[0].click();
                    }
                }
            }else if(test.length>0){
                //console.log('进入考试')
                if(document.querySelectorAll("body > div.wrapper > div.main-content.gtm-category > div:nth-child(9) > div > div.activity-area.clearfix.exam-area > div.activity-content-wrapper > div.___content > div > div > div > div > div > div:nth-child(1) > div > div.bd > div.submission-list.exam-area.ng-scope > div > ul > li:nth-child(1)").length<1){
                            var class_url = window.location.href
                            if(class_url.includes('full-screen')){
                                console.log('这是刷课界面')
                                localStorage.setItem("URL",class_url)
                            }
                    setTimeout(function(){
                        try{
                            document.getElementsByName('confirm')[0].click();
                            document.getElementsByClassName('button button-green medium ng-binding')[0].click();
                        }catch(error){
                            next.click();
                        }
                    },8000)
                }else if(document.querySelectorAll("body > div.wrapper > div.main-content.gtm-category > div:nth-child(9) > div > div.activity-area.clearfix.exam-area > div.activity-content-wrapper > div.___content > div > div > div > div > div > div:nth-child(1) > div > div.bd > div.submission-list.exam-area.ng-scope > div > ul > li:nth-child(1)").length>=1){
                    document.getElementsByClassName('next ng-binding ng-scope')[0].click();
                }
                //next.click();
            }else if(popbox.length>0){
                location.reload();
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
                            ans1[i] = xuanxiang1[i].innerText.replace(/[，、,''""‘’“”.。|\n\s+]/g,"").replace(/（/g,"(").replace(/）/g,")")
                            console.log(ans1[i])
                        }
                        for(var a=0;a<ans1.length;a++){
                            // console.log(ans1[a])
                            try{
                            if(ans1[a] == da_an1){
                                console.log('匹配成功')
                                var xx1 = self1.children('div').children('div').eq(1).children('ol').children('li').children('label')[a]
                                xx1.click();
                                console.log(xx1);
                            }
                            }catch(error){console.log(error)}
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
                            ans2[b] = xuanxiang2[b].innerText.replace(/[，、,''""‘’“”.。|\n\s+]/g,"").replace(/（/g,"(").replace(/）/g,")")
                            console.log(ans2[b])
                            try{
                            var reg = new RegExp(ans2[b])
                            if(reg.test(da_an2)){
                                console.log('匹配成功')
                                var xx2 = self1.children('div').children('div').eq(1).children('ol').children('li').children('label')[b]
                                xx2.click();
                            }else{
                                console.log('匹配失败')
                            }
                            }catch(error){console.log(error)}
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
                            ans3[c] = xuanxiang3[c].innerText.replace(/[，、,''""‘’“”.。|\n\s+]/g,"").replace(/（/g,"(").replace(/）/g,")")
                            console.log(ans3[c])
                        }
                        for(var d=0;d<ans3.length;d++){
                            try{
                            if(ans3[d]==da_an3){
                                console.log('匹配成功')
                                var xx3 = self1.children('div').children('div').eq(1).children('ol').children('li').children('label')[d]
                                xx3.click();
                            }else{
                                //console.log('匹配失败')
                            }
                            }catch(error){console.log(error)}
                        }

                    }else if(classname == 'subject ng-scope cloze'){
                        console.log('这是完型填空题')
                        // 获取题目
                        self1.find("select").each(function(){
                            var que4 = $(this).attr("id")
                            console.log(que4)
                            try{
                            var da_an4 = jsonData[que4];
                            console.log(da_an4)
                            $(`input[value="${da_an4}"]`).click();
                            }catch(error){console.log(error)}
                        })

                    }else if(classname == 'subject ng-scope short_answer'){
                        console.log('这是简答题')
                        // 获取题目
                        var q5 = self1.find(".summary-title").find("p")
                        console.log(q5)
                        var que5 = q5.text().replace(/[–!.?&\|\\\*^%$#@\-_—。，“”"" 【】→（  ）、()­？：\s+]/g,"")
                        console.log(que5)
                        var da_an5 = jsonData[que5]
                        console.log(da_an5)
                        if (da_an5!=undefined){
                            // 获取Simditor编辑器实例
                            var simditorInstance = self1.find('textarea.short-answer-take').data('simditor');
                            // 设置编辑器的内容
                            simditorInstance.setValue(da_an5);
                        }
                    }
                    // else if(classname == 'subject ng-scope fill_in_blank'){
                    //     console.log('这是填空题')
                    //     // 获取题目
                    //     var q6 = self1.find(".summary-title").find("p")
                    //     console.log(q6)
                    //     var que6 = q6.text().replace(/[–!.?&\|\\\*^%$#@\-_—。，“”"" 【】→（  ）、()­？：\s+]/g,"")
                    //     console.log(que6)
                    //     var da_an6 = jsonData[que6]
                    //     console.log(da_an6)
                    //     if (da_an6!=undefined){
                    //         // 获取Simditor编辑器实例
                    //         var element = self1.find('var'); // 获取节点
                    //         element.focus(); // 焦点聚焦到节点
                    //         element.textContent = da_an6; // 设置节点的文本内容
                    //         var event = new Event('input', { bubbles: true }); // 创建一个input事件
                    //         element.dispatchEvent(event); // 触发input事件，模拟键盘输入
                    // }
                    // }

                })
                //next.click();
            }else{
                next.click();
            }
        }
        setInterval(function(){
            try{
            document.querySelector("#prerequisites-confirmation-popup-online_video-40001608004 > div > div.popup-footer > div > button").click();
            }catch(error){}
            fun();
        }, 8000)
    })
})();