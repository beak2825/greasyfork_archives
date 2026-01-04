// ==UserScript==
// @name         Для работы пк
// @namespace    https://forum.blackrussia.online
// @version      1.21
// @description  For Curators and Deputy Curators
// @author       Niletto
// @match        https://forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/
// @grant        none
// @license      MIT
// @collaborator Niletto1
// @icon https://sun6-23.userapi.com/s/v1/ig1/Bg7Sgc3yqNZ1F5YedeolIhnyRKIclMmKRAjpf9Rzj0XKAsgR9fLgLgNB3TUBDBF_N7XKKgPK.jpg?size=2155x2155&quality=96&crop=2,2,2155,2155&ava=1
// @downloadURL
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/532536/%D0%94%D0%BB%D1%8F%20%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D1%8B%20%D0%BF%D0%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/532536/%D0%94%D0%BB%D1%8F%20%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D1%8B%20%D0%BF%D0%BA.meta.js
// ==/UserScript==

(function () {
	'use strict';
	const UNACCEPT_PREFIX = 4; // префикс отказано
  const PIN_PREFIX = 2; //  префикс закрепить
  const TRANSFER_PREFIX1 = 20; //  префикс передачи админам 21
  const TRANSFER_PREFIX2 = 21; //  префикс передачи в обжалования 21
  const TRANSFER_PREFIX3 = 22; //  префикс передачи в жб на игроков 21
  const TRANSFER_PREFIX4 = 23; //  префикс передачи в тех раздел 21
  const TRANSFER_PREFIX5 = 24 ; //  префикс передачи в жб на тех 21
  const TRANSFER_PREFIX6 = 25; //  префикс передачи админам 22
  const TRANSFER_PREFIX7 = 26; //  префикс передачи в обжалования 22
  const TRANSFER_PREFIX8 = 27; //  префикс передачи в жб на игроков 22
  const TRANSFER_PREFIX9 = 28; //  префикс передачи в тех раздел 22
  const TRANSFER_PREFIX10 = 29; //  префикс передачи в жб на тех 22
  const TRANSFER_PREFIX11 = 30; //  префикс передачи админам 23
  const TRANSFER_PREFIX12 = 31; //  префикс передачи в обжалования 23
  const TRANSFER_PREFIX13 = 32; //  префикс передачи в жб на игроков 23
  const TRANSFER_PREFIX14 = 33; //  префикс передачи в тех раздел 23
  const TRANSFER_PREFIX15 = 34; //  префикс передачи в жб на тех 23
  const TRANSFER_PREFIX16 = 35; //  префикс передачи админам 24
  const TRANSFER_PREFIX17 = 36; //  префикс передачи в обжалования 24
  const TRANSFER_PREFIX18 = 37; //  префикс передачи в жб на игроков 24
  const TRANSFER_PREFIX19 = 38; //  префикс передачи в тех раздел 24
  const TRANSFER_PREFIX20 = 39; //  префикс передачи в жб на тех 24
  const TRANSFER_PREFIX21 = 40; //  префикс передачи админам 25
  const TRANSFER_PREFIX22 = 41; //  префикс передачи в обжалования 25
  const TRANSFER_PREFIX23 = 42; //  префикс передачи в жб на игроков 25
  const TRANSFER_PREFIX24 = 43; //  префикс передачи в тех раздел 25
  const TRANSFER_PREFIX25 = 44; //  префикс передачи в жб на тех 25
	const COMMAND_PREFIX = 10; // команде проекта
	const CLOSE_PREFIX = 7; // префикс закрыто
	const DECIDED_PREFIX = 6; // префикс решено
	const TECHADM_PREFIX = 13 // теху администратору
	const WATCHED_PREFIX = 9; // рассмотрено
	const WAIT_PREFIX = 14; // ожидание (для переноса в баг-трекер)
	const NO_PREFIX = 0;
	const buttons = [
	];

	
	// Поиск информации о теме
	const threadData = getThreadData();

	$(`button#ff`).click(() => pasteContent(8, threadData, true));
	$(`button#prr`).click(() => pasteContent(2, threadData, true));
	$(`button#zhb`).click(() => pasteContent(21, threadData, true));
	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX1, false));
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX2, false));
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX3, false));
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX4, false));
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX5, false));
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX6, false));
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX7, false));
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX8, false));
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX9, false));
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX10, false));
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX11, false));
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX12, false));
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX13, false));
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX14, false));
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX15, false));
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX16, false));
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX17, false));
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX18, false));
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX19, false));
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX20, false));
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX21, false));
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX22, false));
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX23, false));
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX24, false));
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX25, false));
	$('button#command').click(() => editThreadData(COMMAND_PREFIX, true));
	$('button#watched').click(() => editThreadData(WATCHED_PREFIX, false));
	$('button#decided').click(() => editThreadData(DECIDED_PREFIX, false));
	$('button#closed').click(() => editThreadData(CLOSE_PREFIX, false));
	$('button#techspec').click(() => editThreadData(TECHADM_PREFIX, true));

	$(`button#selectAnswer`).click(() => {
	XF.alert(buttonsMarkup(buttons), null, 'ВЫБЕРИТЕ ОТВЕТ');
	buttons.forEach((btn, id) => {
	if (id > 1) {
	$(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
	}
	else {
	$(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
	}
	});
	});
	});

    function addButton(name, id, style) {
         $('.button--icon--reply').before(
	`<button type="button" class="button--primary button rippleButton" id="${id}" style="${style}">${name}</button>`,
	);
	}
	function addAnswers() {
		$('.button--icon--reply').after(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectAnswer" style="oswald: 3px; margin-left: 5px; margin-top: 10px; border-radius: 13px;">ОТВЕТЫ</button>`,
	);
	}

	function buttonsMarkup(buttons) {
	return `<div class="select_answer">${buttons
	.map(
	(btn, i) =>
	`<button id="answers-${i}" class="button--primary button ` +
	`rippleButton" style="margin:4px; ${btn.dpstyle}"><span class="button-text">${btn.title}</span></button>`,
	)
	.join('')}</div>`;
	}

	function pasteContent(id, data = {}, send = false) {
	const template = Handlebars.compile(buttons[id].content);
	if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

	$('span.fr-placeholder').empty();
	$('div.fr-element.fr-view p').append(template(data));
	$('a.overlay-titleCloser').trigger('click');

	if (send == true) {
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
	4 < hours && hours <= 11 ?
	'Доброе утро' :
	11 < hours && hours <= 15 ?
	'Добрый день' :
	15 < hours && hours <= 21 ?
	'Добрый вечер' :
	'Доброй ночи',
	};
	}

	function editThreadData(prefix, pin = false, may_lens = true) {
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
	discussion_open: 1,
	sticky: 1,
	_xfToken: XF.config.csrf,
	_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
	_xfWithData: 1,
	_xfResponseType: 'json',
	}),
	}).then(() => location.reload());
	}
	if(may_lens === true) {
	if(prefix == UNACCEPT_PREFIX || prefix == WATCHED_PREFIX || prefix == CLOSE_PREFIX || prefix == DECIDED_PREFIX) {
	moveThread(prefix, 230); }

	if(prefix == WAIT_PREFIX) {
	moveThread(prefix, 917);
	}

        if(prefix == TRANSFER_PREFIX1) {
				moveThread(prefix, 721);
      }
        if(prefix == TRANSFER_PREFIX3) {
				moveThread(prefix, 723);
			}
      }
        if(prefix == TRANSFER_PREFIX5) {
				moveThread(prefix, 1197);
			}
        if(prefix == TRANSFER_PREFIX4) {
				moveThread(prefix, 701);
			}
        if(prefix == TRANSFER_PREFIX2) {
				moveThread(prefix, 724);
			}
        if(prefix == TRANSFER_PREFIX6) {
				moveThread(prefix, 783);
      }
        if(prefix == TRANSFER_PREFIX8) {
				moveThread(prefix, 785);
			}
        if(prefix == TRANSFER_PREFIX10) {
				moveThread(prefix, 1198);
			}
        if(prefix == TRANSFER_PREFIX9) {
				moveThread(prefix, 757);
			}
        if(prefix == TRANSFER_PREFIX7) {
				moveThread(prefix, 786);
			}
        if(prefix == TRANSFER_PREFIX11) {
				moveThread(prefix, 842);
      }
        if(prefix == TRANSFER_PREFIX13) {
				moveThread(prefix, 844);
			}
        if(prefix == TRANSFER_PREFIX15) {
				moveThread(prefix, 1199);
			}
        if(prefix == TRANSFER_PREFIX14) {
				moveThread(prefix, 815);
			}
        if(prefix == TRANSFER_PREFIX12) {
				moveThread(prefix, 845);
			}
        if(prefix == TRANSFER_PREFIX16) {
				moveThread(prefix, 883);
      }
        if(prefix == TRANSFER_PREFIX18) {
				moveThread(prefix, 885);
			}
        if(prefix == TRANSFER_PREFIX20) {
				moveThread(prefix, 1200);
			}
        if(prefix == TRANSFER_PREFIX19) {
				moveThread(prefix, 857);
			}
        if(prefix == TRANSFER_PREFIX17) {
				moveThread(prefix, 886);
			}
        if(prefix == TRANSFER_PREFIX21) {
				moveThread(prefix, 952);
                       }
        if(prefix == TRANSFER_PREFIX23) {
				moveThread(prefix, 954);
			}
        if(prefix == TRANSFER_PREFIX25) {
				moveThread(prefix, 1201);
			}
        if(prefix == TRANSFER_PREFIX24) {
				moveThread(prefix, 925);
			}
        if(prefix == TRANSFER_PREFIX22) {
				moveThread(prefix, 955);
			}
        if(prefix == COMMAND_PREFIX) {
				moveThread(prefix, 490);
        }
	}

	function moveThread(prefix, type) {
	// Перемещение темы
	const threadTitle = $('.p-title-value')[0].lastChild.textContent;

	fetch(`${document.URL}move`, {
		method: 'POST',
		body: getFormData({
		prefix_id: prefix,
		title: threadTitle,
		target_node_id: type,
		redirect_type: 'none',
		notify_watchers: 1,
		starter_alert: 1,
		starter_alert_reason: "",
		_xfToken: XF.config.csrf,
		_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
		_xfWithData: 1,
		_xfResponseType: 'json',
	}),
	}).then(() => location.reload());
	}

	function getFormData(data) {
		const formData = new FormData();
		Object.entries(data).forEach(i => formData.append(i[0], i[1]));
		return formData;
	}

const bgButtons = document.querySelector(".pageContent");
const buttonConfig = (text, href) => {
  const button = document.createElement("button");
  button.textContent = text;
  button.classList.add("bgButton");
  button.addEventListener("click", () => {
    window.location.href = href;
  });
  return button;
};

const Button16 = buttonConfig("ЖБ ТЕХ 21", 'https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9621-chilli.1202/');
const Button17 = buttonConfig("ЖБ ТЕХ 22", 'https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9622-choco.1203/');
const Button18 = buttonConfig("ЖБ ТЕХ 23", 'https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9623-moscow.1204/');
const Button19 = buttonConfig("ЖБ ТЕХ 24", 'https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9624-spb.1205/');
const Button20 = buttonConfig("ЖБ ТЕХ 25", 'https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9625-ufa.1206/');const ButtonTech16 = buttonConfig("ТР 21", 'https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-chilli.1007/');
const ButtonTech17 = buttonConfig("ТР 22", 'https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-choco.1048/');
const ButtonTech18 = buttonConfig("ТР 23", 'https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-moscow.1052/');
const ButtonTech19 = buttonConfig("ТР 24", 'https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-spb.1095/');
const ButtonTech20 = buttonConfig("ТР 25", 'https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-ufa.1138/');
const ButtonComp16 = buttonConfig("ЖБ ИГР 21", 'https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.994/');
const ButtonComp17 = buttonConfig("ЖБ ИГР 22", 'https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.1036/');
const ButtonComp18 = buttonConfig("ЖБ ИГР 23", 'https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.1082/');
const ButtonComp19 = buttonConfig("ЖБ ИГР 24", 'https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.1124/');
const ButtonComp20 = buttonConfig("ЖБ ИГР 25", 'https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.1167/');

bgButtons.append(Button16);
bgButtons.append(Button17);
bgButtons.append(Button18);
bgButtons.append(Button19);
bgButtons.append(Button20);
bgButtons.append(ButtonTech16);
bgButtons.append(ButtonTech17);
bgButtons.append(ButtonTech18);
bgButtons.append(ButtonTech19);
bgButtons.append(ButtonTech20);
bgButtons.append(ButtonComp16);
bgButtons.append(ButtonComp17);
bgButtons.append(ButtonComp18);
bgButtons.append(ButtonComp19);
bgButtons.append(ButtonComp20);