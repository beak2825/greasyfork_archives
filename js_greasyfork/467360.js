// ==UserScript==
// @name         自动提交脚本
// @namespace    http://tampermonkey.net/
// @version      245.24
// @description  学习新思想
// @author       JWZ
// @match        https://lms.ouchn.cn/exam/*
// @match        https://lms.ouchn.cn/course/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ouchn.cn
// @grant        GM_getResourceText
// @resource myTxt http://192.168.1.5:8000/lygk浏览器用的题库新.json
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/467360/%E8%87%AA%E5%8A%A8%E6%8F%90%E4%BA%A4%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/467360/%E8%87%AA%E5%8A%A8%E6%8F%90%E4%BA%A4%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var jsonData;
    setTimeout(function(){
        let txt = GM_getResourceText('myTxt');
        // console.log(txt);
        jsonData = JSON.parse(txt);
        const jsonlength = Object.keys(jsonData).length;
        console.log(jsonlength);
        // console.log(jsonData)
        console.log('调用成功')
    },3000)
    function parseque(descendantNodes){
        var srcList = descendantNodes.map(node => {
            var src = node.getAttribute('src');
            if(src){
            let target = "/api/uploads";
            let prefix = "https://lms.ouchn.cn";
 
            if (src.includes(target) && !src.includes(`${prefix}${target}`)&& !src.includes(`${prefix}:443${target}`)) {
                src = src.replace(target, `${prefix}${target}`);
            }}
            return src ? src.replace("https://lms.ouchn.cn:443", "https://lms.ouchn.cn") : null;
        }).filter(src => src !== null);
        return srcList
    }
 
 
 
 
    function main(){
        console.log('开始主程序')
        var current_url = window.location.href
        console.log(current_url)
        if(current_url.includes('learning-activity#/exam')){
            console.log('这是考试结束界面')
            window.open(localStorage.getItem("URL"),'_self')
        }
        if(current_url.includes('full-screen')){
            console.log('这是刷课界面')
            localStorage.setItem("URL",current_url)
        }
        let fun = function(){
            var pre = document.getElementsByClassName('pre-btn ivu-btn ivu-btn-default')[0]
            var next = document.getElementsByClassName('next-btn ivu-btn ivu-btn-default')[0]
            var confirm_button = document.querySelector("body > div.wrapper > div.main-content.gtm-category > div.content-under-nav-2.with-loading.exam-activity-container.ng-scope > div.bd > div > div > div.exam-area-content > div > div.paper-footer > a")
            if(pre||next||confirm_button||window.location.href.includes("subjects#/submission")|window.location.href.includes("ng#")){
                var file = document.getElementsByClassName('file-name ng-binding')
                var test = document.getElementsByClassName('button button-green take-exam ng-scope')
                var content = document.getElementsByClassName('activity-content-bd material-box')
                var popbox = document.getElementsByClassName('reveal-modal prerequisites-confirmation-popup popup-area popup-480 ng-scope open')
                var exam = document.querySelectorAll("body > div.wrapper > div.main-content.gtm-category > div.content-under-nav-2.with-loading.exam-activity-container.ng-scope > div.bd > div > div > div.exam-area-content > div > div.paper-content.card > div")
                var exam_times = document.querySelectorAll("body > div.wrapper > div.main-content.gtm-category > div:nth-child(9) > div > div.full-screen-mode-content-wrapper > div.full-screen-mode-main > div.full-screen-mode-content > div > div > div > div > div > div:nth-child(1) > div > div.bd > div.submission-list.exam-area.ng-scope > div > ul > li:nth-child(1)")
                //var audio = document.querySelectorAll("#root > div > section > div > div > div > div > div:nth-child(2) > section > div > div > div > div > div > div > div.render-detail-article-content > div.render-detail-content.cke-mode > div > audio")
                if(file.length>0 && content.length>0){
                    console.log('这是文件')
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
                }else if(content.length>0){
                    var links = content[0].querySelectorAll('a[ng-click="downloadBlob(activity, upload, \'view\')"][reveal-modal="file-previewer"]');
                    function clickLinkAndClose() {
                        for (var i = 0; i < links.length; i++) {
                            links[i].click();
                            setTimeout(function() {
                                var closeButton = document.querySelector('a.right.close[close-popup="file-previewer"]');
                                closeButton.click();
                            }, 5000);
                            setTimeout(function() {}, 4000);
                            }
                        }
                    clickLinkAndClose();
                    setTimeout(function() {
                    next.click();
                    }, 3000);
                }else if($('video').length>0){
                        console.log('这是视频')
                        setInterval(function(){
                        try{        
                            var video = document.getElementsByTagName('video')[0];                
                            var time = video.duration // 视频总时长
                            var currenttime = video.currentTime // 当前时长1
                            }catch(error){
                                console.log('视频信息获取失败，刷新界面')
                                location.reload();
                            }
                        video.playbackRate = 16 ; //控制视频播放速度：2倍速
                        video.muted = true;
                        if(document.querySelector('video').paused){
                            try{
                            document.getElementsByClassName('mvp-fonts mvp-fonts-play')[0].click();
                            }catch(error){
                            document.getElementsByClassName('mvp-fonts mvp-fonts-pause')[0].click();
                            }
                            if(currenttime == time){
                                document.getElementsByClassName('next-btn ivu-btn ivu-btn-default')[0].click();
                            }
                        }else if(document.querySelector('video').played){
                            if(currenttime == time){
                                document.getElementsByClassName('next-btn ivu-btn ivu-btn-default')[0].click();
                            }
                        }
                    }, 8000)
                }else if(test.length>0){
                    console.log('进入考试')
 
                    if(exam_times.length<1){
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
                        },2000)
                    }else if (exam_times.length>=1){next.click();}
                }else if(popbox.length>0){
                    console.log('有弹窗，重载页面')
                    location.reload();
                }else if(exam.length>0){
                    console.log('开始考试')
                    console.log('等待10秒后开始答题')
                    setTimeout(function(){
                        console.log('等待20秒后可以提交！')
                    },10000)
                    $('.exam-subjects ol li').each(function(){
                        var self1 = $(this)
                        var classname = self1.attr('class')
                        console.log(classname)
                        if(classname == 'subject ng-scope single_selection'){
                            console.log('这是单选题')
                            // 获取题目
                            var q1 = self1.children('div').children('div').children('div').children('span')[0];
                            console.log(q1);
                            console.log($(q1).find('*'));
                            var descendantNodes = Array.from($(q1).find('*'));
                            var srcList = parseque(descendantNodes)
                            var srcString = srcList.join('');
                            var que1 = $(q1).text().replace(/[–!.?&\|\\\*^%$#@\-_—。，“”"" 【】→（ ）、()­？：\s+]/g, "");
                            que1 += srcString;
                            console.log(que1);
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
                                var descendantNodes = Array.from($(xuanxiang1[i]).find('*'));
                                var srcList = parseque(descendantNodes)
                                var srcString = srcList.join('');
                                ans1[i] = $(xuanxiang1[i]).text().replace(/[，、,\'）（"‘’“”.。|\n\s+]/g, "") + srcString;
                                console.log(ans1[i]);
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
                            var q2 = self1.children('div').children('div').children('div').children('span')[0]
                            console.log(q2)
                            var descendantNodes = Array.from($(q2).find('*'));
                            var srcList = parseque(descendantNodes)
                            var srcString = srcList.join('');
                            var que2 = $(q2).text().replace(/[–!.?&\|\\\*^%$#@\-_—。，“”"" 【】→（  ）、()­？：\s+]/g,"")
                            que2+=srcString
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
                                ans2[b] = xuanxiang2[b].innerText.replace(/[，、,\'）（"‘’“”.。|\n\s+]/g, "")
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
                            var q3 = self1.children('div').children('div').children('div').children('span')[0]
                            console.log(q3)
                            var descendantNodes = Array.from($(q3).find('*'));
                            var srcList = parseque(descendantNodes)
                            var srcString = srcList.join('');
                            var que3 = $(q3).text().replace(/[–!.?&\|\\\*^%$#@\-_—。，“”"" 【】→（  ）、()­？：\s+]/g,"")
                            que3+=srcString
                            console.log(que3)
                            // 获取答案
                            var da_an3 = jsonData[que3]
                            console.log(da_an3)
                            // 获取选项
                            var xuanxiang3 = self1.children('div').children('div').eq(1).children('ol').children('li').children('label').children('div').children('span')
                            console.log(xuanxiang3)
                            var ans3 = []
                            for(var c=0;c<xuanxiang3.length;c++){
                                ans3[c] = xuanxiang3[c].innerText.replace(/[，、,\'）（"‘’“”.。|\n\s+]/g, "")
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
                            var q5 = self1.find(".summary-title").find('span[ng-compile-html="subject.displayedDescription || subject.description | sanitizeHtml"]')
                            console.log(q5)
                            var que5 = q5.text().replace(/[–!.?&\|\\\*^%$#@\-_—。，“”"" 【】→（  ）、()­？：\s+]/g,"")
                            console.log(que5)
                            var da_an5 = jsonData[que5]
                            console.log(da_an5)
                            if (da_an5!=undefined){
                                // 获取Simditor编辑器实例
                                var simditorInstance = self1.find('textarea.short-answer-take').data('simditor');
                                // 设置编辑器的内容
                                simditorInstance.setValue(da_an5);
                            }
                        }else if (classname == 'subject ng-scope fill_in_blank') {
                            console.log('这是填空题');
                            // 获取题目
                            var q6 = self1.find("span[class='pre-wrap subject-description simditor-viewer mathjax-process']");
                            console.log(q6);
                            var descendantNodes = Array.from($(q6).find('*'));
                            var srcList = parseque(descendantNodes)
                            var srcString = srcList.join('');
                            var que6 = q6.text().replace(/[–!.?&\|\\\*^%$#@\-_—。，“”"" 【】→（  ）、()­？：\s+]/g, "");
                            que6 += srcString;
                            console.log(que6);
                            var da_an6 = jsonData[que6];
                            console.log(da_an6);
                            if (da_an6 !== undefined) {
                                var answers = da_an6.split(';');
                                var answerNodes = self1.find('.___answer');
                                answers.forEach((answer, index) => {
                                    $(answerNodes[index]).text(answer);
                                });
                            }
                        }else if (classname == 'subject ng-scope matching'){
                            console.log('这是匹配题');
                            console.log($(this))
                            var q7 = self1.find("span[class='pre-wrap subject-description simditor-viewer mathjax-process']");
                            console.log(q7);
                            var descendantNodes = Array.from($(q7).find('*'));
                            var srcList = parseque(descendantNodes)
                            var srcString = srcList.join('');
                            var que7 = q7.text().replace(/[–!.?&\|\\\*^%$#@\-_—。，“”"" 【】→（  ）、()­？：\s+]/g, "");
                            que7 += srcString;
                            console.log(que7);
                            var da_an7 = jsonData[que7];
                            console.log(da_an7);
                            if (da_an7 !== undefined) {
                                var da_an7_list = da_an7.split(';')
                                var matchingNodes = self1[0].querySelectorAll("div.list-panel.option.ng-isolate-scope[ng-class*='option-fill']");
                                for (var i = 0; i < da_an7_list.length; i++) {
                                    if (i < matchingNodes.length) {
                                        const newParagraph = document.createElement('p');
                                        newParagraph.textContent = da_an7_list[i];
                                        matchingNodes[i].appendChild(newParagraph);
                                        matchingNodes[i].scrollIntoView()
                                    }
                                }
                            }
 
 
                        }else if (classname == 'subject ng-scope analysis'){
                            console.log('这是综合题')
                            var q8 = self1.children('div').children('div').children('div').children('span')[0]
                            console.log(q8)
                            var descendantNodes = Array.from($(q8).find('*'));
                            var srcList = parseque(descendantNodes)
                            var srcString = srcList.join('');
                            var que8 = $(q8).text().replace(/[–!.?&\|\\\*^%$#@\-_—。，“”"" 【】→（  ）、()­？：\s+]/g,"")
                            que8+=srcString
                            console.log(que8)
                            var da_an8 = jsonData[que8]
                            console.log(da_an8)
                            var da_an8List = da_an8.split(';');
                            for(var b=0;b<da_an8List.length;b++){
                                $(`input[value="${da_an8List[b]}"]`).click();
                            }
                            $('.subject-body ol li').each(function(){
                                var self2 = $(this)
                                var classname = self2.find(".sub-subject").find(".ng-scope").attr('ng-if')
                                console.log(classname)
                                if(classname == "subject.type == 'short_answer'"){
                                    console.log('这是简答题')
                                    // 获取题目
                                    var q9 = self2.find(".summary-title").find("p")
                                    console.log(q9)
                                    var que9 = q9.text().replace(/[–!.?&\|\\\*^%$#@\-_—。，“”"" 【】→（  ）、()­？：\s+]/g,"")
                                    console.log(que9)
                                    var da_an9 = jsonData[que9]
                                    console.log(da_an9)
                                    if (da_an9!=undefined){
                                        // 获取Simditor编辑器实例
                                        var simditorInstance = self2.find('textarea.short-answer-take').data('simditor');
                                        // 设置编辑器的内容
                                        simditorInstance.setValue(da_an9);
                                    }
                                }
                            })
                        }
                    })
                    setTimeout(function(){
                        console.log('答题结束，可以进行提交！')
                        document.querySelector("body > div.wrapper > div.main-content.gtm-category > div.content-under-nav-2.with-loading.exam-activity-container.ng-scope > div.bd > div > div > div.exam-area-content > div > div.paper-footer > a").click();
                    },35000)
                    setTimeout(function(){
                        console.log('点击确定按钮！')
                        document.querySelector("#submit-exam-confirmation-popup > div > div.popup-footer > div > button.button.button-green.medium").click();
                    },40000)
                    //next.click();
                }else if (window.location.href.includes("subjects#/submission")) {
                    console.log('查看考试结果页面')
                    window.open(localStorage.getItem("URL"),'_self')
                }else if (window.location.href.includes("ng#")) {
                    console.log('选择课程界面')
                }else{next.click();}
            }else{
                setTimeout(function(){
                    location.reload();
                    },8000)
            }
        }
        setTimeout(function(){
            fun()
        },15000)
    }
    window.addEventListener('load',main)
    window.addEventListener('popstate',main)
})();