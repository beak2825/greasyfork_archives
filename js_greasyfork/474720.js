// ==UserScript==
// @name         GitHub Feed Back
// @namespace    https://github.com/Sec-ant
// @version      0.1.5
// @author       Ze-Zheng Wu
// @description  Bring my GitHub feed back
// @license      MIT
// @icon         https://github.githubassets.com/favicons/favicon.svg
// @homepage     https://github.com/Sec-ant/github-feed-back
// @homepageURL  https://github.com/Sec-ant/github-feed-back
// @source       https://github.com/Sec-ant/github-feed-back.git
// @supportURL   https://github.com/Sec-ant/github-feed-back/issues
// @match        https://github.com/
// @match        https://github.com/?*
// @match        https://github.com/dashboard*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/474720/GitHub%20Feed%20Back.user.js
// @updateURL https://update.greasyfork.org/scripts/474720/GitHub%20Feed%20Back.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let isIncludeFragmentFound = false;
  let isFilterButtonFound = false;
  const observer = new MutationObserver((_, observer2) => {
    const includeFragment = document.querySelector(
      '[data-target="feed-container.content"] > include-fragment'
    );
    if (includeFragment) {
      includeFragment.setAttribute("src", "/dashboard-feed");
      isIncludeFragmentFound = true;
    }
    const filterButton = document.querySelector(
      '[data-target="feed-container.feedTitle"] + div'
    );
    if (filterButton) {
      filterButton.remove();
      isFilterButtonFound = true;
    }
    if (isIncludeFragmentFound && isFilterButtonFound) {
      observer2.disconnect();
    }
  });
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
  document.addEventListener("DOMContentLoaded", () => {
    observer.disconnect();
  });

})();