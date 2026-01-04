// ==UserScript==
// @name         jiumo鸠摩搜书免关注
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  去除鸠摩搜书的关注公众号弹窗
// @author       You
// @match        *://www.jiumodiary.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420725/jiumo%E9%B8%A0%E6%91%A9%E6%90%9C%E4%B9%A6%E5%85%8D%E5%85%B3%E6%B3%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/420725/jiumo%E9%B8%A0%E6%91%A9%E6%90%9C%E4%B9%A6%E5%85%8D%E5%85%B3%E6%B3%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    document.addEventListener('DOMNodeInserted', e => {
        [...e.target.querySelectorAll('a')].map(ele => {
            ele.onclick = null
            ele.href = ele.getAttribute('data-href') || ele.href
            ele.target = '_blank'
        })
    });

})();