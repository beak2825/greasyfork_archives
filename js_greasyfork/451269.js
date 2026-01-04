// ==UserScript==
// @name         百度文库免VIP复制
// @version      1.0
// @description  免费复制百度文库内容
// @author       Fish
// @match        https://wenku.baidu.com/view/*
// @icon         https://edu-wenku.bdimg.com/v1/pc/2020%E6%96%B0%E9%A6%96%E9%A1%B5/wenku-header-icon.ico
// @namespace https://greasyfork.org/users/958233
// @downloadURL https://update.greasyfork.org/scripts/451269/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E5%85%8DVIP%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/451269/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E5%85%8DVIP%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

;(function () {
    'use strict'
    window.addEventListener('mouseup', () => {
        setTimeout(() => {
            let name = document.getElementsByClassName('link')
            let _text = name[0].innerText.trim().split('')
            let afterText = _text.slice(7, _text.length - 4).join('')
            navigator.clipboard.writeText(afterText)
        }, 500)
    })

    // Your code here...
})()
