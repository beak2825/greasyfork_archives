// ==UserScript==
// @name         AtCoder's greatest moment
// @namespace    https://ruku.tellpro.net/
// @version      2025-08-17
// @description  順位表で0完の人に☀️をつけます
// @author       ruku
// @match        https://atcoder.jp/contests/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=atcoder.jp
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546264/AtCoder%27s%20greatest%20moment.user.js
// @updateURL https://update.greasyfork.org/scripts/546264/AtCoder%27s%20greatest%20moment.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function checkZeroSolvers() {
        const rows = document.querySelectorAll('tbody#standings-tbody > tr');

        rows.forEach(tr => {
            const firstResult = tr.querySelector('td.standings-result');
            const rankCell = tr.querySelector('td.standings-rank');
            const usernameLink = tr.querySelector('.standings-username .username');

            if (firstResult && rankCell && usernameLink) {
                const pElements = firstResult.querySelectorAll('p');

                // 条件: pが1つで、rankCell.innerHTML が "-" でない
                if (pElements.length === 1 && rankCell.innerHTML.trim() !== '-') {
                    // 既に☀️がついていない場合のみ追加
                    if (!usernameLink.querySelector('.sun-emoji')) {
                        const sun = document.createElement('span');
                        sun.textContent = '☀️';
                        sun.className = 'sun-emoji';
                        sun.style.marginLeft = '4px';
                        usernameLink.appendChild(sun);
                    }
                }
            }
        });
    }

    // 1秒ごとに実行
    setInterval(checkZeroSolvers, 1000);

})();
