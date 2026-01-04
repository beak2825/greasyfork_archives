// ==UserScript==
// @name         Codeforces show contestId
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在每场比赛名称的前面添加一个比赛Id的超链接，指向这场比赛。
// @author       Tanphoon
// @match        https://codeforces.com/contests
// @icon         https://www.google.com/s2/favicons?sz=64&domain=codeforces.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/468908/Codeforces%20show%20contestId.user.js
// @updateURL https://update.greasyfork.org/scripts/468908/Codeforces%20show%20contestId.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let CurrentContests = document.querySelector("#pageContent > div.contestList > div.datatable > div:nth-child(6) > table > tbody");
    let PastContests = document.querySelector("#pageContent > div.contestList > div.contests-table > div.datatable > div:nth-child(6) > table > tbody");


    function AddContestId(table) {
        for (let i = 0; i < table.rows.length; i++) {
            let curRow = table.rows[i];
            let newCell = curRow.insertCell(0);
            let Id  = curRow.getAttribute('data-contestid');
            if (i & 1)
                newCell.setAttribute("class", "dark");
            if (i == 0) {
                newCell.innerHTML = 'ContestId';
            } else {
                newCell.innerHTML = `<a href = "https://codeforces.com/contests/${Id}" target = "_blank">${Id}</a>`;
            }
        }

    }

    AddContestId(CurrentContests);
    AddContestId(PastContests);
})();