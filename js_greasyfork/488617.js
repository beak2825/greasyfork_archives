// ==UserScript==
// @name         CatWar UwU
// @namespace    http://tampermonkey.net/
// @version      v1.42.0-12.25
// @description  Визуальное обновление CatWar'а, и не только...
// @author       Ibirtem / Затменная ( https://catwar.net/cat1477928 )
// @copyright    2025, Ibirtem (https://openuserjs.org/users/Ibirtem)
// @supportURL   https://catwar.net/cat1477928
// @homepageURL  https://openuserjs.org/scripts/Ibirtem/CatWar_UwU
// @match        http*://*.catwar.net/*
// @match        http*://*.catwar.su/*
// @license      MIT
// @iconURL      https://raw.githubusercontent.com/Ibirtem/CatWar/main/images/partly_sunny_rain.png
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @downloadURL https://update.greasyfork.org/scripts/488617/CatWar%20UwU.user.js
// @updateURL https://update.greasyfork.org/scripts/488617/CatWar%20UwU.meta.js
// ==/UserScript==

"use strict"; // Делаю вид что крутой.

// ====================================================================================================================
//   . . . ЕДИНОЕ ХРАНИЛИЩЕ . . .
// ====================================================================================================================

let useUnifiedStorage = false;

(() => {
  if (typeof GM_getValue === "undefined") {
    return;
  }

  try {
    const gmSettingsRaw = GM_getValue("uwu_settings");
    if (gmSettingsRaw) {
      const gmSettings = JSON.parse(gmSettingsRaw);
      useUnifiedStorage = !!gmSettings.unifiedStorage;
      return;
    }
  } catch (e) {
    // Ошибка парсинга GM JSON, продолжаем с localStorage
  }

  try {
    const localSettingsRaw = localStorage.getItem("uwu_settings");
    if (localSettingsRaw) {
      const localSettings = JSON.parse(localSettingsRaw);
      if (localSettings.unifiedStorage) {
        useUnifiedStorage = true;
      }
    }
  } catch (e) {}
})();

const uwuStorage = {
  setItem: (key, value) => {
    const stringValue = JSON.stringify(value);
    if (useUnifiedStorage) {
      GM_setValue(key, stringValue);
    } else {
      localStorage.setItem(key, stringValue);
    }
  },

  getItem: (key) => {
    const rawValue = useUnifiedStorage
      ? GM_getValue(key)
      : localStorage.getItem(key);

    if (rawValue === null || typeof rawValue === "undefined") {
      return null;
    }

    try {
      return JSON.parse(rawValue);
    } catch (e) {
      return rawValue;
    }
  },

  removeItem: (key) => {
    if (useUnifiedStorage) {
      GM_deleteValue(key);
    } else {
      localStorage.removeItem(key);
    }
  },

  migrateAllToGM: () => {
    console.log("UwU | Перенос данных из localStorage в единое хранилище...");
    const keysToMigrate = Object.keys(localStorage);
    for (const key of keysToMigrate) {
      if (key.startsWith("uwu_")) {
        const value = localStorage.getItem(key);
        GM_setValue(key, value);
      }
    }
    console.log("UwU | Перенос завершен.");
  },
};

// ====================================================================================================================
//   . . . DEFAULT НАСТРОЙКИ . . .
// ====================================================================================================================
const current_uwu_version = "1.42.0";
// ✨🦐✨🦐✨
const uwuDefaultSettings = {
  settingsTheme: "dark",

  weatherEnabled: false,
  weatherDrops: false,
  lowPerformanceMode: false,
  minecraftStyle: false,
  alwaysDay: false,
  manualWeatherPanel: false,
  skyInHeader: false,
  auroraPos: "1",
  weatherZIndex: "0",

  backgroundRepeat: false,
  backgroundUser: false,
  backgroundUserImageURL: "",
  gameFieldBackgroundUser: false,
  gameFieldBackgroundUserImageURL: "",
  userTheme: false,
  userThemeKns: false,
  showOtherCatsList: "2",
  commentsAvatars: false,

  chatHeight: "275",
  newChat: false,
  addCommaAfterNick: false,
  reverseChat: false,
  newChatInput: false,
  showChatCharCounter: false,
  namesForNotification: "",

  redesignCostumsSettings: false,

  showDefectsEnabled: false,
  defectsStyle: "default",
  defectsQuality: "high",

  notificationPM: false,
  notificationPMSound: "notificationSound1",
  notificationPMVolume: 5,
  notificationActionEnd: false,
  notificationActionEndSound: "notificationSound1",
  notificationActionEndVolume: 5,
  notificationInMouth: false,
  notificationInMouthSound: "notificationSound1",
  notificationInMouthVolume: 5,
  notificationInFightMode: false,
  notificationInFightModeSound: "notificationSound1",
  notificationInFightModeVolume: 5,
  notificationBlock: false,
  notificationBlockSound: "notificationBlockSound1",
  notificationBlockVolume: 5,

  showHintWhenToSniff: false,
  duplicateTimeInBrowserTab: false,

  cellsBorders: false,
  cellsBordersThickness: "1",
  cellsBordersColor: "#ffffff",
  cellsNumbers: false,
  fastStyles: false,
  displayParametersPercentages: false,
  compactMouth: false,
  showMoreCatInfo: false,
  showParametersDetails: false,

  draggingFightPanel: false,
  compactFightLog: false,
  fightPanelAdjustableHeight: false,
  fightPanelHeight: "70",
  fightTeams: false,
  fightTeamsColors: {
    team1: ["#41cd70", "#cd4141"],
    team2: ["#c968ff", "#cd4141"],
    team3: ["#44bcff", "#cd4141"],
    team4: ["#FFFF00", "#cd4141"],
  },
  fightTeamsPanelHight: "100",

  highlightResources: false,
  highlightResourcesStyle: "background",

  showClock: false,
  clockStyle: "compact",
  clockFontSize: "14",
  clockPosition: "fly",

  intervalTimerEnabled: false,
  intervalTimerSound: "notificationSound1",
  intervalTimerVolume: 5,

  describeHuntingSmell: false,
  huntingVirtualJoystick: false,
  sizeHuntingVirtualJoystick: "150",

  climbingPanel: false,
  climbingPanelOrientation: "vertical",
  climbingPanelInputsStyle: "keyboard",
  climbingNotificationsNumbers: false,
  climbingRefreshNotification: false,
  climbingRefreshNotificationSound: "notificationSound1",
  climbingRefreshNotificationVolume: "5",

  cleaningLog: false,
  cleaningLogStyle: "smart",
  cleaningLogShowID: false,
  cleaningLogHeight: "120",

  catchingLog: false,
  catchingLogHeight: "120",

  myNameNotificationSound: "notificationSound2",
  notificationMyNameVolume: "5",

  userQuickLinks: "",
  historyHeight: "215",
  itemListHeight: "180",

  parametersColors: {
    dream: ["#008000", "#008000", "#ff0000", "#ff0000"],
    hunger: ["#008000", "#008000", "#ff0000", "#ff0000"],
    thirst: ["#008000", "#008000", "#ff0000", "#ff0000"],
    need: ["#008000", "#008000", "#ff0000", "#ff0000"],
    health: ["#008000", "#008000", "#ff0000", "#ff0000"],
    clean: ["#008000", "#008000", "#ff0000", "#ff0000"],

    smell: ["#008000", "#008000", "#cccccc", "#cccccc"],
    dig: ["#008000", "#008000", "#cccccc", "#cccccc"],
    swim: ["#008000", "#008000", "#cccccc", "#cccccc"],
    might: ["#008000", "#008000", "#cccccc", "#cccccc"],
    tree: ["#008000", "#008000", "#cccccc", "#cccccc"],
    observ: ["#008000", "#008000", "#cccccc", "#cccccc"],

    other: ["#008000", "#008000", "#cccccc", "#cccccc"],
  },
  parametersBackgroundImage: false,
  parametersUserBackgroundImage: false,
  parametersUserBackgroundImageURL: "",

  restoreBlogCreation: false,
  moreBBCodes: false,
  commentPreview: false,
  moreCommentButtons: false,
  lsWrapPreview: false,
  calculators: false,
  savingLS: false,

  extendedSettingsPanel: false,
  showUpdateNotification: false,
  showSplashScreens: false,
  extendedHints: true,
  GMbetaTest: false,
  personalCostumes: false,
  showCostumesButtons: false,
  blockItemDrop: false,

  unifiedStorage: false,
};

// ====================================================================================================================
//   . . . ТАРГЕТНЫЕ ССЫЛКИ . . .
// ====================================================================================================================
const targetCW3 = /^https?:\/\/\w?\.?catwar\.(?:net|su)\/cw3(?:\/)?(?:\?.*)?$/;
const targetCW3Hunt =
  /^https?:\/\/\w?\.?catwar\.(?:net|su)\/cw3\/jagd(?:\/)?(?:\?.*)?$/;
const targetCW3Kns =
  /^https?:\/\/(\w+\.)?catwar\.(net|su)\/cw3\/kns\/?(\?.*)?$/;

const targetSettings = /^https?:\/\/\w?\.?catwar\.(?:net|su)\/settings/;
const targetMainProfile = /^https?:\/\/\w?\.?catwar\.(?:net|su)\/$/;
const targetProfile = /^https?:\/\/\w?\.?catwar\.(?:net|su)\/cat\d+$/;
const targetLs = /^https?:\/\/\w?\.?catwar\.(?:net|su)\/ls/;
const targetLsNew = /^https?:\/\/\w?\.?catwar\.(?:net|su)\/ls\?new(=.*)?$/;
const targetChats = /^https?:\/\/\w?\.?catwar\.(?:net|su)\/chat/;
const targetBlog =
  /^https?:\/\/\w?\.?catwar\.(?:net|su)\/(?:blog\d+|blogs)(?:$|[/?#])/i;
const targetBlogsCreation =
  /^https?:\/\/\w?\.?catwar\.(?:net|su)\/blogs\?creation/;
const targetSniff =
  /^https?:\/\/\w?\.?catwar\.(?:net|su)\/sniff(?:\d+|)(?:$|[/?#])/i;
const targetSniffCreation =
  /^https?:\/\/\w?\.?catwar\.(?:net|su)\/sniff\?creation/;

// ====================================================================================================================
//   . . . СТАНДАРТНЫЕ ЦВЕТОВЫЕ ТЕМЫ . . .
// ====================================================================================================================
const defaultThemes = {
  "Тёмная Тема": {
    colors: {
      backgroundColor: "#161616",
      blocksColor: "#242424",
      chatColor: "#242424",
      textColor: "#d5d5d5",
      catTooltipBackground: "#242424",
      fightPanelBackground: "#242424",
      linkColor: "#d5d5d5",
      accentColor1: "#111111",
      accentColor2: "#2e2e2e82",
      accentColor3: "#fc872a",
      moveNameColor: "#d5d5d5",
      moveNameBackground: "#242424",
      climbingPanelBackground: "#242424",
    },
  },
};

// ====================================================================================================================
//   . . . HTML ПАНЕЛЬ НАСТРОЕК . . .
// ====================================================================================================================
const uwusettings =
  /* HTML */
  `
    <div id="uwusettings">
      <div id="uwusettings-header">
        <div id="uwusettings-header-glass">
          <div class="main-settings-container">
            <div id="settingsTheme" class="custom-select">
              <label for="settingsTheme">Тема настроек:</label>
              <div class="select-selected">Классическая</div>
              <div class="select-items">
                <!-- Опции будут добавлены сюда -->
              </div>
            </div>

            <h1>Настройки CatWar UwU</h1>
            <div class="link-container">
              <a
                href="https://vk.com/catwar_uwu"
                target="_blank"
                rel="noopener noreferrer"
                title="ВК Группа по Скрипту/Моду"
                style="margin-right: 10px; text-decoration: none;"
              >
                <img
                  src="https://raw.githubusercontent.com/Ibirtem/CatWar/main/images/VK_logo.png"
                  alt="VK"
                  width="40"
                  height="40"
                />
              </a>
              <a
                href="https://github.com/Ibirtem/CatWar"
                target="_blank"
                rel="noopener noreferrer"
                title="GitHub Репозиторий"
              >
                <img
                  src="https://raw.githubusercontent.com/Ibirtem/CatWar/main/images/icon_github.png"
                  alt="GitHub"
                  width="40"
                  height="40"
                />
              </a>
            </div>
          </div>

          <hr id="uwu-hr" class="uwu-hr-head" />
          <div id="button-container">
            <button id="effects-button" class="active">
              <h2>
                Природные эффекты
                <img
                  src="https://raw.githubusercontent.com/Ibirtem/CatWar/main/images/partly_sunny_rain.png"
                  alt="Иконка"
                  width="24"
                  height="24"
                />
              </h2>
            </button>
            <button id="theme-button">
              <h2>
                Оформление
                <img
                  src="https://raw.githubusercontent.com/Ibirtem/CatWar/main/images/sparkles.png"
                  alt="Иконка"
                  width="24"
                  height="24"
                />
              </h2>
            </button>
            <button id="utility-button">
              <h2>
                Инструментарий
                <img
                  src="https://raw.githubusercontent.com/Ibirtem/CatWar/main/images/flashlight.png"
                  alt="Иконка"
                  width="24"
                  height="24"
                />
              </h2>
            </button>
            <button id="modules-button">
              <h2>
                Надстройки
                <img
                  src="https://raw.githubusercontent.com/Ibirtem/CatWar/main/images/construction.png"
                  alt="Иконка"
                  width="24"
                  height="24"
                />
              </h2>
            </button>
            <button id="personal-costumes-button">
              <h2>
                Личные костюмы
                <img
                  src="https://raw.githubusercontent.com/Arisamiga/CatWar/refs/heads/Personal-Costumes/images/costumes.png"
                  alt="Иконка"
                  width="24"
                  height="24"
                />
              </h2>
            </button>
          </div>
          <hr id="uwu-hr" class="uwu-hr-head" />
        </div>
      </div>

      <div id="uwusettings-main">
        <div id="effects-panel">
          <h2>Природа и окружение</h2>

          <div>
            <p>
              Включает генерацию Динамичной погоды в Игровой, такие как дождь,
              снегопады или Северные Сияния.
            </p>
            <input
              type="checkbox"
              id="weather-enabled"
              data-setting="weatherEnabled"
            />
            <label for="weather-enabled">Показывать природные эффекты</label>
          </div>

          <div>
            <p>
              Сокращает количество частиц динамичной погоды, увеличивая тем
              самым производительность на слабых устройствах.
            </p>
            <input
              type="checkbox"
              id="low-Performance-Mode"
              data-setting="lowPerformanceMode"
            />
            <label for="low-Performance-Mode"
              >Режим низкой производительности</label
            >
          </div>

          <div>
            <p>
              Может немного повлиять на производительность из-за возрастания
              количества частиц на экране.
            </p>
            <input
              type="checkbox"
              id="weather-drops"
              data-setting="weatherDrops"
            />
            <label for="weather-drops">Эффекты приземления частиц</label>
          </div>

          <div>
            <p>
              Замена стандартных частиц на знакомые всеми пиксельные частицы.
            </p>
            <input
              type="checkbox"
              id="minecraft-style"
              data-setting="minecraftStyle"
            />
            <label for="minecraft-style-enabled">Minecraft частицы</label>
          </div>

          <div>
            <p>Убирает затемнение Игрового поля.</p>
            <input type="checkbox" id="always-day" data-setting="alwaysDay" />
            <label for="always-day">Всегда день/ярко</label>
          </div>

          <div>
            <p>
              Отображает панель Ручного управления погодой в ⚙️Панели
              Расширенных Настройках Игровой. Выключает натуральную генерацию
              погоды.
            </p>
            <input
              type="checkbox"
              id="manual-Weather-Panel"
              data-setting="manualWeatherPanel"
            />
            <label for="manual-Weather-Panel">Ручное управление погоды</label>
          </div>

          <hr id="uwu-hr" class="uwu-hr" />
          <p>Расположение Северного Сияния</p>
          <div id="auroraPanel">
            <input
              type="range"
              min="1"
              max="2"
              value="1"
              class="uwu-range-slider"
              id="aurora-pos"
              list="auroraStep"
              data-setting="auroraPos"
            />
            <datalist id="auroraStep">
              <option value="1">Верх</option>
              <option value="2">Низ</option>
            </datalist>
          </div>

          <div>
            <p>
              Делает небо шапкой страницы, пряча под игровую, а так же по факту
              чинит его потерю при Редизайне игровой. Будет выглядеть не очень
              на широкоформатных мониторах из-за растягивания изображения.
            </p>
            <input
              type="checkbox"
              id="sky-in-the-sky"
              data-setting="skyInHeader"
            />
            <label for="sky-in-the-sky">Небо в небе.</label>
          </div>

          <hr id="uwu-hr" class="uwu-hr" />
          <p>
            Z-index Погоды. Позволяет настроить, будут ли эффекты отображаться
            поверх или позади игровых элементов.
          </p>
          <div id="weatherZIndexPanel">
            <input
              type="range"
              min="-1"
              max="1"
              value="0"
              class="uwu-range-slider"
              id="weather-z-index"
              list="weatherZIndexStep"
              data-setting="weatherZIndex"
            />
            <datalist id="weatherZIndexStep">
              <option value="-1">За блоками</option>
              <option value="0">Стандарт</option>
              <option value="1">Перед блоками</option>
            </datalist>
          </div>
        </div>

        <div id="theme-panel">
          <h2>Поле Игровой</h2>

          <div>
            <p>
              Заменяет все фоны игровых локаций на выбранный вами фон. Помните,
              что для правильного отображения нужно изображение 1000х1000 px.
            </p>
            <input
              type="checkbox"
              id="game-Field-background-User"
              data-setting="gameFieldBackgroundUser"
            />
            <label for="game-Field-background-User-enabled"
              >Статичный фон локации:</label
            >
            <input
              type="text"
              id="gameFieldSettingImageURLField"
              placeholder="Вставьте URL"
              data-setting="gameFieldBackgroundUserImageURL"
            />
            <button id="SettingSaveButton1" class="uwu-button install-button">
              Сохранить
            </button>
          </div>

          <div>
            <p>Отрисовывает границы клеток Игрового поля.</p>
            <input
              type="checkbox"
              id="cells-Borders"
              data-setting="cellsBorders"
            />
            <label for="cells-Borders">Границы клеток</label>
          </div>
          <p>Толщина/Яркость границ</p>
          <div id="step-slider">
            <input
              type="range"
              min="1"
              max="9"
              value="1"
              id="cells-Borders-Thickness"
              class="uwu-range-slider"
              list="ThicknessStep"
              data-setting="cellsBordersThickness"
            />
            <datalist id="ThicknessStep">
              <option value="1">0.1</option>
              <option value="5">0.5</option>
              <option value="9">0.9</option>
            </datalist>
          </div>
          <div>
            <label for="cells-Borders-Color">Цвет границы клеток</label>
            <input
              type="color"
              id="cells-Borders-Color"
              data-setting="cellsBordersColor"
              value="#ffffff"
            />
          </div>

          <div>
            <p>Обозначает клетки Игрового поля числами.</p>
            <input
              type="checkbox"
              id="cells-Numbers"
              data-setting="cellsNumbers"
            />
            <label for="cells-Numbers">Нумерация клеток</label>
          </div>

          <div>
            <p>
              Ставит на страницу фон, повторяющий фон Игровой локации, а так же
              размывает и затемняет его.
            </p>
            <input
              type="checkbox"
              id="background-repeat"
              data-setting="backgroundRepeat"
            />
            <label for="weather-enabled">Фон страницы из локации</label>
          </div>

          <div>
            <p>Ставит на страницу фон из предоставленной ссылки.</p>
            <input
              type="checkbox"
              id="background-user"
              data-setting="backgroundUser"
            />
            <label for="background-user-enabled">Свой фон страницы:</label>
            <input
              type="text"
              id="SettingImageURLField"
              placeholder="Вставьте URL"
              data-setting="backgroundUserImageURL"
            />
            <button id="SettingSaveButton1" class="uwu-button install-button">
              Сохранить
            </button>
          </div>

          <div>
            <p>
              Позволяет быстро сменять полезные стили в ⚙️Панели Расширенных
              настроек в Игровой.
            </p>
            <input type="checkbox" id="fast-Styles" data-setting="fastStyles" />
            <label for="fast-Styles">Быстрые стили</label>
            <label
              id="uwu-what-this"
              title="
            — Не показывать всплывающее окно 'О коте'
            — Скрыть Игровое поле
            — Скрыть фон Игрового Поля
            — Скрыть Небо
            — Всегда день/ярко
            — Границы клеток
            "
              >[?]</label
            >
          </div>

          <hr id="uwu-hr" class="uwu-hr" />
          <h2>Дефекты</h2>

          <div>
            <p>Добавляет котам иконки их дефектов (раны, грязь и т.д.).</p>
            <input
              type="checkbox"
              id="show-defects-enabled"
              data-setting="showDefectsEnabled"
            />
            <label for="show-defects-enabled">Показывать иконки дефектов</label>
          </div>

          <div>
            <p>Выберите стиль отображения иконок дефектов.</p>
            <label>Стиль иконок:</label>
            <div class="custom-select" id="defectsStyle">
              <div class="select-selected">Стандартный</div>
              <div class="select-items">
                <!-- Опции будут добавлены сюда -->
              </div>
            </div>
          </div>

          <div>
            <p>Выберите качество иконок дефектов.</p>
            <label>Качество иконок:</label>
            <div class="custom-select" id="defectsQuality">
              <div class="select-selected">Высокое/Новое</div>
              <div class="select-items">
                <!-- Опции будут добавлены сюда -->
              </div>
            </div>
          </div>

          <hr id="uwu-hr" class="uwu-hr" />
          <h2>Темы и цвета Игровой</h2>

          <p>
            Здесь вы можете выставить собственные цвета для игровой. Принимаются
            "HEX" значения (Пример: #000) с поддержкой прозрачности. Будьте
            аккуратны и не забывайте выключать другие цвета/темы в других
            скриптах/модах. Очистите поле чтобы вернуться к стандартным цветам.
          </p>
          <input type="checkbox" id="user-theme" data-setting="userTheme" />
          <label for="user-theme-enabled">Использовать свои цвета</label>

          <div id="theme-selector" class="uwu-select">
            <label for="theme-select">Выберите тему:</label>
            <select id="theme-select" class="uwu-select-selected"></select>
            <button id="addThemeButton" class="uwu-button install-button">
              Добавить тему
            </button>
            <button
              id="removeThemeButton"
              style="display: none;"
              class="uwu-button remove-button"
            >
              Удалить тему
            </button>
          </div>

          <div id="color-picker">
            <div id="color-picker-input">
              <input
                type="text"
                id="backgroundColorField"
                placeholder="Вставьте HEX код"
                data-color="backgroundColor"
              />
              <label>Цвет фона</label>
            </div>
            <div id="color-picker-input">
              <input
                type="text"
                id="blocksColorField"
                placeholder="Вставьте HEX код"
                data-color="blocksColor"
              />
              <label>Основной цвет блоков</label>
            </div>
            <div id="color-picker-input">
              <input
                type="text"
                id="chatColorField"
                placeholder="Вставьте HEX код"
                data-color="chatColor"
              />
              <label>Основной цвет чата</label>
            </div>
            <div id="color-picker-input">
              <input
                type="text"
                id="SettingTextColorField"
                placeholder="Вставьте HEX код"
                data-color="textColor"
              />
              <label>Цвет текста</label>
            </div>
            <div id="color-picker-input">
              <input
                type="text"
                id="colorField"
                placeholder="Вставьте HEX код"
                data-color="linkColor"
              />
              <label>Цвет ссылок</label>
            </div>
            <div id="color-picker-input">
              <input
                type="text"
                id="catTooltipBackgroundField"
                placeholder="Вставьте HEX код"
                data-color="catTooltipBackground"
              />
              <label>Цвет фона подсказки "О Коте"</label>
            </div>
            <div id="color-picker-input">
              <input
                type="text"
                id="settingFightPanelBackgroundField"
                placeholder="Вставьте HEX код"
                data-color="fightPanelBackground"
              />
              <label>Цвет панели Боевого режима</label>
            </div>
            <div id="color-picker-input">
              <input
                type="text"
                id="settingsMoveNameColorField"
                placeholder="Вставьте HEX код"
                data-color="moveNameColor"
              />
              <label>Цвет текста перехода</label>
            </div>
            <div id="color-picker-input">
              <input
                type="text"
                id="settingsMoveNameBackgroundField"
                placeholder="Вставьте HEX код"
                data-color="moveNameBackground"
              />
              <label>Цвет фона перехода</label>
            </div>
            <div id="color-picker-input">
              <input
                type="text"
                id="settingsclimbingPanelBackgroundField"
                placeholder="Вставьте HEX код"
                data-color="climbingPanelBackground"
              />
              <label>Цвет фона Минного Поля</label>
            </div>
            <div id="color-picker-input">
              <input
                type="text"
                id="accentColorField1"
                placeholder="Вставьте HEX код"
                data-color="accentColor1"
              />
              <label
                title="В основном всякие кнопки, слайдеры и строки ввода + цвет букв упоминания вас в Чате. Старайтесь пока делать просто оттенки чёрного цвета."
                >[?] Акценты 1</label
              >
            </div>
            <div id="color-picker-input">
              <input
                type="text"
                id="accentColorField2"
                placeholder="Вставьте HEX код"
                data-color="accentColor2"
              />
              <label
                title="Линии в чате и некоторых других частях, кружочек слайдера громкости."
                >[?] Акценты 2</label
              >
            </div>
            <div id="color-picker-input">
              <input
                type="text"
                id="accentColorField3"
                placeholder="Вставьте HEX код"
                data-color="accentColor3"
              />
              <label title="Цвет уведомлений. Например ЛС и вашего имени в Чате"
                >[?] Акценты 3</label
              >
            </div>

            <div style="flex: 0 0 100%">
              <button id="saveThemeButton" class="uwu-button install-button">
                Сохранить
              </button>
              <p>
                Отличный сайт для выбора цветов с поддержкой прозрачности:
                <a href="https://get-color.ru/transparent/" target="_blank"
                  >https://get-color.ru/transparent/</a
                >
              </p>
            </div>
          </div>

          <div>
            <p>Применяет вашу тему и на конструктор окрасов.</p>
            <input
              type="checkbox"
              id="user-theme"
              data-setting="userThemeKns"
            />
            <label for="user-theme-enabled">Цвета в конструкторе окрасов</label>
          </div>

          <hr id="uwu-hr" class="uwu-hr" />
          <h2>Шрифты и текст</h2>

          <div>
            <p>Кастомная настройка шрифтов в Игровой</p>
            <input
              type="checkbox"
              id="use-User-Fonts"
              data-setting="useUserFonts"
            />
            <label for="use-User-Fonts">Свой шрифт</label>
          </div>

          <div>
            <input
              type="text"
              id="font-Size-Body"
              placeholder="14"
              data-font-size="fontSizeBody"
            />
            <label for="font-Size-Body">px; Размер общего шрифт</label>
          </div>

          <div>
            <input
              type="text"
              id="font-Size-Small"
              placeholder="12"
              data-font-size="fontSizeSmall"
            />
            <label for="font-Size-Small"
              >px; Размер шрифта быстрых ссылок</label
            >
          </div>

          <div>
            <input
              type="text"
              id="font-Size-Location"
              placeholder="14"
              data-font-size="fontSizeLocation"
            />
            <label for="font-Size-Location">px; Размер шрифта локации</label>
          </div>

          <div>
            <p>
              Подгрузка шрифта идёт автоматически. Для поиска возможных шрифтов,
              воспользуйтесь сайтом:
              <a href="https://fonts.google.com/?lang=ru_Cyrl" target="_blank"
                >https://fonts.google.com/?lang=ru_Cyrl</a
              >
            </p>
            <input
              type="text"
              id="font-Family-Body"
              placeholder="Verdana"
              data-font-size="fontFamilyBody"
            />
            <label for="font-Family-Body">Название вида шрифта</label>
          </div>

          <details>
            <summary
              style="cursor: pointer; font-size: 16px; font-weight: bold;"
            >
              Настройка шрифта громкости сообщений в чате
            </summary>
            <div>
              <input
                type="text"
                id="vlm0"
                placeholder="10"
                data-font-size="vlm0"
              />
              <label for="vlm0">px; Громкость 0 (Самый тихий)</label>
            </div>
            <div>
              <input
                type="text"
                id="vlm1"
                placeholder="11"
                data-font-size="vlm1"
              />
              <label for="vlm1">px; Громкость 1</label>
            </div>
            <div>
              <input
                type="text"
                id="vlm2"
                placeholder="11.5"
                data-font-size="vlm2"
              />
              <label for="vlm2">px; Громкость 2</label>
            </div>
            <div>
              <input
                type="text"
                id="vlm3"
                placeholder="12"
                data-font-size="vlm3"
              />
              <label for="vlm3">px; Громкость 3</label>
            </div>
            <div>
              <input
                type="text"
                id="vlm4"
                placeholder="12.5"
                data-font-size="vlm4"
              />
              <label for="vlm4">px; Громкость 4</label>
            </div>
            <div>
              <input
                type="text"
                id="vlm5"
                placeholder="13"
                data-font-size="vlm5"
              />
              <label for="vlm5">px; Громкость 5 (Стандартная громкость)</label>
            </div>
            <div>
              <input
                type="text"
                id="vlm6"
                placeholder="15"
                data-font-size="vlm6"
              />
              <label for="vlm6">px; Громкость 6</label>
            </div>
            <div>
              <input
                type="text"
                id="vlm7"
                placeholder="17"
                data-font-size="vlm7"
              />
              <label for="vlm7">px; Громкость 7</label>
            </div>
            <div>
              <input
                type="text"
                id="vlm8"
                placeholder="19"
                data-font-size="vlm8"
              />
              <label for="vlm8">px; Громкость 8</label>
            </div>
            <div>
              <input
                type="text"
                id="vlm9"
                placeholder="21"
                data-font-size="vlm9"
              />
              <label for="vlm9">px; Громкость 9</label>
            </div>
            <div>
              <input
                type="text"
                id="vlm10"
                placeholder="23"
                data-font-size="vlm10"
              />
              <label for="vlm10">px; Громкость 10 (Самая громкая)</label>
            </div>
          </details>

          <hr id="uwu-hr" class="uwu-hr" />
          <h2>Редизайны Игровой</h2>

          <p>
            Тот самый знаменитный редизайн, но с почти более расширенной
            кастомизацией.
          </p>
          <input
            type="checkbox"
            id="custom-layout"
            data-setting="customLayout"
          />
          <label for="custom-layout">Компактный редизайн</label>

          <div id="layout-customizer">
            <div id="layout-preview">
              <div class="column left">
                <!-- Левая колонка -->
              </div>
              <div class="column center">
                <!-- Центральная колонка -->
                <div class="block center-block">Поле Игровой</div>
              </div>
              <div class="column right">
                <!-- Правая колонка -->
              </div>
              <ul id="block-list">
                <!-- Элементы списка блоков -->
              </ul>
            </div>
            <button id="reset-layout-button" class="uwu-button remove-button">
              Сбросить
            </button>
          </div>

          <div>
            <input
              type="text"
              id="chat-height"
              placeholder="Вставьте значение"
              data-setting="chatHeight"
            />
            <label for="chat-height">px; Высота Чата</label>
          </div>

          <div>
            <input
              type="text"
              id="history-height"
              placeholder="Вставьте значение"
              data-setting="historyHeight"
            />
            <label for="history-height">px; Высота Истории</label>
          </div>

          <div>
            <input
              type="text"
              id="item-list-height"
              placeholder="Вставьте значение"
              data-setting="itemListHeight"
            />
            <label for="item-list-height">px; Высота инвентаря</label>
          </div>

          <label>Отображать Душевых котов:</label>
          <div class="custom-select" id="showOtherCatsList">
            <div class="select-selected">
              Выберите стиль отображения Душевых котов
            </div>
            <div class="select-items">
              <!-- Опции будут добавлены сюда -->
            </div>
          </div>

          <div>
            <p>
              Визуальное разделение блока "Информация" на меньшие блоки
              "Параметров, Истории и Родственные связи".
            </p>
            <input
              type="checkbox"
              id="slice-info-block"
              data-setting="sliceInfoBlock"
            />
            <label for="slice-info-block">Разделить блок Информации</label>
          </div>

          <div>
            <p>Скругляет края блоков в Игровой.</p>
            <input
              type="checkbox"
              id="edge-trim-blocks"
              data-setting="edgeTrimBlocks"
            />
            <label for="edge-trim-blocks">Скругление блоков</label>
          </div>

          <hr id="uwu-hr" class="uwu-hr" />
          <h2>Остальные редизайны</h2>

          <div>
            <p>
              Добавляет изображение костюмов в строки для наглядного отображения
              и упрощённого поиска. Вы можете вытянуть высоту столбцов за их
              стрелочки в нижнем правом краю!
            </p>
            <input
              type="checkbox"
              id="redesign-Costums-Settings"
              data-setting="redesignCostumsSettings"
            />
            <label for="redesign-Costums-Settings"
              >Редизайн Настройки костюмов</label
            >
          </div>

          <hr id="uwu-hr" class="uwu-hr" />
          <h2>Общение</h2>

          <div>
            <p>
              Добавляет аватар с профиля отправителя на его комментарий в лентах
              и блогах.
            </p>
            <input
              type="checkbox"
              id="comments-avatars"
              data-setting="commentsAvatars"
            />
            <label for="comments-avatars">Аватарки в комментариях</label>
          </div>

          <div>
            <p>
              Более функциональный Чат: допись ID отправителя и звуковое
              уведомление при вашем упоминании.
            </p>
            <input type="checkbox" id="new-chat" data-setting="newChat" />
            <label for="new-chat">Современный Чат</label>
          </div>

          <div>
            <p>
              При клике на имя кота в строку чата будет выставляться его имя с
              запятой.
            </p>
            <input
              type="checkbox"
              id="add-comma-after-nick"
              data-setting="addCommaAfterNick"
            />
            <label for="add-comma-after-nick">Обращение с запятой</label>
          </div>

          <div>
            <p>
              Работает только с "Современным чатом". Отображет чат снизу вверх,
              а так же смещает окно ввода сообщения под чат.
            </p>
            <input
              type="checkbox"
              id="reverse-Chat"
              data-setting="reverseChat"
            />
            <label for="reverse-Chat">Инверсия чата</label>
          </div>

          <div id="myNameNotificationSoundContainer">
            <div class="custom-select" id="myNameNotificationSound">
              <div class="select-selected">Выберите звук</div>
              <div class="select-items">
                <!-- Опции будут добавлены сюда -->
              </div>
            </div>

            <div id="notification-volume">
              <p>Громкость</p>
              <input
                type="range"
                min="1"
                max="10"
                value="5"
                class="uwu-range-slider"
                id="notification-MyName-Volume"
                list="volumeStep"
                data-setting="notificationMyNameVolume"
              />
              <datalist id="volumeStep">
                <option value="1">10%</option>
                <option value="10">100%</option>
              </datalist>
            </div>
          </div>

          <div>
            <p>
              Ваши собственные имена и клички на упоминания в чате. Просто
              пропишите их через запятую. Пример: Мяу, Мяуич, МяуВкин
            </p>
            <input
              type="text"
              id="names-For-Notification"
              placeholder=". . ."
              data-setting="namesForNotification"
            />
          </div>

          <div>
            <p>
              Более удобная строка ввода сообщений над чатом с возможностью
              растягивания. Пока что насильно берёт цвета с "Использовать свои
              цвета".
            </p>
            <input
              type="checkbox"
              id="new-chat-input"
              data-setting="newChatInput"
            />
            <label for="new-chat-input"
              >Альтернативная строка ввода сообщений</label
            >
          </div>
          <div>
            <p>Отображает счётчик символов в строке ввода Современного Чата.</p>
            <input
              type="checkbox"
              id="show-chat-char-counter"
              data-setting="showChatCharCounter"
            />
            <label for="show-chat-char-counter"
              >Показывать счётчик символов в чате</label
            >
          </div>

          <hr id="uwu-hr" class="uwu-hr" />
          <h2>Параметры и навыки</h2>

          <!--
      <div>
        <p>Параметр наглядно отображает рядом с собой свой процент.</p>
        <input type="checkbox" id="display-Parameters-Percentages" data-setting="displayParametersPercentages" />
        <label for="display-Parameters-Percentages">Отображать проценты Параметров</label>
      </div>
      -->

          <div>
            <p>Заменяет стандартное оформление Параметров и Навыков на ваш.</p>
            <input
              type="checkbox"
              id="user-Parameters-Theme"
              data-setting="userParametersTheme"
            />
            <label for="user-Parameters-Theme"
              >Использовать своё оформление</label
            >
          </div>

          <div id="parameters-color-settings" class="parameters-color-settings">
            <table class="parameters-color-table">
              <thead>
                <tr>
                  <th class="parameters-color-table--header">Градиент</th>
                  <th class="parameters-color-table--header">От</th>
                  <th class="parameters-color-table--header">До</th>
                  <th class="parameters-color-table--header">От</th>
                  <th class="parameters-color-table--header">До</th>
                </tr>
              </thead>
              <tbody
                id="color-settings-body"
                class="parameters-color-table--body"
              >
                <tr>
                  <th class="parameters-color-table--cell" colspan="5">
                    Параметры
                  </th>
                </tr>
                <tr>
                  <td class="parameters-color-table--cell">Сон</td>
                  <td class="parameters-color-table--cell">
                    <input
                      type="color"
                      data-param="dream"
                      data-color-type="bar-from"
                    />
                  </td>
                  <td class="parameters-color-table--cell">
                    <input
                      type="color"
                      data-param="dream"
                      data-color-type="bar-to"
                    />
                  </td>
                  <td class="parameters-color-table--cell">
                    <input
                      type="color"
                      data-param="dream"
                      data-color-type="bg-from"
                    />
                  </td>
                  <td class="parameters-color-table--cell">
                    <input
                      type="color"
                      data-param="dream"
                      data-color-type="bg-to"
                    />
                  </td>
                </tr>
                <tr>
                  <td class="parameters-color-table--cell">Голод</td>
                  <td class="parameters-color-table--cell">
                    <input
                      type="color"
                      data-param="hunger"
                      data-color-type="bar-from"
                    />
                  </td>
                  <td class="parameters-color-table--cell">
                    <input
                      type="color"
                      data-param="hunger"
                      data-color-type="bar-to"
                    />
                  </td>
                  <td class="parameters-color-table--cell">
                    <input
                      type="color"
                      data-param="hunger"
                      data-color-type="bg-from"
                    />
                  </td>
                  <td class="parameters-color-table--cell">
                    <input
                      type="color"
                      data-param="hunger"
                      data-color-type="bg-to"
                    />
                  </td>
                </tr>
                <tr>
                  <td class="parameters-color-table--cell">Жажда</td>
                  <td class="parameters-color-table--cell">
                    <input
                      type="color"
                      data-param="thirst"
                      data-color-type="bar-from"
                    />
                  </td>
                  <td class="parameters-color-table--cell">
                    <input
                      type="color"
                      data-param="thirst"
                      data-color-type="bar-to"
                    />
                  </td>
                  <td class="parameters-color-table--cell">
                    <input
                      type="color"
                      data-param="thirst"
                      data-color-type="bg-from"
                    />
                  </td>
                  <td class="parameters-color-table--cell">
                    <input
                      type="color"
                      data-param="thirst"
                      data-color-type="bg-to"
                    />
                  </td>
                </tr>
                <tr>
                  <td class="parameters-color-table--cell">Нужда</td>
                  <td class="parameters-color-table--cell">
                    <input
                      type="color"
                      data-param="need"
                      data-color-type="bar-from"
                    />
                  </td>
                  <td class="parameters-color-table--cell">
                    <input
                      type="color"
                      data-param="need"
                      data-color-type="bar-to"
                    />
                  </td>
                  <td class="parameters-color-table--cell">
                    <input
                      type="color"
                      data-param="need"
                      data-color-type="bg-from"
                    />
                  </td>
                  <td class="parameters-color-table--cell">
                    <input
                      type="color"
                      data-param="need"
                      data-color-type="bg-to"
                    />
                  </td>
                </tr>
                <tr>
                  <td class="parameters-color-table--cell">Здоровье</td>
                  <td class="parameters-color-table--cell">
                    <input
                      type="color"
                      data-param="health"
                      data-color-type="bar-from"
                    />
                  </td>
                  <td class="parameters-color-table--cell">
                    <input
                      type="color"
                      data-param="health"
                      data-color-type="bar-to"
                    />
                  </td>
                  <td class="parameters-color-table--cell">
                    <input
                      type="color"
                      data-param="health"
                      data-color-type="bg-from"
                    />
                  </td>
                  <td class="parameters-color-table--cell">
                    <input
                      type="color"
                      data-param="health"
                      data-color-type="bg-to"
                    />
                  </td>
                </tr>
                <tr>
                  <td class="parameters-color-table--cell">Чистота</td>
                  <td class="parameters-color-table--cell">
                    <input
                      type="color"
                      data-param="clean"
                      data-color-type="bar-from"
                    />
                  </td>
                  <td class="parameters-color-table--cell">
                    <input
                      type="color"
                      data-param="clean"
                      data-color-type="bar-to"
                    />
                  </td>
                  <td class="parameters-color-table--cell">
                    <input
                      type="color"
                      data-param="clean"
                      data-color-type="bg-from"
                    />
                  </td>
                  <td class="parameters-color-table--cell">
                    <input
                      type="color"
                      data-param="clean"
                      data-color-type="bg-to"
                    />
                  </td>
                </tr>
                <tr>
                  <th class="parameters-color-table--cell" colspan="5">
                    Навыки
                  </th>
                </tr>
                <tr>
                  <td class="parameters-color-table--cell">Запах</td>
                  <td class="parameters-color-table--cell">
                    <input
                      type="color"
                      data-param="smell"
                      data-color-type="bar-from"
                    />
                  </td>
                  <td class="parameters-color-table--cell">
                    <input
                      type="color"
                      data-param="smell"
                      data-color-type="bar-to"
                    />
                  </td>
                  <td class="parameters-color-table--cell">
                    <input
                      type="color"
                      data-param="smell"
                      data-color-type="bg-from"
                    />
                  </td>
                  <td class="parameters-color-table--cell">
                    <input
                      type="color"
                      data-param="smell"
                      data-color-type="bg-to"
                    />
                  </td>
                </tr>
                <tr>
                  <td class="parameters-color-table--cell">Копание</td>
                  <td class="parameters-color-table--cell">
                    <input
                      type="color"
                      data-param="dig"
                      data-color-type="bar-from"
                    />
                  </td>
                  <td class="parameters-color-table--cell">
                    <input
                      type="color"
                      data-param="dig"
                      data-color-type="bar-to"
                    />
                  </td>
                  <td class="parameters-color-table--cell">
                    <input
                      type="color"
                      data-param="dig"
                      data-color-type="bg-from"
                    />
                  </td>
                  <td class="parameters-color-table--cell">
                    <input
                      type="color"
                      data-param="dig"
                      data-color-type="bg-to"
                    />
                  </td>
                </tr>
                <tr>
                  <td class="parameters-color-table--cell">Плавание</td>
                  <td class="parameters-color-table--cell">
                    <input
                      type="color"
                      data-param="swim"
                      data-color-type="bar-from"
                    />
                  </td>
                  <td class="parameters-color-table--cell">
                    <input
                      type="color"
                      data-param="swim"
                      data-color-type="bar-to"
                    />
                  </td>
                  <td class="parameters-color-table--cell">
                    <input
                      type="color"
                      data-param="swim"
                      data-color-type="bg-from"
                    />
                  </td>
                  <td class="parameters-color-table--cell">
                    <input
                      type="color"
                      data-param="swim"
                      data-color-type="bg-to"
                    />
                  </td>
                </tr>
                <tr>
                  <td class="parameters-color-table--cell">БУ</td>
                  <td class="parameters-color-table--cell">
                    <input
                      type="color"
                      data-param="might"
                      data-color-type="bar-from"
                    />
                  </td>
                  <td class="parameters-color-table--cell">
                    <input
                      type="color"
                      data-param="might"
                      data-color-type="bar-to"
                    />
                  </td>
                  <td class="parameters-color-table--cell">
                    <input
                      type="color"
                      data-param="might"
                      data-color-type="bg-from"
                    />
                  </td>
                  <td class="parameters-color-table--cell">
                    <input
                      type="color"
                      data-param="might"
                      data-color-type="bg-to"
                    />
                  </td>
                </tr>
                <tr>
                  <td class="parameters-color-table--cell">Лазание</td>
                  <td class="parameters-color-table--cell">
                    <input
                      type="color"
                      data-param="tree"
                      data-color-type="bar-from"
                    />
                  </td>
                  <td class="parameters-color-table--cell">
                    <input
                      type="color"
                      data-param="tree"
                      data-color-type="bar-to"
                    />
                  </td>
                  <td class="parameters-color-table--cell">
                    <input
                      type="color"
                      data-param="tree"
                      data-color-type="bg-from"
                    />
                  </td>
                  <td class="parameters-color-table--cell">
                    <input
                      type="color"
                      data-param="tree"
                      data-color-type="bg-to"
                    />
                  </td>
                </tr>
                <tr>
                  <td class="parameters-color-table--cell">Зоркость</td>
                  <td class="parameters-color-table--cell">
                    <input
                      type="color"
                      data-param="observ"
                      data-color-type="bar-from"
                    />
                  </td>
                  <td class="parameters-color-table--cell">
                    <input
                      type="color"
                      data-param="observ"
                      data-color-type="bar-to"
                    />
                  </td>
                  <td class="parameters-color-table--cell">
                    <input
                      type="color"
                      data-param="observ"
                      data-color-type="bg-from"
                    />
                  </td>
                  <td class="parameters-color-table--cell">
                    <input
                      type="color"
                      data-param="observ"
                      data-color-type="bg-to"
                    />
                  </td>
                </tr>
                <tr>
                  <th class="parameters-color-table--cell" colspan="5">
                    Уникальные навыки
                  </th>
                </tr>
                <tr>
                  <td class="parameters-color-table--cell"></td>
                  <td class="parameters-color-table--cell">
                    <input
                      type="color"
                      data-param="other"
                      data-color-type="bar-from"
                    />
                  </td>
                  <td class="parameters-color-table--cell">
                    <input
                      type="color"
                      data-param="other"
                      data-color-type="bar-to"
                    />
                  </td>
                  <td class="parameters-color-table--cell">
                    <input
                      type="color"
                      data-param="other"
                      data-color-type="bg-from"
                    />
                  </td>
                  <td class="parameters-color-table--cell">
                    <input
                      type="color"
                      data-param="other"
                      data-color-type="bg-to"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div>
            <p>Импорт/Экспорт настроек цветов параметров и навыков.</p>
            <input
              type="text"
              id="param-colors-export-field"
              placeholder="Экспорт"
              readonly
            />
            <input
              type="text"
              id="param-colors-import-field"
              placeholder="Импорт"
            />
            <button
              id="param-colors-import-btn"
              class="uwu-button install-button"
            >
              Вставить
            </button>
          </div>

          <div>
            <p>Накладывает поверх цветов изображение с узорами.</p>
            <input
              type="checkbox"
              id="parameters-Background-Image"
              data-setting="parametersBackgroundImage"
            />
            <label for="parameters-Background-Image">Узоры</label>
          </div>

          <div>
            <p>Накладывает поверх уже ваше изображение.</p>
            <input
              type="checkbox"
              id="parameters-User-Background-Image"
              data-setting="parametersUserBackgroundImage"
            />
            <label for="parameters-User-Background-Image">Свои узоры:</label>
            <input
              type="text"
              id="parametersUserBackgroundImageField"
              placeholder="Вставьте URL"
              data-setting="parametersUserBackgroundImageURL"
            />
            <button id="SettingSaveButton1" class="uwu-button install-button">
              Сохранить
            </button>
          </div>
        </div>

        <div id="utility-panel">
          <h2>Подсветка</h2>

          <div>
            <p>Подсвечивает обводкой клетки полезные, и не очень, ресурсы</p>
            <input
              type="checkbox"
              id="highlight-Resources"
              data-setting="highlightResources"
            />
            <label for="highlight-Resources">Подсветка ресурсов</label>
          </div>

          <label>Стиль подсветки предметов:</label>
          <div class="custom-select" id="highlightResourcesStyle">
            <div class="select-selected">
              Выберите стиль подсветки предметов
            </div>
            <div class="select-items">
              <!-- Опции будут добавлены сюда -->
            </div>
          </div>
          <label
            id="uwu-what-this"
            title="Стиль 'Фон' подсвечивает всю клетку и не нагружает Игровую. Стиль 'Свечение' дублирует содержимое ячейки и стилизует его, что может нагружать Игровую."
            >[?]</label
          >

          <table class="uwu-table-highlight-Resources">
            <thead>
              <tr>
                <th>Название</th>
                <th>Цвет</th>
                <th>Подсвечивать?</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Травы</td>
                <td>
                  <input
                    type="color"
                    class="uwu-color-picker"
                    data-resource="Травы"
                    value="#90EE90"
                  />
                </td>
                <td class="uwu-checkbox-cell">
                  <input
                    type="checkbox"
                    class="uwu-highlight-checkbox"
                    data-resource="Травы"
                  />
                </td>
              </tr>
              <tr>
                <td>Мох</td>
                <td>
                  <input
                    type="color"
                    class="uwu-color-picker"
                    data-resource="Мох"
                    value="#90EE90"
                  />
                </td>
                <td class="uwu-checkbox-cell">
                  <input
                    type="checkbox"
                    class="uwu-highlight-checkbox"
                    data-resource="Мох"
                  />
                </td>
              </tr>
              <tr>
                <td>Паутина</td>
                <td>
                  <input
                    type="color"
                    class="uwu-color-picker"
                    data-resource="Паутина"
                    value="#90EE90"
                  />
                </td>
                <td class="uwu-checkbox-cell">
                  <input
                    type="checkbox"
                    class="uwu-highlight-checkbox"
                    data-resource="Паутина"
                  />
                </td>
              </tr>
              <tr>
                <td>Пыль</td>
                <td>
                  <input
                    type="color"
                    class="uwu-color-picker"
                    data-resource="Пыль"
                    value="#DDA0DD"
                  />
                </td>
                <td class="uwu-checkbox-cell">
                  <input
                    type="checkbox"
                    class="uwu-highlight-checkbox"
                    data-resource="Пыль"
                  />
                </td>
              </tr>
              <tr>
                <td>Ветки, вьюнки, костоправы</td>
                <td>
                  <input
                    type="color"
                    class="uwu-color-picker"
                    data-resource="Ветки, вьюнки, костоправы"
                    value="#90EE90"
                  />
                </td>
                <td class="uwu-checkbox-cell">
                  <input
                    type="checkbox"
                    class="uwu-highlight-checkbox"
                    data-resource="Ветки, вьюнки, костоправы"
                  />
                </td>
              </tr>
              <tr>
                <td>Травящие предметы</td>
                <td>
                  <input
                    type="color"
                    class="uwu-color-picker"
                    data-resource="Травящие предметы"
                    value="#FF0000"
                  />
                </td>
                <td class="uwu-checkbox-cell">
                  <input
                    type="checkbox"
                    class="uwu-highlight-checkbox"
                    data-resource="Травящие предметы"
                  />
                </td>
              </tr>
              <tr>
                <td>Шаманские штучки</td>
                <td>
                  <input
                    type="color"
                    class="uwu-color-picker"
                    data-resource="Шаманские штучки"
                    value="#00BFFF"
                  />
                </td>
                <td class="uwu-checkbox-cell">
                  <input
                    type="checkbox"
                    class="uwu-highlight-checkbox"
                    data-resource="Шаманские штучки"
                  />
                </td>
              </tr>
            </tbody>
          </table>

          <hr class="uwu-hr-head" />

          <h2>Шаблоны</h2>

          <div>
            <p>
              Позволяет создавать и быстро использовать собственные шаблоны
              сообщений.
            </p>
            <input
              type="checkbox"
              id="show-Templates"
              data-setting="showTemplates"
            />
            <label for="show-Templates">Отображать шаблоны</label>
          </div>

          <table id="uwu-table-templates">
            <thead>
              <tr>
                <th>Сообщения</th>
                <th>Чаты</th>
                <th>Блоги и Лента</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="uwu-checkbox-cell">
                  <input type="checkbox" data-setting="templatesInLs" />
                </td>
                <td class="uwu-checkbox-cell">
                  <input type="checkbox" data-setting="templatesInChats" />
                </td>
                <td class="uwu-checkbox-cell">
                  <input
                    type="checkbox"
                    data-setting="templatesInBlogsAndSniffs"
                  />
                </td>
              </tr>
            </tbody>
          </table>

          <hr class="uwu-hr-head" />

          <h2>Боевой режим</h2>

          <div>
            <p>Позволяет перетаскивать панель Боевого режима за штучку.</p>
            <input
              type="checkbox"
              id="dragging-Fight-Panel"
              data-setting="draggingFightPanel"
            />
            <label for="dragging-Fight-Panel"
              >Перетаскивание панели Боевого режима</label
            >
          </div>

          <div>
            <p>Сокращает и прописывает количество повторяющихся ударов.</p>
            <input
              type="checkbox"
              id="compact-Fight-Log"
              data-setting="compactFightLog"
            />
            <label for="compact-Fight-Log">Компактный боевой лог</label>
          </div>

          <div>
            <p>Возможность растягивать высоту панели и её начальная высота.</p>
            <input
              type="checkbox"
              id="fight-Panel-Adjustable-Height"
              data-setting="fightPanelAdjustableHeight"
            />
            <label for="fight-Panel-Adjustable-Height"
              >Настраиваемая высота панели</label
            >
            <input
              type="text"
              id="fightPanelHeightField"
              placeholder=". . ."
              data-setting="fightPanelHeight"
            />
            <label>px; - Начальная высота панели</label>
          </div>

          <div>
            <p>
              Возможность перекрашивать и создавать команды в Панели Боевого
              Режима.
            </p>
            <input type="checkbox" id="Fight-Teams" data-setting="fightTeams" />
            <label for="fight-Teams">Команды в Боевом Режиме</label>
            <input
              type="text"
              id="fightTeamsPanelHightField"
              placeholder=". . ."
              data-setting="fightTeamsPanelHight"
            />
            <label>px; - Начальная высота панели Командного Боя</label>
          </div>

          <div>
            <p>
              Звуковое уведомление при нажатии/отжатии кнопки блокировании
              удара.
            </p>
            <input
              type="checkbox"
              id="notification-Block"
              data-setting="notificationBlock"
            />
            <label for="notification-Block">Звук блокирования</label>
            <div id="notificationBlockSoundContainer">
              <div class="custom-select" id="notificationBlockSound">
                <div class="select-selected">Выберите звук</div>
                <div class="select-items"></div>
              </div>
              <div id="notification-volume">
                <p>Громкость</p>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value="5"
                  class="uwu-range-slider"
                  id="notificationBlockVolume"
                  list="volumeStep"
                  data-setting="notificationBlockVolume"
                />
                <datalist id="volumeStep">
                  <option value="1">10%</option>
                  <option value="10">100%</option>
                </datalist>
              </div>
              <div id="notificationBlockContainer"></div>
            </div>
          </div>

          <table id="colorSettingsTable">
            <thead>
              <tr>
                <th></th>
                <th>Энергия</th>
                <th>Снесено</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Команда 1</td>
                <td>
                  <input
                    type="color"
                    data-team="1"
                    data-part="green"
                    value="#41cd70"
                  />
                </td>
                <td>
                  <input
                    type="color"
                    data-team="1"
                    data-part="red"
                    value="#cd4141"
                  />
                </td>
              </tr>
              <tr>
                <td>Команда 2</td>
                <td>
                  <input
                    type="color"
                    data-team="2"
                    data-part="green"
                    value="#c968ff"
                  />
                </td>
                <td>
                  <input
                    type="color"
                    data-team="2"
                    data-part="red"
                    value="#cd4141"
                  />
                </td>
              </tr>
              <tr>
                <td>Команда 3</td>
                <td>
                  <input
                    type="color"
                    data-team="3"
                    data-part="green"
                    value="#44bcff"
                  />
                </td>
                <td>
                  <input
                    type="color"
                    data-team="3"
                    data-part="red"
                    value="#cd4141"
                  />
                </td>
              </tr>
              <tr>
                <td>Команда 4</td>
                <td>
                  <input
                    type="color"
                    data-team="4"
                    data-part="green"
                    value="#FFFF00"
                  />
                </td>
                <td>
                  <input
                    type="color"
                    data-team="4"
                    data-part="red"
                    value="#cd4141"
                  />
                </td>
              </tr>
            </tbody>
          </table>

          <hr id="uwu-hr" class="uwu-hr" />
          <h2>Часы</h2>

          <div>
            <p>Показывать ли часы в Игровой?</p>
            <input
              type="checkbox"
              id="describe-show-clock"
              data-setting="showClock"
            />
            <label for="describe-show-clock">Часы в Игровой</label>
          </div>

          <label>Стиль часов:</label>
          <div class="custom-select" id="clockStyle">
            <div class="select-selected">Выберите стиль часов</div>
            <div class="select-items">
              <!-- Опции будут добавлены сюда -->
            </div>
          </div>

          <div><!-- Деление --></div>

          <label>Где вставлять часы:</label>
          <div class="custom-select" id="clockPosition">
            <div class="select-selected">Выберите положение часов</div>
            <div class="select-items">
              <!-- Опции будут добавлены сюда -->
            </div>
          </div>

          <div>
            <input
              type="checkbox"
              id="describe-clock-Moscow-Time"
              data-setting="clockMoscowTime"
            />
            <label for="describe-clock-Moscow-Time">Московское время</label>
          </div>

          <div>
            <p>Размер шрифта часов</p>
            <input
              type="text"
              id="clock-Font-Size"
              placeholder=". . ."
              data-setting="clockFontSize"
            />
          </div>

          <div>
            <button id="resetClockPosition" class="uwu-button remove-button">
              Сброс позиции часов
            </button>
          </div>
          <hr id="uwu-hr" class="uwu-hr" />
          <h2>Таймер-напоминалка</h2>
          <div>
            <p>
              Включает перетаскиваемое окно с таймером, который будет циклично
              воспроизводить звуковой сигнал через заданный интервал времени.
            </p>
            <input
              type="checkbox"
              id="interval-timer-enabled"
              data-setting="intervalTimerEnabled"
            />
            <label for="interval-timer-enabled"
              >Включить таймер-напоминалку</label
            >
          </div>
          <div id="intervalTimerContainer">
            <div class="custom-select" id="intervalTimerSound">
              <div class="select-selected">Выберите звук</div>
              <div class="select-items"></div>
            </div>
            <div id="notification-volume">
              <p>Громкость</p>
              <input
                type="range"
                min="1"
                max="10"
                value="5"
                class="uwu-range-slider"
                id="intervalTimerVolume"
                list="volumeStep"
                data-setting="intervalTimerVolume"
              />
              <datalist id="volumeStep">
                <option value="1">10%</option>
                <option value="10">100%</option>
              </datalist>
            </div>
          </div>
          <hr id="uwu-hr" class="uwu-hr" />
          <h2>Рот (инвентарь)</h2>
          <div>
            <p>
              Добавляет чекбокс для блокировки опускания предметов, сохраняя
              возможность его использовать.
            </p>
            <input
              type="checkbox"
              id="block-item-drop"
              data-setting="blockItemDrop"
            />
            <label for="block-item-drop">Блокировка опускания предмета</label>
          </div>
          <hr id="uwu-hr" class="uwu-hr" />
          <h2>Охота</h2>

          <div>
            <p>
              Дописывает на запахе, во время охоты, приближаетесь вы или
              отдаляетесь от цели, а так же включает таймер.
            </p>
            <input
              type="checkbox"
              id="describe-Hunting-Smell"
              data-setting="describeHuntingSmell"
            />
            <label for="describe-Hunting-Smell">Подсказки на запахе</label>
          </div>

          <hr id="uwu-hr" class="uwu-hr" />
          <h2>Джойстики</h2>

          <div>
            <p>
              Отображает Виртуальную сенсорную Джойстиковую кнопку для мобильных
              устройств во время охоты для более удобного управления.
            </p>
            <input
              type="checkbox"
              id="hunting-Virtual-Joystick"
              data-setting="huntingVirtualJoystick"
            />
            <label for="hunting-Virtual-Joystick"
              >Виртуальный джойстик для охоты</label
            >
            <input
              type="text"
              id="sizeHuntingVirtualJoystickField"
              placeholder=". . ."
              data-setting="sizeHuntingVirtualJoystick"
            />
            <label>px; - Размер Джойстика. Стандартный размер - 150 px;</label>
          </div>

          <hr id="uwu-hr" class="uwu-hr" />
          <h2>"О котах"</h2>

          <div>
            <p>
              Добавляет во всплывающее окно "О коте" кнопку "Подробнее" для
              просмотра большей полезной информации.
            </p>
            <input
              type="checkbox"
              id="show-More-Cat-Info"
              data-setting="showMoreCatInfo"
            />
            <label for="show-More-Cat-Info">Больше информации о Коте</label>
          </div>

          <div>
            <p>
              Сокращает и прописывает количество повторяющихся предметов в "О
              коте".
            </p>
            <input
              type="checkbox"
              id="compact-Mouth"
              data-setting="compactMouth"
            />
            <label for="compact-Mouth">Компактные инвентари</label>
          </div>

          <div>
            <p>
              Добавляет над собственными параметрами кнопку "Подробнее" для
              просмотра большей полезной информации.
            </p>
            <input
              type="checkbox"
              id="show-Parameter-Details"
              data-setting="showParametersDetails"
            />
            <label for="show-Parameter-Details">Подробные параметры</label>
          </div>

          <div>
            <p>
              Показывает дополнительную информацию в профиле кота, например БУ
              цифрой.
            </p>
            <input
              type="checkbox"
              id="more-Profile-Info"
              data-setting="moreProfileInfo"
            />
            <label for="more-Profile-Info">Больше информации в профиле</label>
          </div>

          <div>
            <p>Добавляет полезные калькуляторы для вычислений в профиля.</p>
            <input
              type="checkbox"
              id="calculators"
              data-setting="calculators"
            />
            <label for="calculators">Калькуляторы активностей и лун.</label>
          </div>

          <hr id="uwu-hr" class="uwu-hr" />
          <h2>Минное поле</h2>

          <div>
            <p>Включает окно для расчерчивания минного поля в Игровой.</p>
            <input
              type="checkbox"
              id="climbing-panel"
              data-setting="climbingPanel"
            />
            <label for="climbing-panel">Минное поле</label>
            <p>
              Здесь вы можете добавить/удалить Вкладки для хранения Таблиц и
              количество самих таблиц в выбранной вкладке.
            </p>
            <h4>Вкладки</h4>
            <div id="uwu-buttonRow1-settings"></div>
            <h4>Локации / Таблицы</h4>
            <div id="uwu-buttonRow2-settings"></div>
          </div>

          <label>Дизайн окна минного поля:</label>
          <div class="custom-select" id="climbingPanelOrientation">
            <div class="select-selected">Вертикальный</div>
            <div class="select-items">
              <!-- Опции будут добавлены сюда -->
            </div>
          </div>

          <p>
            Как вводить с клавиатуры: ЛКМ - выбрать клетку. С клавиатуры мины
            ставятся от "0" до "7". Знак "минус" ( - ) равняется красной клетке,
            а "равно" ( = ) ставит более яркую клетку, например для переходов,
            которая не будет очищаться при "Очистить всё поле/таблицу". Два раза
            ЛКМ на ячейку, чтобы очистить её значение.
          </p>

          <label>Вид ввода в минное поле:</label>
          <div class="custom-select" id="climbingPanelInputsStyle">
            <div class="select-selected">Клавиатура</div>
            <div class="select-items">
              <!-- Опции будут добавлены сюда -->
            </div>
          </div>

          <div>
            <p>
              Дописывает в чате громкость уведомлений числом. В случае с
              лазательными локациями - количество опасных клеток вокруг вас.
            </p>
            <input
              type="checkbox"
              id="climbing-Notifications-Numbers"
              data-setting="climbingNotificationsNumbers"
            />
            <label for="climbing-Notifications-Numbers"
              >Подписывать громкость уведомления</label
            >
          </div>

          <div>
            <p>Звуковое уведомление, когда карта локации обновляется.</p>
            <input
              type="checkbox"
              id="climbing-Refresh-Notification"
              data-setting="climbingRefreshNotification"
            />
            <label for="climbing-Refresh-Notification"
              >Уведомлять об перестановке</label
            >
          </div>

          <div id="climbingRefreshNotificationSoundContainer">
            <div class="custom-select" id="climbingRefreshNotificationSound">
              <div class="select-selected">Выберите звук</div>
              <div class="select-items">
                <!-- Опции будут добавлены сюда -->
              </div>
            </div>

            <div id="notification-volume">
              <p>Громкость</p>
              <input
                type="range"
                min="1"
                max="10"
                value="5"
                class="uwu-range-slider"
                id="climbing-Refresh-Notification-Volume"
                list="volumeStep"
                data-setting="climbingRefreshNotificationVolume"
              />
              <datalist id="volumeStep">
                <option value="1">10%</option>
                <option value="10">100%</option>
              </datalist>
            </div>
          </div>

          <hr id="uwu-hr" class="uwu-hr" />
          <h2>BETA 🚧 Лог чистильщика 🚧 BETA</h2>

          <div>
            <p>
              Упрощённое и удобное дублирование блока истории для любителей
              чистить локации, в котором отображаются только поднятия и
              опускания котов.
            </p>
            <input
              type="checkbox"
              id="cleaning-Log"
              data-setting="cleaningLog"
            />
            <label for="cleaning-Log">Включить лог чистильщика</label>
          </div>

          <label>Вид отображения Лога:</label>
          <div class="custom-select" id="cleaningLogStyle">
            <div class="select-selected">Выберите вид Лога</div>
            <div class="select-items">
              <!-- Опции будут добавлены сюда -->
            </div>
          </div>
          <label
            id="uwu-what-this"
            title="
      Умный - группирование множественных действий в более удобный, краткий и читаемый вид.
      Ещё тут был 'стандартный', более привычный старый вид, но его съели росомахи.
      "
            >[?]</label
          >

          <details>
            <summary
              style="cursor: pointer; font-size: 16px; font-weight: bold;"
            >
              Как работает?
            </summary>
            <hr id="uwu-hr" class="uwu-hr" />
            <p>1. Проверьте кота такими действиями, как:</p>
            <p>— Потереться нос о нос</p>
            <p>— Потереться щекой о щёку</p>
            <p>— Помурлыкать вместе</p>
            <p>— Обнюхать</p>
            <p>
              Вам выведится, можно ли поднять кота. Если он "Проверен", можете
              смело...
            </p>
            <p>2. Поднять кота!</p>
            <p>
              Если же кот "Не спит", или перед поднятием вы его не проверили, то
              Лог просто не запишет его.
            </p>
            <p>
              — Больше настроек, например подсветка надписей или игнорирование
              статуса кота, будет в будущем!
            </p>
            <p>
              Если вы видите или вам кажется, что логика проверок и объединений,
              странны и нелогичны, или даже что-то теряется, то можете сообщить
              о проблеме в группу ВК!
            </p>
            <p>3. Попросились отпуститься?</p>
            <p>
              — Вы можете удалить из Лога последнего опущенного вами кота
              кнопкой справа от "Очистить лог" в виде корзинки! Например, если
              он выпросился погулять и он больше не актуален. Ещё разок!
              Опускаете кота и он становится целью кнопки "Удалить"!
            </p>
            <hr id="uwu-hr" class="uwu-hr" />
          </details>

          <div>
            <p>
              При последующих проверках так же будет писаться ID кота. Не
              добавляет ID к уже существущему тексту в логе.
            </p>
            <input
              type="checkbox"
              id="cleaning-Log"
              data-setting="cleaningLogShowID"
            />
            <label for="cleaning-Log">Записывать ID</label>
          </div>

          <div>
            <input
              type="text"
              id="cleaning-Log-Height"
              placeholder=". . ."
              data-setting="cleaningLogHeight"
            />
            <label>px; - Начальная высота Лога</label>
          </div>

          <hr id="uwu-hr" class="uwu-hr" />
          <h2>BETA 🚧 Лог ловли 🚧 BETA</h2>

          <div>
            <p>
              Аналогично Логу чистильщика, но для отслеживания результатов
              ныряния и ловли в ущелье. Группирует последовательные попытки в
              один блок.
            </p>
            <input
              type="checkbox"
              id="catching-Log"
              data-setting="catchingLog"
            />
            <label for="catching-Log">Включить лог ловли</label>
          </div>

          <details>
            <summary
              style="cursor: pointer; font-size: 16px; font-weight: bold;"
            >
              Как работает?
            </summary>
            <hr id="uwu-hr" class="uwu-hr" />
            <p>
              — Лог создаёт отдельные карточки для каждого типа действия
              (Ныряние, Осмотр).
            </p>
            <p>
              — Карточка считается активной 2 часа с момента последней попытки.
            </p>
            <p>
              — Если вы вернётесь к тому же действию спустя 2 часа, создастся
              новая карточка, а не дополнится старая.
            </p>
            <hr id="uwu-hr" class="uwu-hr" />
          </details>

          <div>
            <input
              type="text"
              id="catching-Log-Height"
              placeholder=". . ."
              data-setting="catchingLogHeight"
            />
            <label>px; - Начальная высота Лога</label>
          </div>

          <div>
            <p>
              Здесь вы можете добавить свои собственные названия для предметов
              по их ID. Каждая запись должна быть на новой строке в формате
              "ID=Название". Например: <code>3966=Рыбка</code>. Этот список
              имеет приоритет над встроенным.
            </p>
            <textarea
              id="catching-log-custom-items"
              rows="10"
              style="width: 100%"
              placeholder="3966=Рыба&#10;3967=Рыба побольше"
            ></textarea>
            <button
              id="save-custom-items-btn"
              class="uwu-button install-button"
            >
              Сохранить
            </button>
          </div>
          <div>
            <p>Импорт/Экспорт вашего списка названий предметов.</p>
            <input
              type="text"
              id="custom-items-export-field"
              placeholder="Экспорт"
              readonly
            />
            <input
              type="text"
              id="custom-items-import-field"
              placeholder="Импорт"
            />
            <button
              id="custom-items-import-btn"
              class="uwu-button install-button"
            >
              Вставить
            </button>
          </div>

          <hr id="uwu-hr" class="uwu-hr" />
          <h2>Быстрые ссылки</h2>

          <p>Быстрые ссылки в Игровой.</p>
          <div>
            <input type="checkbox" id="quick-Link1" data-setting="quickLink1" />
            <label for="quick-Link1">Настройки</label>
          </div>

          <div>
            <input type="checkbox" id="quick-Link2" data-setting="quickLink2" />
            <label for="quick-Link2">Памятка</label>
          </div>

          <div>
            <input type="checkbox" id="quick-Link3" data-setting="quickLink3" />
            <label for="quick-Link3">Блоги</label>
          </div>

          <div>
            <input type="checkbox" id="quick-Link4" data-setting="quickLink4" />
            <label for="quick-Link4">Лента</label>
          </div>

          <div>
            <p>
              Ваши ссылки. Вставляете ссылку, пробел и пишите название. Для
              множества просто пишите через запятую. Пример: https://мяу Котики,
              https://мяу2 Больше-котиков
            </p>
            <input
              type="text"
              id="users-quick-Links"
              placeholder=". . ."
              data-setting="userQuickLinks"
            />
          </div>

          <hr id="uwu-hr" class="uwu-hr" />

          <h2>Уведомления</h2>
          <p>Уведомлять звуком, когда:</p>

          <table class="notification-table">
            <tbody>
              <tr>
                <td>
                  <input
                    type="checkbox"
                    id="notification-PM"
                    data-setting="notificationPM"
                  />
                </td>
                <td>
                  <div class="custom-select" id="notificationPMSound">
                    <div class="select-selected">Выберите звук</div>
                    <div class="select-items"></div>
                  </div>
                </td>
                <td>
                  <div class="volume-control">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value="5"
                      class="uwu-range-slider"
                      id="notificationPMVolume"
                      list="volumeStep"
                      data-setting="notificationPMVolume"
                    />
                    <datalist id="volumeStep">
                      <option value="1">10%</option>
                      <option value="10">100%</option>
                    </datalist>
                  </div>
                </td>
                <td id="notificationPMContainer"></td>
                <td><label for="notification-PM">Новое ЛС</label></td>
              </tr>
              <tr>
                <td>
                  <input
                    type="checkbox"
                    id="notification-Action-End"
                    data-setting="notificationActionEnd"
                  />
                </td>
                <td>
                  <div class="custom-select" id="notificationActionEndSound">
                    <div class="select-selected">Выберите звук</div>
                    <div class="select-items"></div>
                  </div>
                </td>
                <td>
                  <div class="volume-control">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value="5"
                      class="uwu-range-slider"
                      id="notificationActionEndVolume"
                      list="volumeStep"
                      data-setting="notificationActionEndVolume"
                    />
                    <datalist id="volumeStep">
                      <option value="1">10%</option>
                      <option value="10">100%</option>
                    </datalist>
                  </div>
                </td>
                <td id="notificationActionEndContainer"></td>
                <td>
                  <label for="notification-Action-End"
                    >Действие закончилось</label
                  >
                </td>
              </tr>
              <tr>
                <td>
                  <input
                    type="checkbox"
                    id="notification-In-Mouth"
                    data-setting="notificationInMouth"
                  />
                </td>
                <td>
                  <div class="custom-select" id="notificationInMouthSound">
                    <div class="select-selected">Выберите звук</div>
                    <div class="select-items"></div>
                  </div>
                </td>
                <td>
                  <div class="volume-control">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value="5"
                      class="uwu-range-slider"
                      id="notificationInMouthVolume"
                      list="volumeStep"
                      data-setting="notificationInMouthVolume"
                    />
                    <datalist id="volumeStep">
                      <option value="1">10%</option>
                      <option value="10">100%</option>
                    </datalist>
                  </div>
                </td>
                <td id="notificationInMouthContainer"></td>
                <td>
                  <label for="notification-In-Mouth">Кто-то меня поднял</label>
                </td>
              </tr>

              <tr>
                <td>
                  <input
                    type="checkbox"
                    id="notification-In-Fight-Mode"
                    data-setting="notificationInFightMode"
                  />
                </td>
                <td>
                  <div class="custom-select" id="notificationInFightModeSound">
                    <div class="select-selected">Выберите звук</div>
                    <div class="select-items"></div>
                  </div>
                </td>
                <td>
                  <div class="volume-control">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value="5"
                      class="uwu-range-slider"
                      id="notificationInFightModeVolume"
                      list="volumeStep"
                      data-setting="notificationInFightModeVolume"
                    />
                    <datalist id="volumeStep">
                      <option value="1">10%</option>
                      <option value="10">100%</option>
                    </datalist>
                  </div>
                </td>
                <td id="notificationInFightModeContainer"></td>
                <td>
                  <label for="notification-In-Fight-Mode"
                    >Ввели в стойку (Т+2/Т+3)</label
                  >
                </td>
              </tr>
            </tbody>
          </table>

          <div>
            <p>Дублирует время действий на название браузерной вкладки.</p>
            <input
              type="checkbox"
              id="duplicate-Time-In-Browser-Tab"
              data-setting="duplicateTimeInBrowserTab"
            />
            <label for="duplicate-Time-In-Browser-Tab"
              >Показывать время действия на вкладке</label
            >
          </div>

          <div>
            <p>Подсказывает оставшееся время до возможности понюхать.</p>
            <input
              type="checkbox"
              id="show-Hint-When-To-Sniff"
              data-setting="showHintWhenToSniff"
            />
            <label for="show-Hint-When-To-Sniff">Когда нюхать?</label>
          </div>

          <hr id="uwu-hr" class="uwu-hr" />
          <h2>Общение</h2>

          <div>
            <p>
              Позволяет сохранять личные сообщения локально в браузере для
              офлайн-доступа.
            </p>
            <input type="checkbox" id="saving-LS" data-setting="savingLS" />
            <label for="saving-LS">Сохранение Личных сообщений</label>
          </div>

          <div>
            <p>
              Автоматически находит и переносит ваши сохранённые ЛС из
              подходящих модов и скриптов в хранилище UwU.
            </p>
            <button
              id="import-ls-from-other-mods"
              class="uwu-button install-button"
            >
              Импортировать ЛС из других модов и скриптов
            </button>
          </div>

          <div>
            <p>
              Индивидуальный импорт/экспорт только сохранённых личных сообщений.
            </p>
            <input
              type="text"
              id="ls-export-field"
              placeholder="Экспорт ЛС"
              readonly
            />
            <input type="text" id="ls-import-field" placeholder="Импорт ЛС" />
            <button id="ls-import-btn" class="uwu-button install-button">
              Вставить
            </button>
          </div>

          <div>
            <p>
              Автоматически сохраняет и восстанавливает редактируемый текст
              блога. Теперь вы не потеряете его случайно.
            </p>
            <input
              type="checkbox"
              id="restore-Blog-Creation"
              data-setting="restoreBlogCreation"
            />
            <label for="restore-Blog-Creation"
              >Восстановление содержимого Блога</label
            >
          </div>

          <div>
            <p>Говорит само за себя.</p>
            <input
              type="checkbox"
              id="more-BB-Codes"
              data-setting="moreBBCodes"
            />
            <label for="more-BB-Codes">Дополнительные BB-Коды</label>
          </div>

          <div>
            <p>
              Позволяет предпросматривать отправляемые сообщения в лентах и
              блогах.
            </p>
            <input
              type="checkbox"
              id="comment-Preview"
              data-setting="commentPreview"
            />
            <label for="comment-Preview">Предпросмотр сообщений</label>
          </div>

          <div>
            <p>
              Позволяет "отвечать" и "цитировать" сообщения в лентах и блогах.
              При цитировании вы можете выделить кусочек текста на который
              хотите ответить.
            </p>
            <input
              type="checkbox"
              id="more-Comment-Buttons"
              data-setting="moreCommentButtons"
            />
            <label for="more-Comment-Buttons"
              >Кнопки "Отправить" и "Цитировать"</label
            >
          </div>

          <div>
            <p>
              Оборачивает предпросмотр письма в оболочку, похожую на ту которая
              во "Входящие".
            </p>
            <input
              type="checkbox"
              id="ls-Wrap-Preview"
              data-setting="lsWrapPreview"
            />
            <label for="ls-Wrap-Preview">Наглядный предпросмотр письма</label>
          </div>
        </div>

        <div id="modules-panel">
          <h2>Главное</h2>
          <div>
            <p>
              Постоянное отображание Панели Расширенных Настроек в Игровой. Сама
              по себе пустая.
            </p>
            <input
              type="checkbox"
              id="extended-settings-Panel"
              data-setting="extendedSettingsPanel"
            />
            <label for="extended-settings-Panel"
              >⚙️Панель Расширенных Настроек</label
            >
          </div>

          <div>
            <p>
              Отображает уведомление в ⚙️Панели Расширенных настроек в Игровой.
            </p>
            <input
              type="checkbox"
              id="show-Update-Notification"
              data-setting="showUpdateNotification"
            />
            <label for="show-Update-Notification"
              >Уведомлять об обновлении Скрипта/Мода UwU</label
            >
          </div>

          <div>
            <p>
              ⚙️Панели Расширенных Настроек не будет так скучно с рандомными
              фразами.
            </p>
            <input
              type="checkbox"
              id="show-Splash-Screens"
              data-setting="showSplashScreens"
            />
            <label for="show-Splash-Screens">Показывать Splash надписи.</label>
          </div>

          <div>
            <p>
              Скрывать или отображать расширенные подсказки к настройкам.
              Привет, я та самая расширенная подсказка. Делает Настройки CatWar
              UwU очень компактным на вид.
            </p>
            <input
              type="checkbox"
              id="extended-Hints"
              data-setting="extendedHints"
            />
            <label for="extended-Hints">Расширенные подсказки</label>
          </div>

          <hr id="uwu-hr" class="uwu-hr" />
          <h2>Сборник стилей</h2>
          <p>Онлайн сборник стилей от Разработчика.</p>
          <hr id="uwu-hr" class="uwu-hr" />
          <div id="module-info">
            <!-- Сюда модули -->
          </div>

          <hr id="uwu-hr" class="uwu-hr" />
          <h2>Единое Хранилище</h2>
          <div>
            <p>
              Включает синхронизацию скрипта/мода между разными доменами CatWar
              через хранилище 'monkey плагинов.
            </p>
            <p>
              <b>ВНИМАНИЕ:</b> При первом включении этой опции, ваши текущие
              локальные настройки и данные с этого сайта (например, catwar.net)
              будут скопированы в единое хранилище и станут основными.
              Убедитесь, что вы включаете эту опцию на том сайте, настройки и
              данные которого хотите сохранить.
            </p>
            <input
              type="checkbox"
              id="unified-storage"
              data-setting="unifiedStorage"
            />
            <label for="unified-storage"
              >Использовать единое хранилище (.net & .su)</label
            >
          </div>

          <hr id="uwu-hr" class="uwu-hr" />
          <h2>Импорт/Экспорт</h2>

          <div>
            <p>Импорт/Экспорт всех настроек.</p>
            <input type="text" id="exportSettings" placeholder="Экспорт" />
            <input type="text" id="importSettings" placeholder="Импорт" />
            <button id="importSettingsButton" class="uwu-button install-button">
              Вставить
            </button>
          </div>

          <div>
            <p>
              Удаляет все настройки. В очень редких случаях может помочь при
              проблемных проблемах.
            </p>
            <button id="resetAllSaves" class="uwu-button remove-button">
              Сброс сохранений
            </button>
          </div>
        </div>

        <div id="personal-costumes-panel">
          <h2>Личные костюмы</h2>
          <p>
            Здесь вы можете управлять костюмами для всех ваших котов. Костюмы
            привязываются к конкретному коту.
          </p>
          <div>
            <input
              type="checkbox"
              id="personal-costume-panel"
              data-setting="personalCostumes"
            />
            <label for="personal-costume-panel"
              >⚙️Включить персональные костюмы</label
            >
          </div>
          <p>Добавляет кнопку «Сохранить костюм» при наведении на игрока.</p>
          <div>
            <input
              type="checkbox"
              id="show-costumes"
              data-setting="showCostumesButtons"
            />
            <label for="show-costumes">Сохранять костюмы других игроков</label>
          </div>
          <br />
          <hr id="uwu-hr" class="uwu-hr" />

          <div class="costume-flex-box disabled">
            <div class="costumeSettings" style="flex: 2;">
              <div
                id="cat-selector-container"
                style="margin-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 15px;"
              >
                <label>Выберите кота:</label>
                <div
                  style="display: flex; gap: 5px; align-items: center; margin-top: 5px;"
                >
                  <select
                    id="current-cat-select"
                    class="uwu-select-selected"
                    style="width: 100%; margin: 0;"
                  ></select>
                  <button
                    id="delete-cat-btn"
                    class="uwu-button remove-button"
                    title="Удалить этого кота из списка"
                  >
                    🗑️
                  </button>
                </div>

                <label style="display: block; margin-top: 10px;"
                  >Выберите позу для редактирования:</label
                >
                <select
                  id="current-pose-select"
                  class="uwu-select-selected"
                  style="width: 100%; margin: 5px 0 0 0;"
                >
                  <!-- Пу-пу-пу -->
                </select>
                <div style="font-size: 0.8em; opacity: 0.6; margin-top: 2px;">
                  * Позы сохраняются автоматически, когда вы меняете положение в
                  Игровой.
                </div>
              </div>

              <div>
                <h3>Изменить Костюм:</h3>
                <div
                  style="font-size: 0.9em; opacity: 0.8; margin-bottom: 10px;"
                >
                  Загрузите изображение (желательно 200x300 или 2:3). Оно будет
                  подогнано под размер.
                </div>
              </div>

              <input
                type="file"
                id="costume-file"
                accept="image/png"
                class="uwu-button"
                style="width: 100%; box-sizing: border-box;"
              />
              <br />

              <div
                style="display: flex; flex-direction: row; flex-wrap: wrap; gap: 10px; margin-top: 10px;"
              >
                <button
                  class="uwu-button install-button"
                  id="changeCostume"
                  style="flex: 1; white-space: normal; min-width: 120px;"
                >
                  Надеть на кота
                </button>

                <button
                  class="uwu-button install-button"
                  id="saveCostumeToNewSlot"
                  style="flex: 1; white-space: normal; min-width: 120px;"
                >
                  Сохранить в библиотеку
                </button>
              </div>
            </div>

            <div
              id="cat-preview-wrapper"
              style="flex: 1; display: flex; flex-direction: column; align-items: center;"
            >
              <div
                id="cat-image-container"
                style="width: 100px; height: 150px; position: relative; border: 1px solid rgba(255,255,255,0.2); border-radius: 10px;"
              ></div>
              <p
                id="cat-preview-name"
                style="margin-top: 5px; margin-bottom: 5px; font-weight: bold; text-align: center;"
              >
                ...
              </p>

              <a
                class="uwu-button remove-button"
                id="removeCostume"
                style="font-size: 0.8em; padding: 2px 10px; text-decoration: none; color: inherit; margin-top: 5px;"
                title="Снять текущий костюм с этого кота"
                >Снять костюм</a
              >
            </div>
          </div>

          <div
            id="no-cats-warning"
            style="display: none; background: rgba(255, 100, 100, 0.1); border: 1px solid rgba(255, 100, 100, 0.3); padding: 15px; border-radius: 10px; margin-top: 10px; text-align: center;"
          >
            <h3>🔍 Коты не найдены</h3>
            <p>
              Чтобы настроить костюм, нужно, чтобы скрипт "увидел" вашего
              персонажа.
            </p>
            <p>
              1. Убедитесь, что галочка "Включить персональные костюмы" стоит.
            </p>
            <p>
              2. Зайдите в <a href="/cw3/" target="_blank">Игровую</a> хотя бы
              один раз.
            </p>
            <p>3. Вернитесь сюда и обновите страницу.</p>
          </div>

          <hr id="uwu-hr" class="uwu-hr" />
          <h3>Библиотека костюмов (общая):</h3>
          <div class="costume-flex-box" id="costume-gallery"></div>
          <hr id="uwu-hr" class="uwu-hr-head" />
        </div>
      </div>
    </div>
  `;
// ====================================================================================================================
//   . . . HTML БЛОК НОВОСТЕЙ . . .
// ====================================================================================================================
const newsPanel =
  /* HTML */
  `
    <div id="news-panel">
      <button id="news-button">
        v${current_uwu_version} - Перепись Библиотеки Личных Костюмов! Всякие
        правки БР и прочая мелочь.
      </button>
      <div id="news-list" style="display: none">
        <h3>Главное</h3>
        <p>
          — Библиотека Личных Костюмов теперь поддерживает множество ваших котов
          и их разные позы (вроде). Эм. Мяу-мяу-мяу.
        </p>
        <hr id="uwu-hr" class="uwu-hr" />
        <h3>Внешний вид</h3>
        <p>— Кнопка "Обновить команды" в БР логе теперь не вылезает за края.</p>
        <p>— Убран неприятный горизонтальный слайдер в таблицах команд.</p>
        <p>
          — Кнопки команд теперь не улетают на следующие строки, делая табицу
          высокой и неудобной.
        </p>
        <p>— Возможный фикс улетающего текста из БР.</p>
        <p>
          — Кнопки сохранения и удаления сообщения в письмах теперь появляются и
          на мобильной версии сайта.
        </p>
        <p>— Добавлена кнопочка на GitHub Скрипта/Мода, чтобы не терялось.</p>
        <hr id="uwu-hr" class="uwu-hr" />
        <h3>Изменения кода</h3>
        <p>— Возможно чёта, что я уже забыл.</p>
        <hr id="uwu-hr" class="uwu-hr" />
        <p>Дата выпуска: 13.12.25</p>
      </div>
    </div>
  `;
// ====================================================================================================================
//   . . . HTML ПАНЕЛЬ РАСШИРЕННЫХ НАСТРОЕК . . .
// ====================================================================================================================
const extendedSettingsButton =
  /* HTML */
  `
    <div id="uwu-extended-settings">
      <button type="button" id="extended-settings-button">
        <img
          src="https://raw.githubusercontent.com/Ibirtem/CatWar/main/images/partly_sunny_rain.png"
          alt="Иконка"
          width="36"
          height="36"
        />
      </button>

      <div id="extended-settings-container">
        <div id="splash-screen-panel"></div>
      </div>
    </div>
  `;
// ====================================================================================================================
//   . . . HTML БЛОК РУЧНОГО УПРАВЛЕНИЯ ПОГОДЫ . . .
// ====================================================================================================================
const manualWeatherPanel =
  /* HTML */
  `
<div id="manual-weather-panel">
<p>Изменения, сделанные в этой панели, носят временный характер и не сохраняются.</p>
<h3>Переключить погоду</h3>
<input type="range" min="1" max="3" value="1" class="uwu-range-slider" id="manualWeather" list="WeatherStep">
<datalist id="WeatherStep">
  <img src="https://raw.githubusercontent.com/Ibirtem/CatWar/main/images/sunny.png" width="36" height="36" option
    value="1"></option>
  <img src="https://raw.githubusercontent.com/Ibirtem/CatWar/main/images/rain_cloud.png" width="36" height="36"
    option value="2"></option>
  <img src="https://raw.githubusercontent.com/Ibirtem/CatWar/main/images/snow_cloud.png" width="36" height="36"
    option value="3"></option>
</datalist>
<div id="temperature-container">
  <p id="temperature"
    title="На это умножается скорость частиц и делится их размер. В будущем будет возможность сохранять и изменять это значение под свой вкус.">
    [?] Текущий модификатор: ...уточнение...</p>
</div>

<h3>Северное Сияние</h3>
<div class="button-container-1">
  <button type="button" id="manualAurora-Off" class="uwu-button-round">
    <img src="https://raw.githubusercontent.com/Ibirtem/CatWar/main/images/icons8-nothern-lights-96.png"
      alt="Иконка" width="48" height="48">
  </button>
  <button type="button" id="manualAurora-B" class="uwu-button-round">
    <img src="https://raw.githubusercontent.com/Ibirtem/CatWar/main/images/icons8-nothern-lights-96_blue.png"
      alt="Иконка" width="48" height="48">
  </button>
  <button type="button" id="manualAurora-G" class="uwu-button-round">
    <img src="https://raw.githubusercontent.com/Ibirtem/CatWar/main/images/icons8-nothern-lights-96_green.png"
      alt="Иконка" width="48" height="48">
  </button>
</div>

<h3>Светлячки</h3>
<div class="button-container-2">
  <button type="button" id="manualFirefly-On" class="uwu-button-round">
    <img src="https://raw.githubusercontent.com/Ibirtem/CatWar/main/images/firefly.png" alt="Иконка" width="48"
      height="48" title="Включает/Выключает">
  </button>
</div>

</div>
<div id="aurora-settings-panel">
<p>Изменения, сделанные в этой панели, сохранятся!</p>
<h5>Здесь будет возможность переместить Северное Сияние в реальном времени, исключать локации из генерации погоды,
  либо запрещать
  определённой погоде существовать на выбранной локации. Но это всё пока что лишь мечта...</h5>
</div>
`;
// ====================================================================================================================
//   . . . ГЛАВНЫЙ CSS СТИЛЬ . . .
// ====================================================================================================================
// TODO - Унифицировать шрифты, цвета текстов, прозрачность, закруглённость штучек ну кароче всё как надо чтобы не сделать в итоге лабиринт.
const css_uwu_main = `
#uwu-settings {
    margin-top: 10px;
    margin-bottom: 10px;
}

#uwusettings {
  font-family: "Montserrat", sans-serif;
  margin: 0 auto;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.main-settings-container {
  padding: 10px 15px 10px 15px;
}

#uwusettings-main {
  padding: 0px 15px 0px 15px;
}

#news-panel {
  padding: 5px 15px 15px 15px;
}

#uwu-what-this {
  color: #83e5ff;
  font: caption;
}

.main-settings-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
}

#uwusettings h1,
#uwusettings h2 {
  font-family: "Montserrat", sans-serif;
  margin-top: 10px;
  margin-bottom: 15px;
  text-align: center;
}

#uwusettings h4 {
  margin-top: 5px;
  margin-left: 5px;
  margin-bottom: 5px;
}

#uwusettings p {
  margin-bottom: 0px;
}

#uwusettings label {
  font-size: 16px;
}

#uwusettings ul {
  font-family: "Montserrat", sans-serif;
  list-style-type: "+ ";
}

.uwu-hr-head {
  border: rgba(255, 255, 255, 0.1) solid;
  border-radius: 0px;
}

.uwu-hr {
  border: rgba(255, 255, 255, 0.1) solid;
  border-radius: 15px;
}

#uwusettings .parameters-color-table,
#uwusettings .parameters-color-table tr,
#uwusettings .parameters-color-table td {
  border: 1px #383838 solid;
}

#colorSettingsTable,
#colorSettingsTable tr,
#colorSettingsTable td {
  border: 1px #383838 solid;
}

.uwu-table-highlight-Resources,
#uwu-table-templates {
  margin-top: 5px;
}
.uwu-table-highlight-Resources th, .uwu-table-highlight-Resources td,
#uwu-table-templates th, #uwu-table-templates td {
  border: 1px solid #383838;
}

.uwu-color-picker {
  border: none;
  vertical-align: middle;
}

.uwu-checkbox-cell {
  text-align: center;
  vertical-align: middle;
}

#uwusettings .parameters-color-table,
#colorSettingsTable {
  margin-top: 8px;
}

.header-rounded-image {
  background-repeat: repeat;
  background-attachment: fixed;
  border-radius: 20px 20px 0px 0px;
}

.main-rounded-image {
  background-repeat: repeat;
  background-attachment: fixed;
  border-radius: 20px;
}

#button-container-1 {
  display: flex;
  justify-content: space-evenly;
  width: 100%;
}

#button-container button {
  background-color: transparent;
  border: none;

  color: #ffffff57;

  padding: 10px 20px;
  cursor: pointer;
  transition: box-shadow 0.4s ease;
}

#button-container button.active {
  box-shadow: inset 0 -2px 0 0 #ffffff4d;
  transition: box-shadow 0.4s ease;
}

#button-container button.active h2 {
  color: #ffffff;
  transition: color 0.4s ease;
}

#modules-panel {
  display: none;
}

.module-container {
  width: 300px;
  min-height: 150px;
  position: relative;

  box-sizing: border-box;
  margin: 10px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 15px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.03);
}

.module-info {
  flex-grow: 1;
  margin-bottom: 10px;
}

.module-panel {
  display: flex;
  justify-content: space-between;
  align-items: center;

  position: absolute;
  bottom: 10px;
  left: 10px;
  right: 10px;
}

#module-info {
  flex-grow: 1;
  margin-bottom: 10px;

  display: flex;
  flex-wrap: wrap;
  flex-basis: 100%;
}

.module-container label {
  margin-top: 10px;
}

#private-module-input {
  margin: 10px;
}

.module-container button {
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 5px 10px;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin: 5px;
}

.install-button {
  background-color: #78c8ff87 !important;
}

.remove-button {
  background-color: #ff787887 !important;
}

#module-info input[type="checkbox"] {
  margin: 10px;
}

#color-picker {
  display: flex;
  flex-wrap: wrap;
}

#color-picker-input {
  flex: 30%;
}

#auroraPanel {
  width: 120px;
}

#weatherZIndexPanel {
  width: 320px;
}

.notification-table {
    border-collapse: collapse;
}

.notification-table td {
    padding: 5px;
    vertical-align: middle;
}

#notification-volume,
#step-slider {
  width: 150px;
}

details {
  margin-top: 5px;
}

#layout-preview button {
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 5px 10px;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin: 5px;
}

#layout-customizer #layout-preview {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

#layout-customizer .column {
  width: 200px;
  border: 1px solid #ffffff1a;
  border-radius: 10px;
  padding: 5px;
  margin: 0 5px;
}

#layout-customizer .block {
  border-radius: 10px;
  background-color: #ffffff08;
  padding: 5px;
  margin-bottom: 5px;
}

#layout-customizer .center-block {
  height: 100%;
  box-sizing: border-box;

  border-radius: 10px;
  background-color: #ffffff08;
}

#uwu-buttonRow1-settings,
#uwu-buttonRow2-settings {
  display: flex;
  margin-top: 3px;
}

#uwu-buttonRow1-settings button,
#uwu-buttonRow2-settings button  {
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 2px 10px;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin: 3px;
  margin-left: 0px;
}

#uwu-buttonRow1-settings > div > button.tab-button.active, #uwu-buttonRow2-settings > div > button.table-button.active {
  background-color: #abf6ffb0;
}

#uwu-buttonRow1-settings > .tab-container,
#uwu-buttonRow2-settings > .table-container {
  border-radius: 15px;
  background-color: #54545473;
  margin-right: 5px;
  padding-left: 4px;
  padding-right: 2px;
  padding-top: 2px;
  border-bottom-width: 2px;
  padding-bottom: 2px;
}

#uwu-global-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
}

#uwu-main-container {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
  pointer-events: none;
}

.weatherCanvas {
  pointer-events: none;
  position: fixed;
}

#extended-settings-button {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  backdrop-filter: blur(16px);
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: auto;
  cursor: pointer;

  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 2em;
  font-weight: bold;
  color: #ff00ff;
}

#extended-settings-container {
  z-index: 10;
  font-family: "Montserrat", sans-serif;
  color: white;
  font-size: 15px;
  text-align: center;

  position: fixed;
  bottom: 100px;
  right: 30px;
  width: 400px;
  height: 400px;
  backdrop-filter: blur(16px);
  border-radius: 10px;
  display: none;
  pointer-events: auto;

  background-color: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);

  display: grid;
  place-items: center;
  padding: 15px;
  box-sizing: border-box;
  overflow-y: auto;
}

.extended-settings-block {
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 5px;
  margin-bottom: 8px;
}

#news {
  margin-top: 20px;
}

#manual-weather-panel,
#news,
#news-button {
  width: 100%;
  border-radius: 10px;

  background-color: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);

  padding: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  box-sizing: border-box;
}

#color-picker {
  background-color: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);

  margin-top: 10px;
  padding: 15px;
  border-radius: 10px;
}

#news-button,
#news-list {
  font-family: "Montserrat", sans-serif;
  font-size: 15px;
  cursor: pointer;
}

#news-list h3 {
  margin-left: 40px;
}

#news-list p {
  margin-top: 3px;
  margin-bottom: 3px;
  margin-left: 20px;
}

#aurora-settings-panel {
  width: 100%;
  border-radius: 10px;

  background-color: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);

  padding: 15px;
  margin-top: 20px;
  box-sizing: border-box;
}

#WeatherStep,
#auroraStep,
#volumeStep,
#ThicknessStep,
.uwu-range-step,
#weatherZIndexStep {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  width: 100%;
}

#extended-settings-container::-webkit-scrollbar {
  width: 10px;
}

#extended-settings-container::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

#extended-settings-container::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
}

#extended-settings-container::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.4);
}

#button-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  width: 100%;
}

.button-container-1 {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.button-container-2 {
  display: flex;
  justify-content: space-evenly;
  width: 100%;
}

.uwu-button-round {
  width: 60px;
  height: 60px;
  cursor: pointer;
  border-radius: 50%;

  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

#extended-settings-button:hover,
.uwu-button-round:hover {
  background-color: rgba(255, 255, 255, 0.15);
}

@property --gradient-angle {
  syntax: "<angle>";
  initial-value: 0deg;
  inherits: false;
}

@keyframes aurora-spin {
  0% {
    --gradient-angle: 0deg;
  }

  100% {
    --gradient-angle: 360deg;
  }
}

@keyframes auroraFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes auroraFadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

.firefly {
  position: fixed;
  background-color: rgba(255, 255, 153, 1);
  border-radius: 50%;
  filter: blur(5px);
  pointer-events: none;

  animation: fadeIn 6s ease-in-out;
}

.firefly-glow {
  position: fixed;
  background-color: rgba(255, 255, 153, 0.2);
  border-radius: 50%;
  filter: blur(40px);
  pointer-events: none;

  animation: fadeIn 6s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

.firefly-disappearing {
  animation: fadeOut 6s ease-in-out forwards;
}

.custom-select {
  position: relative;
  display: inline-block;
}

.select-selected, .uwu-select-selected {
  margin-top: 10px;
  width: fit-content;
  border-radius: 10px;
  color: white;
  background-color: #5c5c5c;
  -webkit-backdrop-filter: blur(16px);
  backdrop-filter: blur(16px); 
  padding: 10px;
  cursor: pointer;
}

.uwu-select-selected {
  width: fit-content;
}

.select-items, uwu-select-items {
  margin-top: 5px;
  display: none;
  position: absolute;
  border-radius: 10px;
  width: max-content;
  color: white;
  background-color: #5c5c5c;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  -webkit-backdrop-filter: blur(16px);
  backdrop-filter: blur(16px); 
  z-index: 1;
}

.select-items div {
  padding: 8px 16px;
  cursor: pointer;
}

.select-items div:hover {
  background-color: #757575;
}

.custom-select.active .select-items {
  display: block;
}

#climbingRefreshNotificationSoundContainer button,
#myNameNotificationSoundContainer button {
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 2px 10px;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin: 3px;
  margin-left: 0px;
}

#climbingRefreshNotificationSoundContainer,
#myNameNotificationSoundContainer,
#notificationBlockSoundContainer {
  gap: 5px;
  display: flex;
  align-items: center;
}

.update-notification {
  background-color: #78c8ff69;
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 10px;
}

.new-update::before {
  content: "•";
  color: #78c8ff;
  font-size: 2em;
  position: absolute;
  top: -20px;
  right: -5px;
}

.random-phrase-block {
  margin-bottom: 10px;
  width: 100%;
  border-radius: 10px;

  background-color: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);

  box-sizing: border-box;
  padding: 5px;
}

.costume-flex-box {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
  gap: 3rem;
}

.costume-flex-box.disabled {
  opacity: 0.5;
  pointer-events: none;
  cursor: not-allowed;
}

.costume-flex-box div{
    flex: 0;
}

#cat-image {
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: flex-end;
  font-weight: bold;
  gap: 0.5rem;
}

#cat-image-container {
  box-shadow: 0px 0px 7px 0px white;
}

#costume-gallery {
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: flex-start;
}

#costume-gallery > div {
    flex: 1;
}


.costume-gallery-box {
  background-color: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  flex: 0 1 250px;
  max-width: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  box-sizing: border-box;
  position: relative;
}

.costume-slot-delete-button {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
  padding: 4px 8px !important;
  line-height: 1;
  background-color: transparent !important;
}

.save-costume-button {
  margin-top: 10px;
}

.costume-flex-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: flex-start;
  margin-top: 1rem;
}
.costume-flex-item {
  flex: 0 1 calc(33.333% - 1rem);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
  max-width: 180px;
}
.costume-style {
  width: 100px;
  height: 150px;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-bottom: 0.5rem;
}

.costume-slot {
  width: 100px;
  height: 150px;
  background-position: center;
  background-repeat: no-repeat;
}

.costume-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  align-items: stretch;
}

.uwu-slot-select {
  padding: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.03);
  font-family: "Montserrat", sans-serif;
  font-size: 14px;
  color: black;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

#show-costumes:disabled {
  opacity: 0.5;
  pointer-events: none;
  cursor: not-allowed;
}

`;

document.head.insertAdjacentHTML(
  "beforeend",
  `<style id="css-uwu-main">${css_uwu_main}</style>`
);

// ====================================================================================================================
//   . . . ПРОЗРАЧНЫЙ CSS СТИЛЬ . . .
// ====================================================================================================================
// Glassmorphism вперёд Glassmorphism вперёд Glassmorphism вперёд Glassmorphism вперёд Glassmorphism вперёд
const css_uwu_glass =
  // css
  `
#uwusettings {
  backdrop-filter: blur(16px);
  background-color: rgba(255, 255, 255, 0.03);
}

.uwu-button {
  background-color: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 8px 15px;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin: 5px;
  margin-left: 0px;
  color: #d5d5d5;
}

.uwu-button:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.uwu-range-slider {
  width: 100%;
  cursor: pointer;
  -webkit-appearance: none;
  background-color: rgba(255, 255, 255, 0.06) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 10px;
  height: 10px;
  outline: none;
}

.uwu-range-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
}

.uwu-range-slider::-webkit-slider-thumb {
  transform: translateY(-35%);
}

#uwusettings input[type="checkbox"] {
  margin-right: 8px;
  appearance: none;
  transform: translate(-10%, 30%);
  width: 35px;
  height: 18px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
}

#uwusettings input[type="checkbox"]:checked {
  background-color: #90ff78a8;
}

#uwusettings input[type="checkbox"]:not(:checked) {
  background-color: rgba(255, 255, 255, 0.1);
}

#uwusettings input[type="checkbox"]:before {
  content: "";
  position: absolute;
  top: 50%;
  left: 4px;
  transform: translate(-50%, -50%);
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: background-color 0.2s ease-in-out, left 0.2s ease-in-out;
}

#uwusettings input[type="checkbox"]:checked:before {
  left: calc(100% - 4px);
}

#uwusettings input[type="text"] {
  width: 150px;
  background-color: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 8px;
  border-radius: 10px;
  outline: none;
  margin: 5px;
  margin-left: 0px;
}
`;
// ====================================================================================================================
//   . . . ТЁМНАЯ ТЕМА . . .
// ====================================================================================================================
const css_uwu_dark =
  /* CSS */
  `
#uwusettings {
  background-color: #242424;
  color: #dddddd;
}

#uwusettings-header-glass {
  border-radius: 20px 20px 0px 0px;
  backdrop-filter: blur(16px) brightness(0.9);
}

#news-button {
  color: #dddddd;
}

.uwu-button {
  background-color: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 8px 15px;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin: 5px;
  margin-left: 0px;
}

.uwu-button:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.uwu-range-slider {
  width: 100%;
  cursor: pointer;
  -webkit-appearance: none;
  background-color: rgba(255, 255, 255, 0.06) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 10px;
  height: 10px;
  outline: none;
}

.uwu-range-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
}

.uwu-range-slider::-webkit-slider-thumb {
  transform: translateY(-35%);
}

#uwusettings input[type="checkbox"] {
  margin-right: 8px;
  appearance: none;
  transform: translate(-10%, 30%);
  width: 35px;
  height: 18px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
}

#uwusettings input[type="checkbox"]:checked {
  background-color: #90ff78a8;
}

#uwusettings input[type="checkbox"]:not(:checked) {
  background-color: rgba(255, 255, 255, 0.1);
}

#uwusettings input[type="checkbox"]:before {
  content: "";
  position: absolute;
  top: 50%;
  left: 4px;
  transform: translate(-50%, -50%);
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: background-color 0.2s ease-in-out, left 0.2s ease-in-out;
}

#uwusettings input[type="checkbox"]:checked:before {
  left: calc(100% - 4px);
}

#uwusettings input[type="text"] {
  width: 150px;
  background-color: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 8px;
  border-radius: 10px;
  outline: none;
  margin: 5px;
  margin-left: 0px;
}
`;
// ====================================================================================================================
//   . . . КЛАССИЧЕСКАЯ ТЕМА . . .
// ====================================================================================================================
// лол а где
const css_uwu_classic = `

`;
// ====================================================================================================================
//   . . . топовой шрифт кто не согласен тому в глаз 👅👅👅👅👅👅бе бе бе мяу мяу мяу мяу мяу мяу . . .
// ====================================================================================================================
var link = document.createElement("link");
link.rel = "stylesheet";
link.href = "https://fonts.googleapis.com/css?family=Montserrat";
document.head.appendChild(link);
// TODO - автоматически подкачивать шрифты нужные пользователю по названию в "Название вида шрифта" в Настройках
// ====================================================================================================================
//  . . . СОХРАНЕНИЯ И ЗАГРУЗКА НАСТРОЕК . . .
// ====================================================================================================================
let settings;

function saveSettings() {
  try {
    uwuStorage.setItem("uwu_settings", settings);
  } catch (error) {
    console.error("Не удалось сохранить настройки:", error);
  }
}

function loadSettings() {
  const storedSettings = uwuStorage.getItem("uwu_settings");
  if (storedSettings) {
    try {
      if (typeof storedSettings === "object" && storedSettings !== null) {
        settings = { ...uwuDefaultSettings, ...storedSettings };
      } else {
        throw new Error("Сохраненные настройки не являются объектом.");
      }
    } catch (error) {
      console.error(
        "Ошибка обработки uwu_settings, будут применены настройки по умолчанию.",
        error
      );
      settings = { ...uwuDefaultSettings };
    }
  } else {
    settings = { ...uwuDefaultSettings };
  }
}
// ====================================================================================================================
//   . . . ДИНАМИЧНЫЕ ОБОЗРЕВАТЕЛИ . . .
// ====================================================================================================================
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// Когда нужно вставить прослушку на какой-то элемент, который ещё не успел появиться.
async function setupMutationObserver(
  selector,
  callback,
  options = { attributes: true, attributeFilter: ["style"] },
  maxAttempts = 8,
  delay = 500,
  debounceTime = 100
) {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const element = document.querySelector(selector);
    if (element) {
      const observer = new MutationObserver(debounce(callback, debounceTime));
      observer.observe(element, options);
      // console.log(`Наблюдатель установлен для элемента с селектором "${selector}".`);
      callback();
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
  // console.warn(
  //   `Элемент с селектором "${selector}" не найден после ${maxAttempts} попыток.`
  // );
}

// Когда нужно вставить что-то в какой-то элемент, который ещё не успел появиться.
async function setupSingleCallback(
  selector,
  callback,
  maxAttempts = 8,
  delay = 500
) {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const element = document.querySelector(selector);
    if (element) {
      callback();
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
  // console.warn(
  //   `Элемент с селектором "${selector}" не найден после ${maxAttempts} попыток.`
  // );
}
// ====================================================================================================================
//   . . . СОХРАНЕНИЕ И РАБОТА С ЦВЕТОВЫМИ ТЕМАМИ . . .
// ====================================================================================================================
function getThemes() {
  const storedThemes = uwuStorage.getItem("uwu_colorThemes");
  const userThemes = storedThemes || {};
  return { ...userThemes, ...defaultThemes };
}

function saveThemes(themes) {
  const themesToSave = Object.keys(themes)
    .filter((themeName) => !isDefaultTheme(themeName))
    .reduce((obj, key) => {
      obj[key] = themes[key];
      return obj;
    }, {});

  uwuStorage.setItem("uwu_colorThemes", themesToSave);
}

function getCurrentThemeName() {
  return uwuStorage.getItem("uwu_currentTheme") || "Тёмная Тема";
}

function setCurrentThemeName(themeName) {
  uwuStorage.setItem("uwu_currentTheme", themeName);
}

function isDefaultTheme(themeName) {
  return Object.keys(defaultThemes).includes(themeName);
}

function updateSaveButtonState() {
  saveThemeButton.disabled = isDefaultTheme(currentThemeName);
}

// ====================================================================================================================
//  . . . ВНЕШНИЙ ВИД ПАНЕЛИ НАСТРОЕК . . .
// ====================================================================================================================
function applyBackgroundImage(element, backgroundImage) {
  element.style.backgroundImage = backgroundImage;
}

function createSettingsBlock(blockId, content) {
  const siteTable = document.querySelector("#site_table");
  const isMobile = siteTable.getAttribute("data-mobile") === "0";

  const settingsElement = document.createElement("div");
  settingsElement.id = blockId;
  settingsElement.innerHTML = content;

  const settingsContainer = isMobile
    ? document.querySelector("#branch")
    : siteTable;
  settingsContainer.appendChild(settingsElement);
}
// ====================================================================================================================
//  . . . РАБОТА ПАНЕЛИ НАСТРОЕК . . .
// ====================================================================================================================
if (targetSettings.test(window.location.href)) {
  createSettingsBlock("uwu-settings", uwusettings);

  const uwuSettingsElement = document.getElementById("uwusettings");
  if (uwuSettingsElement) {
    uwuSettingsElement.insertAdjacentHTML("beforeend", newsPanel);
  }

  loadSettings();

  if (!settings.extendedHints) {
    const uwuHideHints = document.createElement("style");
    uwuHideHints.innerHTML = `
    #uwusettings p {
      display: none;
    }
    `;
    document.head.appendChild(uwuHideHints);
  }

  document
    .querySelectorAll("#uwusettings [data-setting]")
    .forEach((element) => {
      const setting = element.dataset.setting;
      if (element.type === "checkbox") {
        element.checked = settings[setting];
      } else {
        element.value = settings[setting];
      }
    });

  // ====================================================================================================================
  //  . . . ТЕМА UWU . . .
  // ====================================================================================================================
  function applySettingsTheme(theme) {
    let css;
    const settingsBlock = document.getElementById("uwu-settings");
    const settingsHeader = document.getElementById("uwusettings-header");

    switch (theme) {
      case "classic":
        css = css_uwu_classic;
        break;
      case "dark":
        css = css_uwu_dark;
        const backgroundImageDark = window.getComputedStyle(
          document.body
        ).backgroundImage;
        applyBackgroundImage(settingsHeader, backgroundImageDark);
        settingsHeader.classList.add("header-rounded-image");
        break;
      case "glass":
        css = css_uwu_glass;
        const backgroundImageGlass = window.getComputedStyle(
          document.body
        ).backgroundImage;
        applyBackgroundImage(settingsBlock, backgroundImageGlass);
        settingsBlock.classList.add("main-rounded-image");
        break;
      default:
        css = css_uwu_classic;
        break;
    }

    const oldStyle = document.getElementById("css-uwu-theme");
    if (oldStyle) {
      oldStyle.remove();
    }

    document.head.insertAdjacentHTML(
      "beforeend",
      `<style id="css-uwu-theme">${css}</style>`
    );
  }

  applySettingsTheme(settings.settingsTheme);
  // ====================================================================================================================
  //  . . . ШРИФТ ГРОМКОСТИ ЧАТА . . .
  // ====================================================================================================================
  function saveFontSettings() {
    let fontSize = {};

    document.querySelectorAll("input[data-font-size]").forEach((input) => {
      fontSize[input.dataset.fontSize] = input.value;
    });

    uwuStorage.setItem("uwu_fontSize", fontSize);
  }

  function loadFontSettings() {
    let defaultFontSize = {
      vlm0: "10",
      vlm1: "11",
      vlm2: "11.5",
      vlm3: "12",
      vlm4: "12.5",
      vlm5: "13",
      vlm6: "15",
      vlm7: "17",
      vlm8: "19",
      vlm9: "21",
      vlm10: "23",
      fontSizeBody: "14",
      fontSizeSmall: "12",
      fontSizeLocation: "14",
      fontFamilyBody: "Verdana",
    };

    let fontSize = uwuStorage.getItem("uwu_fontSize") || defaultFontSize;

    document.querySelectorAll("input[data-font-size]").forEach((input) => {
      input.value = fontSize[input.dataset.fontSize] || "";
    });

    saveFontSettings();
  }

  document.querySelectorAll("input[data-font-size]").forEach((input) => {
    input.addEventListener("input", saveFontSettings);
  });

  loadFontSettings();
  // ====================================================================================================================
  //  . . . ПАРАМЕТРЫ КОСТЮМА . . .
  // ====================================================================================================================

  /**
   * Изменяет размер изображения до соотношения сторон 2:3.
   * @param {string} dataUrl - Изображение в формате Data URL.
   * @param {number} aspectRatio - Целевое соотношение сторон (ширина / высота).
   * @returns {Promise<string>} - Новый Data URL изображения с измененным размером.
   */
  async function resizeImageToAspectRatio(dataUrl, aspectRatio = 2 / 3) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.height = img.height;
          canvas.width = img.height * aspectRatio;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          const resizedDataUrl = canvas.toDataURL("image/png");
          resolve(resizedDataUrl);
        } catch (error) {
          reject(error);
        }
      };
      img.onerror = () => {
        reject(
          new Error("Не удалось загрузить изображение для изменения размера.")
        );
      };
      img.src = dataUrl;
    });
  }

  const costumeCheckbox = document.getElementById("personal-costume-panel");
  function updateCostumeFlexBoxState() {
    const costumeFlexBox = document.querySelectorAll(".costume-flex-box");
    const showCostumesCheckbox = document.getElementById("show-costumes");
    if (!costumeFlexBox || !showCostumesCheckbox) return;

    if (costumeCheckbox.checked) {
      costumeFlexBox.forEach((box) => {
        box.classList.remove("disabled");
      });
      showCostumesCheckbox.disabled = false;
    } else {
      costumeFlexBox.forEach((box) => {
        box.classList.add("disabled");
      });
      settings.showCostumesButtons = false;
      showCostumesCheckbox.checked = false;
      showCostumesCheckbox.disabled = true;
    }
  }

  costumeCheckbox.addEventListener("change", updateCostumeFlexBoxState);

  updateCostumeFlexBoxState();

  function applyCostumeFromSlot(slotIndex) {
    let data = uwuStorage.getItem("uwu_personal") || {};

    if (
      !data.costumes ||
      !data.costumes.slots ||
      !data.costumes.slots[slotIndex]
    ) {
      alert("В этом слоте нет костюма.");
      return;
    }

    const costumeImage = data.costumes.slots[slotIndex].base;
    if (!costumeImage) {
      alert("В этом слоте нет изображения костюма.");
      return;
    }

    data.costumes.base = costumeImage;
    uwuStorage.setItem("uwu_personal", data);

    alert("Костюм успешно применен!");
    loadCostume();
  }

  function removeCostumeFromSlot(slotIndex) {
    if (!confirm("Вы уверены, что хотите удалить этот слот с костюмом?")) {
      return;
    }

    let data = uwuStorage.getItem("uwu_personal") || {};

    if (
      data.costumes &&
      data.costumes.slots &&
      data.costumes.slots[slotIndex]
    ) {
      data.costumes.slots.splice(slotIndex, 1);
      data.costumes.slots = data.costumes.slots.filter((slot) => slot);
      uwuStorage.setItem("uwu_personal", data);
      alert("Слот " + (slotIndex + 1) + " успешно удален.");
      loadCostume();
    } else {
      alert("Не удалось найти костюм для удаления.");
    }
  }

  function loadCostume() {
    let data = uwuStorage.getItem("uwu_personal") || {};
    document.getElementById("cat-image-preview")?.remove();

    if (!data || !data.catImg) {
      // Нет данных для костюма или изображение не найдено
      return;
    }

    if (data.costumes && data.costumes.base) {
      const costumeImg = document.getElementById("cat-image-container");
      const imgElement = document.createElement("img");
      imgElement.id = "cat-image-preview";
      imgElement.style.backgroundColor = "transparent";
      imgElement.style.backgroundImage = "url(" + data.costumes.base + ")";
      imgElement.style.backgroundSize = data.catImg.size;
      imgElement.style.position = "absolute";
      imgElement.classList.add("costume-style");
      costumeImg.appendChild(imgElement);
    }

    const galleryArray = document.getElementById("costume-gallery");
    galleryArray.innerHTML = "";

    if (data.costumes && Array.isArray(data.costumes.slots)) {
      data.costumes.slots.forEach((slot, i) => {
        if (!slot) return;

        const boxContainer = document.createElement("div");
        boxContainer.className = "costume-gallery-box";

        const deleteButton = document.createElement("button");
        deleteButton.innerText = "❌";
        deleteButton.classList.add(
          "uwu-button",
          "remove-button",
          "costume-slot-delete-button"
        );
        deleteButton.title = "Удалить слот";
        deleteButton.addEventListener("click", () => removeCostumeFromSlot(i));
        boxContainer.appendChild(deleteButton);

        const slotNumber = document.createElement("div");
        slotNumber.innerText = `${i + 1}.`;
        slotNumber.style.position = "absolute";
        slotNumber.style.top = "10px";
        slotNumber.style.left = "10px";
        boxContainer.appendChild(slotNumber);

        const imageContainer = document.createElement("div");
        imageContainer.style.display = "flex";
        imageContainer.style.justifyContent = "center";

        const imageBox = document.createElement("div");
        imageBox.style.backgroundImage = `url(${data.catImg.src})`;
        imageBox.style.backgroundSize = data.catImg.size;
        imageBox.classList.add("costume-slot");
        imageBox.style.flex = "1";
        imageBox.style.maxWidth = "100px";
        imageContainer.appendChild(imageBox);

        if (slot.base) {
          const costumeBox = document.createElement("div");
          costumeBox.style.backgroundImage = `url(${slot.base})`;
          costumeBox.style.backgroundSize = data.catImg.size;
          costumeBox.classList.add("costume-slot");
          costumeBox.style.position = "absolute";
          costumeBox.id = "costume";
          imageContainer.appendChild(costumeBox);
        }

        const applyButton = document.createElement("button");
        applyButton.classList = "uwu-button install-button";
        applyButton.style.margin = "0.5rem";
        applyButton.innerText = "Применить костюм";
        applyButton.addEventListener("click", () => applyCostumeFromSlot(i));

        boxContainer.appendChild(imageContainer);
        boxContainer.appendChild(applyButton);
        galleryArray.appendChild(boxContainer);
      });
    }

    const addSlotButton = document.createElement("div");
    addSlotButton.className = "costume-gallery-box";
    addSlotButton.style.display = "flex";
    addSlotButton.style.alignItems = "center";
    addSlotButton.style.justifyContent = "center";
    addSlotButton.style.fontSize = "5rem";
    addSlotButton.style.cursor = "pointer";
    addSlotButton.style.minWidth = "150px";
    addSlotButton.style.minHeight = "220px";
    addSlotButton.innerText = "+";
    addSlotButton.title = "Добавить новый костюм из файла";
    addSlotButton.addEventListener("click", () => {
      document.getElementById("costume-file").click();
    });
    galleryArray.appendChild(addSlotButton);
  }

  function readImageFileAsDataURL(inputId, onSuccess, onError) {
    const imgInput = document.getElementById(inputId);
    const file = imgInput.files[0];
    if (!file) {
      alert("Пожалуйста, выберите изображение для костюма.");
      return;
    }
    const reader = new FileReader();
    reader.onerror = function () {
      if (onError) onError("Ошибка при чтении файла. Попробуйте еще раз.");
    };
    reader.onload = function (e) {
      if (!e.target.result.startsWith("data:image/")) {
        if (onError) onError("Пожалуйста, выберите изображение для костюма.");
        return;
      }
      if (onSuccess) onSuccess(e.target.result);
    };
    reader.readAsDataURL(file);
  }

  if (settings.personalCostumes) {
    let rawData = uwuStorage.getItem("uwu_personal") || {};
    let dataChanged = false;

    if (!rawData.cats && rawData.id) {
      rawData.cats = {};
      rawData.cats[rawData.id] = {
        id: rawData.id,
        name: "Мой кот",
        img: rawData.catImg?.src || "",
        size: rawData.catImg?.size || "contain",
        costume: rawData.costumes?.base || "",
      };
      if (rawData.costumes?.slots) rawData.slots = rawData.costumes.slots;
      delete rawData.id;
      delete rawData.catImg;
      delete rawData.costumes;
      dataChanged = true;
    }

    if (!rawData.cats) {
      rawData.cats = {};
      dataChanged = true;
    }
    if (!rawData.slots) {
      rawData.slots = [];
      dataChanged = true;
    }

    Object.keys(rawData.cats).forEach((catId) => {
      let cat = rawData.cats[catId];
      if (!cat.poses) {
        cat.poses = {};
        if (cat.costume && cat.img) {
          const fileName = cat.img.split("/").pop() || "unknown";
          cat.poses[fileName] = cat.costume;
        }
        delete cat.costume;
        dataChanged = true;
      }
    });

    if (dataChanged) uwuStorage.setItem("uwu_personal", rawData);

    let currentEditCatId = null;
    let currentPoseKey = null;

    const catSelect = document.getElementById("current-cat-select");
    const poseSelect = document.getElementById("current-pose-select");
    const warningBox = document.getElementById("no-cats-warning");
    const flexBox = document.querySelector(".costume-flex-box");
    const previewContainer = document.getElementById("cat-image-container");
    const previewName = document.getElementById("cat-preview-name");

    function updateCatSelector() {
      let data = uwuStorage.getItem("uwu_personal") || { cats: {}, slots: [] };
      if (catSelect) catSelect.innerHTML = "";
      const catIds = Object.keys(data.cats);

      if (catIds.length === 0) {
        if (warningBox) warningBox.style.display = "block";
        if (flexBox) flexBox.classList.add("disabled");
        return;
      }

      if (warningBox) warningBox.style.display = "none";
      if (costumeCheckbox.checked && flexBox)
        flexBox.classList.remove("disabled");

      catIds.forEach((id) => {
        const cat = data.cats[id];
        const option = document.createElement("option");
        option.value = id;
        option.textContent = `${cat.name} (ID: ${id})`;
        if (catSelect) catSelect.appendChild(option);
      });

      if (currentEditCatId && data.cats[currentEditCatId]) {
        if (catSelect) catSelect.value = currentEditCatId;
      } else {
        currentEditCatId = catIds[0];
        if (catSelect) catSelect.value = currentEditCatId;
      }

      updatePoseSelector();
    }

    function updatePoseSelector() {
      let data = uwuStorage.getItem("uwu_personal");
      if (!currentEditCatId || !data.cats[currentEditCatId]) return;

      const cat = data.cats[currentEditCatId];
      if (poseSelect) poseSelect.innerHTML = "";

      const poses = Object.keys(cat.poses);

      if (poses.length === 0 && cat.img) {
        const fileName = cat.img.split("/").pop();
        cat.poses[fileName] = "";
        poses.push(fileName);
        uwuStorage.setItem("uwu_personal", data);
      }

      poses.forEach((poseFile, index) => {
        const option = document.createElement("option");
        option.value = poseFile;
        const hasCostume = cat.poses[poseFile] ? "✅" : "❌";
        option.textContent = `${index + 1}. ${poseFile} [${hasCostume}]`;
        if (poseSelect) poseSelect.appendChild(option);
      });

      if (poses.length > 0) {
        currentPoseKey = poses[0];
        if (poseSelect) poseSelect.value = currentPoseKey;
      } else {
        currentPoseKey = null;
      }

      renderPreview();
    }

    function renderPreview() {
      let data = uwuStorage.getItem("uwu_personal");
      if (
        !currentEditCatId ||
        !data.cats[currentEditCatId] ||
        !currentPoseKey
      ) {
        if (previewContainer) previewContainer.innerHTML = "";
        if (previewName) previewName.textContent = "...";
        return;
      }

      const cat = data.cats[currentEditCatId];
      const currentCostume = cat.poses[currentPoseKey];

      if (previewName) previewName.textContent = cat.name;

      if (previewContainer) {
        previewContainer.innerHTML = "";
        previewContainer.style.minWidth = "100px";
        previewContainer.style.minHeight = "150px";
        previewContainer.style.flexShrink = "0";

        if (!cat.img) {
          previewContainer.innerHTML = `
                    <div style="
                        width: 100%; 
                        height: 100%; 
                        display: flex; 
                        align-items: center; 
                        justify-content: center; 
                        text-align: center; 
                        font-size: 0.8em; 
                        color: #ffaaaa; 
                        padding: 5px; 
                        box-sizing: border-box;
                    ">
                        Внешность не загружена.<br>Зайдите в Игровую!
                    </div>
                `;
          return;
        }

        let bgUrl = "";
        if (cat.img.includes(currentPoseKey)) {
          bgUrl = cat.img;
        } else {
          bgUrl = `/cw3/composited/${currentPoseKey}`;
        }

        // 1. Слой кота
        const catImg = document.createElement("div");
        catImg.style.width = "100px";
        catImg.style.height = "150px";
        catImg.style.position = "absolute";
        catImg.style.top = "0";
        catImg.style.left = "0";
        catImg.style.backgroundImage = `url(${bgUrl})`;
        catImg.style.backgroundSize = cat.size || "contain";
        catImg.style.backgroundPosition = "center";
        catImg.style.backgroundRepeat = "no-repeat";
        previewContainer.appendChild(catImg);

        // 2. Слой костюма
        if (currentCostume) {
          const costumeImg = document.createElement("div");
          costumeImg.style.width = "100px";
          costumeImg.style.height = "150px";
          costumeImg.style.position = "absolute";
          costumeImg.style.top = "0";
          costumeImg.style.left = "0";
          costumeImg.style.backgroundImage = `url(${currentCostume})`;
          costumeImg.style.backgroundSize = cat.size || "contain";
          costumeImg.style.backgroundPosition = "center";
          costumeImg.style.backgroundRepeat = "no-repeat";
          previewContainer.appendChild(costumeImg);
        }
      }
      loadGallery();
    }

    function loadGallery() {
      const gallery = document.getElementById("costume-gallery");
      if (!gallery) return;
      gallery.innerHTML = "";

      let data = uwuStorage.getItem("uwu_personal") || { slots: [] };

      const addBtn = document.createElement("div");
      addBtn.className = "costume-gallery-box";
      addBtn.style.justifyContent = "center";
      addBtn.style.cursor = "pointer";
      addBtn.style.minWidth = "140px";
      addBtn.style.minHeight = "230px";
      addBtn.innerHTML =
        "<div style='font-size: 3em;'>+</div><div>Из файла</div>";
      addBtn.addEventListener("click", () =>
        document.getElementById("costume-file").click()
      );
      gallery.appendChild(addBtn);

      data.slots.forEach((slotBase64, index) => {
        const box = document.createElement("div");
        box.className = "costume-gallery-box";
        box.style.minWidth = "140px";

        const slotPreview = document.createElement("div");
        slotPreview.style.width = "100px";
        slotPreview.style.height = "150px";
        slotPreview.style.minWidth = "100px";
        slotPreview.style.minHeight = "150px";
        slotPreview.style.flexShrink = "0";
        slotPreview.style.position = "relative";
        slotPreview.style.border = "1px solid rgba(255,255,255,0.1)";
        slotPreview.style.borderRadius = "5px";

        if (currentEditCatId && data.cats[currentEditCatId] && currentPoseKey) {
          const cat = data.cats[currentEditCatId];
          let bgUrl = cat.img.includes(currentPoseKey)
            ? cat.img
            : `/cw3/composited/${currentPoseKey}`;

          const catLayer = document.createElement("div");
          catLayer.style.position = "absolute";
          catLayer.style.top = "0";
          catLayer.style.left = "0";
          catLayer.style.width = "100%";
          catLayer.style.height = "100%";
          catLayer.style.backgroundImage = `url(${bgUrl})`;
          catLayer.style.backgroundSize = cat.size || "contain";
          catLayer.style.backgroundRepeat = "no-repeat";
          catLayer.style.backgroundPosition = "center";
          slotPreview.appendChild(catLayer);
        }

        const suitDiv = document.createElement("div");
        suitDiv.style.position = "absolute";
        suitDiv.style.top = "0";
        suitDiv.style.left = "0";
        suitDiv.style.width = "100%";
        suitDiv.style.height = "100%";
        suitDiv.style.backgroundImage = `url(${slotBase64})`;
        suitDiv.style.backgroundSize =
          currentEditCatId && data.cats[currentEditCatId]
            ? data.cats[currentEditCatId].size
            : "contain";
        suitDiv.style.backgroundRepeat = "no-repeat";
        suitDiv.style.backgroundPosition = "center";
        slotPreview.appendChild(suitDiv);

        box.appendChild(slotPreview);

        const applyBtn = document.createElement("button");
        applyBtn.className = "uwu-button install-button";
        applyBtn.innerText = "Надеть";
        applyBtn.style.width = "100%";
        applyBtn.style.marginTop = "10px";
        applyBtn.addEventListener("click", () => {
          if (!currentEditCatId || !currentPoseKey)
            return alert("Не выбран кот или поза!");
          let d = uwuStorage.getItem("uwu_personal");
          d.cats[currentEditCatId].poses[currentPoseKey] = slotBase64;
          uwuStorage.setItem("uwu_personal", d);
          updatePoseSelector();
          renderPreview();
        });

        const delBtn = document.createElement("button");
        delBtn.className =
          "costume-slot-delete-button uwu-button remove-button";
        delBtn.innerText = "✖";
        delBtn.title = "Удалить слот";
        delBtn.addEventListener("click", () => {
          if (confirm("Удалить этот костюм из библиотеки?")) {
            let d = uwuStorage.getItem("uwu_personal");
            d.slots.splice(index, 1);
            uwuStorage.setItem("uwu_personal", d);
            loadGallery();
          }
        });

        box.appendChild(applyBtn);
        box.appendChild(delBtn);
        gallery.appendChild(box);
      });
    }

    if (catSelect) {
      catSelect.addEventListener("change", (e) => {
        currentEditCatId = e.target.value;
        updatePoseSelector();
      });
    }

    if (poseSelect) {
      poseSelect.addEventListener("change", (e) => {
        currentPoseKey = e.target.value;
        renderPreview();
      });
    }

    const deleteCatBtn = document.getElementById("delete-cat-btn");
    if (deleteCatBtn) {
      deleteCatBtn.addEventListener("click", () => {
        if (!currentEditCatId) return;
        if (confirm("Удалить этого кота из списка?")) {
          let data = uwuStorage.getItem("uwu_personal");
          delete data.cats[currentEditCatId];
          uwuStorage.setItem("uwu_personal", data);
          currentEditCatId = null;
          updateCatSelector();
        }
      });
    }

    const changeBtn = document.getElementById("changeCostume");
    if (changeBtn) {
      changeBtn.addEventListener("click", () => {
        readImageFileAsDataURL(
          "costume-file",
          async (dataUrl) => {
            if (!currentEditCatId || !currentPoseKey)
              return alert("Сначала выберите кота и позу.");
            try {
              const resized = await resizeImageToAspectRatio(dataUrl);
              let data = uwuStorage.getItem("uwu_personal");
              data.cats[currentEditCatId].poses[currentPoseKey] = resized;
              uwuStorage.setItem("uwu_personal", data);
              updatePoseSelector();
              renderPreview();
              alert("Костюм надет на выбранную позу!");
            } catch (e) {
              console.error(e);
              alert("Ошибка обработки");
            }
          },
          alert
        );
      });
    }

    const removeBtn = document.getElementById("removeCostume");
    if (removeBtn) {
      removeBtn.addEventListener("click", () => {
        if (!currentEditCatId || !currentPoseKey) return;
        let data = uwuStorage.getItem("uwu_personal");
        data.cats[currentEditCatId].poses[currentPoseKey] = "";
        uwuStorage.setItem("uwu_personal", data);
        updatePoseSelector();
        renderPreview();
      });
    }

    const saveSlotBtn = document.getElementById("saveCostumeToNewSlot");
    if (saveSlotBtn) {
      saveSlotBtn.addEventListener("click", () => {
        readImageFileAsDataURL(
          "costume-file",
          async (dataUrl) => {
            try {
              const resized = await resizeImageToAspectRatio(dataUrl);
              let data = uwuStorage.getItem("uwu_personal") || {
                cats: {},
                slots: [],
              };
              if (!data.slots) data.slots = [];
              data.slots.push(resized);
              uwuStorage.setItem("uwu_personal", data);
              loadGallery();
              alert("Костюм сохранен!");
            } catch (e) {
              console.error(e);
              alert("Ошибка");
            }
          },
          alert
        );
      });
    }

    updateCatSelector();
  }

  // ====================================================================================================================
  //  . . . ИМПОРТ ЛС ИЗ ДРУГИХ МОДОВ (ВАРОМОДА) . . .
  // ====================================================================================================================
  function importLsFromVarmod() {
    try {
      const varmodLsRaw = localStorage.getItem("cwmod_ls");
      if (!varmodLsRaw) {
        alert(
          "Сохранённые ЛС из других модов или скриптов не найдены в вашем браузере."
        );
        return;
      }

      const varmodLs = JSON.parse(varmodLsRaw);

      const uwuLs = uwuStorage.getItem("uwu_saved_ls") || {};

      let importedCount = 0;
      let updatedCount = 0;

      for (const lsId in varmodLs) {
        if (uwuLs.hasOwnProperty(lsId)) {
          const varmodDate = new Date(varmodLs[lsId].savedate);
          const uwuDate = new Date(uwuLs[lsId].savedate);
          if (varmodDate > uwuDate) {
            uwuLs[lsId] = varmodLs[lsId];
            updatedCount++;
          }
        } else {
          uwuLs[lsId] = varmodLs[lsId];
          importedCount++;
        }
      }

      uwuStorage.setItem("uwu_saved_ls", uwuLs);
      alert(
        `Импорт успешно завершён!\nНовых переписок импортировано: ${importedCount}\nСуществующих переписок обновлено: ${updatedCount}`
      );
    } catch (error) {
      console.error("UwU | Ошибка при импорте ЛС из других модов:", error);
      alert(
        "Произошла ошибка во время импорта. Возможно, данные других модов повреждены."
      );
    }
  }

  const importLsButton = document.getElementById("import-ls-from-other-mods");
  if (importLsButton) {
    importLsButton.addEventListener("click", importLsFromVarmod);
  }

  /**
   * Настраивает логику для индивидуального импорта/экспорта сохраненных ЛС.
   */
  function setupLsImportExport() {
    const exportField = document.getElementById("ls-export-field");
    const importField = document.getElementById("ls-import-field");
    const importButton = document.getElementById("ls-import-btn");

    if (!exportField || !importField || !importButton) return;

    function updateLsExportField() {
      const savedLs = uwuStorage.getItem("uwu_saved_ls") || {};
      exportField.value = JSON.stringify(savedLs);
    }

    importButton.addEventListener("click", () => {
      const jsonString = importField.value;
      if (!jsonString.trim()) {
        alert("Поле для импорта пустое.");
        return;
      }

      try {
        const importedLs = JSON.parse(jsonString);

        if (typeof importedLs !== "object" || importedLs === null) {
          throw new Error("Импортируемые данные не являются объектом.");
        }

        uwuStorage.setItem("uwu_saved_ls", importedLs);
        alert("Сохранённые ЛС успешно импортированы!");
        importField.value = "";
        updateLsExportField();
      } catch (error) {
        alert(
          "Ошибка! Не удалось импортировать ЛС. Проверьте корректность вставленных данных."
        );
        console.error("UwU | Ошибка импорта ЛС:", error);
      }
    });

    updateLsExportField();
  }

  setupLsImportExport();
  // ====================================================================================================================
  //  . . . ТЕМЫ И ЦВЕТА ИГРОВОЙ . . .
  // ====================================================================================================================
  const colorInputs = document.querySelectorAll(
    "#color-picker input[type='text']"
  );
  const saveThemeButton = document.getElementById("saveThemeButton");
  const themeSelect = document.getElementById("theme-select");
  const addThemeButton = document.getElementById("addThemeButton");
  const removeThemeButton = document.getElementById("removeThemeButton");

  let currentThemeName = getCurrentThemeName();
  let allThemes = getThemes();

  function loadThemeToInputs(themeName) {
    const theme = allThemes[themeName]?.colors;
    colorInputs.forEach((input) => {
      const colorKey = input.dataset.color;
      input.value = theme?.[colorKey] || "";
    });
  }

  function saveThemeFromInputs() {
    const themeData = { colors: {} };
    colorInputs.forEach((input) => {
      const colorKey = input.dataset.color;
      themeData.colors[colorKey] = input.value;
    });
    allThemes[currentThemeName] = themeData;
    saveThemes(allThemes);
    console.log(`Тема "${currentThemeName}" сохранена!`);
  }

  function updateThemeSelect() {
    themeSelect.innerHTML = "";
    Object.keys(allThemes).forEach((name) => {
      const option = document.createElement("option");
      option.value = name;
      option.textContent = name;
      themeSelect.appendChild(option);
    });
    themeSelect.value = currentThemeName;
    removeThemeButton.style.display = Object.keys(defaultThemes).includes(
      currentThemeName
    )
      ? "none"
      : "inline";
  }

  themeSelect.addEventListener("change", (event) => {
    currentThemeName = event.target.value;
    setCurrentThemeName(currentThemeName);
    loadThemeToInputs(currentThemeName);
    updateThemeSelect();
    updateSaveButtonState();
  });

  addThemeButton.addEventListener("click", () => {
    const newThemeName = prompt("Введите название новой темы:");
    if (newThemeName && !allThemes[newThemeName]) {
      allThemes[newThemeName] = { colors: {} };
      saveThemes(allThemes);
      updateThemeSelect();
      themeSelect.value = newThemeName;
      currentThemeName = newThemeName;
      setCurrentThemeName(currentThemeName);
      loadThemeToInputs(currentThemeName);
    }
  });

  removeThemeButton.addEventListener("click", () => {
    if (!Object.keys(defaultThemes).includes(currentThemeName)) {
      delete allThemes[currentThemeName];
      saveThemes(allThemes);
      currentThemeName = "Тёмная Тема";
      setCurrentThemeName(currentThemeName);
      updateThemeSelect();
      loadThemeToInputs(currentThemeName);
    }
  });

  saveThemeButton.addEventListener("click", () => {
    if (isDefaultTheme(currentThemeName)) {
      alert(
        "Вы не можете изменять стандартные темы. Пожалуйста, создайте свою собственную тему."
      );
    } else {
      saveThemeFromInputs();
    }
  });

  colorInputs.forEach((input) => {
    input.addEventListener("input", () => {
      if (isDefaultTheme(currentThemeName)) {
        alert(
          "Вы не можете изменять стандартные темы. Пожалуйста, создайте свою собственную тему."
        );
        loadThemeToInputs(currentThemeName);
      } else {
        saveThemeFromInputs();
      }
    });
  });

  updateThemeSelect();
  loadThemeToInputs(currentThemeName);
  // ====================================================================================================================
  //  . . . РАБОТА ЦВЕТОВ НАВЫКОВ И ПАРАМЕТРОВ . . .
  // ====================================================================================================================
  document
    .querySelectorAll('#parameters-color-settings input[type="color"]')
    .forEach((element) => {
      element.addEventListener("change", () => {
        const paramId = element.dataset.param;
        const colorType = element.dataset.colorType;
        const colorValue = element.value;

        if (!settings.parametersColors[paramId]) {
          settings.parametersColors[paramId] = [];
        }
        const colorIndex =
          colorType === "bar-from"
            ? 0
            : colorType === "bar-to"
            ? 1
            : colorType === "bg-from"
            ? 2
            : 3;
        settings.parametersColors[paramId][colorIndex] = colorValue;

        saveSettings();
      });
    });

  function restoreColorPickers() {
    for (const paramId in settings.parametersColors) {
      const colors = settings.parametersColors[paramId];

      const barFromInput = document.querySelector(
        `#parameters-color-settings input[type="color"][data-param="${paramId}"][data-color-type="bar-from"]`
      );
      const barToInput = document.querySelector(
        `#parameters-color-settings input[type="color"][data-param="${paramId}"][data-color-type="bar-to"]`
      );
      const bgFromInput = document.querySelector(
        `#parameters-color-settings input[type="color"][data-param="${paramId}"][data-color-type="bg-from"]`
      );
      const bgToInput = document.querySelector(
        `#parameters-color-settings input[type="color"][data-param="${paramId}"][data-color-type="bg-to"]`
      );

      if (barFromInput) barFromInput.value = colors[0];
      if (barToInput) barToInput.value = colors[1];
      if (bgFromInput) bgFromInput.value = colors[2];
      if (bgToInput) bgToInput.value = colors[3];
    }
  }

  restoreColorPickers();

  function setupParameterColorImportExport() {
    const exportField = document.getElementById("param-colors-export-field");
    const importField = document.getElementById("param-colors-import-field");
    const importButton = document.getElementById("param-colors-import-btn");

    if (!exportField || !importField || !importButton) return;

    function updateParamColorsExportField() {
      try {
        exportField.value = JSON.stringify(settings.parametersColors);
      } catch (error) {
        console.error("Ошибка при обновлении поля экспорта цветов:", error);
        exportField.value = "Ошибка экспорта.";
      }
    }

    importButton.addEventListener("click", () => {
      const jsonString = importField.value;
      if (!jsonString.trim()) {
        alert("Поле для импорта пустое.");
        return;
      }

      try {
        const importedColors = JSON.parse(jsonString);

        if (
          typeof importedColors !== "object" ||
          importedColors === null ||
          !importedColors.dream
        ) {
          throw new Error("Неверный формат данных.");
        }

        settings.parametersColors = importedColors;
        saveSettings();
        restoreColorPickers();
        updateParamColorsExportField();

        alert("Настройки цветов успешно импортированы!");
        importField.value = "";
      } catch (error) {
        alert(
          "Ошибка! Не удалось импортировать настройки. Проверьте корректность вставленных данных."
        );
        console.error("Ошибка импорта цветов параметров:", error);
      }
    });

    updateParamColorsExportField();
  }

  setupParameterColorImportExport();
  // ====================================================================================================================
  //  . . . ПОДСВЕТКА РЕСУРСОВ . . .
  // ====================================================================================================================
  function saveHighlightSettings() {
    const highlightResources = [];

    document
      .querySelectorAll(".uwu-table-highlight-Resources tbody tr")
      .forEach((row) => {
        const resourceName =
          row.querySelector(".uwu-color-picker").dataset.resource;
        const colorPicker = row.querySelector(".uwu-color-picker");
        const checkbox = row.querySelector(".uwu-highlight-checkbox");

        const resource = {
          name: resourceName,
          color: colorPicker.value,
          highlight: checkbox.checked,
        };

        highlightResources.push(resource);
      });

    uwuStorage.setItem("uwu_highlightResources", highlightResources);
  }

  function restoreHighlightSettings() {
    const highlightResources = uwuStorage.getItem("uwu_highlightResources");

    if (highlightResources) {
      highlightResources.forEach((resource) => {
        const colorPicker = document.querySelector(
          `.uwu-color-picker[data-resource="${resource.name}"]`
        );
        const checkbox = document.querySelector(
          `.uwu-highlight-checkbox[data-resource="${resource.name}"]`
        );

        if (colorPicker) colorPicker.value = resource.color;
        if (checkbox) checkbox.checked = resource.highlight;
      });
    }
  }

  restoreHighlightSettings();

  document.querySelectorAll(".uwu-color-picker").forEach((element) => {
    element.addEventListener("input", saveHighlightSettings);
  });

  document.querySelectorAll(".uwu-highlight-checkbox").forEach((element) => {
    element.addEventListener("change", saveHighlightSettings);
  });

  // ====================================================================================================================
  //  . . . ЦВЕТА КОМАНДНЫХ БОЁВ . . .
  // ====================================================================================================================
  document
    .querySelectorAll('#colorSettingsTable input[type="color"]')
    .forEach((element) => {
      element.addEventListener("change", () => {
        const team = `team${element.dataset.team}`;
        const part = element.dataset.part === "green" ? 0 : 1;
        const colorValue = element.value;
        settings.fightTeamsColors[team][part] = colorValue;
        saveSettings();
      });
    });

  function restoreColorTeamsPickers() {
    document
      .querySelectorAll('#colorSettingsTable input[type="color"]')
      .forEach((element) => {
        element.addEventListener("change", () => {
          const team = `team${element.dataset.team}`;
          const part = element.dataset.part === "green" ? 0 : 1;
          const colorValue = element.value;
          settings.fightTeamsColors[team][part] = colorValue;
          saveSettings();
        });
      });
  }

  restoreColorTeamsPickers();
  // ====================================================================================================================
  //   . . . СБРОС НАСТРОЕК . . .
  // ====================================================================================================================
  const settingsKeys = [
    "uwu_settings",
    "uwu_version",
    "uwu_layoutSettings",
    "uwu_climbingPanelState",
    "uwu_moduleStates",
    "uwu_fightPanelPosition",
    "uwu_climbingPanelStatus",
    "uwu_privateModules",
    "uwu_colorThemes",
    "uwu_currentTheme",
    "uwu_fontSize",
    "uwu_clock",
    "uwu_templates",
    "uwu_highlightResources",
    "uwu_saved_ls",
    "uwu_activity",
    "uwu_fastStyles",
    "uwu_fastStyles_hideCatTooltip",
    "uwu_fightTeamsCats",
    "uwu_catchingLog_customItems",
  ];

  function resetAllSaves() {
    const confirmReset = confirm(
      "Точно сбросить ВСЕ UwU Настройки? Это удалить абсолютно всё по UwU скрипту/моду, даже ваши карты Минных полей, темы и многое другое!"
    );
    if (confirmReset) {
      settingsKeys.forEach((key) => {
        uwuStorage.removeItem(key);
        console.log(`Удалено ${key}`);
      });
      console.log("Все настройки сброшены");
    } else {
      console.log("Сброс настроек отменен");
    }
  }

  document
    .getElementById("resetAllSaves")
    .addEventListener("click", resetAllSaves);

  // ====================================================================================================================
  //  . . . ЕДИНОЕ ХРАНИЛИЩЕ . . .
  // ====================================================================================================================

  const unifiedStorageCheckbox = document.querySelector(
    '[data-setting="unifiedStorage"]'
  );

  if (
    typeof GM_setValue === "undefined" ||
    typeof GM_getValue === "undefined" ||
    typeof GM_listValues === "undefined" ||
    typeof GM_deleteValue === "undefined"
  ) {
    const container = unifiedStorageCheckbox.parentElement;
    container.innerHTML =
      '<p style="color: #ff7878;"><b>Единое хранилище недоступно.</b><br>Вероятнее всего, ваш менеджер скриптов (например, Tampermonkey) не предоставляет необходимый API для кросс-доменной синхронизации :(</p>';
  } else {
    unifiedStorageCheckbox.addEventListener("change", () => {
      if (unifiedStorageCheckbox.checked) {
        const confirmation = confirm(
          "Вы уверены, что хотите включить единое хранилище?\n\n" +
            "Все ваши текущие настройки и данные с этого сайта будут скопированы в общее хранилище и заменят любые данные, которые могли там быть.\n\n" +
            "Убедитесь, что вы находитесь на сайте (.net или .su) с теми настройками и данными, которые хотите сделать основными."
        );

        if (confirmation) {
          settings.unifiedStorage = true;
          uwuStorage.migrateAllToGM();
          GM_setValue("uwu_settings", JSON.stringify(settings));
          alert(
            "Единое хранилище включено. Настройки и данные с этого сайта были скопированы. Страница будет перезагружена."
          );
          location.reload();
        } else {
          unifiedStorageCheckbox.checked = false;
        }
      } else {
        const confirmation = confirm(
          "Вы уверены, что хотите отключить единое хранилище?\n\n" +
            "Текущие настройки и данные из единого хранилища скопируются в локальное для этого сайта.\n\n" +
            "Скрипт снова будет использовать отдельное хранилище для этого домена (localStorage)."
        );

        if (confirmation) {
          const keysToProcess = GM_listValues();
          keysToProcess.forEach((key) => {
            if (key.startsWith("uwu_")) {
              const value = GM_getValue(key);
              localStorage.setItem(key, value);
            }
          });

          settings.unifiedStorage = false;

          GM_setValue("uwu_settings", JSON.stringify(settings));
          localStorage.setItem("uwu_settings", JSON.stringify(settings));

          alert(
            "Единое хранилище отключено. Ваши настройки и данные были скопированы в локальное хранилище для этого сайта. Страница будет перезагружена."
          );
          location.reload();
        } else {
          unifiedStorageCheckbox.checked = true;
        }
      }
    });
  }

  // ====================================================================================================================
  //  . . . ВЗАИМОИСКЛЮЧАЮЩИЕСЯ ЧЕКБОКСЫ . . .
  // ====================================================================================================================
  const exclusiveCheckboxGroups = [
    ["backgroundRepeat", "backgroundUser"],
    ["parametersBackgroundImage", "parametersUserBackgroundImage"],
  ];

  document
    .querySelectorAll("#uwusettings [data-setting]")
    .forEach((element) => {
      const setting = element.dataset.setting;
      element.addEventListener("change", () => {
        if (element.type === "checkbox") {
          const group = exclusiveCheckboxGroups.find((g) =>
            g.includes(setting)
          );
          if (group) {
            group.forEach((s) => {
              if (s !== setting) {
                settings[s] = false;
                document.querySelector(
                  `#uwusettings [data-setting="${s}"]`
                ).checked = false;
              }
            });
          }
          settings[setting] = element.checked;
        } else {
          settings[setting] = element.value;
        }
        saveSettings();
      });
    });

  // ====================================================================================================================
  //  . . . НАСТРОЙКИ ЛОГА ЛОВЛИ - СВОИ НАЗВАНИЯ ПРЕДМЕТОВ . . .
  // ====================================================================================================================
  function setupCatchingLogCustomItems() {
    const textarea = document.getElementById("catching-log-custom-items");
    const saveBtn = document.getElementById("save-custom-items-btn");
    const exportField = document.getElementById("custom-items-export-field");
    const importField = document.getElementById("custom-items-import-field");
    const importBtn = document.getElementById("custom-items-import-btn");

    if (!textarea || !saveBtn || !exportField || !importField || !importBtn)
      return;

    function parseTextareaToObject(text) {
      const lines = text.split("\n");
      const obj = {};
      lines.forEach((line) => {
        if (line.includes("=")) {
          const parts = line.split("=");
          const id = parts[0].trim();
          const name = parts.slice(1).join("=").trim();
          if (id && name) {
            obj[id] = name;
          }
        }
      });
      return obj;
    }

    function objectToTextarea(obj) {
      return Object.entries(obj)
        .map(([id, name]) => `${id}=${name}`)
        .join("\n");
    }

    function loadAndDisplay() {
      const customItems =
        uwuStorage.getItem("uwu_catchingLog_customItems") || {};
      textarea.value = objectToTextarea(customItems);
      exportField.value = JSON.stringify(customItems);
    }

    saveBtn.addEventListener("click", () => {
      const customItemsObject = parseTextareaToObject(textarea.value);
      uwuStorage.setItem("uwu_catchingLog_customItems", customItemsObject);
      alert("Список названий сохранён!");
      loadAndDisplay();
    });

    importBtn.addEventListener("click", () => {
      const jsonString = importField.value;
      if (!jsonString.trim()) {
        alert("Поле для импорта пустое.");
        return;
      }
      try {
        const importedItems = JSON.parse(jsonString);
        if (typeof importedItems !== "object" || importedItems === null) {
          throw new Error("Неверный формат данных.");
        }
        uwuStorage.setItem("uwu_catchingLog_customItems", importedItems);
        alert("Список названий успешно импортирован!");
        importField.value = "";
        loadAndDisplay();
      } catch (error) {
        alert(
          "Ошибка! Не удалось импортировать список. Проверьте корректность вставленных данных."
        );
        console.error("UwU | Ошибка импорта названий предметов:", error);
      }
    });

    exportField.addEventListener("click", function () {
      this.select();
    });

    loadAndDisplay();
  }

  setupCatchingLogCustomItems();
  // ====================================================================================================================
  //  . . . СОЗДАНИЕ ВЫПАДАЮЩИХ СПИСКОВ ПРИ ПОМОЩИ ФУНКЦИИ createCustomSelect . . .
  // ====================================================================================================================
  loadSettings();
  // Звуки звуки звуки, вуху.
  const notificationSounds = [
    { name: "Звук 1", id: "notificationSound1" },
    { name: "Звук 2", id: "notificationSound2" },
    { name: "Звук 3", id: "notificationSound3" },
    { name: "Блокирование", id: "notificationBlockSound1" },
  ];

  createCustomSelect("climbingRefreshNotificationSound", notificationSounds);
  createCustomSelect("myNameNotificationSound", notificationSounds);
  createCustomSelect("notificationPMSound", notificationSounds);
  createCustomSelect("notificationActionEndSound", notificationSounds);
  createCustomSelect("notificationInMouthSound", notificationSounds);
  createCustomSelect("notificationInFightModeSound", notificationSounds);
  createCustomSelect("notificationBlockSound", notificationSounds);
  createCustomSelect("intervalTimerSound", notificationSounds);
  // ==============================================================================
  const howShowOtherCatsList = [
    { name: "Не отображать", id: "1" },
    { name: "Компактно", id: "2" },
    { name: "Целиком", id: "3" },
  ];

  createCustomSelect("showOtherCatsList", howShowOtherCatsList);
  // ==============================================================================
  const themeOptions = [
    { id: "classic", name: "Классическая" },
    { id: "dark", name: "Тёмная" },
    { id: "glass", name: "Стеклянная" },
  ];

  createCustomSelect("settingsTheme", themeOptions);
  // ==============================================================================
  const climbingPanelOrientations = [
    { id: "vertical", name: "Вертикальный" },
    { id: "horizontal", name: "Горизонтальный" },
  ];

  createCustomSelect("climbingPanelOrientation", climbingPanelOrientations);
  // ==============================================================================
  const clockStyles = [
    { id: "compact", name: "Компактный" },
    { id: "standard", name: "Стандартный" },
    { id: "string", name: "Строчный" },
  ];

  createCustomSelect("clockStyle", clockStyles);
  // ==============================================================================
  const clockPositions = [
    { id: "fly", name: "Свободно" },
    { id: "tos", name: "В блоке погоды" },
  ];

  createCustomSelect("clockPosition", clockPositions);
  // ==============================================================================
  const highlightResourcesStyles = [
    { id: "background", name: "Фон / Быстро" },
    { id: "glow", name: "Свечение / Медленно" },
  ];

  createCustomSelect("highlightResourcesStyle", highlightResourcesStyles);
  // ==============================================================================
  const cleaningLogStyles = [
    { id: "smart", name: "Умный" },
    // { id: "standart", name: "Стандартный" },
  ];

  createCustomSelect("cleaningLogStyle", cleaningLogStyles);
  // ==============================================================================
  const defectsStyles = [{ id: "default", name: "Стандартный" }];

  createCustomSelect("defectsStyle", defectsStyles);
  // ==============================================================================
  const defectsQualities = [
    { id: "low", name: "Низкое/Старое (100x150)" },
    { id: "high", name: "Высокое/Новое (200x300)" },
  ];

  createCustomSelect("defectsQuality", defectsQualities);
  // ==============================================================================
  const climbingPanelInputsStyles = [
    { id: "keyboard", name: "Клавиатура" },
    { id: "standart", name: "Галочки + Клавиатура" },
  ];

  createCustomSelect("climbingPanelInputsStyle", climbingPanelInputsStyles);
  // ====================================================================================================================
  //   . . . СОЗДАНИЕ ВЫПАДАЮЩИХ СПИСКОВ . . .
  // ====================================================================================================================
  function createCustomSelect(selectId, options) {
    const selectContainer = document.getElementById(selectId);
    const selectedElement = selectContainer.querySelector(".select-selected");
    const optionsContainer = selectContainer.querySelector(".select-items");

    if (settings && settings[selectId] !== undefined) {
      const selectedOption = options.find(
        (option) => option.id === settings[selectId]
      );
      if (selectedOption) {
        selectedElement.textContent = selectedOption.name;
      }
    }

    options.forEach((option, index) => {
      const optionElement = document.createElement("div");
      optionElement.textContent = option.name;
      optionElement.dataset.id = option.id;

      optionElement.addEventListener("click", () => {
        selectedElement.textContent = option.name;
        settings[selectId] = option.id;
        saveSettings();
        selectContainer.classList.remove("active");
      });

      optionsContainer.appendChild(optionElement);
    });

    selectedElement.addEventListener("click", () => {
      selectContainer.classList.toggle("active");
    });
  }
  // ====================================================================================================================
  //  . . . КНОПКА НОВОСТЕЙ . . .
  // ====================================================================================================================
  window.addEventListener("load", () => {
    const newsButton = document.getElementById("news-button");
    const newsList = document.getElementById("news-list");

    if (newsButton && newsList) {
      newsButton.addEventListener("click", () => {
        if (newsList.style.display === "none") {
          newsList.style.display = "block";
        } else {
          newsList.style.display = "none";
        }
      });
    }
  });
  // ====================================================================================================================
  //   . . . КНОПКА ТЕСТА ЗВУКОВ . . .
  // ====================================================================================================================
  function addSoundTestButton(
    containerId,
    settingsKeyForSound,
    settingsKeyForVolume
  ) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Контейнер с ID ${containerId} не найден.`);
      return;
    }

    const testButton = document.createElement("button");
    testButton.textContent = "Тест звука";
    testButton.addEventListener("click", () => {
      const selectedSoundId = settings[settingsKeyForSound];
      const volume = settings[settingsKeyForVolume] || 5;
      if (selectedSoundId) {
        soundManager.playSound(selectedSoundId, volume);
      } else {
        console.error(
          `Выбранный звук для контейнера ${containerId} не найден.`
        );
      }
    });

    container.appendChild(testButton);
  }

  addSoundTestButton(
    "notificationPMContainer",
    "notificationPMSound",
    "notificationPMVolume"
  );
  addSoundTestButton(
    "notificationActionEndContainer",
    "notificationActionEndSound",
    "notificationActionEndVolume"
  );
  addSoundTestButton(
    "notificationInMouthContainer",
    "notificationInMouthSound",
    "notificationInMouthVolume"
  );
  addSoundTestButton(
    "notificationInFightModeContainer",
    "notificationInFightModeSound",
    "notificationInFightModeVolume"
  );
  addSoundTestButton(
    "climbingRefreshNotificationSoundContainer",
    "climbingRefreshNotificationSound",
    "climbingRefreshNotificationVolume"
  );
  addSoundTestButton(
    "myNameNotificationSoundContainer",
    "myNameNotificationSound",
    "notificationMyNameVolume"
  );
  addSoundTestButton(
    "notificationBlockContainer",
    "notificationBlockSound",
    "notificationBlockVolume"
  );
  addSoundTestButton(
    "intervalTimerContainer",
    "intervalTimerSound",
    "intervalTimerVolume"
  );
  // ====================================================================================================================
  //  . . . СБРОС ПОЗИЦИИ ЧАСИКОВ . . .
  // ====================================================================================================================
  document
    .getElementById("resetClockPosition")
    .addEventListener("click", () => {
      const defaultPosition = { x: 10, y: 10 };
      uwuStorage.setItem("uwu_clock", defaultPosition);
    });
  // ====================================================================================================================
  //  . . . ИМПОРТ / ЭКСПОРТ ВСЕХ НАСТРОЕК . . .
  // ====================================================================================================================
  const settingsAllKeys = [
    "uwu_settings",
    "uwu_version",
    "uwu_layoutSettings",
    "uwu_climbingPanelState",
    "uwu_moduleStates",
    "uwu_fightPanelPosition",
    "uwu_climbingPanelStatus",
    "uwu_privateModules",
    "uwu_colorThemes",
    "uwu_currentTheme",
    "uwu_fontSize",
    "uwu_clock",
    "uwu_templates",
    "uwu_highlightResources",
    "uwu_saved_ls",
    "uwu_activity",
    "uwu_fastStyles",
    "uwu_fightTeamsCats",
  ];

  const importButton = document.getElementById("importSettingsButton");
  const importSettingsInput = document.getElementById("importSettings");
  const exportSettingsInput = document.getElementById("exportSettings");

  importButton.addEventListener("click", () => {
    const importedSettings = importSettingsInput.value;

    try {
      const parsedSettings = JSON.parse(importedSettings);
      settingsAllKeys.forEach((key) => {
        if (parsedSettings[key] !== undefined) {
          uwuStorage.setItem(key, parsedSettings[key]);
        }
      });
      console.log("Настройки импортированы:", parsedSettings);
    } catch (error) {
      console.error("Ошибка при импорте настроек:", error);
    }
    updateExportField();
  });

  function updateExportField() {
    const settingsObject = getSpecificLocalStorageItems();
    const settingsToExport = JSON.stringify(settingsObject, null, 2);
    exportSettingsInput.value = settingsToExport;
  }

  function getSpecificLocalStorageItems() {
    const items = {};
    settingsAllKeys.forEach((key) => {
      const value = uwuStorage.getItem(key);
      if (value !== null) {
        items[key] = value;
      }
    });
    return items;
  }

  loadSettings();
  updateExportField();
  // ====================================================================================================================
  //  . . . РЕДИЗАЙН НАСТРОЕК КОСТЮМОВ . . .
  // ====================================================================================================================
  if (settings.redesignCostumsSettings) {
    function addStyles() {
      const style = document.createElement("style");
      style.innerHTML =
        // css
        `
        .list-group-item {
            display: grid !important;
            grid-template-columns: auto 1fr;
            grid-template-rows: auto auto;
            align-items: center;
            margin-bottom: 10px;
            width: 280px !important;
        }
        .list-group-item img {
            margin-right: 10px;
            width: 50px;
            height: 80px;
        }
        .costume-image-container {
            grid-column: 1;
            grid-row: 1 / span 2;
            margin-right: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .list-group {
          resize: vertical;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
        }
        .list-group-item span {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
        .costume-id {
            font-weight: bold;
            margin-bottom: 5px;
            grid-column: 2;
            grid-row: 1;
        }
        .costume-text {
            grid-column: 2;
            grid-row: 2;
        }

        .col-3 {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
        }

        .col-3 > button {
          height: 22px;
        }
    `;
      document.head.appendChild(style);
    }

    function addCostumePreview() {
      const items = document.querySelectorAll(".list-group-item");
      items.forEach((item) => {
        const costumeId = item.textContent.trim().split(" ")[0];
        const imageContainer = item.querySelector(".costume-image-container");
        const img = imageContainer ? imageContainer.querySelector("img") : null;

        if (
          !imageContainer ||
          !img ||
          img.getAttribute("data-costume-id") !== costumeId
        ) {
          const imgUrl = `https://catwar.net/cw3/cats/0/costume/${costumeId}.png`;

          if (!imageContainer) {
            const newImageContainer = document.createElement("div");
            newImageContainer.classList.add("costume-image-container");

            const newImg = document.createElement("img");
            newImg.src = imgUrl;
            newImg.alt = `Costume ${costumeId}`;
            newImg.setAttribute("data-costume-id", costumeId);

            newImageContainer.appendChild(newImg);

            item.insertBefore(newImageContainer, item.firstChild);
          } else {
            img.src = imgUrl;
            img.setAttribute("data-costume-id", costumeId);
          }
        }
      });
    }

    addStyles();
    setupMutationObserver(".double-container", addCostumePreview, {
      childList: true,
      subtree: true,
    });
  }
  // ====================================================================================================================
  //  . . . МАКЕТ КАСТОМИЗАЦИИ ИГРОВОЙ . . .
  // ====================================================================================================================
  const blockNames = {
    tr_info: "Информация",
    tr_tos: "Погода",
    tr_chat: "Чат",
    tr_actions: "Действия",
    tr_mouth: "Во рту",
    // 'tr_sky': 'Небо',
  };
  const leftColumn = document.querySelector("#layout-customizer .column.left");
  const rightColumn = document.querySelector(
    "#layout-customizer .column.right"
  );

  function saveLayoutSettings() {
    const leftBlocks = Array.from(leftColumn.querySelectorAll(".block")).map(
      (block) => block.classList[1]
    );
    const rightBlocks = Array.from(rightColumn.querySelectorAll(".block")).map(
      (block) => block.classList[1]
    );

    const layoutSettings = {
      leftBlocks,
      rightBlocks,
    };

    uwuStorage.setItem("uwu_layoutSettings", layoutSettings);
  }

  function createBlockElement(blockId) {
    const blockElement = document.createElement("div");
    blockElement.classList.add("block", blockId);

    const blockName = document.createElement("span");
    blockName.textContent = blockNames[blockId];
    blockElement.appendChild(blockName);

    const controlsWrapper = document.createElement("div");
    controlsWrapper.classList.add("controls");

    if (blockId === "tr_info") {
      const moveInfoButton = document.createElement("button");
      moveInfoButton.textContent = "⏪Переместить⏩";
      moveInfoButton.classList.add("move-info", "install-button");
      moveInfoButton.addEventListener("click", () => {
        swapColumns(blockElement);
        saveLayoutSettings();
      });
      controlsWrapper.appendChild(moveInfoButton);
    } else {
      const moveUpButton = document.createElement("button");
      moveUpButton.textContent = "🔼Вверх";
      moveUpButton.classList.add("move-up", "install-button");
      moveUpButton.addEventListener("click", () => {
        const previousBlock = blockElement.previousElementSibling;
        if (previousBlock) {
          blockElement.parentNode.insertBefore(blockElement, previousBlock);
          saveLayoutSettings();
        }
      });
      controlsWrapper.appendChild(moveUpButton);

      const moveDownButton = document.createElement("button");
      moveDownButton.textContent = "🔽Вниз";
      moveDownButton.classList.add("move-down", "install-button");
      moveDownButton.addEventListener("click", () => {
        const nextBlock = blockElement.nextElementSibling;
        if (nextBlock) {
          blockElement.parentNode.insertBefore(nextBlock, blockElement);
          saveLayoutSettings();
        }
      });
      controlsWrapper.appendChild(moveDownButton);
    }

    blockElement.appendChild(controlsWrapper);
    return blockElement;
  }

  function swapColumns(blockElement) {
    if (blockElement.parentNode === leftColumn) {
      const rightColumnBlocks = Array.from(rightColumn.children);
      rightColumn.innerHTML = "";
      rightColumn.appendChild(blockElement);
      rightColumnBlocks.forEach((block) => leftColumn.appendChild(block));
    } else {
      const leftColumnBlocks = Array.from(leftColumn.children);
      leftColumn.innerHTML = "";
      leftColumn.appendChild(blockElement);
      leftColumnBlocks.forEach((block) => rightColumn.appendChild(block));
    }
    saveLayoutSettings();
  }

  const resetLayoutButton = document.getElementById("reset-layout-button");
  resetLayoutButton.addEventListener("click", () => {
    const confirmReset = confirm(
      "Вы уверены, что хотите сбросить расположение блоков?"
    );
    if (confirmReset) {
      const defaultSettings = getDefaultLayoutSettings();
      uwuStorage.setItem("uwu_layoutSettings", defaultSettings);
      location.reload();
    }
  });

  function getDefaultLayoutSettings() {
    return {
      leftBlocks: ["tr_info"],
      rightBlocks: ["tr_tos", "tr_chat", "tr_actions", "tr_mouth"],
    };
  }

  function loadLayoutSettings() {
    try {
      const savedSettings = uwuStorage.getItem("uwu_layoutSettings");
      if (savedSettings) {
        const { leftBlocks, rightBlocks } = savedSettings;

        leftColumn.innerHTML = "";
        rightColumn.innerHTML = "";

        leftBlocks.forEach((blockId) => {
          const blockElement = createBlockElement(blockId);
          leftColumn.appendChild(blockElement);
        });

        rightBlocks.forEach((blockId) => {
          const blockElement = createBlockElement(blockId);
          rightColumn.appendChild(blockElement);
        });
      } else {
        const defaultSettings = getDefaultLayoutSettings();
        uwuStorage.setItem("uwu_layoutSettings", defaultSettings);

        defaultSettings.leftBlocks.forEach((blockId) => {
          leftColumn.appendChild(createBlockElement(blockId));
        });

        defaultSettings.rightBlocks.forEach((blockId) => {
          rightColumn.appendChild(createBlockElement(blockId));
        });
      }
    } catch (error) {
      console.error("Ошибка при загрузке настроек макета:", error);
    }
  }

  loadLayoutSettings();
  // ====================================================================================================================
  //  . . . РЕДАКТОР ВКЛАДОК И ТАБЛИЦ МИННОГО ПОЛЯ . . .
  // ====================================================================================================================
  // как же я ненавижу минное поле как же я ненавижу минное поле как же я ненавижу минное поле
  const tabManager = {
    tabs: [],
    currentTabIndex: 0,

    createTab(name) {
      const newTab = {
        name: name,
        tables: [],
        currentTableId: 0,
      };

      this.tabs.push(newTab);
      this.render();
      this.switchTab(this.tabs.length - 1);
    },

    createTable(
      tableName = `Локация ${this.tabs[this.currentTabIndex].tables.length + 1}`
    ) {
      const currentTab = this.tabs[this.currentTabIndex];
      currentTab.tables.push({ name: tableName });
      this.saveState();
      this.render();
    },

    removeTable(tableIndex) {
      const currentTab = this.tabs[this.currentTabIndex];
      if (currentTab && currentTab.tables[tableIndex]) {
        currentTab.tables.splice(tableIndex, 1);
        if (currentTab.currentTableId === tableIndex) {
          currentTab.currentTableId = Math.max(
            0,
            currentTab.currentTableId - 1
          );
        }
        this.saveState();
        this.render();
      }
    },

    removeTab(index) {
      this.tabs.splice(index, 1);
      if (index === this.currentTabIndex) {
        this.currentTabIndex = Math.max(0, this.currentTabIndex - 1);
      }
      this.saveState();
      this.render();
    },

    switchTab(index) {
      this.currentTabIndex = index;
      this.render();
    },

    switchTable(tableIndex) {
      const currentTab = this.tabs[this.currentTabIndex];
      if (currentTab) {
        currentTab.currentTableId = tableIndex;
        this.saveState();
        this.render();
      }
    },

    renameTab(index) {
      const newName = prompt(
        "Введите новое имя вкладки:",
        this.tabs[index].name
      );
      if (newName) {
        this.tabs[index].name = newName;
        this.saveState();
        this.render();
      }
    },

    renameTable(tableIndex) {
      const currentTab = this.tabs[this.currentTabIndex];
      if (currentTab) {
        const newName = prompt(
          "Введите новое имя поля:",
          currentTab.tables[tableIndex].name
        );
        if (newName) {
          currentTab.tables[tableIndex].name = newName;
          this.saveState();
          this.render();
        }
      }
    },

    saveState() {
      uwuStorage.setItem("uwu_climbingPanelState", this);
    },

    render() {
      this.renderTabs();
      this.renderTables();
    },

    renderTabs() {
      const tabRow = document.getElementById("uwu-buttonRow1-settings");
      tabRow.innerHTML = "";

      this.tabs.forEach((tab, index) => {
        const tabButton = document.createElement("button");
        tabButton.textContent = tab.name;
        tabButton.classList.add("tab-button");

        if (index === this.currentTabIndex) {
          tabButton.classList.add("active");
        }

        tabButton.addEventListener("click", () => this.switchTab(index));

        const removeButton = document.createElement("button");
        removeButton.textContent = "X";
        removeButton.classList.add("remove-button");

        removeButton.addEventListener("click", () => this.removeTab(index));

        const renameButton = document.createElement("button");
        renameButton.textContent = "✎";
        renameButton.classList.add("rename-button");

        renameButton.addEventListener("click", () => this.renameTab(index));

        const tabContainer = document.createElement("div");
        tabContainer.classList.add("tab-container");
        tabContainer.appendChild(tabButton);
        tabContainer.appendChild(renameButton);
        tabContainer.appendChild(removeButton);

        tabRow.appendChild(tabContainer);
      });

      const addTabButton = document.createElement("button");
      addTabButton.textContent = "+";
      addTabButton.classList.add("add-button");
      addTabButton.addEventListener("click", () => {
        const tabName = prompt("Введите имя вкладки:");
        if (tabName) {
          this.createTab(tabName);
        }
      });
      tabRow.appendChild(addTabButton);
    },

    renderTables() {
      const tableRow = document.getElementById("uwu-buttonRow2-settings");
      tableRow.innerHTML = "";

      const currentTab = this.tabs[this.currentTabIndex];

      if (currentTab) {
        currentTab.tables.forEach((table, index) => {
          const tableButton = document.createElement("button");
          tableButton.textContent = table.name;
          tableButton.classList.add("table-button");

          tableButton.addEventListener("click", () => this.switchTable(index));

          const removeButton = document.createElement("button");
          removeButton.textContent = "X";
          removeButton.classList.add("remove-button");

          removeButton.addEventListener("click", () => this.removeTable(index));

          const renameButton = document.createElement("button");
          renameButton.textContent = "✎";
          renameButton.classList.add("rename-button");

          renameButton.addEventListener("click", () => this.renameTable(index));

          const tableContainer = document.createElement("div");
          tableContainer.classList.add("table-container");
          tableContainer.appendChild(tableButton);
          tableContainer.appendChild(renameButton);
          tableContainer.appendChild(removeButton);

          tableRow.appendChild(tableContainer);
        });

        const addTableButton = document.createElement("button");
        addTableButton.textContent = "+";
        addTableButton.classList.add("add-button");

        addTableButton.addEventListener("click", () => {
          const tableName = prompt("Введите имя поля:");
          if (tableName) {
            this.createTable(tableName);
          }
        });

        tableRow.appendChild(addTableButton);
      }
    },
  };

  const savedState = uwuStorage.getItem("uwu_climbingPanelState");
  if (!savedState) {
    tabManager.createTab("Вкладка 1");
    for (let i = 0; i < 5; i++) {
      tabManager.createTable(`Поле ${i + 1}`);
    }

    tabManager.createTab("Вкладка 2");
    for (let i = 0; i < 5; i++) {
      tabManager.createTable(`Поле ${i + 1}`);
    }

    tabManager.saveState();
  } else {
    const state = savedState;
    Object.assign(tabManager, state);
  }

  tabManager.render();

  /**
   * Добавляет функционал автоматического выделения текста при клике на поля для экспорта.
   */
  function setupExportFieldSelection() {
    const exportFields = document.querySelectorAll(
      "#exportSettings, #param-colors-export-field, #ls-export-field"
    );

    exportFields.forEach((field) => {
      field.addEventListener("click", function () {
        this.select();
      });
    });
  }

  setupExportFieldSelection();
}
// ====================================================================================================================
//  . . . ВКЛАДКИ ГЛАВНЫХ НАСТРОЕК . . .
// ====================================================================================================================
if (targetSettings.test(window.location.href)) {
  const buttonContainer = document.getElementById("button-container");

  buttonContainer.addEventListener("click", (event) => {
    const clickedElement = event.target;
    const clickedButton = clickedElement.closest("button");
    if (!clickedButton) return;

    const panelId = clickedButton.id.replace("button", "panel");
    const targetPanel = document.getElementById(panelId);

    buttonContainer.querySelectorAll("button").forEach((button) => {
      const correspondingPanelId = button.id.replace("button", "panel");
      const correspondingPanel = document.getElementById(correspondingPanelId);

      correspondingPanel.style.display =
        correspondingPanel === targetPanel ? "block" : "none";
      button.classList.toggle("active", button === clickedButton);
    });
  });

  const defaultButton = buttonContainer.querySelector("button");
  const defaultPanelId = defaultButton.id.replace("button", "panel");
  const defaultPanel = document.getElementById(defaultPanelId);

  buttonContainer.querySelectorAll("button").forEach((button) => {
    const correspondingPanelId = button.id.replace("button", "panel");
    const correspondingPanel = document.getElementById(correspondingPanelId);

    if (correspondingPanel !== defaultPanel) {
      correspondingPanel.style.display = "none";
    }
  });

  defaultPanel.style.display = "block";
  defaultButton.classList.add("active");
}
// ====================================================================================================================
//  . . . ОНЛАЙН МАГАЗИН СТИЛЕЙ . . .
// ====================================================================================================================
// буду вечно задаваться вопросом, а зачем я это вообще сделал..................
const moduleStates = {};
const defaultModules = [
  // "style.css",
  // ...
];
const privateModules = {};

function loadModuleStates() {
  const storedModuleStates = uwuStorage.getItem("uwu_moduleStates");
  if (storedModuleStates) {
    Object.assign(moduleStates, storedModuleStates);
  } else {
    for (const moduleName of defaultModules) {
      moduleStates[moduleName] = true;
    }
  }

  const storedPrivateModules = uwuStorage.getItem("uwu_privateModules");
  if (storedPrivateModules) {
    Object.assign(privateModules, storedPrivateModules);
  }
}

async function loadModuleListOnSettings() {
  const url =
    "https://raw.githubusercontent.com/Ibirtem/CatWar/main/modules/modules.txt";

  const targetSettings = /^https:\/\/catwar\.net\/settings/;
  if (!targetSettings.test(window.location.href)) {
    return;
  }

  try {
    const response = await fetch(url);
    const moduleList = await response.text();
    const modules = moduleList.split("\n").filter((line) => line.trim() !== "");

    const moduleInfoContainer = document.getElementById("module-info");

    if (!moduleInfoContainer) {
      console.error("Контейнер модулей не найден!");
      return;
    }

    for (const moduleInfo of modules) {
      const [moduleName, description, version] = moduleInfo.split("|");
      const isOnlineModule = !uwuStorage.getItem(moduleName);
      const moduleContainer = createModuleContainer(
        moduleName,
        description,
        version,
        isOnlineModule
      );
      moduleInfoContainer.appendChild(moduleContainer);

      if (moduleStates[moduleName]) {
        loadModule(moduleName, description, version);
      }
    }

    for (const [moduleName, moduleInfo] of Object.entries(privateModules)) {
      const { description, version } = moduleInfo;
      const isPrivateModule = true;
      const moduleContainer = createModuleContainer(
        moduleName,
        description,
        version,
        false,
        isPrivateModule
      );
      moduleInfoContainer.appendChild(moduleContainer);

      if (moduleStates[moduleName]) {
        loadModule(moduleName, description, version);
      }
    }
  } catch (error) {
    console.error("Ошибка при загрузке списка модулей:", error);
  }
}

async function activateModules() {
  const url =
    "https://raw.githubusercontent.com/Ibirtem/CatWar/main/modules/modules.txt";

  try {
    const response = await fetch(url);
    const moduleList = await response.text();
    const modules = moduleList.split("\n").filter((line) => line.trim() !== "");

    for (const moduleInfo of modules) {
      const [moduleName, description, version] = moduleInfo.split("|");
      const isOnlineModule = !uwuStorage.getItem(moduleName);

      if (moduleStates[moduleName]) {
        loadModule(moduleName, description, version);
      }
    }

    for (const [moduleName, moduleInfo] of Object.entries(privateModules)) {
      const { description, version } = moduleInfo;

      if (moduleStates[moduleName]) {
        loadModule(moduleName, description, version);
      }
    }
  } catch (error) {
    console.error("Ошибка при активации модулей:", error);
  }
}

function createModuleContainer(
  moduleName,
  description,
  version,
  isOnlineModule = false,
  isPrivateModule = false
) {
  const moduleContainer = document.createElement("div");
  moduleContainer.classList.add("module-container");

  const moduleInfo = document.createElement("div");
  moduleInfo.classList.add("module-info");
  moduleInfo.textContent = `${description}`;

  const modulePanel = document.createElement("div");
  modulePanel.classList.add("module-panel");

  const versionInfo = document.createElement("span");
  versionInfo.textContent = `Версия: ${version}`;
  modulePanel.appendChild(versionInfo);

  if (isOnlineModule) {
    const installButton = document.createElement("button");
    installButton.textContent = "Установить";
    installButton.classList.add("install-button");
    installButton.addEventListener("click", () => {
      loadModule(moduleName, description, version);
      moduleContainer.remove();
      createModuleContainer(
        moduleName,
        description,
        version,
        false,
        isPrivateModule
      );
    });
    modulePanel.appendChild(installButton);
  } else {
    const checkboxContainer = document.createElement("div");
    checkboxContainer.classList.add("checkbox-container");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = moduleName;
    checkbox.checked = moduleStates[moduleName] || false;
    checkboxContainer.appendChild(checkbox);

    const removeButton = document.createElement("button");
    removeButton.textContent = "Удалить";
    removeButton.classList.add("remove-button");
    removeButton.addEventListener("click", () => {
      unloadModule(moduleName);
      moduleContainer.remove();
    });
    modulePanel.appendChild(removeButton);

    checkbox.addEventListener("change", () => {
      moduleStates[moduleName] = checkbox.checked;
      uwuStorage.setItem("uwu_moduleStates", moduleStates);

      if (checkbox.checked) {
        loadModule(moduleName, description, version);
      }
    });

    moduleInfo.appendChild(checkboxContainer);
  }

  moduleContainer.appendChild(moduleInfo);
  moduleContainer.appendChild(modulePanel);

  return moduleContainer;
}

async function loadModule(moduleName, description, version) {
  const cachedModule = uwuStorage.getItem(moduleName);

  if (cachedModule) {
    activateModule(cachedModule, moduleName, description, version);
  } else {
    const url = `https://raw.githubusercontent.com/Ibirtem/CatWar/main/modules/${moduleName}`;
    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.text();
        uwuStorage.setItem(moduleName, data);
        activateModule(data, moduleName, description, version);

        moduleStates[moduleName] = true;
        uwuStorage.setItem("uwu_moduleStates", moduleStates);

        createModuleContainer(moduleName, description, version, false);

        loadModuleStates();
        clearModuleInfoContainer();
        loadModuleListOnSettings();
      } else {
        console.error(
          `Ошибка при загрузке модуля "${moduleName}": ${response.status} ${response.statusText}`
        );
      }
    } catch (error) {
      console.error("Ошибка при загрузке модуля:", error);
    }
  }
}

function addStyle(css) {
  const style = document.createElement("style");
  style.appendChild(document.createTextNode(css));
  document.head.appendChild(style);
}

function activateModule(data, moduleName, description, version) {
  if (moduleName.endsWith(".css")) {
    addStyle(data);
  } else if (moduleName.endsWith(".js")) {
    try {
      new Function(data);
      eval(data);
    } catch (error) {
      console.error(`Ошибка при активации модуля "${moduleName}":`, error);
    }
  }
}

function unloadModule(moduleName) {
  uwuStorage.removeItem(moduleName);
  delete moduleStates[moduleName];
  uwuStorage.setItem("uwu_moduleStates", moduleStates);

  if (privateModules[moduleName]) {
    delete privateModules[moduleName];
    uwuStorage.setItem("uwu_privateModules", privateModules);
  }

  loadModuleStates();
  clearModuleInfoContainer();
  loadModuleListOnSettings();
}

function clearModuleInfoContainer() {
  const moduleInfoContainer = document.getElementById("module-info");
  while (moduleInfoContainer.firstChild) {
    moduleInfoContainer.removeChild(moduleInfoContainer.firstChild);
  }
}

loadModuleStates();
loadModuleListOnSettings();
window.addEventListener("load", activateModules);
// ====================================================================================================================
//   . . . ЗАГРУЗКА НАСТРОЕК . . .
// ====================================================================================================================
loadSettings();
// ====================================================================================================================
//   . . . АВАТАРЫ В КОММЕНТАРИЯХ . . .
// ====================================================================================================================
if (!targetCW3.test(window.location.href)) {
  if (settings.commentsAvatars) {
    const styleElement = document.createElement("style");
    styleElement.textContent = `
      .avatar-img {
        width: 100px;
        height: 100px;
        object-fit: cover;
        float: left;
        margin: 5px;
        border: black solid 1px;
      }
    `;
    document.head.appendChild(styleElement);

    startCheckingForComments();
  }

  function startCheckingForComments() {
    setupMutationObserver("#view_comments", insertAvatars, {
      childList: true,
    });
  }

  function insertAvatars() {
    const comments = document.querySelectorAll(".view-comment");
    comments.forEach((comment) => {
      if (!comment.querySelector(".avatar-img")) {
        const authorLink = comment.querySelector(".author");
        const catId = authorLink
          ? authorLink.getAttribute("href").match(/\/cat(\d+)/)?.[1]
          : null;

        const avatarImg = document.createElement("img");
        avatarImg.alt = "Аватар пользователя";
        avatarImg.classList.add("avatar-img");

        if (!catId) {
          avatarImg.src = "https://e.catwar.net/avatar/0.jpg";
        } else {
          loadAvatar(catId, (avatarUrl) => {
            avatarImg.src = avatarUrl || "https://e.catwar.net/avatar/0.jpg";
          });
        }

        comment.insertBefore(avatarImg, comment.firstChild);
      }
    });
  }

  function loadAvatar(catId, callback) {
    const formats = ["png", "jpg", "gif"];
    let currentFormat = 0;

    function tryNextFormat() {
      const url = `https://e.catwar.net/avatar/${catId}.${formats[currentFormat]}`;
      const img = new Image();

      img.onload = () => callback(url);
      img.onerror = () => {
        currentFormat++;
        if (currentFormat < formats.length) {
          tryNextFormat();
        } else {
          callback(null);
        }
      };

      img.src = url;
    }

    tryNextFormat();
  }
}
// ====================================================================================================================
//   . . . МЕНЕДЖЕР ЗВУКОВ . . .
// ====================================================================================================================
function createSoundManager() {
  const sounds = {};
  let isUserInteracted = false;
  let pendingSounds = {};

  function loadSound(id, url) {
    const audio = new Audio(url);
    sounds[id] = audio;
  }

  function playSound(id, volume) {
    return new Promise((resolve, reject) => {
      if (sounds[id]) {
        sounds[id].currentTime = 0;
        sounds[id].volume = volume / 10;
        sounds[id]
          .play()
          .then(resolve)
          .catch((error) => {
            if (!isUserInteracted) {
              console.warn(
                "Политика браузера заблокировала звук. Ждём взаимодействия со стороны пользователя для новой попытки."
              );
              pendingSounds[id] = { id, volume, resolve };
            } else {
              console.warn("Ошибка воспроизведения звука:", error);
              reject(error);
            }
          });
      } else {
        reject(new Error(`Звук с ID ${id} не найден.`));
      }
    });
  }

  function playSoundNow(id, volume, resolve) {
    sounds[id]
      .play()
      .then(resolve)
      .catch((error) => {
        console.error(`Не удалось воспроизвести звук с ID ${id}:`, error);
        resolve();
      });
  }

  function handleUserInteraction() {
    isUserInteracted = true;

    document.removeEventListener("mousedown", handleUserInteraction);
    document.removeEventListener("touchstart", handleUserInteraction);
    document.removeEventListener("keydown", handleUserInteraction);

    for (const id in pendingSounds) {
      const { volume, resolve } = pendingSounds[id];
      playSoundNow(id, volume, resolve);
    }
    pendingSounds = {};
  }

  document.addEventListener("mousedown", handleUserInteraction);
  document.addEventListener("touchstart", handleUserInteraction);
  document.addEventListener("keydown", handleUserInteraction);

  return {
    loadSound,
    playSound,
  };
}

const soundManager = createSoundManager();

// ===================== СПИСОК ДОСТУПНЫХ ЗВУКОВ =====================

soundManager.loadSound(
  "notificationSound1",
  "https://github.com/Ibirtem/CatWar/raw/main/sounds/notification_1.mp3"
);
soundManager.loadSound(
  "notificationSound2",
  "https://github.com/Ibirtem/CatWar/raw/main/sounds/notification_2.mp3"
);
soundManager.loadSound(
  "notificationSound3",
  "https://github.com/Ibirtem/CatWar/raw/main/sounds/notification_3.mp3"
);
soundManager.loadSound(
  "notificationBlockSound1",
  "https://github.com/Ibirtem/CatWar/raw/main/sounds/block_1.mp3"
);

if (targetCW3Kns.test(window.location.href)) {
  // ====================================================================================================================
  //  . . . ПОДГРУЗКА ЦВЕТОВЫХ ТЕМ . . .
  // ====================================================================================================================
  const currentThemeName = getCurrentThemeName();
  const allThemes = getThemes();
  const theme = allThemes[currentThemeName]?.colors || {};

  // ====================================================================================================================
  //   . . . ПОЛЬЗОВАТЕЛЬСКИЕ ТЕМЫ / ЦВЕТА . . .
  // ====================================================================================================================
  function applyTheme() {
    const newStyle = document.createElement("style");
    newStyle.innerHTML =
      /* CSS */
      `
      body {
        background: ${theme?.backgroundColor || ""};
      }

      #cages_overflow {
        background: black;
      } 

      #blocks {
        background-color: ${theme?.blocksColor || ""};
      }

      ::-webkit-scrollbar-track {
        background-color: ${theme?.blocksColor || ""};
      }

      ::-webkit-scrollbar-thumb {
        background-color: ${theme?.accentColor3 || ""};
    }
    
      body, input, select, .ui-slider-handle {
        color: ${theme?.textColor || ""};
      }
    
      input, select, .ui-slider-horizontal {
        background-color: ${theme?.accentColor1 || ""};
        background: ${theme?.accentColor1 || ""};
        border: solid 1px ${theme?.accentColor2 || ""};
      }

      .ui-widget-content .ui-state-default {
        background: ${theme?.accentColor2 || ""};
        border: solid 1px ${theme?.accentColor2 || ""};
      } 

      hr {
        border: solid 1px ${theme?.accentColor2 || ""};
      }
    
      a, a:hover {
        color: ${theme?.linkColor || ""};
      }

      `;
    document.head.appendChild(newStyle);
  }

  if (settings.userThemeKns) {
    applyTheme();
  }
}

// ====================================================================================================================
//  . . . ЗАГРУЗКА КОДА В ИГРОВОЙ . . .
// ====================================================================================================================
// Игровая ли... Я чё знаю?
if (targetCW3.test(window.location.href)) {
  const containerElement = document.querySelector("body");
  const globalContainerElement = document.createElement("div");
  globalContainerElement.id = "uwu-global-container";
  containerElement.appendChild(globalContainerElement);

  const mainContainerElement = document.createElement("div");
  mainContainerElement.id = "uwu-main-container";
  globalContainerElement.appendChild(mainContainerElement);

  // ====================================================================================================================
  //  . . . ПОДГРУЗКА ЦВЕТОВЫХ ТЕМ . . .
  // ====================================================================================================================
  const currentThemeName = getCurrentThemeName();
  const allThemes = getThemes();
  const theme = allThemes[currentThemeName]?.colors || {};

  // ====================================================================================================================
  //   . . . ПОЛЬЗОВАТЕЛЬСКИЕ ТЕМЫ / ЦВЕТА . . .
  // ====================================================================================================================
  function applyTheme() {
    const newStyle = document.createElement("style");
    newStyle.innerHTML =
      /* CSS */
      `
      body {
        background: ${theme?.backgroundColor || ""};
      }

      #cages_overflow {
        background: black;
      } 

      #tr_actions > td, #tr_mouth > td, #location, .small {
        background-color: ${theme?.blocksColor || ""};
      }

      #history_block > div {
        background-color: unset !important;
      }

      #main_table, #tr_mouth, #tr_actions, #info_main {
        background-color: unset;
        background: none;
      }
    
      #tr_chat {
        background-color: ${theme?.chatColor || ""};
      }
    
      body, input, select, .ui-slider-handle, .hotkey {
        color: ${theme?.textColor || ""};
      }
    
      input, select, .ui-slider-horizontal {
        background-color: ${theme?.accentColor1 || ""};
        background: ${theme?.accentColor1 || ""};
        border: solid 1px ${theme?.accentColor2 || ""};
      }

      .ui-widget-content .ui-state-default {
        background: ${theme?.accentColor2 || ""};
        border: solid 1px ${theme?.accentColor2 || ""};
      } 

      hr {
        border: solid 1px ${theme?.accentColor2 || ""};
      }

      .myname {
        color: ${theme?.accentColor1 || ""};
        background: ${theme?.accentColor3 || ""};
      }

      span.cat_tooltip {
        background: ${theme?.catTooltipBackground || ""} !important;
        color: ${theme?.textColor || ""} !important;
        border: 2px solid ${theme?.accentColor2 || ""} !important;
      } 

      span.cat_tooltip > span.online {
        filter: brightness(2) contrast(150%);
      }
      
      .cat:hover .cat_tooltip a, .other_cats_list > a { 
        color: ${theme?.linkColor || ""}; 
      }

      .move_name {
        color: ${theme?.moveNameColor || ""};
        background-color: ${theme?.moveNameBackground || ""} !important;
      }
    
      a, a:hover {
        color: ${theme?.linkColor || ""};
      }

      #fightPanel {
        background-color: ${theme?.fightPanelBackground || ""};
      }

      .hotkey {
        background-color: ${theme?.accentColor1 || ""};
      }

      #newchat, #newls {
        color: ${theme?.accentColor3 || ""};
      }

      .cat-info {
      background-color: ${theme?.catTooltipBackground || ""} !important;
      color: ${theme?.textColor || ""} !important;
      }
      `;
    document.head.appendChild(newStyle);
  }

  if (settings.userTheme) {
    applyTheme();
  }

  // ====================================================================================================================
  //  . . . ДЕФЕКТИКИ И СТИЛИ . . .
  // ====================================================================================================================

  function applyDefectsStyle() {
    if (!settings.showDefectsEnabled) return;

    const qualityFolder =
      settings.defectsQuality === "high" ? "assets_200_300" : "assets_100_150";
    const baseUrl = `https://raw.githubusercontent.com/Ibirtem/CatWar/refs/heads/main/images/${qualityFolder}`;

    const defectsCss = /* CSS */ `
        /*грязь_1*/
        #tr_field [style*='dirt/base/1/1'], #tr_field [style*='dirt/base/2/1']
        {content: url(${baseUrl}/dirt_1.png)
        !important;}
        /*грязь_2*/
        #tr_field [style*='dirt/base/1/2'], #tr_field [style*='dirt/base/2/2']
        {content: url(${baseUrl}/dirt_2.png)
        !important;}
        /*грязь_3*/
        #tr_field [style*='dirt/base/1/3'], #tr_field [style*='dirt/base/2/3']
        {content: url(${baseUrl}/dirt_3.png)
        !important;}
        /*грязь_4*/
        #tr_field [style*='dirt/base/1/4'], #tr_field [style*='dirt/base/2/4']
        {content: url(${baseUrl}/dirt_4.png)
        !important;}

        /*ушибы_1*/
        #tr_field [style*='trauma/1']
        {content: url(${baseUrl}/trauma_1.png)
        !important;}
        /*ушибы_2*/
        #tr_field [style*='trauma/2']
        {content: url(${baseUrl}/trauma_2.png)
        !important;}
        /*ушибы_3*/
        #tr_field [style*='trauma/3']
        {content: url(${baseUrl}/trauma_3.png)
        !important;}
        /*ушибы_4*/
        #tr_field [style*='trauma/4']
        {content: url(${baseUrl}/trauma_4.png)
        !important;}

        /*отравление_1*/
        #tr_field [style*='poisoning/1']
        {content: url(${baseUrl}/poisoning_1.png)
        !important;}
        /*отравление_2*/
        #tr_field [style*='poisoning/2']
        {content: url(${baseUrl}/poisoning_2.png)
        !important;}
        /*отравление_3*/
        #tr_field [style*='poisoning/3']
        {content: url(${baseUrl}/poisoning_3.png)
        !important;}
        /*отравление_4*/
        #tr_field [style*='poisoning/4']
        {content: url(${baseUrl}/poisoning_4.png)
        !important;}

        /*переломы_1*/
        #tr_field [style*='drown/1']
        {content: url(${baseUrl}/drown_1.png)
        !important;}
        /*переломы_2*/
        #tr_field [style*='drown/2']
        {content: url(${baseUrl}/drown_2.png)
        !important;}
        /*переломы_3*/
        #tr_field [style*='drown/3']
        {content: url(${baseUrl}/drown_3.png)
        !important;}
        /*переломы_4*/
        #tr_field [style*='drown/4']
        {content: url(${baseUrl}/drown_4.png)
        !important;}

        /*раны_1*/
        #tr_field [style*='wound/1']
        {content: url(${baseUrl}/wound_1.png)
        !important;}
        /*раны_2*/
        #tr_field [style*='wound/2']
        {content: url(${baseUrl}/wound_2.png)
        !important;}
        /*раны_3*/
        #tr_field [style*='wound/3']
        {content: url(${baseUrl}/wound_3.png)
        !important;}
        /*раны_4*/
        #tr_field [style*='wound/4']
        {content: url(${baseUrl}/wound_4.png)
        !important;}

        /*кашель*/
        #tr_field [style*='disease/1']
        {content: url(${baseUrl}/disease.png)
        !important;}
    `;

    const styleElement = document.createElement("style");
    styleElement.id = "uwu-defects-style";
    styleElement.textContent = defectsCss;
    document.head.appendChild(styleElement);
  }

  applyDefectsStyle();
  // ====================================================================================================================
  //  . . . РАСШИРЕННЫЕ НАСТРОЙКИ . . .
  // ====================================================================================================================
  const extendedSettingsButtonElement = document.createElement("div");
  extendedSettingsButtonElement.innerHTML = extendedSettingsButton;
  mainContainerElement.appendChild(extendedSettingsButtonElement);

  const panel = extendedSettingsButtonElement.querySelector(
    "#uwu-extended-settings"
  );
  const extendedSettingsContainer = extendedSettingsButtonElement.querySelector(
    "#extended-settings-container"
  );
  const button = extendedSettingsButtonElement.querySelector(
    "#extended-settings-button"
  );

  extendedSettingsContainer.style.display = "none";

  const shouldShowPanel = () => {
    return (
      settings.extendedSettingsPanel ||
      settings.showSplashScreens ||
      settings.showUpdateNotification ||
      settings.manualWeatherPanel ||
      settings.fastStyles
    );
  };

  if (shouldShowPanel()) {
    panel.style.display = "block";
  } else {
    panel.style.display = "none";
  }

  button.addEventListener("click", () => {
    extendedSettingsContainer.style.display =
      extendedSettingsContainer.style.display === "none" ? "block" : "none";

    button.classList.remove("new-update");
  });
  // ====================================================================================================================
  //  . . . СПЛЕШ СКРИН . . .
  // ====================================================================================================================
  if (settings.showSplashScreens) {
    const randomPhraseBlock = document.createElement("div");
    const splashPanel = extendedSettingsButtonElement.querySelector(
      "#splash-screen-panel"
    );
    randomPhraseBlock.classList.add("random-phrase-block");
    splashPanel.appendChild(randomPhraseBlock);

    function loadRandomPhrase(url) {
      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Ошибка загрузки: ${response.status}`);
          }
          return response.text();
        })
        .then((text) => {
          const phrases = text.split("\n").filter((line) => line.trim() !== "");
          const randomIndex = Math.floor(Math.random() * phrases.length);
          randomPhraseBlock.innerHTML = parseColorCodes(phrases[randomIndex]);
        })
        .catch((error) => {
          console.error("Ошибка при загрузке случайной фразы:", error);
          randomPhraseBlock.textContent = "Не удалось загрузить фразу :(";
        });
    }

    function parseColorCodes(text) {
      const colorMap = {
        "&0": "</span>", // - Сброс -
        "&1": "<span style='color: blue;'>", // Синий
        "&2": "<span style='color: green;'>", // Зеленый
        "&3": "<span style='color: aqua;'>", // Бирюзовый
        "&4": "<span style='color: red;'>", // Красный
        "&5": "<span style='color: #dc00dc;'>", // Фиолетовый
        "&6": "<span style='color: gold;'>", // Золотой
        "&7": "<span style='color: pink;'>", // Розовый
        "&8": "<span style='color: white;'>", // Белый
        "&9": "<span style='color: black;'>", // Черный
      };

      text = "<b>" + text;

      for (const code in colorMap) {
        text = text.replace(new RegExp(code, "g"), colorMap[code]);
      }

      return text;
    }

    window.addEventListener("load", () => {
      loadRandomPhrase(
        "https://raw.githubusercontent.com/Ibirtem/CatWar/main/texts/text.txt"
      );
    });
  }
  // ====================================================================================================================
  //  . . . ПЕРСОНАЛЬНЫЕ КОСТЮМЫ . . .
  // ====================================================================================================================
  async function personalCostumes() {
    if (settings.personalCostumes) {
      const match = window.location.hostname.match(/catwar\.(net|su)/);
      if (!match) return;

      function applyCostumeStyles() {
        let items = uwuStorage.getItem("uwu_personal") || {};
        if (!items.cats) return;

        let styleElement = document.getElementById(
          "uwu-personal-costume-style"
        );
        if (!styleElement) {
          styleElement = document.createElement("style");
          styleElement.id = "uwu-personal-costume-style";
          document.head.appendChild(styleElement);
        }

        let cssRules = "";
        Object.values(items.cats).forEach((cat) => {
          if (cat.poses) {
            Object.keys(cat.poses).forEach((poseFile) => {
              const costumeData = cat.poses[poseFile];
              if (costumeData) {
                cssRules += `
                            .cat:has(a[href='/cat${
                              cat.id
                            }']) .d:has(.first[style*='${poseFile}'])::after {
                                content: '';
                                position: absolute;
                                top: 0;
                                left: 0;
                                width: 100%;
                                height: 100%;
                                background-image: url('${costumeData}');
                                background-size: ${cat.size || "contain"};
                                background-repeat: no-repeat;
                                pointer-events: none;
                                z-index: 1;
                            }
                          `;
              }
            });
          }
        });
        styleElement.innerHTML = cssRules;
      }

      let lastKnownPoseUrl = "";

      function checkMyPose() {
        let personalData = uwuStorage.getItem("uwu_personal");
        if (!personalData || !personalData.lastActiveId) return;

        const currentId = personalData.lastActiveId;
        const cages = document.getElementById("cages");
        if (!cages) return;

        const link = cages.querySelector("a[href='/cat" + currentId + "']");
        if (!link) return;

        const catNode = link.closest(".cat");
        const img = catNode ? catNode.querySelector(".first") : null;

        if (img) {
          const rawBg = img.style.backgroundImage;
          const src = rawBg.replace(/^url\(['"]?/, "").replace(/['"]?\)$/, "");
          const fileName = src.split("/").pop();

          if (src === lastKnownPoseUrl) return;

          lastKnownPoseUrl = src;
          const size = img.style.backgroundSize;

          personalData = uwuStorage.getItem("uwu_personal") || {};
          if (!personalData.cats) personalData.cats = {};
          if (!personalData.cats[currentId]) {
            personalData.cats[currentId] = {
              id: currentId,
              name: "Кот " + currentId,
              poses: {},
            };
          }
          const cat = personalData.cats[currentId];
          if (!cat.poses) cat.poses = {};

          cat.img = src;
          cat.size = size;

          if (!cat.poses.hasOwnProperty(fileName)) {
            console.log(`UwU | Найдена новая поза: ${fileName}`);
            cat.poses[fileName] = "";
            uwuStorage.setItem("uwu_personal", personalData);
            applyCostumeStyles();
          } else {
            uwuStorage.setItem("uwu_personal", personalData);
          }
        }
      }

      applyCostumeStyles();

      setupMutationObserver(
        "#cages",
        () => {
          setTimeout(checkMyPose, 100);
        },
        { childList: true, subtree: true },
        10,
        500
      );

      setupMutationObserver(
        "#tr_actions",
        () => {
          setTimeout(checkMyPose, 100);
        },
        { childList: true, subtree: true, characterData: true }
      );
    }
  }

  function saveCostumeToSlot(dataUrl, choice) {
    return new Promise(async (resolve, reject) => {
      try {
        const resizedDataUrl = await resizeImageToAspectRatio(dataUrl);
        let data = uwuStorage.getItem("uwu_personal") || {
          cats: {},
          slots: [],
        };
        if (!data.slots) data.slots = [];

        if (choice === "new") {
          data.slots.push(resizedDataUrl);
          alert("Костюм успешно сохранен в новый слот.");
        } else {
          const slotIndex = parseInt(choice, 10);
          if (data.slots[slotIndex]) {
            if (!confirm("Этот слот уже занят. Вы хотите перезаписать его?")) {
              return resolve();
            }
          }
          data.slots[slotIndex] = resizedDataUrl;
          alert(`Костюм успешно сохранен в слот ${slotIndex + 1}.`);
        }

        uwuStorage.setItem("uwu_personal", data);
        resolve();
      } catch (error) {
        console.error("Ошибка при сохранении костюма:", error);
        alert("Ошибка при сохранении костюма.");
        reject(error);
      }
    });
  }

  function createCostumeSavePopup(costumes) {
    let { catInfoElement, contentContainer } = createCatInfoContainer();
    let data = uwuStorage.getItem("uwu_personal") || {};
    const savedSlots =
      data.costumes && data.costumes.slots ? data.costumes.slots : [];

    catInfoElement.style.width = "600px";

    let slotOptions = '<option value="new">В новый слот</option>';
    savedSlots.forEach((slot, i) => {
      if (slot) {
        slotOptions += `<option value="${i}">Перезаписать слот ${
          i + 1
        }</option>`;
      }
    });

    contentContainer.innerHTML = `
      <div class="cat-details">
        <p>Выберите костюм для сохранения:</p>
        <div class="costume-flex-grid">
          ${costumes
            .map(
              (costumeUrl, idx) => `
            <div class="costume-flex-item">
              <div class="costume-style" style="background-image: url('${costumeUrl}');"></div>
              <div class="costume-actions">
                <select class="uwu-slot-select" data-costume-idx="${idx}">
                  ${slotOptions}
                </select>
                <button class="uwu-button install-button" data-costume-idx="${idx}">Сохранить</button>
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    `;

    contentContainer
      .querySelectorAll("button[data-costume-idx]")
      .forEach((btn) => {
        btn.addEventListener("click", async (e) => {
          const idx = parseInt(btn.getAttribute("data-costume-idx"), 10);
          const select = contentContainer.querySelector(
            `select[data-costume-idx="${idx}"]`
          );
          const slotChoice = select.value;
          contentContainer.style.pointerEvents = "none";
          contentContainer.style.opacity = "0.5";
          await saveCostumeToSlot(costumes[idx], slotChoice);
          contentContainer.style.pointerEvents = "auto";
          contentContainer.style.opacity = "1";
        });
      });

    globalContainer.appendChild(catInfoElement);
  }

  // ====================================================================================================================
  //  . . . ИНВЕНТАРЬ . . .
  // ====================================================================================================================
  if (settings.blockItemDrop) {
    function getLockedItems() {
      return uwuStorage.getItem("uwu_lockedItems") || "[]";
    }

    function setLockedItems(lockedItems) {
      uwuStorage.setItem("uwu_lockedItems", lockedItems);
    }

    function checkIfIdIsLocked(itemId) {
      return getLockedItems().includes(itemId);
    }

    function changePutButtonState() {
      const putButton = document.getElementById("put");
      if (!putButton) return;
      const item = document.getElementsByClassName("active_thing")[0];
      const lockedItems = getLockedItems();

      if (item && lockedItems.includes(item.id)) {
        putButton.style.pointerEvents = "none";
        putButton.style.opacity = "0.5";
        putButton.style.userSelect = "none";
      } else {
        putButton.style.pointerEvents = "auto";
        putButton.style.opacity = "1";
        putButton.style.userSelect = "auto";
      }
    }

    function createLockCheckbox() {
      const item = document.getElementsByClassName("active_thing")[0];
      if (!item || !item.id) return;

      let input = document.getElementById("lock-put-button");
      let label = document.getElementById("lock-put-label");

      if (!input) {
        input = document.createElement("input");
        input.type = "checkbox";
        input.id = "lock-put-button";
        input.style.marginRight = "5px";
        input.style.marginBottom = "10px";
        input.style.cursor = "pointer";
        document.getElementById("thdey").appendChild(input);

        label = document.createElement("label");
        label.id = "lock-put-label";
        label.style.marginLeft = "10px";
        label.style.fontSize = "14px";
        document.getElementById("thdey").appendChild(label);

        input.addEventListener("change", () => {
          const itemId = document.getElementsByClassName("active_thing")[0].id;
          let lockedItems = getLockedItems();
          const idx = lockedItems.indexOf(itemId);

          if (input.checked && idx === -1) {
            lockedItems.push(itemId);
          } else if (!input.checked && idx !== -1) {
            lockedItems.splice(idx, 1);
          }
          setLockedItems(lockedItems);
          changePutButtonState();
        });
      }

      input.checked = checkIfIdIsLocked(item.id);
      label.innerText = `Блокировка опускания предмета с ID ${item.id}`;
    }

    setupMutationObserver(
      "#thdey",
      () => {
        createLockCheckbox();
        changePutButtonState();
      },
      { attributes: true, attributeFilter: ["style"] }
    );

    createLockCheckbox();
  }
  // ====================================================================================================================
  //  . . . УВЕДОМЛЕНИЕ ОБ ОБНОВЛЕНИИ . . .
  // ====================================================================================================================
  function showUpdateNotification(oldVersion) {
    const panel = document.getElementById("extended-settings-container");
    const notificationBlock = document.createElement("div");
    notificationBlock.classList.add("update-notification");
    notificationBlock.innerHTML = `
          <p>Скрипт/Мод UwU был обновлен с версии v${
            oldVersion || "неизвестной"
          } до версии v${current_uwu_version}!</p>
          <p>Можете посетить <a href="https://catwar.net/settings" target="_blank">Настройки</a> для ознакомления с изменениями.</p>
        `;
    panel.appendChild(notificationBlock);
    const button = extendedSettingsButtonElement.querySelector("button");
    button.classList.add("new-update");
  }

  window.addEventListener("load", () => {
    const savedVersion = uwuStorage.getItem("uwu_version");
    if (savedVersion !== current_uwu_version) {
      uwuStorage.setItem("uwu_version", current_uwu_version);
    }
    if (
      settings.showUpdateNotification &&
      savedVersion !== current_uwu_version
    ) {
      showUpdateNotification(savedVersion);
    }
    personalCostumes();
  });

  // ====================================================================================================================
  //  . . . РУЧНОЕ УПРАВЛЕНИЕ ПОГОДОЙ . . .
  // ====================================================================================================================
  if (settings.manualWeatherPanel) {
    const panel = extendedSettingsButtonElement.querySelector(
      "#extended-settings-container"
    );
    panel.innerHTML += manualWeatherPanel;

    const manualAuroraOffButton = document.getElementById("manualAurora-Off");
    const manualAuroraBButton = document.getElementById("manualAurora-B");
    const manualAuroraGButton = document.getElementById("manualAurora-G");

    const fireflyOnButton = document.getElementById("manualFirefly-On");

    manualAuroraOffButton.addEventListener("click", () => {
      for (const auroraElement of auroras) {
        removeAurora(auroraElement);
      }
    });

    manualAuroraBButton.addEventListener("click", () => {
      createAurora("blue");
    });

    manualAuroraGButton.addEventListener("click", () => {
      createAurora("green");
    });

    fireflyOnButton.addEventListener("click", () => {
      toggleFireflies();
    });
  }

  // ====================================================================================================================
  //   . . . ТАЙМЕР-НАПОМИНАЛКА . . .
  // ====================================================================================================================
  if (settings.intervalTimerEnabled) {
    const intervalTimerPanelHTML =
      /* HTML */
      `
        <div id="uwu-interval-timer-main-panel">
          <div id="uwu-interval-timer-button">
            <div class="left-content">
              <h2 class="timer-title">Таймер</h2>
              <span id="timer-header-countdown" style="display: none;"
                >00:00</span
              >
            </div>
            <div class="right-content">
              <span id="uwu-interval-timer-toggle">▼</span>
            </div>
          </div>
          <div id="uwu-interval-timer-container">
            <div id="uwu-interval-timer-content">
              <div class="timer-inputs">
                <input
                  type="number"
                  id="timer-minutes-input"
                  min="0"
                  placeholder="Мин"
                />
                <span>:</span>
                <input
                  type="number"
                  id="timer-seconds-input"
                  min="0"
                  max="59"
                  placeholder="Сек"
                />
              </div>
              <button
                id="timer-start-stop-btn"
                class="uwu-button install-button"
              >
                Старт
              </button>
              <div id="timer-countdown-display">00:00</div>
            </div>
          </div>
        </div>
      `;

    const globalContainer = document.getElementById("uwu-global-container");
    globalContainer.insertAdjacentHTML("beforeend", intervalTimerPanelHTML);

    const timerStyles = document.createElement("style");
    timerStyles.innerHTML = /* CSS */ `
      #uwu-interval-timer-main-panel {
        z-index: 11;
        pointer-events: auto;
        width: 180px;
        position: absolute;
        top: 100px;
        left: 100px;
        background-color: ${theme?.climbingPanelBackground || "#ffffff08"};
        border: 1px solid #ffffff1a;
        backdrop-filter: blur(20px);
        border-radius: 10px;
        color: ${theme?.textColor || "#d5d5d5"};
      }

      #uwu-interval-timer-button {
        height: 31px;
        cursor: grab;
        background-color: #00000026;
        border-radius: 10px;
        border: 1px solid #ffffff1a;
        display: flex;
        align-items: center;
        justify-content: space-around;
      }

      #uwu-interval-timer-button .left-content {
        pointer-events: none;
        width: 85%;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      #uwu-interval-timer-button .right-content {
        pointer-events: none;
        width: 15%;
        text-align: right;
      }

      #uwu-interval-timer-button h2 {
        display: flex;
        margin-top: 2px;
        margin-bottom: 2px;
        justify-content: center;
        pointer-events: none;
      }

      #timer-start-stop-btn {
        width: -webkit-fill-available;
      }

      #uwu-interval-timer-toggle {
        cursor: pointer;
        font-size: 18px;
        margin-right: 8px;
      }

      #uwu-interval-timer-container {
        display: block;
        padding: 5px;
      }

      #uwu-interval-timer-container.collapsed {
        display: none;
      }

      #uwu-interval-timer-content {
        padding: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
      }

      .timer-inputs {
        display: flex;
        align-items: center;
        gap: 5px;
      }
      .timer-inputs input {
        width: 50px;
        text-align: center;
      }
      #timer-countdown-display,
      #timer-header-countdown {
        font-size: 1.5em;
        font-weight: bold;
      }
    `;

    document.head.appendChild(timerStyles);

    const timerPanel = document.getElementById("uwu-interval-timer-main-panel");
    const header = document.getElementById("uwu-interval-timer-button");
    const container = document.getElementById("uwu-interval-timer-container");
    const toggleBtn = document.getElementById("uwu-interval-timer-toggle");
    const minutesInput = document.getElementById("timer-minutes-input");
    const secondsInput = document.getElementById("timer-seconds-input");
    const startStopBtn = document.getElementById("timer-start-stop-btn");
    const countdownDisplay = document.getElementById("timer-countdown-display");
    const headerCountdown = document.getElementById("timer-header-countdown");
    const timerTitle = document.querySelector("h2.timer-title");

    let timerId = null;
    let totalSeconds = 0;
    let remainingSeconds = 0;
    let isRunning = false;

    let isDragging = false;
    let wasDragging = false;
    let offsetX, offsetY;

    header.addEventListener("mousedown", (e) => {
      isDragging = true;
      wasDragging = false;
      offsetX = e.clientX - timerPanel.offsetLeft;
      offsetY = e.clientY - timerPanel.offsetTop;
      header.style.cursor = "grabbing";
    });

    document.addEventListener("mousemove", (e) => {
      if (isDragging) {
        wasDragging = true;

        let newX = e.clientX - offsetX;
        let newY = e.clientY - offsetY;

        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const panelWidth = timerPanel.offsetWidth;
        const panelHeight = timerPanel.offsetHeight;

        if (newX < 0) newX = 0;
        if (newX + panelWidth > windowWidth) newX = windowWidth - panelWidth;

        if (newY < 0) newY = 0;
        if (newY + panelHeight > windowHeight)
          newY = windowHeight - panelHeight;

        timerPanel.style.left = `${newX}px`;
        timerPanel.style.top = `${newY}px`;
      }
    });

    document.addEventListener("mouseup", () => {
      if (isDragging) {
        isDragging = false;
        header.style.cursor = "grab";
        saveTimerState();
      }
    });

    function togglePanel() {
      container.classList.toggle("collapsed");

      const isCollapsed = container.classList.contains("collapsed");
      toggleBtn.textContent = isCollapsed ? "▶" : "▼";

      timerTitle.style.display = isCollapsed && isRunning ? "none" : "inline";
      headerCountdown.style.display =
        isCollapsed && isRunning ? "inline" : "none";

      saveTimerState();
    }

    header.addEventListener("click", () => {
      if (!wasDragging) {
        togglePanel();
      }
    });

    function startTimer() {
      const minutes = parseInt(minutesInput.value) || 0;
      const seconds = parseInt(secondsInput.value) || 0;
      totalSeconds = minutes * 60 + seconds;

      if (totalSeconds <= 0) {
        alert("Пожалуйста, введите корректное время.");
        return;
      }

      isRunning = true;
      startStopBtn.textContent = "Стоп";
      startStopBtn.classList.remove("install-button");
      startStopBtn.classList.add("remove-button");

      remainingSeconds = totalSeconds;
      updateDisplay();
      playSound();

      timerId = setInterval(() => {
        remainingSeconds--;
        if (remainingSeconds < 0) {
          remainingSeconds = totalSeconds;
          playSound();
        }
        updateDisplay();
      }, 1000);

      if (container.classList.contains("collapsed")) {
        timerTitle.style.display = "none";
        headerCountdown.style.display = "inline";
      }
      saveTimerState();
    }

    function stopTimer() {
      isRunning = false;
      startStopBtn.textContent = "Старт";
      startStopBtn.classList.remove("remove-button");
      startStopBtn.classList.add("install-button");

      clearInterval(timerId);
      timerId = null;
      remainingSeconds = 0;
      updateDisplay();

      timerTitle.style.display = "inline";
      headerCountdown.style.display = "none";
    }

    function updateDisplay() {
      const mins = Math.floor(remainingSeconds / 60);
      const secs = remainingSeconds % 60;
      const timeString = `${String(mins).padStart(2, "0")}:${String(
        secs
      ).padStart(2, "0")}`;
      countdownDisplay.textContent = timeString;
      headerCountdown.textContent = timeString;
    }

    function playSound() {
      soundManager.playSound(
        settings.intervalTimerSound,
        settings.intervalTimerVolume
      );
    }

    startStopBtn.addEventListener("click", () => {
      if (isRunning) {
        stopTimer();
      } else {
        startTimer();
      }
    });

    function saveTimerState() {
      const state = {
        x: timerPanel.offsetLeft,
        y: timerPanel.offsetTop,
        collapsed: container.classList.contains("collapsed"),
        minutes: minutesInput.value,
        seconds: secondsInput.value,
      };
      uwuStorage.setItem("uwu_intervalTimerState", state);
    }

    function checkAndResetPosition() {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const panelWidth = timerPanel.offsetWidth;
      const panelHeight = timerPanel.offsetHeight;

      let currentX = timerPanel.offsetLeft;
      let currentY = timerPanel.offsetTop;

      if (
        currentX + panelWidth > windowWidth ||
        currentY + panelHeight > windowHeight ||
        currentX < 0 ||
        currentY < 0
      ) {
        timerPanel.style.left = `100px`;
        timerPanel.style.top = `100px`;
        saveTimerState();
      }
    }

    function loadTimerState() {
      const state = uwuStorage.getItem("uwu_intervalTimerState");
      if (state) {
        timerPanel.style.left = `${state.x}px`;
        timerPanel.style.top = `${state.y}px`;
        if (state.collapsed) {
          container.classList.add("collapsed");
          toggleBtn.textContent = "▶";
        }
        minutesInput.value = state.minutes || "";
        secondsInput.value = state.seconds || "";
      }
      updateDisplay();
      checkAndResetPosition();
    }

    minutesInput.addEventListener("change", saveTimerState);
    secondsInput.addEventListener("change", saveTimerState);

    loadTimerState();
  }
  // ====================================================================================================================
  //   . . . ЧАСЫ . . .
  // ====================================================================================================================
  if (settings.showClock) {
    const style = document.createElement("style");
    style.textContent =
      /* CSS */
      `
        #uwu-clock {
          border-radius: 10px;
          width: min-content;
          height: min-content;
          background-color: ${theme?.blocksColor || "#242424"};
          color: ${theme?.textColor || "#d5d5d5"};
          border: 1px solid #ffffff1a;
          display: grid;
          grid-template-columns: auto 1fr;
          grid-template-rows: auto auto;
          align-items: center;
          justify-content: space-between;
          font-family: Arial, sans-serif;
          text-align: center;
          cursor: move;
          pointer-events: auto;
          position: absolute;
          z-index: 10;
          padding: 5px;
          font-size: ${settings.clockFontSize || 14}px;
        }

        #uwu-clock .time {
          font-size: 2em;
        }

        #uwu-clock .icon {
          cursor: help;
        }

        .compact #uwu-clock {
          column-gap: 5px;
          grid-template-columns: auto 1fr;
          grid-template-rows: auto auto;
        }

        .compact #uwu-clock .time {
          grid-column: 1 / 2;
          grid-row: 1 / 3;
        }

        .compact #uwu-clock .icon {
          grid-column: 2 / 3;
          grid-row: 1 / 2;
        }

        .compact #uwu-clock .date {
          grid-column: 2 / 3;
          grid-row: 2 / 3;
        }

        .standard #uwu-clock {
          grid-template-columns: auto auto;
          grid-template-rows: auto auto;
        }

        .standard #uwu-clock .time {
          text-align: start;
          grid-column: 1 / 2;
          grid-row: 1 / 2;
        }

        .standard #uwu-clock .icon {
          grid-column: 2 / 3;
          grid-row: 1 / 2;
        }

        .standard #uwu-clock .date {
          font-size: 1.2em;
          grid-column: 1 / 3;
          grid-row: 2 / 3;
          width: max-content;
        }

        .string #uwu-clock {
          column-gap: 5px;
          grid-template-columns: auto auto;
          grid-template-rows: auto auto;
        }

        .string #uwu-clock .date {
          font-size: 2em;
          grid-column: 2 / 3;
        }

        .string #uwu-clock .icon {
          grid-column: 3 / 3;
          grid-row: 1 / 2;
        }
    `;
    document.head.appendChild(style);

    const tosStyle = document.createElement("style");
    tosStyle.textContent = `
      #uwu-clock {
        position: relative;
      }
    `;

    const flyStyle = document.createElement("style");
    flyStyle.textContent = `

    `;

    const container = document.getElementById("uwu-global-container");
    const clockElement = document.createElement("div");
    clockElement.id = "uwu-clock";

    const timeElement = document.createElement("span");
    timeElement.className = "time";
    clockElement.appendChild(timeElement);

    const iconElement = document.createElement("span");
    iconElement.className = "icon";
    clockElement.appendChild(iconElement);

    const dateElement = document.createElement("span");
    dateElement.className = "date";
    clockElement.appendChild(dateElement);

    timeElement.textContent = "00:00:00";
    dateElement.textContent = "00.00.00";
    iconElement.textContent = "?";
    iconElement.title = "Загрузка...";

    if (settings.clockPosition === "fly") {
      container.appendChild(clockElement);
      document.head.appendChild(flyStyle);
    } else if (settings.clockPosition === "tos") {
      const trTos = document.getElementById("tr_tos").querySelector("tbody tr");
      const newTd = document.createElement("td");
      newTd.appendChild(clockElement);
      trTos.appendChild(newTd);
      document.head.appendChild(tosStyle);
    }

    let useInternetTime = false;
    let isDragging = false;
    let offsetX, offsetY;
    let internetTime = null;
    let timerInterval = null;
    let lastSyncTimestamp = 0;
    const SYNC_COOLDOWN_MS = 3 * 60 * 1000;
    let isFetchingTime = false;

    function updateClock(timeSource = new Date()) {
      const hours = String(timeSource.getHours()).padStart(2, "0");
      const minutes = String(timeSource.getMinutes()).padStart(2, "0");
      const seconds = String(timeSource.getSeconds()).padStart(2, "0");
      const day = String(timeSource.getDate()).padStart(2, "0");
      const month = String(timeSource.getMonth() + 1).padStart(2, "0");
      const year = String(timeSource.getFullYear());

      timeElement.textContent = `${hours}:${minutes}:${seconds}`;

      if (
        settings.clockStyle === "compact" ||
        settings.clockStyle === "string"
      ) {
        dateElement.textContent = `${day}.${month}.${year.slice(-2)}`;
      } else if (settings.clockStyle === "standard") {
        const dayOfWeek = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"][
          timeSource.getDay()
        ];
        const monthNames = [
          "Январь",
          "Февраль",
          "Март",
          "Апрель",
          "Май",
          "Июнь",
          "Июль",
          "Август",
          "Сентябрь",
          "Октябрь",
          "Ноябрь",
          "Декабрь",
        ];
        const monthName = monthNames[timeSource.getMonth()];
        dateElement.textContent = `${day} (${dayOfWeek}), ${monthName}, ${year}`;
      }

      if (useInternetTime) {
        iconElement.textContent = "🌍︎";
        iconElement.title = "Точное онлайн время";
        if (settings.clockMoscowTime) {
          iconElement.textContent += " MSK";
        }
      } else {
        iconElement.textContent = "⌨";
        iconElement.title =
          "Не удалось получить точное онлайн время! Используется локальное время устройства";
        if (settings.clockMoscowTime) {
          iconElement.textContent += " MSK";
          iconElement.title =
            "Не удалось получить точное онлайн время! Используется локальное время устройства, сконвертированное в Московское.";
        }
      }
    }

    async function fetchInternetTime() {
      const timeProviders = [
        // Увы, вариант со Сбером ультра рабочий, но требует работы @grant GM_xmlhttpRequest из-за CORS политики,
        // но тогда пользователь испугается всяких предупреждений. На будущее оставил,
        // если всё сломается вообще, но потребует потом дработки в духе новой fetchWithGM функции.

        // {
        //   name: "Sber",
        //   buildUrl: (isMoscow) => {
        //     const tz = isMoscow ? "Europe/Moscow" : "Etc/UTC";
        //     return `https://smartapp-code.sberdevices.ru/tools/api/now?tz=${tz}`;
        //   },
        //   parseResponse: async (response) => {
        //     const data = await response.json();
        //     return new Date(data.timestamp);
        //   },
        // },
        {
          name: "timeapi.io",
          buildUrl: (isMoscow) => {
            const userTimezone =
              Intl.DateTimeFormat().resolvedOptions().timeZone;
            const tz = isMoscow ? "Europe/Moscow" : userTimezone;
            return `https://timeapi.io/api/Time/current/zone?timeZone=${tz}`;
          },
          parseResponse: async (response) => {
            const data = await response.json();
            return new Date(data.dateTime);
          },
        },
        {
          name: "worldtimeapi.org",
          buildUrl: (isMoscow) => {
            const userTimezone =
              Intl.DateTimeFormat().resolvedOptions().timeZone;
            const tz = isMoscow ? "Europe/Moscow" : userTimezone;
            return `https://worldtimeapi.org/api/timezone/${tz}`;
          },
          parseResponse: async (response) => {
            const data = await response.json();
            return new Date(data.datetime);
          },
        },
      ];

      try {
        for (const provider of timeProviders) {
          try {
            const url = provider.buildUrl(settings.clockMoscowTime);
            const response = await fetch(url);
            if (!response.ok) {
              throw new Error(`Response not OK: ${response.status}`);
            }
            internetTime = await provider.parseResponse(response);
            useInternetTime = true;
            lastSyncTimestamp = Date.now();
            // console.log(`Время успешно получено от ${provider.name}.`);
            break;
          } catch (error) {
            // console.warn(
            //   `Не удалось получить время от ${provider.name}, пробую следующий источник.`,
            //   error
            // );
            useInternetTime = false;
          }
        }

        if (useInternetTime) {
          updateClockWithInternetTime();
        } else {
          // console.warn(
          //   "Не удалось получить время от всех онлайн-источников, используется локальное время."
          // );
          useInternetTime = false;
          updateClockWithLocalTime();
        }

        startTimer();
      } finally {
        isFetchingTime = false;
      }
    }

    function updateClockWithInternetTime() {
      if (internetTime) {
        internetTime.setSeconds(internetTime.getSeconds() + 1);
        updateClock(internetTime);
        if (settings.clockMoscowTime) {
          iconElement.textContent = "🌍︎ MSK";
        }
      }
    }

    function updateClockWithLocalTime() {
      if (settings.clockMoscowTime) {
        const now = new Date();
        const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
        const moscowTime = new Date(utcTime + 3600000 * 3); // UTC+3
        updateClock(moscowTime);
      } else {
        updateClock();
      }
    }

    function startTimer() {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
      timerInterval = setInterval(() => {
        if (useInternetTime) {
          updateClockWithInternetTime();
        } else {
          updateClockWithLocalTime();
        }
      }, 1000);
    }

    if (settings.clockPosition === "fly") {
      clockElement.addEventListener("mousedown", (e) => {
        isDragging = true;
        offsetX = e.clientX - clockElement.offsetLeft;
        offsetY = e.clientY - clockElement.offsetTop;
        document.body.style.userSelect = "none";
      });

      clockElement.addEventListener("touchstart", (e) => {
        e.preventDefault();
        isDragging = true;
        const touch = e.touches[0];
        offsetX = touch.clientX - clockElement.offsetLeft;
        offsetY = touch.clientY - clockElement.offsetTop;
        document.body.style.userSelect = "none";
      });

      document.addEventListener("mousemove", (e) => {
        if (isDragging) {
          clockElement.style.left = `${e.clientX - offsetX}px`;
          clockElement.style.top = `${e.clientY - offsetY}px`;
        }
      });

      document.addEventListener("touchmove", (e) => {
        e.preventDefault();
        if (isDragging) {
          const touch = e.touches[0];
          clockElement.style.left = `${touch.clientX - offsetX}px`;
          clockElement.style.top = `${touch.clientY - offsetY}px`;
        }
      });

      document.addEventListener("mouseup", () => {
        isDragging = false;
        document.body.style.userSelect = "auto";
        saveClockPosition();
      });

      document.addEventListener("touchend", () => {
        isDragging = false;
        document.body.style.userSelect = "auto";
        saveClockPosition();
      });
    }

    function saveClockPosition() {
      const clockPosition = {
        x: clockElement.offsetLeft,
        y: clockElement.offsetTop,
      };
      uwuStorage.setItem("uwu_clock", clockPosition);
    }

    function loadClockPosition() {
      const storedPosition = uwuStorage.getItem("uwu_clock");
      if (storedPosition) {
        const clockPosition = storedPosition;
        clockElement.style.left = `${clockPosition.x}px`;
        clockElement.style.top = `${clockPosition.y}px`;
      }
    }

    function handleFocusOrVisibilityChange() {
      if (document.hidden || isFetchingTime) {
        return;
      }

      const now = Date.now();
      if (now - lastSyncTimestamp > SYNC_COOLDOWN_MS) {
        isFetchingTime = true;
        fetchInternetTime().finally(() => {
          isFetchingTime = false;
        });
      }
    }

    document.addEventListener(
      "visibilitychange",
      handleFocusOrVisibilityChange
    );
    window.addEventListener("focus", handleFocusOrVisibilityChange);

    fetchInternetTime();
    if (settings.clockPosition === "fly") {
      loadClockPosition();
    }

    document.body.classList.add(settings.clockStyle);
  }
  // ====================================================================================================================
  //  . . . ДЕЙСТВИЯ ПРИ НАВОДКЕ НА .cat . . .
  // ====================================================================================================================
  document.addEventListener("mouseover", (event) => {
    const catElement = event.target.closest(".cat");

    if (catElement) {
      const catTooltip = catElement.querySelector(".cat_tooltip");

      if (
        settings.showMoreCatInfo &&
        !catTooltip.querySelector(".more-info-link")
      ) {
        const moreInfoLink = document.createElement("a");
        moreInfoLink.classList.add("more-info-link");
        moreInfoLink.textContent = "Подробнее";
        moreInfoLink.addEventListener("click", () => {
          showCatInfo(catElement);
        });

        const moreInfoContainer = document.createElement("div");
        moreInfoContainer.classList.add("more-info-container");
        moreInfoContainer.appendChild(moreInfoLink);

        const onlineSpan = catTooltip.querySelector("span.online");
        onlineSpan.parentNode.insertBefore(moreInfoContainer, onlineSpan);
      }

      if (settings.compactMouth) {
        compactInventory(catElement);
      }

      if (
        settings.personalCostumes &&
        settings.showCostumesButtons &&
        !catTooltip.querySelector(".save-costume-button")
      ) {
        const costumeDivs = catElement.querySelectorAll(
          "div[data-v-59afe5e8]:not(.first)"
        );

        const matchingCostumes = Array.from(costumeDivs).filter((div) =>
          div.style.backgroundImage
            .slice(5, -2)
            .startsWith("/cw3/cats/0/costume/")
        );

        if (matchingCostumes.length > 0) {
          const saveCostume = document.createElement("button");
          saveCostume.textContent = "Сохранить костюм";
          saveCostume.classList.add("save-costume-button");
          saveCostume.addEventListener("click", () => {
            const costumeImages = matchingCostumes.map((costume) =>
              costume.style.backgroundImage.slice(5, -2)
            );
            createCostumeSavePopup(costumeImages);
          });

          catTooltip.appendChild(saveCostume);
        }
      }
    }
  });
  // ====================================================================================================================
  //  . . . КОМПАКТНЫЙ РОТ АХХАХХА . . .
  // ====================================================================================================================
  function compactInventory(cat) {
    const originalMouth = cat.querySelector(".cat_tooltip .mouth");

    if (originalMouth) {
      const existingSortedMouths = cat.querySelectorAll(".mouth.uwu-sorted");
      existingSortedMouths.forEach((mouth) => mouth.remove());

      const newMouth = document.createElement("ol");
      newMouth.classList.add("mouth", "uwu-sorted");
      originalMouth.parentNode.insertBefore(
        newMouth,
        originalMouth.nextSibling
      );

      originalMouth.style.display = "none";

      const inventory = new Map();
      const cats = [];

      [...originalMouth.querySelectorAll("li img")].forEach((img) => {
        const itemSrc = img.getAttribute("src");
        inventory.set(itemSrc, (inventory.get(itemSrc) || 0) + 1);
      });

      [...originalMouth.querySelectorAll("li")].forEach((item) => {
        if (!item.querySelector("img")) {
          cats.push(item.innerHTML);
        }
      });

      newMouth.innerHTML = "";
      for (const [itemSrc, count] of inventory) {
        const listItem = document.createElement("li");
        const itemImage = document.createElement("img");
        itemImage.setAttribute("src", itemSrc);
        listItem.appendChild(itemImage);

        if (count > 1) {
          const countSpan = document.createElement("span");
          countSpan.textContent = `x${count}`;
          listItem.appendChild(countSpan);
        }

        newMouth.appendChild(listItem);
      }

      cats.forEach((catHtml) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = catHtml;
        newMouth.appendChild(listItem);
      });
    }
  }
  // ====================================================================================================================
  //  . . . ИНФОРМАЦИОННЫЙ КОНТЕЙНЕР . . .
  // ====================================================================================================================
  let globalContainer = document.getElementById("uwu-global-container");
  if (!globalContainer) {
    globalContainer = document.createElement("div");
    globalContainer.id = "uwu-global-container";
    globalContainer.style.display = "none";
    document.body.appendChild(globalContainer);
  }

  function createCatInfoContainer() {
    const catInfoElement = document.createElement("div");
    catInfoElement.classList.add("cat-info");

    const contentContainer = document.createElement("div");
    contentContainer.classList.add("content-container");
    catInfoElement.appendChild(contentContainer);

    const closeButton = document.createElement("button");
    closeButton.textContent = "Закрыть";
    closeButton.classList.add("close-info");
    closeButton.addEventListener("click", () => {
      globalContainer.removeChild(catInfoElement);
    });
    catInfoElement.appendChild(closeButton);

    const css_catDefects = document.createElement("style");
    css_catDefects.innerHTML =
      // css
      `
      .cat-info {
        pointer-events: auto;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 20px;
        border-radius: 5px;
        box-shadow: 0 0 10px #00000033;
        z-index: 5;
        width: 300px;
        text-align: center;
        display: block;
        background-color: white;
        color: black;
      }

      .other-cat-info-container {
      display: grid;
      grid-template-columns: 1fr 2fr;
      }
    
      .close-info-container {
        text-align: right;
      }
    
      .close-info {
        cursor: pointer;
      }
    
      .more-info-container {
        cursor: pointer;
      }

      .parameter-details-container {
        text-align: left;
      }

      .cat-details {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        margin-left: 8px;
      }

      .cat-details > p,
      .cat-details > div > p {
        margin-top: 5px;
        margin-bottom: 5px;
      }

      #uwu-global-container > div.cat-info > div > div > div.cat-details > div {
        margin-top: 8px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
      }
    `;

    document.head.appendChild(css_catDefects);

    return { catInfoElement, contentContainer };
  }
  // ====================================================================================================================
  //  . . . БОЛЬШЕ ИНФОРМАЦИИ В "О КОТЕ" . . .
  // ====================================================================================================================
  const defectsInfo = {
    wound: {
      name: "Раны",
      states: {
        1: "царапины",
        2: "лёгкие раны",
        3: "глубокие раны",
        4: "смертельные раны",
      },
    },
    poisoning: {
      name: "Отравление",
      states: {
        1: "недомогание",
        2: "лёгкое отравление",
        3: "сильное отравление",
        4: "смертельное отравление",
      },
    },
    drown: {
      name: "Травмы от утопления",
      states: {
        1: "ссадины",
        2: "небольшие кровоподтёки",
        3: "сильные травмы",
        4: "смертельные травмы",
      },
    },
    disease: {
      name: "Болезнь",
      states: {
        1: "кашель",
        2: "кашель",
        3: "кашель",
        4: "кашель",
      },
    },
    trauma: {
      name: "Переломы",
      states: {
        1: "синяки",
        2: "лёгкие ушибы",
        3: "сильные ушибы",
        4: "смертельные ушибы",
      },
    },
    dirt: {
      name: "Грязь",
      states: {
        1: "грязные лапы",
        2: "грязевые пятна",
        3: "клещи",
        4: "блохи",
      },
    },
  };

  function showCatInfo(cat) {
    const catName = cat.querySelector(".cat_tooltip a").textContent;
    const catSize = cat.querySelector(".d .first").style.backgroundSize;
    const catImage = cat
      .querySelector(".d .first")
      .style.backgroundImage.slice(5, -2);

    const defectElements = Array.from(
      cat.querySelectorAll(".d > div:not(.first)")
    );

    const uniqueDefects = new Set();

    const catDefects = defectElements
      .map((element) => {
        const defectUrl = element.style.backgroundImage;

        if (defectUrl.includes("/defects/")) {
          const defectParts = defectUrl.split("/");
          const lastPart = defectParts.pop();
          const defectLevel = parseInt(lastPart.split("/")[0]);
          const defectType = defectParts[5];
          const defectKey = `${defectType}-${defectLevel}`;

          if (!uniqueDefects.has(defectKey)) {
            uniqueDefects.add(defectKey);
            return { type: defectType, level: defectLevel };
          }
        }
        return null;
      })
      .filter(Boolean);

    const catId = cat
      .querySelector(".cat_tooltip a")
      .getAttribute("href")
      .slice(4);

    let { catInfoElement, contentContainer } = createCatInfoContainer();

    contentContainer.innerHTML =
      // html
      `
      <h2>${catName}</h2>
      <div class="other-cat-info-container">
        <div>
          <img src="${catImage}" class="cat-image">
        </div>
        <div class="cat-details">
          <p><strong>ID</strong>: ${catId}</p>
          <p><strong>Размер</strong>: ${catSize}</p>
        </div>
      </div>
    `;

    const defectsContainer = document.createElement("div");
    if (catDefects.length > 0) {
      defectsContainer.innerHTML = "<p>Дефекты:</p>";
      catDefects.forEach((defect) => {
        const defectData = defectsInfo[defect.type];
        if (defectData) {
          const defectState = defectData.states[defect.level] || "";
          const defectLine = document.createElement("p");
          const defectNameSpan = document.createElement("strong");
          defectNameSpan.textContent = defectData.name;
          defectLine.appendChild(defectNameSpan);
          defectLine.insertAdjacentHTML(
            "beforeend",
            ` (${defect.level} стадия, ${defectState})`
          );

          defectsContainer.appendChild(defectLine);
        }
      });
      contentContainer
        .querySelector(".cat-details")
        .appendChild(defectsContainer);
    } else {
      contentContainer.querySelector(".cat-details").innerHTML +=
        "<p><strong>Здоровый</strong></p>";
    }

    globalContainer.appendChild(catInfoElement);
  }
  // ====================================================================================================================
  //  . . . СОБСТВЕННЫЙ ФОН ЛОКАЦИИ ИГРОВОЙ . . .
  // ====================================================================================================================
  if (settings.gameFieldBackgroundUser) {
    const css_gameField = document.createElement("style");
    css_gameField.textContent = `
      #cages_div {
          background-image: url(${settings.gameFieldBackgroundUserImageURL}) !important;
      }
  `;
    document.head.appendChild(css_gameField);
  }
  // ====================================================================================================================
  //  . . . ГРАНИЦЫ ЯЧЕЕК . . . cellsNumbers
  // ====================================================================================================================
  function updateCellsBordersStyle(checked) {
    let styleElement = document.getElementById("cellsBordersStyle");
    const cellsBordersStyle = `
      .cage {
        box-shadow: inset 0 0 0 0.${settingsMap.uwu_settings.cellsBordersThickness}px ${settings.cellsBordersColor};
      }
    `;

    if (checked) {
      if (!styleElement) {
        styleElement = document.createElement("style");
        styleElement.id = "cellsBordersStyle";
        styleElement.innerHTML = cellsBordersStyle;
        document.head.appendChild(styleElement);
      }
    } else {
      if (styleElement) {
        document.head.removeChild(styleElement);
      }
    }
  }
  // ====================================================================================================================
  //  . . . НУМЕРАЦИЯ ЯЧЕЕК . . .
  // ====================================================================================================================
  if (settings.cellsNumbers) {
    function createCellNumbers(style) {
      let css =
        /* CSS */
        `
        #cages_div { position: relative; }
        #cages > tbody > tr > td { position: relative; }
        #cages > tbody > tr > td::after { 
          content: attr(data-cell-num);
          position: absolute; 
          z-index: 2;
          top: 5px; 
          right: 5px;
          color: ${style.color || "#000"}; 
          opacity: ${style.opacity || 0.4}; 
          font-size: 16px; 
          font-weight: bold;
        }
      `;

      let cagesNums = document.createElement("style");
      cagesNums.id = "cages_nums";
      cagesNums.innerHTML = css;
      document.head.appendChild(cagesNums);

      let table = document.getElementById("cages");
      if (!table) return;
      let rows = table.querySelectorAll("tbody > tr");
      for (let i = 0; i < rows.length; i++) {
        let cells = rows[i].querySelectorAll("td");
        for (let j = 0; j < cells.length; j++) {
          cells[j].setAttribute("data-cell-num", (j + 1).toString());
        }
      }
    }

    createCellNumbers({
      color: "white",
      opacity: 0.8,
    });
  }
  // ====================================================================================================================
  //   . . . ПРОЦЕНТЫ ПАРАМЕТРОВ . . .
  // ====================================================================================================================
  // if (settings.displayParametersPercentages) {
  //   const parameterTableIds = [
  //     "dream_table",
  //     "hunger_table",
  //     "thirst_table",
  //     "need_table",
  //     "health_table",
  //     "clean_table",
  //   ];

  //   function updateParameterPercentages(tableId) {
  //     const table = document.getElementById(tableId);
  //     if (table) {
  //       const row = table.querySelector("tbody tr");
  //       if (!row) {
  //         console.warn(`Строка не найдена в таблице с ID "${tableId}".`);
  //         return;
  //       }
  //       const greenBar = row.querySelector(
  //         "td[style*='background-color: green;']"
  //       );
  //       const redBar = row.querySelector("td[style*='background-color: red;']");
  //       if (!greenBar || !redBar) {
  //         console.warn(`Бары не найдены в строке таблицы с ID "${tableId}".`);
  //         return;
  //       }
  //       const greenBarWidth = parseInt(greenBar.style.width, 10);
  //       const redBarWidth = parseInt(redBar.style.width, 10);
  //       const totalWidth = greenBarWidth + redBarWidth;
  //       let percentage = (greenBarWidth / totalWidth) * 100;
  //       percentage =
  //         percentage % 1 !== 0 ? percentage.toFixed(2) : Math.round(percentage);

  //       let percentageCell = row.querySelector(".percentage-cell");
  //       if (!percentageCell) {
  //         percentageCell = document.createElement("td");
  //         percentageCell.classList.add("percentage-cell");
  //         row.appendChild(percentageCell);
  //       }
  //       percentageCell.textContent = `${percentage}%`;
  //     } else {
  //       console.warn(`Таблица с ID "${tableId}" не найдена.`);
  //     }
  //   }

  //   async function setupTableObservers() {
  //     for (const tableId of parameterTableIds) {
  //       const tableSelector = `#${tableId}`;
  //       const rowSelector = `${tableSelector} tbody tr`;
  //       const greenBarSelector = `${rowSelector} td[style*='background-color: green;']`;
  //       const redBarSelector = `${rowSelector} td[style*='background-color: red;']`;

  //       await setupMutationObserver(tableSelector, () =>
  //         updateParameterPercentages(tableId)
  //       );
  //       await setupMutationObserver(greenBarSelector, () =>
  //         updateParameterPercentages(tableId)
  //       );
  //       await setupMutationObserver(redBarSelector, () =>
  //         updateParameterPercentages(tableId)
  //       );
  //     }
  //   }

  //   window.addEventListener("load", setupTableObservers);
  // }
  // ====================================================================================================================
  //   . . . ПОДРОБНЕЕ О ПАРАМЕТРАХ (И НАВЫКОВ?) . . .
  // ====================================================================================================================
  function createMoreInfoButton() {
    const parametersBlock = document.getElementById("parameters_skills_block");

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");
    buttonContainer.style.paddingBottom = "5px";

    const moreInfoLink = document.createElement("a");
    moreInfoLink.href = "#";
    moreInfoLink.textContent = "Подробнее";
    moreInfoLink.classList.add("more-info-link");
    moreInfoLink.addEventListener("click", (event) => {
      event.preventDefault();
      showParameterDetails();
    });

    buttonContainer.appendChild(moreInfoLink);

    parametersBlock.insertBefore(buttonContainer, parametersBlock.firstChild);
  }

  // const parameters = [
  //   {
  //     id: "dream_table",
  //     name: "Сонливость",
  //     timePerPixel: 20,
  //     formula: null,
  //   },
  //   {
  //     id: "hunger_table",
  //     name: "Голод",
  //     timePerPixel: null,
  //     formula: (red) => Math.ceil((red / 150) * 9) * 15,
  //   },
  //   { id: "thirst_table", name: "Жажда", timePerPixel: 60, formula: null },
  //   { id: "need_table", name: "Нужда", timePerPixel: 30, formula: null },
  //   {
  //     id: "health_table",
  //     name: "Здоровье",
  //     timePerPixel: null,
  //     formula: null,
  //   },
  //   {
  //     id: "clean_table",
  //     name: "Чистота",
  //     timePerPixel: null,
  //     formula: (red) => {
  //       red = red % 3 ? red : red - 0.5;
  //       return ((red - 1) / 1.5) * 100 + 100;
  //     },
  //   },
  // ];

  const maxWidthPx = 150;

  function showParameterDetails() {
    const parameters = [
      {
        id: "dream",
        name: "Бодрость",
        formula: (redPixels) => {
          if (redPixels <= 0) return 0;

          const percentageLoss = Math.round(redPixels / 1.5);
          let totalTime = 0;

          for (let i = 1; i <= percentageLoss; i++) {
            if (i <= 2) {
              // Первые два процента добавляют по 20 секунд
              totalTime += 20;
            } else if (i % 2 !== 0) {
              // Нечётные проценты (3-й, 5-й и т.д.) добавляют 40 секунд
              totalTime += 40;
            } else {
              // Чётные проценты (4-й, 6-й и т.д.) добавляют 20 секунд
              totalTime += 20;
            }
          }
          return totalTime;
        },
      },
      {
        id: "hunger",
        name: "Голод",
        formula: (percentage) => Math.ceil(((100 - percentage) / 150) * 9) * 15,
      },
      { id: "thirst", name: "Жажда", timePerPixel: 60, formula: null },
      { id: "need", name: "Нужда", timePerPixel: 30, formula: null },
      {
        id: "health",
        name: "Здоровье",
        formula: null,
      },
      {
        id: "clean",
        name: "Чистота",
        timePerPixel: null,
        formula: (redPixels) => {
          if (redPixels <= 0) return 0;
          return (200 / 3) * redPixels;
        },
      },
    ];

    let { catInfoElement, contentContainer } = createCatInfoContainer();
    contentContainer.classList.add("parameter-details-container");

    parameters.forEach(({ id, name, formula, timePerPixel }) => {
      const parameterElement = document.getElementById(id);
      if (parameterElement) {
        const barFill = parameterElement.querySelector(".bar-fill");
        const barData = parameterElement.querySelector(".bar-data");

        if (!barFill || !barData) {
          console.warn(`Элементы бара не найдены для параметра с ID "${id}".`);
          return;
        }

        const percentageString = barData.textContent.match(/\d+%$/);
        if (!percentageString) {
          console.warn(
            `Не удалось извлечь процент из текста для параметра с ID "${id}".`
          );
          return;
        }

        const percentage = parseInt(percentageString[0], 10);

        const effectivePercentage = ["hunger", "thirst", "need"].includes(id)
          ? 100 - percentage
          : percentage;
        const reversePercentage = 100 - effectivePercentage;

        const pixelWidth = (effectivePercentage / 100) * maxWidthPx;
        const reversePixelWidth = maxWidthPx - pixelWidth;

        let timeInfo = "";
        let totalTimeSeconds;

        if (formula) {
          totalTimeSeconds = formula(reversePixelWidth);
        } else if (timePerPixel) {
          totalTimeSeconds = reversePixelWidth * timePerPixel;
        }

        if (totalTimeSeconds !== undefined) {
          const hours = Math.floor(totalTimeSeconds / 3600);
          const minutes = Math.floor((totalTimeSeconds % 3600) / 60);
          const seconds = Math.ceil(totalTimeSeconds % 60);

          if (hours > 0) {
            timeInfo = ` (> ${hours} ч ${minutes} мин)`;
          } else if (minutes > 0) {
            timeInfo = ` (${minutes} мин ${seconds} сек)`;
          } else {
            timeInfo = ` (${seconds} сек)`;
          }
        }

        const detailLine = document.createElement("p");
        detailLine.innerHTML = `<strong>${name}:</strong> <span style="color: #00cc00;">${effectivePercentage}%</span> / <span style="color: red;">${reversePercentage}%</span>`;
        detailLine.style.marginBottom = "0";
        contentContainer.appendChild(detailLine);

        if (timeInfo) {
          const detailLineTime = document.createElement("p");
          detailLineTime.innerHTML = `≈${timeInfo}`;
          detailLineTime.style.marginTop = "0";
          contentContainer.appendChild(detailLineTime);
        }
      } else {
        console.warn(`Параметр с ID "${id}" не найден.`);
      }
    });

    globalContainer.appendChild(catInfoElement);
  }

  if (settings.showParametersDetails) {
    setupSingleCallback("#parameters_skills_block", createMoreInfoButton);
  }
  // ====================================================================================================================
  //   . . . ЧИСЛОВАЯ ГРОМКОСТЬ УВЕДОМЛЕНИЙ . . .
  // ====================================================================================================================
  if (settings.climbingNotificationsNumbers) {
    function addClimbingNotificationsStyles() {
      const styles = Array.from(
        { length: 11 },
        (_, i) => `
          .vlm${i} > .nick[style*="italic"]:after {
            content: " [${i}]";
          }
        `
      ).join("");

      const styleElement = document.createElement("style");
      styleElement.textContent = styles;
      document.head.appendChild(styleElement);
    }

    addClimbingNotificationsStyles();
  }
  // ====================================================================================================================
  //   . . . ЗВУКОВОЕ УВЕДОМЛЕНИЕ ПРИ ОБНОВЛЕНИИ КЛЕТОК . . .
  // ====================================================================================================================
  // TODO - debounceTimer, если не сработает решение со сравнением историй. P.S. Вроде работает.
  if (settings.climbingRefreshNotification) {
    function handleClimbingRefresh() {
      const refreshRegex = /Услышала? оглушительн/;
      let previousHistory = "";

      const updateHistory = () => {
        const istElement = document.getElementById("ist");
        const currentHistory = istElement.innerHTML;

        if (currentHistory !== previousHistory) {
          previousHistory = currentHistory;

          const entries = currentHistory.split(".");
          const lastEntry = entries[entries.length - 2];

          if (lastEntry !== undefined && refreshRegex.test(lastEntry)) {
            const lastPlayedEntry = entries[entries.length - 3];

            if (!lastPlayedEntry || !refreshRegex.test(lastPlayedEntry)) {
              soundManager.playSound(
                settings.climbingRefreshNotificationSound,
                settings.climbingRefreshNotificationVolume
              );
            }
          }
        }
      };

      const historyBlock = document.getElementById("history_block");
      const observer = new MutationObserver(() => {
        updateHistory();
      });

      const config = {
        childList: true,
        subtree: true,
        characterData: true,
      };
      observer.observe(historyBlock, config);
    }

    handleClimbingRefresh();
  }
  // ====================================================================================================================
  //   . . . МИННОЕ ПОЛЕ . . .
  // ====================================================================================================================
  // Вторая по ненависти работа с кодами. Но уже к самому себе а не к сайту.........
  // чат уже ничего не перебьёт....... наверно????????????
  // TODO - Переписать всё это мессиво к чертям, это кошмар какой-то. Как оно вообще ещё работает?????? Что я употреблял?????????????????????
  if (settings.climbingPanel) {
    let isDragging = false;
    let initialX;
    let initialY;
    let currentX;
    let currentY;
    let wasDragging = false;

    function saveClimbingPanelStatus() {
      const status = {
        x: currentX,
        y: currentY,
        isOpen: climbingPanelContainer.classList.contains("open"),
        isChecked: transferCheckbox.checked,
        currentTabIndex: tabManager.currentTabIndex,
        currentTableId: tabManager.currentTableId,
      };
      uwuStorage.setItem("uwu_climbingPanelStatus", status);
    }

    function loadClimbingPanelStatus() {
      const savedStatus = uwuStorage.getItem("uwu_climbingPanelStatus");
      const arrow = document.getElementById("uwu-arrow");

      if (savedStatus) {
        const status = savedStatus;

        currentX = status.x;
        currentY = status.y;

        climbingPanelContainer.classList.toggle("open", status.isOpen);

        if (status.isOpen) {
          arrow.textContent = "▼";
        } else {
          arrow.textContent = "▶";
        }

        transferCheckbox.checked = status.isChecked;

        tabManager.currentTabIndex = status.currentTabIndex;
        if (
          status.currentTableId !== null &&
          tabManager.tabs[status.currentTabIndex].tables[status.currentTableId]
        ) {
          tabManager.currentTableId = status.currentTableId;
        }

        tabManager.render();

        if (status.isChecked) {
          transferColors();
        }
      } else {
        tabManager.render();
        arrow.textContent = "▶";
      }

      checkAndResetPanelPosition();
    }

    function updateCell(cell, value) {
      cell.dataset.value = value || "";
      cell.textContent = value === "mine" || value === "transit" ? "" : value;
      switch (value) {
        case "mine":
          cell.style.backgroundColor = "#5b000073";
          break;
        case "transit":
          cell.style.backgroundColor = "#ffffff87";
          break;
        default:
          cell.style.backgroundColor = "";
      }
    }

    function transferColors() {
      const transferCheckbox = document.getElementById("uwu-transferCheckbox");
      let styleTag = document.getElementById(
        "uwu-climbing-panel-dynamic-styles"
      );

      if (!styleTag) {
        styleTag = document.createElement("style");
        styleTag.id = "uwu-climbing-panel-dynamic-styles";
        document.head.appendChild(styleTag);
      }

      if (!transferCheckbox.checked) {
        styleTag.innerHTML = "";
        return;
      }

      const climbingPanelCells = Array.from(
        document.querySelectorAll("#uwu-climbingPanel td")
      );

      let newCssRules = "";
      const numCols = 10;

      climbingPanelCells.forEach((cell, i) => {
        const color = getComputedStyle(cell).backgroundColor;
        if (color && color !== "rgba(0, 0, 0, 0)" && color !== "transparent") {
          const rowIndex = Math.floor(i / numCols) + 1;
          const colIndex = (i % numCols) + 1;
          newCssRules += `#cages > tbody > tr:nth-of-type(${rowIndex}) > td:nth-of-type(${colIndex})::before { background-color: ${color}; }\n`;
        }
      });

      styleTag.innerHTML = newCssRules;
    }

    function clearColors() {
      const styleTag = document.getElementById(
        "uwu-climbing-panel-dynamic-styles"
      );
      if (styleTag) {
        styleTag.innerHTML = "";
      }
    }

    let lastClickedCell = null;

    function handleCellClick(event) {
      const cell = event.target.closest("td");
      if (!cell || !cell.closest("#uwu-climbingPanel")) return;

      if (settings.climbingPanelInputsStyle === "standart") {
        updateCell(cell, activeInputValue);
        saveTableData(tabManager.currentTableId);
        transferColors();
      } else {
        if (lastClickedCell === cell) {
          updateCell(cell, "");
          saveTableData(tabManager.currentTableId);
          transferColors();
          lastClickedCell = null;
        } else {
          lastClickedCell = cell;
        }
      }
    }

    function handleKeyDown(event) {
      const keyPressed = event.key;
      const activeElement = document.activeElement;

      if (
        activeElement &&
        activeElement.tagName === "TD" &&
        activeElement.closest("#uwu-climbingPanel")
      ) {
        switch (keyPressed) {
          case "0":
          case "1":
          case "2":
          case "3":
          case "4":
          case "5":
          case "6":
          case "7":
            updateCell(activeElement, keyPressed);
            break;
          case "-":
            updateCell(activeElement, "mine");
            break;
          case "=":
            updateCell(activeElement, "transit");
            break;
          default:
            return;
        }

        saveTableData(tabManager.currentTableId);
        transferColors();
      }
    }

    function handleTransferCheckboxChange(event) {
      event.target.checked ? transferColors() : clearColors();
      saveClimbingPanelStatus();
    }

    let activeInputValue = "0";

    const uwuClimbingPanelContainer =
      /* HTML */
      `
        <div id="uwu-climbingMainPanel">
          <div id="uwu-climbingPanelButton">
            <div class="left-content">
              <h2>Минное поле</h2>
            </div>
            <div class="right-content">
              <span id="uwu-arrow">▶</span>
            </div>
          </div>
          <div id="uwu-climbingPanelContainer">
            <div id="uwu-climbingPanelContent">
              <div id="uwu-buttonContainer">
                <div id="uwu-inputButtons" style="display: none;">
                  <button value="0">0</button>
                  <button value="1">1</button>
                  <button value="2">2</button>
                  <button value="3">3</button>
                  <button value="4">4</button>
                  <button value="5">5</button>
                  <button value="6">6</button>
                  <button value="7">7</button>
                  <button value="transit">Переход</button>
                  <button value="mine">Мина</button>
                  <button value="">Очистить</button>
                </div>
                <h3>Вкладка</h3>
                <div id="uwu-buttonRow1"></div>
                <hr id="uwu-hr" />
                <h3>Локация</h3>
                <div id="uwu-buttonRow2"></div>
              </div>
              <div id="uwu-functionButtonsContainer">
                <input type="checkbox" id="uwu-transferCheckbox" />
                <label for="uwu-transferCheckbox"
                  >Перенос на Игровое поле</label
                >
              </div>
              <div id="uwu-tableContainer"></div>
            </div>
          </div>
        </div>
      `;

    function createClimbingPanel() {
      const globalContainer = document.getElementById("uwu-global-container");
      globalContainer.insertAdjacentHTML(
        "beforeend",
        uwuClimbingPanelContainer
      );

      const transferCheckbox = document.getElementById("uwu-transferCheckbox");

      if (settings.climbingPanelInputsStyle === "standart") {
        setupInputButtons();
      }

      document.addEventListener("keydown", handleKeyDown);
      transferCheckbox.addEventListener("change", handleTransferCheckboxChange);
    }

    function setupInputButtons() {
      const inputButtonsContainer = document.getElementById("uwu-inputButtons");
      inputButtonsContainer.style.display = "flex";
      inputButtonsContainer.style.flexWrap = "wrap";

      const inputButtons = inputButtonsContainer.querySelectorAll("button");
      inputButtons.forEach((button) => {
        button.addEventListener("click", () => {
          activeInputValue = button.value;
          updateInputButtonsStyle();
        });
      });
      updateInputButtonsStyle();
    }

    function updateInputButtonsStyle() {
      const inputButtons = document.querySelectorAll(
        "#uwu-inputButtons button"
      );
      inputButtons.forEach((button) => {
        button.classList.toggle("active", button.value === activeInputValue);
      });
    }

    function saveTableData(tableIndex) {
      const climbingPanel = document.getElementById("uwu-climbingPanel");
      if (!climbingPanel) return;

      const tableData = getTableData(climbingPanel.id);
      const currentTab = tabManager.tabs[tabManager.currentTabIndex];
      currentTab.tables[tableIndex] = {
        name: currentTab.tables[tableIndex].name,
        data: tableData,
      };
      tabManager.saveState();
    }

    function clearTable() {
      const climbingPanel = document.getElementById("uwu-climbingPanel");
      if (!climbingPanel) return;

      const cells = Array.from(climbingPanel.querySelectorAll("td"));
      cells.forEach((cell) => {
        if (cell.dataset.value !== "transit") {
          updateCell(cell, "");
        }
      });

      const currentTab = tabManager.tabs[tabManager.currentTabIndex];
      currentTab.tables[tabManager.currentTableId] = {
        name: currentTab.tables[tabManager.currentTableId].name,
        data: getTableData(climbingPanel.id),
      };
      tabManager.saveState();
      transferColors();
    }

    const tabManager = {
      tabs: [],
      currentTabIndex: 0,
      currentTableId: 0,

      createTab(name) {
        const newTab = {
          name: name,
          tables: [],
        };

        this.tabs.push(newTab);
        this.render();
        this.switchTab(this.tabs.length - 1);
      },

      switchTab(index) {
        this.currentTabIndex = index;
        const currentTab = this.tabs[this.currentTabIndex];
        this.currentTableId =
          currentTab && currentTab.tables.length > 0 ? 0 : null;

        if (currentTab && currentTab.tables.length === 0) {
          this.renderNoTableMessage();
        } else {
          this.render();
        }

        transferColors();
        saveClimbingPanelStatus();
      },

      switchTable(tableIndex) {
        this.currentTableId = tableIndex;
        this.render();
        transferColors();
        saveClimbingPanelStatus();
      },

      saveState() {
        uwuStorage.setItem("uwu_climbingPanelState", this);
      },

      render() {
        this.renderTabs();
        this.renderTables();
        if (this.currentTableId !== null) {
          this.renderTable(this.currentTableId);
        }
      },

      renderTabs() {
        const tabRow = document.getElementById("uwu-buttonRow1");
        tabRow.innerHTML = "";

        this.tabs.forEach((tab, index) => {
          const tabButton = document.createElement("button");
          tabButton.textContent = tab.name;
          tabButton.classList.add("tab-button");

          if (index === this.currentTabIndex) {
            tabButton.classList.add("active");
          }

          tabButton.addEventListener("click", () => this.switchTab(index));

          const tabContainer = document.createElement("div");
          tabContainer.classList.add("tab-container");
          tabContainer.appendChild(tabButton);

          tabRow.appendChild(tabContainer);
        });
      },

      renderTables() {
        const tableRow = document.getElementById("uwu-buttonRow2");
        tableRow.innerHTML = "";

        const currentTab = this.tabs[this.currentTabIndex];
        if (currentTab) {
          currentTab.tables.forEach((table, index) => {
            const tableButton = document.createElement("button");
            tableButton.textContent = table.name || `Локация ${index + 1}`;
            tableButton.classList.add("table-button");

            if (index === this.currentTableId) {
              tableButton.classList.add("active");
            }

            tableButton.addEventListener("click", () =>
              this.switchTable(index)
            );

            const tableContainer = document.createElement("div");
            tableContainer.classList.add("table-container");
            tableContainer.appendChild(tableButton);

            tableRow.appendChild(tableContainer);
          });
        }
      },

      renderTable(tableIndex) {
        const tableContainer = document.getElementById("uwu-tableContainer");
        tableContainer.innerHTML = "";

        const currentTab = this.tabs[this.currentTabIndex];
        const climbingPanel = document.createElement("table");
        climbingPanel.id = "uwu-climbingPanel";

        for (let i = 0; i < 6; i++) {
          const row = document.createElement("tr");
          for (let j = 0; j < 10; j++) {
            const cell = document.createElement("td");
            cell.setAttribute("tabindex", "0");
            cell.addEventListener("click", handleCellClick);
            row.appendChild(cell);
          }
          climbingPanel.appendChild(row);
        }

        const tableData = currentTab.tables[tableIndex]?.data;

        if (tableData) {
          tableData.forEach((rowData, i) => {
            rowData.forEach((cellData, j) => {
              updateCell(climbingPanel.rows[i].cells[j], cellData.value);
            });
          });
        }

        tableContainer.appendChild(climbingPanel);

        const clearButton = document.createElement("button");
        clearButton.textContent = "Очистить всё поле/таблицу";
        clearButton.id = "button-clear-table";
        clearButton.addEventListener("click", clearTable);
        tableContainer.appendChild(clearButton);
      },

      renderNoTableMessage() {
        const tableContainer = document.getElementById("uwu-tableContainer");
        tableContainer.innerHTML = "";

        const message = document.createElement("div");
        message.textContent = "Добавьте поле/таблицу в настройках";
        message.style.textAlign = "center";
        message.style.marginTop = "20px";
        tableContainer.appendChild(message);

        this.renderTabs();
        this.renderTables();
      },
    };

    function loadSavedState() {
      const savedState = uwuStorage.getItem("uwu_climbingPanelState");
      if (savedState) {
        const state = savedState;
        Object.assign(tabManager, state);
        tabManager.currentTabIndex = 0;

        const currentTab = tabManager.tabs[tabManager.currentTabIndex];
        if (currentTab && currentTab.tables.length > 0) {
          if (tabManager.currentTableId >= currentTab.tables.length) {
            tabManager.currentTableId = 0;
          }
        } else {
          tabManager.currentTableId = null;
        }
      }
    }

    loadSavedState();
    createClimbingPanel();
    tabManager.render();

    function getTableData(tableId) {
      const table = document.getElementById(tableId);
      if (!table) {
        console.error(`Таблица с id ${tableId} не найдена`);
        return [];
      }

      const tableData = [];

      for (let i = 0; i < table.rows.length; i++) {
        const rowData = [];
        for (let j = 0; j < table.rows[i].cells.length; j++) {
          const cell = table.rows[i].cells[j];
          rowData.push({
            value: cell.dataset.value || "",
          });
        }
        tableData.push(rowData);
      }

      return tableData;
    }

    // ===================== ПЕРЕТАСКИВАНИЕ =====================

    const climbingMainPanel = document.getElementById("uwu-climbingMainPanel");
    const climbingPanelButton = document.getElementById(
      "uwu-climbingPanelButton"
    );
    const climbingPanelContainer = document.getElementById(
      "uwu-climbingPanelContainer"
    );
    const transferCheckbox = document.getElementById("uwu-transferCheckbox");

    let touchStartTime;
    let touchStartX;
    let touchStartY;
    const CLICK_THRESHOLD = 200;
    const MOVE_THRESHOLD = 10;

    function handleTouchStart(e) {
      touchStartTime = Date.now();
      const touch = e.touches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
      dragStart(e);
    }

    function handleTouchEnd(e) {
      dragEnd(e);

      // Проверяем, был ли это клик
      const touchEndTime = Date.now();
      const touchDuration = touchEndTime - touchStartTime;

      if (e.changedTouches && e.changedTouches[0]) {
        const touch = e.changedTouches[0];
        const moveDistance = Math.sqrt(
          Math.pow(touch.clientX - touchStartX, 2) +
            Math.pow(touch.clientY - touchStartY, 2)
        );

        if (
          touchDuration < CLICK_THRESHOLD &&
          moveDistance < MOVE_THRESHOLD &&
          !wasDragging
        ) {
          togglePanelContainer(e);
        }
      }
    }

    function dragStart(e) {
      const touch = e.touches ? e.touches[0] : e;

      const savedStatus = uwuStorage.getItem("uwu_climbingPanelStatus");
      initialX =
        touch.clientX -
        (savedStatus ? savedStatus.x : climbingMainPanel.offsetLeft);
      initialY =
        touch.clientY -
        (savedStatus ? savedStatus.y : climbingMainPanel.offsetTop);

      if (e.target === climbingPanelButton) {
        isDragging = true;
        wasDragging = false;
      }

      if (e.type === "touchstart") {
        e.preventDefault();
      }
    }

    function drag(e) {
      if (isDragging) {
        const touch = e.touches ? e.touches[0] : e;

        currentX = touch.clientX - initialX;
        currentY = touch.clientY - initialY;

        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const panelWidth = climbingMainPanel.offsetWidth;
        const panelHeight = climbingMainPanel.offsetHeight;

        const maxX = windowWidth - panelWidth;
        currentX = Math.max(0, Math.min(currentX, maxX));

        const maxY = windowHeight - panelHeight;
        currentY = Math.max(0, Math.min(currentY, maxY));

        setPosition(currentX, currentY, climbingMainPanel);

        wasDragging = true;

        e.preventDefault();
      }
    }

    function dragEnd(e) {
      if (isDragging) {
        saveClimbingPanelStatus();
      }
      isDragging = false;
    }

    function setPosition(x, y, el) {
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
    }

    function togglePanelContainer(e) {
      if (!wasDragging) {
        const arrow = document.getElementById("uwu-arrow");
        climbingPanelContainer.classList.toggle("open");
        saveClimbingPanelStatus();

        if (climbingPanelContainer.classList.contains("open")) {
          arrow.textContent = "▼";
        } else {
          arrow.textContent = "▶";
        }
      }
      wasDragging = false;
    }

    function checkAndResetPanelPosition() {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const panelWidth = climbingMainPanel.offsetWidth;
      const panelHeight = climbingMainPanel.offsetHeight;

      const savedStatus = uwuStorage.getItem("uwu_climbingPanelStatus");

      if (savedStatus) {
        currentX = savedStatus.x;
        currentY = savedStatus.y;
      } else {
        currentX = 0;
        currentY = 0;
      }

      if (
        currentX + panelWidth > windowWidth ||
        currentY + panelHeight > windowHeight
      ) {
        currentX = 0;
        currentY = 0;
        saveClimbingPanelStatus();
      }

      setPosition(currentX, currentY, climbingMainPanel);
    }

    climbingPanelButton.addEventListener("mousedown", dragStart);
    document.addEventListener("mouseup", dragEnd);
    document.addEventListener("mousemove", drag);
    climbingPanelButton.addEventListener("click", togglePanelContainer);

    climbingPanelButton.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    document.addEventListener("touchend", handleTouchEnd);
    document.addEventListener("touchmove", drag, { passive: false });

    setTimeout(loadClimbingPanelStatus, 10);

    const climbingPanelContent = document.getElementById(
      "uwu-climbingPanelContent"
    );
    const buttonContainer = document.getElementById("uwu-buttonContainer");
    const inputButtonsContainer = document.getElementById("uwu-inputButtons");
    const buttonRow1 = document.getElementById("uwu-buttonRow1");
    const buttonRow2 = document.getElementById("uwu-buttonRow2");
    const functionButtonsContainer = document.getElementById(
      "uwu-functionButtonsContainer"
    );
    const tableContainer = document.getElementById("uwu-tableContainer");
    const clearTableButton = document.getElementById("button-clear-table");

    if (
      settings.climbingPanelOrientation === "horizontal" &&
      settings.climbingPanelInputsStyle === "standart"
    ) {
      climbingMainPanel.classList.add("horizontal-keyboard");
      climbingPanelContent.classList.add("horizontal-keyboard");
      buttonContainer.classList.add("horizontal-keyboard");
      inputButtonsContainer.classList.add("horizontal-keyboard");
      buttonRow1.classList.add("horizontal-keyboard");
      buttonRow2.classList.add("horizontal-keyboard");
      functionButtonsContainer.classList.add("horizontal-keyboard");
      tableContainer.classList.add("horizontal-keyboard");
      clearTableButton.classList.add("horizontal-keyboard");
    }

    const uwuClimbingPanel = document.createElement("style");
    uwuClimbingPanel.innerHTML =
      /* CSS */
      `
      #cages > tbody > tr > td.cage {
        position: relative;
      }

      #cages > tbody > tr > td.cage::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 0;
      }

      #uwu-climbingPanelContainer {
        background-color: "";
        display: none;
        padding: 5px;
      }
      
      #uwu-climbingPanelContainer.open {
        display: block;
      }

      #uwu-climbingMainPanel {
        z-index: 2;
        pointer-events: auto;
        width: 260px;
        position: absolute;
        background-color: ${theme?.climbingPanelBackground || "#ffffff08"};
        border: 1px solid #ffffff1a;
        backdrop-filter: blur(20px);
        border-radius: 10px;
      }

      #uwu-climbingPanelButton .left-content {
        pointer-events: none;
        width: 90%;
      }

      #uwu-climbingPanelButton .right-content {
        pointer-events: none;
        width: 10%;
        text-align: right;
      }

      #uwu-arrow {
        font-size: 18px;
        margin-right: 8px;
      }

      #uwu-inputButtons button.active {
        background-color: #abf6ffb0;
      }

      #uwu-climbingPanelButton {
        cursor: grab;
        background-color: #00000026;
        border-radius: 10px;
        border: 1px solid #ffffff1a;
        display: flex;
        align-items: center;
        justify-content: space-around;
      }

      #uwu-climbingPanelButton h2 {
        display: flex;
        margin-top: 2px;
        margin-bottom: 2px;
        justify-content: center;
        pointer-events: none;
      }

      #uwu-climbingPanel {
        font-size: 24px;
        border-collapse: collapse;
        width: 250px;
        height: 190px;;
        background-color: #ffffff1a;
        border: 2px solid black;
        table-layout: fixed;
      }
    
      #uwu-climbingPanel > tr > td {
        height: calc(100% / 6);
        width: calc(100% / 10);
        aspect-ratio: 1;
        padding: 0;
        border: 1px solid black;
        text-align: center;
        cursor: pointer;
        pointer-events: auto;
        position: relative;
      }

      @media (max-width: 500px) {
        #uwu-climbingPanel {
          font-size: 20px;
        }
      }
      
      @media (max-width: 400px) {
        #uwu-climbingPanel {
          font-size: 16px;
        }
      }

      #uwu-climbingPanelContainer h3 {
        margin-top: 5px;
        margin-bottom: 5px;
      }

      #uwu-functionButtonsContainer {
        height: 25px;
      }

      #uwu-climbingPanel > tr > td:focus {
        outline: 2px solid white;
      }

      #uwu-climbingPanel > tr > td:not(:empty) {
        background-color: #cccccc4d;
      }

      #uwu-transferCheckbox, #uwu-transferValuesCheckbox {
      pointer-events: auto;
      cursor: pointer;
      }

      #uwu-buttonRow1,
      #uwu-buttonRow2 {
        display: flex;
        flex-wrap: wrap;
      }

      #uwu-climbingPanel > tab-container, #uwu-climbingPanel > table-container {
        display: inline-block;
        margin-right: 10px;
      }
    
      #uwu-climbingPanelContainer button {
        background-color: #ffffff4d;
        border: 1px solid rgba(255, 255, 255, 0.1);
        padding: 2px 10px;
        border-radius: 10px;
        cursor: pointer;
        transition: background-color 0.3s ease;
        margin: 3px;
        margin-left: 0px;
      }

      #uwu-buttonRow1 > div > button.tab-button.active,
      #uwu-buttonRow2 > div > button.table-button.active {
        background-color: #abf6ffb0;
      }

      #button-clear-table {
        margin-top: 5px !important;
        width: 100%;
        border-radius: 5px !important;
      }
    `;
    document.head.appendChild(uwuClimbingPanel);

    const uwuClimbingPanelHorizontal = document.createElement("style");
    uwuClimbingPanelHorizontal.innerHTML =
      /* CSS */
      `
    #uwu-climbingMainPanel {
      width: 390px !important;
    }

    #uwu-climbingPanelContent {
      display: grid;
      grid-template-columns: 1fr 2fr;
      grid-template-rows: auto 1fr;
      height: calc(100% - 40px);
    }
    
    #uwu-buttonContainer {
      overflow-y: auto;
      grid-column: 1 / 2;
      grid-row: 1 / 3;
    }
    
    #uwu-functionButtonsContainer {
      grid-column: 2 / 3;
      grid-row: 1 / 2;
    }
    
    #uwu-tableContainer {
      grid-column: 2 / 3;
      grid-row: 2 / 3;
      overflow: auto;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
    }

    /* Стили для горизонтальной ориентации с кнопочным вводом */
    #uwu-climbingMainPanel.horizontal-keyboard {
      width: 420px !important;
    }

    #uwu-climbingPanelContent.horizontal-keyboard {
      display: grid;
      grid-template-columns: 1fr 2fr;
      grid-template-rows: auto 1fr;
      max-height: 250px;
    }

    #uwu-buttonContainer.horizontal-keyboard {
      grid-column: 1 / 2;
      grid-row: 1 / 3;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
    }

    #uwu-inputButtons.horizontal-keyboard {
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 10px;
    }

    #uwu-buttonRow2.horizontal-keyboard {
        margin-top: 10px;
    }

    #uwu-functionButtonsContainer.horizontal-keyboard {
      grid-column: 2 / 3;
      grid-row: 1 / 2;
      align-self: start;
    }

    #uwu-buttonRow1.horizontal-keyboard {
      grid-column: 2 / 3;
      grid-row: 1 / 2;
      margin-bottom: 10px;
    }

    #uwu-tableContainer.horizontal-keyboard {
      grid-column: 2 / 3;
      grid-row: 2 / 3;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      overflow: hidden;
    }
    `;

    if (settings.climbingPanelOrientation === "horizontal") {
      document.head.appendChild(uwuClimbingPanelHorizontal);
    }
  }
  // ====================================================================================================================
  //   . . . БЫСТРЫЕ СТИЛИ . . .
  // ====================================================================================================================
  const settingsContainer = document.getElementById(
    "extended-settings-container"
  );
  if (!settingsContainer) {
    console.error("Контейнер #extended-settings-container не найден");
    return;
  }

  const checkboxes = [
    {
      label: "Не показывать всплывающее окно 'О коте'",
      key: "hideCatTooltip",
      storageKey: "uwu_fastStyles",
      style: ".cat_tooltip { display: none !important; }",
      callback: function (checked) {
        if (checked) {
          const style = document.createElement("style");
          style.innerHTML = this.style;
          document.head.appendChild(style);
        } else {
          const styles = document.head.querySelectorAll("style");
          styles.forEach((style) => {
            if (style.innerHTML === this.style) {
              document.head.removeChild(style);
            }
          });
        }
      },
    },
    {
      label: "Скрыть Игровое поле",
      key: "hideGameField",
      storageKey: "uwu_fastStyles",
      style: "#cages_overflow { visibility: hidden !important; }",
      callback: function (checked) {
        if (checked) {
          const style = document.createElement("style");
          style.innerHTML = this.style;
          document.head.appendChild(style);
        } else {
          const styles = document.head.querySelectorAll("style");
          styles.forEach((style) => {
            if (style.innerHTML === this.style) {
              document.head.removeChild(style);
            }
          });
        }
      },
    },
    {
      label: "Скрыть фон Игрового Поля",
      key: "hideGameFieldBackground",
      storageKey: "uwu_fastStyles",
      style: "#cages_div { background-image: none !important; }",
      callback: function (checked) {
        if (checked) {
          const style = document.createElement("style");
          style.innerHTML = this.style;
          document.head.appendChild(style);
        } else {
          const styles = document.head.querySelectorAll("style");
          styles.forEach((style) => {
            if (style.innerHTML === this.style) {
              document.head.removeChild(style);
            }
          });
        }
      },
    },
    {
      label: "Скрыть Небо",
      key: "hideSky",
      storageKey: "uwu_fastStyles",
      style: "#tr_sky { display: none !important; }",
      callback: function (checked) {
        if (checked) {
          const style = document.createElement("style");
          style.innerHTML = this.style;
          document.head.appendChild(style);
        } else {
          const styles = document.head.querySelectorAll("style");
          styles.forEach((style) => {
            if (style.innerHTML === this.style) {
              document.head.removeChild(style);
            }
          });
        }
      },
    },
    {
      label: "Всегда день/ярко",
      key: "alwaysDay",
      storageKey: "uwu_settings",
      callback: function (checked) {
        updateAlwaysDayStyle(checked);
      },
    },
    {
      label: "Границы клеток",
      key: "cellsBorders",
      storageKey: "uwu_settings",
      callback: function (checked) {
        updateCellsBordersStyle(checked);
      },
    },
  ];

  const loadSettings = (storageKey) => {
    const savedSettings = uwuStorage.getItem(storageKey);
    return savedSettings ? savedSettings : {};
  };

  const saveSettings = (storageKey, settings) => {
    uwuStorage.setItem(storageKey, settings);
  };

  const settingsMap = {
    uwu_fastStyles: loadSettings("uwu_fastStyles"),
    uwu_settings: loadSettings("uwu_settings"),
  };

  const applyStyles = () => {
    checkboxes.forEach((checkbox) => {
      if (settingsMap[checkbox.storageKey][checkbox.key] === true) {
        checkbox.callback.call(checkbox, true);
      }
    });
  };

  if (settings.fastStyles) {
    const settingsDiv = document.createElement("div");
    settingsDiv.id = "fast-Styles-container";
    settingsDiv.classList.add("extended-settings-block");

    checkboxes.forEach((checkbox) => {
      const label = document.createElement("div");
      const input = document.createElement("input");
      input.type = "checkbox";
      input.name = checkbox.key;

      const storedValue = settingsMap[checkbox.storageKey][checkbox.key];
      if (storedValue === true) {
        input.checked = true;
        checkbox.callback.call(checkbox, true);
      }

      input.addEventListener("change", function () {
        settingsMap[checkbox.storageKey][checkbox.key] = this.checked;
        saveSettings(checkbox.storageKey, settingsMap[checkbox.storageKey]);
        checkbox.callback.call(checkbox, this.checked);
      });

      label.appendChild(input);
      label.appendChild(document.createTextNode(checkbox.label));
      settingsDiv.appendChild(label);
    });

    settingsContainer.appendChild(settingsDiv);

    const style = document.createElement("style");
    style.innerHTML = `
      .extended-settings-block {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
      }
      .extended-settings-block div {
        display: flex;
       align-items: center;
      }
    `;
    document.head.appendChild(style);
  } else {
    applyStyles();
  }
  // ====================================================================================================================
  //   . . . БЫСТРЫЕ ССЫЛКИ В ИГРОВОЙ . . .
  // ====================================================================================================================
  const quickLinks = {
    quickLink1: {
      href: "/settings",
      text: "Настройки",
    },
    quickLink2: {
      href: "/ls?id=0",
      text: "Памятка",
    },
    quickLink3: {
      href: "/blogs",
      text: "Блоги",
    },
    quickLink4: {
      href: "/sniff",
      text: "Лента",
    },
  };

  const spanElement = document.querySelector("span.small");

  Object.entries(quickLinks).forEach(([key, link]) => {
    if (settings[key]) {
      const newLink = document.createElement("a");
      newLink.href = link.href;
      newLink.textContent = link.text;

      const pipe = document.createTextNode(" | ");
      spanElement.appendChild(pipe);
      spanElement.appendChild(newLink);
    }
  });

  if (settings.userQuickLinks) {
    const userLinksArray = settings.userQuickLinks.split(", ");

    userLinksArray.forEach((userLink) => {
      const [href, text] = userLink.trim().split(" ");

      const newLink = document.createElement("a");
      newLink.href = href;
      newLink.textContent = text;

      const pipe = document.createTextNode(" | ");
      spanElement.appendChild(pipe);
      spanElement.appendChild(newLink);
    });
  }
  // ====================================================================================================================
  //  . . . ПОДСВЕТКА РЕСУРСОВ . . .
  // ====================================================================================================================
  if (settings.highlightResources) {
    function hexToRGBA(hex, alpha) {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    const ITEM_MAP = {
      Травы: [
        "13",
        "15",
        "17",
        "19",
        "21",
        "23",
        "25",
        "26",
        "106",
        "108",
        "109",
        "110",
        "111",
        "112",
        "115",
        "116",
        "119",
        "655",
        "2613",
        "2614",
      ],
      Мох: ["75", "78", "95"],
      Паутина: ["20"],
      Пыль: ["94", "385", "386", "387", "388", "389", "390", "391", "392"],
      "Ветки, вьюнки, костоправы": ["565", "566", "562", "563", "3993"],
      "Травящие предметы": [
        "985",
        "986",
        "987",
        "988",
        "989",
        "44",
        "180",
        "77",
        "7801",
        "7802",
        "7803",
        "7804",
        "7805",
        "7806",
      ],
      "Шаманские штучки": [
        "120",
        "121",
        "122",
        "123",
        "124",
        "125",
        "128",
        "129",
        "130",
        "131",
        "132",
      ],
    };

    function generateHighlightStyles(cageItem) {
      const savedSettings = uwuStorage.getItem("uwu_highlightResources");
      if (!savedSettings) return;

      const uwu_highlightResources = savedSettings;

      if (settings.highlightResourcesStyle === "background") {
        const styleElement =
          document.getElementById("resourcesStyle") ||
          document.createElement("style");
        styleElement.id = "resourcesStyle";
        styleElement.textContent = "";

        uwu_highlightResources.forEach((resource) => {
          if (resource.highlight) {
            const rgbaColor = hexToRGBA(resource.color, 0.4);
            let cssRules = "";

            const items = ITEM_MAP[resource.name];
            if (!items) {
              console.warn("Неизвестный ресурс:", resource.name);
              return;
            }

            items.forEach((itemName) => {
              cssRules += `
                .cage_items[style*='things/${itemName}.png'] {
                  background-color: ${rgbaColor} !important;
                }`;
            });

            if (cssRules) {
              styleElement.textContent += cssRules;
            }
          }
        });

        document.head.appendChild(styleElement);
      } else if (settings.highlightResourcesStyle === "glow") {
        const style = cageItem.getAttribute("style");
        if (!style) return;

        const oldHighlights = cageItem.querySelectorAll(
          "style.uwu_itemHighlight"
        );
        oldHighlights.forEach((oldHighlight) => oldHighlight.remove());

        cageItem.style.position = "relative";

        uwu_highlightResources.forEach((resource) => {
          if (resource.highlight) {
            const rgbaColor = hexToRGBA(resource.color, 1);
            let highlightedItems = [];

            const items = ITEM_MAP[resource.name];
            if (!items) {
              console.warn("Неизвестный ресурс:", resource.name);
              return;
            }

            items.forEach((itemName) => {
              const backgroundImages =
                style.match(
                  /url\("things\/(.*?)\.png"\) (\d+)% (\d+)% no-repeat/g
                ) || [];

              backgroundImages.forEach((backgroundImage) => {
                if (backgroundImage.includes(`things/${itemName}.png`)) {
                  const positionMatch = backgroundImage.match(
                    /(url\("things\/(.*?)\.png"\)) (\d+)% (\d+)% no-repeat/
                  );
                  const imageUrl = positionMatch ? positionMatch[1] : "";
                  const positionX = positionMatch ? positionMatch[3] : "0";
                  const positionY = positionMatch ? positionMatch[4] : "0";

                  highlightedItems.push(
                    `${imageUrl} ${positionX}% ${positionY}% no-repeat`
                  );
                }
              });
            });

            if (highlightedItems.length > 0) {
              const styleBody = `
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                background: ${highlightedItems.join(", ")};
                filter: drop-shadow(0 0 8px ${rgbaColor}) drop-shadow(0 0 8px ${rgbaColor});
              `;

              const styleElement = document.createElement("style");
              styleElement.classList.add("uwu_itemHighlight");
              styleElement.textContent = `
                .cage_items[style*='${style}']::before {
                  ${styleBody}
                }
              `;
              cageItem.appendChild(styleElement);
            }
          }
        });
      }
    }

    function setupMutationObserver(targetNode, callback, config) {
      const observer = new MutationObserver((mutationsList, observer) => {
        for (let mutation of mutationsList) {
          if (
            mutation.type === "attributes" &&
            mutation.attributeName === "style"
          ) {
            callback(targetNode);
          }
        }
      });

      observer.observe(targetNode, config);
    }

    document.querySelectorAll(".cage_items").forEach((cageItem) => {
      generateHighlightStyles(cageItem);
      setupMutationObserver(cageItem, generateHighlightStyles, {
        attributes: true,
        childList: true,
        subtree: true,
      });
    });
  }
  // ====================================================================================================================
  //   . . . ПОЛЬЗОВАТЕЛЬКИЙ ФОН . . .
  // ====================================================================================================================
  const cagesDiv = document.querySelector("#cages_div");

  function createBackgroundDiv() {
    const backgroundDiv = document.createElement("div");
    backgroundDiv.style.position = "fixed";
    backgroundDiv.style.top = "-1%";
    backgroundDiv.style.left = "-1%";
    backgroundDiv.style.width = "102%";
    backgroundDiv.style.height = "102%";
    backgroundDiv.style.zIndex = "-2";
    backgroundDiv.style.overflow = "hidden";
    return backgroundDiv;
  }

  function updateBackgroundImage(backgroundDiv, imageUrl) {
    if (imageUrl) {
      backgroundDiv.style.backgroundImage = `url(${imageUrl})`;
      backgroundDiv.style.backgroundSize = "cover";
      backgroundDiv.style.backgroundPosition = "center";
      backgroundDiv.style.backgroundRepeat = "no-repeat";
    } else {
      backgroundDiv.style.backgroundImage = "none";
    }
  }

  if (settings.backgroundRepeat) {
    const backgroundDiv = createBackgroundDiv();

    backgroundDiv.style.filter = "blur(16px)";
    backgroundDiv.style.backgroundBlendMode = "overlay";
    backgroundDiv.style.backgroundColor = "rgba(0, 0, 0, 0.5)";

    const backgroundImageStyle =
      window.getComputedStyle(cagesDiv).backgroundImage;
    const url = backgroundImageStyle.match(/url\("?(.+?)"?\)/);
    const backgroundImageUrl = url ? url[1] : null;

    updateBackgroundImage(backgroundDiv, backgroundImageUrl);
    globalContainerElement.appendChild(backgroundDiv);

    setupMutationObserver(
      "#cages_div",
      () => {
        const backgroundImageStyle =
          window.getComputedStyle(cagesDiv).backgroundImage;
        const url = backgroundImageStyle.match(/url\("?(.+?)"?\)/);
        const backgroundImageUrl = url ? url[1] : null;
        updateBackgroundImage(backgroundDiv, backgroundImageUrl);
      },
      { attributes: true, attributeFilter: ["style"] },
      8,
      500,
      10
    );
  }

  if (settings.backgroundUser) {
    const backgroundDiv = createBackgroundDiv();
    updateBackgroundImage(backgroundDiv, settings.backgroundUserImageURL);
    globalContainerElement.appendChild(backgroundDiv);
  }
  // ====================================================================================================================
  //   . . . ПОЛЬЗОВАТЕЛЬСКИЕ ЦВЕТА НАВЫКОВ И ПАРАМЕТРОВ . . .
  // ====================================================================================================================
  const defaultBackgroundImageUrl =
    "https://raw.githubusercontent.com/Ibirtem/CatWar/main/images/parametersBackgroundImageURL.png";

  function generateParameterStyles() {
    let cssStyles = "";

    const otherColors = settings.parametersColors.other || [
      "#cccccc",
      "#cccccc",
      "#cccccc",
      "#cccccc",
    ];
    const otherFirstCellBackground = `linear-gradient(to right, ${otherColors[0]}, ${otherColors[1]})`;
    const otherLastCellBackground = `linear-gradient(to right, ${otherColors[2]}, ${otherColors[3]})`;

    cssStyles += `#parameters_skills_block .bar-fill { background: ${otherFirstCellBackground}; }\n`;
    cssStyles += `#parameters_skills_block .bar { background: ${otherLastCellBackground}; }\n`;

    const backgroundImageURL = settings.parametersUserBackgroundImage
      ? settings.parametersUserBackgroundImageURL
      : defaultBackgroundImageUrl;
    const useBackgroundImage =
      settings.parametersBackgroundImage ||
      settings.parametersUserBackgroundImage;

    for (const paramId in settings.parametersColors) {
      if (paramId === "other") continue;

      const colors = settings.parametersColors[paramId] || [
        "#cccccc",
        "#cccccc",
        "#cccccc",
        "#cccccc",
      ];

      const firstCellBackground = useBackgroundImage
        ? `url(${backgroundImageURL}), linear-gradient(to right, ${colors[0]}, ${colors[1]})`
        : `linear-gradient(to right, ${colors[0]}, ${colors[1]})`;
      const lastCellBackground = useBackgroundImage
        ? `url(${backgroundImageURL}), linear-gradient(to right, ${colors[2]}, ${colors[3]})`
        : `linear-gradient(to right, ${colors[2]}, ${colors[3]})`;

      cssStyles += `#${paramId} .bar-fill { background: ${firstCellBackground} !important; }\n`;
      cssStyles += `#${paramId} .bar { background: ${lastCellBackground} !important; }\n`;
    }

    return cssStyles;
  }

  function applyParameterColors() {
    const existingStyleTag = document.getElementById("custom-parameter-styles");
    if (existingStyleTag) {
      existingStyleTag.remove();
    }

    const cssStyles = generateParameterStyles();

    const styleTag = document.createElement("style");
    styleTag.id = "custom-parameter-styles";
    styleTag.innerHTML = cssStyles;
    document.head.appendChild(styleTag);
  }

  if (settings.userParametersTheme) {
    applyParameterColors();
  }
  // ====================================================================================================================
  //   . . . ПОЛЬЗОВАТЕЛЬСКИЙ ШРИФТ . . .
  // ====================================================================================================================
  let fontSize = uwuStorage.getItem("uwu_fontSize");

  function applyFonts() {
    // Создаем элемент <link> для подключения шрифта
    const fontFamily = fontSize?.fontFamilyBody;
    if (fontFamily) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = `https://fonts.googleapis.com/css?family=${encodeURIComponent(
        fontFamily
      )}`;
      document.head.appendChild(link);
    }

    // Создаем элемент <style> для применения стилей
    const newFontStyle = document.createElement("style");
    newFontStyle.innerHTML = `
          body {
              font-size: ${fontSize?.fontSizeBody}px;
              font-family: ${
                fontFamily ? `'${fontFamily}', sans-serif` : "sans-serif"
              };
          }
  
          .small {
              font-size: ${fontSize?.fontSizeSmall}px;
          }
  
          #location {
              font-size: ${fontSize?.fontSizeLocation}px !important;
          }
  
          .vlm0 {
              font-size: ${fontSize?.vlm0}px;
          }
  
          .vlm1 {
              font-size: ${fontSize?.vlm1}px;
          }
  
          .vlm2 {
              font-size: ${fontSize?.vlm2}px;
          }
  
          .vlm3 {
              font-size: ${fontSize?.vlm3}px;
          }
  
          .vlm4 {
              font-size: ${fontSize?.vlm4}px;
          }
  
          .vlm5 {
              font-size: ${fontSize?.vlm5}px;
          }
  
          .vlm6 {
              font-size: ${fontSize?.vlm6}px;
          }
  
          .vlm7 {
              font-size: ${fontSize?.vlm7}px;
          }
  
          .vlm8 {
              font-size: ${fontSize?.vlm8}px;
          }
  
          .vlm9 {
              font-size: ${fontSize?.vlm9}px;
          }
  
          .vlm10 {
              font-size: ${fontSize?.vlm10}px;
          }
      `;
    document.head.appendChild(newFontStyle);
  }

  if (settings.useUserFonts) {
    applyFonts();
  }
  // ====================================================================================================================
  //   . . . РЕДИЗАЙН ИГРОВОЙ . . .
  // ====================================================================================================================
  if (settings.customLayout) {
    // ==================================================================
    function prependOtherCatsListContent() {
      const otherCatsList = document.querySelector(".other_cats_list");
      const smallContainer = document.querySelector(".small");

      if (!otherCatsList || !smallContainer) return;

      const catsListContent = otherCatsList.innerHTML;

      switch (settings.showOtherCatsList) {
        case "1":
          break;
        case "2":
          const clickableBlockHTML =
            '<span style="display: inline; cursor: pointer;"><a href="#" style="display: inline; pointer-events: none;">Душевые коты</a></span>';
          smallContainer.insertAdjacentHTML(
            "afterbegin",
            clickableBlockHTML + " || "
          );

          const clickableBlock = smallContainer.firstChild;

          const catsListContainer = document.createElement("span");
          catsListContainer.id = "catsListContainer";
          catsListContainer.innerHTML = ": " + catsListContent;
          catsListContainer.style.display = "none";
          smallContainer.insertBefore(
            catsListContainer,
            smallContainer.firstChild.nextSibling
          );

          clickableBlock.addEventListener("click", (event) => {
            event.preventDefault();
            if (catsListContainer.style.display === "none") {
              catsListContainer.style.display = "inline";
            } else {
              catsListContainer.style.display = "none";
            }
          });
          break;
        case "3":
          smallContainer.insertAdjacentHTML(
            "afterbegin",
            catsListContent + " || "
          );
          break;
        default:
          break;
      }
    }

    setupSingleCallback(".other_cats_list", prependOtherCatsListContent);
    // ==================================================================
    function applyLayoutSettings() {
      const savedSettings = uwuStorage.getItem("uwu_layoutSettings");
      if (savedSettings) {
        const { leftBlocks, rightBlocks } = savedSettings;

        const mainTable = document.getElementById("main_table");
        const tbody = mainTable.getElementsByTagName("tbody")[0];
        const blocks = Array.from(tbody.children);

        resetBlockStyles(tbody);

        const gridAreaTemplate = generateGridTemplate(leftBlocks, rightBlocks);

        // console.log(gridAreaTemplate);

        tbody.style.display = "grid";
        tbody.style.gridTemplateAreas = gridAreaTemplate;
        tbody.style.gridTemplateColumns = "1fr auto 1fr";
        tbody.style.gridTemplateRows = generateGridRowStyles(
          leftBlocks,
          rightBlocks
        );

        blocks.forEach((block) => {
          if (block.id) {
            block.style.gridArea = block.id;
          }
        });
      }
    }

    function generateGridRowStyles(leftBlocks, rightBlocks) {
      const numRows = Math.max(leftBlocks.length, rightBlocks.length);
      let rowStyles = [];

      for (let i = 0; i < numRows; i++) {
        let rowHeight = "auto";
        rowStyles.push(rowHeight);
      }

      const rowStylesString = rowStyles.join(" ");
      return rowStylesString;
    }

    function generateGridTemplate(leftBlocks, rightBlocks) {
      const numRows = Math.max(leftBlocks.length, rightBlocks.length);
      let template = "";
      let lastLeftBlockId = "";
      let lastRightBlockId = "";
      let isFirstRow = true;

      for (let i = 0; i < numRows; i++) {
        const leftBlockId = leftBlocks[i] || lastLeftBlockId;
        const rightBlockId = rightBlocks[i] || lastRightBlockId;

        if (isFirstRow) {
          template += `"${leftBlockId} tr_field ${rightBlockId}" `;
          isFirstRow = false;
        } else {
          template += `"${
            leftBlockId === lastLeftBlockId ? "." : leftBlockId
          } . ${rightBlockId === lastRightBlockId ? "." : rightBlockId}" `;
        }

        if (leftBlockId) {
          lastLeftBlockId = leftBlockId;
        }
        if (rightBlockId) {
          lastRightBlockId = rightBlockId;
        }
      }

      return template;
    }

    function resetBlockStyles(parent) {
      const blocks = parent.querySelectorAll("tr > *");
      blocks.forEach((block) => {
        block.style.gridArea = "";
      });
    }

    // Больше фикс стилей.
    const fixStyle = document.createElement("style");
    fixStyle.innerHTML =
      /* CSS */
      `
      #main_table {
        width: 100%;
        max-width: unset;
        height: 100%;

        background: none;
        border-spacing: 0px !important;
        margin-top: 0px !important;
      }

      #app > br {
        display: none;
      }

      #app {
        width: 100%;
        height: 100%;
        display: flex !important;
        flex-direction: column;
        gap: 5px;
      }
      
      #chat_msg, #cws_chat_msg {
        height: ${settings.chatHeight}px;
        width: auto;
      }

      #history_block > div { 
        visibility: hidden; 
      }

      #history_block {
        display: block;
        height: ${settings.historyHeight}px; 
        overflow-y: auto;
        resize: vertical;
      }

      #family { 
        display: block;
        overflow-y: auto;
        resize: vertical;
      }

      .infos {
        width: auto;
      }

      #cages_overflow {
        background: black;
      }

      .chat_text {
        width: auto !important;
        overflow-wrap: anywhere;
      }

      #chat_form {
        margin: unset;
        margin: 5px;
      }

      #volume {
        margin: 5px;
      }

      #app > p:last-of-type {
        position: fixed;
        bottom: 0px;
        margin: 8px;
      }

      h2 {
        margin-top: 5px;
        margin-bottom: 10px;
      }

      #itemList {
        overflow-y: auto;
        max-height: ${settings.itemListHeight || 180}px;
        display: flex;
        flex-wrap: wrap;
      }

      #location {
        visibility: visible;
        position: fixed;
        right: 0px;
        top: 0px;
        font-size: 1.5rem;
        background-color: ${theme?.blocksColor};
        z-index: 1;
      }

      .small {
        width: fit-content;
        position: relative;
        left: 0px;
        top: 0px;
        font-size: ${fontSize?.fontSizeSmall || 16}px;
        z-index: 1;
      }

      body {
        overflow-y: scroll;
      }

      #tr_chat, #tr_actions > td, #tr_mouth > td, #location, .small, #info_main > tbody > tr > td {
        padding: 5px !important;
      }

      #tr_chat > td {
        display: contents;
      }

      #chat_msg, #cws_chat_msg {
        height: ${theme?.chatHeight}px;
        resize: vertical;
      }

      #tr_field, #tr_info {
        height: 10px;
      }

      #newchat, #newls {
        background-color: transparent;
      }

      .other_cats_list {
        display: none;
      }

      #deys {
        width: auto !important;
      }
      
      #block_deys {
        flex-wrap: wrap;
        justify-content: space-between;
      }

      #deys_mit {
        width: min-content !important;
      }
      
      #mit { 
        width: auto !important;
      }
    `;
    document.head.appendChild(fixStyle);
    applyLayoutSettings();

    const paragraph = document.querySelector("#app > p > b");
    paragraph.textContent = "ТБ:";

    function applyLayoutSettingsForInfoMain() {
      const infoMainTable = document.getElementById("info_main");
      if (!infoMainTable) {
        return;
      }

      const tableRow = infoMainTable.querySelector("tr");
      if (!tableRow) {
        return;
      }

      const tds = tableRow.getElementsByTagName("td");
      if (tds.length < 3) {
        return;
      }

      for (const td of tds) {
        td.style.gridArea = "";
      }

      tableRow.style.display = "grid";
      // хахахах поглядите на смешного строчного
      tableRow.style.gridTemplateAreas = `"parameter"
                                          "history"
                                          "family"`;

      tds[0].style.gridArea = "family";
      tds[1].style.gridArea = "history";
      tds[2].style.gridArea = "parameter";
    }

    applyLayoutSettingsForInfoMain();
  }

  // ====================================================================================================================
  //   . . . ПОДСКАЗЫВАТЬ ОСТАВШЕЕСЯ ВРЕМЯ ДО НЮХА . . .
  // ====================================================================================================================
  if (settings.showHintWhenToSniff) {
    let smellTimerInterval = null;
    let visualTimerStartTime = null;
    let visualInitialTimerValue = 0;

    const sniffCheckpointKey = "uwu_sniffCheckpoint";
    const visualTimerStateKey = "uwu_sniffVisualTimerState";

    const smellCooldowns = {
      0: 3600,
      1: 3600,
      2: 3600,
      3: 3600,
      4: 1800,
      5: 1200,
      6: 900,
      7: 720,
      8: 600,
      9: 0,
    };

    function formatTime(seconds) {
      if (seconds <= 0) return "";
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const remainingSeconds = Math.ceil(seconds % 60);
      return `${hours ? `${hours} ч ` : ""}${
        minutes ? `${minutes} мин ` : ""
      }${remainingSeconds} с`;
    }

    function updateVisualTimerDisplay() {
      const timerElement = document.getElementById("uwu_sniff_timer");
      if (!timerElement || visualTimerStartTime === null) return;

      const currentTime = Date.now();
      const elapsedTime = (currentTime - visualTimerStartTime) / 1000;
      let remainingTime = visualInitialTimerValue - elapsedTime;

      if (remainingTime <= 0) {
        stopVisualTimer();
        timerElement.textContent = "";
      } else {
        timerElement.setAttribute("value", Math.ceil(remainingTime));
        timerElement.textContent = ` | Нюх через: ${formatTime(remainingTime)}`;
        saveVisualTimerState();
      }
    }

    function stopVisualTimer() {
      if (smellTimerInterval) {
        clearInterval(smellTimerInterval);
        smellTimerInterval = null;
      }
      visualTimerStartTime = null;
      visualInitialTimerValue = 0;
      uwuStorage.removeItem(visualTimerStateKey);
      uwuStorage.removeItem(sniffCheckpointKey);

      const timerElement = document.getElementById("uwu_sniff_timer");
      if (timerElement) {
        timerElement.setAttribute("value", "0");
        timerElement.textContent = "";
      }
    }

    function saveVisualTimerState() {
      if (visualTimerStartTime !== null && visualInitialTimerValue > 0) {
        const remainingTime =
          visualInitialTimerValue - (Date.now() - visualTimerStartTime) / 1000;
        if (remainingTime > 0) {
          const timerState = {
            startTime: visualTimerStartTime,
            initialValue: visualInitialTimerValue,
          };
          uwuStorage.setItem(visualTimerStateKey, timerState);
        } else {
          uwuStorage.removeItem(visualTimerStateKey);
        }
      } else {
        uwuStorage.removeItem(visualTimerStateKey);
      }
    }

    function tryRestoreTimerFromCheckpointOrState() {
      if (visualTimerStartTime !== null) {
        return;
      }

      const checkpointTimestampStr = uwuStorage.getItem(sniffCheckpointKey);
      if (checkpointTimestampStr) {
        const checkpointTimestamp = parseInt(checkpointTimestampStr, 10);
        if (!isNaN(checkpointTimestamp)) {
          const smellLevelElement = document.querySelector("#smell .level");
          if (smellLevelElement) {
            const smellLevel = parseInt(smellLevelElement.textContent, 10);
            if (smellCooldowns.hasOwnProperty(smellLevel)) {
              const totalCooldownSeconds = smellCooldowns[smellLevel];
              if (totalCooldownSeconds > 0) {
                const elapsedTimeSeconds =
                  (Date.now() - checkpointTimestamp) / 1000;
                const remainingTimeSeconds =
                  totalCooldownSeconds - elapsedTimeSeconds;

                if (remainingTimeSeconds > 0) {
                  visualInitialTimerValue = remainingTimeSeconds;
                  visualTimerStartTime = Date.now();
                  if (smellTimerInterval) clearInterval(smellTimerInterval);
                  updateVisualTimerDisplay();
                  smellTimerInterval = setInterval(
                    updateVisualTimerDisplay,
                    1000
                  );
                  saveVisualTimerState();
                  return;
                } else {
                  stopVisualTimer();
                  return;
                }
              } else {
                stopVisualTimer();
                return;
              }
            }
          }
        } else {
          uwuStorage.removeItem(sniffCheckpointKey);
        }
      }

      const savedVisualStateStr = uwuStorage.getItem(visualTimerStateKey);
      if (savedVisualStateStr) {
        try {
          const savedVisualState = savedVisualStateStr;
          const elapsedTimeSinceSave =
            (Date.now() - savedVisualState.startTime) / 1000;
          const remainingTimeFromSave =
            savedVisualState.initialValue - elapsedTimeSinceSave;

          if (remainingTimeFromSave > 0) {
            visualTimerStartTime = savedVisualState.startTime;
            visualInitialTimerValue = savedVisualState.initialValue;
            if (smellTimerInterval) clearInterval(smellTimerInterval);
            updateVisualTimerDisplay();
            smellTimerInterval = setInterval(updateVisualTimerDisplay, 1000);
            return;
          } else {
            uwuStorage.removeItem(visualTimerStateKey);
          }
        } catch (e) {
          console.error(
            "Ошибка разбора сохраненного состояния визуального таймера:",
            e
          );
          uwuStorage.removeItem(visualTimerStateKey);
        }
      }
    }

    function handleBlockMessChange() {
      const blockMess = document.getElementById("block_mess");
      if (blockMess && blockMess.textContent.includes("Принюхиваться")) {
        stopVisualTimer();
        uwuStorage.setItem(sniffCheckpointKey, Date.now().toString());
      }
    }

    function checkActionAvailability() {
      const trActions = document.getElementById("tr_actions");
      if (!trActions) return;
      const sniffActionLink = trActions.querySelector('a[data-id="13"]');

      if (sniffActionLink) {
        stopVisualTimer();
      } else {
        tryRestoreTimerFromCheckpointOrState();
      }
    }

    function handleErrorChange() {
      const errorElement = document.getElementById("error");
      if (!errorElement || !errorElement.textContent) return;

      const htmlContent = errorElement.innerHTML;
      const smellCooldownMatch = htmlContent.match(
        /Следующее обнюхивание будет доступно через (.*?)(\.|<br|$)/
      );
      const cooldownExpiredMatch = htmlContent.includes("Час уже прошёл");

      if (smellCooldownMatch) {
        const timeString = smellCooldownMatch[1];
        let totalSeconds = 0;
        const minutesMatch = timeString.match(/(\d+)\s*мин/);
        const secondsMatch = timeString.match(/(\d+)\s*с/);

        if (minutesMatch) totalSeconds += parseInt(minutesMatch[1], 10) * 60;
        if (secondsMatch) totalSeconds += parseInt(secondsMatch[1], 10);

        stopVisualTimer();

        if (totalSeconds > 0) {
          visualInitialTimerValue = totalSeconds;
          visualTimerStartTime = Date.now();

          if (smellTimerInterval) clearInterval(smellTimerInterval);
          updateVisualTimerDisplay();
          smellTimerInterval = setInterval(updateVisualTimerDisplay, 1000);
          saveVisualTimerState();
        }
      } else if (cooldownExpiredMatch) {
        stopVisualTimer();
      }
    }

    function createTimerElement() {
      const smallElement = document.querySelector(".small");
      if (smallElement && !document.getElementById("uwu_sniff_timer")) {
        smallElement.insertAdjacentHTML(
          "beforeend",
          '<span id="uwu_sniff_timer" value="0"></span>'
        );
      }
    }

    setupSingleCallback(".small", createTimerElement);

    setupMutationObserver(
      "#tr_actions",
      checkActionAvailability,
      {
        childList: true,
        subtree: true,
      },
      8,
      500
    );

    setupMutationObserver(
      "#block_mess",
      handleBlockMessChange,
      {
        childList: true,
        subtree: true,
        characterData: true,
      },
      8,
      500
    );

    setupMutationObserver(
      "#error",
      handleErrorChange,
      {
        childList: true,
        subtree: true,
        characterData: true,
      },
      8,
      500
    );
  }
  // ====================================================================================================================
  //   . . . ДУБЛИРОВАНИЕ ДЕЙСТВИЙ НА ВКЛАДКУ БРАУЗЕРА . . .
  // ====================================================================================================================
  if (settings.duplicateTimeInBrowserTab) {
    const titleElement = document.querySelector("title");
    let blockMess = null;

    function updateTitle() {
      if (!blockMess) {
        blockMess = document.getElementById("block_mess");
        if (!blockMess) {
          titleElement.textContent = "Игровая / CatWar";
          return;
        }
      }

      const messageText = blockMess.textContent.trim();

      const catNameMatch = messageText.match(/^(.+?)\s+держит/);
      const catName = catNameMatch ? catNameMatch[1] : "";

      if (catName) {
        titleElement.textContent = `Поднят. Во рту | ${catName}`;
      } else {
        const timeActionMatch = messageText.match(
          /^(.+?)\s+(\d+\s*(?:ч\s*)?\d+\s*мин\s*\d+\s*с|\d+\s*мин\s*\d+\s*с|\d+\s*с)\.\s*(Отменить)?$/
        );

        if (timeActionMatch) {
          const actionText = timeActionMatch[1].trim();
          const currentTime = timeActionMatch[2].trim();

          titleElement.textContent = `${currentTime} | ${actionText}`;
        } else {
          titleElement.textContent = "Игровая / CatWar";
        }
      }
    }

    setupMutationObserver("#tr_actions", updateTitle, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  }
  // ====================================================================================================================
  //   . . . ЛОГ ЧИСТИЛЬЩИКОВ . . .
  // ====================================================================================================================function cleaningLogUpdate(mutationsList) {
  if (settings.cleaningLog) {
    let logStates = uwuStorage.getItem("uwu_logStates") || {
      cleaning: false,
      catching: false,
    };

    let lastDroppedCatInfo = null;

    function saveLogStates() {
      uwuStorage.setItem("uwu_logStates", logStates);
    }

    const relevantActions = [
      { regex: /Потёрлись носом о нос с/, type: "check" },
      { regex: /Потёрлись щекой о щёку/, type: "check" },
      { regex: /Помурлыкал(а)? вместе с/, type: "check" },
      { regex: /Обнюхал(а)? /, type: "check" },
      { regex: /Поднял(а)? /, type: "pickup" },
      { regex: /Опустил(а)? на землю /, type: "putdown" },
    ];

    let cleaningLogBuffer = "";
    let catNamesAndIds = [];

    function cleaningLogUpdate() {
      const historyBlock = document.querySelector("#history");
      const ist = historyBlock.querySelector("#ist");
      const locationSpan = historyBlock.querySelector("#location");
      const currentLocation = locationSpan.textContent.trim();

      if (currentLocation === "[ Загружается… ]") {
        return;
      }

      let cleaningLogBlock = historyBlock.querySelector("#uwu-cleaningLog");
      if (!cleaningLogBlock) {
        createCleaningLogBlock(historyBlock);
        cleaningLogBlock = historyBlock.querySelector("#uwu-cleaningLog");
      }

      const istOuterHtml = ist.outerHTML;
      const actions = istOuterHtml
        .split(".")
        .map((action) => action.trim())
        .filter((action) => action);
      const lastAction = actions[actions.length - 2];

      const cleaningLogContent = cleaningLogBlock.querySelector(
        "#uwu-cleaningLog-content"
      );

      if (lastAction) {
        if (settings.cleaningLogStyle === "smart") {
          processSmartAction(lastAction, currentLocation, cleaningLogContent);
        } else {
          processStandardAction(
            lastAction,
            currentLocation,
            cleaningLogContent
          );
        }

        let storageKey;
        switch (settings.cleaningLogStyle) {
          case "smart":
            storageKey = "uwu_cleaningLogSmart";
            break;
          default:
            storageKey = "uwu_cleaningLogStandard";
            break;
        }

        uwuStorage.setItem(storageKey, {
          log: cleaningLogBuffer,
          catNamesAndIds,
          counters: {
            pickup: parseInt(
              document.getElementById("uwu-cleaningLog-counter-pickup")
                .textContent
            ),
            putdown: parseInt(
              document.getElementById("uwu-cleaningLog-counter-putdown")
                .textContent
            ),
          },
        });
        cleaningLogContent.innerHTML = addCatLinksToLog(
          cleaningLogBuffer,
          catNamesAndIds
        );
      }
    }

    function createCleaningLogBlock(historyBlock) {
      const cleaningLogTemplate =
        /* HTML */
        `
          <div id="uwu-cleaningLog">
            <h2>
              <a href="#" id="uwu-cleaningLog-toggle" class="toggle"
                >Лог чистильщика</a
              >
            </h2>
            <div id="uwu-cleaningLog-content-wrapper">
              <div id="uwu-cleaningLog-content"></div>
              <div id="uwu-cleaningLog-counters">
                <span
                  >Успешно поднятых:
                  <span id="uwu-cleaningLog-counter-pickup">0</span></span
                >
                <span
                  >Опущенных:
                  <span id="uwu-cleaningLog-counter-putdown">0</span></span
                >
              </div>
              <div id="uwu-cleaningLog-actions">
                <a href="#" id="uwu-cleaningLog-clear">Очистить лог</a>
                <a
                  href="#"
                  id="uwu-cleaningLog-delete-last"
                  class="disabled"
                  title="Удалить последнего опущенного персонажа"
                >
                  <img
                    src="https://raw.githubusercontent.com/Ibirtem/CatWar/main/images/wastebasket.png"
                    alt="Удалить"
                    style="width: 18px; height: 18px; vertical-align: middle;"
                  />
                </a>
              </div>
            </div>
          </div>
        `;

      historyBlock.insertAdjacentHTML("beforeend", cleaningLogTemplate);

      const hr = document.createElement("hr");
      historyBlock.insertBefore(
        hr,
        historyBlock.querySelector("#uwu-cleaningLog")
      );

      const cleaningLogContent = historyBlock.querySelector(
        "#uwu-cleaningLog-content"
      );

      const savedLog = uwuStorage.getItem("uwu_cleaningLogSmart");

      if (savedLog) {
        const savedData = savedLog;
        cleaningLogBuffer = savedData.log;
        catNamesAndIds = savedData.catNamesAndIds;
        if (savedData.counters) {
          document.getElementById(
            "uwu-cleaningLog-counter-pickup"
          ).textContent = savedData.counters.pickup;
          document.getElementById(
            "uwu-cleaningLog-counter-putdown"
          ).textContent = savedData.counters.putdown;
        }
        cleaningLogContent.innerHTML = addCatLinksToLog(
          cleaningLogBuffer,
          catNamesAndIds
        );
      }

      const clearButton = historyBlock.querySelector("#uwu-cleaningLog-clear");
      clearButton.addEventListener("click", (e) => {
        e.preventDefault();
        if (confirm("Вы уверены, что хотите очистить лог чистильщика?")) {
          cleaningLogBuffer = "";
          catNamesAndIds = [];
          document.getElementById(
            "uwu-cleaningLog-counter-pickup"
          ).textContent = "0";
          document.getElementById(
            "uwu-cleaningLog-counter-putdown"
          ).textContent = "0";
          cleaningLogContent.innerHTML = "";
          uwuStorage.removeItem("uwu_cleaningLogSmart");

          lastDroppedCatInfo = null;
          document
            .getElementById("uwu-cleaningLog-delete-last")
            ?.classList.add("disabled");
        }
      });

      const deleteLastButton = historyBlock.querySelector(
        "#uwu-cleaningLog-delete-last"
      );
      deleteLastButton.addEventListener("click", (e) => {
        e.preventDefault();
        if (!deleteLastButton.classList.contains("disabled")) {
          deleteLastDroppedEntry();
        }
      });

      const toggleButton = historyBlock.querySelector(
        "#uwu-cleaningLog-toggle"
      );
      const contentWrapper = historyBlock.querySelector(
        "#uwu-cleaningLog-content-wrapper"
      );

      if (logStates.cleaning) {
        contentWrapper.style.display = "none";
      }

      toggleButton.addEventListener("click", (e) => {
        e.preventDefault();
        logStates.cleaning = !logStates.cleaning;
        contentWrapper.style.display = logStates.cleaning ? "none" : "block";
        saveLogStates();
      });
    }

    function addCatLinksToLog(log, catNamesAndIds) {
      let logWithLinks = log;
      const nameToIdMap = new Map(
        catNamesAndIds.map((cat) => [cat.name, cat.id])
      );

      logWithLinks = logWithLinks.replace(/\[([^\]]+)\]/g, (match, content) => {
        const names = content.split(", ");
        const linkedNames = names.map((nameWithId) => {
          const name = nameWithId.split(" ")[0];
          const id = nameToIdMap.get(name);
          if (id) {
            return nameWithId.replace(
              name,
              `<a href="/cat${id}" target="_blank">${name}</a>`
            );
          }
          return nameWithId;
        });
        return `[${linkedNames.join(", ")}]`;
      });
      return logWithLinks;
    }

    function extractCatId(action) {
      const match = action.match(/<a href="\/cat(\d+)">/);
      return match ? match[1] : null;
    }

    function checkCatStatus(catId) {
      const catTooltip = document
        .querySelector(`#cages > tbody .cat_tooltip a[href="/cat${catId}"]`)
        .closest(".cat_tooltip");
      if (catTooltip) {
        const statusSpan = catTooltip.querySelector(".online");
        if (statusSpan) {
          const statusText = statusSpan.textContent
            .replace(/[\[\]]/g, "")
            .trim();
          const validStatuses = [
            "Спит",
            "На удалении",
            "Заблокирована",
            "Заблокирован",
          ];
          return validStatuses.includes(statusText);
        }
      }
      return false;
    }

    function processStandardAction(action, location, cleaningLogContent) {
      for (const relevantAction of relevantActions) {
        if (relevantAction.regex.test(action)) {
          const catNameMatch = action.match(/<a href="\/cat\d+">([^<]+)<\/a>/);
          if (!catNameMatch) {
            console.error("Не удалось извлечь имя кота из действия:", action);
            return;
          }
          const catName = catNameMatch[1];
          const catId = extractCatId(action);
          const actionText = action.replace(
            /<a href="\/cat\d+">([^<]+)<\/a>/,
            `[${catName}${settings.cleaningLogShowID ? ` ${catId}` : ""}]`
          );
          if (relevantAction.type === "action") {
            cleaningLogBuffer += `${actionText} на локации "${location}". `;
          } else {
            const status = checkCatStatus(catId) ? "" : "Кот не спит. ";
            cleaningLogBuffer += `Проверен [${catName}${
              settings.cleaningLogShowID ? ` ${catId}` : ""
            }] на локации "${location}". ${status}`;
          }
          if (!catNamesAndIds.some((cat) => cat.id === catId)) {
            catNamesAndIds.push({ name: catName, id: catId });
          }
          cleaningLogContent.innerHTML = addCatLinksToLog(
            cleaningLogBuffer,
            catNamesAndIds
          );
          return;
        }
      }
    }

    function processSmartAction(action, location, cleaningLogContent) {
      let matched = false;

      for (const relevantAction of relevantActions) {
        if (relevantAction.regex.test(action)) {
          matched = true;
          const catNameMatch = action.match(/<a href="\/cat\d+">([^<]+)<\/a>/);
          if (!catNameMatch) {
            console.error("Не удалось извлечь имя кота из действия:", action);
            return;
          }
          const catName = catNameMatch[1];
          const catId = extractCatId(action);
          const logLines = cleaningLogBuffer
            .split(".")
            .map((line) => line.trim())
            .filter((line) => line);

          switch (relevantAction.type) {
            case "check":
              processCheckAction(logLines, catName, catId, location);
              break;

            case "putdown":
              processPutdownAction(logLines, catName, catId, location);
              break;

            case "pickup":
              processPickupAction(logLines, catName, catId, location);
              break;
          }

          cleaningLogBuffer =
            logLines.join(". ") + (logLines.length > 0 ? "." : "");
          if (!catNamesAndIds.some((cat) => cat.id === catId)) {
            catNamesAndIds.push({ name: catName, id: catId });
          }
          cleaningLogContent.innerHTML = addCatLinksToLog(
            cleaningLogBuffer,
            catNamesAndIds
          );
          return;
        }
      }

      if (!matched) {
        const logLines = cleaningLogBuffer
          .split(".")
          .map((line) => line.trim())
          .filter((line) => line);
        processUnmatchedAction(logLines, cleaningLogContent, action);
        cleaningLogBuffer =
          logLines.join(". ") + (logLines.length > 0 ? "." : "");
        cleaningLogContent.innerHTML = addCatLinksToLog(
          cleaningLogBuffer,
          catNamesAndIds
        );
      }

      return null;
    }

    function deleteLastDroppedEntry() {
      if (!lastDroppedCatInfo) return;

      const { catName, catId } = lastDroppedCatInfo;
      const catIdentifier = `${catName}${
        settings.cleaningLogShowID ? ` ${catId}` : ""
      }`;

      let logLines = cleaningLogBuffer
        .split(".")
        .map((line) => line.trim())
        .filter(Boolean);

      let putdownRemoved = false;
      let pickupRemoved = false;

      for (let i = logLines.length - 1; i >= 0; i--) {
        let line = logLines[i];
        if (line.startsWith("Опущен") && line.includes(catIdentifier)) {
          const match = line.match(/\[([^\]]+)\]/);
          if (match) {
            let catsInGroup = match[1].split(",").map((c) => c.trim());
            if (catsInGroup.length > 1) {
              catsInGroup = catsInGroup.filter((c) => c !== catIdentifier);
              logLines[i] = line.replace(
                /\[([^\]]+)\]/,
                `[${catsInGroup.join(", ")}]`
              );
            } else {
              logLines.splice(i, 1);
            }
            putdownRemoved = true;
            break;
          }
        }
      }

      if (putdownRemoved) {
        for (let i = logLines.length - 1; i >= 0; i--) {
          let line = logLines[i];
          if (
            line.startsWith("Проверен и поднят") &&
            line.includes(catIdentifier)
          ) {
            const match = line.match(/\[([^\]]+)\]/);
            if (match) {
              let catsInGroup = match[1].split(",").map((c) => c.trim());
              if (catsInGroup.length > 1) {
                catsInGroup = catsInGroup.filter((c) => c !== catIdentifier);
                logLines[i] = line.replace(
                  /\[([^\]]+)\]/,
                  `[${catsInGroup.join(", ")}]`
                );
              } else {
                logLines.splice(i, 1);
              }
              pickupRemoved = true;
              break;
            }
          }
        }
      }

      if (putdownRemoved && pickupRemoved) {
        cleaningLogBuffer =
          logLines.join(". ") + (logLines.length > 0 ? "." : "");

        const pickupCounter = document.getElementById(
          "uwu-cleaningLog-counter-pickup"
        );
        const putdownCounter = document.getElementById(
          "uwu-cleaningLog-counter-putdown"
        );
        pickupCounter.textContent = parseInt(pickupCounter.textContent) - 1;
        putdownCounter.textContent = parseInt(putdownCounter.textContent) - 1;

        const cleaningLogContent = document.getElementById(
          "uwu-cleaningLog-content"
        );
        cleaningLogContent.innerHTML = addCatLinksToLog(
          cleaningLogBuffer,
          catNamesAndIds
        );

        uwuStorage.setItem("uwu_cleaningLogSmart", {
          log: cleaningLogBuffer,
          catNamesAndIds,
          counters: {
            pickup: parseInt(pickupCounter.textContent),
            putdown: parseInt(putdownCounter.textContent),
          },
        });
      } else {
        console.warn("UwU | Не удалось найти парные записи для удаления.");
      }

      lastDroppedCatInfo = null;
      document
        .getElementById("uwu-cleaningLog-delete-last")
        ?.classList.add("disabled");
    }

    function processCheckAction(logLines, catName, catId, location) {
      const lastLogIndex = logLines.length - 1;
      const isCatSleeping = checkCatStatus(catId);

      if (
        lastLogIndex >= 0 &&
        (logLines[lastLogIndex].includes("Проверен [") ||
          logLines[lastLogIndex].includes("Кот не спит") ||
          logLines[lastLogIndex].includes("Вы забыли проверить кота"))
      ) {
        logLines.splice(lastLogIndex, 1);
      }

      if (isCatSleeping) {
        logLines.push(
          `Проверен [${catName}${
            settings.cleaningLogShowID ? ` ${catId}` : ""
          }] на локации "${location}"`
        );
      } else {
        logLines.push(
          `Кот не спит [${catName}${
            settings.cleaningLogShowID ? ` ${catId}` : ""
          }]`
        );
      }
      if (!catNamesAndIds.some((cat) => cat.id === catId)) {
        catNamesAndIds.push({ name: catName, id: catId });
      }
      lastDroppedCatInfo = null;
      document
        .getElementById("uwu-cleaningLog-delete-last")
        ?.classList.add("disabled");
    }

    function processPutdownAction(logLines, catName, catId, location) {
      const catPattern = new RegExp(
        `\\[${catName}${settings.cleaningLogShowID ? ` ${catId}` : ""}\\]`
      );

      // 1. Ищем последнее и предпоследнее предложения.
      const lastSentenceIndex = logLines.length - 1;
      const penultimateSentenceIndex = lastSentenceIndex - 1;

      // 2. Проверяем последнее предложение на наличие "Опущен" без текущего имени кота.
      const lastSentence = logLines[lastSentenceIndex];

      if (
        lastSentence.includes(`на локации "${location}"`) &&
        lastSentence.includes("Опущен")
      ) {
        const catNamesMatch = lastSentence.match(/\[([^\]]+)\]/);
        if (catNamesMatch) {
          const catNames = catNamesMatch[1]
            .split(",")
            .map((name) => name.trim());
          const currentCatNameWithId = `${catName}${
            settings.cleaningLogShowID ? ` ${catId}` : ""
          }`;
          if (catNames.includes(currentCatNameWithId)) {
            return;
          }
        }
      }

      // 3. Если есть, добавляем имя текущего кота к этому предложению.
      if (
        lastSentence.includes(`на локации "${location}"`) &&
        lastSentence.includes("Опущен") &&
        !catPattern.test(lastSentence)
      ) {
        logLines[lastSentenceIndex] = lastSentence.replace(
          /]/,
          `, ${catName}${settings.cleaningLogShowID ? ` ${catId}` : ""}]`
        );
      } else {
        // 4. Если нет, добавляем новое предложение с "Опущен".
        logLines.push(
          `Опущен [${catName}${
            settings.cleaningLogShowID ? ` ${catId}` : ""
          }] на локации "${location}"`
        );
      }
      if (!catNamesAndIds.some((cat) => cat.id === catId)) {
        catNamesAndIds.push({ name: catName, id: catId });
      }

      const putdownCounter = document.getElementById(
        "uwu-cleaningLog-counter-putdown"
      );
      putdownCounter.textContent = parseInt(putdownCounter.textContent) + 1;
      lastDroppedCatInfo = { catName, catId };
      document
        .getElementById("uwu-cleaningLog-delete-last")
        ?.classList.remove("disabled");
    }

    function processPickupAction(logLines, catName, catId, location) {
      const catPattern = new RegExp(
        `\\[${catName}${settings.cleaningLogShowID ? ` ${catId}` : ""}\\]`
      );

      // 1. Ищем последнее и предпоследнее предложения.
      const lastSentenceIndex = logLines.length - 1;
      const penultimateSentenceIndex = lastSentenceIndex - 1;

      // 2. Проверяем последнее предложение на "Проверен и поднят" с именем кота.
      const lastSentence = logLines[lastSentenceIndex];
      if (
        lastSentence.includes(`на локации "${location}"`) &&
        lastSentence.includes("Проверен и поднят") &&
        catPattern.test(lastSentence)
      ) {
        return;
      }

      // 3. Проверяем последнее предложение на "Проверен" с именем кота.
      let lastSentenceChecked = false;
      if (
        logLines[lastSentenceIndex].includes("Проверен") &&
        logLines[lastSentenceIndex].includes(
          `[${catName}${settings.cleaningLogShowID ? ` ${catId}` : ""}]`
        ) &&
        logLines[lastSentenceIndex].includes(`на локации "${location}"`)
      ) {
        lastSentenceChecked = true;
      }

      // 4. Если последнее предложение - "Проверен", проверяем предпоследнее на "Проверен и поднят".
      if (lastSentenceChecked) {
        if (
          penultimateSentenceIndex >= 0 &&
          logLines[penultimateSentenceIndex].includes("Проверен и поднят") &&
          logLines[penultimateSentenceIndex].includes(
            `на локации "${location}"`
          ) &&
          !logLines[penultimateSentenceIndex].includes(
            `[${catName}${settings.cleaningLogShowID ? ` ${catId}` : ""}]`
          )
        ) {
          const currentCatMatch =
            logLines[lastSentenceIndex].match(/\[(.*?)\]/);
          if (currentCatMatch) {
            // Добавляем имя текущего кота к предпоследнему предложению.
            const existingCatsMatch =
              logLines[penultimateSentenceIndex].match(/\[(.*?)\]/);
            if (existingCatsMatch) {
              const existingCats = existingCatsMatch[1];
              const newCatString = existingCats.trim()
                ? `${existingCats}, ${catName}${
                    settings.cleaningLogShowID ? ` ${catId}` : ""
                  }`
                : `${catName}${settings.cleaningLogShowID ? ` ${catId}` : ""}`;
              logLines[penultimateSentenceIndex] = logLines[
                penultimateSentenceIndex
              ].replace(/\[(.*?)\]/, `[${newCatString}]`);
            }

            // Удаляем последнее предложение.
            logLines.splice(lastSentenceIndex, 1);
          }
        } else {
          // 5. Создаем новое предложение "Проверен и поднят".
          logLines[lastSentenceIndex] = logLines[lastSentenceIndex].replace(
            "Проверен",
            "Проверен и поднят"
          );
        }
      } else {
        // 6. Если "Проверен" с именем кота нет.
        if (logLines[lastSentenceIndex].includes("Кот не спит")) {
          logLines[lastSentenceIndex] = "Вы забыли проверить кота";
        } else if (
          !logLines[lastSentenceIndex].includes("Вы забыли проверить кота")
        ) {
          logLines.push("Вы забыли проверить кота");
        }
      }
      if (!catNamesAndIds.some((cat) => cat.id === catId)) {
        catNamesAndIds.push({ name: catName, id: catId });
      }

      const pickupCounter = document.getElementById(
        "uwu-cleaningLog-counter-pickup"
      );
      pickupCounter.textContent = parseInt(pickupCounter.textContent) + 1;
      lastDroppedCatInfo = null;
      document
        .getElementById("uwu-cleaningLog-delete-last")
        ?.classList.add("disabled");
    }

    function processUnmatchedAction(logLines, cleaningLogContent, action) {
      const lastLogIndex = logLines.length - 1;

      const isCancelAction = /Отменил(а)? /.test(action);

      if (
        lastLogIndex >= 0 &&
        logLines[lastLogIndex].includes("Проверен [") &&
        !isCancelAction
      ) {
        logLines.splice(lastLogIndex, 1);
        cleaningLogBuffer =
          logLines.join(". ") + (logLines.length > 0 ? "." : "");
        cleaningLogContent.innerHTML = addCatLinksToLog(
          cleaningLogBuffer,
          catNamesAndIds
        );
      }
      lastDroppedCatInfo = null;
      document
        .getElementById("uwu-cleaningLog-delete-last")
        ?.classList.add("disabled");
    }

    setupMutationObserver("#history_block", cleaningLogUpdate, {
      childList: true,
      subtree: true,
    });

    const cleaningLogStyle = document.createElement("style");
    cleaningLogStyle.innerHTML = `
          #uwu-cleaningLog-content {
            height: ${settings.cleaningLogHeight || 120}px;
            overflow-y: auto;
            resize: vertical;
          }
          #uwu-cleaningLog-actions {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 5px;
          }
          #uwu-cleaningLog-delete-last.disabled {
            pointer-events: none;
            opacity: 0.5;
            cursor: not-allowed;
          }
          `;
    document.head.appendChild(cleaningLogStyle);
  }
  // ====================================================================================================================
  //   . . . ЛОГ ЛОВЛИ . . .
  // ====================================================================================================================
  if (settings.catchingLog) {
    let logStates = uwuStorage.getItem("uwu_logStates") || {
      cleaning: false,
      catching: false,
    };
    function saveLogStates() {
      uwuStorage.setItem("uwu_logStates", logStates);
    }

    let isWaitingForItem = false;
    let mouthSnapshot = new Set();

    const stopWordsRegex = /Отменил|Отменила|Пошла|Пошёл|Поднял|Подняла/;

    let catchingState = {
      isWaiting: false, // Находимся ли мы в процессе ожидания результата?
      actionType: null, // Тип действия (diving, crevice)
      actionVerb: null, // Глагол действия (Нырнул, Осмотрела)
      foundItem: null, // Информация о найденном, но не подтвержденном предмете
      historyGaveClear: false, // Дала ли история "зеленый свет"?
      attemptCounted: false, // Гарант, что попытка засчитана только один раз
      lastLoggedItemInCycle: null,
      catchLoggedThisCycle: false,
    };

    function resetCatchingState() {
      catchingState.isWaiting = false;
      catchingState.actionType = null;
      catchingState.actionVerb = null;
      catchingState.foundItem = null;
      catchingState.historyGaveClear = false;
      catchingState.attemptCounted = false;
      catchingState.lastLoggedItemInCycle = null;
      catchingState.catchLoggedThisCycle = false;
      isWaitingForItem = false;
    }

    function logFoundItem(itemId) {
      const logData = uwuStorage.getItem("uwu_catchingLogData") || [];
      const lastSession =
        logData.length > 0 ? logData[logData.length - 1] : null;

      if (lastSession && lastSession.type === catchingState.actionType) {
        const catchTime = new Date().toLocaleTimeString("ru-RU", {
          hour: "2-digit",
          minute: "2-digit",
        });
        const newCatch = {
          itemId: itemId,
          time: catchTime,
        };
        lastSession.summary.unshift(newCatch);
        uwuStorage.setItem("uwu_catchingLogData", logData);
        renderCatchingLog(logData);
        return newCatch;
      }
      return null;
    }

    function undoLastCatch() {
      if (!catchingState.lastLoggedItemInCycle) return;

      const { itemId, time } = catchingState.lastLoggedItemInCycle;
      const logData = uwuStorage.getItem("uwu_catchingLogData") || [];
      const lastSession =
        logData.length > 0 ? logData[logData.length - 1] : null;

      if (lastSession && lastSession.type === catchingState.actionType) {
        const indexToRemove = lastSession.summary.findIndex(
          (c) => c.itemId === itemId && c.time === time
        );

        if (indexToRemove > -1) {
          lastSession.summary.splice(indexToRemove, 1);
          uwuStorage.setItem("uwu_catchingLogData", logData);
          renderCatchingLog(logData);
        }
      }
    }

    const activityTypes = {
      diving: {
        triggers: ["Нырнул.", "Нырнула."],
        type: "diving",
        title: "Ныряние",
        verb: { male: "Выловил", female: "Выловила" },
        style: {
          backgroundColor: "rgba(173, 216, 230, 0.1)",
          border: "1px solid rgba(173, 216, 230, 0.4)",
        },
      },
      crevice: {
        triggers: ["Осмотрел расщелину.", "Осмотрела расщелину."],
        type: "crevice",
        title: "Осмотр",
        verb: { male: "Нашёл", female: "Нашла" },
        style: {
          backgroundColor: "rgba(144, 238, 144, 0.1)",
          border: "1px solid rgba(144, 238, 144, 0.4)",
        },
      },
      hollow: {
        triggers: ["Осмотрел дупло.", "Осмотрела дупло."],
        type: "hollow",
        title: "Осмотр",
        verb: { male: "Нашёл", female: "Нашла" },
        style: {
          backgroundColor: "rgba(144, 238, 144, 0.1)",
          border: "1px solid rgba(144, 238, 144, 0.4)",
        },
      },
    };

    const itemNamesById = {
      20: "Паутина",
      21: "Целебная водоросль",
      75: "Мох",
      76: "Водный мох",
      110: "Мед",
      417: "Камень 2х местный",
      418: "Камень 3х местный",
      565: "Крепкая ветка",
      566: "Вьюнок",
      1034: "Маленький камушек",
      2072: "Гнездо",
      2073: "Гнездо",
      2074: "Яйцо",
      2075: "Черное перо",
      2076: "Коричневое перо",
      2077: "Голубое перо",
      3956: "Рак",
      3958: "Рак",
      3960: "Рак",
      3962: "Краснобрюхая жерлянка",
      3965: "Карась",
      3966: "Рыба",
      3967: "Рыба",
      3968: "Рыба",
      3969: "Рыба",
      3970: "Рыба",
      3971: "Речной угорь",
      3973: "Речной угорь",
      3993: "Плотная водоросль",
      3994: "Ракушка (+20)",
      3995: "Ракушка (+30)",
      3997: "Ракушка (сон)",
      3998: "Ракушка (+15)",
      3999: "Ракушка (+28)",
      4001: "Коралл",
      4002: "Коралл",
      4004: "Водоросоль",
      4005: "Водоросоль",
      4006: "Водоросоль",
      4008: "Комок",
      4009: "Комок",
      8021: "Тонколапый паук",
      8022: "Светлый паук",
      8023: "Бурый паук",
      8024: "Тёмный паук",
      8042: "Мышь",
      8043: "Упитанная мышь",
    };

    let customItemNames = null;

    function getItemNameById(itemId) {
      if (customItemNames === null) {
        customItemNames =
          uwuStorage.getItem("uwu_catchingLog_customItems") || {};
      }

      if (customItemNames.hasOwnProperty(itemId)) {
        return customItemNames[itemId];
      }

      if (itemNamesById.hasOwnProperty(itemId)) {
        return itemNamesById[itemId];
      }

      return null;
    }

    function getActivityType(actionText) {
      for (const key in activityTypes) {
        if (activityTypes[key].triggers.includes(actionText)) {
          return activityTypes[key];
        }
      }
      return null;
    }

    function renderCatchingLog(logData) {
      const contentDiv = document.getElementById("uwu-catchingLog-content");
      if (!contentDiv) return;
      contentDiv.innerHTML = "";

      logData.forEach((session) => {
        const activityConfig = activityTypes[session.type];
        if (!activityConfig) return;

        const card = document.createElement("div");
        card.className = "uwu-catching-session";
        card.style.backgroundColor = activityConfig.style.backgroundColor;
        card.style.border = activityConfig.style.border;
        card.style.borderRadius = "5px";
        card.style.padding = "5px";
        card.style.marginBottom = "5px";

        const startTime = new Date(session.startTime).toLocaleTimeString(
          "ru-RU",
          { hour: "2-digit", minute: "2-digit" }
        );
        const lastTime = new Date(session.lastActionTime).toLocaleTimeString(
          "ru-RU",
          { hour: "2-digit", minute: "2-digit" }
        );

        const verb =
          session.actionVerb === activityConfig.triggers[1]
            ? activityConfig.verb.female
            : activityConfig.verb.male;
        const emptyMessageVerb = verb.toLowerCase();

        let summaryHtml = "";
        if (session.summary.length > 0) {
          summaryHtml = "<ul style='margin: 0; padding-left: 20px;'>";
          session.summary.forEach((catchInfo) => {
            const itemName = getItemNameById(catchInfo.itemId);
            const itemDisplayName = itemName ? `${itemName} ` : "";
            summaryHtml += `<li>${itemDisplayName}ID ${catchInfo.itemId} в ${catchInfo.time}</li>`;
          });
          summaryHtml += "</ul>";
        } else {
          summaryHtml = `<p style='margin: 2px 0; font-style: italic;'>Пока что ничего не ${emptyMessageVerb} :(</p>`;
        }

        card.innerHTML = `
        <p style="margin: 2px 0;"><strong>${activityConfig.title}. Время с ${startTime} до ${lastTime}.</strong></p>
        <p style="margin: 2px 0;"><strong>Всего попыток:</strong> ${session.totalDives}</p>
        ${summaryHtml}
      `;
        contentDiv.prepend(card);
      });
    }

    function handleMouthChange(mutationsList) {
      if (!catchingState.isWaiting) return;

      for (const mutation of mutationsList) {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
          for (const node of mutation.addedNodes) {
            if (node.nodeType === 1 && node.id && !mouthSnapshot.has(node.id)) {
              const img = node.querySelector("img");
              if (img && img.src) {
                const itemIdMatch = img.src.match(/things\/(\d+)\.png/);
                if (itemIdMatch) {
                  const itemId = itemIdMatch[1];
                  catchingState.foundItem = itemId;
                  return;
                }
              }
            }
          }
        }
      }
    }

    function catchingLogUpdate() {
      const ist = document.getElementById("ist");
      if (!ist) return;

      const actions = ist.innerText
        .split(".")
        .map((s) => s.trim() + ".")
        .filter((s) => s.length > 2);
      if (actions.length === 0) return;

      const lastAction = actions[actions.length - 1];
      const activityConfig = getActivityType(lastAction);

      const stopWordsRegex = /Отменил|Отменила|Пошла|Пошёл|Положил|Положила/;
      const pickupWordsRegex = /Поднял|Подняла/;

      if (activityConfig) {
        const logData = uwuStorage.getItem("uwu_catchingLogData") || [];
        let lastSession =
          logData.length > 0 ? logData[logData.length - 1] : null;
        const currentTime = Date.now();
        const twoHours = 2 * 60 * 60 * 1000;

        const isContinuingSession =
          lastSession &&
          lastSession.type === activityConfig.type &&
          currentTime - lastSession.lastActionTime < twoHours;

        if (!isContinuingSession) {
          const newSession = {
            type: activityConfig.type,
            startTime: currentTime,
            lastActionTime: currentTime,
            actionVerb: lastAction,
            totalDives: 0,
            summary: [],
          };
          logData.push(newSession);
          uwuStorage.setItem("uwu_catchingLogData", logData);
          renderCatchingLog(logData);
        }

        resetCatchingState();
        catchingState.isWaiting = true;
        catchingState.actionType = activityConfig.type;
        catchingState.actionVerb = lastAction;

        mouthSnapshot.clear();
        const itemsInMouth = document.querySelectorAll("#itemList > div");
        itemsInMouth.forEach((item) => {
          if (item.id) {
            mouthSnapshot.add(item.id);
          }
        });
        return;
      }

      if (!catchingState.isWaiting) return;

      if (pickupWordsRegex.test(lastAction)) {
        if (!catchingState.catchLoggedThisCycle) {
          undoLastCatch();
        }
        resetCatchingState();
        return;
      }

      if (stopWordsRegex.test(lastAction)) {
        if (
          !/Отменил|Отменила/.test(lastAction) &&
          !catchingState.attemptCounted
        ) {
          const logData = uwuStorage.getItem("uwu_catchingLogData") || [];
          let lastSession =
            logData.length > 0 ? logData[logData.length - 1] : null;
          if (lastSession && lastSession.type === catchingState.actionType) {
            lastSession.totalDives++;
            lastSession.lastActionTime = Date.now();
            uwuStorage.setItem("uwu_catchingLogData", logData);
            renderCatchingLog(logData);
          }
        }
        resetCatchingState();
        return;
      }

      if (!catchingState.attemptCounted) {
        const logData = uwuStorage.getItem("uwu_catchingLogData") || [];
        let lastSession =
          logData.length > 0 ? logData[logData.length - 1] : null;
        if (lastSession && lastSession.type === catchingState.actionType) {
          lastSession.totalDives++;
          lastSession.lastActionTime = Date.now();
          uwuStorage.setItem("uwu_catchingLogData", logData);
          renderCatchingLog(logData);
        }
        catchingState.attemptCounted = true;
      }

      if (catchingState.foundItem) {
        const loggedItem = logFoundItem(catchingState.foundItem);
        if (loggedItem) {
          catchingState.lastLoggedItemInCycle = loggedItem;
          catchingState.catchLoggedThisCycle = true;
        }
        catchingState.foundItem = null;
      }
    }

    function createCatchingLogBlock() {
      const historyContainer = document.getElementById("history");
      if (!historyContainer || document.getElementById("uwu-catchingLog"))
        return;

      const logContainerHTML =
        /* HTML */
        `
          <div id="uwu-catchingLog">
            <h2>
              <a href="#" id="uwu-catchingLog-toggle" class="toggle"
                >Лог ловли</a
              >
            </h2>
            <div id="uwu-catchingLog-content-wrapper">
              <div id="uwu-catchingLog-content"></div>
              <a href="#" id="uwu-catchingLog-clear">Очистить лог</a>
            </div>
          </div>
        `;

      const hr = document.createElement("hr");
      historyContainer.appendChild(hr);
      historyContainer.insertAdjacentHTML("beforeend", logContainerHTML);

      const contentDiv = document.getElementById("uwu-catchingLog-content");
      contentDiv.style.height = settings.catchingLogHeight
        ? `${settings.catchingLogHeight}px`
        : "120px";
      contentDiv.style.overflowY = "auto";
      contentDiv.style.resize = "vertical";

      const clearButton = document.getElementById("uwu-catchingLog-clear");
      clearButton.addEventListener("click", (e) => {
        e.preventDefault();
        if (confirm("Вы уверены, что хотите очистить лог ловли?")) {
          uwuStorage.removeItem("uwu_catchingLogData");
          renderCatchingLog([]);
        }
      });

      const toggleButton = document.getElementById("uwu-catchingLog-toggle");
      const contentWrapper = document.getElementById(
        "uwu-catchingLog-content-wrapper"
      );

      if (logStates.catching) {
        contentWrapper.style.display = "none";
      }

      toggleButton.addEventListener("click", (e) => {
        e.preventDefault();
        logStates.catching = !logStates.catching;
        contentWrapper.style.display = logStates.catching ? "none" : "block";
        saveLogStates();
      });

      const logData = uwuStorage.getItem("uwu_catchingLogData") || [];
      renderCatchingLog(logData);
    }

    setupSingleCallback("#history", createCatchingLogBlock);

    const mouthObserver = new MutationObserver(handleMouthChange);
    setupSingleCallback("#itemList", () => {
      mouthObserver.observe(document.getElementById("itemList"), {
        childList: true,
      });
    });

    setupMutationObserver("#history_block", catchingLogUpdate, {
      childList: true,
      subtree: true,
    });
  }
  // ====================================================================================================================
  //   . . . ЗВУКОВЫЕ УВЕДОМЛЕНИЯ . . .
  // ====================================================================================================================
  // мяу мяу мяу мяу мяу мяу мяу мяу мяу мяу мяу мяу
  // ====================================================================================================================
  //   . . . ЛИЧНЫЕ СООБЩЕНИЯ . . .
  // ====================================================================================================================
  let previousCount = 0;

  if (settings.notificationPM) {
    const newlsElement = document.getElementById("newls");
    if (newlsElement) {
      const observer = new MutationObserver(handleNewlsChange);
      observer.observe(newlsElement, {
        characterData: true,
        subtree: true,
      });
    }

    function handleNewlsChange(mutations) {
      if (mutations.length > 0) {
        const currentText = newlsElement.textContent;
        const currentCount = parseInt(
          currentText.match(/\(\d+\)/)?.[0].slice(1, -1) || 0,
          10
        );

        if (!isNaN(currentCount) && currentCount > previousCount) {
          soundManager.playSound(
            settings.notificationPMSound,
            settings.notificationPMVolume
          );
          previousCount = currentCount;
        } else if (!isNaN(currentCount)) {
          previousCount = currentCount;
        }
      }
    }
  }
  // ====================================================================================================================
  //   . . . ОКОНЧАНИЕ ДЕЙСТВИЯ . . .
  // ====================================================================================================================
  if (settings.notificationActionEnd) {
    let actionStartTime = null;

    const observer = new MutationObserver(() => {
      const blockMess = document.getElementById("block_mess");

      if (blockMess && blockMess.innerHTML.trim() !== "" && !actionStartTime) {
        actionStartTime = Date.now();
      } else if (!blockMess && actionStartTime) {
        const actionEndTime = Date.now();
        const actionDuration = actionEndTime - actionStartTime;

        if (actionDuration >= 6000) {
          soundManager.playSound(
            settings.notificationActionEndSound,
            settings.notificationActionEndVolume
          );
        }
        actionStartTime = null;
      }
    });

    const targetNode = document.getElementById("tr_actions");
    if (targetNode) {
      observer.observe(targetNode, { childList: true, subtree: true });
    }
  }
  // ====================================================================================================================
  //   . . . ПОДНЯЛИ В РОТ . . .
  // ====================================================================================================================
  function handleInMouthNotification() {
    const blockMess = document.getElementById("block_mess");
    if (!blockMess) return;

    const observer = new MutationObserver(() => {
      if (blockMess.innerHTML.includes("во рту. Вы не сможете выбраться")) {
        soundManager.playSound(
          settings.notificationInMouthSound,
          settings.notificationInMouthVolume
        );
      }
    });

    observer.observe(blockMess, { childList: true, subtree: true });
  }

  if (settings.notificationInMouth) {
    setupMutationObserver("#tr_actions", handleInMouthNotification, {
      childList: true,
      subtree: true,
    });
  }
  // ====================================================================================================================
  //   . . . ВВЕЛИ В БОЕВУЮ СТОЙКУ . . .
  // ====================================================================================================================
  if (settings.notificationInFightMode) {
    const attackRegex = /в боевую стойку, поскольку на меня напал/;
    let previousHistory = "";

    const updateHistory = () => {
      const istElement = document.getElementById("ist");
      const currentHistory = istElement.innerHTML;

      if (currentHistory !== previousHistory) {
        previousHistory = currentHistory;

        const entries = currentHistory.split(".");
        const lastEntry = entries[entries.length - 2];

        if (lastEntry !== undefined && attackRegex.test(lastEntry)) {
          soundManager.playSound(
            settings.notificationInFightModeSound,
            settings.notificationInFightModeVolume
          );
        }
      }
    };

    const historyBlock = document.getElementById("history_block");
    const observer = new MutationObserver(() => {
      updateHistory();
    });

    const config = {
      childList: true,
      subtree: true,
      characterData: true,
    };
    observer.observe(historyBlock, config);
  }
  // ====================================================================================================================
  // мяу мяу мяу мяу мяу мяу мяу мяу мяу мяу мяу мяу
  // ====================================================================================================================
  //   . . . СОВРЕМЕННЫЙ (НОВЫЙ) ЧАТ . . .
  // ====================================================================================================================
  // я на этом инвалиде потерял все нервы кетвар желаю тебе счастья удачи и всего хорошего 😌😌😌😌😌😌😌😌😌😌
  // И ДО СИХ ПОР ТЕРЯЮ ААААА
  // TODO - как-то пределать шоле
  if (settings.newChat) {
    const newChatContainer = document.createElement("div");
    newChatContainer.id = "uwu_chat_msg";
    const chatForm = document.getElementById("chat_form");
    chatForm.parentNode.insertBefore(newChatContainer, chatForm.nextSibling);

    newChatContainer.addEventListener("click", function (event) {
      const target = event.target;

      const nickElement = target.closest(".nick");
      if (nickElement) {
        const textArea = document.getElementById("text");
        let nick = nickElement.textContent;
        if (settings.addCommaAfterNick) {
          nick += ", ";
        }
        textArea.value += nick;
        textArea.focus();
        return;
      }

      const reportButton = target.closest(".msg_report");
      if (reportButton) {
        const dataId = reportButton.getAttribute("data-id");
        const originalReportLink = document.querySelector(
          `#chat_msg .msg_report[data-id="${dataId}"]`
        );
        if (originalReportLink) {
          originalReportLink.click();
        }
        return;
      }
    });

    const chatElement = document.getElementById("chat_msg");
    if (chatElement) {
      const observer = new MutationObserver(handleNewChatMessage);
      observer.observe(chatElement, { childList: true, subtree: true });
    }

    let addedSpanCount = 0;

    function handleNewChatMessage(mutations) {
      const addedNodes = Array.from(mutations)
        .flatMap((mutation) => Array.from(mutation.addedNodes))
        .filter(
          (node) =>
            node.nodeName === "SPAN" && node.querySelector("td > .chat_text")
        );

      addedSpanCount += addedNodes.length;
      processChatMessages(addedSpanCount);
      addedSpanCount = 0;
    }

    function processChatMessages(messageCount) {
      const chatMessages = document.querySelectorAll("#chat_msg > span");
      const messagesArray = Array.from(chatMessages);
      const messagesToProcess = messagesArray.slice(0, messageCount);
      messagesToProcess.reverse();

      messagesToProcess.forEach((message) => {
        copyMessageToNewChat(message);
      });
    }

    function copyMessageToNewChat(chatMessage) {
      const chatTextSpan = chatMessage.querySelector("td > .chat_text");
      const messageSpan = chatTextSpan.querySelector("span");
      const messageText = messageSpan ? messageSpan.innerHTML : "";
      const nickElement = chatTextSpan.querySelector(".nick");
      const nickName = nickElement ? nickElement.textContent.trim() : "";
      const chatTextClasses = chatTextSpan.className;
      const nickStyle = nickElement ? nickElement.getAttribute("style") : "";
      let nameFound = false;

      let processedText = messageText;

      if (settings.namesForNotification) {
        const names = settings.namesForNotification
          .trim()
          .split(/\s*,\s*/)
          .filter((name) => name);

        names.forEach((name) => {
          const regex = new RegExp(
            `(^|\\s|[.,!?])(${name})(?=$|\\s|[.,!?])`,
            "gi"
          );
          processedText = processedText.replace(regex, (match, p1, p2) => {
            nameFound = true;
            return `${p1}<span class="myname">${p2}</span>`;
          });
        });
      }

      if (!nameFound && messageSpan && messageSpan.querySelector(".myname")) {
        nameFound = true;
      }

      if (nameFound) {
        soundManager.playSound(
          settings.myNameNotificationSound,
          settings.notificationMyNameVolume
        );
      }

      const profileLink = chatMessage.querySelector('a[href^="/cat"]').href;
      const catIdMatch = profileLink.match(/\/cat(\d+)/);
      const catId = catIdMatch ? catIdMatch[1] : ". . .";

      const reportLink = chatMessage.querySelector(".msg_report");
      const dataId = reportLink ? reportLink.getAttribute("data-id") : "";

      const newChatMessageHTML =
        // html
        `
        <hr>
        <div id="msg">
          <div class="${chatTextClasses}">${processedText} - <b class="nick" style="${nickStyle}">${nickName}</b> <i>[${catId}]</i></div>
          <div style="display: flex; width: 42px; justify-content: flex-end; margin-right: 2px;">
            <a href="${profileLink}" title="Перейти в профиль" target="_blank" rel="noopener noreferrer">➝</a>&nbsp;|&nbsp;
            <a href="#" title="Пожаловаться на нарушение ОПИ" class="msg_report" data-id="${dataId}">X</a>
          </div>
        </div>
      `;
      newChatContainer.insertAdjacentHTML("afterbegin", newChatMessageHTML);
    }

    const uwuChatMsg = document.createElement("style");
    uwuChatMsg.innerHTML = `
        #uwu_chat_msg {
          height: ${settings.chatHeight}px;
          resize: vertical;
          overflow-y: auto;
          display: flex;
          flex-direction: ${settings.reverseChat ? "column-reverse" : "column"};
        }
  
        #chat_msg {
          display: none;
        }
  
        #msg {
          display: flex;
          justify-content: space-between;
        }

        #uwu_chat_msg > hr {
          width: -webkit-fill-available;
        }
     `;
    document.head.appendChild(uwuChatMsg);
  }
  // ====================================================================================================================
  //   . . . НОВЫЙ ВВОД ЧАТА . . .
  // ====================================================================================================================
  const chatForm = document.getElementById("chat_form");
  const trChatTd = document.querySelector("#tr_chat > td");

  function updateChatFormPosition() {
    if (settings.reverseChat) {
      trChatTd.appendChild(chatForm);
    } else {
      trChatTd.prepend(chatForm);
    }
  }
  updateChatFormPosition();

  if (settings.newChatInput) {
    const txtSpan = document.getElementById("txt");
    const selectField = txtSpan.querySelector("select#text");

    let textarea;

    function initTextarea(id, value) {
      const textarea = document.createElement("textarea");
      textarea.id = id;
      textarea.maxLength = 255;
      textarea.style.height = "auto";
      textarea.style.width = "100%";
      textarea.style.resize = "vertical";
      textarea.value = value || "";
      return textarea;
    }

    if (selectField) {
      textarea =
        document.getElementById("text-hide") || initTextarea("text-hide");
      textarea.style.display = "none";
    } else {
      const inputField = txtSpan.querySelector("input#text");

      textarea = initTextarea("text", inputField ? inputField.value : "");
      txtSpan.insertBefore(textarea, inputField);
    }

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          const selectField = txtSpan.querySelector("select#text");
          if (selectField) {
            textarea.style.display = "none";
            textarea.id = "text-hide";
          } else {
            textarea.style.display = "";
            textarea.id = "text";
          }
        }
      });
    });

    observer.observe(txtSpan, { childList: true });

    // Make Enter great again!
    textarea.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        if (event.shiftKey) {
          event.preventDefault();
          textarea.value += "\n";
        } else {
          event.preventDefault();
          const sendButton = document.getElementById("msg_send");
          sendButton.click();
        }
      }
    });

    const NewChatDesign = document.createElement("style");
    NewChatDesign.innerHTML = `
  input#text {
    display: none;
  }

  #text, #text-hide {
    color: ${theme?.textColor};
    background: ${theme?.accentColor1};
    border: solid 1px ${theme?.accentColor2};
    font-family: Verdana;
  }
`;
    document.head.appendChild(NewChatDesign);
  }

  // ====================================================================================================================
  //   . . . СЧЁТЧИК СИМВОЛОВ В ЧАТЕ . . .
  // ====================================================================================================================

  if (settings.newChatInput && settings.showChatCharCounter) {
    function setupCharCounter() {
      const chatForm = document.getElementById("chat_form");
      const textarea = chatForm.querySelector("textarea#text");
      const volumeLabel = chatForm.querySelector("b");

      if (
        !textarea ||
        !volumeLabel ||
        document.getElementById("uwu-char-counter")
      ) {
        return;
      }

      const counterElement = document.createElement("span");
      counterElement.id = "uwu-char-counter";
      counterElement.style.margin = "0 8px";

      volumeLabel.parentNode.insertBefore(counterElement, volumeLabel);
      volumeLabel.parentNode.insertBefore(
        document.createTextNode(" | "),
        volumeLabel
      );

      function updateCounter() {
        const currentLength = textarea.value.length;
        const maxLength = textarea.maxLength;
        counterElement.textContent = `${currentLength}/${maxLength}`;
      }

      textarea.addEventListener("input", updateCounter);
      updateCounter();
    }

    setupSingleCallback("#chat_form", setupCharCounter);
  }
  // ====================================================================================================================
  //   . . . РЕДИЗАЙНЫ + + ЗАКРУГЛЕНИЕ БЛОКОВ . . .
  // ====================================================================================================================
  const sliceInfoStyle = document.createElement("style");

  if (settings.sliceInfoBlock) {
    sliceInfoStyle.innerHTML = `
      #info_main > tbody > tr > td {
        background-color: ${theme?.blocksColor || ""};
        margin-bottom: 5px;
      }
    `;
    document.head.appendChild(sliceInfoStyle);
  } else {
    sliceInfoStyle.innerHTML = `
      #tr_info > td {
        background-color: ${theme?.blocksColor || ""};
      }
    `;
    document.head.appendChild(sliceInfoStyle);
  }

  const edgeTrimBlocksStyle = document.createElement("style");
  if (settings.edgeTrimBlocks) {
    edgeTrimBlocksStyle.innerHTML =
      // css
      `
    #info_main > tbody > tr > td {
      width: fit-content;
      border-radius: 10px;
      margin-bottom: 10px;
    }
    
    #info_main,
    #tos,
    #cages_overflow,
    #cages_div {
      border-radius: 10px;
    }
    
    #main_table > tbody > #tr_actions,
    #main_table > tbody > #tr_mouth,
    #main_table > tbody > #tr_chat,
    #main_table > tbody > #tr_tos,
    #main_table > tbody > #tr_info {
      margin: 0px 10px 10px 10px;
    }
    
    #tr_chat,
    #tr_actions > td,
    #tr_mouth > td,
    #location,
    #tr_info > td {
      border-radius: 10px;
    }

    .small {
      border-top-left-radius: 0px;
      border-top-right-radius: 0px;
      border-bottom-right-radius: 10px;
      border-bottom-left-radius: 10px;
    }
    `;
    document.head.appendChild(edgeTrimBlocksStyle);
  }

  // ====================================================================================================================
  //  . . . ЗВУК БЛОКИРОВАНИЯ / ОТЖАТИЯ . . .
  // ====================================================================================================================
  if (settings.notificationBlock) {
    function playSoundOnSrcAttributeChange() {
      soundManager.playSound(
        settings.notificationBlockSound,
        settings.notificationBlockVolume
      );
    }

    setupMutationObserver(
      "#block",
      () => {
        const blockElement = document.querySelector("#block");

        if (blockElement) {
          const srcObserver = new MutationObserver(
            playSoundOnSrcAttributeChange
          );
          srcObserver.observe(blockElement, {
            attributes: true,
            attributeFilter: ["src"],
          });
        } else {
          console.warn("Элемент #block не найден.");
        }
      },
      { attributes: true },
      8,
      500
    );
  }
  // ====================================================================================================================
  //  . . . КОМАНДЫ В БОЕВОМ РЕЖИМЕ . . .
  // ====================================================================================================================
  if (settings.fightTeams) {
    const colors = settings.fightTeamsColors;
    const uwu_fightTeamsCats = uwuStorage.getItem("uwu_fightTeamsCats") || {};

    const fightPanel = document.getElementById("fightPanel");
    const buttonHTML =
      '<button id="updateTableButton" style="width: 100%; box-sizing: border-box;">Обновить команды</button>';
    fightPanel.insertAdjacentHTML("beforeend", buttonHTML);

    document.getElementById("updateTableButton").onclick = () => {
      if (!document.getElementById("uwu-team-settings")) {
        createTeamTable();
      }
      updateTeamTable();
    };

    function createTeamTable() {
      const tableHTML =
        /* HTML */
        `
          <div
            id="uwu-team-settings"
            style="height: ${settings.fightTeamsPanelHight ||
            "auto"}px; box-sizing: border-box; overflow-y: scroll; overflow-x: hidden; resize: vertical;"
          >
            <table
              id="uwu-team-settings-table"
              style="width: 100%; border-collapse: collapse;"
            >
              <thead>
                <tr>
                  <th style="border: 1px solid #000; padding: 5px;">Имя</th>
                  <th style="border: 1px solid #000; padding: 5px;">Команда</th>
                </tr>
              </thead>
              <tbody id="teamTableBody"></tbody>
            </table>
          </div>
        `;
      const updateButton = document.getElementById("updateTableButton");
      updateButton.insertAdjacentHTML("beforebegin", tableHTML);
    }

    function updateTeamTable() {
      const tbody = document.getElementById("teamTableBody");
      tbody.innerHTML = "";
      const cages = document.querySelectorAll("#cages .cage");

      cages.forEach((cage) => {
        const catName = cage.querySelector(".cat_tooltip a")?.textContent;
        const arrow = cage.querySelector(
          ".arrow.arrow-paws, .arrow.arrow-claws, .arrow arrow-teeth"
        );

        if (catName && arrow) {
          const arrowId = arrow.id;
          const savedTeam = uwu_fightTeamsCats[arrowId];

          const buttonsHTML = Object.keys(colors)
            .map((team) => {
              const isSelected = savedTeam === team ? "selected" : "";
              return `
                <button 
                  class="team-color-button ${isSelected}"
                  data-arrow-id="${arrowId}"
                  data-team="${team}"
                  style="
                    background-color: ${colors[team][0]}; 
                    flex: 1; 
                    height: 20px; 
                    border: 1px solid #333; 
                    padding: 0; 
                    margin: 0; 
                    cursor: pointer;
                    box-sizing: border-box;
                  "
                ></button>
              `;
            })
            .join("");

          const rowHTML = `
            <tr>
              <td style="border: 1px solid #000; padding: 5px; vertical-align: middle;">${catName}</td>
              <td style="
                  border: 1px solid #000; 
                  padding: 4px; 
                  display: flex; 
                  justify-content: space-between; 
                  gap: 4px;
                  align-items: center;
              ">
                ${buttonsHTML}
              </td>
            </tr>
          `;
          tbody.insertAdjacentHTML("beforeend", rowHTML);

          if (savedTeam) {
            applyTeamColors(arrowId, savedTeam);
          }
        }
      });

      const teamColorButtons = document.querySelectorAll(".team-color-button");
      teamColorButtons.forEach((button) => {
        button.addEventListener("click", () => {
          const arrowId = button.getAttribute("data-arrow-id");
          const team = button.getAttribute("data-team");
          applyTeamColors(arrowId, team);
        });
      });
    }

    function applyTeamColors(arrowId, team) {
      const styleElement = document.createElement("style");
      const cssRule = `
        #${arrowId} .arrow_green { background-color: ${colors[team][0]} !important; }
        #${arrowId} .arrow_red { background-color: ${colors[team][1]} !important; }
      `;
      styleElement.appendChild(document.createTextNode(cssRule));
      document.head.appendChild(styleElement);

      uwu_fightTeamsCats[arrowId] = team;
      uwuStorage.setItem("uwu_fightTeamsCats", uwu_fightTeamsCats);
    }
  }
  // ====================================================================================================================
  //   . . . ПЕРЕТАСКИВАНИЕ ПАНЕЛИ БОЕВОГО РЕЖИМА . . .
  // ====================================================================================================================
  if (settings.draggingFightPanel) {
    const dragDiv = document.createElement("div");
    dragDiv.style.cursor = "move";
    dragDiv.style.display = "inline-block";

    const dragImage = document.createElement("img");
    dragImage.src =
      "https://raw.githubusercontent.com/Ibirtem/CatWar/main/images/drag-move.png";
    dragImage.style.width = "24px";
    dragImage.style.height = "24px";
    dragImage.style.pointerEvents = "none";
    dragDiv.appendChild(dragImage);

    const fightPanel = document.getElementById("fightPanel");
    const firstImage = fightPanel.querySelector("img");

    const parentDiv = firstImage.parentElement;
    parentDiv.insertBefore(dragDiv, firstImage);

    let mouseX = 0;
    let mouseY = 0;
    let panelX = 0;
    let panelY = 0;
    let isDragging = false;

    function saveFightPanelPosition(x, y) {
      uwuStorage.setItem("uwu_fightPanelPosition", { x, y });
    }

    function loadFightPanelPosition() {
      const savedPosition = uwuStorage.getItem("uwu_fightPanelPosition");
      if (savedPosition) {
        const position = savedPosition;
        panelX = position.x;
        panelY = position.y;
      }
    }

    function setFightPanelPosition(x, y) {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const panelWidth = fightPanel.offsetWidth;
      const panelHeight = fightPanel.offsetHeight;

      const maxX = windowWidth - panelWidth;
      x = Math.max(0, Math.min(x, maxX));

      const maxY = windowHeight - panelHeight;
      y = Math.max(0, Math.min(y, maxY));

      fightPanel.style.left = `${x}px`;
      fightPanel.style.top = `${y}px`;

      saveFightPanelPosition(x, y);
    }

    dragDiv.addEventListener("mousedown", (e) => {
      e.preventDefault();
      isDragging = true;
      mouseX = e.clientX;
      mouseY = e.clientY;

      loadFightPanelPosition();

      document.body.style.userSelect = "none";
    });

    document.addEventListener("mousemove", (e) => {
      if (isDragging) {
        e.preventDefault();

        const dx = e.clientX - mouseX;
        const dy = e.clientY - mouseY;

        setFightPanelPosition(panelX + dx, panelY + dy);
      }
    });

    document.addEventListener("mouseup", () => {
      isDragging = false;

      document.body.style.userSelect = "auto";
    });

    loadFightPanelPosition();
    setFightPanelPosition(panelX, panelY);
  }
  // ====================================================================================================================
  //   . . . СОКРАЩЕНИЕ ЛОГА БОЕВОГО РЕЖИМА . . .
  // ====================================================================================================================
  // емааааа ужасное решение
  // TODO - исправить переделать уничтожить пересобрать заамогусить чё за фигню я сделал
  if (settings.compactFightLog) {
    const compactLogStyle = document.createElement("style");
    compactLogStyle.innerHTML =
      /* CSS */
      `
      #uwu-Compacted-Fight-Log {
        width: 100%;
        box-sizing: border-box;
        overflow-x: hidden;
        overflow-y: auto;
        overflow-wrap: anywhere;
        word-break: break-word;
        white-space: normal;
        padding: 2px;
      }
      
      #uwu-Compacted-Fight-Log > div {
        width: 100%;
        box-sizing: border-box;
      }
    `;

    document.head.appendChild(compactLogStyle);
    function compactFightLog() {
      const fightLog = document.getElementById("fightLog");
      fightLog.style.display = "none";

      let compactedFightLog = document.getElementById(
        "uwu-Compacted-Fight-Log"
      );
      if (!compactedFightLog) {
        compactedFightLog = document.createElement("div");
        compactedFightLog.id = "uwu-Compacted-Fight-Log";
        compactedFightLog.style.height = settings.fightPanelHeight + "px";
        fightLog.parentNode.insertBefore(compactedFightLog, fightLog);
      }

      const logEntries = Array.from(fightLog.childNodes).filter(
        (entry) => entry.tagName === "SPAN"
      );

      if (logEntries.length > 0) {
        const firstEntry = logEntries[0];
        const text = firstEntry.textContent.trim();
        const match = text.match(/^(.*) x(\d+)$/);
        const originalText = match ? match[1] : text;
        const count = match ? parseInt(match[2], 10) : 1;

        const latestEntry = compactedFightLog.firstElementChild;

        if (latestEntry) {
          const latestTextSpan = latestEntry.querySelector(".text");

          if (
            latestTextSpan &&
            latestTextSpan.textContent.trim() === originalText
          ) {
            const countLabel = latestEntry.querySelector(".count");
            const existingCount = parseInt(
              countLabel.textContent.match(/x(\d+)$/)[1],
              10
            );
            countLabel.textContent = ` x${existingCount + count}`;
          } else {
            const newEntryHTML = createEntryHTML(
              firstEntry.className,
              originalText,
              count
            );
            compactedFightLog.insertAdjacentHTML("afterbegin", newEntryHTML);
          }
        } else {
          const newEntryHTML = createEntryHTML(
            firstEntry.className,
            originalText,
            count
          );
          compactedFightLog.insertAdjacentHTML("afterbegin", newEntryHTML);
        }

        fightLog.removeChild(firstEntry);
      }
    }

    function createEntryHTML(className, originalText, count) {
      return `
        <div class="${className}">
          <span class="text">${originalText}</span>
          <label class="count"> x${count}</label>
        </div>
      `;
    }

    setupMutationObserver(
      "#fightLog",
      compactFightLog,
      {
        attributes: true,
        childList: true,
      },
      8,
      500,
      10
    );
  }
  // ====================================================================================================================
  //   . . . ИЗМЕНЯЕМАЯ ВЫСОТА ПАНЕЛИ БОЕВОГО РЕЖИМА . . .
  // ====================================================================================================================
  if (settings.fightPanelAdjustableHeight) {
    const uwuFightLog = document.createElement("style");
    uwuFightLog.innerHTML = `
      #fightPanel {
        height: auto;
      }

      #fightLog {
        resize: vertical;
        overflow-y: scroll;
      }
      
      #uwu-Compacted-Fight-Log {
        resize: vertical;
        overflow-y: scroll;
      } 
      `;
    document.head.appendChild(uwuFightLog);

    const fightLogElement = document.getElementById("fightLog");
    if (fightLogElement) {
      fightLogElement.style.height = `${settings.fightPanelHeight || 70}px`;
    }
  }
  // ====================================================================================================================
  //   . . . ВСЕГДА ДЕНЬ В ИГРОВОЙ . . .
  // ====================================================================================================================
  // Вот бы всё писалось так кратко и легко...........
  function updateAlwaysDayStyle(checked) {
    const alwaysDayStyle = `
      #cages_div {
        opacity: 1 !important;
      }   
    `;

    const styles = document.head.querySelectorAll("style");
    let styleFound = false;

    styles.forEach((style) => {
      if (style.innerHTML === alwaysDayStyle) {
        if (!checked) {
          document.head.removeChild(style);
        }
        styleFound = true;
      }
    });

    if (checked && !styleFound) {
      const alwaysDay = document.createElement("style");
      alwaysDay.innerHTML = alwaysDayStyle;
      document.head.appendChild(alwaysDay);
    }
  }
  // ====================================================================================================================
  //   . . . НЕБО - ШАПКА . . .
  // ====================================================================================================================
  if (settings.skyInHeader) {
    function getSkyUrl() {
      const skyElement = document.querySelector("#sky");
      if (skyElement) {
        const skyStyle = skyElement.getAttribute("style");
        const match = skyStyle.match(/url\((.*?)\)/);
        if (match) {
          return match[1].trim();
        } else {
          console.log("Не удалось найти URL изображения неба");
        }
      }
      return "";
    }

    const skyDiv = document.createElement("div");
    skyDiv.id = "skyDuplicate";

    const globalContainerElement = document.getElementById(
      "uwu-global-container"
    );
    globalContainerElement.appendChild(skyDiv);

    const skyStyle = document.createElement("style");
    skyStyle.innerHTML = `
      #skyDuplicate {
        height: 15%;
        width: 100%;
        mask-image: linear-gradient(to bottom, 
          rgba(0, 0, 0, 1), 
          rgba(0, 0, 0, 0.40) 50%,
          rgba(0, 0, 0, 0)
        );
        top: 0;
        left: 0;
        z-index: -1;
        position: absolute;
        background-size: cover;
      }
    `;
    document.head.appendChild(skyStyle);

    const originalSkyStyle = document.createElement("style");
    originalSkyStyle.innerHTML = `
      #tr_sky {
        display: none;
      }
    `;
    document.head.appendChild(originalSkyStyle);

    function updateSkyImage() {
      const skyUrl = getSkyUrl();
      if (skyUrl) {
        skyDiv.style.backgroundImage = `url(${skyUrl})`;
      }
    }

    updateSkyImage();

    setupMutationObserver(
      "#sky",
      updateSkyImage,
      { attributes: true, attributeFilter: ["style"] },
      8,
      500,
      10
    );
  }
  // ====================================================================================================================
  //   . . . ОПРЕДЕЛЕНИЕ ПОГОДЫ В ИГРОВОЙ . . . 🛠️
  // ====================================================================================================================
  let currentWeather = "null";
  let currentHour = "null";
  let currentSeason = "null";
  let currentTemperature = "null";
  let temperatureDescription = "null";
  // ахахаха глянье на этих незнающих
  let weatherModifier = 1;

  if (settings.manualWeatherPanel) {
    const manualWeatherSlider = document.getElementById("manualWeather");

    manualWeatherSlider.addEventListener("change", () => {
      const selectedWeather = manualWeatherSlider.value;

      if (selectedWeather === "1") {
        currentWeather = "clear";
      } else if (selectedWeather === "2") {
        if (settings.minecraftStyle) {
          currentWeather = "pixelRain";
        } else {
          currentWeather = "rain";
        }
      } else if (selectedWeather === "3") {
        if (settings.minecraftStyle) {
          currentWeather = "pixelSnow";
        } else {
          currentWeather = "snow";
        }
      }
    });
  }

  function getSkyType() {
    const skyElement = document.querySelector("#sky");
    if (!skyElement) {
      currentWeather = "unknown";
      return;
    }
    const skyStyle = skyElement.getAttribute("style");

    if (settings.weatherEnabled) {
      const match = skyStyle.match(/\/(\d+)\.png/);
      if (match) {
        const skyNumber = parseInt(match[1]);

        switch (skyNumber) {
          case 2:
          case 4:
            currentWeather = settings.minecraftStyle ? "pixelRain" : "rain";
            break;
          case 7:
          case 8:
            currentWeather = settings.minecraftStyle ? "pixelSnow" : "snow";
            break;
          case 22:
            currentWeather = "northernLights";
            break;
          default:
            currentWeather = "clear";
        }
      } else {
        currentWeather = "unknown";
      }
    }
  }

  function getTime() {
    const timeElement = document.querySelector("#hour");
    if (!timeElement) {
      currentHour = "unknown";
      return;
    }
    const hourImg = timeElement.querySelector("img");

    if (!hourImg) {
      currentHour = "unknown";
      return;
    }

    const hourTime = hourImg.getAttribute("src");

    if (!hourTime) {
      currentHour = "unknown";
      return;
    }

    if (settings.weatherEnabled) {
      const match = hourTime.match(/(\d+)\.png$/);
      if (match) {
        const hourNumber = parseInt(match[1]);

        if (hourNumber >= 6 && hourNumber <= 12) {
          currentHour = "morning";
        } else if (hourNumber >= 13 && hourNumber <= 18) {
          currentHour = "day";
        } else if (hourNumber >= 19 && hourNumber <= 21) {
          currentHour = "evening";
        } else {
          currentHour = "night";
        }
      } else {
        currentHour = "unknown";
      }
    }
  }

  function getSeason() {
    const seasonElement = document.querySelector("img[src*='symbole/season']");
    if (!seasonElement) {
      currentSeason = "unknown";
      return;
    }

    const seasonSrc = seasonElement.getAttribute("src");
    if (!seasonSrc) {
      currentSeason = "unknown";
      return;
    }

    const match = seasonSrc.match(/season(\d+)\.png/);
    if (match) {
      const seasonNumber = parseInt(match[1]);
      switch (seasonNumber) {
        case 0:
          currentSeason = "winter";
          break;
        case 1:
          currentSeason = "spring";
          break;
        case 2:
          currentSeason = "summer";
          break;
        case 3:
          currentSeason = "autumn";
          break;
        default:
          currentSeason = "unknown";
      }
    } else {
      currentSeason = "unknown";
    }
  }

  function getTemperature() {
    const temperatureElement = document.querySelector("#tos");
    const temperatureElementHTML = temperatureElement.outerHTML;
    const backgroundValue = /background:\s*([a-zA-Z0-9#()]+);/.exec(
      temperatureElementHTML
    );

    if (backgroundValue && backgroundValue.length > 1) {
      const foundBackground = backgroundValue[1];

      const temperatureRanges = [
        {
          description: "Очень холодно",
          temperature: -3,
          colors: [
            "#94BDD2",
            "#9DC5D8",
            "#B2D8E5",
            "#C3E8EF",
            "#AED4E2",
            "#AAD1E0",
            "#A5CDDD",
          ],
        },
        {
          description: "Холодно",
          temperature: -2,
          colors: [
            "#7FAAC5",
            "#76A2C0",
            "#6A96B8",
            "#6593B6",
            "#618FB3",
            "#7BA6C3",
          ],
        },
        {
          description: "Прохладно",
          temperature: -1,
          colors: [
            "#3B6C9B",
            "#4C7BA6",
            "#5887AE",
            "#5D8BB0",
            "#4777A3",
            "#366899",
            "#3F709E",
            "#4374A1",
            "#5483AB",
          ],
        },
        {
          description: "Тепло",
          temperature: 1,
          colors: ["#FCBD8E", "#F8A37A", "#F79E77", "#FDC291", "#FCB88A"],
        },
        {
          description: "Жарковато",
          temperature: 2,
          colors: [
            "#F79973",
            "#F6946F",
            "#F58F6B",
            "#F28060",
            "#F38563",
            "#F17A5C",
            "#EF6B50",
            "#F07054",
          ],
        },
        {
          description: "Жарко",
          temperature: 3,
          colors: [
            "#EE664D",
            "#ED6149",
            "#EB5741",
            "#EB523D",
            "#E73D2E",
            "#E6382A",
          ],
        },
        {
          description: "Засуха",
          temperature: 4,
          colors: ["#DF0A08", "#E3241B", "#E4291F", "#E52E22", "#E63326"],
        },
      ];

      let foundTemperature = null;

      for (const range of temperatureRanges) {
        if (range.colors.includes(foundBackground)) {
          foundTemperature = range;
          break;
        }
      }

      if (foundTemperature) {
        currentTemperature = foundTemperature.temperature;
        temperatureDescription = foundTemperature.description;
      } else {
        currentTemperature = 1;
        temperatureDescription =
          "Неизвестная температура. Разработчик скорее всего уже в курсе и в скором времени выпустит правку.";
        console.warn("Неизвестная температура:", foundBackground);
      }

      switch (currentTemperature) {
        case 1:
        case -1:
          weatherModifier = 2;
          break;
        case 2:
        case -2:
          weatherModifier = 1.5;
          break;
        case 3:
        case -3:
          weatherModifier = 1;
          break;
        default:
          weatherModifier = 1;
      }

      // console.log("Температура:", currentTemperature);

      const temperatureDisplayElement = document.getElementById("temperature");
      if (temperatureDisplayElement) {
        temperatureDisplayElement.innerHTML = `[?] Текущий модификатор: ${weatherModifier} (${temperatureDescription})`;
      }
    } else {
      // console.log("...я временно потерял бекграунд температуры🌡️...");
    }
  }
  // ====================================================================================================================
  if (!settings.manualWeatherPanel) {
    setupMutationObserver("#sky", getSkyType);

    setupSingleCallback("#hour", getTime);
    setupMutationObserver(
      "#hour",
      getTime,
      {
        attributes: true,
        attributeFilter: ["src"],
        subtree: true,
      },
      8,
      500,
      20
    );

    setupMutationObserver("img[src*='symbole/season']", getSeason, {
      attributes: true,
      attributeFilter: ["src"],
    });
  }

  setupMutationObserver("#tos", getTemperature, {
    attributes: true,
    subtree: true,
  });
  // ====================================================================================================================
  //   . . . ПОДГОТОВКА КОНТЕЙНЕРОВ / ИЗОБРАЖЕНИЙ . . . 🖼️
  // ====================================================================================================================
  const weatherContainer = document.getElementById("uwu-main-container");
  const weatherCanvas = document.createElement("canvas");
  weatherCanvas.classList.add("weatherCanvas");
  weatherCanvas.style.zIndex = settings.weatherZIndex;
  weatherContainer.appendChild(weatherCanvas);
  const weatherCtx = weatherCanvas.getContext("2d");

  function resizeCanvasElement() {
    weatherCanvas.width = weatherCanvas.parentNode.offsetWidth;
    weatherCanvas.height = weatherCanvas.parentNode.offsetHeight;
  }

  window.addEventListener("resize", resizeCanvasElement);
  resizeCanvasElement();

  const images = {
    pixelSnow: [
      {
        url: "https://raw.githubusercontent.com/Ibirtem/CatWar/main/images/snowflake1.png",
      },
      {
        url: "https://raw.githubusercontent.com/Ibirtem/CatWar/main/images/snowflake2.png",
      },
    ],
    pixelRain: [
      {
        url: "https://raw.githubusercontent.com/Ibirtem/CatWar/main/images/rain1.png",
      },
      {
        url: "https://raw.githubusercontent.com/Ibirtem/CatWar/main/images/rain2.png",
      },
    ],
    pixelSplash: [
      {
        url: "https://raw.githubusercontent.com/Ibirtem/CatWar/main/images/splash_0.png",
      },
      {
        url: "https://raw.githubusercontent.com/Ibirtem/CatWar/main/images/splash_1.png",
      },
    ],
    sus: [
      {
        url: "https://firebasestorage.googleapis.com/v0/b/xwx-823ac.appspot.com/o/images%2Ftiny-red-among-us.png?alt=media&token=354b34c6-6297-4a4d-8a73-f36a903170c0",
      },
    ],
  };

  async function loadImages(type) {
    const imagesForType = images[type];
    if (!imagesForType) {
      console.error(`Чё ета...?: ${type}`);
      return;
    }

    const promises = [];

    for (const image of imagesForType) {
      promises.push(
        new Promise((resolve, reject) => {
          const img = new Image();
          img.src = image.url;
          img.onload = function () {
            image.image = this;
            resolve();
          };
          img.onerror = function () {
            console.error(`Чёта не скачалось: ${image.url}`);
            reject();
          };
        })
      );
    }

    await Promise.all(promises);
  }
  loadImages("pixelSnow");
  loadImages("pixelRain");
  loadImages("pixelSplash");
  loadImages("sus");

  const { raindrops } = generateRain();
  const { snowflakes } = generateSnowflakes();
  const { pixelRaindrops } = generatePixelRain();
  const { pixelSnowflakes } = generatePixelSnow();

  // ====================================================================================================================
  //   . . . РЕЖИМ НИЗКОЙ ПРОИЗВОДИТЕЛЬНОСТИ . . .
  // ====================================================================================================================
  // Может быть уже даже готовка к динамичному количеству частиц.
  var rainNumParticles = 10;
  var snowTimerValue = 120;
  var desiredNumberOfFireflies = 10;

  function setWeatherPerformanceMode() {
    rainNumParticles = settings.lowPerformanceMode ? 4 : 10;
    snowTimerValue = settings.lowPerformanceMode ? 240 : 120;
    desiredNumberOfFireflies = settings.lowPerformanceMode ? 6 : 10;

    return { rainNumParticles, snowTimerValue, desiredNumberOfFireflies };
  }

  setWeatherPerformanceMode();
  // ====================================================================================================================
  //   . . . ДОЖДЬ . . . 🌧️
  // ====================================================================================================================
  function generateRain() {
    const raindrops = [];

    setInterval(() => {
      if (currentWeather === "rain") {
        for (let i = 0; i < rainNumParticles; i++) {
          const raindrop = generateRaindrop();
          if (raindrop) {
            raindrops.push(raindrop);
          }
        }
      }
    }, 80);

    function generateRaindrop() {
      if (document.hidden) {
        return;
      }
      const x = Math.random() * weatherCanvas.width;
      const y = Math.random() * -100;
      const length = (Math.random() * 20 + 40) / weatherModifier;
      const width = (Math.random() * 1 + 1) / weatherModifier;
      const ySpeed = length * 0.2 * weatherModifier;
      const xSpeed = Math.random() * 1;

      return { x, y, length, width, ySpeed, xSpeed };
    }

    return { raindrops };
  }

  function drawRaindrop(raindrop) {
    weatherCtx.beginPath();
    weatherCtx.ellipse(
      raindrop.x,
      raindrop.y,
      raindrop.width,
      raindrop.length,
      0,
      Math.PI,
      2 * Math.PI
    );
    weatherCtx.fillStyle = "rgba(150, 150, 150, 0.4)";
    weatherCtx.fill();
  }
  // ====================================================================================================================
  //   . . . СНЕГ . . . 🌨️
  // ====================================================================================================================
  function generateSnowflakes() {
    const snowflakes = [];
    const snowTimerValue = setWeatherPerformanceMode().snowTimerValue;

    setInterval(() => {
      if (currentWeather === "snow") {
        for (let i = 0; i < 1; i++) {
          const snowflake = generateSnowflake();
          if (snowflake) {
            snowflakes.push(snowflake);
          }
        }
      }
    }, snowTimerValue);

    function generateSnowflake() {
      if (document.hidden) {
        return;
      }
      const y = Math.random() * -100;
      const x = Math.random() * weatherCanvas.width;
      const size = (Math.random() * 5 + 2) / weatherModifier;
      const ySpeed = size * 0.1 * weatherModifier;
      const xSpeed = (Math.random() - Math.random()) * 0.2;
      const opacity = 1;

      return { x, y, size, ySpeed, xSpeed, opacity };
    }

    return { snowflakes };
  }

  function drawSnowflake(x, y, size) {
    weatherCtx.beginPath();
    weatherCtx.ellipse(x, y, size, size, 0, 0, 2 * Math.PI);
    weatherCtx.fillStyle = "white";
    weatherCtx.fill();
  }
  // ====================================================================================================================
  //   . . . ПИКСЕЛЬНЫЙ ДОЖДЬ . . . 🌧️
  // ====================================================================================================================
  function generatePixelRain() {
    const pixelRaindrops = [];

    setInterval(() => {
      if (currentWeather === "pixelRain") {
        for (let i = 0; i < rainNumParticles; i++) {
          const pixelRaindrop = generatePixelRaindrop();
          if (pixelRaindrop) {
            pixelRaindrops.push(pixelRaindrop);
          }
        }
      }
    }, 80);

    function generatePixelRaindrop() {
      if (document.hidden) {
        return;
      }
      const x = Math.random() * weatherCanvas.width;
      const y = Math.random() * -100;
      const size = (Math.random() * 26 + 26) / Math.pow(weatherModifier, 0.5);
      const ySpeed = size * 0.2 * Math.pow(weatherModifier, 0.5);
      const xSpeed = Math.random() * 0.2 - 0.1;
      const imageData =
        images.pixelRain[Math.floor(Math.random() * images.pixelRain.length)];
      const image = imageData.image;

      return { x, y, size, ySpeed, xSpeed, image };
    }

    return { pixelRaindrops };
  }

  function drawPixelRaindrop(pixelRaindrop) {
    const imageWidth = pixelRaindrop.image.width;
    const imageHeight = pixelRaindrop.image.height;
    const scaleFactor = pixelRaindrop.size / Math.max(imageWidth, imageHeight);

    weatherCtx.drawImage(
      pixelRaindrop.image,
      pixelRaindrop.x,
      pixelRaindrop.y,
      imageWidth * scaleFactor,
      imageHeight * scaleFactor
    );
  }
  // ====================================================================================================================
  //   . . . ПИКСЕЛЬНЫЙ СНЕГ . . . 🌨️
  // ====================================================================================================================
  function generatePixelSnow() {
    const pixelSnowflakes = [];
    const snowTimerValue = setWeatherPerformanceMode().snowTimerValue;

    setInterval(() => {
      if (currentWeather === "pixelSnow") {
        for (let i = 0; i < 1; i++) {
          const pixelSnowflake = generatePixelSnowflake();
          if (pixelSnowflake) {
            pixelSnowflakes.push(pixelSnowflake);
          }
        }
      }
    }, snowTimerValue);

    function generatePixelSnowflake() {
      if (document.hidden) {
        return;
      }
      const y = Math.random() * -100;
      const x = Math.random() * weatherCanvas.width;
      const size = (Math.random() * 8 + 8) / Math.pow(weatherModifier, 0.8); // TODO - Протестить, сильно ли влияет Math.pow на производительность или нет
      const ySpeed = size * 0.1 * Math.pow(weatherModifier, 0.8) - 0.6;
      const xSpeed = (Math.random() - Math.random()) * 0.2;
      const imageData =
        images.pixelSnow[Math.floor(Math.random() * images.pixelSnow.length)];
      const image = imageData.image;
      const opacity = 1;

      return { x, y, size, ySpeed, xSpeed, image, opacity };
    }

    return { pixelSnowflakes };
  }

  function drawPixelSnowflake(x, y, size, image) {
    weatherCtx.drawImage(image, x - size / 2, y - size / 2, size, size);
  }
  // ====================================================================================================================
  //   . . . АНИМАЦИЯ ПОГОДЫ / ЧАСТИЦ . . .
  // ====================================================================================================================
  let lastTime = 0;

  function animateWeather() {
    const currentTime = performance.now();
    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    const baseSpeedMultiplier = 140;

    weatherCtx.clearRect(0, 0, weatherCanvas.width, weatherCanvas.height);

    if (raindrops.length > 0) {
      for (const raindrop of raindrops) {
        raindrop.y += raindrop.ySpeed * baseSpeedMultiplier * deltaTime;
        raindrop.x += raindrop.xSpeed * baseSpeedMultiplier * deltaTime;
        drawRaindrop(raindrop);
      }
    }

    if (snowflakes.length > 0) {
      for (const snowflake of snowflakes) {
        snowflake.y += snowflake.ySpeed * baseSpeedMultiplier * deltaTime;
        snowflake.x += snowflake.xSpeed * baseSpeedMultiplier * deltaTime;
        drawSnowflake(snowflake.x, snowflake.y, snowflake.size);
      }
    }

    if (pixelSnowflakes.length > 0) {
      for (const pixelSnowflake of pixelSnowflakes) {
        pixelSnowflake.y +=
          pixelSnowflake.ySpeed * baseSpeedMultiplier * deltaTime;
        pixelSnowflake.x +=
          pixelSnowflake.xSpeed * baseSpeedMultiplier * deltaTime;
        drawPixelSnowflake(
          pixelSnowflake.x,
          pixelSnowflake.y,
          pixelSnowflake.size,
          pixelSnowflake.image
        );
      }
    }

    if (pixelRaindrops.length > 0) {
      for (const pixelRaindrop of pixelRaindrops) {
        pixelRaindrop.y +=
          pixelRaindrop.ySpeed * baseSpeedMultiplier * deltaTime;
        pixelRaindrop.x +=
          pixelRaindrop.xSpeed * baseSpeedMultiplier * deltaTime;
        drawPixelRaindrop(pixelRaindrop);
      }
    }

    requestAnimationFrame(animateWeather);
  }

  if (settings.weatherEnabled || settings.manualWeatherPanel) {
    animateWeather();
  }
  // ====================================================================================================================
  //   . . . СЕВЕРНОЕ СИЯНИЕ . . . 🌟
  // ====================================================================================================================
  const auroraColors = {
    green: {
      1: "#aaff9d",
      2: "#00faa0",
      3: "#00ff62",
    },
    blue: {
      1: "#9DF5ED",
      2: "#82BBF5",
      3: "#725DFA",
    },
  };
  const auroras = [];

  function removeAurora(auroraElement) {
    auroraElement.style.animation = "auroraFadeOut 6s ease-in-out";

    setTimeout(() => {
      if (weatherContainer.contains(auroraElement)) {
        weatherContainer.removeChild(auroraElement);
        const index = auroras.indexOf(auroraElement);
        if (index > -1) {
          auroras.splice(index, 1);
        }
      } else {
        console.warn(
          "Element to be removed is not a child of weatherContainer."
        );
      }
    }, 6000);
  }

  function createAurora(color) {
    for (const auroraElement of auroras) {
      removeAurora(auroraElement);
    }

    const newAurora = document.createElement("div");

    newAurora.style.cssText = `
    transform: translate(0, 60%);
    z-index: -1;
    position: fixed;
    left: 0;
    width: 100%;
    height: 30%;
    filter: blur(4rem);
    animation: aurora-spin 15s linear infinite, auroraFadeIn 6s ease-in-out;
    background: conic-gradient(from var(--gradient-angle),
    ${auroraColors[color][1]},
    ${auroraColors[color][2]},
    ${auroraColors[color][3]},
    ${auroraColors[color][2]},
    ${auroraColors[color][1]});
    `;

    if (settings.auroraPos === "1") {
      newAurora.style.top = "-30%";
    } else if (settings.auroraPos === "2") {
      newAurora.style.bottom = "0";
    }

    weatherContainer.appendChild(newAurora);
    auroras.push(newAurora);
  }

  function toggleAurora() {
    if (settings.manualWeatherPanel) return;

    const isAuroraConditionMet =
      currentWeather === "northernLights" ||
      (currentWeather === "clear" &&
        currentHour === "night" &&
        (currentSeason === "autumn" || currentSeason === "winter"));

    if (isAuroraConditionMet) {
      if (auroras.length === 0) {
        const auroraColor = Math.random() > 0.5 ? "green" : "blue";
        createAurora(auroraColor);
      }
    } else {
      auroras.forEach(removeAurora);
    }
  }

  setInterval(() => {
    toggleAurora();
    if (!settings.manualWeatherPanel) {
      generateFirefliesNaturally();
    }
  }, 2000);
  // ====================================================================================================================
  //   . . . СВЕТЛЯЧКИ . . . 🪲
  // ====================================================================================================================
  const fireflies = [];
  const glowSizeMultiplier = 12;

  function generateFirefly() {
    const x = Math.random() * weatherCanvas.width;
    const y = Math.random() * weatherCanvas.height;
    const size = Math.random() * 5 + 10;
    const xSpeed = (Math.random() - 0.5) * 0.5;
    const ySpeed = (Math.random() - 0.5) * 0.5;

    const firefly = document.createElement("div");
    firefly.className = "firefly";
    firefly.style.left = x + "px";
    firefly.style.top = y + "px";
    firefly.style.width = size + "px";
    firefly.style.height = size + "px";

    const glow = document.createElement("div");
    glow.className = "firefly-glow";
    glow.style.left = x + "px";
    glow.style.top = y + "px";
    glow.style.width = size * glowSizeMultiplier + "px";
    glow.style.height = size * glowSizeMultiplier + "px";

    return { element: firefly, glowElement: glow, x, y, size, xSpeed, ySpeed };
  }

  function createNewFirefliesIfNeeded() {
    const missingFireflies = desiredNumberOfFireflies - fireflies.length;

    for (let i = 0; i < missingFireflies; i++) {
      const newFirefly = generateFirefly();
      fireflies.push(newFirefly);
      weatherContainer.appendChild(newFirefly.element);
      weatherContainer.appendChild(newFirefly.glowElement);
    }
  }

  function removeFireflies() {
    for (const firefly of fireflies) {
      weatherContainer.removeChild(firefly.element);
      weatherContainer.removeChild(firefly.glowElement);
    }
    fireflies.length = 0;
  }

  function toggleFireflies() {
    if (settings.manualWeatherPanel) {
      if (fireflies.length === 0) {
        for (let i = 0; i < desiredNumberOfFireflies; i++) {
          fireflies.push(generateFirefly());
          weatherContainer.appendChild(fireflies[i].element);
          weatherContainer.appendChild(fireflies[i].glowElement);
        }
      } else {
        for (const firefly of fireflies) {
          firefly.element.classList.add("firefly-disappearing");
          firefly.glowElement.classList.add("firefly-disappearing");
        }
        setTimeout(() => {
          removeFireflies();
        }, 6000);
      }
    }
  }

  function generateFirefliesNaturally() {
    if (
      currentWeather === "clear" &&
      currentHour === "night" &&
      currentSeason === "summer"
    ) {
      if (fireflies.length === 0) {
        for (let i = 0; i < desiredNumberOfFireflies; i++) {
          fireflies.push(generateFirefly());
          weatherContainer.appendChild(fireflies[i].element);
          weatherContainer.appendChild(fireflies[i].glowElement);
        }
      }
    } else {
      for (const firefly of fireflies) {
        firefly.element.classList.add("firefly-disappearing");
        firefly.glowElement.classList.add("firefly-disappearing");
      }
      setTimeout(() => {
        removeFireflies();
      }, 6000);
    }
  }

  function animateFireflies() {
    for (let i = fireflies.length - 1; i >= 0; i--) {
      const firefly = fireflies[i];
      firefly.x += firefly.xSpeed;
      firefly.y += firefly.ySpeed;

      if (firefly.x < 0 || firefly.x + firefly.size > weatherCanvas.width) {
        firefly.xSpeed *= -1;
      }
      if (firefly.y < 0 || firefly.y + firefly.size > weatherCanvas.height) {
        firefly.ySpeed *= -1;
      }

      firefly.element.style.left = firefly.x + "px";
      firefly.element.style.top = firefly.y + "px";

      firefly.glowElement.style.left =
        firefly.x - (firefly.size * glowSizeMultiplier) / 2 + "px";
      firefly.glowElement.style.top =
        firefly.y - (firefly.size * glowSizeMultiplier) / 2 + "px";

      createNewFirefliesIfNeeded();
    }

    requestAnimationFrame(animateFireflies);
  }

  if (settings.weatherEnabled || settings.manualWeatherPanel) {
    animateFireflies();
  }
  // ====================================================================================================================
  //   . . . ПРИЗЕМЛЕНИЕ ЧАСТИЦ . . . ☔
  // ====================================================================================================================
  const landedSnowflakes = [];
  const landedPixelSnowflakes = [];
  const splashes = [];
  const pixelSplashes = [];

  switch (true) {
    case settings.manualWeatherPanel && !settings.weatherDrops:
    case settings.weatherEnabled && !settings.weatherDrops:
      setInterval(() => {
        checkElements(raindrops, weatherContainer);
        checkElements(snowflakes, weatherContainer);
        checkElements(pixelSnowflakes, weatherContainer);
        checkElements(pixelRaindrops, weatherContainer);
      }, 120);
      break;

    case settings.manualWeatherPanel && settings.weatherDrops:
    case settings.weatherEnabled && settings.weatherDrops:
      animateLanding();
      break;

    default:
      break;
  }

  function checkElements(elements, container) {
    for (let i = elements.length - 1; i >= 0; i--) {
      const element = elements[i];

      if (
        element &&
        (element.y >= container.offsetHeight ||
          element.x >= container.offsetWidth ||
          element.x <= 0)
      ) {
        elements.splice(i, 1);
      }
    }
    // console.log(`Количество элементов: ${elements.length}`)
  }

  function animateLanding() {
    for (let i = snowflakes.length - 1; i >= 0; i--) {
      const snowflake = snowflakes[i];
      if (snowflake.y >= weatherCanvas.height - snowflake.size) {
        snowflakes.splice(i, 1);
        landedSnowflakes.push(snowflake);
      }
    }
    for (let i = pixelSnowflakes.length - 1; i >= 0; i--) {
      const pixelSnowflake = pixelSnowflakes[i];
      if (pixelSnowflake.y >= weatherCanvas.height - pixelSnowflake.size) {
        pixelSnowflakes.splice(i, 1);
        landedPixelSnowflakes.push(pixelSnowflake);
      }
    }
    for (let i = landedSnowflakes.length - 1; i >= 0; i--) {
      const snowflake = landedSnowflakes[i];
      snowflake.opacity -= 0.001;
      if (snowflake.opacity <= 0) {
        landedSnowflakes.splice(i, 1);
      }
    }
    for (const snowflake of landedSnowflakes) {
      weatherCtx.globalAlpha = snowflake.opacity;
      drawSnowflake(snowflake.x, snowflake.y, snowflake.size);
    }

    for (let i = landedPixelSnowflakes.length - 1; i >= 0; i--) {
      const pixelSnowflake = landedPixelSnowflakes[i];
      pixelSnowflake.opacity -= 0.001;

      if (pixelSnowflake.opacity <= 0) {
        landedPixelSnowflakes.splice(i, 1);
      }
    }
    for (const pixelSnowflake of landedPixelSnowflakes) {
      weatherCtx.globalAlpha = pixelSnowflake.opacity;
      drawPixelSnowflake(
        pixelSnowflake.x,
        pixelSnowflake.y,
        pixelSnowflake.size,
        pixelSnowflake.image
      );
    }

    for (let i = raindrops.length - 1; i >= 0; i--) {
      const raindrop = raindrops[i];
      if (raindrop.y >= weatherCanvas.height - raindrop.length) {
        raindrops.splice(i, 1);
        splashes.push(generateSplash(raindrop.x, weatherCanvas.height));
      }
    }

    for (let i = pixelRaindrops.length - 1; i >= 0; i--) {
      const pixelRaindrop = pixelRaindrops[i];
      if (pixelRaindrop.y >= weatherCanvas.height - pixelRaindrop.size) {
        pixelRaindrops.splice(i, 1);
        pixelSplashes.push(
          generateSplash(pixelRaindrop.x, weatherCanvas.height - 24)
        );
      }
    }

    for (const splash of splashes) {
      splash.x += splash.xSpeed;
      splash.y += splash.ySpeed;
      splash.ySpeed += 0.1;

      weatherCtx.beginPath();
      weatherCtx.arc(
        splash.x,
        splash.y,
        splash.size / 1.2 / weatherModifier,
        0,
        Math.PI * 2
      );
      weatherCtx.fillStyle = "rgba(150, 150, 150, 0.4)";
      weatherCtx.fill();
    }

    for (const pixelSplash of pixelSplashes) {
      pixelSplash.x += pixelSplash.xSpeed;
      pixelSplash.y += pixelSplash.ySpeed;
      pixelSplash.ySpeed += 0.1;
      weatherCtx.drawImage(
        pixelSplash.image,
        pixelSplash.x,
        pixelSplash.y,
        pixelSplash.size * weatherModifier * 2,
        pixelSplash.size * weatherModifier * 2
      );
    }

    checkSplashes();
    checkPixelSplashes();
    weatherCtx.globalAlpha = 1;
    requestAnimationFrame(animateLanding);
  }

  function generateSplash(x, y) {
    const size = Math.random() * 5 + 2;
    const xSpeed = (Math.random() - 0.5) * 2;
    const ySpeed = -Math.random() * 2 - 1;
    const imageData =
      images.pixelSplash[Math.floor(Math.random() * images.pixelSplash.length)];
    const image = imageData.image;

    return { x, y, size, xSpeed, ySpeed, image };
  }

  function checkSplashes() {
    for (let i = splashes.length - 1; i >= 0; i--) {
      const splash = splashes[i];
      if (
        splash.y >= weatherCanvas.height ||
        splash.x >= weatherCanvas.width ||
        splash.x <= 0
      ) {
        splashes.splice(i, 1);
      }
    }
    // console.log(`Количество сплешев: ${splashes.length}`)
  }
  function checkPixelSplashes() {
    for (let i = pixelSplashes.length - 1; i >= 0; i--) {
      const pixelSplash = pixelSplashes[i];
      if (
        pixelSplash.y >= weatherCanvas.height ||
        pixelSplash.x >= weatherCanvas.width ||
        pixelSplash.x <= 0
      ) {
        pixelSplashes.splice(i, 1);
      }
    }
  }
  // ====================================================================================================================
} // Конец грандиозного, но и начало чево то нового... Зогдачно......
// ====================================================================================================================
// 🦐✨🦐✨🦐✨🦐✨🦐✨🦐✨🦐✨🦐✨🦐✨🦐✨🦐✨🦐✨🦐✨🦐✨🦐✨🦐✨🦐✨🦐✨🦐✨🦐✨🦐✨🦐✨🦐✨
// ====================================================================================================================
//   . . . ТАРГЕТИНГ ОКНА ОХОТЫ И ПОДГОТОВКА КОНТЕЙНЕРОВ . . .
// ====================================================================================================================
if (targetCW3Hunt.test(window.location.href)) {
  amogusSus();
  const containerElement = document.querySelector("body");
  const globalContainerElement = document.createElement("div");
  globalContainerElement.id = "uwu-main-container";
  containerElement.appendChild(globalContainerElement);
  // ====================================================================================================================
  //   . . . ПОДПИСЫВАТЬ ЗАПАХ . . .
  // ====================================================================================================================
  if (settings.describeHuntingSmell) {
    const smellElement = document.getElementById("smell");
    let smellText = null;
    let smellTimer = null;
    let previousRed = null;
    let seconds = 0;

    function updateHintText(currentRed) {
      if (currentRed === 0) {
        smellText.textContent = "Потерян";
      } else if (previousRed !== null) {
        if (currentRed > previousRed) {
          smellText.textContent = "Ближе";
        } else if (currentRed < previousRed) {
          smellText.textContent = "Дальше";
        }
      } else {
        smellText.textContent = " ";
      }
      previousRed = currentRed;
    }

    function updateTimer() {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      smellTimer.textContent = `${String(minutes).padStart(2, "0")}:${String(
        remainingSeconds
      ).padStart(2, "0")}`;
      seconds++;
    }

    function handleSmellChange() {
      const style = window.getComputedStyle(smellElement);
      const currentColor = style.backgroundColor;

      if (
        currentColor !== "rgba(0, 0, 0, 0)" &&
        currentColor !== "transparent"
      ) {
        if (!smellText) {
          smellText = document.createElement("div");
          smellText.id = "smellText";
          smellTimer = document.createElement("div");
          smellTimer.id = "smellTimer";
          document.body.appendChild(smellText);
          document.body.appendChild(smellTimer);

          intervalId = setInterval(updateTimer, 1000);
        }

        const currentRed = parseInt(
          currentColor.slice(
            currentColor.indexOf("(") + 1,
            currentColor.indexOf(",")
          )
        );
        updateHintText(currentRed);
      }
    }

    new MutationObserver(handleSmellChange).observe(smellElement, {
      attributes: true,
      attributeFilter: ["style"],
    });

    const describeHuntingSmell = document.createElement("style");
    describeHuntingSmell.innerHTML = /* CSS */ `
  #smellText {
    font-size: 20px;
    background: white;
    color: black;
    text-align: center;
    width: 100px;
    position: absolute;
    z-index: 3;
    bottom: 60px;
  }
  
  #smellTimer {
    font-size: 18px;
    background: white;
    color: black;
    text-align: center;
    width: 100px;
    position: absolute;
    z-index: 3;
    bottom: 40px; 
  }
  `;
    document.head.appendChild(describeHuntingSmell);
  }
  // ====================================================================================================================
  //   . . . ВИРТУАЛЬНЫЙ ДЖОЙСТИК . . .
  // ====================================================================================================================
  // Работаем с сайтовым обработчиком нажатий: "//e.catwar.net/js/key.js?268881668"
  if (settings.huntingVirtualJoystick) {
    function createJoystick() {
      const joystickHTML = `
        <div id="joystick-container">
          <div id="joystick-base">
            <div id="joystick-head"></div>
          </div>
        </div>
      `;

      const uwuContainer = document.getElementById("uwu-main-container");
      uwuContainer.insertAdjacentHTML("beforeend", joystickHTML);

      const css =
        /* CSS */
        `
        #nav_buttons_wrapper {
          display: none;
        }
  
        #joystick-container {
          pointer-events: auto;
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: ${settings.sizeHuntingVirtualJoystick}px; 
          height: ${settings.sizeHuntingVirtualJoystick}px;
          z-index: 10; 
        }
  
        #joystick-base {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background-color: rgba(128, 128, 128, 0.5);
          position: relative;
        }
  
        #joystick-head {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: ${settings.sizeHuntingVirtualJoystick / 2}px;
          height: ${settings.sizeHuntingVirtualJoystick / 2}px;
          border-radius: 50%;
          background-color: #808080;
          touch-action: none; 
        }
      `;
      const style = document.createElement("style");
      style.innerHTML = css;
      document.head.appendChild(style);

      const joystickContainer = document.getElementById("joystick-container");
      const joystickHead = document.getElementById("joystick-head");
      const baseRadius = joystickContainer.offsetWidth / 2;
      let activeTouchId = null;
      let currentActiveKey = null;
      let keys = {};

      function handleTouchStart(event) {
        if (activeTouchId === null) {
          const touch = event.touches[0];
          activeTouchId = touch.identifier;
          updateJoystickPosition(touch.clientX, touch.clientY);
        }
      }

      function handleTouchMove(event) {
        event.preventDefault();
        for (let i = 0; i < event.touches.length; i++) {
          const touch = event.touches[i];
          if (touch.identifier === activeTouchId) {
            updateJoystickPosition(touch.clientX, touch.clientY);
            break;
          }
        }
      }

      function handleTouchEnd(event) {
        activeTouchId = null;
        resetJoystick();
        if (currentActiveKey) {
          simulateKeyRelease(currentActiveKey);
          currentActiveKey = null;
        }
      }

      function updateJoystickPosition(x, y) {
        const containerRect = joystickContainer.getBoundingClientRect();
        const deltaX = x - (containerRect.left + baseRadius);
        const deltaY = y - (containerRect.top + baseRadius);
        const angle = Math.atan2(deltaY, deltaX);
        const distance = Math.min(Math.hypot(deltaX, deltaY), baseRadius * 0.8);

        joystickHead.style.left = `${
          baseRadius + distance * Math.cos(angle)
        }px`;
        joystickHead.style.top = `${baseRadius + distance * Math.sin(angle)}px`;

        const threshold = 0.3;
        let newActiveKey = null;

        if (distance > baseRadius * threshold) {
          if (angle >= -Math.PI * 0.125 && angle < Math.PI * 0.125)
            newActiveKey = "d";
          else if (angle >= Math.PI * 0.125 && angle < Math.PI * 0.375)
            newActiveKey = "x";
          else if (angle >= Math.PI * 0.375 && angle < Math.PI * 0.625)
            newActiveKey = "s";
          else if (angle >= Math.PI * 0.625 && angle < Math.PI * 0.875)
            newActiveKey = "z";
          else if (angle >= Math.PI * 0.875 || angle < -Math.PI * 0.875)
            newActiveKey = "a";
          else if (angle >= -Math.PI * 0.875 && angle < -Math.PI * 0.625)
            newActiveKey = "q";
          else if (angle >= -Math.PI * 0.625 && angle < -Math.PI * 0.375)
            newActiveKey = "w";
          else if (angle >= -Math.PI * 0.375 && angle < -Math.PI * 0.125)
            newActiveKey = "e";
        }

        if (newActiveKey !== currentActiveKey) {
          if (currentActiveKey) {
            simulateKeyRelease(currentActiveKey);
          }
          if (newActiveKey) {
            simulateKeyPress(newActiveKey);
          }
          currentActiveKey = newActiveKey;
        }
      }

      function resetJoystick() {
        joystickHead.style.left = "50%";
        joystickHead.style.top = "50%";
      }

      // Оставим на будущее, вдруг пригодится.
      function releaseAllKeys() {
        for (const key in keys) {
          if (keys[key]) {
            simulateKeyRelease(key);
            keys[key] = false;
          }
        }
      }

      function simulateKeyPress(key) {
        const keyCode = Key.dict[key];
        if (keyCode && !Key.keys.includes(keyCode)) {
          Key.push(keyCode);
          const mockEvent = createMockEvent(keyCode);
          Key.keydown(mockEvent);
        }
      }

      function simulateKeyRelease(key) {
        const keyCode = Key.dict[key];
        if (keyCode) {
          const mockEvent = createMockEvent(keyCode);
          Key.keyup(mockEvent);
          const index = Key.keys.indexOf(keyCode);
          if (index > -1) {
            Key.keys.splice(index, 1);
          }
        }
      }

      function createMockEvent(keyCode) {
        return {
          keyCode: keyCode,
          ctrlKey: false,
          shiftKey: false,
          altKey: false,
          preventDefault: () => {},
          repeat: false,
        };
      }

      joystickContainer.addEventListener("touchstart", handleTouchStart);
      joystickContainer.addEventListener("touchmove", handleTouchMove);
      joystickContainer.addEventListener("touchend", handleTouchEnd);
      joystickContainer.addEventListener("touchcancel", handleTouchEnd);

      window.addEventListener("blur", function () {
        if (currentActiveKey) {
          simulateKeyRelease(currentActiveKey);
          currentActiveKey = null;
        }
        resetJoystick();
      });
    }

    createJoystick();
  }
  // ====================================================================================================================
}
// ====================================================================================================================
function amogusSus() {
  console.log("⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣤⣤⣤⣤⣤⣤⣤⣤⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀ ");
  console.log("⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣿⡿⠛⠉⠙⠛⠛⠛⠛⠻⢿⣿⣷⣤⡀⠀⠀⠀⠀⠀ ");
  console.log("⠀⠀⠀⠀⠀⠀⠀⠀⣼⣿⠋⠀⠀⠀⠀⠀⠀⠀⢀⣀⣀⠀⠈⢻⣿⣿⡄⠀⠀⠀⠀ ");
  console.log("⠀⠀⠀⠀⠀⠀⠀⣸⣿⡏⠀⠀⠀⣠⣶⣾⣿⣿⣿⠿⠿⠿⢿⣿⣿⣿⣄⠀⠀⠀ ");
  console.log("⠀⠀⠀⠀⠀⠀⠀⣿⣿⠁⠀⠀⢰⣿⣿⣯⠁⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⢿⣷⡄⠀ ");
  console.log("⠀⠀⣀⣤⣴⣶⣶⣿⡟⠀⠀⢸⣿⣿⣿⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣷⠀ ");
  console.log("⠀⢰⣿⡟⠋⠉⣹⣿⡇⠀⠀⠘⣿⣿⣿⣿⣷⣦⣤⣤⣤⣶⣶⣶⣶⣿⣿⣿⠀ ");
  console.log("⠀⢸⣿⡇⠀⠀⣿⣿⡇⠀⠀⠀⠀⠹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠃⠀ ");
  console.log("⠀⣸⣿⡇⠀⠀⣿⣿⡇⠀⠀⠀⠀⠀⠉⠻⠿⣿⣿⣿⣿⡿⠿⠿⠛⢻⣿⡇⠀⠀ ");
  console.log("⠀⣿⣿⠁⠀⠀⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣧⠀⠀ ");
  console.log("⠀⣿⣿⠀⠀⠀⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⠀⠀ ");
  console.log("⠀⣿⣿⠀⠀⠀⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⠀⠀ ");
  console.log("⠀⢿⣿⡆⠀⠀⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⡇⠀⠀ ");
  console.log("⠀⠸⣿⣧⡀⠀⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⠃⠀⠀ ");
  console.log("⠀⠀⠛⢿⣿⣿⣿⣿⣇⠀⠀⠀⠀⣰⣿⣿⣷⣶⣶⣶⣶⠶⠀⠀⢠⣿⣿⠀⠀⠀ ");
  console.log("⠀⠀⠀⠀⠀⠀⠀⣿⣿⠀⠀⠀⠀⠀⣿⣿⡇⠀⣽⣿⡏⠁⠀⠀⠀⢸⣿⡇⠀⠀⠀ ");
  console.log("⠀⠀⠀⠀⠀⠀⠀⣿⣿⠀⠀⠀⠀⠀⣿⣿⡇⠀⢹⣿⡆⠀⠀⠀⠀⣸⣿⠇⠀⠀⠀ ");
  console.log("⠀⠀⠀⠀⠀⠀⠀⢿⣿⣦⣄⣀⣠⣴⣿⣿⠁⠀⠈⠻⣿⣿⣿⣿⡿⠏⠀⠀⠀⠀ ");
  console.log("⠀⠀⠀⠀⠀⠀⠀⠈⠛⠻⠿⠿⠿⠿⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀");
}
// ====================================================================================================================
//   . . . ТАРГЕТИНГ БЛОГОВОЙ СТРАНИЦЫ . . .
// ====================================================================================================================
if (targetBlogsCreation.test(window.location.href)) {
  // ====================================================================================================================
  //   . . . ВОССТАНОВЛЕНИЕ БЛОГОВОГО ТЕКСТА . . .
  // ====================================================================================================================
  if (settings.restoreBlogCreation) {
    const textarea = document.getElementById("creation-text");

    function saveTextToStorage(text) {
      uwuStorage.setItem("uwu_blogCreation", text);
    }

    function restoreTextFromStorage() {
      const savedText = uwuStorage.getItem("uwu_blogCreation");
      if (savedText && !textarea.value) {
        textarea.value = savedText;
      }
    }

    textarea.addEventListener("input", () => {
      saveTextToStorage(textarea.value);
    });

    window.addEventListener("beforeunload", () => {
      saveTextToStorage(textarea.value);
    });

    restoreTextFromStorage();
  }
}

// ====================================================================================================================
//   . . . КНОПКИ BB-КОДОВ . . .
// ====================================================================================================================
if (settings.moreBBCodes) {
  function addBBCodeButtons() {
    const bbCodeContainers = document.querySelectorAll(".bbcode");

    const commonButtonsHTML =
      // html
      `
      <button class="bbcode" title="Абзац" data-code="p">p</button>
      <button class="bbcode" title="Перенос" data-code="br" data-parameter="0">br</button>
      <button class="bbcode" title="Таблица" data-code="table">table</button>
      <button class="bbcode" title="Строка таблицы" data-code="tr">tr</button>
      <button class="bbcode" title="Ячейка таблицы" data-code="td">td</button>
      <button class="bbcode" title="Нумерованный список" data-code="ol">ol</button>
      <button class="bbcode" title="Маркированный список" data-code="ul">ul</button>
      <button class="bbcode" title="Строка списка" data-code="li">li</button>
    `;

    const overblockButtonHTML = `
      <button class="bbcode" title="Раскрывающийся блок" data-code="overblock" data-parameter="1" data-text="Введите название раскрывающегося блока (то же, что и у заголовка, который раскрывает этот блок):">overblock</button>
    `;

    bbCodeContainers.forEach((bbCode) => {
      const container = bbCode.parentElement;
      if (!container) return;

      if (!container.querySelector('.bbcode[data-code="p"]')) {
        container.insertAdjacentHTML("beforeend", commonButtonsHTML);
      }

      const blockElement = container.querySelector('[data-code="block"]');
      if (
        blockElement &&
        !container.querySelector('.bbcode[data-code="overblock"]')
      ) {
        blockElement.insertAdjacentHTML("afterend", overblockButtonHTML);
      }
    });
  }

  setupSingleCallback(".bbcode", addBBCodeButtons);
}
// ====================================================================================================================
//   . . . ПРОФИЛЬ ИГРОКА . . .
// ====================================================================================================================
if (targetMainProfile.test(window.location.href)) {
  const idVal = document.getElementById("id_val");
  if (idVal) {
    const currentId = idVal.innerText.trim();
    let data = uwuStorage.getItem("uwu_personal") || {};

    if (!data.cats) data.cats = {};
    if (!data.slots) data.slots = [];

    data.lastActiveId = currentId;

    if (!data.cats[currentId]) {
      data.cats[currentId] = {
        id: currentId,
        name: "Кот " + currentId,
        img: "",
        size: "",
        costume: "",
      };
    }

    uwuStorage.setItem("uwu_personal", data);
    // console.log(
    //   `UwU | Профиль: ID игрока [${currentId}] сохранён как активный.`
    // );
  }
  // --------------------------------------------------------

  if (settings.calculators) {
    setupSingleCallback("#info", setupActivityCalc);
    setupSingleCallback("#info", moonCalculator);
  }
}
// ====================================================================================================================
//   . . . ПРОФИЛЯ ДРУГИХ ПОЛЬЗОВАТЕЛЕЙ . . .
// ====================================================================================================================
if (targetProfile.test(window.location.href)) {
  // ====================================================================================================================
  //   . . . БУ И ПРОЧЕЕ . . .
  // ====================================================================================================================
  if (settings.moreProfileInfo) {
    setupSingleCallback("tr:has(img[src='img/icon_kraft.png'])", addKraftLevel);

    function addKraftLevel() {
      const kraftLevels = {
        блоха: 0,
        котёночек: 1,
        задира: 2,
        "гроза детской": 3,
        "страх барсуков": 4,
        "победитель псов": 5,
        "защитник племени": 6,
        "великий воин": 7,
        "достоин Львиного племени": 8,
        идеальная: 9,
      };

      const kraftRow = document.querySelector(
        'tr:has(img[src="img/icon_kraft.png"])'
      );
      const kraftTextElement = kraftRow.querySelector("b");
      const kraftText = kraftTextElement.textContent.trim();
      const kraftLevel = kraftLevels[kraftText];
      if (kraftLevel !== undefined) {
        kraftTextElement.textContent = `${kraftText} (${kraftLevel})`;
      }
    }
  }

  if (settings.calculators) {
    setupSingleCallback("#info", moonCalculator);
  }
}

// ===================================================================================================================
// Калькуляторы возраста/лун и активности частично под авторством "CatWar Mod (Варомод) от Хвойницы"
// ====================================================================================================================
//   . . . КАЛЬКУЛЯТОР ВОЗРАСТА / ЛУН . . .
// ====================================================================================================================
function moonCalculator() {
  const months = [
    "января",
    "февраля",
    "марта",
    "апреля",
    "мая",
    "июня",
    "июля",
    "августа",
    "сентября",
    "октября",
    "ноября",
    "декабря",
  ];

  const catTimeStart = 1200000000000;

  const infoElement = document.getElementById("info");
  if (!infoElement) return;

  const style = document.createElement("style");
  style.textContent = `
    .calculator-error { color: darkred; }
    .hidden { display: none; }
    .calculator-style { max-width: 400px; margin: 5px; padding: 5px; border-radius: 10px; background: #ffffff08; }
  `;
  document.head.appendChild(style);

  let calculatorAgeElement = document.getElementById("calculator-age");
  if (!calculatorAgeElement) {
    infoElement.insertAdjacentHTML(
      "afterend",
      `<div id="calculator-age" class="calculator-style hidden"></div>`
    );
    calculatorAgeElement = document.getElementById("calculator-age");
  }

  const infoObserver = new MutationObserver((mutations) => {
    mutations.forEach(() => {
      if (!infoElement.textContent.match("Дата")) {
        calculatorAgeElement.classList.add("hidden");
        return;
      }

      calculatorAgeElement.classList.remove("hidden");

      const birthDateString = infoElement.textContent
        .match(/\d{4}-\d\d-\d\d \d\d:\d\d/)[0]
        .replace(" ", "T");
      const nowDateString = formatDate(new Date());

      const ageMoons = getMoonsFromElement("age_icon");
      const age2Moons = getMoonsFromElement("age2_icon");

      const avatarElement = document.querySelector('img[src^="/avatar/"]');
      const sex = avatarElement ? avatarElement.style.borderColor : null;
      const isRegistrationDate = /регистрац/.test(infoElement.textContent);
      const moonsNow = age2Moons
        ? isRegistrationDate
          ? ageMoons
          : age2Moons
        : ageMoons;

      const bornWord = getBornWord(sex, isRegistrationDate);
      const catTimeString = formatCatTime(
        Date.parse(birthDateString),
        moonsNow
      );

      calculatorAgeElement.innerHTML = `
        <p><b>Калькулятор возраста</b></p>
        <label>Дата и время: <input type="datetime-local" id="calculator-date" min="${birthDateString}" value="${nowDateString}" max="9999-12-31T23:59"></label> <span id="calculator-error-date" class="calculator-error"></span>
        <br><label>Возраст: <input type="number" id="calculator-moons" min="0" step="0.1" value="${moonsNow}" style="width: 60px"></label> <span id="moon-word"></span> <span id="calculator-error-moons" class="calculator-error"></span>
        <br>${bornWord} ${catTimeString} по кошачьему времени.
        <br><br>
      `;

      updateMoonWord(moonsNow);

      const calculatorDateElement = document.getElementById("calculator-date");
      const calculatorMoonsElement =
        document.getElementById("calculator-moons");

      calculatorDateElement.addEventListener("input", function () {
        handleDateInput.call(this, birthDateString);
      });

      calculatorMoonsElement.addEventListener("input", function () {
        handleMoonsInput.call(this, birthDateString);
      });
    });
  });

  infoObserver.observe(infoElement, { childList: true });

  function getMoonsFromElement(iconId) {
    const iconElement = document.querySelector(`img[id="${iconId}"]`);
    if (!iconElement) return 0;
    const ageElement = iconElement
      .closest("tr")
      .querySelector("td:nth-child(2) b");
    return parseFloat(ageElement.textContent);
  }

  function getBornWord(sex, isRegistrationDate) {
    const sexWords = {
      pink: ["Зарегистрировалась", "Родилась"],
      blue: ["Зарегистрировался", "Родился"],
      default: ["Зарегистрировалось", "Родилось"],
    };
    return isRegistrationDate
      ? sexWords[sex]
        ? sexWords[sex][0]
        : sexWords.default[0]
      : sexWords[sex]
      ? sexWords[sex][1]
      : sexWords.default[1];
  }

  function formatDate(date) {
    const pad = (num) => String(num).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate()
    )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  function formatCatTime(birthTimestamp, moons) {
    const daysToAdd = moons * 4;
    const targetDate = new Date(
      birthTimestamp + daysToAdd * 24 * 60 * 60 * 1000
    );
    const ms = birthTimestamp - catTimeStart;
    let time = Math.round((ms / 1000) * 7);
    const secInYear = 12 * 28 * 24 * 60 * 60;
    const secInMonth = 28 * 24 * 60 * 60;
    const year = Math.floor(time / secInYear);
    time -= year * secInYear;
    const month = Math.floor(time / secInMonth);
    time -= month * secInMonth;
    const day = Math.floor(time / (24 * 60 * 60)) + 1;
    time -= (day - 1) * 24 * 60 * 60;
    const hour = Math.floor(time / (60 * 60));
    time -= hour * 60 * 60;
    const minute = Math.floor(time / 60);
    const pad = (num) => String(num).padStart(2, "0");
    return `${day} ${months[month]} ${year} года в ${pad(hour)}:${pad(minute)}`;
  }

  function handleDateInput(birthDateString) {
    const dateString = this.value;
    const date = Date.parse(dateString);
    const errorDateElement = document.getElementById("calculator-error-date");
    errorDateElement.textContent = "";

    if (isNaN(date) || date < Date.parse(birthDateString)) {
      errorDateElement.textContent = "Ошибка!";
      return;
    }

    const moons = getMoonsFromDate(birthDateString, dateString);
    const calcMoonsElement = document.getElementById("calculator-moons");
    if (calcMoonsElement) {
      calcMoonsElement.value = moons;
      updateMoonWord(moons);
      const catTimeString = formatCatTime(Date.parse(birthDateString), moons);
      document.querySelector(
        "br"
      ).nextSibling.textContent = `${catTimeString} по кошачьему времени.`;
    }
    updateMoonWord(moons);
  }

  function handleMoonsInput(birthDateString) {
    const moons = Number(this.value);
    const errorMoonsElement = document.getElementById("calculator-error-moons");
    errorMoonsElement.textContent = "";

    if (moons < 0 || isNaN(moons)) {
      errorMoonsElement.textContent = "Ошибка!";
      return;
    }

    const calcDateElement = document.getElementById("calculator-date");
    if (calcDateElement) {
      calcDateElement.value = getDateStringFromMoons(birthDateString, moons);
      updateMoonWord(moons);
      const catTimeString = formatCatTime(Date.parse(birthDateString), moons);
      document.querySelector(
        "br"
      ).nextSibling.textContent = `${catTimeString} по кошачьему времени.`;
    }
    updateMoonWord(moons);
  }

  function getMoonsFromDate(birthDateString, dateString) {
    const birthday = Date.parse(birthDateString);
    const date = Date.parse(dateString);
    const moons =
      Math.floor(((date - birthday) / (1000 * 60 * 60 * 24 * 4)) * 10) / 10;
    return moons;
  }

  function getDateStringFromMoons(birthDateString, moons) {
    const birthday = Date.parse(birthDateString);
    const age = Math.round(moons * 4 * 24 * 60 * 60 * 1000);
    return formatDate(new Date(birthday + age));
  }

  function updateMoonWord(moons) {
    const integerMoons = Math.floor(moons);
    document.getElementById("moon-word").textContent = declOfNum(integerMoons, [
      "луна",
      "луны",
      "лун",
    ]);
  }

  function declOfNum(number, titles) {
    const cases = [2, 0, 1, 1, 1, 2];
    return titles[
      number % 100 > 4 && number % 100 < 20
        ? 2
        : cases[number % 10 < 5 ? number % 10 : 5]
    ];
  }
}
// ====================================================================================================================
//   . . . КАЛЬКУЛЯТОР АКТИВНОСТИ . . .
// ====================================================================================================================
// TODO - Переписать, сделать рефакторинг и как-то объединить и упростить код с калькулятором выше.
function setupActivityCalc() {
  const catId = document.getElementById("id_val").textContent;

  const activityStages = [
    { name: "пустое место", fromZero: -5000 },
    { name: "подлежащий удалению", fromZero: -5000 },
    { name: "покинувший игру", fromZero: -2000 },
    { name: "забывший про игру", fromZero: -1000 },
    { name: "забытый кот", fromZero: -750 },
    { name: "ужаснейшая", fromZero: -500 },
    { name: "ужасная", fromZero: -300 },
    { name: "ухудшающаяся", fromZero: -150 },
    { name: "отрицательная", fromZero: -50 },
    { name: "переходная", fromZero: -5 },
    { name: "положительная", fromZero: 5 },
    { name: "улучшающаяся", fromZero: 50 },
    { name: "замечательная", fromZero: 150 },
    { name: "переход 2 мин 15 с", fromZero: 225 },
    { name: "замечательнейшая", fromZero: 300 },
    { name: "переход 2 мин", fromZero: 450 },
    { name: "любимый кот", fromZero: 500 },
    { name: "переход 1 мин 45 с", fromZero: 675 },
    { name: "легенда сайта", fromZero: 750 },
    { name: "переход 1 мин 30 с", fromZero: 900 },
    { name: "ходячий миф", fromZero: 1000 },
    { name: "переход 1 мин 15 с", fromZero: 1125 },
    { name: "переход 1 мин", fromZero: 1350 },
    { name: "переход 45 c", fromZero: 1575 },
    { name: "император Игровой", fromZero: 2000 },
    { name: "частичка Игровой", fromZero: 5000 },
    { name: "хранитель Игровой", fromZero: 20000 },
    { name: "идеальная", fromZero: 75000 },
    { name: "сверхидеальная", fromZero: 150000 },
  ];

  const months = [
    "января",
    "февраля",
    "марта",
    "апреля",
    "мая",
    "июня",
    "июля",
    "августа",
    "сентября",
    "октября",
    "ноября",
    "декабря",
  ];

  const activitySettings = uwuStorage.getItem("uwu_activity") || {};

  if (!activitySettings[catId]) {
    activitySettings[catId] = { hours: 24, opened: false };
  }

  if (activitySettings[catId].actgoal) {
    activityStages.forEach(function (stage, index) {
      if (index && Number(activitySettings[catId].actgoal) === stage.fromZero) {
        activitySettings[catId].goal = index;
        delete activitySettings[catId].actgoal;
      }
    });
  }

  function calculateActivityLength(days) {
    const minus = activitySettings[catId].minus || 0;
    if (days <= 14) return 150 - minus;
    else if (days >= 1575) return 45 - minus;
    else return Math.ceil(150 - days / 15) - minus;
  }

  function calculateRemainingTime(currentActivity, goal, hoursPerDay) {
    if (currentActivity >= goal) {
      return { actions: 0, time: "0 с", date: "уже достигнута" };
    }

    const secondsPerDay = convertTime("h s", hoursPerDay);
    if (calculateActivityLength(currentActivity) * 4 + 1 > secondsPerDay) {
      return { actions: "∞", time: "∞", date: "никогда" };
    }

    const actionsWithoutDecrease = goal - currentActivity;
    let days = 0;
    let secondsToday = 0;

    while (currentActivity < goal) {
      secondsToday = 0;
      while (secondsToday < secondsPerDay) {
        currentActivity++;
        secondsToday += calculateActivityLength(currentActivity);
        if (currentActivity >= goal) break;
      }
      if (currentActivity >= goal) break;
      days++;
      currentActivity -= 4.8;
    }

    const actionsDecrease = Math.floor(
      days * 4.8 + convertTime("s h", secondsToday) / 5
    );
    const totalTime = secondsPerDay * days + secondsToday;

    const now = new Date();
    const tomorrow = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1
    );
    const secondsToTomorrow = convertTime("ms s", tomorrow - now);
    if (days === 0 && secondsToday > secondsToTomorrow) days++;

    const targetDate = new Date(Date.now() + convertTime("d ms", days));

    return {
      actions: actionsWithoutDecrease + actionsDecrease,
      time: secondsToTime(totalTime),
      date:
        targetDate.getDate() +
        " " +
        months[targetDate.getMonth()] +
        " " +
        targetDate.getFullYear(),
    };
  }

  function updateGoalProgress() {
    if (progress.stage === activityStages.length - 1) {
      document.getElementById("goal-progress").style.display = "none";
      return;
    }
    const goalIndex = Number(document.getElementById("activity-list").value);
    const result = calculateRemainingTime(
      progress.doneFromZero,
      activityStages[goalIndex].fromZero,
      activitySettings[catId].hours
    );
    document.querySelector("#goal-progress > ul").innerHTML = `
      <li>${result.actions} ${declensionOfNumber(result.actions, [
      "переход",
      "перехода",
      "переходов",
    ])} (${result.time})</li>
      <li>будет достигнута ${result.date}</li>
    `;
  }

  const activity = document
    .querySelector("#act_name b")
    .textContent.split(" (");
  const progress = {};

  const currentStage = activityStages.find(
    (stage) => stage.name === activity[0]
  );

  if (currentStage) {
    progress.doneFromZero =
      currentStage.fromZero + Number(activity[1].split("/")[0]);
    progress.stage = activityStages.indexOf(currentStage);
  }

  const activityInfoHTML =
    // html
    `
      <details id="calculator-activity" class="calculator-style">
        <summary id="open-calculator"><b>Калькулятор активности</b></summary>
        <div id="calculator-content" style="margin-top: 10px;">
          <p id="congratulations" style="display:none"></p>
          <div id="activity-length"><b>Переход</b>: ${secondsToTime(
            calculateActivityLength(progress.doneFromZero)
          )}</div>
          <div>Мой переход изменён на <input id="minus" type="number" value="${
            activitySettings[catId].minus || 0
          }" min="-60" max="10" step="1" style="width: 50px;"> <span id="minus-word"></span></nobr></div>
          <div>Я качаю активность <input id="hours-per-day" type="number" step="0.25" min="0" max="24" value="${
            activitySettings[catId].hours
          }" style="width: 60px"> <span id="hour-word"></span> в сутки</div>
          <div id="goal-progress">
            <b>Цель: <select style="display: inline" id="activity-list"></select></b>:
            <ul style="margin: 0.5em"></ul>
          </div>
          <div id="to-fall-container" style="display: none;">Переход начнёт падать <span id="to-fall"></span></div>
        </div>
      </details>
    `;

  document
    .getElementById("info")
    .insertAdjacentHTML("afterend", activityInfoHTML);

  if (activitySettings[catId].opened) {
    document.getElementById("calculator-activity").open = true;
  }

  for (let i = progress.stage + 1; i < activityStages.length; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = activityStages[i].name;
    document.getElementById("activity-list").appendChild(option);
  }

  function showCongratulations() {
    const activityList = document.getElementById("activity-list");
    const nextGoalName = activityList.options[activityList.selectedIndex].text;

    document.getElementById("congratulations").innerHTML =
      /* HTML */
      `
        Цель
        <b>«${activityStages[activitySettings[catId].goal].name}»</b>
        достигнута!
        <br />
        Ваша новая цель: <b>«${nextGoalName}»</b>
        <center><img src="/img/stickers/systempaw3/6.png" /></center>
        <input id="congratulations-button" type="button" value="Скрыть" />
        <br /><input id="never-show-congratulations" type="checkbox" /> Больше
        не поздравлять на этом персонаже
      `;

    document.getElementById("congratulations").style.display = "block";
    document
      .getElementById("congratulations-button")
      .addEventListener("click", function () {
        document.getElementById("congratulations").style.display = "none";
        activitySettings[catId].goal = Number(
          document.getElementById("activity-list").value
        );
        activitySettings[catId].noGrats = document.getElementById(
          "never-show-congratulations"
        ).checked;
        saveData(activitySettings);
      });
  }

  if (
    activitySettings[catId].goal > progress.stage ||
    activitySettings[catId].noGrats
  ) {
    const goalOption = document.querySelector(
      `#activity-list > [value="${activitySettings[catId].goal}"]`
    );
    if (goalOption) {
      goalOption.selected = true;
    }
  } else if (activitySettings[catId].goal) {
    showCongratulations();
  }

  if (activitySettings[catId].minus) {
    document.getElementById("minus").value = activitySettings[catId].minus;
  }

  const hours = activitySettings[catId].hours;
  const minusValue = activitySettings[catId].minus || 0;

  updateHourWord(hours);
  updateGoalProgress();
  updateMinusWord(minusValue);

  if (calculateActivityLength(progress.doneFromZero) !== 45) {
    document.getElementById("to-fall-container").style.display = "none";
  } else {
    const timeFall = new Date(
      Date.now() + (progress.doneFromZero - 1575) * 5 * 3600000
    );
    document.getElementById("to-fall").innerHTML =
      timeFall.getDate() +
      " " +
      months[timeFall.getMonth()] +
      " " +
      timeFall.getFullYear();
    document.getElementById("to-fall-container").style.display = "block";
  }

  document.getElementById("minus").addEventListener("change", function () {
    activitySettings[catId].minus = this.value;
    saveData(activitySettings);
    updateGoalProgress();
    document.getElementById(
      "activity-length"
    ).innerHTML = `<b>Переход</b>: ${secondsToTime(
      calculateActivityLength(progress.doneFromZero)
    )}`;
    updateMinusWord(this.value);
  });

  document
    .getElementById("activity-list")
    .addEventListener("change", function () {
      activitySettings[catId].goal = Number(this.value);
      saveData(activitySettings);
      updateGoalProgress();
    });

  document
    .getElementById("hours-per-day")
    .addEventListener("input", function () {
      const hours = Number(this.value);
      if (hours < 0 || hours > 24 || !Number.isInteger(hours * 1000)) {
        this.value = activitySettings[catId].hours;
        return;
      }
      activitySettings[catId].hours = hours;
      saveData(activitySettings);
      updateHourWord(hours);
      updateGoalProgress();
    });

  document
    .getElementById("open-calculator")
    .addEventListener("click", function () {
      activitySettings[catId].opened = !document.getElementById(
        "calculator-activity"
      ).open;
      saveData(activitySettings);
    });

  function saveData(data) {
    uwuStorage.setItem("uwu_activity", data);
  }

  function declensionOfNumber(number, titles) {
    const cases = [2, 0, 1, 1, 1, 2];
    const intNumber = Math.floor(Math.abs(number));
    return titles[
      intNumber % 100 > 4 && intNumber % 100 < 20
        ? 2
        : cases[intNumber % 10 < 5 ? intNumber % 10 : 5]
    ];
  }

  function convertTime(from, value) {
    const factors = {
      ms: 1,
      s: 1000,
      m: 60000,
      h: 3600000,
      d: 86400000,
    };
    const [fromUnit, toUnit] = from.split(" ");
    return (value * factors[fromUnit]) / factors[toUnit];
  }

  function secondsToTime(seconds) {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    let result = "";
    if (days > 0) result += `${days} д `;
    if (hours > 0) result += `${hours} ч `;
    if (minutes > 0) result += `${minutes} мин `;
    if (secs > 0 || result === "") result += `${secs} с`;
    return result.trim();
  }

  function updateHourWord(hours) {
    document.getElementById("hour-word").textContent = declensionOfNumber(
      hours,
      ["час", "часа", "часов"]
    );
  }

  function updateMinusWord(minusValue) {
    document.getElementById("minus-word").textContent = declensionOfNumber(
      minusValue,
      ["секунду", "секунды", "секунд"]
    );
  }
}
// ====================================================================================================================
//   . . . ПИСЬМА . . .
// ====================================================================================================================
if (targetLs.test(window.location.href)) {
  if (settings.lsWrapPreview) {
    setupMutationObserver("#main", setupPreviewButton, {
      childList: true,
      subtree: true,
    });
  }
}
// ====================================================================================================================
//   . . . БЛОГИ . . .
// ====================================================================================================================
if (targetBlog.test(window.location.href)) {
  if (settings.commentPreview) {
    setupMutationObserver("#site_table", addCommentPreview);
  }

  if (settings.moreCommentButtons) {
    setupMutationObserver("#view_comments", addCommentButtons, {
      childList: true,
      subtree: true,
    });
    setupSingleCallback("#view_comments", handleCommentActions);
  }
}

// ====================================================================================================================
//   . . . ЛЕНТА . . .
// ====================================================================================================================
if (targetSniff.test(window.location.href)) {
  if (settings.commentPreview) {
    setupMutationObserver("#site_table", addCommentPreview);
  }

  if (settings.moreCommentButtons) {
    setupMutationObserver("#view_comments", addCommentButtons, {
      childList: true,
      subtree: true,
    });
    setupSingleCallback("#view_comments", handleCommentActions);
  }
}

// ====================================================================================================================
//   . . . ПРЕДПРОСМОТР КОММЕНТАРИЯ . . .
// ====================================================================================================================
function addCommentPreview() {
  const form = document.querySelector("#send_comment_form");
  if (!form || document.getElementById("comment-preview")) return;

  const lastParagraph = form.querySelector("p:last-child");
  lastParagraph.insertAdjacentHTML(
    "afterbegin",
    `
    <input type="button" id="comment-preview" value="Предпросмотр"> 
    `
  );

  form.insertAdjacentHTML(
    "afterend",
    `
    <p id="comment-preview-hide" style="display: none; margin: 0.5em 0;"><a href="#">Скрыть предпросмотр</a></p>
    <div id="comment-preview-div" style="display: none;"></div>
    `
  );

  const previewButton = document.getElementById("comment-preview");
  const hideParagraph = document.getElementById("comment-preview-hide");
  const previewDiv = document.getElementById("comment-preview-div");

  const ws = io(window.location.origin, {
    path: "/ws/blogs/socket.io",
    reconnectionDelay: 10000,
    reconnectionDelayMax: 20000,
  });

  ws.on("creation preview", (data) => {
    previewDiv.innerHTML = data;
    previewDiv.style.display = "block";
    hideParagraph.style.display = "block";
  });

  previewButton.addEventListener("click", function () {
    const commentText = document.getElementById("comment").value;
    ws.emit("creation preview", commentText);
  });

  form
    .querySelector('[type="submit"]')
    .addEventListener("click", hideCommentPreview);
  hideParagraph.addEventListener("click", function (e) {
    e.preventDefault();
    hideCommentPreview();
  });

  function hideCommentPreview() {
    hideParagraph.style.display = "none";
    previewDiv.innerHTML = "";
    previewDiv.style.display = "none";
  }
}
// ====================================================================================================================
//   . . . КНОПКИ ОТВЕТИТЬ И ЦИТИРОВАТЬ . . .
// ====================================================================================================================
function addCommentButtons() {
  const comments = document.querySelectorAll("#view_comments .view-comment");
  comments.forEach((comment) => {
    if (!comment.querySelector(".comment-answer-buttons")) {
      comment.insertAdjacentHTML(
        "beforeend", // html
        `
              <p class="comment-answer-buttons">
                  <a class="comment-answer" href="#">Ответить</a>
                  <span class="comment-cite-wrap"> | <a class="comment-cite" href="#">Цитировать</a></span>
              </p>
          `
      );
    }
  });
}

function getCommentInfo(comment) {
  const commentId = comment.getAttribute("data-id");
  const commentNum = comment.querySelector(".num").textContent;
  const authorLink = comment.querySelector(".comment-info a.author");
  const authorSpan = comment.querySelector(".comment-info span[data-id]");
  const authorName = authorLink
    ? authorLink.textContent
    : authorSpan
    ? authorSpan.textContent
    : "...";
  const authorProfile = authorLink
    ? authorLink.getAttribute("href").replace("/cat", "")
    : null;
  const commentText = comment.querySelector(".comment-text .parsed").innerText;
  const commentInfo = comment.querySelector(".comment-info");
  const commentTime = commentInfo.innerHTML
    .split("</b>")[1]
    .split(" @")[0]
    .trim();

  return {
    commentId,
    commentNum,
    authorName,
    authorProfile,
    commentText,
    commentTime,
  };
}

function handleAnswerAction(commentInfo) {
  const textarea = document.getElementById("comment");
  const currentText = textarea.value;
  const newText = commentInfo.authorProfile
    ? `[link${commentInfo.authorProfile}] (#${commentInfo.commentNum}), `
    : `[b][code]${commentInfo.authorName}[/code][/b] (#${commentInfo.commentNum}), `;

  textarea.value = currentText + newText;
}

function handleCiteAction(commentInfo) {
  const selectedText = window.getSelection().toString().trim();
  const quoteText = selectedText ? selectedText : commentInfo.commentText;
  const profileLink = commentInfo.authorProfile
    ? `[link${commentInfo.authorProfile}]`
    : commentInfo.authorName;

  const quote = `[table][tr][td][size=10][i]Цитата:[/i] [b]#${commentInfo.commentNum}[/b] ${commentInfo.commentTime} @ ${profileLink}[/size][/td][/tr][tr][td][table=0][tr][td]  [/td][td]${quoteText}[/td][/tr][/table][/td][/tr][/table]`;

  const textarea = document.getElementById("comment");
  const currentText = textarea.value;
  textarea.value = currentText + quote;
}

function handleCommentActions() {
  const viewComments = document.getElementById("view_comments");

  viewComments.addEventListener("click", function (event) {
    const target = event.target;
    const actionMap = {
      "comment-answer": handleAnswerAction,
      "comment-cite": handleCiteAction,
    };

    for (const className in actionMap) {
      if (target.classList.contains(className)) {
        event.preventDefault();
        const comment = target.closest(".view-comment");
        const commentInfo = getCommentInfo(comment);
        actionMap[className](commentInfo);
        break;
      }
    }
  });
}

// ====================================================================================================================
//   . . . КРАСИВЫЙ ПРЕДПРОСМОТР ПИСЬМА . . .
// ====================================================================================================================
function setupPreviewButton() {
  const previewButton = document.getElementById("preview");
  if (previewButton) {
    previewButton.addEventListener("click", wrapPreviewInTable);
  }
}

function wrapPreviewInTable() {
  const previewDiv = document.getElementById("preview_div");
  if (!previewDiv) return;

  const mainElement = document.getElementById("main");
  const senderId = mainElement.getAttribute("data-id");
  const senderLogin = mainElement.getAttribute("data-login");
  const subject = document.getElementById("subject").value;
  const currentDate = new Date().toLocaleString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const newTable = document.createElement("table");
  newTable.border = "1";
  newTable.style.width = "90%";
  newTable.style.maxWidth = "500px";

  newTable.innerHTML =
    // html
    `
      <tbody>
          <tr><td id="preview-subject" colspan="2">${subject}</td></tr>
          <tr>
              <td valign="top" id="msg_info">
                  Отправитель: <span id="preview-sender"><a href="cat${senderId}">${senderLogin}</a></span>
                  <br>${currentDate}
                  <br>Переписка: <u><big><b>+</b></big></u> …
              </td>
              <td id="preview-text">${previewDiv.outerHTML}</td>
          </tr>
      </tbody>
  `;

  const existingTable = document.querySelector("table");
  if (existingTable) {
    existingTable.parentNode.replaceChild(newTable, existingTable);
  } else {
    previewDiv.parentNode.insertBefore(newTable, previewDiv);
    previewDiv.style.display = "none";
  }
}

// ====================================================================================================================
//   . . . ШАБЛОНЫ . . .
// ====================================================================================================================
function initializeTemplates() {
  if (!settings.showTemplates) return;

  const templateContainer =
    /* HTML */
    `
      <div id="uwu-templates">
        <h2>ШАБЛОНЫ</h2>
        <div id="uwu-templates-list"></div>
        <div class="button-container">
          <button id="create-template-button" class="uwu-button install-button">
            Создать шаблон ✎
          </button>
        </div>
      </div>
    `;

  const templateItem =
    /* HTML */
    `
      <div class="uwu-template-item">
        <div class="template-name-container">
          <span class="template-name"></span>
          <button
            class="rename-button uwu-button install-button"
            title="Переименовать шаблон"
          >
            ✎
          </button>
        </div>
        <div class="template-actions-container">
          <button
            class="update-button uwu-button install-button"
            title="Обновить шаблон"
          >
            ↻
          </button>
          <button
            class="remove-button uwu-button install-button"
            title="Удалить шаблон"
          >
            X
          </button>
        </div>
      </div>
    `;

  const cssStyles =
    /* CSS */
    `
      #uwu-templates {
        font-family: Montserrat;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 20px;
        background-color: #242424;
        margin-bottom: 5px;
        margin-top: 5px;
        color: #d5d5d5;
      }
      
      #uwu-templates > h2 {
        font-size: 2em;
        text-align: center;
        margin-top: 10px;
        margin-bottom: 10px;
        letter-spacing: 20px;
      }

      #uwu-templates-list {
        max-height: 220px;
        overflow-x: auto;
        border-radius: 20px;
        background-color: #2e2e2e;
      }

      .uwu-template-item {
        padding-left: 10px;
        padding-right: 10px;
        padding-top: 5px;
        padding-bottom: 5px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      #uwu-templates > div.button-container {
        display: flex;
        justify-content: flex-end;
        padding-left: 10px;
        padding-right: 4px;
        padding-top: 5px;
        padding-bottom: 5px;
      }

      .template-name {
        cursor: pointer;
        text-decoration: underline;
      }

      .uwu-button {
        background-color: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.1);
        padding: 5px 10px;
        border-radius: 20px;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }
      
      .uwu-button:hover {
        background-color: rgba(255, 255, 255, 0.2);
      }
  `;

  document.head.insertAdjacentHTML("beforeend", `<style>${cssStyles}</style>`);

  function setupTemplates(
    targetElementId,
    contentElementId,
    subjectElementId = null,
    pageType
  ) {
    const targetElement = document.getElementById(targetElementId);

    if (!document.getElementById("uwu-templates")) {
      if (targetElementId === "mess_form") {
        targetElement.insertAdjacentHTML("beforeend", templateContainer);
      } else {
        targetElement.insertAdjacentHTML("afterbegin", templateContainer);
      }
    }

    const templatesList = document.getElementById("uwu-templates-list");
    const createButton = document.getElementById("create-template-button");

    createButton.addEventListener("click", (event) => {
      event.preventDefault();
      createTemplate(contentElementId, subjectElementId, pageType);
    });

    function createTemplate(contentElementId, subjectElementId, pageType) {
      const templateName = prompt("Введите название шаблона:");
      if (templateName) {
        const template = {
          name: templateName,
          content:
            document.getElementById(contentElementId).innerText ||
            document.getElementById(contentElementId).value,
          subject: subjectElementId
            ? document.getElementById(subjectElementId).value || ""
            : "",
          pageType: pageType,
        };
        saveTemplate(template);
        renderTemplates(pageType);
      }
    }

    function saveTemplate(template) {
      if (!uwuStorage.getItem("uwu_templates")) {
        uwuStorage.setItem("uwu_templates", []);
      }
      const templates = uwuStorage.getItem("uwu_templates");
      templates.push(template);
      uwuStorage.setItem("uwu_templates", templates);
    }

    function renderTemplates(pageType) {
      const templates = uwuStorage.getItem("uwu_templates") || [];
      templatesList.innerHTML = "";

      templates.forEach((template, index) => {
        if (template.pageType === pageType) {
          const templateItemHTML = document.createElement("div");
          templateItemHTML.innerHTML = templateItem;
          const templateItemElement = templateItemHTML.children[0];

          const templateName =
            templateItemElement.querySelector(".template-name");
          templateName.textContent = template.name;
          templateName.addEventListener("click", () => {
            if (document.getElementById(contentElementId).tagName === "DIV") {
              document.getElementById(contentElementId).innerText =
                template.content;
            } else {
              document.getElementById(contentElementId).value =
                template.content;
            }
            if (subjectElementId) {
              document.getElementById(subjectElementId).value =
                template.netbject || "";
            }
          });

          const renameButton =
            templateItemElement.querySelector(".rename-button");
          renameButton.addEventListener("click", () => renameTemplate(index));

          const updateButton =
            templateItemElement.querySelector(".update-button");
          updateButton.addEventListener("click", () =>
            updateTemplate(index, contentElementId, subjectElementId)
          );

          const removeButton =
            templateItemElement.querySelector(".remove-button");
          removeButton.addEventListener("click", () => removeTemplate(index));

          templatesList.appendChild(templateItemElement);
        }
      });
    }

    function renameTemplate(index) {
      const newName = prompt("Введите новое название шаблона:");
      if (newName) {
        const templates = uwuStorage.getItem("uwu_templates");
        templates[index].name = newName;
        uwuStorage.setItem("uwu_templates", templates);
        renderTemplates(pageType);
      }
    }

    function updateTemplate(index, contentElementId, subjectElementId) {
      const templates = uwuStorage.getItem("uwu_templates");
      if (document.getElementById(contentElementId).tagName === "DIV") {
        templates[index].content =
          document.getElementById(contentElementId).innerText;
      } else {
        templates[index].content =
          document.getElementById(contentElementId).value;
      }
      if (subjectElementId) {
        templates[index].netbject =
          document.getElementById(subjectElementId).value || "";
      }
      uwuStorage.setItem("uwu_templates", templates);
      renderTemplates(pageType);
    }

    function removeTemplate(index) {
      const confirmation = confirm(
        "Вы уверены, что хотите удалить этот шаблон?"
      );
      if (confirmation) {
        const templates = uwuStorage.getItem("uwu_templates");
        templates.splice(index, 1);
        uwuStorage.setItem("uwu_templates", templates);
        renderTemplates(pageType);
      }
    }

    renderTemplates(pageType);
  }

  function checkUrlAndSetup() {
    if (targetLsNew.test(window.location.href) && settings.templatesInLs) {
      setupSingleCallback("#write_form", () =>
        setupTemplates("write_div", "text", "subject", "ls")
      );
    } else if (
      (targetBlogsCreation.test(window.location.href) ||
        targetSniffCreation.test(window.location.href)) &&
      settings.templatesInBlogsAndSniffs
    ) {
      setupSingleCallback(".creation_form", () =>
        setupTemplates(
          "creation_form",
          "creation-text",
          "creation-title",
          "blogsAndSniffs"
        )
      );
    } else if (
      targetChats.test(window.location.href) &&
      settings.templatesInChats
    ) {
      setupSingleCallback("#mess_form", () =>
        setupTemplates("mess_form", "mess", null, "chat")
      );
    }
  }

  setupMutationObserver("#main", checkUrlAndSetup, {
    childList: true,
    attributes: true,
  });

  setupMutationObserver("#branch", checkUrlAndSetup, {
    childList: true,
  });
}

initializeTemplates();

// ====================================================================================================================
//   . . . СОХРАНЕНИЕ ЛИЧНЫХ СООБЩЕНИЙ . . .
// ====================================================================================================================
if (targetLs.test(window.location.href) && settings.savingLS) {
  // console.log("UwU | Модуль сохранения ЛС активен.");

  /**
   * Отображает сохраненное сообщение в контейнере.
   * @param {string} lsId - ID сообщения для отображения.
   */
  function displaySavedMessage(lsId) {
    const container = document.getElementById("uwu-saved-ls-container");
    if (!container) return;

    const savedLs = uwuStorage.getItem("uwu_saved_ls") || {};
    const ls = savedLs[lsId];

    if (!ls) {
      container.innerHTML =
        "<h3>Ошибка: Сохранённое сообщение не найдено.</h3><p><a href='#' id='uwu-back-to-saved-list'>Назад к списку</a></p>";
      document
        .getElementById("uwu-back-to-saved-list")
        .addEventListener("click", showSavedMessagesInterface);
      return;
    }

    const typeLabel = ls.type === 0 ? "Отправитель" : "Получатель";
    const catLink = `<a href="/cat${ls.catId}" id="msg_login">${ls.catName}</a>`;

    const messageHTML = `
      <p><a href="#" id="uwu-back-to-saved-list">← Назад к сохранённым</a></p>
      <table id="msg_table" border="1">
        <tbody>
          <tr>
            <td colspan="2"><span id="msg_subject">${ls.subject}</span></td>
          </tr>
          <tr>
            <td valign="top" id="msg_info">
              ${typeLabel}: ${catLink}<br>
              ${ls.date}<br>
              <i>(сохранённая оффлайн-копия)</i>
            </td>
            <td><div class="parsed">${ls.text}</div></td>
          </tr>
        </tbody>
      </table>
    `;

    container.innerHTML = messageHTML;
    document
      .getElementById("uwu-back-to-saved-list")
      .addEventListener("click", showSavedMessagesInterface);
  }

  /**
   * Удаляет сохраненное ЛС из localStorage по его ID.
   * @param {number} lsId - ID личного сообщения для удаления.
   * @param {boolean} silent - Если true, не показывать alert.
   */
  function deleteSavedLS(lsId, silent = false) {
    try {
      const savedLs = uwuStorage.getItem("uwu_saved_ls") || {};
      if (savedLs.hasOwnProperty(lsId)) {
        delete savedLs[lsId];
        uwuStorage.setItem("uwu_saved_ls", savedLs);
        if (!silent) {
          alert("Сохранённая переписка удалена.");
        }
        if (window.location.search.includes(`?id=${lsId}`)) {
          addSaveButtonsToMessagePage();
        }
        updateSavedLsCount();
      }
    } catch (error) {
      console.error("UwU | Ошибка при удалении ЛС:", error);
      if (!silent) {
        alert("Произошла ошибка при удалении переписки.");
      }
    }
  }

  /**
   * Сохраняет текущее открытое ЛС в uwuStorage.
   */
  function saveCurrentLS() {
    try {
      const mainDiv = document.getElementById("main");
      const lsId = parseInt(window.location.href.split("=")[1], 10);
      if (isNaN(lsId)) return;

      const savedLs = uwuStorage.getItem("uwu_saved_ls") || {};

      const ls = {};
      ls.subject = document.getElementById("msg_subject").textContent;
      ls.text = document.querySelector(".parsed").innerHTML;

      const msgInfo = document.getElementById("msg_info");
      const dateMatch = msgInfo.innerHTML.match(
        /\d{1,2} [а-я]+ \d{4} в \d{2}:\d{2}/
      );
      ls.date = dateMatch ? dateMatch[0] : new Date().toLocaleString();

      ls.catId = parseInt(
        document
          .getElementById("msg_login")
          .getAttribute("href")
          .match(/\d+/)[0],
        10
      );
      ls.catName = document.getElementById("msg_login").textContent;
      ls.myId = mainDiv.dataset.id;
      ls.myName = mainDiv.dataset.login;
      ls.type = /Отправитель:/.test(msgInfo.innerHTML) ? 0 : 1;

      const now = new Date();
      ls.savedate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(now.getDate()).padStart(2, "0")} ${String(
        now.getHours()
      ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(
        now.getSeconds()
      ).padStart(2, "0")}`;

      savedLs[lsId] = ls;
      uwuStorage.setItem("uwu_saved_ls", savedLs);

      alert("Переписка успешно сохранена!");
      addSaveButtonsToMessagePage();
      updateSavedLsCount();
    } catch (error) {
      console.error("UwU | Ошибка при сохранении ЛС:", error);
      alert("Произошла ошибка при сохранении переписки.");
    }
  }

  /**
   * Добавляет кнопки управления сохранением на страницу просмотра ЛС.
   */
  function addSaveButtonsToMessagePage() {
    const subjectSpan = document.getElementById("msg_subject");
    if (!subjectSpan) return;

    const subjectTd = subjectSpan.closest("td");
    if (!subjectTd) return;

    const oldButtons = document.getElementById("uwu-ls-buttons");
    if (oldButtons) oldButtons.remove();

    const lsId = parseInt(window.location.href.split("=")[1], 10);
    const savedLs = uwuStorage.getItem("uwu_saved_ls") || {};
    const isSaved = savedLs.hasOwnProperty(lsId);

    const buttonsContainer = document.createElement("span");
    buttonsContainer.id = "uwu-ls-buttons";
    buttonsContainer.style.float = "right";
    buttonsContainer.style.display = "inline-block";

    const saveButton = document.createElement("input");
    saveButton.type = "button";
    saveButton.value = isSaved ? "Обновить" : "Сохранить";
    saveButton.className = "uwu-button install-button";
    saveButton.style.marginLeft = "5px";
    saveButton.onclick = saveCurrentLS;

    buttonsContainer.appendChild(saveButton);

    if (isSaved) {
      const deleteButton = document.createElement("input");
      deleteButton.type = "button";
      deleteButton.value = "Удалить";
      deleteButton.className = "uwu-button remove-button";
      deleteButton.style.marginLeft = "5px";
      deleteButton.onclick = () => deleteSavedLS(lsId);
      buttonsContainer.appendChild(deleteButton);

      const savedDate = document.createElement("i");
      savedDate.textContent = `Сохранено: ${savedLs[lsId].savedate}`;
      savedDate.style.marginRight = "10px";
      buttonsContainer.prepend(savedDate);
    }

    subjectTd.appendChild(buttonsContainer);
  }

  /**
   * Обновляет счетчик сохраненных сообщений во вкладке.
   */
  function updateSavedLsCount() {
    const counter = document.getElementById("uwu-saved-ls-count");
    if (!counter) return;
    const savedLs = uwuStorage.getItem("uwu_saved_ls") || {};
    counter.textContent = Object.keys(savedLs).length;
  }

  /**
   * Отображает интерфейс с сохраненными сообщениями.
   */
  function showSavedMessagesInterface(event) {
    if (event) event.preventDefault();
    console.log("UwU | Открываю вкладку сохранённых ЛС.");

    document.getElementById("main").style.display = "none";
    document
      .querySelectorAll("#links a")
      .forEach((a) => a.classList.remove("active"));
    document.getElementById("uwu-saved-ls-tab").classList.add("active");

    let container = document.getElementById("uwu-saved-ls-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "uwu-saved-ls-container";
      document.getElementById("main").after(container);
    }
    container.style.display = "block";
    renderSavedMessagesList(container);
  }

  /**
   * Скрывает интерфейс сохраненных сообщений и показывает стандартный.
   */
  function hideSavedMessagesInterface() {
    const container = document.getElementById("uwu-saved-ls-container");
    if (container) container.style.display = "none";
    document.getElementById("main").style.display = "block";
    document.getElementById("uwu-saved-ls-tab")?.classList.remove("active");
  }

  /**
   * Внедряет CSS-стили для интерфейса сохранения ЛС.
   */
  function injectLSSyles() {
    if (document.getElementById("uwu-ls-styles")) return;

    const css =
      /* CSS */
      `
       #uwu-saved-ls-tab {
        padding: 2px 8px;
        border-radius: 10px;
        background-color: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        transition: background-color 0.3s ease;
        text-decoration: none !important;
      }
      #uwu-saved-ls-tab:hover, #uwu-saved-ls-tab.active {
        background-color: rgba(255, 255, 255, 0.2);
      }

      #uwu-saved-ls-container .messList {
        table-layout: fixed;
        width: 100%;
      }
      
      #uwu-saved-ls-container .messList a {
        color: #0000cd;
      }
      
      #uwu-saved-ls-container .messList th:nth-child(1) { width: 50%; }
      #uwu-saved-ls-container .messList th:nth-child(2) { width: 25%; }
      #uwu-saved-ls-container .messList th:nth-child(3) { width: 20%; }
      #uwu-saved-ls-container .messList th:nth-child(4) { width: 5%; }

      #uwu-saved-ls-container .delete-saved-ls {
        padding: 1px 7px;
      }
    `;
    const styleElement = document.createElement("style");
    styleElement.id = "uwu-ls-styles";
    styleElement.textContent = css;
    document.head.appendChild(styleElement);
  }

  /**
   * Отрисовывает список сохраненных сообщений в указанном контейнере.
   * @param {HTMLElement} container - Элемент для отрисовки.
   */
  function renderSavedMessagesList(container) {
    const savedLsRaw = uwuStorage.getItem("uwu_saved_ls");
    const savedLs = savedLsRaw || {};
    const keys = Object.keys(savedLs);

    const storageSize = savedLsRaw
      ? (new TextEncoder().encode(savedLsRaw).length / 1024 / 1024).toFixed(2)
      : 0;

    if (keys.length === 0) {
      container.innerHTML = "<h3>У вас нет сохранённых сообщений.</h3>";
      return;
    }

    let inboxHTML = "";
    let outboxHTML = "";

    keys.sort(
      (a, b) => new Date(savedLs[b].savedate) - new Date(savedLs[a].savedate)
    );

    keys.forEach((key) => {
      const ls = savedLs[key];
      const rowHTML =
        /* HTML */
        `
          <tr class="msg_read">
            <td>
              <a href="#" class="uwu-saved-msg-open" data-id="${key}"
                >${ls.subject}</a
              >
            </td>
            <td><a href="/cat${ls.catId}">${ls.catName}</a></td>
            <td>${ls.savedate}</td>
            <td>
              <input
                type="button"
                value="X"
                class="uwu-button remove-button delete-saved-ls"
                data-id="${key}"
                title="Удалить"
              />
            </td>
          </tr>
        `;
      if (ls.type === 0) {
        inboxHTML += rowHTML;
      } else {
        outboxHTML += rowHTML;
      }
    });

    container.innerHTML =
      /* HTML */
      `
        <p style="text-align: center; color: #888;">
          Использовано примерно ${storageSize} из 5.00 МБ дискового
          пространства.
        </p>
        <h2>Входящие</h2>
        <table class="messList">
          <tbody>
            <tr>
              <th>Тема</th>
              <th>Отправитель</th>
              <th>Дата сохранения</th>
              <th></th>
            </tr>
            ${inboxHTML}
          </tbody>
        </table>
        <br />
        <h2>Отправленные</h2>
        <table class="messList">
          <tbody>
            <tr>
              <th>Тема</th>
              <th>Получатель</th>
              <th>Дата сохранения</th>
              <th></th>
            </tr>
            ${outboxHTML}
          </tbody>
        </table>
      `;

    container.querySelectorAll(".delete-saved-ls").forEach((button) => {
      button.addEventListener("click", (e) => {
        const lsId = e.target.dataset.id;
        if (
          confirm(
            "Вы уверены, что хотите удалить эту переписку из сохранённых?"
          )
        ) {
          deleteSavedLS(lsId, true);
          renderSavedMessagesList(container);
        }
      });
    });

    container.querySelectorAll(".uwu-saved-msg-open").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const lsId = e.target.dataset.id;
        displaySavedMessage(lsId);
      });
    });
  }

  /**
   * Добавляет вкладку "Сохранённые" в меню ЛС.
   */
  function addSavedMessagesTab() {
    const linksContainer = document.getElementById("links");
    if (!linksContainer || document.getElementById("uwu-saved-ls-tab")) return;

    linksContainer.insertAdjacentHTML(
      "beforeend",
      ` | <a href="#" id="uwu-saved-ls-tab">Сохранённые (<span id="uwu-saved-ls-count">0</span>)</a>`
    );

    const savedTab = document.getElementById("uwu-saved-ls-tab");
    savedTab.addEventListener("click", showSavedMessagesInterface);

    linksContainer.querySelectorAll("a:not(#uwu-saved-ls-tab)").forEach((a) => {
      a.addEventListener("click", () => {
        if (!a.href.includes("ls?id=")) {
          hideSavedMessagesInterface();
        }
      });
    });

    updateSavedLsCount();
  }

  /**
   * Функция-обработчик, которая определяет, что делать на странице ЛС.
   */
  function initializeLSPageLogic() {
    injectLSSyles();

    if (
      window.location.search.includes("?id=") &&
      document.getElementById("msg_table")
    ) {
      console.log("UwU | Обнаружена страница сообщения. Встраиваю кнопки...");
      addSaveButtonsToMessagePage();
      hideSavedMessagesInterface();
    } else {
      console.log("UwU | Обнаружена главная страница ЛС. Встраиваю вкладку...");
      addSavedMessagesTab();
    }
  }

  setupMutationObserver("#main", initializeLSPageLogic, { childList: true });
}
