    // ==UserScript==
    // @name         键盘修改b站播放速度
    // @namespace    http://tampermonkey.net/
    // @version      2024-04-22-XinYu@19-2.0
    // @description  使用键盘修改播放速度，且能突破b站上限 更新2.0
    // @author       XinYu@19
    // @match        https://www.bilibili.com/video/*/*
    // @icon         https://www.bilibili.com/favicon.ico
    // @license      GPLv3
    // @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/492989/%E9%94%AE%E7%9B%98%E4%BF%AE%E6%94%B9b%E7%AB%99%E6%92%AD%E6%94%BE%E9%80%9F%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/492989/%E9%94%AE%E7%9B%98%E4%BF%AE%E6%94%B9b%E7%AB%99%E6%92%AD%E6%94%BE%E9%80%9F%E5%BA%A6.meta.js
    // ==/UserScript==

    (function() 
    {
        'use strict';
        console.log('1.0更新');
        console.log('新增数字组合键实现播放速度改变');
        console.log('例如按键1+2可实现1.2倍速播放');
        console.log('单按数字键也可直接改变');
        console.log('+键可直接16倍速播放');
        let video = document.querySelector("video");
        let pressedKeys = []; // 用于存储按下的数字键
        let baseSpeed = 1; // 播放速度的基数，初始为1倍速

        window.addEventListener('keydown', function(e)
        {
            const key = e.key;
            if (/\d/.test(key))
            {
                pressedKeys.push(Number(key));
                if (pressedKeys.length === 2)
                {
                    baseSpeed = pressedKeys[0] + pressedKeys[1] * 0.1;
                    pressedKeys = [];
                }
                else if(pressedKeys.length === 1)
                {
                    baseSpeed = pressedKeys[0]
                }
            }
            else if(key == '+')//觉得+键不方便可自行更改
            {
                baseSpeed = 16;//也可以自行定义倍速
            }
            video.playbackRate = baseSpeed;
            console.log(`当前倍速：${video.playbackRate}`);
        });


        window.addEventListener('keyup', function()
        {
            if (pressedKeys.length !== 2) 
            {
                pressedKeys = [];
            }
        });
        // Your code here...
    })();