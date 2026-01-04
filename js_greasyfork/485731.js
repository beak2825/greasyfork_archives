// ==UserScript==
// @name         B站自动开启双语字幕
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动开启B站双语字幕
// @match        https://www.bilibili.com/video/*
// @author       tongxin
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/485731/B%E7%AB%99%E8%87%AA%E5%8A%A8%E5%BC%80%E5%90%AF%E5%8F%8C%E8%AF%AD%E5%AD%97%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/485731/B%E7%AB%99%E8%87%AA%E5%8A%A8%E5%BC%80%E5%90%AF%E5%8F%8C%E8%AF%AD%E5%AD%97%E5%B9%95.meta.js
// ==/UserScript==

(() => {
    'use strict';
    const useBilingualSubtitles = () => {
        const intervalId = setInterval(()=>{
            const subtitlesToggle = document.querySelector('div.bpx-player-ctrl-btn.bpx-player-ctrl-subtitle > div.bpx-player-ctrl-btn-icon > span.bpx-common-svg-icon')
            const bilingualSubtitles = document.querySelector('div.bpx-player-ctrl-btn.bpx-player-ctrl-subtitle > div.bpx-player-ctrl-subtitle-box > div > div > div > div > div.bui-panel-item.bui-panel-item-active > div > div.bpx-player-ctrl-subtitle-add-wrap.bpx-player-ctrl-subtitle-item-flex > div.bpx-player-ctrl-subtitle-bilingual.bui.bui-checkbox.bui-dark > div > input')

            if(subtitlesToggle){
                subtitlesToggle.click()
                if(bilingualSubtitles){
                  bilingualSubtitles.click()
                }
                clearInterval(intervalId);
            }
        },1000)
        }

    const intervalId = setInterval( ()=> {
        var video = document.querySelector('video');
        if (video) {
            video.addEventListener('loadeddata', useBilingualSubtitles);
            clearInterval(intervalId);
        }
    }, 1000);

})();