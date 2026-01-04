// ==UserScript==
// @name         雀魂报菜名
// @version      1.1.0
// @description  雀魂游戏语音解锁
// @match        https://game.maj-soul.com/*
// @match        https://www.majsoul.com/*
// @grant        unsafeWindow
// @run-at       document-end
// @namespace https://greasyfork.org/users/188561
// @downloadURL https://update.greasyfork.org/scripts/383254/%E9%9B%80%E9%AD%82%E6%8A%A5%E8%8F%9C%E5%90%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/383254/%E9%9B%80%E9%AD%82%E6%8A%A5%E8%8F%9C%E5%90%8D.meta.js
// ==/UserScript==

(function 报菜名() {
    if (!unsafeWindow.cfg ||
        !unsafeWindow.cfg.voice ||
        !unsafeWindow.cfg.voice.sound) {
        return setTimeout(报菜名, 1000)
    }
    let count = 0
    for (const item of unsafeWindow.cfg.voice.sound.rows_) {
        if (item.level_limit == 0 && !item.bond_limit)
            continue
        item.bond_limit = 0
        item.level_limit = 0
        count++
    }
    Object.values(unsafeWindow.cfg.voice.sound.groups_).forEach(group => {
        for (const item of group) {
            if (item.level_limit == 0 && !item.bond_limit)
                continue
            item.bond_limit = 0
            item.level_limit = 0
            count++
        }
    })
    console.warn("已解锁 %d 个限定语音~", count)
})()
