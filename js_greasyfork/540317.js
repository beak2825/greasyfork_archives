// ==UserScript==
// @name         BLACK RUSSIA | Скрипт для Кураторов форума
// @namespace    https://forum.blackrussia.online
// @version      1.1.206
// @description  Специально для BARNAUL
// @author       Vlad_Anonim
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license 	 MIT
// @collaborator Quenk269
// @icon https://icons.iconarchive.com/icons/papirus-team/papirus-apps/48/emerald-theme-manager-icon-icon.png
// @downloadURL https://update.greasyfork.org/scripts/540317/BLACK%20RUSSIA%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/540317/BLACK%20RUSSIA%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0.meta.js
// ==/UserScript==
 
(function () {
  'use strict';
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const buttons = [
{
	  title: '- - - - - - - - - - - - - - - - - - РП Биографии - - - - - - - - - - - - - - - - - -'
},
{
	  title: '| Био одобрена |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender][FONT=times new roman] Ваша РП Биография получает статус: [COLOR=#00FF00]Одобрено[/COLOR][/FONT]<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman] Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR][/FONT]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| На рассмотрение |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender][FONT=times new roman] Ваша РП биография взята на [COLOR=#ffff00]Рассмотрение[/COLOR], пожалуйста ожидайте ответа.[/FONT]<br><br>"+
		"[B][CENTER][COLOR=Yellow][ICODE]На рассмотрении.. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: PIN_PREFIX,
	  status: true,
},
{
	  title: '| Возраст не совпадает |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender][FONT=times new roman] Ваша РП Биография получает статус: [COLOR=#FF0000]Отказано[/COLOR]<br>Причина: Возраст не совпадает с датой рождения.[/FONT]<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR][/FONT]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Фамилия или имя в названии отличаются |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender][FONT=times new roman] Ваша РП Биография получает статус: [COLOR=#FF0000]Отказано[/COLOR]<br>Причина: В названии вашей биографии и в пункте 1 различаются имя/фамилия. [/FONT]<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR][/FONT]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Нету 18 лет  |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender][FONT=times new roman] Ваша РП Биография получает статус: [COLOR=#FF0000]Отказано[/COLOR]<br>Причина: Минимальный возраст для составления биографии: 18 лет.[/FONT]<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR][/FONT]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Не по форме |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender][FONT=times new roman] Ваша РП Биография получает статус: [COLOR=#FF0000]Отказано[/COLOR]<br>Причина: РП биография написана не по форме.[/FONT]<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR][/FONT]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| От 3-го лица |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender][FONT=times new roman] Ваша РП Биография получает статус: [COLOR=#FF0000]Отказано[/COLOR]<br>Причина: РП биография написана от 3-го лица.[/FONT]<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR][/FONT]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Копипаст |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender][FONT=times new roman] Ваша РП Биография получает статус: [COLOR=#FF0000]Отказано[/COLOR]<br>Причиной послужило копирование текста / темы.[/FONT]<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR][/FONT]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Ошибки в словах |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender][FONT=times new roman] Ваша РП Биография получает статус: [COLOR=#FF0000]Отказано[/COLOR]<br>Причиной послужило написание РП Биографии с грамматическими / орфографическими ошибками.[/FONT]<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR][/FONT]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Заголовок не по форме |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender][FONT=times new roman] Ваша РП Биография получает статус: [COLOR=#FF0000]Отказано[/COLOR]<br>Причиной послужило написание заголовка РП Биографии не по форме.[/FONT]<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR][/FONT]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Нету имени родных |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender][FONT=times new roman] Ваша РП Биография получает статус: [COLOR=#FF0000]Отказано[/COLOR]<br>Причиной послужило то, что вы не написали имя родителей и тд.[/FONT]<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR][/FONT]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| 2 Био на 1 Акк |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender][FONT=times new roman] Ваша РП Биография получает статус: [COLOR=#FF0000]Отказано[/COLOR]<br>Причиной послужило написание второй Биографии на один игровой аккаунт, что запрещено правилами написания РП Биографий.[/FONT]<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR][/FONT]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Мало текста |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender][FONT=times new roman] Ваша РП Биография получает статус: [COLOR=#FF0000]Отказано[/COLOR]<br>Причиной послужило недостаточное количество информации о Вашем персонаже.[/FONT]<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR][/FONT]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Мало инф в «Детство» |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender][FONT=times new roman] Ваша РП Биография получает статус: [COLOR=#FF0000]Отказано[/COLOR]<br>Причиной послужило недостаточное количество информации в пункте «Детство».[/FONT]<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR][/FONT]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Мало инф Юность, Взрослая Жизнь |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender][FONT=times new roman] Ваша РП Биография получает статус: [COLOR=#FF0000]Отказано[/COLOR]<br>Причиной послужило недостаточное количество информации в пункте «Юность,Взрослая жизнь».[/FONT]<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR][/FONT]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| nRP Ник |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender][FONT=times new roman] Ваша РП Биография получает статус: [COLOR=#FF0000]Отказано[/COLOR]<br>Причина: У вас nRP Nick Name.[/FONT]<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR][/FONT]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '- - - - - - - - - - - - - - - - - - РП ситуации - - - - - - - - - - - - - - - - - - '
},
{
	  title: '| Одобрено |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender][FONT=times new roman] Ваша РП ситуация получает статус: [COLOR=#00FF00]Одобрено[/COLOR][/FONT]<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR][/FONT]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| На рассмотрение |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender][FONT=times new roman] Ваша РП ситуация взята на [COLOR=#ffff00]Рассмотрение[/COLOR], пожалуйста ожидайте ответа.[/FONT]<br><br>"+
		"[B][CENTER][COLOR=Yellow][ICODE]На рассмотрении.. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: PIN_PREFIX,
	  status: true,
},
{
	  title: '| Отказано |',
	  content:
	   '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender][FONT=times new roman] Ваша РП ситуация получает статус: [COLOR=#FF0000]Отказано[/COLOR]<br>Причина: *Сюда пишите причину отказа*.[/FONT]<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR][/FONT]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Копипаст |',
	  content:
	   '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender][FONT=times new roman] Ваша РП ситуация получает статус: [COLOR=#FF0000]Отказано[/COLOR]<br>Причиной послужило копирование текста.[/FONT]<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR][/FONT]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '- - - - - - - - - - - - - - - - - - РП Организации - - - - - - - - - - - - - - - - - -'
},
{
	  title: '| Одобрено |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender][FONT=times new roman] Ваша РП организация получает статус: [COLOR=#00FF00]Одобрено[/COLOR][/FONT]<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR][/FONT]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| На рассмотрение  |',
	  content:
		  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender][FONT=times new roman] Ваша РП организация взята на [COLOR=#ffff00]Рассмотрение[/COLOR], пожалуйста ожидайте ответа.[/FONT]<br><br>"+
		"[B][CENTER][COLOR=Yellow][ICODE]На рассмотрении.. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: PIN_PREFIX,
	  status: true,
},
{
	  title: '| Отказано |',
	  content:
		 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender][FONT=times new roman] Ваша РП организация получает статус: [COLOR=#FF0000]Отказано[/COLOR]<br>Причина: *Сюда пишите причину отказа*.[/FONT]<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR][/FONT]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Копипаст |',
	  content:
	   '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/PqwZ3DJZ/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender][FONT=times new roman] Ваша РП организация получает статус: [COLOR=#FF0000]Отказано[/COLOR]<br>Причиной послужило копирование текста.[/FONT]<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#797cc7]BARNAUL[/COLOR][/FONT]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img][/url]<br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
];
 
$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
	// Добавление кнопок при загрузке страницы
	addButton('Меню', 'selectAnswer');
 
 
	// Поиск информации о теме
	const threadData = getThreadData();
 
	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
	$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
	$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
 
	$(`button#selectAnswer`).click(() => {
		XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
		buttons.forEach((btn, id) => {
			if(id > 0) {
				$(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
			} else {
				$(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
			}
		});
	});
});
 
function addButton(name, id) {
$('.button--icon--reply').before(
  `<button type="button" class="button rippleButton" id="${id}" style="margin: 3px;">${name}</button>`
);
}
 
function buttonsMarkup(buttons) {
return `<div class="select_answer">${buttons
  .map(
	(btn, i) =>
	  `<button id="answers-${i}" class="button--primary button ` +
	  `rippleButton" style="margin:5px"><span class="button-text">${btn.title}</span></button>`
  )
  .join('')}</div>`;
}
 
function pasteContent(id, data = {}, send = false) {
	const template = Handlebars.compile(buttons[id].content);
	if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();
 
	$('span.fr-placeholder').empty();
	$('div.fr-element.fr-view p').append(template(data));
	$('a.overlay-titleCloser').trigger('click');
 
	if(send == true){
		editThreadData(buttons[id].prefix, buttons[id].status);
		$('.button--icon.button--icon--reply.rippleButton').trigger('click');
	}
}
 
function getThreadData() {
const authorID = $('a.username')[0].attributes['data-user-id'].nodeValue;
const authorName = $('a.username').html();
const hours = new Date().getHours();
return {
  user: {
	id: authorID,
	name: authorName,
	mention: `[USER=${authorID}]${authorName}[/USER]`,
  },
  greeting: () =>
	4 < hours && hours <= 11
	  ? 'Доброе утро'
	  : 11 < hours && hours <= 15
	  ? 'Добрый день'
	  : 15 < hours && hours <= 21
	  ? 'Добрый вечер'
	  : 'Доброй ночи',
};
}
 
function editThreadData(prefix, pin = false) {
// Получаем заголовок темы, так как он необходим при запросе
	const threadTitle = $('.p-title-value')[0].lastChild.textContent;
 
	if(pin == false){
		fetch(`${document.URL}edit`, {
		  method: 'POST',
		  body: getFormData({
			prefix_id: prefix,
			title: threadTitle,
			_xfToken: XF.config.csrf,
			_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
			_xfWithData: 1,
			_xfResponseType: 'json',
		  }),
		}).then(() => location.reload());
	}
	if(pin == true){
		fetch(`${document.URL}edit`, {
		  method: 'POST',
		  body: getFormData({
			prefix_id: prefix,
			title: threadTitle,
			sticky: 1,
			_xfToken: XF.config.csrf,
			_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
			_xfWithData: 1,
			_xfResponseType: 'json',
		  }),
		}).then(() => location.reload());
	}
}
 
function getFormData(data) {
	const formData = new FormData();
	Object.entries(data).forEach(i => formData.append(i[0], i[1]));
	return formData;
  }
})();
