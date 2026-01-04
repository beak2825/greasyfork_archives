// ==UserScript==
// @name         PINK | Forum Script for ГС/ЗГС ОПГ
// @namespace    https://openuserjs.org/users/Kingston007
// @version      1.1
// @description  my script
// @author       kayzer
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @icon         https://icons.iconarchive.com/icons/aha-soft/iron-man/48/Ironman-Mask-3-Old-icon.png
// @grant        none
// @license      ISC
// @downloadURL https://update.greasyfork.org/scripts/503228/PINK%20%7C%20Forum%20Script%20for%20%D0%93%D0%A1%D0%97%D0%93%D0%A1%20%D0%9E%D0%9F%D0%93.user.js
// @updateURL https://update.greasyfork.org/scripts/503228/PINK%20%7C%20Forum%20Script%20for%20%D0%93%D0%A1%D0%97%D0%93%D0%A1%20%D0%9E%D0%9F%D0%93.meta.js
// ==/UserScript==

(async function () {
    'use strict';
    const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
    const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
    const PIN_PREFIX = 2; // Prefix that will be set when thread pins
    const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
    const WATCHED_PREFIX = 9;
    const CLOSE_PREFIX = 7;
    const data = await getThreadData(),
        greeting = data.greeting,
        user = data.user;
    const buttons = [
         {
            title: "Одобрен Старший Состав",
            content: `[SIZE=4][FONT=georgia][CENTER]Здравствуйте![/CENTER]<br>` +
                    `[CENTER]Ваш Анти блат получил статус [COLOR=green]Одобрено.[/COLOR][/CENTER][/FONT][/SIZE]`,
        },
        {
            title: "Одобрено",
            content: `[SIZE=4][FONT=georgia][CENTER]Здравствуйте![/CENTER]<br>` +
                    `[CENTER]Анти-блат на Bizwar состав получил статус [COLOR=green]Одобрено.[/COLOR][/CENTER][/FONT][/SIZE]`,
        },
        {
            title: "Привязки к аккаунту не совпадают с ВК в АБ",
            content: `[SIZE=4][FONT=georgia][CENTER]Здравствуйте![/CENTER]<br>` +
                    `[CENTER]Анти-блат на Bizwar состав получил статус [COLOR=red]Отказано.[/COLOR]<br><br>` +
                    `Причина: Привязки к аккаунту не совпадают с ВК в АБ.[/CENTER][/FONT][/SIZE]`,
        },
        {
            title: "Не привязан ВК",
            content: `[SIZE=4][FONT=georgia][CENTER]Здравствуйте![/CENTER]<br>` +
                    `[CENTER]Анти-блат на Bizwar состав получил статус [COLOR=red]Отказано.[/COLOR]<br><br>` +
                    `Причина: Не привязан ВК, пусть игрок привяжет к аккаунту ВК и переподайте АБ.[/CENTER][/FONT][/SIZE]`,
        },
        {
            title: "Уровень меньше 4-ого",
            content: `[SIZE=4][FONT=georgia][CENTER]Здравствуйте![/CENTER]<br>` +
                    `[CENTER]Анти-блат на Bizwar состав получил статус [COLOR=red]Отказано.[/COLOR]<br><br>` +
                    `Причина: Игровой уровень должен быть не менее 4-го.[/CENTER][/FONT][/SIZE]`,
        },
        {
            title: "На рассмотрении",
            content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}![/CENTER]<br>` +
                `[CENTER]Ваша жалоба взята на рассмотрение.<br><br>` +
                `Пожалуйста ожидайте ответа.<br>` +
                `[COLOR=orange]На рассмотрении.[/COLOR][/CENTER][/FONT][/SIZE]`,
            prefix: PIN_PREFIX,
            status: true,
        },
        {
            title: "Проведена беседа",
            content:  `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}![/CENTER]<br>` +
                 `[CENTER]Благодарим за ваше обращение!<br>` +
                 `С лидером будет проведена профилактическая беседа.<br>` +
                 `[COLOR=lightgreen]Одобрено[/COLOR], закрыто.[/CENTER][/FONT][/SIZE]`,
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: "Получит наказание",
            content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}![/CENTER]<br>` +
                `[CENTER]Благодарим за ваше обращение!<br>` +
                `Лидер получит соответствующее наказание.<br>` +
                `[COLOR=lightgreen]Одобрено[/COLOR], закрыто.[/CENTER][/FONT][/SIZE]`,
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: "Жалоба не по форме",
            content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}![/CENTER]<br><br>` +
                `[CENTER]Жалоба составлена не по форме. Внимательно прочитайте правила составления жалобы, которые закреплены в этом разделе.<br><br>` +
                `[COLOR=red]Отказано[/COLOR], закрыто.[/CENTER][/FONT][/SIZE]`,
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: "В раздел ЖБ на сотрудников",
            content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}![/CENTER]<br><br>` +
                `[CENTER]Ошиблись разделом, пожалуйста, напишите свою жалобу в раздел «Жалобы на сотрудников».<br>` +
                `[COLOR=red]Отказано[/COLOR], закрыто.[/CENTER][/FONT][/SIZE]`,
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: "В раздел ЖБ на администрацию",
            content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}![/CENTER]<br><br>` +
                `[CENTER]Ошиблись разделом, пожалуйста, напишите свою жалобу в раздел «Жалобы на администрацию».<br>` +
                `[COLOR=red]Отказано[/COLOR], закрыто.[/CENTER][/FONT][/SIZE]`,
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: "Не является ЛД",
            content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}![/CENTER]<br><br>` +
                `[CENTER]Данный игрок больше не является лидером или им не является на данный момент времени.<br>` +
                `[COLOR=red]Отказано[/COLOR], закрыто.[/CENTER][/FONT][/SIZE]`,
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: "Лидер будет снят",
            content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}![/CENTER]<br><br>` +
                 `[CENTER]Благодарим за ваше обращение!<br>` +
                `[CENTER]Лидер будет снят!<br>` +
                 `[COLOR=lightgreen]Одобрено[/COLOR], закрыто.[/CENTER][/FONT][/SIZE]`,
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: "Недостаточно доказательств",
            content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}![/CENTER]<br><br>` +
            `[CENTER]Недостаточно доказательств, которые подтверждают нарушение.<br>` +
             `[COLOR=red]Отказано[/COLOR], закрыто.[/CENTER][/FONT][/SIZE]`,
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: "Нет нарушения",
            content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}![/CENTER]<br><br>` +
            `[CENTER]Исходя из выше приложенных доказательств, нарушение со стороны лидера - не имеется!<br>` +
            `[COLOR=red]Отказано[/COLOR], закрыто.[/CENTER][/FONT][/SIZE]`,
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: "Ошибка в соц.сети",
            content: `[SIZE=5][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}![/CENTER]<br><br>` +
                `"Пожалуйста внимательно прочитайте тему «[URL=https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-лидеров.2639616/]Правила подачи жалоб на администрацию[/URL]».<br><br>` +
                `Обратите своё внимание на данный пункт правил —` +
                `[SIZE=4][QUOTE]3.6. Прикрепление доказательств обязательно. Примечание: загрузка доказательств в соц. сети (ВКонтакте, Instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, Imgur).[/QUOTE][COLOR=red]Отказано[/COLOR], закрыто.[/SIZE][CENTER][/FONT][/SIZE]`,
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: "Тех раздел",
            content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}![/CENTER]<br><br>` +
            `[CENTER]Вы ошиблись разделом. Пожалуйста, обратитесь а Технической раздел.<br>` +
            `[COLOR=red]Отказано[/COLOR], закрыто.[/CENTER][/FONT][/SIZE]`,
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
    ];


    $(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
        $(`body`).append(`<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`);

        // Добавление кнопок при загрузке страницы
        addButton(`На рассмотрение`, `pin`);
        addButton(`Одобрено`, `accepted`);
        addButton(`Отказано`, `unaccept`);
        addButton(`Ответы`, `selectAnswer`);


        // Поиск информации о теме
        const threadData = getThreadData();

        $(`button#pin`).click(() => editThreadData(PIN_PREFIX, true));
        $(`button#accepted`).click(() => editThreadData(ACCEPT_PREFIX, false));
        $(`button#teamProject`).click(() => editThreadData(COMMAND_PREFIX, true));
        $(`button#unaccept`).click(() => editThreadData(UNACCEPT_PREFIX, false));
        $(`button#selectAnswer`).click(() => {
            XF.alert(buttonsMarkup(buttons), null, `Выберите ответ:`);
            buttons.forEach((btn, id) => {
                console.log(btn)
                if (id > 3) {
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
        // Глобальный счётчик для ID
        let idCounter = 0;

        // Разделение кнопок на категории
        const categories = {
            applications: buttons.filter(btn =>
                                         btn.title.includes('Одобрено') ||
                                         btn.title.includes('Привязки к аккаунту не совпадают с ВК в АБ') ||
                                         btn.title.includes('Не привязан ВК') ||
                                         btn.title.includes('Уровень меньше 4-ого')
                                        ),
            complaints: buttons.filter(btn =>
                                       btn.title.includes('На рассмотрении') ||
                                       btn.title.includes('Проведена беседа') ||
                                       btn.title.includes('Получит наказание') ||
                                       btn.title.includes('Жалоба не по форме') ||
                                       btn.title.includes('В раздел ЖБ') ||
                                       btn.title.includes('Не является ЛД') ||
                                       btn.title.includes('Лидер будет снят') ||
                                       btn.title.includes('Недостаточно док-вы') ||
                                       btn.title.includes('Нет нарушения') ||
                                       btn.title.includes('Опра в соц.сети') ||
                                       btn.title.includes('Тех раздел')
                                      ),
             conversations: buttons.filter(btn =>
                                         btn.title.includes('Одобрен Старший состав')                                 
                                      )
        };

        return `
        <div class="select_answer" style="display: flex; flex-direction: column; gap: 20px;">
            ${Object.entries(categories).map(([category, btns]) => {
            let categoryName;
            switch (category) {
                case 'conversations':
                    categoryName = АнтиБлат;
                    break;
                case 'applications':
                    categoryName = 'АнтиБлат Bizwar';
                    break;
                case 'complaints':
                    categoryName = 'Ответы на жалобы';
                    break;
                default:
                    categoryName = 'Другие';
            }
            return `
                    <div class="${category}" style="display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 10px;">
                        <h3 style="width: 100%; text-align: center;">${categoryName}</h3>
                        ${btns.map(btn => { // Передаем btn в функцию map
                const btnId = idCounter++; // Использование и увеличение глобального счётчика
                return `
                                <button id="answers-${btnId}" class="button--primary button rippleButton" style="margin: 5px;">
                                    <span class="button-text">${btn.title}-${btnId}</span>
                                </button>
                            `;
            }).join('')}
                    </div>
                `;
        }).join('')}
        </div>
    `;
    }
    function pasteContent(id, data = {}, send = false) {
        const template = Handlebars.compile(buttons[id].content);
        const contentToAdd = template(data);

        // Убираем placeholder, если он есть
        $(`span.fr-placeholder`).empty();

        // Проверяем, содержит ли текстовое поле уже этот контент
        const contentArea = $(`div.fr-element.fr-view p`).last();
        const currentContent = contentArea.html();

        if (!currentContent.includes(contentToAdd.trim())) {
            if (currentContent !== '') {
                // Если поле не пустое, добавляем новый контент с отступом
                contentArea.append('<br>' + contentToAdd);
            } else {
                // Если поле пустое, просто вставляем контент
                contentArea.append(contentToAdd);
            }
        }

        $(`a.overlay-titleCloser`).trigger(`click`);

        if (send) {
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