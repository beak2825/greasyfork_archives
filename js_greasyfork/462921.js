// ==UserScript==
// @name               巴哈舊版搜尋功能
// @namespace          sn-koarashi-BAHA-OS
// @version            1.1
// @description        讓你的搜尋功能重回舊版
// @author             SN-Koarashi (5026)
// @match              https://forum.gamer.com.tw/*
// @supportURL         https://discord.gg/Sh8HJ4d
// @icon               https://www.google.com/s2/favicons?domain=forum.gamer.com.tw
// @compatible         firefox >= 87
// @compatible         chrome >= 90
// @compatible         edge >= 90
// @license            MIT
// @run-at             document-end
// @downloadURL https://update.greasyfork.org/scripts/462921/%E5%B7%B4%E5%93%88%E8%88%8A%E7%89%88%E6%90%9C%E5%B0%8B%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/462921/%E5%B7%B4%E5%93%88%E8%88%8A%E7%89%88%E6%90%9C%E5%B0%8B%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(location.href.startsWith('https://forum.gamer.com.tw/search.php')){
        let arr = [];
        let query = location.href.split('?').at(-1).split('&');
        query.forEach(q => {
            arr.push(q);
        })

        arr.push('qt=1');

        location.replace(location.origin + '/B.php?' + arr.join('&'));
    }

    document.querySelectorAll('input.gsc-input').forEach(e=>e.setAttribute('type','search'));
})();