// ==UserScript==
// @name         Gmail Unsubscribe
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Unsubscribe by pressing \
// @author       Maros Hluska
// @homepage     https://mhluska.com
// @match        https://mail.google.com/*
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426927/Gmail%20Unsubscribe.user.js
// @updateURL https://update.greasyfork.org/scripts/426927/Gmail%20Unsubscribe.meta.js
// ==/UserScript==

function unsubscribe(event) {
    if (event.key !== "\\") {
        return;
    }

    const link = Array.from(document.querySelectorAll('[role="link"]')).find(node => node.innerText === 'Unsubscribe')
    if (!link) {
      return;
    }

    link.click();
    Array.from(document.querySelectorAll('button')).find(node => node.innerText === 'Unsubscribe').click();
}

(function() {
    'use strict';

    document.addEventListener('keypress', unsubscribe);
})();