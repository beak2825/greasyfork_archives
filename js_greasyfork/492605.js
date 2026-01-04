// ==UserScript==
// @name         CatWar Achievements Tool
// @namespace    http://tampermonkey.net/
// @version      v1.1.1-11.24
// @description  Упрощение создания ачивочных таблиц для CatWar'а.
// @author       Ibirtem / Затменная ( https://catwar.net/cat1477928 )
// @copyright    2024, Ibirtem (https://openuserjs.org/users/Ibirtem)
// @supportURL   https://catwar.net/cat1477928
// @match        http*://*.catwar.net/*
// @updateURL
// @downloadURL
// @grant        GM_addStyle
// @license      MIT
// @iconURL      https://raw.githubusercontent.com/Ibirtem/CatWar/main/images/hammer_and_wrench.png
// @downloadURL https://update.greasyfork.org/scripts/492605/CatWar%20Achievements%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/492605/CatWar%20Achievements%20Tool.meta.js
// ==/UserScript==

"use strict";

const targetSettings = /^https:\/\/catwar\.net\/settings/;
const targetCW3 = /^https:\/\/catwar\.net\/lol/;
// /^https:\/\/catwar\.net/
// /^https:\/\/catwar\.net\/lol/

// ====================================================================================================================
// Шапка и какие иконки к ней.
const imageData = [
  {
    name: "Звезда",
    url: "https://i.ibb.co/qMRmrdQ/015534670f4c.png",
    iconIndexes: [0, 1, 2, 3, 4, 5, 6, 7], // Индексы иконок из iconsData. Не забываем, что 0 равняется 1 строке.
    topLeftIconIndex: 8, // Индекс иконки для верхнего левого угла
    topRightIconIndex: 9, // Индекс иконки для верхнего правого угла
    bottomLeftIconIndex: 8, // Индекс иконки для нижнего левого угла
    bottomRightIconIndex: 9, // Индекс иконки для нижнего правого угла
    block: "дети", // Название блока
    achievementsPerRow: 4, // Количество ачивок на строку
  },
  {
    name: "Вода",
    url: "https://i.ibb.co/1ZBx32F/015534670f4c.png",
    iconIndexes: [0, 1, 2, 3, 4, 5, 6, 7],
    topLeftIconIndex: 8,
    topRightIconIndex: 9,
    bottomLeftIconIndex: 8,
    bottomRightIconIndex: 9,
    block: "дети",
    achievementsPerRow: 4,
  },
  {
    name: "Листик",
    url: "https://i.ibb.co/QY2z9rt/015534670f4c.png",
    iconIndexes: [0, 1, 2, 3, 4, 5, 6, 7],
    topLeftIconIndex: 8,
    topRightIconIndex: 9,
    bottomLeftIconIndex: 8,
    bottomRightIconIndex: 9,
    block: "дети",
    achievementsPerRow: 4,
  },

  {
    name: "Ночь",
    url: "https://d.zaix.ru/EL9z.png",
    iconIndexes: [10, 11, 12, 13, 14, 15],
    topLeftIconIndex: 16,
    topRightIconIndex: 17,
    bottomLeftIconIndex: 18,
    bottomRightIconIndex: 19,
    block: "охрана",
    achievementsPerRow: 3,
  },
  {
    name: "День",
    url: "https://d.zaix.ru/EL9w.png",
    iconIndexes: [10, 11, 12, 13, 14, 15],
    topLeftIconIndex: 16,
    topRightIconIndex: 17,
    bottomLeftIconIndex: 18,
    bottomRightIconIndex: 19,
    block: "охрана",
    achievementsPerRow: 3,
  },

  {
    name: "Паутина",
    url: "https://d.zaix.ru/CHhq.png",
    iconIndexes: [20, 21, 22, 23, 24, 25, 26, 27],
    topLeftIconIndex: 28,
    topRightIconIndex: 29,
    bottomLeftIconIndex: 30,
    bottomRightIconIndex: 31,
    block: "собиратели",
    achievementsPerRow: 4,
  },
  {
    name: "Мох",
    url: "https://d.zaix.ru/CSho.png",
    iconIndexes: [20, 21, 22, 23, 24, 25, 26, 27],
    topLeftIconIndex: 28,
    topRightIconIndex: 29,
    bottomLeftIconIndex: 30,
    bottomRightIconIndex: 31,
    block: "собиратели",
    achievementsPerRow: 4,
  },
  {
    name: "Живописцы",
    url: "http://d.zaix.ru/HeYK.png",
    iconIndexes: [32, 33, 34, 35, 36, 37, 38, 39],
    topLeftIconIndex: 40,
    topRightIconIndex: 41,
    bottomLeftIconIndex: 40,
    bottomRightIconIndex: 41,
    block: "серебро",
    achievementsPerRow: 4,
  },
  {
    name: "Просветители",
    url: "http://d.zaix.ru/HeYJ.png",
    iconIndexes: [32, 33, 34, 35, 36, 37, 38, 39],
    topLeftIconIndex: 40,
    topRightIconIndex: 41,
    bottomLeftIconIndex: 40,
    bottomRightIconIndex: 41,
    block: "серебро",
    achievementsPerRow: 4,
  },
  {
    name: "Певчие",
    url: "http://d.zaix.ru/HeYH.png",
    iconIndexes: [42, 43, 44, 45, 46, 47, 48, 49],
    topLeftIconIndex: 50,
    topRightIconIndex: 51,
    bottomLeftIconIndex: 50,
    bottomRightIconIndex: 51,
    block: "золото",
    achievementsPerRow: 4,
  },
  {
    name: "Мифотворцы",
    url: "http://d.zaix.ru/HeYI.png",
    iconIndexes: [42, 43, 44, 45, 46, 47, 48, 49],
    topLeftIconIndex: 50,
    topRightIconIndex: 51,
    bottomLeftIconIndex: 50,
    bottomRightIconIndex: 51,
    block: "золото",
    achievementsPerRow: 4,
  },
  // ... Сюда больше шапок ...
];

