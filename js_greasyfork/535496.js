// ==UserScript==
// @name        YouTubeのリコメンド自動切換・非表示 日本語環境用
// @version      2025-06-06
// @description YouTubeのリコメンド欄を自動でFrom the series、from (チャンネル名)、Relatedのどれかに切り替えます
// @author       hirhirbyrd
// @match        https://www.youtube.com/*
 // @license MIT
// @namespace https://greasyfork.org/users/1467931
// @downloadURL https://update.greasyfork.org/scripts/535496/YouTube%E3%81%AE%E3%83%AA%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%89%E8%87%AA%E5%8B%95%E5%88%87%E6%8F%9B%E3%83%BB%E9%9D%9E%E8%A1%A8%E7%A4%BA%20%E6%97%A5%E6%9C%AC%E8%AA%9E%E7%92%B0%E5%A2%83%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/535496/YouTube%E3%81%AE%E3%83%AA%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%89%E8%87%AA%E5%8B%95%E5%88%87%E6%8F%9B%E3%83%BB%E9%9D%9E%E8%A1%A8%E7%A4%BA%20%E6%97%A5%E6%9C%AC%E8%AA%9E%E7%92%B0%E5%A2%83%E7%94%A8.meta.js
// ==/UserScript==
(function() {
    'use strict';


   const observer = new MutationObserver(() => {

    const chname = document.querySelector('.complex-string.ytd-channel-name.style-scope')
    const lists = document.querySelector('div#secondary-inner.style-scope.ytd-watch-flexy');

    const elementC = document.querySelector('div#related iron-selector#chips yt-chip-cloud-chip-renderer:has(#text[title="シリーズの動画"])').querySelector('button');
    const elementA = document.querySelector('div#related iron-selector#chips yt-chip-cloud-chip-renderer:has(#text[title="提供: ' + chname.textContent + '"])').querySelector('button');
    const elementB = document.querySelector('div#related iron-selector#chips yt-chip-cloud-chip-renderer:has(#text[title="関連動画"])').querySelector('button');



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