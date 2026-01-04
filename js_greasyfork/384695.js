// ==UserScript==
// @name         QQ 空间好友热播移除
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  删除 QQ 空间中插入在信息流中的“好友热播”。
// @author       Nyan Kusanagi <gnwzkd@gmail.com>
// @match        *://user.qzone.qq.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/384695/QQ%20%E7%A9%BA%E9%97%B4%E5%A5%BD%E5%8F%8B%E7%83%AD%E6%92%AD%E7%A7%BB%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/384695/QQ%20%E7%A9%BA%E9%97%B4%E5%A5%BD%E5%8F%8B%E7%83%AD%E6%92%AD%E7%A7%BB%E9%99%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const feedFriendList = document.querySelector('#feed_friend_list');

    if (!feedFriendList) return;

    feedFriendList.addEventListener("DOMSubtreeModified", () => {
        const foolishHotFlags = feedFriendList.querySelectorAll('.f-single-top');

        if (!foolishHotFlags.length) return;

        foolishHotFlags.forEach(foolishHotFlag => {
            const foolishHot = foolishHotFlag.parentNode;
            foolishHot.parentNode.removeChild(foolishHot);

            console.info('A foolish hot video has removed.', foolishHot);
        });
    }, false);

})();
