// ==UserScript==
// @name         b站自动跳过充电鸣谢
// @namespace    https://greasyfork.org/zh-CN/scripts
// @version      9.9.91
// @description  b站(bilibili)自动跳过充电鸣谢
// @author       cccq
// @match        *://*.bilibili.com/video/*
// @icon         https://ts1.cn.mm.bing.net/th?id=OIP-C.t_km_I0O-asr3a-bNrejjQHaHa&w=204&h=204&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2
// @grant        none
// @license      cccq
// @downloadURL https://update.greasyfork.org/scripts/441896/b%E7%AB%99%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BF%87%E5%85%85%E7%94%B5%E9%B8%A3%E8%B0%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/441896/b%E7%AB%99%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BF%87%E5%85%85%E7%94%B5%E9%B8%A3%E8%B0%A2.meta.js
// ==/UserScript==

(function() {
    var video = document.querySelectorAll('video')[0];
    // 视频播放结束执行点击跳过按钮
    video.onended = function(){
        var time = setInterval(ClickJump,100);
        var num = 0;

        // 跳过充电鸣谢
        function ClickJump(){
            // 5次后还没加载充电鸣谢 可能是该视频没有充电鸣谢,清除计时器
            num++;
            if(num >= 5)
                clearInterval(time);
            // 是否加载充电鸣谢
            if (document.querySelector('.bilibili-player-electric-panel-jump') != null) {
                // 模拟点击
                document.querySelector('.bilibili-player-electric-panel-jump-content').click();
                clearInterval(time);
            }
        }
    }

})();