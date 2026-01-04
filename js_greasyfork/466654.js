// ==UserScript==
// @name         Midjourney Click All
// @description  Click all the buttons in a row at once when you're in Discord with Midjourney bot open! 😊
// @author       mefengl
// @version      0.3.3
// @namespace    https://github.com/mefengl
// @icon         https://www.google.com/s2/favicons?sz=64&domain=midjourney.com
// @license      MIT
// @match        https://discord.com/channels/*
// @grant        none

// @name:en      Midjourney Click All
// @description:en Click all the buttons in a row at once when you're in Discord with Midjourney bot open! 😊
// @name:zh-CN   Midjourney一键点击
// @description:zh-CN 当你在Discord中打开Midjourney机器人时，一次点击一排的所有按钮！😊
// @name:es      Midjourney Click Todo
// @description:es ¡Haz clic en todos los botones en una fila a la vez cuando estés en Discord con el bot de Midjourney abierto! 😊
// @name:hi      Midjourney सभी पर क्लिक करें
// @description:hi जब आप Discord में Midjourney बॉट के साथ हों, तो एक बार में सभी बटनों पर क्लिक करें! 😊
// @name:ar      Midjourney انقر على الكل
// @description:ar انقر على جميع الأزرار في صف واحد في وقت واحد عندما تكون في Discord مع بوت Midjourney مفتوح! 😊
// @name:pt      Midjourney Clique Tudo
// @description:pt Clique em todos os botões em uma linha de uma vez quando estiver no Discord com o bot Midjourney aberto! 😊
// @name:ru      Midjourney Нажмите на все
// @description:ru Нажмите все кнопки в ряду сразу, когда вы находитесь в Discord с открытым ботом Midjourney! 😊
// @name:ja      Midjourney すべてをクリック
// @description:ja DiscordでMidjourneyボットを開いているときに、一度にすべてのボタンをクリックします！😊
// @name:de      Midjourney Klick Alles
// @description:de Klicken Sie auf alle Tasten in einer Reihe auf einmal, wenn Sie in Discord mit dem geöffneten Midjourney-Bot sind! 😊
// @name:fr      Midjourney Cliquez sur Tout
// @description:fr Cliquez sur tous les boutons d'une rangée à la fois lorsque vous êtes sur Discord avec le bot Midjourney ouvert! 😊
// @downloadURL https://update.greasyfork.org/scripts/466654/Midjourney%20Click%20All.user.js
// @updateURL https://update.greasyfork.org/scripts/466654/Midjourney%20Click%20All.meta.js
// ==/UserScript==
"use strict";
(() => {
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // ../../packages/monkit/dist/index.mjs
  function onUrlChange(callback) {
    let oldHref = document.location.href;
    return window.setInterval(() => {
      const newHref = document.location.href;
      if (oldHref !== newHref)
        callback(oldHref = newHref);
    }, 1e3);
  }

  // ../../packages/midkit/dist/index.mjs
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  function getButtonContainers(container = document.body) {
    return Array.from(container.querySelectorAll("[id^='message-accessorie'] [class^='children']"));
  }
  var CLONE_BUTTON_CLASS = "cloned-button";
  function getButtons(temp) {
    const buttons = temp.querySelectorAll("button");
    const originalButtons = Array.from(buttons).filter((button) => !button.classList.contains(CLONE_BUTTON_CLASS));
    return originalButtons;
  }
  function oneMoreButton(temp) {
    const buttons = getButtons(temp);
    const lastButton = buttons[buttons.length - 1];
    const cloneButton = lastButton.cloneNode();
    cloneButton.classList.add(CLONE_BUTTON_CLASS);
    lastButton.parentNode.insertBefore(cloneButton, lastButton.nextSibling);
    return cloneButton;
  }
  function getSubmitButton() {
    return document.querySelector('button[type="submit"]');
  }
  function submitForm() {
    return __async(this, null, function* () {
      const submitButton = getSubmitButton();
      if (!submitButton) {
        console.log("No submit button found");
        return;
      }
      submitButton.click();
    });
  }
  function getFormNumber() {
    const forms = document.querySelectorAll("form");
    return forms.length;
  }
  function clickAllButtonsWithConfirm(temp) {
    return __async(this, null, function* () {
      const buttons = getButtons(temp);
      for (const button of buttons) {
        button.click();
        while (getFormNumber() === 1) {
          yield sleep(500);
          console.log("Opening...");
        }
        submitForm();
        while (getFormNumber() === 2) {
          yield sleep(500);
          console.log("Submitting...");
        }
      }
    });
  }
  function isClicking(button) {
    return button.querySelector("div > div").getAttribute("aria-hidden") === "true";
  }
  function clickAllButtons(temp) {
    return __async(this, null, function* () {
      const buttons = getButtons(temp);
      buttons.pop();
      for (const button of buttons) {
        button.click();
        while (!isClicking(button)) {
          yield sleep(10);
          console.log("Waiting for clicking...");
        }
        while (isClicking(button)) {
          yield sleep(500);
          console.log("Clicking...");
        }
      }
    });
  }
  function smartClickAllButtons(temp) {
    return __async(this, null, function* () {
      const buttons = getButtons(temp);
      const testText = buttons[0].textContent;
      if (testText == null ? void 0 : testText.startsWith("U")) {
        yield clickAllButtons(temp);
      } else {
        yield clickAllButtonsWithConfirm(temp);
      }
    });
  }
  function getScrollerInner() {
    return document.querySelector("[data-list-id='chat-messages']");
  }
  function onScrollerInnerChange(callback) {
    let observer = new MutationObserver((mutations) => {
      for (let mutation of mutations) {
        for (let node of Array.from(mutation.addedNodes)) {
          if (node.nodeName.toLowerCase() === "li" && node instanceof Element)
            callback(node);
        }
      }
    });
    const scrollerInner = getScrollerInner();
    if (!scrollerInner)
      return null;
    observer.observe(scrollerInner, { childList: true });
    return observer;
  }

  // src/index.ts
  function initialize() {
    return __async(this, null, function* () {
      yield new Promise((resolve) => window.addEventListener("load", resolve));
      yield new Promise((resolve) => setTimeout(resolve, 6e3));
    });
  }
  function addClickAllButton(root) {
    const buttonContainers = getButtonContainers(root);
    for (const buttonContainer of buttonContainers) {
      if (getButtons(buttonContainer).length < 4)
        continue;
      const clickAllButton = oneMoreButton(buttonContainer);
      clickAllButton.textContent = "ALL";
      clickAllButton.addEventListener("click", () => {
        smartClickAllButtons(buttonContainer);
      });
    }
  }
  function addClickAllButtonWithCheck(root) {
    if (!(root == null ? void 0 : root.querySelector(".cloned-button")))
      addClickAllButton(root);
  }
  function checkClickAllButtonFiveTimes(root) {
    return __async(this, null, function* () {
      for (let i = 0; i < 5; i++) {
        yield new Promise((resolve) => setTimeout(resolve, 3e3));
        addClickAllButtonWithCheck(root);
      }
    });
  }
  function addClickAllButtonWithCheckFiveTimes(root) {
    return __async(this, null, function* () {
      addClickAllButton(root);
      yield checkClickAllButtonFiveTimes(root);
    });
  }
  function main() {
    return __async(this, null, function* () {
      yield initialize();
      addClickAllButton(void 0);
      onScrollerInnerChange(addClickAllButtonWithCheckFiveTimes);
      onUrlChange(() => {
        addClickAllButton(void 0);
        onScrollerInnerChange(addClickAllButtonWithCheckFiveTimes);
      });
    });
  }
  (function() {
    main();
  })();
})();
