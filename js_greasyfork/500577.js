// ==UserScript==
// @name         BLACK | Скрипт для руководства АП by Myrphyy
// @namespace    https://forum.blackrussia.online
// @version      1.1.2
// @description  Скрипт для упрощения работы Руководства АП BLACK.
// @author       Jony_Myrphyy
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @icon         https://icons.iconarchive.com/icons/google/noto-emoji-food-drink/256/32382-hamburger-icon.png
// @grant        none
// @license 	 none
// @downloadURL https://update.greasyfork.org/scripts/500577/BLACK%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D1%80%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0%20%D0%90%D0%9F%20by%20Myrphyy.user.js
// @updateURL https://update.greasyfork.org/scripts/500577/BLACK%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D1%80%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0%20%D0%90%D0%9F%20by%20Myrphyy.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const UNACCEPT_PREFIX = 4; // Префикс "Отказано"
    const ACCEPT_PREFIX = 8; // Префикс "Одобрено"
    const PIN_PREFIX = 2; // Префикс "На рассмотрении"
    const WATCHED_PREFIX = 9; // Префикс "Рассмотрено"
    const CLOSE_PREFIX = 7; // Префикс "Закрыто"
    const buttons = [
        {
            title: 'Не по форме',
            content:
            "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
    "[url=https://i.postimg.cc/9M1c86Sz/56-B2-BBA3-346-E-44-FA-AE09-CBBB182617-AB.png][img]https://i.postimg.cc/9M1c86Sz/56-B2-BBA3-346-E-44-FA-AE09-CBBB182617-AB.png[/img][/url]<br>"+
            "Ваша жалоба составлена не по форме, ознакомьтесь с правилами подачи жалоб : [URL='https://forum.blackrussia.online/threads/black-Жалобы-на-Агентов-Поддержки.8641181/']*Кликабельно*[/URL]<br>"+
       "[url=https://i.postimg.cc/9M1c86Sz/56-B2-BBA3-346-E-44-FA-AE09-CBBB182617-AB.png][img]https://i.postimg.cc/9M1c86Sz/56-B2-BBA3-346-E-44-FA-AE09-CBBB182617-AB.png[/img][/url]<br>"+
            '[COLOR=RED]Отказано[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Не является хелпером',
            content:
            "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Данный игрок не является агентом поддержки.<br>"+
            "[url=https://i.postimg.cc/9M1c86Sz/56-B2-BBA3-346-E-44-FA-AE09-CBBB182617-AB.png][img]https://i.postimg.cc/9M1c86Sz/56-B2-BBA3-346-E-44-FA-AE09-CBBB182617-AB.png[/img][/url]<br>"+
            '[COLOR=RED]Закрыто.[/COLOR][/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Нет /time',
            content:
            "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://i.postimg.cc/9M1c86Sz/56-B2-BBA3-346-E-44-FA-AE09-CBBB182617-AB.png][img]https://i.postimg.cc/9M1c86Sz/56-B2-BBA3-346-E-44-FA-AE09-CBBB182617-AB.png[/img][/url]<br>"+
            "В предоставленных доказательствах отсутствует /time, жалоба не подлежит рассмотрению.<br>"+
             "[url=https://i.postimg.cc/9M1c86Sz/56-B2-BBA3-346-E-44-FA-AE09-CBBB182617-AB.png][img]https://i.postimg.cc/9M1c86Sz/56-B2-BBA3-346-E-44-FA-AE09-CBBB182617-AB.png[/img][/url]<br>"+
            '[COLOR=RED]Отказано[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'От 3 лица',
            content:
            "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
             "[url=https://i.postimg.cc/9M1c86Sz/56-B2-BBA3-346-E-44-FA-AE09-CBBB182617-AB.png][img]https://i.postimg.cc/9M1c86Sz/56-B2-BBA3-346-E-44-FA-AE09-CBBB182617-AB.png[/img][/url]<br>"+
            "Жалоба на агента поддержки составлена от 3-го лица, жалобы подобного формата рассмотрению не подлежат.<br>"+
             "[url=https://i.postimg.cc/9M1c86Sz/56-B2-BBA3-346-E-44-FA-AE09-CBBB182617-AB.png][img]https://i.postimg.cc/9M1c86Sz/56-B2-BBA3-346-E-44-FA-AE09-CBBB182617-AB.png[/img][/url]<br>"+
            '[COLOR=RED]Отказано[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Нужен фрапс',
            content:
            "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) {{ user.name }}..<br><br>"+
             "[url=https://i.postimg.cc/9M1c86Sz/56-B2-BBA3-346-E-44-FA-AE09-CBBB182617-AB.png][img]https://i.postimg.cc/9M1c86Sz/56-B2-BBA3-346-E-44-FA-AE09-CBBB182617-AB.png[/img][/url]<br>"+
            "В данной ситуации обязательно должна присутствовать видеофиксация всех моментов. Жалоба не подлежит рассмотрению.<br>"+
            "[url=https://i.postimg.cc/9M1c86Sz/56-B2-BBA3-346-E-44-FA-AE09-CBBB182617-AB.png][img]https://i.postimg.cc/9M1c86Sz/56-B2-BBA3-346-E-44-FA-AE09-CBBB182617-AB.png[/img][/url]<br>"+
            '[COLOR=RED]Отказано[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Прошло более 48 часов',
            content:
            "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
             "[url=https://i.postimg.cc/9M1c86Sz/56-B2-BBA3-346-E-44-FA-AE09-CBBB182617-AB.png][img]https://i.postimg.cc/9M1c86Sz/56-B2-BBA3-346-E-44-FA-AE09-CBBB182617-AB.png[/img][/url]<br>"+
            "С момента нарушения прошло более 48-ми часов, жалоба не подлежит рассмотрению.<br>"+
            "[url=https://i.postimg.cc/9M1c86Sz/56-B2-BBA3-346-E-44-FA-AE09-CBBB182617-AB.png][img]https://i.postimg.cc/9M1c86Sz/56-B2-BBA3-346-E-44-FA-AE09-CBBB182617-AB.png[/img][/url]<br>"+
            '[COLOR=RED]Отказано[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Нет доков',
            content:
            "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://i.postimg.cc/9M1c86Sz/56-B2-BBA3-346-E-44-FA-AE09-CBBB182617-AB.png][img]https://i.postimg.cc/9M1c86Sz/56-B2-BBA3-346-E-44-FA-AE09-CBBB182617-AB.png[/img][/url]<br>"+
            "В вашей жалобе отсутствуют доказательства для рассмотрения. <br>"+
            "Прикрепите доказательсва в хорошем качестве на разрешенных платформах.(Yapx/Imgur/YouTube/ImgBB)<br>"+
             "[url=https://i.postimg.cc/9M1c86Sz/56-B2-BBA3-346-E-44-FA-AE09-CBBB182617-AB.png][img]https://i.postimg.cc/9M1c86Sz/56-B2-BBA3-346-E-44-FA-AE09-CBBB182617-AB.png[/img][/url]<br>"+
            '[COLOR=RED]Отказано[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {

            title: `Недостаточно док-вы`,
            content:
            "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
             "[url=https://i.postimg.cc/9M1c86Sz/56-B2-BBA3-346-E-44-FA-AE09-CBBB182617-AB.png][img]https://i.postimg.cc/9M1c86Sz/56-B2-BBA3-346-E-44-FA-AE09-CBBB182617-AB.png[/img][/url]<br>"+
            `[CENTER] Недостаточно доказательств, которые потверждают нарушение агента поддержки.<br>`+
              "[url=https://i.postimg.cc/9M1c86Sz/56-B2-BBA3-346-E-44-FA-AE09-CBBB182617-AB.png][img]https://i.postimg.cc/9M1c86Sz/56-B2-BBA3-346-E-44-FA-AE09-CBBB182617-AB.png[/img][/url]<br>"+
            ` [CENTER][color=red] Отказано[/color],закрыто.[/CENTER][/FONT]<br><br>`,
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Нет нарушений',
            content:
            "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://i.postimg.cc/9M1c86Sz/56-B2-BBA3-346-E-44-FA-AE09-CBBB182617-AB.png][img]https://i.postimg.cc/9M1c86Sz/56-B2-BBA3-346-E-44-FA-AE09-CBBB182617-AB.png[/img][/url]<br>"+
            "Исходя из приложенных выше доказательств - нарушения со стороны агента поддержки отсутствуют.<br>"+
             "[url=https://i.postimg.cc/9M1c86Sz/56-B2-BBA3-346-E-44-FA-AE09-CBBB182617-AB.png][img]https://i.postimg.cc/9M1c86Sz/56-B2-BBA3-346-E-44-FA-AE09-CBBB182617-AB.png[/img][/url]<br>"+
            '[COLOR=red]Отказано[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Правила раздела',
            content:
            "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://i.postimg.cc/9M1c86Sz/56-B2-BBA3-346-E-44-FA-AE09-CBBB182617-AB.png][img]https://i.postimg.cc/9M1c86Sz/56-B2-BBA3-346-E-44-FA-AE09-CBBB182617-AB.png[/img][/url]<br>"+
            "Пожалуйста, убедительная просьба, ознакомится с назначением данного раздела в котором Вы создали тему, так как ваш запрос никоим образом не относится к предназначению данного раздела. <br>"+
             "[url=https://i.postimg.cc/9M1c86Sz/56-B2-BBA3-346-E-44-FA-AE09-CBBB182617-AB.png][img]https://i.postimg.cc/9M1c86Sz/56-B2-BBA3-346-E-44-FA-AE09-CBBB182617-AB.png[/img][/url]<br>"+
            '[COLOR=RED]Закрыто.[/COLOR][/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: '--------------------------------------------------------------->Одобрение жалобы<---------------------------------------------------------------'
        },
        {
            title: 'Проинструкировать',
            content:
            "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://i.postimg.cc/9M1c86Sz/56-B2-BBA3-346-E-44-FA-AE09-CBBB182617-AB.png][img]https://i.postimg.cc/9M1c86Sz/56-B2-BBA3-346-E-44-FA-AE09-CBBB182617-AB.png[/img][/url]<br>"+
            "Спасибо за ваше обращение! Агент поддержки будет проинструктирован.<br>"+
            "Приносим извинения за предоставленные неудобства.<br>"+
            "[url=https://i.postimg.cc/9M1c86Sz/56-B2-BBA3-346-E-44-FA-AE09-CBBB182617-AB.png][img]https://i.postimg.cc/9M1c86Sz/56-B2-BBA3-346-E-44-FA-AE09-CBBB182617-AB.png[/img][/url]<br>"+
            '[COLOR=#00FA9A]Одобрено[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Беседа с хелпером',
            content:
            "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
             "[url=https://i.postimg.cc/9M1c86Sz/56-B2-BBA3-346-E-44-FA-AE09-CBBB182617-AB.png][img]https://i.postimg.cc/9M1c86Sz/56-B2-BBA3-346-E-44-FA-AE09-CBBB182617-AB.png[/img][/url]<br>"+
            "Ваша жалоба была рассмотрена и одобрена, с агентом поддержки будет проведена строгая профилактическая беседа.<br>"+
            "Приносим извинения за предоставленные неудобства.<br>"+
            "[url=https://i.postimg.cc/9M1c86Sz/56-B2-BBA3-346-E-44-FA-AE09-CBBB182617-AB.png][img]https://i.postimg.cc/9M1c86Sz/56-B2-BBA3-346-E-44-FA-AE09-CBBB182617-AB.png[/img][/url]<br>"+
            '[COLOR=#00FA9A]Одобрено[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Выговор',
            content:
            "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://i.postimg.cc/9M1c86Sz/56-B2-BBA3-346-E-44-FA-AE09-CBBB182617-AB.png][img]https://i.postimg.cc/9M1c86Sz/56-B2-BBA3-346-E-44-FA-AE09-CBBB182617-AB.png[/img][/url]<br>"+
             `[CENTER] Агент поддержки получит выговор.<br>`+
            `[CENTER] Благодарим за ваше обращение<br>`+
            "[url=https://i.postimg.cc/9M1c86Sz/56-B2-BBA3-346-E-44-FA-AE09-CBBB182617-AB.png][img]https://i.postimg.cc/9M1c86Sz/56-B2-BBA3-346-E-44-FA-AE09-CBBB182617-AB.png[/img][/url]<br>"+
            '[COLOR=#00FA9A]Одобрено[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: '---------------------------------------------------------------> Раздел для проверки форума  <------------------------------------------',
        },
        {
            title: `Неактивы одобрены`,
            content: `[center][size=5][font=georgia][color=white]Все выше:[/color][color=rgb(0, 255, 0)]Одобрено[/color]<br><br>`+
             "[url=https://i.postimg.cc/9M1c86Sz/56-B2-BBA3-346-E-44-FA-AE09-CBBB182617-AB.png][img]https://i.postimg.cc/9M1c86Sz/56-B2-BBA3-346-E-44-FA-AE09-CBBB182617-AB.png[/img][/url]<br>"+
            `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятного отдыха! [/COLOR][/FONT][/SIZE][/CENTER]`,
         },
        {
           title: `Выговоры одобрены`,
           content: `[center][size=5][font=georgia][color=white]Все выше:[/color][color=rgb(0, 255, 0)]Одобрено[/color]<br><br>`+
           "[url=https://i.postimg.cc/9M1c86Sz/56-B2-BBA3-346-E-44-FA-AE09-CBBB182617-AB.png][img]https://i.postimg.cc/9M1c86Sz/56-B2-BBA3-346-E-44-FA-AE09-CBBB182617-AB.png[/img][/url]<br>"+
           `[color=red]Примечание:[/color] На отказанное ответил! [color=black]BLACK[/color]<br>`,
        },
        {
           title: `Обменник баллов Одобрено`,
           content:  "[CENTER][FONT=georgia]Доброго времени суток.<br><br>"+
           "[url=https://i.postimg.cc/9M1c86Sz/56-B2-BBA3-346-E-44-FA-AE09-CBBB182617-AB.png][img]https://i.postimg.cc/9M1c86Sz/56-B2-BBA3-346-E-44-FA-AE09-CBBB182617-AB.png[/img][/url]<br>"+
           `[color=green] Одобрено, вы получите свой заветный приз! [/color]<br>`,
},
        {
           title: `Обменник баллов Отказано`,
           content:  "[CENTER][FONT=georgia]Доброго времени суток.<br><br>"+
           "[url=https://i.postimg.cc/9M1c86Sz/56-B2-BBA3-346-E-44-FA-AE09-CBBB182617-AB.png][img]https://i.postimg.cc/9M1c86Sz/56-B2-BBA3-346-E-44-FA-AE09-CBBB182617-AB.png[/img][/url]<br>"+
           `[color=red] Отказано, как нибудь в следующий раз! [/color]<br>`,
        }
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