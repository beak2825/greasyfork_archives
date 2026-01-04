// ==UserScript==
// @name         ShikiUtils
// @icon         https://raw.githubusercontent.com/shikigraph/Fumo/refs/heads/main/Fumo.png
// @namespace    https://shikimori.one
// @version      4.3.1
// @description  Полезные утилиты для шикимори + GUI
// @author       LifeH
// @match        https://shikimori.one/*
// @match        https://shikimori.rip/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_registerMenuCommand
// @require      https://cdn.jsdelivr.net/npm/@melloware/coloris@0.25.0/dist/umd/coloris.min.js
// @require      https://update.greasyfork.org/scripts/552841/1687209/ShikiTreeLib.js
// @require      https://cdn.jsdelivr.net/npm/axios@1.12.2/dist/axios.min.js
// @require      https://cdn.jsdelivr.net/npm/d3@3.5.17/d3.min.js
// @require      https://cdn.jsdelivr.net/npm/openpgp@6.2.2/dist/openpgp.min.js
// @resource     colorisCSS https://cdn.jsdelivr.net/npm/@melloware/coloris@0.25.0/dist/coloris.min.css
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/525662/ShikiUtils.user.js
// @updateURL https://update.greasyfork.org/scripts/525662/ShikiUtils.meta.js
// ==/UserScript==

/* eslint-disable no-undef */

