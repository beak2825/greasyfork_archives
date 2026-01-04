// ==UserScript==
// @name         Куратор форума | KHABAROVSK
// @namespace    https://forum.blackrussia.online/
// @version      3.25
// @description  Скрипт для кураторов форума
// @author       Администратор KHABAROVSK
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @icon         https://i.postimg.cc/dVF25LZY/JS.png
// @downloadURL https://update.greasyfork.org/scripts/524674/%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%7C%20KHABAROVSK.user.js
// @updateURL https://update.greasyfork.org/scripts/524674/%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%7C%20KHABAROVSK.meta.js
// ==/UserScript==

(function () {
'use strict';
const UNACCEPT_MOVE = 2213;
const ACCEPT_MOVE = 2211;
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const GA_PREFIX = 12;
const TECH_PREFIX = 13;
const CLOSE_PREFIX = 7;
const GROUP = 98;
const ANSWER = 16;
let buttons = [
    {
      title: 'Одобрено',
      type: GROUP
    },
    {
	  title: 'Неактив',
	  content:
		'[CENTER][FONT=courier new][COLOR=rgb(84, 172, 210)]Доброго времени суток, уважаемый(-ая)[/COLOR] {{ member }}.<br>' +
        '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
        'Ваша заявка: [COLOR=rgb(97, 189, 109)][ICODE]Одобрена[/ICODE][/COLOR]<br>' +
        'У вас будет списано[COLOR=rgb(84, 172, 210)] [/COLOR] балла (-ов)<br>' +
        '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
        'С уважением [COLOR=rgb(84, 172, 210)] След. за форумом[/COLOR] - Luis_Moretti 🧊[/FONT][/CENTER]<br>',
      type: ANSWER,
	},
    {
	  title: 'Снятие преда',
	  content:
		'[CENTER][FONT=courier new][COLOR=rgb(84, 172, 210)]Доброго времени суток, уважаемый(-ая)[/COLOR] {{ member }}.<br>' +
        '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
        'Ваша заявка: [COLOR=rgb(97, 189, 109)][ICODE]Одобрена[/ICODE][/COLOR]<br>' +
        'У вас будет списано[COLOR=rgb(84, 172, 210)] 5[/COLOR] балла (-ов)<br>' +
        '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
        'С уважением [COLOR=rgb(84, 172, 210)] След. за форумом[/COLOR] - Luis_Moretti 🧊[/FONT][/CENTER]<br>',
      type: ANSWER,
      status: true,
	},
    {
	  title: 'Снятие выговора',
	  content:
		'[CENTER][FONT=courier new][COLOR=rgb(84, 172, 210)]Доброго времени суток, уважаемый(-ая)[/COLOR] {{ member }}.<br>' +
        '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
        'Ваша заявка: [COLOR=rgb(97, 189, 109)][ICODE]Одобрена[/ICODE][/COLOR]<br>' +
        'У вас будет списано[COLOR=rgb(84, 172, 210)] 15[/COLOR] балла (-ов)<br>' +
        '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
        'С уважением [COLOR=rgb(84, 172, 210)] След. за форумом[/COLOR] - Luis_Moretti 🧊[/FONT][/CENTER]<br>',
      type: ANSWER,
      status: true,
	},
    {
	  title: 'Покупка росписи',
	  content:
		'[CENTER][FONT=courier new][COLOR=rgb(84, 172, 210)]Доброго времени суток, уважаемый(-ая)[/COLOR] {{ member }}.<br>' +
        '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
        'Ваша заявка: [COLOR=rgb(97, 189, 109)][ICODE]Одобрена[/ICODE][/COLOR]<br>' +
        'У вас будет списано[COLOR=rgb(84, 172, 210)] 30[/COLOR] балла (-ов)<br>' +
        '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
        'С уважением [COLOR=rgb(84, 172, 210)] След. за форумом[/COLOR] - Luis_Moretti 🧊[/FONT][/CENTER]<br>',
      type: ANSWER,
      status: true,
	},
    {
	  title: 'Покупка имуна к преду',
	  content:
		'[CENTER][FONT=courier new][COLOR=rgb(84, 172, 210)]Доброго времени суток, уважаемый(-ая)[/COLOR] {{ member }}.<br>' +
        '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
        'Ваша заявка: [COLOR=rgb(97, 189, 109)][ICODE]Одобрена[/ICODE][/COLOR]<br>' +
        'У вас будет списано[COLOR=rgb(84, 172, 210)] 25[/COLOR] балла (-ов)<br>' +
        '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
        'С уважением [COLOR=rgb(84, 172, 210)] След. за форумом[/COLOR] - Luis_Moretti 🧊[/FONT][/CENTER]<br>',
      type: ANSWER,
      status: true,
	},
    {
	  title: 'Покупка имуна к выгу',
	  content:
		'[CENTER][FONT=courier new][COLOR=rgb(84, 172, 210)]Доброго времени суток, уважаемый(-ая)[/COLOR] {{ member }}.<br>' +
        '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
        'Ваша заявка: [COLOR=rgb(97, 189, 109)][ICODE]Одобрена[/ICODE][/COLOR]<br>' +
        'У вас будет списано[COLOR=rgb(84, 172, 210)] 30[/COLOR] балла (-ов)<br>' +
        '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
        'С уважением [COLOR=rgb(84, 172, 210)] След. за форумом[/COLOR] - Luis_Moretti 🧊[/FONT][/CENTER]<br>',
      type: ANSWER,
      status: true,
	},
    {
	  title: 'Покупка ролетки асков',
	  content:
		'[CENTER][FONT=courier new][COLOR=rgb(84, 172, 210)]Доброго времени суток, уважаемый(-ая)[/COLOR] {{ member }}.<br>' +
        '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
        'Ваша заявка: [COLOR=rgb(97, 189, 109)][ICODE]Одобрена[/ICODE][/COLOR]<br>' +
        'Вам выпало [COLOR=rgb(84, 172, 210)] [/COLOR] асков<br>' +
        'У вас будет списано[COLOR=rgb(84, 172, 210)] 35[/COLOR] балла (-ов)<br>' +
        '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
        'С уважением [COLOR=rgb(84, 172, 210)] След. за форумом[/COLOR] - Luis_Moretti 🧊[/FONT][/CENTER]<br>',
      type: ANSWER,
	},
    {
	  title: 'Покупка ролетки баллов',
	  content:
		'[CENTER][FONT=courier new][COLOR=rgb(84, 172, 210)]Доброго времени суток, уважаемый(-ая)[/COLOR] {{ member }}.<br>' +
        '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
        'Ваша заявка: [COLOR=rgb(97, 189, 109)][ICODE]Одобрена[/ICODE][/COLOR]<br>' +
        'Вам выпало [COLOR=rgb(84, 172, 210)] [/COLOR] баллов<br>' +
        'С учётом цены у вас/вам будет списано/начислено[COLOR=rgb(84, 172, 210)] [/COLOR] балла (-ов)<br>' +
        '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
        'С уважением [COLOR=rgb(84, 172, 210)] След. за форумом[/COLOR] - Luis_Moretti 🧊[/FONT][/CENTER]<br>',
      type: ANSWER,
	},
    {
	  title: 'Покупка авто',
	  content:
		'[CENTER][FONT=courier new][COLOR=rgb(84, 172, 210)]Доброго времени суток, уважаемый(-ая)[/COLOR] {{ member }}.<br>' +
        '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
        'Ваша заявка: [COLOR=rgb(97, 189, 109)][ICODE]Одобрена[/ICODE][/COLOR]<br>' +
        'У вас будет списано[COLOR=rgb(84, 172, 210)] 15[/COLOR] балла (-ов)<br>' +
        '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
        'С уважением [COLOR=rgb(84, 172, 210)] След. за форумом[/COLOR] - Luis_Moretti 🧊[/FONT][/CENTER]<br>',
      type: ANSWER,
      status: true,
	},
    {
      title: 'Отказано',
      type: GROUP
    },
    {
      title: 'Время пред',
	  content:
		'[CENTER][FONT=courier new][COLOR=rgb(84, 172, 210)]Доброго времени суток, уважаемый(-ая)[/COLOR] {{ member }}.<br>' +
        '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
        'Ваша заявка: [COLOR=red][ICODE]Отказана[/ICODE][/COLOR]<br>' +
        'Причина: С момента получения предупреждения не прошёл 1 день<br>' +
        '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
        'С уважением [COLOR=rgb(84, 172, 210)] След. за форумом[/COLOR] - Luis_Moretti 🧊[/FONT][/CENTER]<br>',
      type: ANSWER,
      status: true,
    },
    {
      title: 'Время выг',
	  content:
		'[CENTER][FONT=courier new][COLOR=rgb(84, 172, 210)]Доброго времени суток, уважаемый(-ая)[/COLOR] {{ member }}.<br>' +
        '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
        'Ваша заявка: [COLOR=red][ICODE]Отказана[/ICODE][/COLOR]<br>' +
        'Причина: С момента получения выговора не прошло 2 дня<br>' +
        '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
        'С уважением [COLOR=rgb(84, 172, 210)] След. за форумом[/COLOR] - Luis_Moretti 🧊[/FONT][/CENTER]<br>',
      type: ANSWER,
      status: true,
    },
    {
      title: 'Нету баллов',
	  content:
		'[CENTER][FONT=courier new][COLOR=rgb(84, 172, 210)]Доброго времени суток, уважаемый(-ая)[/COLOR] {{ member }}.<br>' +
        '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
        'Ваша заявка: [COLOR=red][ICODE]Отказана[/ICODE][/COLOR]<br>' +
        'Причина: У вас не хватает баллов<br>' +
        '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
        'С уважением [COLOR=rgb(84, 172, 210)] След. за форумом[/COLOR] - Luis_Moretti 🧊[/FONT][/CENTER]<br>',
      type: ANSWER,
      status: true,
    },
    {
      title: 'Не по форме',
	  content:
		'[CENTER][FONT=courier new][COLOR=rgb(84, 172, 210)]Доброго времени суток, уважаемый(-ая)[/COLOR] {{ member }}.<br>' +
        '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
        'Ваша заявка: [COLOR=red][ICODE]Отказана[/ICODE][/COLOR]<br>' +
        'Причина: Заявка составлена не по форме<br>' +
        '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
        'С уважением [COLOR=rgb(84, 172, 210)] След. за форумом[/COLOR] - Luis_Moretti 🧊[/FONT][/CENTER]<br>',
      type: ANSWER,
      status: true,
    },
    {
      title: 'Нету преда',
	  content:
		'[CENTER][FONT=courier new][COLOR=rgb(84, 172, 210)]Доброго времени суток, уважаемый(-ая)[/COLOR] {{ member }}.<br>' +
        '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
        'Ваша заявка: [COLOR=red][ICODE]Отказана[/ICODE][/COLOR]<br>' +
        'Причина: У вас отсутствует предупреждение<br>' +
        '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
        'С уважением [COLOR=rgb(84, 172, 210)] След. за форумом[/COLOR] - Luis_Moretti 🧊[/FONT][/CENTER]<br>',
      type: ANSWER,
      status: true,
    },
    {
      title: 'Нету выга',
	  content:
		'[CENTER][FONT=courier new][COLOR=rgb(84, 172, 210)]Доброго времени суток, уважаемый(-ая)[/COLOR] {{ member }}.<br>' +
        '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
        'Ваша заявка: [COLOR=red][ICODE]Отказана[/ICODE][/COLOR]<br>' +
        'Причина: У вас отсутствует выговор<br>' +
        '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
        'С уважением [COLOR=rgb(84, 172, 210)] След. за форумом[/COLOR] - Luis_Moretti 🧊[/FONT][/CENTER]<br>',
      type: ANSWER,
      status: true,
    },
    {
      title: 'Не АП',
	  content:
		'[CENTER][FONT=courier new][COLOR=rgb(84, 172, 210)]Доброго времени суток, уважаемый(-ая)[/COLOR] {{ member }}.<br>' +
        '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
        'Ваша заявка: [COLOR=red][ICODE]Отказана[/ICODE][/COLOR]<br>' +
        'Причина: Вы не являетесь агентом поддрежки<br>' +
        '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
        'С уважением [COLOR=rgb(84, 172, 210)] След. за форумом[/COLOR] - Luis_Moretti 🧊[/FONT][/CENTER]<br>',
      type: ANSWER,
      status: true,
    },
    {
      title: 'Время неактива',
	  content:
		'[CENTER][FONT=courier new][COLOR=rgb(84, 172, 210)]Доброго времени суток, уважаемый(-ая)[/COLOR] {{ member }}.<br>' +
        '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
        'Ваша заявка: [COLOR=red][ICODE]Отказана[/ICODE][/COLOR]<br>' +
        'Причина: С момента последнего неактива не прошло 2 дня<br>' +
        '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
        'С уважением [COLOR=rgb(84, 172, 210)] След. за форумом[/COLOR] - Luis_Moretti 🧊[/FONT][/CENTER]<br>',
      type: ANSWER,
      status: true,
    },
    {
      title: 'В снятие наказанией',
	  content:
		'[CENTER][FONT=courier new][COLOR=rgb(84, 172, 210)]Доброго времени суток, уважаемый(-ая)[/COLOR] {{ member }}.<br>' +
        '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
        'Ваша заявка: [COLOR=red][ICODE]Отказана[/ICODE][/COLOR]<br>' +
        'Причина: Обратитесь в раздел «Заявление на снятие наказания»<br>' +
        '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
        'С уважением [COLOR=rgb(84, 172, 210)] След. за форумом[/COLOR] - Luis_Moretti 🧊[/FONT][/CENTER]<br>',
      type: ANSWER,
      status: true,
    },
    {
      title: 'В заявление на неактив',
	  content:
		'[CENTER][FONT=courier new][COLOR=rgb(84, 172, 210)]Доброго времени суток, уважаемый(-ая)[/COLOR] {{ member }}.<br>' +
        '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
        'Ваша заявка: [COLOR=red][ICODE]Отказана[/ICODE][/COLOR]<br>' +
        'Причина: Обратитесь в раздел «Заявление на неактив»<br>' +
        '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
        'С уважением [COLOR=rgb(84, 172, 210)] След. за форумом[/COLOR] - Luis_Moretti 🧊[/FONT][/CENTER]<br>',
      type: ANSWER,
      status: true,
    }
];

$(document).ready(() => {
// Загрузка скрипта для обработки шаблонов
$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

// Добавление кнопок при загрузке страницы
addButton('Норма', 'form');
document.querySelectorAll('.actionBar-set--external').forEach(e => {
    let accept = document.createElement('a')
    accept.classList.add('actionBar-action')
    accept.setAttribute('id', 'acceptAnswer')
    accept.setAttribute('data-quote-href', e.querySelector('.actionBar-action--reply').getAttribute('data-quote-href'))
    accept.setAttribute('href', e.querySelector('.actionBar-action--reply').getAttribute('href'))
    accept.setAttribute('data-xf-click', 'quote')
    accept.setAttribute('rel', 'nofollow')
    accept.textContent = "Проверить"
    e.insertBefore(accept, e.firstChild);
})

// Поиск информации о теме
const threadData = getThreadData();

$(`a#acceptAnswer`).click(() => {
    XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
    buttons.forEach((btn, id) => {
      $(`button#answers-${id}`).click(() => pasteContent(id));
    });
});

function buttonsMarkup(buttons) {
    return `<div class="select_answer">${buttons.map((btn, i) => {
    if (btn.type == 98) {
        return `<button id="answers-0" class="button--primary button ` +`rippleButton" style="margin:5px; width: 96.5%; display: flex; justify-content: space-between;"><span class="button-text">📌</span><span class="button-text">${btn.title}</span><span class="button-text">📌</span></button>`
    } else {
        return `<button id="answers-${i}" class="button--primary button ` +`rippleButton" style="margin:5px; background: #31343b;"><span class="button-text">${btn.title}</span></button>`
    }}).join('')}</div>`;
}

function pasteContent(id) {
if ($('.fr-element.fr-view p').text() === ' ') $('.fr-element.fr-view p').empty();

    $('.fr-element.fr-view > p').empty();
    let user_id = $('.fr-element.fr-view > blockquote')[0].attributes[2].value.replace('member: ', '')
    let user_name = $('.fr-element.fr-view > blockquote')[0].attributes[0].value
    let member = `[USER=${user_id}]${user_name}[/USER]`
    $('span.fr-placeholder').empty();
    console.log('123')
    $('div.fr-element.fr-view > p').last().append(buttons[id].content.replace('{{ member }}', member));
    $('a.overlay-titleCloser').trigger('click');

    if (buttons[id].status == true) {
      $('.button--icon.button--icon--reply.rippleButton').trigger('click');
    }
}


$('button#form').click(() => sendForm());

function sendForm() {
    if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();
    $('span.fr-placeholder').empty();
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();

    today = dd + '.' + mm + '.' + yyyy;
    $('div.fr-element.fr-view p').append('[CENTER][B][FONT=courier new][COLOR=rgb(84, 172, 210)]1.[/COLOR] NickName: [COLOR=rgb(84, 172, 210)]Luis_Moretti[/COLOR]<br>' +
                                         '[COLOR=rgb(84, 172, 210)]2.[/COLOR] Уровень Админ-Прав:[COLOR=rgb(84, 172, 210)] 3[/COLOR]<br>' +
                                         '[COLOR=rgb(84, 172, 210)]3.[/COLOR] Ваша должность: [COLOR=rgb(84, 172, 210)]Ст. След. АП[/COLOR]<br>' +
                                         `[COLOR=rgb(84, 172, 210)]4.[/COLOR] Дата подачи: [COLOR=rgb(84, 172, 210)]${today}[/COLOR]<br>` +
                                         '[COLOR=rgb(84, 172, 210)]5.[/COLOR] Скриншоты проделанной работы: [/FONT][/B][/CENTER]');
};

});

function addButton(name, id) {
$('.button--icon--reply').before(
   `<button type="button" class="button rippleButton" id="${id}" style="margin-right: 6px; top: -2px; background-color: #212428; border-color: #33383e; border: none; box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.14), 0 2px 2px 0 rgba(0, 0, 0, 0.12), 0 1px 3px 0 rgba(0, 0, 0, 0.2);">${name}</button>`,
);
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
    const threadTitle =
          $('.p-title-value')[0].lastChild.textContent;

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

function moveThread(type, prefix) {
    const threadTitle = $('.p-title-value')[0].lastChild.textContent;

    fetch(`${document.URL}move`, {
        method: 'POST',
        body: getFormData({
            title: threadTitle,
            prefix: prefix,
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
})();