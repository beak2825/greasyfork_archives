// ==UserScript==
// @name         stdOpt
// @namespace    MaxLevs
// @version      1.0.4
// @description  Добавляет ники (псевдонимы) к именам и фамилиям Бандитов
// @author       MaxLevs
// @match        *://stdband.ru/release/*
// @grant        none
// @noframes
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/34106/stdOpt.user.js
// @updateURL https://update.greasyfork.org/scripts/34106/stdOpt.meta.js
// ==/UserScript==

(function(w) {
	"use strict";
	let band = [
		{name:"Сергей", lname: "Кубасян", nick: "Cuba77"},
		{name:"Татьяна", lname: "Борзова", nick: "Torgil"},
		{name:"Ирина", lname: "Зиновкина", nick: "Ester"},
		{name:"Анна", lname: "Мосолова", nick: "LeeAnnushka"},
		{name:"Полина", lname: "Ртищева", nick: "Demetra"},
		{name:"Александр", lname: "Русаков", nick: "BalFor"},
		{name:"Влад", lname: "Токарев", nick: "Дуров"},
		{name:"Давид", lname: "Петросян", nick: ""},
		{name:"Глеб", lname:"Константинович", nick:""},
		{name:"Антон", lname:"Квасневский", nick:"Alpair"},
		{name:"Джульетта", lname:"Данко", nick:""},
		{name:"Игорь", lname:"Дроздов", nick:""}
	];

	let target = document.getElementById("dle-content")
	                     .querySelector(".row>.col-8");
	let buff = target.innerHTML;
	for (let beaver of band) {
		if (beaver.nick)
			buff = buff.replace(RegExp(
			`${beaver.name} ${beaver.lname}`, "g"),
			`${beaver.name} (${beaver.nick}) ${beaver.lname}`
			);
	}
	target.innerHTML = buff;
})(window);