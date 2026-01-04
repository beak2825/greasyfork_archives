// ==UserScript==
// @name         PornHub NoSubscribeRefresh
// @namespace    PHNoSubscribeRefresh
// @version      1.1.0
// @description  PornHub No Subscribe Refresh
// @author       Runterya
// @homepage     https://github.com/Runteryaa
// @match        *://*.pornhub.com/*
// @match        *://*.pornhubpremium.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pornhub.com
// @grant        none
// @license      MIT
// @compatible   chrome
// @compatible   edge
// @compatible   firefox
// @compatible   opera
// @compatible   safari
// @downloadURL https://update.greasyfork.org/scripts/488211/PornHub%20NoSubscribeRefresh.user.js
// @updateURL https://update.greasyfork.org/scripts/488211/PornHub%20NoSubscribeRefresh.meta.js
// ==/UserScript==

console.log("PHNoSubscribeRefresh")

window.addEventListener('load', () => {
    function checkAndUpdateRefreshStatus() {
        var elements = document.querySelectorAll('[data-refresh="1"]');

        elements.forEach(function(element) {
            element.setAttribute('data-refresh', '0');
        });
    }

    checkAndUpdateRefreshStatus()
    setInterval(checkAndUpdateRefreshStatus, 1000);
});