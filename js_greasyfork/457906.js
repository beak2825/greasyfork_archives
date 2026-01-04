// ==UserScript==
// @name         市网院助手
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  自动点击确定播放视频
// @author       You
// @match        *://gzgbjy.gzswdx.gov.cn/*
// @icon         https://www.google.com/s2/favicons?domain=baidu.com
// @require      http://code.jquery.com/jquery-2.1.1.min.js
// @grant        none
// @license Creative Commons
// @downloadURL https://update.greasyfork.org/scripts/457906/%E5%B8%82%E7%BD%91%E9%99%A2%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/457906/%E5%B8%82%E7%BD%91%E9%99%A2%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待网页完成加载
    window.addEventListener('load', function() {
        // 加载完成后执行的代码
        //4倍速播放
        //document.querySelector('video').playbackRate = 4.0
    }, false);



    //解除焦点移开停止播放
    let oldadd=EventTarget.prototype.addEventListener
    EventTarget.prototype.addEventListener=function (...args){
        if(window.onblur!==null){
            window.onblur=null;
        }
        if(args.length!==0&&args[0]==='visibilitychange'){
            console.log('劫持visibilitychange成功，奥利给！')
            return;
        }
        return oldadd.call(this,...args)
    }

    //解除停止播放
    function bf(){
        //点击确定按钮，点击播放按钮
        document.querySelector(".el-message-box__btns button").click();
        document.querySelector("#dPause").click();
    }

    if(document.querySelector(".el-message-box__btns button")!==null){
        setInterval(bf,1000);
    }
})();