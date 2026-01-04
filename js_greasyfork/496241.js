// ==UserScript==
// @name         AtCoder Center Your Standing
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Displays the standings page centered around your rank by default in AtCoder contests.
// @author       haruomaki
// @match        https://atcoder.jp/contests/*/standings
// @match        https://atcoder.jp/contests/*/standings/virtual
// @match        https://atcoder.jp/contests/*/results
// @grant        none
// @license      CC0
// @downloadURL https://update.greasyfork.org/scripts/496241/AtCoder%20Center%20Your%20Standing.user.js
// @updateURL https://update.greasyfork.org/scripts/496241/AtCoder%20Center%20Your%20Standing.meta.js
// ==/UserScript==

(function () {
    'use strict';
    /* global vueStandings, vueResults, userScreenName */

    // Configs
    // ---------------------------
    const default_center = true;
    // ---------------------------

    var first_click = false;
    var current_row = null;

    function exists(name) {
        return typeof window[name] !== 'undefined';
    }

    var vue;
    if (exists("vueStandings")) {
        vue = vueStandings;
    } else if (exists("vueResults")) {
        vue = vueResults;
    } else {
        console.error("順位データが読み込めません");
        return;
    }

    function getMyStanding() {
        return document.querySelector("tr.info");
    }

    function myRank(user_id) {
        if (exists("vueStandings")) {
            return vue.orderedStandings.findIndex(data => data.UserScreenName == user_id) + 1;
        }
        if (exists("vueResults")) {
            return vue.orderedResults.findIndex(data => data.UserScreenName == user_id) + 1;
        }
    }

    function clickActivePagination() {
        // ページネーション内のリンク要素を取得
        const linkElement = document.querySelector('.pagination .active a')
        linkElement.click();
    }

    function center_me() {
        if (!first_click) {
            first_click = true;
            clickActivePagination(); // 一度クリックしておかないと、なぜかページ移動が効かない
        }

        const user_id = userScreenName;
        const rank = myRank(user_id); // 存在しなければ0が返る
        if (rank == 0) return;

        const target_page = Math.ceil(rank / vue.perPage);
        console.debug("center me:", { user_id, rank, target_page });
        vue.page = target_page; // これで遷移
    }

    function remakeClickable() {
        if (current_row != null) {
            //console.debug("クリック機能削除:", current_row);
            current_row.removeAttribute('title');
            current_row.removeEventListener('click', center_me);
        }
        const row = getMyStanding();
        if (row == null) return;
        //console.debug("クリック可能にします:", row);
        row.setAttribute('title', 'Click to center your standing');
        row.addEventListener('click', center_me);
        current_row = row;
    }

    function main() {
        // 自身の行をクリックするとページ移動
        remakeClickable();

        // 自順位の行が移動もしくは生成されるたびにremake
        const observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    // 新しいノードが追加された場合
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1 && node.classList.contains('info')) {
                            console.debug('<tr class="info"> が追加されました');
                            remakeClickable();
                        }
                    });
                } else if (mutation.type === 'attributes' && mutation.target.classList.contains('info')) {
                    // 既存のノードにinfoクラスが付与された場合
                    console.debug('<tr> に infoクラスが付与されました');
                    remakeClickable();
                }
            }
        });

        // 監視を開始する
        observer.observe(document.body, { childList: true, attributes: true, attributeFilter: ['class'], subtree: true });

        if (default_center) center_me();
    }

    // 順位表本体が読み込まれるまで待機
    const interval = setInterval(() => {
        if (vue.standings || vue.results) {
            clearInterval(interval);
            main();
        }
    }, 100);
})();
