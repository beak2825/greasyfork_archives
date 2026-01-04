// ==UserScript==
// @name         AtCoder Customize Panel Fix
// @namespace    https://fuwa.dev/
// @version      0.1
// @description  keep customize panel open when reloading standings page
// @author       ibuki2003
// @match        https://atcoder.jp/contests/*/standings
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511359/AtCoder%20Customize%20Panel%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/511359/AtCoder%20Customize%20Panel%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const observer = new MutationObserver(function (mutations) {
        if (document.querySelector('#standings-panel-heading form') !== null) { // search for panel element
            observer.disconnect(); // only once
            console.table(mutations);
            // const v = vueStandings.filterPanelActive; // last state
            const v = true; // always open

            vueStandings.filterPanelActive = !v;
            vueStandings.$nextTick(() => { // update later
                vueStandings.filterPanelActive = v;
            });
            console.log(v);
        }
    });

    observer.observe(vueStandings.$el, {
        childList: true,
        subtree: true
    });
})();
