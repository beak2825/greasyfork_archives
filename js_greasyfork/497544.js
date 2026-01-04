// ==UserScript==
// @name         DIC Check imgURL
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  种子页检查图床链接
// @author       colder
// @match        https://dicmusic.com/torrents.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497544/DIC%20Check%20imgURL.user.js
// @updateURL https://update.greasyfork.org/scripts/497544/DIC%20Check%20imgURL.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const whitelist = ['ptpimg.me','dicimg.kshare.club','img2.kshare.club'];
    const blacklist = ['i.imgur.com','funkyimg.com','e-cdns-images.dzcdn.net','fastpic.ru'];


    let images = document.querySelectorAll('img');
    images.forEach(image => {
        let url = new URL(image.src);
        let domain = url.hostname;
        // 如果域名在白名单内，则不显示域名
        if (whitelist.includes(domain)) {
            return;
        }
        // 查找图片所在<tr>元素
        let trElement = image.closest('tr');
        if (!trElement) return;
        // 查找<tr>元素内的<div class="tags">
        let tagsDiv = trElement.querySelector('div.tags');
        if (!tagsDiv) return;
        // 创建一个新的div元素来显示域名
        let domainLabel = document.createElement('div');
        domainLabel.textContent = domain;
        domainLabel.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        domainLabel.style.color = 'white';
        domainLabel.style.padding = '2px 5px';
        domainLabel.style.fontSize = '12px';
        domainLabel.style.display = 'inline-block';
        domainLabel.style.marginTop = '5px';
        // 如果域名在黑名单内，则以红色显示域名
        if (blacklist.includes(domain)) {
            domainLabel.style.backgroundColor = 'red';
        }
        // 将新的div元素插入到<div class="tags">之后
        tagsDiv.insertAdjacentElement('afterend', domainLabel);
    });
})();
