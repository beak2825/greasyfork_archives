// ==UserScript==
// @name         LittleFox 台词
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  LittleFox 台词复制和下载
// @author       You
// @match        https://www.littlefox.com/cn/supplement/org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=littlefox.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/467171/LittleFox%20%E5%8F%B0%E8%AF%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/467171/LittleFox%20%E5%8F%B0%E8%AF%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function copy(text) {
        const input = document.createElement('textarea')
        input.style = { opacity: 0, height: 0, lineHeight: 0, fontSize: 0 }
        input.value = text
        document.body.appendChild(input)
        input.select()
        document.execCommand('copy')
        document.body.removeChild(input)
    }

    function download(fileName, content) {
        const foo = { hello: 'world' }
        const blob = new Blob([content], {
            type: 'text/plain;charset=utf-8',
        })
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = fileName
        link.click()
        window.URL.revokeObjectURL(link.href)
    }

    function getText() {
        const dt = document.querySelector('dt')
        const dt_text = dt.innerText
        const dd = document.querySelector('dd')
        let dd_text = ''
        dd.querySelectorAll('.talk').forEach(
            (el) => (dd_text += el.innerText + '\r\n')
        )
        return {
            title: dt_text,
            content: dd_text,
        }
    }

    function copyText() {
        const { title, content } = getText()
        copy(title + '\r\n\r\n' + content)
    }

    const button = document.createElement('button')
    button.innerText = '复制'
    button.addEventListener('click', copyText)
    button.style.position = 'fixed'
    button.style.right = 0
    button.style.top = '50vh'
    button.style.background = '#79d88f'
    document.body.appendChild(button)

    function downloadText() {
        const { title, content } = getText()
        download(title + '.txt', content)
    }
    setTimeout(downloadText, 1000)
})();