// ==UserScript==
// @name         广东省国家工作人员学法考试系统自动学习课程章节
// @namespace    http://tampermonkey.net/
// @version      2024-10-08
// @description  自动阅读章节并点击下一章节，若无下一章节则回到首页
// @author       WFXIAN
// @match        http://xfks-study.gdsf.gov.cn/study/course/*/chapter/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bing.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511847/%E5%B9%BF%E4%B8%9C%E7%9C%81%E5%9B%BD%E5%AE%B6%E5%B7%A5%E4%BD%9C%E4%BA%BA%E5%91%98%E5%AD%A6%E6%B3%95%E8%80%83%E8%AF%95%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%E8%AF%BE%E7%A8%8B%E7%AB%A0%E8%8A%82.user.js
// @updateURL https://update.greasyfork.org/scripts/511847/%E5%B9%BF%E4%B8%9C%E7%9C%81%E5%9B%BD%E5%AE%B6%E5%B7%A5%E4%BD%9C%E4%BA%BA%E5%91%98%E5%AD%A6%E6%B3%95%E8%80%83%E8%AF%95%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%E8%AF%BE%E7%A8%8B%E7%AB%A0%E8%8A%82.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //等待页面加载完成
    var sleepTimeout = 1500
    var intervalId = window.setInterval(function() {
        if (document.readyState === "complete") {
            clearInterval(intervalId);
            start()
        }
    }, 500);
    function start(){
        //获取章节id
        var u = window.location.href
        var sp = u.split('/chapter/')
        var cid = sp[1]
        sub(cid)
    }
    function sub(cid){
        console.log('提交章节id：'+cid)
        var url = "http://xfks-study.gdsf.gov.cn/study/learn/"+cid
        var httpRequest = new XMLHttpRequest()
        httpRequest.open('POST', url, true)
        httpRequest.send()

        // 响应后的回调函数
        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState == 4 && httpRequest.status == 200) {
                var json = httpRequest.responseText
                console.log('结果：'+json)
                next(json)
            }
        }
    }
    function next(res){
        if(res==='true'){
            var d = document.getElementsByClassName("next_chapter")[0]
            if(d){
                //下一章节
                console.log('下一章节')
                setTimeout(function(){
                    d.click()
                }, sleepTimeout)
            }else{
                console.log('返回首页')
                setTimeout(function(){
                    window.location.href = 'http://xfks-study.gdsf.gov.cn/study/index'
                }, sleepTimeout)
            }
        }else{
            console.log('刷新页面')
            setTimeout(function(){
                location.reload()
            }, sleepTimeout)
        }
    }
})();