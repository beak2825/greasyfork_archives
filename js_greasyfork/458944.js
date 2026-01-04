// ==UserScript==
// @name         BLACK RUSSIA GRAY || Скрипт для ГСХ/ЗГСХ/СХ
// @namespace    https://openuserjs.org/users/Kingston007
// @version      2.0
// @description  Специально для BlackRussia || GROZNY by D.Kolobok
// @author       D.Kolobok
// @match        https://forum.blackrussia.online/index.php?threads/*
// @include      https://forum.blackrussia.online/index.php?threads/
// @match        https://forum.blackrussia.online/index.php?forums/*
// @include      https://forum.blackrussia.online/index.php?forums/
// @match        https://forum.blackrussia.online/index.php?forums/Сервер-№35-grozny.1587/post-thread&inline-mode=1*
// @include      https://forum.blackrussia.online/index.php?forums/Сервер-№35-grozny.1587/post-thread&inline-mode=1
// @icon         https://icons.iconarchive.com/icons/aha-soft/iron-man/48/Ironman-Mask-3-Old-icon.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458944/BLACK%20RUSSIA%20GRAY%20%7C%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%93%D0%A1%D0%A5%D0%97%D0%93%D0%A1%D0%A5%D0%A1%D0%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/458944/BLACK%20RUSSIA%20GRAY%20%7C%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%93%D0%A1%D0%A5%D0%97%D0%93%D0%A1%D0%A5%D0%A1%D0%A5.meta.js
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
            title: `Приветствие`,
            content:
                `[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/SIZE][/CENTER]<br>`,
        },
         {
            title: `Открытия заявок`,
            content:
            `[CENTER][B][FONT=times new roman][SIZE=5][I][COLOR=rgb(235, 107, 86)]Заявления на пост "Агент Поддержки"[/COLOR][/I][/SIZE][/FONT]<br><br>`+
          `[COLOR=rgb(204, 255, 0)][U][SIZE=4][FONT=times new roman][I]Критерии:[/I][/FONT][/SIZE][/U]<br><br>`+
          `[I][SIZE=4][FONT=times new roman]1. Иметь возраст не ниже 15 лет. (исключение до 14)[/FONT][/SIZE]<br>`+
          `[SIZE=4][FONT=times new roman]2. Быть грамотным.[/FONT][/SIZE]<br>`+
          `[SIZE=4][FONT=times new roman]3. Иметь хороший микрофон.[/FONT][/SIZE]<br>`+
          `[SIZE=4][FONT=times new roman]4. Иметь уровень не ниже 8 (без исключений)[/FONT][/SIZE]<br>`+
          `[SIZE=4][FONT=times new roman]5. Иметь желание помогать проекту.[/FONT][/SIZE]<br>`+
          `[SIZE=4][FONT=times new roman]6. Знать команды, /gps сервера.[/FONT][/SIZE]<br>`+
          `[SIZE=4][FONT=times new roman]7. Открыть личные сообщения во ВКонтакте.[/FONT][/SIZE]<br>`+
          `[SIZE=4][FONT=times new roman]ВАЖНО: | Пост хелпера не игрушка. За неотстойку 7 дневного срока будет наказание.[/FONT][/SIZE]<br>`+
          `[SIZE=4][FONT=times new roman]ВАЖНО: | Главный хелпер в праве отказать в вашей заявке, не объясняя причины[/FONT][/SIZE]<br>`+
          `[SIZE=4][FONT=times new roman]ВАЖНО: | Если ваша заявка одобрена то вам напишут в VK и позже добавят в беседу кандидатов.[/FONT][/SIZE]<br>`+
          `[SIZE=4][FONT=times new roman]ВАЖНО: | Ваши заявки будут периодически удаляться.[/FONT][/SIZE]<br>`+
          `[SIZE=4][FONT=times new roman]ВАЖНО: | Иметь активную и не пустую страницу в ВКонтакте.[/FONT][/SIZE][/I]<br>`+
          `[B][SIZE=4][FONT=times new roman][I]ВАЖНО: | Иметь активный и не пустой ФА, которому минимум 30 дней.[/I][/FONT][/SIZE][/B][/COLOR][/B]<br><br>`+


         `[COLOR=rgb(153, 204, 0)][B][FONT=times new roman][SIZE=4][I][U]ФОРМА ПОДАЧИ ЗАЯВЛЕНИЯ:[/U][/I][/SIZE][/FONT][/B][/COLOR]<br>`+

            `[B][FONT=times new roman][SIZE=4][COLOR=rgb(153, 204, 0)][I]1. Ваш игровой никнейм:<br>`+
            `2. Ваш игровой уровень:<br>`+
            `3. Скриншот вашей статистики (ОБЯЗАТЕЛЬНО с /time):<br>`+
            `4. Почему именно вы должны занять пост хелпера (подробно):<br>`+
            `5. Были ли у вас баны/варны, если да то за что:<br>`+
            `6. Что такое по вашему "блат" в общем?:<br>`+
            `7. Ваш реальный возраст:<br>`+
            `8. Страна/город в котором живёте:<br>`+
            `9. Ваш часовой пояс:<br>`+
            `10. Ваше реальное имя:<br>`+
            `11. Ссылка на ваш ВКонтакте:<br>`+
            `12. Логин Discord:<br>`+
            `13. Были ли вы ранее хелпером / администратором:[/I][/COLOR][/SIZE][/FONT][/B]<br>`+

            `[QUOTE][FONT=times new roman][SIZE=4][I][B][COLOR=rgb(247, 218, 100)]Примечание: После одобрение, с вами свяжется Старшая Администрация. Вам будет необходимо добавить представителя старшей администрации в друзья, после вас добавят в специальную беседу. Никто из состава администрации не будет просить у вас все различные пароли, пин-коды, информация о привязках и так далее. Не ведитесь на обманы[/COLOR][/B][/I][/SIZE][/FONT][/QUOTE]<br>`+
            `[COLOR=rgb(250, 197, 28)][B][SIZE=5][FONT=times new roman][I][U]Контакты:[/U][/I][/FONT][/SIZE][/B][/COLOR]<br>`+
            `[COLOR=rgb(209, 213, 216)][B][I][SIZE=4][FONT=times new roman]Главный Администратор[B] —[/B] [/FONT][/SIZE][/I][/B][I][SIZE=4][FONT=times new roman][URL='https://vk.com/id313215658'][B][B]*КЛИК*[/B][/B][/URL][/FONT][/SIZE]<br>`+
            `[SIZE=4][FONT=times new roman][B]Основной ЗГА[B] —[/B] [/B][URL='https://vk.com/id471376695'][B]*КЛИК*[/B][/URL][/FONT][/SIZE]<br>`+
            `[SIZE=4][FONT=times new roman][B]Заместитель ГА [I][B]— [URL='https://vk.com/larshopeless']*КЛИК*[/URL][/B][/I][/B][/FONT][/SIZE]<br>`+
            `[SIZE=4][FONT=times new roman][B][I][B]Куратор Администрации [I][B][I][B]— [URL='https://vk.com/id551260629']*КЛИК*[/URL][/B][/I][/B][/I][/B][/I][/B][/FONT][/SIZE]<br>`+
            `[SIZE=4][FONT=times new roman][B][I][B][I][B][I][B][I][B][I][B]Куратор Администрации [I][B][I][B]— [URL='https://vk.com/id558869279']*КЛИК*[/URL][/B][/I][/B][/I][/B][/I][/B][/I][/B][/I][/B][/I][/B][/I][/B][/FONT][/SIZE]<br>`+
            `[SIZE=4][FONT=times new roman][B]Главный Следящий за АП — [/B][URL='https://vk.com/id659131672'][B][B]*КЛИК*[/B][/B][/URL][/FONT][/SIZE]<br>`+
            `[SIZE=4][FONT=times new roman][B]Заместитель [/B]Главного Следящего[B] за АП — [/B][/FONT][/SIZE][/I][URL='https://vk.com/id631993243'][B][B][SIZE=4][FONT=times new roman][I]*КЛИК*[/I][/FONT][/SIZE][/B][/B][/URL][/COLOR]<br>`+
            `    <br>`+
            `[SIZE=4][FONT=times new roman][COLOR=rgb(209, 213, 216)][I]Контакты даны с целью избежания обманов со стороны людей, которые представляются как ГС АП, ЗГС АП и т.п.[/I][/COLOR]<br>`+
            `[I][COLOR=rgb(209, 213, 216)]Не нужно писать в ЛС с вопросами по типу: "Проверьте заявки", "Когда проверят заявки".[/COLOR][/I][/FONT][/SIZE]<br>`+
            `    <br>`+
            `[B][FONT=times new roman][SIZE=5][COLOR=rgb(255, 0, 0)][I]ОСТЕРЕГАЙТЕСЬ МОШЕННИКОВ, НИКАКОЙ АДМИНИСТРАТОР НЕ ПОПРОСИТ ПАРОЛЬ ОТ ВАШЕГО АККАУНТА![/I][/COLOR]<br>`+
            `    <br>`+
            `[I][COLOR=rgb(65, 168, 95)]Всем желаем удачи! [/COLOR]💚[/I][/SIZE][/FONT][/B][/CENTER]`,
        },
        {
            title: `На рассмотрении`,
            content: `[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman][I]Доброго времени суток, уважаемый[/FONT][/COLOR] *ТЕГНУТЬ* [/SIZE]<br><br>` +
                `[CENTER] Ваша жалоба закреплена и находится на рассмотрении.<br><` +
                `Пожалуйста ожидайте ответа.<br><br>` +
                `[COLOR=orange]На рассмотрение.[/color][/CENTER][/I]]`,
        },
        {
            title: `Профилактическая беседа`,
            content: `[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman][I]Доброго времени суток, уважаемый[/FONT][/COLOR] *ТЕГНУТЬ* [/SIZE]<br><br>` +
                ` Благодарим за ваше обращение!<br>` +
                ` С Агентом Поддержки будет проведена профилактическая беседа.<br><br>` +
                ` [COLOR=lightgreen]Одобрено[/color],закрыто [/CENTER][/I]`,
        },
        {
            title: `Агенту Поддержки выдано наказание`,
            content: `[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman][I]Доброго времени суток, уважаемый[/FONT][/COLOR] *ТЕГНУТЬ* [/SIZE]<br><br>` +
                `Благодарим за ваше обращение!<br>` +
                `Агент Поддержки получит соответствующие наказание<br><br>` +
                `[COLOR=lightgreen]Одобрено[/color],закрыто [/CENTER][/I]`,
        },
        {
            title: `Передана ГСХ`,
            content: `[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman][I]Доброго времени суток, уважаемый[/FONT][/COLOR] *ТЕГНУТЬ* [/SIZE]<br><br>` +
                `[CENTER] Ваша жалоба передана на рассмотрение Главному Следящему за АП.<br>` +
                `Пожалуйста ожидайте ответа.<br><br>` +
                `[COLOR=orange]На рассмотрение.[/color] [/CENTER][/I]`,
        },
        {
            title: `Не в тот раздел`,
            content: `[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman][I]Доброго времени суток, уважаемый[/FONT][/COLOR] *ТЕГНУТЬ* [/SIZE]<br><br>` +
                `Ошиблись разделом,пожалуйста напишите свою жалобу в раздел «РАЗДЕЛ» <br><br>` +
                `[COLOR=red] Отказано[/color],закрыто[/CENTER][/I]`,
        },
        {
            title: `Не является АП`,
            content: `[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman][I]Доброго времени суток, уважаемый[/FONT][/COLOR] *ТЕГНУТЬ* [/SIZE]<br><br>` +
                `Данный игрок не являеться Агентом Поддержки.<br><br>` +
                `[COLOR=red] Отказано[/color],закрыто.[/CENTER][/I]`,
        },
        {
            title: `Агент Поддержки снят`,
            content: `[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman][I]Доброго времени суток, уважаемый[/FONT][/COLOR] *ТЕГНУТЬ* [/SIZE]<br><br>` +
                `Благодарим за ваше обращение!<br>` +
                `Агент Поддержки снят со своего поста. <br><br>` +
                `[COLOR=lightgreen]Одобрено[/color], закрыто [/CENTER][/I]`,
        },
        {
            title: `Недостаточно доказательств`,
            content: `[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman][I]Доброго времени суток, уважаемый[/FONT][/COLOR] *ТЕГНУТЬ* [/SIZE]<br><br>` +
            `[CENTER] Недостаточно доказательств, которые потверждают нарушение Агента Поддержки.<br>`+
            `[CENTER][COLOR=red] Отказано [/color], закрыто.[/CENTER][/I]`,
        },
        {
            title: `Нарушений нету`,
            content: `[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman][I]Доброго времени суток, уважаемый[/FONT][/COLOR] *ТЕГНУТЬ* [/SIZE]<br><br>` +
            `Не увидел нарушений со стороны Агента Поддержки!<br><br>`+
            `[COLOR=red] Отказано,[/color] закрыто.[/CENTER][/I]`,
        },
        {
            title: `Пересмотрена`,
            content: `[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman][I]Доброго времени суток, уважаемый[/FONT][/COLOR] *ТЕГНУТЬ* [/SIZE]<br><br>` +
                `Ваша жалоба была пересмотрена!<br>` +
                `Агент Поддержки получит соответствующие наказание<br><br>` +
                `[COLOR=lightgreen]Одобрено[/color], закрыто [/CENTER][/I]`,
        },
        {
            title: `Правила раздела`,
            content: `[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman][I]Доброго времени суток, уважаемый[/FONT][/COLOR] *ТЕГНУТЬ* <br><br>` +
            `[CENTER]Пожалуйста, убедительная просьба, ознакомится с назначением данного раздела в котором Вы создали тему, так как ваш запрос никоим образом не относится к предназначению данного раздела.[/CENTER]<br><br>`+
		    `[CENTER][COLOR=red] Отказано[/color], закрыто.[/SIZE][/I][/CENTER]<br><br>`,
        },
        {
            title: `Неактив одобрено`,
            content: `[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman][I]Доброго времени суток, уважаемый[/FONT][/COLOR] *ТЕГНУТЬ* [/SIZE]<br><br>` +
            `[CENTER]Ваша заявка на неактив [COLOR=lightgreen]одобрена[/color].[/I][/CENTER]`,
        },
        {
            title: `Неактив отказано`,
            content: `[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman][I]Доброго времени суток, уважаемый[/FONT][/COLOR] *ТЕГНУТЬ* [/SIZE]<br><br>` +
            `[CENTER]Ваша заявка на неактив [COLOR=red]отказана[/color].[/I][/CENTER]`,
        },
        {
            title: `Снятие преда | Одобрено`,
            content: `[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman][I]Доброго времени суток, уважаемый[/FONT][/COLOR] *ТЕГНУТЬ* [/SIZE]<br><br>` +
            `[FONT=times new roman][SIZE=4]Ваша заявка получает статус [COLOR=rgb(97, 189, 109)]"одобрено"[/COLOR].[/SIZE][/FONT]<br>`+
            `[COLOR=rgb(84, 172, 210)][SIZE=4][FONT=times new roman]Снял вам предупреждение за выполненное задание (50 ask / 80 minutes).[/I][/FONT][/SIZE][/COLOR][/CENTER]`,
        },
        {
            title: `Снятие преда | Отказано`,
            content: `[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman][I]Доброго времени суток, уважаемый[/FONT][/COLOR] *ТЕГНУТЬ* [/SIZE]<br><br>` +
            `[FONT=times new roman][SIZE=4]Ваша заявка получает статус [COLOR=rgb(209, 72, 65)]"отказано"[/COLOR].[/SIZE][/FONT]<br>`+
            `[COLOR=rgb(84, 172, 210)][SIZE=4][FONT=times new roman]Вы не выполнили задание в 50 ask / 80 minutes.[/I][/FONT][/SIZE][/COLOR][/CENTER]`,
        },
        {
            title: `Снятие выга | Одобрено`,
            content: `[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman][I]Доброго времени суток, уважаемый[/FONT][/COLOR] *ТЕГНУТЬ* [/SIZE]<br><br>` +
            `[FONT=times new roman][SIZE=4]Ваша заявка получает статус [COLOR=rgb(97, 189, 109)]"одобрено"[/COLOR].[/SIZE][/FONT]<br>`+
            `[COLOR=rgb(84, 172, 210)][SIZE=4][FONT=times new roman]Снял вам выговор за выполненное задание (80 ask / 90 minutes).[/I][/FONT][/SIZE][/COLOR][/CENTER]`,
        },
        {
            title: `Снятие выга | Отказано`,
            content: `[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman][I]Доброго времени суток, уважаемый[/FONT][/COLOR] *ТЕГНУТЬ* [/SIZE]<br><br>` +
            `[FONT=times new roman][SIZE=4]Ваша заявка получает статус [COLOR=rgb(209, 72, 65)]"отказано"[/COLOR].[/SIZE][/FONT]<br>`+
            `[COLOR=rgb(84, 172, 210)][SIZE=4][FONT=times new roman]Вы не выполнили задание в 80 ask / 90 minutes.[/I][/FONT][/SIZE][/COLOR][/CENTER]`,
        },
        {
            title: `Пропуск собрания | Одобрено`,
            content: `[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman][I]Доброго времени суток, уважаемый[/FONT][/COLOR] *ТЕГНУТЬ* [/SIZE]<br><br>` +
            `[FONT=times new roman][SIZE=4]Ваша заявка получает статус [COLOR=rgb(97, 189, 109)]"одобрено"[/COLOR].[/SIZE][/FONT]`,
        },
        {
            title: `Пропуск собрания | Отказано`,
            content: `[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman][I]Доброго времени суток, уважаемый[/FONT][/COLOR] *ТЕГНУТЬ* [/SIZE]<br><br>` +
            `[FONT=times new roman][SIZE=4]Ваша заявка получает статус [COLOR=rgb(209, 72, 65)]"отказано"[/COLOR].[/SIZE][/FONT]`,
        },
    ];







    $(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
        $(`body`).append(`<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`);

        // Добавление кнопок при загрузке страницы
        addButton(`На рассмотрение`, `pin`);
        addButton(`Закрыто`, `close`);
        addButton(`Ответы`, `selectAnswer`);


        // Поиск информации о теме
        const threadData = getThreadData();

        $(`button#pin`).click(() => editThreadData(PIN_PREFIX, true));
        $(`button#close`).click(() => editThreadData(CLOSE_PREFIX, true));
        $(`button#selectAnswer`).click(() => {
            XF.alert(buttonsMarkup(buttons), null, `Выберите ответ:`);
            buttons.forEach((btn, id) => {
                if (id > 999) {
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
                method: `WRITE`,
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
                method: `WRITE`,
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