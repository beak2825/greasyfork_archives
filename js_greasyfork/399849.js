// ==UserScript==
// @name              PC端下载MIUI 主题
// @namespace         https://github.com/LittleControl/DownloadMIUITheme
// @version           1.0
// @icon              https://www.mi.com/favicon.ico
// @description       恢复 MIUI 主题官网的下载按钮
// @author            https://github.com/LittleControl
// @supportURL        https://github.com/LittleControl/DownloadMIUITheme/issues
// @match             *zhuti.xiaomi.com/detail/*
// @downloadURL https://update.greasyfork.org/scripts/399849/PC%E7%AB%AF%E4%B8%8B%E8%BD%BDMIUI%20%E4%B8%BB%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/399849/PC%E7%AB%AF%E4%B8%8B%E8%BD%BDMIUI%20%E4%B8%BB%E9%A2%98.meta.js
// ==/UserScript==

(() => {
    'use strict';
    let arr = location.href.split('/')
    let tag = arr[arr.length - 1]
    let url = 'http://thm.market.xiaomi.com/thm/download/' + tag
    $('#J-downWrap').append(
        `
            <form class="detail-buy" action="${url}">
                <button class="btn-buy J_Push" type="submit">下载</button>
            </form>
        `
    )
})();