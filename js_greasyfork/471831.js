// ==UserScript==
// @name        移除 Bilibili 链接垃圾参数
// @namespace   https://github.com/s0urcelab/userscripts
// @match       https://www.bilibili.com/video/*
// @match       https://live.bilibili.com/*
// @grant       none
// @version     1.3
// @author      s0urce
// @description 移除Bilibili地址栏链接中的垃圾参数，如spm_id_from、from_sourse、from等
// @icon        https://www.bilibili.com/favicon.ico
// @run-at      document-start
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/471831/%E7%A7%BB%E9%99%A4%20Bilibili%20%E9%93%BE%E6%8E%A5%E5%9E%83%E5%9C%BE%E5%8F%82%E6%95%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/471831/%E7%A7%BB%E9%99%A4%20Bilibili%20%E9%93%BE%E6%8E%A5%E5%9E%83%E5%9C%BE%E5%8F%82%E6%95%B0.meta.js
// ==/UserScript==
 
// 垃圾参数列表
// Thanks to [Bilibili 干净链接](https://greasyfork.org/zh-CN/scripts/393995)
const SPAM_PARAMS = new Set([
    'spm_id_from',
    'from_source',
    'msource',
    'bsource',
    'seid',
    'source',
    'session_id',
    'visit_id',
    'sourceFrom',
    'from_spmid',
    'share_source',
    'share_medium',
    'share_plat',
    'share_session_id',
    'share_tag',
    'unique_k',
    'csource',
    'vd_source',
    'tab',
    'is_story_h5',
    'share_from',
    'plat_id',
    '-Arouter',
    'launch_id',
    'live_from',
    'hotRank',
    'broadcast_type',
])
 
const removeSpam = function (url) {
    const [withoutHash, hash] = url.split('#')
    const [pathname, qs] = withoutHash.split('?')
    const params = new URLSearchParams(qs)
    const newParams = new URLSearchParams()
    for (const [key, val] of params) {
        if (!SPAM_PARAMS.has(key)) {
            newParams.append(key, val)
        }
    }
    const newQs = newParams.toString()
    return `${pathname}${newQs ? `?${newQs}` : ''}${hash ? `#${hash}` : ''}`
}
 
// 劫持history原生方法
function hijackHistoryNative(name) {
    const historyFunc = history[name]
    return function () {
        // 修改url参数
        const { 2: url } = arguments
        arguments[2] = removeSpam(url)
        // console.error(name, arguments[2])
        return historyFunc.apply(this, arguments)
    }
}
history.pushState = hijackHistoryNative('pushState')
history.replaceState = hijackHistoryNative('replaceState')
 
// 劫持window.open原生方法（live直播跳转）
function hijackOpenNative() {
    const openFunc = window.open
    return function () {
        // 修改url参数
        const { 0: url } = arguments
        arguments[0] = removeSpam(url)
        return openFunc.apply(this, arguments)
    }
}
window.open = hijackOpenNative()