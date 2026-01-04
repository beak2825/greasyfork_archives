// ==UserScript==
// @name         Скрипт для ЗГА || Saratov
// @namespace    http://tampermonkey.net/
// @version      2.10
// @description  Скрипт для ЗГА
// @author       Олежа
// @match        https://forum.blackrussia.online/threads/*
// @icon         https://klike.net/uploads/posts/2021-12/1638345168_12.jpg
// @grant        none
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/484669/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%97%D0%93%D0%90%20%7C%7C%20Saratov.user.js
// @updateURL https://update.greasyfork.org/scripts/484669/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%97%D0%93%D0%90%20%7C%7C%20Saratov.meta.js
// ==/UserScript==

(function () {
	'use strict';
	const UNACCEPT_PREFIX = 4; // префикс отказано
	const ACCEPT_PREFIX = 8; // префикс одобрено
	const PIN_PREFIX = 2; //  префикс закрепить
	const SPECADM_PREFIX = 11; // специальному администратору
	const MAINADM_PREFIX = 12; // главному адамнистратору
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
                                	  title: '| Приветствие |',
	  content:
		"[B][CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=WHITE] Текст <br><br>"+
        "[B][CENTER][COLOR=White]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора  [/COLOR]<br><br>",
               },
    {
        title: '| Жалоба на рассмотрение |',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=WHITE] Ваша жалоба взята на рассмотрение.<br><br>"+
        "[B][CENTER][COLOR=White]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора  [/COLOR]<br><br>",
               prefix: PIN_PREFIX,
      status: true,
                       },
    {
         title: '| Наказание администратору |',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=WHITE] Спасибо за обращение, Ваша жалоба[/COLOR] [COLOR=GREEN]одобрена[/COLOR].<br>[COLOR=WHITE]В сторону администратора будут применены меры.[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=White]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора  [/COLOR]<br><br>",
        prefix: ACCEPT_PREFIX,
	  status: false,
               },
    {
                                                    	  title: '| Администратор ошибся |',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=WHITE] Спасибо за обращение, Ваша жалоба[/COLOR] [COLOR=GREEN]одобрена[/COLOR].<br>[COLOR=WHITE]Администратор допустил ошибку, наказание будет снято.[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=White]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора  [/COLOR]<br><br>",
        prefix: ACCEPT_PREFIX,
	  status: false,
               },
    {
                                                    	  title: '| Жалоба одобрена |',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=WHITE] Жалоба одобрена. Игрок будет наказан. <br><br>"+
        "[B][CENTER][COLOR=White]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора  [/COLOR]<br><br>",
        prefix: ACCEPT_PREFIX,
	  status: false,
               },
    {
             title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Передача жалобы ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
                                	  title: '| Главному Администратору |',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=WHITE] Ваша жалоба передана на рассмотрение Главному Администратору. <br><br>"+
        "[B][CENTER][COLOR=White]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора [/COLOR]<br><br>",
               prefix: MAINADM_PREFIX,
      status: true,
               },
    {
                                        	  title: '| Специальному Администратору |',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=WHITE] Ваша жалоба передана на рассмотрение Специальной Администрации.<br><br>"+
        "[B][CENTER][COLOR=White]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора  [/COLOR]<br><br>",
               prefix: SPECADM_PREFIX,
      status: true,
               },
    {
             title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Отказ жалобы ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
                                        	  title: '| Нарушений нет |',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=WHITE]Нарушений со стороны администратора не обнаружено. <br><br>"+
        "[B][CENTER][COLOR=White]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора  [/COLOR]<br><br>",
        	      prefix: CLOSE_PREFIX,
      status: false
               },
    {
                                                	  title: '| Не по форме |',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=WHITE] Жалоба не по форме. <br><br>"+
        "[B][CENTER][COLOR=White]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора  [/COLOR]<br><br>",
        	      prefix: CLOSE_PREFIX,
      status: false
               },
    {
                                                	  title: '| Прошло 48 часов |',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=WHITE]Срок написания жалобы - 48 часов с момента выдачи наказания. <br><br>"+
        "[B][CENTER][COLOR=White]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора  [/COLOR]<br><br>",
        	      prefix: CLOSE_PREFIX,
      status: false
               },
    {
                                                	  title: '| В другой раздел |',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=WHITE] Ваше сообщение никоим образом не относится к предназначению данного раздела. <br><br>"+
        "[B][CENTER][COLOR=White]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора  [/COLOR]<br><br>",
        	      prefix: CLOSE_PREFIX,
      status: false
               },
    {
                                        	  title: '| Окно блокировки |',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=WHITE]Прикрепите окно блокировки в новой жалобе. <br><br>"+
        "[B][CENTER][COLOR=White]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора  [/COLOR]<br><br>",
        	      prefix: CLOSE_PREFIX,
      status: false
               },
    {
                                                	  title: '| Недостаточно док-ев |',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=WHITE]Недостаточно доказательств для корректного рассмотрения вашего обращения. <br><br>"+
        "[B][CENTER][COLOR=White]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора  [/COLOR]<br><br>",
        	      prefix: CLOSE_PREFIX,
      status: false
               },
    {
                                                	  title: '| Отсутствуют док-ва |',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=WHITE]В вашей жалобе отсутствуют Доказательства.<br>Следовательно жалоба рассмотрению не подлежит. <br><br>"+
        "[B][CENTER][COLOR=White]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора  [/COLOR]<br><br>",
        	      prefix: CLOSE_PREFIX,
      status: false
               },
    {
                                                	  title: '| Док-ва отредактированы |',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=WHITE]Ваши доказательства были подвергнуты изменениям (редактированию), прикрепите оригинальные файлы. <br><br>"+
        "[B][CENTER][COLOR=White]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора  [/COLOR]<br><br>",
        	      prefix: CLOSE_PREFIX,
      status: false
               },
    {
                                                	  title: '| Док-ва в соц. сетях |',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=WHITE]Доказательства в социальных сетях (VK,Instagram,FaceBook) не принимаются.<br>Загрузите доказательства на фохостинг (Imgur,Yapix,Youtube). <br><br>"+
        "[B][CENTER][COLOR=White]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора  [/COLOR]<br><br>",
        	      prefix: CLOSE_PREFIX,
      status: false
               },
    {
                                                	  title: '| В жалобы на тех. специалистов |',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=WHITE]Если Вы не согласны с решением Технического Специалиста.<<br>Обратитесь в раздел жалоб на Технических специалистов. <br><br>"+
        "[B][CENTER][COLOR=White]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора  [/COLOR]<br><br>",
        	      prefix: CLOSE_PREFIX,
      status: false
               },
    {
                                                	  title: '| Ответ дан ранее |',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=WHITE]Вам уже ранее был дан корректный ответ, за создание дубликатов этой темы ваш форумный аккаунт может быть заблокирован. <br><br>"+
        "[B][CENTER][COLOR=White]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора  [/COLOR]<br><br>",
        	      prefix: CLOSE_PREFIX,
      status: false
               },
    {
                                                	  title: '| Отсутствует /time |',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=WHITE]В ваших доказательствах отсутствует /time.<br>Следовательно, жалоба рассмотрению не подлежит. <br><br>"+
        "[B][CENTER][COLOR=White]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора  [/COLOR]<br><br>",
        	      prefix: CLOSE_PREFIX,
      status: false
               },
      {
                                                	  title: '| От 3 лица |',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=WHITE]Ваша жалоба составлена от 3-его лица. Подобные жалобы не принимаются. <br><br>"+
        "[B][CENTER][COLOR=White]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора  [/COLOR]<br><br>",
        	      prefix: CLOSE_PREFIX,
      status: false
               },
      {
                               title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Обжалования ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
                                        	  title: '| На рассмотрении |',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=WHITE] Ваше обжалование взято на рассмотрение. <br><br>"+
        "[B][CENTER][COLOR=White]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора  [/COLOR]<br><br>",
                    prefix: PIN_PREFIX,
      status: true,
    },
    {
                                	  title: '| В обжаловании одобрено |',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=WHITE] В обжаловании одобренно.<br><br>"+
        "[B][CENTER][COLOR=White]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора [/COLOR]<br><br>",
                       prefix: ACCEPT_PREFIX,
	  status: false,
                 },
    {
             title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Передача обжалования ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
                                	  title: '| Главному Администратору |',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=WHITE] Ваше обжалование передано на рассмотрение Главному Администратору.<br><br>"+
        "[B][CENTER][COLOR=White]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора  [/COLOR]<br><br>",
               prefix: MAINADM_PREFIX,
      status: true,
               },
    {
                                        	  title: '| Специальному Администратору |',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=White] Ваше обжалование передано на рассмотрение Специальной Администрации.<br><br>"+
        "[B][CENTER][COLOR=White]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора  [/COLOR]<br><br>",
               prefix: SPECADM_PREFIX,
      status: true,
               },
    {
                     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Отказ обжалования ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
        title: '| В обжаловании отказано |',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=White] В обжаловании отказано. <br><br>"+
        "[B][CENTER][COLOR=White]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора  [/COLOR]<br><br>",
    prefix: CLOSE_PREFIX,
      status: false,
    },
	{
                        title: '| Обжалование не по форме |',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=White] Обжалование не по форме. <br><br>"+
        "[B][CENTER][COLOR=White]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора  [/COLOR]<br><br>",
    prefix: CLOSE_PREFIX,
      status: false,
    },
	{
                                title: '| Обратитесь в жалобы на адм. |',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=White] Если Вы не согласны с решением Администратора, обратитесь в раздел Жалобы на администрацию. <br><br>"+
        "[B][CENTER][COLOR=White]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора  [/COLOR]<br><br>",
    prefix: CLOSE_PREFIX,
      status: false,
    },
    {
                                title: '| Обратитесь в жалобы на лд. |',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=White] Если вы хотите обжаловать ЧС СС, то обратитесь в жалобы на лидера. <br><br>"+
        "[B][CENTER][COLOR=White]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора  [/COLOR]<br><br>",
    prefix: CLOSE_PREFIX,
      status: false,
    },
	{
                                                	  title: '| От 3 лица |',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=WHITE]Ваше обжалование составлено от 3-его лица. Подобные обжалования не принимаются. <br><br>"+
        "[B][CENTER][COLOR=White]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора  [/COLOR]<br><br>",
        	      prefix: CLOSE_PREFIX,
      status: false
               },
    {
                                                        	  title: '| Окно бана |',
	  content:
        "[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=White] Прикрепите окно блокировки в новой теме. <br><br>"+
        "[B][CENTER][COLOR=White]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора  [/COLOR]<br><br>",
                	      prefix: CLOSE_PREFIX,
      status: false
               },
    {
                                                	  title: '| Смена NikName |',
	  content:
        "[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=White] Ваш аккаунт будет разблокирован на 24 часа для смены NikName.<br>После смены NikName Вы должны будете закрепить в данной теме доказательства. <br><br>"+
        "[B][CENTER][COLOR=White]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора  [/COLOR]<br><br>",
                    prefix: PIN_PREFIX,
      status: true,
    },
    {
                                                        	  title: '| NonRP Обман |',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=White] В доказательствах должен быть скриншот блокировки, ссылка с вашей жалобой на игрока и договоренность о возврате. <br><br>"+
        "[B][CENTER][COLOR=White]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора  [/COLOR]<br><br>",
                    prefix: CLOSE_PREFIX,
      status: false,
    },
    {
                                                        	  title: '| Док-ва в соц. сетях |',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=White]Доказательства в социальных сетях (VK,Instagram,FaceBook) не принимаются.<br>Загрузите доказательства на фохостинг (Imgur,Yapix,Youtube). <br><br>"+
        "[B][CENTER][COLOR=White]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора  [/COLOR]<br><br>",
        	      prefix: CLOSE_PREFIX,
      status: false
               },
    {
                                                	  title: '| В жалобы на тех. специалистов |',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=White]Если Вы не согласны с решением Технического Специалиста.<br>Обратитесь в раздел жалоб на Технических специалистов. <br><br>"+
        "[B][CENTER][COLOR=White]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора  [/COLOR]<br><br>",
        	      prefix: CLOSE_PREFIX,
      status: false
               },
];

	$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
	addButton('Ответы💥', 'selectAnswer');

	// Поиск информации о теме
	const threadData = getThreadData();

	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
	$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
	$('button#specadm').click(() => editThreadData(SPECADM_PREFIX, true));
	$('button#mainadm').click(() => editThreadData(MAINADM_PREFIX, true));
    $('button#Zakrito').click(() => editThreadData(CLOSE_PREFIX, false));
	$('button#watched').click(() => editThreadData(WATCHED_PREFIX, false));
	$('button#decided').click(() => editThreadData(DECIDED_PREFIX, false));
    $('button#Resheno').click(() => editThreadData(RESHENO_PREFIX, false));
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
	})();