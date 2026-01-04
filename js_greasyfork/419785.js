/* jshint esversion: 6 */
// ==UserScript==
// @name         Reference Tooltips for NicoNicoPedia
// @namespace    https://greasyfork.org/ja/users/289387-unagionunagi
// @version      0.3
// @description  ニコニコ大百科記事の脚注リンクに内容をポップアップ表示します
// @author       unagiOnUnagi
// @match        *://dic.nicovideo.jp/*
// @grant        none
// @license      GPL-2.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/419785/Reference%20Tooltips%20for%20NicoNicoPedia.user.js
// @updateURL https://update.greasyfork.org/scripts/419785/Reference%20Tooltips%20for%20NicoNicoPedia.meta.js
// ==/UserScript==

(function() {
    'use strict';
    for (let ref of document.querySelectorAll('#article a[class="dic"][href^="#"]:not([title])')) {
        let cite;
        let href = ref.getAttribute('href');
        let refid = href.match(/#((?:%5E)?\d+)/i);
        if (refid) {
            refid = decodeURIComponent(refid[1]);
            cite = document.querySelector(`a[name="${refid}"]`);
        } else {
            cite = document.querySelector(href);
        }

        if (!cite) {
            console.log(`Reference Tooltips for NicoNicoPedia: unknown reference (${href})`);
            continue;
        }
        ref.title = cite.parentNode.innerText.trim().replace(/\s+/g, ' ');
    }
})();