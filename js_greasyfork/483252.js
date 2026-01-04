// ==UserScript==
// @name         Input Text Logger
// @namespace    https://github.com/putsan
// @author       @putsan.bsky.social
// @version      0.1.2
// @description  Track continuous text input on websites and save to Tampermonkey's local storage
// @icon         https://github.com/putsan/Tampermonkey_scripts/blob/1b111563ad358762c1611a7e1c48544cd4fcf833/resources/icons/image_2023-12-27_22-31-58.png?raw=true
// @include      *
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/483252/Input%20Text%20Logger.user.js
// @updateURL https://update.greasyfork.org/scripts/483252/Input%20Text%20Logger.meta.js
// ==/UserScript==

(function () {
  "use strict";

    // --- Variables Initialization ---
  let currentText = "";
  let lastDomain = "";
  let lastTimestamp = "";
  let inactivityTimer;

// --- Styles for the Popup ---
  const popupStyle = `
      position: fixed;
      bottom: 100px;
      right: 10px;

      display: none;
      flex-direction: column;
      gap: 10px;
      width: 200px;
      padding: 10px;

      background: white;
      border: 1px solid black;
      z-idex: 999;
  `;

  // --- External CSS Library Link (Pure.css) ---
const pureCssLink = document.createElement('link');
pureCssLink.href = 'https://cdn.jsdelivr.net/npm/purecss@3.0.0/build/pure-min.css';
pureCssLink.rel = 'stylesheet';
pureCssLink.type = 'text/css';

// Додавання створеного тегу до секції head веб-сторінки
document.head.appendChild(pureCssLink);


  // --- Function to Save Data ---
  /**
   * Saves text, domain, and timestamp to Tampermonkey's local storage.
   * @param {string} newText - The new text to save.
   * @param {string} newDomain - The domain from which the text was captured.
   * @param {string} newTimestamp - The timestamp when the text was saved.
   */
  function saveData(newText, newDomain, newTimestamp) {
    // Отримання існуючих даних
    let existingData = GM_getValue("savedText", []);
    console.log(23, "до", GM_getValue("savedText"));

    // Додавання нових даних
    existingData.unshift({
      text: newText,
      domain: newDomain,
      timestamp: newTimestamp,
    });

    // Збереження оновлених даних
    GM_setValue("savedText", existingData);
    console.log(31, "після", GM_getValue("savedText"));
  }

  // --- Inactivity Timer Reset Function ---
  function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
      if (currentText.length > 0) {
        saveData(currentText, lastDomain, lastTimestamp);
        currentText = "";
      }
    }, 10000); // 10 секунд неактивності
  }

  document.addEventListener("input", function (event) {
    const target = event.target;
    if (
      (target.tagName === "INPUT" && target.type !== "password") ||
      target.tagName === "TEXTAREA"
    ) {
      const domain = window.location.hostname;
      const timestamp = new Date().toISOString();

      if (domain !== lastDomain) {
        if (currentText.length > 0) {
          saveData(currentText, lastDomain, lastTimestamp);
        }
        currentText = target.value;
        lastDomain = domain;
        lastTimestamp = timestamp;
      } else {
        currentText = target.value;
      }
      resetInactivityTimer();
    }
  });

  // Обробник події натискання клавіші
  document.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      const domain = window.location.hostname;
      const timestamp = new Date().toISOString();

      if (currentText.length > 0) {
        saveData(currentText, domain, timestamp);
        currentText = "";
      }
    }
  });

  window.addEventListener("blur", function () {
    if (currentText.length > 0) {
      saveData(currentText, lastDomain, lastTimestamp);
      currentText = "";
    }
  });

  window.addEventListener("beforeunload", function () {
    if (currentText.length > 0) {
      saveData(currentText, lastDomain, lastTimestamp);
    }
  });

  // --- Function to Create Popup ---
  function createPopup() {
    const popupHTML = `
      <div id="tmPopup" class="pure-u-1-3" style="${popupStyle}">
          <button id="viewTextBtn" class="pure-button pure-button-primary">Переглянути текст</button>
          <button id="deleteDataBtn" class="button-warning pure-button">Очистити дані</button>
      </div>
  `;

    document.body.insertAdjacentHTML("beforeend", popupHTML);

    // Обробник для кнопки перегляду тексту
    document.getElementById("viewTextBtn").addEventListener("click", function () {
      const savedData = GM_getValue("savedText", []);
      const newTab = window.open();
      const head = newTab.document.head;
      const link = newTab.document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/purecss@3.0.0/build/pure-min.css';
      head.appendChild(link);

      // Стилізація вкладки
      const style = newTab.document.createElement('style');
      style.textContent = `
        body { margin: 0; font-family: sans-serif; background-color: #e7e7e7; }
        .card { margin-bottom: 15px; padding: 15px; border-radius: 4px; box-shadow: 0 2px 4px rgba(0, 0, 0, .1); }
        .domain { color: #333; font-size: 14px; }
        .timestamp { color: #666; font-size: 12px; }
        .text { margin-top: 10px; }
      `;
      head.appendChild(style);

      const body = newTab.document.body;

      // Групування даних за доменом
      const dataByDomain = savedData.reduce((acc, { text, domain, timestamp }) => {
        if (!acc[domain]) {
          acc[domain] = [];
        }
        acc[domain].push({ text, timestamp });
        return acc;
      }, {});

      // Функція для генерації кольору на основі домену
      function stringToColor(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
          hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        let colour = '#';
        for (let i = 0; i < 3; i++) {
          let value = (hash >> (i * 8)) & 0xFF;
          colour += ('00' + value.toString(16)).substr(-2);
        }
        return colour;
      }

      // Створення карточок з даними
      Object.keys(dataByDomain).forEach(domain => {
        const entries = dataByDomain[domain];
        entries.forEach(({ text, timestamp }) => {
          const card = newTab.document.createElement('div');
          card.className = 'card';
          card.style.backgroundColor = stringToColor(domain);

          const textDiv = newTab.document.createElement('div');
          textDiv.className = 'text';
          textDiv.textContent = text;
          card.appendChild(textDiv);

          const domainDiv = newTab.document.createElement('div');
          domainDiv.className = 'domain';
          domainDiv.textContent = `Домен: ${domain}`;
          card.appendChild(domainDiv);

          const timestampDiv = newTab.document.createElement('div');
          timestampDiv.className = 'timestamp';
          timestampDiv.textContent = `Час: ${new Date(timestamp).toLocaleString()}`;
          card.appendChild(timestampDiv);

          body.appendChild(card);
        });
      });
    });


    document
      .getElementById("deleteDataBtn")
      .addEventListener("click", function () {
        GM_setValue("savedText", []);
      });
  }

  // Виклик функції для створення попапа
  createPopup();

  // Створення круглої кнопки
  const circleBtnHTML = `
<div id="circleBtn" style="width: 35px; height: 35px; border-radius: 50%; background-color: green; position: fixed; bottom: 100px; right: 10px; z-index: 9999;">
<img src="https://github.com/putsan/Tampermonkey_scripts/blob/1b111563ad358762c1611a7e1c48544cd4fcf833/resources/icons/image_2023-12-27_22-31-58.png?raw=true" style="width: 35px; height: 35px; border-radius: 50%;">
</div>
`;

  document.body.insertAdjacentHTML("beforeend", circleBtnHTML);

  const circleBtn = document.getElementById("circleBtn");
  const tmPopup = document.getElementById("tmPopup");

  // Функція для розкриття попапа
  function togglePopup() {
    if (tmPopup.style.display === "none") {
      tmPopup.style.display = "flex";
      circleBtn.style.display = "none";
    }
  }

  // Функція для закриття попапа
  function closePopup() {
    tmPopup.style.display = "none";
    circleBtn.style.display = "block";
  }

  // Додавання обробника подій
  circleBtn.addEventListener("click", togglePopup);
  window.addEventListener("click", function (event) {
    // Перевірка, чи клік був зроблений поза `circleBtn` та `tmPopup`
    if (!circleBtn.contains(event.target) && !tmPopup.contains(event.target)) {
        closePopup();
    }
  });
})();
