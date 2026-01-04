// ==UserScript==
// @name          Скрипт для Лидеров  VLADIMIR
// @namespace    https://forum.blackrussia.online
// @version      3.1
// @description  По вопросам(ВК): https://vk.com/ha1333ha
// @author       Fantom_Stark
// @match        https://forum.blackrussia.online/threads/*
// @grant        none
// @license 	 MIT
// @icon https://icons.iconarchive.com/icons/papirus-team/papirus-apps/48/emerald-theme-manager-icon-icon.png
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/506494/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2%20%20VLADIMIR.user.js
// @updateURL https://update.greasyfork.org/scripts/506494/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2%20%20VLADIMIR.meta.js
// ==/UserScript==
(function () {
  'use strict';
const UNACCEPT_PREFIX = 0; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 0; // Prefix that will be set when thread accepted
const RESHENO_PREFIX = 0; // Prefix that will be set when solving the problem
const PIN_PREFIX = 0; // Prefix that will be set when thread pins
const GA_PREFIX = 0; // Prefix that will be set when thread send to ga
const COMMAND_PREFIX = 0; // Prefix that will be set when thread send to project team
const CLOSE_PREFIX = 0; // Prefix that will be set when thread closes.
const VAJNO_PREFIX = 0;
const WATCHED_PREFIX = 0;
const TEX_PREFIX = 0;
const PREFIKS = 0;
const OTKAZRP_PREFIX = 0;
const ODOBRENORP_PREFIX = 0;
const NARASSMOTRENIIRP_PREFIX = 0;
const NARASSMOTRENIIORG_PREFIX = 0;
const buttons = [

  {
     title: `------------------------------------------------------>>>>>   Одобрение заявок <<<<<------------------------------------------------------`,
        },
     {
     title: "Заявка одобрена",
     content:
    "[B][CENTER][COLOR=RED]Доброго времени суток уважаемый игрок.[/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
    "[B][CENTER][FONT=times new roman][COLOR=lavender]Рассмотрев вашу Заявку я готов вынести вердикт.<br><br>"+
     "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
 },
  {
        title:'Будет проведена беседа с заместителем',
        content:
     "[B][CENTER][COLOR=RED]Доброго времени суток уважаемый игрок.[/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
    "[B][CENTER][FONT=times new roman][COLOR=lavender]Ваша жалоба была одобрена, с заместителем проведена беседа! Спасибо за информацию.<br><br>"+
     "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',

        },
    {
        title:'Будет проведена беседа с СС',
        content:
        "[B][CENTER][COLOR=RED]Доброго времени суток уважаемый игрок.[/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
    "[B][CENTER][FONT=times new roman][COLOR=lavender] Ваша жалоба была одобрена, с СС проведена беседа! Спасибо за информацию.<br><br>"+
     "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
        },
    {

     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Отказ жалобы ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
      {
     title: "Заявка отказана",
     content:
     "[B][CENTER][COLOR=RED]Доброго времени суток уважаемый игрок.[/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
    "[B][CENTER][FONT=times new roman][COLOR=lavender]Рассмотрев вашу Заявку я готов вынести вердикт.<br><br>"+
     "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Отказано.[/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
 },
    {
        title:'Отсутствует /time',
        content:
     "[B][CENTER][COLOR=RED]Доброго времени суток уважаемый игрок.[/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
    "[B][CENTER][FONT=times new roman][COLOR=lavender]На доказательствах отсуствует /time.<br><br>"+
     "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Отказано, закрыто.[/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
    },
    {
        title:'Срок написания жалобы составляет два дня',
        content:
     "[B][CENTER][COLOR=RED]Доброго времени суток уважаемый игрок.[/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
    "[B][CENTER][FONT=times new roman][COLOR=lavender]3.1. Срок написания жалобы составляет два дня (48 часов) с момента совершенного нарушения со стороны лидера сервера.<br><br>"+
     "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Отказано, закрыто.[/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
    },
     {
        title:'Жалоба от 3-го лица',
        content:
      "[B][CENTER][COLOR=RED]Доброго времени суток уважаемый игрок.[/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
    "[B][CENTER][FONT=times new roman][COLOR=lavender]3.3. Жалоба от третьего лица не принимается (жалоба должна быть подана участником ситуации).<br><br>"+
     "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Отказано, закрыто.[/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
    },
     {
         title:'Отсутствуют доказательства',
        content:
     "[B][CENTER][COLOR=RED]Доброго времени суток уважаемый игрок.[/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
    "[B][CENTER][FONT=times new roman][COLOR=lavender]В вашей жалобе отсутсвуют доказательства о нарушении лидера/заместителя<br><br>"+
     "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Отказано, закрыто.[/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
    },
    {
        title:'Проверив доказательства от заместителя выговор были выданы верно',
        content:
     "[B][CENTER][COLOR=RED]Доброго времени суток уважаемый игрок.[/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
    "[B][CENTER][FONT=times new roman][COLOR=lavender]Проверив опровержение заместителя, выговор вам был выдан верно.<br><br>"+
     "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Отказано, закрыто.[/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
    },
    {
        title:'Будет проведена беседа с заместителем',
        content:
      "[B][CENTER][COLOR=RED]Доброго времени суток уважаемый игрок.[/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
    "[B][CENTER][FONT=times new roman][COLOR=lavender]Ваша жалоба была одобрена, с заместителем проведена беседа! Спасибо за информацию.<br><br>"+
     "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
        },
     {

     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Для проверки заявлений ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
      {
     title: "Все выши заявки  одобрены",
     content:
    "[B][CENTER][COLOR=RED]Доброго времени суток уважаемые игроки.[/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
    "[B][CENTER][FONT=times new roman][COLOR=lavender]Рассмотрев ваши Заявки на повышения я готов вынести вердикт.<br><br>"+
     "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Все выше заявки одобрены.[/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
 },
            {
     title: " проверка заявлений на сс",
     content:
    "[B][CENTER][COLOR=RED]Доброго времени суток уважаемые игроки. Пришло время подвести итоги.[/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
    "[B][CENTER][FONT=times new roman][COLOR=lavender]Рассмотрев вашу Заявки я готов вынести вердикт.<br><br>"+
     "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Список допущенных к обзвону: [/COLOR]<br><br>"+
      "[B][CENTER][FONT=times new roman][COLOR=#ccff00] ВОТ СЮДА ВПИСАТЬ НИКИ КТО ОДОБРЕН[/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
    "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Список не допущенных к обзвону: [/COLOR]<br><br>"+
     "[B][CENTER][FONT=times new roman][COLOR=#ccff00] ВОТ СЮДА ВПИСАТЬ НИКИ КОМУ ОТКАЗ [/COLOR]<br><br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
      "[B][CENTER][FONT=times new roman][COLOR=lavender]Обзвон будет проходит на официальном дискорд канале https://discord.gg/cYxVBHwPjc<br><br>"+
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',

 },
    {
     title: "Заявки на повышения",
     content:
   "[B][CENTER][COLOR=RED]Доброго времени суток уважаемые игроки.[/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
    "[B][CENTER][FONT=times new roman][COLOR=lavender]Рассмотрев ваши Заявки я готов вынести вердикт.<br><br>"+
     "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Список у каво одобрено на повышения: [/COLOR]<br><br>"+
      "[B][CENTER][FONT=times new roman][COLOR=#ccff00] ВОТ СЮДА ВПИСАТЬ НИКИ КТО ОДОБРЕН[/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
    "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Список у каво отказ: [/COLOR]<br><br>"+
     "[B][CENTER][FONT=times new roman][COLOR=#ccff00] ВОТ СЮДА ВПИСАТЬ НИКИ КОМУ ОТКАЗ [/COLOR]<br><br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
 },
     {
	  title: '| Шаблон для сообщения о ежеденевной норме. |',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }},уважаемый Пользователь. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] 1) Ваш NickName: NickName. <br>"+
		"[B][CENTER][COLOR=lavender] 2) Ваша организация:   <br>"+
		"[B][CENTER][COLOR=lavender] 3) Скриншоты работы за день:   <br>"+
		"[B][CENTER][COLOR=lavender] - Вербовки: --------------------------------------------------------- <br>"+
		"[B][CENTER][COLOR=lavender] - Проверки: --------------------------------------------------------- <br>"+
		"[B][CENTER][COLOR=lavender] - РП Ситуации:  <br>"+
		"[B][CENTER][COLOR=lavender] - Лекции: --------------------------------------------------------- <br>"+
		"[B][CENTER][COLOR=lavender] - Тренировки: <br>"+
		"[B][CENTER][COLOR=lavender] - Совместные тренировки:  <br>"+
		"[B][CENTER][COLOR=lavender] - Скриншот с /time: <br>"+
		"[B][CENTER][COLOR=lavender] - Ситуации (с любой Госс организации): ---------------------------------------------------------  <br>"+
		"[B][CENTER][COLOR=lavender] - Отыгранное время:  <br>"+
		"[B][CENTER][COLOR=lavender] 4) Дата:  <br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' ,
	},
 {
	  title: '| Шаблон для сообщения о еженедельной норме. |',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }},уважаемый Пользователь. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] 1) Ваш NickName: Victor Norkin. <br>"+
		"[B][CENTER][COLOR=lavender] 2) Ваша организация: МВД  <br>"+
		"[B][CENTER][COLOR=lavender] 3) Скриншоты работы за неделю:  <br>"+
		"[B][CENTER][COLOR=lavender] - Cобеседования: ---------------------------------------------------------   <br>"+
		"[B][CENTER][COLOR=lavender] - РП Ситуации:   <br>"+
		"[B][CENTER][COLOR=lavender] - Лекции: ---------------------------------------------------------   <br>"+
		"[B][CENTER][COLOR=lavender] - Тренировки:   <br>"+
		"[B][CENTER][COLOR=lavender] - Совместные тренировки:  <br>"+
		"[B][CENTER][COLOR=lavender] - Глобальная РП ситуация: <br>"+
		"[B][CENTER][COLOR=lavender] 4) Дата: <br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' ,
	},

];

$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
    addButton('📒 ШАБЛОНЧИКИ 📒', 'selectAnswer');

	// Поиск информации о теме
	const threadData = getThreadData();

	$('button#pin').click(() => editThreadData(PIN_PREFIX, false));
	$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
	$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, false));
	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
    $('button#Zakrito').click(() => editThreadData(UNACCEPT_PREFIX, false));

	$(`button#selectAnswer`).click(() => {
		XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
		buttons.forEach((btn, id) => {
			if(id > 1) {
				$(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
			} else {
				$(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
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

	if(send == false){
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
	if(pin == false){
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
