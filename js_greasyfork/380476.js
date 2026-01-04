// ==UserScript==
// @name         close_danmaku 默认关闭弹幕
// @namespace    https://github.com/yekingyan/close_danmaku/
// @version      0.1
// @description  默认关闭弹幕!!! 支持bilibi
// @author       Yekingyan
// @match        https://www.bilibili.com/*
// @run-at        document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/380476/close_danmaku%20%E9%BB%98%E8%AE%A4%E5%85%B3%E9%97%AD%E5%BC%B9%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/380476/close_danmaku%20%E9%BB%98%E8%AE%A4%E5%85%B3%E9%97%AD%E5%BC%B9%E5%B9%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let host = window.location.host
    let TARGET_AND_MARK = new Map ([
        // [[hostName, switchSelector], [markSelector, markText]],
        [['bilibili', '.bilibili-player-video-danmaku-switch .bui-checkbox'], 
        ['.bilibili-player-video-danmaku-switch .choose_danmaku', '关闭']],

    ])

    let closeDanmaku = () => {
        for (let [[hostName, switchSelector], [markSelector, markText]] of TARGET_AND_MARK) {
            if (host.includes(hostName)) {
                let [switchDom, markDom] = [switchSelector, markSelector].map(x => document.querySelector(x))
                if (!markDom) {
                    switchDom.click()
                } else if (markDom.innerText.includes(markText)) {
                    switchDom.click()
                }
                break
            }
        }
    }

    window.onload = () => {
        setTimeout(() => {
            closeDanmaku()
        }, 2000);
    }
    
    
})();