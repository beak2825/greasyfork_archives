// ==UserScript==
// @name         哔哩哔哩bilibili跳过大会员弹窗
// @namespace    http://tampermonkey.net/
// @version      0.3.2
// @description  哔哩哔哩视频播放界面自动跳过弹窗
// @author       JoshCai233
// @match        https://www.bilibili.com/video/*
// @icon         https://favicon.yandex.net/favicon/v2/http://www.bilibili.com/?size=32
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/449468/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9bilibili%E8%B7%B3%E8%BF%87%E5%A4%A7%E4%BC%9A%E5%91%98%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/449468/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9bilibili%E8%B7%B3%E8%BF%87%E5%A4%A7%E4%BC%9A%E5%91%98%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var playerContainer = $('#bilibili-player .bpx-player-container');
    var player = $('.bpx-player-video-wrap video')[0];
    var playerSize = 'normal';


    // 检测一次视频暂停
    var paused = false;
    var setPause = function(){
        paused = true;
        player.removeEventListener('pause', setPause);
    }
    player.addEventListener('pause', setPause);

    function resizeContainer(){
        switch (playerSize){
            case 'wide':
                playerContainer.find('.bpx-player-ctrl-wide-enter')[0].click();
                break;
            case 'web':
                playerContainer.find('.bpx-player-ctrl-web-enter')[0].click();
                break;
            case 'full':
                playerContainer.find('.bpx-player-ctrl-full')[0].click();
                break;
        }
    }

    // 删除一次弹窗
    var popup = setInterval(function(){
        var mask = $('.bili-dialog-m');
        if(!mask.length){
            playerSize = playerContainer.attr('data-screen');
            return;
        }

        window.clearInterval(popup);

        if(!mask.find('.btn-getvip').length){
            return;
        }

        console.log('跳过大会员弹窗');
        mask.find('.icon.close')[0].click();

        if(playerSize !== 'normal'){
            // 全屏的话应该是因为窗口没有聚焦, 故点击无法生效
            resizeContainer();
            if(playerSize !== 'full'){
                var resizer = setInterval(function(){
                    if(playerContainer.attr('data-screen')!== playerSize){
                        console.log('恢复视频窗口大小: ' + playerSize);
                        resizeContainer();
                    }else{
                        window.clearInterval(resizer);
                    }
                },100);
            }
        }

        // 如果视频暂停过则继续播放视频
        setTimeout(function(){
            paused && $('.bpx-player-video-wrap video')[0].play();
        },5);
    },10);
})();