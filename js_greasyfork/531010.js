// ==UserScript==
// @name         B 站三倍速
// @namespace    https://www.bilibili.com/
// @version      1.0
// @description  为 B 站视频播放器添加 3.0x 播放速度选项
// @author       Maverick_Pi
// @match        https://www.bilibili.com/video/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531010/B%20%E7%AB%99%E4%B8%89%E5%80%8D%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/531010/B%20%E7%AB%99%E4%B8%89%E5%80%8D%E9%80%9F.meta.js
// ==/UserScript==

(function() {
    'use strict'

    // 目标菜单选择器
    const MENU_SELECTOR = 'bpx-player-ctrl-playbackrate-menu'
    // 目标菜单项选择器
    const MENU_ITEM_SELECTOR = 'bpx-player-ctrl-playbackrate-menu-item'

    // 循环检测直到菜单加载完成
    const checkAndInsert = () => {
        const menu = document.getElementsByClassName(MENU_SELECTOR)[0]
        if (!menu) return

        // 获取已有的倍速选项
        const items = menu.getElementsByClassName(MENU_ITEM_SELECTOR)
        // 查看是否已经有 3 倍速
        const has3x = Array.from(items).some(item => item.dataset.value === '3')
        if (!has3x) {
            menu.insertAdjacentHTML('afterbegin', `
                <li class="${MENU_ITEM_SELECTOR}" data-value="3">3.0x</li>
            `)
        }
    }

    checkAndInsert()
    setInterval(checkAndInsert, 1000)
})()
