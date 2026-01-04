// ==UserScript==
// @name         哔哩哔哩MiniPlus
// @name:en      BiliBili-Mini-Plus
// @namespace    http://tampermonkey.net/
// @version      0.2Beta
// @description  HeadBanner添加高斯模糊 教程视频自动关闭弹幕 视频播放倍速新增3倍速 解决了开启AdBlock时的横幅与广告空白界面 
// @description:en Added Gaussian blur to HeadBanner.Added 3x video playback speed Solved the blank banner and ad interface when AdBlock was turned on.
// @author       PHalfStudio
// @match        *://www.bilibili.com/*
// @match        https://space.bilibili.com/
// @license GPL-3.0-or-later
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        GM_addStyle
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/462396/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9MiniPlus.user.js
// @updateURL https://update.greasyfork.org/scripts/462396/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9MiniPlus.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /*

    设置区域

    */
    //视频三倍速开关（true为开启，false为关闭）
    let speed_3 = true;
    //视频2.5倍速开关（true为开启，false为关闭）
    let speed_2_5 = true
    //清除空白视频与横幅屏蔽开关（true为开启，false为关闭）
    let clear_write = false
    //教程自动关弹幕开关（true为开启，false为关闭）
    let auto_close_danmu = true
    //高斯模糊开关（true为开启，false为关闭）
    let open_blur = true
    /*

    代码区域

    */
    //清除空白视频方法
    function clearWrite(){
        if(clear_write == true){
            let videos = document.getElementsByClassName("bili-video-card__wrap __scale-wrap");
            for(let i=0;i<videos.length;i++){
                let text = videos[i].innerHTML;
                let pattern = /<a href="\/\/cm\.bilibili\.com\/cm+/
                if(pattern.test(text)){
                    let addad=videos[i].parentNode.parentNode;
                    let a = addad.className;
                    if(a=="feed-card"){
                        addad.remove();
                    }
                }
            }
        }
    }
    //添加3倍速播放
    function addSpeed3x(){
        if(speed_3 == true){
            let newinput=document.createElement("li");
            let a=document.getElementsByClassName("bpx-player-ctrl-playbackrate-menu-item ");
            newinput.innerText="3.0x";
            newinput.setAttribute("class","bpx-player-ctrl-playbackrate-menu-item ");
            newinput.setAttribute("data-value","3");
            document.getElementsByClassName("bpx-player-ctrl-playbackrate-menu")[0].insertBefore(newinput,a[0]);
        }
    }
    //添加2.5倍速播放
    function addSpeed2_5x(){
        if(speed_2_5 == true){
            let newinput=document.createElement("li");
            let a=document.getElementsByClassName("bpx-player-ctrl-playbackrate-menu-item ");
            newinput.innerText="2.5x";
            newinput.setAttribute("class","bpx-player-ctrl-playbackrate-menu-item ");
            newinput.setAttribute("data-value","2.5");
            document.getElementsByClassName("bpx-player-ctrl-playbackrate-menu")[0].insertBefore(newinput,a[0]);
        }
    }
    //关闭弹幕方法
    function danmuControl(){
        if(auto_close_danmu == true){
            const videoTitle = document.querySelector('.video-title.tit').innerText;
            const patternVideoTitle = /教程|课程|学习|教学/;
            if(patternVideoTitle.test(videoTitle)){
                const danmuCheckbox = document.querySelector(".bui-danmaku-switch-input");
                if (danmuCheckbox.checked) {
                    const ke = new KeyboardEvent('keydown', {
                        bubbles: true, cancelable: true, keyCode: 68
                    });
                    document.body.dispatchEvent(ke);
                }
            }
        }
    }

    //修改首页HeaderBar CSS样式
    let bilibar=`
    .bili-header__bar{
            backdrop-filter: blur(8px);
        }
    `
    let adblockbanner=`
    .adblock-tips[data-v-7f4a51a0]{
    display:none;
    }
    `
    let sidedownbar=`
    .bili-header .slide-down,.bili-header .center-search-container .center-search__bar #nav-searchform{
    background:rgba(255,255,255,0.8) !important;
    backdrop-filter:blur(8px);
    }
    `
    let channels=`
    .header-channel{
    background:rgba(255,255,255,0.8) !important;
    backdrop-filter:blur(8px);
    }
    `
    //确认修改
    if(open_blur == true){
        GM_addStyle(bilibar)
        GM_addStyle(sidedownbar)
        GM_addStyle(channels)
    }
    if(clear_write){
        GM_addStyle(adblockbanner)
    }
    //等待网页加载完成，加入延迟，执行函数
    window.onload=function(){
        let patternvideo = /video+/
        let videopage = window.location.pathname;
        if(patternvideo.test(videopage)){
            setTimeout(function(){danmuControl();addSpeed2_5x();addSpeed3x();},3500)
        }
        if(patternvideo.test(videopage)==false){
            let flashbtn = document.getElementsByClassName("primary-btn roll-btn");
            setTimeout(function () {
                clearWrite();
            }, 950)
            setTimeout(function(){
                flashbtn[0].onclick=function(){
                    setTimeout(function(){clearWrite();},500)
                }
            },900)
        }
    }
})();