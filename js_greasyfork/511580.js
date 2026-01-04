// ==UserScript==
// @name         AtCoder - You're top X% (only for algorithm ranking)
// @namespace    https://gist.github.com/k1832/9438a1469bb2fa94d26702e1556aff97
// @version      1.2
// @description  Displays your approximate ranking percentile among all active AtCoder users on your profile page.
// @author       k1832 (Keita Morisaki)
// @match        https://atcoder.jp/users/*
// @license      MIT License, Copyright (c) 2024 Keita Morisaki
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/511580/AtCoder%20-%20You%27re%20top%20X%25%20%28only%20for%20algorithm%20ranking%29.user.js
// @updateURL https://update.greasyfork.org/scripts/511580/AtCoder%20-%20You%27re%20top%20X%25%20%28only%20for%20algorithm%20ranking%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const url = new URL(window.location.href);
    const contestType = url.searchParams.get('contestType');

    if (contestType === 'algo' || contestType === null) {
        /*
         * EN: Fetch the total number of active AtCoder users from a JSON file hosted on GitHub.
         * JA: GitHub でホストされている JSON ファイルから、AtCoder のアクティブユーザーの総数を取得します。
         *
         * API implementation/host: https://github.com/k1832/atcoder-api
         */
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://k1832.github.io/atcoder-api/api/v1/total-active-users.json",
            onload: function (response) {
                const data = JSON.parse(response.responseText);
                const totalCount = data.val;

                let rankNode = document.evaluate(
                    '//th[text()="順位" or text()="Rank"]/following-sibling::td',
                    document,
                    null,
                    XPathResult.ANY_TYPE,
                    null
                ).iterateNext();

                if (!rankNode) {
                    console.error('Ranking element not found.');
                    return;
                }

                const rankText = rankNode.textContent;

                // "8956th" -> 8956
                const rank = parseInt(rankText.slice(0, -2), 10);
                const percentage = rank / totalCount * 100;
                rankNode.textContent += ` (top ${percentage.toFixed(2)}%)`;
            },
            onerror: function (error) {
                console.error('Error fetching user count:', error);
            }
        });
    }
})();
