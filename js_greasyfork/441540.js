// ==UserScript==
// @name         学习通阻止暂停播放
// @namespace    https://hognbin.xyz/
// @version      0.4
// @description  学习通
// @author       宏斌
// @match        https://mooc1.chaoxing.com/mycourse/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chaoxing.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/441540/%E5%AD%A6%E4%B9%A0%E9%80%9A%E9%98%BB%E6%AD%A2%E6%9A%82%E5%81%9C%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/441540/%E5%AD%A6%E4%B9%A0%E9%80%9A%E9%98%BB%E6%AD%A2%E6%9A%82%E5%81%9C%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var video;
    function stopPause() {
        video = document.querySelectorAll('iframe')[0].contentWindow.document.querySelectorAll('iframe')[0].contentWindow.document.querySelector('video');
        video.pause = () => {
            console.log('他想暂停播放');
        }
    }

    function handleMute() {
        video = document.querySelectorAll('iframe')[0].contentWindow.document.querySelectorAll('iframe')[0].contentWindow.document.querySelector('video');
        video.volume = 0;
    }

    const button = document.createElement('button');
    button.className = 'h_Bbutton';
    button.innerHTML = '阻止暂停播放';
    document.body.appendChild(button);
    Object.assign(button.style, {
        width: '120px',
    });
    const style = document.createElement('style');
    style.innerHTML = `
        .h_Bbutton{
            transition: all 0.3s linear;
            position: fixed;
            padding: 10px;
            border: none;
            background: linear-gradient(45deg, #0219f2, #c804ea);
            color: #fffae5;
            border-radius: 5px;
            bottom: 30px;
            left: 20px;
            box-shadow: 8px 4px 10px 3px #ccc;
            cursor: pointer;
            font-weight: bold;
        }
        .h_Bbutton:active{
            transform: translateY(2px);
        }
        .h_Bbutton:hover{
            opacity:0.8;
        }
        .h_Bbutton svg path{
            fill: #fffae5;
        }
        .bottom_text{
            position:fixed;
            bottom: 0;
            left: 0;
            background-color: #51f;
            color:#fffae5;
            padding: 3px 5px;
            font-size: 12px;
            border-radius: 3px;
        }
    `
    document.head.appendChild(style);
    button.onclick = verify(stopPause);
    /**
    * 添加静音按钮
    */

    const icon = `<svg t="1647347534277" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3042" width="32" height="32"><path d="M290.133333 921.6c-3.413333 0-10.24 0-13.653333-3.413333-17.066667-6.826667-23.893333-27.306667-17.066667-44.373334l307.2-699.733333c6.826667-17.066667 23.893333-30.72 40.96-37.546667 17.066667-6.826667 37.546667-3.413333 54.613334 6.826667C757.76 194.56 819.2 296.96 819.2 409.6v201.386667l34.133333 133.12c3.413333 10.24 0 20.48-6.826666 30.72-6.826667 3.413333-17.066667 10.24-27.306667 10.24h-139.946667c-17.066667 78.506667-85.333333 136.533333-167.253333 136.533333-30.72 0-58.026667-6.826667-85.333333-23.893333-17.066667-10.24-20.48-30.72-13.653334-47.786667 10.24-17.066667 30.72-20.48 47.786667-13.653333 17.066667 10.24 34.133333 13.653333 51.2 13.653333 47.786667 0 88.746667-34.133333 98.986667-81.92 6.826667-34.133333 34.133333-54.613333 68.266666-54.613333h95.573334l-23.893334-92.16V409.6c0-85.333333-47.786667-167.253333-122.88-208.213333l-307.2 699.733333c-3.413333 10.24-17.066667 20.48-30.72 20.48zM238.933333 757.76l34.133334-136.533333V409.6c0-119.466667 88.746667-221.866667 208.213333-235.52 17.066667-3.413333 30.72-20.48 30.72-40.96-3.413333-17.066667-20.48-30.72-40.96-30.72C320.853333 122.88 204.8 256 204.8 409.6v201.386667l-34.133333 133.12c-3.413333 17.066667 6.826667 37.546667 23.893333 40.96h6.826667c17.066667 0 34.133333-10.24 37.546666-27.306667z" fill="#3E2AD1" p-id="3043"></path></svg>`
    const muteButton = document.createElement('button');
    muteButton.className = 'h_Bbutton';
    muteButton.innerHTML = icon;
    muteButton.style['left'] = '150px';
    muteButton.style['padding'] = '3px';
    muteButton.style['background'] = 'linear-gradient(45deg, #f50404, #e2ec0a)';

    document.body.appendChild(muteButton);
    muteButton.onclick = verify(handleMute);

    const autoToggleButton = document.createElement('button');
    autoToggleButton.className = 'h_Bbutton';
    autoToggleButton.innerHTML = '自动切换下集';
    Object.assign(autoToggleButton.style, {
        bottom: '80px'
    })
    autoToggleButton.onclick = verify(autoToggleNextVideo);
    document.body.appendChild(autoToggleButton);

    function autoToggleNextVideo() {
        if (!video) {
            video = document.querySelectorAll('iframe')[0].contentWindow.document.querySelectorAll('iframe')[0].contentWindow.document.querySelector('video');
        }
        const curr = document.querySelectorAll('h4.currents')[0]
        if (!curr) return console.warn('获取当前活跃item失败');
        const nextA = curr.parentElement.nextElementSibling.querySelector('a');
        if (!nextA) return;
        video.addEventListener('ended', () => {
            nextA.click();
        });
        autoToggleButton.style.display = 'none';

        const nextVideoText = document.createElement('span');
        nextVideoText.className = 'bottom_text';
        document.body.appendChild(nextVideoText);

        const r = () => {
            nextVideoText.innerText = `下集:${nextA.children[0].innerText}`;
            setTimeout(r, 5000);
        }
        r();

    }

    function verify(callback) {
        return () => {
            try {
                callback();
            } catch (e) {
                console.error('出错！', e);
                alert('确保已经点开视频');
            }
        }
    }

})();