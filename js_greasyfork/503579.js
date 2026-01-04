// ==UserScript==
// @name         Норматив
// @namespace    https://forum.blackrussia.online
// @version      Beta 5.0
// @description  Личный
// @author       Nunzio_Grant
// @match        https://forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/
// @grant        Nunzio_Grant
// @license      Nunzio_Grant
// @collaborator Nunzio_Grant
// @icon         https://i.yapx.ru/ViO6c.png
// @downloadURL https://update.greasyfork.org/scripts/503579/%D0%9D%D0%BE%D1%80%D0%BC%D0%B0%D1%82%D0%B8%D0%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/503579/%D0%9D%D0%BE%D1%80%D0%BC%D0%B0%D1%82%D0%B8%D0%B2.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const UNACCСEPT_PREFIX = 4; // Prefix that will be set when thread closes
    const ACCСEPT_PREFIX = 8; // Prefix that will be set when thread accepted
    const RESHENO_PREFIX = 6; // Prefix that will be set when solving the problem
    const PINN_PREFIX = 2; // Prefix that will be set when thread pins
    const GA_PREFIX = 12; // Prefix that will be set when thread send to ga
    const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
    const WATCHED_PREFIX = 9;
    const CLOSE_PREFIX = 7;
    const SPECY_PREFIX = 11;
    const TEXY_PREFIX = 13;
    const OJIDANIE_PREFIX = 14;
    const VAJNO_PREFIX = 1;
    const PREFIKS = 0;
    const KACHESTVO = 15;
    const RASSMOTRENO_PREFIX = 9;
    const NARASSMOTRENIIRP_PREFIX = 2;
    const buttons = [
        {
            title: 'Норматив',
            content:
            '[CENTER][IMG width="445px" alt="Официальный форум - Black Russia (CRMP ANDROID)"]https://forum.blackrussia.online/data/assets/logo/uix-logo-cust.png[/IMG]<br><br>' +
            '[CENTER][B]1.Ваш NickName: Nunzio_Grant[/CENTER][/B]<unbr><unbr>'+
            '[CENTER][B]2. Дата отчета: [/CENTER][/B]<unbr><unbr>' +
            '[CENTER][B]3. Ваш /hstats ( с /time ):[/CENTER][/B]<unbr><unbr><unbr><unbr>' ,
            style: 'flex-grow: 1; font-family: JetBrains Mono; border-radius: 25px',
        },
        ]
      $(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
        $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

        // Добавление кнопок при загрузке страницы
        addButton('На рассмотрении', 'pin', 'background: #F37934; border: 3px solid #000000; border-radius: 10px');
        addButton('Важно', 'Vajno', 'background: #FF0000; border: 3px solid #000000; border-radius: 10px');
        addButton('Главному администратору', 'Ga', 'background: #FF0000; border: 3px solid #000000; border-radius: 10px');
        addButton('Специальной администрации', 'Spec', 'background: #FF0000; border: 3px solid #000000; border-radius: 10px');
        addButton('Рассмотрено', 'RASSMOTRENO', 'background: #61BD6D; border: 3px solid #000000; border-radius: 10px');
        addButton('Закрыто', 'Zakrito', 'background: #E25041; border: 3px solid #000000; border-radius: 10px');
        addButton('Ожидание', 'Ojidanie', 'background: #CCCCCC; border: 3px solid #000000; border-radius: 10px');
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
        $(`button#Info`).click(() => {
            XF.alert(infoAlert(), null, 'Информация:');
        });
    });

    function addButton(name, id, style) {
        $('.button--icon--reply').before(
            `<button type="button" class="button rippleButton" id="${id}" style="margin: 3px; ${style}">${name}</button>`,
        );
    }
    function addAnswers() {
        $('.button--icon--reply').after(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectAnswer" style="oswald: 3px; margin-left: 25px; border: 3px solid; border-radius: 25px; background: #FAC51C; padding: 0px 27px 0px 27px; font-family: JetBrains Mono; border-color: #000000;">ОТВЕТЫ</button>`,
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

    function infoAlert() {
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
            'Доброе утро' :
            12 < hours && hours <= 17 ?
            'Добрый день' :
            18 < hours && hours <= 23 ?
            'Добрый вечер' :
            0 < hours && hours <= 5 ?
            'Доброй ночи' :
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