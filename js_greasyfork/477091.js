// ==UserScript==
// @name               通用_息屏播放
// @name:zh-CN         通用_息屏播放
// @name:en-US         Uni_Lock-screen playback
// @description        让移动设备浏览器支持息屏播放
// @version            1.0.1
// @author             LiuliPack
// @license            WTFPL
// @homepage           https://gitlab.com/liulipack
// @match              *://*/*
// @supportURL         https://gitlab.com/liulipack/UserScript
// @run-at             document-start
// @namespace https://greasyfork.org/users/463031
// @downloadURL https://update.greasyfork.org/scripts/477091/%E9%80%9A%E7%94%A8_%E6%81%AF%E5%B1%8F%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/477091/%E9%80%9A%E7%94%A8_%E6%81%AF%E5%B1%8F%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

'use strict';

// 监听监听页面可见性
document.addEventListener("visibilitychange", () => {
    // 如果不可见，就遍历音视频让其播放监听页面可见性
    if (document.hidden) {
        document.querySelectorAll('video, audio').forEach(vid => {
            vid.play()
            vid.play()
        })
    }
});