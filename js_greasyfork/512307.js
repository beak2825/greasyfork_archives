// ==UserScript==
// @name         Confirm GitLab Merge Request Creator
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Confirm GitLab merge request when creator differs from the current user.
// @author       Ben L
// @match        https://gitlab.covergenius.biz/*/merge_requests/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=covergenius.biz
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/512307/Confirm%20GitLab%20Merge%20Request%20Creator.user.js
// @updateURL https://update.greasyfork.org/scripts/512307/Confirm%20GitLab%20Merge%20Request%20Creator.meta.js
// ==/UserScript==

(function () {
  "use strict";

  let hasConfirmed = false;

  const handleMergeButtonClick = (event) => {
    if (hasConfirmed) {
      return;
    }

    const currentUserId = window.gon?.current_user_id;
    const creatorElement = document.querySelector("[data-user-id]");

    if (!creatorElement) {
      return;
    }

    const creatorUserId = parseInt(
      creatorElement.getAttribute("data-user-id"),
      10
    );

    if (currentUserId !== creatorUserId) {
      event.stopImmediatePropagation();
      const confirmed = confirm(
        "The creator of this MR is not you. Do you want to proceed with the merge?"
      );

      if (!confirmed) {
        event.preventDefault();
      } else {
        hasConfirmed = true;
        event.target.click();
      }
    }
  };

  const observer = new MutationObserver(() => {
    const mergeButton = document.querySelector(
      ".accept-merge-request.btn-confirm"
    );

    if (mergeButton) {
      mergeButton.addEventListener("click", handleMergeButtonClick, true);
      observer.disconnect();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
