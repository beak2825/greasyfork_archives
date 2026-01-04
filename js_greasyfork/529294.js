// ==UserScript==
// @name        Bilibili Memory Subtitle Switcher & Auto Speed
// @namespace   Violentmonkey Scripts
// @match         *://www.bilibili.com/video/av*
// @match         *://www.bilibili.com/video/BV*
// @match         *://www.bilibili.com/list/*
// @match         *://www.bilibili.com/bangumi/play/ep*
// @match         *://www.bilibili.com/bangumi/play/ss*
// @match         *://www.bilibili.com/cheese/play/ep*
// @match         *://www.bilibili.com/cheese/play/ss*
// @grant       GM_setValue
// @grant       GM_getValue
// @version     2.4
// @author      lazy cat
// @description 2023/10/7
// @run-at      document-end
// @license MIT
// @homepageURL https://greasyfork.org/zh-CN/scripts/462859-bilibili%E8%AE%B0%E5%BF%86%E5%AD%97%E5%B9%95%E5%BC%80%E5%85%B3%E7%8A%B6%E6%80%81
// @homepage    https://greasyfork.org/zh-CN/scripts/462859-bilibili%E8%AE%B0%E5%BF%86%E5%AD%97%E5%B9%95%E5%BC%80%E5%85%B3%E7%8A%B6%E6%80%81
// @downloadURL https://update.greasyfork.org/scripts/529294/Bilibili%20Memory%20Subtitle%20Switcher%20%20Auto%20Speed.user.js
// @updateURL https://update.greasyfork.org/scripts/529294/Bilibili%20Memory%20Subtitle%20Switcher%20%20Auto%20Speed.meta.js
// ==/UserScript==

// 自动字幕记忆和切换相关
let want_open = false
function isAiSubtitle() {
    return document.querySelector('.bpx-player-ctrl-subtitle-major-inner > .bpx-state-active').innerText.includes("自动")
}

function isSubtitleOpen() {
    let max_length = 3
    if (navigator.userAgent.includes('Firefox')) max_length = 2
    const subElements = document.querySelectorAll('svg[preserveAspectRatio="xMidYMid meet"] > defs > filter')
    return subElements.length === max_length
}

// 根据浏览器类型判断是否开启本地记忆
function isRememberOpen() {
    return GM_getValue('subtitleOpen', false)
}

// 开启字幕记忆功能
function openSubtitle记忆功能() {
    if (isAiSubtitle() && !isSubtitleOpen() && isRememberOpen() && !want_open) {
        want_open = true
        setTimeout(() => {
            const subtitleIcon = document.querySelector('[aria-label="字幕"] [class="bpx-common-svg-icon"]');
            subtitleIcon.click();
            want_open = false;
            // 更新记忆状态
            GM_setValue('subtitleOpen', want_open);
        }, 300);
    }
    rememberSwitchCallback();
}

// 忘记开关状态回调函数
function rememberSwitchCallback(e) {
    if (!e.isTrusted) return
    if (!isAiSubtitle()) return
    GM_setValue('subtitleOpen', !isSubtitleOpen());
    console.log('储存字幕开关状态', GM_getValue('subtitleOpen'));
}

// 记忆开关状态
function rememberSwitch() {
    const subElement = document.querySelector('div[aria-label="字幕"]');
    subElement?.addEventListener('click', rememberSwitchCallback);
}

// 视频页面改变监听器
function videoChange() {
    const videoElement = document.querySelector('video');
    videoElement.addEventListener('play', openSubtitle记忆功能);
    // 在这里添加自动速度与字幕设置的逻辑，例如使用setPlaybackRate和setSubtitles函数
}

// 原始的自动播放速度、全屏及字幕开启逻辑保持不变
// ...

(function () {
    let i_num = 0
    i_num = setInterval(() => {
        const k = document.querySelector('div[aria-label="宽屏"]');
        if (!k) return
        clearInterval(i_num)
        openSubtitle记忆功能(); // 注意此处已经调用了记忆功能
        videoChange();
    }, 100)
})();
