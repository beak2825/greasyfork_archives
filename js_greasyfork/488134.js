// ==UserScript==
// @name         哔哩哔哩直播间马赛克去除
// @namespace    https://greasyfork.org/zh-CN/scripts/488134
// @version      0.0.5
// @description  去除哔哩哔哩直播间出现的部分马赛克遮挡
// @author       yingshiyv
// @match        *://live.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488134/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%9B%B4%E6%92%AD%E9%97%B4%E9%A9%AC%E8%B5%9B%E5%85%8B%E5%8E%BB%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/488134/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%9B%B4%E6%92%AD%E9%97%B4%E9%A9%AC%E8%B5%9B%E5%85%8B%E5%8E%BB%E9%99%A4.meta.js
// ==/UserScript==
(function() {
    'use strict';
    let maskPanelId = 'web-player-module-area-mask-panel';
    let liveBox = 'player-section p-relative border-box none-select z-player-section';
    // 等待网页完成加载
    window.addEventListener('load', function() {
        // 2s后删除马赛克
        setTimeout(function(){
            removeMask();
        },2000);
        //添加点击事件
        //防止点击「暂停按钮」后一段时间，视频源销毁，重新播放时马赛克“复活”
        let player = document.getElementsByClassName(liveBox)[0];
        player.onclick = function(){
            setTimeout(function(){
                removeMask();
            },2000);
        }
    }, false);

    //删除马赛克元素
    function removeMask(){
        let maskPanelDom = document.getElementById(maskPanelId);
        if(!maskPanelDom){return;}
        maskPanelDom.remove();
    }
})();