// ==UserScript==
// @name        GTMAP 国图考勤
// @namespace   Violentmonkey Scripts
// @match       http://oa.gtis.com.cn/platform/index.action
// @grant       none
// @version     1.0.1
// @author      ZvonimirSun
// @license     MIT
// @description 2022/8/18 17:01:33
// @downloadURL https://update.greasyfork.org/scripts/449798/GTMAP%20%E5%9B%BD%E5%9B%BE%E8%80%83%E5%8B%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/449798/GTMAP%20%E5%9B%BD%E5%9B%BE%E8%80%83%E5%8B%A4.meta.js
// ==/UserScript==
$(document).ready(() => {
    setTimeout(() => {
        const divs = $('.x-tree-node')
        let btn;
        $.each(divs, (i, div) => {
            const tmpBtn = $(div).find('.x-tree-node-anchor')[0]
            if (div.innerText === "我的考勤") {
                btn = $(div);
            }
        })
        if (btn) {
            btn.click(() => {
                setTimeout(() => {
                    const table = $('#frame_1FB53B2CAA284CE09956B36F5D1EF868').contents().find('#frameMain').contents().find('#viewframe').contents().find('#table1')
                    const inputs = table.find('td > input')
                    inputs.removeAttr('readonly');
                    $('#taskDetailGrid').style('height', '100%');
                }, 1000)
            })
        }
    }, 500)
})