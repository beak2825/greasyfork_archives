// ==UserScript==
// @name          Скрипт для ГСХ/ЗГСХ/СХ  VLADIMIR.
// @namespace    https://forum.blackrussia.online
// @version      3.1
// @description  По вопросам(ВК): https://vk.com/ha1333ha
// @author       Fantom_Stark
// @match        https://forum.blackrussia.online/threads/*
// @grant        none
// @license 	 MIT
// @icon https://icons.iconarchive.com/icons/papirus-team/papirus-apps/48/emerald-theme-manager-icon-icon.png
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/506635/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%93%D0%A1%D0%A5%D0%97%D0%93%D0%A1%D0%A5%D0%A1%D0%A5%20%20VLADIMIR.user.js
// @updateURL https://update.greasyfork.org/scripts/506635/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%93%D0%A1%D0%A5%D0%97%D0%93%D0%A1%D0%A5%D0%A1%D0%A5%20%20VLADIMIR.meta.js
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
     title: "Одобрено",
     content:
    "[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
    "[B][CENTER][FONT=times new roman][COLOR=lavender]Рассмотрев вашу Заявку я готов вынести вердик что данный агент поддержки получит наказание.<br><br>"+
     "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
	},
  {
        title:'Будет проведена беседа ап',
        content:
      "[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
    "[B][CENTER][FONT=times new roman][COLOR=lavender]Ваша жалоба была одобрена, с агентом подержки беседа! Спасибо за информацию.<br><br>"+
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
     "[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
    "[B][CENTER][FONT=times new roman][COLOR=lavender]Рассмотрев вашу Заявку я готов вынести вердикт.<br><br>"+
     "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Отказано.[/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
	},
  {
        title:'Отсутствует /time',
        content:
     "[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
    "[B][CENTER][FONT=times new roman][COLOR=lavender]На доказательствах отсуствует /time.<br><br>"+
     "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Отказано, закрыто.[/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
	},
   {
        title:'Срок написания жалобы составляет два дня',
        content:
     "[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
    "[B][CENTER][FONT=times new roman][COLOR=lavender]3.1. Срок написания жалобы составляет два дня (48 часов) с момента совершенного нарушения со стороны лидера сервера.<br><br>"+
     "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Отказано, закрыто.[/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
	},
    {
         title:'Отсутствуют доказательства',
        content:
     "[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
    "[B][CENTER][FONT=times new roman][COLOR=lavender]В вашей жалобе отсутсвуют доказательства о нарушении лидера/заместителя<br><br>"+
     "[B][CENTER][FONT=times new roman][COLOR=#FF0000]Отказано, закрыто.[/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
	},
  {

     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Заявление на покупку в «Магазине Агентов Поддержки» ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
            {
         title:'Одобрено - 5 балов',
        content:
     "[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
    "[B][CENTER][FONT=times new roman][COLOR=lavender]Одобрено, -5 балла<br><br>"+
     "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено,[/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
	},
  {
         title:'Одобрено - 10 балов',
        content:
     "[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
    "[B][CENTER][FONT=times new roman][COLOR=lavender]Одобрено, -10 балла<br><br>"+
     "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено,[/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
	},
 {
         title:'Одобрено - 15',
        content:
     "[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
    "[B][CENTER][FONT=times new roman][COLOR=lavender]Одобрено, -15 балла<br><br>"+
     "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено,[/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',

	},
{
         title:'Одобрено - 20',
        content:
     "[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
    "[B][CENTER][FONT=times new roman][COLOR=lavender]Одобрено, -20 балла<br><br>"+
     "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено,[/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
	},
 {
         title:'Одобрено - 25',
        content:
     "[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
    "[B][CENTER][FONT=times new roman][COLOR=lavender]Одобрено, -25 балла<br><br>"+
     "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено,[/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
	},
 {
         title:'Одобрено - 30',
        content:
     "[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
    "[B][CENTER][FONT=times new roman][COLOR=lavender]Одобрено, -30 балла<br><br>"+
     "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено,[/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
	},
     {
         title:'Отказ',
        content:
     "[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
    "[B][CENTER][FONT=times new roman][COLOR=lavender]Отказано, не хватает баллов балла<br><br>"+
     "[B][CENTER][FONT=times new roman][COLOR=#FF0000]Отказано ,[/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
    },
     {

     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ Заявления на неактив ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
         title:'Одобрено ',
        content:
     "[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
    "[B][CENTER][FONT=times new roman][COLOR=lavender]Одобрено<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
    },
     {
         title:'Отказ',
        content:
     "[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
    "[B][CENTER][FONT=times new roman][COLOR=lavender]Отказано, <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
    },
    {

     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ Заявление на снятие наказаний ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
         title:'Одобрено ',
        content:
     "[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
    "[B][CENTER][FONT=times new roman][COLOR=lavender]Одобрено<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
    },
                                      {
         title:'Отказ',
        content:
     "[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
    "[B][CENTER][FONT=times new roman][COLOR=lavender]Отказано,не прошло 24 часа <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
    },
     {

     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Для проверки заявлений ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
                    {
     title: " проверка заявлений на АП",
     content:
    "[B][CENTER][COLOR=RED]Доброго времени суток уважаемые игроки. Пришло время подвести итоги.[/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
    "[B][CENTER][FONT=times new roman][COLOR=lavender]Рассмотрев ваши Заявки я готов вынести вердикт.<br><br>"+
     "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Список допущенных к обзвону: [/COLOR]<br><br>"+
      "[B][CENTER][FONT=times new roman][COLOR=#ccff00] ВОТ СЮДА ВПИСАТЬ НИКИ КТО ОДОБРЕН[/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
    "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Список не допущенных к обзвону: [/COLOR]<br><br>"+
     "[B][CENTER][FONT=times new roman][COLOR=#ccff00] ВОТ СЮДА ВПИСАТЬ НИКИ КОМУ ОТКАЗ [/COLOR]<br><br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
      "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Время обзвона будет назначено в беседе К/АП,Все прошедшие ожидайте , пока с вами свяжется Руководство Хелперов в VK.[/COLOR]<br><br>"+
      "[B][CENTER][FONT=times new roman][COLOR=lavender]Обзвон будет проходит на официальном дискорд канале https://discord.gg/cYxVBHwPjc<br><br>"+
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
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