// Хранилище всех иконок.
const iconsData = [
  { name: "Пришел, увидел, победил", url: "https://i.ibb.co/Ss3zz22/3.png" }, // 0
  { name: "Проворный малый", url: "https://i.ibb.co/6DmpjWK/4.png" }, // 1
  { name: "Не покладая лапок", url: "https://i.ibb.co/w7KsDrx/5.png" },
  { name: "Помощник", url: "https://i.ibb.co/HdWrKn9/8.png" },
  { name: "Почти взрослый…", url: "https://i.ibb.co/23cvnbQ/6.png" },
  { name: "Самые шустрые лапки на Севере", url: "https://i.ibb.co/hL6398t/2.png", },
  { name: "Легендарный творец", url: "https://i.ibb.co/kSHkDhz/015534670f4c.png", },
  { name: "Зоркий глаз", url: "https://i.ibb.co/xM6Dj79/1.png" },
  { url: "https://i.ibb.co/tXtPP4j/015534670f4c.png" }, // 8
  { url: "https://i.ibb.co/vzsH1mt/015534670f4c.png" }, // 9

  { name: "Засада не страшна!", url: "https://d.zaix.ru/ELaG.png" }, // 10
  { name: "Заслуженные лавры", url: "https://d.zaix.ru/ELav.png" }, // 11
  { name: "Преданность делу", url: "https://d.zaix.ru/ELb3.png" },
  { name: "Это определенно подвиг!", url: "https://d.zaix.ru/ELay.png" },
  { name: "Лапы вверх!", url: "https://d.zaix.ru/ELaw.png" },
  { name: "Пост сдал – пост принял", url: "https://d.zaix.ru/ELaS.png" },
  { url: "https://d.zaix.ru/EQw7.png" },
  { url: "http://d.zaix.ru/ELba.png" },
  { url: "https://d.zaix.ru/ELbp.png" }, // 18
  { url: "https://d.zaix.ru/ELbq.png" }, // 19

  { name: "Старательные лапки", url: "http://d.zaix.ru/CHhK.png" }, // 20
  { name: "Славный малый", url: "http://d.zaix.ru/CHhD.png" }, // 21
  { name: "А где?", url: "https://i.ibb.co/GPQphbN/image.png" },
  { name: "Усердный трудяга", url: "http://d.zaix.ru/FTBs.png" },
  { name: "Дитя фортуны", url: "http://d.zaix.ru/CHhF.png" },
  { name: "Тридцать три несчастья", url: "https://i.ibb.co/XZYbtpF/image.png" },
  { name: "Герой без сияющих доспехов", url: "https://i.ibb.co/6HsGySD/image.png" },
  { name: "Пауков не боюсь!", url: "http://d.zaix.ru/FTBa.png" },
  { url: "http://d.zaix.ru/CHhC.png" },
  { url: "http://d.zaix.ru/CHhQ.png" },
  { url: "https://i.ibb.co/4g7nXF8/image.png" }, // 30
  { url: "https://i.ibb.co/YjXmVVh/image.png" }, // 31

  // СЕРЕБРО
  { name: "Красота мимолётна", url: "http://d.zaix.ru/HeZh.png" }, // 32
  { name: "Отпечаток в камне", url: "http://d.zaix.ru/HeZi.png" }, // 33
  { name: "Искра вдохновения", url: "http://d.zaix.ru/HeZj.png" },
  { name: "Бессонные ночи", url: "http://d.zaix.ru/HeZk.png" },
  { name: "Дар души", url: "http://d.zaix.ru/HeZn.png" },
  { name: "Перо, кисть и немного фантазии", url: "http://d.zaix.ru/HeZs.png" },
  { name: "Чёрный пояс по мастерству", url: "http://d.zaix.ru/HeZt.png" },
  { name: "Роле-волевой", url: "http://d.zaix.ru/HeZu.png" },
  { url: "https://d.zaix.ru/HeZy.png" }, // 40
  { url: "https://d.zaix.ru/HeZx.png" }, // 41

  // ЗОЛОТО
  { name: "Красота мимолётна", url: "http://d.zaix.ru/HeYM.png" }, // 42
  { name: "Отпечаток в камне", url: "http://d.zaix.ru/HeYT.png" }, // 43
  { name: "Искра вдохновения", url: "http://d.zaix.ru/HeYZ.png" },
  { name: "Бессонные ночи", url: "http://d.zaix.ru/HeZ2.png" },
  { name: "Дар души", url: "http://d.zaix.ru/HeZ7.png" },
  { name: "Перо, кисть и немного фантазии", url: "http://d.zaix.ru/HeZ9.png" },
  { name: "Чёрный пояс по мастерству", url: "http://d.zaix.ru/HeZb.png" },
  { name: "Роле-волевой", url: "http://d.zaix.ru/HeZd.png" },
  { url: "http://d.zaix.ru/HeZz.png" }, // 50
  { url: "http://d.zaix.ru/HeZB.png" }, // 51
  // ... Сюда больше иконок ...
];
// ====================================================================================================================
const achievementsTable = `
<div class="achievementsTable">
    <div class="table-builder">
      <button class="add-table-btn">Создать таблицу</button>
    </div>
    <div class="achievements-tables">
      
    </div>

    <div class="BB-generator">
      <button class="copy-BB">Сгенерировать и вывести BB код</button>
    </div>

    <div class="BB-code-output">
    <textarea class="bb-code-textarea" readonly></textarea> <!-- Поле для вывода кода -->
  </div>
</div>
`;

