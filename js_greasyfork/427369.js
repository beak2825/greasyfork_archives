// ==UserScript==
// @name         Speed up for Youtube
// @description  Press right key to speed up, NoStop
// @version      1.05
// @author      Harry
// @match        https://*.youtube.com/*
// @match        https://*.zoom.us/*
// @match        https://*.ixigua.com/*
// @match        https://*.mgtv.com/*
// @match        https://v.qq.com/*
// @match        http://www.zjstv.com/*
// @match        http://*.cctv.com
// @icon         https://www.youtube.com/s/desktop/fc7b0168/img/favicon.ico
// @connect      googlevideo.com
// @license      MIT
// @namespace https://greasyfork.org/users/662979
// @downloadURL https://update.greasyfork.org/scripts/427369/Speed%20up%20for%20Youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/427369/Speed%20up%20for%20Youtube.meta.js
// ==/UserScript==
(function () {
    'use strict';
    let count = 0
    let page_video
    let speedupKey = 39
    let history_rate = 1
    const tryPageVideo = () => Array.prototype.find.call(document.getElementsByTagName('video'), e => e.currentTime > 0.1)
    const getPageVideo = () => {
        return new Promise(resolve => {
            const timer = setInterval(() => {
                const page_video = tryPageVideo()
                console.log(page_video.playbackRate);
                if (page_video) {
                    clearInterval(timer)
                    resolve(page_video)
                }
            }, 500);
        })
    };

    const checkPageVideo = async () => {
        if (page_video.currentTime <= 0) {
            page_video = await getPageVideo()
            if (page_video.currentTime <= 0) {
                return false
            }
        }

        return true
    }

    const relativeEvent = {
        _stopper: e => e.stopPropagation(),
    }

    const downEvent_right = async e => {
        if (e.keyCode !== speedupKey) return
        e.stopPropagation()
        count++

        if (count === 2 && await checkPageVideo()) {
            relativeEvent.shouldPrevent && relativeEvent.prevent()
            history_rate = page_video.playbackRate
            page_video.playbackRate = 3
            console.log(page_video.playbackRate)
            console.log('speed up for 3x times')
        }
    }
    const upEvent_right = async e => {
        if (e.keyCode !== speedupKey) return
        e.stopPropagation()

        if (count >= 2 && page_video.playbackRate > 1) {
                page_video.playbackRate = history_rate
                console.log('cancel speed up')
            relativeEvent.shouldPrevent && relativeEvent.allow()
        }else{
                page_video.currentTime += 5
            }

        count = 0
    }
    const init = async () => {
        page_video = await getPageVideo()
        document.body.addEventListener('keydown', downEvent_right, true)
        document.body.parentElement.addEventListener('keyup', upEvent_right, true)
    }

    init()
   Object.defineProperties(document, { 'hidden': {value: false}, 'webkitHidden': {value: false}, 'visibilityState': {value: 'visible'}, 'webkitVisibilityState': {value: 'visible'} });
setInterval(function(){
        document.dispatchEvent( new KeyboardEvent( 'keyup', { bubbles: true, cancelable: true, keyCode: 143, which: 143 } ) );
}, 60000);
})();
