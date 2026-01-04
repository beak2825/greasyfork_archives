// ==UserScript==
// @name         auto-expand-github-issues
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  cleanup noisy timeline items and auto expand
// @author       pengx17
// @match        https://github.com/*/issues/*
// @match        https://github.com/*/pull/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @require      https://cdn.jsdelivr.net/npm/@holoflows/kit@0.9.0/umd/index.cjs
// @grant        none
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/470520/auto-expand-github-issues.user.js
// @updateURL https://update.greasyfork.org/scripts/470520/auto-expand-github-issues.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Your code here...
  async function main() {
    const { LiveSelector, MutationObserverWatcher } = HoloflowsKit;
    autoLoadMore();
    hideGitHubActionItems();

    ////
    function autoLoadMore() {
      const loadMoreButton = new LiveSelector().querySelector(
        "button.ajax-pagination-btn"
      );
      // auto expand github timeline
      new MutationObserverWatcher(
        loadMoreButton,
        document.querySelector("#repo-content-turbo-frame")
      )
        .useForeach((node, key, meta) => {
          node.click();
        })
        .startWatch({ attributes: true, childList: true, subtree: true });
    }

    function hideGitHubActionItems() {
      const items = new LiveSelector().querySelectorAll(
        ".js-timeline-item .js-updatable-content"
      );
      // auto expand github timeline
      new MutationObserverWatcher(
        items,
        document.querySelector("#repo-content-turbo-frame")
      )
        .useForeach((node, key, meta) => {
          const hideNode = () => {
            if (node.innerText.includes("with  GitHub Actions") || node.innerText.includes('View deployment')) {
              node.style.display = "none";
            } else {
              node.style.display = "block";
            }
          };
          hideNode();
          return {
            onNodeMutation: hideNode,
          };
        })
        .startWatch({ attributes: true, childList: true, subtree: true });
    }
  }

  main();
})();