let css = `
.achievementsTable {
    background-color: #00000033;
    border-radius: 20px;
    padding: 10px;
    margin: 10px;
}

.table-builder {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
}

.achievements-tables {
  display: flex;
  flex-wrap: wrap;
}

.table-container {
  background-color: #00000033;
  border-radius: 20px;
  display: flex;

  padding: 10px;
  margin: 10px;
}

.icons-container {
  display: grid;
  grid-template-columns: 20px 1fr;
  gap: 10px;
  justify-items: start;
  align-items: center;
}

.selects-container {
  display: grid;
  background-color: #00000033;
  border-radius: 20px;
  gap: 10px;
  
  padding: 10px;
  margin: 10px;
}
`;
GM_addStyle(css);
// ====================================================================================================================
if (targetSettings.test(window.location.href)) {
}
// ====================================================================================================================
function createTableContainer() {
  const tableContainer = document.createElement("div");
  tableContainer.className = "table-container";
  tableContainer.style.display = "flex";
  tableContainer.style.gap = "10px";

  // Кнопка "+ Слева"
  const leftAddBtn = document.createElement("button");
  leftAddBtn.className = "add-table-btn";
  leftAddBtn.textContent = "+ Слева";
  tableContainer.appendChild(leftAddBtn);

  // Обвалка для элементов выбора изображений
  const imageSelectionContainer = document.createElement("div");
  imageSelectionContainer.style.display = "flex";
  imageSelectionContainer.style.flexDirection = "column";

  // Выпадающий список для шапок
  const шапкаSelect = document.createElement("select");

  // Создаём пустой элемент
  const emptyOption = document.createElement("option");
  emptyOption.value = "";
  emptyOption.text = "..."; // Или любой другой текст для пустого элемента
  шапкаSelect.appendChild(emptyOption);

  // Добавляем остальные опции из imageData
  imageData.forEach((data) => {
    const option = document.createElement("option");
    option.value = data.name;
    option.text = data.name;
    шапкаSelect.appendChild(option);
  });

  imageSelectionContainer.appendChild(шапкаSelect);

  // Контейнеры для выпадающих списков строк
  const firstRowSelectsContainer = document.createElement("div");
  firstRowSelectsContainer.className = "first-row-selects selects-container";
  const secondRowSelectsContainer = document.createElement("div");
  secondRowSelectsContainer.className = "second-row-selects selects-container";

  // Добавление контейнеров в imageSelectionContainer
  imageSelectionContainer.appendChild(firstRowSelectsContainer);
  imageSelectionContainer.appendChild(secondRowSelectsContainer);

  tableContainer.appendChild(imageSelectionContainer);

  // Кнопка "+ Справа"
  const rightAddBtn = document.createElement("button");
  rightAddBtn.className = "add-table-btn";
  rightAddBtn.textContent = "+ Справа";
  tableContainer.appendChild(rightAddBtn);

  // Обработчик события изменения выбора шапки
  шапкаSelect.addEventListener("change", () => {
    // Очистить существующие выпадающие списки
    firstRowSelectsContainer.innerHTML = "";
    secondRowSelectsContainer.innerHTML = "";

    const selectedШапка = imageData.find(
      (data) => data.name === шапкаSelect.value
    );
    const achievementsPerRow = selectedШапка.achievementsPerRow;

    // Создать выпадающие списки для первой строки
    for (let i = 0; i < achievementsPerRow; i++) {
      const select = createIconSelect(selectedШапка); // Передать selectedШапка
      firstRowSelectsContainer.appendChild(select);
    }

    // Создать выпадающие списки для второй строки (если необходимо)
    if (selectedШапка.iconIndexes.length > achievementsPerRow) {
      for (let i = 0; i < achievementsPerRow; i++) {
        const select = createIconSelect(selectedШапка);
        secondRowSelectsContainer.appendChild(select);
      }
    }
  });

  // Слушаем битбокс кнопочек
  leftAddBtn.addEventListener("click", (event) => {
    event.preventDefault();
    const newTableContainer = createTableContainer();
    tableContainer.parentNode.insertBefore(newTableContainer, tableContainer);
  });

  rightAddBtn.addEventListener("click", (event) => {
    event.preventDefault();
    const newTableContainer = createTableContainer();
    tableContainer.parentNode.insertBefore(
      newTableContainer,
      tableContainer.nextSibling
    );
  });

  return tableContainer;
}

