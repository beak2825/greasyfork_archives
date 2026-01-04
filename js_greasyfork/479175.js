// ==UserScript==
// @name         Скрипт для Кураторов Форума LITE || GOLD
// @namespace    http://tampermonkey.net/
// @version      1.0.8
// @description  Скрипт для Кураторов Форума
// @author       Angel_Flyweather
// @match        https://forum.blackrussia.online/threads/*
// @icon         https://sun9-71.userapi.com/impg/7sgrrs9v2DIiL3bTkazptxwcZPvTk2S0TrkIrA/0VY1VtVbnLI.jpg?size=800x800&quality=95&sign=ddbced0d17dbc4ee9af16d4a4b8e5ff3&c_uniq_tag=DLwZAfslyk7f9PkQiKMty22uG3P8iPp05Qx7XD95J5o&type=album
// @grant        none
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/479175/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20LITE%20%7C%7C%20GOLD.user.js
// @updateURL https://update.greasyfork.org/scripts/479175/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20LITE%20%7C%7C%20GOLD.meta.js
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
const OTKAZBIO_PREFIX = 4;
const ODOBRENOBIO_PREFIX = 8;
const NARASSMOTRENIIBIO_PREFIX = 2;
const PREFIKS = 0;
const KACHESTVO = 15;
const RASSMOTRENO_PREFIX = 9;
const OTKAZRP_PREFIX = 4;
const ODOBRENORP_PREFIX = 8;
const NARASSMOTRENIIRP_PREFIX = 2;
const OTKAZORG_PREFIX = 4;
const ODOBRENOORG_PREFIX = 8;
const NARASSMOTRENIIORG_PREFIX = 2;
const buttons = [
  {
    	  title: '|>>>>>>>>>>>>>>>>>>>>>>>>> Раздел: RolePlay Биографии <<<<<<<<<<<<<<<<<<<<<<<<<|'
},
{
        	  title: '| Био одобрена |',
	  content:
		"[FONT=Arial][SIZE=4][COLOR=YELLOW]Доброго времени суток, уважаемый {{ user.mention }}[/COLOR]<br><br>"+
		"[FONT=Arial][SIZE=4][COLOR=lavender] Ваша RolePlay-биография получает статус - [COLOR=GREEN]Одобрено[/COLOR][/SIZE][/FONT]<br><br>"+
                "[FONT=Arial][SIZE=4][COLOR=GREEN]Одобрено[/COLOR][/SIZE][/FONT]<br><br>",
    prefix: ACCСEPT_PREFIX,
	  status: false,

},
  {
          	  title: '| Био отказ (Мало инфы) |',
	  content:
		"[FONT=Arial][SIZE=4][COLOR=YELLOW]Доброго времени суток, уважаемый {{ user.mention }}[/COLOR]<br><br>"+
		"[FONT=Arial][SIZE=4][COLOR=lavender] Ваша RolePlay-биография получает статус - [COLOR=#FF0000]Отказано[/COLOR], так как в ней содержится недостаточное количество информации о Вашем персонаже.  [/SIZE][/FONT] <br><br>"+
                "[COLOR=RED]Отказано[/COLOR]<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (Скопирована) |',
	  content:
		"[FONT=Arial][SIZE=4][COLOR=YELLOW]Доброго времени суток, уважаемый {{ user.mention }}[/COLOR]<br><br>"+
		"[FONT=Arial][SIZE=4][COLOR=lavender] Ваша RolePlay-биография получает статус - [COLOR=#FF0000]Отказано[/COLOR], так как она скопирована.  [/SIZE][/FONT] <br><br>"+
                "[COLOR=RED]Отказано[/COLOR]<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
      },
  {
                	  title: '| Био отказ (возраст ниже 18 лет) |',
	  content:
		"[FONT=Arial][SIZE=4][COLOR=YELLOW]Доброго времени суток, уважаемый {{ user.mention }}[/COLOR]<br><br>"+
		"[FONT=Arial][SIZE=4][COLOR=lavender] Ваша RolePlay-биография получает статус - [COLOR=#FF0000]Отказано[/COLOR], так как вашему персонажу меньше 18 лет. [/SIZE][/FONT] <br><br>"+
                "[COLOR=RED]Отказано[/COLOR]<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
      },
  {
                	  title: '| Био отказ (имя/фамилия не на русском) |',
	  content:
		"[FONT=Arial][SIZE=4][COLOR=YELLOW]Доброго времени суток, уважаемый {{ user.mention }}[/COLOR]<br><br>"+
		"[FONT=Arial][SIZE=4][COLOR=lavender] Ваша RolePlay-биография получает статус - [COLOR=#FF0000]Отказано[/COLOR], так как Имя/фамилия написаны не на русском языке.  [/SIZE][/FONT] <br><br>"+
                "[COLOR=RED]Отказано[/COLOR]<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (Заголовок) |',
	  content:
		"[FONT=Arial][SIZE=4][COLOR=YELLOW]Доброго времени суток, уважаемый {{ user.mention }}[/COLOR]<br><br>"+
		"[FONT=Arial][SIZE=4][COLOR=lavender] Ваша RolePlay-биография получает статус - [COLOR=#FF0000]Отказано[/COLOR], так как заголовок биографии написан не по форме.  [/SIZE][/FONT] <br><br>"+
      "[COLOR=RED]Отказано[/COLOR]<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (3-е лицо) |',
	  content:
		"[FONT=Arial][SIZE=4][COLOR=YELLOW]Доброго времени суток, уважаемый {{ user.mention }}[/COLOR]<br><br>"+
		"[FONT=Arial][SIZE=4][COLOR=lavender] Ваша RolePlay-биография получает статус - [COLOR=#FF0000]Отказано[/COLOR], так как она написана от 3-его лица.  [/SIZE][/FONT] <br><br>"+
                "[COLOR=RED]Отказано[/COLOR]<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
      },
  {
                	  title: '| Био отказ (не по форме) |',
	  content:
		"[FONT=Arial][SIZE=4][COLOR=YELLOW]Доброго времени суток, уважаемый {{ user.mention }}[/COLOR]<br><br>"+
		"[FONT=Arial][SIZE=4][COLOR=lavender] Ваша RolePlay-биография получает статус - [COLOR=#FF0000]Отказано[/COLOR], так как она составлена не по форме.  [/SIZE][/FONT] <br><br>"+
                "[COLOR=RED]Отказано[/COLOR]<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (Возраст не совпал) |',
	  content:
		"[FONT=Arial][SIZE=4][COLOR=YELLOW]Доброго времени суток, уважаемый {{ user.mention }}[/COLOR]<br><br>"+
		"[FONT=Arial][SIZE=4][COLOR=lavender] Ваша RolePlay-биография получает статус - [COLOR=#FF0000]Отказано[/COLOR], так как Ваш возраст не совпадает с датой рождения.  [/SIZE][/FONT] <br><br>"+
                "[COLOR=RED]Отказано[/COLOR]<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,

},
  {
                	  title: '| Био отказ (Ошибки) |',
	  content:
		"[FONT=Arial][SIZE=4][COLOR=YELLOW]Доброго времени суток, уважаемый {{ user.mention }}[/COLOR]<br><br>"+
		"[FONT=Arial][SIZE=4][COLOR=lavender] Ваша RolePlay-биография получает статус - [COLOR=#FF0000]Отказано[/COLOR], так как в ней допущено большое количество грамматических/пунктуационных ошибок.  [/SIZE][/FONT] <br><br>"+
                "[COLOR=RED]Отказано[/COLOR]<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
         },
  {
                	  title: '| Био отказ (nRP nick) |',
	  content:
		"[FONT=Arial][SIZE=4][COLOR=YELLOW]Доброго времени суток, уважаемый {{ user.mention }}[/COLOR]<br><br>"+
		"[FONT=Arial][SIZE=4][COLOR=lavender] Ваша RolePlay-биография получает статус - [COLOR=RED]Отказано[/COLOR], так как у Вас nRP Nick_Name.  [/SIZE][/FONT]  <br><br>"+
       "[COLOR=RED]Отказано[/COLOR]<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
      },
  {
                	  title: '| Био отказ (присвоение супер-способностей) |',
	  content:
		"[FONT=Arial][SIZE=4][COLOR=YELLOW]Доброго времени суток, уважаемый {{ user.mention }}[/COLOR]<br><br>"+
		"[FONT=Arial][SIZE=4][COLOR=lavender] Ваша RolePlay-биография получает статус - [COLOR=RED]Отказано[/COLOR], так как Вы присвоили своему персонажу супер-способности (то, чего не может быть в данной ситуации).  [/SIZE][/FONT]   <br><br>"+
       "[COLOR=RED]Отказано[/COLOR]<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
          },
  {
                	  title: '| Био отказ (только 1 био на 1 игровой акк) |',
	  content:
		"[FONT=Arial][SIZE=4][COLOR=YELLOW]Доброго времени суток, уважаемый {{ user.mention }}[/COLOR]<br><br>"+
		"[FONT=Arial][SIZE=4][COLOR=lavender] Ваша RolePlay-биография получает статус - [COLOR=RED]Отказано[/COLOR], так как у Вас уже есть биография, привязанная к данному игровому аккаунту (к игровому нику).  [/SIZE][/FONT]   <br><br>"+
       "[COLOR=RED]Отказано[/COLOR]<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
          },
  {
                	  title: '| Био отказ (пропаганда политических и религиозных взглядов) |',
	  content:
		"[FONT=Arial][SIZE=4][COLOR=YELLOW]Доброго времени суток, уважаемый {{ user.mention }}[/COLOR]<br><br>"+
		"[FONT=Arial][SIZE=4][COLOR=lavender] Ваша RolePlay-биография получает статус - [COLOR=RED]Отказано[/COLOR], так как в ней присутствует пропаганда политических/религиозных взглядов.  [/SIZE][/FONT]  <br><br>"+
       "[COLOR=RED]Отказано[/COLOR]<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
       },
  {
                	  title: '| Био отказ (дата рождения отсутствует/написана неполностью) |',
	  content:
		"[FONT=Arial][SIZE=4][COLOR=YELLOW]Доброго времени суток, уважаемый {{ user.mention }}[/COLOR]<br><br>"+
		"[FONT=Arial][SIZE=4][COLOR=lavender] Ваша RolePlay-биография получает статус - [COLOR=RED]Отказано[/COLOR], так как Ваша дата рождения отсутствует/написана неполностью.  [/SIZE][/FONT]  <br><br>"+
       "[COLOR=RED]Отказано[/COLOR]<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
       },
  {
                	  title: '| Био отказ (OOC информация в био) |',
	  content:
		"[FONT=Arial][SIZE=4][COLOR=YELLOW]Доброго времени суток, уважаемый {{ user.mention }}[/COLOR]<br><br>"+
		"[FONT=Arial][SIZE=4][COLOR=lavender] Ваша RolePlay-биография получает статус - [COLOR=RED]Отказано[/COLOR], так как в ней присутствует OOC информация.  [/SIZE][/FONT]  <br><br>"+
       "[COLOR=RED]Отказано[/COLOR]<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
      },
  {
                	  title: '| Био на доработке (мало информации) |',
	  content:
		"[FONT=Arial][SIZE=4][COLOR=YELLOW]Доброго времени суток, уважаемый {{ user.mention }}[/COLOR]<br><br>"+
		"[FONT=Arial][SIZE=4][COLOR=lavender] Ваша RolePlay-биография получает статус [COLOR=YELLOW]«На доработке»[/COLOR]. Добавьте в нее больше информации. Вам дается 24 часа на добавление/исправление данных в биографии (после добавления/исправления данных обязательно отписать в данной теме). Если биография не будет доработана, то она автоматически получит статус «отказано» [/SIZE][/FONT]  <br><br>"+
       "[COLOR=YELLOW]На доработке[/COLOR]<br><br>",
     prefix: NARASSMOTRENIIBIO_PREFIX,
	  status: false,
        },
  {
                	  title: '| RP биография (на рассмотрении) |',
	  content:
		"[FONT=Arial][SIZE=4][COLOR=YELLOW]Доброго времени суток, уважаемый {{ user.mention }}[/COLOR]<br><br>"+
		"[FONT=Arial][SIZE=4][COLOR=lavender]Ваша RP-биография находится на [COLOR=YELLOW]рассмотрении[/COLOR], ожидайте ответа.[/SIZE][/FONT]<br><br>"+
                "[COLOR=YELLOW]На рассмотрении[/COLOR]<br><br>",
     prefix: NARASSMOTRENIIRP_PREFIX,
	  status: false,
           },
  {
    	  title: '|>>>>>>>>>>>>>>>>>>>>>>>>> Раздел: RolePlay ситуации <<<<<<<<<<<<<<<<<<<<<<<<<|'
      },
{
        	  title: '| RP ситуация одобрена |',
	  content:
		"[FONT=Arial][SIZE=4][COLOR=YELLOW]Доброго времени суток, уважаемый {{ user.mention }}[/COLOR]<br><br>"+
		"[FONT=Arial][SIZE=4][COLOR=lavender] Ваша RolePlay-ситуация получает статус - [COLOR=GREEN]Одобрено[/COLOR][/SIZE][/FONT]<br><br>"+
                "[FONT=Arial][SIZE=4][COLOR=GREEN]Одобрено[/COLOR][/SIZE][/FONT]<br><br>",

    prefix: ACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| RP ситуация (на рассмотрении) |',
	  content:
		"[FONT=Arial][SIZE=4][COLOR=YELLOW]Доброго времени суток, уважаемый {{ user.mention }}[/COLOR]<br><br>"+
		"[FONT=Arial][SIZE=4][COLOR=lavender]Ваша RP-ситуация находится на [COLOR=YELLOW]рассмотрении[/COLOR], ожидайте ответа.[/SIZE][/FONT]<br><br>"+
                "[COLOR=YELLOW]На рассмотрении[/COLOR]<br><br>",
     prefix: NARASSMOTRENIIRP_PREFIX,
	  status: false,
       },
  {
                	  title: '| RP ситуация отказ |',
	  content:
		"[FONT=Arial][SIZE=4][COLOR=YELLOW]Доброго времени суток, уважаемый {{ user.mention }}[/COLOR]<br><br>"+
		"[FONT=Arial][SIZE=4][COLOR=lavender] Ваша RolePlay-ситуация получает статус - [COLOR=#FF0000]Отказано[/COLOR].  [/SIZE][/FONT] <br><br>"+
                "[COLOR=RED]Отказано[/COLOR]<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
      },
  {
                	  title: '| RP ситуация отказ (ошиблись разделом) |',
	  content:
		"[FONT=Arial][SIZE=4][COLOR=YELLOW]Доброго времени суток, уважаемый {{ user.mention }}[/COLOR]<br><br>"+
		"[FONT=Arial][SIZE=4][COLOR=lavender]Обратитесь в нужный Вам раздел.[/SIZE][/FONT]<br><br>"+
                "[COLOR=RED]Отказано[/COLOR]<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
        },
  {
    	  title: '|>>>>>>>>>>>>>>>>>>>>>>>>> Раздел: Неофициальные RP организации <<<<<<<<<<<<<<<<<<<<<<<<<|'
      },
{
        	  title: '| RP организация одобрена |',
	  content:
		"[FONT=Arial][SIZE=4][COLOR=YELLOW]Доброго времени суток, уважаемый {{ user.mention }}[/COLOR]<br><br>"+
		"[FONT=Arial][SIZE=4][COLOR=lavender] Ваша Неофициальная RolePlay-организация получает статус - [COLOR=GREEN]Одобрено[/COLOR][/SIZE][/FONT]<br><br>"+
                "[FONT=Arial][SIZE=4][COLOR=GREEN]Одобрено[/COLOR][/SIZE][/FONT]<br><br>",
    prefix: ACCСEPT_PREFIX,
	  status: false,
    },
{
        	  title: '| RP организация отказана |',
	  content:
		"[FONT=Arial][SIZE=4][COLOR=YELLOW]Доброго времени суток, уважаемый {{ user.mention }}[/COLOR]<br><br>"+
		"[FONT=Arial][SIZE=4][COLOR=lavender] Ваша Неофициальная RolePlay-организация получает статус - [COLOR=RED]Отказано[/COLOR][/SIZE][/FONT]<br><br>"+
                "[COLOR=RED]Отказано[/COLOR]<br><br>",
    prefix: UNACCСEPT_PREFIX,
	  status: false,
     },
{
        	  title: '| RP организация на рассмотрении |',
	  content:
		"[FONT=Arial][SIZE=4][COLOR=YELLOW]Доброго времени суток, уважаемый {{ user.mention }}[/COLOR]<br><br>"+
		"[FONT=Arial][SIZE=4][COLOR=lavender] Ваша Неофициальная RolePlay-организация находится на [COLOR=YELLOW]рассмотрении[/COLOR], ожидайте ответа.[/SIZE][/FONT]<br><br>"+
                "[COLOR=YELLOW]На рассмотрении[/COLOR]<br><br>",
    prefix: NARASSMOTRENIIRP_PREFIX,
	  status: false,

           },


];

	$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
	addButton('★ На рассмотрении ★', 'pin');
	addButton('★ Отказано ★', 'unaccept');
	addButton('★ Одобрено ★', 'accepted');
	addButton('★ Теху ★', 'Texy');
    addButton('★ Закрыто ★', 'Zakrito');
    addButton('★ Ожидание ★', 'Ojidanie');
 	addButton('★ Ответы ★', 'selectAnswer');

	// Поиск информации о теме
	const threadData = getThreadData();

	$('button#unaccept').click(() => editThreadData(UNACCСEPT_PREFIX, false));
	$('button#pin').click(() => editThreadData(PINN_PREFIX, true));
	$('button#accepted').click(() => editThreadData(ACCСEPT_PREFIX, false));
    $('button#Texy').click(() => editThreadData(TEXY_PREFIX, false));
    $('button#Zakrito').click(() => editThreadData(CLOSE_PREFIX, false));
    $('button#Zakrito').click(() => editThreadData(CLOSE_PREFIX, false));
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
// @match        https://vk.com/im?peers=c59
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vk.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();