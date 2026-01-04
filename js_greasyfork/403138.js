// ==UserScript==
// @name         bilibili视频自动宽屏
// @namespace    http://zjfhome.320.io
// @version      1.3
// @description  bilibili视频自动宽屏显示并且自动播放
// @author       Email：a961011576@qq.com
// @match        *://*.bilibili.com/video/*
// @match        *://*.bilibili.com/watchlater/*
// @match        *://*.bilibili.com/bangumi/play/*
// @match        *://*.bilibili.com/medialist/play/*
// @grant        none
// @run-at document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/403138/bilibili%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E5%AE%BD%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/403138/bilibili%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E5%AE%BD%E5%B1%8F.meta.js
// ==/UserScript==
(function () {
    'use strict';
    let observer = new MutationObserver(() => {
        // console.log('监听到了变化')
        init()

    });
    let node = undefined
    if (window.location.href.includes('bilibili.com/bangumi/play'))
        node = document.querySelector(".media-title")
    else
        node = document.querySelector(".tit")

    observer.observe(node, {
        'childList': true,
        'subtree': true
    })
    let init = () => {
        /*定时器循环ms*/
        const time = 50
        const href = window.location.href
        let interval = setInterval(() => {
            // console.log(interval)
            //宽屏DOM
            let playDom = undefined

            if (href.includes('bilibili.com/bangumi/play'))
                playDom = document.querySelector('.squirtle-video-widescreen')
            else
                playDom = document.querySelector('.bilibili-player-iconfont.bilibili-player-iconfont-widescreen-off.player-tooltips-trigger') //宽屏dom
            //playDom = videodom.onloadstart = document.querySelector('.bilibili-player-iconfont.bilibili-player-iconfont-web-fullscreen-off.player-tooltips-trigger')//网页全屏dom
            /*尝试宽屏*/
            if (playDom) {
                window.clearInterval(interval)
                if(!document.querySelector('.squirtle-video-widescreen.squirtle-video-item.active'))
                    playDom.click()
                document.querySelector(".danmaku-wrap").style.display = "none"
            }
        }, time)
    }

})();