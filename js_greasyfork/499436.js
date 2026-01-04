// ==UserScript==
// @name         澈日盃自用圖片生成插件
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  None
// @author       Your Name
// @match        https://apexlegendsstatus.com/tournament/results/*
// @match        https://snowagar25.github.io/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/499436/%E6%BE%88%E6%97%A5%E7%9B%83%E8%87%AA%E7%94%A8%E5%9C%96%E7%89%87%E7%94%9F%E6%88%90%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/499436/%E6%BE%88%E6%97%A5%E7%9B%83%E8%87%AA%E7%94%A8%E5%9C%96%E7%89%87%E7%94%9F%E6%88%90%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.location.href.includes('apexlegendsstatus.com/tournament/results')) {
        // Code for apexlegendsstatus.com
        // Create the button
        var button = document.createElement('button');
        button.innerHTML = '圖片生成';
        button.style.padding = '10px';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.float = 'right';
        button.style.margin = '-5px 5px 0px 5px';
        var headerAnchor = document.getElementById('headerAnchor');
        if (headerAnchor) {
            var settingsButton = document.createElement('button');
            headerAnchor.appendChild(button); // 嵌入在 headerAnchor 的最後面
        }


        const getRows = function() {
            let rows = [];
            // 獲取包含所有需要的div的容器
            let exportAnchor = document.getElementById("scoreGridExportAnchor");
            // 獲取所有的div.recapScore，每一個都代表一行
            let recapScores = exportAnchor.querySelectorAll("div.row.g-0.recapScore");

            rows.push(["Rank","Team","Score","Kills"]);

            for (let i = 0; i < recapScores.length; i++) {
                let cells = recapScores[i].children; // 獲取當前行的所有子div（每個div是一個"cell"）
                let row = [];

                // 獲取Rank
                let rank = cells[0].innerText.trim().replace(',', '');
                row.push(rank);

                // 獲取Team
                let team = cells[1].querySelector("p.recapScoreTeamName-team").innerText.trim().replace(',', '');
                row.push(team);

                // 獲取Points
                let points = cells[2].innerText.trim().replace(',', '');
                row.push(points);

                // 獲取Kills
                let kills = cells[3].innerText.trim().replace(',', '');
                row.push(kills);

                rows.push(row); // 將這壹行數據添加到rows數組中
            }
            return rows;
        }

        button.addEventListener('click', function() {
            // Get rows data
            var rows = getRows();
            GM_setValue('rows', rows);
            GM_openInTab('https://snowagar25.github.io/index.html', {active: true});
        });

    } else if (window.location.href.includes('https://snowagar25.github.io/index.html')) {
        // Code for snowagar25.github.io
        var rows = GM_getValue('rows', []);
        var pre = document.getElementById('rowsData');
        if (pre) {
            pre.textContent = vm.matchScoresJson = JSON.stringify(rows).replaceAll('],', '],\n');
        }
    }
})();