// Функция для создания выпадающего списка иконок
function createIconSelect(selectedШапка) {
  // Передать selectedШапка в функцию
  const select = document.createElement("select");

  const emptyOption = document.createElement("option");
  emptyOption.value = "";
  emptyOption.text = "...";
  select.appendChild(emptyOption);

  selectedШапка.iconIndexes.forEach((index) => {
    const icon = iconsData[index];
    const option = document.createElement("option");
    option.value = icon.url;
    option.text = icon.name;
    select.appendChild(option);
  });
  return select;
}
// ====================================================================================================================
const infoTextarea = document.getElementById("text"); // id нужного элемента

// Где я
const achievementsTableContainer = document.createElement("div");
achievementsTableContainer.innerHTML = achievementsTable;
const achievementsTableElement =
  achievementsTableContainer.querySelector(".achievementsTable");
const achievementsTablesElement = achievementsTableElement.querySelector(
  ".achievements-tables"
);
if (targetCW3.test(window.location.href)) {
  // Вставить achievementsTable перед infoTextarea
  infoTextarea.parentNode.insertBefore(achievementsTableElement, infoTextarea);

  // Слушаем битбокс кнопочки "Создать таблицу"
  achievementsTableElement
    .querySelector(".table-builder .add-table-btn")
    .addEventListener("click", (event) => {
      event.preventDefault();
      const newTableContainer = createTableContainer();
      achievementsTablesElement.appendChild(newTableContainer);
    });

  // слушаем кнопку генерации таблицы, вуху.
  achievementsTableElement
    .querySelector(".BB-generator .copy-BB")
    .addEventListener("click", (event) => {
      event.preventDefault();

      // 1. Получаим данные
      const tablesData = getTablesData();

      // 2. Генерируем барбекью
      const bbCode = generateBBCode(tablesData, achievementsTablesElement);

      // 3. Кушаем барбекью
      const bbCodeTextarea =
        achievementsTableElement.querySelector(".bb-code-textarea");
      bbCodeTextarea.value = bbCode;
    });
}

