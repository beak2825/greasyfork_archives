// ==UserScript==
// @name         BLACK RUSSIA GROZNY || Скрипт для ГС/ЗГС ГОСС.
// @namespace    https://forum.blackrussia.online
// @version      4.02
// @description  Специально для BlackRussia || GROZNY by Kolobok
// @author       D.Kolobok
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @match        https://forum.blackrussia.online/forums/*
// @include      https://forum.blackrussia.online/forums/
// @match        https://forum.blackrussia.online/forums/Сервер-№35-grozny.1587/post-thread&inline-mode=1*
// @include      https://forum.blackrussia.online/forums/Сервер-№35-grozny.1587/post-thread&inline-mode=1
// @grant        none
// @license      MIT
// @icon https://emoji.gg/assets/emoji/9372-blurple-boost-level-9.png
// @downloadURL https://update.greasyfork.org/scripts/472853/BLACK%20RUSSIA%20GROZNY%20%7C%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%93%D0%A1%D0%97%D0%93%D0%A1%20%D0%93%D0%9E%D0%A1%D0%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/472853/BLACK%20RUSSIA%20GROZNY%20%7C%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%93%D0%A1%D0%97%D0%93%D0%A1%20%D0%93%D0%9E%D0%A1%D0%A1.meta.js
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
          title: `Заявления`,
        content:
        `[IMG alt="RLw3J.png"]https://i.postimg.cc/d1V5wkjn/RLw3J.png[/IMG] <br>
        [CENTER][FONT=times new roman]Доброго времени суток, каждый из игроков подходящий по критериям ниже имеет право оставить это заявление, и побороться за лидерство. Помните главное, данный пост это серьезный шаг, делая его Вы соглашаетесь со всеми критериями, а так же понимаете то что должны будете отдавать игре много времени, для поддержания стабильной работы вашей организации. Только после понимания того на что вы идете, пишите это заявление и просим вас не тратить наше время на то, чтобы проверить бессмысленные заявления![/FONT][/CENTER] <br>
        [FONT=times new roman][IMG alt="RLw3J.png"]https://i.postimg.cc/d1V5wkjn/RLw3J.png[/IMG][/FONT] <br>
        [CENTER][FONT=times new roman]Критерии для подачи заявления на пост лидера: <br><br>

        Игровой уровень не менее 8-ого. <br>
        Не иметь действующих наказаний. <br>
        Минимальный суточный онлайн 3 часа. <br>
        Реальный возраст от 15 лет (Без исключений). <br>
        Знание правил Role-Play и правила отыгровки RP. <br>
        Открытый профиль в "VK", дабы была возможность добавлять в беседы. <br>
        [IMG alt="RLw3J.png"]https://i.postimg.cc/d1V5wkjn/RLw3J.png[/IMG] <br>
        Примечание: Если вы не выполнили/не подходите по вышеперечисленным критериям, следящая администрация имеет право вам отказать в заявление на пост «Лидера».[/FONT][/CENTER] <br>
        [FONT=times new roman][IMG alt="RLw3J.png"]https://i.postimg.cc/d1V5wkjn/RLw3J.png[/IMG][/FONT] <br><br>

        [CENTER][FONT=times new roman]Форма подачи заявления: <br><br>

        IС информация: <br>
        Ваш ник: <br>
        Ваш игровой уровень: <br>
        Ваша статистика (/stats): <br>
        Скриншот лицензий (/lic): <br>
        Скриншот истории смены игровых NickName'ов (/history): <br>
        Ваша RolePlay биография [Одобренная]: <br><br>

        [IMG alt="RLw3J.png"]https://i.postimg.cc/d1V5wkjn/RLw3J.png[/IMG] <br><br>

        ООС информация: <br>
        Ваше реальное имя и фамилия: <br>
        Ваш возраст: <br>
        Страна город/страна проживания: <br>
        Часовой пояс (указать в часах от мск): <br>
        Ваш средний суточный онлайн: <br>
        Расскажите о себе (чем увлекаетесь, занимаетесь в свободное время): <br>
        Почему именно вы должны занять данный пост, и администрация должна выбрать именно вас?: <br>
        Имеется ли опыт на посту лидера: <br>
        Как вы оцените свою грамотность по 10 бальной шкале? <br>
        Представьте ситуацию - У вас завязался сильный конфликт с лидером другой организации, ваши действия и рассуждения в данной ситуации? Как Вы будете решать эту ситуацию?: <br>
        Вы сможете удерживать members 30+ стабильно?: <br>
        Ваш логин в Discord: <br>
        Ссылка на Вашу страничку VK: <br><br>
        [IMG alt="RLw3J.png"]https://i.postimg.cc/d1V5wkjn/RLw3J.png[/IMG] <br><br>
        1. В анкетах всегда поощряется полное описание всего! Меньше воды, больше интересной информации дабы мы могли представить Вас как личность! Заявки(анкеты), это тоже один из важнейших этапов прохождения на пост лидерства, отнеситесь к этому очень серьезно! <br>
        2. Чьи анкеты по мнению администрации[/FONT] [FONT=times new roman]не несут в себе достаточной информации, могут быть отклонены или удалены без объяснения причины! <br>
        3. Все скриншоты должны быть с /time. <br>
        4. Скриншоты должны быть сделаны после открытия заявок на пост лидера фракции. <br>
        5. Ваша страница в ВК не должна быть "Фейком". <br>
        6. Нельзя занимать места в заявках. За нарушение этого, Ваше сообщение будет удалено.[/FONT] <br><br>
        [IMG alt="RLw3J.png"]https://i.postimg.cc/d1V5wkjn/RLw3J.png[/IMG] <br><br>
        [B][COLOR=rgb(255, 0, 0)][FONT=times new roman]ВАЖНО[/FONT][/COLOR][/B][COLOR=rgb(255, 0, 0)]:[/COLOR] <br>
        [FONT=georgia]Обман администрации даже в анкетах, несет за собой нарушение правил проекта, а именно "2.34. Запрещен обман администрации", <br>
        Если, у вас есть уверенность в том, что вам действительно нужен данный пост лидера - вы можете смело подавать заявку. Если вы не уверены, что сможете отстоять хотя бы 15 дней, не стоит совершать данный поступок.[/FONT] <br>
        [COLOR=rgb(255, 0, 0)][FONT=georgia]Помните, что при уходе с данного поста, при этом не отстояв срок в 15 дней, Вы получить блокировку аккаунта на 15 дней.[/FONT][/COLOR] <br><br>
        [IMG alt="RLw3J.png"]https://i.postimg.cc/d1V5wkjn/RLw3J.png[/IMG] <br><br>
        [SIZE=6]До обзвона подготовить улучшения, которые озвучивать нужно на обзвоне, в заявке их писать не нужно.[/SIZE][/CENTER]`,
        prefix: PIN_PREFIX,
        status: true,
	 },
    {
      title: 'На рассмотрение',
      content:
        `[CENTER][URL='https://postimages.org/'][SIZE=4][I][FONT=times new roman][IMG]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG][/FONT][/I][/SIZE][/URL]<br>` +
		`[FONT=times new roman][SIZE=4][I][B][COLOR=AQUA]${greeting}, уважаемый ${user.mention}[/COLOR][/B][/I][/SIZE][/FONT][/CENTER]<br><br>` +
		`[CENTER][FONT=times new roman][SIZE=4][I][B][COLOR=lavender]Ваша жалоба взята на рассмотрение, пожалуйста не создавайте дубликатов. Ожидайте ответа.[/COLOR]<br>` +
		`[COLOR=lavender][URL='https://postimages.org/'][IMG]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG][/URL][/COLOR][/B][/I][/SIZE][/FONT]<br>` +
		`[SIZE=4][B][B][FONT=times new roman][COLOR=orange][I]На рассмотрении[/I][/COLOR][/FONT][/B][/B][/SIZE][/CENTER]`,
      prefix: PIN_PREFIX,
	  status: true,
    },
    {
      title: `Будет проведена беседа с лидером`,
      content:
        `[CENTER][URL='https://postimages.org/'][SIZE=4][I][FONT=times new roman][IMG]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG][/FONT][/I][/SIZE][/URL]<br>` +
		`[FONT=times new roman][SIZE=4][I][B][COLOR=AQUA]${greeting}, уважаемый ${user.mention}[/COLOR][/B][/I][/SIZE][/FONT][/CENTER]<br><br>` +
		`[CENTER][FONT=times new roman][SIZE=4][I][B][COLOR=lavender]Ваша жалоба была одобрена, с лидером будет проведена беседа.[/COLOR]<br>` +
		`[COLOR=lavender][URL='https://postimages.org/'][IMG]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG][/URL][/COLOR][/B][/I][/SIZE][/FONT]<br>` +
		`[SIZE=4][B][B][FONT=times new roman][COLOR=rgb(0, 255, 0)][I]Одобрено[/I][/COLOR][/FONT][/B][/B][/SIZE][/CENTER]`,
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
        title:`Будет проведена беседа с заместителем`,
        content:
        `[CENTER][URL='https://postimages.org/'][SIZE=4][I][FONT=times new roman][IMG]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG][/FONT][/I][/SIZE][/URL]<br>` +
		`[FONT=times new roman][SIZE=4][I][B][COLOR=AQUA]${greeting}, уважаемый ${user.mention}[/COLOR][/B][/I][/SIZE][/FONT][/CENTER]<br><br>` +
		`[CENTER][FONT=times new roman][SIZE=4][I][B][COLOR=lavender]Ваша жалоба была одобрена, с заместителем будет проведена беседа.[/COLOR]<br>` +
		`[COLOR=lavender][URL='https://postimages.org/'][IMG]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG][/URL][/COLOR][/B][/I][/SIZE][/FONT]<br>` +
		`[SIZE=4][B][B][FONT=times new roman][COLOR=rgb(0, 255, 0)][I]Одобрено[/I][/COLOR][/FONT][/B][/B][/SIZE][/CENTER]`,
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title:'Не по форме',
        content:
        `[CENTER][URL='https://postimages.org/'][SIZE=4][I][FONT=times new roman][IMG]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG][/FONT][/I][/SIZE][/URL]<br>` +
		`[FONT=times new roman][SIZE=4][I][B][COLOR=AQUA]${greeting}, уважаемый ${user.mention}[/COLOR][/B][/I][/SIZE][/FONT][/CENTER]<br><br>` +
        `[CENTER][FONT=times new roman][SIZE=4][I][B][COLOR=lavender]Жалоба составлена не по форме.<br>` +
        `Внимательно прочитайте правила составления жалобы [/COLOR]- [URL='https://forum.blackrussia.online/threads/Правила-подачи-жалоб-на-лидеров.3429391/']*ТЫК*[/URL]<br>` +
        `[COLOR=lavender][URL='https://postimages.org/'][IMG]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG][/URL][/COLOR][/B][/I][/SIZE][/FONT]<br>` +
		`[SIZE=4][B][B][FONT=times new roman][COLOR=rgb(255, 0, 0)][I]Отказано[/I][/COLOR][/FONT][/B][/B][/SIZE][/CENTER]`,
        prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title:`Отсутствует /time`,
        content:
        `[CENTER][URL='https://postimages.org/'][SIZE=4][I][FONT=times new roman][IMG]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG][/FONT][/I][/SIZE][/URL]<br>` +
		`[FONT=times new roman][SIZE=4][I][B][COLOR=AQUA]${greeting}, уважаемый ${user.mention}[/COLOR][/B][/I][/SIZE][/FONT][/CENTER]<br><br>` +
		`[CENTER][FONT=times new roman][SIZE=4][I][B][COLOR=lavender]На доказательствах отсуствует /time.[/COLOR]<br>` +
		`[COLOR=lavender][URL='https://postimages.org/'][IMG]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG][/URL][/COLOR][/B][/I][/SIZE][/FONT]<br>` +
		`[SIZE=4][B][B][FONT=times new roman][COLOR=rgb(255, 0, 0)][I]Отказано[/I][/COLOR][/FONT][/B][/B][/SIZE][/CENTER]`,
        prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title:`Срок написания жалобы составляет два дня`,
        content:
        `[CENTER][URL='https://postimages.org/'][SIZE=4][I][FONT=times new roman][IMG]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG][/FONT][/I][/SIZE][/URL]<br>` +
		`[FONT=times new roman][SIZE=4][I][B][COLOR=AQUA]${greeting}, уважаемый ${user.mention}[/COLOR][/B][/I][/SIZE][/FONT][/CENTER]<br><br>` +
		`[CENTER][FONT=times new roman][SIZE=4][I][B][COLOR=lavender]3.1. Срок написания жалобы составляет два дня (48 часов) с момента совершенного нарушения со стороны лидера сервера.[/COLOR]<br>` +
		`[COLOR=lavender][URL='https://postimages.org/'][IMG]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG][/URL][/COLOR][/B][/I][/SIZE][/FONT]<br>` +
		`[SIZE=4][B][B][FONT=times new roman][COLOR=rgb(255, 0, 0)][I]Отказано[/I][/COLOR][/FONT][/B][/B][/SIZE][/CENTER]`,
        prefix: CLOSE_PREFIX,
        status: false,
    },
    {
        title:`Жалоба от 3-го лица`,
        content:
        `[CENTER][URL='https://postimages.org/'][SIZE=4][I][FONT=times new roman][IMG]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG][/FONT][/I][/SIZE][/URL]<br>` +
		`[FONT=times new roman][SIZE=4][I][B][COLOR=AQUA]${greeting}, уважаемый ${user.mention}[/COLOR][/B][/I][/SIZE][/FONT][/CENTER]<br><br>` +
		`[CENTER][FONT=times new roman][SIZE=4][I][B][COLOR=lavender]3.3. Жалоба от третьего лица не принимается (жалоба должна быть подана участником ситуации).[/COLOR]<br>` +
		`[COLOR=lavender][URL='https://postimages.org/'][IMG]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG][/URL][/COLOR][/B][/I][/SIZE][/FONT]<br>` +
		`[SIZE=4][B][B][FONT=times new roman][COLOR=rgb(255, 0, 0)][I]Отказано[/I][/COLOR][/FONT][/B][/B][/SIZE][/CENTER]`,
        prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
         title:`Отсутствуют доказательства`,
        content:
        `[CENTER][URL='https://postimages.org/'][SIZE=4][I][FONT=times new roman][IMG]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG][/FONT][/I][/SIZE][/URL]<br>` +
		`[FONT=times new roman][SIZE=4][I][B][COLOR=AQUA]${greeting}, уважаемый ${user.mention}[/COLOR][/B][/I][/SIZE][/FONT][/CENTER]<br><br>` +
		`[CENTER][FONT=times new roman][SIZE=4][I][B][COLOR=lavender]В вашей жалобе отсутствуют доказательства о нарушении со стороны лидера/заместителя.[/COLOR]<br>` +
		`[COLOR=lavender][URL='https://postimages.org/'][IMG]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG][/URL][/COLOR][/B][/I][/SIZE][/FONT]<br>` +
		`[SIZE=4][B][B][FONT=times new roman][COLOR=rgb(255, 0, 0)][I]Отказано[/I][/COLOR][/FONT][/B][/B][/SIZE][/CENTER]`,
        prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title:`Проверив доказательства от лидера выговор были выданы верно`,
        content:
        `[CENTER][URL='https://postimages.org/'][SIZE=4][I][FONT=times new roman][IMG]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG][/FONT][/I][/SIZE][/URL]<br>` +
		`[FONT=times new roman][SIZE=4][I][B][COLOR=AQUA]${greeting}, уважаемый ${user.mention}[/COLOR][/B][/I][/SIZE][/FONT][/CENTER]<br><br>` +
		`[CENTER][FONT=times new roman][SIZE=4][I][B][COLOR=lavender]Лидер предоставил доказательства. Выговорвыдан верно.[/COLOR]<br>` +
		`[COLOR=lavender][URL='https://postimages.org/'][IMG]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG][/URL][/COLOR][/B][/I][/SIZE][/FONT]<br>` +
		`[SIZE=4][B][B][FONT=times new roman][COLOR=rgb(255, 0, 0)][I]Отказано[/I][/COLOR][/FONT][/B][/B][/SIZE][/CENTER]`,
        prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title:`Проверив доказательства от заместителя выговор были выданы верно`,
        content:
        `[CENTER][URL='https://postimages.org/'][SIZE=4][I][FONT=times new roman][IMG]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG][/FONT][/I][/SIZE][/URL]<br>` +
		`[FONT=times new roman][SIZE=4][I][B][COLOR=AQUA]${greeting}, уважаемый ${user.mention}[/COLOR][/B][/I][/SIZE][/FONT][/CENTER]<br><br>` +
		`[CENTER][FONT=times new roman][SIZE=4][I][B][COLOR=lavender]Заместитель предоставил доказательства. Выговор выдан верно.[/COLOR]<br>` +
		`[COLOR=lavender][URL='https://postimages.org/'][IMG]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG][/URL][/COLOR][/B][/I][/SIZE][/FONT]<br>` +
		`[SIZE=4][B][B][FONT=times new roman][COLOR=rgb(255, 0, 0)][I]Отказано[/I][/COLOR][/FONT][/B][/B][/SIZE][/CENTER]`,
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
                if (id > 0) {
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
