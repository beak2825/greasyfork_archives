// ==UserScript==
// @license   GPLv3
// @name         bilibili_quiet
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  默认关闭B站弹幕、 将/s/的搜索入口路径自动转向正常视频路径、 隐藏B站视频的浮动弹出通知
// @author       You
// @match        *://www.bilibili.com/video/*
// @match        *://live.bilibili.com/*
// @match        *://www.bilibili.com/s/video/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/arrive/2.4.1/arrive.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423745/bilibili_quiet.user.js
// @updateURL https://update.greasyfork.org/scripts/423745/bilibili_quiet.meta.js
// ==/UserScript==

(function(window) {
    'use strict';

    // 自动转向

    if(/^\/s\/video\/([^\/\?]+)/.test(location.pathname)){
        top.location.href = 'https://www.bilibili.com/video/'+RegExp.$1;
        return
    }


    // 播放
    const f = () => {
            document.arrive('input.bui-switch-input, .bui-danmaku-switch-input', {'onceOnly':1}, function(el){
                if(el.checked) {
                    el.click();
                }
        });
    };


    let _src = null;
    document.arrive('div.bilibili-player-video > video', {'existing':1}, function(el){
       document.unbindArrive('input.bui-switch-input');
       const src = this.src;
       if(src === _src) return;
        _src = src;
        f();
    });

    var style_el = document.createElement('style');
    style_el.textContent = `
.bilibili-player-video-popup {
   display: none!important;
}
`;
    document.head.appendChild(style_el);

})(window);