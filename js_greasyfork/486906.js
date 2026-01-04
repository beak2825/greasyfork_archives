// ==UserScript==
// @name         Скрпит для РП ситуаций |  Black Russia UFA
// @namespace    https://forum.blackrussia.online
// @version      2.1.0
// @description  BLACK RUSSIA | UFA
// @author       R.Morozovae
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license    MIT
// @icon         https://i.postimg.cc/y69KrYVx/s-B6-DMyb-HTGRVxo-FPGQEg-LHGZ-V0-VLPIUh-DKZFg-U2-Gngi-F5-HA-Jj-I0vpt8qr-Hwk-UYSBg-ZNkyt-UNDE8-Mh-Qh6a-Yth-A.jpg
// @downloadURL
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/486906/%D0%A1%D0%BA%D1%80%D0%BF%D0%B8%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%A0%D0%9F%20%D1%81%D0%B8%D1%82%D1%83%D0%B0%D1%86%D0%B8%D0%B9%20%7C%20%20Black%20Russia%20UFA.user.js
// @updateURL https://update.greasyfork.org/scripts/486906/%D0%A1%D0%BA%D1%80%D0%BF%D0%B8%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%A0%D0%9F%20%D1%81%D0%B8%D1%82%D1%83%D0%B0%D1%86%D0%B8%D0%B9%20%7C%20%20Black%20Russia%20UFA.meta.js
// ==/UserScript==

(function () {
  "use strict";
  const UNACCEPT_PREFIX = 4; // префикс отказано
  const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
  const PIN_PREFIX = 2; //  префикс закрепить
  const CLOSE_PREFIX = 7; // префикс закрыто
  const buttons = [
    {
      title: "╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴РП СИТУАЦИИ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴",
    },
    {
      title: "РП ситуация одобрено",
      content:
        "[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
        "[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>" +
        "[CENTER][COLOR=#FFFF00][ICODE]Ваша РП ситуация была проверена и получает статус-Одобрено. [/ICODE][/COLOR][/CENTER]<br>" +
        "  [url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>" +
        "[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]" +
        "[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>",
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: "РП ситуация на доработке",
      content:
        "[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
        "[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>" +
        "[CENTER][COLOR=#FFFF00][ICODE]Вам дается 24 часа на дополнение Вашей РП ситуации [/ICODE][/COLOR][/CENTER]<br>" +
        "[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>" +
        "[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]" +
        "[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>",
      prefix: PIN_PREFIX,
      status: false,
    },
    {
      title: "РП ситуация отказ",
      content:
        "[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
        "[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>" +
        "[CENTER][COLOR=#FF0000][ICODE]Ваша РП ситуация получает статус-Отказано.'Причиной отказа могло послужить какое-либо нарушение из Правила RP ситуаций.[/ICODE][/COLOR][/CENTER]<br>" +
        "[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>" +
        "[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]" +
        "[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>",
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: "Не дополнили",
      dpstyle:
        "border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)",
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>" +
        "[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>" +
        "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Вы не дополнили свою RolePlay Ситуацию [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Отказано[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>" +
        "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: "Заголовок не по форме",
      dpstyle:
        "border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)",
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>" +
        "[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>" +
        "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]В вашей RolePlay Ситуации заголовок написан не по форме, внимательно прочитайте правила РП Ситуаций, закрепленные в данном разделе[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Отказано[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>" +
        "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
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

    addButton("РП СИТУАЦИИ😑", "Ynswer");
    // Поиск информации о теме
    const threadData = getThreadData();

    $(`button#pin`).click(() => editThreadData(PIN_PREFIX, true));
    $(`button#accepted`).click(() => editThreadData(ACCEPT_PREFIX, false));
    $(`button#unaccept`).click(() => editThreadData(UNACCEPT_PREFIX, false));
    $(`button#closed`).click(() => editThreadData(CLOSE_PREFIX, false));

    $(`button#Ynswer`).click(() => {
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
    $(".button--icon--reply").before(
      `<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 25px; margin-right: 5px;">${name}</button>`
    );
  }

  function buttonsMarkup(buttons) {
    return `<div class="select_answer">${buttons
      .map(
        (btn, i) =>
          `<button id="answers-${i}" class="button--primary button ` +
          `rippleButton" style="margin:4px"><span class="button-text">${btn.title}</span></button>`
      )
      .join("")}</div>`;
  }

  function pasteContent(id, data = {}, send = false) {
    const templ = Handlebars.compile(buttons[id].content);
    if ($(`.fr-element.fr-view p`).text() === ``)
      $(`.fr-element.fr-view p`).empty();

    $(`span.fr-placeholder`).empty();
    $(`div.fr-element.fr-view p`).append(templ(data));
    $(`a.overlay-titleCloser`).trigger(`click`);

    if (send == true) {
      editThreadData(buttons[id].prefix, buttons[id].status);
      $(`.button--icon.button--icon--reply.rippleButton`).trigger(`click`);
    }
  }

  function getThreadData() {
    const authorID = $("a.username")[0].attributes["data-user-id"].nodeValue;
    const authorName = $("a.username").html();
    const hours = new Date().getHours();
    return {
      user: {
        id: authorID,
        name: authorName,
        mention: `[USER=${authorID}]${authorName}[/USER]`,
      },
      greeting: () =>
        4 < hours && hours <= 11
          ? "Доброе утро"
          : 11 < hours && hours <= 15
          ? "Добрый день"
          : 15 < hours && hours <= 21
          ? "Добрый вечер"
          : "Доброй ночи",
    };
  }

  function editThreadData(prefix, pin = false) {
    // Получаем заголовок темы, так как он необходим при запросе
    const threadTitle = $(".p-title-value")[0].lastChild.textContent;

    if (pin == false) {
      fetch(`${document.URL}edit`, {
        method: "POST",
        body: getFormData({
          prefix_id: prefix,
          title: threadTitle,
          _xfToken: XF.config.csrf,
          _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
          _xfWithData: 1,
          _xfResponseType: "json",
        }),
      }).then(() => location.reload());
    }
    if (pin == true) {
      fetch(`${document.URL}edit`, {
        method: "POST",
        body: getFormData({
          prefix_id: prefix,
          title: threadTitle,
          discussion_open: 1,
          sticky: 1,
          _xfToken: XF.config.csrf,
          _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
          _xfWithData: 1,
          _xfResponseType: "json",
        }),
      }).then(() => location.reload());
    }
    if (
      prefix == UNACCEPT_PREFIX
    ) {
      moveThread(prefix, 1171);
    }
    if (
        prefix == ACCEPT_PREFIX
      ) {
        moveThread(prefix, 1169);
      }
      if (
        prefix == PIN_PREFIX
      ) {
        moveThread(prefix, 1170);
      }
  }

  function moveThread(prefix, type) {
    // Перемещение темы в раздел окончательных ответов
    const threadTitle = $(".p-title-value")[0].lastChild.textContent;

    fetch(`${document.URL}move`, {
      method: "POST",
      body: getFormData({
        prefix_id: prefix,
        title: threadTitle,
        target_node_id: type,
        redirect_type: "none",
        notify_watchers: 1,
        starter_alert: 1,
        starter_alert_reason: "",
        _xfToken: XF.config.csrf,
        _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
        _xfWithData: 1,
        _xfResponseType: "json",
      }),
    }).then(() => location.reload());
  }

  function getFormData(data) {
    const formData = new FormData();
    Object.entries(data).forEach((i) => formData.append(i[0], i[1]));
    return formData;
  }
})();
