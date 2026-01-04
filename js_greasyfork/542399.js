// ==UserScript==
// @name         Torn Wiki Dark
// @namespace    https://github.com/skillerious
// @version      2.6
// @description  Dark-gray + cyan skin for *all* pages on wiki.torn.com.
//               • Static sidebar, centred content column
//               • Cyan headings & links, darker logo tile
//               • Cyan scrollbar, zero white leaks
//               • 64 px progress-ring “Back to Top” button, perfectly centred, clickable & smooth-scrolling
//               2025-07-12 build 🔵⬆️🌑
// @author       Robin Doak (Skillerious)
// @match        https://wiki.torn.com/wiki/*
// @match        https://wiki.torn.com/*
// @include      /^https:\/\/wiki\.torn\.com\/.*$/
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542399/Torn%20Wiki%20Dark.user.js
// @updateURL https://update.greasyfork.org/scripts/542399/Torn%20Wiki%20Dark.meta.js
// ==/UserScript==

(() => {
  /*───────────────────────────────────────────────────────────────
    1.  GLOBAL CSS THEME
  ───────────────────────────────────────────────────────────────*/
  const css = `
  /* ─── Colour palette & constants ───────────────────────────── */
  :root {
    --bg          : #1b1b1b;
    --surface     : #242424;
    --surface-2   : #2e2e2e;
    --card        : #282828;

    --cyan        : #55c3ff;
    --cyan-light  : #7ad0ff;

    --border      : #3d3d3d;
    --text-main   : #d5d7da;
    --text-muted  : #9ca2a8;

    --radius      : 6px;
    --shadow      : 0 3px 10px rgb(0 0 0 / 0.5);
    --max-read    : 950px;
  }

  /* ─── Base layout & typography ─────────────────────────────── */
  body,
  #content,
  .container,
  .row,
  .content-area-wrapper,
  .mw-parser-output,
  .mw-body {
    background: var(--bg) !important;
    color: var(--text-main) !important;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
                 Arial, sans-serif;
  }

  .content-area-wrapper {
    flex: 1 1 auto !important;
    padding: 0 1rem;
  }

  #content {
    max-width: var(--max-read);
    margin: 0 auto;
  }

  h1, h2, h3, h4, h5, h6 {
    color: var(--cyan) !important;
    font-weight: 700;
    line-height: 1.3;
    margin: 1.2em 0 0.6em;
  }

  h1 { font-size: 2.15rem; border: none; }
  h2 { font-size: 1.55rem; border-bottom: 1px solid var(--cyan); padding-bottom: 0.4rem; }
  h3 { font-size: 1.25rem; }
  h4, h5, h6 { font-size: 1.1rem; }

  /* ─── Links ────────────────────────────────────────────────── */
  a {
    color: var(--cyan);
    text-decoration: none;
    transition: color 0.15s;
  }

  a:hover {
    color: var(--cyan-light);
    text-decoration: underline;
  }

  a[target="_blank"]::after {
    content: "↗";
    font-size: 0.75em;
    margin-left: 2px;
    vertical-align: super;
    color: var(--text-muted);
  }

  /* ─── Sidebar & logo tile ─────────────────────────────────── */
  .side-panel-wrapper {
    background: var(--surface);
    border-right: 1px solid var(--border);
  }

  .side-panel-wrapper .card {
    background: var(--surface) !important;
    border: none !important;
  }

  .card.torn-navigation-header {
    background: var(--surface-2) !important;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1.4rem 0 1rem;
  }

  .torn-title-text {
    font-size: 2.35rem;
    font-weight: 900;
    line-height: 1;
    color: var(--cyan) !important;
    letter-spacing: 1px;
  }

  .torn-title-text span {
    font-weight: 300;
    margin-left: 0.25rem;
    color: var(--cyan) !important;
  }

  .torn-title-text::after {
    content: "";
    display: block;
    width: 80%;
    height: 4px;
    background: var(--cyan);
    margin: 0.45rem auto 0;
    border-radius: 2px;
  }

  .torn-back-button {
    margin-top: 0.85rem;
    font-weight: 600;
    font-size: 0.85rem;
    color: var(--text-main);
    display: flex;
    align-items: center;
    gap: 4px;
    text-decoration: none;
  }

  .torn-back-button svg path { fill: #b0b0b0; }
  .torn-back-button:hover { color: var(--cyan); }
  .torn-back-button:hover svg path { fill: var(--cyan); }

  /* Navigation links inside sidebar */
  .torn-navigation-panel nav a.nav-link {
    color: var(--text-muted);
    border-radius: var(--radius);
    margin: 0.13rem 0;
    padding: 0.32rem 0.8rem;
    transition: background 0.15s, color 0.15s;
  }

  .torn-navigation-panel nav a.nav-link:hover,
  .torn-navigation-panel nav a.nav-link.active {
    background: var(--surface-2);
    color: var(--text-main);
  }

  .torn-navigation-panel nav a.nav-link.disabled {
    color: var(--cyan) !important;
    font-weight: 700;
    cursor: default;
  }

  /* ─── Table of Contents ────────────────────────────────────── */
  #toc,
  .toc {
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 0.9rem 1rem 1rem;
    margin-bottom: 1.5rem;
  }

  #toc .toctitle h2 {
    margin: 0 0 0.55rem;
    font-size: 1.2rem;
    color: var(--cyan);
    border: none;
  }

  #toc ul,
  .toc ul { padding-left: 1.25rem; margin: 0; }

  #toc li,
  .toc li { line-height: 1.5; }

  /* ─── Tables ──────────────────────────────────────────────── */
  table, th, td { border-color: var(--border) !important; }

  table {
    background: var(--surface) !important;
    border-collapse: collapse !important;
  }

  th, td {
    background: var(--card) !important;
    color: var(--text-main) !important;
    padding: 6px 8px !important;
  }

  th[style*="background"],
  td[style*="background"] { background: var(--card) !important; }

  tr:nth-child(even) td { background: var(--surface) !important; }

  .mw-collapsible-toggle a { color: var(--cyan); font-weight: 600; }

  /* ─── Info / alert boxes ─────────────────────────────────── */
  .alert,
  .ambox,
  .mbox,
  .infobox,
  .new-infobox {
    background: var(--surface);
    border: 1px solid var(--border) !important;
    color: var(--text-main) !important;
  }

  .alert-warning,
  .alert.alert-warning {
    background: var(--surface-2) !important;
    color: var(--text-main) !important;
    border: 1px solid var(--border) !important;
  }

  .infobox th,
  .new-infobox-heading {
    background: var(--surface-2) !important;
    color: var(--text-main) !important;
  }

  /* ─── Code blocks ────────────────────────────────────────── */
  pre,
  code {
    background: var(--surface-2) !important;
    color: var(--text-main) !important;
    border: 1px solid var(--border) !important;
    border-radius: var(--radius);
  }

  pre { padding: 10px; overflow: auto; }

  /* ─── Forms ──────────────────────────────────────────────── */
  input,
  textarea,
  select {
    background: var(--surface-2) !important;
    color: var(--text-main) !important;
    border: 1px solid var(--border) !important;
  }

  input::placeholder,
  textarea::placeholder { color: var(--text-muted); }

  /* ─── Footer & scrollbar ─────────────────────────────────── */
  #footer,
  #footer-info,
  #footer-places {
    background: var(--bg) !important;
    color: var(--text-muted) !important;
  }

  #footer a { color: var(--cyan); }

  ::-webkit-scrollbar { width: 12px; height: 12px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb {
    background: var(--cyan);
    border-radius: 6px;
    transition: background 0.2s;
  }
  ::-webkit-scrollbar-thumb:hover { background: var(--cyan-light); }

  html {
    scrollbar-width: thin;
    scrollbar-color: var(--cyan) var(--bg);
  }

  /* ─── Hide Torn’s built-in back-to-top ───────────────────── */
  #torn-back-to-top { display: none !important; }

  /* ─── Back-to-Top FAB animation (no overshoot) ───────────── */
  @keyframes twPop {
    0%   { transform: scale(0.4); opacity: 0;   }
    100% { transform: scale(1);   opacity: 0.95; }
  }

  /* ─── FAB container (64 × 64 px) ─────────────────────────── */
  #tw-b2t {
    position: fixed;
    right: 1.4rem;
    bottom: 1.4rem;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    backdrop-filter: blur(8px);
    background: rgba(85, 195, 255, 0.12);
    box-shadow: var(--shadow);
    cursor: pointer;

    opacity: 0;
    pointer-events: none;
    transform: scale(0.4);
    transition: box-shadow 0.25s;
    z-index: 3000;
  }

  #tw-b2t.show {
    animation: twPop 0.33s ease-out forwards;
    pointer-events: auto;   /* <— makes it clickable */
  }

  #tw-b2t:hover {
    box-shadow: 0 0 14px var(--cyan-light), var(--shadow);
  }

  /* Progress ring */
  #tw-b2t svg.ring {
    position: absolute;
    top: 0;
    left: 0;
    width: 64px;
    height: 64px;
    transform: rotate(-90deg);
  }

  #tw-ring-track {
    stroke: rgba(255, 255, 255, 0.07);
    stroke-width: 8;
    fill: none;
  }

  #tw-ring-progress {
    stroke: var(--cyan);
    stroke-width: 8;
    stroke-linecap: round;
    fill: none;
    transition: stroke-dashoffset 0.1s;
  }

  /* Arrow */
  .tw-arrow {
    position: absolute;
    width: 26px;
    height: 26px;
    fill: var(--cyan);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: transform 0.25s;
  }

  #tw-b2t:hover .tw-arrow {
    transform: translate(-50%, -55%);
  }
  `;
  document.head.appendChild(document.createElement('style')).textContent = css;

  /*───────────────────────────────────────────────────────────────
    2.  Make external links open in a new tab
  ───────────────────────────────────────────────────────────────*/
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href.startsWith('#') || href.toLowerCase().startsWith('javascript')) return;

    /* treat as external if hostname differs */
    if (link.hostname && link.hostname !== location.hostname) {
      link.target = '_blank';
      link.rel = 'noopener';
    }
  });

  /*───────────────────────────────────────────────────────────────
    3.  Build smaller (64 px) Back-to-Top FAB
  ───────────────────────────────────────────────────────────────*/
  const SIZE        = 64;  // px
  const STROKE      = 8;   // px
  const RADIUS      = 28;  //  (28 × 2) + 8 = 64
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

  /* container */
  const fab = document.createElement('div');
  fab.id = 'tw-b2t';

  /* inner SVG (ring) + arrow */
  fab.innerHTML = `
    <svg class="ring" viewBox="0 0 ${SIZE} ${SIZE}">
      <circle
        cx="${SIZE / 2}"
        cy="${SIZE / 2}"
        r="${RADIUS}"
        stroke-width="${STROKE}"
        fill="none"
        stroke="rgba(255,255,255,0.07)"
      ></circle>

      <circle
        id="tw-ring-progress"
        cx="${SIZE / 2}"
        cy="${SIZE / 2}"
        r="${RADIUS}"
        stroke-width="${STROKE}"
        fill="none"
        stroke="var(--cyan)"
        stroke-linecap="round"
        stroke-dasharray="${CIRCUMFERENCE}"
        stroke-dashoffset="${CIRCUMFERENCE}"
      ></circle>
    </svg>

    <svg class="tw-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M12 6 6 12l-1.4-1.4L12 3.2l7.4 7.4L18 12z"></path>
    </svg>
  `;
  document.body.appendChild(fab);

  const ring = fab.querySelector('#tw-ring-progress');

  /* smooth scroll behaviour */
  fab.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  /* update ring offset + FAB visibility on scroll */
  const updateFab = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max ? Math.min(window.scrollY / max, 1) : 0;

    ring.style.strokeDashoffset = CIRCUMFERENCE * (1 - pct);
    fab.classList.toggle('show', window.scrollY > 150);
  };

  window.addEventListener('scroll', updateFab, { passive: true });
  updateFab();   // run once on load

  console.info('[Torn Wiki Dark-Gray] v2.6 loaded – FAB clickable & smaller');
})();
