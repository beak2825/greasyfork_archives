// ==UserScript==
// @name         Nga 显示VIP
// @namespace    https://greasyfork.org/users/325815
// @version      1.0.0
// @description  在看帖界面显示用户是否是VIP
// @author       monat151
// @license      MIT
// @match        http*://nga.178.com/read.php?tid=*
// @match        http*://ngabbs.com/read.php?tid=*
// @match        http*://bbs.nga.cn/read.php?tid=*
// @match        http*://bbs.nga.cn/read.php?pid=*
// @match        http*://ngabbs.com/read.php?pid=*
// @match        http*://nga.178.com/read.php?pid=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nga.cn
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/487249/Nga%20%E6%98%BE%E7%A4%BAVIP.user.js
// @updateURL https://update.greasyfork.org/scripts/487249/Nga%20%E6%98%BE%E7%A4%BAVIP.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function isNumeric(str) { return !isNaN(str) && !isNaN(parseFloat(str)); }
    function currentUnixTimeStamp() { return Math.floor(Date.now() / 1000); }

    function getPageJson(cb) {
        fetch(
            document.location.href + '&__output=8'
        ).then(
            res => res.arrayBuffer()
        ).then(res => {
            const text = new TextDecoder('gbk').decode(res)
            const json = JSON.parse(text.replaceAll('\t',''))
            cb(json)
        })
    }
    function isVip(u, ct) {
        if (!u?.buffs || !u.buffs[129]) {
            return false
        }
        let result = false
        for (var i in u.buffs[129]) {
            const buff = u.buffs[129][i]
            if (buff[5] && buff[6]) {
                if (buff[6] === 2048 && buff[5] > ct) {
                    result = true
                }
            }
        }
        return result
    }
    function generateVipUi() {
        const ui = document.createElement('a')
        ui.href = 'javascript:void(0)'
        ui.className = 'small_colored_text_btn stxt block_txt_c0 vertmod'
        ui.style = 'background: #ff5858;'
        ui.innerHTML = 'VIP'
        ui.title = '这个用户是NGA的VIP'
        return ui
    }

    setTimeout(() => {
        getPageJson(json => {
            const currentTimestamp = currentUnixTimeStamp()
            const vips = []
            const users = json.data.__U
            for (var uid in users) {
                if (isNumeric(uid)) {
                    const user = users[uid]
                    if (isVip(user, currentTimestamp)) {
                        vips.push(uid)
                    }
                }
            }
            const pageUidUIs = document.getElementsByName('uid')
            const generalVipUI = generateVipUi()
            for (let i=0; i < pageUidUIs.length; i++) {
                const uid = pageUidUIs[i].innerText
                if (vips.indexOf(uid) >= 0) {
                    document.getElementsByName('uid')[i].after(generateVipUi())
                }
            }
        })
    }, 100)
})();