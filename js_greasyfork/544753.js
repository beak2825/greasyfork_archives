// ==UserScript==
// @name            ShikiPlayer
// @description     Shikimori видеоплееры для просмотра аниме Turbo → Lumex → Alloha → Kodik → Collaps → Veoveo  → Vibix
// @namespace       https://github.com/Onzis/ShikiPlayer
// @author          Onzis
// @license         GPL-3.0 license
// @version         1.67
// @homepageURL     https://github.com/Onzis/ShikiPlayer
// @grant           GM.xmlHttpRequest
// @connect         shikimori.me
// @connect         kodikapi.com
// @connect         apicollaps.cc
// @connect         api.kinobox.tv
// @match           *://shikimori.one/*
// @match           *://beggins-as.pljjalgo.online/*
// @match           *://beggins-as.allarknow.online/*
// @match           *://beggins-as.algonoew.online/*
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/544753/ShikiPlayer.user.js
// @updateURL https://update.greasyfork.org/scripts/544753/ShikiPlayer.meta.js
// ==/UserScript==
/* jshint -W097 */
"use strict";

// --- INJECTION OF DARK THEME CSS ---
const darkThemeCSS = `
/* ==ShikiPlayer Dark Theme== */
:root {
  /* Основные цвета тёмной темы */
  --sp-bg-primary: #0a0a0a;
  --sp-bg-secondary: #1a1a1a;
  --sp-bg-tertiary: #252525;
  --sp-bg-hover: #2a2a2a;
  --sp-bg-active: #333333;
  
  /* Текстовые цвета */
  --sp-text-primary: #e0e0e0;
  --sp-text-secondary: #b0b0b0;
  --sp-text-muted: #808080;
  --sp-text-inverse: #000000;
  
  /* Акцентные цвета */
  --sp-accent: #6366f1;
  --sp-accent-hover: #818cf8;
  --sp-accent-active: #4f46e5;
  --sp-accent-light: #e0e7ff;
  
  /* Статусные цвета */
  --sp-success: #10b981;
  --sp-warning: #f59e0b;
  --sp-error: #ef4444;
  --sp-online: #22c55e;
  --sp-offline: #64748b;
  --sp-loading: #3b82f6;
  
  /* Границы */
  --sp-border-color: #333333;
  --sp-border-light: #404040;
  
  /* Радиусы и отступы */
  --sp-radius-sm: 4px;
  --sp-radius-md: 8px;
  --sp-radius-lg: 12px;
  --sp-radius-xl: 16px;
  --sp-spacing-xs: 4px;
  --sp-spacing-sm: 8px;
  --sp-spacing-md: 10px;
  --sp-spacing-lg: 24px;
  --sp-spacing-xl: 32px;
  
  /* Анимации */
  --sp-transition-fast: 150ms ease;
  --sp-transition-normal: 250ms ease;
  --sp-transition-slow: 350ms ease;
}

/* Внешний контейнер для центрирования кнопки */
.sp-outer-wrapper {
  margin: var(--sp-spacing-lg) 0 !important;
}

/* Контейнер для кнопки с фоном как у плеера */
.sp-button-container {
  background: linear-gradient(135deg, #2b2a39eb 0%, #2b2a39eb 100%) !important;
  border: 1px solid var(--sp-border-color) !important;
  border-top: none !important;
  border-radius: 0 0 var(--sp-radius-lg) var(--sp-radius-lg) !important;
  padding: var(--sp-spacing-md) !important;
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  margin-top: -1px !important;
  gap: var(--sp-spacing-md) !important;
}

/* Базовые стили для ShikiPlayer */
.sp-wrapper {
  background: var(--sp-bg-primary) !important;
  border: 1px solid var(--sp-border-color) !important;
  border-radius: var(--sp-radius-lg) var(--sp-radius-lg) 0 0 !important;
  overflow: hidden !important;
  transition: all var(--sp-transition-normal) !important;
  position: relative !important;
}

/* Контейнер плеера */
.sp-container {
  background: var(--sp-bg-secondary) !important;
  border-radius: var(--sp-radius-lg) var(--sp-radius-lg) 0 0 !important;
  overflow: hidden !important;
}

/* Заголовок плеера */
.sp-header {
  background: linear-gradient(135deg, #2b2a39eb 0%, #2b2a39eb 100%) !important;
  padding: var(--sp-spacing-md) var(--sp-spacing-lg) !important;
  border-bottom: 1px solid var(--sp-border-color) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
}

.sp-title {
  color: var(--sp-text-primary) !important;
  font-size: 18px !important;
  font-weight: 600 !important;
  margin: 0 !important;
  display: flex !important;
  align-items: center !important;
  gap: var(--sp-spacing-sm) !important;
}

/* Выпадающий список плееров */
.sp-dropdown {
  position: relative !important;
  margin-left: auto !important;
}

.sp-dropdown-toggle {
  background: var(--sp-bg-tertiary) !important;
  border: 1px solid var(--sp-border-light) !important;
  border-radius: var(--sp-radius-md) !important;
  color: var(--sp-text-primary) !important;
  padding: var(--sp-spacing-sm) var(--sp-spacing-md) !important;
  cursor: pointer !important;
  display: flex !important;
  align-items: center !important;
  gap: var(--sp-spacing-sm) !important;
  transition: all var(--sp-transition-fast) !important;
  font-size: 14px !important;
  font-weight: 500 !important;
}

.sp-dropdown-toggle:hover {
  background: var(--sp-bg-hover) !important;
  border-color: var(--sp-accent) !important;
  transform: translateY(-1px) !important;
}

.sp-dropdown-toggle::after {
  content: "▼" !important;
  font-size: 12px !important;
  transition: transform var(--sp-transition-fast) !important;
}

.sp-dropdown.open .sp-dropdown-toggle::after {
  transform: rotate(180deg) !important;
}

.sp-dropdown-menu {
  position: absolute !important;
  top: 100% !important;
  right: 0 !important;
  background: var(--sp-bg-tertiary) !important;
  border: 1px solid var(--sp-border-light) !important;
  border-radius: var(--sp-radius-md) !important;
  min-width: 100px !important;
  z-index: 1000 !important;
  opacity: 0 !important;
  visibility: hidden !important;
  transform: translateY(-10px) !important;
  transition: all var(--sp-transition-fast) !important;
  margin-top: var(--sp-spacing-xs) !important;
  max-height: 300px !important;
  overflow-y: auto !important;
}

.sp-dropdown.open .sp-dropdown-menu {
  opacity: 1 !important;
  visibility: visible !important;
  transform: translateY(0) !important;
}

.sp-dropdown-item {
  padding: var(--sp-spacing-sm) var(--sp-spacing-md) !important;
  cursor: pointer !important;
  transition: all var(--sp-transition-fast) !important;
  display: flex !important;
  align-items: center !important;
  gap: var(--sp-spacing-sm) !important;
  color: var(--sp-text-secondary) !important;
  font-size: 14px !important;
  border-bottom: 1px solid var(--sp-border-color) !important;
}

.sp-dropdown-item:last-child {
  border-bottom: none !important;
}

.sp-dropdown-item:hover {
  background: var(--sp-bg-hover) !important;
  color: var(--sp-text-primary) !important;
}

.sp-dropdown-item.active {
   background: #3d3d3d !important;
   color: #ffffff !important;
}

.sp-dropdown-item.loading {
  color: var(--sp-text-muted) !important;
  cursor: not-allowed !important;
}

/* Индикаторы статуса */
.sp-status-indicator {
  width: 8px !important;
  height: 8px !important;
  border-radius: 50% !important;
  margin-left: auto !important;
  transition: all var(--sp-transition-fast) !important;
}

.sp-status-indicator.online {
  background: var(--sp-online) !important;
  animation: pulse 2s infinite !important;
}

.sp-status-indicator.offline {
  background: var(--sp-offline) !important;
}

.sp-status-indicator.loading {
  background: var(--sp-loading) !important;
  animation: spin 1s linear infinite !important;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Область просмотра плеера */
.sp-viewer {
  background: var(--sp-bg-primary) !important;
  min-height: 500px !important;
  height: 500px !important;
  position: relative !important;
  overflow: hidden !important;
}

.sp-viewer iframe {
  border: none !important;
  width: 100% !important;
  height: 100% !important;
  min-height: 400px !important;
}

/* Оверлей загрузки */
.sp-loading-overlay {
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  background: rgba(10, 10, 10, 0.9) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  z-index: 100 !important;
  backdrop-filter: blur(4px) !important;
}

.sp-loading-overlay::after {
  content: "" !important;
  width: 40px !important;
  height: 40px !important;
  border: 3px solid var(--sp-border-color) !important;
  border-top: 3px solid var(--sp-accent) !important;
  border-radius: 50% !important;
  animation: spin 1s linear infinite !important;
}

/* Кнопка режима кинотеатра - квадратная с закругленными углами */
.sp-theater-btn {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 48px !important;
  height: 48px !important;
  padding: var(--sp-spacing-sm) !important;
  background: var(--sp-bg-tertiary) !important;
  border: 1px solid var(--sp-border-light) !important;
  border-radius: var(--sp-radius-md) !important;
  color: var(--sp-text-primary) !important;
  cursor: pointer !important;
  transition: all var(--sp-transition-fast) !important;
  position: relative !important;
}

.sp-theater-btn:hover {
  background: var(--sp-bg-hover) !important;
  border-color: var(--sp-accent) !important;
  transform: translateY(-2px) !important;
}

.sp-theater-btn:active {
  transform: translateY(0) !important;
}

.sp-theater-btn svg {
  width: 24px !important;
  height: 24px !important;
  flex-shrink: 0 !important;
}

/* Кнопка добавления эпизода */
.sp-episode-btn {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 48px !important;
  height: 48px !important;
  padding: var(--sp-spacing-sm) !important;
  background: var(--sp-bg-tertiary) !important;
  border: 1px solid var(--sp-border-light) !important;
  border-radius: var(--sp-radius-md) !important;
  color: var(--sp-text-primary) !important;
  cursor: pointer !important;
  transition: all var(--sp-transition-fast) !important;
  position: relative !important;
}

.sp-episode-btn:hover {
  background: var(--sp-bg-hover) !important;
  border-color: var(--sp-accent) !important;
  transform: translateY(-2px) !important;
}

.sp-episode-btn:active {
  transform: translateY(0) !important;
}

.sp-episode-btn svg {
  width: 24px !important;
  height: 24px !important;
  flex-shrink: 0 !important;
}

/* Счетчик просмотренных серий */
.sp-episode-count {
  position: absolute !important;
  bottom: -5px !important;
  right: -5px !important;
  background: var(--sp-accent) !important;
  color: #ffffff !important;
  font-size: 12px !important;
  font-weight: bold !important;
  padding: 2px 4px !important;
  border-radius: 10px !important;
  min-width: 28px !important;
  text-align: center !important;
  line-height: 12px !important;
}

/* Кнопка закрытия в режиме кинотеатра */
.sp-theater-close {
  position: absolute !important;
  top: var(--sp-spacing-md) !important;
  right: var(--sp-spacing-md) !important;
  width: 40px !important;
  height: 40px !important;
  background: rgba(0, 0, 0, 0.7) !important;
  border: 1px solid var(--sp-border-color) !important;
  border-radius: var(--sp-radius-md) !important;
  display: none !important;
  align-items: center !important;
  justify-content: center !important;
  cursor: pointer !important;
  z-index: 10000 !important;
  transition: all var(--sp-transition-fast) !important;
  backdrop-filter: blur(4px) !important;
}

.sp-theater-close:hover {
  background: rgba(239, 68, 68, 0.8) !important;
  border-color: var(--sp-error) !important;
  transform: scale(1.1) !important;
}

.sp-theater-close svg {
  width: 20px !important;
  height: 20px !important;
  color: var(--sp-text-primary) !important;
}

/* Режим кинотеатра */
.sp-wrapper.theater-mode {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  z-index: 9999 !important;
  margin: 0 !important;
  border-radius: 0 !important;
  border: none !important;
  background: var(--sp-bg-primary) !important;
}

.sp-wrapper.theater-mode .sp-viewer {
  height: 100vh !important;
  min-height: unset !important;
}

.sp-wrapper.theater-mode .sp-header {
  display: none !important;
}

.sp-wrapper.theater-mode .sp-theater-close {
  display: flex !important;
}

/* Стили для кастомных подсказок */
.sp-tooltip {
  position: absolute !important;
  background: var(--sp-bg-secondary) !important;
  color: var(--sp-text-primary) !important;
  padding: var(--sp-spacing-xs) var(--sp-spacing-sm) !important;
  border-radius: var(--sp-radius-sm) !important;
  font-size: 14px !important;
  font-weight: 500 !important;
  white-space: nowrap !important;
  z-index: 10000 !important;
  pointer-events: none !important;
  opacity: 0 !important;
  transform: translateY(-5px) !important;
  transition: all var(--sp-transition-fast) !important;
  backdrop-filter: blur(4px) !important;
  border: 1px solid var(--sp-border-color) !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}

.sp-tooltip.visible {
  opacity: 1 !important;
  transform: translateY(0) !important;
}

.sp-tooltip::before {
  content: "" !important;
  position: absolute !important;
  bottom: 100% !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
  border-width: 5px !important;
  border-style: solid !important;
  border-color: transparent transparent var(--sp-bg-secondary) transparent !important;
}

/* Скроллбар */
.sp-dropdown-menu::-webkit-scrollbar {
  width: 6px !important;
}

.sp-dropdown-menu::-webkit-scrollbar-track {
  background: var(--sp-bg-secondary) !important;
}

.sp-dropdown-menu::-webkit-scrollbar-thumb {
  background: var(--sp-border-light) !important;
  border-radius: 3px !important;
}

.sp-dropdown-menu::-webkit-scrollbar-thumb:hover {
  background: var(--sp-accent) !important;
}

/* Адаптивность */
@media (max-width: 768px) {
  .sp-header {
    padding: var(--sp-spacing-sm) var(--sp-spacing-md) !important;
    flex-direction: column !important;
    gap: var(--sp-spacing-sm) !important;
  }
  
  .sp-dropdown {
    width: 100% !important;
  }
  
  .sp-dropdown-toggle {
    width: 100% !important;
    justify-content: space-between !important;
  }
  
  .sp-dropdown-menu {
    position: absolute !important;
    top: 100% !important;
    left: 0 !important;
    transform: none !important;
    width: 100% !important;
    max-width: none !important;
    border-radius: 0 0 var(--sp-radius-md) var(--sp-radius-md) !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
  }
}

/* Дополнительные улучшения */
.sp-wrapper * {
  box-sizing: border-box !important;
}

.sp-wrapper button,
.sp-wrapper select,
.sp-wrapper input {
  background: var(--sp-bg-tertiary) !important;
  border: 1px solid var(--sp-border-light) !important;
  border-radius: var(--sp-radius-sm) !important;
  color: var(--sp-text-primary) !important;
  padding: var(--sp-spacing-xs) var(--sp-spacing-sm) !important;
  transition: all var(--sp-transition-fast) !important;
}

.sp-wrapper button:hover,
.sp-wrapper select:hover,
.sp-wrapper input:hover {
  border-color: var(--sp-accent) !important;
}

.sp-wrapper button:focus,
.sp-wrapper select:focus,
.sp-wrapper input:focus {
  outline: none !important;
  border-color: var(--sp-accent) !important;
}

/* Анимация появления */
.sp-outer-wrapper {
  animation: fadeInUp 0.5s ease-out !important;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
`;

