// ==UserScript==
// @name         修正 PTT 顯示圖片
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Fix Imgur image display on PTT
// @author       abc0922001
// @match        https://www.ptt.cc/bbs/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/536647/%E4%BF%AE%E6%AD%A3%20PTT%20%E9%A1%AF%E7%A4%BA%E5%9C%96%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/536647/%E4%BF%AE%E6%AD%A3%20PTT%20%E9%A1%AF%E7%A4%BA%E5%9C%96%E7%89%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const imgurRegex = /imgur\.com\/([^./]+)/;

    // 添加樣式，使 Imgur 圖片以區塊形式顯示
    const style = document.createElement('style');
    style.textContent = 'img.imgur { display: block; }';
    document.head.appendChild(style);

    // 處理所有 <a> 標籤中的 Imgur 連結
    const linkMap = {};
    for (const link of document.getElementsByTagName('a')) {
        if (!imgurRegex.test(link.href)) continue;
        const match = imgurRegex.exec(link.href);
        const key = match[1];
        if (linkMap[key]) {
            linkMap[key].push(link);
        } else {
            linkMap[key] = [link];
        }
    }

    // 為每個 Imgur 連結後插入圖片
    for (const [key, links] of Object.entries(linkMap)) {
        for (const link of links) {
            const img = document.createElement('img');
            img.src = `https://i.imgur.com/${key}.jpg`;
            img.className = 'imgur';
            img.referrerPolicy = 'no-referrer';
            link.after(img);
        }
    }

    // 移除包含 Imgur 的 iframe 的父節點
    const iframesToRemove = [];
    for (const iframe of document.getElementsByTagName('iframe')) {
        if (imgurRegex.test(iframe.src)) {
            iframesToRemove.push(iframe.parentNode);
        }
    }
    for (const parent of iframesToRemove) {
        parent.remove();
    }
})();