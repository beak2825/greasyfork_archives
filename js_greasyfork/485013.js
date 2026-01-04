// ==UserScript==
// @name         real lb script
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Shows the records Apex is hiding from you
// @author       lolol__
// @match        zombia.io
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zombia.io
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485013/real%20lb%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/485013/real%20lb%20script.meta.js
// ==/UserScript==
alert("This script is no longer needed, as Apex has made all time work for all versions now.");
document.querySelectorAll("select")[2].innerHTML = `<option value="24h">Today</option><option value="7d">This Week</option><option value="all">This Version</option><option value="real">All Time</option>`;
function getRealLb() {
    let currentVersion = "110";
    let versions = 0;
    let lbData = [];
    let totalLbData = [];
    function getCurrentVersion(type = "wave") {
        if (currentVersion !== document.querySelectorAll("p")[2].innerText[8] + document.querySelectorAll("p")[2].innerText[10] + document.querySelectorAll("p")[2].innerText[12]) {
            fetch(`http://zombia.io/leaderboard/data?category=${type}&time=all&version=${currentVersion[0]}.${currentVersion[1]}.${currentVersion[2]}`).then(e => e.text()).then(e => {
                currentVersion = JSON.stringify(++currentVersion);
                lbData.push(JSON.parse(e));
                getCurrentVersion(type);
            });
        } else {
            fetch(`http://zombia.io/leaderboard/data?category=${type}&time=all`).then(e => e.text()).then(e => {
                lbData.push(JSON.parse(e));
                for (let x = 0; x < lbData.length; x++) {
                    for (let y = 0; y < 10; y++) {
                        totalLbData.push(lbData[x][y])
                        totalLbData.sort((a, b) => b[type] - a[type]);
                    }
                }
                lbData = [];
                for (let i = 0; i < 10; i++) lbData.push(totalLbData[i]);
                for (let x = 0; x < lbData.length; x++) {
                    let text = "";
                    let count = -1;
                    for (let y = 0; y < lbData[x].players.length; y++) {
                        ++count < lbData[x].players.length - 1 ? (count < lbData[x].players.length - 2 ? text += `${lbData[x].players[count]}, ` : text += `${lbData[x].players[count]} and `) : text += lbData[x].players[count];
                        x < 10 && (document.getElementsByClassName("hud-intro-leaderboard-result")[x].innerHTML = `<strong style="float: left; font-style: italic;">${x + 1}</strong><div>${text} — <strong>${lbData[x][type].toLocaleString()}</strong></div>`);
                    }
                }
            });
        }
    }
getCurrentVersion(document.querySelectorAll("select")[1].value);
}
let run = false;
setInterval(() => {
    if (document.querySelectorAll("select")[2].value == "real") {
        if (!run) {
            run = true;
            getRealLb();
        }
    } else {
        if (run) {
            run = false;
        }
    }
}, 50);