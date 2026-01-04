// ==UserScript==
// @name         有道笔记相关
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  有道笔记辅助功能优化
// @author       You
// @require      https://code.jquery.com/jquery-2.1.1.min.js
// @match        https://note.youdao.com/web/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youdao.com
// @grant        GM_log
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/446716/%E6%9C%89%E9%81%93%E7%AC%94%E8%AE%B0%E7%9B%B8%E5%85%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/446716/%E6%9C%89%E9%81%93%E7%AC%94%E8%AE%B0%E7%9B%B8%E5%85%B3.meta.js
// ==/UserScript==

;(function () {
    'use strict'
    const isRefresh = localStorage.getItem('isRefresh')
    if (!isRefresh) {
        localStorage.setItem('isRefresh', 1)
        window.location.reload()
    } else {
        localStorage.removeItem('isRefresh')
        $(() => {
            $('.sidebar-header, .sidebar-footer, #sidebar-myshare, #sidebar-recent').hide()
            $('a:contains("云协作")').parent().hide()
        })
    }
})()
