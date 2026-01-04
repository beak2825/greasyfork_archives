// ==UserScript==
// @name        看视频
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  RT
// @author       Korvin
// @match        https://v.qq.com/*
// @match        https://www.ixigua.com/*
// @match        https://v.youku.com/*
// @match        https://www.iqiyi.com/*
// @match        https://www.mgtv.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/473675/%E7%9C%8B%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/473675/%E7%9C%8B%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加CSS样式
    GM_addStyle(`
        .my-button {
            position: fixed;
            left: 0;
            width: 40px;
            height: 40px;
            padding: 0;
            color: #fff;
            background-color: #007bff;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            opacity: 0.3;
            font-size: 14px;
            line-height: 40px;
            text-align: center;
            transition: opacity 0.3s, width 0.3s, height 0.3s, line-height 0.3s;
            z-index: 9999;
        }
        .my-button:hover {
            opacity: 1;
            width: 50px;
            height: 50px;
            line-height: 50px;
        }
        .my-sub-button {
            position: fixed;
            left: 0;
            width: 40px;
            height: 40px;
            padding: 0;
            color: #fff;
            background-color: #007bff;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            opacity: 0.3;
            font-size: 10px;
            line-height: 40px;
            text-align: center;
            transition: opacity 0.3s;
            z-index: 9999;
        }
        .my-sub-button:hover {
            opacity: 1;
        }
    `);

    function addButton() {
        if (document.getElementById('mainButton')) return;

        // 创建主按钮
        let mainButton = document.createElement('button');
        mainButton.id = 'mainButton';
        mainButton.innerHTML = '播';
        mainButton.className = 'my-button';
        mainButton.style.top = 'calc(50% - 70px)';
        document.body.appendChild(mainButton);

        // 创建jsonplayer1按钮
        let jsonplayer1Button = document.createElement('button');
        jsonplayer1Button.id = 'jsonplayer1Button';
        jsonplayer1Button.innerHTML = '线路1';
        jsonplayer1Button.className = 'my-sub-button';
        jsonplayer1Button.style.top = 'calc(50% - 20px)';
        jsonplayer1Button.style.display = 'none';
        document.body.appendChild(jsonplayer1Button);

        // 创建jsonplayer2按钮
        let jsonplayer2Button = document.createElement('button');
        jsonplayer2Button.id = 'jsonplayer2Button';
        jsonplayer2Button.innerHTML = '线路2';
        jsonplayer2Button.className = 'my-sub-button';
        jsonplayer2Button.style.top = 'calc(50% + 30px)';
        jsonplayer2Button.style.display = 'none';
        document.body.appendChild(jsonplayer2Button);

        mainButton.addEventListener('mouseover', function() {
            // 在鼠标移动到按钮上时执行的代码
            if(jsonplayer1Button.style.display === 'none' && jsonplayer2Button.style.display === 'none') {
                jsonplayer1Button.style.display = 'block';
                jsonplayer2Button.style.display = 'block';
            } else {
                jsonplayer1Button.style.display = 'none';
                jsonplayer2Button.style.display = 'none';
            }
        });


        // jsonplayer1按钮的点击事件
        jsonplayer1Button.onclick = function() {
            window.open('https://jx.jsonplayer.com/player/?url=' + window.location.href, '_blank');
        }

        // jsonplayer2按钮的点击事件
        jsonplayer2Button.onclick = function() {
            window.open('https://jx.777jiexi.com/player/?url=' + window.location.href, '_blank');
        }
    }

    // 每隔500毫秒尝试添加按钮，直到成功
    let intervalId = setInterval(addButton, 500);

    // 检查按钮是否已经被添加，如果已经被添加，就停止尝试
    function checkButtonAdded() {
        if (document.getElementById('mainButton')) {
            clearInterval(intervalId);
        }
    }

    setInterval(checkButtonAdded, 500);

})();
