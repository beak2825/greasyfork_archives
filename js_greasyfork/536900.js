// ==UserScript==
// @name         VLADIMIR | Скрипт для руководства сервера.
// @namespace    https://greasyfork.org/ru/users/1014354-pavel-volue-v
// @version      1.3.07
// @description  Скрипт для упрощения работы руководителям сервера.
// @author       Pavel Bewerly
// @match        https://forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/
// @icon         https://icons.iconarchive.com/icons/papirus-team/papirus-apps/48/emerald-theme-manager-icon-icon.png
// @grant        none
// @license      MIT
// @require https://update.greasyfork.org/scripts/535025/1583561/handlebars%20v478.js
// @downloadURL https://update.greasyfork.org/scripts/536900/VLADIMIR%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D1%80%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0%20%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/536900/VLADIMIR%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D1%80%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0%20%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%B0.meta.js
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
        shadow: "0 4px 8px rgba(106, 17, 203, 0.3)",
        icon: "🔐"
    },
    { // Заявки
        bg: "linear-gradient(135deg, #009245 0%, #FCEE21 100%)",
        shadow: "0 4px 8px rgba(0, 146, 69, 0.3)",
        icon: "📝"
    },
    { // Обжалования
        bg: "linear-gradient(135deg, #FF4E50 0%, #F9D423 100%)",
        shadow: "0 4px 8px rgba(255, 78, 80, 0.3)",
        icon: "⚖️"
    },
    { // Жалобы на игроков
        bg: "linear-gradient(135deg, #3494E6 0%, #EC6EAD 100%)",
        shadow: "0 4px 8px rgba(52, 148, 230, 0.3)",
        icon: "👥"
    },
    { // Жалобы на админов
        bg: "linear-gradient(135deg, #1D976C 0%, #93F9B9 100%)",
        shadow: "0 4px 8px rgba(29, 151, 108, 0.3)",
        icon: "🛡️"
    },
    { // Раздел сервера
        bg: "linear-gradient(135deg, #3C1053 0%, #AD5389 100%)",
        shadow: "0 4px 8px rgba(60, 16, 83, 0.3)",
        icon: "🏠"
    },
    { // Правила проекта
        bg: "linear-gradient(135deg, #232526 0%, #414345 100%)",
        shadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
        icon: "📜"
    }
];

// Функция создания кнопок навигации с уникальным стилем
const createNavButton = (text, href, styleConfig) => {
    const button = document.createElement("button");
    button.classList.add("menu-button");
    button.innerHTML = `<span class="button-icon">${styleConfig.icon}</span> ${text}`;
    button.style.background = styleConfig.bg;
    button.style.boxShadow = styleConfig.shadow;

    button.addEventListener("click", () => {
        window.location.href = href;
        menuContainer.style.display = "none";
    });

    return button;
};

// Создаем кнопки
const buttons = [
    createNavButton("Админ раздел", 'https://forum.blackrussia.online/forums/Админ-раздел.3466/', buttonStyles[0]),
    createNavButton("Заявки", 'https://forum.blackrussia.online/forums/Сервер-№78-vladimir.3495/', buttonStyles[1]),
    createNavButton("Обжалования", 'https://forum.blackrussia.online/forums/Обжалование-наказаний.3485/', buttonStyles[2]),
    createNavButton("Жалобы на игроков", 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.3484/', buttonStyles[3]),
    createNavButton("Жалобы на админов", 'https://forum.blackrussia.online/forums/Жалобы-на-администрацию.3482/', buttonStyles[4]),
    createNavButton("Раздел сервера", 'https://forum.blackrussia.online/forums/Сервер-№78-vladimir.3465/', buttonStyles[5]),
    createNavButton("Правила проекта", 'https://forum.blackrussia.online/threads/Общие-правила-серверов.312571/', buttonStyles[6])
];

// Добавляем кнопки в меню
const buttonsContainer = document.createElement("div");
buttonsContainer.classList.add("buttons-container");
buttons.forEach(btn => {
    buttonsContainer.appendChild(btn);
    buttonsContainer.appendChild(document.createElement("br")); // Добавляем отступ
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
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    z-index: 1000;
    transition: all 0.3s ease;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    letter-spacing: 1px;
}

.floating-menu-button:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
    background: linear-gradient(135deg, #7a2be2 0%, #3d8bfd 100%);
}

.menu-container {
    position: fixed;
    bottom: 85px;
    right: 20px;
    width: 320px;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
    z-index: 999;
    overflow: hidden;
    animation: slideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    border: 1px solid rgba(255, 255, 255, 0.5);
    transform-origin: bottom right;
}

@keyframes slideIn {
    from {
        transform: scale(0.8);
        opacity: 0;
    }
    to {
        transform: scale(1);
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
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.menu-header h3 {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
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
}

.close-button:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: rotate(90deg);
}

.buttons-container {
    padding: 20px;
    max-height: 60vh;
    overflow-y: auto;
}

.menu-button {
    width: 100%;
    padding: 16px 20px;
    text-align: left;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    font-size: 16px;
    color: white;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    position: relative;
    overflow: hidden;
    font-weight: 600;
    text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.menu-button:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: 0.5s;
}

.menu-button:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 7px 14px rgba(0, 0, 0, 0.2) !important;
}

.menu-button:hover:before {
    left: 100%;
}

.button-icon {
    margin-right: 12px;
    font-size: 20px;
    transition: all 0.3s ease;
    filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.3));
}

