// ==UserScript==
// @name         maimaidx score filter
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  try to take over the world!
// @author       You
// @match        https://maimaidx.jp/maimai-mobile/record/musicGenre*
// @match        https://maimaidx.jp/maimai-mobile/record/musicWord*
// @match        https://maimaidx.jp/maimai-mobile/record/musicLevel*
// @match        https://maimaidx.jp/maimai-mobile/record/musicVersion*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/409682/maimaidx%20score%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/409682/maimaidx%20score%20filter.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function() {
    "use strict";

    const tableElem = document.querySelector(".music_scorelist_table");
    const rankRowElem = tableElem.querySelector("tr");
    const rankTexts = tableElem.querySelector("tr:nth-of-type(4)") ?
        Array.from(tableElem.querySelectorAll("tr:first-of-type td, tr:nth-of-type(2) td:nth-of-type(n+4)"), e => e.textContent) :
        Array.from(tableElem.querySelectorAll("tr:first-of-type td:nth-of-type(n+2), tr:nth-of-type(2) td:nth-of-type(n+3):nth-of-type(-n+4)"), e => e.textContent);
    const total = parseInt(rankTexts[0].match(/\d+\/(\d+)/)[1], 10);
    const r = rankTexts.map(i => 100 * (total - parseInt(i, 10)) / total);
    rankRowElem.style.background = `no-repeat bottom/100% 15.625% linear-gradient(to right,
        #FFFFFF ${r[0]}%,
        #45CDFF ${r[0]}%, #45CDFF ${r[1]}%,
        #7EFA0F ${r[1]}%, #7EFA0F ${r[2]}%,
        #FFEA00 ${r[2]}%, #FFEA00 ${r[3]}%,
        #FF3939 ${r[3]}%, #FF3939 ${r[4]}%,
        #E260FF ${r[4]}%, #E260FF ${r[5]}%,
        #ECA22D ${r[5]}%, #CF651C ${r[6]}%,
        #D1D4E5 ${r[6]}%, #8B93BD ${r[7]}%,
        #E2A23A ${r[7]}%, #B66524 ${r[8]}%,
        #B2D2FC ${r[8]}%, #6F8EF7 100%
    )`;
    const formElems = document.querySelectorAll("form[action='https://maimaidx.jp/maimai-mobile/record/musicDetail/']");
    rankRowElem.querySelectorAll("td:nth-of-type(n+2) img").forEach((e, i) => {
        e.style.cursor = "pointer";
        e.addEventListener("click", _ => {
            formElems.forEach(e2 => {
                const rankImgElem = e2.querySelector("img + img:last-of-type");
                e2.closest(".f_0").style.display = (i === 0 || rankImgElem && e.src.startsWith(rankImgElem.src)) ? "" : "none";
            });
            rankRowElem.querySelectorAll("td:nth-of-type(n+2) img").forEach((e2, i2) => {
                if (i2 === 0) { return; }
                e2.style.background = (i2 === i) ? "linear-gradient(transparent 55%, #FFE839 45%)" : "";
            });
        }, false);
    });
})();
