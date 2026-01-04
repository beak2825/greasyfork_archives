// ==UserScript==
// @name         GitHub issue 输入修复助手（Linux Firefox）
// @namespace    https://github.com/
// @version      1.1
// @description  解决 Linux Firefox Github issue 中文输入法无法输入的问题，仅在 issue 页面启用
// @author       ChatGPT
// @match        https://github.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/540560/GitHub%20issue%20%E8%BE%93%E5%85%A5%E4%BF%AE%E5%A4%8D%E5%8A%A9%E6%89%8B%EF%BC%88Linux%20Firefox%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/540560/GitHub%20issue%20%E8%BE%93%E5%85%A5%E4%BF%AE%E5%A4%8D%E5%8A%A9%E6%89%8B%EF%BC%88Linux%20Firefox%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let targetInput;
  let hiddenInput;

  // 使用 MutationObserver 监听页面加载和输入框变化
  const observer = new MutationObserver(() => {
    const isIssuePage = /^\/[^\/]+\/[^\/]+\/issues\/?$/.test(location.pathname);
    //console.log("isIssue",isIssuePage,location.pathname)
    targetInput = document.querySelector('input[role="combobox"][placeholder*="Search"]');

    if (isIssuePage && targetInput && !document.getElementById('hidden-ime-input')) {
      setupRedirectInput();
    } else if (!isIssuePage && document.getElementById('hidden-ime-input')) {
      hideRedirectInput();
    }else{
      hideRedirectInput(false);
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // 设置 React 输入框的值（兼容受控组件）
  function setReactInputValue(input, value) {
    const nativeSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype, 'value'
    ).set;
    nativeSetter.call(input, value);
    const ev = new Event('input', { bubbles: true });
    input.dispatchEvent(ev);
  }

  function setupRedirectInput() {
    if (!targetInput) return;
    console.log('[IME Redirect] 绑定输入框：', targetInput);

    const rect = targetInput.getBoundingClientRect();
    const style = getComputedStyle(targetInput);

    hiddenInput = document.createElement('input');
    hiddenInput.id = 'hidden-ime-input';

    hiddenInput.style.cssText = `
      position: absolute;
      top: ${window.scrollY + rect.top - 40}px;
      left: ${window.scrollX + rect.left - 10}px;
      width: ${rect.width}px;
      height: ${rect.height}px;
      opacity: 1;
      z-index: 9999;
      font-size: ${style.fontSize};
      border: none;
      background: white;
      outline: 1px solid #ccc;
      border-radius: 5px;
    `;

    hiddenInput.setAttribute('autocomplete', 'off');
    hiddenInput.setAttribute('autocorrect', 'off');
    hiddenInput.setAttribute('autocapitalize', 'off');
    hiddenInput.setAttribute('spellcheck', 'false');

    document.body.appendChild(hiddenInput);

    hiddenInput.value = targetInput.value || '';

    hiddenInput.addEventListener('select', () => {
      targetInput.setSelectionRange(hiddenInput.selectionStart, hiddenInput.selectionEnd);
    });

    hiddenInput.addEventListener('input', () => {
      setReactInputValue(targetInput, hiddenInput.value);
    });

    let focus = false;
    let lastValue = targetInput.value;

    setInterval(() => {
      const isIssuePage = /^\/[^\/]+\/[^\/]+\/issues\/?$/.test(location.pathname);
      if (!isIssuePage) {
        hideRedirectInput();
        return;
      }

      if(!targetInput) return;

      if (targetInput.value !== lastValue && !focus) {
        lastValue = targetInput.value;
        hiddenInput.value = targetInput.value || '';

        try {
          hiddenInput.selectionStart = targetInput.selectionStart;
          hiddenInput.selectionEnd = targetInput.selectionEnd;
        } catch {}
      }
    }, 100);

    hiddenInput.addEventListener('focus', () => {
      focus = true;
    });

    hiddenInput.addEventListener('blur', () => {
      focus = false;
    });

    hiddenInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        simulateEnterKeyOnTarget(targetInput);
        e.preventDefault();
      }
    });

    console.log("显示")

    // 可选：初始自动聚焦
    // hiddenInput.focus();
  }

  function hideRedirectInput(hide=true) {
    const existing = document.getElementById('hidden-ime-input');
    if (existing) {
        if(hide){
            existing.style.display = 'none';
        }else{
            existing.style.display = 'block';
        }
    }
  }

  function simulateEnterKeyOnTarget(input) {
    const keyboardEventInit = {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
      which: 13,
      bubbles: true,
      cancelable: true
    };

    const down = new KeyboardEvent('keydown', keyboardEventInit);
    const up = new KeyboardEvent('keyup', keyboardEventInit);

    input.dispatchEvent(down);
    input.dispatchEvent(up);
  }

})();
