// ==UserScript==
// @name         Wantgoo Single Stock Refresh
// @version      0.2
// @description  Auto Refresh.
// @license      MIT
// @homepageURL  https://github.com/willy67k/tampermonkey-userscripts
// @homepage     https://github.com/willy67k/tampermonkey-userscripts
// @source       https://github.com/willy67k/tampermonkey-userscripts/raw/master/src/wantgoo-single-stock-refresh.js
// @namespace    https://github.com/willy67k/tampermonkey-userscripts/raw/master/src/wantgoo-single-stock-refresh.js
// @author       Lilp
// @match        https://www.wantgoo.com/stock/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wantgoo.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497705/Wantgoo%20Single%20Stock%20Refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/497705/Wantgoo%20Single%20Stock%20Refresh.meta.js
// ==/UserScript==

(function () {
    "use strict";
    window.addEventListener("focus", () => {
        const btn1 = document.querySelector("#refresh");
        if (btn1) btn1.click();
    });
    // Your code here...
})();
