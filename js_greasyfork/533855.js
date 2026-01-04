// ==UserScript==
// @name MoeMesto Mobile Adaptation
// @namespace moemesto.rest
// @version 8.0.0
// @description Адаптация интерфейса бронирования для мобильных устройств
// @author Ваше имя
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/533855/MoeMesto%20Mobile%20Adaptation.user.js
// @updateURL https://update.greasyfork.org/scripts/533855/MoeMesto%20Mobile%20Adaptation.meta.js
// ==/UserScript==

(function() {
let css = `/* Общие стили для Vuetify */
@media (max-width: 768px) {
  /* Контейнеры */
  .v-container {
    padding: 0 8px !important;
    max-width: 100% !important;
  }

  /* Шапка */
  .v-toolbar {
    min-height: 56px !important;
    flex-direction: column !important;
  }
  
  /* Скрыть сайдбар */
  .v-navigation-drawer {
    display: none !important;
  }

  /* Таблицы */
  .v-data-table {
    overflow-x: auto !important;
    display: block !important;
  }

  /* Формы */
  .v-text-field {
    width: 100% !important;
    margin-bottom: 12px !important;
  }
}

@media (max-width: 768px) {
  .v-app-bar .v-btn:not(.burger-menu) {
    display: none !important;
  }

  .burger-menu {
    display: block !important;
    position: fixed !important;
    top: 12px !important;
    left: 12px !important;
    z-index: 1000 !important;
  }
}


@media (max-width: 480px) {
  .v-card {
    width: 100% !important;
    margin: 8px 0 !important;
  }
}

/* Календарь */
@media (max-width: 768px) {
  .v-picker {
    width: 100vw !important;
    margin: 0 !important;
  }
}

/* Выбор времени */
.v-menu__content {
  min-width: 90vw !important;
}
/* Минимальный размер кнопок */
.v-btn {
  min-width: 48px !important;
  min-height: 48px !important;
  padding: 12px !important;
}

/* Увеличиваем поля ввода */
.v-input input {
  font-size: 16px !important;
  height: 44px !important;
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
