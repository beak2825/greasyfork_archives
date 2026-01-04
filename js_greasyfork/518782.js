// ==UserScript==
// @name Для Руководства администрации сервера TOMSK | 84
// @namespace https://forum.blackrussia.online
// @version 0.0.1
// @description Для Николая 
// @author Maksim_Vitalievich
// @match https://forum.blackrussia.online/threads/*
// @include https://forum.blackrussia.online/threads/
// @grant none
// @license MIT
// @collaborator !
// @icon https://icons.iconarchive.com/icons/papirus-team/papirus-apps/48/emerald-theme-manager-icon-icon.png
// @downloadURL https://update.greasyfork.org/scripts/518782/%D0%94%D0%BB%D1%8F%20%D0%A0%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0%20%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D0%B8%20%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%B0%20TOMSK%20%7C%2084.user.js
// @updateURL https://update.greasyfork.org/scripts/518782/%D0%94%D0%BB%D1%8F%20%D0%A0%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0%20%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D0%B8%20%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%B0%20TOMSK%20%7C%2084.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
    const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
    const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
    const RESHENO_PREFIX = 6; // Prefix that will be set when solving the problem
    const PIN_PREFIX = 2; // Prefix that will be set when thread pins
    const GA_PREFIX = 12; // Prefix that will be set when thread send to ga
    const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
    const WATCHED_PREFIX = 9;
    const CLOSE_PREFIX = 7;
    const SA_PREFIX = 11;
    const buttons = [
    {
    title: 'СВОЙ ОТВЕТ',
    content:
    '[SIZE=4][COLOR=#BA55D3][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br><br>'+
    "[url=https://postimg.cc/BtV71PBh][img]https://i.postimg.cc/Wb2BCMFP/image.png[/img][/url]<br>"+
 "Твой текст <br><br>"+
    "[url=https://postimg.cc/BtV71PBh][img]https://i.postimg.cc/Wb2BCMFP/image.png[/img][/url]<br>"+
     "Приятной игры и времяпровождение на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER][/B][/SIZE]",
    },
    {
        title: '––––––––––––––––––––––– ЖАЛОБЫ НА АДМИНИСТРАЦИЮ –––––––––––––––––––––––',
    },
    {
        title: '––––––––––––––––––––––– ЖАЛОБЫ НА РАССМОТРЕНИИ –––––––––––––––––––––––',
    },
    {
    title: 'Запрошу доказательства',
    content:
    '[SIZE=4][COLOR=RED][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimg.cc/BtV71PBh][img]https://i.postimg.cc/Wb2BCMFP/image.png[/img][/url]<br>"+
    "[CENTER]Запрошу доказательства у администратора. Просьба не создавать подобных тем, иначе форумный аккаунт может быть заблокирован.[/CENTER]<br>"+
"[url=https://postimg.cc/BtV71PBh][img]https://i.postimg.cc/Wb2BCMFP/image.png[/img][/url]<br>"+
    '[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/f78a08/20/1/4nq7brby4nopbrgow8ekdwrh4nxpbesowdejmwr74ncpbgy.png[/img][/url]',
    prefix: PIN_PREFIX,
    status: true,
    },
    {
    title: 'На рассмотрении',
    content:
    '[SIZE=4][COLOR=#BA55D3][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+ 
    "[url=https://postimg.cc/BtV71PBh][img]https://i.postimg.cc/Wb2BCMFP/image.png[/img][/url]<br>"+
    "[CENTER]Ваша жалоба взята [Color=Orange]на рассмотрение[/Color]. Просьба не создавать подобных тем, иначе форумный аккаунт может быть заблокирован[/CENTER]<br>"+
"[url=https://postimg.cc/BtV71PBh][img]https://i.postimg.cc/Wb2BCMFP/image.png[/img][/url]<br>"+
    '[url=http://x-lines.ru/][img]http://x-lines.ru/letters/i/cyrillicgothic/1066/f58d0a/20/1/4nxpbfsoudejjwro4nc7beso1wopb8sowmejfwri4ntpbry.png[/img][/url]',
    prefix: PIN_PREFIX,
    status: true,
    },
]
     
     
    $(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
        $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
       // Добавление кнопок при загрузке страницы
	addButton('На рассмотрении', 'pin', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 173, 51, 0.5);');
	addButton('Команде проекта', 'teamProject', 'border-radius: 13px; margin-right: 5px; border: 2px solid;  border-color: rgb(255, 240, 110, 0.5);');
    addButton('Техническому специалисту', 'techspec', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(17, 92, 208, 0.5);');
	addButton('Рассмотрено', 'watched', 'border-radius: 13px; margin-right: 5px; border: 2px solid;  border-color: rgb(110, 192, 113, 0.5)');
	addButton('Решено', 'decided', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(110, 192, 113, 0.5);');
    addButton('Отказано', 'unaccept', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(220, 89, 89, 0.5);');
	addButton('Закрыто', 'closed', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(220, 89, 89, 0.5);');
	addAnswers();
 
        // Поиск информации о теме
        const threadData = getThreadData();
 
        $('button#pin').click(() => editThreadData(PINN_PREFIX, true));
        $('button#accepted').click(() => editThreadData(ACCСEPT_PREFIX, false));
        $('button#Ga').click(() => editThreadData(GA_PREFIX, true));
        $('button#Spec').click(() => editThreadData(SPECY_PREFIX, true));
        $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
        $('button#unaccept').click(() => editThreadData(UNACCСEPT_PREFIX, false));
        $('button#Texy').click(() => editThreadData(TEXY_PREFIX, false));
        $('button#Resheno').click(() => editThreadData(RESHENO_PREFIX, false));
        $('button#Zakrito').click(() => editThreadData(CLOSE_PREFIX, false));
        $('button#Realizovano').click(() => editThreadData(REALIZOVANO_PREFIX, false));
        $('button#Vajno').click(() => editThreadData(VAJNO_PREFIX, false));
        $('button#Rassmotreno').click(() => editThreadData(RASSMOTRENO_PREFIX, false));
        $('button#Ojidanie').click(() => editThreadData(OJIDANIE_PREFIX, false));
 
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
 
    function addButton(name, id, style) {
        $('.button--icon--reply').before(
            `<button type="button" class="button rippleButton" id="${id}" style="margin: 3px; ${style}">${name}</button>`,
        );
    }
    function addAnswers() {
        $('.button--icon--reply').after(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectAnswer" style="oswald: 3px; margin-left: 25px; border: 3px solid; border-radius: 20px; background: #850002; padding: 0px 27px 0px 27px; font-family: JetBrains Mono; border-color: #fc0509;">ОТВЕТЫ</button>`,
                                       );
    }
 
    function buttonsMarkup(buttons) {
        return `<div class="select_answer" style="display:flex; flex-direction:row; flex-wrap:wrap">${buttons
            .map(
            (btn, i) =>
            `<button id="answers-${i}" class="button--primary button ` +
            `rippleButton" style="margin:5px; ${btn.style}"><span class="button-text">${btn.title}</span></button>`,
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
            6 < hours && hours <= 11 ?
            'Доброго времени суток' :
            12 < hours && hours <= 17 ?
            'Доброго времени суток' :
            18 < hours && hours <= 23 ?
            'Доброго времени суток' :
            0 < hours && hours <= 5 ?
            'Доброго времени суток' :
            'Доброго времени суток',
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
        } else  {
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
 
 
    function moveThread(prefix, type) {
        // Получаем заголовок темы, так как он необходим при запросе
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