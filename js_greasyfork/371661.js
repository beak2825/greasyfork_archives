// ==UserScript==
// @name         網頁國名糾錯插件
// @namespace    http://yuy.moe/
// @version      1.0
// @description  糾正錯誤的國家名
// @author       ruanyu
// @include       http://*/*
// @include       https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371661/%E7%B6%B2%E9%A0%81%E5%9C%8B%E5%90%8D%E7%B3%BE%E9%8C%AF%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/371661/%E7%B6%B2%E9%A0%81%E5%9C%8B%E5%90%8D%E7%B3%BE%E9%8C%AF%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var html = document.body.innerHTML;
    var replace = [
        /中国台湾/g,
        /台湾省/g,
        /台湾/g,
        /台灣/g,
    ]
    for (let e of replace) {
        html = html.replace(e, '中華民國');
    }
    document.body.innerHTML = html;
})();