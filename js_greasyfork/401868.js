// ==UserScript==
// @name         禅道git日志
// @namespace    http://tampermonkey.net/
// @version      0.14
// @description  try to take over the world!
// @author       You
// @match        http://oa.yousheng186.com/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/401868/%E7%A6%85%E9%81%93git%E6%97%A5%E5%BF%97.user.js
// @updateURL https://update.greasyfork.org/scripts/401868/%E7%A6%85%E9%81%93git%E6%97%A5%E5%BF%97.meta.js
// ==/UserScript==


(function () {
    'use strict';
    const pathname = location.pathname
    if (/\/task\-view\-/.test(pathname)) {
        $('.page-title').append('<button style="margin-left:15px" class="btn btn-primary" id="copy">复制为git日志</button>')
        const btn = $('#copy')
        btn.click(() => {
            const text = '✨ feat: #' + $('.page-title .label-id').text().trim() + ' ' + $('.page-title .text').text().trim()
            GM_setClipboard(text)
        })
    } else if (/\/bug\-view\-/.test(pathname)) {
        $('.page-title').append('<button style="margin-left:15px" class="btn btn-primary" id="copy">复制为git日志</button>')
        const btn = $('#copy')
        btn.click(() => {
            const text = '🐛 fix: #' + $('.page-title .label-id').text().trim() + ' ' + $('.page-title .text').text().trim()
            GM_setClipboard(text)
        })
    } else if (/\/story\-view\-/.test(pathname)) {
        $('.page-title').append('<button style="margin-left:15px" class="btn btn-primary" id="copy">复制为git日志</button>')
        const btn = $('#copy')
        btn.click(() => {
            const text = '需求#' + $('.page-title .label-id').text().trim() + ' ' + $('.page-title .text').text().trim()
            GM_setClipboard(text)
        })
    }
    else if (/\/my-dynamic.*/.test(pathname)) {
        const list = $('.timeline>li').map(function () {
            const el = $(this)
            return {
                label: el.find('.label-action').text().trim(),
                action: el.find('.text-muted').text().trim(),
                name: el.find('a').text().trim(),
                id: el.find('.label-id').text().trim()
            }
        }).get()
        $('#mainMenu').append('<button style="margin-left:15px" class="btn btn-primary" id="copy1">复制任务</button>')
        $('#mainMenu').append('<button style="margin-left:15px" class="btn btn-primary" id="copy2">复制bug</button>')
        $('#mainMenu').append('<button style="margin-left:15px" class="btn btn-primary" id="copy3">复制任务和bug</button>')
        const btn1 = $('#copy1')
        const btn2 = $('#copy2')
        const btn3 = $('#copy3')
        btn1.click(() => {
            const text = list.filter(e => e.action === '任务' && e.label === '完成了').map((e, index) => e.label + e.action + '#' + e.id + ': ' + e.name).join('\n')
            GM_setClipboard(text)
        })
        btn2.click(() => {
            const text = list.filter(e => e.action === 'Bug').map((e, index) => e.label + e.action + '#' + e.id + ': ' + e.name).join('\n')
            GM_setClipboard(text)
        })
        btn3.click(() => {
            const text = list.filter(e => e.action === '任务' || e.action === 'Bug' || e.label === '完成了' || e.label === '解决了').map((e, index) => e.label + e.action + '#' + e.id + ': ' + e.name).join('\n')
            GM_setClipboard(text)
        })
    }
})();

