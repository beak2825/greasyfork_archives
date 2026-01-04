// ==UserScript==
// @name        flibusta.is качать с названием в клипборде
// @namespace   Violentmonkey Scripts
// @match       http://flibusta.is/a/*
// @grant       GM_setClipboard
// @version     1.0
// @author      -
// @description 2/11/2023, 9:38:17 PM
// @downloadURL https://update.greasyfork.org/scripts/460866/flibustais%20%D0%BA%D0%B0%D1%87%D0%B0%D1%82%D1%8C%20%D1%81%20%D0%BD%D0%B0%D0%B7%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5%D0%BC%20%D0%B2%20%D0%BA%D0%BB%D0%B8%D0%BF%D0%B1%D0%BE%D1%80%D0%B4%D0%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/460866/flibustais%20%D0%BA%D0%B0%D1%87%D0%B0%D1%82%D1%8C%20%D1%81%20%D0%BD%D0%B0%D0%B7%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5%D0%BC%20%D0%B2%20%D0%BA%D0%BB%D0%B8%D0%BF%D0%B1%D0%BE%D1%80%D0%B4%D0%B5.meta.js
// ==/UserScript==

let extMap = {
    'fb2': '.fb2.zip',
    'epub': '.epub',
    'mobi': '.mobi',
    'download': ''
};

let author = document.querySelector('h1.title').innerText;

let books = {};

Array.from(document.querySelectorAll('a[href]')).forEach(a => {
    let href = a.getAttribute("href");
    let match = href.match(/^\/b\/(\d+)$/);

    if (match) {
        books[match[1]] = a.innerText.trim();
        return;
    }

    match = href.match(/^\/b\/(\d+)\/(fb2|epub|mobi|download)$/);

    if (match) {
        let id = match[1];
        let type = match[2];
        
        if (books[id]) {
            let title = books[id];

            let filename = author + ". " + title + extMap[type];

            a.addEventListener('click', () => GM_setClipboard(filename));
        }
    }
});
