// ==UserScript==
// @name         哔哩哔哩bilibili自动720P
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  阿B我错了,改清晰度的是其他插件
// @author       JoshCai233
// @match        https://www.bilibili.com/video/*
// @icon         https://favicon.yandex.net/favicon/v2/http://www.bilibili.com/?size=32
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462468/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9bilibili%E8%87%AA%E5%8A%A8720P.user.js
// @updateURL https://update.greasyfork.org/scripts/462468/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9bilibili%E8%87%AA%E5%8A%A8720P.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(document).ready(function () {
        // 开局自动调720p, 检测到清晰度更改之后5秒再次自动调清晰度至720p...因为一些插件可能循环调画质
        var delay=1000;
        var waitForOperation=false;

        var resNode=null;
        var x=0;
        var resInterval=setInterval(function(){
            if(waitForOperation){
                return;
            }
            resNode=getResolution();
            if(resNode.length){
                if(!resNode .hasClass('bpx-state-active')){
                    waitForOperation=true;
                    setTimeout(function(){
                        waitForOperation=false;
                        if(cancelOperation){
                            return;
                        }
                        resNode.click();
                        x++;
                        console.log(new Date(),': 第'+x+'次切换清晰度为 720P');
                    },delay);
                    delay+=2000;
                }
            }
        },1001);
        function getResolution(){
            return $('.bpx-player-ctrl-quality-menu-item[data-value=64]');
        }

        // 手动点击清晰度数值时清除间隔
        var cancelOperation=false;
        var oldButtons=[];// 页面有时候会刷新
        var clickToClearInterval=setInterval(function(){
            var buttons=$('.bpx-player-ctrl-quality-result,.bpx-player-ctrl-quality-menu-item[data-value!=64]');
            if(buttons.length<3){
                return;
            }
            if(!oldButtons.length){
                oldButtons=buttons;
                cancelCheck(buttons);
                return;
            }
            else{
                var notEq=false;
                for(var b=0;b<buttons.length;b++){
                    var found=false;
                    for(var o=0;o<oldButtons.length;o++){
                        if(oldButtons[o]==buttons[b]){
                            found=true;
                            break;
                        }
                    }
                    if(!found){
                        notEq=true;
                        break;
                    }
                }
                if(notEq){
                    oldButtons=buttons;
                    cancelCheck(buttons);
                    return;
                }
            }
        });
        function cancelCheck(buttons){
            buttons.click(function(){
                // 手动切换的才走这一句
                if($(".bpx-player-ctrl-quality-menu").height()>10){
                    console.log("取消自动切换清晰度");
                    cancelOperation=true;
                    window.clearInterval(resInterval);
                }
            });
        }
    });
})();
