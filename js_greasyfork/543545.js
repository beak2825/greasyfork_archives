// ==UserScript==
// @name        F95 Game Thread Search
// @namespace   1330126-edexal
// @match       *://f95zone.to/sam/latest_alpha/*
// @grant       none
// @icon        https://external-content.duckduckgo.com/ip3/f95zone.to.ico
// @license     Unlicense
// @version     1.1.1
// @author      Edexal
// @description On the Latest Update page, search for a game thread by 'TITLE' using the website's search query instead of through the filter drawer.
// @homepageURL https://sleazyfork.org/en/scripts/543545-f95-game-thread-search
// @supportURL  https://github.com/Edexaal/scripts/issues
// @require     https://cdn.jsdelivr.net/gh/Edexaal/scripts@e58676502be023f40293ccaf720a1a83d2865e6f/_lib/utility.js
// @downloadURL https://update.greasyfork.org/scripts/543545/F95%20Game%20Thread%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/543545/F95%20Game%20Thread%20Search.meta.js
// ==/UserScript==
(() => {
  const btn = {
    id: 'thread_search_btn',
    content: 'Thread Search',
    el: null
  };
  const el = {
    creator: null,
    gameCatBtn: null,
    titleInput: null
  };

  Edexal.addCSS(`
#${btn.id} {
    display: block;
    background: linear-gradient(to top left, rgb(0 0 0 / 0.2), rgb(0 0 0 / 0.2) 30%, rgb(0 0 0 / 0)) #ba4545;
    color: yellow;
    width: 100%;
    height: 40px;
    margin: 10px auto 5px auto;
    font-size: 0.875em;
    font-weight: bold;
    border: 1px solid #a4a4a4;
    border-radius: 5px;
    transition: opacity .2s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
        opacity: 0.8;
        cursor: pointer;
    }

    &:active {
        opacity: 0.6;
    }
}`);

  function initElements() {
    el.creator = document.querySelector("#filter-search_type .filter-search_type-creator");
    el.gameCatBtn = document.querySelector("#btn-cat_games .filter-block_button");
    el.titleInput = document.querySelector('#input-title_search');
  }

  function addButton() {
    btn.el = Edexal.newEl({element: 'button', id: btn.id, text: btn.content});
    const containerEl = document.querySelector('#filter-block_search');
    containerEl.append(btn.el);
  }

  function searchEvent(e) {
    e.preventDefault();
    let query = el.titleInput.value.trim();
    if (!query) {
      return;
    }
    query = query.replaceAll(" ", "+");
    const searchURL = `https://f95zone.to/search/1/?q=${query}&t=post&c[nodes][0]=2&c[title_only]=1&o=date&g=1`;
    location.assign(searchURL);
  }

  function isGameCategory() {
    return !location.href.includes('cat=') || location.href.includes('cat=games');
  }

  function toggleBtnVisibility(e) {
    const isSelected = e.classList.contains('on');
    btn.el.style.display = isSelected ? "none" : "block";
  }

  function setSearchTypeObserver() {
    const observer = new MutationObserver((records) => {
      for (const record of records) {
        if (record.type === "attributes" && isGameCategory()) {
          toggleBtnVisibility(record.target);
        }
      }

    });
    observer.observe(el.creator, {attributes: true});
  }

  function setCategoryObserver() {
    const observer = new MutationObserver((records) => {
      for (const record of records) {
        if (record.type === "attributes" && isGameCategory()) {
          toggleBtnVisibility(el.creator);
        } else if (record.type === "attributes" && !isGameCategory()) {
          btn.el.style.display = 'none';
        }
      }
    });
    observer.observe(el.gameCatBtn, {attributes: true});
  }

  function run() {
    initElements();
    addButton();
    Edexal.onEv(btn.el, 'click', searchEvent, {capture: true});
    setSearchTypeObserver();
    setCategoryObserver();
  }

  run();
})();