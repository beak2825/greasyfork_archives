// ==UserScript==
// @name           YouTube Chat Replay Auto Expander
// @version        1.00
// @description    「チャットのリプレイを表示」が閉じていたら自動的に展開します。Automatically expands “Show chat replay” on YouTube if it’s collapsed
// @author          pueka_3
// @license         MIT
// @icon            https://www.youtube.com/s/desktop/fe5cacab/img/favicon_32x32.png
// @match           https://www.youtube.com/watch*
// @match           https://m.youtube.com/watch*
// @run-at          document-start
// @grant           none
// @namespace https://greasyfork.org/users/1491880
// @downloadURL https://update.greasyfork.org/scripts/541800/YouTube%20Chat%20Replay%20Auto%20Expander.user.js
// @updateURL https://update.greasyfork.org/scripts/541800/YouTube%20Chat%20Replay%20Auto%20Expander.meta.js
// ==/UserScript==

(() => {
  'use strict';

  /* ---------- 設定値 ---------- */
  const OPEN = 'LIVE_CHAT_DISPLAY_STATE_EXPANDED';
  const TEXT_RE = /チャットのリプレイを表示|Show chat replay|显示聊天室回放|Mostrar repetición del chat|Mostrar repetição do chat/i;
  const BTN_SELECTORS = [
    'ytd-toggle-button-renderer',
    'tp-yt-paper-button',
    'ytd-button-shape button',
    'button'
  ].join(',');

  /* ---------- 共通ユーティリティ ---------- */
  const patchRenderer = lcr => {
    lcr.initialDisplayState = OPEN;
    const tbr = lcr.showHideButton?.toggleButtonRenderer;
    if (tbr) tbr.isToggled = true;
  };

  const expandLiveChat = pageData => {
    const root = pageData?.response?.contents?.twoColumnWatchNextResults;
    if (!root) return false;

    // 旧来 path
    const lcr1 = root.conversationBar?.liveChatRenderer;
    if (lcr1 && lcr1.initialDisplayState !== OPEN) {
      patchRenderer(lcr1); return true;
    }

    // 新 UI path（engagementPanels）
    for (const p of root.engagementPanels || []) {
      const lcr2 = p?.engagementPanelSectionListRenderer?.content?.liveChatRenderer;
      if (lcr2 && lcr2.initialDisplayState !== OPEN) {
        patchRenderer(lcr2); return true;
      }
    }
    return false;
  };

  /* ---------- DOMクリック方式（保険） ---------- */
  let mo;  // MutationObserver を再利用
  const clickIfFound = () => {
    for (const btn of document.querySelectorAll(BTN_SELECTORS)) {
      const label = (btn.innerText || btn.getAttribute('aria-label') || '').trim();
      if (TEXT_RE.test(label)) { btn.click(); return true; }
    }
    return false;
  };
  const ensureClickFallback = () => {
    if (clickIfFound()) return;
    mo?.disconnect();
    mo = new MutationObserver(() => clickIfFound() && mo.disconnect());
    mo.observe(document, { childList: true, subtree: true });
  };

  /* ---------- すべての遷移で実行するメイン関数 ---------- */
  const run = (pageData = {}) => {
    if (!expandLiveChat(pageData)) ensureClickFallback();
  };

  /* ---------- イベント登録 ---------- */
  const SPA_EVENTS = [
    'yt-page-data-fetched',
    'yt-page-data-updated',
    'yt-navigate-start',
    'yt-navigate-finish'
  ];
  SPA_EVENTS.forEach(evt =>
    window.addEventListener(evt, e => run(e.detail?.pageData), true));

  // BFCache 復元（戻る／進む）
  window.addEventListener('pageshow', e => {
    // persisted=true は BFCache からの復元
    if (e.persisted) run({ response: window.ytInitialData || {} });
  }, true);

  /* ---------- 初回ロード直後に実行 ---------- */
  run({ response: window.ytInitialData || {} });
})();
