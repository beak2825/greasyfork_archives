// ==UserScript==
// @name         CSDN免关注阅读全文
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  方便各大程序员免关注阅读CSDN全文
// @author       bbbyqq
// @match        *://blog.csdn.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @grant        GM_addStyle
// @license      bbbyqq
// @downloadURL https://update.greasyfork.org/scripts/448279/CSDN%E5%85%8D%E5%85%B3%E6%B3%A8%E9%98%85%E8%AF%BB%E5%85%A8%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/448279/CSDN%E5%85%8D%E5%85%B3%E6%B3%A8%E9%98%85%E8%AF%BB%E5%85%A8%E6%96%87.meta.js
// ==/UserScript==

(function () {
    'use strict'

    const hide_article_box = document.querySelector('.hide-article-box')
    const btn = document.createElement('div')
    const css = `
    .btn-no-follow {
        background: #fc5531;
        color: #ffffff;
        width: 130px;
        border-radius: 12px;
        margin: 10px auto;
        cursor: pointer;
        height: 24px;
        line-height: 24px;
    }
    .btn-no-follow:hover {
        background: #ff6e6e;
    }`
    GM_addStyle(css) // GM_addStyle动态添加css
    btn.textContent = '免关注阅读全文'
    btn.className = 'btn-no-follow'
    hide_article_box.appendChild(btn)

    // 免关注阅读全文
    btn.onclick = function () {
        const article_content = document.getElementById("article_content")
        article_content.removeAttribute("style")

        const follow_text = document.getElementsByClassName('follow-text')[0]
        follow_text.parentElement.parentElement.removeChild(follow_text.parentElement)

        const hide_article_box = document.getElementsByClassName(' hide-article-box')[0]
        hide_article_box.parentElement.removeChild(hide_article_box)
    }
})()

