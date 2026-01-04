// ==UserScript==
// @name         Калькулятор просмотров
// @namespace
// @version      1.6
// @description  Считает охват постов в Яндекс.Районах
// @author       vlds
// @include      *://yandex.ru/local/users/*
// @grant none
// @require https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @require https://code.jquery.com/jquery-3.3.1.min.js
// @namespace
// @namespace
// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/374708/%D0%9A%D0%B0%D0%BB%D1%8C%D0%BA%D1%83%D0%BB%D1%8F%D1%82%D0%BE%D1%80%20%D0%BF%D1%80%D0%BE%D1%81%D0%BC%D0%BE%D1%82%D1%80%D0%BE%D0%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/374708/%D0%9A%D0%B0%D0%BB%D1%8C%D0%BA%D1%83%D0%BB%D1%8F%D1%82%D0%BE%D1%80%20%D0%BF%D1%80%D0%BE%D1%81%D0%BC%D0%BE%D1%82%D1%80%D0%BE%D0%B2.meta.js
// ==/UserScript==

GM_addStyle('#post_button:active {transform: scale(0.97, 0.97);}');
GM_addStyle('#days_button:active {transform: scale(0.97, 0.97);}');
GM_addStyle('@keyframes blink { 0% { background: pink; } 100% { background: white;} }');

function ready() {

var div1 = document.createElement('div');
var div2 = document.createElement('div');
var div3 = document.createElement('div');

div1.style.cssText="padding: 5px; text-align:center;";
div2.style.cssText="padding: 5px; text-align:center;";
div3.style.cssText="padding: 5px; text-align:center;";

div1.id = "div_form";
div2.id = "div_post";
div3.id = "div_days";

var dev = document.getElementsByClassName('sidenav__content')[0];

dev.appendChild(div1);
dev.appendChild(div2);
dev.appendChild(div3);

document.getElementById('div_form').innerHTML = '<input type="text"  maxlength="2" id="view_form" style="text-align: center; border: 2px solid rgba(157, 179, 196, 1); outline: none; border-radius: 3px; font-size: 14px; height: 22px; width: 164px; " placeholder="Количество постов" />';

document.getElementById('div_post').innerHTML = '<button id="post_button" style="cursor: pointer; user-select: none; outline: none; border: none; border-radius: 3px; background: #ffcc00; font-size: 13px; font-family: Arial,sans-serif;  height: 28px; width: 120px; " >Охват постов</button>';

document.getElementById('div_days').innerHTML = '<button id="days_button" style="cursor: pointer; user-select: none; outline: none; border: none; border-radius: 3px; background: #ffcc00; font-size: 13px; font-family: Arial,sans-serif;  height: 28px; width: 120px; ">Охват за неделю</button>';

document.getElementById("post_button").onclick = checkAndFind;

document.getElementById("days_button").onclick = scrollToDay;

var now = new Date();

var day_post = 0;

function scrollToDay () {

if (now.getDay() != 1){alert('Дождись понедельника или введи количество постов!');}

else {

var timerDay = setInterval(function() {

  if (document.getElementsByClassName("event-head__info")[day_post].getElementsByTagName("a")[0].innerHTML != '10 дней назад') {  // 10 дней назад, если считаем за неделю (нет постов на выходных)
 window.scrollBy(0, 1000);
 day_post++;
      console.log(day_post);
      if (day_post > 99) {            // максимальное количество постов за 7 дней
          clearInterval(timerDay);
          alert('Упс! Ошибочка вышла...\nПридется ввести количество постов.');}
 }
    else {
        clearInterval(timerDay);
        calc(day_post);
         }
}, 100);

}

}

function checkAndFind(){
if (!document.getElementById("view_form").value.match(/^\d+$/)){
  $("#view_form").css("animation", "blink 1.5s ease 1");
  setTimeout(function() {$("#view_form").css("animation", "");}, 1500);
}
else if (document.getElementById("view_form").value === '0'){
  $("#view_form").css("animation", "blink 1.5s ease 1");
  setTimeout(function() {$("#view_form").css("animation", "");}, 1500);
}
  else {scrollToPost();}
}

function scrollToPost() {
var views = document.getElementById("view_form").value; //последний пост
var timerPost = setInterval(function() {
  if (document.getElementsByClassName("event-head__info")[views-1] === undefined) {
 window.scrollBy(0, 500);
 }
    else {
        clearInterval(timerPost);
        calc(views);
         }
}, 100);
}

function calc(y){

var x = 0; // первый пост
var sum = 0;

for (x; x < y; x++) {
if (document.getElementsByClassName("event-head__info")[x].getElementsByClassName("text")[0] !==undefined) {
var views = document.getElementsByClassName("event-head__info")[x].getElementsByClassName("text")[0];
var viewsToString = views.innerHTML + " ";
var toRegExp = viewsToString.replace(/\D/g, "");
var toNumbers = +toRegExp;
sum += toNumbers;
}

}

alert('Охват: ' + sum);

}

$("#days_button").hover(function(){
$(this).css("background-color", "#feda5a");
}, function(){
$(this).css("background-color", "#ffcc00");
});

$("#post_button").hover(function(){
$(this).css("background-color", "#feda5a");
}, function(){
$(this).css("background-color", "#ffcc00");
});

}

window.onload = ready;