// ==UserScript==
// @name         ГОСС Для проверки | KHABAROVSK
// @namespace    https://forum.blackrussia.online/
// @version      1.2
// @description  Создано для KHABAROVSK
// @author       Orkni_Stalin
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @icon https://gas-kvas.com/grafic/uploads/posts/2024-01/gas-kvas-com-p-kontur-brillianta-na-prozrachnom-fone-26.png
// @downloadURL
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/514507/%D0%93%D0%9E%D0%A1%D0%A1%20%D0%94%D0%BB%D1%8F%20%D0%BF%D1%80%D0%BE%D0%B2%D0%B5%D1%80%D0%BA%D0%B8%20%7C%20KHABAROVSK.user.js
// @updateURL https://update.greasyfork.org/scripts/514507/%D0%93%D0%9E%D0%A1%D0%A1%20%D0%94%D0%BB%D1%8F%20%D0%BF%D1%80%D0%BE%D0%B2%D0%B5%D1%80%D0%BA%D0%B8%20%7C%20KHABAROVSK.meta.js
// ==/UserScript==

(function () {
	const buttons = [

            {
	  title: '| Одобрено |',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	 content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=Verdana][SIZE=3][COLOR=#2c82c9]{{greeting}}, уважаемый сотрудник.[/COLOR][/CENTER][/B]"+
  "[B][CENTER][FONT=Verdana][SIZE=3][COLOR=lavender] Ваша заявка для постановления на должность [COLOR=#2C82C9] Рядового [/COLOR] получает статус [COLOR=GREEN]одобрено[/COLOR][/SIZE][/FONT]"+
    "[B][CENTER][COLOR=lavender][FONT=Verdana][Color=WHITE]Когда будете в игре подходите к нашему зданию и позвоните нам[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=Verdana] C уважением полковник ФСИН Motya_Settinko. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=Verdana][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]",
    },
                {
            title: '>>>>>>>>>>>>>>>>>>>> Отказы <<<<<<<<<<<<<<<<<<<<',
            dpstyle: 'oswald: 3px; border-radius:  20px; color: #fff; background: red; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
        },
        {
	  title: '| Нет скринов |',
     dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
    content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, уважаемый представитель.[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как в ней отсутствуют скриншоты или они недоступны. [/SIZE][/FONT] <br><br>"+
                "[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR]<br><br>",
},
{
	  title: '| Не по форме |',
     dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
    content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, уважаемый игрок.[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша заявка [COLOR=#FF0000]отказана[/COLOR], так как она составлена не по форме. [/SIZE][/FONT] <br><br>"+
                "[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR]<br><br>",
},
{
	  title: '| Нет /time |',
     dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, уважаемый представитель. [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как на ваших доказательствах отсутствует /time. [/SIZE][/FONT] <br><br>"+
                "[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR]<br><br>",
},
        {
      title: 'Отсутствуют док-ва',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
           content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][COLOR=YELLOW][CENTER][ICODE]{{ greeting }}, уважаемый представитель. [/ICODE].[/CENTER][/I][/COLOR][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][COLOR=YELLOW][SIZE=4]Отсутствуют доказательства - следовательно, рассмотрению не подлежит. Загрузите доказательства на фото-видео хостинги[/COLOR][COLOR=RED]YouTube,[/COLOR][COLOR=GREEN] Imgur,[/COLOR][COLOR=PURPLE] Yapx[/COLOR][COLOR=YELLOW] и так далее.[/COLOR][/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>" +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
},
        {
	  title: '| Неадекватная жалоба |',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	  content:
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Доброго времени суток, уважаемый представитель. [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] В данном виде ваша жалоба не будет рассмотрена администрацией сервера. Составьте жалобу адекватно, создав новую тему. При повторных попытках дублирования данной темы Вы получите блокировку форумного аккаунта. [/SIZE][/FONT] <br><br>"+
                "[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR]<br><br>",
    },
        {
	  title: '| Док-ва не открываются |',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	  content:
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, уважаемый представитель. [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как ваши доказательства не открываются. [/SIZE][/FONT] <br><br>"+
                "[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR]<br><br>",
},
              {
	  title: '| Проделанная работа |',
                   dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	  content:
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, уважаемый представитель. [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как у вас не хватает проделанной работы. [/B][/SIZE][/CENTER][/FONT] <br><br>"+
       "[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR]<br><br>",
},
                    {
	  title: '| Система повышения |',
              dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	  content:
		"[CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, уважаемый представитель. [/COLOR][/CENTER][/B]<br><br>"+
		"[CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваше заявление [COLOR=#FF0000]отказано[/COLOR][/B][/SIZE][/CENTER][/FONT] <br><br>"+
        "[CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Просим вас ознакомиться с [Color=Red]<br>[URL='https://forum.blackrussia.online/threads/%D0%A4%D0%A1%D0%98%D0%9D-%D0%A1%D0%B8%D1%81%D1%82%D0%B5%D0%BC%D0%B0-%D0%BF%D0%BE%D0%B2%D1%8B%D1%88%D0%B5%D0%BD%D0%B8%D1%8F.10384463/unread'] с системой повышения.[/URL]<br>[/color].[/CENTER]" +
        "[CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR]<br><br>",
},
         ];

	$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
//    addButton('Дать отпор', 'selectAnswer', 'border-radius: 11px; margin-right: 8px; border: 3px solid; border-color: rgb(203, 40, 33, 0.5);');
	addAnswers();

	// Поиск информации о теме
	const threadData = getThreadData();

	$(`button#ff`).click(() => pasteContent(8, threadData, true));
	$(`button#prr`).click(() => pasteContent(2, threadData, true));
	$(`button#zhb`).click(() => pasteContent(21, threadData, true));
	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
	$('button#accepted').click(() => editThreadData(ACСEPT_PREFIX, false));
	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
	$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
	$('button#watched').click(() => editThreadData(WATCHED_PREFIX, false));
	$('button#decided').click(() => editThreadData(DECIDED_PREFIX, false));
	$('button#closed').click(() => editThreadData(CLOSE_PREFIX, false));
	$('button#closed_complaint').click(() => editThreadData(CLOSE_PREFIX, false, false));
	$('button#techspec').click(() => editThreadData(TEX_PREFIX, true));
    $('button#GA').click(() => editThreadData(GA_PREFIX, true));
    $('button#zakrepleno').click(() => editThreadData(NARASMOTRENII_PREFIX, true));

	$(`button#selectAnswer`).click(() => {
	XF.alert(buttonsMarkup(buttons), null, 'ВЫБИРАЙ ЗА ЧТО ЗАБАНИМ');
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