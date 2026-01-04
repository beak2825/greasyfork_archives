// ==UserScript==
// @name         KURSK | Forum Script для СХ by D.Kalashnikov
// @namespace    https://forum.blackrussia.online
// @version      1.1
// @description  Forum script 
// @author       Don_Kalashnikov
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @icon         https://icons.iconarchive.com/icons/aha-soft/iron-man/48/Ironman-Mask-3-Old-icon.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474733/KURSK%20%7C%20Forum%20Script%20%D0%B4%D0%BB%D1%8F%20%D0%A1%D0%A5%20by%20DKalashnikov.user.js
// @updateURL https://update.greasyfork.org/scripts/474733/KURSK%20%7C%20Forum%20Script%20%D0%B4%D0%BB%D1%8F%20%D0%A1%D0%A5%20by%20DKalashnikov.meta.js
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
    const data = await getThreadData(),
        greeting = data.greeting,
        user = data.user;
    const buttons = [
        {
            title: `Одобрен неактив`,
            content:
               `[CENTER] [CENTER][FONT=georgia][SIZE=4][COLOR=rgb(97, 189, 109)]Одобрено,[/COLOR] ждём вашего[COLOR=rgb(250, 197, 28)] [U]возвращения[/U]![/COLOR][/SIZE][/FONT]<br>`+
                              `[SIZE=4][FONT=georgia][SIZE=4] С уважением [COLOR=rgb(158, 28, 0)]Администратор сервера [/COLOR] [color=red] KURSK.[/SIZE][/FONT][/CENTER]<br>`+
                 "[HEADING=3][CENTER][I][B][I][COLOR=rgb(255, 255, 255)][SIZE=5][FONT=georgia][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]Black Russia[/COLOR] [/FONT][/SIZE][/COLOR][COLOR=rgb(158, 28, 0)][SIZE=5][FONT=georgia]KURSK[/FONT][/SIZE][/COLOR][COLOR=rgb(158, 28, 0)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]"
        },
       {
            title: `Отказан неактив 2 дня`,
            content:
               `[CENTER][B][I][I][I][SIZE=4][FONT=georgia][COLOR=rgb(226, 80, 65)]Отказано[/COLOR],[COLOR=rgb(255, 255, 255)] [U]Причина:[/U][/COLOR] неактив [COLOR=rgb(250, 197, 28)][U]запрещено[/U][/COLOR] брать первые [COLOR=rgb(250, 197, 28)][U]2 дня[/U][/COLOR] после [COLOR=rgb(250, 197, 28)][U]постановления [/U][/COLOR]на пост.[/FONT][/SIZE][/I][/I][/I][/B]<br><br>`+
                             `[SIZE=4][FONT=georgia][SIZE=4] С уважением [COLOR=rgb(158, 28, 0)]Администратор сервера [/COLOR] [color=red] KURSK.[/SIZE][/FONT][/CENTER]<br>`+
                 "[HEADING=3][CENTER][I][B][I][COLOR=rgb(255, 255, 255)][SIZE=5][FONT=georgia][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]Black Russia[/COLOR] [/FONT][/SIZE][/COLOR][COLOR=rgb(158, 28, 0)][SIZE=5][FONT=georgia]KURSK[/FONT][/SIZE][/COLOR][COLOR=rgb(158, 28, 0)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]"
        },
        {
            title: `Отказан неактив 3 дня макс`,
            content:
               `[CENTER][B][I][I][I][SIZE=4][FONT=georgia][COLOR=rgb(226, 80, 65)]Отказано[/COLOR],[COLOR=rgb(255, 255, 255)] [U]Причина:[/U][/COLOR] неактив [COLOR=rgb(250, 197, 28)][U]запрещено[/U][/COLOR] брать больше одного раза в неделю и [COLOR=rgb(250, 197, 28)][U]до 3-х дней [COLOR=rgb(250, 197, 28)][U]максимум.[/FONT][/SIZE][/I][/I][/I][/B]<br><br>`+
                              `[SIZE=4][FONT=georgia][SIZE=4] С уважением [COLOR=rgb(158, 28, 0)]Администратор сервера [/COLOR] [color=red] KURSK.[/SIZE][/FONT][/CENTER]<br>`+
                 "[HEADING=3][CENTER][I][B][I][COLOR=rgb(255, 255, 255)][SIZE=5][FONT=georgia][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]Black Russia[/COLOR] [/FONT][/SIZE][/COLOR][COLOR=rgb(158, 28, 0)][SIZE=5][FONT=georgia]KURSK[/FONT][/SIZE][/COLOR][COLOR=rgb(158, 28, 0)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]"
        },
        {
            title: `Отказан неактив время`,
            content:
               `[CENTER][B][I][I][I][SIZE=4][FONT=georgia][COLOR=rgb(226, 80, 65)]Отказано[/COLOR],[COLOR=rgb(255, 255, 255)] [U]Причина:[/U][/COLOR] неактив [COLOR=rgb(250, 197, 28)][U]запрещено[/U][/COLOR] брать после 21:00 по МСК.[/FONT][/SIZE][/I][/I][/I][/B]<br><br>`+
                               `[SIZE=4][FONT=georgia][SIZE=4] С уважением [COLOR=rgb(158, 28, 0)]Администратор сервера [/COLOR] [color=red] KURSK.[/SIZE][/FONT][/CENTER]<br>`+
                 "[HEADING=3][CENTER][I][B][I][COLOR=rgb(255, 255, 255)][SIZE=5][FONT=georgia][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]Black Russia[/COLOR] [/FONT][/SIZE][/COLOR][COLOR=rgb(158, 28, 0)][SIZE=5][FONT=georgia]KURSK[/FONT][/SIZE][/COLOR][COLOR=rgb(158, 28, 0)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]"
        },
        {
            title: `Одобрено С выга`,
            content:
               `[CENTER] [CENTER][B][I][I][FONT=georgia][SIZE=4][COLOR=rgb(97, 189, 109)]Одобрено,[/COLOR] строгий выговор будет снят, а[COLOR=rgb(250, 197, 28)] [U]баллы списаны[/U]![/COLOR][/SIZE][/FONT][/I][/I][/B]<br><br>`+
                  `[SIZE=4][FONT=georgia][SIZE=4] С уважением [COLOR=rgb(158, 28, 0)]Администратор сервера [/COLOR] [color=black] KURSK.[/SIZE][/FONT][/CENTER]<br>`+
                 "[HEADING=3][CENTER][I][B][I][COLOR=rgb(255, 255, 255)][SIZE=5][FONT=georgia][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]Black Russia[/COLOR] [/FONT][/SIZE][/COLOR][COLOR=rgb(158, 28, 0)][SIZE=5][FONT=georgia]KURSK[/FONT][/SIZE][/COLOR][COLOR=rgb(158, 28, 0)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]"
        },
        {
            title: `Одобрено С устн`,
            content:
               `[CENTER] [CENTER][B][I][I][FONT=georgia][SIZE=4][COLOR=rgb(97, 189, 109)]Одобрено,[/COLOR] устное препупреждение будет снято, а[COLOR=rgb(250, 197, 28)] [U]баллы списаны[/U]![/COLOR][/SIZE][/FONT][/I][/I][/B]<br><br>`+
                                `[SIZE=4][FONT=georgia][SIZE=4] С уважением [COLOR=rgb(158, 28, 0)]Администратор сервера [/COLOR] [color=red] KURSK.[/SIZE][/FONT][/CENTER]<br>`+
                 "[HEADING=3][CENTER][I][B][I][COLOR=rgb(255, 255, 255)][SIZE=5][FONT=georgia][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]Black Russia[/COLOR] [/FONT][/SIZE][/COLOR][COLOR=rgb(158, 28, 0)][SIZE=5][FONT=georgia]KURSK[/FONT][/SIZE][/COLOR][COLOR=rgb(158, 28, 0)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]"
        },
        {
            title: `Одобрено уст и выг`,
            content:
               `[CENTER][B][I][I][FONT=georgia][SIZE=4][COLOR=rgb(97, 189, 109)]Одобрено,[/COLOR] строгий выговор и устное предупреждение будет снято, а[COLOR=rgb(250, 197, 28)] [U]баллы списаны[/U]![/COLOR][/SIZE][/FONT][/I][/I][/B]<br><br>`+
                             `[SIZE=4][FONT=georgia][SIZE=4] С уважением [COLOR=rgb(158, 28, 0)]Администратор сервера [/COLOR] [color=red] KURSK.[/SIZE][/FONT][/CENTER]<br>`+
                 "[HEADING=3][CENTER][I][B][I][COLOR=rgb(255, 255, 255)][SIZE=5][FONT=georgia][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]Black Russia[/COLOR] [/FONT][/SIZE][/COLOR][COLOR=rgb(158, 28, 0)][SIZE=5][FONT=georgia]KURSK[/FONT][/SIZE][/COLOR][COLOR=rgb(158, 28, 0)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]"
        },
        {
            title: `Отказан выг`,
            content:
               `[CENTER][B][I][I][I][SIZE=4][FONT=georgia][COLOR=rgb(226, 80, 65)]Отказано[/COLOR],[COLOR=rgb(255, 255, 255)] [U]Причина:[/U][/COLOR] недосточное [COLOR=rgb(250, 197, 28)][U]количество баллов[/U][/COLOR] для снятия строгого выговора.[/FONT][/SIZE][/I][/I][/I][/B]<br><br>`+
                              `[SIZE=4][FONT=georgia][SIZE=4] С уважением [COLOR=rgb(158, 28, 0)]Администратор сервера [/COLOR] [color=red] KURSK.[/SIZE][/FONT][/CENTER]<br>`+
                 "[HEADING=3][CENTER][I][B][I][COLOR=rgb(255, 255, 255)][SIZE=5][FONT=georgia][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]Black Russia[/COLOR] [/FONT][/SIZE][/COLOR][COLOR=rgb(158, 28, 0)][SIZE=5][FONT=georgia]KURSK[/FONT][/SIZE][/COLOR][COLOR=rgb(158, 28, 0)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]]"
        },
        {
            title: `Отказан устн выг`,
            content:
               `[CENTER][B][I][I][I][SIZE=4][FONT=georgia][COLOR=rgb(226, 80, 65)]Отказано[/COLOR],[COLOR=rgb(255, 255, 255)] [U]Причина:[/U][/COLOR] недосточное [COLOR=rgb(250, 197, 28)][U]количество баллов[/U][/COLOR] для снятия устного предупреждения.[/FONT][/SIZE][/I][/I][/I][/B]<br><br>`+
                               `[SIZE=4][FONT=georgia][SIZE=4] С уважением [COLOR=rgb(158, 28, 0)]Администратор сервера [/COLOR] [color=red] KURSK.[/SIZE][/FONT][/CENTER]<br>`+
                 "[HEADING=3][CENTER][I][B][I][COLOR=rgb(255, 255, 255)][SIZE=5][FONT=georgia][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]Black Russia[/COLOR] [/FONT][/SIZE][/COLOR][COLOR=rgb(158, 28, 0)][SIZE=5][FONT=georgia]KURSK[/FONT][/SIZE][/COLOR][COLOR=rgb(158, 28, 0)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]]"
        },
        {
            title: `Отказан ошбк тема`,
            content:
               `[CENTER][B][I][I][I][SIZE=4][FONT=georgia][COLOR=rgb(226, 80, 65)]Отказано[/COLOR],[COLOR=rgb(255, 255, 255)] [U]Причина:[/U][/COLOR] вы ошиблись нужной вам темой. [/FONT][/SIZE][/I][/I][/I][/B]<br><br>`+
                               `[SIZE=4][FONT=georgia][SIZE=4] С уважением [COLOR=rgb(158, 28, 0)]Администратор сервера [/COLOR] [color=red] KURSK.[/SIZE][/FONT][/CENTER]<br>`+
                 "[HEADING=3][CENTER][I][B][I][COLOR=rgb(255, 255, 255)][SIZE=5][FONT=georgia][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]Black Russia[/COLOR] [/FONT][/SIZE][/COLOR][COLOR=rgb(158, 28, 0)][SIZE=5][FONT=georgia]KURSK[/FONT][/SIZE][/COLOR][COLOR=rgb(158, 28, 0)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]"
        },
        {
            title: `Одобрено обм баллов`,
            content:
               `[CENTER][B][SIZE=4][FONT=georgia][COLOR=rgb(97, 189, 109)]Одобрено[/COLOR], [COLOR=rgb(250, 197, 28)][U]свяжусь с вами[/U][/COLOR] для дальнейшей [COLOR=rgb(250, 197, 28)][U]информации.[/U][/COLOR][/FONT][/SIZE][/B]<br><br>`+
                             `[SIZE=4][FONT=georgia][SIZE=4] С уважением [COLOR=rgb(158, 28, 0)]Администратор сервера [/COLOR] [color=red] KURSK.[/SIZE][/FONT][/CENTER]<br>`+
                 "[HEADING=3][CENTER][I][B][I][COLOR=rgb(255, 255, 255)][SIZE=5][FONT=georgia][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]Black Russia[/COLOR] [/FONT][/SIZE][/COLOR][COLOR=rgb(158, 28, 0)][SIZE=5][FONT=georgia]KURSK[/FONT][/SIZE][/COLOR][COLOR=rgb(158, 28, 0)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]"
        },
        {
            title: `Не АП`,
            content:
               `[CENTER][B][FONT=georgia][SIZE=4][COLOR=rgb(235, 107, 86)]Отказано[/COLOR],[I] [U]Причина:[/U][/I] вы не являетесь Агентом Поддержки.[/SIZE][/FONT][/B]<br><br>`+
                             `[SIZE=4][FONT=georgia][SIZE=4] С уважением [COLOR=rgb(158, 28, 0)]Администратор сервера [/COLOR] [color=red] KURSK.[/SIZE][/FONT][/CENTER]<br>`+
                 "[HEADING=3][CENTER][I][B][I][COLOR=rgb(255, 255, 255)][SIZE=5][FONT=georgia][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]Black Russia[/COLOR] [/FONT][/SIZE][/COLOR][COLOR=rgb(158, 28, 0)][SIZE=5][FONT=georgia]KURSK[/FONT][/SIZE][/COLOR][COLOR=rgb(158, 28, 0)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]"
        },
        {
            title: `Одобрено выше`,
            content:
               `[CENTER][B][SIZE=4][FONT=georgia][COLOR=rgb(250, 197, 28)][U]Все выше[/U][/COLOR] получает статус [COLOR=rgb(97, 189, 109)]"Одобрено".[/COLOR][/FONT][/SIZE][/B]`+
                                   `[SIZE=4][FONT=georgia][SIZE=4] С уважением [COLOR=rgb(158, 28, 0)]Администратор сервера [/COLOR] [color=red] KURSK.[/SIZE][/FONT][/CENTER]<br>`+
                 "[HEADING=3][CENTER][I][B][I][COLOR=rgb(255, 255, 255)][SIZE=5][FONT=georgia][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]Black Russia[/COLOR] [/FONT][/SIZE][/COLOR][COLOR=rgb(158, 28, 0)][SIZE=5][FONT=georgia]KURSK[/FONT][/SIZE][/COLOR][COLOR=rgb(158, 28, 0)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]"
        },
       {
            title: `Одобрена жб`,
            content:
           `[CENTER][B][FONT=georgia][SIZE=4][COLOR=rgb(97, 189, 109)]Одобрено[/COLOR], [COLOR=rgb(243, 121, 52)]Агент Поддержки[/COLOR] [COLOR=rgb(250, 197, 28)][U]будет проинструктирован [/U][/COLOR]по поводу[COLOR=rgb(250, 197, 28)][U] данной ситуации.[/U][/COLOR][/SIZE][/FONT][/B]<br>`+
           `[FONT=georgia][SIZE=4][B][COLOR=rgb(250, 197, 28)][U]Приносим свои извинения[/U][/COLOR] за предоставленные неудобства в[COLOR=rgb(250, 197, 28)][U] решении вашего вопроса[/U][/COLOR] (И[I]спользуйте[/I] [COLOR=rgb(250, 197, 28)]/cameditgui[/COLOR]).[/B][/SIZE][/FONT]<br>`+
           `[B][FONT=georgia][SIZE=4]Благодарим за бдительность.[/SIZE][/FONT][/B]<br>`+
                               `[SIZE=4][FONT=georgia][SIZE=4] С уважением [COLOR=rgb(158, 28, 0)]Администратор сервера [/COLOR] [color=red] KURSK.[/SIZE][/FONT][/CENTER]<br>`+
                 "[HEADING=3][CENTER][I][B][I][COLOR=rgb(255, 255, 255)][SIZE=5][FONT=georgia][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]Black Russia[/COLOR] [/FONT][/SIZE][/COLOR][COLOR=rgb(158, 28, 0)][SIZE=5][FONT=georgia]KURSK[/FONT][/SIZE][/COLOR][COLOR=rgb(158, 28, 0)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]"
},
{
            title: `Отказ собрание`,
            content:
           `[CENTER][B][FONT=georgia][SIZE=4][COLOR=rgb(235, 107, 86)]Отказано[/COLOR],[I] [U]Причина:[/U][/I] на [COLOR=rgb(250, 197, 28)][U]данную дату[/U][/COLOR] собрание [COLOR=rgb(250, 197, 28)][U]не планировалось.[/U][/COLOR][/SIZE][/FONT][/B]<br><br>`+
                               `[SIZE=4][FONT=georgia][SIZE=4] С уважением [COLOR=rgb(158, 28, 0)]Администратор сервера [/COLOR] [color=red] KURSK.[/SIZE][/FONT][/CENTER]<br>`+
                 "[HEADING=3][CENTER][I][B][I][COLOR=rgb(255, 255, 255)][SIZE=5][FONT=georgia][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR] [COLOR=rgb(0, 0, 0)]Black Russia[/COLOR] [/FONT][/SIZE][/COLOR][COLOR=rgb(158, 28, 0)][SIZE=5][FONT=georgia]KURSK[/FONT][/SIZE][/COLOR][COLOR=rgb(158, 28, 0)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]"
},


    ];

    $(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
        $(`body`).append(`<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`);

        // Добавление кнопок при загрузке страницы
         addButton(`Ответы`, `selectAnswer`);
        // Поиск информации о теме
        const threadData = getThreadData();

        $(`button#pin`).click(() => editThreadData(PIN_PREFIX, true));
        $(`button#accepted`).click(() => editThreadData(ACCEPT_PREFIX, false));
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
                if (id > 20) {
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
})();
