// ==UserScript==
// @name         ISBN自動導航至PageSelectType
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  登入後，自動導航至申請出版品的種類選擇頁面
// @match        https://isbn.ncl.edu.tw/NEW_ISBNNet/J66_PublisherReLogin.php?&Pact=DisplayAll&Pmsg=
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/521938/ISBN%E8%87%AA%E5%8B%95%E5%B0%8E%E8%88%AA%E8%87%B3PageSelectType.user.js
// @updateURL https://update.greasyfork.org/scripts/521938/ISBN%E8%87%AA%E5%8B%95%E5%B0%8E%E8%88%AA%E8%87%B3PageSelectType.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 自動導航到目標頁面
    window.location.href = "https://isbn.ncl.edu.tw/NEW_ISBNNet/J61_MyAppISBN.php?&Pact=PageSelectType";
})();
