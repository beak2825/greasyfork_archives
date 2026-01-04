// ==UserScript==
// @name         Github Bors Merge
// @namespace    https://sanketmishra.me
// @version      0.1
// @description  Adds a button to easily start/stop PR merge when using bors
// @author       Sanket Mishra
// @match        https://github.com/*
// @match        https://*.github.com/*
// @icon         https://github.githubassets.com/favicons/favicon-dark.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461964/Github%20Bors%20Merge.user.js
// @updateURL https://update.greasyfork.org/scripts/461964/Github%20Bors%20Merge.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const BORS_MERGE_COMMENT = "bors r+";
  const BORS_CANCEL_COMMENT = "bors r-";
  const BORS_BUTTON_ID = "bors-button-submit";
  const BORS_MERGE_BUTTON_LABEL = "Bors Merge";
  const BORS_CANCEL_BUTTON_LABEL = "Bors Cancel";
  const BORS_PENDING_PREFIX = "borspending";
  const INTERVAL_DURATION = 3 * 1000; // 3 sec
  const PULL_REQUEST_COMMENTS_PAGE_REGEX = /\/pull\/\d+$/;

  const BORS_BUTTON_TYPE = "submit"; // change to "button" for testing

  let intervalId = null;

  function isPrCommentsPage() {
    return PULL_REQUEST_COMMENTS_PAGE_REGEX.test(window.location.pathname);
  }

  function isPrOpen() {
    return document.getElementsByClassName("State--open").length > 0;
  }

  function isBorsRunning() {
    const mergeStatusItems = [
      ...document.getElementsByClassName("merge-status-item"),
    ];
    return mergeStatusItems.some((item) => {
      const textContent = item.innerText
        .replaceAll(/[\W\n]+/g, "")
        .trim()
        .toLowerCase();
      return textContent.startsWith(BORS_PENDING_PREFIX);
    });
  }

  function getExistingBorsButton() {
    return document.getElementById(BORS_BUTTON_ID);
  }

  function isBorsButtonPresent() {
    return getExistingBorsButton() !== null;
  }

  function getExistingBorsButtonText() {
    return getExistingBorsButton()?.innerText ?? "";
  }

  function getBorsBaseButton() {
    const borsButton = document.createElement("button");
    borsButton.className = "btn-primary btn mr-1";
    borsButton.setAttribute("type", BORS_BUTTON_TYPE);
    borsButton.setAttribute("id", BORS_BUTTON_ID);
    return borsButton;
  }

  function getBorsButtonLabel(isBorsAlreadyRunning) {
    return isBorsAlreadyRunning
      ? BORS_CANCEL_BUTTON_LABEL
      : BORS_MERGE_BUTTON_LABEL;
  }

  function getBorsButtonCommentText(isBorsAlreadyRunning) {
    return isBorsAlreadyRunning ? BORS_CANCEL_COMMENT : BORS_MERGE_COMMENT;
  }

  function addOrReplaceBorsButton(borsButton, borsButtonParent) {
    if (isBorsButtonPresent()) {
      borsButtonParent.replaceChild(
        borsButton,
        borsButtonParent.firstElementChild
      );
    } else {
      borsButtonParent.insertBefore(
        borsButton,
        borsButtonParent.firstElementChild
      );
    }
  }

  function handleBorsButton() {
    const commentTextArea = document.getElementById("new_comment_field");
    const commentBoxButtonsParent = document.getElementById(
      "partial-new-comment-form-actions"
    ).firstElementChild;
    const commentButton = [
      ...commentBoxButtonsParent.getElementsByTagName("button"),
    ].filter((btn) => btn.innerText.toLowerCase() === "comment")[0];

    if (!commentButton) {
      return;
    }

    const isBorsAlreadyRunning = isBorsRunning();
    const borsButton = getBorsBaseButton();

    borsButton.innerText = getBorsButtonLabel(isBorsAlreadyRunning);
    borsButton.addEventListener("click", () => {
      commentTextArea.value = getBorsButtonCommentText(isBorsAlreadyRunning);
    });

    addOrReplaceBorsButton(borsButton, commentBoxButtonsParent);
  }

  function shouldHandleBorsButton() {
    if (!isPrCommentsPage()) {
      return false;
    }

    if (!isPrOpen()) {
      return false;
    }

    if (!isBorsButtonPresent()) {
      return true;
    }

    const borsButtonActualText = getExistingBorsButtonText();
    const borsButtonExpectedText = isBorsRunning()
      ? BORS_CANCEL_BUTTON_LABEL
      : BORS_MERGE_BUTTON_LABEL;

    return borsButtonActualText !== borsButtonExpectedText;
  }

  function execute() {
    if (shouldHandleBorsButton()) {
      handleBorsButton();
    }
  }

  function runOnInterval() {
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }

    // Run it immediately for the first time
    execute();

    // Setup an interval to check whether the bors button is in DOM
    // Add it to the DOM if not present. Do nothing if present.
    intervalId = setInterval(() => {
      execute();
    }, INTERVAL_DURATION);
  }

  // Main function starts here
  runOnInterval();
})();
