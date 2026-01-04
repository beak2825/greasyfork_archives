// ==UserScript==
// @name         DLsite Search Form at Top
// @namespace    https://x.com/kawaiiinf
// @version      1.5.0
// @description  DLsiteの検索結果ページで、左カラムの検索フォームをページ上部へ移動し、スクロール中も固定表示します。動的なページ更新にも対応します。
// @author       Kawaii monkey
// @license      BSD 2-Clause
// @match        https://www.dlsite.com/*
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/544188/DLsite%20Search%20Form%20at%20Top.user.js
// @updateURL https://update.greasyfork.org/scripts/544188/DLsite%20Search%20Form%20at%20Top.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const MOVED_ATTR   = 'data-dlst-moved';
  const CONTAINER_ID = 'dlst-search-top-container';
  const DEBUG = false;
  function log(...a){ if(DEBUG) console.log('[DLsite Search Top v1.4.3]', ...a); }

  function addStyle(css){
    if (typeof GM_addStyle === 'function') GM_addStyle(css);
    else { const s=document.createElement('style'); s.textContent=css; document.head.appendChild(s); }
  }

  // 親へ sticky を適用 + タグ色分け用CSS
  addStyle(`
    *:has(> #${CONTAINER_ID}) {
      position: sticky;
      top: 0;
      z-index: 10;
      background: rgba(250, 250, 250, 0.85);
      backdrop-filter: saturate(1.05) blur(3px);
      border: #607194 1px solid;
      padding: 0.10rem 0.25rem;
    }
    #${CONTAINER_ID} {
      padding: 8px 10px;
    }
    #${CONTAINER_ID} input[type="search"] {
      width: calc(100% - 30px) !important;
    }

    /* タグ色分け（特異性を既存セレクタ以上にする） */
    .search_tag_items li a.tag-game {
      background-color: #f5eaff;
    }
    .search_tag_items li a.tag-manga {
      background-color: #e6f7d6;
    }
    .search_tag_items li a.tag-cgillust {
      background-color: #e9f5ff;
    }
  `);

  // --- タグにクラスを付与 ---
  function colorizeTags() {
    document.querySelectorAll("ul.search_tag_items > li > a").forEach(a => {
      const text = a.textContent.trim();
      a.classList.remove("tag-game","tag-manga","tag-cgillust");
      if (text === "ゲーム") {
        a.classList.add("tag-game");
      } else if (text === "マンガ") {
        a.classList.add("tag-manga");
      } else if (text === "CG・イラスト") {
        a.classList.add("tag-cgillust");
      }
    });
  }

  function getTargets(){
    const cpSearch = document.querySelector('.cp_search');
    const searchTop = document.querySelector('.search_top');
    if (!cpSearch || !searchTop) return null;
    const form = cpSearch.closest('form');
    const parent = searchTop.parentElement || searchTop;
    if (!form || !parent) return null;
    return { cpSearch, form, searchTop, parent };
  }

  function ensureContainer(searchTop){
    let c = document.getElementById(CONTAINER_ID);
    if (!c){
      c = document.createElement('div');
      c.id = CONTAINER_ID;
      searchTop.after(c);
      log('Inserted container after .search_top');
    }
    return c;
  }

  function moveFormIntoContainer(){
    const t = getTargets();
    if (!t) return;
    const { form, searchTop } = t;
    const container = ensureContainer(searchTop);
    if (form.getAttribute(MOVED_ATTR) === '1' && form.parentElement === container) return;
    container.appendChild(form);
    form.setAttribute(MOVED_ATTR, '1');
    log('Form moved into container');
  }

  function bootstrap(){
    moveFormIntoContainer();
    colorizeTags();

    // SPA対応
    let timer = 0;
    const obs = new MutationObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        moveFormIntoContainer();
        colorizeTags();
      }, 60);
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });

    window.addEventListener('pageshow', () => {
      moveFormIntoContainer();
      colorizeTags();
    }, { once: true });

    window.addEventListener('popstate', () => setTimeout(() => {
      moveFormIntoContainer();
      colorizeTags();
    }, 50));

    document.addEventListener('turbo:load', () => {
      moveFormIntoContainer();
      colorizeTags();
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bootstrap);
  else bootstrap();
})();
