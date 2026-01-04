// ==UserScript==
// @name         Скрипт ЗГА 18
// @namespace    https://forum.blackrussia.online
// @version      1.1
// @description  Script ZGA 18
// @author       babaenko
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @icon         https://freepngimg.com/thumb/eagle/20-eagle-black-siluet-png-image-download-thumb.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545312/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%97%D0%93%D0%90%2018.user.js
// @updateURL https://update.greasyfork.org/scripts/545312/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%97%D0%93%D0%90%2018.meta.js
// ==/UserScript==
(async function () {
    `use strict`;
    const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
    const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
    const PIN_PREFIX = 2; // Prefix that will be set when thread pins
    const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
    const WATCHED_PREFIX = 9;
    const CLOSE_PREFIX = 7;
    const SPECIAL_PREFIX = 11;
    const GA_PREFIX = 12;
    const TECH_PREFIX = 13;
    const OJIDANIE_PREFIX = 14;
    const data = await getThreadData(),
          greeting = data.greeting,
          user = data.user;
    const buttons = [
       {
      title: '―――――――――――――――――――――ОТВЕТЫ ОБЖАЛОВАНИЯ――――――――――――――――――――',
	},
       {
	   title: `НЕ ПО ФОРМЕ`,
	    content:  `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый(-ая)[/COLOR] ${user.mention}<br><br>`+
        `Обжалование составлено не по форме, ознакомьтесь с правилой подачи обжалований и создайте новую тему.[/CENTER]<br><br>`+
        `[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER][/FONT][/SIZE]<br>`,
	  prefix: CLOSE_PREFIX,
    status: false,
      },
       {
	   title: `НЕ ОБЖАЛУЕТСЯ`,
	    content:  `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый(-ая)[/COLOR] ${user.mention}<br><br>`+
        `Наказание, которое вы хотите обжаловать, обжалованию не подлежит.[/CENTER]<br><br>`+
        `[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER][/FONT][/SIZE]<br>`,
	  prefix: CLOSE_PREFIX,
    status: false,
      },
       {
	   title: `ОТКАЗАТЬ`,
	    content:  `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый(-ая)[/COLOR] ${user.mention}<br><br>`+
        `Ваше обжалование рассмотрено, и принято решение об отказе в обжаловании.[/CENTER]<br><br>`+
        `[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/CENTER][/FONT][/SIZE]<br>`,
	  prefix: UNACCEPT_PREFIX,
    status: false,
      },
       {
	   title: `ОДОБРИТЬ`,
	    content:  `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый(-ая)[/COLOR] ${user.mention}<br><br>`+
        `Ваше обжалование рассмотрено, и принято решение об сокращении вашего наказания.[/CENTER]<br><br>`+
        `[CENTER][COLOR=rgb(102, 255, 0)]Одобрено.[/COLOR][/CENTER][/FONT][/SIZE]<br>`,
	  prefix: ACCEPT_PREFIX,
    status: false,
      },
       {
	   title: `НА РАССМОТРЕНИИ`,
	    content:  `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый(-ая)[/COLOR] ${user.mention}<br><br>`+
        `Ваше обжалование взято на рассмотрение, ожидайте решения.[/CENTER]<br><br>`+
        `[CENTER][COLOR=rgb(251, 160, 38)]На рассмотрении.[/COLOR][/CENTER][/FONT][/SIZE]<br>`,
	  prefix: PIN_PREFIX,
    tatus: true,
      },
       {
	   title: `МИНИМАЛЬНОЕ`,
	    content:  `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый(-ая)[/COLOR] ${user.mention}<br><br>`+
        `За ваше нарушение администратор уже выдал вам минимальное наказание, уменьшить его срок не получится.[/CENTER]<br><br>`+
        `[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/CENTER][/FONT][/SIZE]<br>`,
	  prefix: UNACCEPT_PREFIX,
    status: false,
      },
       {
	   title: `СМЕНА НИКА`,
	    content:  `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый(-ая)[/COLOR] ${user.mention}<br><br>`+
        `Ваш аккаунт разблокирован на 24 часа, за это время вы должны успеть сменить свой ник за донат.[/CENTER]<br><br>`+
        `[CENTER][COLOR=rgb(251, 160, 38)]На рассмотрении.[/COLOR][/CENTER][/FONT][/SIZE]<br>`,
	  prefix: PIN_PREFIX,
    status: true,
      },
       {
	   title: `ВОЗМЕЩЕНИЕ+`,
	    content:  `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый(-ая)[/COLOR] ${user.mention}<br><br>`+
        `Аккаунт игрока разблокирован на 24 часа, за это время игрок должен успеть возместить вам ущерб на фрапс с /time, данный фрапс вам необходимо прикрепить к данной теме.[/CENTER]<br><br>`+
        `[CENTER][COLOR=rgb(251, 160, 38)]На рассмотрении.[/COLOR][/CENTER][/FONT][/SIZE]<br>`,
	  prefix: PIN_PREFIX,
    status: true,
      },
       {
	   title: `ВОЗМЕЩЕНИЕ-`,
	    content:  `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый(-ая)[/COLOR] ${user.mention}<br><br>`+
        `Если вы готовы возместить ущерб обманутой стороне, свяжитесь с игроком любым способом, для возврата имущества он должен оформить обжалование.[/CENTER]<br><br>`+
        `[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER][/FONT][/SIZE]<br>`,
	  prefix: CLOSE_PREFIX,
    status: false,
      },
  {
	   title: `ДОКВА НЕ РАБОТАЮТ`,
	    content:  `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый(-ая)[/COLOR] ${user.mention}<br><br>`+
        `Доказательства, которые вы прикрепили не работают, загрузите ваши доказательства на другой хостинг.[/CENTER]<br><br>`+
        `[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER][/FONT][/SIZE]<br>`,
	  prefix: CLOSE_PREFIX,
    status: false,
      },
       {
	   title: `НЕТ ДОКВ/ОКНО БАНА`,
	    content:  `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый(-ая)[/COLOR] ${user.mention}<br><br>`+
        `Не увидел доказательств от вас, зайдите в игру и сделайте скриншот окна с баном, после чего заново напишите обжалование.[/CENTER]<br><br>`+
        `[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER][/FONT][/SIZE]<br>`,
	  prefix: CLOSE_PREFIX,
    status: false,
      },
       {
	   title: `СОЦ СЕТИ`,
	    content:  `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый(-ая)[/COLOR] ${user.mention}<br><br>`+
        `Доказательства, которые вы прикрепии к обжалованию находятся в соц сетях, загрузите ваши доказательства на любой фото-хостинг.[/CENTER]<br><br>`+
        `[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER][/FONT][/SIZE]<br>`,
	  prefix: CLOSE_PREFIX,
    status: false,
      },
       {
	   title: `ДУБЛИРОВАНИЕ`,
	    content:  `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый(-ая)[/COLOR] ${user.mention}<br><br>`+
        `Напоминаю, за дублирование тем я могу заблокировать ваш форумный аккаунт, пожалуйста не создавайте повторяющиеся темы.[/CENTER]<br><br>`+
        `[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER][/FONT][/SIZE]<br>`,
	  prefix: CLOSE_PREFIX,
    status: false,
      },
       {
	   title: `ССЫЛКА НА ВК`,
	    content:  `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый(-ая)[/COLOR] ${user.mention}<br><br>`+
        `Прикрепите к вашим доказательтвам ссылку на вашу страницу в vk.[/CENTER]<br><br>`+
        `[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER][/FONT][/SIZE]<br>`,
	  prefix: CLOSE_PREFIX,
    status: false,
      },
       {
	   title: `ДРУГОЙ СЕРВЕР`,
	    content:  `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый(-ая)[/COLOR] ${user.mention}<br><br>`+
        `Вы ошиблись сервером, переношу ваше обращение в нужный раздел.[/CENTER]<br><br>`+
        `[CENTER][COLOR=rgb(251, 160, 38)]Ожидайте ответа администрации сервера.[/COLOR][/CENTER][/FONT][/SIZE]<br>`,
      },
       {
	   title: `В ЖБ НА АДМ`,
	    content:  `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый(-ая)[/COLOR] ${user.mention}<br><br>`+
        `Внимательно ознакомившись с вашей жалобой, было решено, что вам нужно обраться в раздел жалоб на администрацию.[/CENTER]<br><br>`+
        `[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER][/FONT][/SIZE]<br>`,
	  prefix: CLOSE_PREFIX,
    status: false,
      },
       {
	   title: `В ЖБ НА ТЕХА`,
	    content:  `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый(-ая)[/COLOR] ${user.mention}<br><br>`+
        `Внимательно ознакомившись с вашей жалобой, было решено, что вам нужно обраться в раздел жалоб на технического специалиста.[/CENTER]<br><br>`+
        `[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER][/FONT][/SIZE]<br>`,
	  prefix: CLOSE_PREFIX,
    status: false,
      },
       {
	  title: `ДЛЯ ТЁМЫЧА`,
	  content:
		`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый(-ая)[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Передаю ваше обжалование Главному Администратору —  [user=1349399]Artem_Rooall.[/user] <br><br>`+
        `[COLOR=rgb(251, 160, 38)]На рассмотрении.[/COLOR][/CENTER]<br>`,
      prefix: GA_PREFIX,
	  status: true,
    },
       {
         title: `Спецам`,
         content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый(-ая)[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
         `[CENTER][SIZE=4][FONT=georgia]Передаю ваше обжалование - Специальной Администрации.<br><br>`+
         `[COLOR=rgb(251, 160, 38)]На рассмотрении.[/COLOR][/FONT][/SIZE][/CENTER]<br>`,
         prefix: SPECIAL_PREFIX,
         status: true,
     },
        ];
      
      
     $(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
        $(`body`).append(`<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`);

        // Добавление кнопок при загрузке страницы
        addButton(`На рассмотрение`, `pin`);
        addButton(`Одобрено`, `accepted`);
        addButton(`Отказано`, `unaccept`);
        addButton(`Закрыто`, `closed`);
        addButton(`Рассмотрено`, `watched`);
        addButton (`ГА`, `mainAdmin`);
        addButton(`КП`, `teamProject`);
        addButton (`Спецам`, `specialAdmin`);
        addButton(`Ответики`, `selectAnswer`);
        // Поиск информации о теме
        const threadData = getThreadData();

        $(`button#pin`).click(() => editThreadData(PIN_PREFIX, true));
        $(`button#accepted`).click(() => editThreadData( ACCEPT_PREFIX, false));
        $(`button#teamProject`).click(() => editThreadData(COMMAND_PREFIX, true));
        $(`button#unaccept`).click(() => editThreadData(UNACCEPT_PREFIX, false));
        $(`button#watched`).click(() => editThreadData(WATCHED_PREFIX, false));
$(`button#closed`).click(() => editThreadData(CLOSE_PREFIX, false));
         $(`button#specialAdmin`).click(() => editThreadData(SPECIAL_PREFIX, true));
$(`button#mainAdmin`).click(() => editThreadData(GA_PREFIX, true));
$(`button#techspec`).click(() => editThreadData( TECH_PREFIX , true));


        $(`button#selectAnswer`).click(() => {
            XF.alert(buttonsMarkup(buttons), null, `Выберите ответ:`);
            buttons.forEach((btn, id) => {
                if (id > 0) {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
                } else {
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
        // ----------------------------------------------------------------------------------------------------------
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
})();