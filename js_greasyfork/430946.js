// ==UserScript==
// @name         盲人摸瓣
// @namespace    https://www.douban.com/people/masakichi/
// @version      0.1
// @description  无差别刷广播的小脚本（Mock 掉 ID 和头像）
// @author       Yuanji
// @match        https://www.douban.com/*
// @icon         https://www.google.com/s2/favicons?domain=douban.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430946/%E7%9B%B2%E4%BA%BA%E6%91%B8%E7%93%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/430946/%E7%9B%B2%E4%BA%BA%E6%91%B8%E7%93%A3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const dummyAvatar = "https://via.placeholder.com/96?text=User"

    const avatars = document.querySelectorAll('div.usr-pic img')
    for (const n of avatars) {
        n.src = dummyAvatar
    }
    const verifiedAvatars = document.querySelectorAll('div.verify-avatar')
    for (const n of verifiedAvatars) {
        n.style = `background-image: url(${dummyAvatar}); background-size: 48px;`
    }
    const userNames = document.querySelectorAll('a.lnk-people, span.reshared_by a, span a.reshared_by')
    for (const u of userNames) {
        u.innerText = '一个用户'
    }
})();