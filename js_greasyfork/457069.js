// ==UserScript==
// @name               Steam - Наличие русского языка
// @name:ru            Steam - Наличие русского языка
// @name:en            Steam - Availability of the Russian language
// @description        Показывает наличие русского языка в игре/программе возле постера
// @description:ru     Показывает наличие русского языка в игре/программе возле постера
// @description:en     Shows the presence of the Russian language in the game/program near the poster
// @version            1.9
// @author             EvPix
// @namespace          https://www.tampermonkey.net
// @match              https://store.steampowered.com/app/*
// @icon               https://store.steampowered.com/favicon.ico
// @homepageURL        https://greasyfork.org/scripts/457069
// @grant              none
// @license            MIT
// @downloadURL https://update.greasyfork.org/scripts/457069/Steam%20-%20%D0%9D%D0%B0%D0%BB%D0%B8%D1%87%D0%B8%D0%B5%20%D1%80%D1%83%D1%81%D1%81%D0%BA%D0%BE%D0%B3%D0%BE%20%D1%8F%D0%B7%D1%8B%D0%BA%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/457069/Steam%20-%20%D0%9D%D0%B0%D0%BB%D0%B8%D1%87%D0%B8%D0%B5%20%D1%80%D1%83%D1%81%D1%81%D0%BA%D0%BE%D0%B3%D0%BE%20%D1%8F%D0%B7%D1%8B%D0%BA%D0%B0.meta.js
// ==/UserScript==

(function() {
	'use strict';

	const ru_UI = `<span title="Доступен русский язык интерфейса">Рус интерфейс |</span>`;
	const ru_Voice = `<span title="Доступен русский язык озвучки">Рус озвучка |</span>`;
	const ru_Subs = `<span title="Доступен русский язык субтитров">Рус субтитры</span>`;

	const no_ru_UI = `<span title="Недоступен русский язык интерфейса">Нет рус интерфейс |</span>`;
	const no_ru_Voice = `<span title="Недоступен русский язык озвучки">Нет рус озвучка |</span>`;
	const no_ru_Subs = `<span title="Недоступен русский язык субтитров">Нет рус субтитры</span>`;

	const hasUI = document.querySelector(".game_language_options tbody:nth-child(1) tr:nth-child(2) td.checkcol:nth-child(2) > span:nth-child(1)") !== null;
	const hasVoice = document.querySelector(".game_language_options tbody:nth-child(1) tr:nth-child(2) td.checkcol:nth-child(3) > span:nth-child(1)") !== null;
	const hasSubs = document.querySelector(".game_language_options tbody:nth-child(1) tr:nth-child(2) > td.checkcol:nth-child(4) > span:nth-child(1)") !== null;

	let ru = [];
	if (hasUI) ru.push(ru_UI); else ru.push(no_ru_UI);
	if (hasVoice) ru.push(ru_Voice); else ru.push(no_ru_Voice);
	if (hasSubs) ru.push(ru_Subs); else ru.push(no_ru_Subs);

	const div = document.createElement("div");
	div.style.fontSize = "110%";
	div.innerHTML = ru.join(" ");
	document.querySelector(".glance_ctn").prepend(div);
})();