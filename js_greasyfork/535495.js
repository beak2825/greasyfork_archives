// ==UserScript==
// @name         Youtube Hide Recomended (English)
// @name:ja YouTubeのリコメンド自動切換・非表示（英語環境用）
// @version      2025-06-06
// @description Automatically switches YouTube's recommendation column to either "From the series", "from (channel name)", or "Related"
// @description:ja YouTubeのリコメンド欄を自動でFrom the series、from (チャンネル名)、Relatedのどれかに切り替えます
// @author       hirhirbyrd
// @match        https://www.youtube.com/*
 // @license MIT
// @namespace https://greasyfork.org/users/1467931
// @downloadURL https://update.greasyfork.org/scripts/535495/Youtube%20Hide%20Recomended%20%28English%29.user.js
// @updateURL https://update.greasyfork.org/scripts/535495/Youtube%20Hide%20Recomended%20%28English%29.meta.js
// ==/UserScript==

(function() {
    'use strict';


   const observer = new MutationObserver(() => {

    const chname = document.querySelector('.complex-string.ytd-channel-name.style-scope')
    const lists = document.querySelector('div#secondary-inner.style-scope.ytd-watch-flexy');

    const elementC = document.querySelector('div#related iron-selector#chips yt-chip-cloud-chip-renderer:has(#text[title="From the series"])').querySelector('button');
    const elementA = document.querySelector('div#related iron-selector#chips yt-chip-cloud-chip-renderer:has(#text[title="From ' + chname.textContent + '"])').querySelector('button');
    const elementB = document.querySelector('div#related iron-selector#chips yt-chip-cloud-chip-renderer:has(#text[title="Related"])').querySelector('button');


          if (elementC) {
        if (elementC.getAttribute('aria-selected') === 'false') {
        lists.hidden = false;
            elementC.click();
        }
    } else if (elementA) {
        if (elementA.getAttribute('aria-selected') === 'false') {
        lists.hidden = false;
            elementA.click();
        }
    } else if (elementB) {
        if (elementB.getAttribute('aria-selected') === 'false') {
        lists.hidden = false;
            elementB.click();
        }
    } else {
        lists.hidden = true;
        return;
    }


});

observer.observe(document, { childList: true, subtree: true });
})();