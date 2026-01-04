// ==UserScript==
// @name         Non-HARD Chart Filter / 未難フィルタ
// @name:ja      未難フィルタ
// @namespace    https://signo.hatenablog.jp/archive/category/Userscript
// @license      MIT
// @version      0.1
// @description  This script hides charts which you've HARD-cleared or above.
// @description:ja 未難だけを表示するユーザスクリプトです。
// @author       signoiidx
// @match        https://cpi.makecir.com/users/tables/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=makecir.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/457311/Non-HARD%20Chart%20Filter%20%20%E6%9C%AA%E9%9B%A3%E3%83%95%E3%82%A3%E3%83%AB%E3%82%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/457311/Non-HARD%20Chart%20Filter%20%20%E6%9C%AA%E9%9B%A3%E3%83%95%E3%82%A3%E3%83%AB%E3%82%BF.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // hard: #FF6666, exh: #FFFF99, fc: #FF9966
    let elements = document.querySelectorAll('td[bgcolor="#FF6666"], td[bgcolor="#FFFF99"], td[bgcolor="#FF9966"]');
    // reference: https://qiita.com/i_completely_understand/items/acf3e5efe0db848989d9
    for (let i = elements.length; i--;) {
        elements.item(i).style.display = 'none';
    }
})();