// ==UserScript==
// @name         MioBT磁链增强
// @namespace    http://tampermonkey.net/
// @version      1.02
// @description  在MioBT的列表页添加一个磁链图标从而允许你不进入详情页直接进行下载
// @author       Yukiteru
// @match        *://www.miobt.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531717/MioBT%E7%A3%81%E9%93%BE%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/531717/MioBT%E7%A3%81%E9%93%BE%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const TRACKER_URL = 'http://open.acgtracker.com:1096/announce';
    const MAGNET_ICON_TEXT = '🧲';
    const HEADER_TEXT = '磁链';

    const listTable = document.querySelector('#listTable');
    if (!listTable) {
        return;
    }

    const thead = listTable.querySelector('thead tr');
    const titleHeader = thead?.querySelector('th.l3');

    if (thead && titleHeader) {
        const newTh = document.createElement('th');
        newTh.textContent = HEADER_TEXT;
        newTh.className = 'tableHeaderOver';
        newTh.setAttribute('axis', 'string');
        newTh.style.textAlign = 'center';
        newTh.style.width = '35px';
        titleHeader.parentNode.insertBefore(newTh, titleHeader.nextSibling);
    }

    const links = listTable.querySelectorAll('tbody tr td a[href^="show-"]');

    links.forEach(link => {
        const parentTd = link.closest('td');
        if (!parentTd) return;

        const href = link.getAttribute('href');
        if (!href) return;

        const match = href.match(/^show-([a-f0-9]{40})\.html$/i);
        if (!match || !match[1]) {
            return;
        }
        const infoHash = match[1].toLowerCase();

        const magnetHref = `magnet:?xt=urn:btih:${infoHash}&tr=${encodeURIComponent(TRACKER_URL)}`;

        const newTd = document.createElement('td');
        newTd.style.textAlign = 'center';

        const magnetLink = document.createElement('a');
        magnetLink.href = magnetHref;
        magnetLink.textContent = MAGNET_ICON_TEXT;
        magnetLink.style.textDecoration = 'none';
        magnetLink.style.fontSize = '1.1em';

        newTd.appendChild(magnetLink);

        parentTd.parentNode.insertBefore(newTd, parentTd.nextSibling);
    });

})();