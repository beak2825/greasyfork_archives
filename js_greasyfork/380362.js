// ==UserScript==
// @name         直播 屏蔽弹幕 (目前 huya,douyu)
// @namespace    https://github.com/unkownY/TamperMonkey-script
// @version      0.1
// @description  直播弹幕屏蔽,目前 支持 huya,douyu
// @author       unkownY
// @match        *://www.huya.com/*
// @match        *://www.douyu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/380362/%E7%9B%B4%E6%92%AD%20%E5%B1%8F%E8%94%BD%E5%BC%B9%E5%B9%95%20%28%E7%9B%AE%E5%89%8D%20huya%2Cdouyu%29.user.js
// @updateURL https://update.greasyfork.org/scripts/380362/%E7%9B%B4%E6%92%AD%20%E5%B1%8F%E8%94%BD%E5%BC%B9%E5%B9%95%20%28%E7%9B%AE%E5%89%8D%20huya%2Cdouyu%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    let host = window.location.host;

    switch(host){
        case host.includes('huya'):
            let huya = setInterval(function(){
                let danmuwrap = document.getElementById('danmuwrap');
                if(danmuwrap) {
                    danmuwrap.style.opacity = 0;
                    clearInterval(huya);
                }
            },1000);
            break;
        case host.includes('douyu'):
            let douyu = setInterval(function(){
                let jsPlayerVideo = document.getElementById('js-player-video');
                if(jsPlayerVideo) {
                    jsPlayerVideo.style.opacity = 0;
                    clearInterval(douyu);
                }
            },1000);
            break;
        default:
            console.log('It\'s not right');
    }

})();