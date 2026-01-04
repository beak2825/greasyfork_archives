// ==UserScript==
// @name         知乎直跳网盘
// @namespace    https://weibo.com/u/2792334661
// @version      0.1
// @description  知乎一秒直跳网盘
// @author       萝卜
// @match        https://link.zhihu.com/?target=https%3A//306t.com/file/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416506/%E7%9F%A5%E4%B9%8E%E7%9B%B4%E8%B7%B3%E7%BD%91%E7%9B%98.user.js
// @updateURL https://update.greasyfork.org/scripts/416506/%E7%9F%A5%E4%B9%8E%E7%9B%B4%E8%B7%B3%E7%BD%91%E7%9B%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let url = document.getElementsByClassName("link")[0].innerText
    window.location.href=url
})();