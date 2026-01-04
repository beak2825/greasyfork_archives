// ==UserScript==
// @name         B站视频1.5倍速
// @namespace    zhaiwei
// @version      0.1.7
// @description  B站视频自动1.5倍速播放
// @author       zhaiwei
// @match        https://www.bilibili.com/video/*
// @icon         https://www.bilibili.com/favicon.ico?v=1
// @grant        none
// @run-at        document-end
// @downloadURL https://update.greasyfork.org/scripts/451009/B%E7%AB%99%E8%A7%86%E9%A2%9115%E5%80%8D%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/451009/B%E7%AB%99%E8%A7%86%E9%A2%9115%E5%80%8D%E9%80%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 生成按钮
    var btn = document.createElement('button');
    // 按钮文字
    btn.innerText = 'x1.0倍速';
    // 添加按钮的样式类名class值为speedBtn
    btn.setAttribute('class', 'speedBtn');
    // 生成style标签
    var style = document.createElement('style');
    // 把样式写进去
    style.innerText = `.speedBtn{position:fixed;bottom:9%;right:5%;width:75px;height:55px;padding:3px 5px;border:1px solid #0d6efd;cursor:pointer;color:#0d6efd;font-size:14px;background-color:transparent;border-radius:5px;transition:color .15s ease-in-out,background-color .15s ease-in-out;z-index:9999999999999;}.speedBtn:hover{background-color:#0d6efd;color:#fff;}`;
    // 在head中添加style标签
    document.head.appendChild(style);
    // 在body中添加button按钮
    document.body.appendChild(btn);
    // 点击按钮去执行speedUp函数
    document.querySelector('.speedBtn').addEventListener('click', function () {
        speedUp();
    })
    function speedUp(){
        var str = document.querySelector('.video-title').textContent;
        if( document.getElementsByClassName('bpx-player-ctrl-playbackrate-result')[0].textContent === '倍速'){
            document.getElementsByClassName("speedBtn")[0].innerText="x1.5倍速"
            document.getElementsByClassName('bpx-player-ctrl-playbackrate-menu-item')[1].click();
            //str = str + '——（1.5倍速）';
            //document.querySelector('.video-title').textContent = str;
        } else{
            document.getElementsByClassName('bpx-player-ctrl-playbackrate-menu-item')[3].click();
            document.getElementsByClassName("speedBtn")[0].innerText="x1.0倍速"
            //str = str.substring(0, str.lastIndexOf('——（1.5倍速）'));
            //document.querySelector('.video-title').textContent = str;
            //document.querySelector('.video-title').textContent = document.querySelector('.video-title').textContent + '——（1.0倍速）';
        }
    }
    
    /*
    setTimeout("document.getElementsByClassName('bpx-player-ctrl-playbackrate-menu-item')[1].click()",1000);
    setTimeout("document.getElementsByClassName('bpx-player-ctrl-playbackrate-menu-item')[1].click()",3000);
    setTimeout("document.getElementsByClassName('bpx-player-ctrl-playbackrate-menu-item')[1].click()",5000);
    setTimeout("document.getElementsByClassName('bpx-player-ctrl-playbackrate-menu-item')[1].click()",7000);
    setTimeout("document.getElementsByClassName('bpx-player-ctrl-playbackrate-menu-item')[1].click()",9000);
    */
    // Your code here...
})();