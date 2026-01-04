// ==UserScript==
// @name         PINK | Script for ГС/ЗГС
// @namespace    https://openuserjs.org/users/Kingston007
// @version      1.26
// @description  Script for ГС/ЗГС
// @author       kayzer
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @icon         https://icons.iconarchive.com/icons/aha-soft/iron-man/48/Ironman-Mask-3-Old-icon.png
// @grant        none
// @license      ISC
// @downloadURL https://update.greasyfork.org/scripts/502908/PINK%20%7C%20Script%20for%20%D0%93%D0%A1%D0%97%D0%93%D0%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/502908/PINK%20%7C%20Script%20for%20%D0%93%D0%A1%D0%97%D0%93%D0%A1.meta.js
// ==/UserScript==
 
(async function () {
    `use strict`;
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
            title: `Одобрено`,
            content: `[SIZE=4][FONT=georgia][CENTER]Здравствуйте![/CENTER]<br>` +
                    `[CENTER] Анти-блат на Bizwar состав получил статус [COLOR=green]Одобрено.[/color][/CENTER][/FONT][/SIZE]`,
            status: false,
        },
        {
            title: `Привязки к аккаунту не совпадает с ВК в АБ`,
            content: `[SIZE=4][FONT=georgia][CENTER]Здравствуйте![/CENTER]<br>` +
                    `[CENTER] Анти-блат на Bizwar состав получил статус [COLOR=red]Отказано[/color].<br><br>` +
                    `Причина: Привязки к аккаунту не совпадает с ВК в АБ.[/CENTER][/FONT][/SIZE]`,
            status: false,
        },
        {
            title: `Не привязан ВК`,
            content: `[SIZE=4][FONT=georgia][CENTER]Здравствуйте![/CENTER]<br>` +
                    `[CENTER] Анти-блат на Bizwar состав получил статус [COLOR=red]Отказано[/color].<br><br>` +
                    `Причина: Не привязан ВК, пусть игрок привяжет к аккаунту ВК и переподайте АБ.[/CENTER][/FONT][/SIZE]`,
            status: false,
        },
        {
            title: `Уровень меньше 4-ого`,
            content: `[SIZE=4][FONT=georgia][CENTER]Здравствуйте![/CENTER]<br>` +
                    `[CENTER] Анти-блат на Bizwar состав получил статус [COLOR=red]Отказано[/color].<br><br>` +
                    `Причина: Игровой уровень должен быть не менее 4-ого.[/CENTER][/FONT][/SIZE]`,
            status: false,
        },
        {
            title: `На рассмотрении`,
            content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}![/CENTER]<br>` +
                `[CENTER] Ваша жалоба взята на рассмотрение.<br><br>` +
                `Пожалуйста ожидайте ответа.<br>` +
                `[COLOR=orange]На рассмотрение.[/color] [/CENTER][/FONT][/SIZE]`,
            prefix: PIN_PREFIX,
            status: true,
        },
        {
            title: `Проведена беседа`,
            content: ` [SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}!<br>` +
                ` Благодарим за ваше обращение!<br>` +
                ` С лидером будет проведена профилактическая беседа.<br>` +
                ` [COLOR=lightgreen]Одобрено[/color],закрыто [/CENTER][/FONT][/SIZE]`,
            prefix: ACCEPT_PREFIX,
            status: true,
        },
        {
            title: `Получит наказание`,
            content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}!<br>` +
                `Благодарим за ваше обращение!<br>` +
                `Лидер получит соответствующие наказание` +
                ` [COLOR=lightgreen]Одобрено[/color],закрыто [/CENTER][/FONT][/SIZE]`,
            prefix: ACCEPT_PREFIX,
            status: true,
        },
        {
            title: `Жалоба не по форме`,
            content:
                `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
                "[CENTER]Жалоба составлена не по форме. Внимательно прочитайте правила составления жалобы, которые закреплены в этом разделе. <br><br>" +
                `[CENTER] [COLOR=red] Отказано[/color], закрыто.[/CENTER][/FONT][/SIZE]`,
            prefix: CLOSE_PREFIX,
            status: true,
        },
        {
            title: `В раздел ЖБ на сотрудников`,
            content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
                `[CENTER]Ошиблись разделом,пожалуйста напишите свою жалобу в раздел «Жалобы на сотрудников»<br>` +
                `[CENTER] [[COLOR=red] Отказано[/color],закрыто[/CENTER][/FONT][/SIZE]`,
            prefix: CLOSE_PREFIX,
            status: true,
        },
        {
            title: `В раздел ЖБ на администрацию`,
            content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
                `[CENTER]Ошиблись разделом,пожалуйста напишите свою жалобу в раздел «Жалобы на администрацию»<br>` +
                `[CENTER] [[COLOR=red] Отказано[/color],закрыто[/CENTER][/FONT][/SIZE]`,
            prefix: CLOSE_PREFIX,
            status: true,
        },
        {
            title: ` Не являеться ЛД`,
            content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
                `[CENTER]Данный игрок больше не являеться лидером или им не является , на данный момент времени.<br>` +
                `[CENTER] [COLOR=red] Отказано[/color],закрыто.[/CENTER][/FONT][/SIZE]`,
            prefix: CLOSE_PREFIX,
            status: true,
        },
        {
            title: `Лидер будет снят`,
            content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
                ` [CENTER] Благодарим за ваше обращение!<br>` +
               ` [CENTER] Лидер будет снят!<br>` +
                ` [CENTER]  [COLOR=lightgreen]Одобрено[/color],закрыто.[/CENTER][/FONT][/SIZE]`,
            prefix: CLOSE_PREFIX,
            status: true,
        },
        {
            title: `Недостаточно док-вы`,
            content:`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
            `[CENTER] Недостаточно доказательств, которые потверждают нарушение.<br>`+
            ` [CENTER][[COLOR=red] Отказано[/color],закрыто.[/CENTER][/FONT][/SIZE]`,
            prefix: UNACCEPT_PREFIX,
            status: true,
        },
        {
            title: `Нет нарушения`,
            content:`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
            `[CENTER] Исходя из выше приложенных доказательств,нарушение со стороны лидера - не имееться!<br>`+
            `[CENTER] [COLOR=red] Отказано[/color],закрыто. [/CENTER][/FONT][/SIZE]`,
            prefix: UNACCEPT_PREFIX,
            status: true,
        },
        {
        title: `Опра в соц.сети`,
        content:` [CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
        "Пожалуйста внимательно прочитайте тему «[URL=`https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-лидеров.2639616/`]Правила подачи жалоб на администрацию[/URL][SIZE=5][B]»<br><br>"+
        "И обратите своё внимание, на данный пункт правил —[/B][/SIZE][/FONT][/SIZE][SIZE=4][FONT=georgia][QUOTE]3.6. Прикрепление доказательств обязательно.Примечание: загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).[/QUOTE][/FONT][QUOTE][/quote][/SIZE][QUOTE][/QUOTE]"+
        `[SIZE=4][FONT=georgia][COLOR=red] Отказано[/color],[S] закрыто.[/S][/FONT][/SIZE]`,
        prefix: UNACCEPT_PREFIX,
        status: true,

        },
        {
            title: `Ошибка разделом`,
            content:`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
            `[CENTER]Пожалуйста, убедительная просьба, ознакомится с назначением данного раздела в котором Вы создали тему, так как ваш запрос никоим образом не относится к предназначению данного раздела.[/CENTER]`+
            `[CENTER][COLOR=red] Отказано[/color], закрыто.[/CENTER][/FONT]<br><br>`,
            prefix: UNACCEPT_PREFIX,
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
                   console.log(id)
                   if (id  > 3) {
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
        // Разделение кнопок на категории
        const categories = {
            applications: buttons.filter(btn =>
                btn.title.includes('Одобрено') ||
                btn.title.includes('Привязки к аккаунту не совпадает с ВК в АБ') ||
                btn.title.includes('Не привязан ВК') ||
                btn.title.includes('Уровень меньше 4-ого')
            ),
            complaints: buttons.filter(btn =>
                btn.title.includes('На рассмотрении') ||
                btn.title.includes('Проведена беседа') ||
                btn.title.includes('Получит наказание') ||
                btn.title.includes('Жалоба не по форме') ||
                btn.title.includes('В раздел ЖБ') ||
                btn.title.includes('Не являеться ЛД') ||
                btn.title.includes('Лидер будет снят') ||
                btn.title.includes('Недостаточно док-вы') ||
                btn.title.includes('Нет нарушения') ||
                btn.title.includes('Опра в соц.сети') ||
                btn.title.includes('Ошибка разделом')
            )
        };
 
        return `
            <div class="select_answer" style="display: flex; flex-direction: column; gap: 20px;">
                ${Object.entries(categories).map(([category, btns]) => {
                    let categoryName;
                    switch(category) {
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
                            ${btns.map((btn, i) =>
                                `<button id="answers-${i}" class="button--primary button rippleButton" style="margin: 5px;">
                                    <span class="button-text">${btn.title}</span>
                                </button>`
                            ).join('')}
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }


   async function pasteContent(id, data = {}, send) {
       const template = Handlebars.compile(buttons[id].content);
       const contentToAdd = template(data);

       // Находим последнее сообщение (или любое другое конкретное сообщение)
       const contentArea = $(`div.fr-element.fr-view p`).last();

       // Если контент существует, добавляем новый контент как ответ
       if (contentArea.length > 0) {
           contentArea.append('<br><br>' + contentToAdd);
       } else {
           // Если нет существующего контента, создаем новый блок
           $(`div.fr-element.fr-view`).append('<p>' + contentToAdd + '</p>');
       }
        console.log(send)
       // Если нужно отправить сообщение
       if (send) {
           await editThreadData(buttons[id].prefix, buttons[id].status);
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
 
    async function editThreadData(prefix, pin = false) {
        const threadTitle = $(`.p-title-value`)[0].lastChild.textContent;
        const formData = getFormData({
            prefix_id: prefix,
            title: threadTitle,
            _xfToken: XF.config.csrf,
            _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
            _xfWithData: 1,
            _xfResponseType: `json`,
        });

        if (pin) {
            formData.append('sticky', 1);
        }

        const response = await fetch(`${document.URL}edit`, {
            method: `POST`,
            body: formData,
        });

        if (response.ok) {
            return response.json(); // Возвращаем JSON-ответ, если нужно
        } else {
            console.error('Ошибка при отправке данных:', response.statusText);
            throw new Error('Ошибка при отправке данных');
        }
    }
 
    function getFormData(data) {
        const formData = new FormData();
        Object.entries(data).forEach(i => formData.append(i[0], i[1]));
        return formData;
    }
})();