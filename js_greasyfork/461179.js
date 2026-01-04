// ==UserScript==
// @name         Doozy
// @namespace    https://github.com/mefengl
// @version      0.8.31
// @description  A wonderful day spent with ChatGPT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @author       mefengl
// @match        https://chatgpt.com/*
// @match        http://*/*
// @match        https://*/*
// @require      https://cdn.staticfile.org/jquery/3.6.1/jquery.min.js
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addValueChangeListener
// @license      MIT

// @name:en      Doozy
// @description:en A wonderful day spent with ChatGPT
// @name:zh-CN   奇妙的一天
// @description:zh-CN 与ChatGPT度过的美好时光
// @name:es      Doozy
// @description:es Un día maravilloso pasado con ChatGPT
// @name:hi      धमाकेदार
// @description:hi चैट जीपीटी के साथ बिताए एक अद्भुत दिन
// @name:ar      دوزي
// @description:ar يوم رائع قضيته مع ChatGPT
// @name:pt      Espetacular
// @description:pt Um dia maravilhoso passado com o ChatGPT
// @name:ru      Блестящий
// @description:ru Замечательный день, проведенный с ChatGPT
// @name:ja      ドゥーズィ
// @description:ja ChatGPTと過ごす素晴らしい一日
// @name:de      Doozy
// @description:de Ein wunderbarer Tag mit ChatGPT verbracht
// @name:fr      Doozy
// @description:fr Une journée merveilleuse passée avec ChatGPT
// @downloadURL https://update.greasyfork.org/scripts/461179/Doozy.user.js
// @updateURL https://update.greasyfork.org/scripts/461179/Doozy.meta.js
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
        getContinueGeneratingButton: () => getContinueGeneratingButton,
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
        getTextarea: () => getTextarea,
        getTextareaValue: () => getTextareaValue,
        hasNewModelSelectButtons: () => hasNewModelSelectButtons,
        isConversationStarted: () => isConversationStarted,
        isGenerating: () => isGenerating,
        isHorizontalConversation: () => isHorizontalConversation,
        onSend: () => onSend,
        regenerate: () => regenerate,
        send: () => send2,
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
      function getTextarea() {
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
        const textarea = getTextarea();
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
      function getContinueGeneratingButton() {
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
        return ((_a = getTextarea()) == null ? void 0 : _a.value) || "";
      }
      function setTextarea(message) {
        const textarea = getTextarea();
        if (!textarea)
          return;
        textarea.value = message;
        textarea.dispatchEvent(new Event("input", { bubbles: true }));
      }
      function send2(message) {
        return __async(this, null, function* () {
          var _a;
          setTextarea(message);
          const textarea = getTextarea();
          if (!textarea)
            return;
          (_a = getSubmitButton()) == null ? void 0 : _a.click();
          for (let i = 0; i < 10; i++) {
            if (isGenerating()) {
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
        const textarea = getTextarea();
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
      function isGenerating() {
        var _a, _b;
        if (getNewStopGeneratingButton()) {
          return true;
        }
        return ((_b = (_a = getSubmitButton()) == null ? void 0 : _a.firstElementChild) == null ? void 0 : _b.childElementCount) === 3;
      }
      function waitForIdle() {
        return new Promise((resolve) => {
          const interval = setInterval(() => {
            if (!isGenerating()) {
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
            if (isGenerating()) {
              continue;
            } else if (getContinueGeneratingButton()) {
              (_a = getContinueGeneratingButton()) == null ? void 0 : _a.click();
              stop = true;
              continue;
            } else if (getRegenerateButton2() && !getTextarea()) {
              yield new Promise((resolve) => setTimeout(resolve, 10 * 1e3));
              (_b = getRegenerateButton2()) == null ? void 0 : _b.click();
              stop = true;
              continue;
            }
            if (messages.length === 0) {
              break;
            }
            yield send2(messages.shift() || "");
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

  // src/index.js
  var import_chatgpt = __toESM(require_chatgpt2(), 1);
  (function() {
    "use strict";
    const default_menu_all = {};
    const menu_all = GM_getValue("menu_all", default_menu_all);
    const menus = [
      { checker: () => location.href.includes("book.douban"), name: "douban_book", value: true },
      { checker: () => location.href.includes("zhihu"), name: "zhihu", value: true },
      { checker: () => location.href.includes("news.ycombinator"), name: "hackernews", value: true },
      { checker: () => location.href.includes("github"), name: "github", value: true },
      { checker: () => location.href.includes("wikipedia"), name: "wikipedia", value: true },
      { checker: () => location.href.includes("nytimes.com"), name: "nytimes", value: true },
      { checker: () => location.href.includes("baidu.com"), name: "baidu", value: true },
      { checker: () => location.href.includes("reddit.com"), name: "reddit", value: true },
      { checker: () => location.href.includes("google.com"), name: "google", value: true },
      { checker: () => location.href.includes("youtube.com"), name: "youtube", value: true }
    ];
    menus.forEach((menu) => {
      $(() => menu.checker() && GM_setValue(menu.name, true) && console.log(`\u5F00\u542F ${menu.name} \u83DC\u5355`));
      if (GM_getValue(menu.name) == true) {
        default_menu_all[menu.name] = menu.value;
      }
    });
    for (let name in default_menu_all) {
      if (!(name in menu_all)) {
        menu_all[name] = default_menu_all[name];
      }
    }
    const menu_id = GM_getValue("menu_id", {});
    function registerMenuCommand(name, value) {
      const menuText = ` ${name}\uFF1A${value ? "\u2705" : "\u274C"}`;
      const commandCallback = () => {
        menu_all[name] = !menu_all[name];
        GM_setValue("menu_all", menu_all);
        update_menu();
        location.reload();
      };
      return GM_registerMenuCommand(menuText, commandCallback);
    }
    function update_menu() {
      for (let name in menu_all) {
        const value = menu_all[name];
        if (menu_id[name]) {
          GM_unregisterMenuCommand(menu_id[name]);
        }
        menu_id[name] = registerMenuCommand(name, value);
      }
      GM_setValue("menu_id", menu_id);
    }
    update_menu();
    const douban_book_prompts = [
      ({ title, author }) => `${author}\u7684\u300A${title}\u300B\u7684\u4E3B\u8981\u89C2\u70B9\u5217\u6210\u8868\u683C\u4F1A\u662F\uFF1A`,
      ({ title, author }) => `${author}\u7684\u300A${title}\u300B\u6BD4\u8F83\u91CD\u8981\u7684\u7AE0\u8282\u4F1A\u662F\uFF1A`,
      ({ title, author }) => `${author}\u7684\u300A${title}\u300B\u5728\u54EA\u4E9B\u65B9\u9762\u662F\u6709\u4E89\u8BAE\u7684\u4F1A\u662F\uFF1A`,
      ({ title, author }) => `${author}\u7684\u300A${title}\u300B\u5F53\u4EBA\u4EEC\u751F\u6D3B\u5728\u4E0D\u540C\u7684\u65F6\u4EE3\u65F6\uFF0C\u4F1A\u6709\u4EC0\u4E48\u4E0D\u540C\u7684\u89C2\u70B9\u4F1A\u662F\uFF1A`,
      ({ title, author }) => `${author}\u7684\u300A${title}\u300B\u7EFC\u5408Goodreads\u8BC4\u5206\u548C\u8C46\u74E3\u7B49\u5404\u79CD\u8BC4\u5206\u548C\u8BC4\u4EF7\u4F1A\u662F\uFF1A`,
      ({ title, author }) => `${author}\u7684\u300A${title}\u300B\u7684\u7C7B\u4F3C\u4E66\u7C4D\u6216\u6587\u7AE0\u548C\u5B83\u4EEC\u7684\u533A\u522B\u4F1A\u662F\uFF1A`,
      ({ title, author }) => `${author}\u7684\u300A${title}\u300B\u7684\u89C2\u70B9\u76F8\u53CD\u7684\u4E66\u7C4D\u6216\u6587\u7AE0\u548C\u5BF9\u5E94\u7684\u89C2\u70B9\u4F1A\u662F\uFF1A`
    ];
    const question_prompts = [
      ({ question }) => `\u95EE\u9898\uFF1A${question}\uFF0C\u6697\u542B\u7684\u89C2\u70B9\u662F\uFF1A`,
      ({ question }) => `\u95EE\u9898\uFF1A${question}\uFF0C\u5E94\u8BE5\u53BB\u53CD\u601D\uFF1A`,
      ({ question }) => `\u95EE\u9898\uFF1A${question}\uFF0C\u60F3\u8981\u6539\u8FDB\u6216\u89E3\u51B3\u5B83\uFF0C\u53EF\u4EE5\u4ECE\u8FD9\u4E9B\u65B9\u9762\u5165\u624B\uFF1A`,
      ({ question }) => `\u95EE\u9898\uFF1A${question}\uFF0C\u63D0\u95EE\u8005\u548C\u63D0\u95EE\u8005\u7684\u76EE\u7684\u662F\uFF1A`,
      ({ question }) => `\u95EE\u9898\uFF1A${question}\uFF0C\u95EE\u9898\u7684\u76F8\u5173\u5386\u53F2\u662F\uFF1A`,
      ({ question }) => `\u95EE\u9898\uFF1A${question}\uFF0C\u4E0D\u540C\u7684\u56FD\u5BB6\u5BF9\u8FD9\u4E2A\u95EE\u9898\u7684\u770B\u6CD5\u4F1A\u662F\uFF1A`,
      ({ question }) => `\u95EE\u9898\uFF1A${question}\uFF0C\u7C7B\u4F3C\u95EE\u9898\u548C\u5B83\u4EEC\u7684\u533A\u522B\u4F1A\u662F\uFF1A`,
      ({ question }) => `\u95EE\u9898\uFF1A${question}\uFF0C\u89C2\u70B9\u76F8\u53CD\u7684\u95EE\u9898\u548C\u5BF9\u5E94\u7684\u89C2\u70B9\u4F1A\u662F\uFF1A`,
      ({ question }) => `\u95EE\u9898\uFF1A${question}\uFF0C\u5E7D\u9ED8\u7684\u56DE\u7B54\u4F1A\u662F\uFF1A`,
      ({ question }) => `\u95EE\u9898\uFF1A${question}\uFF0C\u4E3B\u8981\u89C2\u70B9\u5217\u6210\u8868\u683C\u4F1A\u662F\uFF1A`,
      ({ question }) => `\u95EE\u9898\uFF1A${question}\uFF0C\u76F8\u5173\u4E66\u7C4D\u3001\u6587\u7AE0\u3001\u89C6\u9891\u6216\u7F51\u7AD9\u4F1A\u662F\uFF1A`,
      ({ question }) => `\u4ECE\u8FD9\u4E2A\u95EE\u9898\uFF1A${question}\uFF0C\u53EF\u4EE5\u5F15\u7533\u51FA\u8FD9\u4E9B\u95EE\u9898\uFF1A`
    ];
    const github_prompts = [
      ({ website }) => `${website}\u7684\u6700\u4F73\u5B9E\u8DF5\u662F\uFF1A`,
      ({ website }) => `${website}\u7684\u7C7B\u4F3C\u9879\u76EE\u662F\uFF1A`,
      ({ website }) => `${website}\u7684\u76F8\u5173\u4E66\u7C4D\u3001\u6587\u7AE0\u3001\u89C6\u9891\u6216\u7F51\u7AD9\u662F\uFF1A`
    ];
    function chatgpt_trigger(prompt_prepare, prompts) {
      const prepare_data = prompt_prepare();
      const prompt_texts = prompts.map((prompt) => prompt(prepare_data));
      GM_setValue("prompt_texts", prompt_texts);
    }
    const triggers = [
      {
        checker: () => menu_all.douban_book && location.href.includes("book.douban.com/subject"),
        prepare: () => {
          const title = $("meta[property='og:title']").attr("content");
          const author = $("meta[property='book:author']").attr("content");
          return { title, author };
        },
        prompts: douban_book_prompts
      },
      {
        checker: () => menu_all.zhihu && location.href.includes("zhihu.com/question"),
        prepare: () => {
          const question = $('meta[itemprop="name"]').attr("content");
          return { question };
        },
        prompts: [...question_prompts]
      },
      {
        checker: () => menu_all.hackernews && location.href.includes("news.ycombinator.com/item"),
        prepare: () => {
          const question = $("td.title > span.titleline > a").text();
          return { question };
        },
        prompts: [...question_prompts]
      },
      {
        checker: () => menu_all.github && location.href.includes("github.com"),
        prepare: () => {
          const parts = location.href.split("/");
          if (parts.length >= 5 && parts[parts.length - 2] && parts[parts.length - 1]) {
            const website = parts[parts.length - 2] + "/" + parts[parts.length - 1];
            return { website };
          }
        },
        prompts: github_prompts
      },
      {
        checker: () => menu_all.wikipedia && location.href.includes("wikipedia.org/wiki/"),
        prepare: () => {
          const title = $("h1#firstHeading").text();
          const summary = $("div.mw-parser-output p").first().text();
          return { title, summary };
        },
        prompts: [
          ({ title }) => `${title}\u7684\u5386\u53F2\u548C\u91CD\u8981\u4E8B\u4EF6\u6709\u54EA\u4E9B\uFF1F`,
          ({ title }) => `${title}\u4E0E\u5176\u4ED6\u76F8\u5173\u4E3B\u9898\u7684\u6BD4\u8F83\u548C\u5BF9\u6BD4\u4F1A\u662F\uFF1A`,
          ({ title }) => `${title}\u7684\u4E3B\u8981\u89C2\u70B9\u5217\u6210\u8868\u683C\u4F1A\u662F\uFF1A`,
          ({ title }) => `${title}\u7684\u5173\u952E\u6982\u5FF5\u548C\u672F\u8BED\u662F\u4EC0\u4E48\uFF1F`,
          ({ title }) => `${title}\u7684\u7C7B\u4F3C\u8BCD\u6761\u6216\u76F8\u5173\u7814\u7A76\u548C\u5B83\u4EEC\u7684\u533A\u522B\u4F1A\u662F\uFF1A`
        ]
      },
      {
        checker: () => menu_all.nytimes && location.href.includes("nytimes.com"),
        prepare: () => {
          const articleTitle = $("h1").text();
          return { question: articleTitle };
        },
        prompts: [...question_prompts]
      },
      {
        checker: () => menu_all.baidu && location.href.includes("www.baidu.com/s"),
        prepare: () => {
          const keyword = $("input#kw").val();
          return { keyword };
        },
        prompts: [
          ({ keyword }) => `\u5173\u4E8E"${keyword}"\u7684\u6700\u65B0\u65B0\u95FB\u6709\u54EA\u4E9B\uFF1F`,
          ({ keyword }) => `"${keyword}"\u7684\u5B9A\u4E49\u548C\u89E3\u91CA\u662F\u4EC0\u4E48\uFF1F`,
          ({ keyword }) => `\u5BF9\u4E8E"${keyword}"\u8FD9\u4E2A\u8BDD\u9898\uFF0C\u4F60\u6709\u4EC0\u4E48\u89C2\u70B9\u6216\u770B\u6CD5\uFF1F`,
          ({ keyword }) => `\u8DDF"${keyword}"\u76F8\u5173\u7684\u4EBA\u7269\u6216\u4E8B\u4EF6\u6709\u54EA\u4E9B\uFF1F`,
          ({ keyword }) => `\u6700\u8FD1\u8DDF"${keyword}"\u76F8\u5173\u7684\u70ED\u95E8\u8BDD\u9898\u662F\u4EC0\u4E48\uFF1F`
        ]
      },
      {
        checker: () => menu_all.reddit && location.href.includes("reddit.com"),
        prepare: () => {
          const postTitle = $("h1._eYtD2XCVieq6emjKBH3m").text();
          const postContent = $("div._3W_31WoaKsKsZfNldTiz5M").first().text();
          return { postTitle, postContent };
        },
        prompts: [
          ({ postTitle }) => `\u5173\u4E8E"${postTitle}"\uFF0C\u4F60\u6709\u4EC0\u4E48\u60F3\u6CD5\u6216\u8BC4\u8BBA\uFF1F`,
          ({ postTitle }) => `\u80FD\u7ED9\u5927\u5BB6\u5206\u4EAB\u4E00\u4E9B"${postTitle}"\u7684\u76F8\u5173\u4FE1\u606F\u5417\uFF1F`,
          ({ postTitle }) => `\u5728"${postTitle}"\u7684\u8BA8\u8BBA\u4E2D\uFF0C\u6709\u54EA\u4E9B\u89C2\u70B9\u6216\u610F\u89C1\u6700\u503C\u5F97\u5173\u6CE8\uFF1F`,
          ({ postTitle }) => `\u5BF9\u4E8E"${postTitle}"\uFF0C\u4F60\u7684\u770B\u6CD5\u662F\u5426\u4E0E\u5176\u4ED6\u4EBA\u4E0D\u540C\uFF1F`,
          ({ postTitle }) => `\u8BF7\u7B80\u8981\u4ECB\u7ECD\u4E00\u4E0B"${postTitle}"\u7684\u4E3B\u8981\u5185\u5BB9\u548C\u80CC\u666F\u3002`
        ]
      },
      {
        checker: () => menu_all.google && location.href.includes("google.com/search?q="),
        prepare: () => {
          const keyword = $("input[name='q']").val();
          return { keyword };
        },
        prompts: [
          ({ keyword }) => `\u5173\u4E8E"${keyword}"\u7684\u6700\u65B0\u641C\u7D22\u7ED3\u679C\u6709\u54EA\u4E9B\uFF1F`,
          ({ keyword }) => `\u5BF9\u4E8E"${keyword}"\u8FD9\u4E2A\u8BDD\u9898\uFF0C\u4F60\u6709\u4EC0\u4E48\u89C2\u70B9\u6216\u770B\u6CD5\uFF1F`,
          ({ keyword }) => `\u8DDF"${keyword}"\u76F8\u5173\u7684\u4EBA\u7269\u6216\u4E8B\u4EF6\u6709\u54EA\u4E9B\uFF1F`,
          ({ keyword }) => `\u6700\u8FD1\u8DDF"${keyword}"\u76F8\u5173\u7684\u70ED\u95E8\u8BDD\u9898\u662F\u4EC0\u4E48\uFF1F`
        ]
      },
      {
        checker: () => menu_all.youtube && location.href.includes("youtube.com/watch"),
        prepare: () => {
          const metaTitle = $('meta[name="title"]').attr("content");
          return { metaTitle };
        },
        prompts: [
          ({ metaTitle }) => `\u5173\u4E8E"${metaTitle}"\u7684\u89C2\u70B9\u6216\u8BC4\u8BBA\u6709\u54EA\u4E9B\uFF1F`,
          ({ metaTitle }) => `\u80FD\u7ED9\u5927\u5BB6\u5206\u4EAB\u4E00\u4E9B\u5173\u4E8E"${metaTitle}"\u7684\u76F8\u5173\u4FE1\u606F\u5417\uFF1F`,
          ({ metaTitle }) => `\u5728"${metaTitle}"\u7684\u8BA8\u8BBA\u4E2D\uFF0C\u6709\u54EA\u4E9B\u89C2\u70B9\u6216\u610F\u89C1\u6700\u503C\u5F97\u5173\u6CE8\uFF1F`,
          ({ metaTitle }) => `\u5BF9\u4E8E"${metaTitle}"\uFF0C\u4F60\u7684\u770B\u6CD5\u662F\u5426\u4E0E\u5176\u4ED6\u4EBA\u4E0D\u540C\uFF1F`,
          ({ metaTitle }) => `\u8BF7\u7B80\u8981\u4ECB\u7ECD\u4E00\u4E0B"${metaTitle}"\u7684\u4E3B\u8981\u5185\u5BB9\u548C\u80CC\u666F\u3002`
        ]
      }
    ];
    triggers.forEach((trigger) => {
      trigger.checker() && chatgpt_trigger(trigger.prepare, trigger.prompts);
    });
    let last_trigger_time = +/* @__PURE__ */ new Date();
    $(() => {
      if (location.href.includes("chatgpt.com")) {
        GM_addValueChangeListener("prompt_texts", (name, old_value, new_value) => {
          if (+/* @__PURE__ */ new Date() - last_trigger_time < 500) {
            return;
          }
          last_trigger_time = +/* @__PURE__ */ new Date();
          setTimeout(() => __async(this, null, function* () {
            const prompt_texts = new_value;
            if (prompt_texts.length > 0) {
              let firstTime = true;
              while (prompt_texts.length > 0) {
                if (!firstTime) {
                  yield new Promise((resolve) => setTimeout(resolve, 2e3));
                }
                if (!firstTime && (0, import_chatgpt.getRegenerateButton)() == void 0) {
                  continue;
                }
                firstTime = false;
                const prompt_text = prompt_texts.shift();
                (0, import_chatgpt.send)(prompt_text);
              }
            }
          }), 0);
          GM_setValue("prompt_texts", []);
        });
      }
    });
  })();
})();
