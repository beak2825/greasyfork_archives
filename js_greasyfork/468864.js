// ==UserScript==
// @name         三男で改行
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  三男掲示板で本文の &#10; を改行に置換します
// @author       sasakinchu
// @match        https://*.sannan.nl/**
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/468864/%E4%B8%89%E7%94%B7%E3%81%A7%E6%94%B9%E8%A1%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/468864/%E4%B8%89%E7%94%B7%E3%81%A7%E6%94%B9%E8%A1%8C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ページ内のすべての <dd> タグを取得
    const ddTags = document.getElementsByTagName('dd');

    // <dd> タグを走査して改行を挿入
    for (let i = 0; i < ddTags.length; i++) {
        const ddTag = ddTags[i];
        ddTag.innerHTML = ddTag.innerHTML.replace(/\n/g, '<br>');
    }
})();