function getTablesData() {
  const tablesData = [];
  const tableContainers =
    achievementsTablesElement.querySelectorAll(".table-container");

  tableContainers.forEach((tableContainer) => {
    const шапкаSelect = tableContainer.querySelector("select");
    const шапкаName = шапкаSelect.value;

    const firstRowIcons = [];
    const firstRowSelects = tableContainer.querySelectorAll(
      ".first-row-selects select"
    );
    firstRowSelects.forEach((select) => {
      if (select.value !== "") {
        firstRowIcons.push(select.value);
      }
    });

    const secondRowIcons = [];
    const secondRowSelects = tableContainer.querySelectorAll(
      ".second-row-selects select"
    );
    secondRowSelects.forEach((select) => {
      if (select.value !== "") {
        secondRowIcons.push(select.value);
      }
    });

    tablesData.push({
      шапкаName,
      firstRowIcons,
      secondRowIcons,
      tableContainer,
    });
    // console.log(firstRowIcons, secondRowIcons);
  });

  return tablesData;
}

function generateBBCode(tablesData) {
  let bbCode = `[table=0][tr]\n`;

  tablesData.forEach((tableData) => {
    const headerData = imageData.find(
      (data) => data.name === tableData.шапкаName
    );

    // Добавление строки с заголовком
    bbCode += `[td][header=${headerData.block}][img]${headerData.url}[/img][/header][/td]`;

    // Добавление блока иконок справа от заголовка
    bbCode += generateIconsBlockBBCode(
      tableData.firstRowIcons,
      tableData.secondRowIcons,
      headerData,
      tableData.tableContainer
    ); // Передать tableData.tableContainer
    bbCode += `\n`;
  });

  bbCode += `[/tr][/table]`;
  return bbCode;
}

function generateIconsBlockBBCode(firstRowIcons, secondRowIcons, headerData) {
  // Проверить наличие выбранных иконок в хотя бы одной строке
  if (firstRowIcons.length === 0 && secondRowIcons.length === 0) {
    return ""; // Вернуть пустую строку, если нет выбранных иконок
  }

  let iconsBlockBBCode = "";

  iconsBlockBBCode += `[td][block=${headerData.block}][center]`;

  // Генерация BBCode для первой строки
  if (firstRowIcons.length > 0) {
    iconsBlockBBCode += `[img]${
      iconsData[headerData.topLeftIconIndex].url
    }[/img]`;
    firstRowIcons.forEach((iconUrl) => {
      iconsBlockBBCode += `[img]${iconUrl}[/img]`;
    });
    iconsBlockBBCode += `[img]${
      iconsData[headerData.topRightIconIndex].url
    }[/img]\n`;
  }

  // Генерация BBCode для второй строки
  if (secondRowIcons.length > 0) {
    iconsBlockBBCode += `[img]${
      iconsData[headerData.bottomLeftIconIndex].url
    }[/img]`;
    secondRowIcons.forEach((iconUrl) => {
      iconsBlockBBCode += `[img]${iconUrl}[/img]`;
    });
    iconsBlockBBCode += `[img]${
      iconsData[headerData.bottomRightIconIndex].url
    }[/img]\n`;
  }

  iconsBlockBBCode += `[/center][/block][/td]`;
  return iconsBlockBBCode;
}