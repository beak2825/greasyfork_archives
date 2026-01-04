// ==UserScript==
// @name         Pink | Скрипт для Руководства
// @namespace    https://forum.blackrussia.online
// @version      4.1
// @description  Скрипт для упрощения работы ГА/ЗГА/Кураторов администрации.
// @author       Mika_Bennet
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @icon         https://icons.iconarchive.com/icons/papirus-team/papirus-apps/48/emerald-theme-manager-icon-icon.png
// @grant        none
// @license 	 none
// @downloadURL https://update.greasyfork.org/scripts/532336/Pink%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%A0%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/532336/Pink%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%A0%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0.meta.js
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
    const buttons = [
        {
            title: '-------------------------♡ Обжалование ♡-------------------------',
        },
        {

            title: 'Приветствие',

            content:

            "[CENTER][FONT=Verdana][COLOR=rgb(220, 20, 60)]Доброго времени суток, уважаемый(-ая)[/COLOR][COLOR=rgb(209, 213, 216)] - {{ user.name }}.<br><br>"+

            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url][/FONT][COLOR=rgb(209, 213, 216)]<br>"+

            "[CENTER][FONT=Verdana] текст [/FONT][/CENTER]",

        },
        {

            title: 'На рассмотрение',

            content:

            "[CENTER][FONT=Verdana][COLOR=rgb(255, 127, 80)]Доброго времени суток, уважаемый(-ая)[/COLOR][COLOR=rgb(209, 213, 216)] - {{ user.name }}.<br><br>"+

            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url][/FONT][COLOR=rgb(209, 213, 216)]<br>"+

            "Ваша тема взята на рассмотрение.<br>"+

            "Ожидайте ответа в данной теме, не нужно создавать копии.<br>"+

            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+

            '[COLOR=orange][COLOR=rgb(255, 127, 80)]На рассмотрении.[/COLOR][/CENTER]',

            prefix: PIN_PREFIX,

            status: true,

        },
        {

            title: 'Наказание верное',

            content:

            "[CENTER][FONT=Verdana][COLOR=rgb(220, 20, 60)]Доброго времени суток, уважаемый(-ая)[COLOR=rgb(209, 213, 216)] - {{ user.name }}.<br><br>"+

            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url][/FONT][COLOR=rgb(209, 213, 216)]<br>"+

            "Администратор предоставил доказательства.<br>"+

            "Наказание выдано верно.<br>"+

            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+

            '[COLOR=RED][COLOR=rgb(220, 20, 60)]Закрыто.[/COLOR][/CENTER]',

            prefix: CLOSE_PREFIX,

            status: false,

        },
        {
            title: 'Не по форме жб',
            content:
            "[CENTER][FONT=Verdana][COLOR=rgb(220, 20, 60)]Доброго времени суток, уважаемый(-ая)[/COLOR][COLOR=rgb(209, 213, 216)] - {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url][/FONT][COLOR=rgb(209, 213, 216)]<br>"+
            "Ваша жалоба составлена не по форме, ознакомьтесь с правилами подачи жалоб : [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.2639611/']*Кликабельно*[/URL][/COLOR]<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=RED][COLOR=rgb(220, 20, 60)]Отказано[/COLOR][/COLOR],[COLOR=rgb(209, 213, 216)][FONT=Verdana]Закрыто.[/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {

            title: 'Окно бана',

            content:

            "[CENTER][FONT=Verdana][COLOR=rgb(220, 20, 60)]Доброго времени суток, уважаемый(-ая)[COLOR=rgb(209, 213, 216)] - {{ user.name }}.<br><br>"+

            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url][/FONT][COLOR=rgb(209, 213, 216)]<br>"+

            "Зайдите в игру и сделайте скрин окна с баном после чего, заново создайте тему.<br>"+

            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+

            '[COLOR=RED][COLOR=rgb(220, 20, 60)]Отказано[/COLOR][/COLOR],[COLOR=rgb(209, 213, 216)]Закрыто.[/CENTER]',

            prefix: UNACCEPT_PREFIX,

            status: false,

        },
        {

            title: 'Не рабочие док-ва',

            content:

            "[CENTER][FONT=Verdana][COLOR=rgb(220, 20, 60)]Доброго времени суток, уважаемый(-ая)[COLOR=rgb(209, 213, 216)] - {{ user.name }}.<br><br>"+

            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url][/FONT][COLOR=rgb(209, 213, 216)]<br>"+

            "Предоставленные вами доказательства нерабочие, создайте новую тему, прикрепив рабочую ссылку на док-ва.<br>"+

            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+

            '[COLOR=RED][COLOR=rgb(220, 20, 60)]Отказано[/COLOR][/COLOR],[COLOR=rgb(209, 213, 216)]Закрыто.[/CENTER]',

            prefix: CLOSE_PREFIX,

            status: false,

        },
        {

            title: 'Дублирование',

            content:

            "[CENTER][FONT=Verdana][COLOR=rgb(220, 20, 60)]Доброго времени суток, уважаемый(-ая)[COLOR=rgb(209, 213, 216)] - {{ user.name }}.<br><br>"+

            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url][/FONT][COLOR=rgb(209, 213, 216)]<br>"+

            "Ответ вам уже был дан в предыдущей теме. Напоминаю, за дублирование тем ваш форумный аккаунт может быть заблокирован.<br>"+

            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+

            '[COLOR=red][COLOR=rgb(220, 20, 60)]Отказано[/COLOR][/COLOR],[COLOR=rgb(209, 213, 216)]Закрыто.[/CENTER]',

            prefix: UNACCEPT_PREFIX,

            status: false,

        },
        {

            title: 'Прошло более 48 часов',

            content:

            "[CENTER][FONT=Verdana][COLOR=rgb(220, 20, 60)]Доброго времени суток, уважаемый(-ая)[COLOR=rgb(209, 213, 216)] - {{ user.name }}.<br><br>"+

            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url][/FONT][COLOR=rgb(209, 213, 216)]<br>"+

            "С момента выдачи наказания прошло более 48-ми часов, жалоба не подлежит рассмотрению.<br>"+

            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+

            '[COLOR=RED][COLOR=rgb(220, 20, 60)]Отказано[/COLOR],[/COLOR][COLOR=rgb(209, 213, 216)]Закрыто.[/CENTER]',

            prefix: UNACCEPT_PREFIX,

            status: false,

        },
        {

            title: 'Нет доков',

            content:

            "[CENTER][FONT=Verdana][COLOR=rgb(220, 20, 60)]Доброго времени суток, уважаемый(-ая)[COLOR=rgb(209, 213, 216)] - {{ user.name }}.<br><br>"+

            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url][/FONT][COLOR=rgb(209, 213, 216)]<br>"+

            "В вашей жалобе отсутствуют доказательства для рассмотра. <br>"+

            "Прикрепите доказательсва в хорошем качестве на разрешенных платформах.(Yapx/Imgur/YouTube/ImgBB)<br>"+

            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+

            '[COLOR=RED][COLOR=rgb(220, 20, 60)]Отказано[/COLOR],[/COLOR][COLOR=rgb(209, 213, 216)]Закрыто.[/CENTER]',

            prefix: CLOSE_PREFIX,

            status: false,

        },
        {

            title: 'Наказание по ошибке',

            content:

            "[CENTER][FONT=Verdana][COLOR=rgb(154, 205, 50)]Доброго времени суток, уважаемый(-ая)[COLOR=rgb(209, 213, 216)] - {{ user.name }}.<br><br>"+

            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url][/FONT][COLOR=rgb(209, 213, 216)]<br>"+

            "В следствие беседы с администратором, было выяснено, наказание было выдано по ошибке.<br>"+

            "Ваше наказание будет снято в ближайшее время, если оно еще не снято.<br>"+

            "Приносим извинения за предоставленные неудобства.<br>"+

            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+

            '[COLOR=#00FA9A][COLOR=rgb(154, 205, 50)]Одобрено[/COLOR][/COLOR],[COLOR=rgb(209, 213, 216)]Закрыто.[/CENTER]',

            prefix: ACCEPT_PREFIX,

            status: false,

        },
        {

            title: 'Обжалование одобрено',

            content:

            "[CENTER][FONT=Verdana][COLOR=rgb(154,205,50)]Доброго времени суток, уважаемый(-ая)[COLOR=rgb(209, 213, 216)] - {{ user.name }}.<br><br>"+

            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url][/FONT][COLOR=rgb(209, 213, 216)]<br>"+

            "Обжалование одобрено, ваше наказание будет снято/снижено в течение 24-ех часов.<br>"+

            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+

            '[COLOR=#00FA9A][COLOR=rgb(154,205,50)]Одобрено[/COLOR][/COLOR],[COLOR=rgb(209, 213, 216)]Закрыто.[/CENTER]',

            prefix: ACCEPT_PREFIX,

            status: false,

        },
        {

            title: 'Передано ГА',

            content:

            "[CENTER][FONT=Verdana][COLOR=rgb(220, 20, 60)]Доброго времени суток, уважаемый(-ая)[COLOR=rgb(209, 213, 216)] - {{ user.mention }}.<br><br>"+

            "[CENTER][SIZE=4][FONT=times new roman][COLOR=rgb(209, 213, 216)]Ваша тема была передана на рассмотрение [color=red][COLOR=rgb(220, 20, 60)]Главному администратору[/color] @Jesus Mackenzie <br>"+

            "[CENTER][FONT=times new roman] [SIZE=4] [COLOR=ORANGE][COLOR=rgb(255, 127, 80)]Ожидайте ответа.[/color]<br> [COLOR=rgb(220, 20, 60)][/color][/CENTER]<br>",

            prefix: GA_PREFIX,

            status: true,

       },
        {

            title: 'Обжалованию не подлежит',

            content:

            "[CENTER][FONT=Verdana][COLOR=rgb(220, 20, 60)]Доброго времени суток, уважаемый(-ая)[COLOR=rgb(209, 213, 216)] - {{ user.name }}.<br><br>"+

            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url][/FONT][COLOR=rgb(209, 213, 216)]<br>"+

            "Данное нарушение не подлежит обжалованию, в обжаловании отказано.<br>"+

            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+

            '[COLOR=RED][COLOR=rgb(220, 20, 60)]Отказано[/COLOR][/COLOR],[COLOR=rgb(209, 213, 216)]Закрыто.[/CENTER]',

            prefix: CLOSE_PREFIX,

            status: false,

        },
        {

            title: 'Не по форме обж',

            content:

            "[CENTER][FONT=Verdana][COLOR=rgb(220, 20, 60)]Доброго времени суток, уважаемый(-ая)[COLOR=rgb(209, 213, 216)] - {{ user.name }}.<br><br>"+

            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url][/FONT][COLOR=rgb(209, 213, 216)]<br>"+

            "Ваше обжалование составлено не по форме, пожалуйста ознакомьтесь с правилами подачи обжалований : [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B7%D0%B0%D1%8F%D0%B2%D0%BA%D0%B8-%D0%BD%D0%B0-%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F.2639626/']*Нажмите сюда*[/URL]<br>"+

            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+

            '[CENTER][FONT=Verdana][COLOR=RED][COLOR=rgb(220, 20, 60)]Отказано[/COLOR][/COLOR],[COLOR=rgb(209, 213, 216)]Закрыто.[/CENTER]',

            prefix: CLOSE_PREFIX,

            status: false,

        },
        {

            title: 'В ЖБ на теха',

            content:

            "[CENTER][FONT=Verdana][COLOR=rgb(220, 20, 60)]Доброго времени суток, уважаемый(-ая)[COLOR=rgb(209, 213, 216)] - {{ user.name }}.<br><br>"+

            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url][/FONT][COLOR=rgb(209, 213, 216)]<br>"+

            "Вам было выдано наказания Техническим специалистом, вы можете написать жалобу здесь : [URL='https://forum.blackrussia.online/forums/Сервер-№8-pink.1189/']*Нажмите сюда*[/URL]<br>"+

            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+

            '[COLOR=red][COLOR=rgb(220, 20, 60)]Отказано[/COLOR][/COLOR],[COLOR=rgb(209, 213, 216)] Закрыто.[/CENTER]',

            prefix: CLOSE_PREFIX,

            status: false,

        },
        {

            title: 'Спецу',

            content:

            "[CENTER][FONT=Verdana][COLOR=rgb(220, 20, 60)]Доброго времени суток, уважаемый(-ая)[COLOR=rgb(209, 213, 216)] - {{ user.name }}.<br><br>"+

            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url][/FONT][COLOR=rgb(209, 213, 216)]<br>"+

            "Ваша жалоба передана Специальному Администратору.<br>"+

            "Ожидайте ответа в данной теме, не нужно создавать копии этой темы.<br>"+

            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+

            '[COLOR=red][COLOR=rgb(220, 20, 60)]Передано Специальному Администратору.[/COLOR][/CENTER]',

            prefix: SPECIAL_PREFIX,

            status: true,

        },
        {

            title: 'Не готовы снизить',

            content:

            "[CENTER][FONT=Verdana][COLOR=rgb(220, 20, 60)]Доброго времени суток, уважаемый(-ая)[COLOR=rgb(209, 213, 216)] - {{ user.name }}.<br><br>"+

            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url][/FONT][COLOR=rgb(209, 213, 216)]<br>"+

            "Администрация сервера не готова снизить вам наказание.<br>"+

            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+

            '[COLOR=RED][COLOR=rgb(220, 20, 60)]Отказано[/COLOR][/COLOR],[COLOR=rgb(209, 213, 216)]Закрыто.[/CENTER]',

            prefix: CLOSE_PREFIX,

            status: false,

        },
        ];

    $(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
        $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

        // Добавление кнопок при загрузке страницы
        addButton('Меню', 'selectAnswer');
        addButton('На рассмотрение', 'pin');
        addButton('Одобрить', 'accepted');
        addButton('Отказать', 'unaccept');
        addButton('Рассмотрено', 'watched');
        addButton('Закрыть', 'closed');
        addButton('КП', 'teamProject');
        addButton ('Спецу', 'specialAdmin');
        addButton ('ГА', 'mainAdmin');


        // Поиск информации о теме
        const threadData = getThreadData();

        $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
        $(`button#closed`).click(() => editThreadData(CLOSE_PREFIX, false));
        $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
        $(`button#teamProject`).click(() => editThreadData(COMMAND_PREFIX, true));
        $(`button#watched`).click(() => editThreadData(WATCHED_PREFIX, false));
        $(`button#unaccept`).click(() => editThreadData(UNACCEPT_PREFIX, false));
        $(`button#mainAdmin`).click(() => editThreadData(GA_PREFIX, true));

        $(`button#specialAdmin`).click(() => editThreadData(SPECIAL_PREFIX, true));

        $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));

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

    function addButton(name, id) {
        $('.button--icon--reply').before(
            `<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 30px; margin-right: 7px;">${name}</button>`,
        );
    }

    function buttonsMarkup(buttons) {
        return `<div class="select_answer">${buttons
            .map(
            (btn, i) =>
            `<button id="answers-${i}" class="button--primary button ` +
            `rippleButton" style="margin:5px"><span class="button-text">${btn.title}</span></button>`,
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
    }

    function getFormData(data) {
        const formData = new FormData();
        Object.entries(data).forEach(i => formData.append(i[0], i[1]));
        return formData;
    }
})();