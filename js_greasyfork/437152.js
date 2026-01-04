// ==UserScript==
// @name         bilibili go next
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  给 b 站加一个快捷键：按 n 就下一集
// @author       wanglongbiao
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?domain=bilibili.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437152/bilibili%20go%20next.user.js
// @updateURL https://update.greasyfork.org/scripts/437152/bilibili%20go%20next.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // let next = document.querySelector('button[data-text=下一个]')
    // 映射 n 为下一集的快捷键
    window.addEventListener('keydown', function(event){
        switch(event.code){
            case 'KeyN':
                document.querySelector('button[data-text=下一个]').click()
                break
        }
    }, true)

    // 自动播放下一集
    var v = document.querySelector('video')
        v.addEventListener('timeupdate', (e) => {
            var duration = v.duration
            let current = v.currentTime
            if(duration - current < 1){
                document.querySelector('button[data-text=下一个]').click()
            }
    })
})();