// ==UserScript==
// @name         樱舞动漫自动切集、屏幕放大
// @namespace    none
// @version      0.1
// @description  樱舞视频播放自动切集、屏幕放大 自用
// @author       cannian
// @match        https://www.skrcc.cc/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.skrcc.cc
// @grant        GM_log
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/470784/%E6%A8%B1%E8%88%9E%E5%8A%A8%E6%BC%AB%E8%87%AA%E5%8A%A8%E5%88%87%E9%9B%86%E3%80%81%E5%B1%8F%E5%B9%95%E6%94%BE%E5%A4%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/470784/%E6%A8%B1%E8%88%9E%E5%8A%A8%E6%BC%AB%E8%87%AA%E5%8A%A8%E5%88%87%E9%9B%86%E3%80%81%E5%B1%8F%E5%B9%95%E6%94%BE%E5%A4%A7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    GM_log('增强网页视频播放器 start');
    // 自动切集按钮
    let autoBtn = document.createElement('button');
    autoBtn.className = 'btn btn-auto';
    autoBtn.innerText = 'auto';
    autoBtn.style.width = '60px';
    autoBtn.style.height = '20px';
    autoBtn.style.align = 'center';
    autoBtn.addEventListener('click', function(){
        GM_log('点击');
        if(autoBtn.innerText == 'auto') autoBtn.innerText = 'close';
        else autoBtn.innerText = 'auto';
    });
    // 全屏按钮
    let screen = document.createElement('button');
    screen.className = 'btn btn-screen';
    screen.innerText = 'full';
    screen.style.width = '60px';
    screen.style.height = '20px';
    screen.style.align = 'center';

    let playBox = document.getElementsByClassName('container_play container')[0];
    playBox.appendChild(autoBtn);
    playBox.appendChild(screen);

    // 获得下一集地址
    let nextPage = document.getElementsByClassName('play_but bline')[0].childNodes[0].childNodes[0].childNodes[7];
    setTimeout(function(){
        GM_log('监听事件加入：');
        let video = document.getElementsByTagName('iframe')[1].contentWindow.document.getElementsByTagName('video')[0];
        GM_log(video == null);
        // 获取视频播放器绑定ended事件
        video.addEventListener('ended', function() {
            GM_log('ended');
            if(autoBtn.innerText == 'auto') {
                nextPage.click();
            }
        });
        // 全屏按钮事件
        screen.addEventListener('click', function(){
            // 将全屏选项保存在会话中
            if(!!sessionStorage){
                if(sessionStorage.getItem('YWfullScreen') != null && sessionStorage.getItem('YWfullScreen') == 'true') {
                    sessionStorage.setItem('YWfullScreen', false);
                    webfullexit();
                }
                else {
                    sessionStorage.setItem('YWfullScreen', true);
                    webfull();
                }
            }
        });
        // 将全屏选项保存在会话中
        if(!!sessionStorage){
            if(sessionStorage.getItem('YWfullScreen') != null && sessionStorage.getItem('YWfullScreen') == 'true') {
                GM_log('自动全屏');
                webfull();
                // 开启全屏模式API只能由用户手势触发,强制全屏模式意为“恶意行为”， 一切非用户主观意愿带来的变化都是不允许的
                // video.webkitRequestFullscreen();
            }
        }
    }, 2000);
    
    function webfull() {
        // 相关div大小调整
        let playbox = document.getElementsByClassName('container_play container')[0];
        playbox.style.width = "1800px";
        playbox.style.height = "800px";
        let leftbox = document.getElementsByClassName('left_row fl')[0];
        leftbox.style.width = "1650px";
        leftbox.style.height = "800px";
        let videobox = document.getElementsByClassName('player_video embed-responsive embed-responsive-16by9 clearfix')[0];
        videobox.style.height = "800px";
        let video = document.getElementsByClassName('MacPlayer embed-responsive')[0];
        video.style.paddingBottom = "";
        GM_log('网页全屏');
    }
    function webfullexit() {
        let playbox = document.getElementsByClassName('container_play container')[0];
        playbox.style.width = "";
        playbox.style.height = "";
        let leftbox = document.getElementsByClassName('left_row fl')[0];
        leftbox.style.width = "";
        leftbox.style.height = "";
        let videobox = document.getElementsByClassName('player_video embed-responsive embed-responsive-16by9 clearfix')[0];
        videobox.style.width = "";
        videobox.style.height = "";
        let video = document.getElementsByClassName('MacPlayer embed-responsive')[0];
        video.style.paddingBottom = "56.25%";
        GM_log('退出网页全屏');
    }

})();