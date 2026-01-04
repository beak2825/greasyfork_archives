// ==UserScript==
// @name         Обход linkfilter в Steam
// @namespace    bypass_steam_linkfilter
// @version      1.1
// @description  Обход подтверждения перехода по ссылке в форуме Steam
// @author       AlexStank
// @match        https://store.steampowered.com/*
// @match        https://steamcommunity.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410743/%D0%9E%D0%B1%D1%85%D0%BE%D0%B4%20linkfilter%20%D0%B2%20Steam.user.js
// @updateURL https://update.greasyfork.org/scripts/410743/%D0%9E%D0%B1%D1%85%D0%BE%D0%B4%20linkfilter%20%D0%B2%20Steam.meta.js
// ==/UserScript==

(function() {
    let links = document.getElementsByClassName(`${(document.location.href.includes('store')) ? 'linkbar' : 'bb_link'}`);
    for (let link of links) {
        if (link.href.includes('linkfilter')) link.href = link.href.split('?url=').pop();
    }
})();