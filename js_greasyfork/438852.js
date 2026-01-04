// ==UserScript==
// @name         bilibili多倍速
// @namespace    Yangjinhu
// @version      0.1
// @description  bilibili视频更多倍速选择
// @author       Yangjinhu
// @include      *://*.bilibili.com/*
// @include      *://*.bilibili.tv/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @require      http://code.jquery.com/jquery-3.x-git.min.js
/* globals jQuery, $, waitForKeyElements */
// @downloadURL https://update.greasyfork.org/scripts/438852/bilibili%E5%A4%9A%E5%80%8D%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/438852/bilibili%E5%A4%9A%E5%80%8D%E9%80%9F.meta.js
// ==/UserScript==
function waitForNode( nodeSelector, callback) {
    var node = nodeSelector();
    if (node) {
        callback(node);
    } else {
        setTimeout(function () { waitForNode(nodeSelector, callback); }, 100);
    }
}
window.onload=function() {
    'use strict';
    if (location.href.startsWith( 'https://www.bilibili.com/video/')||location.href.startsWith( 'https://www.bilibili.tv/video/')) {
        waitForNode(() => document . querySelector('div.bilibili-player-video-btn-speed > div > ul'),
                    function (node) {
            let button = document.querySelector('.bilibili-player-video-btn-speed-name')
            let video = document.querySelector('bwp-video');
            let arr = ['2.5', '3','3.5','4','5','6']
            //$(node).empty()
            for (let x of arr) {
                $(node).prepend( '<li class="bilibili-player-video-btn-speed-menu-list" data-value="'+x+'">'+x+'x</1i>');
            }
            $(node).click(function(event) {
                let speed = event.target.dataset.value;
                button.innerHTML = event.target.innerHTML;
                video.playbackRate = parseFloat(speed);
            })
            $(node).find('li').each((i,self)=>{
                $(self).height(28)
            })
        });
    }
}

