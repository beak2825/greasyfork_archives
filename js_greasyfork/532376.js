// ==UserScript==
// @name         [Niko] Hide Custom Ranking Ads
// @namespace    http://tampermonkey.net/
// @version      2025.06.06
// @description  2025年版ニコニコ カスタムランキングの広告行を非表示化
// @author       anonymous
// @match        https://www.nicovideo.jp/ranking/custom
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nicovideo.jp
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532376/%5BNiko%5D%20Hide%20Custom%20Ranking%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/532376/%5BNiko%5D%20Hide%20Custom%20Ranking%20Ads.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    function hideAdRow()
    {
        let rows = document.querySelectorAll('.d_flex.gap_x1_5');

        // i=2からランキング行
        for(let i=2; i<rows.length; i++){
            let row = rows[i];
            let rank = row.querySelector('.w_x5')

            if (rank.children.length > 0) {
                //console.log('要素が含まれています');
            } else {

                row.style.display='none'
            }
        }
    }

    //--------------------------------
    hideAdRow();

    // 変化があったらとにかく消す
    const observer = new MutationObserver((mutations) => {
        Array.from(mutations).some((mutation) => {
                Array.from(mutation.addedNodes).some((node) => {
                    hideAdRow();
                });
            });
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();