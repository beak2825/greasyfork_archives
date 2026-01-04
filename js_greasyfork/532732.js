// ==UserScript==
// @name         Скрипт для Кураторов Форума
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Скрипт для Кураторв Форума
// @author       Valik
// @match        https://forum.blackrussia.online/threads/*
// @icon         https://scontent.fbzy1-1.fna.fbcdn.net/v/t39.30808-6/258373301_307111411260400_691949802744386287_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=QtREybLboYUQ7kNvgEVo-no&_nc_oc=AdjZ7q2RXxml8Nv2PXsg4hf_ouY3M6mAuuDygkmhgYVhk_kB6FrQknzPtQIeNVQKvIQ&_nc_zt=23&_nc_ht=scontent.fbzy1-1.fna&_nc_gid=A9Agb62TxNqkfjscUC-RO9h&oh=00_AYBQ0mJ5oy7eor6WQaxh_Ol7fV10KJSrX6drCfEGMmj6iA&oe=6770F781
// @grant        none
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/532732/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/532732/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0.meta.js
// ==/UserScript==

(function () {
  "use strict";
  const UNACCСEPT_PREFIX = 4; // префикс отказано
  const ACCСEPT_PREFIX = 8; // префикс одобрено
  const PINN_PREFIX = 2; //  префикс закрепить
  const SPECADM_PREFIX = 11; // специальному администратору
  const GA_PREFIX = 12; // главному адамнистратору
  const CLOSE_PREFIX = 7;
  const TEXY_PREFIX = 13;
  const REALIZOVANO_PREFIX = 5;
  const VAJNO_PREFIX = 1;
  const OJIDANIE_PREFIX = 14;
  const OTKAZBIO_PREFIX = 4;
  const ODOBRENOBIO_PREFIX = 8;
  const NARASSMOTRENIIBIO_PREFIX = 2;
  const PREFIKS = 0;
  const KACHESTVO = 15;
  const RASSMOTRENO_PREFIX = 9;
  const OTKAZRP_PREFIX = 4;
  const ODOBRENORP_PREFIX = 8;
  const NARASSMOTRENIIRP_PREFIX = 2;
  const OTKAZORG_PREFIX = 4;
  const ODOBRENOORG_PREFIX = 8;
  const NARASSMOTRENIIORG_PREFIX = 2;
  const buttons = [
    {
      title:
        "ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠ⚠️RP Биографии⚠️ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠ",
    },
    {
      title: "✅Одобрено✅",
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/img][/url]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>" +
        "[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
        "[B][CENTER][COLOR=lavender] Ваша Биография получает статус - [COLOR=#00FF00]Одобрено[/COLOR]<br><br>" +
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>" +
        "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>" +
        "[url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]<br>",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: "❌Не по форме❌",
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/img][/url]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>" +
        "[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
        "[B][CENTER][COLOR=lavender] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR], Причиной отказа послужило нарушение Правила написания RP биографии <br><br>" +
        "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>" +
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>" +
        "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>" +
        "[url=ht-0-<br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: "❌Мало инфы❌",
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/img][/url]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>" +
        "[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
        "[B][CENTER][COLOR=lavender] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR], Причиной отказа послужило - Недостаточно количество RolePlay информации о вашем персонаже. <br><br>" +
        "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>" +
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>" +
        "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>" +
        "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: "❌Скопированна❌",
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/img][/url]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>" +
        "[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
        "[B][CENTER][COLOR=lavender] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR], Причиной отказа послужило - Биография скопирована <br><br>" +
        "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>" +
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>" +
        "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>" +
        "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: "❌Заголовок❌",
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/img][/url]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>" +
        "[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
        "[B][CENTER][COLOR=lavender] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR], Причиной отказа послужило - Неправильное написание заголовка биографии. <br><br>" +
        "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>" +
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>" +
        "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>" +
        "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: "❌Первое лицо❌",
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/img][/url]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>" +
        "[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
        "[B][CENTER][COLOR=lavender] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR], Причиной отказа послужило - Написание Биографии от 1-го лица. <br><br>" +
        "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>" +
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>" +
        "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>" +
        "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: "❌Дата рождения не сходится❌",
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/img][/url]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>" +
        "[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
        "[B][CENTER][COLOR=lavender] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR], Причиной отказа послужило - Возраст не совпадает с датой рождения. <br><br>" +
        "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>" +
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>" +
        "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>" +
        "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: "❌Ошибки❌",
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/ZRCBYwFP/JVROV-1.png[/img][/url]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>" +
        "[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
        "[B][CENTER][COLOR=lavender] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR], Причиной отказа послужило большое количество ошибок. <br><br>" +
        "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>" +
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>" +
        "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>" +
        "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
  ];

  $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $("body").append(
      '<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>'
    );

    // Добавление кнопок при загрузке страницы
    addButton("На рассмотрение", "pin");
    addButton("Отказано⛔", "unaccept");
    addButton("Одобрено✅", "accepted");
    addButton("Специальному Администратору💥", "Spec");
    addButton("Теху", "Texy");
    addButton("Главному Администратору💥", "Ga");
    addButton("Закрыто⛔", "Zakrito");
    addButton("Решено✅", "Resheno");
    addButton("Закрыто⛔", "Zakrito");
    addButton("Реализовано💫", "Realizovano");
    addButton("Рассмотрено✅", "Rassmotreno");
    addButton("Ожидание", "Ojidanie");
    addButton("Без префикса⛔", "Prefiks");
    addButton("Проверено контролем качества", "Kachestvo");
    addButton("Ответы💥", "selectAnswer");

    // Поиск информации о теме
    const threadData = getThreadData();

    $("button#unaccept").click(() => editThreadData(UNACCСEPT_PREFIX, false));
    $("button#pin").click(() => editThreadData(PINN_PREFIX, true));
    $("button#accepted").click(() => editThreadData(ACCСEPT_PREFIX, false));
    $("button#specadm").click(() => editThreadData(SPECADM_PREFIX, true));
    $("button#mainadm").click(() => editThreadData(GA_PREFIX, true));
    $("button#Texy").click(() => editThreadData(TEXY_PREFIX, false));
    $("button#Zakrito").click(() => editThreadData(CLOSE_PREFIX, false));
    $("button#Zakrito").click(() => editThreadData(CLOSE_PREFIX, false));
    $("button#Realizovano").click(() =>
      editThreadData(REALIZOVANO_PREFIX, false)
    );
    $("button#Vajno").click(() => editThreadData(VAJNO_PREFIX, false));
    $("button#Rassmotreno").click(() =>
      editThreadData(RASSMOTRENO_PREFIX, false)
    );
    $("button#Ojidanie").click(() => editThreadData(OJIDANIE_PREFIX, false));
    $("button#Prefiks").click(() => editThreadData(PREFIKS, false));
    $("button#Kachestvo").click(() => editThreadData(KACHESTVO, false));

    $(`button#selectAnswer`).click(() => {
      XF.alert(buttonsMarkup(buttons), null, "Выберите ответ:");
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
      .join("")}</div>`;
  }

  function pasteContent(id, data = {}, send = false) {
    const template = Handlebars.compile(buttons[id].content);
    if ($(".fr-element.fr-view p").text() === "")
      $(".fr-element.fr-view p").empty();

    $("span.fr-placeholder").empty();
    $("div.fr-element.fr-view p").append(template(data));
    $("a.overlay-titleCloser").trigger("click");

    if (send == true) {
      editThreadData(buttons[id].prefix, buttons[id].status);
      $(".button--icon.button--icon--reply.rippleButton").trigger("click");
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
          sticky: 1,
          _xfToken: XF.config.csrf,
          _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
          _xfWithData: 1,
          _xfResponseType: "json",
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
