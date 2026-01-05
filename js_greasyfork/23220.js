// ==UserScript==
// @name автоудар для bkwar
// @description автоудар 
// @author Digga
// @license MIT
// @version 1.1
// @include http://bkwar.com/*
// @include http://www.bkwar.com/*
// @grant       none
// @namespace https://greasyfork.org/users/10566
// @downloadURL https://update.greasyfork.org/scripts/23220/%D0%B0%D0%B2%D1%82%D0%BE%D1%83%D0%B4%D0%B0%D1%80%20%D0%B4%D0%BB%D1%8F%20bkwar.user.js
// @updateURL https://update.greasyfork.org/scripts/23220/%D0%B0%D0%B2%D1%82%D0%BE%D1%83%D0%B4%D0%B0%D1%80%20%D0%B4%D0%BB%D1%8F%20bkwar.meta.js
// ==/UserScript==



function ClicktheButton(obj) {
  var evt = document.createEvent("MouseEvents");
  evt.initMouseEvent("click", true, true, window,
    0, 0, 0, 0, 0, false, false, false, false, 0, null);
  var cancelled = !obj.dispatchEvent(evt);      

}
var StupidButton = document.querySelector('input[type="submit"][value="Вперед !!!"]');
ClicktheButton(StupidButton);
