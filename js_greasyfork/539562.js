// ==UserScript==
// @name            Testing outside scripts
// @description     Test them scripts, boi
// @version         1.0.2
// @author          Oliver P
// @namespace       https://github.com/OlisDevSpot
// @license         MIT
// @match           https://www.sce.com/*
// @run-at          document-end
// @compatible      safari
// @downloadURL https://update.greasyfork.org/scripts/539562/Testing%20outside%20scripts.user.js
// @updateURL https://update.greasyfork.org/scripts/539562/Testing%20outside%20scripts.meta.js
// ==/UserScript==

(function () {
  fetch('https://greasy-monkey-snippets.pages.dev/main.js')
    .then(res => res.text())
    .then(code => {
      const script = document.createElement('script');
      script.textContent = code;
      document.head.appendChild(script);
    });
})();