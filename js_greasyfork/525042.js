// ==UserScript==
// @name         KHL - GK HS
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Add GKs to playerstatstable
// @author       Jarda
// @match        https://text.khl.ru/en/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=khl.ru
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/525042/KHL%20-%20GK%20HS.user.js
// @updateURL https://update.greasyfork.org/scripts/525042/KHL%20-%20GK%20HS.meta.js
// ==/UserScript==
 
(function() {
 
    setTimeout(() => {
        const homeGKs = [...document.querySelectorAll('.compositions-wrap')[0].querySelectorAll('.compositions-item__info .player-name.color-primary')].map(gk => {
            return gk.textContent.trim()
        })
        const awayGKs = [...document.querySelectorAll('.compositions-wrap')[1].querySelectorAll('.compositions-item__info .player-name.color-primary')].map(gk => {
            return gk.textContent.trim()
        })
        const allGKS = [...homeGKs, ...awayGKs]
 
        const homeSubGK = [...document.querySelectorAll('.compositions-wrap')[0].querySelectorAll('.compositions-item__info .player-name.color-secondary')].map(gk => {
            return gk.textContent.trim()
        })
        const awaySubGK = [...document.querySelectorAll('.compositions-wrap')[1].querySelectorAll('.compositions-item__info .player-name.color-secondary')].map(gk => {
            return gk.textContent.trim()
        })
        const allSubGK = [...homeSubGK, ...awaySubGK]
 
        const score = document.querySelector('.preview-frame__center-score').innerText;
        const homeScore = parseInt(score.match(/\d+/)[0]);
        const awayScore = parseInt(score.match(/\n(\d+)/)[1]);
 
        const table = document.querySelector('#DataTables_Table_0 tbody')
 
        const firstPeriodTOI = document.querySelectorAll(".textBroadcast-statistics__table [data-period='1'] .game-legend-item-info-time")[1]?.innerText.trim();
        const secondPeriodTOI = document.querySelectorAll(".textBroadcast-statistics__table [data-period='2'] .game-legend-item-info-time")[1]?.innerText.trim();
        const thirdPeriodTOI = document.querySelectorAll(".textBroadcast-statistics__table [data-period='3'] .game-legend-item-info-time")[1]?.innerText.trim();
        const extraTimeTOI = document.querySelectorAll(".textBroadcast-statistics__table [data-period='4'] .game-legend-item-info-time")[1]?.innerText.trim();
        const timeOnIce = [firstPeriodTOI, secondPeriodTOI, thirdPeriodTOI, extraTimeTOI];
        const filteredTimeOnIce = timeOnIce.filter(Boolean);
        const maxTime = Math.max(...filteredTimeOnIce.map(time => {
            const [minutes, seconds] = time.split(':').map(Number);
            return minutes * 60 + seconds;
        }));
        const roundedMinutes = Math.ceil(maxTime / 60);
        const maxTimeOnIceFormatted = `${String(roundedMinutes).padStart(2, '0')}:00`;
 
        const shots = document.querySelector('.table-ftf__info-item .with-shots-map')?.textContent.trim() || "0-0";
        const homeShots = parseInt(shots.match(/\d+/)[0])
        const awayShots = parseInt(shots.match(/\d+$/)[0])
 
        const awaySavesPercentage = homeShots > 0 ? ((1 - homeScore / homeShots) * 100).toFixed(2) : 0;
        const homeSavesPercentage = awayShots > 0 ? ((1 - awayScore / awayShots) * 100).toFixed(2) : 0;
 
        const xpathResult = document.evaluate(
            '//p[contains(., "Goalkeeper:")]//a',
            document,
            null,
            XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
            null
        );
        const startingGKs = [];
        for (let i = 0; i < xpathResult.snapshotLength; i++) {
            const node = xpathResult.snapshotItem(i);
 
            let text = node.textContent.trim();
 
            text = text.replace(/^[0-9]+\.\s*/, '');
 
            startingGKs.push(text);
        }
 
        function normalizeString(str) {
            return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        }
 
        function addGoalkeepers(gk, isSubstitute) {
            let newRow = table.insertRow();
            newRow.id = gk;
 
            let savesCell = newRow.insertCell(0);
            let nameCell = newRow.insertCell(1);
            let savesPercentageCell = newRow.insertCell(2);
 
            if (isSubstitute || !startingGKs.includes(normalizeString(gk))) {
                savesCell.textContent = 0;
                savesCell.setAttribute('data-statname', "saves");
            }
            else if (homeGKs.includes(gk) && startingGKs.includes(normalizeString(gk))) {
                savesCell.textContent = awayShots - awayScore;
                savesCell.setAttribute('data-statname', "saves");
 
                savesPercentageCell.textContent = homeSavesPercentage;
                savesPercentageCell.setAttribute('data-statname', "sp");
            } else if (awayGKs.includes(gk) && startingGKs.includes(normalizeString(gk))) {
                savesCell.textContent = homeShots - homeScore;
                savesCell.setAttribute('data-statname', "saves");
 
                savesPercentageCell.textContent = awaySavesPercentage;
                savesPercentageCell.setAttribute('data-statname', "sp");
            }
 
            nameCell.textContent = gk;
            nameCell.setAttribute('data-order', gk);
 
            for (let i = 3; i < 16; i++) {
                if (i === 14) {
                    let toiCell = newRow.insertCell(i);
                    toiCell.textContent = isSubstitute || !startingGKs.includes(normalizeString(gk)) ? "-" : maxTimeOnIceFormatted;
                } else {
                    newRow.insertCell(i)
                }
            }
 
        }
 
        function showCompletionMessage() {
            const header = document.querySelector(".preview-header");
            if (!header) return;
 
            const message = document.createElement("div");
            message.textContent = "✅ Skript dokončen -> Můžeme přidat HS včetně gólmanů";
            message.style.background = "rgba(0, 128, 0, 0.8)";
            message.style.color = "white";
            message.style.padding = "5px 10px";
            message.style.borderRadius = "5px";
            message.style.fontSize = "14px";
            message.style.marginBottom = "10px";
            message.style.display = "block";
            message.style.textAlign = "center";
 
            header.prepend(message);
        }
 
        for (let gk of allGKS) {
            addGoalkeepers(gk, false);
        }
 
        for (let gk of allSubGK) {
            addGoalkeepers(gk, true);
        }
 
        showCompletionMessage();
 
    }, 1000);
})();