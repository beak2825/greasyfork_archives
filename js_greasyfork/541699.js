// ==UserScript==
// @name        mastodon settings css
// @description a
// @match       https://mastodon.social/settings*
// @run-at      document-start
// @version 0.0.1.20251123105510
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/541699/mastodon%20settings%20css.user.js
// @updateURL https://update.greasyfork.org/scripts/541699/mastodon%20settings%20css.meta.js
// ==/UserScript==

(function () {
    const css = `
.sidebar-wrapper, .sidebar-wrapper * {
    width: unset !important;
}
  `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
})();
