// ==UserScript==
// @name         森きのこ文字数
// @namespace    森きのこ
// @version      0.1
// @description  森きのこの文字数を表示
// @match        http://morikinoko.com/archives/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393637/%E6%A3%AE%E3%81%8D%E3%81%AE%E3%81%93%E6%96%87%E5%AD%97%E6%95%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/393637/%E6%A3%AE%E3%81%8D%E3%81%AE%E3%81%93%E6%96%87%E5%AD%97%E6%95%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let sum = 0;
    $('.mtex').each((_, ele) => {
        sum += ele.textContent.replace(/\s+/g,'').length;
    });
    const li = $(`<li>${sum.toString()} 字</li>`);
    $('ul.article-meta').prepend(li);
})();