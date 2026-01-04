// ==UserScript==
// @name 爱数自动勾选同意协议 (终极版)
// @description Autocheck agreement checkbox on login/overview pages, specifically optimized to resist unchecking even during aggressive UI updates, and ensures checkbox is checked before login.
// @namespace Violentmonkey Scripts
// @match http://192.168.64.86:9600/login
// @match https://192.168.64.86:9600/login
// @match http://192.168.64.86:9600/overview
// @match https://192.168.64.86:9600/overview
// @grant none
// @version 1.8
// @downloadURL https://update.greasyfork.org/scripts/465624/%E7%88%B1%E6%95%B0%E8%87%AA%E5%8A%A8%E5%8B%BE%E9%80%89%E5%90%8C%E6%84%8F%E5%8D%8F%E8%AE%AE%20%28%E7%BB%88%E6%9E%81%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/465624/%E7%88%B1%E6%95%B0%E8%87%AA%E5%8A%A8%E5%8B%BE%E9%80%89%E5%90%8C%E6%84%8F%E5%8D%8F%E8%AE%AE%20%28%E7%BB%88%E6%9E%81%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
  'use strict';

  let targetedCheckboxObserver = null;
  let lastObservedCheckbox = null;

  // --- 核心函数：强制勾选协议Checkbox并触发change事件 ---
  function forceCheckAgreement() {
    const checkbox = document.querySelector('input[name="aggrement"]');

    if (checkbox && !checkbox.checked) {
      checkbox.checked = true;
      const event = new Event('change', { bubbles: true });
      checkbox.dispatchEvent(event);
      console.log('爱数自动勾选协议: Checkbox "aggrement" 强制勾选成功。');
      return true;
    }
    return false;
  }

  // --- 函数：设置针对协议checkbox的MutationObserver ---
  function setupTargetedCheckboxObserver(checkboxElement) {
    if (targetedCheckboxObserver && lastObservedCheckbox === checkboxElement) {
      return;
    }

    if (targetedCheckboxObserver) {
      targetedCheckboxObserver.disconnect();
      targetedCheckboxObserver = null;
    }

    if (checkboxElement) {
      targetedCheckboxObserver = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
          if (mutation.type === 'attributes' && mutation.attributeName === 'checked') {
            if (!checkboxElement.checked) {
              console.log('爱数自动勾选协议: 检测到协议checkbox被意外取消勾选，正在尝试重新勾选...');
              forceCheckAgreement();
            }
          }
        }
      });
      targetedCheckboxObserver.observe(checkboxElement, { attributes: true, attributeFilter: ['checked'] });
      lastObservedCheckbox = checkboxElement;
      console.log('爱数自动勾选协议: 针对协议checkbox的专属观察者已启动。');
    } else {
      lastObservedCheckbox = null;
    }
  }

  // --- 主要管理函数：查找、勾选并为协议checkbox设置专属观察者 ---
  function manageAgreementCheckbox() {
    const currentCheckbox = document.querySelector('input[name="aggrement"]');
    forceCheckAgreement(); // 每次管理时都尝试勾选

    setupTargetedCheckboxObserver(currentCheckbox); // 确保专属观察者存在并针对当前checkbox

    registerInputListeners(); // 确保输入框监听器存在
    registerLoginButtonListener(); // 确保登录按钮监听器存在
  }

  // --- Helper function to debounce calls ---
  function debounce(func, delay) {
    let timeout;
    return function(...args) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), delay);
    };
  }
  const debouncedManageAgreementCheckbox = debounce(manageAgreementCheckbox, 150);

  // --- 函数：注册用户名/密码输入框的事件监听器 ---
  function registerInputListeners() {
    // 再次提醒：请根据实际页面HTML调整这里的选择器！
    const usernameInput = document.querySelector('input[name="username"]');
    const passwordInput = document.querySelector('input[name="password"]');

    [usernameInput, passwordInput].forEach(input => {
      if (input && !input.dataset.agreementListenerRegistered) {
        input.addEventListener('focus', forceCheckAgreement, { capture: true });
        input.addEventListener('input', forceCheckAgreement, { capture: true });
        input.dataset.agreementListenerRegistered = 'true';
        console.log(`爱数自动勾选协议: 成功监听 '${input.name || input.id || input.type || "unknown"}' 输入框事件。`);
      }
    });

    if (!usernameInput) console.warn('爱数自动勾选协议: 未找到名为 "username" 的输入框。请检查选择器是否正确。');
    if (!passwordInput) console.warn('爱数自动勾选协议: 未找到名为 "password" 的输入框。请检查选择器是否正确。');
  }

  // --- 新增函数：注册登录按钮的事件监听器 ---
  function registerLoginButtonListener() {
    // 你需要根据实际页面的HTML调整这里的登录按钮选择器！
    // 常见的选择器有：
    //   - button[type="submit"]
    //   - button.login-button  (如果登录按钮有特定的类名)
    //   - #loginBtn (如果登录按钮有特定的ID)
    //   - input[type="submit"] (如果是旧式表单的提交按钮)
    const loginButton = document.querySelector('button[type="submit"]'); // 假设登录按钮是 type="submit" 的 button

    if (loginButton && !loginButton.dataset.agreementButtonListenerRegistered) {
      // 在点击登录按钮的瞬间，强制检查协议勾选框
      loginButton.addEventListener('click', (event) => {
        console.log('爱数自动勾选协议: 检测到登录按钮被点击，进行最后一次协议勾选确认。');
        forceCheckAgreement();
        // 注意：不阻止默认事件，让登录流程正常进行
      }, { capture: true }); // 使用 capture 捕获阶段，确保我们更早介入

      loginButton.dataset.agreementButtonListenerRegistered = 'true';
      console.log('爱数自动勾选协议: 成功监听登录按钮点击事件，将在点击时自动勾选协议。');
    } else if (!loginButton) {
      console.warn('爱数自动勾选协议: 未找到登录按钮。请检查选择器是否正确 (例如: button[type="submit"], #loginBtn 等)。');
    }
  }


  // --- 事件监听器 ---

  window.addEventListener('load', () => {
    setTimeout(manageAgreementCheckbox, 800);
  });

  const globalObserver = new MutationObserver((mutationsList) => {
    debouncedManageAgreementCheckbox();
  });

  window.addEventListener('DOMContentLoaded', () => {
    globalObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['name', 'checked', 'class', 'id', 'type']
    });
    console.log('爱数自动勾选协议: 全局 MutationObserver 已启动，监听DOM结构变化。');

    // 首次在 DOMContentLoaded 之后尝试管理所有相关监听器
    manageAgreementCheckbox();
  });

  window.addEventListener('hashchange', manageAgreementCheckbox);
  window.addEventListener('popstate', manageAgreementCheckbox);

})();
