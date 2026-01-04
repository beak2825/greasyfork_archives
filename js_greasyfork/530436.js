// ==UserScript==
// @name         No more GitHub notifications
// @namespace    http://tampermonkey.net/
// @version      v1.0.0
// @description  GitHub notifications are overwhelming in large organizations with 100+ repositories.
// @author       mxt-mischa
// @match        https://github.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @license      AGPL-3.0
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/530436/No%20more%20GitHub%20notifications.user.js
// @updateURL https://update.greasyfork.org/scripts/530436/No%20more%20GitHub%20notifications.meta.js
// ==/UserScript==

const css = `
notification-indicator {
  display: none !important;
}
`;

GM_addStyle(css);
