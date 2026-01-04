// ==UserScript==
// @name         Message Timestamp Injector for ChatGPT (2.1)
// @namespace    http://tampermonkey.net/
// @version      2025-04-26
// @description  Automatically adds timestamps below new messages in the chat.
// @author       aket0r
// @match        https://chatgpt.com/c/*
// @match        https://chatgpt.com/g/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chatgpt.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534025/Message%20Timestamp%20Injector%20for%20ChatGPT%20%2821%29.user.js
// @updateURL https://update.greasyfork.org/scripts/534025/Message%20Timestamp%20Injector%20for%20ChatGPT%20%2821%29.meta.js
// ==/UserScript==

console.log('[script] Автоматическое создание даты и времени отправки сообщения запущено.');

// Настройки
const SYSTEM_MESSAGE_INDEX = 2;
const USER_MESSAGE_INTERVAL = 15;
const MAX_INDEX_BEFORE_RESET = 50;
let index = 0;

// Конфигурация Observer
const config = { childList: true, subtree: true };

// Функция безопасного получения таргета
function getTarget() {
  return document.querySelectorAll(".shrink > div > div > div")[1] || null;
}

// Инициализация стилей
function initStyles() {
  const style = document.createElement("style");
  style.textContent = `
    .createdAt {
		position: relative;
		color: #777;
		font-size: 13px;
		text-align: center;
		bottom: -10px;
		user-select: none;
		display: block;
		width: 100%;
    }

	.createdAt::after,
	.createdAt.author::after {
	    content: '';
		position: absolute;
		width: calc(15% + 30px);
		height: 1px;
		background: #434343;
		right: calc(30% - 5px);
		top: 50%;
		transform: translateY(-50%);
	}

	.createdAt::before,
	.createdAt.author::before {
	    content: '';
		position: absolute;
		width: calc(15% + 30px);
		height: 1px;
		background: #434343;
		left: calc(30% - 5px);
		top: 50%;
		transform: translateY(-50%);
	}

    .createdAt.author {
      color: #999;
    }
  `;
  document.head.appendChild(style);
}

// Создание элемента даты
function createDateElement(className, date) {
  const span = document.createElement("span");
  span.className = className;
  span.textContent = date;
  return span;
}

// Добавление даты к сообщению
function appendDateToMessage(className, offsetFromEnd) {
  const articles = getTarget()?.querySelectorAll("article");
  if (!articles || articles.length < offsetFromEnd) return;

  const article = articles[articles.length - offsetFromEnd];
  if (!article || article.querySelector('.createdAt')) return;

  const date = new Date().toLocaleString();
  article.appendChild(createDateElement(className, date));
}

// Логика обработки мутаций
function handleMutations(mutationsList) {
  for (const mutation of mutationsList) {
    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {

      if (index >= MAX_INDEX_BEFORE_RESET) {
        resetObserver();
        return;
      }

      if (index === SYSTEM_MESSAGE_INDEX) {
        appendDateToMessage('createdAt author', 2);
      }

      if (index >= USER_MESSAGE_INTERVAL) {
        setTimeout(() => {
          appendDateToMessage('createdAt', 1);
        }, 1000);
        index = 0;
      }

      index++;
    }
  }
}

// Инициализация наблюдателя
const observer = new MutationObserver(handleMutations);

// Перезапуск наблюдателя при необходимости
function resetObserver() {
  const target = getTarget();
  if (!target) {
    console.error('[script] Target not found during reset.');
    return;
  }
  observer.disconnect();
  setTimeout(() => {
    observer.observe(target, config);
  }, 2000);
}

// Старт скрипта
function start() {
  initStyles();
  setTimeout(() => {
    const target = getTarget();
    if (!target) {
      console.error('[script] Target not found on load.');
      return;
    }
    observer.observe(target, config);
  }, 5000);
}

// Запуск
window.addEventListener("load", start);
