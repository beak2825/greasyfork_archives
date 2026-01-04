// ==UserScript==
// @name         RED || script for ЗГС/ГС  by Hokage.
// @namespace    https://forum.fussrussia.online
// @version      1.5
// @description  По вопросам(ВК): https://vk.com/fivehundredbuks
// @author       Stanyslav Hokage
// @match        https://forum.fussrussia.online/index.php*
// @grant        none
// @license 	 MIT
// @icon https://icons.iconarchive.com/icons/papirus-team/papirus-apps/48/emerald-theme-manager-icon-icon.png
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/485301/RED%20%7C%7C%20script%20for%20%D0%97%D0%93%D0%A1%D0%93%D0%A1%20%20by%20Hokage.user.js
// @updateURL https://update.greasyfork.org/scripts/485301/RED%20%7C%7C%20script%20for%20%D0%97%D0%93%D0%A1%D0%93%D0%A1%20%20by%20Hokage.meta.js
// ==/UserScript==

(function () {
  'use strict';
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const RESHENO_PREFIX = 6; // Prefix that will be set when solving the problem
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const GA_PREFIX = 12; // Prefix that will be set when thread send to ga
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const CLOSE_PREFIX = 7; // Prefix that will be set when thread closes.
const VAJNO_PREFIX = 1;
const WATCHED_PREFIX = 9;
const TEX_PREFIX = 13;
const PREFIKS = 0;
const OTKAZRP_PREFIX = 4;
const ODOBRENORP_PREFIX = 8;
const NARASSMOTRENIIRP_PREFIX = 2;
const NARASSMOTRENIIORG_PREFIX = 2;
const buttons = [

      {
      title: 'Шаблон',
      content:
        '[SIZE=4][COLOR=rgb(139, 69, 19)][I][FONT=times new roman]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/I][/COLOR][/SIZE]',
      },
     {
      title: '|-(-->--- Раздел Жалобы на лидеров ---<--)-|',
      content:
        '[SIZE=4][COLOR=rgb(139, 69, 19)][I][FONT=times new roman]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/I][/COLOR][/SIZE]',
      },
      {
	  title: '| На рассмотрение |',
	  content:
	    "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба взята на рассмотрение, не создавайте дубликатов и ожидайте ответа от администрации.<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]FUSS[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>",
	  prefix: PIN_PREFIX,
	  status: true,
	},
 {
	  title: '| Не по форме |',
	  content:
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Вашa жалобa составленa не по форме, пожалуйста ознакомьтесь с правилами подачи жалоб.<br><br>"+
		//"[CENTER][B][COLOR=RED]| [URL='https://forum.blackrussia.online/index.php?threads/3429394/'][Color=lavender]Правила подачи жалоб[/URL] [COLOR=RED]|<br>"+
	     "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]FUSS[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
 {
	  title: '|-(--(--(->------ Причины отказов ------<)--)--)-|',
	},
{
	  title: '| Нету в системе логов |',
	  content:
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]В системе логирования нарушений не обнаружено...<br>"+
         "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]FUSS[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
   {
	  title: '| Нет нарушений |',
	  content:
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Со стороны лидер не найдены какие либо нарушение, пожалуйста ознакомьтесь с правилами проекта..<br>"+
         "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]FUSS[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
     {
	  title: '| От 3 лица |',
	  content:
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Жалоба составлена от 3-го лица, мы не можем ее рассмотреть.<br>"+
          "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]FUSS[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
     {
	  title: '|-(--(--(->------ Прчины одобрения ------<)--)--)-|',
	},
	{
	  title: '| Лидер снят/получил выг |',
	  content:
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, лидер получит следующие наказание.[Spoiler][color=red] | [color=lavender] Лидер получил предупреждение в виде выговора.[color=red]  | Либо он был снят со своего поста[/Spoiler]<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]FUSS[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Проф. Беседа |',
	  content:
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, лидер получит следующие наказание.[Spoiler][color=red] | [color=lavender] Лидер был ознакомлен и проинструктирован.[color=red]  |[/Spoiler]<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]FUSS[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '|-(--(--(->------- В другой раздел -------<-)--)--)-|',
	},
   {
	  title: '| В жалобы на АДМ |',
	  content:
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Вы ошиблись разделом, обратитесь в раздел жалоб на администрацию. <br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]FUSS[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>",
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
   	{
	  title: '| В жалобы на хелперов |',
	  content:
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Обратитесь в раздел жало на агентов поддержки. <br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]FUSS[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>",
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: '| В жалобы на сотрудников |',
	  content:
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Вы ошиблись разделом, обратитесь в раздел жалоб на сотрудников данной организации. <br>"+
		 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]FUSS[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>",
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: '|-(--(--(->------- В другой раздел -------<-)--)--)-|',
	},
     {
	  title: '| Отказ норматив |',
	  content:
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша заявка получает статус: Отказано. Обычно это происходит,если в заявке не достаточно докозательств вашей работы.<br>"+
          "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]FUSS[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Одобрено нормотив. (Перенорма) |',
	  content:
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша заявка была рассмотрена и получает статус: Одобрено.[Spoiler][color=red] | Данные были занесены в таблицу успеваемости [color=blue](Перенорма). [color=lavender] [color=red] |[/Spoiler]<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]FUSS[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Одобрено нормотив. (Норма) |',
	  content:
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша заявка была рассмотрена и получает статус: Одобрено.[Spoiler][color=red] | Данные были занесены в таблицу успеваемости [color=green](Норма). [color=lavender] [color=red] |[/Spoiler]<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]FUSS[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Одобрено нормотив. (Натяг) |',
	  content:
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша заявка была рассмотрена и получает статус: Одобрено.[Spoiler][color=red] | Данные были занесены в таблицу успеваемости [color=orange] (Натяг). [color=lavender] [color=red] |[/Spoiler]<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]FUSS[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Одобрено нормотив. (Натяг,но это 3-тий подрят) |',
	  content:
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша заявка была рассмотрена и получает статус: Одобрено.[Spoiler][color=red] | Данные были занесены в таблицу успеваемости [color=orange] (Натяг). [color=lavender] [color=red] | Так же вы получаете +1 устный выговор за 3х - натяга подрят. [/Spoiler]<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]FUSS[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
];

$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
   	//addButton('Одобрено', 'accepted');
   // addButton('Отказано', 'unaccept');
    addButton('Шаблоны Ответов by hokage', 'selectAnswer');

	// Поиск информации о теме
	const threadData = getThreadData();

	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
	$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
	$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
    $('button#Zakrito').click(() => editThreadData(UNACCEPT_PREFIX, false));

	$(`button#selectAnswer`).click(() => {
		XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
		buttons.forEach((btn, id) => {
			if(id > 1) {
				$(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
			} else {
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