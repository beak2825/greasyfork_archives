// ==UserScript==
// @name         幻想次元-深色模式
// @namespace    https://github.com/huankong233/hxcy.top
// @version      0.0.7
// @description  深色模式
// @author       https://github.com/huankong233
// @author       https://github.com/gg781
// @match        https://hxcy.top/*
// @icon         https://hxcy.top/favicon.ico
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/524229/%E5%B9%BB%E6%83%B3%E6%AC%A1%E5%85%83-%E6%B7%B1%E8%89%B2%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/524229/%E5%B9%BB%E6%83%B3%E6%AC%A1%E5%85%83-%E6%B7%B1%E8%89%B2%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

;(function () {
  GM_addStyle(`
:root {
  --darkhx-l0: #0c0d0f;
  --darkhx-l1: #1e1f20;
  --darkhx-l2: #2f3031;
  --darkhx-l3: #414244;
  --darkhx-l4: #545556;
  --darkhx-l5: #68686a;
  --darkhx-l6: #7c7d7f;
  --darkhx-l7: #919293;
  --darkhx-l8: #a6a7a9;
  --darkhx-l9: #bcbdbf;
  --darkhx-accent-0: #09b1b9;
}

/* level 0 */
html.dark {
  background: var(--darkhx-l0);
}

html.dark #main-content {
  background: none repeat scroll 0 0 var(--darkhx-l0);
}

html.dark #top-bar,
html.dark .body-wrap,
html.dark #main-nav ul ul,
html.dark #main-nav ul li,
html.dark .dropdown-menu,
html.dark .footer-info {
  background: var(--darkhx-l1);
}

html.dark #main-nav > ul > li.current-menu-ancestor::after,
#main-nav > ul > li.current-menu-item::after,
#main-nav > ul > li.current-menu-parent::after,
#main-nav > ul > li.current-post-ancestor::after {
  border-color: transparent var(--darkhx-l0) transparent transparent;
}

html.dark #breadcrumb,
html.dark #top-announce,
html.dark #post-header {
  background: var(--darkhx-l2);
  border-bottom: none;
  color: var(--darkhx-l8);
}

html.dark #breadcrumb a,
html.dark #top-announce a,
html.dark #post-header a {
  color: var(--darkhx-l8);
}

/* article flow items */
html.dark .widget-content,
html.dark .archive-thumb h2,
html.dark #archive-head,
html.dark .widget-title,
html.dark .widget-title h3,
html.dark .su-spoiler-style-fancy {
  background: var(--darkhx-l1) !important;
  color: var(--darkhx-l7);
}

html.dark .widget-content a {
  color: var(--darkhx-l9);
}

html.dark .archive-list li:hover h2 a {
  color: var(--darkhx-accent-0);
}

/* page navigation */
html.dark .page-nav a {
  color: var(--darkhx-l9);
  background: var(--darkhx-l1);
}

html.dark article .more-link {
  color: var(--darkhx-l1) !important;
  font-weight: 600;
}

html.dark input.jump-page {
  background: var(--darkhx-l0);
  margin-top: 2px;
  width: 30px;
  -webkit-text-fill-color: var(--darkhx-l9);
}

html.dark .su-spoiler-title,
html.dark .entry table,
html.dark .entry table td,
html.dark .sc_act,
html.dark blockquote {
  background: var(--darkhx-l0);
  color: var(--darkhx-l8);
}

html.dark .sc_act:hover {
  background: var(--darkhx-l5);
}

html.dark .navbar .nav > li > .dropdown-menu::after {
  border-bottom: 6px solid var(--darkhx-l1);
}

html.dark .searchform div input {
  color: var(--darkhx-l9);
}

/* article page */
html.dark .su-service-title,
html.dark .entry p,
html.dark .entry strong {
  color: var(--darkhx-l9);
}

html.dark .entry,
html.dark .entry h1,
html.dark .entry h2,
html.dark .entry h3 {
  color: var(--darkhx-l8);
}

html.dark .entry img {
  border-color: var(--darkhx-l3);
  background: none;
}

html.dark [class*='markup--'] {
  color: var(--darkhx-l7) !important;
}

html.dark .entry th {
  background: var(--darkhx-l2);
}

/* spoiler */
html.dark .su-spoiler-style-fancy > .su-spoiler-title {
  background: var(--darkhx-l2);
}

html.dark .su-spoiler-content {
  background: var(--darkhx-l0);
  /*  display: flex;
  flex-direction: column;
  gap: 10px; */
}

html.dark .su-box-content {
  background: var(--darkhx-l0);
  color: var(--darkhx-l9);
}

html.dark .entry .wp-caption {
  background: var(--darkhx-l2);
}

html.dark .dlbox .dlbox-title {
  color: var(--darkhx-l8);
  background: var(--darkhx-l2);
}

/* favicon of baidu-pan links */
html.dark .dlbox p.dlbox-links a[href*='pan.baidu.com/s/'] {
  color: var(--darkhx-l3);
  filter: invert(100%);
}

html.dark .quicktags-toolbar input {
  color: var(--darkhx-l8);
  background: var(--darkhx-l1);
  border-radius: 2px;
}

html.dark .quicktags-toolbar input:hover {
  color: var(--darkhx-l9) !important;
  background: var(--darkhx-l5);
}

/* 163 music player embed */
html.dark .aplayer {
  background: var(--darkhx-l0);
}

html.dark .aplayer .aplayer-lrc::before,
html.dark .aplayer .aplayer-lrc::after {
  background: linear-gradient(180deg, hsla(0, 0%, 0%, 0) 0, hsla(0, 0%, 0%, 0.8));
}

html.dark .aplayer .aplayer-info .aplayer-controller .aplayer-bar-wrap .aplayer-bar {
  background: var(--darkhx-l3) !important;
}

html.dark .commentlist a:hover {
  color: var(--darkhx-accent-0);
}

html.dark #author-box h3,
html.dark #related-posts h3,
html.dark #comments h3,
html.dark #commentform textarea,
html.dark .searchform div input,
html.dark .user-center,
html.dark .post-toolbar-report,
html.dark .box-title span {
  background: var(--darkhx-l2);
}

html.dark .dlbox,
html.dark #author-box .author-info,
html.dark .comment-body,
html.dark .commentlist .comment,
html.dark .comment-form,
html.dark #submit-bt,
html.dark #user-menu li {
  background: var(--darkhx-l1) !important;
}

html.dark textarea#comment {
  font-weight: 600;
}

html.dark #commentform textarea,
html.dark #submit-bt {
  -webkit-text-fill-color: var(--darkhx-l7);
}

/* user centre */
html.dark #user-menu a,
html.dark .user-avatar p {
  color: var(--darkhx-l9);
}

html.dark #user-menu a:hover {
  color: var(--darkhx-accent-0);
}

html.dark #fep-menu .fep-button,
.fep-button-active {
  background: var(--darkhx-l1);
  color: var(--darkhx-l8) !important;
}

html.dark #fep-menu .fep-button,
.fep-button-active:hover,
html.dark #fep-menu .fep-button,
.fep-button-active:active {
  background: var(--darkhx-l2) !important;
}

html.dark .footer-nav ul {
  background: var(--darkhx-l2);
  transition: background 0.2s ease-out;
}

html.dark .footer-nav ul:hover {
  background: var(--darkhx-accent-0);
  transition: background 0.1s ease-in;
}

/* ranking page */
html.dark #ranking-item select {
  background: var(--darkhx-l0);
  color: var(--darkhx-l9);
}

/* color palttle replacment */
html.dark [color='#351755'],
html.dark [style*='color:#351755'],
html.dark [style*='color: #351755'] {
  color: #6e40a0 !important;
}

html.dark [color='#3812b1'],
html.dark [style*='color:#3812b1'],
html.dark [style*='color: #3812b1'] {
  color: #552ade !important;
}

html.dark [color='#000080'],
html.dark [style*='color:#000080'],
html.dark [style*='color: #000080'] {
  color: #164cff !important;
}

/* misc tweaking */
html.dark .logoimg {
  width: 180px;
  height: 48px;
  scale: 83%;
}

html.dark div[id^='barrage_'] {
  z-index: 99;
}
`)

  function setMode(newMode) {
    GM_setValue('mode', newMode)
    mode = newMode
    isDark = newMode === 'dark' || (newMode === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    switchMode()
  }

  GM_registerMenuCommand('跟随系统', () => setMode('auto'))
  GM_registerMenuCommand('浅色模式', () => setMode('light'))
  GM_registerMenuCommand('深色模式', () => setMode('dark'))

  let mode = GM_getValue('mode', 'auto')
  let isDark = mode === 'dark' || (mode === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  function checkMode() {
    if (mode !== 'auto') return
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', (e) => {
      isDark = e.matches
      switchMode()
    })
  }

  checkMode()

  function switchMode() {
    document.documentElement.classList.toggle('dark', isDark)
  }

  switchMode()
})()
