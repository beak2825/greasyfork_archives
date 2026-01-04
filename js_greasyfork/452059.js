// ==UserScript==
// @name         Curator's script for Forum
// @namespace    https://forum.blackrussia.online
// @version      3.4
// @description  forward-only!
// @author       Jaden Young
// @match        https://forum.blackrussia.online/index.php?threads/*
// @include      https://forum.blackrussia.online/index.php?threads/
// @icon         https://i.pinimg.com/736x/c7/0b/ad/c70badd3c06b38cc5e2fd36e3b0deba3--good-looking-men-paul-walker.jpg
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/452059/Curator%27s%20script%20for%20Forum.user.js
// @updateURL https://update.greasyfork.org/scripts/452059/Curator%27s%20script%20for%20Forum.meta.js
// ==/UserScript==

(async function () {
  `use strict`;
  const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
  const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
  const PIN_PREFIX = 2; // Prefix that will be set when thread pins
  const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
  const WATCHED_PREFIX = 9;
  const CLOSE_PREFIX = 7;
  const TECH_PREFIX = 13;
  const RESHENO_PREFIX = 6;
  const data = await getThreadData(),
    greeting = data.greeting,
    user = data.user;
  const buttons = [
    {
      title: `Приветствие`,
      content: `[SIZE=4][FONT=trebuchet MS][CENTER]${greeting},[SIZE=4][FONT=trebuchet MS] уважаемый (ая) ${user.mention}.[/CENTER]`,
    },

    {
      title: `На рассмотрении`,
      content:
        `[SIZE=4][FONT=trebuchet MS][CENTER]${greeting},[SIZE=4][FONT=trebuchet MS] уважаемый (ая) ${user.mention}.[/CENTER]<br><br>` +
        `[COLOR=rgb(255, 255, 255)][SIZE=4][CENTER][FONT=trebuchet MS]На рассмотрении.[/FONT][/SIZE][/COLOR][/CENTER]`,
      prefix: PIN_PREFIX,
      status: true,
    },

    {
      title: `Свяжитесь со мной во ВКонтакте`,
      content:
        `[SIZE=4][FONT=trebuchet MS][CENTER]${greeting},[SIZE=4][FONT=trebuchet MS] уважаемый (ая) ${user.mention}.[/CENTER]<br><br>` +
        `[COLOR=rgb(255, 255, 255)][SIZE=4][CENTER][FONT=trebuchet MS]Свяжитесь со мной во ВКонтакте - https://vk.com/karaulov35 [/FONT][/SIZE][/COLOR][/CENTER]`,
      prefix: PIN_PREFIX,
      status: true,
    },

    {
      title: `Наказание выдано верно`,
      content:
        `[SIZE=4][FONT=trebuchet MS][CENTER]${greeting},[SIZE=4][FONT=trebuchet MS] уважаемый (ая) ${user.mention}.[/CENTER]<br><br>` +
        `[SIZE=4][FONT=trebuchet MS][CENTER]Наказание было выдано верно.<br><br>` +
        `[COLOR=rgb(255, 0, 13)]Закрыто[/COLOR].[/SIZE][/FONT][/CENTER]`,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },

    {
      title: `Приносим свои извинения`,
      content:
        `[SIZE=4][FONT=trebuchet MS][CENTER]${greeting},[SIZE=4][FONT=trebuchet MS] уважаемый (ая) ${user.mention}.[/CENTER]<br><br>` +
        `[CENTER][SIZE=4][FONT=trebuchet MS]Мы приносим свои извинения. Наказание будет снято.<br><br>` +
        `[COLOR=rgb(102, 255, 0)]Одобрено[/COLOR], закрыто.[/CENTER][/FONT][/SIZE]`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },

    {
      title: `Ответ был дан выше (одобрено)`,
      content:
        `[SIZE=4][FONT=trebuchet MS][CENTER]${greeting},[SIZE=4][FONT=trebuchet MS] уважаемый (ая) ${user.mention}.[/CENTER]<br><br>` +
        `[CENTER][SIZE=4][FONT=trebuchet MS]Ответ был дан выше.<br><br>` +
        `[COLOR=rgb(102, 255, 0)]Одобрено[/COLOR], закрыто.[/CENTER][/FONT][/SIZE]`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },

    {
      title: `Ответ был дан выше (отказано)`,
      content:
        `[SIZE=4][FONT=trebuchet MS][CENTER]${greeting},[SIZE=4][FONT=trebuchet MS] уважаемый (ая) ${user.mention}.[/CENTER]<br><br>` +
        `[CENTER][SIZE=4][FONT=trebuchet MS]Ответ был дан выше.<br><br>` +
        `[COLOR=rgb(255, 0, 13)]Закрыто[/COLOR].[/SIZE][/FONT][/CENTER]`,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },

    {
      title: `Блокировка была выдана от Тех. спец-а`,
      content:
        `[SIZE=4][FONT=trebuchet MS][CENTER]${greeting},[SIZE=4][FONT=trebuchet MS] уважаемый (ая) ${user.mention}.[/CENTER]<br><br>` +
        `[CENTER][SIZE=4][FONT=trebuchet MS]Блокировка была выдана от технического специалиста, собственно все дальнейшие разбирательства будут происходить в техническом разделе > жалобы на технических специалистов.<br><br>` +
        `[COLOR=rgb(255, 0, 13)]Закрыто[/COLOR].[/SIZE][/FONT][/CENTER]`,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },

    {
      title: `Offtop`,
      content:
        `[SIZE=4][FONT=trebuchet MS][CENTER]${greeting},[SIZE=4][FONT=trebuchet MS] уважаемый (ая) ${user.mention}.[/CENTER]<br><br>` +
        `[CENTER][SIZE=4][FONT=trebuchet MS]Созданная  вами тема никоим образом не относится к теме данного раздела.<br><br>` +
        `[COLOR=rgb(255, 0, 13)]Закрыто[/COLOR].[/SIZE][/FONT][/CENTER]`,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },

    {
      title: `Обратитесь в раздел обжалований`,
      content:
        `[SIZE=4][FONT=trebuchet MS][CENTER]${greeting},[SIZE=4][FONT=trebuchet MS] уважаемый (ая) ${user.mention}.[/CENTER]<br><br>` +
        `[CENTER][SIZE=4][FONT=trebuchet MS]Вам необходимо обратиться в раздел обжалований.<br><br>` +
        `[COLOR=rgb(255, 0, 13)]Закрыто[/COLOR].[/SIZE][/FONT][/CENTER]`,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },

    {
      title: `Жалоба не по форме`,
      content:
        `[SIZE=4][FONT=trebuchet MS][CENTER]${greeting},[SIZE=4][FONT=trebuchet MS] уважаемый (ая) ${user.mention}.[/CENTER]<br><br>` +
        `[CENTER][SIZE=4][FONT=trebuchet MS]Жалоба составлена не по форме. Внимательно прочитайте правила составления жалобы, которые закреплены в этом разделе.<br><br>` +
        `[COLOR=rgb(255, 0, 13)]Закрыто[/COLOR].[/SIZE][/FONT][/CENTER]`,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },

    {
      title: `Дублирование темы`,
      content:
        `[SIZE=4][FONT=trebuchet MS][CENTER]${greeting},[SIZE=4][FONT=trebuchet MS] уважаемый (ая) ${user.mention}.[/CENTER]<br><br>` +
        `[CENTER][SIZE=4][FONT=trebuchet MS]Напоминаем, при 3 дублированиях Ваш форумный аккаунт будет заблокирован.<br><br>` +
        `[COLOR=rgb(255, 0, 13)]Закрыто[/COLOR].[/SIZE][/FONT][/CENTER]`,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },

    {
      title: `Отсутствуют док-ва`,
      content:
        `[SIZE=4][FONT=trebuchet MS][CENTER]${greeting},[SIZE=4][FONT=trebuchet MS] уважаемый (ая) ${user.mention}.[/CENTER]<br><br>` +
        `[CENTER][SIZE=4][FONT=trebuchet MS]У вас отсутствует доказательство (скриншот с выдачей наказания).<br><br>` +
        `[COLOR=rgb(255, 0, 13)]Закрыто[/COLOR].[/SIZE][/FONT][/CENTER]`,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },

    {
      title: `Прошло 2 дня с момента выдачи наказания`,
      content:
        `[SIZE=4][FONT=trebuchet MS][CENTER]${greeting},[SIZE=4][FONT=trebuchet MS] уважаемый (ая) ${user.mention}.[/CENTER]<br><br>` +
        `[CENTER][SIZE=4][FONT=trebuchet MS]Ваша жалоба не может быть рассмотрена по причине несоблюдения обязательного условия:<br><br>` +
        `[QUOTE]3.1. Срок написания жалобы составляет два дня (48 часов) с момента совершенного нарушения со стороны администратора сервера.<br>` +
        `Примечание: в случае истечения срока жалоба рассмотрению не подлежит.[/QUOTE]<br><br>` +
        `[COLOR=rgb(255, 0, 13)]Закрыто[/COLOR].[/SIZE][/FONT][/CENTER]`,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },

    {
      title: `Прошло 2 дня с момента выдачи наказания (жб на куратора+)`,
      content:
        `[SIZE=4][FONT=trebuchet MS][CENTER]${greeting},[SIZE=4][FONT=trebuchet MS] уважаемый (ая) ${user.mention}.[/CENTER]<br><br>` +
        `[CENTER][SIZE=4][FONT=trebuchet MS]Ваша жалоба не может быть рассмотрена по причине несоблюдения обязательного условия:<br><br>` +
        `[QUOTE]3.1. Срок написания жалобы составляет два дня (48 часов) с момента совершенного нарушения со стороны администратора сервера.<br>` +
        `Примечание: в случае истечения срока жалоба рассмотрению не подлежит.[/QUOTE]<br><br>` +
        `[COLOR=rgb(255, 255, 255)][SIZE=4][CENTER][FONT=trebuchet MS]На рассмотрении.[/FONT][/SIZE][/COLOR][/CENTER]`,
      prefix: PIN_PREFIX,
      status: true,
    },

    {
      title: `-------------------------------------------------- Для жалоб на игроков --------------------------------------------------`,
    },

    {
      title: `Трансфер`,
      content:
        `[SIZE=4][FONT=trebuchet MS][CENTER]${greeting},[SIZE=4][FONT=trebuchet MS] уважаемый (ая) ${user.mention}.[/CENTER]<br><br>` +
        `[CENTER][SIZE=4][FONT=trebuchet MS]Игрок будет заблокирован за трансфер. <br><br>` +
        `[COLOR=rgb(102, 255, 0)]Одобрено[/COLOR], закрыто.[/SIZE][/FONT][/CENTER]`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },

    {
      title: `Ущерб экономике`,
      content:
        `[SIZE=4][FONT=trebuchet MS][CENTER]${greeting},[SIZE=4][FONT=trebuchet MS] уважаемый (ая) ${user.mention}.[/CENTER]<br><br>` +
        `[CENTER][SIZE=4][FONT=trebuchet MS] Игрок будет заблокирован за Ущерб Экономике.<br><br> ` +
        `[COLOR=rgb(102, 255, 0)]Одобрено[/COLOR], закрыто.[/SIZE][/FONT][/CENTER]`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },

    {
      title: `Замена объявлений (7 дней бана, 2 категория ЧСа)`,
      content:
        `[SIZE=4][FONT=trebuchet MS][CENTER]${greeting},[SIZE=4][FONT=trebuchet MS] уважаемый (ая) ${user.mention}.[/CENTER]<br><br>` +
        `[CENTER][SIZE=4][FONT=trebuchet MS]Игрок будет наказан по данному пункту общих правил для государственных организаций: [QUOTE]<br><br>` +
        `4.04. Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком [COLOR=rgb(255, 0, 13)]| Ban 7 дней + ЧС организации[/COLOR][/QUOTE]<br><br>` +
        `[COLOR=rgb(102, 255, 0)]Одобрено[/COLOR], закрыто.[/SIZE][/FONT][/CENTER]`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },

    {
      title: `Исп функционала СМИ в л/ц (7 дней ЧСа)`,
      content:
        `[SIZE=4][FONT=trebuchet MS][CENTER]${greeting},[SIZE=4][FONT=trebuchet MS] уважаемый (ая) ${user.mention}.[/CENTER]<br><br>` +
        `[CENTER][SIZE=4][FONT=trebuchet MS]Игрок будет занесен в ЧС СМИ на 7 дней по причине использования функционала в личных целях.<br><br>` +
        `[COLOR=rgb(102, 255, 0)]Одобрено[/COLOR], закрыто.[/SIZE][/FONT][/CENTER]`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },

    {
      title: `Нарушений нет`,
      content:
        `[SIZE=4][FONT=trebuchet MS][CENTER]${greeting},[SIZE=4][FONT=trebuchet MS] уважаемый (ая) ${user.mention}.[/CENTER]<br><br>` +
        `[CENTER][SIZE=4][FONT=trebuchet MS]Нарушений со стороны игрока нет.<br><br>` +
        `[COLOR=rgb(255, 0, 13)]Закрыто[/COLOR].[/SIZE][/FONT][/CENTER]`,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },

    {
      title: `Найден ФастКоннект`,
      content:
        `[SIZE=4][FONT=trebuchet MS][CENTER]${greeting},[SIZE=4][FONT=trebuchet MS] уважаемый (ая) ${user.mention}.[/CENTER]<br><br>` +
        `[CENTER][SIZE=4][FONT=trebuchet MS]Игрок будет наказан по данному пункту регламента: [QUOTE]<br><br>` +
        `[COLOR=rgb(255, 0, 13)]2.22.[/COLOR] Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками[COLOR=rgb(255, 0, 13)] | Ban 15 - 30 дней / PermBan.[/COLOR][/QUOTE]<br><br>` +
        `[COLOR=rgb(102, 255, 0)]Одобрено[/COLOR], закрыто.[/SIZE][/FONT][/CENTER]`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },

    {
      title: `ФастКоннект не найден`,
      content:
        `[SIZE=4][FONT=trebuchet MS][CENTER]${greeting},[SIZE=4][FONT=trebuchet MS] уважаемый (ая) ${user.mention}.[/CENTER]<br><br>` +
        `[CENTER][SIZE=4][FONT=trebuchet MS] Проверив логи игрока, могу смело заявить — Фаст Коннект у данного игрок не обнаружен!<br><br>` +
        `[COLOR=rgb(255, 0, 13)]Закрыто[/COLOR].[/SIZE][/FONT][/CENTER]`,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
  ];

  $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $(`body`).append(
      `<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`
    );
    // Добавление кнопок при загрузке страницы
    addButton(`На рассмотрении`, `pinned`);
    addButton(`Одобрено`, `accepted`);
    addButton(`Отказано`, `unaccepted`);
    addButton(`Закрыто`, `closed`);
    addButton(`Тех специалисту`, `tech`);
    addButton(`Рассмотрено`, `watched`);
    addButton(`Решено`, `resheno`);
    addButton(`Ответы`, `selectAnswer`);

    // Поиск информации о теме
    const threadData = getThreadData();

    $(`button#pinned`).click(() => editThreadData(PIN_PREFIX, true));
    $(`button#accepted`).click(() => editThreadData(ACCEPT_PREFIX, false));
    $(`button#unaccepted`).click(() => editThreadData(UNACCEPT_PREFIX, false));
    $(`button#closed`).click(() => editThreadData(CLOSE_PREFIX, false));
    $(`button#tech`).click(() => editThreadData(TECH_PREFIX, true));
    $(`button#watched`).click(() => editThreadData(WATCHED_PREFIX, false));
    $(`button#resheno`).click(() => editThreadData(RESHENO_PREFIX, false));
    $(`button#selectAnswer`).click(() => {
      XF.alert(buttonsMarkup(buttons), null, `Выберите ответ:`);
      buttons.forEach((btn, id) => {
        if (id > 0) {
          $(`button#answers-${id}`).click(() =>
            pasteContent(id, threadData, true)
          );
        } else {
          $(`button#answers-${id}`).click(() =>
            pasteContent(id, threadData, false)
          );
        }
      });
    });
  });

  function addButton(name, id) {
    $(`.button--icon--reply`).before(
      `<button type="button" class="button rippleButton" id="${id}" style="margin: 3px;">${name}</button>`
    );
  }

  function buttonsMarkup(buttons) {
    return `<div class="select_answer">${buttons
      .map(
        (btn, i) =>
          `<button id="answers-${i}" class="button--primary button ` +
          `rippleButton" style="margin:5px"><span class="button-text">${btn.title}</span></button>`
      )
      .join(``)}</div>`;
  }

  function pasteContent(id, data = {}, send = false) {
    const template = Handlebars.compile(buttons[id].content);
    if ($(`.fr-element.fr-view p`).text() === ``)
      $(`.fr-element.fr-view p`).empty();

    $(`span.fr-placeholder`).empty();
    $(`div.fr-element.fr-view p`).append(template(data));
    $(`a.overlay-titleCloser`).trigger(`click`);
  $(`.button--icon.button--icon--reply.rippleButton`).trigger(`click`);
    if (send == true) {
      editThreadData(buttons[id].prefix, buttons[id].status);
      $(`.button--icon.button--icon--reply.rippleButton`).trigger(`click`);
    }
  }

  async function getThreadData() {
    const authorID = $(`a.username`)[0].attributes[`data-user-id`].nodeValue;
    const authorName = $(`a.username`).html();
    const hours = new Date().getHours();
    const greeting =
      4 < hours && hours <= 11
        ? `Доброе утро`
        : 11 < hours && hours <= 15
        ? `Добрый день`
        : 15 < hours && hours <= 21
        ? `Добрый вечер`
        : `Доброй ночи`;

    return {
      user: {
        id: authorID,
        name: authorName,
        mention: `[USER=${authorID}]${authorName}[/USER]`,
      },
      greeting: greeting,
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
    Object.entries(data).forEach((i) => formData.append(i[0], i[1]));
    return formData;
  }
})();
