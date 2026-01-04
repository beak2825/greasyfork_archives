// ==UserScript==
// @name         grok Persistently Hide DeepSearch Container on grok.com
// @description  Hides the container of the "Do DeepSearch" button each time it appears
// @match        *://*.grok.com/*
// @version 0.0.1.20250716212913
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/542754/grok%20Persistently%20Hide%20DeepSearch%20Container%20on%20grokcom.user.js
// @updateURL https://update.greasyfork.org/scripts/542754/grok%20Persistently%20Hide%20DeepSearch%20Container%20on%20grokcom.meta.js
// ==/UserScript==

(function() {
  const hideDeepSearch = () => {
    const span = Array.from(document.querySelectorAll("span"))
      .find(el => el.textContent.trim() === "Do DeepSearch");
    if (!span) return;

    const button = span.closest("button");
    if (!button) return;

    const div = button.closest("div");
    if (!div) return;

    if (!div.__hiddenByScript) {
      div.style.setProperty("display", "none", "important");
      div.__hiddenByScript = true; // prevent reapplying unnecessarily
    }
  };

  const observer = new MutationObserver(hideDeepSearch);

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Also call once on load in case it's already rendered
  hideDeepSearch();
})();
