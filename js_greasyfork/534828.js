// ==UserScript==
// @name         VLADIMIR | Скрипт для руководителя администрации
// @namespace    https://greasyfork.org/ru/users/1014354-pavel-volue-v
// @version      1.0
// @description  Для жалоб на администрацию
// @author       ᴘᴀᴠᴇʟ ʙᴇᴡᴇʀʟʏ
// @match        https://forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/
// @icon         https://icons.iconarchive.com/icons/papirus-team/papirus-apps/48/emerald-theme-manager-icon-icon.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534828/VLADIMIR%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D1%80%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D0%B8%D1%82%D0%B5%D0%BB%D1%8F%20%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/534828/VLADIMIR%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D1%80%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D0%B8%D1%82%D0%B5%D0%BB%D1%8F%20%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D0%B8.meta.js
// ==/UserScript==

(function () {
    'use strict';

  const bgButtons = document.querySelector(".pageContent");

  // Функция создания кнопки
const buttonConfig = (text, href) => {
    const button = document.createElement("button");
    button.textContent = text;
    button.classList.add("bgButton");

    // Устанавливаем стили для кнопки
    button.style.padding = "5px 10px";
    button.style.fontSize = "12px";
    button.style.margin = "2px";
    button.style.border = "none";
    button.style.borderRadius = "4px";
    button.style.color = "#fff";
    button.style.cursor = "pointer";
    button.style.position = "relative";
    button.style.overflow = "hidden";

    button.addEventListener("click", () => {
        window.location.href = href;
    });

    return button;
};

  const style = document.createElement('style');
style.textContent = `
.bgButton {
    transition: background-color 0.5s, transform 0.2s; /* Плавный переход */
}

.bgButton:hover {
    transform: scale(1.05); /* Увеличение при наведении */
}

@keyframes gradient {
    0% { background-color: #007bff; }
    25% { background-color: #0056b3; }
    50% { background-color: #004080; }
    75% { background-color: #003366; }
    100% { background-color: #007bff; }
}

.bgButton {
    animation: gradient 5s infinite alternate; /* Плавная анимация */
}
`;

// Добавление стилей в страницу
document.head.append(style);

// Создание кнопок
const ButtonCLadm = buttonConfig("ЖБ-АДМ", 'https://forum.blackrussia.online/forums/Жалобы-на-администрацию.3482/');
const ButtonCLlead = buttonConfig("ЖБ-ЛД", 'https://forum.blackrussia.online/forums/Жалобы-на-лидеров.3483/');
const ButtonCLpl = buttonConfig("ЖБ-PL", 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.3484/');
const ButtonLeadThread = buttonConfig("Р-ЛД", 'https://forum.blackrussia.online/forums/Раздел-государственных-организаций.3490/');
const ButtonWeekThread = buttonConfig("Р-ЕЖЕНЕД", 'https://forum.blackrussia.online/forums/Отчетность-лидеров-фракций.3492/');
const ButtonAppThread = buttonConfig("ЗАЯВКИ", 'https://forum.blackrussia.online/forums/Лидеры.3497/');
const ButtonAdminThread = buttonConfig("А-78", 'https://forum.blackrussia.online/forums/Админ-раздел.3466/');
const ButtonVladimirThread = buttonConfig("Р-78", 'https://forum.blackrussia.online/forums/Сервер-№78-vladimir.3465/');
const ButtonRulesProject = buttonConfig("ОПС", "https://forum.blackrussia.online/threads/Общие-правила-серверов.312571/");

    // Конфигурация
    const CONFIG = {
        JSON_URL: 'https://gist.githubusercontent.com/sevent0/3c1d3c1ff32e1546e9a791062771581b/raw/f683793882e8aa704a538f5571729f7d55deb451/deputy.json',
        PREFIXES: {
            UNACCEPT: 4, // префикс отказано
            ACCEPT: 8, // префикс одобрено
            RESHENO: 6, // префикс решено
            PIN: 2, //  префикс закрепить
            GA: 12, // гл. админу
            COMMAND: 10, // команде проекта
            WATCHED: 9, // рассмотрено
            CLOSE: 7, // префикс закрыто
            SPECIAL: 11, // спец. админу
            OJIDANIE: 14, // ожидание
            TEX: 13 //  техническому специалисту
        }
    };

    let buttons = []; // Будет заполнено данными из JSON
    let buttonsAppeals = []; // Будет заполнено данными из JSON

    // Инициализация скрипта
    const init = async () => {
    try {
        const response = await fetch(CONFIG.JSON_URL);
        if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);
        const data = await response.text();
        try {
            buttons = JSON.parse(data);
        } catch (e) {
            throw new Error('Неверный формат JSON');
        }
        setupUI();
    } catch (error) {
        console.error('Ошибка загрузки:', error);
        XF.alert(`Ошибка: ${error.message}`);
    }
};

    // Настройка интерфейса
    const setupUI = () => {
        // Добавление кнопок
        const addButton = (name, id) => {
            $('.button--icon--reply').before(
                `<button type="button" class="button--primary button rippleButton" id="${id}"
                 style="border-radius: 30px; margin-right: 7px;">${name}</button>`
            );
        };

        addButton('ЖАЛОБЫ НА АДМИНИСТРАЦИЮ', 'selectAdmins');

        $('button#selectAdmins').click(() => {
            XF.alert(buttonsMarkup(), null, 'Выберите ответ для рассмотрения жалоб на администрацию:');
            buttons.forEach((btn, id) => {
                $(`button#answers-${id}`).click(() => {
                    const threadData = getThreadData();
                    pasteContent(id, threadData, !!btn.prefix);
                });
            });
        });
    };

    // Генерация разметки кнопок
    const buttonsMarkup = () => `
        <div class="select_answer">
            ${buttons.map((btn, i) => `
                <button id="answers-${i}" class="button--primary button rippleButton"
                        style="margin:5px; ${btn.dpstyle || ''}">
                    <span class="button-text">${btn.title}</span>
                </button>
            `).join('')}
        </div>
    `;

    function pasteContent(id, data = {}, send = false) {
      const template = Handlebars.compile(buttons[id].content);
      if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

      $('span.fr-placeholder').empty();
      $('div.fr-element.fr-view p').append(template(data));
      $('a.overlay-titleCloser').trigger('click');

      if (send == true) {
          editThreadData(buttons[id].move, buttons[id].prefix, buttons[id].status, buttons[id].open);
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


  function editThreadData(move, prefix, pin = false, open = false) {
  // Получаем заголовок темы, так как он необходим при запросе
      const threadTitle = $('.p-title-value')[0].lastChild.textContent;

      if (pin == false) {
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
      } else if (pin == true && open) {
        fetch(`${document.URL}edit`, {
          method: 'POST',
          body: getFormData({
          prefix_id: prefix,
          discussion_open: 1,
          title: threadTitle,
          sticky: 1,
          _xfToken: XF.config.csrf,
          _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
          _xfWithData: 1,
          _xfResponseType: 'json',
          }),
        }).then(() => location.reload());
      } else {
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
      if (move > 0) {
        moveThread(prefix, move);
      }
  }

  function moveThread(prefix, type) {
  // Функция перемещения тем
  const threadTitle = $('.p-title-value')[0].lastChild.textContent;

  fetch(`${document.URL}move`, {
    method: 'POST',
    body: getFormData({
      prefix_id: prefix,
      title: threadTitle,
      target_node_id: type,
      redirect_type: 'none',
      notify_watchers: 1,
      starter_alert: 1,
      starter_alert_reason: "",
      _xfToken: XF.config.csrf,
      _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
      _xfWithData: 1,
      _xfResponseType: 'json',
    }),
  }).then(() => location.reload());
  }

  function getFormData(data) {
      const formData = new FormData();
      Object.entries(data).forEach(i => formData.append(i[0], i[1]));
      return formData;
    }

    bgButtons.append(ButtonCLadm);
    bgButtons.append(ButtonCLlead);
    bgButtons.append(ButtonCLpl);
    bgButtons.append(ButtonLeadThread);
    bgButtons.append(ButtonWeekThread);
    bgButtons.append(ButtonAppThread);
    bgButtons.append(ButtonAdminThread);
    bgButtons.append(ButtonVladimirThread);
    bgButtons.append(ButtonRulesProject);
    // Запуск скрипта после загрузки страницы
    $(document).ready(init);
})();