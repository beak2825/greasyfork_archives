// ==UserScript==
// @name         职培云学习辅助
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  学习新思想，争做新青年
// @author       DMC52859
// @match        https://px.class.com.cn/player/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/448854/%E8%81%8C%E5%9F%B9%E4%BA%91%E5%AD%A6%E4%B9%A0%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/448854/%E8%81%8C%E5%9F%B9%E4%BA%91%E5%AD%A6%E4%B9%A0%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

(function() {
    /*当前观看的课程*/
    var current;
    /*课程中的所有课程*/
    var list;
    /*开始统计视频总时长(5秒内可自行选择起始视频)*/
    var btn_submit; // “我已学完”按钮
    // 获取视频
    var video;
    // iframe
    var iframe
    setTimeout(function(){
        iframe = document.querySelector('iframe').contentWindow
    },1000)
    // 清晰度设置
    var settings
    // 下一节
    var next_btn = document.getElementById('jhxNext')
    // 当前时间
    var currentTime
    // 总时间
    var durationTime
    setTimeout(function() {
        video = iframe.document.getElementsByTagName('video')[0]
        console.log(video)
        var learn = document.getElementsByClassName('learnProcessTip')[0]
        console.log(learn.childNodes)
        btn_submit = learn.childNodes[5];
        console.log(btn_submit)
        /*课程内所有视频*/
        list = document.getElementById("list_chapter").getElementsByClassName("section");
        /*时间累加*/
        for(var i = 0; i < list.length; i++) {
            //定位到当前视频
            if(list[i].className.indexOf("active")!=-1) {
                current = i;
            }
        }
        }, 4500);
    /*刷未完成课程*/
    function watchnew(){
        durationTime = iframe.document.getElementsByClassName('duration')[0].innerText
        currentTime = iframe.document.getElementsByClassName('current-time')[0].innerText
        var test = list[current].getElementsByClassName("status-done")[0].innerText;
        //判断是否播放完成
        if(current >= list.length-1){
            document.getElementsByClassName('btn-back')[0].getElementsByTagName('a')[0].click();
        }else{
            if(typeof(test) != "undefined") {
                console.log("视频已播放完成:" + test);
                current ++;
                btn_submit.click();
                console.log('点击了')
                next_btn.click();
            }
        }
    }
    /*定时启动判断程序*/
    setInterval(function() {
        try{
            watchnew();
        }catch(e){
        }
    },1000)
    setInterval(function(){
        try{
            var close = document.getElementsByClassName('buttons-wrapper')[0]
            close.firstElementChild.click();
            var last_status = document.getElementById('list_chapter').lastElementChild
            console.log(last_status.firstElementChild.firstElementChild.className)
            if(last_status.firstElementChild.firstElementChild.className == 'status-done'){
                var back = document.querySelector("body > div > div.player-wrapper > div.btn-back > a")
                console.log(back)
                back.click();
            }
        }catch(e2){
        }
    },1000)
})();