// ==UserScript==
// @name         Google Search keyboard navigation
// @namespace    http://tampermonkey.net/
// @version      2025-06-07-5
// @description  bring back the keyboard navigation in Google Search
// @author       victor141516
// @match        https://www.google.com/search?q=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/537552/Google%20Search%20keyboard%20navigation.user.js
// @updateURL https://update.greasyfork.org/scripts/537552/Google%20Search%20keyboard%20navigation.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Configuration constants
  const CONFIG = {
    CSS_CLASSES: {
      BASE: "x-keyboard-utils",
      ACTIVE: "x-keyboard-utils-active",
    },
    SELECTORS: {
      RESULTS_CONTAINER: "div[data-async-context^=query]",
      REGULAR_RESULT: "div:has(>div[lang]>div[data-snc])",
      VIDEO_RESULT: "div:has(>div[data-hveid] div[data-vid])",
      HEAD_RESULT: "div:has(>div[data-rpos] table[cellpadding])",
      HEAD_2_RESULT: "div:has(>h2):has(table[cellpadding])",
      WITH_SUMMARY_RESULT:
        "block-component > div[lang][data-hveid][data-ved] div[lang]",
      LINK: "a",
    },
    STYLES: {
      ARROW_SIZE: "15px",
      ARROW_OFFSET: "-20px",
      Z_INDEX: "100",
    },
    KEYS: {
      ARROW_DOWN: "ArrowDown",
      ARROW_UP: "ArrowUp",
      ENTER: "Enter",
    },
  };

  const SEARCH_RESULTS_SELECTOR = `${CONFIG.SELECTORS.RESULTS_CONTAINER} :is(${CONFIG.SELECTORS.REGULAR_RESULT}, ${CONFIG.SELECTORS.VIDEO_RESULT}, ${CONFIG.SELECTORS.HEAD_RESULT}, ${CONFIG.SELECTORS.WITH_SUMMARY_RESULT}, ${CONFIG.SELECTORS.HEAD_2_RESULT})`;
  console.log(SEARCH_RESULTS_SELECTOR);

  // State variables
  let activeIndex = 0;
  let results = [];
  let observer = null;

  function createStyleSheet() {
    return `
      .${CONFIG.CSS_CLASSES.BASE}.${CONFIG.CSS_CLASSES.ACTIVE}:before {
        content: '';
        z-index: ${CONFIG.STYLES.Z_INDEX};
        display: block;
        position: absolute;
        pointer-events: none;
        border: ${CONFIG.STYLES.ARROW_SIZE} solid transparent;
        border-left-color: blue;
        left: ${CONFIG.STYLES.ARROW_OFFSET};
      }
    `;
  }

  function injectStyles() {
    const styleElement = document.createElement("style");
    styleElement.textContent = createStyleSheet();
    document.head.appendChild(styleElement);
  }

  function isNavigationKey(key) {
    return Object.values(CONFIG.KEYS).includes(key);
  }

  function handleKeyDown(event) {
    const { key } = event;

    if (!isNavigationKey(key) || results.length === 0) {
      return;
    }

    event.preventDefault();

    switch (key) {
      case CONFIG.KEYS.ARROW_DOWN:
        moveToNextResult();
        break;
      case CONFIG.KEYS.ARROW_UP:
        moveToPreviousResult();
        break;
      case CONFIG.KEYS.ENTER:
        activateCurrentResult();
        return; // Don't update visual state for Enter
    }

    updateActiveState();
  }

  function moveToNextResult() {
    activeIndex = Math.min(activeIndex + 1, results.length - 1);
  }

  function moveToPreviousResult() {
    activeIndex = Math.max(activeIndex - 1, 0);
  }

  function activateCurrentResult() {
    const currentResult = results[activeIndex];
    if (!currentResult) {
      console.warn("No active result to activate");
      return;
    }

    const link = currentResult.querySelector(CONFIG.SELECTORS.LINK);
    if (link) {
      link.click();
    } else {
      console.warn("No link found in active result");
    }
  }

  function clearActiveStates() {
    results.forEach((result) => {
      result.classList.remove(CONFIG.CSS_CLASSES.ACTIVE);
    });
  }

  function setActiveState(element) {
    element.classList.add(CONFIG.CSS_CLASSES.ACTIVE);
    element.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
  }

  function updateActiveState() {
    clearActiveStates();

    const currentResult = results[activeIndex];
    if (currentResult) {
      setActiveState(currentResult);
    }
  }

  function findResultElements() {
    const container = document.querySelector(
      CONFIG.SELECTORS.RESULTS_CONTAINER
    );
    if (!container) {
      console.warn("Results container not found");
      return [];
    }

    return Array.from(container.querySelectorAll(SEARCH_RESULTS_SELECTOR));
  }

  function addBaseClassToResults(resultElements) {
    resultElements.forEach((result) => {
      if (!result.classList.contains(CONFIG.CSS_CLASSES.BASE)) {
        result.classList.add(CONFIG.CSS_CLASSES.BASE);
      }
    });
  }

  function validateActiveIndex() {
    if (activeIndex >= results.length && results.length > 0) {
      activeIndex = results.length - 1;
    } else if (results.length === 0) {
      activeIndex = 0;
    }
  }

  function updateResults() {
    results = findResultElements();
    addBaseClassToResults(results);
    validateActiveIndex();
  }

  function handleMutations(mutationList) {
    const hasChildListChanges = mutationList.some(
      (mutation) => mutation.type === "childList"
    );

    if (hasChildListChanges) {
      updateResults();
      updateActiveState();
    }
  }

  function setupMutationObserver() {
    const targetNode = document.querySelector(
      CONFIG.SELECTORS.RESULTS_CONTAINER
    );
    if (!targetNode) {
      console.warn("Cannot setup observer: target node not found");
      return;
    }

    observer = new MutationObserver(handleMutations);
    observer.observe(targetNode, {
      attributes: false,
      childList: true,
      subtree: false,
    });
  }

  function setupEventListeners() {
    document.addEventListener("keydown", handleKeyDown);
  }

  function initialize() {
    injectStyles();
    setupEventListeners();
    setupMutationObserver();
    updateResults();
    updateActiveState();
  }

  // Cleanup function (though not used in this context)
  function cleanup() {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  }

  // Start the application
  initialize();
})();
