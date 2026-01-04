// ==UserScript==
// @name         京训钉Plus
// @version      1.3
// @description  自动播放、自动点击下一单元、默认加速1.1倍
// @author       wuleilei
// @match        *://*.bjjnts.cn/*
// @grant        none
// @namespace    https://greasyfork.org/users/816553
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/434612/%E4%BA%AC%E8%AE%AD%E9%92%89Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/434612/%E4%BA%AC%E8%AE%AD%E9%92%89Plus.meta.js
// ==/UserScript==
(function() {
        'use strict';
        
        // 每间隔5秒检测一次
        setInterval(function () {
            // 增加这一句，提供多倍速播放能力，不要设置太大，以免被识别出作弊。
            if(document.querySelector('video')){
                // 设置倍速为1.15倍,超过会被检测出来
                document.querySelector('video').playbackRate = 1.1;

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