// ==UserScript==
// @name         SongTaste一键下载
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  免金币下载SongTaste资源
// @author       You
// @match        https://www.songtaste8.com/song/*
// @icon         https://www.google.com/s2/favicons?domain=songtaste8.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/435917/SongTaste%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/435917/SongTaste%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(() => {
        const songUrl = document.getElementById('radioPlayer').childNodes[1].src
        const btn = document.querySelector('.ringDown a')
        btn.href = songUrl
    }, 2000);
})();