// ==UserScript==
// @name         ChatGPT Hide Specific Path Container
// @description  Hides div containing specific path on ChatGPT
// @match        *://chatgpt.com/*
// @version 0.0.1.20250706022656
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/541776/ChatGPT%20Hide%20Specific%20Path%20Container.user.js
// @updateURL https://update.greasyfork.org/scripts/541776/ChatGPT%20Hide%20Specific%20Path%20Container.meta.js
// ==/UserScript==

(function() {
  const hideTarget = () => {
    const path = document.querySelector('path[d^="M17.665 10C17.665"]');
    if (!path) return;
    const div = path.closest('div');
    if (div) {
      div.style.setProperty('visibility', 'hidden', 'important');
    }
  };

  const observer = new MutationObserver(() => hideTarget());

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  hideTarget();
})();
