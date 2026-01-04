// ==UserScript==
// @name         Скрипт для Куратора администрации || NOVGOROD
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Скрипт для Куратора администрации
// @author       Artem_Tankov
// @match        https://forum.blackrussia.online/threads/*
// @icon         https://i.pinimg.com/564x/65/8d/d7/658dd779ebe45b78a62f1bb5b918b2a5.jpg
// @grant        none
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/507522/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%B0%20%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D0%B8%20%7C%7C%20NOVGOROD.user.js
// @updateURL https://update.greasyfork.org/scripts/507522/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%B0%20%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D0%B8%20%7C%7C%20NOVGOROD.meta.js
// ==/UserScript==

(function () {
  'use strict';
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const GA_PREFIX = 12; // Prefix that will be set when thread send to ga
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7;
const SPECY_PREFIX = 11;
const TEXY_PREFIX = 13;
const buttons = [
    {
    title: 'Свой текст',
    content:
             "[CENTER][FONT=verdana][B][SIZE=4]Здравствуйте ува[/SIZE][/B][SIZE=4]жаем[B]ый игрок.[/B][/SIZE]<br><br>" +
             "[B][SIZE=4]Текст для изменения [/SIZE][/B]<br><br>" +
             "[B][SIZE=4][COLOR=white][I]С уважением[/I][/COLOR][/SIZE][/B] [SIZE=4][COLOR=rgb(200, 0, 200)][B][I]Куратор администрации.[/I][/B][/COLOR][/SIZE][/FONT][/CENTER]<br>"
    },
    {
      title: '--------------------------------------------------------- Жалоба на администрацию ---------------------------------------------------------',
               },
    {
      title: 'на рассмотрении',
	  content:
        "[CENTER][FONT=verdana][B][SIZE=4]Здравствуйте ува[/SIZE][/B][SIZE=4]жаем[B]ый игрок.[/B][/SIZE]<br><br>" +
        '[SIZE=4][FONT=verdana]Запросил доказательства у администратора.<br>' +
		"Ожидайте ответа в данной теме, не нужно создавать копии этой темы.[/FONT][/SIZE]<br>" +
        '[B][COLOR=rgb(255, 152, 0)][FONT=verdana][SIZE=4]На рассмотрение.[/SIZE][/FONT][/COLOR]<br><br>' +
        "[FONT=verdana][B][SIZE=4][COLOR=white][I]С уважением[/I][/COLOR][/SIZE][/B] [/FONT][/B][FONT=verdana] [SIZE=4][COLOR=rgb(200, 0, 200)][B][I]Куратор администрации.[/I][/B][/COLOR][/SIZE][/FONT][/CENTER]<br>",

         prefix: PIN_PREFIX,
         status: true,
    },
    {
      title: 'у админа нету доков',
	  content:
        "[CENTER][FONT=verdana][B][SIZE=4]Здравствуйте ува[/SIZE][/B][SIZE=4]жаем[B]ый игрок.[/B][/SIZE]<br><br>" +
        '[SIZE=4][FONT=verdana]Ваша жалоба была рассмотрена, с администратором будет проведена [/FONT][COLOR=rgb(255, 0, 0)][FONT=verdana]работа.[/FONT][/COLOR]<br>' +
		"[COLOR=rgb(251, 160, 38)][FONT=verdana]Наказание будет снято в скором времени,[/FONT][/COLOR][FONT=verdana] просьба вас ожидать.<br>"+
        '[FONT=verdana][B][SIZE=4]Приносим извинения за предоставленные неудобства.[/B][/FONT][/SIZE]<br><br>' +
        '[FONT=verdana][SIZE=4][COLOR=rgb(0, 255, 0)]Одобрено, [/COLOR]закрыто.[/SIZE][/FONT]<br><br>' +
        "[FONT=verdana][B][SIZE=4][COLOR=white][I]С уважением[/I][/COLOR][/SIZE][/FONT][/B][FONT=verdana] [SIZE=4][COLOR=rgb(200, 0, 200)][B][I]Куратор администрации.[/I][/B][/COLOR][/SIZE][/FONT][/CENTER]<br>",

        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
      title: 'у админа есть док-ва',
	  content:
        "[CENTER][FONT=verdana][B][SIZE=4]Здравствуйте ува[/SIZE][/B][SIZE=4]жаем[B]ый игрок.[/B][/SIZE][/FONT]<br><br>" +
        '[FONT=verdana][SIZE=4]Администратор предоставил доказательство вашего нарушения.<br><br>' +
		"Наказание [COLOR=rgb(251, 160, 38)]в[/COLOR][COLOR=rgb(251, 160, 38)][B]ыдано верно.[/B][/FONT][/COLOR]<br>"+
        '[FONT=verdana][B][COLOR=rgb(255, 0, 0)]Отказано[/COLOR], закрыто.[/B][/FONT][/SIZE]<br><br>' +
        '[FONT=verdana][B][SIZE=4][COLOR=white][I]С уважением[/I][/COLOR][/SIZE][/B] [SIZE=4][COLOR=rgb(200, 0, 200)][B][I]Куратор администрации.[/I][/B][/COLOR][/SIZE][/FONT][/CENTER]<br>',

         prefix: UNACCEPT_PREFIX,
         status: false,
               },
    {
      title: 'Админ прав',
	  content:
        "[CENTER][FONT=verdana][B][SIZE=4]Здравствуйте ува[/SIZE][/B][SIZE=4]жаем[B]ый игрок.[/B][/SIZE]<br><br>" +
        '[FONT=verdana][SIZE=4]Нарушений со стороны администратора не было найдено<br><br>' +
        '[FONT=verdana][B][COLOR=rgb(255, 0, 0)]Отказано[/COLOR], закрыто.[/B][/FONT][/SIZE]<br><br>' +
        '[FONT=verdana][B][SIZE=4][COLOR=white][I]С уважением[/I][/COLOR][/SIZE][/B] [SIZE=4][COLOR=rgb(200, 0, 200)][B][I]Куратор администрации.[/I][/B][/COLOR][/FONT][/CENTER]<br>',

         prefix: UNACCEPT_PREFIX,
         status: false,
               },
    {
      title: 'админ ошибся',
	  content:
        "[CENTER][FONT=verdana][B][SIZE=4]Здравствуйте ува[/SIZE][/B][SIZE=4]жаем[B]ый игрок.[/B][/SIZE]<br><br>" +
        '[SIZE=4][FONT=verdana]Ваша жалоба была рассмотрена, с администратором будет проведена [/FONT][COLOR=rgb(255, 0, 0)][FONT=verdana]профилактическая беседа.[/FONT][/COLOR]<br>' +
        '[B][FONT=verdana]Приносим извинения за предоставленные неудобства.[/FONT][/B][/SIZE]<br><br>' +
        '[FONT=verdana][SIZE=4][COLOR=rgb(0, 255, 0)]Одобрено, [/COLOR]закрыто.[/SIZE][/FONT]<br><br>' +
        "[FONT=verdana][B][SIZE=4][COLOR=white][I]С уважением[/I][/COLOR][/SIZE][/FONT][/B][FONT=verdana] [SIZE=4][COLOR=rgb(200, 0, 200)][B][I]Куратор администрации.[/I][/B][/COLOR][/SIZE][/FONT][/CENTER]<br>",

        prefix: ACCEPT_PREFIX,
        status: false,
    },
               {
      title: 'прошло более чем 72 часа',
	  content:
        "[CENTER][FONT=verdana][B][SIZE=4]Здравствуйте ува[/SIZE][/B][SIZE=4]жаем[B]ый игрок.[/B][/SIZE]<br><br>" +
        '[SIZE=4][B][FONT=verdana]С момента выдачи наказания прошло более 72-х часов.[/FONT][/B]<br>' +
		"[FONT=verdana][B][COLOR=rgb(255, 0, 0)]Отказано[/COLOR], закрыто.[/B][/FONT][/SIZE]<br><br>"+
        '[FONT=verdana][B][SIZE=4][COLOR=white][I]С уважением[/I][/COLOR][/SIZE][/B] [SIZE=4][COLOR=rgb(200, 0, 200)][B][I]Куратор администрации.[/I][/B][/COLOR][/SIZE][/FONT][/CENTER]',

         prefix: UNACCEPT_PREFIX,
         status: false,
               },
               {
      title: 'в жб на теха',
	  content:
        "[CENTER][FONT=verdana][B][SIZE=4]Здравствуйте ува[/SIZE][/B][SIZE=4]жаем[B]ый игрок.[/B][/SIZE]<br><br>" +
        '[FONT=verdana][SIZE=4]Вы ошиблись разделом.[/SIZE][/FONT]<br>' +
		'[SIZE=4][FONT=verdana]Подайте жалобу в раздел[/FONT][/SIZE] [URL="https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-novgorod.3535/"][FONT=verdana][COLOR=rgb(0, 168, 133)][SIZE=4]"Жалобы на технических специалистов"[/SIZE][/COLOR][/FONT][/URL]<br>' +
        '<br>' +
        "[FONT=verdana][B][SIZE=4][COLOR=white][I]С уважением[/I][/COLOR][/SIZE][/FONT][/B][FONT=verdana] [SIZE=4][COLOR=rgb(200, 0, 200)][B][I]Куратор администрации.[/I][/B][/COLOR][/SIZE][/FONT][/CENTER]<br>",

         prefix: UNACCEPT_PREFIX,
         status: false,
               },
               {
      title: 'передано ГА',
	  content:
        "[CENTER][FONT=verdana][B][SIZE=4]Здравствуйте ува[/SIZE][/B][SIZE=4]жаем[B]ый игрок.[/B][/SIZE]<br><br>" +
        '[SIZE=4][FONT=verdana]Передано [COLOR=rgb(255, 0, 0)]Главному Администратору[/COLOR].[/FONT][/SIZE]<br>' +
		"<br>"+
        "[FONT=verdana][B][SIZE=4][COLOR=white][I]С уважением[/I][/COLOR][/SIZE][/FONT][/B][FONT=verdana] [SIZE=4][COLOR=rgb(200, 0, 200)][B][I]Куратор администрации.[/I][/B][/COLOR][/SIZE][/FONT][/CENTER]<br>",

         prefix: GA_PREFIX,
         status: true,
               },
    {
      title: 'Передано ЗГА',
	  content:
        "[CENTER][FONT=verdana][B][SIZE=4]Здравствуйте ува[/SIZE][/B][SIZE=4]жаем[B]ый игрок.[/B][/SIZE]<br><br>" +
        '[SIZE=4][FONT=verdana]Передано [COLOR=rgb(255, 0, 0)]Заместителям Главного Администратора[/COLOR].[/FONT][/SIZE]<br><br>' +
        "[FONT=verdana][B][SIZE=4][COLOR=white][I]С уважением[/I][/COLOR][/SIZE][/B] [SIZE=4][COLOR=rgb(200, 0, 200)][B][I]Куратор администрации.[/I][/B][/COLOR][/SIZE][/FONT][/CENTER]<br>",

         prefix: PIN_PREFIX,
         status: true,
               },
               {
      title: 'док-ва в соц. сетях',
	  content:
        "[CENTER][FONT=verdana][B][SIZE=4]Здравствуйте ува[/SIZE][/B][SIZE=4]жаем[B]ый игрок.[/B][/SIZE]<br><br>" +
        "[FONT=verdana]Доказательства в социальной сети. Просьба создать новую жалобу, выложить их на фото или видео платформы([URL='https://www.youtube.com/']You[COLOR=rgb(255, 0, 0)]Tube[/COLOR][/URL] или [URL='https://www.imgur.com/']Imgur[/URL]) и прикрепить в новой жалобе.[/FONT]<br><br>" +
        "[FONT=verdana][B][SIZE=4][COLOR=white][I]С уважением[/I][/COLOR][/SIZE][/FONT][/B][FONT=verdana] [SIZE=4][COLOR=rgb(200, 0, 200)][B][I]Куратор администрации.[/I][/B][/COLOR][/SIZE][/FONT][/CENTER]<br>",

         prefix: UNACCEPT_PREFIX,
         status: false,
               },
               {
      title: 'не по форме',
	  content:
        "[CENTER][FONT=verdana][B][SIZE=4]Здравствуйте ува[/SIZE][/B][SIZE=4]жаем[B]ый игрок.[/B][/SIZE]<br><br>" +
        '[size=4][FONT=verdana]Ваша жалоба составлена не по форме.[/font][/size]<br>' +
		'[FONT=verdana][SIZE=4]Форма подачи [/SIZE][/FONT][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]"Жалобы на администрацию"[/SIZE][/FONT][/COLOR][FONT=verdana][SIZE=4] будет написана ниже.[/SIZE][/FONT]<br><br>' +
        '[COLOR=rgb(97, 189, 109)][SIZE=5][ICODE]1. Ваш Nick_Name:<br>2. Nick_Name администратора:<br>3. Дата выдачи/получения наказания:<br>4. Суть жалобы:<br>5. Доказательство:[/ICODE][/SIZE][/COLOR]<br><br>' +
        "[FONT=verdana][B][SIZE=4][COLOR=white][I]С уважением[/I][/COLOR][/SIZE][/FONT][/B][FONT=verdana] [SIZE=4][COLOR=rgb(200, 0, 200)][B][I]Куратор администрации.[/I][/B][/COLOR][/SIZE][/FONT][/CENTER]<br>",

         prefix: UNACCEPT_PREFIX,
         status: false,
               },
               {
      title: 'не достаточно док-ва',
	  content:
        "[CENTER][FONT=verdana][B][SIZE=4]Здравствуйте ува[/SIZE][/B][SIZE=4]жаем[B]ый игрок.[/B][/SIZE]<br><br>" +
        '[SIZE=4][FONT=verdana]Недостаточно доказательств которые подтверждают нарушение [/FONT][/SIZE][COLOR=rgb(0, 255, 0)][FONT=verdana][SIZE=4]администратора[/SIZE][/FONT][/COLOR][FONT=verdana][SIZE=4].[/SIZE][/FONT]<br>' +
		"[SIZE=4][FONT=verdana][COLOR=rgb(255, 0, 0)]Отказано[/COLOR], закрыто.[/FONT][/SIZE]"+
        '<br><br>' +
        "[FONT=verdana][B][SIZE=4][COLOR=white][I]С уважением[/I][/COLOR][/SIZE][/FONT][/B][FONT=verdana] [SIZE=4][COLOR=rgb(200, 0, 200)][B][I]Куратор администрации.[/I][/B][/COLOR][/SIZE][/FONT][/CENTER]<br>",

         prefix: UNACCEPT_PREFIX,
         status: false,
               },
               {
      title: 'нет скрина бана',
	  content:
        "[CENTER][FONT=verdana][B][SIZE=4]Здравствуйте ува[/SIZE][/B][SIZE=4]жаем[B]ый игрок.[/B][/SIZE]<br><br>" +
        '[SIZE=4][FONT=verdana]Прикрепите скриншот окна блокировки, пример будет ниже.[/FONT][/SIZE]<br>https://imgur.com/a/4kOFFS4#l23MOZ4<br>' +
		'[SIZE=4][FONT=verdana]Просьба создать новую жалобу, выложить фото на "[URL="https://www.imgur.com/"]Imgur[/URL]" и прикрепить в новой жалобе.<br><br>'+
        '[COLOR=rgb(255, 0, 0)]Отказано[/COLOR], Закрыто.[/FONT][/SIZE]<br><br>' +
        "[FONT=verdana][B][SIZE=4][COLOR=white][I]С уважением[/I][/COLOR][/SIZE][/FONT][/B][FONT=verdana] [SIZE=4][COLOR=rgb(200, 0, 200)][B][I]Куратор администрации.[/I][/B][/COLOR][/SIZE][/FONT][/CENTER]<br>",

         prefix: UNACCEPT_PREFIX,
         status: false,
               },
    {
      title: 'нету доков на админа',
	  content:
        "[CENTER][FONT=verdana][B][SIZE=4]Здравствуйте ува[/SIZE][/B][SIZE=4]жаем[B]ый игрок.[/B][/SIZE]<br><br>" +
        '[SIZE=4][FONT=verdana]Отсутствуют доказательство которые подтверждают нарушений администратора, соответственно рассмотрению не подлежит[/FONT][/SIZE]<br>' +
        '[FONT=verdana][SIZE=4][COLOR=rgb(255, 0, 0)]Отказано[/COLOR], Закрыто.[/SIZE]<br><br>' +
        "[FONT=verdana][B][SIZE=4][COLOR=white][I]С уважением[/I][/COLOR][/SIZE][/FONT][/B][FONT=verdana] [SIZE=4][COLOR=rgb(200, 0, 200)][B][I]Куратор администрации.[/I][/B][/COLOR][/SIZE][/FONT][/CENTER]<br>",

         prefix: UNACCEPT_PREFIX,
         status: false,
               },
    {
      title: 'Ответ был дан в прошлой теме',
	  content:
        "[CENTER][FONT=verdana][B][SIZE=4]Здравствуйте ува[/SIZE][/B][SIZE=4]жаем[B]ый игрок.[/B][/SIZE]<br><br>" +
        '[SIZE=4][FONT=verdana][COLOR=rgb(84, 172, 210)]Ответ был дан вам в прошлой теме.[/color][/FONT][/SIZE]<br>' +
        '[SIZE=4][FONT=verdana]Просьба больше не создавать жалобу с данным наказанием администратора.[/FONT][/SIZE]<br>' +
        '[FONT=verdana][SIZE=4][COLOR=rgb(255, 0, 0)]Отказано[/COLOR], Закрыто.[/SIZE]<br><br>' +
        "[FONT=verdana][B][SIZE=4][COLOR=white][I]С уважением[/I][/COLOR][/SIZE][/FONT][/B][FONT=verdana] [SIZE=4][COLOR=rgb(200, 0, 200)][B][I]Куратор администрации.[/I][/B][/COLOR][/SIZE][/FONT][/CENTER]<br>",

         prefix: UNACCEPT_PREFIX,
         status: false,
               },
    {
      title: 'Оффтоп',
	  content:
        "[CENTER][FONT=verdana][B][SIZE=4]Здравствуйте ува[/SIZE][/B][SIZE=4]жаем[B]ый игрок.[/B][/SIZE]<br><br>" +
        '[SIZE=4][FONT=verdana][COLOR=rgb(84, 172, 210)]Содержимое вашего сообщения не имеет никакого отношения к данному разделу.[/color][/FONT][/SIZE]<br>' +
        '[SIZE=4][FONT=verdana]Просьба больше не создавать жалобу с данным содержанием.[/FONT][/SIZE]<br>' +
        '[FONT=verdana][SIZE=4][COLOR=rgb(255, 0, 0)]Отказано[/COLOR], Закрыто.[/SIZE]<br><br>' +
        "[FONT=verdana][B][SIZE=4][COLOR=white][I]С уважением[/I][/COLOR][/SIZE][/FONT][/B][FONT=verdana] [SIZE=4][COLOR=rgb(200, 0, 200)][B][I]Куратор администрации.[/I][/B][/COLOR][/SIZE][/FONT][/CENTER]<br>",

         prefix: UNACCEPT_PREFIX,
         status: false,
               },
    {
      title: 'В обжалования',
	  content:
        "[CENTER][FONT=verdana][B][SIZE=4]Здравствуйте ува[/SIZE][/B][SIZE=4]жаем[B]ый игрок.[/B][/SIZE]<br><br>" +
        '[SIZE=4][FONT=verdana][COLOR=rgb(84, 172, 210)]Обратитесь в раздел "Обжалование наказаний"[/color][/FONT][/SIZE]<br>' +
        '[SIZE=4][FONT=verdana]Просьба больше не создавать жалобу с данным содержанием.[/FONT][/SIZE]<br>' +
        '[FONT=verdana][SIZE=4][COLOR=rgb(255, 0, 0)]Отказано[/COLOR], Закрыто.[/SIZE]<br><br>' +
        "[FONT=verdana][B][SIZE=4][COLOR=white][I]С уважением[/I][/COLOR][/SIZE][/FONT][/B][FONT=verdana] [SIZE=4][COLOR=rgb(200, 0, 200)][B][I]Куратор администрации.[/I][/B][/COLOR][/SIZE][/FONT][/CENTER]<br>",

         prefix: UNACCEPT_PREFIX,
         status: false,
               },
    {
      title: 'В жб на теха',
	  content:
        "[CENTER][FONT=verdana][B][SIZE=4]Здравствуйте ува[/SIZE][/B][SIZE=4]жаем[B]ый игрок.[/B][/SIZE]<br><br>" +
        '[SIZE=4][FONT=verdana][COLOR=rgb(84, 172, 210)]Обратитесь в раздел "Жалобы на технических специалистов"[/color][/FONT][/SIZE]<br>' +
        '[SIZE=4][FONT=verdana]Просьба больше не создавать жалобу с данным содержанием.[/FONT][/SIZE]<br>' +
        '[FONT=verdana][SIZE=4][COLOR=rgb(255, 0, 0)]Отказано[/COLOR], Закрыто.[/SIZE]<br><br>' +
        "[FONT=verdana][B][SIZE=4][COLOR=white][I]С уважением[/I][/COLOR][/SIZE][/FONT][/B][FONT=verdana] [SIZE=4][COLOR=rgb(200, 0, 200)][B][I]Куратор администрации.[/I][/B][/COLOR][/SIZE][/FONT][/CENTER]<br>",

         prefix: UNACCEPT_PREFIX,
         status: false,
               },
    ];


 $(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
        $(`body`).append(`<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`);

        addButton(`Ответы`, `selectAnswer`);


        // Поиск информации о теме
        const threadData = getThreadData();

       const selectAnswerButton = document.querySelector('button#selectAnswer');
       selectAnswerButton.style.cssText = 'background-color: #db2309; border: 2px solid #db2309; border-radius: 15px; margin-right: 15px';
       $(`button#selectAnswer`).click(() => {
            XF.alert(buttonsMarkup(buttons), null, `Ответы`);
            buttons.forEach((btn, id) => {
                if (id > 0) {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));}
                 else {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
                }
            });
        });
    });

    function addButton(name, id) {
        $(`.button--icon--reply`).before(
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
            .join(``)}</div>`;
    }

    function pasteContent(id, data = {}, send = false) {
        const template = Handlebars.compile(buttons[id].content);
        if ($(`.fr-element.fr-view p`).text() === ``) $(`.fr-element.fr-view p`).empty();

        $(`span.fr-placeholder`).empty();
        $(`div.fr-element.fr-view p`).append(template(data));
        $(`a.overlay-titleCloser`).trigger(`click`);

        if (send == true) {
            editThreadData(buttons[id].prefix, buttons[id].status);
            $(`.button--icon.button--icon--reply.rippleButton`).trigger(`click`);
        }
    }

    async function getThreadData() {
        const authorID = $(`a.username`)[0].attributes[`data-user-id`].nodeValue;
        const authorName = $(`a.username`).html();
        const hours = new Date().getHours();
        const greeting = 4 < hours && hours <= 11
            ? `Доброе утро`
            : 11 < hours && hours <= 15
                ? `Добрый день`
                : 15 < hours && hours <= 21
                    ? `Добрый вечер`
                    : `Доброй ночи`

        return {
            user: {
                id: authorID,
                name: authorName,
                mention: `[USER=${authorID}]${authorName}[/USER]`,
            },
            greeting: greeting
        };
    }

    function editThreadData(prefix, pin = false) {
        // Получаем заголовок темы, так как он необходим при запросе
        const threadTitle = $(`.p-title-value`)[0].lastChild.textContent;

        if (pin == false) {
            fetch(`${document.URL}edit`, {
                method: `POST`,
                body: getFormData({
                    prefix_id: prefix,
                    title: threadTitle,
                    _xfToken: XF.config.csrf,
                    _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                    _xfWithData: 1,
                    _xfResponseType: `json`,
                }),
            }).then(() => location.reload());
        }
        if (pin == true) {
            fetch(`${document.URL}edit`, {
                method: `POST`,
                body: getFormData({
                    prefix_id: prefix,
                    title: threadTitle,
                    sticky: 1,
                    _xfToken: XF.config.csrf,
                    _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                    _xfWithData: 1,
                    _xfResponseType: `json`,
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
// @match        https://docs.google.com/spreadsheets/d/13ADEJLnL4Y9JVhQFX6U0Kirt9gKf93LfjPADw9wfldQ/edit#gid=1928965921
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://forum.blackrussia.online/threads/test.6402380/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=blackrussia.online
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.2458/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=blackrussia.online
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();