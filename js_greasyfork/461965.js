// ==UserScript==
// @name         Run Workflow Label Enhancer
// @namespace    https://sanketmishra.me
// @version      0.1
// @description  Changes the label of branch selection dropdown in Run Workflow Action from "Use Workflow From" to "Destination Branch"
// @author       Sanket Mishra
// @match        https://github.com/*
// @match        https://*.github.com/*
// @icon         https://github.githubassets.com/favicons/favicon-dark.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461965/Run%20Workflow%20Label%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/461965/Run%20Workflow%20Label%20Enhancer.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const ACTIONS_PAGE_REGEX = /\/actions\/workflows\/.+\.yaml$/;
  const INTERVAL_DURATION = 1000;

  let intervalId = null;

  function isPrActionsPage() {
    return ACTIONS_PAGE_REGEX.test(window.location.pathname);
  }

  function replaceBranchSelectionLabel() {
    const parentDiv = document.getElementsByClassName("branch-selection")[0];

    if (!parentDiv) {
      return;
    }

    const labelDiv = [...parentDiv.children].find(
      (child) => child.textContent.trim().toLowerCase() === "use workflow from"
    );

    if (!labelDiv) {
      return;
    }

    labelDiv.textContent = "Destination Branch";
  }

  function shouldRun() {
    return isPrActionsPage();
  }

  function execute() {
    if (shouldRun()) {
      replaceBranchSelectionLabel();
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

  runOnInterval();
})();
