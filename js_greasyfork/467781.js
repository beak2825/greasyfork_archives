// ==UserScript==
// @name         好医生Plus
// @version      1.0
// @description  自动播放、自动点击下一单元、默认加速10倍
// @author       wuleilei
// @match        *://*.cmechina.net/cme/*
// @grant        none
// @namespace    https://greasyfork.org/users/816553
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/467781/%E5%A5%BD%E5%8C%BB%E7%94%9FPlus.user.js
// @updateURL https://update.greasyfork.org/scripts/467781/%E5%A5%BD%E5%8C%BB%E7%94%9FPlus.meta.js
// ==/UserScript==
(function() {
        'use strict';
        
        // 每间隔5秒检测一次
        setInterval(function () {
            // 增加这一句，提供多倍速播放能力
            if(document.querySelector('video')){
                // 设置倍速为10倍
                document.querySelector('video').playbackRate = 10;
 
                // 如果视频暂停则播放
                if(document.querySelector('video').paused){
                    console.log('检测到视频为暂停,点击播放');
                    document.querySelector('video').play();
                }
            }
            
            // 如果有则获取下一单元按钮
            if(document.querySelector(".next_button___YGZWZ")){
                // 如果有则点击下一单元按钮
                document.querySelector(".next_button___YGZWZ").click();
            }
            
            // 如果有则获取确认按钮
            if(document.querySelector(".ant-btn ant-btn-primary")){
                // 如果有则点击确认按钮
                document.querySelector(".ant-btn ant-btn-primary").click();
            }
        },5000)
    })();