function injectDarkTheme() {
  if (document.getElementById("shikiplayer-dark-theme")) return;
  const style = document.createElement("style");
  style.id = "shikiplayer-dark-theme";
  style.textContent = darkThemeCSS;
  document.head.appendChild(style);
}

injectDarkTheme();
// --- END OF CSS INJECTION ---

// Класс для создания кастомных подсказок
class Tooltip {
  constructor() {
    this.tooltip = null;
    this.targetElement = null;
    this.showTimeout = null;
    this.hideTimeout = null;
    this.init();
  }

  init() {
    // Создаем элемент подсказки
    this.tooltip = document.createElement("div");
    this.tooltip.className = "sp-tooltip";
    document.body.appendChild(this.tooltip);
  }

  // Добавление подсказки к элементу
  attach(element, text) {
    // Удаляем стандартный атрибут title, чтобы избежать дублирования
    const title = element.getAttribute("title");
    if (title) {
      element.setAttribute("data-tooltip-text", title);
      element.removeAttribute("title");
    } else if (text) {
      element.setAttribute("data-tooltip-text", text);
    }

    // Добавляем обработчики событий
    element.addEventListener("mouseenter", this.show.bind(this));
    element.addEventListener("mouseleave", this.hide.bind(this));
    element.addEventListener("click", this.hide.bind(this));
  }

