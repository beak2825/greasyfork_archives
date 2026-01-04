// ==UserScript==
// @name         Google Sheets Unescape when Copying Text
// @description  GoogleスプレッドシートでコピーするテキストにつくHTMLコメントを削除したり、改行を含むセルをコピーするテキストにつくダブルクォーテーションをアンエスケープする。
// @namespace    https://github.com/pingval/
// @version      0.01
// @author       pingval
// @grant        none
// @match        https://docs.google.com/spreadsheets/*
// @license      CC0
// @downloadURL https://update.greasyfork.org/scripts/458953/Google%20Sheets%20Unescape%20when%20Copying%20Text.user.js
// @updateURL https://update.greasyfork.org/scripts/458953/Google%20Sheets%20Unescape%20when%20Copying%20Text.meta.js
// ==/UserScript==

(function() {
    document.addEventListener('copy', function(e) {
        const text_plain = function() {
            const from = (e.clipboardData || window.clipboardData).getData('text/plain');
            //  改行を含まないなら何もしない
            if (!from.includes("\n")) {
                return;
            }
            // ダブルクォーテーションをアンエスケープ
            const to = from.replaceAll(/^"|"$/g, '').replaceAll(/""/g, '"');
            if (from != to) {
                console.log(from + "\n=>\n"+ to);
                (e.clipboardData || window.clipboardData).setData("text/plain", to);
            }
        };

        const text_html = function() {
            const from = (e.clipboardData || window.clipboardData).getData('text/html');
            // HTMLコメントを削除
            const to = from.replaceAll(/<!--.*?\bmso-data-placement\b.*?-->/, '');
            if (from != to) {
                console.log(from + "\n=>\n" + to);
                (e.clipboardData || window.clipboardData).setData("text/html", to);
            }
        };
        text_plain();
        text_html();
    });
})();
