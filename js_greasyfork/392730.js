// ==UserScript==
// @name		GalaxyDanger
// @namespace	dirtyWar
// @match		https://d3.ru/*
// @match		https://*.d3.ru/*
// @version		0.0.3
// @description	try to take over the world!
// @author	 	Voen
// @grant		none
// @require		https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @require		https://cdn.jsdelivr.net/npm/js-cookie@beta/dist/js.cookie.min.js
// @downloadURL https://update.greasyfork.org/scripts/392730/GalaxyDanger.user.js
// @updateURL https://update.greasyfork.org/scripts/392730/GalaxyDanger.meta.js
// ==/UserScript==


var $, jQuery;
$ = jQuery = window.jQuery;
this.$ = this.jQuery = jQuery.noConflict(true);

/* НАБОР ДАННЫХ */
// id поста
var post_id = 1868574;
var subdomain = rozovyekotiki;

// Заголовки
var title = [
	'Кот или кто',
	'Котэ - есть любовь',
	'Жизнь без кота не та',
	'Колбаса-любовь',
];
// Текст поста
var text = [
	'Любовь не найдена',
	'Любовь это любовь. Жывотне.',
	'Погладь меня',
	'Котэ да не тэ?',
];
// КДПВ (иллюстрации)
var url = [
	'https://cdn.jpg.wtf/futurico/5d/b2/1574167666-5db2baad5a2293122e26066fc0a0a9d3.jpeg',
	'https://cdn.jpg.wtf/futurico/03/ae/1574168600-03ae9fe3c5db62490228c6f85d3dfb57.jpeg',
	'https://cdn.jpg.wtf/futurico/c1/ad/1574171171-c1ad4a968d1fa5bc830072e4def61783.jpeg',
	'https://cdn.jpg.wtf/futurico/c0/27/1574171167-c0271ed5b5be2c93c1f69919201b9e07.jpeg',
];



// минимальный шаблон для подстановки данных
var post_json = {"data":{"type":"link","title":"Случайный заголовок","text":"Случайный текст","media":null,"link":{"url":"https://случайное_изображение.jpg"}}};

function generatePost(post_json) {
	// выбираем рандомный заголовок
	key = Math.floor(Math.random() * (title.length - 1) ) + 0;
	newtitle = title[key];
	// выбираем рандомный текст
	key = Math.floor(Math.random() * (text.length - 1) ) + 0;
	newtext = text[key];
	// выбираем рандомную картинку
	key = Math.floor(Math.random() * (url.length - 1) ) + 0;
	newurl = url[key];

	// добавляем в него случайно сгенерированные данные
	post_json.data.title = newtitle;
	post_json.data.text = newtext;
	post_json.data.link.url = newurl;

	return post_json;
}


var inbox_id = null;
// 1. Проверка Инбоксов на наличие оповещений о распубликации по ID
function checkInboxUnpubID() {
	var settings = {
		async: true,
		crossDomain: true,
		url: 'https://d3.ru/api/inboxes/unread/',
		method: "GET",
		headers: {
			'X-Futuware-UID': Cookies.get('uid', {domain:'d3.ru'}),
			'X-Futuware-SID' : Cookies.get('sid', {domain:'d3.ru'}),
			'Content-Type': 'application/json',
		},
		processData: false,
	}
	$.ajax(settings).done(function (re) {
		// если есть инбокс о распубликации содержащий id вашего поста
		if (re.item_count >= 1) {
			//console.log(re);
			re.inboxes.forEach(function(item, i, re) {
				if (item.data.text.indexOf(post_id) > -1) {
					inbox_id = item.id;
					patchPost();
					rePubPost();
				}
			});
		}
	});
}


// 1. Удаление инбокса оповещения о распубликации.
function deleteInbox(inbox_id) {
	//console.log(inbox_id);
	var data = 'post='+inbox_id+'&csrf_token='+globals.user.csrf_token;
	var settings = {
		async: true,
		crossDomain: true,
		url: `https://d3.ru/ajax/inbox/delete/`,
		method: "POST",
		headers: {
			'X-Futuware-UID': Cookies.get('uid', {domain:'d3.ru'}),
			'X-Futuware-SID' : Cookies.get('sid', {domain:'d3.ru'}),
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		processData: false,
		data: data
	}
	$.ajax(settings).done(function (response) {
		//console.log(response);
	});
}


// 2. МОДИФИЦИРУЕМ ТЕКУЩИЙ ПОСТ.
function patchPost() {
	post_json = generatePost(post_json);
	console.log(post_json);
	var settings = {
		async: true,
		crossDomain: true,
		url: `https://d3.ru/api/drafts/${post_id}/`,
		method: 'PATCH',
		headers: {
			'X-Futuware-UID': Cookies.get('uid', {domain:'d3.ru'}),
			'X-Futuware-SID' : Cookies.get('sid', {domain:'d3.ru'}),
			'Content-Type': 'application/json'
		},
		processData: false,
		data: JSON.stringify(post_json)
	}
	$.ajax(settings).done(function (response) {
		//console.log(response.data);
	});
}


// 3. ПЕРЕОПУБЛИКОВАТЬ ПОСТ.
function rePubPost() {
	var settings = {
		async: true,
		crossDomain: true,
		url: `https://d3.ru/api/drafts/${post_id}/publish/?domain_prefix=${subdomain}`,
		method: "POST",
		headers: {
			'X-Futuware-UID': Cookies.get('uid', {domain:'d3.ru'}),
			'X-Futuware-SID' : Cookies.get('sid', {domain:'d3.ru'}),
			'Content-Type': 'application/json'
		},
		processData: false
	}
	$.ajax(settings).done(function (response) {
		console.log(response);
		// если пришёл ответ о публикации
		if (response.id == post_id) {
			// удалить инбокс (навсегда!) за ненадобнстью во избежание засоров.
			deleteInbox(inbox_id);
		}
	});
}


// !!! Если это страница INBOX, то стартуем скрипт с 5-секундной проверкой
if (window.location.pathname == '/my/inbox/') {
	var timerId = setTimeout(function chk() {
		checkInboxUnpubID();
		timerId = setTimeout(chk, 5000);
	}, 5000);
}
