// ==UserScript==
// @name         Скрипт для ГС/ЗГС фракции + жб || GOLD
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  Скрипт для ГС/ЗГС по фракциям
// @author       sdwht
// @match        https://forum.blackrussia.online/threads/*
// @icon         https://sun6-23.userapi.com/s/v1/ig2/5RNqzknodcIxyvcuJvMKsIGvtuyTw4EXxgYaYeYdHRbkugoBGFS8x8zbufsc5Y-umJLw7EZ2qDyidp6dl_CtocAo.jpg?size=1590x1590&quality=95&crop=0,0,1590,1590&ava=1
// @grant        none
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/503143/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%93%D0%A1%D0%97%D0%93%D0%A1%20%D1%84%D1%80%D0%B0%D0%BA%D1%86%D0%B8%D0%B8%20%2B%20%D0%B6%D0%B1%20%7C%7C%20GOLD.user.js
// @updateURL https://update.greasyfork.org/scripts/503143/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%93%D0%A1%D0%97%D0%93%D0%A1%20%D1%84%D1%80%D0%B0%D0%BA%D1%86%D0%B8%D0%B8%20%2B%20%D0%B6%D0%B1%20%7C%7C%20GOLD.meta.js
// ==/UserScript==
 
(function () {
	'use strict';
	const UNACCСEPT_PREFIX = 4; // префикс отказано
	const ACCСEPT_PREFIX = 8; // префикс одобрено
	const PINN_PREFIX = 2; //  префикс закрепить
	const SPECADM_PREFIX = 11; // специальному администратору
	const GA_PREFIX = 12; // главному администратору
    const CLOSE_PREFIX = 7;
    const TEXY_PREFIX = 13;
    const REALIZOVANO_PREFIX = 5;
    const VAJNO_PREFIX = 1;
    const OJIDANIE_PREFIX = 14;
const buttons = [
    {
    title: '♥Раздел: На рассмотрении♥                       .', 
    },
    {
      title: 'На рассмотрении',
      content:
		 "[I][B][FONT=georgia][COLOR=#7CFC00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/FONT][/B] <br><br>"+
        "[I][B][FONT=georgia][COLOR=#FFFFFF]Ваша жалоба взята на рассмотрение, ожидайте ответа и не создавайте тем-дубликатов.[/FONT] <br><br>"+
                "[I][B][FONT=georgia][COLOR=#FFFFFF]На рассмотрении[/COLOR][/FONT]<br><br>",
      prefix: PINN_PREFIX,
      status: true,
	},
        {
      title: 'Запросил опру',
      content:
         "[I][B][FONT=georgia][COLOR=#7CFC00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/FONT][/B] <br><br>"+
        "[I][B][FONT=georgia][COLOR=#FFFFFF]У лидера были запрошены доказательства, ожидайте ответа и не создавайте тем-дубликатов.[/FONT] <br><br>"+
                "[I][B][FONT=georgia][COLOR=#FFFFFF]На рассмотрении[/COLOR][/FONT]<br><br>",
      prefix: PINN_PREFIX,
      status: true,
	},
      {
     title: '♥Раздел: Одобрено♥                            . ', 
    },
   {
      title: 'Беседа с лд',
      content:
		 "[I][B][FONT=georgia][COLOR=#7CFC00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/FONT][/B]<br><br>"+
        "[I][B][FONT=georgia][COLOR=#FFFFFF]Ваша жалоба [COLOR=#7CFC00]одобрена[/COLOR], с лидером будет проведена профилактическая беседа.[/FONT] <br><br>"+
                "[I][B][FONT=georgia][COLOR=#FFFFFF]Одобрено[/COLOR][/FONT]<br><br>",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Работа с лд',
      content:
	 "[I][B][FONT=georgia][COLOR=#7CFC00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/FONT][/B]<br><br>"+
        "[I][B][FONT=georgia][COLOR=#FFFFFF]Ваша жалоба [COLOR=#7CFC00]одобрена[/COLOR], с лидером будет проведена необходимая работа по данному случаю.[/FONT] <br><br>"+
                "[I][B][FONT=georgia][COLOR=#FFFFFF]Одобрено[/COLOR][/FONT]<br><br>",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
     {
      title: 'Снят лд',
      content:
		 "[I][B][FONT=georgia][COLOR=#7CFC00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/FONT][/B]<br><br>"+
         "[I][B][FONT=georgia][COLOR=#FFFFFF]Ваша жалоба [COLOR=#7CFC00]одобрена[/COLOR], лидер будет снят со своего поста.[/FONT] <br><br>"+
                "[I][B][FONT=georgia][COLOR=#FFFFFF]Одобрено[/COLOR][/FONT]<br><br>",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
     title: '♥Раздел: Отказано♥                               . ', 
    },
    {
      title: 'Отсутствуют доква',
      content:
		  "[I][B][FONT=georgia][COLOR=#7CFC00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/FONT][/B]<br><br>"+
        "[I][B][FONT=georgia][COLOR=#FFFFFF]В вашей жалобе отсутствуют доказательства о нарушении со стороны лидера.[/COLOR][/FONT] <br><br>"+
                "[I][B][FONT=georgia][COLOR=#FFFFFF]Отказано[/COLOR][/FONT]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
         },
    {
      title: 'Недостаточно док-в',
      content:
		  "[I][B][FONT=georgia][COLOR=#7CFC00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/FONT][/CENTER][/B]<br><br>"+
        "[I][B][FONT=georgia][COLOR=#FFFFFF]Ваших доказательств недостаточно для корректного рассмотрения жалобы.[/COLOR][/FONT] <br><br>"+
                "[I][B][FONT=georgia][COLOR=#FFFFFF]Отказано[/COLOR][/FONT]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Нарушений нет',
      content:
		  "[I][B][FONT=georgia][COLOR=#7CFC00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/FONT][/B]<br><br>"+
        "[I][B][FONT=georgia][COLOR=#FFFFFF]Нарушений со стороны лидера не найдено.[/FONT] <br><br>"+
                "[I][B][FONT=georgia][COLOR=#FFFFFF]Отказано[/COLOR][/FONT]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
        {
      title: '3-е лицо',
      content:
		  "[I][B][FONT=georgia][COLOR=#7CFC00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/FONT][/B]<br><br>"+
        "[I][B][FONT=georgia][COLOR=RED]3.3.[/COLOR][COLOR=#FFFFFF]Жалоба от третьего лица не принимается (жалоба должна быть подана участником ситуации).[/COLOR][/FONT] <br><br>"+
                "[I][B][FONT=georgia][COLOR=#FFFFFF]Отказано[/COLOR][/FONT]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
            {
      title: 'Док-ва отредактированы',
      content:
		  "[I][B][FONT=georgia][COLOR=#7CFC00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/FONT][/B]<br><br>"+
        "[I][B][FONT=georgia][COLOR=RED]3.7.[/COLOR][COLOR=#FFFFFF]Доказательства должны быть предоставлены в первоначальном виде.[/COLOR][/FONT] <br><br>"+
                "[I][B][FONT=georgia][COLOR=#FFFFFF]Отказано[/COLOR][/FONT]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Не по форме',
      content:
		  "[I][B][FONT=georgia][COLOR=#7CFC00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/FONT][/B]<br><br>"+
        "[I][B][FONT=georgia][COLOR=#FFFFFF]Ваша жалоба составлена не по форме. С формой создания темы можно ознакомиться тут:<br>"+
        "[I][B][COLOR=#FFFFFF][url=https://forum.blackrussia.online/threads/Правила-подачи-жалоб-на-лидеров.559805/][/url]<br>"+
                "[I][B][FONT=georgia][COLOR=#FFFFFF]Отказано[/COLOR][/FONT]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
        {
      title: '48 часов',
      content:
		  "[I][B][FONT=georgia][COLOR=#7CFC00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/FONT][/B]<br><br>"+
        "[I][B][FONT=georgia][COLOR=RED]3.1.[/COLOR][COLOR=#FFFFFF]Срок написания жалобы составляет два дня (48 часов) с момента совершенного нарушения со стороны лидера сервера.[/FONT] <br><br>"+
                "[I][B][FONT=georgia][COLOR=#FFFFFF]Отказано[/COLOR][/FONT]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
        {
      title: 'Нет /time',
      content:
		  "[I][B][FONT=georgia][COLOR=#7CFC00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/FONT][/B]<br><br>"+
        "[I][B][FONT=georgia][COLOR=#FFFFFF]В вашей жалобе отсутствует /time[/FONT] <br><br>"+
                "[I][B][FONT=georgia][COLOR=#FFFFFF]Отказано[/COLOR][/FONT]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
     {
      title: 'Подобная жалоба (ответ не был дан)',
      content:
		  "[I][B][FONT=georgia][COLOR=#7CFC00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/FONT][/B]<br><br>"+
        "[I][B][FONT=georgia][COLOR=#FFFFFF]Ожидайте ответа в подобной жалобе. Не создавайте темы-дубликаты, иначе Вы можете получить блокировку форумного аккаунта.[/COLOR][/FONT] <br><br>"+
                "[I][B][FONT=georgia][COLOR=#FFFFFF]Отказано[/COLOR][/FONT]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
         {
      title: 'Подобная жалоба (ответ был дан)',
      content:
		  "[I][B][FONT=georgia][COLOR=#7CFC00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/FONT][/B]<br><br>"+
        "[I][B][FONT=georgia][COLOR=#FFFFFF]Ответ был дан в подобной жалобе, не создавайте темы-дубликаты, иначе Вы можете получить блокировку форумного аккаунта.[/COLOR][/FONT] <br><br>"+
                "[I][B][FONT=georgia][COLOR=#FFFFFF]Отказано[/COLOR][/FONT]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
     title: '♥Педача жалобы ♥                                   . ', 
    },
    {
      title: 'В жалобы на тех.спецов',
      content:
		  "[I][B][FONT=georgia][COLOR=#7CFC00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/FONT][/B]<br><br>"+
        "[I][B][FONT=georgia][COLOR=#FFFFFF]Обратитесь в раздел жалоб на тех. специалистов.[/COLOR][/FONT] <br><br>"+
                "[I][B][FONT=georgia][COLOR=#FFFFFF]Закрыто[/COLOR][/FONT]<br><br>",
      prefix: CLOSE_PREFIX,
      status: false,
    },
        {
      title: 'В жалобы на игроков',
      content:
	  "[I][B][FONT=georgia][COLOR=#7CFC00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/FONT][/B]<br><br>"+
        "[I][B][FONT=georgia][COLOR=#FFFFFF]Обратитесь в раздел жалоб на игроков.[/COLOR][/FONT] <br><br>"+
                "[I][B][FONT=georgia][COLOR=#FFFFFF]Закрыто[/COLOR][/FONT]<br><br>",
      prefix: CLOSE_PREFIX,
      status: false,
             },
        {
      title: 'В жалобы на адм',
      content:
	  "[I][B][FONT=georgia][COLOR=#7CFC00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/FONT][/B]<br><br>"+
        "[I][B][FONT=georgia][COLOR=#FFFFFF]Обратитесь в раздел жалоб на администрацию.[/COLOR][/FONT] <br><br>"+
                "[I][B][FONT=georgia][COLOR=#FFFFFF]Закрыто[/COLOR][/FONT]<br><br>",
      prefix: CLOSE_PREFIX,
      status: false,
},
 
];
 
	$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
	// Добавление кнопок при загрузке страницы
	addButton('~На рассмотрении~', 'pin');
	addButton('~Отказано~', 'unaccept');
	addButton('~Одобрено~', 'accepted');
	addButton('~Теху~', 'Texy');
    addButton('~Закрыто~', 'Zakrito');
    addButton('~Ожидание~', 'Ojidanie');
 	addButton('~Ответы~', 'selectAnswer');
 
	// Поиск информации о теме
	const threadData = getThreadData();
 
	$('button#unaccept').click(() => editThreadData(UNACCСEPT_PREFIX, false));
	$('button#pin').click(() => editThreadData(PINN_PREFIX, true));
	$('button#accepted').click(() => editThreadData(ACCСEPT_PREFIX, false));
    $('button#Texy').click(() => editThreadData(TEXY_PREFIX, false));
    $('button#Zakrito').click(() => editThreadData(UNACCСEPT_PREFIX, false));
    $('button#Zakrito').click(() => editThreadData(UNACCСEPT_PREFIX, false));
    $('button#Realizovano').click(() => editThreadData(REALIZOVANO_PREFIX, false));
    $('button#Vajno').click(() => editThreadData(VAJNO_PREFIX, false));
    $('button#Rassmotreno').click(() => editThreadData(RASSMOTRENO_PREFIX, false));
    $('button#Ojidanie').click(() => editThreadData(OJIDANIE_PREFIX, false));
    $('button#Prefiks').click(() => editThreadData(PREFIKS, false));
 
 
 
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
 
	function editThreadData(prefix, pin = false) {
	// Получаем заголовок темы, так как он необходим при запросе
	const threadTitle = $('.p-title-value')[0].lastChild.textContent;
 
	if (pin == false) {
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
	if (pin == true) {
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
	})();// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://forum.blackrussia.online/threads/%D1%82%D0%B5%D1%81%D1%82.6285985/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=blackrussia.online
// @grant        none
// ==/UserScript==
 
(function() {
    'use strict';
 
    // Your code here...
})();// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      2024-02-29
// @description  try to take over the world!
// @author       You
// @match        https://vk.com/im?peers=c83_258668852_c84_c18_c94_-168455409_844402903_c93_555738638_815106505_c59_c20_c17
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vk.com
// @grant        none
// ==/UserScript==
 
(function() {
    'use strict';
 
    // Your code here...
})();