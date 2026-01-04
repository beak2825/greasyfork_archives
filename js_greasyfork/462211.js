// ==UserScript==
// @name ⚠️chatgpt-infinite (Archive)
// @namespace https://github.com/mefengl
// @version 0.2.6
// @description Infinite auto ask for chatgpt
// @author mefengl
// @match https://chat.openai.com/*
// @icon https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @grant none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/462211/%E2%9A%A0%EF%B8%8Fchatgpt-infinite%20%28Archive%29.user.js
// @updateURL https://update.greasyfork.org/scripts/462211/%E2%9A%A0%EF%B8%8Fchatgpt-infinite%20%28Archive%29.meta.js
// ==/UserScript==
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

  // ../../packages/chatgpt/dist/index.mjs

/*
 *  The code in this function was adapted from the chatgptjs/chatgpt.js library,
 *  authored by Adam Lui and 冯不游
 *  (https://chatgptjs.org) and licensed under the MIT License.
 */

  var ChatGPT = class {
    constructor() {
      this.clearChatsCnt = 0;
      this.isDisplaying = false;
      this.status = "idle";
      this.prevStatus = "idle";
      this.events = {};
    }
    clearChats() {
      var _a;
      const clearLabels = ["Clear conversations", "Confirm clear conversations"];
      if (!this.clearChatsCnt)
        this.clearChatsCnt = 0;
      if (this.clearChatsCnt >= clearLabels.length)
        return;
      for (const navLink of Array.from(document.querySelectorAll("nav > a"))) {
        if ((_a = navLink.textContent) == null ? void 0 : _a.includes(clearLabels[this.clearChatsCnt])) {
          navLink.click();
          this.clearChatsCnt++;
          setTimeout(() => this.clearChats(), 500);
          return;
        }
      }
    }
    getChatInput() {
      return document.querySelector("form textarea").value;
    }
    getNewChatButton() {
      var _a;
      for (const navLink of Array.from(document.querySelectorAll("nav > a"))) {
        if ((_a = navLink.textContent) == null ? void 0 : _a.includes("New chat")) {
          return navLink;
        }
      }
    }
    getRegenerateButton() {
      const form = document.querySelector("form");
      const buttons = form.querySelectorAll("button");
      const result = Array.from(buttons).find((button) => {
        var _a;
        return (_a = button.textContent) == null ? void 0 : _a.trim().toLowerCase().includes("regenerate");
      });
      return result;
    }
    getSendButton() {
      return document.querySelector('form button[class*="bottom"]');
    }
    getStopGeneratingButton() {
      const form = document.querySelector("form");
      const buttons = form.querySelectorAll("button");
      return Array.from(buttons).find((button) => {
        var _a;
        return (_a = button.textContent) == null ? void 0 : _a.trim().toLowerCase().includes("stop generating");
      });
    }
    getTextarea() {
      const form = document.querySelector("form");
      const textareas = form.querySelectorAll("textarea");
      const result = textareas[0];
      return result;
    }
    getLastResponseElement() {
      const responseElements = document.querySelectorAll(".group.w-full");
      return responseElements[responseElements.length - 1];
    }
    getLastResponse() {
      const lastResponseElement = this.getLastResponseElement();
      if (!lastResponseElement)
        return null;
      const lastResponse = lastResponseElement.textContent;
      return lastResponse;
    }
    send(msg) {
      const textarea = this.getTextarea();
      textarea.value = msg;
      const sendButton = this.getSendButton();
      sendButton && sendButton.click();
    }
    stop() {
      const stopGeneratingButton = this.getStopGeneratingButton();
      stopGeneratingButton && stopGeneratingButton.click();
    }
    regenerate() {
      const regenerateButton = this.getRegenerateButton();
      regenerateButton && regenerateButton.click();
    }
    new() {
      const newChatButton = this.getNewChatButton();
      newChatButton && newChatButton.click();
    }
    sendInNewChat(msg) {
      this.new();
      setTimeout(() => {
        this.send(msg);
      }, 500);
    }
    notify(msg, position = "top") {
      const vOffset = 13;
      const hOffset = 27;
      const notificationDuration = 1.75;
      const fadeDuration = 0.6;
      let notificationDiv = document.querySelector("#notification-alert");
      if (!notificationDiv) {
        notificationDiv = document.createElement("div");
        notificationDiv.id = "notification-alert";
        notificationDiv.style.cssText = "background-color: black; padding: 10px; border-radius: 8px; opacity: 0; position: fixed; z-index: 9999; font-size: 1.8rem; color: white";
        document.body.appendChild(notificationDiv);
      }
      notificationDiv.style.top = !/low|bottom/i.test(position) ? `${vOffset}px` : "";
      notificationDiv.style.bottom = /low|bottom/i.test(position) ? `${vOffset}px` : "";
      notificationDiv.style.right = !/left/i.test(position) ? `${hOffset}px` : "";
      notificationDiv.style.left = /left/i.test(position) ? `${hOffset}px` : "";
      if (this.isDisplaying)
        clearTimeout(this.hideTimer);
      notificationDiv.innerHTML = msg;
      notificationDiv.style.transition = "none";
      notificationDiv.style.opacity = "1";
      this.isDisplaying = true;
      const hideDelay = fadeDuration > notificationDuration ? 0 : notificationDuration - fadeDuration;
      this.hideTimer = setTimeout(() => {
        notificationDiv.style.transition = `opacity ${fadeDuration}s`;
        notificationDiv.style.opacity = "0";
        this.isDisplaying = false;
      }, hideDelay * 1e3);
    }
    startNewChat() {
      var _a;
      for (const link of Array.from(document.getElementsByTagName("a"))) {
        if ((_a = link.textContent) == null ? void 0 : _a.includes("New chat")) {
          link.click();
          break;
        }
      }
    }
    updateStatus() {
      const stopGeneratingButton = this.getStopGeneratingButton();
      if (stopGeneratingButton) {
        this.status = "generating";
      } else {
        this.status = "idle";
      }
      if (this.status !== this.prevStatus) {
        this.toggleStatus();
      }
    }
    toggleStatus() {
      this.prevStatus = this.status;
      if (this.status === "idle") {
        this.emit("onIdle");
      } else if (this.status === "generating") {
        this.emit("onGenerating");
      }
    }
    on(eventName, callback) {
      if (!this.events[eventName]) {
        this.events[eventName] = [];
      }
      this.events[eventName].push(callback);
    }
    once(eventName, callback) {
      const oneTimeCallback = (...args) => {
        callback.apply(null, args);
        this.removeListener(eventName, oneTimeCallback);
      };
      this.on(eventName, oneTimeCallback);
    }
    removeListener(eventName, callback) {
      if (this.events[eventName]) {
        this.events[eventName] = this.events[eventName].filter((cb) => cb !== callback);
      }
    }
    emit(eventName, ...args) {
      if (this.events[eventName]) {
        this.events[eventName].forEach((callback) => {
          callback.apply(null, args);
        });
      }
    }
  };
  var src_default = ChatGPT;

  // src/askForLanguage/index.ts
  function askForLanguage() {
    return __async(this, null, function* () {
      return prompt("What language do you want to use?");
    });
  }

  // src/infiniteLoop/index.ts
  var chatgpt = new src_default();
  function startInfiniteLoop() {
    return __async(this, null, function* () {
      const language = yield askForLanguage();
      if (!language)
        return;
      chatgpt.send(`you can only answer question in ${language} language`);
      yield waitForIdle();
      while (true) {
        const lastResponse = chatgpt.getLastResponse();
        const question = extractQuestion(lastResponse);
        yield chatgpt.send(question + "\nanswer above question, and show me one more further question I can ask in the end prefixed with Q:");
        yield waitForIdle();
        yield sleep(5e3);
      }
    });
  }
  function extractQuestion(text) {
    return text.split("Q:").pop().trim();
  }
  function waitForIdle() {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (chatgpt.getRegenerateButton()) {
          clearInterval(interval);
          resolve();
        }
      }, 1e3);
    });
  }
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  var infiniteLoop_default = startInfiniteLoop;

  // src/index.ts
  function initialize() {
    return __async(this, null, function* () {
      yield new Promise((resolve) => window.addEventListener("load", resolve));
      yield new Promise((resolve) => setTimeout(resolve, 1e3));
    });
  }
  function main() {
    return __async(this, null, function* () {
      yield initialize();
      infiniteLoop_default();
    });
  }
  (function() {
    main();
  })();
})();

