// ==UserScript==
// @name         chatgpt-set-language
// @namespace    https://github.com/mefengl
// @version      0.0.1
// @description  set chatgpt language
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @author       mefengl
// @match        https://chat.openai.com/*
// @require      https://cdn.staticfile.org/jquery/3.6.1/jquery.min.js
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addValueChangeListener
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/463119/chatgpt-set-language.user.js
// @updateURL https://update.greasyfork.org/scripts/463119/chatgpt-set-language.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const default_menu_all = {
    "chat_language": "English",
    "openai": true,
  };
  const menu_all = GM_getValue("menu_all", default_menu_all);
  // 菜单更新的逻辑
  const menus = [
    { checker: () => true, name: "chat_language", value: "English" },
  ];
  menus.forEach(menu => {
    $(() => menu.checker() && GM_setValue(menu.name, true));
    if (GM_getValue(menu.name) == true) {
      default_menu_all[menu.name] = menu.value;
    }
  });
  // 检查是否有新增菜单
  for (let name in default_menu_all) {
    if (!(name in menu_all)) {
      menu_all[name] = default_menu_all[name];
    }
  }
  const menu_id = GM_getValue("menu_id", {});
  function registerMenuCommand(name, value) {
    if (name === "chat_language") {
      return GM_registerMenuCommand(`${name}：${value}`, () => {
        const language = prompt("please input the language you want to use", value);
        if (language) {
          menu_all[name] = language;
          GM_setValue('menu_all', menu_all);
          update_menu();
          location.reload();
        }
      });
    }
    const menuText = ` ${name}：${value ? '✅' : '❌'}`;
    const commandCallback = () => {
      menu_all[name] = !menu_all[name];
      GM_setValue('menu_all', menu_all);
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
    GM_setValue('menu_id', menu_id);
  }
  update_menu();

  const suffix_prompt = `I speak ${menu_all.chat_language}, answer the question in a way that I can understand in ${menu_all.chat_language} language`;
  /* ************************************************************************* */
  const chatgpt = {
    getSubmitButton: function () {
      const form = document.querySelector('form');
      if (!form) return;
      const buttons = form.querySelectorAll('button');
      const result = buttons[buttons.length - 1];
      return result;
    },
    getTextarea: function () {
      const form = document.querySelector('form');
      if (!form) return;
      const textareas = form.querySelectorAll('textarea');
      const result = textareas[0];
      return result;
    },
    getRegenerateButton: function () {
      const form = document.querySelector('form');
      if (!form) return;
      const buttons = form.querySelectorAll('button');
      for (let i = 0; i < buttons.length; i++) {
        const buttonText = buttons[i]?.textContent?.trim().toLowerCase();
        if (buttonText?.includes('regenerate')) {
          return buttons[i];
        }
      }
    },
    getStopGeneratingButton: function () {
      const form = document.querySelector('form');
      if (!form) return;
      const buttons = form.querySelectorAll('button');
      if (buttons.length === 0) return;
      for (let i = 0; i < buttons.length; i++) {
        const buttonText = buttons[i]?.textContent?.trim().toLowerCase();
        if (buttonText?.includes('stop')) {
          return buttons[i];
        }
      }
    },
    send: function (text) {
      const textarea = this.getTextarea();
      if (!textarea) return;
      textarea.value = text;
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
      textarea.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    },
    onSend: function (callback) {
      const textarea = this.getTextarea();
      if (!textarea) return;
      textarea.addEventListener("keydown", function (event) {
        if (event.key === "Enter" && !event.shiftKey) {
          callback();
        }
      });
      const sendButton = this.getSubmitButton();
      if (!sendButton) return;
      sendButton.addEventListener('mousedown', callback);
    },
  };
  // ChatGPT send prompt to other ai
  $(() => {
    if (menu_all.openai && location.href.includes("chat.openai")) {
      chatgpt.onSend(() => {
        const textarea = chatgpt.getTextarea();
        const prompt = textarea.value;
        textarea.value = prompt + "\n" + suffix_prompt;
      });
    }
  });
})();
