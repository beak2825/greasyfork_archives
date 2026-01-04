// ==UserScript==
// @name         Hide Reddit "install app" notifications
// @namespace    http://greasyfork.org
// @version      1.1
// @description  Hides the naggling notifications to install Reddit app on mobile devices.
// @author       yojc
// @match        https://www.reddit.com/*
// @match        https://reddit.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/456374/Hide%20Reddit%20%22install%20app%22%20notifications.user.js
// @updateURL https://update.greasyfork.org/scripts/456374/Hide%20Reddit%20%22install%20app%22%20notifications.meta.js
// ==/UserScript==

(function() {
    const localStorageItems = ["xpromo-consolidation", "bannerLastClosed"];
    const stylesheet = `
    .XPromoPopup, .XPromoBottomBar, .TopNav__promoButton, slot[name=use-app], shreddit-async-loader[bundlename=bottom_bar_xpromo] {
        display: none;
    }
    `;

    function setLocalStorageItems() {
        for (const item of localStorageItems) {
            localStorage.setItem(item, new Date().toString());
        }
    }

    function appendStylesheet() {
        const head = document.getElementsByTagName("head")[0];
        const s = document.createElement("style");
        s.setAttribute("type", "text/css");
        s.appendChild(document.createTextNode(stylesheet));
        head.appendChild(s);
    }

    setLocalStorageItems();
    setInterval(setLocalStorageItems, 300000);

    document.addEventListener ("DOMContentLoaded", appendStylesheet);
})();