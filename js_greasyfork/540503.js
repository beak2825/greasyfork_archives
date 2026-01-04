// ==UserScript==
// @name         No book cover on isbn.ncl.edu.tw
// @name:zh-TW   隱藏國圖書目資料庫的書籍封面
// @namespace    https://github.com/alextwl/userscript
// @version      1.0
// @description  Hide book cover image preview from query result on isbn.ncl.edu.tw
// @description:zh-TW 隱藏國家圖書館全國新書資訊網書目資料庫查詢結果當中的書籍封面
// @author       alextwl
// @match        https://isbn.ncl.edu.tw/NEW_ISBNNet/*Results*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540503/No%20book%20cover%20on%20isbnncledutw.user.js
// @updateURL https://update.greasyfork.org/scripts/540503/No%20book%20cover%20on%20isbnncledutw.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var covers = document.querySelectorAll("#ResultBox > table > tbody > tr > td:nth-child(2) > img");
    for (var i=0; i<covers.length; i++) {
        covers[i].removeAttribute("src");
        covers[i].setAttribute("style", "display: none;");
    }
})();