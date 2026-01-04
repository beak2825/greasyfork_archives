// ==UserScript==
// @name         Bilibili 一键开关弹幕（Alt）
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  全屏模式下或视频获得焦点时该键有效
// @author       You
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/bangumi/*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/376383/Bilibili%20%E4%B8%80%E9%94%AE%E5%BC%80%E5%85%B3%E5%BC%B9%E5%B9%95%EF%BC%88Alt%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/376383/Bilibili%20%E4%B8%80%E9%94%AE%E5%BC%80%E5%85%B3%E5%BC%B9%E5%B9%95%EF%BC%88Alt%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    document.addEventListener('keydown', e => e.keyCode === 18 && $('.bilibili-player-video-btn-danmaku')[0].click() || $('.bilibili-player-danmaku-setting-lite-panel').hide())
})();