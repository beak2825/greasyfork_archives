// ==UserScript==
// @namespace prolaps.ru
// @name VK recomended friends auto clicker
// @description Автокликер для добавления друзей ВК со страницы рекомендаций
// @author L.A.P.S. Lab
// @version  0.8
// @include https://vk.com/friends*
// @match https://vk.com/friends?act=find
// @License MIT
// @downloadURL https://update.greasyfork.org/scripts/470474/VK%20recomended%20friends%20auto%20clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/470474/VK%20recomended%20friends%20auto%20clicker.meta.js
// ==/UserScript==

/* FEATURES:
 * 1. variable click interval delay
 * 2. click all links in random order
 **/

// Initial prefs
const targetURL = "https://vk.com/friends?act=find";
const targetUiElementSelector = "span.vkuiButton__content";
const minTimeToClick = 10;
const maxTimeToClick = 30;
const autostart = false;
let hotkeysUI = null;
const tasks = [];
const logs = [];

// TODO следующий класс описан в соответствующем модуле
const defaultConfig = {};
class HotkeysUI {
  #metaData = {};
  constructor(config) {
    if (this.config === undefined) {
      this.config = defaultConfig;
    } else {
      this.config = config;
    }

    this.#metaData.listeners = [];
    this.activateKeyboardListener();
  }

  activateKeyboardListener() {
    this.#metaData.listeners.push(
      window.addEventListener("keydown", (event) => {
        console.log("keyDown event...");
        if (event.altKey && (event.key === "h" || event.key === "H")) {
          event.preventDefault();
          console.log("[L.A.P.S. Lab] activate app by hotkey...");
          app();
        }
      })
    );
  }

  /**
   * удаляет все слушатели событий из #metadata.listeners
   */
  deactivateListeners() {
    if (this.#metaData.listeners && this.#metaData.listeners.length > 0) {
      this.#metaData.listeners.forEach((listener) => {
        window.removeEventListener("keydown", listener);
      });
    }
  }

  /**
   * удаляет все слушатели событий
   * потом будет удалять экземпляр класса
   */
  kill() {
    this.deactivateListeners();
  }
}
// TODO конец удаляемого класса

/**
 * this function checks url
 * @returns true or false
 *
 * Проверка идет по вхождению подстроки в строку!
 */
const checkLocation = () =>
  window.location.href.includes(targetURL) ? true : false;

/**
 * This function does make standard timestamp string for all types of output
 **/
const getTimeStamp = () => new Date().toLocaleTimeString();

/**
 * this function does shuffle found links
 * @param {HTMLCollection} collection
 * @returns sorted collection in random order
 */
const shuffleData = (collection) =>
  collection.sort((a, b) => Math.random() - 0.5);

/**
 * this function does generate random interval in range of arguments
 * @param {number} min
 * @param {number} max
 * @returns value of timeout to make click in seconds
 */
const setRandomInterval = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

/**
 * TODO не подставляется имя при формировании лог-строки по причине того, что референс гамно! Перепиши референс от кнопки - и тогда-то все и заработает, блэт!
 * я тут пошарил в консоли и нашарил такой референс: .parentElement.parentElement.children[2].children[0].textContent, но после того,
 * как я эту хню вставил в @logString вместо .name, всек хуям сломалось
 * @param {object} friend with "name" & "link"
 */
const clickThisLink = (friend) => {
  // do work
  friend.click();

  // remove task from array tasks
  if (tasks.find((item) => item.name === friend.name) !== -1) {
    tasks.splice(tasks.indexOf(friend.name), 1);
  }

  // prepare log string
  const timestamp = getTimeStamp();
  const logString = `(${logs.length + 1})Запрос в друзья отправлен: ${
    friend.name
  } в ${timestamp}.`;

  // log string push
  console.info(logString);
  logs.push(logString);

  // end app if finished
  if (tasks.length === 0) {
    endApp();
  }
};

const prepareLogsParagraph = () => {
  let logsParagraph = new String();
  logs.forEach((logItem) => {
    logsParagraph = logsParagraph + logItem + "\n";
  });
  logsParagraph +=
    "-----------------------\nL.A.P.S. Lab: автокликер закончил работу. Для повторного запуска скрипта обновите страницу (CTRL+R).";
  alert(logsParagraph);
  return logsParagraph;
};

/**
 * This func does make clicks with timeout
 * @param {array} items
 * @param {number} timeout
 */
const clickItemWithTimeout = (item, timeout) =>
  window.setTimeout(clickThisLink, timeout * 1000, item);

const endApp = () => {
  console.info("L.A.P.S. Lab: завершение...");
  console.info(
    "Удаление обработчиков событий клавиатуры...\n",
    (hotkeysUI.kill() && "Обработчики событий удалены.") ||
      "hotkeysUI.kill() failed!"
  );
  if (logs.length > 0) {
    prepareLogsParagraph();
    logs.length = 0;
  } else {
    alert(
      `L.A.P.S. Lab: Логи автокликера не обнаружены.\nАвтокликер закончил работу. Для повторного запуска скрипта обновите страницу (CTRL+R).`
    );
  }
  console.info(
    "L.A.P.S. Lab: автокликер закончил работу. Для повторного запуска скрипта обновите страницу."
  );
};

const makeWork = (data) => {
  let prevTimeoutSum = 0;
  let newTimeout = null;

  data.forEach((item) => {
    newTimeout = setRandomInterval(minTimeToClick, maxTimeToClick);
    clickItemWithTimeout(item, prevTimeoutSum + newTimeout);
    prevTimeoutSum += newTimeout;
    tasks.push(item.name);
  });
};

const app = () => {
  console.info(
    "L.A.P.S. Lab: запускаем автокликер для добавления друзей ВК..."
  );

  // define & prepare data
  const alternativeFoundData = Array.from(
    document.querySelectorAll(targetUiElementSelector)
  ).filter(
    (elem) =>
      elem.textContent.toLowerCase().includes("добавить") ||
      elem.textContent.toLowerCase().includes("подписаться")
  );
  console.log(`found ${alternativeFoundData.length} candidates to click`);
  const shuffledData = shuffleData(alternativeFoundData);

  // make work
  if (autostart) {
    makeWork(shuffledData);
  } else {
    const start = confirm(
      `L.A.P.S. Lab VK friends autoclicker:\n------------------------------------\nНайдено ${alternativeFoundData.length} рекомендаций. Добавить?`
    );
    start ? makeWork(shuffledData) : endApp();
    endApp();
  }
};

const activateExtensionOnLoad = () => {
  window.addEventListener("load", (event) => {
    hotkeysUI = new HotkeysUI();
    console.log("EVENT: 'load'");
  });
};

if (checkLocation()) {
  activateExtensionOnLoad();
}
