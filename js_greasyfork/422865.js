// ==UserScript==
// @name         Bilibili直播画中画
// @namespace    None
// @version      1.13
// @description  为B站直播添加PictureInPicture（画中画）
// @author       Damon
// @match        https://live.bilibili.com/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422865/Bilibili%E7%9B%B4%E6%92%AD%E7%94%BB%E4%B8%AD%E7%94%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/422865/Bilibili%E7%9B%B4%E6%92%AD%E7%94%BB%E4%B8%AD%E7%94%BB.meta.js
// ==/UserScript==

window.onload = function() {
    setTimeout(loadPiP, 4000);
}

function loadPiP(){
    'use strict';

    console.info('Bilibili直播画中画');
    var controllerBar = document.getElementsByClassName('web-player-controller-wrap')[1];

    if(!controllerBar) {
        return;
    }

    var pipBtn = document.createElement('div');
    pipBtn.innerHTML = '<span class="text">画中画</span>';
    pipBtn.addEventListener('click', function(){
        if(document.pictureInPictureElement == null){
            var videoDom = document.getElementsByTagName('video')[0];
            // console.log('video DOM found - Bilibili直播画中画');
            videoDom.requestPictureInPicture().then(()=>{console.log('已开启画中画 - Bilibili直播画中画');}, ()=>{console.log('画中画开启失败 - Bilibili直播画中画');});
        } else {
            document.exitPictureInPicture().then(()=>{console.log('画中画已关闭 - Bilibili直播画中画');}, ()=>{console.log('画中画关闭失败 - Bilibili直播画中画');});
        }
    });

    const observer = new MutationObserver(function(){
        var rightArea = controllerBar.getElementsByClassName('right-area')[0];
        if(!rightArea) {
            return;
        }
        var extNodes = rightArea.getElementsByClassName('ext-nodes')[0];
        if(pipBtn.className.length == 0){
            var qualityWrap = rightArea.getElementsByClassName('quality-wrap')[0];
            const btnClassName = qualityWrap.className.split(' ')[1];
            pipBtn.className = btnClassName;
        }
        rightArea.insertBefore(pipBtn, extNodes);
    });

    const config = { childList: true };
    observer.observe(controllerBar, config);
}
