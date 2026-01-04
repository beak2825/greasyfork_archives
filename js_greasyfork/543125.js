// ==UserScript==
// @name        reddit css
// @description a
// @match       https://*.reddit.com/*
// @run-at      document-start
// @version 0.0.1.20250720131611
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/543125/reddit%20css.user.js
// @updateURL https://update.greasyfork.org/scripts/543125/reddit%20css.meta.js
// ==/UserScript==

(function () {
    const css = `
* {
color: revert !important;
}

.text-14-scalable {
    font-size: 1rem !important;
}
  `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
})();
