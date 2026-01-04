// ==UserScript==
// @name        Reddit - force default theme
// @description Force subreddits to use the default theme, even while logged out
// @namespace   reddit-force-default-theme
// @author      valacar
// @version     1.1
// @license     MIT
// @include     https://www.reddit.com/*
// @include     https://np.reddit.com/*
// @include     https://xm.reddit.com/*
// @include     https://old.reddit.com/*
// @grant       none
// @run-at      document-start
// @noframes
// @compatible  firefox Firefox
// @compatible  chrome Chrome
// @downloadURL https://update.greasyfork.org/scripts/39114/Reddit%20-%20force%20default%20theme.user.js
// @updateURL https://update.greasyfork.org/scripts/39114/Reddit%20-%20force%20default%20theme.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // replace header logo with default snoo mascot (little alien guy) on subreddits that replace it
  function fixHeader(headerNode) {
    headerNode.innerHTML = "";
    headerNode.removeAttribute("src");
    headerNode.classList.add("default-header");
    headerNode.setAttribute("title", "reddit.com");
    headerNode.id = "header-img";
  }

  function mutationCallback(mutationRecord) {
    for (const mr of mutationRecord) {
      for (const node of mr.addedNodes) {
        // fix header
        if (node.id && node.id === "header-img-a") {
          fixHeader(node);
        }
        // delete signup banner
        if (node.classList && node.classList.contains("listingsignupbar")) {
          node.remove();
        }
      }
    }
  }


  // find and remove any custom stylesheet
  const customStyles = document.head.querySelectorAll('link[rel="stylesheet"][title="applied_subreddit_stylesheet"]');
  for (const link of [...customStyles]) {
    link.remove();
  }

  // create observer and start watching for dynamic content
  const watcher = new MutationObserver(mutationCallback);
  watcher.observe(document, {childList: true, subtree: true});

  // kill mutation observer after a while
  setTimeout(() => {
    watcher.disconnect();
  }, 10 * 1000);

})();
