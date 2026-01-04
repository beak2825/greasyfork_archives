// ==UserScript==
// @name         Скрипт для ОЗГА Jes_Malfoy || Purple
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Скрипт для ОЗГА
// @author       Руслан Сафин
// @match        https://forum.blackrussia.online/threads/*
// @icon         https://klike.net/uploads/posts/2021-12/1638345168_12.jpg
// @grant        none
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/535816/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9E%D0%97%D0%93%D0%90%20Jes_Malfoy%20%7C%7C%20Purple.user.js
// @updateURL https://update.greasyfork.org/scripts/535816/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9E%D0%97%D0%93%D0%90%20Jes_Malfoy%20%7C%7C%20Purple.meta.js
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
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>' +
		"[B][CENTER][COLOR=WHITE] Текст <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>' +
        "[B][CENTER][COLOR=White]С уважением, [/COLOR][COLOR=RED]Основной Заместитель Главного Администратора.[/COLOR]<br>",
               },
    {
        title: '| Жалоба на рассмотрение |',
	  content:
		"[B][CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>' +
        "[B][CENTER][COLOR=WHITE] Ваша жалоба взята на [/COLOR][COLOR=Yellow]рассмотрение.[/COLOR]<br>[COLOR=WHITE]Ожидайте ответа в данной теме. Не создавайте повторные темы в противном случае Вы можете получить блокировку форумного аккаунта.<br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>' +
        "[B][CENTER][COLOR=White]С уважением, [/COLOR][COLOR=RED]Основной Заместитель Главного Администратора.[/COLOR]<br>",
               prefix: PIN_PREFIX,
      status: true,
                       },
    {
         title: '| Наказание администратору |',
	  content:
		"[B][CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>' +
        "[B][CENTER][COLOR=WHITE] Спасибо за обращение, Ваша жалоба[/COLOR] [COLOR=GREEN]одобрена[/COLOR].<br>[COLOR=WHITE]В сторону администратора будут применены меры.[/COLOR]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=White]С уважением, [/COLOR][COLOR=RED]Основной Заместитель Главного Администратора.[/COLOR]<br>",
        prefix: ACCEPT_PREFIX,
	  status: false,
               },
    {
                                                    	  title: '| Администратор ошибся |',
	  content:
		"[B][CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>' +
        "[B][CENTER][COLOR=WHITE] Спасибо за обращение, Ваша жалоба[/COLOR] [COLOR=GREEN]одобрена[/COLOR].<br>[COLOR=WHITE]Администратор допустил ошибку, приносим свои извинения.[/COLOR]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=White]С уважением, [/COLOR][COLOR=RED]Основной Заместитель Главного Администратора.[/COLOR]<br>",
        prefix: ACCEPT_PREFIX,
	  status: false,
               },
    {
                                                            	  title: '| Беседа с администратором |',
	  content:
		"[B][CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=WHITE] Спасибо за обращение, Ваша жалоба[/COLOR] [COLOR=GREEN]одобрена[/COLOR].<br>[COLOR=WHITE]Администратор допустил ошибку, приносим свои извинения.<br>С Администратором будет проведена беседа.[/COLOR]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=White]С уважением, [/COLOR][COLOR=RED]Основной Заместитель Главного Администратора.[/COLOR]<br>",
        prefix: ACCEPT_PREFIX,
	  status: false,
               },
    {
             title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Передача жалобы ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
                                	  title: '| Главному Администратору |',
	  content:
		"[B][CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=WHITE] Ваша жалоба передана на [/COLOR][COLOR=Yellow]рассмотрение[/COLOR][COLOR=RED] Главному Администратору.<br>[COLOR=White]Ожидайте ответа в данной теме. Не создавайте повторные темы в противном случае Вы можете получить блокировку форумного аккаунта.<br>"+
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=White]С уважением, [/COLOR][COLOR=RED]Основной Заместитель Главного Администратора.[/COLOR]<br>",
               prefix: MAINADM_PREFIX,
      status: true,
               },
    {
                                        	  title: '| Специальному Администратору |',
	  content:
		"[B][CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=WHITE] Ваша жалоба передана на [/COLOR][COLOR=Yellow]рассмотрение[/COLOR][COLOR=RED] Специальному Администратору.<br>[COLOR=White]Ожидайте ответа в данной теме. Не создавайте повторные темы в противном случае Вы можете получить блокировку форумного аккаунта<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=White]С уважением, [/COLOR][COLOR=RED]Основной Заместитель Главного Администратора.[/COLOR]<br>",
               prefix: SPECADM_PREFIX,
      status: true,
               },
    {
                                        	  title: '| Руководителю Модераторов |',
	  content:
		"[B][CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=WHITE] Ваша жалоба передана на [/COLOR][COLOR=Yellow]рассмотрение[/COLOR][COLOR=BLUE]<br>[COLOR=White]Ожидайте ответа в данной теме. Не создавайте повторные темы в противном случае Вы можете получить блокировку форумного аккаунта.<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=White]С уважением, [/COLOR][COLOR=RED]Основной Заместитель Главного Администратора.[/COLOR]<br>",
               prefix: PIN_PREFIX,
      status: true,
    },
    {
                                        	  title: '| Техническому Администратору |',
	  content:
		"[B][CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=WHITE] Ваша жалоба передана на [/COLOR][COLOR=Yellow]рассмотрение[/COLOR][COLOR=BLUE] Техническому Администратору.[/COLOR]<br>[COLOR=WHITE]Ожидайте ответа в данной теме. Не создавайте повторные темы в противном случае Вы можете получить блокировку форумного аккаунта.<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=White]С уважением, [/COLOR][COLOR=RED]Основной Заместитель Главного Администратора.[/COLOR]<br>",
               prefix: TEXY_PREFIX,
      status: true,
        },
    {
             title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Отказ жалобы ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
                                                	  title: '| Репорт |',
	  content:
		"[B][CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=WHITE]Когда Вы обращаетесь в /report>>1, причина должна быть расписана четко и понятно для администратора.<br> Жалобы по типу: SOS, Хелп, помогите не рассматриваются.  <br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=White]С уважением, [/COLOR][COLOR=RED]Основной Заместитель Главного Администратора.[/COLOR]<br>",
        	      prefix: CLOSE_PREFIX,
      status: false
               },
    {
                                        	  title: '| Нарушений нет |',
	  content:
		"[B][CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=WHITE]Нарушений со стороны администратора не обнаружено. <br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=White]С уважением, [/COLOR][COLOR=RED]Основной Заместитель Главного Администратора.[/COLOR]<br>",
        	      prefix: CLOSE_PREFIX,
      status: false
               },
    {
                                                	  title: '| Администратор прав |',
	  content:
		"[B][CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=WHITE]Администратор вынес правильный вердикт. <br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=White]С уважением, [/COLOR][COLOR=RED]Основной Заместитель Главного Администратора.[/COLOR]<br>",
        	      prefix: CLOSE_PREFIX,
      status: false
               },
    {
                                                	  title: '| Док-ва предоставлены |',
	  content:
		"[B][CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=WHITE]Доказательства были предоставлены, вердикт администратора является верным. <br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=White]С уважением, [/COLOR][COLOR=RED]Основной Заместитель Главного Администратора.[/COLOR]<br>",
        	      prefix: CLOSE_PREFIX,
      status: false
               },
    {
                                                	  title: '| Не по форме |',
	  content:
		"[B][CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=WHITE]К сожалению, вам отказано, Вы допустили ошибку в правилах подачи жалобы.<br>Прочитайте внимательно эту тему:<br>[URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.3429349/']Важно - Правила подачи жалобы.[/URL]<br>Прежде чем написать жалобу. <br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=White]С уважением, [/COLOR][COLOR=RED]Основной Заместитель Главного Администратора.[/COLOR]<br>",
        	      prefix: CLOSE_PREFIX,
      status: false
               },
    {
                                                	  title: '| Обратитесь в обжалования |',
	  content:
		"[B][CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=WHITE]Вы ошиблись разделом.<br>Обратитесь в раздел обжалований наказаний. <br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=White]С уважением, [/COLOR][COLOR=RED]Основной Заместитель Главного Администратора.[/COLOR]<br>",
        	      prefix: CLOSE_PREFIX,
      status: false
               },
    {
                                                	  title: '| Прошло 48 часов |',
	  content:
		"[B][CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=WHITE]Срок написания жалобы - 48 часов с момента выдачи наказания. <br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=White]С уважением, [/COLOR][COLOR=RED]Основной Заместитель Главного Администратора.[/COLOR]<br>",
        	      prefix: CLOSE_PREFIX,
      status: false
               },
    {
                                                	  title: '| В другой раздел |',
	  content:
		"[B][CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=WHITE] Ваше сообщение никоим образом не относится к предназначению данного раздела. <br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=White]С уважением, [/COLOR][COLOR=RED]Основной Заместитель Главного Администратора.[/COLOR]<br>",
        	      prefix: CLOSE_PREFIX,
      status: false
               },
    {
                                                	  title: '| Недостаточно док-ев |',
	  content:
		"[B][CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=WHITE]Недостаточно доказательств для корректного рассмотрения вашего обращения. <br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=White]С уважением, [/COLOR][COLOR=RED]Основной Заместитель Главного Администратора.[/COLOR]<br>",
        	      prefix: CLOSE_PREFIX,
      status: false
               },
    {
                                                	  title: '| Отсутствуют док-ва |',
	  content:
		"[B][CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=WHITE]В вашей жалобе отсутствуют Доказательства.<br>Следовательно жалоба рассмотрению не подлежит. <br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=White]С уважением, [/COLOR][COLOR=RED]Основной Заместитель Главного Администратора.[/COLOR]<br>",
        	      prefix: CLOSE_PREFIX,
      status: false
               },
    {
                                                	  title: '| Требуется фрапс |',
	  content:
		"[B][CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=WHITE]Недостаточно доказательств для корректного рассмотрения жалобы.<br>В данном случае требуются видео - доказательства. <br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=White]С уважением, [/COLOR][COLOR=RED]Основной Заместитель Главного Администратора.[/COLOR]<br>",
        	      prefix: CLOSE_PREFIX,
      status: false
               },
    {
                                                	  title: '| Док-ва отредактированы |',
	  content:
		"[B][CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=WHITE]Ваши доказательства были подвергнуты изменениям (редактированию), прикрепите оригинальные файлы. <br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=White]С уважением, [/COLOR][COLOR=RED]Основной Заместитель Главного Администратора.[/COLOR]<br>",
        	      prefix: CLOSE_PREFIX,
      status: false
               },
    {
                                                	  title: '| Док-ва в соц. сетях |',
	  content:
		"[B][CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=WHITE]Доказательства в социальных сетях (VK,Instagram,FaceBook) не принимаются.<br>Загрузите доказательства на фохостинг (Imgur,Yapix,Youtube). <br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=White]С уважением, [/COLOR][COLOR=RED]Основной Заместитель Главного Администратора.[/COLOR]<br>",
        	      prefix: CLOSE_PREFIX,
      status: false
               },
    {
                                                	  title: '| В жалобы на тех. специалистов |',
	  content:
		"[B][CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=WHITE]Если Вы не согласны с решением Технического Специалиста.<br>Обратитесь в раздел жалоб на Технических специалистов. <br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=White]С уважением, [/COLOR][COLOR=RED]Основной Заместитель Главного Администратора.[/COLOR]<br>",
        	      prefix: CLOSE_PREFIX,
      status: false
               },
    {
                                                	  title: '| Ответ дан ранее |',
	  content:
		"[B][CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=WHITE]Вам уже ранее был дан корректный ответ, за создание дубликатов этой темы ваш форумный аккаунт может быть заблокирован. <br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=White]С уважением, [/COLOR][COLOR=RED]Основной Заместитель Главного Администратора.[/COLOR]<br>",
        	      prefix: CLOSE_PREFIX,
      status: false
               },
    {
                                                	  title: '| Отсутствует /time |',
	  content:
		"[B][CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=WHITE]В ваших доказательствах отсутствует /time.<br>Следовательно, жалоба рассмотрению не подлежит. <br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=White]С уважением, [/COLOR][COLOR=RED]Основной Заместитель Главного Администратора.[/COLOR]<br>",
        	      prefix: CLOSE_PREFIX,
      status: false
               },
    {
                                                	  title: '| Ошиблись сервером |',
	  content:
		"[B][CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=WHITE]Вы ошиблись сервером, напишите жалобу на администратора на форуме Вашего сервера. <br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=White]С уважением, [/COLOR][COLOR=RED]Основной Заместитель Главного Администратора.[/COLOR]<br>",
        	      prefix: CLOSE_PREFIX,
      status: false
               },
    {
                                                	  title: '| Рассмотрение в VK |',
	  content:
		"[B][CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=WHITE]Дальнейшее рассмотрение жалобы будет в ЛС ВКонтакте.<br>Просьба отписать мне в Личные сообщения VK для дальнейшего рассмотрения темы [URL='https://vk.com/77oleinik77']Вконтакте[/URL]. <br>"+
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=White]С уважением, [/COLOR][COLOR=RED]Основной Заместитель Главного Администратора.[/COLOR]<br>",
        	      prefix: CLOSE_PREFIX,
      status: false
               },
    {
                     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Кураторы Форума ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
                                                        	  title: '| Куратор Форума дал верный вердикт |',
	  content:
		"[B][CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=WHITE]Куратор Форума вынес правильный вердикт в Жалобе/Биографии. <br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=White]С уважением, [/COLOR][COLOR=RED]Основной Заместитель Главного Администратора.[/COLOR]<br>",
        	      prefix: CLOSE_PREFIX,
      status: false
               },
    {
                                                                    	  title: '| Куратор Форума ошибся |',
	  content:
		"[B][CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=WHITE] Спасибо за обращение, Ваша жалоба[/COLOR] [COLOR=GREEN]одобрена[/COLOR].<br>[COLOR=RED]Куратор Форума допустил ошибку приносим свои извинения.[/COLOR]<br>"+
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=White]С уважением, [/COLOR][COLOR=RED]Основной Заместитель Главного Администратора.[/COLOR]<br>",
        	     prefix: ACCEPT_PREFIX,
	  status: false,
               },
    {
                                                	  title: '| Пересмотрена ГКФ-ом |',
	  content:
		"[B][CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=WHITE]Жалоба будет пересмотрена [/COLOR][COLOR=BLUE]Главным Куратором Форума. <br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=White]С уважением, [/COLOR][COLOR=RED]Основной Заместитель Главного Администратора.[/COLOR]<br>",
        	      prefix: CLOSE_PREFIX,
      status: false
               },
    {
                             title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Кураторы Форума ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
                                                	  title: '| Игрок будет наказан |',
	  content:
		"[B][CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=WHITE]Спасибо за обращение, Ваша жалоба[/COLOR][COLOR=GREEN] одобрена[/COLOR].<br>[COLOR=WHITE]Игрок получит соответствующие наказание.[/COLOR]  <br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=White]С уважением, [/COLOR][COLOR=RED]Основной Заместитель Главного Администратора.[/COLOR]<br>",
    	     prefix: ACCEPT_PREFIX,
	  status: false,
               },
    {
                                                	  title: '| Нарушений от игрока нет |',
	  content:
		"[B][CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=WHITE]После рассмотрения вашей жалобы.<br>Нарушений со стороны игрока не было найдено. <br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=White]С уважением, [/COLOR][COLOR=RED]Основной Заместитель Главного Администратора.[/COLOR]<br>",
        	      prefix: CLOSE_PREFIX,
      status: false
               },
    {
                                                        	  title: '| Док-ва подделаны |',
	  content:
		"[B][CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=WHITE]После проверки было выявлено, что ваши доказательства фейковые, Ваш форумный и игровой аккаунты будут заблокированы навсегда. <br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=White]С уважением, [/COLOR][COLOR=RED]Основной Заместитель Главного Администратора.[/COLOR]<br>",
        	      prefix: CLOSE_PREFIX,
      status: false
               },
    {
                                                                	  title: '| Ссылку |',
	  content:
		"[B][CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=WHITE]Предоставьте пожалуйста ссылку на жалобу/биографию. <br>"+
                        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=White]С уважением, [/COLOR][COLOR=RED]Основной Заместитель Главного Администратора.[/COLOR]<br>",
        	      prefix: CLOSE_PREFIX,
      status: false
               },
    {
                                                        	  title: '| Не по форме |',
	  content:
		"[B][CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=WHITE]К сожалению, вам отказано, Вы допустили ошибку в правилах подачи жалобы.<br>Прочитайте внимательно эту тему:<br>[URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/']Важно - Правила подачи жалобы.[/URL]<br>Прежде чем написать жалобу. <br>"+
                        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=White]С уважением, [/COLOR][COLOR=RED]Основной Заместитель Главного Администратора.[/COLOR]<br>",
        	      prefix: CLOSE_PREFIX,
      status: false
               },
    {
                                                        	  title: '| Прошло 72 часа |',
	  content:
		"[B][CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=WHITE]Срок написания жалобы - 72 часа с момента нарушения игрока.<br>Прочитайте внимательно эту тему:<br>[URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/']Важно - Правила подачи жалобы.[/URL]<br>Прежде чем написать жалобу. <br>"+
                        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=White]С уважением, [/COLOR][COLOR=RED]Основной Заместитель Главного Администратора.[/COLOR]<br>",
        	      prefix: CLOSE_PREFIX,
      status: false
               },
    {
                                                	  title: '| Нет нарушений (Логи) |',
	  content:
		"[B][CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=WHITE]После проверки Логирования нарушений со стороны игрока не было найдено. <br>"+
                        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=White]С уважением, [/COLOR][COLOR=RED]Основной Заместитель Главного Администратора.[/COLOR]<br>",
        	      prefix: CLOSE_PREFIX,
      status: false
            },
    {
                                                	  title: '| Куратору Тех. Специалистов |',
	  content:
		"[B][CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=WHITE] Ваша жалоба передана на [/COLOR][COLOR=Yellow]рассмотрение[/COLOR][COLOR=BLUE] Куратору Технических Специалистов.[/COLOR]<br>[COLOR=WHITE]Ожидайте ответа в данной теме. Не создавайте повторные темы в противном случае Вы можете получить блокировку форумного аккаунта.<br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=White]С уважением, [/COLOR][COLOR=RED]Основной Заместитель Главного Администратора.[/COLOR]<br>",
               prefix: TEXY_PREFIX,
      status: true,
               },
    {
                                     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Кураторы Форума ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
                                                        	  title: '| Биография одобрена |',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=WHITE]Ваша Биография получает статус -[/COLOR][COLOR=GREEN] одобрена[/COLOR].<br>[COLOR=WHITE]Приятной игры на нашем сервере.[/COLOR]  <br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=White]С уважением, [/COLOR][COLOR=RED]Основной Заместитель Главного Администратора.[/COLOR]<br>",
    	     prefix: ACCEPT_PREFIX,
	  status: false,
            },
    {
                                                        	  title: '| Биография не по форме |',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=WHITE]Ваша Биография получает статус -[/COLOR][COLOR=RED] отказана[/COLOR].<br>[COLOR=WHITE]Вы допустили ошибку в правилах подачи Биографии.<br>Прочитайте внимательно эту тему:<br>[URL='https://forum.blackrussia.online/index.php?threads/purple-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9.4887982/']Важно - Правила подачи биографии.[/URL]<br>Прежде чем написать Биографию.[/COLOR]  <br>"+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=White]С уважением, [/COLOR][COLOR=RED]Основной Заместитель Главного Администратора.[/COLOR]<br>",
     prefix: UNACCEPT_PREFIX,
	  status: false,
                    },
    {
                                                        	  title: '| Биография не дополнена |',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=WHITE]Ваша Биография получает статус -[/COLOR][COLOR=RED] отказана[/COLOR].<br>[COLOR=WHITE]В вашей Биографии недостаточно RolePlay информации о Вашем RP персонаже.[/COLOR]  <br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=White]С уважением, [/COLOR][COLOR=RED]Основной Заместитель Главного Администратора.[/COLOR]<br>",
     prefix: UNACCEPT_PREFIX,
	  status: false,
                            },
    {
                                                        	  title: '| Биография много ошибок |',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=WHITE]Ваша Биография получает статус -[/COLOR][COLOR=RED] отказана[/COLOR].<br>[COLOR=WHITE]В вашей Биографии недопустимое количество орфографических ошибок.[/COLOR]  <br>"+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=White]С уважением, [/COLOR][COLOR=RED]Основной Заместитель Главного Администратора.[/COLOR]<br>",
     prefix: UNACCEPT_PREFIX,
	  status: false,
               },
      {
                               title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Обжалования ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
                                        	  title: '| На рассмотрении |',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=WHITE] Ваше обжалование взято на [/COLOR][COLOR=Yellow]рассмотрение.[/COLOR]<br>[COLOR=WHITE]Ожидайте ответа в данной теме. Не создавайте повторные темы в противном случае Вы можете получить блокировку форумного аккаунта. <br>"+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=White]С уважением, [/COLOR][COLOR=RED]Основной Заместитель Главного Администратора.[/COLOR]<br>",
                    prefix: PIN_PREFIX,
      status: true,
    },
    {
                                	  title: '| Наказание полностью снято |',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=WHITE] После рассмотрения темы было принято решение о снятии вашего наказания полностью.<br>Наказание будет снято в течении 24 часов. <br>"+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=White]С уважением, [/COLOR][COLOR=RED]Основной Заместитель Главного Администратора.[/COLOR]<br>",
                       prefix: ACCEPT_PREFIX,
	  status: false,
                 },
    {
                                	  title: '| Наказание сокращено |',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=WHITE] После рассмотрения темы было принято решение о сокарщении вашего наказания полностью.<br>Наказание будет заменено в течении 24 часов. <br>"+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=White]С уважением, [/COLOR][COLOR=RED]Основной Заместитель Главного Администратора.[/COLOR]<br>",
                       prefix: ACCEPT_PREFIX,
	  status: false,
                           },
    {
             title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Передача обжалования ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
                                	  title: '| Главному Администратору |',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=WHITE] Ваше обжалование передано на [/COLOR][COLOR=Yellow]рассмотрение[/COLOR][COLOR=RED] Главному Администратору<br>[COLOR=WHITE]Ожидайте ответа в данной теме. Не создавайте повторные темы в противном случае Вы можете получить блокировку форумного аккаунта.<br>"+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=White]С уважением, [/COLOR][COLOR=RED]Основной Заместитель Главного Администратора.[/COLOR]<br>",
               prefix: MAINADM_PREFIX,
      status: true,
               },
    {
                                        	  title: '| Специальному Администратору |',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=White] Ваше обжалование передано на [/COLOR][COLOR=Yellow]рассмотрение[/COLOR][COLOR=RED] Специальному Администратору.<br>[COLOR=WHITE]Ожидайте ответа в данной теме. Не создавайте повторные темы в противном случае Вы можете получить блокировку форумного аккаунта<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=White]С уважением, [/COLOR][COLOR=RED]Основной Заместитель Главного Администратора.[/COLOR]<br>",
               prefix: SPECADM_PREFIX,
      status: true,
               },
    {
                                        	  title: '| Руководителю Модераторов |',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=White] Ваше обжалование передано на [/COLOR][COLOR=Yellow]рассмотрение[/COLOR][COLOR=BLUE]<br>[COLOR=WHITE]Ожидайте ответа в данной теме. Не создавайте повторные темы в противном случае Вы можете получить блокировку форумного аккаунта.<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=White]С уважением, [/COLOR][COLOR=RED]Основной Заместитель Главного Администратора.[/COLOR]<br>",
               prefix: PIN_PREFIX,
      status: true,
    },
    {
                                        	  title: '| В ЖБ АДМ |',
	  content:
		"[B][CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=WHITE] Переношу Вашу тему в раздел Жалоб на Администрацию. Ожидайте ответа в данной теме. Не создавайте повторные темы, в противном случае Вы можете получить блокировку форумного аккаунта.<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=White]С уважением, [/COLOR][COLOR=RED]Основной Заместитель Главного Администратора.[/COLOR]<br>",
               prefix: OJIDANIE_PREFIX,
      status: false,
               },
    {
                                        	  title: '| Перенос в др разд |',
	  content:
		"[B][CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=WHITE] Переношу Вашу тему в необходимый раздел. Ожидайте ответа в данной теме. Не создавайте повторные темы, в противном случае Вы можете получить блокировку форумного аккаунта.<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=White]С уважением, [/COLOR][COLOR=RED]Основной Заместитель Главного Администратора.[/COLOR]<br>",
               prefix: OJIDANIE_PREFIX,
      status: false,
               },
    {
                     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Отказ обжалования ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
        title: '| В обжаловании отказано |',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=White] После рассмотрения темы было принято решение не сокращать Вам наказание. <br>"+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=White]С уважением, [/COLOR][COLOR=RED]Основной Заместитель Главного Администратора.[/COLOR]<br>",
    prefix: CLOSE_PREFIX,
      status: false,
    },
	{
                title: '| Обжалованию не подлежит |',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=White] После рассмотрения темы было выяснено, что ваше наказание обжалованию не подлежит.<br>Не создавайте повторные темы в противном случае Вы можете получить блокировку форумного аккаунта.<br>Прочитайте внимательно эту тему:<br>[URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B7%D0%B0%D1%8F%D0%B2%D0%BA%D0%B8-%D0%BD%D0%B0-%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F.3429398/']Важно - Правила подачи обжалования.[/URL]<br>Прежде чем написать обжалование. <br>"+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=White]С уважением, [/COLOR][COLOR=RED]Основной Заместитель Главного Администратора.[/COLOR]<br>",
    prefix: CLOSE_PREFIX,
      status: false,
    },
	{
                        title: '| Обжалование не по форме |',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=White] К сожалению, вам отказано, Вы допустили ошибку в правилах подачи обжалования.<br>Прочитайте внимательно эту тему:<br>[URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B7%D0%B0%D1%8F%D0%B2%D0%BA%D0%B8-%D0%BD%D0%B0-%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F.3429398/']Важно - Правила подачи обжалования.[/URL]<br>Прежде чем написать обжалование. <br>"+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=White]С уважением, [/COLOR][COLOR=RED]Основной Заместитель Главного Администратора.[/COLOR]<br>",
    prefix: CLOSE_PREFIX,
      status: false,
    },
	{
                                title: '| Обратитесь в жалобы на адм. |',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=White] Если Вы не согласны с решением Администратора, обратитесь в раздел Жалобы на администрацию. <br>"+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=White]С уважением, [/COLOR][COLOR=RED]Основной Заместитель Главного Администратора.[/COLOR]<br>",
    prefix: CLOSE_PREFIX,
      status: false,
    },
	{
                                                        	  title: '| В другой раздел |',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=White] Ваше сообщение никоим образом не относится к предназначению данного раздела. <br>"+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=White]С уважением, [/COLOR][COLOR=RED]Основной Заместитель Главного Администратора.[/COLOR]<br>",
        	      prefix: CLOSE_PREFIX,
      status: false
               },
    {
                                                        	  title: '| Окно бана |',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=White] Прикрепите в следующей теме пожалуйста окно бана. <br>"+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=White]С уважением, [/COLOR][COLOR=RED]Основной Заместитель Главного Администратора.[/COLOR]<br>",
                	      prefix: CLOSE_PREFIX,
      status: false
               },
    {
                                                	  title: '| Недостаточно док-ев |',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=White]Недостаточно доказательств для корректного [/COLOR][COLOR=Yellow]рассмотрения[/COLOR][COLOR=RED] вашего обращения. <br>"+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=White]С уважением, [/COLOR][COLOR=RED]Основной Заместитель Главного Администратора.[/COLOR]<br>",
        	      prefix: CLOSE_PREFIX,
      status: false
               },
    {
                                                	  title: '| Отсутствуют док-ва |',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=White]В вашем обжаловании отсутствуют Доказательства.<br>Следовательно обжалование [/COLOR][COLOR=Yellow]рассмотрению[/COLOR][COLOR=RED] не подлежит. <br>"+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=White]С уважением, [/COLOR][COLOR=RED]Основной Заместитель Главного Администратора.[/COLOR]<br>",
        	      prefix: CLOSE_PREFIX,
      status: false
               },
    {
                                                	  title: '| Смена NikName |',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=White] Ваш аккаунт будет разблокирован на 24 часа для смены NikName.<br>После смены NikName Вы должны будете закрепить в данной теме доказательства. <br>"+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=White]С уважением, [/COLOR][COLOR=RED]Основной Заместитель Главного Администратора.[/COLOR]<br>",
                    prefix: PIN_PREFIX,
      status: true,
    },
    {
                                                        	  title: '| NonRP Обман |',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=White] Аккаунт будет разблокирован на 24 часа, у Вас есть время, чтобы возместить ущерб и предоставить доказательства. <br>"+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=White]С уважением, [/COLOR][COLOR=RED]Основной Заместитель Главного Администратора.[/COLOR]<br>",
                    prefix: PIN_PREFIX,
      status: true,
    },
    {
                                                        	  title: '| Отсутствует /time |',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=White]В ваших доказательствах отсутствует /time.<br>Следовательно, обжалование [/COLOR][COLOR=Yellow]рассмотрению[/COLOR][COLOR=RED] не подлежит. <br>"+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=White]С уважением, [/COLOR][COLOR=RED]Основной Заместитель Главного Администратора.[/COLOR]<br>",
        	      prefix: CLOSE_PREFIX,
      status: false
               },
    {
                                                        	  title: '| Невозврат ущерба |',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=White]У вас было 24 часа на возмещение ущерба, время истекло аккаунт будет заблокирован навсегда. <br>"+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=White]С уважением, [/COLOR][COLOR=RED]Основной Заместитель Главного Администратора.[/COLOR]<br>",
        	      prefix: CLOSE_PREFIX,
      status: false
               },
    {
                                                        	  title: '| Док-ва в соц. сетях |',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=White]Доказательства в социальных сетях (VK,Instagram,FaceBook) не принимаются.<br>Загрузите доказательства на фохостинг (Imgur,Yapix,Youtube). <br>"+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=White]С уважением, [/COLOR][COLOR=RED]Основной Заместитель Главного Администратора.[/COLOR]<br>",
        	      prefix: CLOSE_PREFIX,
      status: false
               },
    {
                                                	  title: '| В жалобы на тех. специалистов |',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=White]Если Вы не согласны с решением Технического Специалиста.<br>Обратитесь в раздел жалоб на Технических специалистов. <br>"+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=White]С уважением, [/COLOR][COLOR=RED]Основной Заместитель Главного Администратора.[/COLOR]<br>",
        	      prefix: CLOSE_PREFIX,
      status: false
               },
    {
                                                        	  title: '| Ошиблись сервером |',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=White]Вы ошиблись сервером, напишите обжалование наказания на форуме Вашего сервера. <br>"+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=White]С уважением, [/COLOR][COLOR=RED]Основной Заместитель Главного Администратора.[/COLOR]<br>",
        	      prefix: CLOSE_PREFIX,
      status: false
               },
    {
                                                        	  title: '| Снятие NRP обмана |',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=White]Снятие наказания возможно только при условии полного возврата имущества. Обжалование должно быть написано обманутой стороной с того же форумного аккаунта, что и жалоба.<br>"+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=White]С уважением, [/COLOR][COLOR=RED]Основной Заместитель Главного Администратора.[/COLOR]<br>",
        	      prefix: CLOSE_PREFIX,
      status: false
               },
    {
                                                        	  title: '| Воспользуйтесь VPN|',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=White]Вы попали на заблокированный IP адрес,воспользуйтесь VPN.<br>"+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=White]С уважением, [/COLOR][COLOR=RED]Основной Заместитель Главного Администратора.[/COLOR]<br>",
        	      prefix: CLOSE_PREFIX,
      status: false
               },
    {
                                                        	  title: '| Ранее создана |',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=White]Данная тема является дубликатом вашей предыдущей темы. Пожалуйста, прекратите создавать идентичные или похожие темы - иначе Ваш форумный аккаунт может быть заблокирован. На первый раз предупреждение будет устное, при повторном дублировании на ваш аккаунт будет выдвинуты санкции в виде штрафных баллов. При последующих нарушениях ваш формный аккаунт будет заблокирован.<br>"+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=White]С уважением, [/COLOR][COLOR=RED]Основной Заместитель Главного Администратора.[/COLOR]<br>",
        	      prefix: CLOSE_PREFIX,
      status: false
               },
];

	$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
	addButton('На рассмотрение', 'pin');
	addButton('Отказано⛔', 'unaccept');
	addButton('Одобрено✅', 'accepted');
	addButton('Специальному Администратору💥', 'specadm');
    addButton('Теху', 'Texy');
	addButton('Главному Администратору💥', 'mainadm');
    addButton('Закрыто⛔', 'Zakrito');
    addButton('Решено✅', 'Resheno');
    addButton('Закрыто⛔', 'Zakrito');
    addButton('Реализовано💫', 'Realizovano');
    addButton('Рассмотрено✅', 'Rassmotreno');
    addButton('Ожидание', 'Ojidanie');
    addButton('Без префикса⛔', 'Prefiks');
    addButton('Проверено контролем качества', 'Kachestvo');
	addButton('Ответы💥', 'selectAnswer');

	// Поиск информации о теме
	const threadData = getThreadData();

	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
	$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
	$('button#specadm').click(() => editThreadData(SPECADM_PREFIX, true));
	$('button#mainadm').click(() => editThreadData(MAINADM_PREFIX, true));
     $('button#Texy').click(() => editThreadData(TEXY_PREFIX, false));
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
    $('button#Kachestvo').click(() => editThreadData(KACHESTVO, false));


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