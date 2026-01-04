// ==UserScript==
// @name         爱奇艺|腾讯视频|去广告
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  支持爱奇艺，腾讯视频站的去除广告行为。
// @author       Leeyw
// @match        *://v.qq.com/*
// @match        *://*.iqiyi.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410213/%E7%88%B1%E5%A5%87%E8%89%BA%7C%E8%85%BE%E8%AE%AF%E8%A7%86%E9%A2%91%7C%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/410213/%E7%88%B1%E5%A5%87%E8%89%BA%7C%E8%85%BE%E8%AE%AF%E8%A7%86%E9%A2%91%7C%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function iqyVideo() {
        window.rate = 0;
        window.Date.now = ()=>{return new window.Date().getTime() + (window.rate += 10000)};
        setInterval(()=>{window.rate = 0}, 600000);
    }

    function tenVideo(){
        console.log("进来0")
        setInterval(()=>{
            if(document.querySelectorAll('video')[0].status == 'IDLE'){

        console.log("进来")
                document.querySelectorAll('video')[2].muted = true
                document.querySelectorAll('video')[3].muted = true
                setInterval(()=>{
                    document.querySelectorAll('video')[2].playbackRate = 16
                    document.querySelectorAll('video')[3].playbackRate = 16
                }, 100)
            }
        }, 100);
    }
    const DOMAIN = location.host;
    switch(DOMAIN) {
        case 'v.qq.com' :
            tenVideo();
            break;
        case 'www.iqiyi.com':
            iqyVideo();
            break;
        default :
            break;
    }
})();