// ==UserScript==
// @name         重庆公需老版本
// @namespace    http://tampermonkey.net/
// @version      0.3121
// @description  匹配两个网页，一是课程列表页面https://cqrl.21tb.com/nms-frontend/index.html#/org/courseDetail*，二是课程学习页面https://cqrl.21tb.com/els/html/courseStudyItem*
// @author       junyi
// @license      MIT
// @match        https://cqrl.21tb.com/nms-frontend*
// @match        https://cqrl.21tb.com/els/html/courseStudyItem*
// @run-at       document-idle
// @grant        GM_setValue
// @grant        GM_getValue

// @downloadURL https://update.greasyfork.org/scripts/510614/%E9%87%8D%E5%BA%86%E5%85%AC%E9%9C%80%E8%80%81%E7%89%88%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/510614/%E9%87%8D%E5%BA%86%E5%85%AC%E9%9C%80%E8%80%81%E7%89%88%E6%9C%AC.meta.js
// ==/UserScript==

//延时函数
const wait = (time) => {
    return new Promise(resolve => setTimeout(resolve, time))
}

(function() {
    'use strict';
    // 注意改掉上面的@match，里面是放指定你要刷新的网页网址
    // 几秒，例如10就是10秒刷新一次

    // ------------参数定义------------
    const time_limit = 90
    const time_interval = 44
    const base_speed = 10
    const isLearnElective = true
    const start_time = new Date()
    var interval_start = start_time
    var flag=0
    // ==========================



    // ------------函数定义------------
    // 假设我们想要查找所有包含"已完成"文本的div元素
    function findElementsWithText(textToFind, elements) {
        const foundElements = [];

        // 遍历所有元素
        for (let i = 0; i < elements.length; i++) {
            // 检查元素的textContent或innerText是否包含指定的文本
            if (elements[i].textContent.includes(textToFind) || elements[i].innerText.includes(textToFind)) {
                foundElements.push(elements[i]);
            }
        }

        // 返回找到的元素的数组
        return foundElements;
    }

    function checkToReload(doc) {
        // 需要重载的有三种情况：
        // 1、被系统检测到（弹出"el-message-box"）
        // 2、当前section已经学完"first-line active"，"section-item finish"(不放在这里，避免死循环)
        // 3、计时已到
        // 4、播放进度未更新，如果video.currentTime < oldTime - 20也要刷新
        console.log('checkToReload:进入')
        var video = doc.querySelector('video')
        if (checkTimeLimit()){
            GM_setValue('oldTime',video.currentTime)
        }
        if (doc.querySelector('.el-message-box') ||
            // doc.querySelector('.first-line.active').parentElement.classList.contains('finish')||
            checkTimeLimit()){
            console.log('checkToReload:刷新');
            location.reload()
        } else if(video && video.currentTime>10 && video.currentTime < GM_getValue('oldTime')-20){
            console.log(video.currentTime,GM_getValue('oldTime')-20,'进度未同步，刷新！');
            setTimeout(()=>{location.reload()},10000)
        }
    }

    function checkTimeLimit() {
        const now = new Date()
        console.log(start_time,now);
        console.log('start time:%d, \nnow: %d',start_time.getTime(),now.getTime());
        console.log('checkTimeLimit():',(now-start_time)>time_limit*1000);
        return ((now-start_time)>time_limit*1000)
    }


    function checkTimeInterval() {
        const now = new Date()
        console.log(interval_start,now);
        console.log('interval start time:%d, \nnow: %d',interval_start.getTime(),now.getTime());
        console.log('checkTimeInterval():',(now-interval_start)>time_limit*1000);
        return ((now-interval_start)>time_interval*1000)
    }

    function speedup(iframe_doc) {
        const waittime = 1
        let speed=16
        console.log('调整速度: ',speed);
        let video = iframe_doc.querySelector('video')
        if (!video.muted){
            video.muted=true;
        }
        if (video.paused){
            video.playbackRate=1;
            video.play();
            video.playbackRate=speed;
        }
        video.playbackRate=speed;
        if (video.paused){video.click()}
        if (!isVideoPlaying(video)) {
            // If not, play the video
            // debugger
            video.play().then(() => {
                console.log('Video started playing');
            }).catch((error) => {
                console.error('Error playing the video:', error);
            });
        } else {
            console.log('Video is already playing');
        }
        // if (video.currentTime<12){
        //     GM_setValue('oldTime',video.currentTime)
        //     video.playbackRate=1
        // }
    };

    function waitForElement(selector, iframeDoc, callback, interval = 100, timeout = 10000) {
        const startTime = Date.now();

        function check() {
            const element = iframeDoc.querySelector(selector);
            if (element) {
                callback(element);
            } else if (Date.now() - startTime < timeout) {
                setTimeout(check, interval);
            } else {
                console.error('Timeout: Element not found within the specified time.');
            }
        }

        check();
    }

    function waitForElements(selector, iframeDoc, callback, interval = 100, timeout = 10000) {
        const startTime = Date.now();

        function check() {
            const elements = iframeDoc.querySelectorAll(selector);
            if (elements && !elements.length==0) {
                // debugger
                return callback(elements);
            } else if (Date.now() - startTime < timeout) {
                setTimeout(check, interval);
            } else {
                console.error('Timeout: Element not found within the specified time.');
            }
        }

        return check();
    }

    // 检查视频是否在播放
    function isVideoPlaying(video) {
        return !video.paused && !video.ended && video.currentTime > 0;
    }
    // 处理正在课程占用情况
    function checkCourse(){
        const s=document.querySelector('p')
        if (s && s.textContent.includes('当前已有课程正在学习中,请先关闭其他课程再重试......')){
            GM_setValue('courseStudyItemFinished', true);//便于重新开始学习
            setTimeout(function() {
                window.close();
                console.log('程序暂停了10秒后执行这里的代码。');
                // 这里放置在暂停后需要执行的代码
            }, 10000); // 10000毫秒，即10秒
        }
    }

    function reloadDouble() {
        if (GM_getValue('reloadFlag')){
            var flag = GM_getValue('reloadFlag')
            if (flag<1){
                GM_setValue('courseStudyItemFinished', 1)
            }else{
                GM_setValue('courseStudyItemFinished', flag-1)
            }
        }else{
            GM_setValue('courseStudyItemFinished', 1)
        }
        setTimeout (() =>{
            location.reload()
        },5000)
    }

    // ==========================
    console.log('开始脚本运行！')
    var currentURL = window.location.href;
    GM_setValue('courseStudyItemFinished', false);
    if (currentURL.startsWith('https://cqrl.21tb.com/nms-frontend/index.html#/org/courseDetail')) {
        // 1.执行课程列表主页面的代码
        // Show a confirm dialog
        // const userConfirmed = confirm('是否学习选修？');
        const l=location
        // waitForElement('#pane-MUST .text-item', document, ()=>{
        //     console.log('网页加载成功！')
        // })
        // debugger
        waitForElements('.complete-status .btn-item ',document,(btns)=>{
            if (isLearnElective){
                document.querySelectorAll('.el-tabs__item')[1].click()
                console.log('选择选修课！')
            }
            setTimeout (() =>{
                btns[2].click()
                console.log('找到状态按钮，点击未完成按钮！')
                // debugger
                const interval=setInterval(()=>{
                    if (document.querySelector('.complete-status .btn-item-active')&&
                        !document.querySelector('.complete-status .btn-item-active').textContent.includes('未完成')){
                        console.log('点击未完成按钮后等待1s.')
                    }else{
                        clearInterval(interval)
                        console.log('当前活动按钮：%s',document.querySelector('.complete-status .btn-item-active').textContent)
                        setTimeout (() =>{
                            setTimeout (() =>{
                                var courseItems=waitForElements('#pane-MUST .text-item', document, (courses)=>{
                                    courses[0].click()
                                    console.log('点击第一个未完成课程，开始学习！')
                                    return courses})
                                },3000)
                        },2000)
                    }
                },1000)
                })
            setInterval (() => {
                console.log('courseStudyItemFinished:%',GM_getValue('courseStudyItemFinished'))
                if (GM_getValue('courseStudyItemFinished')){l.reload()}
            },30000)
        })
    } else if (currentURL.startsWith('https://cqrl.21tb.com/els/html/courseStudyItem')) {
        // 2.执行课程学习的代码
        // 获取iframe内的页面
        if (!document.querySelector('iframe')){checkCourse()}
        const iframe_doc=document.querySelector('iframe').contentWindow.document
        setInterval(() => {
            // 检查是否要重载页面，如果video.currentTime < oldTime - 20也要刷新
            checkToReload(iframe_doc)
            // console.log('checkCourse')
            checkCourse();
            var itemNotFinish=iframe_doc.querySelector('.section-item:not(.finish)')
            if (!itemNotFinish){//未找到
                waitForElement('.section-item:not(.finish)', iframe_doc, ()=>{}) //等待对象加载
                waitForElement('video', iframe_doc, ()=>{}) //等待对象加载
                // GM_setValue('oldTime',iframe_doc.querySelector('video').currentTime)
                let itemNotFinish=iframe_doc.querySelector('.section-item:not(.finish)')
                if (!itemNotFinish){ //等待后二次仍未找到，表明课程已学完
                    console.log('课程已学完，关闭网页！');
                    GM_setValue('courseStudyItemFinished', true);
                    // setTimeout(()=>{window.close()},10000)
                }
            }
            // 找到后,先判断当前section是否学完，学完则更新finish点击itemNotFinish
            wait(2000).then(()=>{
                if (iframe_doc.getElementsByClassName('first-line active').parentElement.classList.contains('finish')){
                    itemNotFinish.click()
                }
            })

            // 防止学习失效，隔一定时间timeinterval点击当前section页面
            if (checkTimeInterval()){ // 如果时间间隔大于设定值，则刷新一次
                interval_start = new Date() // 将间隔时间起点重置
                console.log('目目目目目：时间间隔刷新');
                GM_setValue('oldTime',iframe_doc.querySelector('video').currentTime)
                itemNotFinish.click()
            }
            // 加速
            console.log('加速speedup')
            if (iframe_doc.querySelector('video').currentTime<10){
                wait(2000).then(()=>{
                    speedup(iframe_doc);
                })
            }else{
                speedup(iframe_doc);
            }

        }, 1000);
    } else {
        // 3.执行其他页面的代码
        return
    }

})();