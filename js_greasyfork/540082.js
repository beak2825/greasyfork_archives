// ==UserScript==
// @name         Bye Cookie Notices
// @namespace    https://entitybtw.ru
// @version      1.0
// @description  Hides annoying cookie banners from the internet
// @author       entitybtw
// @license      MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540082/Bye%20Cookie%20Notices.user.js
// @updateURL https://update.greasyfork.org/scripts/540082/Bye%20Cookie%20Notices.meta.js
// ==/UserScript==

(function () {
    const style = document.createElement('style');
    style.textContent = `
        [id*="cookie"], [class*="cookie"], [class*="consent"], [id*="consent"] {
            display: none !important;
        }
    `;
    document.head.appendChild(style);
})();
