// ==UserScript==
// @name         ЧИСТО ДЛЯ ЖЕНЬКА new COLOR 228
// @namespace    https://greasyfork.org/ru/users/1032828-crystalby
// @version      2033
// @description  скрипт для ленивых зга/га
// @author       точно не станчин
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @icon         https://icons.iconarchive.com/icons/iconarchive/incognito-animal-2/256/Sheep-icon.png
// @grant        none
// @license 	 none
// @downloadURL https://update.greasyfork.org/scripts/520779/%D0%A7%D0%98%D0%A1%D0%A2%D0%9E%20%D0%94%D0%9B%D0%AF%20%D0%96%D0%95%D0%9D%D0%AC%D0%9A%D0%90%20new%20COLOR%20228.user.js
// @updateURL https://update.greasyfork.org/scripts/520779/%D0%A7%D0%98%D0%A1%D0%A2%D0%9E%20%D0%94%D0%9B%D0%AF%20%D0%96%D0%95%D0%9D%D0%AC%D0%9A%D0%90%20new%20COLOR%20228.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const UNACCEPT_PREFIX = 4; // Префикс "Отказано"
    const ACCEPT_PREFIX = 8; // Префикс "Одобрено"
    const RESHENO_PREFIX = 6; // Префикс "Решено"
    const PIN_PREFIX = 2; // Префикс "На рассмотрении"
    const GA_PREFIX = 12; // Префикс "Главному Администратору"
    const COMMAND_PREFIX = 10; // Префикс "Команде Проекта"
    const WATCHED_PREFIX = 9; // Префикс "Рассмотрено"
    const CLOSE_PREFIX = 7; // Префикс "Закрыто"
    const SPECIAL_PREFIX = 11; // Префикс "Специальному Администратору"
    const Expectation_Prefix = 14 // Префикс "Ожидание"
    const buttons = [
     {
      title: 'Приветсвие',
      content:
        '[SIZE=4][COLOR=rgb(0, 255, 255)][FONT=times new roman]{{ greeting }}, уважаемый игрок.[/FONT][/COLOR][/SIZE]',
      color: "#00FFFF"
    },
    {
      title: 'Свой ответ✉︎',
      content:
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Добрый вечер, уважаемый игрок.[/SIZE][/FONT][/COLOR]<br>'+
        '[FONT=times new roman][SIZE=4][COLOR=rgb(209, 213, 216)]<br>'+
        '<br>'+
        '[/COLOR][/SIZE][/FONT]<br>'+
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Закрыто.[/SIZE][/FONT][/COLOR][/CENTER]<br>',
      color: "#A9A9A9"
    },

    {
      title: 'Передано ГА жб',
      content:
        '[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]{{ greeting }}, уважаемый игрок.[/COLOR][/SIZE][/FONT]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша тема переадресована [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Главному Администратору[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br>" +
        '[FONT=times new roman][SIZE=4][COLOR=rgb(209, 213, 216)]Ожидайте ответа в данной теме, копии создавать не нужно.[/COLOR][/SIZE][/FONT][/CENTER]',
      prefix: GA_PREFIX,
      status: true,
      color: "#DC143C"
    },
    {
      title: 'Передано СА',
      content:
        '[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]{{ greeting }}, уважаемый игрок.[/COLOR][/SIZE][/FONT]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша тема переадресована [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Специальному Администратору[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[FONT=times new roman][SIZE=4][COLOR=rgb(209, 213, 216)]Ожидайте ответа в данной теме, копии создавать не нужно.[/COLOR][/SIZE][/FONT][/CENTER]',
      prefix:SPECIAL_PREFIX,
      status: true,
      color: "red"
    },
    {
      title: 'На рассмотрении',
      content:
        '[CENTER][SIZE=4][FONT=times new roman][COLOR=rgb(255, 0, 0)]{{ greeting }}, уважаемый игрок.[/COLOR][/FONT][/SIZE]<br><br>' +
        "[SIZE=4][COLOR=rgb(209, 213, 216)][FONT=times new roman]Ваша тема взята на рассмотрение.[/FONT][/COLOR][/SIZE]<br>" +
        '[SIZE=4][FONT=times new roman][COLOR=rgb(209, 213, 216)]Не нужно создавать копии этой жалобы, ожидайте ответа в этой теме.[/COLOR][/FONT][/SIZE][/CENTER]',
      prefix: PIN_PREFIX,
      status: true,
      color: "orange"
    },
    {
      title: 'Руководству',
      content:
        '[CENTER][SIZE=4][FONT=times new roman][COLOR=rgb(255, 0, 0)]{{ greeting }}, уважаемый игрок.[/COLOR][/FONT][/SIZE]<br><br>' +
        "[SIZE=4][COLOR=rgb(209, 213, 216)][FONT=times new roman]Ваша тема передана руководству сервера.[/FONT][/COLOR][/SIZE]<br>" +
        '[SIZE=4][FONT=times new roman][COLOR=rgb(209, 213, 216)]Не нужно создавать копии этой жалобы, ожидайте ответа в этой теме.[/COLOR][/FONT][/SIZE][/CENTER]',
      prefix: PIN_PREFIX,
      status: true,
      color: "orange"
    },
    {
      title: '========================================= Отказ  ========================================= ',
    },
    {
      title: 'ОБЖ отказано',
      content:
        '[CENTER][FONT=verdana][SIZE=4][COLOR=rgb(255, 0, 0)]{{ greeting }}, уважаемый игрок.[/COLOR]<br><br>' +
        '[COLOR=rgb(209, 213, 216)][FONT=verdana][SIZE=4]В обжаловании отказано.<br><br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=verdana][SIZE=4]Закрыто.[/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Наказание не обж',
      content:
        '[CENTER][FONT=verdana][SIZE=4][COLOR=rgb(255, 0, 0)]{{ greeting }}, уважаемый игрок.[/COLOR]<br><br>' +
        '[COLOR=rgb(209, 213, 216)][FONT=verdana][SIZE=4]Выданное Вам наказание не подлежит обжалованию.<br><br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=verdana][SIZE=4]Закрыто.[/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Не по форме',
      content:
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=verdana][SIZE=4]{{ greeting }}, уважаемый игрок.[/SIZE][/FONT][/COLOR]<br><br>' +
        "[SIZE=4][FONT=verdana][COLOR=rgb(209, 213, 216)]Ваше обжалование составлена не по форме.[/COLOR]<br><br>" +
        "[COLOR=rgb(209, 213, 216)]Форма подачи:.[/COLOR][/FONT][/SIZE]<br><br>" +
		'[LEFT][QUOTE]1. Ваш Nick_Name:<br>2. Nick_Name администратора:<br>3. Дата выдачи/получения наказания:<br>4. Суть заявки:<br>5. Доказательство:[/QUOTE][/LEFT]<br><br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=verdana][SIZE=4]Закрыто.[/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Не по теме',
      content:
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=verdana][SIZE=4]{{ greeting }}, уважаемый игрок.[/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][FONT=verdana][SIZE=4]Ваше сообщение никоим образом не относится к предназначению данного раздела.[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=verdana][SIZE=4]Закрыто.[/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Нужно окно бана',
      content:
        '[CENTER][FONT=verdana][SIZE=4][COLOR=rgb(255, 0, 0)]{{ greeting }}, уважаемый игрок.[/COLOR]<br><br>' +
        '[COLOR=rgb(209, 213, 216)][FONT=verdana][SIZE=4]Прикрепите в доказательства скриншот окна блокировки, которое появляется сразу после входа в игру.<br><br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=verdana][SIZE=4]Закрыто.[/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Ответ дан раннее',
      content:
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=verdana][SIZE=4]{{ greeting }}, уважаемый игрок.[/SIZE][/FONT][/COLOR]<br><br>' +
        "[SIZE=4][FONT=verdana][COLOR=rgb(209, 213, 216)]Вам уже ранее был дан корректный ответ, за создание дубликатов этой темы ваш форумный аккаунт может быть заблокирован.[/COLOR][/FONT][/SIZE]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=verdana][SIZE=4]Закрыто.[/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Док-ва отред.',
      content:
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=verdana][SIZE=4]{{ greeting }}, уважаемый игрок.[/SIZE][/FONT][/COLOR]<br><br>' +
        '[COLOR=rgb(209, 213, 216)][FONT=verdana][SIZE=4]Ваши доказательства были подвергнуты изменениям (редактированию), прикрепите оригинальные файлы.[/SIZE][/FONT]<br>' +
        '[FONT=verdana][SIZE=4]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/COLOR]<br><br>' +
        '[FONT=verdana][SIZE=4][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Отсутст. док-ва',
      content:
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=verdana][SIZE=4]{{ greeting }}, уважаемый игрок.[/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][FONT=verdana][SIZE=4]Отсутствуют доказательства - следовательно, рассмотрению не подлежит.[/SIZE][/FONT][/COLOR]<br>" +
        "[SIZE=4][COLOR=rgb(209, 213, 216)][FONT=verdana]Загрузите доказательства на фото-видео хостинги YouTube, Imgur, Yapx и так далее.[/FONT][/COLOR][/SIZE]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=verdana][SIZE=4]Закрыто.[/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Док-ва в соц. сетях',
      content:
        '[CENTER][FONT=verdana][COLOR=rgb(255, 0, 0)][SIZE=4]{{ greeting }}, уважаемый игрок.[/SIZE][/COLOR][/FONT]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=verdana]Доказательства в социальных сетях и т.д. не принимаются.[/FONT][/SIZE]<br>" +
        "[SIZE=4][FONT=verdana]Загрузите доказательства на фото-видео хостинги YouTube, Imgur, Yapx и так далее.[/FONT][/SIZE][/COLOR]<br><br>" +
        '[FONT=verdana][COLOR=rgb(255, 0, 0)][SIZE=4]Закрыто.[/SIZE][/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'СПО на скрине',
      content:
        '[CENTER][FONT=verdana][COLOR=rgb(255, 0, 0)][SIZE=4]{{ greeting }}, уважаемый игрок.[/SIZE][/COLOR][/FONT]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=verdana]Ваш игровой акаунт был заблокирован навсегда за использование стороннего ПО.[/FONT][/SIZE]<br>" +
        "[SIZE=4][FONT=verdana]В обжаловании отказано.[/FONT][/SIZE][/COLOR]<br>" +
        "[FONT=verdana][COLOR=#d1d5d8][SIZE=4]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/COLOR][/FONT]<br><br>" +
        '[FONT=verdana][COLOR=rgb(255, 0, 0)][SIZE=4]Закрыто.[/SIZE][/COLOR]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'НонРп обман ( нуж условие ) ',
      content:
        '[CENTER][FONT=verdana][SIZE=4][COLOR=rgb(255, 0, 0)]{{ greeting }}, уважаемый игрок.[/COLOR]<br><br>' +
        '[COLOR=rgb(209, 213, 216)][FONT=verdana][SIZE=4]В обжаловании отказано. Нужно согласие на возврат имущества от обманутой стороны<br><br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=verdana][SIZE=4]Закрыто.[/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: '========================================= Раздел  ========================================= ',
    },
    {
      title: 'В обжалования',
      content:
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=verdana][SIZE=4]{{ greeting }}, уважаемый игрок.[/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][FONT=verdana][SIZE=4]Обратитесь в раздел обжалований наказаний.[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=verdana][SIZE=4]Закрыто.[/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Перенесен в адм раздел ',
      content:
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=verdana][SIZE=4]{{ greeting }}, уважаемый игрок.[/SIZE][/FONT][/COLOR]<br><br>' +
        "[SIZE=4][FONT=verdana][COLOR=rgb(209, 213, 216)]Ваше обращение никак не относится к обжалованиям наказания и было перенесено в нужный раздел.[/COLOR][/FONT][/SIZE]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=verdana][SIZE=4]Ожидайте.[/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: Expectation_Prefix,
      status: false,
    },
    {
      title: 'Жб for Тех. спец.',
      content:
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=verdana][SIZE=4]{{ greeting }}, уважаемый игрок.[/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][FONT=verdana][SIZE=4]Обратитесь в раздел жалоб на Технических специалистов - [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=verdana][SIZE=4][URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D1%85-%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%BE%D0%B2.490/']*Нажмите сюда*[/URL]<br>" +
        "Просьба не создавать дубликаты данной темы в этом разделе, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=verdana][SIZE=4]Закрыто.[/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'В тех раздел',
      content:
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=verdana][SIZE=4]{{ greeting }}, уважаемый игрок.[/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][FONT=verdana][SIZE=4]Обратитесь в технический раздел - [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=verdana][SIZE=4][URL='https://clck.ru/NM4QK']*Нажмите сюда*[/URL]<br>" +
        "Просьба не создавать дубликаты данной темы в этом разделе, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=verdana][SIZE=4]Закрыто.[/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: '========================================= Одобрено  ========================================= ',
    },
    {
      title: 'ОБЖ одобрено',
      content:
        '[CENTER][FONT=verdana][SIZE=4][COLOR=rgb(255, 0, 0)]{{ greeting }}, уважаемый игрок.[/COLOR]<br><br>' +
        '[COLOR=rgb(209, 213, 216)][FONT=verdana][SIZE=4]Наказание будет снижено.<br>' +
        'Приятной игры на BLACK RUSSIA.[/SIZE][/FONT][/COLOR]<br><br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=verdana][SIZE=4]Закрыто.[/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    ];

    $(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
        $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

        // Добавление кнопок при загрузке страницы
        addButton('Одобрить✔️', 'accepted',"#00FF00");
        addButton('Отказать❌', 'unaccept',"#DC143C");
        addButton('На рассмотрении ⏳', 'pin',"#ff9800");
        addButton('Рассмотрено✔️', 'watched',"#32CD32");
        addButton('Закрыть⭕', 'closed',"#8B0000");
        addButton('ГА 📌', 'mainAdmin',"#FF0000");
        addButton('Теху🔧', 'those',"#FF7F50");
        addButton('Меню', 'selectAnswer');


        // Поиск информации о теме
        const threadData = getThreadData();

        $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
        $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
        $(`button#teamProject`).click(() => editThreadData(COMMAND_PREFIX, true));
        $(`button#watched`).click(() => editThreadData(WATCHED_PREFIX, false));
        $(`button#unaccept`).click(() => editThreadData(UNACCEPT_PREFIX, false));
        $(`button#mainAdmin`).click(() => editThreadData(GA_PREFIX, true));

        $(`button#specialAdmin`).click(() => editThreadData(SPECIAL_PREFIX, true));

        $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
	$('button#closed').click(() => editThreadData(CLOSE_PREFIX, false));

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

    function addButton(name, id,color) {
        $('.button--icon--reply').before(
            `<button type="button" class="button--primary button rippleButton" id="${id}"` +
            ` style="border: 1px solid ${color};border-radius: 15px; margin-right: 7px;">${name}</button>`,
        );
    }

    function buttonsMarkup(buttons) {
        return `<div class="select_answer">${buttons
            .map(
            (btn, i) =>
            `<button id="answers-${i}" class="button--primary button ` +
            `rippleButton" style="color:${btn.color};margin:5px"><span class="button-text">${btn.title}</span></button>`,
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

    function editThreadData(prefix, pin = false,perenos_tem = true) {
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
		if(perenos_tem === true) {
			if(prefix == Expectation_Prefix) {
				moveThread(prefix, 2414); }

		}
    }
function moveThread(prefix, type) {
	// Перемещение темы
	const threadTitle = $('.p-title-value')[0].lastChild.textContent;

	fetch(`${document.URL}move`, {
	  method: 'POST',
	  body: getFormData({
		prefix_id: prefix,
		title: threadTitle,
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