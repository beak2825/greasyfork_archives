// ==UserScript==
// @name         AtCoder-RedirectRecentABC
// @namespace    https://github.com/PenguinCabinet
// @version      v0.0.1
// @description  The tools to redirect the recent AtCoder Beginner Contest.
// @author       PenguinCabinet
// @license      MIT
// @match        https://atcoder.jp/contests*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/508772/AtCoder-RedirectRecentABC.user.js
// @updateURL https://update.greasyfork.org/scripts/508772/AtCoder-RedirectRecentABC.meta.js
// ==/UserScript==

//config
//config

async function Newest_N(elem_id1, elem_id2) {
    const r = /AtCoder Beginner Contest ([1-9][0-9]*)/g;

    const contests_HTML_text = await (await fetch("https://atcoder.jp/contests/")).text();
    const doc = new DOMParser().parseFromString(contests_HTML_text, "text/html");
    let elem = doc.getElementById(elem_id1);
    if (!elem) {
        elem = doc.getElementById(elem_id2);
    }
    const text = elem.outerHTML;
    const ABC_texts = [...text.matchAll(r)];
    const Numbers = ABC_texts.map((e) => parseInt(e[1]));

    return Math.min.apply(null, Numbers);
}

(async function () {
    'use strict';

    let urlHash = location.hash;
    if (urlHash) {
        const r = /#recent_abc((\-|\+)[1-9][0-9]*)?/;
        const result = urlHash.match(r);
        if (result != null) {
            let Ans = await Newest_N("contest-table-action", "contest-table-upcoming");

            let diff = result[1];
            if (diff === undefined) diff = 0;
            diff = parseInt(diff, 10);

            if (Ans != null) {
                window.location.replace(`https://atcoder.jp/contests/abc${Ans + diff}`);
            }
        }
    }
    // Your code here...
})();