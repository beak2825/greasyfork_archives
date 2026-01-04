// ==UserScript==
// @name         ClanWarReplaceName
// @namespace    ClanWarReplaceName
// @version      1.0
// @description  Выделяет имена игроков
// @author       ZingerY
// @match        https://www.hero-wars.com/
// @homepage     https://ilovemycomp.narod.ru/ClanWarReplaceName.user.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hero-wars.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454042/ClanWarReplaceName.user.js
// @updateURL https://update.greasyfork.org/scripts/454042/ClanWarReplaceName.meta.js
// ==/UserScript==

(function () {
	'use strict';
	let replace = [{
			nick: 'Milana',
			vk: '@id161931659'
		},
		{
			nick: 'Scylla',
			vk: '@id644903549'
		},
		{
			nick: 'ХаПаТыЧ',
			vk: '@xattabbi4'
		},
		{
			nick: 'Некто',
			vk: '@id523934567'
		},
		{
			nick: 'E L L E',
			vk: '@stepanova_aleksandra'
		},
		{
			nick: 'Iulius',
			vk: '?'
		},
		{
			nick: 'Manson',
			vk: '?'
		},
		{
			nick: 'Demiurg',
			vk: '@avlaskin'
		},
		{
			nick: 'serpentarium',
			vk: '@id95209713'
		},
		{
			nick: 'Tolar',
			vk: '@airgait'
		},
		{
			nick: 'Марина',
			vk: '@id4514758'
		},
		{
			nick: 'Серёга',
			vk: '@id119946223'
		},
		{
			nick: 'Kri0gen',
			vk: '?'
		},
		{
			nick: 'Политика',
			vk: '@id60203765'
		},
		{
			nick: 'YAsya',
			vk: '@bolotysha'
		},
		{
			nick: 'quial',
			vk: '@ddi_marketing'
		},
		{
			nick: 'Алексей',
			vk: '?'
		},
		{
			nick: 'Ратибор',
			vk: '@id18595166'
		},
		{
			nick: 'vicrout',
			vk: '@volosnikhinaanna'
		},
		{
			nick: 'Игорь.',
			vk: '@id397338882'
		},
		{
			nick: 'ZingerY',
			vk: '@zingery'
		},
		{
			nick: 'Dante',
			vk: '?'
		},
		{
			nick: 'Иван',
			vk: '@id654917898'
		},
		{
			nick: 'Фарид',
			vk: '?'
		},
		{
			nick: 'ESUTORU',
			vk: '?'
		},
		{
			nick: 'Борода',
			vk: '@id522037521'
		},
		{
			nick: 'СкрэПпиКокО',
			vk: '@ginezis_95'
		},
		{
			nick: 'Sadist',
			vk: '@id651337585'
		},
		{
			nick: 'Voodoorisar',
			vk: '@id399595321'
		},
	];

	function replaceText(text) {
		for (let user of replace) {
			text = text.replaceAll(user.nick, `${user.vk} (${user.nick})`);
		}
		return text;
	}

	document.addEventListener('copy', function (e) {
		e.clipboardData.setData('text/plain', replaceText(e.clipboardData.getData('text/plain')))
	});
})();