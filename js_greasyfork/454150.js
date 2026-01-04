// ==UserScript==
// @name        Bilibili dark theme
// @namespace   Hill98
// @description Enable dark theme for Bilibili
// @version     1.0.3
// @author      Hill-98
// @license     MIT
// @icon        https://www.bilibili.com/favicon.ico
// @homepageURL https://github.com/Hill-98/userscripts
// @supportURL  https://github.com/Hill-98/userscripts/issues
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
// @match       https://www.bilibili.com/
// @match       https://www.bilibili.com/opus/*
// @match       https://www.bilibili.com/video/*
// @match       https://live.bilibili.com/*
// @match       https://search.bilibili.com/*
// @match       https://t.bilibili.com/*
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/454150/Bilibili%20dark%20theme.user.js
// @updateURL https://update.greasyfork.org/scripts/454150/Bilibili%20dark%20theme.meta.js
// ==/UserScript==

// Force Enable: window.darkThemeForceEnable = true

const addStyle = function addStyle(forceEnable) {
  const id = 'bilibili-dark-theme';
  const style = document.createElement('style');
  style.id = id;
  style.innerHTML = /*css*/`
@import url("https://s1.hdslb.com/bfs/static/jinkela/long/laputa-css/dark.css") ${forceEnable ? '' : '(prefers-color-scheme: dark)'};

@media ${forceEnable ? '' : '(prefers-color-scheme: dark)'} {
  #app .bg {
    background-image: none;
  }

  #app .bgc {
    background-color: var(--graph_bg_regular);
  }

  .bili-dyn-card-goods .bili-dyn-card-goods__wrap, .reference .bili-dyn-card-goods__wrap,
  .bili-dyn-card-link-common__wrap, .reference .bili-dyn-card-link-common__wrap,
  .bili-dyn-card-reserve .bili-dyn-card-reserve__card, .reference .bili-dyn-card-reserve__card,
  .bili-dyn-card-ugc .bili-dyn-card-ugc__wrap, .reference .bili-dyn-card-ugc__wrap,
  .bili-dyn-upower-lottery__card, .reference .bili-dyn-upower-lottery__card {
    background-color: var(--graph_bg_thin);
  }

  .reply-tag-item {
    background-color: var(--bg3) !important;
    color: var(--text2) !important;
  }
}
`;
  document.getElementById(id)?.remove();
  document.body.append(style);
};

Object.defineProperty(unsafeWindow, 'darkThemeForceEnable', {
  enumerable: true,
  get() {
    return GM_getValue('force-enable', false);
  },
  set(value) {
    const v = Boolean(value);
    GM_setValue('force-enable', v);
    addStyle(v);
  },
});

document.querySelector('html').style.display = 'none';
document.addEventListener('DOMContentLoaded', () => {
  addStyle(unsafeWindow.darkThemeForceEnable);
  document.querySelector('html').style.display = '';
});

GM_registerMenuCommand('Switch Force Enable', () => {
  unsafeWindow.darkThemeForceEnable = !unsafeWindow.darkThemeForceEnable;
});
