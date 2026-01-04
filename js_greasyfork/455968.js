// ==UserScript==
// @name         B站视频调速
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  B站视频调速aa
// @author       zfdev
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/455968/B%E7%AB%99%E8%A7%86%E9%A2%91%E8%B0%83%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/455968/B%E7%AB%99%E8%A7%86%E9%A2%91%E8%B0%83%E9%80%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function saveRate (v) {
        localStorage.setItem('oldRate', v + '')
    }
    function getRate () {
        const old = localStorage.getItem('oldRate')
        if (old) {
            return Number(old)
        }
        return ''
    }
    function getMenu () {
        return document.querySelector('.bpx-player-ctrl-btn.bpx-player-ctrl-playbackrate .bpx-player-ctrl-playbackrate-menu')
    }
    function addBtn () {
        const video = document.querySelector('.bpx-player-container .bpx-player-video-area video')
        const menu = getMenu()
        const plus = document.createElement('li')
        plus.className = `bpx-player-ctrl-playbackrate-menu-item`
        plus.innerHTML = `加速`
        plus.onclick = () => {
            video.playbackRate = video.playbackRate + 0.5
            saveRate(video.playbackRate)
        }
        const sub = document.createElement('li')
        sub.className = `bpx-player-ctrl-playbackrate-menu-item`
        sub.innerHTML = `减速`
        sub.onclick = () => {
            video.playbackRate = video.playbackRate - 0.5
            saveRate(video.playbackRate)
        }

        menu.appendChild(plus)
        menu.appendChild(sub)

        const s3 = document.createElement('li')
        s3.className = `bpx-player-ctrl-playbackrate-menu-item`
        s3.innerHTML = `3.0x`
        s3.onclick = () => (video.playbackRate = 3) && saveRate(video.playbackRate)
        menu.prepend(s3)
        const s4 = document.createElement('li')
        s4.className = `bpx-player-ctrl-playbackrate-menu-item`
        s4.innerHTML = `4.0x`
        s4.onclick = () => (video.playbackRate = 4) && saveRate(video.playbackRate)
        menu.prepend(s4)
        const s5 = document.createElement('li')
        s5.className = `bpx-player-ctrl-playbackrate-menu-item`
        s5.innerHTML = `5.0x`
        s5.onclick = () => (video.playbackRate = 5) && saveRate(video.playbackRate)
        menu.prepend(s5)

       let old = getRate()
       if (old) {
           video.playbackRate = old
       }

    }

    let inner = setInterval(() => {
        if (getMenu()) {
            clearInterval(inner)
            addBtn()

        }
    }, 500)
    setInterval(() => {
        let old = getRate()
        if (old) {
            const video = document.querySelector('.bpx-player-container .bpx-player-video-area video')
            video.playbackRate = old
        }
    }, 2000)

    })();