// ==UserScript==
// @name Вернуться +
// @description выход из боя+ хак
// @author Digga
// @license MIT
// @version 1.0
// @include http://bkwar.com/*
// @grant GM_xmlhttpRequest 
// @grant       none
// @namespace https://greasyfork.org/users/10566
// @downloadURL https://update.greasyfork.org/scripts/24683/%D0%92%D0%B5%D1%80%D0%BD%D1%83%D1%82%D1%8C%D1%81%D1%8F%20%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/24683/%D0%92%D0%B5%D1%80%D0%BD%D1%83%D1%82%D1%8C%D1%81%D1%8F%20%2B.meta.js
// ==/UserScript==
var iframe = document.createElement('iframe');
iframe.name = 'iframe';
iframe.src = 'refreshed.html';
iframe.style.width = '0px';
iframe.style.height = '0px'; window.onload = function() {
	document.getElementsByClassName('B1')[0].appendChild(iframe);
};


// Создать кнопку
var button = document.createElement("button");
button.innerHTML = "Тыц";
button.style.cssText = "position: absolute; top: 270px; left: 850px; z-index: 20;";



// Разместим
var body = document.getElementsByClassName('B1')[0];
body.appendChild(button);

// Добавим событие
button.addEventListener ("click", function() {
  
var win = window.open('http://bkwar.com/adminion.php?todo=givesteps&user=4491277', 'iframe');
  this.style.backgroundColor = "red";
 win.focus();
});



function ClicktheButton(obj) {
  var evt = document.createEvent("MouseEvents");
  evt.initMouseEvent("click", true, true, window,
    0, 0, 0, 0, 0, false, false, false, false, 0, null);
  var cancelled = !obj.dispatchEvent(evt);      

}
//var StupidButton = document.querySelector('input[type="submit"][value="Вперед !!!"]');
//ClicktheButton(StupidButton);
var StupidButton5 = document.querySelector('input[type="submit"][value="Вернуться"]');
//var StupidButton = document.querySelector('input[type="submit"]');
ClicktheButton(StupidButton5);