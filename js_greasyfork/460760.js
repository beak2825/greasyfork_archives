// ==UserScript==
// @name         Script for Iconess Legenda && Jaden Young | GREEN
// @namespace    https://forum.blackrussia.online
// @version      2.9
// @description  forward-only!
// @author       Jaden Young
// @match        https://forum.blackrussia.online/index.php?threads/*
// @include      https://forum.blackrussia.online/index.php?threads/
// @icon         https://brawl-stars-pro.ru/wp-content/uploads/2021/11/kq8sz5kdt8i.jpg
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/460760/Script%20for%20Iconess%20Legenda%20%20Jaden%20Young%20%7C%20GREEN.user.js
// @updateURL https://update.greasyfork.org/scripts/460760/Script%20for%20Iconess%20Legenda%20%20Jaden%20Young%20%7C%20GREEN.meta.js
// ==/UserScript==
(async function SERVER_GREEN_TOP() {
  `use strict`;
  const UNACCEPT_PREFIX = 4;
  const ACCEPT_PREFIX = 8;
  const PIN_PREFIX = 2;
  const CLOSE_PREFIX = 7;
  const TECH_PREFIX = 13;
  const data = await getThreadData();

  const buttonsOverlay = [
    {
      title: "Ответы с отказом",
      content: "",
    },
    {
      title: "Ответы с рассмотрением",
      content: "",
    },
    {
      title: "Поставить префикс",
      content: "",
    },
  ];
  const buttonsPin = [
    {
      title: `На рассмотрении`,
      content:
        `[SIZE=4][CENTER]Приветствую, уважаемый игрок!.[/CENTER]<br><br>` +
        `[SIZE=4][CENTER]На рассмотрении.[/SIZE][/CENTER]`,
      prefix: PIN_PREFIX,
      status: true,
    },
    {
      title: `Свяжитесь со мной во ВКонтакте`,
      content:
        `[SIZE=4][CENTER]Приветствую, уважаемый игрок!.[/CENTER]<br><br>` +
        `[CENTER][SIZE=4]Свяжитесь со мной ВКонтакте по следующей форме:[/CENTER]<br><br>` +
        `[CENTER][SIZE=4]1. Ваш NickName:[/CENTER]<br>` +
        `[CENTER][SIZE=4]2. Ссылка на обжалование:[/CENTER]<br><br>` +
        `[CENTER][SIZE=4]VK: https://vk.com/iyghjiyfcbjkk <br><br>` +
        `[CENTER][SIZE=4]На рассмотрении.<br>`,
      prefix: PIN_PREFIX,
      status: true,
    },
    {
      title: `Разблокировка для передачи украденного имущества`,
      content:
        `[SIZE=4][CENTER]Приветствую, уважаемый игрок!.[/CENTER]<br><br>` +
        `[CENTER][SIZE=4]Ваш аккаунт разблокирован на 24 часа. 
              За это время Вы должны успеть вернуть украденное имущество пострадавшему игроку. 
              Если условие не будет выполнено, то аккаунт вновь будет заблокирован.[/CENTER][/SIZE]`,

      prefix: PIN_PREFIX,
      status: true,
    },
  ];

  const buttonsUnaccept = [
    {
      title: `Не готов пойти навстречу`,
      content:
        `[CENTER][SIZE=4]Приветствую, уважаемый игрок!.[/CENTER]<br><br>` +
        `[CENTER][SIZE=4]Пока я не готов пойти к Вам навстречу.[/CENTER]<br><br>` +
        `[CENTER][SIZE=4]Закрыто.[/SIZE][/CENTER]`,
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: `Не готов пойти навстречу (напишите через 2 дня)`,
      content:
        `[SIZE=4][CENTER]Приветствую, уважаемый игрок!.[/CENTER]<br><br>` +
        `[CENTER][SIZE=4]Пока я не готов пойти к Вам навстречу, напишите обжалование спустя два дня.[/CENTER]<br><br>` +
        `[CENTER][SIZE=4]Закрыто.[/SIZE][/CENTER]`,
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: `Не готов пойти навстречу (напишите через 3 дня)`,
      content:
        `[SIZE=4][CENTER]Приветствую, уважаемый игрок!.[/CENTER]<br><br>` +
        `[CENTER][SIZE=4]Пока я не готов пойти к Вам навстречу, напишите обжалование спустя три дня.[/CENTER]<br><br>` +
        `[CENTER][SIZE=4]Закрыто.[/SIZE][/CENTER]`,
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: `Не готов пойти навстречу (напишите через 4 дня)`,
      content:
        `[SIZE=4][CENTER]Приветствую, уважаемый игрок!.[/CENTER]<br><br>` +
        `[CENTER][SIZE=4]Пока я не готов пойти к Вам навстречу, напишите обжалование спустя четыре дня.[/CENTER]<br><br>` +
        `[CENTER][SIZE=4]Закрыто.[/SIZE][/CENTER]`,
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: `Не готов пойти навстречу (напишите через 4 дня)`,
      content:
        `[SIZE=4][CENTER]Приветствую, уважаемый игрок!.[/CENTER]<br><br>` +
        `[CENTER][SIZE=4]Пока я не готов пойти к Вам навстречу, напишите обжалование спустя пять дней.<br><br>` +
        `[CENTER][SIZE=4]Закрыто.[/SIZE][/CENTER]`,
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: `В обжаловании отказано`,
      content:
        `[SIZE=4][CENTER]Приветствую, уважаемый игрок!.[/CENTER]<br><br>` +
        `[CENTER][SIZE=4]В обжаловании отказано.[/CENTER]<br><br>` +
        `[CENTER][SIZE=4]Закрыто.[/SIZE][/CENTER]`,
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: `Не подлежит обжалованию`,
      content:
        `[SIZE=4][CENTER]Приветствую, уважаемый игрок!.[/CENTER]<br><br>` +
        `[CENTER][SIZE=4]Данное наказание не подлежит обжалованию.[/CENTER]<br><br>` +
        `[CENTER][SIZE=4]Закрыто. [/SIZE][/CENTER]`,
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: `Блокировка была выдана от Тех. спец-а`,
      content:
        `[SIZE=4][CENTER]Приветствую, уважаемый игрок!.[/CENTER]<br><br>` +
        `[CENTER][SIZE=4]Блокировка была выдана от технического специалиста, собственно все дальнейшие разбирательства будут происходить в техническом разделе > жалобы на технических специалистов.[/CENTER]<br><br>` +
        `[CENTER][SIZE=4]Закрыто.[/SIZE][/CENTER]`,
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: `Блокировка была выдана по наводке от Тех. спец-а`,
      content:
        `[SIZE=4][CENTER]Приветствую, уважаемый игрок!.[/CENTER]<br><br>` +
        `[CENTER][SIZE=4]Блокировка была выдана по наводке от технического специалиста, соответственно Вам требуется обратиться в технический раздел => жалобы на технических специалистов.[/CENTER]<br><br>` +
        `[CENTER][SIZE=4]Закрыто.[/SIZE][/CENTER]`,
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: `Обжалование составлено не по форме`,
      content:
        `[SIZE=4][CENTER]Приветствую, уважаемый игрок!.[/CENTER]<br><br>` +
        `[CENTER][SIZE=4]Обжалование составлено не по форме.[/CENTER]<br><br>` +
        `[CENTER][SIZE=4]Закрыто.[/SIZE][/CENTER]`,
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: `Обращайтесь в раздел жалоб на администрацию`,
      content:
        `[SIZE=4][CENTER]Приветствую, уважаемый игрок!.[/CENTER]<br><br>` +
        `[CENTER][SIZE=4]Если вы не согласны с выданным наказанием, то Вам следует обратиться в раздел > жалобы на администрацию.[/CENTER]<br><br>` +
        `[CENTER][SIZE=4]Закрыто.[/SIZE][/CENTER]`,
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: `Отсутствуют док-ва`,
      content:
        `[SIZE=4][CENTER]Приветствую, уважаемый игрок!.[/CENTER]<br><br>` +
        `[CENTER][SIZE=4]В Вашем обжаловании отсутствуют доказательства выдачи наказания.[/CENTER][/SIZE]<br><br>` +
        `[CENTER][SIZE=4]Закрыто.[/SIZE][/CENTER]`,
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: `Отсутствуют док-ва с пострадавшим на его согласие в получении украденного имущества`,
      content:
        `[SIZE=4][CENTER]Приветствую, уважаемый игрок!.[/CENTER]<br><br>` +
        `[CENTER][SIZE=4]В обжаловании отсутствуют доказательства переписки с пострадавшим игроком на его согласие в получении украденного имущества.[/CENTER][/SIZE]<br><br>` +
        `[CENTER][SIZE=4]Закрыто.[/SIZE][/CENTER]`,
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: `Вы ошиблись разделом сервера`,
      content:
        `[SIZE=4][CENTER]Приветствую, уважаемый игрок!.[/CENTER]<br><br>` +
        `[CENTER][SIZE=4]Вы ошиблись разделом сервера.[/CENTER][/SIZE]<br><br>` +
        `[CENTER][SIZE=4]Закрыто.[/SIZE][/CENTER]`,

      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: `Прошло 2 дня с момента выдачи наказания`,
      content:
        `[SIZE=4][CENTER]Приветствую, уважаемый игрок!.[/CENTER]<br><br>` +
        `[CENTER][SIZE=4]Ваша жалоба не может быть рассмотрена по причине несоблюдения обязательного условия:<br>` +
        `[QUOTE]3.1. Срок написания жалобы составляет два дня (48 часов) с момента совершенного нарушения со стороны администратора сервера.<br><br>` +
        `Примечание: в случае истечения срока жалоба рассмотрению не подлежит.[/QUOTE][/CENTER]<br><br><br>` +
        `[CENTER][SIZE=4]Закрыто.[/SIZE][/CENTER]`,
      prefix: CLOSE_PREFIX,
      status: false,
    },
  ];

  const buttonsPrefix = [
    {
      title: "Закрыто",
      content: "",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: "На рассмотрении",
      content: "",
      prefix: PIN_PREFIX,
      status: true,
    },
    {
      title: "Отказано",
      content: "",
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: "Одобрено",
      content: "",
      prefix: ACCEPT_PREFIX,
      status: false,
    },
  ];

  $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $(`body`).append(
      `<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`,
      `<script
      src="https://code.jquery.com/jquery-migrate-3.3.1.min.js"
      integrity="sha256-APllMc0V4lf/Rb5Cz4idWUCYlBDG3b0EcN1Ushd3hpE="
      crossorigin="anonymous"></script>`,
      `<script src="http://css3-mediaqueries-js.googlecode.com/svn/trunk/css3-mediaqueries.js"></script>`
    );

    var styles = `.Folder {
          color: #fff;
          background: #46597f;
          box-shadow: 0 4px 15px 0 rgb(0 0 0 / 20%);
          border: none;
          border-color: #d15656;
          margin: 30px 15px;
          height: 100px;
          width: 55%;
      }
      .Answer {
        color: #fff;
        background: #c83637;
        box-shadow: 0 4px 15px 0 rgb(0 0 0 / 20%);
        border: none;
        background: linear-gradient(#c83637, #a02b2c);
        border-color: #d15656;
        margin: 30px 15px;
        height: 100px;
        width: 55%;
    }
    body.is-modalOpen .overlay-container, body.is-modalOpen .offCanvasMenu {
      overflow-y: scroll !important;
    }
    ::-webkit-resizer {
      background-repeat: no-repeat;
      width: 10px;
      height: 0px;
    }
    ::-webkit-scrollbar {
      width: 10px;
    }
    ::-webkit-scrollbar-thumb {
      -webkit-border-radius: 0px;
      border-radius: 0px;
      background-color: #993435;
    }
    ::-webkit-scrollbar-track {
      background-color: rgb(34,36,43);
    }
    .blockMessage {
      background: #22242b;
    }
    overlay-title {
      background: #31333a;
    }
    @media screen and (max-width: 980px) {
      .button, a.button {
        font-size: 9px
      }
      .Folder {
        color: #fff;
        background: #46597f;
        box-shadow: 0 4px 15px 0 rgb(0 0 0 / 20%);
        border: none;
        border-color: #d15656;
        margin: 20px 50px;
        height: 65px;
        width: 65%;
        font-size: 9px;
    }
    .Answer {
      color: #fff;
      background: #c83637;
      box-shadow: 0 4px 15px 0 rgb(0 0 0 / 20%);
      border: none;
      background: linear-gradient(#c83637, #a02b2c);
      border-color: #d15656;
      margin: 20px 50px;
      height: 100px;
      width: 65%;
      font-size: 9px;
    }}
    `;

    var styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // Добавление кнопок при загрузке страницы
    addButton(`Быстрые ответы`);

    // Записываем переменные
    let buttonAnswers = document.getElementById("buttonAnswers");
    let buttonFolders = document.getElementById("folders");
    let buttonAnswersOverlay = document.getElementById("answers");
    let btnFolder = document.getElementsByClassName("folder");

    // Прописываем функцию клика на кнопку ответов buttonAnswers
    function overlayContent() {
      XF.alert(
        buttonsMarkup(buttonsOverlay),
        null,
        `Выберите подходящую папку с ответами:`
      );
    }
    buttonAnswers.addEventListener("click", overlayContent);

    // Прописываем функцию для папок
    function foldersFunc() {
      if (btnFolder.textContent === "Ответы".toUpperCase) {
        console.log("это работает бро");
        XF.alert(
          buttonsMarkupAnswersUnaccept(buttonsUnaccept),
          null,
          `Повелитель, выберите подходящий ответ:`
        );
      } else if (
        $(`span.button-text`).text() === "Ответы с рассмотрением".toUpperCase
      ) {
        XF.alert(
          buttonsMarkupAnswersPin(buttonsPin),
          null,
          `Повелитель, выберите подходящий ответ:`
        );
      } else if (
        $(`span.button-text`).text() === "Поставить префикс".toUpperCase
      ) {
        XF.alert(
          buttonsMarkupAnswersPrefix(buttonsPrefix),
          null,
          `Повелитель, выберите подходящий ответ:`
        );
      }
    }

    buttonFolders.addEventListener("click", foldersFunc);
    // Прописываем функцию для ответов
    function answersFunc() {
      if (buttonAnswersOverlay.className == "Unaccept") {
        pasteContentUnaccept(buttonsUnaccept);
      } else if (buttonAnswersOverlay.className == "Pin") {
        pasteContentPin(buttonsPin);
      } else if (buttonAnswersOverlay.className == "Prefix") {
        pasteContentPrefix(buttonsPrefix);
      }
    }
    buttonAnswersOverlay.addEventListener("click", answersFunc);

    // Записываем функции
    function addButton(name) {
      $(`.formButtonGroup `).after(
        `<button type="button" class="button--primary button rippleButton" id="buttonAnswers" style="margin: 10px;">${name}</button>`
      );
    }

    function buttonsMarkupAnswersUnaccept(buttonsUnaccept) {
      return `${buttonsUnaccept
        .map(
          (btn) =>
            `<button id="answers" class="button button--icon rippleButton rippleButton Answer Unaccept">` +
            `<span class="button-text">${btn.title}</span></button>`
        )
        .join(``)}</div>`;
    }
    function buttonsMarkupAnswersPin(buttonsPin) {
      return `${buttonsPin
        .map(
          (btn) =>
            `<button id="answers" class="button button--icon rippleButton rippleButton Answer Pin">` +
            `<span  class="button-text">${btn.title}</span></button>`
        )
        .join(``)}</div>`;
    }
    function buttonsMarkupAnswersPrefix(buttonsPrefix) {
      return `${buttonsPrefix
        .map(
          (btn) =>
            `<button id="answers" class="button button--icon rippleButton rippleButton Answer Prefix">` +
            `<span  class="button-text">${btn.title}</span></button>`
        )
        .join(``)}</div>`;
    }

    function buttonsMarkup(buttonsOverlay) {
      return `${buttonsOverlay
        .map(
          (btn, i) =>
            `<button id="folders" class="button button--icon rippleButton rippleButton Folder">` +
            `<span class="button-text folder">${btn.title}</span></button>`
        )
        .join(``)}</div>`;
    }

    function pasteContentUnaccept(id, send = false) {
      const templateUnacceptPaste = Handlebars.compile(
        buttonsUnaccept[id].content
      );
      if ($(`.fr-element.fr-view p`).text() === ``)
        $(`.fr-element.fr-view p`).empty();

      $(`span.fr-placeholder`).empty();
      $(`div.fr-element.fr-view p`).append(templateUnacceptPaste);
      $(`a.overlay-titleCloser`).trigger(`click`);
      $(`.button--icon.button--icon--reply.rippleButton`).trigger(`click`);
      if (send == true) {
        editThreadData(buttonsUnaccept[id].prefix, buttonsUnaccept[id].status);
        $(`.button--icon.button--icon--reply.rippleButton`).trigger(`click`);
      }
    }

    function pasteContentPin(id, send = false) {
      const templatePinPaste = Handlebars.compile(buttonsPin[id].content);
      if ($(`.fr-element.fr-view p`).text() === ``)
        $(`.fr-element.fr-view p`).empty();

      $(`span.fr-placeholder`).empty();
      $(`div.fr-element.fr-view p`).append(templatePinPaste);
      $(`a.overlay-titleCloser`).trigger(`click`);
      $(`.button--icon.button--icon--reply.rippleButton`).trigger(`click`);
      if (send == true) {
        editThreadData(buttonsPin[id].prefix, buttonsPin[id].status);
        $(`.button--icon.button--icon--reply.rippleButton`).trigger(`click`);
      }
    }

    function pasteContentPrefix(id, send = false) {
      editThreadData(buttonsPrefix[id].prefix, buttonsPrefix[id].status);
      if (send == true) {
        editThreadData(buttonsPrefix[id].prefix, buttonsPrefix[id].status);
        $(`.button--icon.button--icon--reply.rippleButton`).trigger(`click`);
      }
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
  });
});
