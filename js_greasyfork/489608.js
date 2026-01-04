// ==UserScript==
// @name         片源网自动复制磁链
// @namespace    http://yourwebsite.com
// @version      0.3
// @description  自动把片源网的磁链复制到剪贴板上
// @author       JSSM
// @license      MIT
// @match        *://*.pianyuan.org/*
// @match        *://*.pianyuan.cc/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/489608/%E7%89%87%E6%BA%90%E7%BD%91%E8%87%AA%E5%8A%A8%E5%A4%8D%E5%88%B6%E7%A3%81%E9%93%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/489608/%E7%89%87%E6%BA%90%E7%BD%91%E8%87%AA%E5%8A%A8%E5%A4%8D%E5%88%B6%E7%A3%81%E9%93%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
        const keywords = [
        { keyword: 'DV', color: 'red' },
        { keyword: '10BIT', color: 'red' },
        { keyword: 'HDR', color: 'red' },
        { keyword: 'PROPER', color: 'red' },
        { keyword: '2160P', color: 'red' }
    ];
    const links = document.querySelectorAll('td.nobr a.ico.ico_bt');
    links.forEach(link => {
        let text = link.textContent;
        keywords.forEach(item => {
            const regex = new RegExp(`(${item.keyword})`, 'gi');
            text = text.replace(regex, `<span style="background-color:${item.color};">${item.keyword}</span>`);
        });
        link.innerHTML = text;
    });
    window.addEventListener('load', function() {
        var magnets = document.querySelectorAll('a.btn-primary.btn-sm');
        magnets.forEach(function(magnetElement) {
            var magnetText = magnetElement.getAttribute('href');
            var magnetLink = magnetText.match(/magnet:\?xt=urn:btih:\w+/)[0];
            GM_setClipboard(magnetLink, 'text');
            magnetElement.innerHTML = magnetElement.innerHTML.replace('点击使用磁力下载', '磁力已复制到剪贴板');
        });
    });
})();
