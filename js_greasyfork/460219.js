// ==UserScript==
// @name         Pixivision 图床替换
// @namespace    https://www.nanoka.top
// @version      0.2
// @description  将 Pixivision 的图片替换为 i.pixiv.re
// @author       asadahimeka
// @license      MIT
// @match        https://www.pixivision.net/*
// @require      https://lib.baomitu.com/arrive/2.4.1/arrive.min.js
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/460219/Pixivision%20%E5%9B%BE%E5%BA%8A%E6%9B%BF%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/460219/Pixivision%20%E5%9B%BE%E5%BA%8A%E6%9B%BF%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.arrive(
        'img[src^="https://i.pximg.net"]',
        { existing: true },
        el => {
            const src = el.src
            el.src = ''
            el.src = src.replace('i.pximg.net', 'i.pixiv.re')
        }
    );

    document.arrive(
        '._thumbnail[style^=background]',
        { existing: true },
        el => {
            el.style.backgroundImage = el.style.backgroundImage.replace('i.pximg.net', 'i.pixiv.re')
        }
    );

})();