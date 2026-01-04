// ==UserScript==
// @name        bilibili记忆AI字幕开关状态
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
// @downloadURL https://update.greasyfork.org/scripts/462859/bilibili%E8%AE%B0%E5%BF%86AI%E5%AD%97%E5%B9%95%E5%BC%80%E5%85%B3%E7%8A%B6%E6%80%81.user.js
// @updateURL https://update.greasyfork.org/scripts/462859/bilibili%E8%AE%B0%E5%BF%86AI%E5%AD%97%E5%B9%95%E5%BC%80%E5%85%B3%E7%8A%B6%E6%80%81.meta.js
// ==/UserScript==

let want_open = false
// 是否只有ai字幕
function isOnlyAiSubtitle() {
    const all_sub = Array.from(document.querySelectorAll('.bpx-player-ctrl-subtitle-major-inner>.bpx-player-ctrl-subtitle-language-item'))
    const ai_sub = document.querySelector('div[data-lan="ai-zh"]')
    if (all_sub.length === 1 && ai_sub === all_sub[0]) return true
    return false
}
// 字幕是否开启
function isSubtitleOpen() {
    const close_sub_button = document.querySelector('.bpx-player-ctrl-subtitle-close-switch')
    const active_buttons = Array.from(document.querySelectorAll('.bpx-player-ctrl-subtitle-close-switch'))
    if (!close_sub_button || active_buttons.includes(close_sub_button)) return false
    return true
}
// 本地储存是否开启
function isRememberOpen() {
    return GM_getValue('subtitleOpen', false)
}
// 开启字幕
function openSubtitle() {
    let sub = document.querySelector('div[data-lan="ai-zh"]')
    console.log('尝试开启字幕', isRememberOpen(), isOnlyAiSubtitle())
    if (isOnlyAiSubtitle() && !isSubtitleOpen() && isRememberOpen() && !want_open) {
        want_open = true
        setTimeout(() => {
            sub.click()
            want_open = false
        }, 300);
    }
}
// 记忆开关状态
function rememberSwitch(e, sub_switch) {
    if (!e.isTrusted) return
    if (!isOnlyAiSubtitle()) {
        console.log('存在非ai字幕, 忽略储存')
        return
    }
    GM_setValue('subtitleOpen', sub_switch)
    console.log('储存字幕开关状态', sub_switch)
}
// 添加回调函数
function addrememberSwitchCallback() {
    document.querySelector('div[data-lan="ai-zh"]')?.addEventListener('click', (e) => { rememberSwitch(e, true) })
    document.querySelector('.bpx-player-ctrl-subtitle-close-switch')?.addEventListener('click', (e) => { rememberSwitch(e, false) })
}
// 视频页面改变监听器
function videoChange() {
    const videoElement = document.querySelector('video')
    videoElement.addEventListener('play', () => {
        openSubtitle()
        addrememberSwitchCallback()
    })
}
(function () {
    let i_num = 0
    i_num = setInterval(() => {
        let k = document.querySelector('div[aria-label="宽屏"]')
        if (!k) return
        clearInterval(i_num)
        openSubtitle()
        videoChange()
        addrememberSwitchCallback()
    }, 100)
})()