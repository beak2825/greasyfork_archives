// ==UserScript==
// @name         YourBittorrent 链接点击拉起下载
// @description  YourBittorrent 点击磁力链接时自动打开下载软件
// @namespace    https://greasyfork.org/zh-CN/users/948411
// @version      1.3
// @author       Moe
// @license      MIT
// @match        https://yourbittorrent2.com/torrent/*
// @icon         https://yourbittorrent2.com/apple-touch-icon.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521228/YourBittorrent%20%E9%93%BE%E6%8E%A5%E7%82%B9%E5%87%BB%E6%8B%89%E8%B5%B7%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/521228/YourBittorrent%20%E9%93%BE%E6%8E%A5%E7%82%B9%E5%87%BB%E6%8B%89%E8%B5%B7%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let content = document.querySelector('kbd');
    content.style.cursor = 'pointer';
    content.addEventListener('click', function() { window.open(`magnet:?xt=urn:btih:${content.innerText}`); });
})();