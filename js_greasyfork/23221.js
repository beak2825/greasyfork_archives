// ==UserScript==
// @name Выход из боя - bkwar
// @description Выход из боя
// @author Digga
// @license MIT
// @version 1.1
// @include http://bkwar.com/*
// @include http://www.bkwar.com/*
// @grant       none
// @namespace https://greasyfork.org/users/10566
// @downloadURL https://update.greasyfork.org/scripts/23221/%D0%92%D1%8B%D1%85%D0%BE%D0%B4%20%D0%B8%D0%B7%20%D0%B1%D0%BE%D1%8F%20-%20bkwar.user.js
// @updateURL https://update.greasyfork.org/scripts/23221/%D0%92%D1%8B%D1%85%D0%BE%D0%B4%20%D0%B8%D0%B7%20%D0%B1%D0%BE%D1%8F%20-%20bkwar.meta.js
// ==/UserScript==

function ClicktheButton(obj) {
  var evt = document.createEvent("MouseEvents");
  evt.initMouseEvent("click", true, true, window,
    0, 0, 0, 0, 0, false, false, false, false, 0, null);
  var cancelled = !obj.dispatchEvent(evt);      

}
var StupidButton5 = document.querySelector('input[type="submit"][value="Вернуться"]');

ClicktheButton(StupidButton5);