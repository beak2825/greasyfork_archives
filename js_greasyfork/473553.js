// ==UserScript==
// @name        youtube记忆画面清晰度
// @namespace   Violentmonkey Scripts
// @match       *://www.youtube.com/watch?v=*
// @match       *://www.youtube.com/*
// @match       *://*.youtu.be/*
// @match       *://www.youtube.com/embed/*
// @match       *://www.youtube-nocookie.com/embed/*
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_registerMenuCommand
// @version     4.43
// @author      lazy cat
// @description 2023/7/27 11:45:08
// @run-at      document-end
// @license MIT
// @homepageURL      https://greasyfork.org/zh-CN/scripts/473553-youtube%E9%BB%98%E8%AE%A4%E5%BC%80%E5%90%AF%E6%9C%80%E9%AB%98%E7%94%BB%E8%B4%A8
// @homepage        https://greasyfork.org/zh-CN/scripts/473553-youtube%E9%BB%98%E8%AE%A4%E5%BC%80%E5%90%AF%E6%9C%80%E9%AB%98%E7%94%BB%E8%B4%A8
// @downloadURL https://update.greasyfork.org/scripts/473553/youtube%E8%AE%B0%E5%BF%86%E7%94%BB%E9%9D%A2%E6%B8%85%E6%99%B0%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/473553/youtube%E8%AE%B0%E5%BF%86%E7%94%BB%E9%9D%A2%E6%B8%85%E6%99%B0%E5%BA%A6.meta.js
// ==/UserScript==
function save_loc_px(px) {
    console.log('储存数据', px)
    GM_setValue('yt_px', px)
}
function get_loc_px() {
    console.log('读取数据')
    return GM_getValue('yt_px', 'highres')
}
// 设置清晰度
function set_px(px) {
    console.log('设置清晰度', px)
    if (!px || px === 'none') return
    let player = document.querySelector('div[id="movie_player"]')
    if (!player) return
    player.setPlaybackQualityRange(px)
}
// 获取清晰度列表
function get_px_list() {
    let player = document.querySelector('div[id="movie_player"]')
    if (!player) return []
    return player.getAvailableQualityLevels()
}
// 选择合适清晰度
function select_px() {
    let name_list = ['tiny', 'small', 'medium', 'large', 'hd720', 'hd1080', 'hd1440', 'hd2160', 'hd2880', 'highres']
    let now_px_list = get_px_list()
    if (now_px_list.length === 0) return 'none'
    let loc_px = get_loc_px()
    if (now_px_list.includes(loc_px)) return loc_px
    let now_px_index = name_list.indexOf(now_px_list[0])
    let loc_px_index = name_list.indexOf(loc_px)
    if (loc_px_index >= now_px_index) return now_px_list[0]
    while (loc_px_index > 0) {
        loc_px_index--
        if (now_px_index.includes(name_list[loc_px_index])) return name_list[loc_px_index]
    }
    return now_px_list[0]
}
// 按钮回调函数
function callback_save(e) {
    if (!e.isTrusted) return
    let px = this.innerText.split(' ')[0]
    if (px.includes('画质')) return
    if (!/\d+p6?0?/.test(px)) return
    let px_map = {
        '144p': 'tiny',
        '240p': 'small',
        '360p': 'medium',
        '480p': 'large',
        '720p': 'hd720',
        '1080p': 'hd1080',
        '1440p': 'hd1440',
        '2160p': 'hd2160',
        '2880p': 'hd2880',
        '4320p': 'highres',
        '144p60': 'tiny',
        '240p60': 'small',
        '360p60': 'medium',
        '480p60': 'large',
        '720p60': 'hd720',
        '1080p60': 'hd1080',
        '1440p60': 'hd1440',
        '2160p60': 'hd2160',
        '2880p60': 'hd2880',
        '4320p60': 'highres',
    }
    if (!Object.keys(px_map).includes(px)) return
    console.log('回调函数触发', this)
    save_loc_px(px_map[px])
}
// 清晰度按钮监听器回调函数
function callback_look_button(..._) {
    document.querySelectorAll('.ytp-menuitem-label').forEach((e) => {
        e.addEventListener('click', callback_save)
    })
}
// 清晰度按钮监听器
function look_button_start() {
    let button_fater = document.querySelector('div[id="ytp-id-18"]')
    if (!button_fater) return
    const config = { attributes: true, childList: true, subtree: true }
    const obs = new MutationObserver(callback_look_button)
    obs.observe(button_fater, config)
}
// 视频标题和选集改变调函数
function callback_look_title() {
    console.log('视频改变')
    set_px(select_px())
    look_button_start()
}
// 视频标题和选集改变监听器
function look_title_start() {
    let title = document.querySelector('h1 yt-formatted-string[class="style-scope ytd-watch-metadata"]')?.parentElement
    let video_list = document.querySelectorAll('#container>#items')
    const config = { attributes: true, childList: true, subtree: true }
    const obs = new MutationObserver(callback_look_title)
    if (title) obs.observe(title, config)
    else return setTimeout(look_title_start, 100) // 防止标题未加载完成
    if (video_list.length > 1) obs.observe(video_list[1], config)
}
// 执行一次主要逻辑
function work() {
    console.log('主要逻辑执行')
    set_px(select_px())
    look_button_start()
    look_title_start()
    // 提供ifame内的支持
    if (!in_iframe()) return
    let player = document.querySelector('div[id="movie_player"]')
    player?.removeEventListener('onStateChange', work)
}
// 等待标题加载完成监听器回调函数
function callback_await_load(_, observer) {
    console.log('回调函数执行')
    let title = document.querySelector('h1 yt-formatted-string[class="style-scope ytd-watch-metadata"]')
    let title_2 = document.querySelector('.ytp-title-text')
    if (!title && !title_2) return
    observer.disconnect()
    work()
    // 提供ifame内的支持
    if (!in_iframe()) return
    let player = document.querySelector('div[id="movie_player"]')
    player?.addEventListener('onStateChange', work)
}
// 等待标题加载完成
function await_load() {
    console.log('等待加载')
    let title = document.querySelector('h1 yt-formatted-string[class="style-scope ytd-watch-metadata"]')
    let title_father = document.querySelector('body')
    const config = { childList: true, subtree: true }
    const obs = new MutationObserver(callback_await_load)
    if (title_father && !title) obs.observe(title_father, config)
    else work()
}
// 读取是否对网页内嵌视频生效
function get_emb_mod() {
    return GM_getValue('emb_mod', true)
}
// 改变内嵌视频生效设置
function change_emb_mod() {
    let emb_mod = !get_emb_mod()
    GM_setValue('emb_mod', emb_mod)
    console.log('设置内嵌视频生效', emb_mod)
    location.reload()
}
// 判断是否处于iframe内
function in_iframe() {
    return window.self !== window.top
}
// 程序入口
(function () { 
    let emb_mod = get_emb_mod()
    let show_text = '网页内嵌视频生效' + (emb_mod ? '✔️' : '❌')
    GM_registerMenuCommand(show_text, change_emb_mod)
    if (in_iframe() && !emb_mod) {
        console.log('网页内嵌视频禁止生效')
        return
    }
    let now_url = window.location.href
    if (now_url.includes('watch?v=')) await_load()
    else setTimeout(await_load, 3000)
 })()