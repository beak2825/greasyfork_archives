// ==UserScript==
// @name         巴哈姆特找回好友對你的自介
// @namespace    http://www.isaka.idv.tw/
// @version      0.1
// @description  讓消失的好友對你的自介回來！
// @author       Isaka(jason21716@巴哈姆特)
// @match        https://home.gamer.com.tw/*
// @grant        GM_xmlhttpRequest
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/376788/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E6%89%BE%E5%9B%9E%E5%A5%BD%E5%8F%8B%E5%B0%8D%E4%BD%A0%E7%9A%84%E8%87%AA%E4%BB%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/376788/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E6%89%BE%E5%9B%9E%E5%A5%BD%E5%8F%8B%E5%B0%8D%E4%BD%A0%E7%9A%84%E8%87%AA%E4%BB%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var selfDOM = $('.nav-member_imgbox img').attr('src');
    var regular_controller = /https:\/\/avatar2\.bahamut\.com\.tw\/avataruserpic\/\w\/\w\/(\w+)/g
    var selfDOMMatch = regular_controller.exec(selfDOM);s
    $('#BH-main_menu ul li:nth-child(5)').after('<li onmouseover="breadCrumbs_listMenu2(114, \'homeuid='+selfDOMMatch[1]+'\')"><a href="friend_2Me.php" undefined>好友自介</a></li>');
})();