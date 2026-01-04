// ==UserScript==
// @name         TradingView Search fix
// @version      0.1
// @description  TradingView search fix name
// @license      MIT
// @homepageURL  https://github.com/willy67k/tampermonkey-userscripts
// @homepage     https://github.com/willy67k/tampermonkey-userscripts
// @source       https://github.com/willy67k/tampermonkey-userscripts/raw/master/src/tradingView-search-fix.js
// @namespace    https://github.com/willy67k/tampermonkey-userscripts/raw/master/src/tradingView-search-fix.js
// @author       Lilp
// @match        https://tw.tradingview.com/chart/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tradingview.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518712/TradingView%20Search%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/518712/TradingView%20Search%20fix.meta.js
// ==/UserScript==

(function () {
    "use strict";
    window.addEventListener("click", (e) => {
        if (e.target.id === "header-toolbar-symbol-search" || e.target.classList.contains("js-button-text")) {
            setTimeout(() => {
                const input = document.querySelector("input.search-ZXzPWcCf");
                input.focus();
                input.value = "usdt.p";
                input.setSelectionRange(0, 0);
            }, 100);
        }
    });
})();
