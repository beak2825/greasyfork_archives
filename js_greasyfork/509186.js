// ==UserScript==
// @name         AutoHideLZT1
// @namespace    http://tampermonkey.net/
// @version      1.11
// @description  Автоматически добавляет хайд при отправке сообщений на сайтах зеленка и лолз, отправляет сообщение по Enter.
// @author       naithy & eretly & Timka241
// @match        https://zelenka.guru/*
// @match        https://lolz.guru/*
// @match        https://lolz.live/*
// @icon         https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6P-us9TBOHABul4NCBuCWU6_W-b1DA_8YmA&s
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/509186/AutoHideLZT1.user.js
// @updateURL https://update.greasyfork.org/scripts/509186/AutoHideLZT1.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Флаг для отслеживания отправки сообщения
  let isSending = false;

  // Статичные ID по умолчанию
  const exceptIds = "7202560, 7749892, 84800, 3812139";

  function xfAlert(text) {
    return XenForo.alert(text, "", timeout);
  }

  // Функция для добавления [exceptids=ID] и [/exceptids] к тексту
  function modifyMessageInput(inputElement) {
    if (!inputElement) {
      return;
    }

    const currentText = inputElement.innerHTML.trim();
    if (!currentText.startsWith(`[exceptids=${exceptIds}]`)) {
      inputElement.innerHTML =
        `[exceptids=${exceptIds}]` + currentText + `[/exceptids]`;
    }
  }

  // Функция для обработки нажатия клавиши Enter
  function handleEnterKey(event) {
    if (!(event.key === "Enter" || event.keyCode === 13) || event.shiftKey) {
      return;
    }
    event.preventDefault(); // Предотвращаем стандартное поведение
    event.stopPropagation(); // Останавливаем дальнейшую обработку события

    const inputElement = document.querySelector(
      '.fr-element.fr-view[contenteditable="true"]:focus'
    );
    if (!inputElement) {
      return;
    }

    const messageText = inputElement.innerHTML.trim();
    console.log("Текст сообщения:", messageText); // Логируем текст сообщения

    // Проверка на пустое сообщение
    if (messageText === "") {
      xfAlert("Введите корректное сообщение"); // Предупреждение, если сообщение пустое
      return; // Не отправляем пустое сообщение
    }

    // Проверка на допустимые символы
    const invalidChars = /<script|<\/script>/i; // Пример проверки на недопустимые теги
    if (invalidChars.test(messageText)) {
      xfAlert("Сообщение содержит недопустимые символы или теги.");
      return; // Не отправляем сообщение с недопустимыми символами
    }

    // Проверка, отправляется ли уже сообщение
    if (isSending) {
      return;
    }

    isSending = true; // Установить флаг в true

    modifyMessageInput(inputElement); // Добавляем хайд перед отправкой

    const editorBoxElement = inputElement.closest(".defEditor");
    if (!editorBoxElement) {
      xfAlert("Не найден элемент редактора");
      return;
    }

    const sendButton = editorBoxElement.querySelector(
      ".lzt-fe-se-sendMessageButton, .button.primary.mbottom"
    );
    console.log(sendButton);
    if (sendButton) {
      console.log("Отправка сообщения..."); // Логируем отправку
      sendButton.click(); // Симулируем клик по кнопке отправки
    }

    // Сброс флага после небольшой задержки
    setTimeout(() => {
      isSending = false;
    }, 100); // Задержка
  }

  // Добавляем обработчик нажатия клавиши Enter
  document.addEventListener("keydown", handleEnterKey, true);

  // Блокируем Enter в текстовых полях и текстовых областях
  const inputs = document.querySelectorAll(
    'input[type="text"], input[type="submit"], textarea'
  );
  inputs.forEach((input) => {
    input.addEventListener("keydown", handleEnterKey, true);
  });

  // Обработчик для кнопок отправки
  document.addEventListener("click", function (event) {
    const button = event.target;
    if (
      button.classList.contains("lzt-fe-se-sendMessageButton") ||
      (button.classList.contains("button") &&
        button.classList.contains("primary") &&
        button.classList.contains("mbottom"))
    ) {
      const editorBoxElement = button.closest(".defEditor");
      if (!editorBoxElement) {
        xfAlert("Не найден элемент редактора");
        return;
      }

      const inputElement = editorBoxElement.querySelector(
        '.fr-element.fr-view[contenteditable="true"]'
      );

      modifyMessageInput(inputElement); // Добавляем хайд перед отправкой
    }
  });
})();
