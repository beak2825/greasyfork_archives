// ==UserScript==
// @name         闲蛋显示阅读量
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  让闲蛋的文章详情显示阅读量
// @author       xiandan
// @homeurl      https://greasyfork.org/zh-CN/scripts/414994
// @match        https://*xiandan.in/*
// @match        https://*xiandan.io/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/414994/%E9%97%B2%E8%9B%8B%E6%98%BE%E7%A4%BA%E9%98%85%E8%AF%BB%E9%87%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/414994/%E9%97%B2%E8%9B%8B%E6%98%BE%E7%A4%BA%E9%98%85%E8%AF%BB%E9%87%8F.meta.js
// ==/UserScript==
/*jshint esversion: 6 */
(function () {
    'use strict'

    setTimeout(function () {
        const postread = document.querySelector('.article-read')
        if (postread) {
            postread.classList.remove('hidden')
        }
        const totalread = document.querySelector('.total-statistics')
        if (totalread) {
            totalread.classList.remove('hidden')
        }
    }, 1000)

})()
