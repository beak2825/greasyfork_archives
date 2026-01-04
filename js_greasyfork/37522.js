// ==UserScript==
// @name         HWM_NewLotLinkInMenu
// @namespace    Небылица
// @version      1.1
// @description  Добавляет ссылку на выставление нового лота в меню "Персонаж"
// @author       Небылица
// @include      /^https{0,1}:\/\/((www|qrator)\.heroeswm\.ru|178\.248\.235\.15)\/.+/
// @exclude      /^https{0,1}:\/\/((www|qrator)\.heroeswm\.ru|178\.248\.235\.15)\/(login|war|cgame|campaign|frames|chat|chatonline|ch_box|chat_line|ticker|chatpost)\.php.*/
// @downloadURL https://update.greasyfork.org/scripts/37522/HWM_NewLotLinkInMenu.user.js
// @updateURL https://update.greasyfork.org/scripts/37522/HWM_NewLotLinkInMenu.meta.js
// ==/UserScript==

(function() {
    "use strict";

    // определяем элемент li "Рынок" и массив дочерних элементов
    var auctionLi = document.querySelector("li a[href='auction.php']").parentNode,
        auctionLiChildren = auctionLi.childNodes;

    // добавляем плюсик
    auctionLi.innerHTML += "<a href='auction_new_lot.php' title='Выставить новый лот'><b>+</b></a>";

    // задаём стили для ссылок на рынок и на выставление нового лота
    auctionLiChildren[0].style.display = "inline";
    auctionLiChildren[0].style.padding = "2px 6px 2px 9px";

    auctionLiChildren[1].style.display = "inline";
    auctionLiChildren[1].style.padding = "2px 0px 2px 0px";
})();