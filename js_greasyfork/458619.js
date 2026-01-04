// ==UserScript==
// @name               通用_次要页面音视频处理
// @name:zh-CN         通用_次要页面音视频处理
// @name:en-US         Uni_Secondary pages multimedia processer
// @description        根据配置暂停或静音非聚焦页面。
// @version            1.0.6
// @author             LiuliPack
// @license            WTFPL
// @namespace          https://gitlab.com/LiuliPack/UserScript
// @match              *://*/*
// @run-at             document-end
// @downloadURL https://update.greasyfork.org/scripts/458619/%E9%80%9A%E7%94%A8_%E6%AC%A1%E8%A6%81%E9%A1%B5%E9%9D%A2%E9%9F%B3%E8%A7%86%E9%A2%91%E5%A4%84%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/458619/%E9%80%9A%E7%94%A8_%E6%AC%A1%E8%A6%81%E9%A1%B5%E9%9D%A2%E9%9F%B3%E8%A7%86%E9%A2%91%E5%A4%84%E7%90%86.meta.js
// ==/UserScript==

'use strict';

// 定义模式(Mode)和刚打开(Init)变量，快捷元素选择($(元素定位符))函数
// 处理模式 0 即暂停，1 即静音
// Processing mode 0 is pause, 1 is mute
let Mode = 0,
    Init = true,
    $ = ele => document.querySelector(ele);

// 监听页面可见性
document.addEventListener("visibilitychange", function() {
    document.querySelectorAll('video, audio').forEach((media) => {
        // 定义播放结束`End` 变量
        let End = $('video').duration === $('video').currentTime;

        if(Init) {
            // 检测是否为刚打开页面，是的话定义为 false
            Init = false;
        }else if(!End) {
            // 如果视频未播完
            // 定义页面可见状态
            let Stat = document.hidden;

            // 判断状态
            if(Stat && Mode === 0) {
                // 如果页面不可见且为暂停模式，暂停音视频
                media.pause();
            }else if(Stat && Mode === 1) {
                // 如果页面不可见且为静音模式，暂停音视频
                media.muted = true;
            }else if(!Stat && Mode === 0) {
                // 如果页面可见且为暂停模式，播放音视频
                media.play();
            }else if(!Stat && Mode === 1) {
                // 如果页面可见且为暂停模式，播放音视频
                media.muted = false;
            }
        }
    });
});