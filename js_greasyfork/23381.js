// ==UserScript==
// @name Собрать лут  - bkwar
// @description Собрать лут 
// @author Digga
// @license MIT
// @version 1.0
// @include http://bkwar.com/*
// @include http://www.bkwar.com/*
// @grant       none
// @namespace https://greasyfork.org/users/10566
// @downloadURL https://update.greasyfork.org/scripts/23381/%D0%A1%D0%BE%D0%B1%D1%80%D0%B0%D1%82%D1%8C%20%D0%BB%D1%83%D1%82%20%20-%20bkwar.user.js
// @updateURL https://update.greasyfork.org/scripts/23381/%D0%A1%D0%BE%D0%B1%D1%80%D0%B0%D1%82%D1%8C%20%D0%BB%D1%83%D1%82%20%20-%20bkwar.meta.js
// ==/UserScript==
// [1] Оборачиваем скрипт в замыкание, для кроссбраузерности (opera, ie)



function ClicktheButton(obj) {
  var evt = document.createEvent("MouseEvents");
  evt.initMouseEvent("click", true, true, window,
    0, 0, 0, 0, 0, false, false, false, false, 0, null);
  var cancelled = !obj.dispatchEvent(evt);      

}

var StupidButton6 = document.querySelector('input[type="button"][value="Собрать все"]');

ClicktheButton(StupidButton6);
