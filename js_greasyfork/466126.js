// ==UserScript==
// @name         CodeCombat Match Highlighter
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  扣哒世界竞技场对局记录优化显示
// @author       younglet
// @license      MIT
// @match        https://koudashijie.com/play/ladder/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=koudashijie.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466126/CodeCombat%20Match%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/466126/CodeCombat%20Match%20Highlighter.meta.js
// ==/UserScript==

(function () {
    'use strict';
    function hack() {
        const userName = document.querySelector('h5').textContent;
        const table = document.querySelector('.my-matches-table');
        const trElements = table.querySelectorAll('tr[title]');
        const ladderTable = document.querySelector('.ladder-table tbody');

        let userRank = null
        for (let i = 0; i < ladderTable.children.length; i++) {
            const row = ladderTable.children[i];
            if (row.children[2].textContent.trim() === userName) {
                userRank = row.children[1].textContent.trim();
                break;
            }
        }
        trElements.forEach((tr) => {
            const tdElements = tr.children;
            const playerName = tdElements[2].textContent;

            let playerRank = null;
            for (let i = 0; i < ladderTable.children.length; i++) {
                const row = ladderTable.children[i];
                if (row.children[2].textContent.trim() === playerName) {
                    playerRank = row.children[1].textContent.trim();


                    break;
                }
            }
            tdElements[1].style = ''
            tdElements[1].classList = []

            let prefix = null
            if (playerRank) {
                prefix = '[' + playerRank + ']'
            }
            tdElements[1].textContent = prefix

            if (playerRank) {
                let distance = userRank - playerRank
                if (tdElements[0].textContent.trim() == '胜利' && distance > 0) {
                    tr.style.backgroundColor = 'lightgreen'
                }
                if (tdElements[0].textContent.trim() == '失败' && distance < 0) {
                    tr.style.backgroundColor = 'lightpink'
                }
            }
        });



    }

    setInterval(hack, 100)
})();