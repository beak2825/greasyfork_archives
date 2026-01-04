// ==UserScript==
// @name Жуки в актива раскрытого СВОИМИ таро (таро руками)
// @namespace https://www.bestmafia.com/
// @version 1.0
// @description Жуки 
// @author я
// @match http://www.mafia-rules.net/*
// @match https://www.mafia-rules.net/*
// @grant none
// @license MIT
 
// @downloadURL https://update.greasyfork.org/scripts/506794/%D0%96%D1%83%D0%BA%D0%B8%20%D0%B2%20%D0%B0%D0%BA%D1%82%D0%B8%D0%B2%D0%B0%20%D1%80%D0%B0%D1%81%D0%BA%D1%80%D1%8B%D1%82%D0%BE%D0%B3%D0%BE%20%D0%A1%D0%92%D0%9E%D0%98%D0%9C%D0%98%20%D1%82%D0%B0%D1%80%D0%BE%20%28%D1%82%D0%B0%D1%80%D0%BE%20%D1%80%D1%83%D0%BA%D0%B0%D0%BC%D0%B8%29.user.js
// @updateURL https://update.greasyfork.org/scripts/506794/%D0%96%D1%83%D0%BA%D0%B8%20%D0%B2%20%D0%B0%D0%BA%D1%82%D0%B8%D0%B2%D0%B0%20%D1%80%D0%B0%D1%81%D0%BA%D1%80%D1%8B%D1%82%D0%BE%D0%B3%D0%BE%20%D0%A1%D0%92%D0%9E%D0%98%D0%9C%D0%98%20%D1%82%D0%B0%D1%80%D0%BE%20%28%D1%82%D0%B0%D1%80%D0%BE%20%D1%80%D1%83%D0%BA%D0%B0%D0%BC%D0%B8%29.meta.js
// ==/UserScript==
 
 
var spisok = ['Мафиози', 'Двуликий', 'Маньяк', 'Босс мафии', 'Свидетель', 'Комиссар', 'Доктор', 'Вор', 'Стерва', 'Взрывная Лили'];
 
function Gaming() {
 
if ($("h1.day-night-chg")[0] == null) return 0;
 
else return 1;
 
}
 
function isNight() {
 
if (Gaming()) {
 
var days = document.getElementsByClassName("day-night-chg")
 
if (days[days.length - 1].textContent.search("НОЧЬ") >= 0) return 1;
 
else return 0;
 
}
 
return 0;
 
}
 
function myNick() {
 
var chatr = $('.chat p');
 
var mynameplace = chatr[0].textContent.search(',');
 
var myname = chatr[0].textContent.substr(0, mynameplace);
 
return myname;
 
}
 
setInterval(function () {
 
var nick = "";
 
var mas = $('#upl_list').find('li');
 
for (var i = 0; i < mas.length; i++) {
 
var title = mas[i].children[0].getAttribute('title');
 
if (title && spisok.indexOf(title) != -1) {
 
nick = mas[i].children[1].getElementsByClassName('nick')[0].textContent;
 
if (myNick() != nick)
 
break;
 
}
 
}
 
console.debug("ник актива " + nick)
 
if (isNight()) {
 
$(' #gxt_101').click();
 
mas = $('.extras-player-choice').find('li');
 
for (var i = 0; i < mas.length; i++)
 
if (nick == mas[i].textContent)
 
mas[i].children[0].click();
 
}
 
}, 5000);
