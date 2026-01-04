// ==UserScript==
// @name         Steam - Old Auth
// @namespace    whatever
// @version      1.1
// @description  none
// @author       You
// @match        https://steamcommunity.com/login*
// @match        https://store.steampowered.com/login*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/453062/Steam%20-%20Old%20Auth.user.js
// @updateURL https://update.greasyfork.org/scripts/453062/Steam%20-%20Old%20Auth.meta.js
// ==/UserScript==

(function() {
    "use strict";
    let url = new URL(window.location.href);

    if (url.searchParams.has("oldauth")) {
        return;
    }

    switch (url.pathname) {
        case '/login/home/':
        case '/login/home':
        case '/login/':
        case '/login':
            url.searchParams.set("oldauth", "1");
            window.location.replace(url);
            break;

        default:
            break;
    }
})();