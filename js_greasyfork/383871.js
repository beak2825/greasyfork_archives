// ==UserScript==
// @name         慕课视频播放器助手
// @description  慕课网视频自动播放下一章；添加快捷键功能；例如：Enter全屏；Ctrl+→下一章节；Ctrl+X关闭右侧的作者简介；L打开/关闭章节列表
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       shanLan
// @match       https://www.imooc.com/video/*
// @grant       none
// @icon        https://www.imooc.com/favicon.ico
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/383871/%E6%85%95%E8%AF%BE%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E5%99%A8%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/383871/%E6%85%95%E8%AF%BE%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E5%99%A8%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /*
==========使用说明==========
慕课网视频自动播放下一章，默认延迟3秒后自动下一章
快捷键功能：
Enter全屏
Ctrl+→下一章节
Ctrl+X关闭右侧的作者简介
L打开/关闭章节列表
==========使用说明==========
*/
    // 默认延迟3秒播放下一个视频
    var nextVideo = 3000;

    $(document).keydown(function (event) {
        console.log(event.keyCode);

        // 绑定enter，进行全屏
        if ( event.keyCode == 13) {
            var fullBtn = document.querySelector('#video-box-mocoplayer-hls-video > div.vjs-control-bar > button.vjs-fullscreen-control.vjs-control.vjs-button');
            if( fullBtn != null )
            {
                console.log("enter");
                fullBtn.click();
            }
        }
        // 绑定Ctrl+→键，下一章播放
        else if (event.ctrlKey && event.keyCode == 39) {
            console.log('c+方向键-右');
            if (event.ctrlKey && event.keyCode == 39){
                var nextBtn = document.querySelector('#J_Box > div.next-box.J_next-box > div > div > div.J-next-btn.next-auto.btn.btn-green');
                if( nextBtn != null )
                {
                    console.log("Ctrl+→");
                    nextBtn.click();
                }
            }

        }
        // Ctrl+←，上一章
        else if (event.ctrlKey && event.keyCode == 37){
            console.log("Ctrl+←");
            var previousBtn = document.querySelector('#J_Box > div.next-box.J_next-box > div > div > div.J-next-btn.next-auto.btn.btn-green');
            if( fullBtn != null )
            {

                fullBtn.click();
            }
        }

        // x 关闭右边的作者介绍
        else if (event.ctrlKey && event.keyCode == 88){
            console.log("x 关闭右边的作者介绍");
            var xBtn = document.querySelector('#courseRight > div.course-right-nano.has-scrollbar > div.nano-right-content.nano-content > div.c-panel.video-panel.current > i.imv2-close.video-panel-close');
            if( xBtn != null )
            {
                xBtn.click();
            }
        }
        // L打开/关闭章节列表
        else if (event.keyCode == 76){
            console.log("L打开/关闭章节列表");
            var lBtn = document.querySelector('#courseSidebar > dl > dd.openchapter');
            if( lBtn != null )
            {
                lBtn.click();
            }
            console.log("L打开/关闭章节列表");
        }
        return false;
    });

    setTimeout(function(){
        //         console.log("已添加video事件监听");

        // 监听video事件，自动播放下一章
        $('.vjs-tech')[0].addEventListener('ended', function() {
            // 显示“3秒下一个视频提示”
            document.querySelector('#J_Box > div.next-box.J_next-box > div > div > div.J-next-auto.hide.next-auto').classList.remove("hide");

            // 延时执行 "下一章"
            setTimeout(function(){
                var nextBtn = document.querySelector('#J_Box > div.next-box.J_next-box > div > div > div.J-next-btn.next-auto.btn.btn-green');
                if( typeof nextBtn.click() !== 'undefined' )
                {
                    nextBtn.click();
                    console.log("自动播放下一章");
                }
            },nextVideo);

        })

    },3000);


})();