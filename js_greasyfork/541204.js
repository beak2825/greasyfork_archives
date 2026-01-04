// ==UserScript==
// @name         Google Smart Lock Blocker
// @name:ru      Блокировка окна Google Smart Lock
// @namespace    https://greasyfork.org/users/your-username
// @version      1.0
// @description  Blocks the Google Smart Lock popup (credentials-picker-container) from appearing.
// @description:ru Удаляет всплывающее окно входа Google Smart Lock (credentials-picker-container).
// @author       Anonymous
// @license      MIT
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/541204/Google%20Smart%20Lock%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/541204/Google%20Smart%20Lock%20Blocker.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const hidePopup = () => {
        const el = document.getElementById('credentials-picker-container');
        if (el) {
            el.remove();
            console.info('[Smart Lock Blocker] Удалено окно Google Smart Lock.');
        }
    };

    const observer = new MutationObserver(hidePopup);
    observer.observe(document.documentElement, { childList: true, subtree: true });

    hidePopup();
})();