(function () {
  (function notice() {
    const NOTICE_KEY_OLD = "ShikiUtils_4.0_-notice";
    localStorage.removeItem(NOTICE_KEY_OLD);
    const NOTICE_KEY = "ShikiUtils_4.3_-notice";

    if (!localStorage.getItem(NOTICE_KEY)) {
      const modal = document.createElement("div");
      modal.style = `
      position: fixed;
      top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.7);
      z-index: 999999;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Inter', 'Segoe UI', sans-serif;


    `;

      modal.innerHTML = `
  <div style="background: #1c1c1f; color: #ddd; padding: 25px 35px; border-radius: 14px; max-width: 520px; box-shadow: 0 0 25px rgba(0,0,0,0.6); font-size: 15px; line-height: 1.6; border: 1px solid rgba(255,255,255,0.1); position: relative; text-align: left; animation: fadeIn 0.4s ease;">
    <h2 style="
      margin-top: 0;
      color: #9fdb88;
      font-size: 22px;
      text-align: center;
    ">
      Обновление <span style="color:#aaf;">ShikiUtils v4.3</span>!
    </h2>

    <p><b>Что изменилось:</b></p>
    <ul style="padding-left:20px; margin-top:5px;">
      <li>Улучшено GUI</li>

      <li style="margin-top:6px;"><b>Добавлены:</b></li>
      <li>More Statistic</li>
      <li>Shiki Rating</li>
      <li>Polls Helper</li>
      <li>PGP Encryption</li>

      <li style="margin-top:6px;"><b>Удалены:</b></li>
      <li>Friends average score</li>
      <li>Ban count</li>
      <li>Watch time</li>
    </ul>
    <p style="margin-top:10px;">
      Подробное описание всех функций, changelog и место для обратной связи:<br>
      <a href="https://shikimori.one/forum/site/610497" target="_blank" style="color: #80cfff; text-decoration: none; font-weight: 500;">
        Тута -> Топик на форуме
      </a>
    </p>
    <div style="text-align:center; margin-top:20px;">
      <button id="closeShikiUtilsNotice" style="padding: 8px 18px; background: linear-gradient(90deg, #5cb85c, #4cae4c); border: none; color: white; border-radius: 6px; cursor: pointer; font-size: 14px; transition: background 0.2s ease, transform 0.1s ease;">
      Окак</button>
    </div>
        <img src="https://media.tenor.com/r6TGLs81M4UAAAAi/touhou-sakuya.gif"
      style="position: absolute; width: 64px; height: 64px; top: 0; left: 0; animation: moveAround 6s linear infinite alternate, spin 4s linear infinite; pointer-events: none; user-select: none; ">
    <style>
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      #closeShikiUtilsNotice:hover {
        background: linear-gradient(90deg, #6ed36e, #5cc45c);
        transform: scale(1.03);
      }
      @keyframes moveAround {
        0%   { top: 0; left: 0; }
        25%  { top: 0; left: calc(100% - 64px); }
        50%  { top: calc(100% - 64px); left: calc(100% - 64px); }
        75%  { top: calc(100% - 64px); left: 0; }
        100% { top: 0; left: 0; }
      }
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    </style>
  </div>
    `;

      document.body.appendChild(modal);

      document
        .getElementById("closeShikiUtilsNotice")
        .addEventListener("click", () => {
          modal.remove();
          localStorage.setItem(NOTICE_KEY, "true");
        });
    }
  })();

  function ready(fn) {
    document.addEventListener("page:load", fn);
    document.addEventListener("turbolinks:load", fn);
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  let username = null;
  let userId = null;
  const userDataEl = document.querySelector("[data-user]"); //todo переделать под whoami
  function updateUserData() {
    if (userDataEl) {
      try {
        const userData = JSON.parse(userDataEl.getAttribute("data-user"));
        username = userData.url ? userData.url.split("/").pop() : null;
        userId = userData.id || null;
        sessionStorage.setItem("username", username);
        sessionStorage.setItem("userId", userId);
      } catch (err) {
        console.error("[updateUserData]:", err);
        username = sessionStorage.getItem("username") || null;
        userId = sessionStorage.getItem("userId") || null;
      }
    } else {
      username = sessionStorage.getItem("username") || username;
      userId = sessionStorage.getItem("userId") || userId;
    }
  }
  function getUsername() {
    updateUserData();
    return username;
  }
  function getUserId() {
    updateUserData();
    return userId;
  }

  ("use strict");
  GM_registerMenuCommand("Настройки", () => {
    try {
      window.location.href = `https://shikimori.one/${getUsername()}/edit/misc`;
    } catch (err) {
      console.error("[ShikiUtils]", err);
    }
  });
  GM_registerMenuCommand("Топик", () => {
    try {
      window.location.href = `https://shikimori.one/forum/site/610497`;
    } catch (err) {
      console.error("[ShikiUtils]", err);
    }
  });
  const cssCopyIcon = `<svg width="16px" height="16px" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-220.000000, -1239.000000)" fill="#000000"><g id="icons" transform="translate(56.000000, 160.000000)"> <path d="M183.7248,1085.149 L178.2748,1079.364 C178.0858,1079.165 177.8238,1079.001 177.5498,1079.001 L165.9998,1079.001 C164.8958,1079.001 163.9998,1080.001 163.9998,1081.105 L163.9998,1088.105 C163.9998,1088.657 164.4478,1089.105 164.9998,1089.105 C165.5528,1089.105 165.9998,1088.657 165.9998,1088.105 L165.9998,1082.105 C165.9998,1081.553 166.4478,1081.001 166.9998,1081.001 L175.9998,1081.001 L175.9998,1085.105 C175.9998,1086.21 176.8958,1087.001 177.9998,1087.001 L181.9998,1087.001 L181.9998,1088.105 C181.9998,1088.657 182.4478,1089.105 182.9998,1089.105 C183.5528,1089.105 183.9998,1088.657 183.9998,1088.105 L183.9998,1085.838 C183.9998,1085.581 183.9018,1085.335 183.7248,1085.149 L183.7248,1085.149 Z M182.9998,1091.001 L179.9998,1091.001 C178.8958,1091.001 177.9998,1092.001 177.9998,1093.105 L177.9998,1094.105 C177.9998,1095.21 178.8958,1096.001 179.9998,1096.001 L181.4998,1096.001 C181.7758,1096.001 181.9998,1096.224 181.9998,1096.501 C181.9998,1096.777 181.7758,1097.001 181.4998,1097.001 L178.9998,1097.001 C178.4528,1097.001 178.0098,1097.493 178.0028,1098.04 C178.0098,1098.585 178.4528,1099.001 178.9998,1099.001 L181.9998,1099.001 L182.0208,1099.001 C183.1138,1099.001 183.9998,1098.219 183.9998,1097.126 L183.9998,1096.084 C183.9998,1094.991 183.1138,1094.001 182.0208,1094.001 L181.9998,1094.001 L180.4998,1094.001 C180.2238,1094.001 179.9998,1093.777 179.9998,1093.501 C179.9998,1093.224 180.2238,1093.001 180.4998,1093.001 L182.9998,1093.001 C183.5528,1093.001 183.9998,1092.605 183.9998,1092.053 L183.9998,1092.027 C183.9998,1091.474 183.5528,1091.001 182.9998,1091.001 L182.9998,1091.001 Z M177.9998,1098.053 C177.9998,1098.048 178.0028,1098.044 178.0028,1098.04 C178.0028,1098.035 177.9998,1098.031 177.9998,1098.027 L177.9998,1098.053 Z M175.9998,1091.001 L172.9998,1091.001 C171.8958,1091.001 170.9998,1092.001 170.9998,1093.105 L170.9998,1094.105 C170.9998,1095.21 171.8958,1096.001 172.9998,1096.001 L174.4998,1096.001 C174.7758,1096.001 174.9998,1096.224 174.9998,1096.501 C174.9998,1096.777 174.7758,1097.001 174.4998,1097.001 L171.9998,1097.001 C171.4528,1097.001 171.0098,1097.493 171.0028,1098.04 C171.0098,1098.585 171.4528,1099.001 171.9998,1099.001 L174.9998,1099.001 L175.0208,1099.001 C176.1138,1099.001 176.9998,1098.219 176.9998,1097.126 L176.9998,1096.084 C176.9998,1094.991 176.1138,1094.001 175.0208,1094.001 L174.9998,1094.001 L173.4998,1094.001 C173.2238,1094.001 172.9998,1093.777 172.9998,1093.501 C172.9998,1093.224 173.2238,1093.001 173.4998,1093.001 L175.9998,1093.001 C176.5528,1093.001 176.9998,1092.605 176.9998,1092.053 L176.9998,1092.027 C176.9998,1091.474 176.5528,1091.001 175.9998,1091.001 L175.9998,1091.001 Z M170.9998,1098.053 C170.9998,1098.048 171.0028,1098.044 171.0028,1098.04 C171.0028,1098.035 170.9998,1098.031 170.9998,1098.027 L170.9998,1098.053 Z M169.9998,1092.027 L169.9998,1092.053 C169.9998,1092.605 169.5528,1093.001 168.9998,1093.001 L167.9998,1093.001 C166.7858,1093.001 165.8238,1094.083 166.0278,1095.336 C166.1868,1096.32 167.1108,1097.001 168.1068,1097.001 L168.9998,1097.001 C169.5528,1097.001 169.9998,1097.474 169.9998,1098.027 L169.9998,1098.053 C169.9998,1098.605 169.5528,1099.001 168.9998,1099.001 L168.1718,1099.001 C166.0828,1099.001 164.2168,1097.473 164.0188,1095.393 C163.7918,1093.008 165.6608,1091.001 167.9998,1091.001 L168.9998,1091.001 C169.5528,1091.001 169.9998,1091.474 169.9998,1092.027 L169.9998,1092.027 Z" id="file_css-[#1767]"> </path> </g> </g> </g> </g></svg>`;
  const CopyIcon = `<svg width="16px" height="16px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M17.5 14H19C20.1046 14 21 13.1046 21 12V5C21 3.89543 20.1046 3 19 3H12C10.8954 3 10 3.89543 10 5V6.5M5 10H12C13.1046 10 14 10.8954 14 12V19C14 20.1046 13.1046 21 12 21H5C3.89543 21 3 20.1046 3 19V12C3 10.8954 3.89543 10 5 10Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></g></svg>`;
  const TreeIcon = `<?xml version="1.0" encoding="utf-8"?><!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools --><svg fill="#000000" width="16px" height="16px" viewBox="0 0 256 256" id="Flat" xmlns="http://www.w3.org/2000/svg"><path d="M156,92V80H144a16.01833,16.01833,0,0,0-16,16v64a16.01833,16.01833,0,0,0,16,16h12V164a16.01833,16.01833,0,0,1,16-16h40a16.01833,16.01833,0,0,1,16,16v40a16.01833,16.01833,0,0,1-16,16H172a16.01833,16.01833,0,0,1-16-16V192H144a32.03635,32.03635,0,0,1-32-32V136H84v8a16.01833,16.01833,0,0,1-16,16H36a16.01833,16.01833,0,0,1-16-16V112A16.01833,16.01833,0,0,1,36,96H68a16.01833,16.01833,0,0,1,16,16v8h28V96a32.03635,32.03635,0,0,1,32-32h12V52a16.01833,16.01833,0,0,1,16-16h40a16.01833,16.01833,0,0,1,16,16V92a16.01833,16.01833,0,0,1-16,16H172A16.01833,16.01833,0,0,1,156,92Z"/></svg>`;
  const allowedPaths = ["/ranobe", "/animes", "/mangas"];
  function animPage() {
    return window.location.href.includes("/animes");
  }


  GM_addStyle(GM_getResourceText("colorisCSS"));

  //! %===================Default Config===================%
  const defaultConfig = {
    CATButtons: { type: "category", name: "Buttons" },

    UserIdCopyBtn: {
      enabled: true,
      title: "Copy user ID button",
      description: "Кнопка под аватаркой пользователя, чтобы скопировать его ID",
      settings: {
        btnTitle: {
          value: "Скопировать ID",
          title: "Title кнопки",
          description: "Подсказка при наведении",
        },
        btnStyles: {
          type: "css",
          value:
            `width:16px;
height:16px;
cursor:pointer;
display:flex;
align-items:center;
justify-content:center;
margin:10px;
text-align:center;
z-index:9999;`,
          title: "Стили кнопки",
          description: "",
        },
        svgIcon: {
          value: CopyIcon || "<svg>...</svg>",
          title: "SVG иконка",
          description: "HTML/SVG код иконки",
        },
      },
    },
    UserCssCopyBtn: {
      enabled: true,
      title: "Copy user CSS button",
      description: "Кнопка под аватаркой пользователя, чтобы скопировать его CSS",
      settings: {
        btnTitle: {
          value: "Скопировать CSS",
          title: "Title кнопки",
          description: "Текст подсказки при наведении",
        },
        btnStyles: {
          type: "css",
          value:
            `width:16px;
height:16px;
cursor:pointer;
display:flex;
align-items:center;
justify-content:center;
margin:10px;
text-align:center;
z-index:9999;`,
          title: "Стили кнопки",
          // description: "",
        },
        svgIcon: {
          value: cssCopyIcon || "<svg>...</svg>",
          title: "SVG иконка",
          description: "HTML/SVG код иконки",
        },
      },
    },
    CommCopyBtn: {
      enabled: true,
      title: "Copy comment link button",
      description: "Кнопка рядом с комментарием, чтобы скопировать ссылку на комментарий",
      settings: {
        btnTitle: {
          value: "Скопировать ссылку",
          title: "Title кнопки",
          description: "Подсказка при наведении",
        },
        btnStyles: {
          type: "css",
          value:
            `height: 14px;
margin: 0px 5px;
vertical-align: middle;
cursor: pointer;
display: inline-block;
font-size: 13px;
text-align: center;
width: 24px;`,
          title: "Стили кнопки",
          description: "",
        },
        svgIcon: {
          value: CopyIcon || "<svg>...</svg>",
          title: "SVG иконка",
          description: "HTML/SVG код иконки",
        },
      },
    },
    CommTreeBtn: {
      enabled: true,
      title: "Comment tree button",
      description: "Кнопка рядом с комментарием, чтобы показать древо",
      settings: {
        btnTitle: {
          value: "Показать древо",
          title: "Title кнопки",
          description: "Подсказка при наведении",
        },
        btnStyles: {
          type: "css",
          value:
            `height: 14px;
margin: 0px 5px;
vertical-align: middle;
cursor: pointer;
display: inline-block;
font-size: 13px;
text-align: center;
width: 24px;`,
          title: "Стили кнопки",
          description: "",
        },
        svgIcon: {
          value: TreeIcon || "<svg>...</svg>",
          title: "SVG иконка",
          description: "HTML/SVG код иконки",
        },
      },
    },
    ImageIdCopyBtn: {
      enabled: true,
      title: "Copy image code button",
      description: "Кнопка на изображении, чтобы скопировать код изображения",
      settings: {
        btnTitle: {
          value: "Скопировать код изображения",
          title: "Title кнопки",
          description: "Подсказка при наведении",
        },
        btnStyles: {
          type: "css",
          value:
            `width:16px;
height:16px;
cursor:pointer;
position:absolute;
top:5px;
right:5px;
z-index:10;`,
          title: "Стили кнопки",
          // description: "",
        },
        svgIcon: {
          value: CopyIcon || "<svg>...</svg>",
          title: "SVG иконка",
          description: "HTML/SVG код иконки",
        },
      },
    },
    ClubCssCopyBtn: {
      enabled: true,
      title: "Copy club CSS button",
      description: "Кнопка над аватаркой клуба, чтобы скопировать его CSS",
      settings: {
        btnTitle: {
          value: "Скопировать CSS клуба",
          title: "Title кнопки",
          description: "Подсказка при наведении",
        },
        btnStyles: {
          type: "css",
          value:
            `width:16px;
height:16px;
cursor:pointer;
display:inline-block;
text-align:center;
position:absolute;
top:-30px;
left:50%;
transform:translateX(-50%);
z-index:9999;
transition:transform 0.2s ease;`,
          title: "Стили кнопки",
          description: "",
        },
        svgIcon: {
          value: cssCopyIcon || "<svg>...</svg>",
          title: "SVG иконка",
          description: "HTML/SVG код иконки",
        },
      },
    },
    CopyCodeBtn: {
      enabled: true,
      title: "Code copy button",
      description: "Кнопка в блоке кода, чтобы скопировать код",
      settings: {
        btnTitle: {
          value: "Скопировать код",
          title: "Title кнопки",
          description: "Подсказка при наведении",
        },
        btnStyles: {
          title: "Стили кнопки",
          type: "css",
          value:
            `position:absolute;
top:6px;
right:6px;
width:18px;
height:18px;
padding:0;
display:flex;
align-items:center;
justify-content:center;
font-size:14px;
line-height:1;
cursor:pointer;
background:transparent;
border:none;
border-radius:4px;
transition:background 0.25s ease, transform 0.2s ease;
z-index:2;`,
        },
        svgIcon: {
          value: CopyIcon || "<svg>...</svg>",
          title: "SVG иконка",
          description: "HTML/SVG код иконки",
        },
      },
    },
    CATFilters: { type: "category", name: "Filters" },
    ShikiRating: {
      enabled: true,
      title: "Shikimori rating filter",
      description: "Дополнительный фильтр, сортирующий аниме по рейтингу Shikimori",
      settings: {
        template: {
          value: "По рейтингу (Шикимори)",
          title: "Название фильтра",
        },
      },
    },
    StudioFilter: {
      enabled: true,
      title: "Studios filter",
      description: "Дополнительный фильтр для сортировки аниме по студии",
      settings: {
        template: {
          value: "Показать список",
          title: "Имя спойлера",
        },
      },
    },
    ChineseFilter: {
      enabled: true,
      title: "Chinese filter",
      description: "Дополнительный фильтр, убирающий китайщину",
      settings: {
        template: {
          value: "Без китайщины",
          title: "Название фильтра",
        },
        idsList: {
          title: "Ссылка на список айди",
          value: "https://raw.githubusercontent.com/shikigraph/Fumo/refs/heads/main/ChineseIds.json",
        }
      },
    },
    ForumCharacterFilter: {
      enabled: true,
      title: "Forum Character Filter",
      description: "Дополнительный фильтр, убирающий персонажей на форуме",
      settings: {
        template: {
          value: "Без персонажей",
          title: "Имя фильтра",
        },
      },
    },
    hideNews: {
      enabled: true,
      title: "News Filter",
      description: "Фильтры для новостей по ID юзера и тегам",
      settings: {
        userid: {
          type: "ids",
          value: "123,123",
          title: "User IDS",
          description: "Блеклист юзеров",
        },
        tags: {
          type: "tags",
          value: "тег1,тег2",
          title: "Теги новостей",
          description: "Блеклист тегов",
        },
      },
    },
    workTypeFilter: {
      enabled: true,
      title: "Work Type Filter",
      description: 'позволяет сортировать "тип работы" на странице человека',
    },
    CATHelpers: { type: "category", name: "Helpers" },
    NotificationHelperConfig: {
      enabled: true,
      title: "Notification helper",
      description: "Позволяет выбрать несколько уведомлений в почте и удалить их",
      settings: {
        highlightColor: {
          inline: true,
          type: "color",
          value: "#D0E8FF",
          title: "Цвет выделения",
        },
        deleteColor: {
          inline: true,
          type: "color",
          value: "#FFB3B3",
          title: "Цвет удаления",

        },
        throttledColor: {
          inline: true,
          type: "color",
          value: "#FFFF99",
          title: "Цвет при 429",
        },
        transitionSpeed: {
          type: "range",
          value: 0.3,
          title: "Скорость transition (сек)",
          min: 0,
          max: 10,
          step: 0.1,
        },
        delay429: {
          type: "number",
          value: 10000,
          title: "Таймаут после 429 (мс)",
        },
        buttonText: { value: "Удалить выбранные", title: "Текст кнопки" },
        buttonStyle: {
          type: "css",
          title: "Стили кнопки",
          value:
            `position: fixed;
bottom: 60px;
right: 20px;
padding: 10px;
background: red;
color: white;
border: none;
cursor: pointer;
z-index: 1000;`,
        },
      },
    },
    HistoryHelperConfig: {
      enabled: true,
      title: "History helper",
      description: "Позволяет выбрать несколько записей в истории и удалить их",
      settings: {
        highlightColor: {
          inline: true,
          type: "color",
          value: "#D0E8FF",
          title: "Цвет выделения",
        },
        deleteColor: {
          inline: true,
          type: "color",
          value: "#FFB3B3",
          title: "Цвет удаления",
        },
        throttledColor: {
          inline: true,
          type: "color",
          value: "#FFFF99",
          title: "Цвет при 429",
        },
        transitionSpeed: {
          type: "range",
          value: 0.3,
          title: "Скорость transition (сек)",
          min: 0,
          max: 10,
          step: 0.1,
        },
        delay429: {
          type: "number",
          value: 10000,
          title: "Таймаут после 429 (мс)",
        },
        buttonText: {
          type: "text",
          value: "Удалить выбранные",
          title: "Текст кнопки",
        },
        buttonStyle: {
          type: "css",
          title: "Стили кнопки",
          value:
            `position: fixed;
bottom: 60px;
right: 20px;
padding: 10px;
background: red;
color: white;
border: none;
cursor: pointer;
z-index: 1000;`,
        },
      },
    },
    CATMisc: { type: "category", name: "Misc" },
    PGPModule: {
      enabled: true,
      title: "PGP Encryption",
      description: "Шифрование комментариев через OpenPGP",
      settings: {
        PubKeyRecipient: {
          title: "Публичные ключи собеседников",
          type: "pairs",
          layout: "block",
          dependsOn: { key: "SharedMode", value: false },
          value: [
            { user: "", key: "" },
          ]
        },
        AutoEncryptOnType: {
          type: "boolean",
          value: false,
          title: "Авто шифрование",
          description: "Каждый отправленный комментарий шифруется",

        },
        EncryptForMyself: {
          type: "boolean",
          value: true,
          title: "Расшифровывать свое сообщение",
          // description:"",
          dependsOn: { key: "SharedMode", value: false },
        },
        SharedMode: {
          type: "boolean",
          value: true,
          title: "Общее шифрование для пользователей скрипта",
        },
        PubKeySelf: {
          type: "css",
          value: "",
          title: "Твой публичный ключ",
          dependsOn: { key: "SharedMode", value: false },
          // description: ""
        },
        PrivKeySelf: {
          type: "css",
          value: "",
          title: "Твой приватный ключ",
          dependsOn: { key: "SharedMode", value: false },
          // description: ""
        },
        KeyPassphrase: {
          type: "css",
          value: "",
          title: "Пароль",
          dependsOn: { key: "SharedMode", value: false },
          // description: ""
        },
        GenerateKeysBtn: {
          type: "button",
          value: "Сгенерировать ключи",
          dependsOn: { key: "SharedMode", value: false },
          title: " "
        }
      }
    },
    MoreStatistic: {
      enabled: true,
      title: "More Statistic",
      description: "Дополнительная статистика",
      settings: {
        enableAvgScoreInList: {
          type: "boolean",
          title: "Показывать среднюю оценку в списке",
          value: true,
          category: "Средняя оценка в списке",
          inline: true,
        },
        avgScoreTemplate: {
          title: "Шаблон текста",
          value: "Оценки (ср. {avgscore})",
          description: "Используйте {avgscore} для вставки средней оценки",
          category: "Средняя оценка в списке",
          dependsOn: { key: "enableAvgScoreInList", value: true },
        },
        headlineStyles: {
          type: "css",
          title: 'Стиль для оценки',
          value: `font-size: 15px;
margin-left: 5px;`,
          category: "Средняя оценка в списке",
          dependsOn: { key: "enableAvgScoreInList", value: true },

        },
        enableFriendsAvg: {
          inline: true,
          type: "boolean",
          title: "Показывать среднюю оценку друзей на странице тайтла",
          value: true,
          category: "Средняя оценка друзей",
        },
        friendsAvgTemplate: {
          title: "Шаблон текста",
          value: "У друзей (ср. {avgscore})",
          description: "Используйте {avgscore} для вставки средней оценки",
          category: "Средняя оценка друзей",
          dependsOn: { key: "enableFriendsAvg", value: true },
        },
        friendsEpInfo: {
          type: "boolean",
          value: true,
          title: "Показывать количество просмотренных эпизодов",
          category: "Средняя оценка друзей",
          dependsOn: { key: "enableFriendsAvg", value: true },
        },
        showZeroEp: {
          type: "boolean",
          value: true,
          title: "Показывать 0 эп./гл.",
          category: "Средняя оценка друзей",
          dependsOn: { key: "enableFriendsAvg", value: true },

        },
        friendsApiDelay: {
          type: "number",
          value: 500,
          title: "Задержка между запросами к апи (мс)",
          category: "Средняя оценка друзей",
          dependsOn: { key: "enableFriendsAvg", value: true },
        },
        enableBanCount: {
          inline: true,
          type: "boolean",
          title: "Показывать количество банов в списке банов",
          value: true,
          category: "Количество банов",
        },
        banCountTemplate: {
          title: "Шаблон текста",
          value: "Баны: {count}",
          description: "Используйте {count} для количества банов",
          category: "Количество банов",
          dependsOn: { key: "enableBanCount", value: true },
        },
        enableWatchTime: {
          inline: true,
          type: "boolean",
          title: "Показывать время для просмотра аниме",
          value: true,
          category: "Время просмотра",
        },
        watchTimeTemplate: {
          title: "Шаблон текста",
          value: "Общее время просмотра:",
          category: "Время просмотра",
          dependsOn: { key: "enableWatchTime", value: true },
        },
      },
    },
    ShikiScore: {
      enabled: true,
      title: "Shiki Rating",
      description: "Добавляет рейтинг на основе оценок shikimori с возможностью менять формулу",
      settings: {
        showShikiScore: {
          inline: true,
          type: "boolean",
          title: "Показывать рейтинг Shikimori",
          value: true,
          category: "Shikimori",
        },
        ShimoriDisplayMode: {
          inline: false,
          type: "mode",
          title: "Тип отображения",
          options: ["stars", "headline"],
          value: "stars",
          description:
            `headline - рядом с подзаголовоком "Оценки людей"`,
          category: "Shikimori",
          dependsOn: { key: "showShikiScore", value: true },
        },
        customFormulaLabel: {
          value: "Оценка Shikimori",
          title: "Надпись под рейтингом",
          category: "Shikimori",
          dependsOn: { key: "showShikiScore", value: true },
        },
        customFormula: {
          value: "sum / total",
          title: "Формула для Shikimori",
          description: "Подробней в топике юзерскрипта",
          category: "Shikimori",
          dependsOn: { key: "showShikiScore", value: true },
        },
        originalLabel: {
          value: "Оценка MAL",
          title: "Надпись под оригинальной оценкой",
          category: "Shikimori",
          dependsOn: { key: "showShikiScore", value: true },
        },

        showAniListScore: {
          inline: true,
          type: "boolean",
          title: "Показывать рейтинг AniList",
          value: true,
          category: "AniList",
        },
        AniListDisplayMode: {
          inline: false,
          type: "mode",
          title: "Тип отображения",
          options: ["stars", "headline"],
          value: "stars",
          description: `headline - рядом с подзаголовоком "Оценки людей"`,
          category: "AniList",
          dependsOn: { key: "showAniListScore", value: true },
        },
        AniListCustomFormulaLabel: {
          value: "Оценка AniList",
          title: "Надпись под рейтингом AniList",
          category: "AniList",
          dependsOn: { key: "showAniListScore", value: true },
        },
        AniListCustomFormula: {
          value: "averageScore / 10",
          title: "Формула для AniList",
          category: "AniList",
          dependsOn: { key: "showAniListScore", value: true },
        },
        originalScoreStyles: {
          type: "css",
          title: 'Стиль для надписи под рейтингом (тип отображения "stars")',
          value:
            `text-align: center;
color: #7b8084;
font-size: 12px;`,
          category: "AniList/Shikimori",
        },
        headlineScoreStyles: {
          type: "css",
          title: 'Стиль для надписи (тип отображения "headline")',
          value: `font-size: 15px;`,
          category: "AniList/Shikimori",
        },
        showTotalRates: {
          inline: true,
          type: "boolean",
          title: "Показывать общее количество оценок",
          value: true,
          category: "Other",
        },
        debug: {
          type: "boolean",
          value: false,
          title: "console data debug",
          category: "Other",
        }
      },
    },
    FriendsHistory: {
      enabled: true,
      title: "Friends History",
      description: "Добавляет историю друзей в списке друзей",
      settings: {
        apilimit: {
          type: "number",
          value: 50,
          title: "Количество загружаемой истории у друга(100 максимум)",
        },
        delay: {
          type: "number",
          value: 1000,
          title: "Задержка между запросами",
        },
      },
    },
    autoSpoiler: {
      enabled: false,
      title: "Auto spoiler",
      description: "Скрывает все изображения под спойлер",
      settings: {
        mode: {
          type: "mode",
          title: "Тип эффекта",
          options: ["blur(BETA)", "spoiler"],
          value: "spoiler",
        },
        template: {
          value: "image",
          title: "название спойлера",
          // description: "название спойлера.",
        },
      },
    },
    NoAgeLimits: {
      enabled: true,
      title: "Custom age",
      description: "Убирает ограничение на выбор года рождения в настройках",
    },
    removeBlur: {
      enabled: true,
      title: "Remove Blur",
      description: "Убирает цензуру с постеров аниме",
    },
    checkScroll: {
      enabled: false,
      title: "Auto loader",
      description: "Aвтоматическая подгрузка следующих страниц и вставка их содержимого в текущую страницу (BETA)",
    },
    commentsLoader: {
      enabled: true,
      title: "Comments Loader",
      description: "Добавляет возможность выбирать, сколько комментариев загрузить",
    },
    pollsHelper: {
      enabled: true,
      title: "Polls Helper",
      description: "Показывает айди и голоса в голосованиях",
    },

  };

  //! %=================== Utils ===================%
  const SHARED_KEYS = {
    pub: `-----BEGIN PGP PUBLIC KEY BLOCK-----

xjMEaSJFdBYJKwYBBAHaRw8BAQdATFpl2YulxVU9Lv4ANia0zGW6zR9hGMmO
vGaAP9m+RP7NGFNoaWtpVXRpbHMgPFNoaWtpQFV0aWxzPsLAEwQTFgoAhQWC
aSJFdAMLCQcJELjhWKHooxlSRRQAAAAAABwAIHNhbHRAbm90YXRpb25zLm9w
ZW5wZ3Bqcy5vcmcOAswt3ooqJ7pwTRsWGM+wRlerNPbp18e7j4iXJWL8EQUV
CggODAQWAAIBAhkBApsDAh4BFiEEye/9xNxUOvo8Z7wquOFYoeijGVIAAJGm
AP9zi4NDIgvzfiDa+EDa46gph3jGhtl0KXaonnlOJivMNAEAiDTBja3yIMYw
xdP0kCY9w1HoBJdbMVbqnbiAHyvctgnOOARpIkV0EgorBgEEAZdVAQUBAQdA
RzNW+P4mPHkoUzX46kPIBOV1g9Ggr+2epcKAGgqqOkUDAQgHwr4EGBYKAHAF
gmkiRXQJELjhWKHooxlSRRQAAAAAABwAIHNhbHRAbm90YXRpb25zLm9wZW5w
Z3Bqcy5vcmfKiC3q033TbDialYw0gCEl3X6G18BZ1E1VUwlycem0zAKbDBYh
BMnv/cTcVDr6PGe8KrjhWKHooxlSAAACZgD+K3pZ4cfDrvY/UZkv3id5YneG
sJ+mixlzPpJK5SnNroEA/3vKyxcZAfI2M/QCJ8Hu5UZRTzSh7/0Mudb6OJ5+
cikP
=qEdF
-----END PGP PUBLIC KEY BLOCK-----
`,

    priv: `-----BEGIN PGP PRIVATE KEY BLOCK-----

xVgEaSJFdBYJKwYBBAHaRw8BAQdATFpl2YulxVU9Lv4ANia0zGW6zR9hGMmO
vGaAP9m+RP4AAP9zkNTTAolX67n6UMf1Nmn0nUeLjvl8f1zsdNShUYIugBNr
zRhTaGlraVV0aWxzIDxTaGlraUBVdGlscz7CwBMEExYKAIUFgmkiRXQDCwkH
CRC44Vih6KMZUkUUAAAAAAAcACBzYWx0QG5vdGF0aW9ucy5vcGVucGdwanMu
b3JnDgLMLd6KKie6cE0bFhjPsEZXqzT26dfHu4+IlyVi/BEFFQoIDgwEFgAC
AQIZAQKbAwIeARYhBMnv/cTcVDr6PGe8KrjhWKHooxlSAACRpgD/c4uDQyIL
834g2vhA2uOoKYd4xobZdCl2qJ55TiYrzDQBAIg0wY2t8iDGMMXT9JAmPcNR
6ASXWzFW6p24gB8r3LYJx10EaSJFdBIKKwYBBAGXVQEFAQEHQEczVvj+Jjx5
KFM1+OpDyATldYPRoK/tnqXCgBoKqjpFAwEIBwAA/0KdnyOo0iCAoXGeNQYI
/+L/f6xcrWWuL63paoKLOFzwEZTCvgQYFgoAcAWCaSJFdAkQuOFYoeijGVJF
FAAAAAAAHAAgc2FsdEBub3RhdGlvbnMub3BlbnBncGpzLm9yZ8qILerTfdNs
OJqVjDSAISXdfobXwFnUTVVTCXJx6bTMApsMFiEEye/9xNxUOvo8Z7wquOFY
oeijGVIAAAJmAP4relnhx8Ou9j9RmS/eJ3lid4awn6aLGXM+kkrlKc2ugQD/
e8rLFxkB8jYz9AInwe7lRlFPNKHv/Qy51vo4nn5yKQ8=
=OoP3
-----END PGP PRIVATE KEY BLOCK-----
`
  };
  function getId() {
    const pathParts = window.location.pathname.split("/");
    const idPart = pathParts[2] || "";
    const match = idPart.match(/^[a-z]*(\d+)/);
    return match ? match[1] : null;
  }
  const delay = ms => new Promise(res => setTimeout(res, ms));

  function getOriginalTitle() {
    const titleElement = document.querySelector(".head h1");
    if (!titleElement) return null;
    const separator = titleElement.querySelector(".b-separator.inline");
    if (!separator) return null;
    const originalTitle = separator.nextSibling?.textContent?.trim();
    return originalTitle || null;
  }
  async function generateKeys(name, email, passphrase) {
    const keys = await openpgp.generateKey({
      type: "ecc",
      curve: "curve25519",
      userIDs: [{ name, email }],
      format: "armored",
      passphrase: passphrase || undefined
    });
    return keys;
  }
  //! %=================== CFG ===================%
  function loadConfig() {
    let saved = localStorage.getItem("ShikiUtilsConfig");
    let parsed = saved ? JSON.parse(saved) : structuredClone(defaultConfig);

    for (let key in defaultConfig) {
      const defFunc = defaultConfig[key];

      if (defFunc && defFunc.name && Object.keys(defFunc).length === 1) {
        parsed[key] = structuredClone(defFunc);
        continue;
      }

      if (
        !(key in parsed) ||
        typeof parsed[key] !== "object" ||
        parsed[key] === null
      ) {
        parsed[key] = structuredClone(defFunc);
        continue;
      }

      const curFunc = parsed[key];
      curFunc.title = defFunc.title;
      curFunc.description = defFunc.description;

      if (!curFunc.settings || typeof curFunc.settings !== "object") {
        curFunc.settings = structuredClone(defFunc.settings);
      }

      for (let sKey in defFunc.settings) {
        const defSet = defFunc.settings[sKey];
        if (
          !curFunc.settings[sKey] ||
          typeof curFunc.settings[sKey] !== "object"
        ) {
          curFunc.settings[sKey] = structuredClone(defSet);
        } else {
          const curSet = curFunc.settings[sKey];
          curSet.type = defSet.type;
          curSet.title = defSet.title;
          curSet.description = defSet.description;
        }
      }
    }

    for (let key in parsed) {
      if (!(key in defaultConfig)) {
        delete parsed[key];
      }
    }

    return parsed;
  }

  function saveConfig() {
    const toSave = {};

    for (let key in config) {
      const item = config[key];
      if (item && item.name && Object.keys(item).length === 1) continue;
      toSave[key] = item;
    }

    localStorage.setItem("ShikiUtilsConfig", JSON.stringify(toSave));
  }

  let config = loadConfig();
  //! %=================== Builders ===================%
  function btnBuilder({
    tag = "a",
    classes = [],
    title = "",
    dataset = {},
    styles = {},
    svgIcon = "",
    onClick = null,
  }) {
    const btn = document.createElement(tag);
    classes.forEach((cls) => btn.classList.add(cls));
    if (title) btn.title = title;
    for (const key in dataset) btn.dataset[key] = dataset[key];
    for (const key in styles) btn.style[key] = styles[key];
    btn.innerHTML = svgIcon;

    const transitionStyle = "stroke 0.3s ease, fill 0.3s ease";

    btn.addEventListener("mouseenter", () => {
      const svg = btn.querySelector("svg");
      if (svg) {
        svg.querySelectorAll("path").forEach((path) => {
          path.style.transition = transitionStyle;
          let computedStroke = window.getComputedStyle(path).stroke;
          if (
            computedStroke &&
            computedStroke !== "none" &&
            computedStroke !== "rgba(0, 0, 0, 0)"
          ) {
            if (!path.dataset.originalStroke) {
              path.dataset.originalStroke = computedStroke;
            }
            path.style.stroke = "var(--link-hover-color)";
          } else {
            let computedFill = window.getComputedStyle(path).fill;
            if (!path.dataset.originalFill) {
              path.dataset.originalFill = computedFill;
            }
            path.style.fill = "var(--link-hover-color)";
          }
        });
      }
    });

    btn.addEventListener("mouseleave", () => {
      const svg = btn.querySelector("svg");
      if (svg) {
        svg.querySelectorAll("path").forEach((path) => {
          path.style.transition = transitionStyle;
          if (path.dataset.originalStroke) {
            path.style.stroke = path.dataset.originalStroke;
          } else if (path.dataset.originalFill) {
            path.style.fill = path.dataset.originalFill;
          }
        });
      }
    });

    if (onClick) {
      btn.addEventListener("click", async (e) => {
        await onClick(e);
        btn.style.transform = "scale(1.5)";
        setTimeout(() => (btn.style.transform = "scale(1)"), 200);
      });
    }

    return btn;
  }
  function helperBuilder({
    configKey,
    itemSelector,
    checkboxClass,
    deleteButtonSelector,
    deleteMethod,
    deleteUrlAttr,
    showOnHover,
    checkboxContainerSelector,
  }) {
    if (!document.querySelector(deleteButtonSelector)) return;

    const cfg = config[configKey].settings;

    let button = null;
    let lastChecked = null;
    let isThrottled = false;

    function addCheckbox(item) {
      if (item.querySelector(`.${checkboxClass}`)) return;

      const container = checkboxContainerSelector
        ? item.querySelector(checkboxContainerSelector)
        : item;
      if (!container) return;

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = checkboxClass;
      checkbox.style.marginLeft = "8px";

      if (showOnHover) {
        checkbox.style.display = "none";
        item.addEventListener("mouseenter", () => {
          checkbox.style.display = "inline-block";
        });
        item.addEventListener("mouseleave", () => {
          if (!checkbox.checked) checkbox.style.display = "none";
        });
      }

      checkbox.addEventListener("click", (event) => {
        shiftSelect(event, checkbox);
        updateHighlight(checkbox);
      });

      container.prepend(checkbox);
    }

    document.querySelectorAll(itemSelector).forEach(addCheckbox);

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1 && node.matches(itemSelector)) {
            addCheckbox(node);
          } else if (node.nodeType === 1) {
            node.querySelectorAll(itemSelector).forEach(addCheckbox);
          }
        });
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    function shiftSelect(event, checkbox) {
      if (event.shiftKey && lastChecked) {
        const checkboxes = [...document.querySelectorAll(`.${checkboxClass}`)];
        const start = checkboxes.indexOf(lastChecked);
        const end = checkboxes.indexOf(checkbox);
        checkboxes
          .slice(Math.min(start, end), Math.max(start, end) + 1)
          .forEach((cb) => {
            cb.checked = lastChecked.checked;
            updateHighlight(cb);
          });
      }
      lastChecked = checkbox;
      updateDeleteButton();
    }

    function updateHighlight(checkbox) {
      const item = checkbox.closest(itemSelector);
      item.style.backgroundColor = checkbox.checked ? cfg.highlightColor?.value : "";
      item.style.transition = `background-color ${cfg.transitionSpeed?.value}s ease`;
    }

    function updateDeleteButton() {
      const selectedItems = document.querySelectorAll(`.${checkboxClass}:checked`);
      if (selectedItems.length > 0) {
        if (!button) {
          button = document.createElement("button");
          button.id = `${configKey}-delete-button`;
          button.textContent = cfg.buttonText?.value;
          button.style = cfg.buttonStyle?.value;
          button.addEventListener("click", () => deleteSelected());
          document.body.appendChild(button);
        }
      } else if (button) {
        button.remove();
        button = null;
      }
    }

    async function deleteSelected() {
      if (isThrottled) return;
      const token = document.querySelector('meta[name="csrf-token"]')?.content;
      if (!token) return;

      const selectedItems = document.querySelectorAll(
        `.${checkboxClass}:checked`
      );
      for (const checkbox of selectedItems) {
        const item = checkbox.closest(itemSelector);
        const delBtn = item.querySelector(deleteButtonSelector);
        if (!delBtn) continue;

        item.style.backgroundColor = cfg.deleteColor?.value;
        item.style.transition = `background-color ${cfg.transitionSpeed?.value}s ease`;

        const deleteUrl = delBtn.getAttribute(deleteUrlAttr);
        if (!deleteUrl) continue;

        try {
          const response = await fetch(deleteUrl, {
            method: deleteMethod,
            credentials: "include",
            headers: {
              "User-Agent": navigator.userAgent,
              "X-CSRF-Token": token,
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              _method: "delete",
              authenticity_token: token,
            }),
            redirect: "manual",
          });

          if (
            response.type === "opaqueredirect" ||
            response.status === 302 ||
            response.ok
          ) {
            await new Promise((r) => setTimeout(r, 300));
            item.remove();
          } else if (response.status === 429) {
            item.style.backgroundColor = cfg.throttledColor?.value;
            isThrottled = true;
            setTimeout(() => {
              isThrottled = false;
              deleteSelected();
            }, cfg.delay429?.value);
            return;
          }
        } catch (err) {
          console.error("[ShikiUtils]", err);
        }
      }

      if (button) {
        button.remove();
        button = null;
      }
    }
  }
  //! %===================================================== Function =====================================================%


  //! %=================== Filters ====================%

  //* %=================== Forum Character Filter ===================%
  function ForumCharacterFilter() {
    const menu = document.querySelector(".l-menu.ajax-opacity .b-forums .simple_form.b-form.edit_user_preferences");
    const storageKey = "ForumCharacterFilterActive";
    let active = localStorage.getItem(storageKey) === "true";
    const cfg = config.ForumCharacterFilter;
    function addCheckbox() {
      if (!menu || menu.querySelector(".forum-character-filter")) return;

      const div = document.createElement("div");
      div.className = "forum special forum-character-filter";
      div.innerHTML = `
        <div class="link-with-input">
          <input type="checkbox" id="forumCharacterFilterCheckbox">
          <a class="link" href="#">${cfg.settings.template?.value || "Без персонажей"}
          </a>
        </div>
      `;
      menu.appendChild(div);

      const checkbox = div.querySelector("#forumCharacterFilterCheckbox");
      checkbox.checked = active;
      checkbox.addEventListener("change", () => {
        active = checkbox.checked;
        localStorage.setItem(storageKey, active);
        applyFilter();
      });
    }

    function applyFilter() {
      if (!menu) return;
      document.querySelectorAll("article").forEach((article) => {
        const meta = article.querySelector('meta[itemprop="name"]');
        if (meta && meta.content === "Обсуждение персонажа") {
          article.style.display = active ? "none" : "";
        }
      });
    }

    function syncCheckbox() {
      const checkbox = document.querySelector("#forumCharacterFilterCheckbox");
      if (checkbox && checkbox.checked !== active) {
        checkbox.checked = active;
      }
    }

    addCheckbox();
    applyFilter();
    syncCheckbox();
    const observer = new MutationObserver(() => {
      addCheckbox();
      syncCheckbox();
      applyFilter();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
  // %=================== Chinese filter ====================%
  function ChineseFilter() {
    const cfg = config.ChineseFilter;
    const storageKey = "ChineseFilterActive";
    const idsCacheKey = "ChineseFilterIds";
    const idsCacheTimeKey = "ChineseFilterIdsTime";
    const idsUrl = cfg.settings.idsList?.value;
    const updateInterval = 24 * 60 * 60 * 1000; // 24 часа


    let active = localStorage.getItem(storageKey) === "true";
    let ids = [];

    async function loadIds() {
      try {
        const now = Date.now();
        const lastUpdate = parseInt(localStorage.getItem(idsCacheTimeKey) || "0", 10);
        const cached = localStorage.getItem(idsCacheKey);

        if (cached && now - lastUpdate < updateInterval) {
          ids = JSON.parse(cached);
          applyFilter();
          return;
        }

        await refreshIds();
      } catch (err) {
        console.error("[ShikiUtils]: loadIds err:", err);
      }
    }

    async function refreshIds() {
      try {
        const resp = await fetch(idsUrl, { cache: "no-store" });
        if (!resp.ok) throw new Error("HTTP " + resp.status);
        const data = await resp.json();
        if (Array.isArray(data)) {
          ids = data.map((n) => parseInt(n, 10)).filter((n) => !isNaN(n));
          localStorage.setItem(idsCacheKey, JSON.stringify(ids));
          localStorage.setItem(idsCacheTimeKey, Date.now().toString());
          applyFilter();
        }
      } catch (err) {
        console.error("[ShikiUtils]: refreshIds err :", err);
      }
    }

    function addCheckbox() {
      const container = document.querySelector(".b-block_list.kinds.anime-params");
      if (!container || container.querySelector(".chinese-filter")) return;

      const li = document.createElement("li");
      li.className = "chinese-filter";

      li.innerHTML = `
      <span class="filter item-add fake"></span>
      <input type="checkbox" id="chineseFilterCheckbox" autocomplete="off">
      ${cfg.settings.template?.value || "Без китайщины"}`;
      container.appendChild(li);

      const checkbox = li.querySelector("#chineseFilterCheckbox");
      checkbox.checked = active;
      if (active) li.classList.add("selected");

      checkbox.addEventListener("change", () => {
        active = checkbox.checked;
        localStorage.setItem(storageKey, active);
        li.classList.toggle("selected", active);
        applyFilter();
      });
    }

    function applyFilter() {
      const container = document.querySelector(".b-block_list.kinds.anime-params");
      if (!container) return;

      if (!ids.length) return;
      document.querySelectorAll("article.c-anime").forEach((article) => {
        const animeId = parseInt(article.id, 10);
        if (isNaN(animeId)) return;
        if (active && ids.includes(animeId)) {
          article.remove();
        }
      });
    }

    function syncCheckbox() {
      const checkbox = document.querySelector("#chineseFilterCheckbox");
      const li = document.querySelector(".chinese-filter");
      if (checkbox) {
        checkbox.checked = active;
        if (li) li.classList.toggle("selected-fake", active);
      }
    }

    addCheckbox();
    loadIds();
    syncCheckbox();

    const observer = new MutationObserver(() => {
      addCheckbox();
      syncCheckbox();
      applyFilter();
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  //* %=================== Studio Filter ====================%
  async function StudioFilter() { //todo api url v cfg
    if (!animPage()) {
      return;
    }
    const hiddenBlocks = document.querySelectorAll(".block.hidden");
    let filterBlock = null;

    hiddenBlocks.forEach((block) => {
      if (block.querySelector(".subheadline.m5")?.textContent.includes("Студия") || block.querySelector(".subheadline.m5")?.textContent.includes("Studio")) {
        filterBlock = block;
      }
    });

    if (!filterBlock) {
      return;
    }

    let studioList = filterBlock.querySelector(".b-block_list.studios.anime-params");
    if (!studioList) {
      studioList = document.createElement("ul");
      studioList.className = "b-block_list studios anime-params";
      filterBlock.appendChild(studioList);
    }

    try {
      const response = await fetch("https://shikimori.one/api/studios", {
        headers: {
          "User-Agent": "Mozilla/5.0",
        },
      });

      if (!response.ok) {
        throw new Error(response.status);
      }

      const studios = await response.json();
      const realStudios = studios.filter((studio) => studio.real);
      // spoiler
      const spoilerContainer = document.createElement("div");
      spoilerContainer.className = "b-spoiler";

      const spoilerLabel = document.createElement("label");
      spoilerLabel.textContent = config.StudioFilter.settings.template.value;
      spoilerLabel.style.cursor = "pointer";

      const spoilerContent = document.createElement("div");
      spoilerContent.className = "content only-show";
      spoilerContent.style.display = "none";

      const spoilerInner = document.createElement("div");
      spoilerInner.className = "inner";

      spoilerInner.appendChild(studioList);
      spoilerContent.appendChild(spoilerInner);
      spoilerContainer.appendChild(spoilerLabel);
      spoilerContainer.appendChild(spoilerContent);

      filterBlock.appendChild(spoilerContainer);

      // ev
      spoilerLabel.addEventListener("click", () => {
        spoilerLabel.style.display = "none";
        spoilerContent.style.display = "block";
        spoilerContainer.dispatchEvent(new Event("spoiler:open"));
      });

      realStudios.forEach((studio) => {
        const studioItem = document.createElement("li");
        studioItem.dataset.field = "studio";
        studioItem.dataset.value = `${studio.id}-${studio.filtered_name}`;

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";

        studioItem.appendChild(checkbox);
        studioItem.appendChild(document.createTextNode(` ${studio.name}`));
        studioList.appendChild(studioItem);
      });

      filterBlock.classList.remove("hidden");
    } catch (err) {
      console.error("[ShikiUtils]", err);
    }
  }
  //* %=================== Shiki Rating Filter ====================%

  function ShikiRating() {//todo фикс score_2 
    const filtersContainer = document.querySelector(".b-block_list.orders.anime-params.subcontent");
    if (!filtersContainer) return;

    const ShikiSort = document.createElement("li");
    ShikiSort.setAttribute("data-field", "order");
    ShikiSort.setAttribute("data-value", "score_2");

    ShikiSort.innerHTML = config.ShikiRating.settings.template.value;

    const referenceElement = filtersContainer.querySelector('li[data-field="order"][data-value="ranked"]');

    if (referenceElement) {
      filtersContainer.insertBefore(ShikiSort, referenceElement.nextSibling);
    } else {
      filtersContainer.appendChild(ShikiSort);
    }
  }
  //* %=================== News Filter ====================%
  function hideNews() {
    const blockedUserIds = config.hideNews.settings.userid.value
      .split(",")
      .map((id) => id.trim());
    const blockedTags = config.hideNews.settings.tags.value
      .split(",")
      .map((tag) => tag.trim().toLowerCase());

    document
      .querySelectorAll("article.b-news_wall-topic")
      .forEach((article) => {
        const userId = article.getAttribute("data-user_id");

        if (blockedUserIds.includes(userId)) {
          article.style.display = "none";
          return;
        }

        const tagElements = article.querySelectorAll(".tags .b-anime_status_tag");
        const articleTags = Array.from(tagElements).map((el) =>
          el.getAttribute("data-text").toLowerCase()
        );

        if (articleTags.some((tag) => blockedTags.includes(tag))) {
          article.style.display = "none";
        }
      });
  }
  //* %=================== Work Type Filter ====================%
  function workTypeFilter() {
    if (!/\/people\/\d+-.*\/works/.test(location.pathname)) return;

    const mainContainer = document.querySelector(".l-content");
    const contentContainer = document.querySelector(".cc-5");
    if (!mainContainer || !contentContainer) return;
    if (mainContainer.querySelector('[data-shikiutils="works-filter"]')) return;
    const articles = Array.from(contentContainer.querySelectorAll("article"));
    if (!articles.length) return;

    articles.forEach((article, index) => {
      if (!article.dataset.originalIndex) {
        article.dataset.originalIndex = index;
      }
    });

    const typesSet = new Set();
    articles.forEach((article) => {
      const textDiv = article.querySelector(".text");
      if (textDiv) {
        textDiv.textContent
          .split(",")
          .map((t) => t.trim())
          .forEach((t) => {
            if (t) typesSet.add(t);
          });
      }
    });
    const types = Array.from(typesSet);
    if (!types.length) return;

    const style = document.createElement("style");
    //todo css v cfg
    style.textContent = `
    .b-options-floated[data-shikiutils="works-filter"] { 
      position: initial;
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 10px;
      gap: 4px 0px;
    }
  `;
    document.head.appendChild(style);

    const filterBlock = document.createElement("div");
    filterBlock.className = "b-options-floated mobile-phone";
    filterBlock.dataset.shikiutils = "works-filter";

    function reorderArticles() {
      const visible = [];
      const hidden = [];

      articles.forEach((article) => {
        if (article.style.display === "none") hidden.push(article);
        else visible.push(article);
      });

      visible.sort((a, b) => a.dataset.originalIndex - b.dataset.originalIndex);
      hidden.sort((a, b) => a.dataset.originalIndex - b.dataset.originalIndex);

      [...visible, ...hidden].forEach((a) => contentContainer.appendChild(a));
    }

    types.forEach((type) => {
      const filterBtn = document.createElement("a");
      filterBtn.textContent = type;

      filterBtn.addEventListener("click", () => {
        const isSelected = filterBtn.classList.contains("selected");

        filterBlock
          .querySelectorAll("a")
          .forEach((a) => a.classList.remove("selected"));

        if (!isSelected) {
          filterBtn.classList.add("selected");

          articles.forEach((article) => {
            const textDiv = article.querySelector(".text");
            if (textDiv) {
              const articleTypes = textDiv.textContent
                .split(",")
                .map((t) => t.trim());
              article.style.display = articleTypes.includes(type) ? "" : "none";
            }
          });
        } else {
          articles.forEach((article) => (article.style.display = ""));
        }

        reorderArticles();
      });

      filterBlock.appendChild(filterBtn);
    });

    mainContainer.prepend(filterBlock);
  }

  //! %=================== Helpers ====================%

  //* %=================== Notification Helper ====================%
  function NotificationHelper() {
    helperBuilder({
      configKey: "NotificationHelperConfig",
      itemSelector: ".b-message, .b-dialog",
      checkboxClass: "notification-checkbox",
      deleteButtonSelector: ".item-delete-confirm",
      deleteMethod: "DELETE",
      deleteUrlAttr: "action",
      showOnHover: true,
      checkboxContainerSelector: "aside.buttons div.main-controls",
    });
  }
  //* %=================== History Helper ====================%
  function HistoryHelper() {
    helperBuilder({
      configKey: "HistoryHelperConfig",
      itemSelector: ".b-user_history-line",
      checkboxClass: "history-checkbox",
      deleteButtonSelector: ".destroy",
      deleteMethod: "POST",
      deleteUrlAttr: "href",
      showOnHover: false,
      checkboxContainerSelector: null,
    });
  }

  //! %=================== Buttons ====================%

  //* %=================== Club Css Copy Btn ====================%
  async function ClubCssCopyBtn() {
    //todo совместимость с рип 
    const cfg = config.ClubCssCopyBtn.settings;

    document.querySelectorAll(".b-clubs-menu").forEach((menu) => {
      const stylesObj = Object.fromEntries(
        cfg.btnStyles?.value
          .split(";")
          .filter((s) => s)
          .map((s) => s.split(":").map((x) => x.trim()))
      );

      const button = btnBuilder({
        tag: "a",
        classes: ["copy-club-css", "b-tooltipped"],
        title: cfg.btnTitle?.value,
        styles: stylesObj,
        svgIcon: cfg.svgIcon?.value,
        onClick: async () => {
          const match = window.location.href.match(/\/clubs\/(\d+)-/);
          if (match) {
            const clubId = match[1];
            try {
              const clubResponse = await fetch(`https://shikimori.one/api/clubs/${clubId}`);
              const clubData = await clubResponse.json();
              const styleId = clubData.style_id;
              if (!styleId) throw new Error("no styleId");

              const styleResponse = await fetch(`https://shikimori.one/api/styles/${styleId}`);
              const styleData = await styleResponse.json();
              if (!styleData.compiled_css) {
                throw new Error("no styleData.compiled_css");
              }

              await navigator.clipboard.writeText(styleData.compiled_css);
            } catch (err) {
              console.error("[ShikiUtils]", err);
            }
          }
        },
      });

      menu.prepend(button);
    });
  }
  //* %=================== Comm Copy Btn ====================%
  function CommCopyBtn() {
    //todo совместимость с рип 
    const cfg = config.CommCopyBtn.settings;

    document.querySelectorAll(".b-comment").forEach((comment) => {
      if (comment.querySelector(".copy-comment-link")) return;

      const commentId = comment.id;
      if (!commentId) return;
      const commentLink = `https://shikimori.one/comments/${commentId}`;

      const button = btnBuilder({
        tag: "span",
        classes: ["copy-comment-link"],
        title: cfg.btnTitle?.value,
        styles: {},
        svgIcon: cfg.svgIcon?.value,
        onClick: () =>
          navigator.clipboard.writeText(commentLink).catch(console.error),
      });
      button.style.cssText = cfg.btnStyles?.value;

      const mainControls = comment.querySelector(".main-controls");
      if (mainControls) mainControls.appendChild(button);
    });
  }
  function CommTreeBtn() {
    //todo совместимость с рип 
    const cfg = config.CommTreeBtn.settings;

    document.querySelectorAll(".b-comment").forEach((comment) => {
      if (comment.querySelector(".comment-tree-btn")) return;
      const commentId = comment.id;
      if (!commentId) return;

      const button = btnBuilder({
        tag: "span",
        classes: ["comment-tree-btn"],
        title: cfg.btnTitle?.value || "Показать древо комментариев",
        styles: {},
        svgIcon: cfg.svgIcon?.value,
        onClick: async () => {
          try {
            const visited = new Set();
            const nodes = [];
            const links = [];
            const commentCache = new Map();

            async function getCommentData(id) {
              if (commentCache.has(id)) return commentCache.get(id);
              const resp = await fetch(`https://shikimori.one/api/comments/${id}`);
              if (!resp.ok) return null;
              const data = await resp.json();
              commentCache.set(id, data);
              return data;
            }

            async function parseCommentTree(
              id,
              parentId = null,
              mainAuthor = null,
              mainResponder = null
            ) {
              if (visited.has(id)) return;
              visited.add(id);

              const data = await getCommentData(id);
              if (!data) return;

              const author = data.user?.nickname || "unknown";
              const date = new Date(data.created_at).getFullYear();

              if (!nodes.some((n) => n.id === data.id)) {
                nodes.push({
                  id: data.id,
                  date,
                  image_url: data.user?.image?.x64 || "",
                  author,
                  weight: 10,
                });
              }

              if (parentId) {
                if (
                  !links.some(
                    (l) => l.source_id === parentId && l.target_id === data.id
                  )
                ) {
                  links.push({
                    source_id: data.id,
                    target_id: parentId,
                    weight: 1,
                    relation: "sequel",
                  });
                }
              }

              const replies = [
                ...data.body.matchAll(/\[replies=([0-9,]+)\]/g),
              ].flatMap((m) =>
                m[1]
                  .split(",")
                  .map((x) => x.trim())
                  .filter(Boolean)
              );

              const repliesTo = [
                ...data.body.matchAll(/\[comment=(\d+);/g),
              ].map((m) => m[1]);

              const quotesTo = [
                ...data.body.matchAll(/>\?c(\d+);/g)
              ].map((m) => m[1]);

              if (replies.length === 0 && repliesTo.length === 0 && !parentId) {
                links.push({
                  source_id: data.id,
                  target_id: data.id,
                  weight: 1,
                  relation: "other",
                });
                return;
              }

              for (const repId of replies) {
                if (!visited.has(repId)) {
                  await parseCommentTree(
                    repId,
                    data.id,
                    mainAuthor || author,
                    mainResponder || author
                  );
                } else {
                  if (!links.some((l) => l.source_id === data.id && l.target_id === Number(repId))) {
                    links.push({
                      source_id: Number(repId),
                      target_id: data.id,
                      weight: 1,
                      relation: "sequel",
                    });
                  }
                }
              }

              for (const refId of repliesTo) {
                if (!visited.has(refId)) {
                  await parseCommentTree(
                    refId,
                    null,
                    mainAuthor || author,
                    mainResponder || author
                  );
                }
                if (!links.some((l) => l.source_id === data.id && l.target_id === Number(refId))) {
                  links.push({
                    source_id: data.id,
                    target_id: Number(refId),
                    weight: 1,
                    relation: "sequel",
                  });
                }
              }
              for (const quoteId of quotesTo) {
                if (!visited.has(quoteId)) {
                  await parseCommentTree(
                    quoteId,
                    null,
                    mainAuthor || author,
                    mainResponder || author
                  );
                }

                if (!links.some((l) => l.source_id === data.id && l.target_id === Number(quoteId))) {
                  links.push({
                    source_id: data.id,
                    target_id: Number(quoteId),
                    weight: 1,
                    relation: "sequel",
                  });
                }
              }
            }

            await parseCommentTree(commentId);

            const data = {
              current_id: Number(commentId),
              nodes,
              links,
            };

            localStorage.setItem("ShikiUtils_CommTreeData", JSON.stringify(data));
            localStorage.setItem("shikiDialogFromButton", "true");
            window.location.href = "https://shikimori.one/animes/59846/franchise";
          } catch (err) {
            console.error("[ShikiUtils] ошибка при построении:", err);
          }
        },
      });
      button.style.cssText = cfg.btnStyles?.value;
      const mainControls = comment.querySelector(".main-controls");
      if (mainControls) mainControls.appendChild(button);
    });
    function CleanUP() {
      const container = document.querySelector(".graph");
      if (container) {
        container.querySelectorAll("svg").forEach((el) => el.remove());
      }

      document.querySelectorAll(".head.misc").forEach((el) => el.remove());
    }
    async function renderCommentTreeGraph() {
      if (!window.location.href.includes("/franchise")) return;
      if (localStorage.getItem("shikiDialogFromButton") !== "true") return;

      const stored = localStorage.getItem("ShikiUtils_CommTreeData");
      if (!stored) return;

      try {
        const data = JSON.parse(stored);
        localStorage.removeItem("ShikiUtils_CommTreeData");
        localStorage.removeItem("shikiDialogFromButton");

        CleanUP();
        const container = document.querySelector(".graph");

        const graph = new window.FranchiseGraph(data);
        setTimeout(() => graph.render_to(container), 2000);
      } catch (err) {
        console.error("[ShikiUtils] ошибка при отрисовке:", err);
      }
    }

    ready(() => {
      setTimeout(() => {
        renderCommentTreeGraph();
      }, 2000);
    });
  }

  //* %=================== User CSS Copy Btn ===================%
  async function UserCssCopyBtn() {
    const cfg = config.UserCssCopyBtn.settings;
    //todo совместимость с рип 
    document.querySelectorAll(".c-brief .avatar").forEach((avatar) => {
      let btnContainer = avatar.querySelector(".ShikiUtils-buttons"); //todo css в кфг
      if (!btnContainer) {
        btnContainer = document.createElement("div");
        btnContainer.className = "ShikiUtils-buttons";
        btnContainer.style.display = "flex";
        btnContainer.style.gap = "10px";
        btnContainer.style.alignItems = "center";
        btnContainer.style.marginTop = "5px";
        btnContainer.style.marginLeft = "5px";
        const profileActions = avatar.querySelector(".profile-actions");
        if (profileActions) {
          profileActions.parentNode.insertBefore(
            btnContainer,
            profileActions.nextSibling
          );
        } else {
          avatar.appendChild(btnContainer);
        }
      }

      if (btnContainer.querySelector(".copy-profile-css")) return;
      const profileHead = avatar.closest(".profile-head");
      if (!profileHead) return;

      const userId = profileHead.dataset.userId;
      if (!userId) return;

      const button = btnBuilder({
        tag: "a",
        classes: ["copy-profile-css", "b-tooltipped"],
        title: cfg.btnTitle?.value,
        dataset: { direction: "top" },
        styles: {},
        svgIcon: cfg.svgIcon?.value,
        onClick: async () => {
          try {
            const userResponse = await fetch(`https://shikimori.one/api/users/${userId}`);
            const userData = await userResponse.json();
            const styleId = userData.style_id;
            if (!styleId) throw new Error("no styleId");

            const styleResponse = await fetch(`https://shikimori.one/api/styles/${styleId}`);
            const styleData = await styleResponse.json();
            await navigator.clipboard.writeText(styleData.compiled_css);
          } catch (err) {
            console.error("[ShikiUtils]", err);
          }
        },
      });
      button.style.cssText = cfg.btnStyles?.value;
      btnContainer.appendChild(button);
    });
  }
  //* %=================== User Id Copy Btn ===================%
  function UserIdCopyBtn() {
    const cfg = config.UserIdCopyBtn.settings;
    document.querySelectorAll(".c-brief .avatar").forEach((avatar) => {
      let btnContainer = avatar.querySelector(".ShikiUtils-buttons");
      if (!btnContainer) {
        btnContainer = document.createElement("div");
        btnContainer.className = "ShikiUtils-buttons";
        btnContainer.style.display = "flex";
        btnContainer.style.gap = "5px";
        btnContainer.style.alignItems = "center";
        btnContainer.style.marginTop = "5px";

        const profileActions = avatar.querySelector(".profile-actions");
        if (profileActions) {
          profileActions.parentNode.insertBefore(btnContainer, profileActions.nextSibling);
        } else {
          avatar.appendChild(btnContainer);
        }
      }

      if (btnContainer.querySelector(".copy-profile-id")) return;

      const profileHead = avatar.closest(".profile-head");
      if (!profileHead) return;

      const userId = profileHead.dataset.userId;
      if (!userId) return;

      const button = btnBuilder({
        tag: "a",
        classes: ["copy-profile-id", "b-tooltipped"],
        title: "Скопировать ID",
        dataset: { direction: "top" },
        styles: {},
        svgIcon: cfg.svgIcon?.value,
        onClick: () =>
          navigator.clipboard
            .writeText(userId)
            .catch((err) => console.error("[ShikiUtils]", err)),
      });
      button.style.cssText = cfg.btnStyles?.value;
      btnContainer.appendChild(button);
    });
  }
  //* %=================== Image Id Copy Btn ===================%
  function ImageIdCopyBtn() {
    const cfg = config.ImageIdCopyBtn.settings;
    //todo совместимость с рип 
    document.querySelectorAll(".b-image").forEach((imageWrapper) => {
      if (imageWrapper.querySelector(".copy-image-id-button")) return;

      const imageData = imageWrapper.getAttribute("data-attrs");
      if (!imageData) return;

      try {
        const parsed = JSON.parse(imageData);
        const imageId = parsed.id;
        if (!imageId) return;
        const button = btnBuilder({
          tag: "span",
          classes: ["copy-image-id-button"],
          title: cfg.btnTitle?.value,
          styles: {},
          svgIcon: cfg.svgIcon?.value,
          onClick: (event) => {
            event.stopPropagation();
            event.preventDefault();
            return navigator.clipboard
              .writeText(`[image=${imageId}]`)
              .catch(console.error);
          },
        });
        button.style.cssText = cfg.btnStyles?.value;
        imageWrapper.style.position = "relative";
        imageWrapper.appendChild(button);
      } catch (err) {
        console.error("[ShikiUtils]", err);
      }
    });
  }
  //* %=================== Code Copy Btn ===================%
  function CopyCodeBtn() {
    const cfg = config.CopyCodeBtn.settings;
    document.querySelectorAll("pre.b-code-v2").forEach((pre) => {
      if (pre.querySelector(".copy-code-button")) return;
      const codeEl = pre.querySelector("code");
      if (!codeEl) return;
      try {
        const button = btnBuilder({
          tag: "span",
          classes: ["copy-code-button"],
          title: cfg.btnTitle?.value,
          styles: {},
          svgIcon: cfg.svgIcon?.value,
          onClick: (event) => {
            event.stopPropagation();
            event.preventDefault();

            return navigator.clipboard
              .writeText(codeEl.textContent.trim())
              .catch((err) => console.error("[ShikiUtils] CopyCodeBtn :", err));
          },
        });
        button.style.cssText = cfg.btnStyles?.value;
        pre.appendChild(button);
      } catch (err) {
        console.error("[ShikiUtils] CopyCodeBtn:", err);
      }
    });
  }

  //! %=================== Misc ====================%


  //* %=================== More Statistic ===================%

  async function MoreStatistic() {
    const cfg = config.MoreStatistic.settings;

    if (cfg.enableAvgScoreInList?.value) {
      const barBlock = document.querySelector(".bar.simple.horizontal");
      if (barBlock) {

        const head = document.querySelector(".scores .subheadline.m5");
        if (head && head.querySelector("[data-shikiutils='added']")) return;

        let sum = 0;
        let total = 0;

        barBlock.querySelectorAll(".line").forEach(line => {
          const score = parseInt(line.querySelector(".x_label")?.textContent);
          const bar = line.querySelector(".bar");
          const count = parseInt(bar?.getAttribute("title"));

          if (!isNaN(score) && !isNaN(count)) {
            sum += score * count;
            total += count;
          }
        });

        if (total > 0) {
          const avg = +(sum / total).toFixed(2);

          const head = document.querySelector(".scores .subheadline.m5");
          if (head) {
            head.textContent = cfg.avgScoreTemplate.value.replace("{avgscore}", avg);
            const marker = document.createElement("span");
            marker.dataset.shikiutils = "added";
            marker.style.display = "none";
            head.appendChild(marker);
          }
        }
      }
    }
    if (cfg.enableFriendsAvg?.value) { //todo выводить created_at  
      const userId = getUserId();
      if (!userId) return;
      const block = document.querySelector(".b-animes-menu .block");
      if (!block) return;
      let friendsList = [];
      if (cfg.friendsEpInfo?.value) {
        try {
          const friendsResp = await fetch(`/api/users/${userId}/friends?limit=100`);
          friendsList = await friendsResp.json();
        } catch (err) {
          console.error("[ShikiUtils] friendsResp:", err);
        }
      }

      const friendMap = new Map();
      friendsList.forEach(f => friendMap.set(f.nickname, f.id));

      document.querySelectorAll(".b-animes-menu .block").forEach(async (block) => {
        let subhead = block.querySelector(".subheadline.m5");
        if (!subhead) return;
        if (subhead.querySelector("[data-shikiutils='added']")) return;

        let rawScores = [];
        block.querySelectorAll(".friend-rate .status").forEach(status => {
          let m = status.textContent.match(/–\s*(\d+)/);
          if (m) rawScores.push(parseInt(m[1], 10));
        });

        if (rawScores.length) {
          const avg = (rawScores.reduce((a, b) => a + b, 0) / rawScores.length).toFixed(1);
          subhead.textContent = cfg.friendsAvgTemplate.value.replace("{avgscore}", avg);
        }

        const marker = document.createElement("span");
        marker.dataset.shikiutils = "added";
        marker.style.display = "none";
        subhead.appendChild(marker);

        if (!cfg.friendsEpInfo?.value || !friendsList.length) return;

        let targetType = "Anime";
        if (location.pathname.includes("/mangas/") || location.pathname.includes("/ranobe/")) {
          targetType = "Manga";
        }

        const statuses = ["Брошено", "Смотрю", "Отложено", "Пересматриваю", "Читаю", "Перечитываю", "Dropped", "Watching", "Rewatching", "On Hold", "Reading", "Rereading",];
        const friendLines = Array.from(block.querySelectorAll(".b-menu-line.friend-rate, .b-show_more-more .friend-rate"))
          .filter(line => {
            const st = line.querySelector(".status")?.textContent.trim();
            return statuses.some(s => st.startsWith(s));
          });

        if (!friendLines.length) return;

        const animeId = getId();
        if (!animeId) return;

        for (let line of friendLines) {
          const statusEl = line.querySelector(".status");
          const userEl = line.querySelector(".b-user16 a[title]");
          if (!statusEl || !userEl) continue;

          const nickname = userEl.getAttribute("title").trim();
          const friendId = friendMap.get(nickname);
          if (!friendId) continue;

          await delay(cfg.friendsApiDelay?.value);

          let userRates;
          try {
            const resp = await fetch(`https://shikimori.one/api/v2/user_rates?user_id=${friendId}&target_type=${targetType}`);
            userRates = await resp.json();
          } catch (err) {
            console.error("[ShikiUtils] user_rates err:", err);
            continue;
          }

          const rate = userRates.find(r => String(r.target_id) === String(animeId) && r.target_type === targetType);
          if (!rate) continue;

          let baseStatus = statusEl.textContent.split("–")[0].trim();
          let newStatus = baseStatus;

          if (rate.score) {
            newStatus += ` – ${rate.score}`;
          }

          if (targetType === "Anime") {
            const ep = rate.episodes;

            if (ep || (ep === 0 && cfg.showZeroEp?.value)) {
              newStatus += ` (${ep} эп.)`;
            }
          }

          if (targetType === "Manga") {
            const ch = rate.chapters;

            if (ch || (ch === 0 && cfg.showZeroEp?.value)) {
              newStatus += (` (${ch} гл.)`);
            }
          }

          statusEl.textContent = newStatus;
        }
      });
    }


    if (cfg.enableBanCount?.value) {
      if (window.location.pathname.endsWith("/moderation")) {

        const head = document.querySelector(".subheadline.m5");
        if (!head) return;

        if (head.querySelector("[data-shikiutils='added']")) return;

        const bans = document.querySelectorAll(".b-ban").length;

        head.textContent = cfg.banCountTemplate.value.replace("{count}", bans);

        const marker = document.createElement("span");
        marker.dataset.shikiutils = "added";
        marker.style.display = "none";
        head.appendChild(marker);
      }
    }
    if (cfg.enableWatchTime?.value) {
      if (!animPage()) return;

      try {
        function elementFinder(doc, ...keyTexts) {
          const lines = doc.querySelectorAll(".b-entry-info .line-container .line");
          for (let line of lines) {
            const key = line.querySelector(".key");
            if (!key) continue;

            const text = key.textContent.toLowerCase();

            for (const k of keyTexts) {
              if (text.includes(k.toLowerCase())) {
                return line.querySelector(".value");
              }
            }
          }
          return null;
        }

        function parseDur(durationText) {
          const txt = durationText.toLowerCase();

          const hoursMatch = /(\d+)\s*(?:час|hour)/.exec(txt);

          const minsMatch = /(\d+)\s*(?:мин|min)/.exec(txt);

          return (
            (hoursMatch ? parseInt(hoursMatch[1]) * 60 : 0) +
            (minsMatch ? parseInt(minsMatch[1]) : 0)
          );
        }

        function rotEbal(number, one, two, five) {
          const n1 = Math.abs(number) % 10;
          const n2 = Math.abs(number) % 100;
          if (n2 > 10 && n2 < 20) return five;
          if (n1 > 1 && n1 < 5) return two;
          if (n1 === 1) return one;
          return five;
        }

        function formatTime(totalMins) {
          const days = Math.floor(totalMins / 1440);
          const hours = Math.floor((totalMins % 1440) / 60);
          const mins = totalMins % 60;

          const dayText = rotEbal(days, "день", "дня", "дней");
          const hourText = rotEbal(hours, "час", "часа", "часов");
          const minText = rotEbal(mins, "минута", "минуты", "минут");

          const parts = [];
          if (days > 0) parts.push(`${days} ${dayText}`);
          if (hours > 0) parts.push(`${hours} ${hourText}`);
          if (mins > 0) parts.push(`${mins} ${minText}`);

          return parts.join(", ");
        }

        const episodesEl = elementFinder(document, "Эпизоды", "Episodes");
        const durationEl = elementFinder(document, "Длительность эпизода", "Episode duration");

        if (!episodesEl) return;

        const episodes = parseInt(episodesEl.textContent.trim());
        const durationText = durationEl ? durationEl.textContent.trim() : "0 мин";
        const durMins = parseDur(durationText);

        if (!episodes || !durMins) return;

        const totalTime = episodes * durMins;

        if (!document.querySelector(".time-block")) {
          const timeBlock = document.createElement("div");
          timeBlock.classList.add("line", "time-block");
          const text = cfg.watchTimeTemplate.value;

          timeBlock.innerHTML = `
        <div class="key">${text}</div>
        <div class="value"><span>${formatTime(totalTime)}</span></div>
      `;

          durationEl.parentNode.parentNode.appendChild(timeBlock);
        }

      } catch (err) {
        console.error("[ShikiUtils]", err);
      }
    }

  }
  //* %=================== Friends History ===================%
  //todo общая задержка перед появлением 
  function FriendsHistoryTooltip() {
    let tooltipElem = null;
    let hideTimeout = null;
    let fetchTimeout = null;
    const cache = new Map();
    let isTooltipHovered = false;

    function getTooltip() {
      if (!tooltipElem) { //todo cfg для тултипа
        tooltipElem = document.createElement("div");
        tooltipElem.className = "tooltip tooltip-left";
        tooltipElem.style.position = "absolute";
        tooltipElem.style.zIndex = "9999";
        tooltipElem.style.display = "none";
        tooltipElem.style.pointerEvents = "auto";
        tooltipElem.style.transition = "opacity 0.15s ease";
        tooltipElem.style.opacity = "0";
        tooltipElem.innerHTML = `
        <div class="tooltip-inner">
          <div class="tooltip-arrow"></div>
          <div class="clearfix">
            <div class="tooltip-details">
              <div class="b-catalog_entry-tooltip">Загрузка...</div>
            </div>
          </div>
        </div>
      `;

        tooltipElem.addEventListener("mouseenter", () => {
          isTooltipHovered = true;
          clearTimeout(hideTimeout);
        });

        tooltipElem.addEventListener("mouseleave", () => {
          isTooltipHovered = false;
          hideTooltipWithDelay();
        });

        document.body.appendChild(tooltipElem);
      }
      return tooltipElem;
    }

    function hideTooltipWithDelay() {
      clearTimeout(hideTimeout);
      hideTimeout = setTimeout(() => {
        if (!isTooltipHovered) {
          tooltipElem.style.opacity = "0";
          tooltipElem.style.display = "none";
        }
      }, 150); //todo v cfg
    }

    document.addEventListener(
      "mouseover",
      (e) => {
        const link = e.target.closest(".db-entry[data-tooltip-url]");
        if (!link) return;

        clearTimeout(hideTimeout);
        clearTimeout(fetchTimeout);

        const tooltipUrl = link.dataset.tooltipUrl;
        if (!tooltipUrl) return;

        const tooltip = getTooltip();
        tooltip.style.display = "block";
        tooltip.style.opacity = "0";
        tooltip.querySelector(".b-catalog_entry-tooltip").innerHTML = "Загрузка...";

        const mouseX = e.pageX;
        const mouseY = e.pageY;
        const offset = 20;
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const scrollY = window.scrollY;

        const isRightSide = mouseX < screenWidth / 2;
        tooltip.classList.remove("tooltip-left", "tooltip-right");
        tooltip.classList.add(isRightSide ? "tooltip-right" : "tooltip-left");

        const tooltipHeight = tooltip.offsetHeight || 200;
        const tooltipWidth = tooltip.offsetWidth || 300;
        const offsetY = 75;
        let topPos = mouseY - tooltipHeight / 2 - offsetY;
        let leftPos = isRightSide ? mouseX + offset : mouseX - tooltipWidth - offset;

        if (topPos < scrollY + 10) topPos = scrollY + 10;
        if (topPos + tooltipHeight > scrollY + screenHeight - 10) {
          topPos = scrollY + screenHeight - tooltipHeight - 10;
        }

        tooltip.style.top = `${topPos}px`;
        tooltip.style.left = `${Math.max(leftPos, 10)}px`;

        if (cache.has(tooltipUrl)) {
          tooltip.querySelector(".b-catalog_entry-tooltip").innerHTML = cache.get(tooltipUrl);
          tooltip.style.opacity = "1";
        } else {
          fetchTimeout = setTimeout(async () => {
            try {
              const resp = await fetch(`${tooltipUrl}/tooltip`);
              const html = await resp.text();

              const tmp = document.createElement("div");
              tmp.innerHTML = html;
              const inner = tmp.querySelector(".b-catalog_entry-tooltip");
              const innerHTML = inner ? inner.innerHTML : "Ошибка загрузки";
              cache.set(tooltipUrl, innerHTML);
              tooltip.querySelector(".b-catalog_entry-tooltip").innerHTML = innerHTML;
            } catch (err) {
              console.error("[ShikiUtils] Tooltip load error:", err);
              tooltip.querySelector(".b-catalog_entry-tooltip").innerHTML = "Ошибка загрузки.";
            }
            tooltip.style.opacity = "1";
          }, 200); //todo v cfg
        }

        link.addEventListener(
          "mouseleave",
          () => {
            clearTimeout(fetchTimeout);
            hideTooltipWithDelay();
          },
          { once: true }
        );
      },
      true
    );
  }
  //todo совместимость с рип 
  async function FriendsHistory() { //todo выбор друзей + логика для 100+ друзей
    const profileBlock = document.querySelector(".block.is-own-profile");
    if (!profileBlock || !location.pathname.endsWith("/friends")) return;

    const username = getUsername();
    const userId = getUserId();
    console.log("[ShikiUtils] FriendsHistory: username =", username, "userId =", userId);
    if (!username || !userId) return;
    FriendsHistoryTooltip();
    const friendsResp = await fetch(`/api/users/${userId}/friends?limit=100`);
    if (!friendsResp.ok) return;
    const friends = await friendsResp.json();
    if (!friends.length) return;

    const headline = document.createElement("h2");
    headline.className = "subheadline";
    headline.textContent = "История друзей"; //todo v cfg
    profileBlock.appendChild(headline);

    const historyContainer = document.createElement("div");
    historyContainer.className = "history-container";
    profileBlock.appendChild(historyContainer);

    const progressElem = document.createElement("div");
    progressElem.style.margin = "5px 0";
    progressElem.textContent = `Загружено 0 / ${friends.length} друзей...`; //todo v cfg
    profileBlock.insertBefore(progressElem, historyContainer);

    const delay = (ms) => new Promise((r) => setTimeout(r, ms));

    function timeAgo(date) {
      const diffSec = Math.floor((new Date() - date) / 1000);

      const declension = (num, words) => {
        num = Math.abs(num) % 100;
        const n1 = num % 10;
        if (num > 10 && num < 20) return words[2];
        if (n1 > 1 && n1 < 5) return words[1];
        if (n1 === 1) return words[0];
        return words[2];
      };

      if (diffSec < 60) {
        return "несколько секунд назад";
      }

      const minutes = Math.floor(diffSec / 60);
      if (minutes < 60) {
        return `${minutes} ${declension(minutes, ["минуту", "минуты", "минут",])} назад`;
      }

      const hours = Math.floor(diffSec / 3600);
      if (hours < 24) {
        return `${hours} ${declension(hours, ["час", "часа", "часов"])} назад`;
      }

      const days = Math.floor(diffSec / 86400);
      if (days < 7) {
        return `${days} ${declension(days, ["день", "дня", "дней"])} назад`;
      }

      const weeks = Math.floor(days / 7);
      if (weeks < 5) {
        return `${weeks} ${declension(weeks, ["неделю", "недели", "недель",])} назад`;
      }

      const months = Math.floor(days / 30.44);
      if (months < 12) {
        return `${months} ${declension(months, ["месяц", "месяца", "месяцев",])} назад`;
      }

      const years = Math.floor(days / 365.25);
      return `${years} ${declension(years, ["год", "года", "лет"])} назад`;
    }

    function getTimeCategory(date) {
      const now = new Date();
      const diffMs = now - date;
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays === 0) return "сегодня";
      if (diffDays === 1) return "вчера";
      if (diffDays <= 7) return "в течение недели";

      const weeks = Math.floor(diffDays / 7);
      if (weeks === 1) return "неделю назад";
      if (weeks === 2) return "две недели назад";
      if (weeks === 3) return "три недели назад";
      if (weeks === 4) return "четыре недели назад";

      const months = Math.floor(diffDays / 30.44);
      if (months < 12) {
        const word = months === 1 ? "месяц" : months >= 2 && months <= 4 ? "месяца" : "месяцев";
        return `${months} ${word} назад`;
      }

      const years = Math.floor(diffDays / 365.25);
      const word = years === 1 ? "год" : years >= 2 && years <= 4 ? "года" : "лет";
      return `${years} ${word} назад`;
    }

    const allEntries = [];
    const categories = {};

    let loadedCount = 0;

    for (const friend of friends) {
      try {
        const resp = await fetch(`/api/users/${friend.id}/history?limit=${config.FriendsHistory.settings.apilimit.value}`);
        if (!resp.ok) continue;

        let history;
        try {
          history = await resp.json();
        } catch {
          console.warn(`[ShikiUtils] ${friend.nickname} 1488 `);
          continue;
        }
        if (!Array.isArray(history)) continue;

        history.forEach((entry) => {
          const createdAt = new Date(entry.created_at);
          if (isNaN(createdAt)) return;
          allEntries.push({ friend, entry, createdAt });
        });

        allEntries.sort((a, b) => b.createdAt - a.createdAt);

        historyContainer.innerHTML = "";
        for (const key in categories) delete categories[key];

        allEntries.forEach(({ friend, entry, createdAt }) => {
          const label = getTimeCategory(createdAt);
          if (!categories[label]) {
            const dayHeader = document.createElement("div");
            dayHeader.className = "mischeadline";
            dayHeader.textContent = label;
            historyContainer.appendChild(dayHeader);
            categories[label] = dayHeader;
          }

          const line = document.createElement("div");
          line.className = "b-user_history-line";
          line.dataset.id = entry.id;

          const avatar = friend.image?.x48 || "";

          const targetNameEn = entry.target?.name || "—";
          const targetNameRu = entry.target?.russian?.trim() || "";
          const targetUrl = entry.target?.url || "#";

          let targetHTML = "";
          if (entry.target) {
            if (targetNameRu) {
              targetHTML = `
      <a class="db-entry bubbled-processed" href="${targetUrl}" data-tooltip-url="${targetUrl}">
        <span class="name-en">${targetNameEn}</span>
        <span class="name-ru">${targetNameRu}</span>
      </a>`;
            } else {
              targetHTML = `<a class="db-entry bubbled-processed" href="${targetUrl}" data-tooltip-url="${targetUrl}">${targetNameEn}</a>`;
            }
          }

          line.innerHTML = `
  <strong style="margin-right:5px;"><a href="https://shikimori.one/${friend.nickname}">${friend.nickname}</a>:</strong>
  <a class="id" href="https://shikimori.one/${friend.nickname}/history/${entry.id}">#</a>
  <span>
      ${targetHTML}
      &nbsp;${entry.description.replace(/Просмотрено и оценено/, "просмотрено и оценено")}
  </span>
  <time class="date" datetime="${createdAt.toISOString()}" title="${createdAt.toLocaleString()}">
      ${timeAgo(createdAt)}
  </time>
`;

          const wrapper = document.createElement("div");
          wrapper.style.display = "flex"; //todo css v cfg
          wrapper.style.alignItems = "center";
          wrapper.style.gap = "8px";
          wrapper.style.marginBottom = "8px";

          const avatarElem = document.createElement("a");
          avatarElem.href = `https://shikimori.one/${friend.nickname}`;
          avatarElem.title = friend.nickname;
          avatarElem.style.marginRight = "8px";
          avatarElem.style.flexShrink = "0";
          avatarElem.innerHTML = `<img src="${avatar}" alt="${friend.nickname}" style="width:24px;height:24px;border-radius:50%;">`;

          line.style.lineHeight = "1.3";
          line.style.wordBreak = "break-word";
          wrapper.appendChild(avatarElem);

          const content = document.createElement("div");
          content.style.flex = "1";

          content.appendChild(line);

          wrapper.appendChild(content);

          historyContainer.appendChild(wrapper);
        });

        loadedCount++;
        progressElem.textContent = `Загружено ${loadedCount} / ${friends.length} друзей...`;

        await delay(config.FriendsHistory.settings.delay.value);
      } catch (err) {
        console.error(`[ShikiUtils] FriendsHistory: ${friend.nickname}:`, err);
      }
    }

    progressElem.textContent = `Загрузка завершена. Загружено ${loadedCount} / ${friends.length}`;
  }

  //* %=================== Shiki Rating ====================%
  function ShikiScore() {
    const cfg = config.ShikiScore.settings;

    const statsEl = document.querySelector("#rates_scores_stats");
    if (!statsEl) return;

    let stats;
    try {
      stats = JSON.parse(statsEl.dataset.stats);
    } catch (err) {
      console.error("[ShikiUtils] rates_scores_stats err:", err);
      return;
    }
    if (!Array.isArray(stats) || stats.length === 0) return;

    let total = 0, sum = 0;
    const scoreCounts = {};

    for (const [s, c] of stats) {
      const score = +s, count = +c;
      if (!isNaN(score) && !isNaN(count)) {
        total += count;
        sum += score * count;
        scoreCounts[`score${score}`] = count;
      }
    }
    if (!total) return;

    const safePars = el =>
      el ? parseInt(el.textContent.replace(/\D+/g, ""), 10) || 0 : 0;

    const statusesEl = document.querySelector("#rates_statuses_stats");
    let completed = 0, planned = 0, watching = 0, dropped = 0, on_hold = 0, totalListed = 0;
    if (statusesEl) {
      try {
        const st = JSON.parse(statusesEl.dataset.stats);
        for (const [status, count] of st) {
          switch (status) {
            case "completed": completed = +count; break;
            case "planned": planned = +count; break;
            case "watching": watching = +count; break;
            case "dropped": dropped = +count; break;
            case "on_hold": on_hold = +count; break;
          }
        }
        totalListed = completed + planned + watching + dropped + on_hold;
      } catch (err) {
        console.warn("[ShikiUtils] rates_statuses_stats err:", err);
      }
    }

    if (cfg.showTotalRates?.value) {
      const statsEl = document.querySelector("#rates_scores_stats");
      if (statsEl && !statsEl.querySelector('[data-shiki-total="true"]')) {
        const totalEl = document.createElement("div");
        totalEl.dataset.shikiTotal = "true";
        totalEl.className = "total-rates";
        totalEl.textContent = `Всего оценок: ${total}`;
        setTimeout(() => statsEl.appendChild(totalEl), 1000);
      }
    }

    const favourites = safePars(document.querySelector(".b-favoured .count"));
    const reviewsNav = document.querySelector(".b-reviews_navigation, .navigation-container");
    let reviewsAll = 0, reviewsPos = 0, reviewsNeu = 0, reviewsNeg = 0;
    if (reviewsNav) {
      reviewsAll = safePars(reviewsNav.querySelector(".navigation-node-all .count"));
      reviewsPos = safePars(reviewsNav.querySelector(".navigation-node-positive .count"));
      reviewsNeu = safePars(reviewsNav.querySelector(".navigation-node-neutral .count"));
      reviewsNeg = safePars(reviewsNav.querySelector(".navigation-node-negative .count"));
    }

    const comments = safePars(document.querySelector('.subheadline a[title="Все комментарии"] .count'));

    if (cfg.debug?.value) {
      console.group("[ShikiScore Debug]");
      console.log({ sum, total, completed, planned, watching, dropped, on_hold, totalListed, favourites, reviewsAll, reviewsPos, reviewsNeu, reviewsNeg, comments });
      console.groupCollapsed("scoreCounts");
      console.log(scoreCounts);
      console.groupEnd();
      console.log("Formula:", cfg.customFormula?.value);
      console.groupEnd();
    }

    let avg = null;
    try {
      if (cfg.customFormula?.value?.trim()) {
        const fn = new Function(
          "sum", "total",
          "completed", "planned", "watching", "dropped", "on_hold", "totalListed",
          "favourites",
          "reviewsAll", "reviewsPos", "reviewsNeu", "reviewsNeg",
          "comments",
          "scores",
          "return " + cfg.customFormula?.value
        );
        avg = Number(
          fn(
            sum, total,
            completed, planned, watching, dropped, on_hold, totalListed,
            favourites,
            reviewsAll, reviewsPos, reviewsNeu, reviewsNeg,
            comments,
            scoreCounts
          )
        );
        if (isNaN(avg)) throw new Error("NaN");
        avg = +avg.toFixed(2);
      } else {
        avg = +(sum / total).toFixed(2);
      }
    } catch (err) {
      console.error("[ShikiUtils] oшибка в формуле:", err);
      avg = "N/A";
    }

    const scoreBlock = document.querySelector(".scores");
    if (!scoreBlock) return;

    scoreBlock.querySelector(".score.MAL-label")?.remove();
    if (cfg.originalLabel?.value?.trim()) {
      const orig = scoreBlock.querySelector(".b-rate");
      if (orig) {
        const label = document.createElement("p");
        label.className = "score MAL-label";
        label.style = cfg.originalScoreStyles?.value;
        label.textContent = cfg.originalLabel?.value;
        orig.insertAdjacentElement("afterend", label);
      }
    }
    if (cfg.showShikiScore?.value) {
      const notice = avg === "N/A" ? "Ошибка в формуле" : scoreText(avg);
      const scoreClass = avg === "N/A" ? "score-error" : `score-${Math.round(avg)}`;
      const ShimoriDisplayMode = cfg.ShimoriDisplayMode?.value;

      if (ShimoriDisplayMode === "stars") {
        scoreBlock.querySelector(".b-rate.shiki-average-score")?.remove();
        scoreBlock.querySelector(".score.shiki-label")?.remove();

        const customRate = document.createElement("div");
        customRate.className = "b-rate shiki-average-score";
        customRate.innerHTML = `
        <div class="stars-container">
          <div class="hoverable-trigger"></div>
          <div class="stars score ${scoreClass}"></div>
          <div class="stars hover"></div>
          <div class="stars background"></div>
        </div>
        <div class="text-score">
          <div class="score-value ${scoreClass}">${avg}</div>
          <div class="score-notice">${notice}</div>
        </div>
      `;

        const customLabel = document.createElement("p");
        customLabel.className = "score shiki-label";
        customLabel.style = cfg.originalScoreStyles?.value;
        customLabel.textContent = cfg.customFormulaLabel?.value;

        scoreBlock.append(customRate);
        scoreBlock.append(customLabel);
      } else if (ShimoriDisplayMode === "headline") {
        const subheadlines = document.querySelectorAll(".block .subheadline");
        let targetSubheadline = null;
        for (const el of subheadlines) {
          if (el.textContent.trim().includes("Оценки людей")) {
            targetSubheadline = el;
            break;
          }
        }
        if (!targetSubheadline) return;
        if (targetSubheadline.querySelector('[data-shiki-score="true"]')) return;

        const span = document.createElement("span");
        span.className = "shiki-headline-score";
        span.dataset.shikiScore = "true";
        span.style = cfg.headlineScoreStyles?.value;
        span.textContent = avg === "N/A" ? " | N/A" : ` | ${avg}`;
        targetSubheadline.appendChild(span);
      }
    }
    if (cfg.showAniListScore?.value) { //todo кэширование
      const originalTitle = getOriginalTitle();
      if (!originalTitle) return;

      const path = window.location.pathname;
      let mediaType = "ANIME";
      let sourceFilter = "";

      if (path.includes("/mangas/")) {
        mediaType = "MANGA";
      } else if (path.includes("/ranobe/")) {
        mediaType = "MANGA";
        sourceFilter = 'source_in: [LIGHT_NOVEL],';
      }

      const query = `
    query ($search: String) {
      Media(search: $search, type: ${mediaType}, ${sourceFilter}) {
        averageScore
      }
    }`;
      const variables = { search: originalTitle };

      fetch("https://graphql.anilist.co", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables })
      })
        .then(res => res.json())
        .then(data => {
          let aniScore = data?.data?.Media?.averageScore;
          if (!aniScore) return;

          let scoreVal;
          try {
            if (cfg.AniListCustomFormula?.value?.trim()) {
              const fn = new Function("averageScore", "return " + cfg.AniListCustomFormula.value);
              scoreVal = Number(fn(aniScore));
              scoreVal = +scoreVal.toFixed(2);
            } else {
              scoreVal = +(aniScore / 10).toFixed(2);
            }
          } catch (err) {
            console.error("[ShikiUtils] Ошибка в формуле AniList:", err);
            scoreVal = "N/A";
          }

          const scoreClass = scoreVal === "N/A" ? "score-error" : `score-${Math.round(scoreVal)}`;
          const labelText = cfg.AniListCustomFormulaLabel?.value || "Оценка AniList";

          if (cfg.AniListDisplayMode?.value === "stars") {
            scoreBlock.querySelector(".b-rate.anilist-average-score")?.remove();
            scoreBlock.querySelector(".score.anilist-label")?.remove();

            const aniRate = document.createElement("div");
            aniRate.className = "b-rate anilist-average-score";
            aniRate.innerHTML = `
          <div class="stars-container">
            <div class="hoverable-trigger"></div>
            <div class="stars score ${scoreClass}"></div>
            <div class="stars hover"></div>
            <div class="stars background"></div>
          </div>
          <div class="text-score">
            <div class="score-value ${scoreClass}">${scoreVal}</div>
            <div class="score-notice">${scoreVal === "N/A" ? "Ошибка в формуле" : scoreText(scoreVal)}</div>
          </div>
        `;

            const aniLabel = document.createElement("p");
            aniLabel.className = "score anilist-label";
            aniLabel.style = cfg.originalScoreStyles?.value;
            aniLabel.textContent = labelText;

            scoreBlock.append(aniRate);
            scoreBlock.append(aniLabel);
          } else { //* хедлайн 
            const subheadlines = document.querySelectorAll(".block .subheadline");
            let targetSubheadline = null;
            for (const el of subheadlines) {
              if (el.textContent.trim().includes("Оценки людей")) {
                targetSubheadline = el;
                break;
              }
            }
            if (!targetSubheadline) return;
            if (targetSubheadline.querySelector('[data-anilist-score="true"]')) return;

            const span = document.createElement("span");
            span.className = "anilist-headline-score";
            span.dataset.anilistScore = "true";
            span.style = cfg.headlineScoreStyles?.value;
            span.textContent = ` | ${scoreVal}`;
            targetSubheadline.appendChild(span);
          }
        })
        .catch(err => console.error("[ShikiUtils] anilist fetch err:", err));
    }

  }

  function scoreText(score) { //todo v cfg
    score = Math.floor(score);
    if (score <= 1) return "Хуже некуда";
    if (score <= 2) return "Ужасно";
    if (score <= 3) return "Очень плохо";
    if (score <= 4) return "Плохо";
    if (score <= 5) return "Более-менее";
    if (score <= 6) return "Нормально";
    if (score <= 7) return "Хорошо";
    if (score <= 8) return "Отлично";
    if (score <= 9) return "Великолепно";
    return "Эпик вин!";
  }


  //* %=================== Auto Spoiler ====================%
  function autoSpoiler() {
    const mode = config.autoSpoiler.settings.mode.value;

    function spoiler(images) {
      const spoilerDiv = document.createElement("div");
      spoilerDiv.className = "b-spoiler_block";
      spoilerDiv.dataset.dynamic = "spoiler_block";

      const spoilerText = document.createElement("span");
      spoilerText.tabIndex = 0;
      spoilerText.textContent = config.autoSpoiler.settings.template.value;
      spoilerText.addEventListener("click", () =>
        spoilerDiv.classList.toggle("is-opened")
      );

      const imagesContainer = document.createElement("div");
      images.forEach((img) => imagesContainer.appendChild(img));

      spoilerDiv.append(spoilerText, imagesContainer);
      return spoilerDiv;
    }

    function group(comment) {
      const body = comment.querySelector(".body");
      if (!body) return;

      let images = [];
      Array.from(body.childNodes).forEach((node) => {
        if (
          node.nodeType === Node.ELEMENT_NODE &&
          node.classList.contains("b-image")
        ) {
          const img = node.querySelector("img");
          if (!img) return;

          if (mode === "blur") { //todo mouseenter event 
            img.classList.add("b-blur", "is-moderation_censored");
          } else if (mode === "spoiler") {
            images.push(node);
          }
        } else if (images.length > 0 && mode === "spoiler") {
          body.insertBefore(spoiler(images), node);
          images = [];
        }
      });

      if (images.length > 0 && mode === "spoiler") {
        body.appendChild(spoiler(images));
      }
    }

    function processComments() {
      document.querySelectorAll(".b-comment").forEach(group);
    }

    processComments();
  }

  //* %=================== remove Blur ====================%
  function removeBlur() {
    const censoredImages = document.querySelectorAll("img.is-moderation_censored");

    censoredImages.forEach((img) => {
      img.classList.remove("is-moderation_censored");
    });
  }
  //* %=================== NoAge Limits ====================%
  function NoAgeLimits() {
    const birthSelect = document.querySelector(".c-column.block_m .block select#user_birth_on_1i");
    if (!birthSelect) return;
    const selectedYear = birthSelect.value;
    let maxYear = 0;
    let minYear = Infinity;
    birthSelect.querySelectorAll("option").forEach((option) => {
      const year = parseInt(option.value, 10);
      if (!isNaN(year)) {
        if (year > maxYear) maxYear = year;
        if (year < minYear) minYear = year;
      }
    });

    birthSelect.innerHTML = "";

    for (let year = maxYear; year >= 1; year--) {
      const option = document.createElement("option");
      option.value = year;
      option.textContent = year;
      if (year == selectedYear) {
        option.selected = true;
      }
      birthSelect.appendChild(option);
    }
  }
  //* %=================== Auto Loader ====================% 
  //todo recode 🥲  
  let isLoading = false;
  let currentPage = 15;
  let currentUrl = "";

  function updatePagination() {
    const currentSpans = document.querySelectorAll(".pagination .link-current");
    if (currentSpans.length > 0) {
      currentSpans.forEach((span) => {
        span.textContent = `1-${currentPage + 1}`;
      });
    }
  }
  function loadNextPage() {
    if (isLoading) return;

    const nextButton = document.querySelector(".b-postloader.collapsed a.next");
    if (!nextButton) return;

    if (currentUrl && currentUrl !== nextButton.href) {
      currentPage = 15;
    }
    currentUrl = nextButton.href;
    const urlObj = new URL(nextButton.href);
    urlObj.pathname = urlObj.pathname.replace(/\/page\/\d+/, `/page/${currentPage + 1}.json`);
    let nextPageUrl = urlObj.toString();

    console.debug("[ShikiUtils]Loading next page: ", nextPageUrl);
    isLoading = true;

    GM_xmlhttpRequest({
      method: "GET",
      url: nextPageUrl,
      headers: {
        Accept: "application/json, text/plain, */*",
        "X-Requested-With": "XMLHttpRequest",
      },
      onload: function (response) {
        if (response.status === 200) {
          try {
            const data = JSON.parse(response.responseText);
            if (data.content) {
              const tempContainer = document.createElement("div");
              tempContainer.innerHTML = data.content;
              const entries = tempContainer.querySelectorAll(".cc-entries article");
              appendNewContent(entries);
              updatePagination();
              currentPage++;
            }
          } catch (err) {
            console.error("[ShikiUtils]", err);
          }
        } else {
          console.error("[ShikiUtils]", response.status);
        }
        isLoading = false;
      },
      onerror: function (error) {
        console.error("[ShikiUtils]", error);
        isLoading = false;
      },
    });
  }
  function appendNewContent(entries) {
    const containers = document.querySelectorAll(".cc-entries");
    if (containers.length === 0) return;
    const container = containers[containers.length - 1];
    const existingIds = new Set([...container.querySelectorAll("article")].map((el) => el.id));
    entries.forEach((entry) => {
      if (!existingIds.has(entry.id)) {
        container.appendChild(entry);
      }
    });
  }
  function checkScroll() {
    const nextButton = document.querySelector(".b-postloader.collapsed a.next");
    if (!nextButton || !nextButton.href.match(/\/page\/16(\?|$)/)) return;

    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 300) {
      loadNextPage();
    }
  }
  //* %=================== Сomments Loader ====================%
  function commentsLoader() { //todo добавить настройки
    const loaders = document.querySelectorAll(".comments-loader");
    if (!loaders.length) return;

    const storageKey = "comments-loader-count";
    const defaultValue = 20;
    const savedValue = parseInt(localStorage.getItem(storageKey)) || defaultValue;

    loaders.forEach((loader) => {
      if (loader.dataset.inputDisabled === "true") return;
      if (loader.querySelector("input.comments-loader-input")) return;

      const text = loader.textContent.trim();
      const match = text.match(/Загрузить ещё\s+(\d+)\s+из\s+(\d+)/);
      if (!match) return;

      const [, , totalCount] = match;

      const input = document.createElement("input");
      input.type = "number";
      input.min = 1;
      input.value = savedValue;
      input.style.width = "50px"; //todo css v cfg
      input.style.margin = "0 5px";
      input.classList.add("comments-loader-input");

      loader.textContent = "";
      const beforeText = document.createElement("span");
      beforeText.textContent = "Загрузить ещё ";
      const afterText = document.createElement("span");
      afterText.textContent = ` из ${totalCount} комментариев`;

      loader.appendChild(beforeText);
      loader.appendChild(input);
      loader.appendChild(afterText);

      input.addEventListener("click", (e) => e.stopPropagation());
      input.addEventListener("keydown", (e) => e.stopPropagation());

      const updateUrl = (value) => {
        const url = loader.getAttribute("data-clickloaded-url-template"); //? 
        if (!url) return;
        const newUrl = url.replace(/SKIP\/\d+/, `SKIP/${value}`);
        loader.setAttribute("data-clickloaded-url-template", newUrl);
        loader.setAttribute("data-limit", value);
      };

      updateUrl(savedValue);

      input.addEventListener("change", () => {
        const val = parseInt(input.value);
        if (isNaN(val) || val <= 0) return;
        localStorage.setItem(storageKey, val);
        updateUrl(val);
      });

      loader.addEventListener("click", () => {
        if (input.parentNode) input.remove();
        loader.dataset.inputDisabled = "true";
      });
    });
  }
  //* %=================== PGPModule ====================%

  function PGPModule() { //todo кликабельные ссылки
    const cfg = config.PGPModule.settings;

    async function readKey(armored, type = "public") {
      if (!armored?.trim()) throw new Error(`Empty ${type} key`);
      return type === "public" ? await openpgp.readKey({ armoredKey: armored }) : await openpgp.readPrivateKey({ armoredKey: armored });
    }

    async function encryptMessage(plaintext, keysArmoredArray) {
      if (!plaintext) throw new Error("Empty plaintext");
      if (!keysArmoredArray?.length) throw new Error("No keys provided");

      const pubKeys = await Promise.all(keysArmoredArray.map(k => readKey(k, "public")));
      const message = await openpgp.createMessage({ text: plaintext });
      return await openpgp.encrypt({ message, encryptionKeys: pubKeys, format: "armored" });
    }

    async function decryptMessage(armoredMessage, armoredPriv, passphrase) {
      if (!armoredMessage.includes("-----BEGIN PGP MESSAGE-----")) { throw new Error("No PGP block"); }

      let privKey = await readKey(armoredPriv, "private");
      if (!privKey.isDecrypted() && passphrase) {
        privKey = await openpgp.decryptKey({ privateKey: privKey, passphrase });
      }

      const message = await openpgp.readMessage({ armoredMessage });
      const { data } = await openpgp.decrypt({ message, decryptionKeys: privKey });
      return data;
    }

    function getEditorState() {
      const ta = document.querySelector(".editor-container textarea");
      if (ta) return { type: "textarea", el: ta, text: ta.value };
      const pm = document.querySelector(".editor-container .ProseMirror");
      if (pm) return { type: "prosemirror", el: pm, text: pm.innerText || pm.textContent };
      return { type: "none", text: "" };
    }

    function getEditorText() {
      const state = getEditorState();
      return state.text?.trim() || "";
    }

    function insertText(state, text) {
      if (!text) return;
      if (state.type === "textarea") {
        const ta = state.el;
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        ta.value = start !== end ? ta.value.slice(0, start) + text + ta.value.slice(end) : text;
        ta.setSelectionRange(start, start + text.length);
        ta.dispatchEvent(new Event("input", { bubbles: true }));
      } else if (state.type === "prosemirror") {
        const editor = state.el;
        const sel = window.getSelection();
        const hasSelection = sel?.rangeCount > 0 && !sel.isCollapsed;
        const lines = text.split("\n");

        if (hasSelection) {
          const range = sel.getRangeAt(0);
          range.deleteContents();
          for (let i = lines.length - 1; i >= 0; i--) {
            if (i !== lines.length - 1) range.insertNode(document.createElement("br"));
            range.insertNode(document.createTextNode(lines[i]));
          }
        } else {
          const p = editor.querySelector("p:last-child") || editor.appendChild(document.createElement("p"));
          p.innerHTML = "";
          const frag = document.createDocumentFragment();
          for (let i = lines.length - 1; i >= 0; i--) {
            frag.prepend(document.createTextNode(lines[i]));
            if (i !== 0) frag.prepend(document.createElement("br"));
          }
          p.appendChild(frag);
        }

        if (!editor.querySelector(".ProseMirror-trailingBreak")) {
          const br = document.createElement("br");
          br.classList.add("ProseMirror-trailingBreak");
          editor.appendChild(br);
        }

        editor.dispatchEvent(new Event("input", { bubbles: true }));
      }
    }

    function getEncryptionKeys() {
      if (cfg.SharedMode?.value) return [SHARED_KEYS.pub];
      const recipients = cfg.PubKeyRecipient?.value || [];
      let keys = recipients.map(r => r.key);
      if (cfg.EncryptForMyself?.value && cfg.PubKeySelf?.value?.trim()) {
        keys.push(cfg.PubKeySelf.value.trim());
      }
      return keys;
    }

    function submitInterceptor() {
      const btn = document.querySelector('input[type="submit"].btn-submit, button.btn-submit');
      if (!btn || btn.dataset.pgpIntercept) return;
      btn.dataset.pgpIntercept = "1";

      let processing = false;
      let skipNext = false;

      btn.addEventListener("click", async (e) => {
        try {
          if (skipNext) { skipNext = false; return; }
          if (processing) { e.preventDefault(); e.stopImmediatePropagation(); return; }
          if (!cfg.AutoEncryptOnType?.value) return;

          const plain = getEditorText();
          if (!plain) return;

          const keys = getEncryptionKeys();
          if (!keys.length) return;

          e.preventDefault();
          e.stopImmediatePropagation();
          processing = true;

          let armored;
          try { armored = await encryptMessage(plain, keys); }
          catch (err) { console.error(err); alert("Ошибка шифрования"); processing = false; return; }

          const hidden = document.querySelector('input[name="comment[body]"], input[name="message[body]"]');
          if (!hidden) return;
          hidden.value = armored;

          insertText(getEditorState(), armored);

          skipNext = true;
          setTimeout(() => {
            try { btn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window })); }
            catch { btn.click(); }
            finally { setTimeout(() => { processing = false; }, 1000); }
          }, 8);

        } catch (err) {
          console.error(err);
          processing = false;
          skipNext = false;
        }
      }, true);
    }

    function addEncryptButton() {
      if (cfg.AutoEncryptOnType?.value) return;

      const createButton = () => {
        const btn = document.createElement("button");
        btn.id = "encrypt-btn";
        btn.type = "button";
        btn.classList.add("icon", "icon-pgp-encrypt");
        btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" style="fill:currentColor;">
        <path d="M12 1C9.24 1 7 3.24 7 6V10H6C4.9 10 4 10.9 4 12V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V12C20 10.9 19.1 10 18 10H17V6C17 3.24 14.76 1 12 1M12 3C13.66 3 15 4.34 15 6V10H9V6C9 4.34 10.34 3 12 3Z"/>
      </svg>`;

        Object.assign(btn.style, { //todo v cfg
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          height: "19px",
          width: "27px",
          padding: "0 4px",
          color: "var(--link-color)",
          transition: "color .15s ease"
        });

        btn.addEventListener("mouseenter", () => btn.style.color = 'var(--link-hover-color)');
        btn.addEventListener("mouseleave", () => btn.style.color = 'var(--link-color)');

        btn.addEventListener("click", async (e) => {
          e.preventDefault();
          e.stopPropagation();

          const state = getEditorState();
          if (!state.text.trim()) return;

          let textToEncrypt = "";
          if (state.type === "textarea") {
            const ta = state.el;
            const start = ta.selectionStart;
            const end = ta.selectionEnd;
            textToEncrypt = start !== end ? ta.value.slice(start, end) : ta.value;
          } else if (state.type === "prosemirror") {
            const sel = window.getSelection();
            textToEncrypt = sel && sel.toString().trim() ? sel.toString() : state.text;
          }

          if (!textToEncrypt.trim()) return;

          const keys = getEncryptionKeys();
          if (!keys.length) { alert("нет получателей для шифрования"); return; }

          let armored;
          try { armored = await encryptMessage(textToEncrypt, keys); }
          catch (err) { console.error(err); alert("ошибка шифрования"); return; }

          insertText(state, armored);
        });

        return btn;
      };

      const tryAddButton = () => {
        const menu = document.querySelector(".menu_group-block");
        if (menu && !menu.querySelector("#encrypt-btn")) { menu.appendChild(createButton()); return true; }
        return false;
      };

      if (tryAddButton()) return;

      const observer = new MutationObserver((mut, obs) => { if (tryAddButton()) obs.disconnect(); });
      observer.observe(document.body, { childList: true, subtree: true });
    }

    async function decryptAllComments() {
      const priv = cfg.SharedMode?.value ? SHARED_KEYS.priv : cfg.PrivKeySelf?.value?.trim();
      if (!priv) return;
      const pass = cfg.KeyPassphrase?.value;

      const bodies = Array.from(document.querySelectorAll('.b-comment .body, .body[itemprop="text"], .b-message .body'));

      for (const body of bodies) {
        if (body.dataset.pgpAttempted) continue;
        body.dataset.pgpAttempted = "1";

        let decryptedAny = false;

        async function processNode(node) {
          if (!node) return;

          if (node.nodeType === Node.TEXT_NODE) {
            return;
          }

          const children = Array.from(node.childNodes);
          let buffer = [];
          let insidePGP = false;

          for (const child of children) {
            const text = child.textContent || "";

            if (text.includes("-----BEGIN PGP MESSAGE-----")) insidePGP = true;

            if (insidePGP) buffer.push(child);

            if (text.includes("-----END PGP MESSAGE-----")) {
              const pgpText = buffer.map(n => {
                if (n.nodeName === "BR") return "\n";
                return n.textContent;
              }).join("");

              try {
                const plain = await decryptMessage(pgpText, priv, pass);
                const parent = buffer[0].parentNode;
                const firstNode = buffer[0];

                const textNode = document.createTextNode(plain);
                parent.insertBefore(textNode, firstNode);
                for (const n of buffer) parent.removeChild(n);

                decryptedAny = true;
              } catch {
                node.dataset.pgpDecryptFailed = "1";
              }

              buffer = [];
              insidePGP = false;
            }

            if (child.nodeType === Node.ELEMENT_NODE) {
              await processNode(child);
            }
          }
        }

        await processNode(body);

        if (decryptedAny) {
          const mark = document.createElement("div");
          Object.assign(mark.style, { fontSize: "12px", opacity: "0.65", marginBottom: "4px" }); //todo v cfg
          mark.textContent = "[PGP: расшифровано]";
          body.prepend(mark);
        }
      }
    }



    function observeComments() {//обсервер даувай галубцы даувай
      const observer = new MutationObserver(() => decryptAllComments());
      observer.observe(document.body, { childList: true, subtree: true });
    }

    submitInterceptor();
    decryptAllComments();
    observeComments();
    addEncryptButton();
  }
  //* %=================== pollsHelper ====================%

  function pollsHelper() {//todo move 
    try {
      const script = document.querySelector('#js_export');
      if (!script) return;

      const txt = script.textContent
        .replace(/^window\.JS_EXPORTS\s*=\s*/, '')
        .trim()
        .replace(/;$/, '');

      const data = new Function(`"use strict"; return (${txt})`)();
      if (!data?.polls) return;

      const polls = data.polls;

      document.querySelectorAll('.b-poll.is-limited').forEach(pollBlock => {
        const nameEl = pollBlock.querySelector('.poll .name');
        if (!nameEl) return;

        const baseName = nameEl.textContent.replace(/\(ID:.*?\)/, '').trim();
        const poll = polls.find(p => p.name.trim() === baseName);
        if (!poll) return;

        if (!nameEl.dataset.idAdded) {
          nameEl.dataset.idAdded = "1";
          nameEl.textContent = `${baseName} (ID: ${poll.id})`;
        }

        pollBlock.querySelectorAll('.poll-variant .radio-label').forEach(labelEl => {
          if (labelEl.dataset.votesAdded) return;

          const text = labelEl.textContent.trim();
          const variant = poll.variants.find(v => v.label.trim() === text);
          if (!variant) return;

          labelEl.dataset.votesAdded = "1";
          labelEl.textContent = `${text} (${variant.votes_total})`;
        });
      });

    } catch (err) {
      console.error("[ShikiUtils-pollsHelper]", err);

    }
  }

  //! %=================== GUI ===================%
  function createGUI() { //todo make lib
    const settingsBlock = document.querySelector(".block.edit-page.misc");
    if (!settingsBlock || settingsBlock.querySelector(".ShikiUtils-settings")) {
      return;
    }

    const gui = document.createElement("div");
    gui.className = "ShikiUtils-settings";
    gui.innerHTML = `<h3 class="ShikiUtils-title">ShikiUtils CFG</h3>`;

    Object.keys(defaultConfig).forEach((key) => {
      const defFunc = defaultConfig[key];
      const funcConfig = config[key] || {};

      if (defFunc.type === "category" || (defFunc.name && Object.keys(defFunc).length === 1)) {
        const catLabel = document.createElement("div");
        catLabel.className = "category-label";
        catLabel.textContent = defFunc.name;
        gui.appendChild(catLabel);
        return;
      }

      const hasSettings = funcConfig.settings && Object.keys(funcConfig.settings).length > 0;
      const wrapper = document.createElement("div");

      wrapper.className = "func-block";
      wrapper.innerHTML = `
      <div class="func-header" data-func="${key}">
        <div class="func-header-left">
          ${hasSettings ? `<span class="arrow" data-func="${key}"></span>` :
          `<span class="no-arrow"></span>`}
          <div>
            <span class="func-name">${defFunc.title || key}</span>
            <div class="func-description">${defFunc.description || ""}</div>
          </div>
        </div>
        <div class="func-controls">
          <button class="reset-btn" data-func="${key}" title="Сбросить настройки">↺</button>
          <label class="switch">
            <input type="checkbox" ${funcConfig.enabled ? "checked" : ""} data-func="${key}">
            <span class="slider"></span>
          </label>
        </div>
      </div>
      <div class="settings-content" data-func="${key}"></div>
    `;
      gui.appendChild(wrapper);

      const settingsContainer = wrapper.querySelector(".settings-content");
      if (!hasSettings) {
        settingsContainer.remove();
        return;
      }

      const settingCategories = {};
      Object.entries(defFunc.settings || {}).forEach(([sKey, sData]) => {
        const cat = sData.category || "General";
        if (!settingCategories[cat]) settingCategories[cat] = [];
        settingCategories[cat].push([sKey, sData]);
      });

      Object.entries(settingCategories).forEach(([catName, settingsList]) => {
        const subCat = document.createElement("div");
        subCat.className = "sub-category-label";
        subCat.textContent = catName;
        settingsContainer.appendChild(subCat);

        let prevInlineRow = null;

        settingsList.forEach(([sKey, sData]) => {
          const savedData = funcConfig.settings?.[sKey] || sData;
          const type = sData.type || "text";

          const label = document.createElement("label");
          label.textContent = sData.title || sKey;
          if (sData.description) label.title = sData.description;

          let input;

          switch (type) {
            case "button":
              input = document.createElement("button");
              input.textContent = savedData.value || "Нажать";
              input.className = "gui-btn";

              if (key === "PGPModule" && sKey === "GenerateKeysBtn") {
                const cfg = config.PGPModule.settings;
                input.addEventListener("click", async () => {
                  try {
                    const name = prompt("Имя для ключа:", "ShikiUtils") || "ShikiUtils";
                    const email = prompt("Email:", "Shiki@Utils") || "Shiki@Utils";
                    const pass = prompt("Passphrase (необязательно):", "") || "";

                    input.textContent = "Генерация...";

                    const { publicKey, privateKey } = await generateKeys(name, email, pass);

                    cfg.PubKeySelf.value = publicKey;
                    cfg.PrivKeySelf.value = privateKey;
                    cfg.KeyPassphrase.value = pass;

                    saveConfig();
                    updateDependsVisibility();
                    alert("Ключи сгенерированы.");
                    location.reload();
                  } catch (e) {
                    alert("Ошибка");
                    console.error(e);

                  } finally {
                    input.textContent = savedData.value;
                  }
                });
              }
              break;

            case "color":
              input = document.createElement("input");
              input.type = "text";
              input.value = savedData.value || "#ffffff";
              input.className = "color-square coloris";
              input.dataset.coloris = "";
              input.addEventListener("input", () => {
                if (!config[key].settings) config[key].settings = {};
                if (!config[key].settings[sKey]) config[key].settings[sKey] = {};
                config[key].settings[sKey].value = input.value;
                saveConfig();
                updateDependsVisibility();
              });
              break;

            case "number":
              input = document.createElement("input");
              input.type = "number";
              input.value = savedData.value;
              break;

            case "range":
              input = document.createElement("input");
              input.type = "range";
              input.min = savedData.min ?? 0;
              input.max = savedData.max ?? 2;
              input.step = savedData.step ?? 0.1;
              input.value = savedData.value;
              input.className = "range-slider";
              {
                const valLabel = document.createElement("span");
                valLabel.className = "range-value";
                valLabel.textContent = input.value + "s";
                input.addEventListener("input", () => {
                  valLabel.textContent = input.value + "s";
                  if (!config[key].settings) config[key].settings = {};
                  if (!config[key].settings[sKey]) config[key].settings[sKey] = {};
                  config[key].settings[sKey].value = parseFloat(input.value);
                  saveConfig();
                  updateDependsVisibility();
                });
                const row = document.createElement("div");
                row.className = "setting-row";
                row.appendChild(label);
                row.appendChild(input);
                row.appendChild(valLabel);
                settingsContainer.appendChild(row);
              }
              return;

            case "css":
              input = document.createElement("textarea");
              input.className = "css-textarea";
              input.value = savedData.value;
              input.addEventListener("input", autoResize);
              autoResize({ target: input });
              break;

            case "tags":
            case "ids":
              input = document.createElement("div");
              input.className = "tags-container";
              {
                let values = savedData.value ? savedData.value.split(",").map((v) => v.trim()).filter(Boolean) : [];

                const renderTags = () => {
                  input.innerHTML = "";
                  values.forEach((val, idx) => {
                    const tag = document.createElement("span");
                    tag.className = "tag-item";
                    tag.textContent = val;
                    const removeBtn = document.createElement("span");
                    removeBtn.className = "tag-remove";
                    removeBtn.textContent = "×";
                    removeBtn.addEventListener("click", () => {
                      values.splice(idx, 1);
                      updateConfig();
                    });
                    tag.appendChild(removeBtn);
                    input.appendChild(tag);
                  });
                  const newInput = document.createElement("input");
                  newInput.type = "text";
                  newInput.className = "tag-new-input";
                  newInput.placeholder = "Добавить...";
                  newInput.addEventListener("keydown", (e) => {
                    if (e.key === "Enter" && newInput.value.trim()) {
                      values.push(newInput.value.trim());
                      newInput.value = "";
                      updateConfig();
                    }
                  });
                  input.appendChild(newInput);
                };

                const updateConfig = () => {
                  if (!config[key].settings) config[key].settings = {};
                  config[key].settings[sKey] = {
                    ...savedData,
                    value: values.join(","),
                  };
                  saveConfig();
                  updateDependsVisibility();
                  renderTags();
                };

                renderTags();
              }
              break;

            case "mode":
              input = document.createElement("select");
              input.className = "mode-select";
              {
                const options = sData.options || [];
                options.forEach((opt) => {
                  const option = document.createElement("option");
                  option.value = opt;
                  option.textContent = opt;
                  if (savedData.value === opt) option.selected = true;
                  input.appendChild(option);
                });
                input.addEventListener("change", () => {
                  if (!config[key].settings) config[key].settings = {};
                  if (!config[key].settings[sKey]) config[key].settings[sKey] = {};
                  config[key].settings[sKey].value = input.value;
                  saveConfig();
                  updateDependsVisibility();
                });
              }
              break;

            case "boolean":
              input = document.createElement("label");
              input.className = "switch";
              {
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.checked = !!savedData.value;
                const slider = document.createElement("span");
                slider.className = "slider";
                input.appendChild(checkbox);
                input.appendChild(slider);
                checkbox.addEventListener("change", () => {
                  if (!config[key].settings) config[key].settings = {};
                  if (!config[key].settings[sKey]) config[key].settings[sKey] = {};
                  config[key].settings[sKey].value = checkbox.checked;
                  saveConfig();
                  updateDependsVisibility();
                });
              }
              break;
            case "pairs":
              input = document.createElement("div");
              input.className = "pairs-container";

              let pairs = Array.isArray(savedData.value) ? savedData.value : [];

              function renderPairs() {
                input.innerHTML = "";
                pairs.forEach((p, idx) => {
                  const block = document.createElement("div");
                  block.className = "pair-item";

                  const nameInput = document.createElement("input");
                  nameInput.type = "text";
                  nameInput.placeholder = "Имя";
                  nameInput.value = p.user || "";
                  nameInput.addEventListener("input", () => {
                    pairs[idx].user = nameInput.value;
                    savePairs();
                  });

                  const keyInput = document.createElement("textarea");
                  keyInput.placeholder = "Публичный ключ собеседника";
                  keyInput.value = p.key || "";
                  keyInput.className = "pair-key";
                  keyInput.addEventListener("input", () => {
                    pairs[idx].key = keyInput.value;
                    savePairs();
                  });

                  const removeBtn = document.createElement("button");
                  removeBtn.textContent = "X";
                  removeBtn.className = "pair-remove";
                  removeBtn.addEventListener("click", () => {
                    pairs.splice(idx, 1);
                    savePairs();
                    renderPairs();
                  });

                  block.appendChild(nameInput);
                  block.appendChild(keyInput);
                  block.appendChild(removeBtn);
                  input.appendChild(block);
                });

                const addBtn = document.createElement("button");
                addBtn.textContent = "+ Добавить";
                addBtn.className = "pair-add-btn";
                addBtn.addEventListener("click", () => {
                  pairs.push({ user: "", key: "" });
                  savePairs();
                  renderPairs();
                });

                input.appendChild(addBtn);
              }

              function savePairs() {
                if (!config[key].settings) config[key].settings = {};
                config[key].settings[sKey] = { ...savedData, value: pairs };
                saveConfig();
                updateDependsVisibility();
              }
              renderPairs();
              break;
            default:
              input = document.createElement("input");
              input.type = "text";
              input.value = savedData.value;
          }

          if (input && (input.tagName === "INPUT" || input.tagName === "TEXTAREA")) {
            input.addEventListener("input", () => {
              if (!config[key].settings) config[key].settings = {};
              if (!config[key].settings[sKey]) config[key].settings[sKey] = {};
              config[key].settings[sKey].value =
                input.type === "number" ? parseFloat(input.value) : input.value;
              saveConfig();
            });
          }

          const blockTypes = ["ids", "tags", "css", "range", "text", "default"];
          const layout = sData.layout || (blockTypes.includes(type) ? "block" : "inline");
          const isInline = sData.inline === true;
          const inlineItem = document.createElement("div");
          inlineItem.className = "inline-item";
          if (layout === "block") {
            inlineItem.appendChild(label);
            inlineItem.appendChild(input);
            inlineItem.classList.add("block-layout");
          } else {
            inlineItem.appendChild(label);
            inlineItem.appendChild(input);
          }
          if (isInline && prevInlineRow) {
            const inlineGroup = prevInlineRow.querySelector(".inline-group");
            inlineGroup.appendChild(inlineItem);
          } else {
            const row = document.createElement("div");
            row.className = "setting-row";
            if (sData.dependsOn) {
              row.dataset.depends = JSON.stringify({
                func: sData.dependsOn.func || key,
                key: sData.dependsOn.key,
                value: sData.dependsOn.value
              });
              row.classList.add("depends-hidden-check");
            }
            const inlineGroup = document.createElement("div");
            inlineGroup.className = "inline-group";
            inlineGroup.appendChild(inlineItem);
            row.appendChild(inlineGroup);
            settingsContainer.appendChild(row);
            prevInlineRow = isInline ? row : null;
          }
        });
      });
    });
    const messageBtn = document.createElement("button");
    messageBtn.textContent = "Написать автору";
    messageBtn.className = "gui-btn-message-author-btn";
    messageBtn.addEventListener("click", () => {
      localStorage.setItem("shikiDialogFromButton", "true");
      window.location.href = `https://shikimori.one/LifeH/dialogs/${getUsername()}`;
    });

    const globalReset = document.createElement("button");
    globalReset.className = "global-reset-btn";
    globalReset.textContent = "Сбросить всё";
    globalReset.addEventListener("click", () => {
      if (!confirm("Вы уверены, что хотите сбросить все настройки?")) return;
      config = structuredClone(defaultConfig);
      saveConfig();
      alert("Все настройки сброшены");
      location.reload();
    });
    const btnContainer = document.createElement("div");
    btnContainer.className = "ShikiUtils-buttons";
    btnContainer.appendChild(messageBtn);
    btnContainer.appendChild(globalReset);
    gui.appendChild(btnContainer);

    settingsBlock.appendChild(gui);

    if (typeof Coloris !== "undefined") {
      Coloris({
        el: ".coloris",
        theme: "default",
        swatches: ["#ff0000", "#00ff00", "#0000ff"],
      });
    }

    gui.querySelectorAll('.func-header input[type="checkbox"]').forEach((checkbox) => {
      checkbox.addEventListener("change", (e) => {
        const func = e.target.dataset.func;
        config[func].enabled = e.target.checked;
        saveConfig();
        updateDependsVisibility();
      });
    });

    gui.querySelectorAll(".reset-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const func = e.target.dataset.func;
        if (!confirm(`Сбросить настройки для ${func}?`)) return;
        if (defaultConfig[func]) {
          config[func] = structuredClone(defaultConfig[func]);
          saveConfig();
          alert(`Настройки ${func} сброшены`);
          location.reload();
        }
      });
    });

    gui.querySelectorAll(".func-header").forEach((header) => {
      header.addEventListener("click", (e) => {
        if (
          e.target.tagName === "INPUT" ||
          e.target.classList.contains("slider") ||
          e.target.classList.contains("reset-btn")
        ) {
          return;
        }
        const func = header.dataset.func;
        const content = gui.querySelector(`.settings-content[data-func="${func}"]`);
        const arrow = gui.querySelector(`.arrow[data-func="${func}"]`);
        if (!content) return;
        const isVisible = content.style.display === "block";
        content.style.display = isVisible ? "none" : "block";
        arrow?.classList.toggle("open", !isVisible);
      });
    });

    function autoResize(e) {
      const el = e.target;
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";
    }
    function updateDependsVisibility() {
      document.querySelectorAll(".depends-hidden-check").forEach(el => {
        const data = JSON.parse(el.dataset.depends);

        let actual;
        if (data.key === "Enabled") {
          actual = config[data.func]?.enabled;
        } else {
          actual = config[data.func]?.settings?.[data.key]?.value;
        }

        if (actual === data.value) {
          el.style.display = "";
        } else {
          el.style.display = "none";
        }
      });
    }

    updateDependsVisibility();
    const style = document.createElement("style");
    style.textContent = `
  :root {
    --bg: rgb(245, 245, 245);
    --panel-bg: rgb(255, 255, 255);
    --accent: rgb(76, 175, 80);
    --button: #eee;;
    --accent-hover: rgb(56, 155, 60);
    --text: rgba(0, 0, 0, 0.9);
    --text-muted: rgba(61, 61, 61, 0.7);
    --border: rgb(221, 221, 221);
    --danger: rgb(244, 68, 68);
    --danger-hover: rgb(210, 34, 34);
    --warning: rgb(255, 193, 7);
    --info: rgb(33, 150, 243);

    --shadow-light: 0 2px 6px rgba(0,0,0,0.08);
    --shadow-medium: 0 4px 12px rgba(0,0,0,0.1);
    --shadow-heavy: 0 8px 20px rgba(0,0,0,0.15);

    --font-main: "Segoe UI", sans-serif;
    --font-mono: monospace;
    --font-size-base: 14px;
    --font-size-small: 12px;
    --font-size-large: 16px;

    --radius-sm: 4px;
    --radius-md: 8px;
    --radius-lg: 10px;
    --radius-full: 50%;

    --transition-fast: 0.15s ease;
    --transition-medium: 0.3s ease;
    --transition-slow: 0.5s ease;

    --gradient-primary: linear-gradient(90deg, var(--accent), var(--accent-hover));
    --gradient-rainbow: linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet);

    --rainbow-animation: rainbow 5s linear infinite;
  }
.ShikiUtils-settings .arrow::after {
  font-family: shikimori;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-feature-settings: 'liga';
  text-transform: none;
  letter-spacing: normal;
  content: "";
  font-size: 16px;
  line-height: 20px;
  display: inline-block;
  vertical-align: middle;
  transition: transform .2s ease-in-out;
  margin-top: -9px;

}
  .ShikiUtils-settings {
    background: var(--bg);
    padding: 14px;
    border-radius: var(--radius-lg);
    border: 1px solid var(--border);
    margin-top: 15px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    font-family: var(--font-main);
  }
.ShikiUtils-settings .arrow.open::after {
  transform: rotate(90deg);
}
  @keyframes rainbow {
    0% { color: red; }
    16% { color: orange; }
    32% { color: yellow; }
    48% { color: green; }
    64% { color: blue; }
    80% { color: indigo; }
    100% { color: violet; }
  }

  .ShikiUtils-title {
    margin: 0 auto;
    font-size: var(--font-size-large);
    font-weight: 700;
    text-align: center;
    letter-spacing: 1px;
    animation: var(--rainbow-animation);
  }

  .func-block {
    position: relative;
    border-radius: var(--radius-lg);
    background: var(--panel-bg);
    overflow: hidden;
    border: 1px solid var(--border);
    box-shadow: var(--shadow-light);
    transition: transform var(--transition-medium), box-shadow var(--transition-medium);
  }

  .func-header {
    position: relative;
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
    padding: 8px 12px;
    cursor: pointer;
    transition: background var(--transition-medium);
  }

  .func-header::before {
    content: "";
    position: absolute;
    top: 0; left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 180, 255, 0.2); 
    opacity: 0;                        
    transition: opacity var(--transition-medium);
    border-radius: inherit;
    pointer-events: none;                
  }

  .func-header:hover::before {
    opacity: 1;                         
  }

  .func-block:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-medium);
  }

  .func-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    cursor: pointer;
  }

  .func-header-left { display: flex; align-items: flex-start; gap: 8px; }

  .func-controls { display: flex; align-items: center; gap: 6px; }

  .reset-btn {
    background: rgb(238,238,238);
    border: 1px solid rgb(204,204,204);
    border-radius: var(--radius-sm);
    cursor: pointer;
    font-size: var(--font-size-base);
    width: 26px;
    height: 26px;
    line-height: 18px;
    text-align: center;
    transition: all var(--transition-fast);
  }

  .reset-btn:hover {
    background: rgb(221,221,221);
    transform: scale(1.05);
    box-shadow: var(--shadow-medium);
  }

  .func-name { font-weight: 600; color: var(--text); }
  .func-description { font-size: var(--font-size-small); color: var(--text-muted); }

  .settings-content {
    display: none;
    padding: 8px 12px 12px 24px;
    background: rgb(250,250,250);
    border-top: 1px solid rgb(238,238,238);
  }

  .setting-row { margin-bottom: 10px; }

  .setting-row label {
    font-size: var(--font-size-small);
    display: block;
    margin-bottom: 4px;
    color: var(--text);
    cursor: help;
  }

  .setting-row input[type="text"],
  .setting-row input[type="number"],
  .setting-row input[type="color"],
  .setting-row textarea {
    width: 100%;
    padding: 5px 8px;
    border: 1px solid rgb(204,204,204);
    border-radius: var(--radius-sm);
    font-family: var(--font-mono);
    transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
  }

  .css-textarea { min-height: 70px; resize: vertical; white-space: pre; }

  .setting-row input:focus,
  .setting-row textarea:focus {
    border-color: var(--accent);
    box-shadow: 0 0 6px rgba(76,175,80,0.3);
    outline: none;
  }

  .arrow {
    font-size: var(--font-size-small);
    color: var(--text-muted);
    margin-top: 3px;
    transition: transform var(--transition-fast), color var(--transition-fast);
  }
  .arrow:hover { color: var(--accent); }

  .switch { position: relative; display: inline-block; width: 36px; height: 18px; }
  .switch input { display: none; }
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0; left: 0; right: 0; bottom: 0;
    background-color: rgb(187,187,187);
    transition: background-color var(--transition-medium);
    border-radius: 18px;
  }
  .slider:before {
    position: absolute;
    content: "";
    height: 14px; width: 14px;
    left: 2px; bottom: 2px;
    background-color: white;
    transition: transform var(--transition-medium);
    border-radius: var(--radius-full);
  }
  input:checked + .slider { background-color: var(--accent); }
  input:checked + .slider:before { transform: translateX(18px); }

  .global-reset-btn {
    background: var(--danger);
    color: white;
    border: none;
    padding: 8px 14px;
    border-radius: var(--radius-sm);
    cursor: pointer;
    margin-top: 5px;
    align-self: flex-end;
    transition: all var(--transition-fast);
  }
  .global-reset-btn:hover { background: var(--danger-hover); transform: scale(1.05); box-shadow: var(--shadow-medium); }

  .tags-container { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 4px; }
  .tag-item {
    background: rgb(238,238,238);
    padding: 3px 7px;
    border-radius: var(--radius-sm);
    font-size: var(--font-size-small);
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .tag-remove {
    cursor: pointer;
    color: rgb(136,136,136);
    font-weight: bold;
    transition: color var(--transition-fast);
  }
  .tag-remove:hover { color: var(--danger); }
  .tag-new-input {
    border: 1px solid rgb(204,204,204);
    border-radius: var(--radius-sm);
    padding: 3px 7px;
    font-size: var(--font-size-small);
    min-width: 60px;
  }

  .color-square {
    width: 32px !important;
    height: 32px !important;
    padding: 0;
    border: 1px solid rgb(170,170,170);
    border-radius: var(--radius-sm);
    cursor: pointer;
  }

  .range-slider { width: 70%; vertical-align: middle; }
  .range-value {
    display: inline-block;
    min-width: 40px;
    text-align: right;
    font-family: var(--font-mono);
    color: rgb(85,85,85);
    margin-left: 6px;
  }

  .category-label {
    text-align: center;
    font-weight: bold;
    color: var(--text-muted);
    margin-top: 12px;
    font-size: var(--font-size-small);
    border-bottom: 1px solid rgb(204,204,204);
  }

  .gui-btn {
    padding: 4px 8px;
    border: 1px solid #ccc;
    border-radius: var(--radius-sm);
    background: var(--button)
    cursor: pointer;
    transition: all var(--transition-fast);
  }
  .gui-btn:hover { transform: scale(1.05); box-shadow: var(--shadow-medium); }

  .ShikiUtils-buttons {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
    position: relative;
  }
  .gui-btn-message-author-btn {
    background: var(--button);
    color: black;
    border: none;
    padding: 8px 14px;
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .gui-btn-message-author-btn:hover {
    background: rgba(0, 180, 255, 0.2);   
    color: black;    
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 191, 255, 0.6);
  }

  .inline-group {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
  }

  .inline-item {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .inline-item input,
  .inline-item label {
    margin: 0;
    font-size: var(--font-size-small);
  }
  .block-layout {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
    width: 100%; 
  }

  .block-layout input,
  .block-layout textarea,
  .block-layout select,
  .block-layout .tags-container,
  .block-layout .range-container {
    width: 100%;
  }

  .block-layout label {
    font-weight: 500;
  }
.sub-category-label {
    display: flex;
    align-items: center;
    justify-content: center;

    font-weight: bold;
    color: var(--text-muted);
    font-size: var(--font-size-small);

    gap: 8px;
}

.sub-category-label::before,
.sub-category-label::after {
    content: "";
    flex: 1;
    height: 1px;
    background: rgb(204,204,204);
}
.pairs-container {
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
  margin-top: 10px;
}

.pair-item {
  display: grid;
  grid-template-columns: 1fr 42px;
  gap: 10px;

  padding: 12px;
  border: 1px solid #d0d0d0;
  border-radius: 6px;
}

.pair-item input[type="text"] {
  font-size: 14px;
}

.pair-item textarea.pair-key {
  grid-row: 2;
  min-height: 100px;
}

.pair-remove {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  font-size: 20px;
  cursor: pointer;
  background: #e74c3c;
  color: white;

  transition: 0.25s background, 0.15s transform;
}

.pair-remove:hover {
  background: #c0392b;
  transform: scale(1.1);
}

.pair-add-btn {
  padding: 8px 14px;
  border-radius: 6px;
  background: #2ecc71;
  color: white;
  cursor: pointer;
  font-size: 14px;
  transition: 0.2s background;
}

.pair-add-btn:hover {
  background: #27ae60;
}


  `;

    document.head.appendChild(style);
  }
  //! %=================== RUN ===================%

  function runFunctions() {
    if (config.workTypeFilter.enabled) workTypeFilter();
    if (config.UserCssCopyBtn.enabled) UserCssCopyBtn();
    if (config.UserIdCopyBtn.enabled) UserIdCopyBtn();
    if (config.ClubCssCopyBtn.enabled) ClubCssCopyBtn();

    if (config.CommCopyBtn.enabled) CommCopyBtn();
    if (config.ImageIdCopyBtn.enabled) ImageIdCopyBtn();
    if (config.CopyCodeBtn.enabled) CopyCodeBtn();

    if (config.NoAgeLimits.enabled) NoAgeLimits();
    if (config.ShikiRating.enabled) ShikiRating();
    if (config.StudioFilter.enabled) StudioFilter();
    if (config.NotificationHelperConfig.enabled) NotificationHelper();
    if (config.HistoryHelperConfig.enabled) HistoryHelper();
    if (config.ChineseFilter.enabled) ChineseFilter();
    if (config.FriendsHistory.enabled) FriendsHistory();
    if (config.CommTreeBtn.enabled) CommTreeBtn();
    if (config.ShikiScore.enabled) ShikiScore();
    if (config.MoreStatistic.enabled) MoreStatistic();
    if (config.PGPModule.enabled) PGPModule();
    if (config.pollsHelper.enabled) pollsHelper();

    domObserver();
  }
  function domObserver() { //todo это пиздец 
    const observer = new MutationObserver(() => {
      if (config.ForumCharacterFilter.enabled) ForumCharacterFilter();

      if (config.CommCopyBtn.enabled) CommCopyBtn();
      if (config.ImageIdCopyBtn.enabled) ImageIdCopyBtn();
      if (config.CopyCodeBtn.enabled) CopyCodeBtn();
      if (config.CommTreeBtn.enabled) CommTreeBtn();

      if (config.removeBlur.enabled) removeBlur();
      if (config.autoSpoiler.enabled) autoSpoiler();
      if (config.checkScroll.enabled && allowedPaths.some((path) => location.pathname.startsWith(path))) {
        window.addEventListener("scroll", checkScroll);
        checkScroll();
      }
      if (config.hideNews.enabled) hideNews();
      if (config.commentsLoader.enabled) commentsLoader();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  let fuckturbolinks = false;

  function fuckturboliks() {
    const settingsBlock = document.querySelector(".block.edit-page.misc");

    if (settingsBlock) {
      if (!fuckturbolinks) {
        fuckturbolinks = true;

        const overlay = document.createElement("div");
        overlay.style.position = "fixed";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.width = "100%";
        overlay.style.height = "100%";
        overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        overlay.style.display = "flex";
        overlay.style.alignItems = "center";
        overlay.style.justifyContent = "center";
        overlay.style.zIndex = "9999";

        const text = document.createElement("div");
        text.innerText = "Reloading";
        text.style.color = "#fff";
        text.style.fontSize = "2rem";
        text.style.fontWeight = "bold";

        overlay.appendChild(text);
        document.body.appendChild(overlay);

        console.log("[ShikiUtils] reloading for fix...");
        location.reload();
      }
    } else {
      fuckturbolinks = false;
    }
  }

  function feedbackPage() {
    if (!window.location.href.includes("/LifeH/dialogs/")) return;
    if (localStorage.getItem("shikiDialogFromButton") !== "true") return;
    localStorage.removeItem("shikiDialogFromButton");

    const removeClasses = [
      "b-comments",
      "subheadline",
      "b-options-floated mobile-phone_portrait",
      "head misc is-own-profile",
    ];
    removeClasses.forEach((cls) => {
      document
        .querySelectorAll(`.${cls.replace(/\s+/g, ".")}`)
        .forEach((el) => el.remove());
    });

    const waitForEditorAndButton = setInterval(() => {
      const editorContainer = document.querySelector(".editor-container");
      const editor = editorContainer?.querySelector(".ProseMirror");
      const submitButton = document.querySelector(".btn-primary.btn-submit.btn");

      if (editorContainer && editor && submitButton) {
        clearInterval(waitForEditorAndButton);

        const feedbackInner = document.createElement("div");
        feedbackInner.className = "b-feedback-inner";

        const subheadline = document.createElement("div");
        subheadline.className = "subheadline m5";
        subheadline.textContent = "Сообщение автору";

        const about = document.createElement("div");
        about.className = "about";

        const prgrph = document.createElement("div");
        prgrph.className = "b-prgrph";
        prgrph.innerHTML = `
        У тебя возникла интересная идея или проблема?<br>
        Напиши мне в форме ниже, и я, может быть, когда-нибудь тебе отвечу.
      `;

        const browserBlock = document.createElement("div");
        browserBlock.className = "browser-info";
        browserBlock.textContent = `Браузер: ${navigator.userAgent}`;
        browserBlock.style.cssText = `
        margin-top: 10px;
        padding: 6px 10px;
        background: #2c2c2c;
        color: #ccc;
        border-radius: 6px;
        font-size: 12px;
        cursor: pointer;
        user-select: none;
        transition: color 0.3s ease;
      `;
        browserBlock.title = "Нажми, чтобы скопировать";

        browserBlock.addEventListener("click", async (e) => {
          e.preventDefault();
          e.stopPropagation();
          try {
            await navigator.clipboard.writeText(navigator.userAgent);
            browserBlock.style.color = "#9f9";
            setTimeout(() => (browserBlock.style.color = "#ccc"), 800);
          } catch (err) {
            console.error("[ShikiUtils] ошибка копирования:", err);
          }
        });

        prgrph.appendChild(browserBlock);
        about.appendChild(prgrph);
        feedbackInner.appendChild(subheadline);
        feedbackInner.appendChild(about);
        editorContainer.prepend(feedbackInner);

        submitButton.addEventListener("click", () => {
          if (!userDataEl) {
            console.log("[ShikiUtils] data-user not found ");
            return;
          }

          const checkToast = setInterval(() => {
            const toast = document.querySelector(".toastify.on.toastify-right.toastify-top");

            if (toast) {
              const text = toast.textContent.trim();
              clearInterval(checkToast);

              if (text.includes("Сообщение отправлено")) {
                window.location.href = `https://shikimori.one/${getUsername()}/edit/misc`;
              }
            }
          }, 200);

          document.addEventListener("turbolinks:before-visit", () => clearInterval(checkToast), {
            once: true
          }
          );
        });
      }
    }, 200);
  }


  ready(() => {
    createGUI();
    runFunctions();
    feedbackPage();
    updateUserData();
  });

  document.addEventListener("turbolinks:load", () => {
    fuckturboliks();
  });
})();
