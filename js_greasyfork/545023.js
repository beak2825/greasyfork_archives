// ==UserScript==
// @name         WHG Forum | Наказан по пункту правил
// @namespace    https://whg79554.hgweb.ru
// @version      1.0
// @description  Быстрые ответы для администраторов — наказан по пункту правил
// @author       ChatGPT
// @match        https://whg79554.hgweb.ru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545023/WHG%20Forum%20%7C%20%D0%9D%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%20%D0%BF%D0%BE%20%D0%BF%D1%83%D0%BD%D0%BA%D1%82%D1%83%20%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/545023/WHG%20Forum%20%7C%20%D0%9D%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%20%D0%BF%D0%BE%20%D0%BF%D1%83%D0%BD%D0%BA%D1%82%D1%83%20%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const OKAY_PREFIX = 8; // Одобрено

    const buttons = [
        {
        title: '2.03',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5);',
        content:
            '[SIZE=4][FONT=Georgia][B][CENTER][COLOR=WHITE]Здравствуйте, уважаемый (-ая)[/COLOR] { user.mention }.[/B][/CENTER]<br>' +
            "[CENTER]Вы были наказаны по данному пункту общих правил серверов:[/CENTER]<br>" +
            "[QUOTE][SIZE=4]2.03. Запрещён NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере | Jail 30 минут[/SIZE][/QUOTE]" +
            "[CENTER]Ваша жалоба передается руководству сервера.[/CENTER]<br>" +
            "[CENTER][URL=https://forum.blackrussia.online/threads/312571/]Ссылка на общие правила[/URL][/CENTER][/FONT][/SIZE]",
        prefix: 8,
        status: false
    },{
        title: '2.04',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5);',
        content:
            '[SIZE=4][FONT=Georgia][B][CENTER][COLOR=WHITE]Здравствуйте, уважаемый (-ая)[/COLOR] { user.mention }.[/B][/CENTER]<br>' +
            "[CENTER]Вы были наказаны по данному пункту общих правил серверов:[/CENTER]<br>" +
            "[QUOTE][SIZE=4]2.04. Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы | Ban 10 дней / Обнуление аккаунта (при повторном нарушении)[/SIZE][/QUOTE]" +
            "[CENTER]Ваша жалоба передается руководству сервера.[/CENTER]<br>" +
            "[CENTER][URL=https://forum.blackrussia.online/threads/312571/]Ссылка на общие правила[/URL][/CENTER][/FONT][/SIZE]",
        prefix: 8,
        status: false
    },{
        title: '2.05',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5);',
        content:
            '[SIZE=4][FONT=Georgia][B][CENTER][COLOR=WHITE]Здравствуйте, уважаемый (-ая)[/COLOR] { user.mention }.[/B][/CENTER]<br>' +
            "[CENTER]Вы были наказаны по данному пункту общих правил серверов:[/CENTER]<br>" +
            "[QUOTE][SIZE=4]2.05. Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики | PermBan[/SIZE][/QUOTE]" +
            "[CENTER]Ваша жалоба передается руководству сервера.[/CENTER]<br>" +
            "[CENTER][URL=https://forum.blackrussia.online/threads/312571/]Ссылка на общие правила[/URL][/CENTER][/FONT][/SIZE]",
        prefix: 8,
        status: false
    },{
        title: '2.08',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5);',
        content:
            '[SIZE=4][FONT=Georgia][B][CENTER][COLOR=WHITE]Здравствуйте, уважаемый (-ая)[/COLOR] { user.mention }.[/B][/CENTER]<br>' +
            "[CENTER]Вы были наказаны по данному пункту общих правил серверов:[/CENTER]<br>" +
            "[QUOTE][SIZE=4]2.08. Запрещена любая форма аморальных действий сексуального характера в сторону игроков | Jail 30 минут / Warn[/SIZE][/QUOTE]" +
            "[CENTER]Ваша жалоба передается руководству сервера.[/CENTER]<br>" +
            "[CENTER][URL=https://forum.blackrussia.online/threads/312571/]Ссылка на общие правила[/URL][/CENTER][/FONT][/SIZE]",
        prefix: 8,
        status: false
    },{
        title: '2.19',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5);',
        content:
            '[SIZE=4][FONT=Georgia][B][CENTER][COLOR=WHITE]Здравствуйте, уважаемый (-ая)[/COLOR] { user.mention }.[/B][/CENTER]<br>' +
            "[CENTER]Вы были наказаны по данному пункту общих правил серверов:[/CENTER]<br>" +
            "[QUOTE][SIZE=4]2.19. Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины | Jail 60 минут[/SIZE][/QUOTE]" +
            "[CENTER]Ваша жалоба передается руководству сервера.[/CENTER]<br>" +
            "[CENTER][URL=https://forum.blackrussia.online/threads/312571/]Ссылка на общие правила[/URL][/CENTER][/FONT][/SIZE]",
        prefix: 8,
        status: false
    },{
        title: '2.20',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5);',
        content:
            '[SIZE=4][FONT=Georgia][B][CENTER][COLOR=WHITE]Здравствуйте, уважаемый (-ая)[/COLOR] { user.mention }.[/B][/CENTER]<br>' +
            "[CENTER]Вы были наказаны по данному пункту общих правил серверов:[/CENTER]<br>" +
            "[QUOTE][SIZE=4]2.20. Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более | Warn / Ban 3 - 7 дней[/SIZE][/QUOTE]" +
            "[CENTER]Ваша жалоба передается руководству сервера.[/CENTER]<br>" +
            "[CENTER][URL=https://forum.blackrussia.online/threads/312571/]Ссылка на общие правила[/URL][/CENTER][/FONT][/SIZE]",
        prefix: 8,
        status: false
    },{
        title: '2.22',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5);',
        content:
            '[SIZE=4][FONT=Georgia][B][CENTER][COLOR=WHITE]Здравствуйте, уважаемый (-ая)[/COLOR] { user.mention }.[/B][/CENTER]<br>' +
            "[CENTER]Вы были наказаны по данному пункту общих правил серверов:[/CENTER]<br>" +
            "[QUOTE][SIZE=4]2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками | Ban 15 - 30 дней / PermBan[/SIZE][/QUOTE]" +
            "[CENTER]Ваша жалоба передается руководству сервера.[/CENTER]<br>" +
            "[CENTER][URL=https://forum.blackrussia.online/threads/312571/]Ссылка на общие правила[/URL][/CENTER][/FONT][/SIZE]",
        prefix: 8,
        status: false
    },{
        title: '3.02',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5);',
        content:
            '[SIZE=4][FONT=Georgia][B][CENTER][COLOR=WHITE]Здравствуйте, уважаемый (-ая)[/COLOR] { user.mention }.[/B][/CENTER]<br>' +
            "[CENTER]Вы были наказаны по данному пункту общих правил серверов:[/CENTER]<br>" +
            "[QUOTE][SIZE=4]3.02. Запрещено использование верхнего регистра (Caps Lock) при написании любого текста в любом чате | Mute 30 минут[/SIZE][/QUOTE]" +
            "[CENTER]Ваша жалоба передается руководству сервера.[/CENTER]<br>" +
            "[CENTER][URL=https://forum.blackrussia.online/threads/312571/]Ссылка на общие правила[/URL][/CENTER][/FONT][/SIZE]",
        prefix: 8,
        status: false
    },{
        title: '3.04',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5);',
        content:
            '[SIZE=4][FONT=Georgia][B][CENTER][COLOR=WHITE]Здравствуйте, уважаемый (-ая)[/COLOR] { user.mention }.[/B][/CENTER]<br>' +
            "[CENTER]Вы были наказаны по данному пункту общих правил серверов:[/CENTER]<br>" +
            "[QUOTE][SIZE=4]3.04. Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) | Mute 120 минут / Ban 7 - 15 дней[/SIZE][/QUOTE]" +
            "[CENTER]Ваша жалоба передается руководству сервера.[/CENTER]<br>" +
            "[CENTER][URL=https://forum.blackrussia.online/threads/312571/]Ссылка на общие правила[/URL][/CENTER][/FONT][/SIZE]",
        prefix: 8,
        status: false
    },
    ];

    $(document).ready(() => {
        $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
        addButton('Одобрено', 'accepted', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0);');
        addAnswers();

        const threadData = getThreadData();

        $('button#accepted').click(() => editThreadData(OKAY_PREFIX, false));

        $(`button#selectAnswer`).click(() => {
            XF.alert(buttonsMarkup(buttons), null, 'ОТВЕТЫ');
            buttons.forEach((btn, id) => {
                $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
            });
        });
    });

    function addButton(name, id, style) {
        $('.button--icon--reply').before(
            `<button type="button" class="button--primary button rippleButton" id="${id}" style="${style}">${name}</button>`,
        );
    }
    function addAnswers() {
        $('.button--icon--reply').after(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectAnswer" style="oswald: 3px; margin-left: 5px; margin-top: 10px; border-radius: 13px;">ОТВЕТЫ</button>`);
    }
    function buttonsMarkup(buttons) {
        return `<div class="select_answer">${buttons
            .map((btn, i) => `<button id="answers-${i}" class="button--primary button rippleButton" style="margin:4px; ${btn.dpstyle}"><span class="button-text">${btn.title}</span></button>`)
            .join('')}</div>`;
    }
    function pasteContent(id, data = {}, send = false) {
        const template = Handlebars.compile(buttons[id].content);
        const content = template(data).replace(/<span class="username--moderator">|<\/span>/g, '');
        if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();
        $('span.fr-placeholder').empty();
        $('div.fr-element.fr-view p').append(content);
        $('a.overlay-titleCloser').trigger('click');
        if (send) {
            editThreadData(buttons[id].prefix, buttons[id].status);
            $('.button--icon.button--icon--reply.rippleButton').trigger('click');
        }
    }
    function getThreadData() {
        const authorID = $(`a.username`)[0].attributes[`data-user-id`].nodeValue;
        const authorName = "Игрок";
        return {
            user: {
                id: authorID,
                name: authorName,
                mention: `[USER=${authorID}]${authorName}[/USER]`,
            }
        };
    }
    function editThreadData(prefix, pin = false) {
        const threadTitle = $('.p-title-value')[0].lastChild.textContent;
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
    function getFormData(data) {
        const formData = new FormData();
        Object.entries(data).forEach(i => formData.append(i[0], i[1]));
        return formData;
    }
})();
