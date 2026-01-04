// ==UserScript==
// @name        Open All Project Cards - github.com
// @namespace   Jolg42
// @match       https://github.com/orgs/*/projects/*
// @grant       GM.openInTab
// @version     1.4.3
// @author      Joël Galeran
// @license     MIT
// @description Adds an "Open all" button to each Kanban column of a GitHub project (Classic and New)
// @run-at 	    document-end
// @inject-into content
// @downloadURL https://update.greasyfork.org/scripts/450834/Open%20All%20Project%20Cards%20-%20githubcom.user.js
// @updateURL https://update.greasyfork.org/scripts/450834/Open%20All%20Project%20Cards%20-%20githubcom.meta.js
// ==/UserScript==

// Note: @inject-into content makes it possible to bypass the CSP rules
// https://violentmonkey.github.io/posts/inject-into-context/

/* jshint esversion: 6 */

// Run the script!
ghOpenAllCards();

function openTabs(urls) {
  if (
    urls.length >= 10 &&
    !confirm(`This will open ${urls.length} new tabs. Continue?`)
  ) {
    return false;
  }

  urls.forEach((url) => {
    GM.openInTab(url, { active: false, insert: false });
  });

  return true;
}

// From https://stackoverflow.com/a/61511955/1345244
function waitForEl(selector) {
  return new Promise((resolve) => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver((mutations) => {
      if (document.querySelector(selector)) {
        resolve(document.querySelector(selector));
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}

function ghOpenAllCards() {
  "use strict";

  const isProjectClassic = document.querySelector(".js-project-container");

  // Project "Classic"
  if (isProjectClassic) {
    //
    // Put 1 Open All button on each column
    //
    function onButtonClickColumn(event) {
      const it = event.target;
      event.preventDefault();

      const columnId = it.closest(".project-column[id]").id;
      const cardsSelector = `#${columnId} .js-project-card-issue-link`;
      const cards = document.querySelectorAll(cardsSelector);
      const cardUrls = Object.entries(cards).map(function (it) {
        return it[1].href;
      });
      return openTabs(cardUrls);
    }

    document.querySelectorAll(".js-project-column-name").forEach((it) => {
      let btn = document.createElement("button");
      btn.className = "btn-link color-fg-muted float-right ghoa-open-all-cards";
      btn.type = "button";
      btn.innerText = "Open all 🐙";
      it.parentNode.append(btn);

      btn.addEventListener("click", onButtonClickColumn);
    });

    //
    // Project Pane ("Add cards" side panel)
    //
    function onButtonClickPane(event) {
      event.preventDefault();

      const cardsSelector = `.project-pane .issue-card .js-project-card-issue-link`;
      const cards = document.querySelectorAll(cardsSelector);
      const cardUrls = Object.entries(cards).map(function (it) {
        return it[1].href;
      });

      return openTabs(cardUrls);
    }

    waitForEl(".project-pane .js-project-search-results p").then((el) => {
      const projectPaneEl = document.querySelector(".project-pane");
      const projectPaneSearchResultsPEl = document.querySelector(
        ".project-pane .js-project-search-results p"
      );

      let btn = document.createElement("button");
      btn.className = "btn-link color-fg-muted float-right ghoa-open-all-cards";
      btn.type = "button";
      btn.innerText = "Open them all! 🐙";
      projectPaneSearchResultsPEl.append(btn);
      btn.addEventListener("click", onButtonClickPane);
    });
  } else {
    function onButtonClick(event) {
      const it = event.target;
      event.preventDefault();

      const cardUrls = new Set();
      const columnElement = it.closest("div[data-board-column]");
      const elementToScroll = columnElement.children[1].localName !== "span" ? columnElement.children[1] : columnElement.children[2];

      elementToScroll.scrollTo({
        top: 0,
        behavior: "instant",
      });

      const linkSelector = "a[data-testid='card-side-panel-trigger']"
      
      const cards = elementToScroll.querySelectorAll(linkSelector);

      Object.entries(cards).map(function (it) {
        cardUrls.add(it[1].href);
      });

      const interval = setInterval(function () {
        if (elementToScroll.scrollTop !== elementToScroll.scrollTopMax) {
          elementToScroll.scrollBy({
            top: 500,
            behavior: "instant",
          });

          Object.entries(elementToScroll.querySelectorAll(linkSelector)).map(function (
            it
          ) {
            cardUrls.add(it[1].href);
          });
        } else {
          clearInterval(interval);

          Object.entries(elementToScroll.querySelectorAll(linkSelector)).map(function (
            it
          ) {
            cardUrls.add(it[1].href);
          });

          return openTabs(Array.from(cardUrls));
        }
      }, 50);
    }

    waitForEl("[data-board-column]").then((el) => {
      document
        .querySelectorAll(
          '[data-board-column] [data-testid="column-context-menu-trigger"]'
        )
        .forEach((it) => {
          let btn = document.createElement("button");
          btn.className = "btn-link ghoa-open-all-cards px-2";
          btn.type = "button";
          btn.innerText = "🐙";
          it.parentNode.prepend(btn);
          btn.addEventListener("click", onButtonClick);
        });
    });
  }
}
