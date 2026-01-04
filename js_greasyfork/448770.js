// ==UserScript==
// @name         哔哩哔哩取消双击全屏
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  取消双击全屏
// @author       倚栏听风
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @match      *://www.bilibili.com/video/BV*
// @match      *://www.bilibili.com/bangumi/play/ep*
// @match      *://www.bilibili.com/bangumi/play/ss*
// @match      *://www.bilibili.com/cheese/play/ep*
// @match      *://m.bilibili.com/bangumi/play/ep*
// @match      *://m.bilibili.com/bangumi/play/ss*
// @match      *://bangumi.bilibili.com/anime/*
// @match      *://bangumi.bilibili.com/movie/*
// @match      *://www.bilibili.com/bangumi/media/md*
// @match      *://www.bilibili.com/blackboard/html5player.html*
// @match      *://www.bilibili.com/watchroom/*
// @match      *://www.bilibili.com/medialist/play/watchlater/BV*
// @match      *://www.bilibili.com/video/av*
// @icon         https://www.google.com/s2/favicons?domain=bilibili.com
// @grant        none
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/448770/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%8F%96%E6%B6%88%E5%8F%8C%E5%87%BB%E5%85%A8%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/448770/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%8F%96%E6%B6%88%E5%8F%8C%E5%87%BB%E5%85%A8%E5%B1%8F.meta.js
// ==/UserScript==

(function () {
    'use strict'

    /**
     * 番剧、课堂等页面设置1.5s之后生效，如不生效请将延迟设置大一点点
     */
    let delay = 1500 //ms

    let url = window.location.href

    if (url.indexOf('video/BV') >= 0) {
        start()
    } else {
        setTimeout(() => {
            start()
        }, delay)
    }

    function start() {
        let area = $('.bpx-player-video-area')
        let perch = $('.bpx-player-video-perch')
        let wrap = $('.bpx-player-video-wrap')
        let video = wrap.children('video')

        wrap.on('click', () => {
            if (video[0].paused)
                video[0].play()
            else
                video[0].pause()
        })
        area.prepend(wrap)
        perch.remove()
    }

})();