.menu-button:hover .button-icon {
    transform: scale(1.2) rotate(5deg);
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
}
`;
document.head.appendChild(style);

    // Конфигурация
    const CONFIG = {
        CLAIM_ADMINS: 'https://gist.githubusercontent.com/sevent0/3c1d3c1ff32e1546e9a791062771581b/raw/ba8d862b0c33d0fb7b4e9f9f345e490745080fb3/deputy.json',
        APPEAL_PUNISH: 'https://gist.githubusercontent.com/sevent0/115ea0af64e39ba476e74819705c273d/raw/d75caa03924b639a375a37ef7ac24c80b0048201/appealing.json',
        CLAIM_PLAYER: 'https://gist.githubusercontent.com/sevent0/b5c5c60ee35ee864965fde9731a97966/raw/87574b13a64e8d9d184299819f9eb37770a5ec74/script.json',
        PREFIXES: {
            UNACCEPT: 4,
            ACCEPT: 8,
            RESHENO: 6,
            PIN: 2,
            GA: 12,
            COMMAND: 10,
            WATCHED: 9,
            CLOSE: 7,
            SPECIAL: 11,
            OJIDANIE: 14,
            TEX: 13
        }
    };

    let bAdmins = [];
    let bAppeal = [];
    let bPlayer = [];

    // Инициализация скрипта
    const init = async () => {
    try {
        // Параллельная загрузка всех данных
        const responses = await Promise.all([
            fetch(CONFIG.CLAIM_ADMINS),
            fetch(CONFIG.APPEAL_PUNISH),
            fetch(CONFIG.CLAIM_PLAYER)
        ]);

        // Проверка статусов ответов
        for (const response of responses) {
            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status} - ${response.statusText}`);
            }
        }

        // Параллельное преобразование в JSON
        const [dataAdmins, dataAppeal, dataPlayer] = await Promise.all([
            responses[0].json(),
            responses[1].json(),
            responses[2].json()
        ]);

        bAdmins = dataAdmins;
        bAppeal = dataAppeal;
        bPlayer = dataPlayer;

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

        addButton('ЖАЛОБЫ НА АДМИНИСТРАЦИЮ', 'ClaimsAdmins');
        addButton('ОБЖАЛОВАНИЯ НАКАЗАНИЙ', 'AppelationsPunish');
        addButton('ЖАЛОБЫ НА ИГРОКОВ', 'ClaimsPlayers');

        $('button#ClaimsAdmins').click(() => {
            XF.alert(buttonsMarkup(bAdmins), null, 'Выберите ответ для рассмотрения жалоб на администрацию:');
            bAdmins.forEach((btn, id) => {
                $(`button#answers-${id}`).click(() => {
                    const threadData = getThreadData();
                    pasteContent(bAdmins, id, threadData, !!btn.prefix);
                });
            });
        });

        $('button#AppelationsPunish').click(() => {
            XF.alert(buttonsMarkup(bAppeal), null, 'Выберите ответ для рассмотрения обжалований наказаний:');
            bAppeal.forEach((btn, id) => {
                $(`button#answers-${id}`).click(() => {
                    const threadData = getThreadData();
                    pasteContent(bAppeal, id, threadData, !!btn.prefix);
                });
            });
        });

        $('button#ClaimsPlayers').click(() => {
            XF.alert(buttonsMarkup(bPlayer), null, 'Выберите ответ для рассмотрения жалоб на игроков:');
            bPlayer.forEach((btn, id) => {
                $(`button#answers-${id}`).click(() => {
                    const threadData = getThreadData();
                    pasteContent(bPlayer, id, threadData, !!btn.prefix);
                });
            });
        });
    };

    // Универсальная функция генерации разметки кнопок
    const buttonsMarkup = (buttonsArray) => `
        <div class="select_answer">
            ${buttonsArray.map((btn, i) => `
                <button id="answers-${i}" class="button--primary button rippleButton"
                        style="margin:5px; ${btn.dpstyle || ''}">
                    <span class="button-text">${btn.title}</span>
                </button>
            `).join('')}
        </div>
    `;

    // Универсальная функция вставки контента
    function pasteContent(buttonArray, id, data = {}, send = false) {
      const template = Handlebars.compile(buttonArray[id].content);
      if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

      $('span.fr-placeholder').empty();
      $('div.fr-element.fr-view p').append(template(data));
      $('a.overlay-titleCloser').trigger('click');

      if (send == true) {
          editThreadData(buttonArray[id].move, buttonArray[id].prefix, buttonArray[id].status, buttonArray[id].open);
          $('.button--icon.button--icon--reply.rippleButton').trigger('click');
      }
    }

  function getThreadData() {
  const authorID = $('a.username')[0]?.attributes['data-user-id']?.nodeValue;
  const authorName = $('a.username').html();
  const hours = new Date().getHours();

  if (!authorID || !authorName) {
      console.error("Не удалось получить данные автора");
      return {
          user: {
              id: "0",
              name: "Автор",
              mention: "[USER=0]Автор[/USER]"
          },
          greeting: "Доброго времени суток"
      };
  }

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
      const threadTitle = $('.p-title-value')[0]?.lastChild?.textContent || "Тема";

      const formData = {
        prefix_id: prefix,
        title: threadTitle,
        _xfToken: XF.config.csrf,
        _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
        _xfWithData: 1,
        _xfResponseType: 'json',
      };

      if (pin) {
          formData.sticky = 1;
          if (open) formData.discussion_open = 1;
      }

      fetch(`${document.URL}edit`, {
        method: 'POST',
        body: getFormData(formData)
      }).then(() => {
        if (move > 0) {
          moveThread(prefix, move);
        } else {
          location.reload();
        }
      });
  }

  function moveThread(prefix, type) {
      const threadTitle = $('.p-title-value')[0]?.lastChild?.textContent || "Тема";

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