  // Показ подсказки
  show(event) {
    const element = event.currentTarget;
    const text = element.getAttribute("data-tooltip-text");
    if (!text) return;

    // Отменяем скрытие, если оно было запланировано
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }

    // Запланируем показ с минимальной задержкой
    this.showTimeout = setTimeout(() => {
      this.targetElement = element;
      this.tooltip.textContent = text;

      // Позиционирование подсказки
      const rect = element.getBoundingClientRect();
      const tooltipRect = this.tooltip.getBoundingClientRect();

      // Показываем подсказку снизу от элемента
      let top = rect.bottom + 10;
      let left = rect.left + (rect.width - tooltipRect.width) / 2;

      // Проверяем, не выходит ли подсказка за пределы экрана снизу
      if (top + tooltipRect.height > window.innerHeight) {
        // Если не помещается снизу, показываем сверху
        top = rect.top - tooltipRect.height - 10;
      }

      // Проверяем, не выходит ли подсказка за пределы экрана по горизонтали
      if (left < 0) {
        left = 5;
      } else if (left + tooltipRect.width > window.innerWidth) {
        left = window.innerWidth - tooltipRect.width - 5;
      }

      this.tooltip.style.top = `${top + window.scrollY}px`;
      this.tooltip.style.left = `${left + window.scrollX}px`;

      // Показываем подсказку с анимацией
      this.tooltip.classList.add("visible");
    }, 100); // Уменьшенная задержка перед показом
  }

  // Скрытие подсказки
  hide() {
    // Отменяем показ, если он был запланирован
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
      this.showTimeout = null;
    }

    // Немедленно скрываем подсказку
    this.tooltip.classList.remove("visible");
    this.targetElement = null;
  }

  // Уничтожение подсказки
  destroy() {
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
    }
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }
    if (this.tooltip && this.tooltip.parentNode) {
      this.tooltip.parentNode.removeChild(this.tooltip);
    }
  }
}

