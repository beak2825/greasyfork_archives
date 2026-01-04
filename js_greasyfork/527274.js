// ==UserScript==
// @name         OnlyFans 自動跳轉 Coomer
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  自動在 Coomer 搜尋 OnlyFans 創作者
// @match        *://onlyfans.com/*
// @author       h1n1zn9
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527274/OnlyFans%20%E8%87%AA%E5%8B%95%E8%B7%B3%E8%BD%89%20Coomer.user.js
// @updateURL https://update.greasyfork.org/scripts/527274/OnlyFans%20%E8%87%AA%E5%8B%95%E8%B7%B3%E8%BD%89%20Coomer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const openCoomer = () => {
        let username = location.pathname.split("/")[1];
        if (username && !sessionStorage.getItem(`coomer-${username}`)) {
            sessionStorage.setItem(`coomer-${username}`, "true");
            window.open(`https://coomer.su/onlyfans/user/${username}`, '_blank');
        }
    };
    new MutationObserver(() => setTimeout(openCoomer, 1000)).observe(document, { childList: true, subtree: true });
    setTimeout(openCoomer, 2000);
})();
