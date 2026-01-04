// ==UserScript==
// @name         StoryGraph Plus: Search MAM Buttons
// @namespace    https://greasyfork.org/en/users/1457912
// @version      0.4.3
// @description  Add "Search MAM" buttons to TheStoryGraph book and series pages (Title/Series and Title/Series + Author)
// @author       WilliestWonka
// @match        https://app.thestorygraph.com/books/*
// @match        https://app.thestorygraph.com/series/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533081/StoryGraph%20Plus%3A%20Search%20MAM%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/533081/StoryGraph%20Plus%3A%20Search%20MAM%20Buttons.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const maxRetries = 2;
  let retryCount = 0;
  let retryIntervalId = null;

  function createMamButtons(title, author, isSeries = false) {
    console.log("[SG+] Creating MAM buttons for:", title, author, "isSeries:", isSeries);
    const container = document.createElement("div");
    container.className = "mam-button-container flex mt-2 mb-2 space-x-2 w-full";

    const createButton = (text, url) => {
      const button = document.createElement("a");
      button.href = url;
      button.target = "_blank";
      button.textContent = text;
      button.className =
        "py-2 px-2 border-x-2 border-x-darkGrey dark:border-x-darkerGrey " +
        "border-y border-y-darkGrey dark:border-y-darkerGrey border-b-2 " +
        "bg-grey dark:bg-darkestGrey hover:bg-darkGrey dark:hover:bg-darkerGrey " +
        "inline-flex items-center justify-center w-full text-center text-xs " +
        "text-darkerGrey dark:text-lightGrey";
      return button;
    };

    const searchUrl = (query) =>
      `https://www.myanonamouse.net/tor/browse.php?tor[text]=${encodeURIComponent(query)}`;

    if (isSeries) {
      container.appendChild(createButton("Search MAM Series", searchUrl(`"${title}"`)));
      container.appendChild(createButton("Search MAM Series + Author", searchUrl(`"${title}" "${author}"`)));
    } else {
      container.appendChild(createButton("Search MAM Title", searchUrl(`"${title}"`)));
      container.appendChild(createButton("Search MAM Title + Author", searchUrl(`"${title}" "${author}"`)));
    }

    return container;
  }

  function addButtonsIfReady() {
    console.log("[SG+] Checking if buttons should be added...");
    const pathParts = location.pathname.split('/').filter(Boolean);
    const isBookPage = pathParts[0] === "books";
    const isSeriesPage = pathParts[0] === "series";
    const isToReadPage = pathParts[0] === "to-read";

    if (!isBookPage && !isSeriesPage && !isToReadPage) return false;

    if (isSeriesPage) {
      // Add buttons at top of series page
      const titleElement = document.querySelector("h4.page-heading");
      const authorElement = document.querySelector("p.font-body a[href^='/authors/']");
      const headingContainer = document.querySelector("div.flex.justify-between.items-center.px-1");

      const title = titleElement?.textContent.trim();
      const author = authorElement?.textContent.trim();

      if (title && author && headingContainer &&
          !headingContainer.nextElementSibling?.classList.contains("mam-button-container")) {
        const topButtons = createMamButtons(title, author, true);
        headingContainer.insertAdjacentElement("afterend", topButtons);
        console.log("[SG+] 'Search MAM' series buttons added at top!");
      }
    }

    const containers = document.querySelectorAll("div.book-title-author-and-series");
    console.log("[SG+] Found book containers:", containers.length);
    if (!containers.length) return false;

    let allValid = true;

    containers.forEach(container => {
      if (container.querySelector(".mam-button-container")) return;

      // NEW extraction logic
      const titleElem = container.querySelector("h3");
      const authorElem = container.querySelector("p.font-body a[href*='/authors/']");

      const title = titleElem?.textContent.trim() ?? null;
      const author = authorElem?.textContent.trim() ?? null;

      if (!title || !author) {
        console.warn("[SG+] Missing title or author for a container:", container);
        allValid = false;
        return;
      }

      const buttons = createMamButtons(title, author, false);
      container.appendChild(buttons);
    });

    console.log("[SG+] 'Search MAM' buttons added to all containers.");
    return allValid;
  }

  function startUnifiedRetryLoop() {
    clearInterval(retryIntervalId);
    retryCount = 0;

    retryIntervalId = setInterval(() => {
      if (retryCount >= maxRetries) {
        clearInterval(retryIntervalId);
        console.log("[SG+] Max retries reached, stopping.");
        return;
      }

      if (!document.querySelector(".mam-button-container")) {
        console.log(`[SG+] Buttons missing, re-adding... Retry ${retryCount}`);
        const success = addButtonsIfReady();
        retryCount++;
        if (success) {
          clearInterval(retryIntervalId);
        }
      }
    }, 500);
  }

  function observeDOMChanges() {
    const targetNode = document.querySelector("main");
    if (!targetNode) return;

    const config = { childList: true, subtree: true };

    const callback = function(mutationsList) {
      for (const mutation of mutationsList) {
        if (mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach(node => {
            // If new .book-title-author-and-series added, re-run addButtonsIfReady
            if (node.nodeType === 1) {
              if (node.matches && node.matches("div.book-title-author-and-series")) {
                addButtonsIfReady();
              }
              if (node.querySelectorAll) {
                const inner = node.querySelectorAll("div.book-title-author-and-series");
                if (inner.length) {
                  addButtonsIfReady();
                }
              }
            }
          });
        }
      }
    };

    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
  }

  function setupNavigationListener() {
    const originalPushState = history.pushState;
    history.pushState = function (...args) {
      originalPushState.apply(this, args);
      window.dispatchEvent(new Event("locationchange"));
    };

    const originalReplaceState = history.replaceState;
    history.replaceState = function (...args) {
      originalReplaceState.apply(this, args);
      window.dispatchEvent(new Event("locationchange"));
    };

    window.addEventListener("popstate", () => window.dispatchEvent(new Event("locationchange")));

    window.addEventListener("locationchange", () => {
      setTimeout(() => startUnifiedRetryLoop(), 300);
    });
  }

  window.addEventListener("load", () => {
    console.log("[SG+] Script loaded.");
    startUnifiedRetryLoop();
    setupNavigationListener();
    observeDOMChanges();
  });

})();
