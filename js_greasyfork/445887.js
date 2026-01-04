// ==UserScript==
// @name         EGE LABOR COSTS SPEED UP
// @version      1.1
// @description  Открывает 20 табелей сотрудников в новых вкладках, что ускоряет внос времени и загрузку страниц
// @author       pronin
// @match      http://10.129.117.188/LaborSheet/Details/*
// @namespace    https://greasyfork.org/users/506633
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/445887/EGE%20LABOR%20COSTS%20SPEED%20UP.user.js
// @updateURL https://update.greasyfork.org/scripts/445887/EGE%20LABOR%20COSTS%20SPEED%20UP.meta.js
// ==/UserScript==

window.onload = init;

function init() {
var btn = document.createElement('button');
var textInBtn = document.createTextNode('Открыть 20 ссылок');

btn.appendChild(textInBtn); //добавляем текст в кнопку
btn.style.marginLeft = '150px' // двигаем вправо
document.body.prepend(btn); // добавляем кнопку в начало <body>
btn.onclick = handleButtonClick; // ловим на ней клик
var hrefArray

// Блок с ФИО и ссылками он не сразу прогружает, поэтому отдельная функция
function waitForDOM () {
  if (document.querySelectorAll('.button-editLS').length > 0) {
    hrefArray = document.querySelectorAll('.button-editLS');
    hrefArray.forEach(function(item, i, arr) {
    hrefArray[i].setAttribute('target', '_blank');
    })} else {
    setTimeout(waitForDOM, 300);
  }
}

waitForDOM();
var count = 0;
var arrayCount = 0;


// функция прокликивания 20 ссылок
function handleButtonClick() {
	while(hrefArray && count != 20) {
		hrefArray[arrayCount].click();
		arrayCount++;
		count++;
	}
	count = 0;
}

}
