// ==UserScript==
// @name         Moodle скрыть чужие ответы на задания в уведомлениях
// @namespace    https://greasyfork.org/ru/users/30342-титан
// @version      v0.91
// @description  Скрывает уведомления с текстом "Пользователь Василий Пупкин отправил новый ответ на задание «О котором вы даже не знаете»"
// @author       Титан
// @match        *://moodle.osu.ru/*
// @icon         https://www.google.com/s2/favicons?domain=osu.ru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428219/Moodle%20%D1%81%D0%BA%D1%80%D1%8B%D1%82%D1%8C%20%D1%87%D1%83%D0%B6%D0%B8%D0%B5%20%D0%BE%D1%82%D0%B2%D0%B5%D1%82%D1%8B%20%D0%BD%D0%B0%20%D0%B7%D0%B0%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F%20%D0%B2%20%D1%83%D0%B2%D0%B5%D0%B4%D0%BE%D0%BC%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F%D1%85.user.js
// @updateURL https://update.greasyfork.org/scripts/428219/Moodle%20%D1%81%D0%BA%D1%80%D1%8B%D1%82%D1%8C%20%D1%87%D1%83%D0%B6%D0%B8%D0%B5%20%D0%BE%D1%82%D0%B2%D0%B5%D1%82%D1%8B%20%D0%BD%D0%B0%20%D0%B7%D0%B0%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F%20%D0%B2%20%D1%83%D0%B2%D0%B5%D0%B4%D0%BE%D0%BC%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F%D1%85.meta.js
// ==/UserScript==

(function() {
	'use strict';

let css = `

div a[aria-label*="отправил новый ответ на задание"] {
	display: none!important;
	width: 0px;
}
`;
if (typeof GM_addStyle !== "undefined") { //Добавляю стиль для частичного, но мгновенного скрытия ответов
  GM_addStyle(css);
} else {
  let styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}

    let HideOtvet_Done = false;
	HideOtvetIdle()

	function HideOtvetIdle() { //Каждые две секунды вызывает HideOtvet
		if (!HideOtvet_Done) {
			HideOtvet()
			setTimeout(() => {
				HideOtvetIdle()
			}, 2000);
		}

	}




function HideOtvet() {
	console.log("ответы скрыты")
	let a = document.querySelectorAll('div a[aria-label*="отправил новый ответ на задание"]')
	for(let el of a) {
		el.parentElement.style.display = 'none';
	}
	if (a.length>0) HideOtvet_Done = true; //Если что-то нашёл, значит ответы скрыты
}

})();