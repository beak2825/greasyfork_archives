// ==UserScript==
// @name         贴吧帖子广告过滤器
// @namespace    https://www.dreamcenter.top/
// @version      2025-09-27
// @description  拦截贴吧帖子广告
// @author       dreamcenter
// @match        https://tieba.baidu.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/543266/%E8%B4%B4%E5%90%A7%E5%B8%96%E5%AD%90%E5%B9%BF%E5%91%8A%E8%BF%87%E6%BB%A4%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/543266/%E8%B4%B4%E5%90%A7%E5%B8%96%E5%AD%90%E5%B9%BF%E5%91%8A%E8%BF%87%E6%BB%A4%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onload = function () {
        setInterval(() => {
            var ads = document.querySelectorAll('.ylh-ad-wrap,.ylh-ad-container,.custom-ad-container')

            ads.forEach(item => {
                //console.log(item)
                item.style.display = 'none'
            })
        }, 500)
    }
})();