// Базовый класс для ошибок
class ErrorBase extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = new.target.name;
  }
}
// Ошибка для некорректных HTTP-ответов
class ResponseError extends ErrorBase {
  constructor(response) {
    super(
      `Received response with unsuccessful code ${response.status} ${response.statusText}`
    );
    this.response = response;
  }
}
// HTTP-клиент для GM.xmlHttpRequest с таймаутом
class GMHttp {
  async fetch(input, init) {
    const methods = [
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "PATCH",
      "HEAD",
      "TRACE",
      "OPTIONS",
      "CONNECT",
    ];
    let requestMethod = init?.method ?? "GET";
    if (!methods.includes(requestMethod)) {
      throw new Error(`HTTP method ${requestMethod} is not supported`);
    }
    let requestUrl = input.toString();
    let requestBody = init?.body
      ? await new Response(init.body).text()
      : undefined;
    let requestHeaders = init?.headers
      ? Object.fromEntries(new Headers(init.headers))
      : {};
    // Добавляем таймаут по умолчанию 5 секунд
    const timeout = init?.timeout || 5000;
    const timeoutId = setTimeout(() => {
      throw new Error(`Request timeout after ${timeout}ms`);
    }, timeout);
    let gmResponse = await new Promise((resolve, reject) => {
      GM.xmlHttpRequest({
        url: requestUrl,
        method: requestMethod,
        data: requestBody,
        headers: requestHeaders,
        responseType: "blob",
        timeout: timeout,
        onload: (response) => {
          clearTimeout(timeoutId);
          resolve(response);
        },
        onerror: (error) => {
          clearTimeout(timeoutId);
          reject(error);
        },
        ontimeout: () => {
          clearTimeout(timeoutId);
          reject(new Error(`Request timeout after ${timeout}ms`));
        },
      });
    });
    let responseHeaders = gmResponse.responseHeaders
      .trim()
      .split(/\r?\n/)
      .map((line) => line.split(/:\s*/, 2));
    return new Response(gmResponse.response, {
      status: gmResponse.status,
      statusText: gmResponse.statusText,
      headers: responseHeaders,
    });
  }
}
// Утилита для проверки JSON
class Json {
  static parse(text, type) {
    let value;
    try {
      value = JSON.parse(text);
    } catch (e) {
      throw new Error(`Error parsing JSON: ${text}`);
    }
    if (!type(value)) {
      throw new Error(`Invalid JSON type`);
    }
    return value;
  }
}
// Базовый класс плеера
class PlayerBase {
  getEpisode() {
    return 0;
  }
  setEpisode(value) {}
  getTime() {
    return 0;
  }
  setTime(value) {}
  getTranslation() {
    return "";
  }
  setTranslation(value) {}
  dispose() {}
}
// Kodik Player
class KodikPlayer extends PlayerBase {
  constructor(uid, results) {
    super();
    this.uid = uid;
    this._results = results;
    this.element = document.createElement("iframe");
    this.element.allowFullscreen = true;
    this.element.width = "100%";
    this.element.style.aspectRatio = "16 / 9";
    this._translation = results[0] || new Error("No translation found");
    this.rebuildIFrameSrc();
    addEventListener("message", this.onMessage);
  }
  name = "Kodik";
  element;
  _episode = 1;
  _time = 0;
  _translation;
  getEpisode() {
    return this._episode;
  }
  setEpisode(value) {
    this._episode = value;
    this.rebuildIFrameSrc();
  }
  getTime() {
    return this._time;
  }
  setTime(value) {
    this._time = value;
    this.rebuildIFrameSrc();
  }
  getTranslation() {
    return this._translation.translation.id + "";
  }
  setTranslation(value) {
    this._translation =
      this._results.find((r) => r.translation.id === +value) ||
      new Error(`Translation '${value}' not found`);
    this.rebuildIFrameSrc();
  }
  rebuildIFrameSrc() {
    let src = new URL(`https:${this._translation.link}`);
    src.searchParams.set("uid", this.uid);
    src.searchParams.set("episode", this._episode + "");
    src.searchParams.set("start_from", this._time + "");
    this.element.src = src.toString();
  }
  onMessage = (ev) => {
    if (ev.source !== this.element.contentWindow) return;
    let message;
    try {
      message = JSON.parse(ev.data);
    } catch (e) {
      return;
    }
    if (message.key === "kodik_player_time_update") {
      this._time = message.value;
    }
  };
  dispose() {
    removeEventListener("message", this.onMessage);
  }
}
// Kodik Factory
class KodikFactory {
  constructor(uid, api) {
    this.uid = uid;
    this._api = api;
  }
  name = "Kodik";
  async create(animeId, abort) {
    let results = await this._api.search(animeId, abort);
    if (results.length === 0) return null;
    return new KodikPlayer(this.uid, results);
  }
}
// Alloha Player
class AllohaPlayer extends PlayerBase {
  constructor(url, season, lastEpisode) {
    super();
    this._url = url;
    this._season = season;
    this._lastEpisode = lastEpisode;
    this.element = document.createElement("iframe");
    this.element.allowFullscreen = true;
    this.element.width = "100%";
    this.element.style.aspectRatio = "16 / 9";
    this.rebuildIFrameSrc();
    addEventListener("message", this.onMessage);
  }
  name = "Alloha";
  element;
  _translation = "";
  _episode = 1;
  _season;
  _lastEpisode;
  _time = 0;
  getEpisode() {
    return this._episode;
  }
  setEpisode(value) {
    this._episode = Math.min(value, this._lastEpisode);
    this.rebuildIFrameSrc();
  }
  getSeason() {
    return this._season;
  }
  setSeason(value) {
    this._season = value;
    this.rebuildIFrameSrc();
  }
  getTime() {
    return this._time;
  }
  setTime(value) {
    this._time = value;
    this.rebuildIFrameSrc();
  }
  getTranslation() {
    return this._translation;
  }
  setTranslation(value) {
    this._translation = value;
    this.rebuildIFrameSrc();
  }
  rebuildIFrameSrc() {
    let src = new URL(this._url);
    src.searchParams.set("season", this._season + "");
    src.searchParams.set("translation", this._translation);
    src.searchParams.set("episode", this._episode + "");
    src.searchParams.set("start", this._time + "");
    this.element.src = src.toString();
  }
  onMessage = (ev) => {
    if (ev.source !== this.element.contentWindow) return;
    let message;
    try {
      message = JSON.parse(ev.data);
    } catch (e) {
      return;
    }
    if (message.event === "timeupdate") {
      this._time = message.time;
    } else if (message.event === "sp_season") {
      this.setSeason(message.season);
    } else if (message.event === "sp_episode") {
      this.setEpisode(message.episode);
    } else if (message.event === "sp_translation") {
      this.setTranslation(message.translation);
    }
  };
  dispose() {
    removeEventListener("message", this.onMessage);
  }
}
// Alloha Factory - ИЗМЕНЕНО: Используем Kinobox API вместо Alloha API
class AllohaFactory {
  constructor(kodikApi, kinoboxApi) {
    this._kodikApi = kodikApi;
    this._kinoboxApi = kinoboxApi;
  }
  name = "Alloha";
  async create(animeId, abort) {
    let kodikResults = await this._kodikApi.search(animeId);
    let kodikResult = kodikResults[0];
    if (!kodikResult || !kodikResult.kinopoisk_id) return null;

    // Используем Kinobox API для получения плеера Alloha
    let kinoboxResult = await this._kinoboxApi.players(
      kodikResult.kinopoisk_id,
      abort
    );

    // Ищем плеер Alloha в результатах
    let alloha = kinoboxResult.data.find((p) => p.type === "Alloha");
    if (!alloha || !alloha.iframeUrl) return null;

    let season = kodikResult.last_season || 1;
    // Устанавливаем значение по умолчанию для последнего эпизода
    let lastEpisode = 12; // Значение по умолчанию, так как Kinobox API не предоставляет эту информацию

    return new AllohaPlayer(alloha.iframeUrl, season, lastEpisode);
  }
}
// Collaps Player
class CollapsPlayer extends PlayerBase {
  constructor(url, season, lastEpisode) {
    super();
    this._url = url;
    this._season = season;
    this._lastEpisode = lastEpisode;
    this.element = document.createElement("iframe");
    this.element.allowFullscreen = true;
    this.element.width = "100%";
    this.element.style.aspectRatio = "16 / 9";
    this.rebuildIFrameSrc();
  }
  name = "Collaps";
  element;
  _episode = 1;
  _time = 0;
  getEpisode() {
    return this._episode;
  }
  setEpisode(value) {
    this._episode = Math.min(value, this._lastEpisode);
    this.rebuildIFrameSrc();
  }
  getTime() {
    return this._time;
  }
  setTime(value) {
    this._time = value;
    this.rebuildIFrameSrc();
  }
  rebuildIFrameSrc() {
    let src = new URL(this._url);
    src.searchParams.set("season", this._season + "");
    src.searchParams.set("episode", this._episode + "");
    src.searchParams.set("time", this._time + "");
    this.element.src = src.toString();
  }
}
// Collaps Factory
class CollapsFactory {
  constructor(kodikApi, collapsApi) {
    this._kodikApi = kodikApi;
    this._collapsApi = collapsApi;
  }
  name = "Collaps";
  async create(animeId, abort) {
    let kodikResults = await this._kodikApi.search(animeId);
    let kodikResult = kodikResults[0];
    if (!kodikResult || !kodikResult.kinopoisk_id) return null;
    let collapsResults = await this._collapsApi.list(
      kodikResult.kinopoisk_id,
      abort
    );
    let collapsResult = collapsResults[0];
    if (!collapsResult) return null;
    let season = kodikResult.last_season || 1;
    let lastEpisode =
      collapsResult.seasons?.find((s) => s.season === season)?.episodes
        .length || 1;
    return new CollapsPlayer(collapsResult.iframe_url, season, lastEpisode);
  }
}
// Turbo Player
class TurboPlayer extends PlayerBase {
  constructor(url, season) {
    super();
    this._url = url;
    this._season = season;
    this.element = document.createElement("iframe");
    this.element.allowFullscreen = true;
    this.element.width = "100%";
    this.element.style.aspectRatio = "16 / 9";
    this.rebuildIFrameSrc();
  }
  name = "Turbo";
  element;
  rebuildIFrameSrc() {
    let src = new URL(this._url);
    this.element.src = src.toString();
  }
}
// Turbo Factory
class TurboFactory {
  constructor(kodikApi, kinoboxApi) {
    this._kodikApi = kodikApi;
    this._kinoboxApi = kinoboxApi;
  }
  name = "Turbo";
  async create(animeId, abort) {
    let kodikResults = await this._kodikApi.search(animeId);
    let kodikResult = kodikResults[0];
    if (!kodikResult || !kodikResult.kinopoisk_id) return null;
    let kinoboxResult = await this._kinoboxApi.players(
      kodikResult.kinopoisk_id,
      abort
    );
    let turbo = kinoboxResult.data.find((p) => p.type === "Turbo");
    if (!turbo || !turbo.iframeUrl) return null;
    let season = kodikResult.last_season || 1;
    return new TurboPlayer(turbo.iframeUrl, season);
  }
}
// Lumex Player
class LumexPlayer extends PlayerBase {
  constructor(url) {
    super();
    this._url = url;
    this.element = document.createElement("iframe");
    this.element.allowFullscreen = true;
    this.element.width = "100%";
    this.element.style.aspectRatio = "16 / 9";
    this.rebuildIFrameSrc();
  }
  name = "Lumex";
  element;
  rebuildIFrameSrc() {
    let src = new URL(this._url);
    this.element.src = src.toString();
  }
}
// Lumex Factory
class LumexFactory {
  constructor(kodikApi, kinoboxApi) {
    this._kodikApi = kodikApi;
    this._kinoboxApi = kinoboxApi;
  }
  name = "Lumex";
  async create(animeId, abort) {
    let kodikResults = await this._kodikApi.search(animeId);
    let kodikResult = kodikResults[0];
    if (!kodikResult || !kodikResult.kinopoisk_id) return null;
    let kinoboxResult = await this._kinoboxApi.players(
      kodikResult.kinopoisk_id,
      abort
    );
    let lumex = kinoboxResult.data.find((p) => p.type === "Lumex");
    if (!lumex || !lumex.iframeUrl) return null;
    return new LumexPlayer(lumex.iframeUrl);
  }
}
// Veoveo Player
class VeoveoPlayer extends PlayerBase {
  constructor(url) {
    super();
    this._url = url;
    this.element = document.createElement("iframe");
    this.element.allowFullscreen = true;
    this.element.width = "100%";
    this.element.style.aspectRatio = "16 / 9";
    this.rebuildIFrameSrc();
  }
  name = "Veoveo";
  element;
  rebuildIFrameSrc() {
    let src = new URL(this._url);
    this.element.src = src.toString();
  }
}
// Veoveo Factory
class VeoveoFactory {
  constructor(kodikApi, kinoboxApi) {
    this._kodikApi = kodikApi;
    this._kinoboxApi = kinoboxApi;
  }
  name = "Veoveo";
  async create(animeId, abort) {
    let kodikResults = await this._kodikApi.search(animeId);
    let kodikResult = kodikResults[0];
    if (!kodikResult || !kodikResult.kinopoisk_id) return null;
    let kinoboxResult = await this._kinoboxApi.players(
      kodikResult.kinopoisk_id,
      abort
    );
    let veoveo = kinoboxResult.data.find((p) => p.type === "Veoveo");
    if (!veoveo || !veoveo.iframeUrl) return null;
    return new VeoveoPlayer(veoveo.iframeUrl);
  }
}
// Vibix Player
class VibixPlayer extends PlayerBase {
  constructor(url) {
    super();
    this._url = url;
    this.element = document.createElement("iframe");
    this.element.allowFullscreen = true;
    this.element.width = "100%";
    this.element.style.aspectRatio = "16 / 9";
    this.rebuildIFrameSrc();
  }
  name = "Vibix";
  element;
  rebuildIFrameSrc() {
    let src = new URL(this._url);
    this.element.src = src.toString();
  }
}
// Vibix Factory
class VibixFactory {
  constructor(kodikApi, kinoboxApi) {
    this._kodikApi = kodikApi;
    this._kinoboxApi = kinoboxApi;
  }
  name = "Vibix";
  async create(animeId, abort) {
    let kodikResults = await this._kodikApi.search(animeId);
    let kodikResult = kodikResults[0];
    if (!kodikResult || !kodikResult.kinopoisk_id) return null;
    let kinoboxResult = await this._kinoboxApi.players(
      kodikResult.kinopoisk_id,
      abort
    );
    let vibix = kinoboxResult.data.find((p) => p.type === "Vibix");
    if (!vibix || !vibix.iframeUrl) return null;
    return new VibixPlayer(vibix.iframeUrl);
  }
}
// API для Kodik
class KodikApi {
  constructor(http, token) {
    this._http = http;
    this._token = token;
  }
  async search(shikimoriId, abort) {
    let url = new URL("https://kodikapi.com/search");
    url.searchParams.set("token", this._token);
    url.searchParams.set("shikimori_id", shikimoriId + "");
    let response = await this._http.fetch(url, {
      signal: abort,
      timeout: 3000,
    });
    if (!response.ok) throw new ResponseError(response);
    let text = await response.text();
    let data = Json.parse(
      text,
      (v) =>
        typeof v === "object" &&
        v !== null &&
        Array.isArray(v.results) &&
        v.results.every(
          (e) =>
            typeof e === "object" &&
            e !== null &&
            typeof e.link === "string" &&
            (typeof e.kinopoisk_id === "undefined" ||
              typeof e.kinopoisk_id === "string") &&
            (typeof e.imdb_id === "undefined" ||
              typeof e.imdb_id === "string") &&
            typeof e.translation === "object" &&
            e.translation !== null &&
            typeof e.translation.id === "number" &&
            (typeof e.last_season === "undefined" ||
              typeof e.last_season === "number")
        )
    );
    return data.results;
  }
}
// API для Kinobox (используется для Turbo, Lumex, Alloha, Veoveo и теперь Vibix)
class KinoboxApi {
  constructor(http) {
    this._http = http;
  }
  _sessionId = Math.trunc(Math.random() * 100);
  async players(kinopoisk, abort) {
    let url = new URL("https://api.kinobox.tv/api/players");
    url.searchParams.set("kinopoisk", kinopoisk + "");
    url.searchParams.set("ts", this.getTs());
    let response = await this._http.fetch(url, {
      headers: {
        Referer: "https://kinohost.web.app/",
        Origin: "https://kinohost.web.app",
        "Sec-Fetch-Site": "cross-site",
      },
      signal: abort,
      timeout: 5000,
    });
    if (!response.ok) throw new ResponseError(response);
    let text = await response.text();
    return Json.parse(
      text,
      (v) =>
        typeof v === "object" &&
        v !== null &&
        Array.isArray(v.data) &&
        v.data.every(
          (e) =>
            typeof e === "object" &&
            e !== null &&
            typeof e.type === "string" &&
            (e.iframeUrl === null || typeof e.iframeUrl === "string")
        )
    );
  }
  getTs() {
    let s = Math.ceil(Date.now() / 1e3) % 1e5;
    let i = s % 100;
    let r = i - (i % 3);
    return s - i + r + "." + this._sessionId;
  }
}
// API для Collaps
class CollapsApi {
  constructor(http, token) {
    this._http = http;
    this._token = token;
  }
  async list(kinopoiskId, abort) {
    let url = new URL("https://apicollaps.cc/list");
    url.searchParams.set("token", this._token);
    url.searchParams.set("kinopoisk_id", kinopoiskId);
    let response = await this._http.fetch(url, {
      signal: abort,
      timeout: 5000,
    });
    if (!response.ok) throw new ResponseError(response);
    let text = await response.text();
    let data = Json.parse(
      text,
      (v) =>
        typeof v === "object" &&
        v !== null &&
        Array.isArray(v.results) &&
        v.results.every(
          (e) =>
            typeof e === "object" &&
            e !== null &&
            typeof e.iframe_url === "string" &&
            (typeof e.seasons === "undefined" ||
              (Array.isArray(e.seasons) &&
                e.seasons.every(
                  (s) =>
                    typeof s === "object" &&
                    s !== null &&
                    Array.isArray(s.episodes) &&
                    typeof s.season === "number"
                )))
        )
    );
    return data.results;
  }
}
// Основной класс Shikiplayer
class Shikiplayer {
  constructor(playerFactories) {
    this._playerFactories = playerFactories;
    // Создаем внешний контейнер
    this.element = document.createElement("div");
    this.element.className = "sp-outer-wrapper";

    // ИСПРАВЛЕННАЯ HTML СТРУКТУРА: кнопка в отдельном контейнере
    this.element.innerHTML = `
<div class="sp-wrapper">
  <div class="sp-container">
    <div class="sp-header">
      <div class="sp-title">Онлайн-просмотр</div>
      <div class="sp-dropdown">
        <div class="sp-dropdown-toggle">
          <span class="sp-selected-player">Выберите плеер</span>
        </div>
        <div class="sp-dropdown-menu"></div>
      </div>
    </div>
    <div class="sp-viewer">
      <div class="sp-loading-overlay"></div>
    </div>
  </div>
  <button class="sp-theater-close" title="Закрыть режим кинотеатра">
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  </button>
</div>
<div class="sp-button-container">
  <button class="sp-theater-btn" title="Театральный режим">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
    </svg>
  </button>
  <button class="sp-episode-btn" title="Отметить серию как просмотренную">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
    <span class="sp-episode-count">0/0</span>
  </button>
</div>
        `;
    this._wrapper = this.element.querySelector(".sp-wrapper");
    this._container = this.element.querySelector(".sp-container");
    this._dropdown = this.element.querySelector(".sp-dropdown");
    this._dropdownToggle = this.element.querySelector(".sp-dropdown-toggle");
    this._dropdownMenu = this.element.querySelector(".sp-dropdown-menu");
    this._selectedPlayerText = this.element.querySelector(
      ".sp-selected-player"
    );
    this._viewer = this.element.querySelector(".sp-viewer");
    this._loadingOverlay = this.element.querySelector(".sp-loading-overlay");
    this._theaterBtn = this.element.querySelector(".sp-theater-btn");
    this._theaterCloseBtn = this.element.querySelector(".sp-theater-close");
    this._episodeBtn = this.element.querySelector(".sp-episode-btn");
    this._currentPlayer = null;
    this._playerInstances = new Map();
    this._isTheaterMode = false;

    // Инициализация системы подсказок
    this._tooltip = new Tooltip();

    // Обработчики событий для выпадающего списка
    this._dropdownToggle.addEventListener("click", () => {
      this._dropdown.classList.toggle("open");
    });
    // Закрытие выпадающего списка при клике вне его
    document.addEventListener("click", (e) => {
      if (!this._dropdown.contains(e.target)) {
        this._dropdown.classList.remove("open");
      }
    });
    // Обработчик для кнопки режима кинотеатра
    this._theaterBtn.addEventListener("click", () => {
      this.toggleTheaterMode();
    });
    // Обработчик для кнопки закрытия режима кинотеатра
    this._theaterCloseBtn.addEventListener("click", () => {
      this.toggleTheaterMode();
    });
    // Обработчик для кнопки добавления эпизода
    this._episodeBtn.addEventListener("click", () => {
      this.incrementEpisode();
    });
    // Обработчик для закрытия режима кинотеатра по клавише Esc
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this._isTheaterMode) {
        this.toggleTheaterMode();
      }
    });
  }

  toggleTheaterMode() {
    this._isTheaterMode = !this._isTheaterMode;
    if (this._isTheaterMode) {
      this._wrapper.classList.add("theater-mode");
      // Сохраняем текущую позицию прокрутки
      this._scrollPosition = window.pageYOffset;
      // Блокируем прокрутку страницы
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${this._scrollPosition}px`;
      document.body.style.width = "100%";
    } else {
      this._wrapper.classList.remove("theater-mode");
      // Восстанавливаем прокрутку страницы
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, this._scrollPosition);
    }
  }

  incrementEpisode() {
    // ИСПРАВЛЕНИЕ: Улучшенный поиск кнопки увеличения эпизода
    // Пробуем несколько возможных селекторов для кнопки
    let incrementButton = document.querySelector(".item-add.increment");
    if (!incrementButton) {
      incrementButton = document.querySelector(".b-user_rate .increment");
    }
    if (!incrementButton) {
      incrementButton = document.querySelector(".b-add_to_list .increment");
    }

    if (incrementButton) {
      // Кликаем по ней
      incrementButton.click();

      // Добавляем визуальную обратную связь
      this._episodeBtn.style.background = "var(--sp-success)";
      setTimeout(() => {
        this._episodeBtn.style.background = "";
      }, 500);

      // ИСПРАВЛЕНИЕ: Увеличиваем задержку и добавляем несколько попыток обновления счетчика
      // Обновляем счетчик серий с увеличенной задержкой
      setTimeout(() => {
        this.updateEpisodeCount();
      }, 1000);

      // Вторая попытка обновления счетчика
      setTimeout(() => {
        this.updateEpisodeCount();
      }, 2000);
    } else {
      // Если кнопка не найдена, показываем ошибку
      this._episodeBtn.style.background = "var(--sp-error)";
      setTimeout(() => {
        this._episodeBtn.style.background = "";
      }, 500);
    }
  }

  updateEpisodeCount() {
    // ИСПРАВЛЕНИЕ: Улучшенный поиск элемента с количеством просмотренных серий
    // Пробуем несколько возможных селекторов
    let rateNumber = document.querySelector(".rate-number");
    if (!rateNumber) {
      rateNumber = document.querySelector(".b-user_rate .rate-number");
    }
    if (!rateNumber) {
      rateNumber = document.querySelector(".b-add_to_list .rate-number");
    }

    if (!rateNumber) {
      console.error(
        "Не удалось найти элемент с количеством просмотренных серий"
      );
      return;
    }

    // Получаем текст из элемента
    const rateText = rateNumber.textContent;

    // Находим элемент счетчика в нашей кнопке
    const episodeCount = this._episodeBtn.querySelector(".sp-episode-count");
    if (!episodeCount) return;

    // ИСПРАВЛЕНИЕ: Добавляем анимацию при обновлении счетчика
    // Сохраняем старое значение для сравнения
    const oldValue = episodeCount.textContent;

    // Обновляем текст счетчика
    episodeCount.textContent = rateText;

    // Если значение изменилось, добавляем анимацию
    if (oldValue !== rateText) {
      episodeCount.style.transform = "scale(1.2)";
      setTimeout(() => {
        episodeCount.style.transform = "scale(1)";
      }, 300);
    }
  }

  async start(abort) {
    // Очищаем предыдущий контейнер, если он существует
    let existing = document.querySelector(".sp-outer-wrapper");
    if (existing) existing.remove();
    let before = document.querySelector(".b-db_entry");
    if (before) before.after(this.element);
    let entryText = document
      .querySelector(".b-db_entry .b-user_rate")
      ?.getAttribute("data-entry");
    if (!entryText) return;
    let entry = JSON.parse(entryText);
    if (!entry || typeof entry.id !== "number") return;

    // Добавляем подсказки только к кнопкам
    this._tooltip.attach(this._theaterBtn, "Театральный режим");
    this._tooltip.attach(
      this._theaterCloseBtn,
      "Закрыть режим кинотеатра (Esc)"
    );
    this._tooltip.attach(this._episodeBtn, "Отметить серию как просмотренную");

    // Обновляем счетчик серий
    this.updateEpisodeCount();

    // Создаем элементы для всех плееров в выпадающем списке
    for (let factory of this._playerFactories) {
      let item = document.createElement("div");
      item.className = "sp-dropdown-item loading";
      item.innerHTML = `
 ${factory.name}
<span class="sp-status-indicator loading"></span>
            `;
      item.dataset.playerName = factory.name;
      this._dropdownMenu.appendChild(item);
    }
    // Загружаем Kodik немедленно и отображаем его
    let kodikFactory = this._playerFactories.find((f) => f.name === "Kodik");
    if (kodikFactory) {
      try {
        let kodikPlayer = await kodikFactory.create(entry.id, abort);
        if (kodikPlayer) {
          this._playerInstances.set("Kodik", kodikPlayer);
          this.switchPlayer("Kodik", kodikPlayer);
          // Обновляем элемент Kodik в выпадающем списке
          let kodikItem = this._dropdownMenu.querySelector(
            "[data-player-name='Kodik']"
          );
          if (kodikItem) {
            kodikItem.classList.remove("loading");
            kodikItem.classList.add("active");
            kodikItem
              .querySelector(".sp-status-indicator")
              .classList.remove("loading");
            kodikItem
              .querySelector(".sp-status-indicator")
              .classList.add("online");
            kodikItem.addEventListener("click", () => {
              this.switchPlayer("Kodik", kodikPlayer);
              this._dropdown.classList.remove("open");
            });
          }
        } else {
          // Если Kodik не загрузился, убираем его из списка
          let kodikItem = this._dropdownMenu.querySelector(
            "[data-player-name='Kodik']"
          );
          if (kodikItem) {
            kodikItem
              .querySelector(".sp-status-indicator")
              .classList.remove("loading");
            kodikItem
              .querySelector(".sp-status-indicator")
              .classList.add("offline");
            kodikItem.classList.remove("loading");
          }
        }
      } catch (e) {
        console.error(`Error in Kodik:`, e);
        // Если Kodik не загрузился, убираем его из списка
        let kodikItem = this._dropdownMenu.querySelector(
          "[data-player-name='Kodik']"
        );
        if (kodikItem) {
          kodikItem
            .querySelector(".sp-status-indicator")
            .classList.remove("loading");
          kodikItem
            .querySelector(".sp-status-indicator")
            .classList.add("offline");
          kodikItem.classList.remove("loading");
        }
      }
    }
    // Загружаем остальные плееры в фоновом режиме
    for (let factory of this._playerFactories) {
      if (factory.name === "Kodik") continue; // Пропускаем Kodik, уже загружен
      let item = this._dropdownMenu.querySelector(
        `[data-player-name='${factory.name}']`
      );
      if (!item) continue;
      // Используем Promise без await, чтобы не блокировать выполнение
      factory
        .create(entry.id, abort)
        .then((player) => {
          item.classList.remove("loading");
          if (!player) {
            item
              .querySelector(".sp-status-indicator")
              .classList.remove("loading");
            item.querySelector(".sp-status-indicator").classList.add("offline");
            return;
          }
          this._playerInstances.set(factory.name, player);
          item
            .querySelector(".sp-status-indicator")
            .classList.remove("loading");
          item.querySelector(".sp-status-indicator").classList.add("online");
          item.addEventListener("click", () => {
            this.switchPlayer(factory.name, player);
            this._dropdown.classList.remove("open");
          });
        })
        .catch((e) => {
          console.error(`Error in ${factory.name}:`, e);
          item
            .querySelector(".sp-status-indicator")
            .classList.remove("loading");
          item.querySelector(".sp-status-indicator").classList.add("offline");
          item.classList.remove("loading");
        });
    }
  }

  switchPlayer(playerName, player) {
    // Показываем индикатор загрузки
    this._loadingOverlay.style.display = "flex";
    // Удаляем текущий плеер из viewport
    this._viewer.innerHTML = "";
    if (this._currentPlayer) {
      this._currentPlayer.dispose();
    }
    // Устанавливаем новый плеер
    this._viewer.appendChild(player.element);
    this._currentPlayer = player;
    // Обновляем текст в выпадающем списке
    this._selectedPlayerText.textContent = playerName;
    // Обновляем активный элемент в выпадающем списке
    for (let item of this._dropdownMenu.children) {
      item.classList.toggle("active", item.dataset.playerName === playerName);
    }
    // Скрываем индикатор загрузки с небольшой задержкой для плавности
    setTimeout(() => {
      this._loadingOverlay.style.display = "none";
    }, 500);
  }

  dispose() {
    if (this._currentPlayer) {
      this._currentPlayer.dispose();
      this._currentPlayer = null;
    }
    this._playerInstances.clear();

    // Уничтожаем систему подсказок
    if (this._tooltip) {
      this._tooltip.destroy();
    }

    this.element.remove();
    // Восстанавливаем прокрутку страницы, если был режим кинотеатра
    if (this._isTheaterMode) {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, this._scrollPosition);
    }
  }
}
// Запуск Alloha Helper
async function startAllohaHelper() {
  let hostnames = [
    "beggins-as.pljjalgo.online",
    "beggins-as.allarknow.online",
    "beggins-as.algonoew.online",
  ];
  if (!hostnames.includes(location.hostname)) return;
  new MutationObserver((mutations) => {
    for (let mutation of mutations) {
      let target = mutation.target;
      if (target.matches(".select__drop-item.active")) {
        let event;
        if (target.closest("[data-select='seasonType1']")) {
          event = { event: "sp_season", season: +target.dataset.id };
        } else if (target.closest("[data-select='episodeType1']")) {
          event = { event: "sp_episode", episode: +target.dataset.id };
        } else if (target.closest("[data-select='translationType1']")) {
          event = {
            event: "sp_translation",
            translation: +target.dataset.id.match(/(?<=t)\d+/)[0],
          };
        }
        if (event) parent.postMessage(JSON.stringify(event), "*");
      }
    }
  }).observe(document, { subtree: true, attributeFilter: ["class"] });
}
// Запуск Shikiplayer с поддержкой Turbolinks
async function startShikiplayer() {
  if (location.hostname !== "shikimori.one") return;
  const kodikToken = "a0457eb45312af80bbb9f3fb33de3e93";
  const kodikUid = "";
  const collapsToken = "4c250f7ac0a8c8a658c789186b9a58a5";
  let http = new GMHttp();
  let kodikApi = new KodikApi(http, kodikToken);
  let kinoboxApi = new KinoboxApi(http);
  let collapsApi = new CollapsApi(http, collapsToken);
  let factories = [
    new KodikFactory(kodikUid, kodikApi),
    // ИЗМЕНЕНО: AllohaFactory теперь использует Kinobox API вместо Alloha API
    new AllohaFactory(kodikApi, kinoboxApi),
    new TurboFactory(kodikApi, kinoboxApi),
    new LumexFactory(kodikApi, kinoboxApi),
    new VeoveoFactory(kodikApi, kinoboxApi),
    new VibixFactory(kodikApi, kinoboxApi), // Добавлен новый плеер Vibix
    new CollapsFactory(kodikApi, collapsApi),
  ];
  let shikiplayer = null;
  // Функция инициализации плеера
  async function initializePlayer() {
    if (shikiplayer) {
      shikiplayer.dispose(); // Очищаем текущий плеер
    }
    shikiplayer = new Shikiplayer(factories);
    await shikiplayer.start(new AbortController().signal);
  }
  // Первичный запуск
  initializePlayer();
  // Обработка события Turbolinks
  document.addEventListener("turbolinks:load", initializePlayer);
}
void startAllohaHelper();
void startShikiplayer();