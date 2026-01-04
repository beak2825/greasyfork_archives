// ==UserScript==
// @name         巴哈姆特首頁萬聖節佈景主題
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  巴哈姆特首頁2021年萬聖節的佈景主題!
// @author       聖小熊
// @match        https://www.gamer.com.tw/*
// @icon         https://www.google.com/s2/favicons?domain=gamer.com.tw
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434470/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E9%A6%96%E9%A0%81%E8%90%AC%E8%81%96%E7%AF%80%E4%BD%88%E6%99%AF%E4%B8%BB%E9%A1%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/434470/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E9%A6%96%E9%A0%81%E8%90%AC%E8%81%96%E7%AF%80%E4%BD%88%E6%99%AF%E4%B8%BB%E9%A1%8C.meta.js
// ==/UserScript==

(function() {

    var domCss = document.createElement('link');
    domCss.setAttribute('href', 'https://66228453-397425272745908887.preview.editmysite.com/uploads/6/6/2/2/66228453/index_festival.css');
    domCss.setAttribute('rel', 'stylesheet');
    document.head.appendChild(domCss);

})();