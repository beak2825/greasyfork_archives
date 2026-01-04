// ==UserScript==
// @name         ChatGPT Auto-Continue 🔄
// @description  ⚡ Automatically click the 'Continue Generating' button in ChatGPT, handling errors!
// @author       mefengl
// @version      1.1.18
// @namespace    https://github.com/mefengl
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @license      MIT
// @match        https://chatgpt.com/*
// @grant        none

// @name:en      ChatGPT Auto-Continue 🔄
// @description:en ⚡ Automatically click the 'Continue Generating' button in ChatGPT, handling errors!
// @name:zh-CN   ChatGPT 自动继续 🔄
// @description:zh-CN ⚡ 自动点击ChatGPT中的“继续生成”按钮，处理错误！
// @name:es      ChatGPT Auto-Continuar 🔄
// @description:es ⚡ ¡Haz clic automáticamente en el botón 'Continuar generando' en ChatGPT, manejando errores!
// @name:hi      ChatGPT स्वचालित जारी रखें 🔄
// @description:hi ⚡ ChatGPT में 'जारी रखने' बटन पर स्वचालित रूप से क्लिक करें, त्रुटियों को संभालते हुए!
// @name:ar      ChatGPT التكميل الآلي 🔄
// @description:ar ⚡ انقر تلقائيًا على زر 'متابعة التوليد' في ChatGPT ، معالجة الأخطاء!
// @name:pt      ChatGPT Auto-Continuar 🔄
// @description:pt ⚡ Clique automaticamente no botão 'Continuar Gerando' no ChatGPT, tratando erros!
// @name:ru      ChatGPT Авто-Продолжение 🔄
// @description:ru ⚡ Автоматически нажимайте на кнопку "Продолжить генерацию" в ChatGPT, обрабатывая ошибки!
// @name:ja      ChatGPT 自動続行 🔄
// @description:ja ⚡ ChatGPTの「続けて生成」ボタンを自動的にクリックし、エラーを処理します！
// @name:de      ChatGPT Auto-Fortsetzen 🔄
// @description:de ⚡ Klicken Sie automatisch auf die Schaltfläche "Generierung fortsetzen" in ChatGPT, Fehler behandeln!
// @name:fr      ChatGPT Auto-Continuer 🔄
// @description:fr ⚡ Cliquez automatiquement sur le bouton 'Continuer à générer' dans ChatGPT, gérer les erreurs!
// @downloadURL https://update.greasyfork.org/scripts/466663/ChatGPT%20Auto-Continue%20%F0%9F%94%84.user.js
// @updateURL https://update.greasyfork.org/scripts/466663/ChatGPT%20Auto-Continue%20%F0%9F%94%84.meta.js
// ==/UserScript==
"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
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

  // ../../packages/chatkit/dist/chatgpt/index.js
  var require_chatgpt = __commonJS({
    "../../packages/chatkit/dist/chatgpt/index.js"(exports, module) {
      "use strict";
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var chatgpt_exports = {};
      __export(chatgpt_exports, {
        clickFollowUpButton: () => clickFollowUpButton,
        getButton: () => getButton,
        getContinueGeneratingButton: () => getContinueGeneratingButton2,
        getConversation: () => getConversation,
        getCopyLinkButton: () => getCopyLinkButton,
        getFollowUpButtons: () => getFollowUpButtons,
        getHistoryBlockTitle: () => getHistoryBlockTitle,
        getHistoryBlocks: () => getHistoryBlocks,
        getHistoryBlocksWithTitle: () => getHistoryBlocksWithTitle,
        getInitialButtons: () => getInitialButtons,
        getLastResponse: () => getLastResponse,
        getLastResponseElement: () => getLastResponseElement,
        getModelSelectButton: () => getModelSelectButton,
        getNav: () => getNav,
        getNewModelSelectButtons: () => getNewModelSelectButtons,
        getRegenerateButton: () => getRegenerateButton2,
        getResponseElementHTMLs: () => getResponseElementHTMLs,
        getShareChatButton: () => getShareChatButton,
        getStopGeneratingButton: () => getStopGeneratingButton,
        getSubmitButton: () => getSubmitButton,
        getTextarea: () => getTextarea2,
        getTextareaValue: () => getTextareaValue,
        hasNewModelSelectButtons: () => hasNewModelSelectButtons,
        isConversationStarted: () => isConversationStarted,
        isGenerating: () => isGenerating2,
        isHorizontalConversation: () => isHorizontalConversation,
        onSend: () => onSend,
        regenerate: () => regenerate,
        send: () => send,
        sendArray: () => sendArray,
        setHorizontalConversation: () => setHorizontalConversation,
        setPromptListener: () => setPromptListener,
        setPureConversation: () => setPureConversation,
        setTextarea: () => setTextarea,
        waitForIdle: () => waitForIdle
      });
      module.exports = __toCommonJS(chatgpt_exports);
      function getNav() {
        return document.querySelector("nav");
      }
      function getHistoryBlocks() {
        const nav = getNav();
        if (!nav)
          return [];
        const result = Array.from(nav.querySelectorAll("ol")).map((ol) => ol.parentElement);
        return result;
      }
      function getHistoryBlockTitle(historyBlock) {
        var _a;
        return ((_a = historyBlock.querySelector("h3")) == null ? void 0 : _a.textContent) || "";
      }
      function getHistoryBlocksWithTitle() {
        const historyBlocks = getHistoryBlocks();
        const result = historyBlocks.map((historyBlock) => ({
          block: historyBlock,
          title: getHistoryBlockTitle(historyBlock)
        }));
        return result;
      }
      function getTextarea2() {
        const form = document.querySelector("form");
        if (!form)
          return;
        const textareas = form.querySelectorAll("textarea");
        const result = textareas[0];
        return result;
      }
      function getNewSubmitButton() {
        return document.querySelector('button[data-testid$="send-button"]');
      }
      function getSubmitButton() {
        if (getNewSubmitButton()) {
          return getNewSubmitButton();
        }
        const textarea = getTextarea2();
        if (!textarea)
          return;
        return textarea.nextElementSibling;
      }
      function getInitialButtons() {
        return Array.from(document.querySelectorAll('button[as="button"]')).filter((button) => button.querySelectorAll(".truncate").length === 2);
      }
      function getFollowUpButtons() {
        return Array.from(document.querySelectorAll('button[as="button"]')).filter((button) => {
          var _a;
          return (_a = button.textContent) == null ? void 0 : _a.trim().match(/[.!?]$/);
        });
      }
      function clickFollowUpButton(index) {
        const followUpButtons = getFollowUpButtons();
        if (followUpButtons.length === 0)
          return;
        if (index === void 0 || index < 0 || index >= followUpButtons.length) {
          index = Math.floor(Math.random() * followUpButtons.length);
        }
        followUpButtons[index].click();
      }
      function getButton(text) {
        const button = Array.from(document.querySelectorAll('button[data-testid$="button"]')).find((button2) => {
          var _a;
          return (_a = button2.getAttribute("data-testid")) == null ? void 0 : _a.includes(text);
        });
        if (button)
          return button;
        return Array.from(document.querySelectorAll('button[as="button"]')).find((button2) => {
          var _a;
          return (_a = button2.textContent) == null ? void 0 : _a.trim().toLowerCase().includes(text);
        });
      }
      function getRegenerateButton2() {
        return getButton("regenerate");
      }
      function getContinueGeneratingButton2() {
        const buttonInWideScreen = getButton("continue");
        if (buttonInWideScreen)
          return buttonInWideScreen;
        function getNthGenerationDescendants(element, generation) {
          const descendants = [];
          function findDescendants(node, currentDepth) {
            if (currentDepth === generation) {
              descendants.push(node);
              return;
            }
            node.childNodes.forEach((child) => findDescendants(child, currentDepth + 1));
          }
          findDescendants(element, 0);
          return descendants;
        }
        const form = document.querySelector("form");
        if (!form)
          return;
        const seventhGenerationDescendants = getNthGenerationDescendants(form, 7);
        if (seventhGenerationDescendants.length === 0 || seventhGenerationDescendants[0].nodeName !== "BUTTON")
          return;
        return seventhGenerationDescendants[0];
      }
      function getNewStopGeneratingButton() {
        const stopButtonNotLogin = document.querySelector('button[aria-label="Stop generating"]');
        const stopButton = document.querySelector('button[data-testid$="stop-button"]');
        return stopButtonNotLogin || stopButton;
      }
      function getStopGeneratingButton() {
        return getNewStopGeneratingButton() || getButton("stop");
      }
      function getResponseElementHTMLs() {
        return Array.from(document.querySelectorAll(".markdown")).map((m) => m.innerHTML);
      }
      function getLastResponseElement() {
        const responseElements = document.querySelectorAll(".group.w-full");
        return responseElements[responseElements.length - 1];
      }
      function getLastResponse() {
        const lastResponseElement = getLastResponseElement();
        if (!lastResponseElement)
          return;
        const lastResponse = lastResponseElement.textContent;
        return lastResponse;
      }
      function getTextareaValue() {
        var _a;
        return ((_a = getTextarea2()) == null ? void 0 : _a.value) || "";
      }
      function setTextarea(message) {
        const textarea = getTextarea2();
        if (!textarea)
          return;
        textarea.value = message;
        textarea.dispatchEvent(new Event("input", { bubbles: true }));
      }
      function send(message) {
        return __async(this, null, function* () {
          var _a;
          setTextarea(message);
          const textarea = getTextarea2();
          if (!textarea)
            return;
          (_a = getSubmitButton()) == null ? void 0 : _a.click();
          for (let i = 0; i < 10; i++) {
            if (isGenerating2()) {
              break;
            }
            yield new Promise((resolve) => setTimeout(resolve, 1e3));
          }
        });
      }
      function regenerate() {
        const regenerateButton = getRegenerateButton2();
        if (!regenerateButton)
          return;
        regenerateButton.click();
      }
      function onSend(callback) {
        const textarea = getTextarea2();
        if (!textarea)
          return;
        textarea.addEventListener("keydown", function(event) {
          if (event.key === "Enter" && !event.shiftKey) {
            callback();
          }
        });
        const sendButton = getSubmitButton();
        if (!sendButton)
          return;
        sendButton.addEventListener("mousedown", callback);
      }
      function isGenerating2() {
        var _a, _b;
        if (getNewStopGeneratingButton()) {
          return true;
        }
        return ((_b = (_a = getSubmitButton()) == null ? void 0 : _a.firstElementChild) == null ? void 0 : _b.childElementCount) === 3;
      }
      function waitForIdle() {
        return new Promise((resolve) => {
          const interval = setInterval(() => {
            if (!isGenerating2()) {
              clearInterval(interval);
              resolve();
            }
          }, 1e3);
        });
      }
      function sendArray(messages) {
        return __async(this, null, function* () {
          var _a, _b;
          let firstTime = true;
          const isLong = messages.length > 60;
          let stop = false;
          while (messages.length > 0 || stop) {
            stop = false;
            const waitTime = isLong && !document.hasFocus() ? 20 * 1e3 : 2e3;
            if (!firstTime) {
              yield new Promise((resolve) => setTimeout(resolve, waitTime));
            }
            firstTime = false;
            if (isGenerating2()) {
              continue;
            } else if (getContinueGeneratingButton2()) {
              (_a = getContinueGeneratingButton2()) == null ? void 0 : _a.click();
              stop = true;
              continue;
            } else if (getRegenerateButton2() && !getTextarea2()) {
              yield new Promise((resolve) => setTimeout(resolve, 10 * 1e3));
              (_b = getRegenerateButton2()) == null ? void 0 : _b.click();
              stop = true;
              continue;
            }
            if (messages.length === 0) {
              break;
            }
            yield send(messages.shift() || "");
          }
        });
      }
      function setPromptListener(key = "prompt_texts") {
        let last_trigger_time = +/* @__PURE__ */ new Date();
        if (location.href.includes("chatgpt.com")) {
          GM_addValueChangeListener(key, (name, old_value, new_value) => __async(this, null, function* () {
            if (+/* @__PURE__ */ new Date() - last_trigger_time < 500) {
              return;
            }
            last_trigger_time = +/* @__PURE__ */ new Date();
            setTimeout(() => __async(this, null, function* () {
              sendArray(new_value);
              GM_setValue(key, []);
            }), 0);
          }));
        }
      }
      function getConversation() {
        var _a, _b;
        return (_b = (_a = document.querySelector('div[class^="react-scroll-to-bottom"]')) == null ? void 0 : _a.firstChild) == null ? void 0 : _b.firstChild;
      }
      function getModelSelectButton() {
        const conversation = getConversation();
        if (!conversation)
          return;
        return Array.from(conversation.querySelectorAll("button")).find((button) => {
          var _a;
          return (_a = button.textContent) == null ? void 0 : _a.trim().toLowerCase().includes("model");
        });
      }
      function getNewModelSelectButtons() {
        return Array.from(document.querySelectorAll("[class^='group/button']"));
      }
      function hasNewModelSelectButtons() {
        return getNewModelSelectButtons().length > 0;
      }
      function isConversationStarted() {
        return !getModelSelectButton();
      }
      function setPureConversation() {
        const conversation = getConversation();
        if (!conversation)
          return;
        const firstChild = conversation.firstChild;
        if (!firstChild)
          return;
        const newDiv = document.createElement("div");
        conversation.insertBefore(newDiv, firstChild.nextSibling);
      }
      function isHorizontalConversation() {
        const conversation = getConversation();
        if (!conversation)
          return true;
        if (!isConversationStarted())
          return true;
        return conversation.classList.contains("grid");
      }
      function setHorizontalConversation() {
        if (isHorizontalConversation())
          return;
        setPureConversation();
        const conversation = getConversation();
        if (!conversation)
          return;
        conversation.classList.remove("flex", "flex-col", "items-center");
        conversation.classList.add("grid", "grid-cols-2", "place-items-center");
      }
      function getShareChatButton() {
        return document.querySelector('button[aria-label="Share chat"]');
      }
      function getCopyLinkButton() {
        return Array.from(document.querySelectorAll('button[as="button"]')).filter((button) => {
          var _a;
          return (_a = button.textContent) == null ? void 0 : _a.trim().toLowerCase().includes("copy link");
        })[0];
      }
    }
  });

  // ../../packages/chatkit/chatgpt.js
  var require_chatgpt2 = __commonJS({
    "../../packages/chatkit/chatgpt.js"(exports, module) {
      module.exports = require_chatgpt();
    }
  });

  // src/index.ts
  var import_chatgpt = __toESM(require_chatgpt2(), 1);
  var retryCount = 0;
  var maxRetries = 3;
  var lastRetryTime = null;
  function initialize() {
    return __async(this, null, function* () {
      yield new Promise((resolve) => window.addEventListener("load", resolve));
      yield new Promise((resolve) => setTimeout(resolve, 1e3));
    });
  }
  function main() {
    return __async(this, null, function* () {
      yield initialize();
      let firstTime = true;
      setInterval(() => __async(this, null, function* () {
        var _a, _b;
        const currentTime = (/* @__PURE__ */ new Date()).getTime();
        if (lastRetryTime && currentTime - lastRetryTime >= 5 * 60 * 1e3) {
          retryCount = 0;
        }
        while (true) {
          const waitTime = !document.hasFocus() ? 20 * 1e3 : 2e3;
          if (!firstTime) {
            yield new Promise((resolve) => setTimeout(resolve, waitTime));
          }
          if (!firstTime && (0, import_chatgpt.isGenerating)()) {
            continue;
          } else if ((0, import_chatgpt.getContinueGeneratingButton)()) {
            (_a = (0, import_chatgpt.getContinueGeneratingButton)()) == null ? void 0 : _a.click();
            continue;
          } else if ((0, import_chatgpt.getRegenerateButton)() && !(0, import_chatgpt.getTextarea)()) {
            if (retryCount < maxRetries) {
              yield new Promise((resolve) => setTimeout(resolve, 2 * 1e3));
              (_b = (0, import_chatgpt.getRegenerateButton)()) == null ? void 0 : _b.click();
              retryCount++;
              lastRetryTime = (/* @__PURE__ */ new Date()).getTime();
              continue;
            } else {
              console.error("Failed to regenerate after 3 attempts. Stopping retries.");
              break;
            }
          }
          firstTime = false;
          break;
        }
      }), 1e3);
    });
  }
  (function() {
    main();
  })();
})();
