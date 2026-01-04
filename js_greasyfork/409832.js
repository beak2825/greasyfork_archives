// ==UserScript==
// @name         雷速进球
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  复制进球方，隔4秒后复制对方
// @author       han2ee
// @match        http*://live.leisu.com/
// @grant   GM.getTab
// @grant   GM.saveTab
// @grant GM.setClipboard
// @downloadURL https://update.greasyfork.org/scripts/409832/%E9%9B%B7%E9%80%9F%E8%BF%9B%E7%90%83.user.js
// @updateURL https://update.greasyfork.org/scripts/409832/%E9%9B%B7%E9%80%9F%E8%BF%9B%E7%90%83.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const WAIT_TIME = 4; // 等4秒复制对方
    let lastWinScoreTeam = null;
    let lastLoseScoreTeam = null;

    var wait = ms => new Promise(resolve => setTimeout(resolve, ms));
    function isPromise(obj) {
        return !!obj && ((typeof obj === 'object' && typeof obj.then === 'function') || (typeof obj === 'function' && typeof obj().then === 'function'));
    }
        /**
     * Wait Resource.
     *
     * @param {Function} resourceFn pred function to check resource
     * @param {Object} options
     * @returns Promise
     */
    function waitResource(resourceFn, options) {
        var optionsRes = Object.assign(
            {
                interval: 1000,
                max: 6
            },
            options
        );
        var current = 0;
        return new Promise((resolve, reject) => {
            var timer = setInterval(() => {
                if (isPromise(resourceFn)) {
                    resourceFn().then(res => {
                        if(res) {
                            clearInterval(timer);
                            resolve();
                        }
                    });
                } else if (resourceFn()) {
                    clearInterval(timer);
                    resolve();
                }
                current++;
                if (current >= optionsRes.max) {
                    clearInterval(timer);
                    reject('Time out');
                }
            }, optionsRes.interval);
        });
    }

    async function scoreChange(winScoreTeam, loseScoreTeam) {
        lastWinScoreTeam = winScoreTeam;
        lastLoseScoreTeam = loseScoreTeam;
        document.querySelector('#winInput').value = lastWinScoreTeam;
        document.querySelector('#loseInput').value = lastLoseScoreTeam;
        await GM.setClipboard(lastWinScoreTeam, 'text');
        await wait(WAIT_TIME * 1000);
        await GM.setClipboard(lastLoseScoreTeam, 'text');
        await wait(1000);
    }

    function addUI() {
        let div=document.createElement("div");
        //div.setAttribute("style", "float:right");
        let winInput = document.createElement("INPUT");
        winInput.setAttribute("style", "width:160px");
        winInput.setAttribute("id", "winInput");
        div.appendChild(winInput);

        let winBtn = document.createElement("BUTTON");
        winBtn.innerText = "复制进球方";
        winBtn.setAttribute("id", "winBtn");
        winBtn.onclick = () => {
            const input = document.querySelector('#winInput');
            input.select();
            if (document.execCommand('copy')) {
                console.log('复制成功');
            }
        };
        div.appendChild(winBtn);

        let loseInput = document.createElement("INPUT");
        loseInput.setAttribute("style", "width:160px");
        loseInput.setAttribute("id", "loseInput");
        div.appendChild(loseInput);

        let loseBtn = document.createElement("BUTTON");
        loseBtn.innerText = "复制对方";
        loseBtn.setAttribute("id", "loseBtn");
        loseBtn.onclick = () => {
            const input = document.querySelector('#loseInput');
            input.select();
            if (document.execCommand('copy')) {
                console.log('复制成功');
            }
        };
        div.appendChild(loseBtn);
        let node = document.querySelector('#list-panel');
        let parentNode = node.parentNode;
        parentNode.insertBefore(div, node);
    }

    async function main() {
        await waitResource(async () => {
            return !!document.querySelector('#list-panel');
        });
        addUI();
        while (true) {
            await wait(500);
            let oldGamesObj = await GM.getTab();
            // console.log(`DEBUG: lastWinScoreTeam:${lastWinScoreTeam} lastLoseScoreTeam:${lastLoseScoreTeam}`);
            // console.log(oldGamesObj);
            let gameDivs = document.querySelectorAll('.dd-item');
            if (!gameDivs) {
                continue;
            }
            let gamesObj = {};
            for (let i = 0; i < gameDivs.length; i++) {
                let game = gameDivs[i];
                if (game.classList.contains('dd-notStart-title')) {
                    break;
                }
                if (game.classList.contains('dd-live-title')) {
                    continue;
                }
                let homeName = game.querySelector('.lab-team-home .name').innerText;
                let awayName = game.querySelector('.lab-team-away .name').innerText;
                let scores = game.querySelector('.lab-score .score').innerText.trim().split('-');
                let homeScore = scores[0];
                let awayScore = scores[1];
                let id = `${homeName} VS ${awayName}`;
                gamesObj[id] = {
                    homeName,
                    homeScore,
                    awayName,
                    awayScore,
                };
                if (oldGamesObj[id] && oldGamesObj[id].homeScore !== homeScore) { // home win score
                    await scoreChange(homeName, awayName);
                }
                if (oldGamesObj[id] && oldGamesObj[id].awayScore !== awayScore) { // away win score
                    await scoreChange(awayName, homeName);
                }
                // game.querySelector('.homescore').innerText = homeScore + '1'; // USE for test
            }
            // update games
            await GM.saveTab(gamesObj);
        }
    }
    main()
        .then(() => console.log("Main Done"))
        .catch((err) => {
        console.error(err, "Restart in 6 secs ...");
        setTimeout(() => location.reload(), 6 * 1000);
    });
})();