// ==UserScript==
// @name         VLADIMIR | Скрипт для Кураторов форума
// @namespace    https://greasyfork.org/ru/users/1014354-pavel-volue-v
// @version      1.3.06
// @description  Скрипт для упрощения работы кураторам форума.
// @author       Pavel Bewerly
// @match        https://forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/
// @icon         https://icons.iconarchive.com/icons/papirus-team/papirus-apps/48/emerald-theme-manager-icon-icon.png
// @grant        none
// @license      MIT
// @require https://update.greasyfork.org/scripts/535025/1583561/handlebars%20v478.js
// @downloadURL https://update.greasyfork.org/scripts/535018/VLADIMIR%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/535018/VLADIMIR%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';
const bgButtons = document.querySelector(".pageContent");

// Создаем плавающую кнопку меню
const menuButton = document.createElement("button");
menuButton.innerHTML = "📋 MENU";
menuButton.classList.add("floating-menu-button");
document.body.appendChild(menuButton);

// Создаем контейнер меню
const menuContainer = document.createElement("div");
menuContainer.classList.add("menu-container");
menuContainer.style.display = "none";

// Создаем заголовок и кнопку закрытия
const menuHeader = document.createElement("div");
menuHeader.classList.add("menu-header");

const menuTitle = document.createElement("h3");
menuTitle.textContent = "Быстрая навигация";
menuHeader.appendChild(menuTitle);

const closeButton = document.createElement("button");
closeButton.innerHTML = "&times;";
closeButton.classList.add("close-button");
menuHeader.appendChild(closeButton);

menuContainer.appendChild(menuHeader);

// Массив с уникальными стилями для каждой кнопки
const buttonStyles = [
    { // Админ раздел
        bg: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
        shadow: "0 4px 12px rgba(106, 17, 203, 0.4)",
        icon: "🔐",
        border: "#4a00e0"
    },
    { // RolePlay ситуации
        bg: "linear-gradient(135deg, #00b712 0%, #5aff15 100%)",
        shadow: "0 4px 12px rgba(0, 183, 18, 0.4)",
        icon: "🔫",
        border: "#00b712"
    },
    { // RolePlay биографии
        bg: "linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)",
        shadow: "0 4px 12px rgba(255, 65, 108, 0.4)",
        icon: "👨",
        border: "#ff416c"
    },
    { // Неофиц. RolePlay орг.
        bg: "linear-gradient(135deg, #1D976C 0%, #93F9B9 100%)",
        shadow: "0 4px 12px rgba(29, 151, 108, 0.4)",
        icon: "🏭",
        border: "#1D976C"
    },
    { // Жалобы на игроков
        bg: "linear-gradient(135deg, #3494E6 0%, #EC6EAD 100%)",
        shadow: "0 4px 12px rgba(52, 148, 230, 0.4)",
        icon: "👥",
        border: "#3494E6"
    },
    { // Жалобы на админов
        bg: "linear-gradient(135deg, #f46b45 0%, #eea849 100%)",
        shadow: "0 4px 12px rgba(244, 107, 69, 0.4)",
        icon: "🛡️",
        border: "#f46b45"
    },
    { // Раздел сервера
        bg: "linear-gradient(135deg, #834d9b 0%, #d04ed6 100%)",
        shadow: "0 4px 12px rgba(131, 77, 155, 0.4)",
        icon: "🏠",
        border: "#834d9b"
    },
    { // Правила проекта
        bg: "linear-gradient(135deg, #232526 0%, #414345 100%)",
        shadow: "0 4px 12px rgba(0, 0, 0, 0.4)",
        icon: "📜",
        border: "#232526"
    }
];

// Функция создания кнопок навигации с уникальным стилем
const createNavButton = (text, href, styleConfig) => {
    const button = document.createElement("button");
    button.classList.add("menu-button");
    button.innerHTML = `<span class="button-icon">${styleConfig.icon}</span> ${text}`;
    button.style.background = styleConfig.bg;
    button.style.boxShadow = styleConfig.shadow;
    button.style.border = `2px solid ${styleConfig.border}`;
    button.style.filter = "saturate(1.2)";

    button.addEventListener("click", () => {
        window.location.href = href;
        menuContainer.style.display = "none";
    });

    return button;
};

