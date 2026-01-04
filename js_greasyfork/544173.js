// ==UserScript==
// @name         MBSS FAST TAG WITH BOXES
// @namespace    http://tampermonkey.net/
// @version      6.2.8.7
// @description  Упрощённая работа с тегами в MBSS
// @author       Vladimir Cherepovich & Petrusevich Andrei и доработка v.stazhok
// @match        https://support-admin-common-master.mbss.maxbit.private/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/544173/MBSS%20FAST%20TAG%20WITH%20BOXES.user.js
// @updateURL https://update.greasyfork.org/scripts/544173/MBSS%20FAST%20TAG%20WITH%20BOXES.meta.js
// ==/UserScript==

(function() {
  "use strict";

  GM_addStyle(`
    .universal-tags-container {
      position: relative;
      padding: 12px 15px;
      margin-bottom: 16px;
      border-radius: 8px;
      background: rgba(245,245,245,0.9);
      backdrop-filter: blur(5px);
      border: 1px solid rgba(0,0,0,0.1);
    }
    .dark-mode .universal-tags-container {
      background: rgba(30,30,30,0.9);
      border-color: rgba(255,255,255,0.1);
    }

    .universal-tags-title {
      font-size: 13px;
      font-weight: 700;
      margin: 0;
      padding: 10px 15px;
      color: #555;
      cursor: pointer;
      user-select: none;
      display: flex;
      align-items: center;
      width: 100%;
      box-sizing: border-box;
    }
    .toggle-arrow {
      margin-right: 6px;
      font-size: 12px;
      line-height: 1;
    }
    .dark-mode .universal-tags-title,
    .dark-mode .theme-toggle-btn {
      color: #aaa;
    }

    .universal-tag {
      display: inline-block;
      padding: 2px 5px;
      margin: 1px;
      border-radius: 15px;
      font-size: 12px;
      background: rgba(230,230,230,0.9);
      color: #333;
      border: 1px solid rgba(0,0,0,0.1);
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .dark-mode .universal-tag {
      background: rgba(60,60,60,0.9);
      color: #eee;
      border-color: rgba(255,255,255,0.1);
    }
    .universal-tag:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }

    .theme-toggle-btn {
      position: absolute;
      right: 10px;
      top: 10px;
      background: none;
      border: none;
      cursor: pointer;
      font-size: 12px;
      color: #666;
      opacity: 0.7;
    }

    .titleBox {
      color: #000;
      font-size: 15px;
      font-weight: 400;
      text-shadow: #fff 1px 0 9px;
    }

    .red  { background: #FF8A80; }
    .brown{ background: #a7866bff; }
    .orange{ background: #ffa153ff; }
    .gray { background: #7a8d7fff; }
    .cian { background: #67f7ffff; }
    .green{ background: #B9F6CA; }
    .purple{ background: #B388FF; }
    .yellow{ background: #FFFF8D; }
    .blue { background: #82B1FF; }
    .red, .blue, .yellow, .purple, .green, .brown, .orange, .gray, .cian {
      border-radius: 10px;
      padding: 0 5px;
      margin: 2px 0;
    }
  `);

  let isFirstCreate = true;

  const tags = {
    deposit: ["ticket", "deposit", "deposit waiting", "deposit error"],
    paysSystems: ["matching sbp", "matching p2p", "PayGO"],
    cashout: [
      "cashout",
      "cashout comment",
      "cashout error",
      "wagering deposit",
      "matching check",
      "cashout check"
    ],
    verification: ["verification ID selfie", "verification payment"],
    bonuses: [
      "loyalty for activity", "Bonus SNS",
      "bonus weekly deposit", "bonus cashback", "bonus weekly deposit",
      "bonus email", "bonus newsletter deposit", "bonus stag",
      "bonus streamer", "bonus birthday", "bonus general",
      "wagering bonus"
    ],
    block: [
      "blocked", "account unblocking", "limits",
      "blocked fail", "gambling addict", "break in",
      "account access", "login attempts"
    ],
    confirmationAndChanges: [
      "confirmation email", "confirmation phone",
      "change of country", "change of personal data",
      "change of email", "change of phone number"
    ],
    gameError: ["website mirror", "game error", "VPN to play"],
    other: ["sport", "snapcall", "other", "lottery", "duplicate", "RTP", "bill"]
  };

  const categoriesBoxes = {
    deposit: createBoxForTags("red",    "Депозиты"),
    paysSystems: createBoxForTags("green","Платежки"),
    cashout: createBoxForTags("brown",  "Вывод"),
    verification: createBoxForTags("cian","Верификация"),
    bonuses: createBoxForTags("purple", "Бонусы"),
    block: createBoxForTags("orange",  "Блок/разблок"),
    confirmationAndChanges: createBoxForTags("yellow", "Подтверждение/изменение"),
    gameError: createBoxForTags("gray", "Ошибки"),
    other: createBoxForTags("blue",    "Остальное")
  };

  function toggleTheme() {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem(
      "universal-tags-theme",
      document.body.classList.contains("dark-mode") ? "dark" : "light"
    );
  }

  function createBoxForTags(nameClass, titleText) {
    const box = document.createElement("div");
    box.className = nameClass;
    const title = document.createElement("p");
    title.classList.add("titleBox");
    title.textContent = titleText;
    box.appendChild(title);
    return box;
  }

  function createTagsContainer() {
    if (document.querySelector(".universal-tags-container")) return null;

    const container = document.createElement("div");
    container.className = "universal-tags-container";

    const themeBtn = document.createElement("button");
    themeBtn.className = "theme-toggle-btn";
    themeBtn.innerHTML = "🌓";
    themeBtn.title = "Переключить тему";
    themeBtn.addEventListener("click", toggleTheme);
    container.appendChild(themeBtn);

    const titleBar = document.createElement("div");
    titleBar.className = "universal-tags-title";

    const arrow = document.createElement("span");
    arrow.className = "toggle-arrow";
    arrow.textContent = ">";

    const label = document.createElement("span");
    label.textContent = "Быстрые теги";

    titleBar.appendChild(arrow);
    titleBar.appendChild(label);
    container.appendChild(titleBar);

    const tagsWrapper = document.createElement("div");
    tagsWrapper.className = "tagsWrapperConteiner";
    tagsWrapper.style.display = "none";

    if (isFirstCreate) {
      for (let key in categoriesBoxes) {
        if (tags[key]) {
          tags[key].forEach(tagName => {
            const tagEl = document.createElement("span");
            tagEl.className = "universal-tag";
            tagEl.textContent = tagName;
            tagEl.addEventListener("click", () => addTag(tagName));
            categoriesBoxes[key].appendChild(tagEl);
          });
        }
      }
      isFirstCreate = false;
    }

    for (let key in categoriesBoxes) {
      tagsWrapper.appendChild(categoriesBoxes[key]);
    }
    container.appendChild(tagsWrapper);

    titleBar.addEventListener("click", () => {
      const isHidden = tagsWrapper.style.display === "none";
      tagsWrapper.style.display = isHidden ? "block" : "none";
      arrow.textContent = isHidden ? "˅" : ">";
    });

    return container;
  }

  function addTag(tagName) {
    const steps = [
      () => document
             .querySelector(
               ".vac-room-item.vac-room-selected .vac-room-container .vac-head .vac-name-container .vac-title-container .vac-room-name .vac-room-head .el-button"
             )
             ?.click(),

      () => {
        const input = document.querySelector("input.el-select__input");
        if (input) {
          input.value = tagName;
          input.dispatchEvent(new Event("input", { bubbles: true }));
        }
      },

      () => {
        const items = document.querySelectorAll(".el-select-dropdown__item");
        for (const item of items) {
          if (item.textContent.trim() === tagName) {
            item.click();
            break;
          }
        }
      },

      () => {
        const addBtn = [...document.querySelectorAll("button span")]
          .find(el => el.textContent.trim() === "Add");
        if (addBtn) addBtn.click();
      }
    ];

    (function exec(i) {
      if (i < steps.length) {
        steps[i]();
        setTimeout(() => exec(i + 1), 30);
      }
    })(0);
  }

  function init() {
    const infoList = document.querySelector("#info-list");
    if (!infoList) return;

    if (localStorage.getItem("universal-tags-theme") === "dark") {
      document.body.classList.add("dark-mode");
    }

    const container = createTagsContainer();
    if (container) {
      infoList.prepend(container);
    }
  }

  if (document.readyState === "complete") {
    init();
  } else {
    window.addEventListener("load", init);
  }

  setInterval(() => {
    if (!document.querySelector(".universal-tags-container")) {
      init();
    }
  }, 2000);

})();
