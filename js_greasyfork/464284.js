// ==UserScript==
// @name                 ChatGPT is GPT4 by default（PLUS only available）
// @name:zh-CN           ChatGPT默认为GPT4（仅PLUS可用）
// @description          ChatGPT switch The default is GPT4
// @description:zh-cn   ChatGPT switch The default is GPT4
// @version             0.1.7
// @icon               https://chat.openai.com/favicon.ico
// @match              https://chat.openai.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @namespace https://greasyfork.org/zh-CN/scripts/464284-chatgpt-is-gpt4-by-default-plus-only-available
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/464284/ChatGPT%20is%20GPT4%20by%20default%EF%BC%88PLUS%20only%20available%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/464284/ChatGPT%20is%20GPT4%20by%20default%EF%BC%88PLUS%20only%20available%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const BUTTONS_GROUPS = ['GPT-3.5', 'GPT-4']
    const DEFAULT_BUTTON = 'GPT-4'
    let menus = []
    let isSwitch = false;

    // 注册脚本菜单
    const registerMenuCommand = () => {
      const onHandle = (value) => {
        GM_setValue('defaultModel', value)
        registerMenuCommand()
      }
      if (!GM_getValue('defaultModel')) GM_setValue('defaultModel', DEFAULT_BUTTON)
      const defaultValue = GM_getValue('defaultModel')
      menus.forEach(menu => GM_unregisterMenuCommand(menu))
      menus = BUTTONS_GROUPS.map((buttonText) => GM_registerMenuCommand(`切换默认为：${buttonText}${defaultValue === buttonText ? '（当前）' : ''}`, () => onHandle(buttonText)))
    }

    const checkButton = (addedNode) => {
      const model = `${GM_getValue('defaultModel')}`
      if (addedNode.nodeType === Node.ELEMENT_NODE) {
        const buttons = addedNode.querySelectorAll('button');
        for (let button of buttons) {
          if (button.textContent === model) {
            button.querySelector('span')?.click();
            button.querySelector('span')?.click();
            return true;
          }
        }
      }
      return false;
    }

    const handleClick = () => {
      isSwitch = true;
    }

    // 监听newChat事件
    const addEventTargetA = () => {
      const buttons = document.querySelectorAll('a')
      for (const button of buttons) {
        if (button.textContent === 'New chat') {
          button.removeEventListener('click', handleClick)
          button.addEventListener('click', handleClick)
          break;
        }
      }
    }



    const callback = (mutationRecords) => {
      for (const mutationRecord of mutationRecords) {
        if (mutationRecord.addedNodes.length) {
          for (const addedNode of mutationRecord.addedNodes) {
            if (checkButton(addedNode)) return;
          }
        }
      }
      addEventTargetA()
    };
    registerMenuCommand()
    addEventTargetA();
    const observer = new MutationObserver(callback);
    observer.observe(document.getElementById('__next'), {
      childList: true,
      subtree: true,
    });

    // 修改pushStatus和replaceStatus
    const pushState = window.history.pushState;
    const replaceState = window.history.replaceState;
    window.history.pushState = function () {
      if (isSwitch) {
        setTimeout(() => checkButton(document.getElementById('__next')), 300)
      }
      pushState.apply(this, arguments);
      isSwitch = false
    }
    window.history.replaceState = function () {
      if (isSwitch) {
        setTimeout(() => checkButton(document.getElementById('__next')), 300)
      }
      replaceState.apply(this, arguments);
      isSwitch = false
    }

  })();
