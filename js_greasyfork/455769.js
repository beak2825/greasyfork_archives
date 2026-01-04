// ==UserScript==
// @name         不要黑白
// @namespace    https://keep-silence.com/
// @version      0.2
// @description  多彩世界
// @license      MIT
// @author       Ghosie
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455769/%E4%B8%8D%E8%A6%81%E9%BB%91%E7%99%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/455769/%E4%B8%8D%E8%A6%81%E9%BB%91%E7%99%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 处理百度
    function dealBaidu(page) {
        if (page === 'index') {
            const body = document.querySelector('.big-event-gray')
            if (body) {
                body.className = ''
                document.getElementById('lg').firstElementChild.onerror()
            }
            return
        }
        if (page === 'tieba') {
            if (document.documentElement.className === 'tb-allpage-filter') {
                document.documentElement.style.filter = 'none'
            }
        }
    }

    // 处理微博
    function dealWeibo() {
        const lists = document.querySelectorAll('.grayTheme')
        lists.forEach(item => {
            item.className = item.className.slice(0, item.className.indexOf('grayTheme'))
        })
    }

    // 处理 it之家
    function dealIthome() {
        const lists = document.querySelectorAll('*')
        const len = lists.length
        for (let i = 0; i < len; i++) {
            lists[i].style.filter = 'none'

        }
    }

    const href = window.location.href

    if (/www\.baidu/.test(href)) {
        dealBaidu('index')
    } else if (/tieba/.test(href)) {
        dealBaidu('tieba')
    } else if (/weibo/.test(href)) {
        setTimeout(() => {
            dealWeibo()
        }, 0)
    }else if (/ithome/.test(href)) {
        dealIthome()
    } else {
        document.documentElement.style.filter = 'none'
        document.querySelector('body').style.filter = 'none'
    }
})();