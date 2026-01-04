// ==UserScript==
// @name         GitHub Issue Auto Save History (Issues Textarea Recovery)
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  自动保存 GitHub issue 文本并记录历史，每 5s 保存一次 (内容一致则不保存)
// @author       Jason Feng <solidzoro@live.com>
// @license      MIT
// @match        https://github.com/*/issues/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/546288/GitHub%20Issue%20Auto%20Save%20History%20%28Issues%20Textarea%20Recovery%29.user.js
// @updateURL https://update.greasyfork.org/scripts/546288/GitHub%20Issue%20Auto%20Save%20History%20%28Issues%20Textarea%20Recovery%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const __DEBUG__SAVE_INFO = true;
  const SAVE_INTERVAL_SEC = 5;
  const SAVE_MAX_LENGTH = 100;
  const STORAGE_KEY = 'github_issue_autosave_current';
  const HISTORY_KEY = 'github_issue_autosave_history';
  const HISTORY_BTN_CLASSNAME = `${HISTORY_KEY}-btn`;
  const POPUP_WIDTH = 540;
  const POPUP_HEIGHT = 300;

  /** ---------- 封装存储层 (兼容 Safari) ---------- */
  function setItem(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {
      GM_setValue(key, val);
    }
  }

  function getItem(key, def = null) {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : def;
    } catch (e) {
      return GM_getValue(key, def);
    }
  }

  /** 保存当前 textarea 文本到存储（防重复） */
  function saveCurrentText(val) {
    const current = getItem(STORAGE_KEY, '');

    const historyObj = getItem(HISTORY_KEY, {});
    const latestEntry = Object.values(historyObj).slice(-1)[0];

    if (val === current || val === latestEntry) {
      if (__DEBUG__SAVE_INFO) console.log('⚪ SKIP - DUPLICATE');
      return;
    }

    setItem(STORAGE_KEY, val);

    const now = new Date();
    const timeKey = now.toLocaleString();
    historyObj[timeKey] = val;

    if (__DEBUG__SAVE_INFO) {
      console.log(`🟢 SAVE - ${timeKey}\n          ${JSON.stringify(val)}`);
    }

    const entries = Object.entries(historyObj);
    const trimmed = entries.slice(-1 * SAVE_MAX_LENGTH);
    setItem(HISTORY_KEY, Object.fromEntries(trimmed));
  }

  /** 渲染弹窗内容 */
  function renderPopupContent(popup) {
    popup.innerHTML = '';

    const container = document.createElement('div');
    container.style.cssText = `
      overflow: hidden;
      height: ${POPUP_HEIGHT}px;
      padding: 10px;
    `;

    const historyContainer = document.createElement('div');
    historyContainer.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 8px;
      overflow: auto;
      height: ${POPUP_HEIGHT - 65}px;
    `;

    const historyObj = getItem(HISTORY_KEY, {});
    const historyEntries = Object.entries(historyObj);

    historyEntries.reverse().forEach(([time, text]) => {
      const item = document.createElement('div');
      item.style.cssText = `
        display: flex;
        align-items: center;
        gap: 4px;
      `;

      const useBtn = document.createElement('button');
      useBtn.textContent = time;
      useBtn.style.cssText = `
        padding: 2px 6px;
        cursor: pointer;
      `;
      useBtn.addEventListener('click', () => {
        const textarea = document.querySelector('#react-issue-comment-composer textarea');
        if (!textarea) return;
        textarea.value = text;
        textarea.focus();
      });

      const input = document.createElement('input');
      input.type = 'text';
      input.value = text;
      input.style.cssText = `
        flex: 1;
        width: 100%;
        padding: 2px 4px;
        font-size: 12px;
      `;

      item.appendChild(useBtn);
      item.appendChild(input);
      historyContainer.appendChild(item);
    });

    container.appendChild(historyContainer);

    const writeBtn = document.createElement('button');
    writeBtn.textContent = 'save-current';
    writeBtn.style.cssText = `
      margin-top: 10px;
      padding: 2px 6px;
      cursor: pointer;
    `;
    writeBtn.addEventListener('click', () => {
      const textarea = document.querySelector('#react-issue-comment-composer textarea');
      console.log('save-current', textarea);

      if (!textarea) return;
      saveCurrentText(textarea.value);
      renderPopupContent(popup);
    });
    container.appendChild(writeBtn);

    popup.appendChild(container);
  }

  /** 创建弹窗 */
  function createHistoryPopup(historyBtn) {
    let popup = document.querySelector('#github-issue-history-popup');
    if (!popup) {
      popup = document.createElement('div');
      popup.id = 'github-issue-history-popup';
      popup.style.cssText = `
        position: absolute;
        top: ${historyBtn.offsetTop - POPUP_HEIGHT - 10}px;
        left: ${historyBtn.offsetLeft}px;
        width: ${POPUP_WIDTH}px;
        height: ${POPUP_HEIGHT}px;
        overflow: hidden;
        border-radius: 8px;
        background: #fff;
        border: 1px solid #ccc;
        z-index: 9999;
        font-family: monospace;
        font-size: 12px;
        display: none;
      `;
      historyBtn.parentElement.appendChild(popup);
    }

    historyBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      popup.style.display = popup.style.display === 'none' ? 'block' : 'none';
      popup.style.top = `${historyBtn.offsetTop - POPUP_HEIGHT - 10}px`;
      popup.style.left = `${historyBtn.offsetLeft}px`;
      renderPopupContent(popup);
    });

    document.addEventListener('click', () => {
      if (popup.style.display === 'block') popup.style.display = 'none';
    });

    return popup;
  }

  /** 初始化 */
  function initIssueAutosave() {
    const tablistContainer = document.querySelector('[role="tablist"]');
    if (!tablistContainer) return;
    if (tablistContainer.querySelector(`.${HISTORY_BTN_CLASSNAME}`)) return;

    const historyBtn = document.createElement('button');
    historyBtn.textContent = 'History';
    historyBtn.className = `TabNav-item ViewSwitch-module__tabNavLink--JJGgB ${HISTORY_BTN_CLASSNAME}`;
    historyBtn.style.cssText = `
      border: none;
      background: transparent;
      cursor: pointer;
    `;
    tablistContainer.appendChild(historyBtn);

    createHistoryPopup(historyBtn);

    const textarea = document.querySelector('#react-issue-comment-composer textarea');
    if (textarea) {
      textarea.value = getItem(STORAGE_KEY, '');
    }
  }

  initIssueAutosave();
  document.addEventListener('pjax:end', initIssueAutosave);
  const observer = new MutationObserver(initIssueAutosave);
  observer.observe(document.body, { childList: true, subtree: true });

  setInterval(() => {
    const textarea = document.querySelector('#react-issue-comment-composer textarea');
    if (!textarea) return;
    saveCurrentText(textarea.value);
  }, SAVE_INTERVAL_SEC * 1000);
})();
