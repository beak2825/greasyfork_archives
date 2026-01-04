// ==UserScript==
// @name         Script for appeals
// @namespace    https://forum.blackrussia.online
// @version      3.5
// @description  forward-only!
// @author       Jaden Young
// @match        https://forum.blackrussia.online/index.php?threads/*
// @include      https://forum.blackrussia.online/index.php?threads/
// @icon         https://forum.blackrussia.online/data/avatars/o/41/41376.jpg?1639676541
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/451697/Script%20for%20appeals.user.js
// @updateURL https://update.greasyfork.org/scripts/451697/Script%20for%20appeals.meta.js
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
      content: `[SIZE=4][FONT=times new roman][CENTER]${greeting},[SIZE=4][FONT=times new roman] уважаемый (ая) ${user.mention}.[/CENTER]`,
    },
    {
      title: `На рассмотрении`,
      content:
        `[SIZE=4][FONT=times new roman][CENTER]${greeting},[SIZE=4][FONT=times new roman] уважаемый (ая) ${user.mention}.[/CENTER]<br><br>` +
        `[COLOR=rgb(255, 255, 255)][SIZE=4][CENTER][FONT=times new roman]На рассмотрении.[/FONT][/SIZE][/COLOR][/CENTER]`,
      prefix: PIN_PREFIX,
      status: true,
    },
    {
      title: `Не готов пойти навстречу`,
      content:
        `[SIZE=4][FONT=times new roman][CENTER]${greeting},[SIZE=4][FONT=times new roman] уважаемый (ая) ${user.mention}.[/CENTER]<br><br>` +
        `[CENTER][SIZE=4][FONT=times new roman]Пока я не готов пойти к Вам навстречу.<br><br>` +
        `[COLOR=rgb(255, 0, 13)]Закрыто[/COLOR][COLOR=rgb(255, 255, 255)].[/COLOR][/FONT][/SIZE][/CENTER]`,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: `В обжаловании отказано`,
      content:
        `[SIZE=4][FONT=times new roman][CENTER]${greeting},[SIZE=4][FONT=times new roman] уважаемый (ая) ${user.mention}.[/CENTER]<br><br>` +
        `[CENTER][SIZE=4][FONT=times new roman]В обжаловании отказано.<br><br>` +
        `[COLOR=rgb(255, 0, 13)]Закрыто[/COLOR].[/FONT][/SIZE][/CENTER]`,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Не подлежит обжалованию`,
      content:
        `[SIZE=4][FONT=times new roman][CENTER]${greeting},[SIZE=4][FONT=times new roman] уважаемый (ая) ${user.mention}.[/CENTER]<br><br>` +
        `[CENTER][FONT=times new roman][SIZE=4]Данное наказание не подлежит обжалованию.<br><br>` +
        `[COLOR=rgb(255, 0, 13)]Закрыто[/COLOR]. [/SIZE][/FONT][/CENTER]`,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Блокировка была выдана от Тех. спец-а`,
      content:
        `[SIZE=4][FONT=times new roman][CENTER]${greeting},[SIZE=4][FONT=times new roman] уважаемый (ая) ${user.mention}.[/CENTER]<br><br>` +
        `[CENTER][SIZE=4][FONT=times new roman]Блокировка была выдана от технического специалиста, собственно все дальнейшие разбирательства будут происходить в техническом разделе > жалобы на технических специалистов.<br><br>` +
        `[COLOR=rgb(255, 0, 13)]Закрыто[/COLOR].[/SIZE][/FONT][/CENTER]`,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Блокировка была выдана по наводке от Тех. спец-а`,
      content:
        `[SIZE=4][FONT=times new roman][CENTER]${greeting},[SIZE=4][FONT=times new roman] уважаемый (ая) ${user.mention}.[/CENTER]<br><br>` +
        `[CENTER][SIZE=4][FONT=times new roman]Блокировка была выдана по наводке от технического специалиста, соответственно Вам требуется обратиться в технический раздел => жалобы на технических специалистов.<br><br>` +
        `[COLOR=rgb(255, 0, 13)]Закрыто[/COLOR].[/SIZE][/FONT][/CENTER]`,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Обжалование составлено не по форме`,
      content:
        `[SIZE=4][FONT=times new roman][CENTER]${greeting},[SIZE=4][FONT=times new roman] уважаемый (ая) ${user.mention}.[/CENTER]<br><br>` +
        `[CENTER][SIZE=4][FONT=times new roman]Обжалование составлено не по форме.<br><br>` +
        `[COLOR=rgb(255, 0, 13)]Закрыто[/COLOR].[/SIZE][/FONT][/CENTER]`,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Обращайтесь в раздел жалоб на администрацию`,
      content:
        `[SIZE=4][FONT=times new roman][CENTER]${greeting},[SIZE=4][FONT=times new roman] уважаемый (ая) ${user.mention}.[/CENTER]<br><br>` +
        `[CENTER][SIZE=4][FONT=times new roman]Если вы не согласны с выданным наказанием, то Вам следует обратиться в раздел > жалобы на администрацию.<br><br>` +
        `[COLOR=rgb(255, 0, 13)]Закрыто[/COLOR].[/SIZE][/FONT][/CENTER]`,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Отсутствуют док-ва`,
      content:
        `[SIZE=4][FONT=times new roman][CENTER]${greeting},[SIZE=4][FONT=times new roman] уважаемый (ая) ${user.mention}.[/CENTER]<br><br>` +
        `[CENTER][SIZE=4][FONT=times new roman]В Вашем обжаловании отсутствуют доказательства выдачи наказания.[/CENTER][/SIZE][/FONT]<br><br>` +
        `[CENTER][SIZE=4][FONT=times new roman][COLOR=rgb(255, 0, 13)]Закрыто[/COLOR].[/FONT][/SIZE][/CENTER]`,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Свяжитесь со мной во ВКонтакте`,
      content:
        `[SIZE=4][FONT=times new roman][CENTER]${greeting},[SIZE=4][FONT=times new roman] уважаемый (ая) ${user.mention}.[/CENTER]<br><br>` +
        `[CENTER][SIZE=4][FONT=times new roman]Свяжитесь со мной ВКонтакте - https://vk.com/lobanov_ale`,
      prefix: PIN_PREFIX,
      status: true,
    },
    {
      title: `Отсутствуют док-ва с пострадавшим на его согласие в получении украденного имущества`,
      content:
        `[SIZE=4][FONT=times new roman][CENTER]${greeting},[SIZE=4][FONT=times new roman] уважаемый (ая) ${user.mention}.[/CENTER]<br><br>` +
        `[CENTER][SIZE=4][FONT=times new roman]В обжаловании отсутствуют доказательства переписки с пострадавшим игроком на его согласие в получении украденного имущества.[/CENTER][/SIZE][/FONT]<br><br>` +
        `[CENTER][SIZE=4][FONT=times new roman][COLOR=rgb(255, 0, 13)]Закрыто[/COLOR].[/FONT][/SIZE][/CENTER]`,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Разблокировка для передачи украденного имущества`,
      content:
        `[SIZE=4][FONT=times new roman][CENTER]${greeting},[SIZE=4][FONT=times new roman] уважаемый (ая) ${user.mention}.[/CENTER]<br><br>` +
        `[CENTER][SIZE=4][FONT=times new roman]Ваш аккаунт разблокирован на 24 часа. 
        За это время Вы должны успеть вернуть украденное имущество пострадавшему игроку. 
        Если условие не будет выполнено, то аккаунт вновь будет заблокирован.[/CENTER][/SIZE][/FONT]`,

      prefix: PIN_PREFIX,
      status: true,
    },
    {
      title: `Вы ошиблись разделом сервера`,
      content:
        `[SIZE=4][FONT=times new roman][CENTER]${greeting},[SIZE=4][FONT=times new roman] уважаемый (ая) ${user.mention}.[/CENTER]<br><br>` +
        `[CENTER][SIZE=4][FONT=times new roman]Вы ошиблись разделом сервера.[/CENTER][/SIZE][/FONT]<br><br>` +
        `[CENTER][SIZE=4][FONT=times new roman][COLOR=rgb(255, 0, 13)]Закрыто[/COLOR].[/FONT][/SIZE][/CENTER]`,

      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Прошло 2 дня с момента выдачи наказания`,
      content:
        `[SIZE=4][FONT=times new roman][CENTER]${greeting},[SIZE=4][FONT=times new roman] уважаемый (ая) ${user.mention}.[/CENTER]<br><br>` +
        `[CENTER][SIZE=4][FONT=times new roman]Ваша жалоба не может быть рассмотрена по причине несоблюдения обязательного условия:<br>` +
        `[QUOTE]3.1. Срок написания жалобы составляет два дня (48 часов) с момента совершенного нарушения со стороны администратора сервера.<br><br>` +
        `Примечание: в случае истечения срока жалоба рассмотрению не подлежит.[/QUOTE]<br><br><br>` +
        `[COLOR=rgb(255, 0, 13)]Закрыто[/COLOR].[/SIZE][/FONT][/CENTER]`,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: `-------------------------------------------------- Для жалоб на администрацию --------------------------------------------------`,
    },
    {
      title: `Жалоба составлена не по форме`,
      content:
        `[SIZE=4][FONT=times new roman][CENTER]${greeting},[SIZE=4][FONT=times new roman] уважаемый (ая) ${user.mention}.[/CENTER]<br><br>` +
        `[CENTER][SIZE=4][FONT=times new roman]Жалоба составлена не по форме. Внимательно прочитайте правила составления жалобы, которые закреплены в этом разделе. <br><br>` +
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
