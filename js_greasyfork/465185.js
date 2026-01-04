// ==UserScript==
// @name         液体百科（liquipedia）屏蔽TW旗(主播)
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  无任何政治观点，仅方便用于直播！！！！
// @author       You
// @match        https://liquipedia.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aichatos.top
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465185/%E6%B6%B2%E4%BD%93%E7%99%BE%E7%A7%91%EF%BC%88liquipedia%EF%BC%89%E5%B1%8F%E8%94%BDTW%E6%97%97%28%E4%B8%BB%E6%92%AD%29.user.js
// @updateURL https://update.greasyfork.org/scripts/465185/%E6%B6%B2%E4%BD%93%E7%99%BE%E7%A7%91%EF%BC%88liquipedia%EF%BC%89%E5%B1%8F%E8%94%BDTW%E6%97%97%28%E4%B8%BB%E6%92%AD%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let blockedSources = ["https://liquipedia.net/commons/images/6/65/Tw_hd.png","https://liquipedia.net/commons/images/thumb/6/65/Tw_hd.png/36px-Tw_hd.png"];
    let images = document.getElementsByTagName('img');
    for (let i = 0; i < images.length; i++) {
        if (blockedSources.includes(images[i].src)) {
            images[i].style.display = "none";
        }
    }
})();