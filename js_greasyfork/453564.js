// ==UserScript==
// @name         国家开放大学课程视频后台播放
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  提升学习效率
// @author       TurbMZ
// @license      MIT
// @match        https://moodle.syxy.ouchn.cn/mod/*/view.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ouchn.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/453564/%E5%9B%BD%E5%AE%B6%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%E8%AF%BE%E7%A8%8B%E8%A7%86%E9%A2%91%E5%90%8E%E5%8F%B0%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/453564/%E5%9B%BD%E5%AE%B6%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%E8%AF%BE%E7%A8%8B%E8%A7%86%E9%A2%91%E5%90%8E%E5%8F%B0%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let cache_status = localStorage.getItem('_my_tamermonkey_status_');
    let cache_loop_status = localStorage.getItem('_my_tamermonkey_loop_status_');
    console.log('后台播放缓存状态',cache_status);
    console.log('后台循环缓存状态',cache_loop_status);
    if(cache_status === null) {
       cache_status= 0;
    } else {
       cache_status = JSON.parse(cache_status);
    }
    if(cache_loop_status === null){
       cache_loop_status = 0;
    } else {
       cache_loop_status = JSON.parse(cache_loop_status);
    }
    let loop_status = cache_loop_status || 0;
    let status = cache_status || 0;
    localStorage.setItem('_my_tamermonkey_status_', status);
    localStorage.setItem('_my_tamermonkey_loop_status_',loop_status);

    let _my_tamermonkey_speed_ = 1;
    const speedMap = [ 1, 1.5, 2, 4 ];
    const container = document.getElementById('page-content');
    const navDom = document.querySelector('.mobile_course');
    const cursess = navDom.querySelectorAll('.activity');
    const list = Array.from(cursess).filter(item=>{
        return Array.from(item.classList).includes('page') ||
               Array.from(item.classList).includes('url');
    })
    let videoDom = document.getElementsByTagName('VIDEO')[0];
    let tryTimes = 0; // 已重试次数
    const maxReTryTimes = 10; // 最大重试次数 200ms 重试一次
    // 播放下一个视频
    const nextPageVideo = function() {
        console.log('课程列表',list)
        let currentIndex = Array.from(list).findIndex((item,index)=>{
            return Array.from(item.classList).includes('current')
        });
        console.log('播放下一个视频',currentIndex)
        if(currentIndex>-1 && currentIndex != list.length-1){ // 有且 当前不是最后一个
            const nextLi = list[currentIndex+1]
            const alink = nextLi.querySelector('.aalink')
            alink&&alink.click()
        }
    }

    const init = function() {
        console.log("初始化插件功能", status, typeof status);
        container.style.position = 'relative';
        let btnText = status?'停用后台播放':'启用后台播放';
        let controlBox = document.createElement('DIV');
        let controlBtn = document.createElement('SPAN');
        let speedBtn = document.createElement('SPAN');
        let jopeToEndBtn = document.createElement('SPAN');
        let loopPlayBtn = document.createElement('SPAN');
        // 开关循环播放视频
        const loopHandler = function(e){
            loop_status = loop_status ? 0 : 1;
            localStorage.setItem('_my_tamermonkey_loop_status_',loop_status);
            e.target.innerText = loop_status?'关闭循环播放':'开启循环播放';
        };
        // 控制开关
        const controlHandler = function(e) {
            status = status ? 0: 1;
            localStorage.setItem('_my_tamermonkey_status_',status);
            let btnText = status?'停用后台播放':'启用后台播放';
            e.target.innerText = btnText;
        }
        // 调速
        const speedHandler = function(e) {
            let currentSpeedIndex = speedMap.findIndex(v=>_my_tamermonkey_speed_===v);
            if(currentSpeedIndex===speedMap.length-1){
                currentSpeedIndex = 0;
            }else{
                ++currentSpeedIndex;
            }
            _my_tamermonkey_speed_ = speedMap[currentSpeedIndex];
            videoDom.playbackRate = _my_tamermonkey_speed_;
            e.target.innerText = `快进>>${_my_tamermonkey_speed_}倍速`;
        }
        // 快进到最后
        const toEndHandler = function(e) {
            console.log('快进到最后');
            let duration = videoDom.duration;
            let toEndTime = Math.floor(duration-1);
            videoDom.currentTime = toEndTime;
            console.log(videoDom.currentTime);
        }
        //容器设置样式和id
        controlBox.id = 'myTampermonkeyControl';
        controlBox.style.cssText = 'position:absolute;right:0px;bottom:0px;display:flex;align-items:center;font-size:12px;';
        //控制按钮设置样式和id
        controlBtn.id = 'controlBtn';
        controlBtn.style.cssText = 'display:inline-block;padding: 4px 10px;border-radius:4px;margin-right:10px;cursor:pointer;background:#999;color:#fff;';
        controlBtn.innerText = btnText;
        speedBtn.id = 'speedBtn';
        speedBtn.style.cssText = 'display:inline-block;padding: 4px 10px;border-radius:4px;cursor:pointer;background:#999;color:#fff;margin-right:10px;';
        speedBtn.innerText = `快进>>${_my_tamermonkey_speed_}倍速`;
        jopeToEndBtn.style.cssText = 'display:inline-block;padding: 4px 10px;border-radius:4px;cursor:pointer;background:#999;color:#fff;';
        jopeToEndBtn.innerText = '跳到最后';
        loopPlayBtn.innerText = loop_status?'关闭循环播放':'开启循环播放';
        loopPlayBtn.style.cssText = 'display:inline-block;padding: 4px 10px;border-radius:4px;margin-right:10px;cursor:pointer;background:#999;color:#fff;';
        // 按钮添加事件
        loopPlayBtn.onclick = loopHandler;
        controlBtn.onclick= controlHandler;
        speedBtn.onclick = speedHandler;
        jopeToEndBtn.onclick = toEndHandler;
        controlBox.appendChild(loopPlayBtn);
        controlBox.appendChild(controlBtn);
        controlBox.appendChild(speedBtn);
        controlBox.appendChild(jopeToEndBtn);
        container.appendChild(controlBox);
        videoDom.addEventListener('ended', function () { //结束
            console.log("播放结束");
            console.log('是否循环播放',loop_status);
            if(loop_status) nextPageVideo()
            //controlBtn.click()
        }, false);
        document.addEventListener('visibilitychange', function() {
            if(!videoDom){
                videoDom = document.getElementsByTagName('VIDEO')[0];
            }
            var isHidden = document.hidden;
            console.log(document.visibilityState,isHidden,status); // window._my_tamermonkey_status_
            if (isHidden && status) {
                console.log(status);
                setTimeout(()=>{
                    videoDom.play();
                },200)
            }else if(isHidden){
                videoDom.pause();
            }
        });
        // 如开启后台播放，自动静音播放视频
        if(status) {
            videoDom.muted = 'muted';
            setTimeout(()=> {
                const playPromise = videoDom.play();
                if (playPromise !== undefined) {
                    playPromise.then(res => {
                        // Automatic playback started!
                        // Show playing UI.
                    }).catch(error => {
                        // Auto-play was prevented
                        // Show paused UI.
                    });
                }
            },100)
        }
    }
    if(videoDom){ // 有视频
        console.log('有视频');
        init();
    }else{ // 视频未加载，重试
        console.log('视频未加载');
        let timer = null;
            timer = setInterval(()=>{
                console.log('轮询');
                if(tryTimes >= maxReTryTimes){ // 重试最后都没有找到视频
                    clearInterval(timer);
                    timer = null;
                    if(loop_status){ // 如果是循环播放，则说明是文本课程，直接跳转下一个课程
                        console.log('文本课程，直接跳转下一个课程')
                        setTimeout(()=>{
                            nextPageVideo()
                        },2000)
                    }
                    return;
                }
                videoDom = document.getElementsByTagName('VIDEO')[0];
                if(videoDom){
                    try{
                        init();
                        clearInterval(timer);
                        timer = null;
                        return;
                    }catch(err){
                        clearInterval(timer);
                        timer = null;
                        console.log(err);
                    }
                }
                tryTimes++
            },200)
    }

    // Your code here...
})();