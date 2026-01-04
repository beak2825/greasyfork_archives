// ==UserScript==
// @name         B站 自动播放 & 网页宽屏
// @namespace    https://greasyfork.org/users/91873
// @version      1.0.0.3
// @description  Bilibili Autoplay & WideScreen
// @author       wujixian
// @include      http*://*bilibili.com/video/*
// @include      https*//*bilibili.com/bangumi/play/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/393397/B%E7%AB%99%20%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%20%20%E7%BD%91%E9%A1%B5%E5%AE%BD%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/393397/B%E7%AB%99%20%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%20%20%E7%BD%91%E9%A1%B5%E5%AE%BD%E5%B1%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const SN = '[B站 自动播放 & 网页宽屏]' // script name
    console.log(SN, '油猴脚本开始')

    // 监听页面跳转事件
    let _wr = function(type) {
        let orig = history[type + SN]
        return function() {
            let rv = orig.apply(this, arguments),
                e = new Event(type + SN)
            e.arguments = arguments
            window.dispatchEvent(e)
            return rv
        }
    }
    history.pushState = _wr('pushState')
    history.replaceState = _wr('replaceState')

    let widescreen_and_autoplay = function() {        
        let playing = 0        
        let play_count_limit = 3
        let widescreen = false
        let main = setInterval(function() {
            if (!widescreen) {
                let wideScreenBtn = document.querySelector('.bilibili-player-video-btn-widescreen')
                console.debug(SN, 'Wide Screen Button:', wideScreenBtn)
                if (wideScreenBtn) {
                    let closed = wideScreenBtn.className.includes('closed')
                    console.debug(SN, 'Closed:', closed)
                    if (closed) {
                        console.log(SN, 'widescreen OK')
                        widescreen = true
                    } else {
                        wideScreenBtn.click()
                    }
                }
            }
            if (playing < play_count_limit) {             
                let playBtn = document.querySelector('.bilibili-player-video-btn-start');
                console.debug(SN, 'Play Button:', playBtn)
                if (playBtn) {                    
                    let check = playBtn.className.includes('video-state-pause')
                    console.debug(SN, 'Playing check:', check)
                    if (!check) {
                        playing++
                        console.log(SN, 'Playing:', playing)
                    } else {
                        playBtn.click()
                    }
                }
            }
            if (playing >= play_count_limit && widescreen) {
                console.log(SN, 'Finish')
                clearInterval(main)
            }
        }, 200);
    }
    // 初次进入页面时运行
    widescreen_and_autoplay()
})();
