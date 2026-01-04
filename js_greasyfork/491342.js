// ==UserScript==
// @name          Reddit Hide Moderator Comments 2024
// @namespace     http://userstyles.org
// @description   Hides Reddit Moderator Comments 2024
// @version       0.1.2024
// @author        636597
// @author        carbocalm
// @run-at        document-start
// @match       *://*reddit.com/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/491342/Reddit%20Hide%20Moderator%20Comments%202024.user.js
// @updateURL https://update.greasyfork.org/scripts/491342/Reddit%20Hide%20Moderator%20Comments%202024.meta.js
// ==/UserScript==

(function add_css() {
  "updates https://greasyfork.org/en/scripts/449184-reddit-hide-moderator-comments style";
  var styles = `
              div.stickied.comment { display: none !important; }
          `;
  try {
    var styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
  } catch (e) {
    console.log(e);
  }
})();
