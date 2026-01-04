// ==UserScript==
// @name        Github: reduce title opacity of PRs with a specific label
// @namespace   Violentmonkey Scripts
// @match       https://github.com/navikt/aksel/pulls*
// @grant       none
// @version     1.2
// @author      popular-software
// @description 23/01/2025, 12:23:20
// @require https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @run-at document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/524632/Github%3A%20reduce%20title%20opacity%20of%20PRs%20with%20a%20specific%20label.user.js
// @updateURL https://update.greasyfork.org/scripts/524632/Github%3A%20reduce%20title%20opacity%20of%20PRs%20with%20a%20specific%20label.meta.js
// ==/UserScript==

const LABEL_TO_DIM = "On hold :pause_button:";
const ONLY_DIM_TITLE = false;

const disconnect = VM.observe(document.body, () => {
  const nodes = document.body.querySelectorAll(`div.flex-auto:has(.Link--primary):has(a[data-name="${LABEL_TO_DIM}"])`);

  for (let node of nodes) {
    if (ONLY_DIM_TITLE) {
      const title = node.querySelector('a');
      title.style = "opacity: 0.2;";
    }
    else {
      node.style = "opacity: 0.2; font-size: 10px;";
    }
  }

});

// You can also disconnect the observer explicitly when it's not used any more
// disconnect();
