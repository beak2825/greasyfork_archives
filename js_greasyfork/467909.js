// ==UserScript==
// @name         pter 快捷链接
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  猫站快捷链接
// @author       IITII
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @match        https://pterclub.com/*
// @icon         https://avatars.githubusercontent.com/u/33705067?v=4
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467909/pter%20%E5%BF%AB%E6%8D%B7%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/467909/pter%20%E5%BF%AB%E6%8D%B7%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

// @require file:///D:/services/nexusphp_forums/pter_quicklink.js
this.$ = this.jQuery = jQuery.noConflict(true);
(async function () {
    'use strict';
    // 下面每一排对应这里的颜色，你可以自己改改。支持颜色名称和16进制，如：#FF74D7
    const colors = ['red', 'green', 'blue']
    const uidArrs = [
        ['any,1', 'any,1'],
        ['any,1', 'any,1', 'any,1'],
        ['any,1', 'any,1', 'any,1'],
    ]
    // 如果卡片太小显示不下，自己改改这里的 height 和 width
    let card = $('<div><div>').css({ height: '30px', width: '120px', 'margin-right': '5px', position: 'fixed', display: 'block', top: '20em', })
    for (let i = 0; i < uidArrs.length; i++) {
        const uids = uidArrs[i]
        const color = colors[i] || 'orange'
        let row = $('<div style="margin-bottom: 5px"><div>')
        for (let j = 0; j < uids.length; j++) {
            const [name, uid] = uids[j].split(',')
            let button = $(`<button class="layui-btn layui-btn-mini" style="background:${color};margin-left: 5px;">
            <a href="/userdetails.php?id=${uid}" target="_blank">
            <font color="white">${name}</font>
        </a></button>`)
            row.append(button)
        }
        card.append(row)
    }
    $("body").append(card)
})();
