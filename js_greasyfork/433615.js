// ==UserScript==
// @name         私用勿扰
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description   "就是自己用,其他人的我一概不负责"
// @author       passion
// @match        *://videoadmin.chinahrt.com/videoPlay/*
// @icon         https://www.woody.vip/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433615/%E7%A7%81%E7%94%A8%E5%8B%BF%E6%89%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/433615/%E7%A7%81%E7%94%A8%E5%8B%BF%E6%89%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';

    setTimeout(() => {
        attrset.ifCanDrag = true
        attrset.ifPauseBlur = false
        console.log('videoObject', videoObject)
    }, 1000)

    setTimeout(() => {
        window.player.videoMute()
        window.player.videoPlay()
        window.player.videoPause = () => {
            console.log('暂停失效')
        }
    }, 3000)

    setTimeout(() => {
        courseyunRecord()
    }, 7000)

    setTimeout(() => {
        let t = document.getElementsByTagName('video')[0].duration - 185
        window.player.videoSeek(t)
    }, 10000)

})();