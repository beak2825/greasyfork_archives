// ==UserScript==
// @name         巴哈姆特找回消失的公會按鈕
// @namespace    http://www.isaka.idv.tw/
// @version      0.2
// @description  讓消失的公會按鈕回來！
// @author       Isaka(jason21716@巴哈姆特)
// @match        https://*.gamer.com.tw/*
// @grant        GM_xmlhttpRequest
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/376450/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E6%89%BE%E5%9B%9E%E6%B6%88%E5%A4%B1%E7%9A%84%E5%85%AC%E6%9C%83%E6%8C%89%E9%88%95.user.js
// @updateURL https://update.greasyfork.org/scripts/376450/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E6%89%BE%E5%9B%9E%E6%B6%88%E5%A4%B1%E7%9A%84%E5%85%AC%E6%9C%83%E6%8C%89%E9%88%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('.TOP-my ul').prepend('<li><a id="topBar_guild" href="https://home.gamer.com.tw/joinGuild.php"><img src="https://i2.bahamut.com.tw/top_icon1.png"></a></li>');
})();