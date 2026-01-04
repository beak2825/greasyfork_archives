// ==UserScript==
// @name        twitch css
// @description a
// @match       https://*.twitch.tv/*
// @run-at      document-start
// @version 0.0.1.20250727150252
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/543625/twitch%20css.user.js
// @updateURL https://update.greasyfork.org/scripts/543625/twitch%20css.meta.js
// ==/UserScript==

(function () {
    const css = `
* {
white-space: revert !important;
}

div[data-test-selector="side-nav"] {
display: none !important;
}
  `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
})();
