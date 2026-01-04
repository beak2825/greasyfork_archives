// ==UserScript==
// @name         Blue | Скрипт для ГС/ЗГС
// @namespace
// @version      1.24
// @description  Скрипт для ГС/ЗГС ОПГ
// @author       Fredd_Freizenov
// @match        https://forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/
// @icon         https://img.icons8.com/?size=100&id=yIqnFsbl9749&format=png&color=000000
// @grant        none
// @license      none
// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/522716/Blue%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%93%D0%A1%D0%97%D0%93%D0%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/522716/Blue%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%93%D0%A1%D0%97%D0%93%D0%A1.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    const observer = new MutationObserver(() => {
        if (document.querySelector('.button--icon--reply')) {
            observer.disconnect();
            initScript();
        }
    });

    observer.observe(document, { childList: true, subtree: true });

    async function initScript() {
        const UNACCEPT_PREFIX = 4;
        const ACCEPT_PREFIX = 8;
        const PIN_PREFIX = 2;
        const WATCHED_PREFIX = 9;
        const CLOSE_PREFIX = 7;

        const data = await getThreadData();
        const greeting = data.greeting;
        const user = data.user;

        const buttons = [
            {
    title: `Еженедельный отчёт`,
    content: function (data) {
        const input = prompt("Введите количество баллов:");
        if (input === null || isNaN(input.trim())) return;
        const num = parseInt(input.trim());
        const word = getBallWord(num);
        return `[SIZE=6][FONT=courier new][CENTER]${data.greeting}, уважаемый(ая) ${data.user.mention}.[/SIZE]` +
            `[IMG]https://i.ibb.co/vxmtFW4/5a-HZMOe-Imgur.png[/IMG]<br>` +
            `<br>[SIZE=5]Ваш еженедельный отчёт набрал - [COLOR=#B8312F]${num} ${word}[/COLOR].[/SIZE]<br>` +
            `<br>[IMG]https://i.ibb.co/vxmtFW4/5a-HZMOe-Imgur.png[/IMG]<br>` +
            `[IMG]https://i.ibb.co/hcW3pMT/rassmotreno.gif[/IMG][/CENTER][/FONT]`;
    },
    prefix: WATCHED_PREFIX,
    status: false, // гарантированно без закрепа
    noPin: true    // добавляем свой флаг
},

            {
                title: '--------------  Жалобы на лидеров  ----------------------------------------------------------------------------------------------------------------',
            },
            {
                title: `На рассмотрении`,
                content: `[SIZE=6][FONT=courier new][CENTER]${greeting}, уважаемый(ая) ${user.mention}.[/SIZE]` +
                    `[IMG]https://i.ibb.co/vxmtFW4/5a-HZMOe-Imgur.png[/IMG]<br>` +
                    `<br>[SIZE=5]Ваша жалоба взята на рассмотрение.[/SIZE]<br>` +
                    `[IMG]https://i.ibb.co/vxmtFW4/5a-HZMOe-Imgur.png[/IMG]<br>` +
                    `[IMG]https://i.ibb.co/xJX8shg/na-rassmotrenii.gif[/IMG][/CENTER][/FONT]`,
                prefix: PIN_PREFIX,
                status: true,
            },
            {
                title: `Проведена беседа`,
                content: ` [SIZE=6][FONT=courier new][CENTER]${greeting}, уважаемый(ая) ${user.mention}.[/SIZE]` +
                    `[IMG]https://i.ibb.co/vxmtFW4/5a-HZMOe-Imgur.png[/IMG]<br>` +
                    `<br>[SIZE=5]С лидером будет проведена профилактическая беседа.[/SIZE]<br>` +
                    `[IMG]https://i.ibb.co/vxmtFW4/5a-HZMOe-Imgur.png[/IMG]<br>` +
                    `[IMG]https://i.ibb.co/YpnXpym/odobreno.gif[/IMG][/CENTER][/FONT]`,
                prefix: ACCEPT_PREFIX,
                status: false,
            },
            {
                title: `Получит наказание`,
                content: `[SIZE=6][FONT=courier new][CENTER]${greeting}, уважаемый(ая) ${user.mention}.[/SIZE]` +
                    `[IMG]https://i.ibb.co/vxmtFW4/5a-HZMOe-Imgur.png[/IMG]<br>` +
                    `<br>[SIZE=5]Лидер получит соответствующее наказание.[/SIZE]<br>` +
                    `[IMG]https://i.ibb.co/vxmtFW4/5a-HZMOe-Imgur.png[/IMG]<br>` +
                    `[IMG]https://i.ibb.co/YpnXpym/odobreno.gif[/IMG][/CENTER][/FONT]`,
                prefix: ACCEPT_PREFIX,
                status: false,
            },
            {
                title: `Жалоба не по форме`,
                content: `[SIZE=6][FONT=courier new][CENTER]${greeting}, уважаемый(ая) ${user.mention}.[/SIZE]` +
                    `[IMG]https://i.ibb.co/vxmtFW4/5a-HZMOe-Imgur.png[/IMG]<br>` +
                    `<br>[SIZE=5]Ваша жалоба составлена не по форме.<br>` +
                    `Просьба внимательно прочитать правила составления жалоб закреплённые в этом разделе.[/SIZE]<br>` +
                    `<br>[IMG]https://i.ibb.co/vxmtFW4/5a-HZMOe-Imgur.png[/IMG]<br>` +
                    `[IMG]https://i.ibb.co/MP7cZTD/otkazano.gif[/IMG][/CENTER][/FONT]`,
                prefix: CLOSE_PREFIX,
                status: false,
            },
            {
                title: `В раздел ЖБ на сотрудников`,
                content: `[SIZE=6][FONT=courier new][CENTER]${greeting}, уважаемый(ая) ${user.mention}.[/SIZE]` +
                    `[IMG]https://i.ibb.co/vxmtFW4/5a-HZMOe-Imgur.png[/IMG]<br>` +
                    `<br>[SIZE=5]Вы ошиблись разделом, пожалуйста, напишите свою жалобу в раздел «Жалобы на сотрудников».[/SIZE]<br>` +
                    `<br>[IMG]https://i.ibb.co/vxmtFW4/5a-HZMOe-Imgur.png[/IMG]<br>` +
                    `[IMG]https://i.ibb.co/MP7cZTD/otkazano.gif[/IMG][/CENTER][/FONT]`,
                prefix: CLOSE_PREFIX,
                status: false,
            },
            {
                title: ` Не является ЛД`,
                content: `[SIZE=6][FONT=courier new][CENTER]${greeting}, уважаемый(ая) ${user.mention}.[/SIZE]` +
                    `[IMG]https://i.ibb.co/vxmtFW4/5a-HZMOe-Imgur.png[/IMG]<br>` +
                    `<br>[SIZE=5]Данный игрок не является лидером фракции.[/SIZE]<br>` +
                    `<br>[IMG]https://i.ibb.co/vxmtFW4/5a-HZMOe-Imgur.png[/IMG]<br>` +
                    `[IMG]https://i.ibb.co/MP7cZTD/otkazano.gif[/IMG][/CENTER][/FONT]`,
                prefix: CLOSE_PREFIX,
                status: false,
            },
            {
                title: `Лидер будет снят`,
                content: `[SIZE=6][FONT=courier new][CENTER]${greeting}, уважаемый(ая) ${user.mention}.[/SIZE]` +
                    `[IMG]https://i.ibb.co/vxmtFW4/5a-HZMOe-Imgur.png[/IMG]<br>` +
                    `<br>[SIZE=5]Лидер будет снят со своего поста.[/SIZE]<br>` +
                    `<br>[IMG]https://i.ibb.co/vxmtFW4/5a-HZMOe-Imgur.png[/IMG]<br>` +
                    `[IMG]https://i.ibb.co/YpnXpym/odobreno.gif[/IMG][/CENTER][/FONT]`,
                prefix: CLOSE_PREFIX,
                status: false,
            },
            {
                title: `Недостаточно доков`,
                content: `[SIZE=6][FONT=courier new][CENTER]${greeting}, уважаемый(ая) ${user.mention}.[/SIZE]` +
                    `[IMG]https://i.ibb.co/vxmtFW4/5a-HZMOe-Imgur.png[/IMG]<br>` +
                    `<br>[SIZE=5]Недостаточно доказательств подтверждающих нарушение.<br>` +
                    `Если у вас есть дополнительные доказательства, которые могут помочь в рассмотрении жалобы - создайте новую тему, прикрепив их.[/SIZE]<br>` +
                    `<br>[IMG]https://i.ibb.co/vxmtFW4/5a-HZMOe-Imgur.png[/IMG]<br>` +
                    `[IMG]https://i.ibb.co/MP7cZTD/otkazano.gif[/IMG][/CENTER][/FONT]`,
                prefix: UNACCEPT_PREFIX,
                status: false,
            },
            {
                title: `Нет нарушения ЛД`,
                content: `[SIZE=6][FONT=courier new][CENTER]${greeting}, уважаемый(ая) ${user.mention}.[/SIZE]` +
                    `[IMG]https://i.ibb.co/vxmtFW4/5a-HZMOe-Imgur.png[/IMG]<br>` +
                    `<br>[SIZE=5]Исходя из выше приложенных доказательств, нарушений со стороны лидера нет.<br>` +
                    `Если у вас есть дополнительные доказательства, которые могут помочь в рассмотрении жалобы - создайте новую тему, прикрепив данные док-ва.[/SIZE]<br>` +
                    `<br>[IMG]https://i.ibb.co/vxmtFW4/5a-HZMOe-Imgur.png[/IMG]<br>` +
                    `[IMG]https://i.ibb.co/MP7cZTD/otkazano.gif[/IMG][/CENTER][/FONT]`,
                prefix: UNACCEPT_PREFIX,
                status: false,
            },
            {
                title: `Опра вне фотохостинга`,
                content: `[CENTER][SIZE=6][FONT=courier new]${greeting}, уважаемый(ая) ${user.mention}.<br>[/SIZE]\n` +
                    `[IMG]https://i.ibb.co/vxmtFW4/5a-HZMOe-Imgur.png[/IMG]<br>` +
                    `<br>[SIZE=5]Внимательно прочитайте тему «[URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-лидеров.2639616/']Правила подачи жалоб на лидеров[/URL]».<br>` +
                    `Также следует обратить внимание на данный пункт правил:[QUOTE]3.6 Прикрепление доказательств обязательно. Примечание: загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).[/QUOTE][/SIZE]<br>` +
                    `<br>[IMG]https://i.ibb.co/vxmtFW4/5a-HZMOe-Imgur.png[/IMG]<br>` +
                    `[IMG]https://i.ibb.co/MP7cZTD/otkazano.gif[/IMG][/CENTER][/FONT]`,
                prefix: UNACCEPT_PREFIX,
                status: false,
            },
            {
                title: `Ошибка разделом`,
                content: `[SIZE=6][FONT=courier new][CENTER]${greeting}, уважаемый(ая) ${user.mention}.[/SIZE]` +
                    `[IMG]https://i.ibb.co/vxmtFW4/5a-HZMOe-Imgur.png[/IMG]<br>` +
                    `<br>[SIZE=5]Ваше обращение не имеет отношения к данному форумному разделу.<br>` +
                    `Возможно, вы ошиблись форумным разделом.[/SIZE]<br>` +
                    `<br>[IMG]https://i.ibb.co/vxmtFW4/5a-HZMOe-Imgur.png[/IMG]<br>` +
                    `[IMG]https://i.ibb.co/MP7cZTD/otkazano.gif[/IMG][/CENTER][/FONT]`,
                prefix: UNACCEPT_PREFIX,
                status:false,
            },
        ];

        function addButton(name, id) {
            document.querySelector('.button--icon--reply')?.insertAdjacentHTML('beforebegin',
                `<button type="button" class="button rippleButton" id="${id}" style="margin: 3px;">${name}</button>`);
        }

        function buttonsMarkup(buttons) {
            return `<div class="select_answer">${buttons.map((btn, i) =>
                `<button id="answers-${i}" class="button--primary button rippleButton" style="margin:5px"><span class="button-text">${btn.title}</span></button>`).join('')}</div>`;
        }

        function pasteContent(id, data = {}, send = false) {
            let content;
            if (typeof buttons[id].content === 'function') {
                content = buttons[id].content(data);
                if (!content) return;
            } else {
                const template = Handlebars.compile(buttons[id].content);
                content = template(data);
            }
            const editor = document.querySelector('.fr-element.fr-view p');
            if (editor?.textContent === '') editor.innerHTML = '';

            document.querySelector('span.fr-placeholder')?.remove();
            editor?.insertAdjacentHTML('beforeend', content);
            document.querySelector('a.overlay-titleCloser')?.click();

            if (send) {
    editThreadData(buttons[id].prefix, buttons[id].noPin ? false : buttons[id].status);
    document.querySelector('.button--icon--reply')?.click();
            }
        }

        function getBallWord(n) {
            n = Math.abs(n) % 100;
            const lastDigit = n % 10;
            if (n > 10 && n < 20) return 'баллов';
            if (lastDigit > 1 && lastDigit < 5) return 'балла';
            if (lastDigit === 1) return 'балл';
            return 'баллов';
        }

        async function getThreadData() {
            const authorEl = document.querySelector('a.username');
            const authorID = authorEl?.getAttribute('data-user-id');
            const authorName = authorEl?.innerHTML;
            const hours = new Date().getHours();
            const greeting = hours > 4 && hours <= 11
                ? 'Доброе утро'
                : hours > 11 && hours <= 15
                    ? 'Добрый день'
                    : hours > 15 && hours <= 21
                        ? 'Добрый вечер'
                        : 'Доброй ночи';

            return {
                user: {
                    id: authorID,
                    name: authorName,
                    mention: `[USER=${authorID}]${authorName}[/USER]`,
                },
                greeting
            };
        }

       function editThreadData(prefix, pin = false) {
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
            Object.entries(data).forEach(([key, val]) => {
                if (val !== undefined) formData.append(key, val);
            });
            return formData;
        }

        const handlebarsScript = document.createElement('script');
        handlebarsScript.src = 'https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js';
        document.body.appendChild(handlebarsScript);

        handlebarsScript.onload = () => {
            addButton('На рассмотрение', 'pin');
            addButton('Одобрено', 'accepted');
            addButton('Отказано', 'unaccept');
            addButton('Ответы', 'selectAnswer');

            document.getElementById('pin')?.addEventListener('click', () => editThreadData(PIN_PREFIX, true));
            document.getElementById('accepted')?.addEventListener('click', () => editThreadData(ACCEPT_PREFIX, false));
            document.getElementById('unaccept')?.addEventListener('click', () => editThreadData(UNACCEPT_PREFIX, false));
            document.getElementById('selectAnswer')?.addEventListener('click', () => {
                XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
                buttons.forEach((btn, id) => {
                    document.getElementById(`answers-${id}`)?.addEventListener('click', () => pasteContent(id, data, true));
                });
            });
        };
    }
})();
