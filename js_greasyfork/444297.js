// ==UserScript==
// @name         Juan King Catcher
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  catch juan king!
// @author       HeziCyan
// @license      GPL
// @match        *://www.luogu.com.cn/record/list?user=*
// @icon         https://www.luogu.com.cn/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/444297/Juan%20King%20Catcher.user.js
// @updateURL https://update.greasyfork.org/scripts/444297/Juan%20King%20Catcher.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Notification.requestPermission()
    let lst = sessionStorage.getItem('lstDate')
    if (!lst) lst = new Date(0)
    function Catch() {
        let year = /^\d{4}-*$/
        let str = document.querySelector("#app > div.main-container > main > div > div > div > div.border.table > div > div:nth-child(1) > div.user > div > span.lfe-caption").textContent.trim()
        let date = new Date(str)
        if (!year.test(str)) date.setYear(new Date().getFullYear())
        if (lst < date) {
            if (lst.getTime() > 0 && document.hidden) {
                new Notification('XXX 在卷！', { body: '题目是 xxx！' })
            }
            lst = date
        }
    }

    function Reload() {
        // sessionStorage.setItem('reloading', true)
        sessionStorage.setItem('lstDate', lst)
        location.reload()
    }

    window.onload = function() {
        // let reloading = sessionStorage.getItem('reloading')
        // if (reloading) {
        //     sessionStorage.removeItem('reloading')
        sessionStorage.removeItem('lstDate')
        Catch()
        // }
    }

    let timer = setInterval(Reload, 60 * 1000)
})();