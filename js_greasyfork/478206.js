// ==UserScript==
// @name         GRAY | скрипт для обжалования
// @namespace    https://greasyfork.org/ru/users/1032828-crystalby
// @version      2.0
// @description  Скрипт для упрощения работы ГА/ЗГА/Кураторов администрации.
// @author       Oliver Cromwell
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @icon         https://icons.iconarchive.com/icons/papirus-team/papirus-apps/48/emerald-theme-manager-icon-icon.png
// @grant        none
// @license 	 none
// @downloadURL https://update.greasyfork.org/scripts/478206/GRAY%20%7C%20%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/478206/GRAY%20%7C%20%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F.meta.js
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
            title: '---------------------------------------------------------------> Обжалование <---------------------------------------------------------------',
        },
        {
            title: 'На рассмотрение',
            content:
            "[SIZE=4][CENTER][FONT=Georgia]Доброго времени суток<br>"+
            "Ставлю ваше обжалование на рассмотрение.<br>"+
            "Вам остаётся ожидать ответа в данной теме , просьба во время рассмотрения не создавать дубликатов темы.<br>"+
            '[COLOR=orange]На рассмотрении.[/COLOR][/FONT][/CENTER]',
            prefix: PIN_PREFIX,
            status: true,
        },
        {
            title: 'Нон рп обман (пострадавший )',
            content:
            "[SIZE=4][CENTER][FONT=Georgia]Доброго времени суток<br>"+
            "Игроку даётся на возврат имущества 24 часа , фрапс возврата прикрепите сообщением ниже . <br>"+
            "Желаем приятной игры и не попадайтесь на мошенников. <br>"+
            '[COLOR=GREEN]Рассмотрено[/COLOR], Открыто для дальнейших разбирательств.[/FONT][/CENTER]',
            prefix: WATCHED_PREFIX,
            status: false,
        },
        {
            title: 'Плохое качество докв',
            content:
            "[SIZE=4][CENTER][FONT=Georgia]Доброго времени суток<br>"+
            "Доказательства в плохом качестве , что бы получить возможность обжалования , прикрепите доказательства в хорочем качестве.<br>"+
            '[COLOR=RED]Отказано[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Нет доков',
            content:
            "[SIZE=4][CENTER][FONT=Georgia]Доброго времени суток <br>"+
            "В вашем обжаловании отсутствуют доказательства . <br>"+
            "Прикрепите доказательсва загруженные на платформах указанных далее..(Yapx/Imgur/YouTube/ImgBB)<br>"+
            '[COLOR=RED]Отказано[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Не рабочие док-ва',
            content:
            "[SIZE=4][CENTER][FONT=Times New Roman]Доброго времени суток<br>"+
            "Предоставленные вами доказательства нерабочие,либо же отсутсвуют вовсе, создайте новую тему, прикрепив рабочую ссылку на док-ва.<br>"+
            '[COLOR=RED]Отказано[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Окно бана для обж',
            content:
            "[SIZE=4][CENTER][FONT=Georgia]Доброго времени суток<br>"+
            "Зайдите в игру и сделайте скрин окна с баном после чего, заново напишите обжалование .<br>"+
            '[COLOR=RED]Отказано[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Дублирование обж ',
            content:
            "[SIZE=4][CENTER][FONT=Georgia]Доброго времени суток<br>"+
            "Ответ вам уже был дан в предыдущей теме..<br>"+
            "На данный момент моё решение по поводу вашего наказания не изменилось. <br>"+
            '[COLOR=red]Отказано[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Спецу обж ',
            content:
            "[SIZE=4][CENTER][FONT=Georgia]Доброго времени суток<br>"+
            "Ваше обжалование  передано Специальному Администратору.<br>"+
            "Ожидайте ответа в данной теме, не нужно создавать дубликатов этой темы.<br>"+
            '[COLOR=red]Передано Специальному Администратору.[/COLOR][/FONT][/CENTER]',
            prefix: SPECIAL_PREFIX,
            status: true,
        },
        {
            title: 'В ЖБ на теха',
            content:
            "[SIZE=4][CENTER][FONT=Georgia]Доброго времени суток<br>"+
            "Вам было выдано наказание техническим специалистом, вы можете написать жалобу здесь : [URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D1%85-%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%BE%D0%B2.490/']*Нажмите сюда*[/URL]<br>"+
            '[COLOR=red]Отказано[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Не по форме',
            content:
            "[SIZE=4][CENTER][FONT=Georgia]Доброго времени суток<br>"+
            "Ваше обжалование составлено не по форме, пожалуйста ознакомьтесь с правилами подачи обжалований.<br>"+
            '[CENTER][FONT=Verdana][COLOR=RED]Отказано[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Обжалованию не подлежит',
            content:
            "[SIZE=4][CENTER][FONT=Georgia]Доброго времени суток<br>"+
            "Данное нарушение не подлежит обжалованию, в обжаловании отказано.<br>"+
            '[COLOR=RED]Отказано[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'отказано',
            content:
            "[SIZE=4][CENTER][FONT=Georgia]Доброго времени суток<br>"+
            "В обжаловании отказано .<br>"+
            '[COLOR=RED]Отказано[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Нон рп обман',
            content:
            "[SIZE=4][CENTER][FONT=Georgia]Доброго времени суток<br>"+
            "Нужно , что бы обманутая сторона написала обжалование при условии , что вы вернёте украденное.<br>"+
            '[COLOR=RED]Отказано[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Одобрено',
            content:
            "[SIZE=4][CENTER][FONT=Georgia]Доброго времени суток<br>"+
            "Было принято решение одобрить ваше обжалование.<br>"+
            "Желаем приятной игры и больше не нарушайте .<br>"+
            '[COLOR=#00FA9A]Одобрено[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Передано ГА обж',
            content:
            "[SIZE=4][CENTER][FONT=Georgia]Доброго времени суток<br>"+
            "Обжалование передано Главному Администратору.<br>"+
            "Ожидайте ответа в данной теме, не нужно создавать копии этой темы.<br>"+
            '[COLOR=orange]На рассмотрение[/COLOR][/FONT][/CENTER]',
            prefix: GA_PREFIX,
            status: true,
        },
        {
            title: 'Соц. сети ОБЖ',
            content:
            "[SIZE=4][CENTER][FONT=Georgia]Доброго времени суток<br>"+
            " Ваши доказательства загружены в социальной сети , просьба загрузить их на фотохостинг.<br>"+
            "На данный момент ваше обжалование рассмотрению не подлежит и вынужден его отказать . <br>"+
            '[COLOR=red]Отказано[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'В жб на админов',
            content:
            "[SIZE=4][CENTER][FONT=Georgia]Доброго времени суток<br>"+
            " Если не согласны с выданым вам наказанием то обратитесь в раздел жалоб на администрацию . <br>"+
            '[COLOR=red]Отказано[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'оффтоп',
            content:
            "[SIZE=4][CENTER][FONT=Georgia]Доброго времени суток<br>"+
            "Не по теме. <br>"+
            "Просьба не публиковать такие темы - это приведёт к блокировке вашего форумного аккаунта.<br>"+
            '[COLOR=RED]Отказано[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Жалоба / обжалование из другого сервера',
            content:
            "[SIZE=4][CENTER][FONT=Georgia]Доброго времени суток<br>"+
            "Вы ошиблись разделом и попали не на свой сервер.<br>"+
            "Переношу вашу тему в нужный раздел , ожидайте ответа от руководства вашего сервера.<br>"+
            '[COLOR=orange]На рассмотрении.[/COLOR][/FONT][/CENTER]',
            prefix: PIN_PREFIX,
            status: true,
        },
        {
            title: 'бан по IP',
            content:
            "[SIZE=4][CENTER][FONT=Georgia]Доброго времени суток<br>"+
            "Перезагрузите или смените свой интернет,с этого IP адресса были серьёзные нарушения. <br>"+
            "В случае если ничего не изменится , то вам стоит продублировать жалобу.<br>"+
            '[COLOR=RED] Закрыто.[/COLOR][/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Нарушение из за взлома',
            content:
            "[SIZE=4][CENTER][FONT=Georgia]Доброго времени суток<br>"+
            "Ответственность за свой аккаунт несёте только вы , нарушение было с вашего аккаунта.<br>"+
            "Что бы такого не было - установите более сложный пароль и дополнительную безопастность. <br>"+
            '[COLOR=RED]Отказано[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Ответ от ГА уже был ',
            content:
            "[SIZE=4][CENTER][FONT=Georgia]Доброго времени суток<br>"+
            "Ответ от главного администратора вам уже был дан .<br>"+
            '[COLOR=RED]Отказано[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        }
    ];

    $(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
        $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

        // Добавление кнопок при загрузке страницы
        addButton('Меню', 'selectAnswer');
        addButton('Одобрить', 'accepted');
        addButton('Отказать', 'unaccept');
        addButton('На рассмотрение', 'pin');
        addButton('Рассмотрено', 'watched');
        addButton('Закрыть', 'closed');
        addButton('КП', 'teamProject');
        addButton ('Спецу', 'specialAdmin');
        addButton ('ГА', 'mainAdmin');


        // Поиск информации о теме
        const threadData = getThreadData();

        $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
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