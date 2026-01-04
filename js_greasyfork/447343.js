// ==UserScript==
// @name         Sergeevna
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  try to take over the world!
// @author       You
// @license    MIT
// @match        https://forum.blackrussia.online/threads/*
// @inaclude      https://forum.blackrussia.online/threads/
// @icon         data:image/jpeg;base64,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
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447343/Sergeevna.user.js
// @updateURL https://update.greasyfork.org/scripts/447343/Sergeevna.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const VAJNO_PREFIX = 1;
    const NARASSSMOTRENII_PREFIX = 2;
    const BEZPREFIXA_PREFIX = 3;
    const OTKAZANO_PREFIX = 4;
    const REALIZOVANNO_PREFIX = 5;
    const RESHENO_PREFIX = 6;
    const ZAKRITO_PREFIX = 7;
    const ODOBRENO_PREFIX = 8;
    const RASSMORTENO_PREFIX = 9;
    const KOMANDEPROEKTA_PREFIX = 10;
    const SPECADMINY_PREFIX = 11;
    const GLAVNOMYADMINY_PREFIX = 12;
    const TEXSPECY_PREFIX = 13;
    const OJIDANIE_PREFIX = 14;
    const PROVERENOKONTRKACH_PREFIX = 15;
    const buttons = [
        {
            title: 'Обжаловать через',
            content:
            '[CENTER][SIZE=4][color=#fff][B] Здравствуйте, Вы сможете обжаловать свой черный список после .[/COLOR][/B][/CENTER]<br>' +
            "",
            prefix: ZAKRITO_PREFIX,
            status: false,
        },
        {
            title: 'Отказано в обж',
            content:
            '[CENTER][SIZE=4][color=#fff][B] Здравствуйте, в обжаловании отказано.[/COLOR][/B][/CENTER]<br>' +
            "",
            prefix: ZAKRITO_PREFIX,
            status: false,
        },
        {
            title: 'Обжалован ЧС',
            content:
             '[CENTER][SIZE=4][color=#fff][B] Здравствуйте, вынесла Вас из черного списка.[/COLOR][/B][/CENTER]<br>' +
            "",
            prefix: ZAKRITO_PREFIX,
            status: false,
        },
        {
            title: 'Обжалован Бан',
            content:
             '[CENTER][SIZE=4][color=#fff][B] Здравствуйте, Ваша блокировка была снята, впредь не нарушайте правила.[/COLOR][/B][/CENTER]<br>' +
            "",
            prefix: ZAKRITO_PREFIX,
            status: false,
        },
        {
            title: 'Ответ ранее',
            content:
             '[CENTER][SIZE=4][color=#fff][B] Здравствуйте, ранее был дан ответ.[/COLOR][/B][/CENTER]<br>' +
            "",
            prefix: ZAKRITO_PREFIX,
            status: false,
        },
        {
            title: 'Нет доквы',
            content:
             '[CENTER][SIZE=4][color=#fff][B] Здравствуйте, вы не предоставили скриншот выдачи наказания, от модератора. Обращение не подлежит рассмотрению.[/COLOR][/B][/CENTER]<br>' +
        `[CENTER][SIZE=4][B][color=red] Закрыто.[/B][/CENTER]`,
            prefix: ZAKRITO_PREFIX,
            status: false,
        },
        {
            title: 'Док-ва не робят',
            content:
             '[CENTER][SIZE=4][color=#fff][B] Здравствуйте, предоставленная вами ссылка не работает/открывается или вовсе не действительна. Создайте новую тему и убедитесь что ссылка работает корректно.[/COLOR][/B][/CENTER]<br>' +
        `[CENTER][SIZE=4][B][color=red] Закрыто.[/B][/CENTER]`,
            prefix: ZAKRITO_PREFIX,
            status: false,
        },
        {
            title: 'Дубликат',
            content:
             '[CENTER][SIZE=4][color=#fff][B] Здравствуйте, ответ на свое обжалование вы получили в предыдущей теме.[/COLOR][/B][/CENTER]<br>' +
        `[CENTER][SIZE=4][B][color=red] Закрыто.[/B][/CENTER]`,
            prefix: ZAKRITO_PREFIX,
            status: false,
        },
];

$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
	addButton('Ответы', 'selectAnswer');

    // Поиск информации о теме
    const threadData = getThreadData();

    $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
    $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
    $('button#Ga').click(() => editThreadData(GA_PREFIX, true));
    $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
    $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
    $('button#Texy').click(() => editThreadData(TEX_PREFIX, false));
    $('button#close').click(() => editThreadData(CLOSE_PREFIX, false));
    $('button#spec').click(() => editThreadData(SPEC_PREFIX, true));

$(`button#selectAnswer`).click(() => {
      XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
      buttons.forEach((btn, id) => {
        if (id > 0) {
          $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
        }
        else {
          $(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
        }
      });
    });
  });

function addButton(name, id) {
    $('.button--icon--reply').before(
      `<button type="button" class="button rippleButton" id="${id}" style="margin: 3px;">${name}</button>`,
    );
  }

  function buttonsMarkup(buttons) {
    return `<div class="select_answer">${buttons
  .map(
  (btn, i) =>
    `<button id="answers-${i}" class="button--primary button ` +
    `rippleButton" style="margin:5px"><span class="button-text">${btn.title}</span></button>`,
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