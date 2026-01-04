// ==UserScript==
// @name         百度搜索框精简
// @version      1.4
// @description  精简百度搜索框：只保留单行输入框与搜索按钮，移除所有 AI / 文心助手相关元素
// @author       Zero
// @match        https://www.baidu.com/*
// @match        https://www.baidu.com/s*
// @grant        GM_addStyle
// @license      GPL-3.0
// @namespace    https://greasyfork.org/users/290555
// @downloadURL https://update.greasyfork.org/scripts/556661/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E6%A1%86%E7%B2%BE%E7%AE%80.user.js
// @updateURL https://update.greasyfork.org/scripts/556661/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E6%A1%86%E7%B2%BE%E7%AE%80.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /* ================== 环境判断 ================== */
  const isBaidu =
    location.hostname === 'www.baidu.com';

  document.documentElement.classList.toggle('tm-bd-home', isBaidu);

  /* ================== 样式层（主杀器） ================== */
  GM_addStyle(`
    /* ===== 通用：隐藏 AI / 工具 ===== */
    #chat-input-main .chat-input-tool #left-tool,
    #chat-input-main .chat-input-tool #right-tool,
    #chat-input-main .right-tool_3we_U,
    #chat-input-main #voice-input-wrapper,
    #chat-input-main .tool-item_1e6GD,
    #chat-input-main .tools-clear-icon {
      display: none !important;
    }

    /* 防止工具层遮挡输入框 */
    .san-card[tpl="chat-input"] .chat-input-tool {
      pointer-events: auto !important;
    }

    #chat-input-main.one-line-input .tools-placeholder-wrapper {
      display: none !important;
    }

    /* ===== 首页：隐藏搜索框下方功能区 ===== */
    .tm-bd-home .panel-list_8jHmm,
    .tm-bd-home #chat-input-extension,
    .tm-bd-home .more-dropdown-container {
      display: none !important;
    }

    /* ===== 首页：强制单行 ===== */
    .tm-bd-home #chat-input-main {
      height: auto !important;
    }

    .tm-bd-home #chat-input-main.two-line-input {
      padding-bottom: 0 !important;
    }

    .tm-bd-home #chat-input-main .chat-input-wrapper .chat-input-container {
      padding-top: 9px !important;
      padding-bottom: 9px !important;
    }

    /* ===== 首页：按钮垂直居中 ===== */
    .tm-bd-home #chat-input-main.one-line-input .chat-input-tool {
      padding-top: 2px !important;
    }

    /* ===== 搜索按钮样式修正 ===== */
    .tm-bd-home #chat-input-main.one-line-input #chat-submit-button {
      height: 37px !important;
      width: 108px !important;
      padding: 0 !important;
      line-height: 37px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      font-size: 17px !important;
      font-weight: 500 !important;
      border: none !important;
      box-sizing: border-box !important;
    }

    /* ===== 候选词：彻底移除「用文心助手回答」 ===== */
    #chat-input-panel .ask-ai-tail-wrapper,
    #chat-input-panel .ask-ai-tail,
    #chat-input-panel .ask-ai-tail-blank {
      display: none !important;
      visibility: hidden !important;
      pointer-events: none !important;
    }

    /* 防止隐藏后仍占位 */
    #chat-input-panel .bdsug-item {
      padding-right: 0 !important;
    }

    /* 去除分割线 */
    #chat-input-panel .chat-input-panel-divider {
      border: none !important;
    }
  `);

  /* ================== 工具函数 ================== */
  const waitFor = (sel, timeout = 10000) =>
    new Promise((resolve, reject) => {
      const start = Date.now();
      const timer = setInterval(() => {
        const el = document.querySelector(sel);
        if (el) {
          clearInterval(timer);
          resolve(el);
        } else if (Date.now() - start > timeout) {
          clearInterval(timer);
          reject();
        }
      }, 100);
    });

  /* ================== 首页强制单行 ================== */
  function forceHomeOneLine() {
    if (!isBaidu) return;
    const main = document.querySelector('#chat-input-main');
    if (!main) return;

    main.classList.add('one-line-input');
    main.classList.remove('two-line-input');

    const btn = main.querySelector('#chat-submit-button');
    const rightWrap = main.querySelector('.right-tools-wrapper');
    if (btn && rightWrap && btn.parentElement !== rightWrap) {
      rightWrap.appendChild(btn);
    }
  }

  /* ================== DOM 层：物理删除 AI 尾巴 ================== */
  function removeAskAiTail() {
    document
      .querySelectorAll('#chat-input-panel .ask-ai-tail-wrapper')
      .forEach(el => el.remove());
  }

  /* ================== 初始化 ================== */
  async function init() {
    try {
      await waitFor('#chat-input-main');
      forceHomeOneLine();
      removeAskAiTail();

      if (isBaidu) {
        const main = document.querySelector('#chat-input-main');
        let lock = false;
        const obs = new MutationObserver(() => {
          if (lock) return;
          lock = true;
          requestAnimationFrame(() => {
            forceHomeOneLine();
            lock = false;
          });
        });
        obs.observe(main, { attributes: true, attributeFilter: ['class'] });
      }
    } catch (e) {}
  }

  init();

  /* ================== 全局兜底观察 ================== */
  const throttle = (fn, wait = 120) => {
    let t = null;
    return () => {
      if (t) return;
      t = setTimeout(() => {
        t = null;
        fn();
      }, wait);
    };
  };

  const removeThrottled = throttle(removeAskAiTail, 120);
  removeAskAiTail();

  const mo = new MutationObserver(removeThrottled);
  mo.observe(document.body, { childList: true, subtree: true });

})();
