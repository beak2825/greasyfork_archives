// ==UserScript==
// @name         Copy GitLab Commit Messgae
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  用于复制提交信息到剪贴板
// @author       Qiaoba
// @match        https://git.5th.im/*/merge_requests*
// @icon         https://cdn-icons-png.flaticon.com/128/5968/5968853.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/460444/Copy%20GitLab%20Commit%20Messgae.user.js
// @updateURL https://update.greasyfork.org/scripts/460444/Copy%20GitLab%20Commit%20Messgae.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const handleClick = () => {
        const div = document.createElement('div')
        const url = document.createElement('a')
        url.href = window.location.href
        url.innerText = window.location.href
        div.append(url)
        const blacklist = ['chore']
        const origin = window.location.origin
        document.querySelectorAll('#commits-list .commit-content .item-title').forEach((node) => {
            node.href = node.href.startsWith('/') ? origin + node.href : node.href
        })
        document.querySelectorAll('#commits-list .commit-content').forEach((_node) => {
            const message = _node.querySelector('.item-title')
            if (message) {
                if (!blacklist.some((blackStr) => message.innerHTML.startsWith(blackStr))) {
                    const node = _node.cloneNode(true)
                    const committer = node.querySelector('.committer')
                    if (committer) {
                        node.removeChild(committer)
                    }
                    const hashSpan = node.querySelector('span')
                    if (hashSpan) {
                        node.removeChild(hashSpan)
                    }
                    div.append(node)
                }
            }
        })
        div.append(document.createElement('br'))
        const blobInput = new Blob([div.innerHTML], { type: 'text/html' })
        const clipboardItemInput = new ClipboardItem({ 'text/html': blobInput })
        navigator.clipboard.write([clipboardItemInput]).then(() => {
            btn.innerText = '已复制！'
            btn.disabled = true
            setTimeout(() => {
                btn.innerText = '提交信息'
                btn.disabled = false
            }, 3000)
        })
    }

    const CSSStr = `
        .btn_copy_commit{
            padding: 4px 12px;
            line-height: 26px;
            margin-left: 8px;
            font-size: 16px;
            color: #fffef8;
            background-color: #1772b4;
            border-radius: 8px;
            border: none;
            transition: background-color .2s ease-out;
        }

        .btn_copy_commit:hover {
            background-color: #1a88d5;
        }

        .btn_copy_commit.light {
            color: #35333c;
            border: 1px solid #35333c;
            background-color: #d0dfe6;
        }

        .btn_copy_commit.light:hover {
            background-color: #b1bec4;
        }`
const root = document.querySelector(':root')
const head = document.querySelector('head')
const body = document.querySelector('body')
const actionWrapper = document.querySelector('.js-issuable-actions .dropdown')
const btn = document.createElement('button')

if (root && head && body) {
    const cssEl = document.createElement('style')
    cssEl.innerHTML = CSSStr
    head.append(cssEl)

    const isLight = root.dataset.colorMode?.startsWith('light')
    btn.innerText = '提交信息'
    btn.classList.add('btn_copy_commit', isLight ? 'light' : 'dark')
    btn.onclick = handleClick
    actionWrapper.append(btn)
}
})();