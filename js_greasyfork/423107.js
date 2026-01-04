/* jshint esversion: 6 */
// ==UserScript==
// @name         Open articles in new tab on Sportsnavi
// @namespace    https://greasyfork.org/ja/users/289387-unagionunagi
// @version      0.1.3
// @description  Sportsnavi でニュース・コラム記事を新しいタブで開く
// @author       unagiOnUnagi
// @match        https://baseball.yahoo.co.jp/*
// @match        https://soccer.yahoo.co.jp/*
// @match        https://keiba.yahoo.co.jp/*
// @match        https://sports.yahoo.co.jp/*
// @exclude      https://sports.yahoo.co.jp/column/detail/*
// @grant        none
// @license      GPL-2.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/423107/Open%20articles%20in%20new%20tab%20on%20Sportsnavi.user.js
// @updateURL https://update.greasyfork.org/scripts/423107/Open%20articles%20in%20new%20tab%20on%20Sportsnavi.meta.js
// ==/UserScript==

function makeOpenInNewTab(target=document.body) {
    // console.log(target);
    for (let a of target.querySelectorAll('a[href*="headlines.yahoo.co.jp"],' +
                                          'a[href*="news.yahoo.co.jp"],' +
                                          'a[href*="sports.yahoo.co.jp/column/detail/"],' +
                                          'a[href*="rdsig.yahoo.co.jp/media/sports/mu/module/"],' +
                                          'a[href*="rdsig.yahoo.co.jp/media/sports/pc/column_module/"]')) {
        if (!a.hasAttribute('target')) {
            a.setAttribute('target', '_blank');
            a.setAttribute('rel', 'noopener noreferrer');
        }
    }
}

(function() {

    if (window.frameElement) return;
    makeOpenInNewTab();

    const observer = new MutationObserver(mutations => {
        // console.log(mutations);
        for (let m of mutations) {
            makeOpenInNewTab(m.target);
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

})();