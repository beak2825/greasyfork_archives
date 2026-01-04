// ==UserScript==
// @name         钉钉查看表格
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  钉钉查看表格一览
// @author       涂波涛
// @match        https://aflow.dingtalk.com/dingtalk/web/query/pchomepage.htm?from=oflow&op=true&corpid=*
// @icon         https://www.google.com/s2/favicons?domain=dingtalk.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428328/%E9%92%89%E9%92%89%E6%9F%A5%E7%9C%8B%E8%A1%A8%E6%A0%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/428328/%E9%92%89%E9%92%89%E6%9F%A5%E7%9C%8B%E8%A1%A8%E6%A0%BC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(() => {
        document.querySelector('.approve.plain-approve').style.width = '100%'
        document.querySelector('.approve.plain-approve').style['max-width'] = 'inherit'
        document.querySelectorAll('.ding-flow-table-pc .ding-flow-table .table-cell').forEach((item) => {
            item.style['white-space'] = 'normal'
        })
        document.querySelector('.approve-foot.show').style.visibility = 'hidden';
    }, 2000)
})();