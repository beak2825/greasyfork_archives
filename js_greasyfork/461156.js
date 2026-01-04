// ==UserScript==
// @name          Facebook 自動轉換電腦版網頁
// @namespace     https://github.com/HayaoGai
// @version       0.0.1
// @description   自動轉換電腦版網頁
// @author        Hayao-Gai
// @match         https://m.facebook.com/*
// @icon          https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/2021_Facebook_icon.svg/2048px-2021_Facebook_icon.svg.png
// @grant         none
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/461156/Facebook%20%E8%87%AA%E5%8B%95%E8%BD%89%E6%8F%9B%E9%9B%BB%E8%85%A6%E7%89%88%E7%B6%B2%E9%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/461156/Facebook%20%E8%87%AA%E5%8B%95%E8%BD%89%E6%8F%9B%E9%9B%BB%E8%85%A6%E7%89%88%E7%B6%B2%E9%A0%81.meta.js
// ==/UserScript==

(function() {
    'use strict'

    init(10)

    function init(times) {
        for (let i = 0; i < times; i++) {
            setTimeout(checkUrl, 500 * i)
        }
    }

    function checkUrl() {
        const url = window.location.href
        if (!url.includes("://m.")) return
        window.location.href = url.replace("://m.", "://")
    }
})()
