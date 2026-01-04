// ==UserScript==
// @name         哔哩哔哩1.75倍速播放
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @license      GPL-3.0
// @description  哔哩哔哩1.75倍速 bilibili1.75倍速播放 哔哩哔哩播放 bilibibli播放 哔哩哔哩加速播放
// @author       Golden Lee
// @match        https://www.bilibili.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456455/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9175%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/456455/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9175%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 8秒延迟，是为了页面完全加载完毕，且bili的异步数据完全获取到
    setTimeout(function(){
        var menu = document.querySelector(".bpx-player-ctrl-playbackrate-menu")
        var node1_5 = document.querySelector(".bpx-player-ctrl-playbackrate-menu-item[data-value='1.5']")

        // 新增1.75 DOM
        var li = document.createElement('li')
        var text = document.createTextNode('1.75')
        li.setAttribute('class','bpx-player-ctrl-playbackrate-menu-item')
        li.setAttribute('data-value','1.75')
        li.appendChild(text)

        // insertBefore
        if (menu) {
            menu.insertBefore(li, node1_5)
        }

        // click 1.75
        var DOM1_7_5 = document.querySelector(".bpx-player-ctrl-playbackrate-menu-item[data-value='1.75']")
        if (DOM1_7_5) {
            DOM1_7_5.addEventListener('click',function(){
                document.querySelector('video').playbackRate = 1.75
            })
        }
    }, 8000)

})();