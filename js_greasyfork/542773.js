// ==UserScript==
// @name           ChatGPT Desktop Notifier
// @name:ja        ChatGPT デスクトップ通知 & タイトルバッジ
// @namespace      https://github.com/usou/
// @version        1.0.0
// @description    Adds 🌀 while generating and ✅ when done, plus desktop notifications.
// @description:ja 生成中は🌀・完了で✅、完了時にデスクトップ通知を行います。
// @author         usou
// @license        MIT
// @match          *://chat.openai.com/*
// @match          *://chatgpt.com/*
// @grant          GM_notification
// @run-at         document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/542773/ChatGPT%20Desktop%20Notifier.user.js
// @updateURL https://update.greasyfork.org/scripts/542773/ChatGPT%20Desktop%20Notifier.meta.js
// ==/UserScript==

(() => {
  'use strict';

  /* ========= 定数 ========= */
  const PREFIX = { GEN: '🌀', DONE: '✅' };
  const STREAMING_SELECTORS = [
    '.result-streaming',
    'button[data-testid="stop-button"]',
    'svg.animate-spin'
  ];

  /* ========= ヘルパ ========= */
  const stripBadges  = title => title.replace(/^(?:🌀|✅)\s*/, '');
  const clearPrefix  = () => { document.title = stripBadges(document.title); };
  const isGenerating = () => STREAMING_SELECTORS.some(sel => document.querySelector(sel));

  const notifyDone = () => {
    GM_notification({
      title: `「${stripBadges(document.title)}」${PREFIX.DONE}`,
      text:  ' ', // 空文字では通知が来ない
      timeout: 5000,
      onclick: () => window.focus()
    });
  };

  /* ========= Enter 送信時にバッジ消去 ========= */
  document.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey && e.target?.tagName === 'TEXTAREA') {
      clearPrefix();
    }
  }, true);

  /* ========= 状態管理 ========= */
  let generating    = isGenerating();
  let lastBadge     = '';     // '' | PREFIX.GEN | PREFIX.DONE
  let updatingTitle = false;  // 再入防止

  const refreshBadge = () => {
    if (!lastBadge || updatingTitle) return;
    const clean   = stripBadges(document.title);
    const desired = lastBadge + clean;
    if (document.title === desired) return; // 既に付与済み
    updatingTitle = true;
    document.title = desired;
    updatingTitle = false;
  };

  /* ========= DOM 監視（生成開始 / 終了） ========= */
  const domObserver = new MutationObserver(() => {
    const nowGenerating = isGenerating();
    if (nowGenerating && !generating) {
      lastBadge = PREFIX.GEN;   // 生成開始
      refreshBadge();
    } else if (!nowGenerating && generating) {
      lastBadge = PREFIX.DONE;  // 生成終了
      refreshBadge();
      notifyDone();
    }
    generating = nowGenerating;
  });
  domObserver.observe(document.documentElement, { childList: true, subtree: true });

  /* ========= タイトル監視（差し替え対策） ========= */
  const watchTitle = titleNode => {
    if (!titleNode || titleNode.__badgeObserver) return;
    const obs = new MutationObserver(() => {
      if (!updatingTitle) refreshBadge();
    });
    obs.observe(titleNode, { childList: true, characterData: true, subtree: true });
    titleNode.__badgeObserver = obs;
    refreshBadge(); // 監視開始時にも付与
  };

  watchTitle(document.querySelector('title'));

  const headObserver = new MutationObserver(records => {
    records.forEach(record => record.addedNodes.forEach(node => {
      if (node.nodeName === 'TITLE') watchTitle(node);
    }));
  });
  headObserver.observe(document.head, { childList: true });
})();
