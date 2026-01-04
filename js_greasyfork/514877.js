// ==UserScript==
// @name         Bookracy Download (Multi-Site)
// @namespace    http://tampermonkey.net/
// @version      1.93
// @description  Adds a free download button on different sites for books including Amazon, Goodreads, Five Books, The Greatest Books, Reddit Reads, and Most Recommended Books.
// @license      MIT
// @author       Dan, Custom, internetninja, fmhy.net, Perplexity, ChatGPT, Gemini 
// @match        https://thegreatestbooks.org/*
// @match        https://fivebooks.com/*
// @match        https://www.goodreads.com/*
// @match        https://www.redditreads.com/*
// @match        https://www.mostrecommendedbooks.com/*
// @match        https://www.amazon.com/*
// @match        https://www.amazon.fr/*
// @match        https://www.amazon.de/*
// @match        https://www.amazon.co.uk/*
// @match        https://www.amazon.it/*
// @match        https://www.amazon.*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514877/Bookracy%20Download%20%28Multi-Site%29.user.js
// @updateURL https://update.greasyfork.org/scripts/514877/Bookracy%20Download%20%28Multi-Site%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const BOOKRACY_URL = "https://bookracy.ru/?q=";

  const SELECTORS = {
    greatestBooksItem: ".list-group-item.book-list-item, tr.book-list-item",
    greatestBooksAction: ".d-flex.flex-row.bd-highlight.mb-2",
    fiveBooksItem: "li.single-book",
    fiveBooksTitle: "h2.book-title span.title",
    goodreadsSingleTitle: 'h1.Text[data-testid="bookTitle"]',
    goodreadsSingleAuthor: 'span.ContributorLink__name[data-testid="name"]',
    goodreadsSingleContainer: ".BookActions",
    goodreadsListItem: ".bookTitle",
    amazonInsertion: "#desktop_buybox, #buybox, #tmmSwatches, #addToCart_feature_div",
    amazonContainer: "#dpx-detail-container, body",
    amazonTitle: "#productTitle, #ebooksProductTitle",
    amazonAuthor: ".author a, .contributorNameID, #bylineInfo",
    redditReadsTitle: ".book-title",
    mostRecommendedBooksItem: ".styles_book-recommended-book-text__e8voI",
    mostRecommendedBooksButtons: ".styles_book-recommended-buttons__xp5uR",
  };

  const SITE_HANDLERS = {
    "thegreatestbooks.org": handleGreatestBooks,
    "fivebooks.com": handleFiveBooks,
    "www.goodreads.com": handleGoodreads,
    "www.redditreads.com": handleRedditReads,
    "www.mostrecommendedbooks.com": handleMostRecommendedBooks,
    amazon: handleAmazon,
  };

  const hostname = window.location.hostname;
  const siteKey = Object.keys(SITE_HANDLERS).find((key) =>
    hostname.includes(key)
  );
  const handler = siteKey ? SITE_HANDLERS[siteKey] : null;

  // Add general styles for buttons
  addStyles(`
        .bookracy-download-button {
            display: inline-block;
            margin-top: 10px;
            text-decoration: none;
            color: white !important;
            background-color: #007bff;
            border: none;
            border-radius: 4px;
            padding: 8px 12px;
            font-size: 14px !important;
            cursor: pointer;
            font-weight: bold;
            text-align: center;
            line-height: normal;
            min-height: 32px;
            min-width: 150px;
            font-family: Arial, Helvetica, sans-serif !important;
        }
        .bookracy-download-button.small {
            font-size: 12px !important;
            padding: 6px 8px;
            min-height: 24px;
            min-width: 120px;
            font-family: Arial, Helvetica, sans-serif !important;
        }
    `);

  // Utility functions
  function addStyles(css) {
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
  }

  function createDownloadButton(bookTitle, isSmall = false) {
    const button = document.createElement("a");
    button.href = `${BOOKRACY_URL}${encodeURIComponent(bookTitle)}`;
    button.className = `bookracy-download-button ${isSmall ? "small" : ""}`;
    button.target = "_blank";
    button.textContent = "Download from Bookracy";
    return button;
  }

  function appendButtonIfUnique(parentElement, bookTitle, isSmall = false) {
    if (
      !parentElement ||
      parentElement.querySelector(".bookracy-download-button")
    )
      return;
    parentElement.appendChild(createDownloadButton(bookTitle, isSmall));
  }

  function getBookTitleWithAuthor(titleElement, authorElement) {
    if (!titleElement && !authorElement) return "";
    const title = titleElement?.textContent?.trim() || "";
    const author = authorElement?.textContent?.trim() || "";
    return `${title}${author ? ` by ${author}` : ""}`;
  }

  function debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func.apply(this, args), timeout);
    };
  }

  // Handler functions
  function handleGreatestBooks() {
    document
      .querySelectorAll(SELECTORS.greatestBooksItem)
      .forEach((bookItem) => {
        const actionContainer = bookItem.querySelector(
          SELECTORS.greatestBooksAction
        );
        const titleElement = bookItem.querySelector("h4 a");
        if (actionContainer && titleElement) {
          appendButtonIfUnique(actionContainer, titleElement.textContent.trim());
        }
      });
  }

  function handleFiveBooks() {
    document.querySelectorAll(SELECTORS.fiveBooksItem).forEach((bookLi) => {
      if (bookLi.querySelector(".bookracy-download-button")) return;
      const titleSpan = bookLi.querySelector(SELECTORS.fiveBooksTitle);
      const aElement = titleSpan?.closest("a");
      if (aElement) {
        appendButtonIfUnique(aElement.parentNode, titleSpan.textContent.trim());
      }
    });
  }

  function handleGoodreads() {
    // Single book page
    const singleBookTitle = document.querySelector(
      SELECTORS.goodreadsSingleTitle
    );
    const singleBookAuthor = document.querySelector(
      SELECTORS.goodreadsSingleAuthor
    );
    const singleBookContainer = document.querySelector(
      SELECTORS.goodreadsSingleContainer
    );
    if (singleBookTitle && singleBookAuthor) {
      const bookTitle = getBookTitleWithAuthor(singleBookTitle, singleBookAuthor);
      appendButtonIfUnique(singleBookContainer, bookTitle);
    }

    // Goodreads List Page Logic
    document.querySelectorAll(SELECTORS.goodreadsListItem).forEach((titleElement) => {
      const parentElement = titleElement.closest("tr");
      if (
        !parentElement ||
        parentElement.querySelector(".bookracy-download-button")
      )
        return;

      const bookTitle = getBookTitleWithAuthor(
        titleElement,
        parentElement.querySelector(".authorName span")
      );
      let lastTd =
        parentElement.querySelector("td:last-child") ||
        parentElement.appendChild(document.createElement("td"));
      appendButtonIfUnique(lastTd, bookTitle, true);
    });
  }

  function handleAmazon() {
    const insertionSelector = SELECTORS.amazonInsertion;
    const amazonContainer = document.querySelector(SELECTORS.amazonContainer);

    const insertButton = () => {
      const insertionPoint = document.querySelector(insertionSelector);
      const titleElement = document.querySelector(SELECTORS.amazonTitle);
      const authorElement = document.querySelector(SELECTORS.amazonAuthor);

      if (
        !insertionPoint ||
        !titleElement ||
        !authorElement ||
        insertionPoint.querySelector(".bookracy-download-button")
      ) {
        return;
      }

      const bookTitle = getBookTitleWithAuthor(titleElement, authorElement);
      appendButtonIfUnique(insertionPoint, bookTitle);
    };

    if (amazonContainer) {
      const observer = new MutationObserver(insertButton);
      observer.observe(amazonContainer, { childList: true, subtree: true });
    }
    insertButton();
  }

  function handleRedditReads() {
    document.querySelectorAll(SELECTORS.redditReadsTitle).forEach((titleElement) => {
      const scoreElement = titleElement.nextElementSibling;
      if (scoreElement?.classList.contains("book-score")) {
        appendButtonIfUnique(
          scoreElement.parentNode,
          titleElement.textContent.trim()
        );
      }
    });
  }

  function handleMostRecommendedBooks() {
    document
      .querySelectorAll(SELECTORS.mostRecommendedBooksItem)
      .forEach((bookDiv) => {
        const buttonsContainer = bookDiv.nextElementSibling;
        if (
          buttonsContainer?.classList.contains(
            SELECTORS.mostRecommendedBooksButtons
          )
        ) {
          const titleElement = bookDiv.querySelector("h3");
          const authorElement = bookDiv.querySelector("h5");
          if (titleElement && authorElement) {
            appendButtonIfUnique(
              buttonsContainer,
              getBookTitleWithAuthor(titleElement, authorElement)
            );
          }
        }
      });
  }

  const processBooks = debounce(() => {
    if (handler) handler();
  });

  if (handler) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", processBooks);
    } else {
      processBooks();
    }

    const observer = new MutationObserver(processBooks);
    observer.observe(document.body, { childList: true, subtree: true });
  }
})();