// ==UserScript==
// @name         uyx-pro
// @namespace    krytro.com
// @version      0.1
// @description  将播放器替换为更强大的DPlayer，以支持弹幕、键盘控制和下载功能
// @author       NitroFire
// @require      https://cdn.jsdelivr.net/npm/dplayer@1.26.0/dist/DPlayer.min.js
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @include      https://apppc.uyxedu.com/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439044/uyx-pro.user.js
// @updateURL https://update.greasyfork.org/scripts/439044/uyx-pro.meta.js
// ==/UserScript==

(function() {
    'use strict'
    var dp = null
    setInterval(() => {
        if (!document.location.href.match('https://apppc.uyxedu.com/uycourse/detail')) {
            dp && dp.destroy()
            dp = null
            return
        }
        var video = $('.video-js video')
        if (video.length !== 0 && video.attr('src')) {
            var src = video.attr('src')
            $('.video-js').remove()
            dp = new DPlayer({
                container: $('.video-wrap')[0],
                screenshot: true,
                video: {
                    url: src,
                },
                playbackSpeed: [0.5, 0.75, 1, 1.25, 1.5, 2, 3],
                danmaku: {
                    id: 'uxy-pro-' + src.match(/[0-9a-f\-]{10,100}/)[0],
                    api: 'https://api.krytro.com:1443/dplayer/',
                },
                contextmenu: [
                    {
                        text: '原视频',
                        link: src,
                    }
                ]
            })
        }
    }, 100)
})();