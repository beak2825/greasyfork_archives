// ==UserScript==
// @name         云效塞满Emoji
// @name:en      Yunxiao Full Emoji
// @name:zh-cn   云效塞满Emoji
// @namespace    com.ui-ceiling.yoho.title-emoji
// @version      1.1.3
// @description  云效创建/编辑  需求/任务时 标题允许输入Emoji
// @description:zh-cn 允许在云效标题中输入 Emoji 表情
// @author       UI-ceiling
// @match        https://devops.aliyun.com/*
// @icon         https://www.emojiall.com/images/60/microsoft-teams/1f923.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544170/%E4%BA%91%E6%95%88%E5%A1%9E%E6%BB%A1Emoji.user.js
// @updateURL https://update.greasyfork.org/scripts/544170/%E4%BA%91%E6%95%88%E5%A1%9E%E6%BB%A1Emoji.meta.js
// ==/UserScript==



(() => {
  'use strict';

  const NEW_INPUT_ID = 'emojiOverrideInput';
  const ORIG_INPUT_ID = 'workitemTitleInputBox';
  const URL_HOOK_DELAY = 1000;

  /** 监听 URL 路由变化 */
  const onUrlChange = (callback) => {
    let lastUrl = location.href;
    const wrap = (method) => {
      const origin = history[method];
      history[method] = function (...args) {
        const result = origin.apply(this, args);
        if (location.href !== lastUrl) {
          lastUrl = location.href;
          callback(location.href);
        }
        return result;
      };
    };
    ['pushState', 'replaceState'].forEach(wrap);
    window.addEventListener('popstate', () => {
      if (location.href !== lastUrl) {
        lastUrl = location.href;
        callback(location.href);
      }
    });
  };

  /** 等待原输入框出现 */
  const waitForOriginalInput = () =>
    new Promise((resolve) => {
      const check = () => document.getElementById(ORIG_INPUT_ID);
      const input = check();
      if (input) return resolve(input);
      const observer = new MutationObserver(() => {
        const input = check();
        if (input) {
          observer.disconnect();
          resolve(input);
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
    });

  /** 模拟 React 内部输入变更 */
  function simulateReactInput(inputEl) {
    const lastValue = inputEl.value;

    inputEl.value = new Date().getTime();

    const tracker = inputEl._valueTracker;
    if (tracker) {
      tracker.setValue(lastValue); // 告诉 React：值变了
    }

    const inputEvent = new Event('input', { bubbles: true });
    inputEl.dispatchEvent(inputEvent);
  }

  /** 注入 emoji 输入框 */
  const injectNewInput = (origInput) => {
    if (!origInput || document.getElementById(NEW_INPUT_ID)) return;

    const container = document.createElement('div');
    container.style.position = 'relative';

    const tagName = origInput.tagName.toLowerCase(); // 'input' 或 'textarea'
    const newInput = document.createElement(tagName);
    Object.assign(newInput, {
      id: NEW_INPUT_ID,
      value: origInput.value,
      placeholder: '请输入标题',
      className: origInput.className,
    });
    newInput.style.cssText = origInput.style.cssText;

    // 美化 emoji 图标
    const emoji = document.createElement('span');
    emoji.textContent = '✨';
    emoji.className = 'emoji-decorator';
    Object.assign(emoji.style, {
      position: 'absolute',
      right: '8px',
      top: '50%',
      transform: 'translateY(-50%)',
      fontSize: '18px',
      pointerEvents: 'none',
      userSelect: 'none',
      animation: 'emoji-pop 0.5s ease-out',
    });

    // 动画样式（只注入一次）
    if (!document.getElementById('emoji-style')) {
      const style = document.createElement('style');
      style.id = 'emoji-style';
      style.textContent = `
        @keyframes emoji-pop {
          0% { transform: translateY(-50%) scale(0.6); opacity: 0; }
          40% { transform: translateY(-50%) scale(2); opacity: 1; }
          100% { transform: translateY(-50%) scale(1); }
        }
      `;
      document.head.appendChild(style);
    }

    // padding 防遮挡
    const padRight = parseFloat(getComputedStyle(newInput).paddingRight) || 0;
    if (padRight < 28) newInput.style.paddingRight = '28px';

    newInput.addEventListener('blur', () => {
      const newVal = newInput.value.trim();
      const oldVal = origInput.value.trim();

      if (!newVal || newVal === oldVal) return; // 相同就不触发更新

      // 模拟用户输入，更新原文本框
      simulateReactInput(origInput);

      // 触发原文本框的失焦事件
      const blurEvent = new Event('blur', { bubbles: true });
      origInput.dispatchEvent(blurEvent);
    });

    container.append(newInput, emoji);
    origInput.style.display = 'none';
    origInput.parentElement?.appendChild(container);
  };

  /** 显示提示 */
  const showToast = (message, duration = 3000) => {
    const old = document.getElementById('emoji-toast');
    if (old) {
      old.remove(); // 强制移除旧吐司，避免堆叠
    }

    const toast = document.createElement('div');
    Object.assign(toast, {
      id: 'emoji-toast',
      textContent: message,
    });
    Object.assign(toast.style, {
      position: 'fixed',
      top: '10px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: 'rgba(0,0,0,0.7)',
      color: '#fff',
      padding: '10px 20px',
      borderRadius: '20px',
      fontSize: '34px',
      zIndex: 9999,
      opacity: '0',
      transition: 'opacity 0.3s ease',
      pointerEvents: 'none',
      userSelect: 'none',
    });

    document.body.appendChild(toast);
    requestAnimationFrame(() => (toast.style.opacity = '1'));
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.addEventListener('transitionend', () => toast.remove());
    }, duration);
  };

  /** 初始化入口 */
  const initInject = async () => {
    try {
      const origInput = await waitForOriginalInput();
      injectNewInput(origInput);
    } catch (err) {
      console.warn('[Tampermonkey] emoji input 注入失败:', err);
    }
  };

  // 首次加载
  setTimeout(initInject, URL_HOOK_DELAY);

  // 路由变化监听
  let injectTimer = null;
  onUrlChange(() => {
    clearTimeout(injectTimer);
    injectTimer = setTimeout(initInject, URL_HOOK_DELAY);
  });

  /** 覆盖 PATCH 请求的值 */
  const rawOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (...args) {
    [this._method, this._url] = args;
    return rawOpen.apply(this, args);
  };

  const rawSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function (body) {
    try {
      const method = this._method?.toUpperCase();
      if (
        (method === 'PATCH' || method === 'POST') &&
        this._url?.includes('projex/api/workitem/workitem')
      ) {
        const parsed = JSON.parse(body);
        const override = document.getElementById(NEW_INPUT_ID)?.value?.trim();
        if (override) {
          console.log('[Tampermonkey] 已覆盖 propertyValue:', override);
          if(method === 'PATCH') {
            parsed.propertyValue = override;
          }else{
            parsed.subject = override;
          }
          body = JSON.stringify(parsed);
        }
      }
    } catch (e) {
      // 非 JSON 请求忽略
    }
    return rawSend.call(this, body);
  };

  window.addEventListener('keydown', (e) => {
    const isMac = navigator.platform.toUpperCase().includes('MAC');
    const isCtrl = isMac ? e.metaKey : e.ctrlKey;

    if (isCtrl && e.shiftKey && e.altKey && e.key.toLowerCase() === 'e') {
      e.preventDefault();
      showToast('⌛️ 手动注入 ！');
      initInject().then(() => {
        showToast('🤣 Emoji 输入框注入成功！');
      }).catch(() => {
        showToast('❌ 注入失败，请检查元素是否存在');
      });
    }
  });

  const observeInputRemoval = () => {
    let hasAppeared = false;
    let reInjecting = false;

    const observer = new MutationObserver(() => {
      const input = document.getElementById(NEW_INPUT_ID);

      if (input) {
        hasAppeared = true;
        reInjecting = false;
        return; // 一切正常
      }

      // 若已出现过但现在被移除，触发注入（节流避免过度触发）
      if (hasAppeared && !reInjecting) {
        reInjecting = true;
        console.log('⌛️ emoji 输入框被移除，尝试重新注入...');
        // showToast('⚠️ Emoji 输入框被移除，尝试恢复...');
        initInject().finally(() => {
          setTimeout(() => (reInjecting = false), 1000); // 1秒节流
        });
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  };

  observeInputRemoval(); // 启动输入框丢失监听
})();
