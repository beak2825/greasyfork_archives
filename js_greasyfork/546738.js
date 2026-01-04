// ==UserScript==
// @name         FMP Save Shortlist
// @version      0.2
// @description  Save Shortlist
// @match        https://footballmanagerproject.com/Transfers/TeamBids
// @match        https://www.footballmanagerproject.com/Transfers/TeamBids
// @icon         https://www.google.com/s2/favicons?sz=64&domain=footballmanagerproject.com
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/1304483
// @downloadURL https://update.greasyfork.org/scripts/546738/FMP%20Save%20Shortlist.user.js
// @updateURL https://update.greasyfork.org/scripts/546738/FMP%20Save%20Shortlist.meta.js
// ==/UserScript==

const div = document.getElementById("shortList");
const button = document.createElement("button");
button.className = 'btn btn-primary w-200';
button.textContent = "下载关注名单";
button.addEventListener("click", () => saveShortlist());
div.parentNode.insertBefore(button,div);

function saveShortlist(){
    downloadPlayersData(plList['#shortList']);
}

function downloadPlayersData(players) {
    downloadFile(serializePlayersToCSV(players), "text/csv", buildFileName());
}

function buildFileName() {
  const season = document.getElementById('season-num').textContent;
  const week = document.getElementById('week-num').textContent;
  return `${season}_${week}_shortList.csv`;
}

function serializePlayersToCSV(players) {
    const headers = ['name', 'id', 'nationCode', 'fp', 'rating', 'qi', 'foot', 'years', 'months'];
    let csvContent = headers.join(',') + '\n'; // 表头行
    players.forEach(player => {
        const row = headers.map(header => {
            let value = player[header];
            if (header == 'rating') value=value/10;
            if (value === null || value === undefined) value = '';
            if (typeof value === 'string' && value.includes(',')) {
                value = `"${value}"`; // 用引号包裹包含逗号的字符串
            }
            return value;
        });
        csvContent += row.join(',') + '\n';
    });
    return csvContent;
}


function downloadFile(data, mimeType, fileName) {
  const blob = new Blob([data], { type: mimeType });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}