// Создаем кнопки навигации
const navButtons = [
    createNavButton("Админ раздел", 'https://forum.blackrussia.online/forums/Админ-раздел.3466/', buttonStyles[0]),
    createNavButton("RolePlay ситуации", 'https://forum.blackrussia.online/forums/РП-ситуации.3486/', buttonStyles[1]),
    createNavButton("RolePlay биографии", 'https://forum.blackrussia.online/forums/РП-биографии.3487/', buttonStyles[2]),
    createNavButton("Неофиц. RolePlay орг.", 'https://forum.blackrussia.online/forums/Неофициальные-rp-организации.3480/', buttonStyles[3]),
    createNavButton("Жалобы на игроков", 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.3484/', buttonStyles[4]),
    createNavButton("Жалобы на админов", 'https://forum.blackrussia.online/forums/Жалобы-на-администрацию.3482/', buttonStyles[5]),
    createNavButton("Раздел сервера", 'https://forum.blackrussia.online/forums/Сервер-№78-vladimir.3465/', buttonStyles[6]),
    createNavButton("Правила проекта", 'https://forum.blackrussia.online/threads/Общие-правила-серверов.312571/', buttonStyles[7])
];

// Добавляем кнопки в меню
const buttonsContainer = document.createElement("div");
buttonsContainer.classList.add("buttons-container");
navButtons.forEach(btn => {
    const btnWrapper = document.createElement("div");
    btnWrapper.classList.add("button-wrapper");
    btnWrapper.appendChild(btn);
    buttonsContainer.appendChild(btnWrapper);
});
menuContainer.appendChild(buttonsContainer);

// Добавляем меню на страницу
document.body.appendChild(menuContainer);

// Обработчики событий
menuButton.addEventListener("click", (e) => {
    e.stopPropagation();
    menuContainer.style.display = "block";
});

closeButton.addEventListener("click", () => {
    menuContainer.style.display = "none";
});

// Закрываем меню при клике вне его области
document.addEventListener("click", (e) => {
    if (!menuContainer.contains(e.target) && e.target !== menuButton) {
        menuContainer.style.display = "none";
    }
});

// Стили
const style = document.createElement('style');
style.textContent = `
.floating-menu-button {
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 14px 24px;
    background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
    color: white;
    border: none;
    border-radius: 50px;
    cursor: pointer;
    font-weight: bold;
    font-size: 16px;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.3);
    z-index: 1000;
    transition: all 0.3s ease;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    letter-spacing: 1px;
    border: 2px solid rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(2px);
}

.floating-menu-button:hover {
    transform: translateY(-5px) scale(1.05);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
    background: linear-gradient(135deg, #7a2be2 0%, #3d8bfd 100%);
    filter: brightness(1.1);
}

.menu-container {
    position: fixed;
    bottom: 85px;
    right: 20px;
    width: 320px;
    background: rgba(245, 247, 250, 0.92);
    backdrop-filter: blur(12px);
    border-radius: 16px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
    z-index: 999;
    overflow: hidden;
    animation: slideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    border: 1px solid rgba(255, 255, 255, 0.7);
    transform-origin: bottom right;
}

@keyframes slideIn {
    from {
        transform: scale(0.8) translateY(10px);
        opacity: 0;
    }
    to {
        transform: scale(1) translateY(0);
        opacity: 1;
    }
}

.menu-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 18px 20px;
    background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
    color: white;
    border-bottom: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.menu-header h3 {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.close-button {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    font-size: 26px;
    cursor: pointer;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    line-height: 1;
    padding-bottom: 4px;
    border: 1px solid rgba(255, 255, 255, 0.3);
}

.close-button:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: rotate(90deg);
    filter: brightness(1.2);
}

.buttons-container {
    padding: 20px;
    max-height: 60vh;
    overflow-y: auto;
    background: rgba(255, 255, 255, 0.4);
    border-radius: 0 0 16px 16px;
}

.button-wrapper {
    margin-bottom: 15px;
    transition: transform 0.3s ease;
}

.button-wrapper:hover {
    transform: translateX(5px);
}

.menu-button {
    width: 100%;
    padding: 16px 20px;
    text-align: left;
    border-radius: 12px;
    cursor: pointer;
    font-size: 16px;
    color: white;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    display: flex;
    align-items: center;
    position: relative;
    overflow: hidden;
    font-weight: 600;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    box-sizing: border-box;
}

.menu-button:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
    transition: 0.5s;
}

.menu-button:hover {
    transform: translateY(-5px) scale(1.03);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3) !important;
    filter: saturate(1.5) brightness(1.1);
    z-index: 2;
}

.menu-button:hover:before {
    left: 100%;
}

.button-icon {
    margin-right: 12px;
    font-size: 20px;
    transition: all 0.3s ease;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
    min-width: 24px;
    text-align: center;
}

.menu-button:hover .button-icon {
    transform: scale(1.3) rotate(8deg);
}

/* Стили для скроллбара */
.buttons-container::-webkit-scrollbar {
    width: 8px;
}

.buttons-container::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 4px;
}

.buttons-container::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
    border-radius: 4px;
    border: 1px solid rgba(255, 255, 255, 0.3);
}

/* Эффект для фона меню */
.menu-container:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 80% 20%, rgba(255,255,255,0.8) 0%, rgba(245,247,250,0.6) 100%);
    z-index: -1;
    border-radius: 16px;
}
`;
document.head.appendChild(style);

    // Конфигурация
    const CONFIG = {
        JSON_URL: 'https://gist.githubusercontent.com/sevent0/b5c5c60ee35ee864965fde9731a97966/raw/87574b13a64e8d9d184299819f9eb37770a5ec74/script.json',
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

    let answerButtons = []; // Переименовано в answerButtons

    const init = async () => {
    try {
        const response = await fetch(CONFIG.JSON_URL);
        if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);
        const data = await response.text();
        try {
            answerButtons = JSON.parse(data); // Используем новое имя
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

        addButton('ЖАЛОБЫ НА ИГРОКОВ', 'ClaimsPlayer');

        $('button#ClaimsPlayer').click(() => {
            XF.alert(buttonsMarkup(), null, 'Выберите ответ для рассмотрения жалоб на игроков:');
            answerButtons.forEach((btn, id) => { // Используем новое имя
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
            ${answerButtons.map((btn, i) => ` <!-- Используем новое имя -->
                <button id="answers-${i}" class="button--primary button rippleButton"
                        style="margin:5px; ${btn.dpstyle || ''}">
                    <span class="button-text">${btn.title}</span>
                </button>
            `).join('')}
        </div>
    `;

    function pasteContent(id, data = {}, send = false) {
      const template = Handlebars.compile(answerButtons[id].content); // Используем новое имя
      if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

      $('span.fr-placeholder').empty();
      $('div.fr-element.fr-view p').append(template(data));
      $('a.overlay-titleCloser').trigger('click');

      if (send == true) {
          editThreadData(answerButtons[id].move, answerButtons[id].prefix, answerButtons[id].status, answerButtons[id].open);
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

    // Запуск скрипта после загрузки страницы
    $(document).ready(init);
})();