// ==UserScript==
// @name        bsky css
// @description a
// @match       https://bsky.app/*
// @run-at      document-start
// @version 0.0.1.20250713122802
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/542462/bsky%20css.user.js
// @updateURL https://update.greasyfork.org/scripts/542462/bsky%20css.meta.js
// ==/UserScript==

(function () {
    const css = `
div[data-testid="HomeScreen"] {
/*visibility: hidden !important;*/
display: none !important;
}
  `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
})();
