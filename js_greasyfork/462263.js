// ==UserScript==
// @name         Osu! YutangCupS7 Calculator
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  osu鱼塘杯专用计分器
// @author       Kaguya_1096
// @match        https://osu.ppy.sh/community/matches/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=osu.ppy.sh
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/462263/Osu%21%20YutangCupS7%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/462263/Osu%21%20YutangCupS7%20Calculator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const A = "兩碟腸粉", B = "U149", C = "†克门†", D = "happy cat", E = "Apex after this", F = "Down syndrome'player", G = "紫砂成功哦耶", H = "G8 dog";
    const playerData = {
        "2165650": { team: A, T: 0 },
        "5413624": { team: A, T: 0 },
        "14569713": { team: A, T: 1 },
        "3016611": { team: A, T: 1 },
        "9767342": { team: A, T: 2 },
        "14386088": { team: A, T: 2 },
        "3339073": { team: A, T: 3 },
        "13291701": { team: A, T: 3 },
        "11375105": { team: B, T: 0 },
        "3139364": { team: B, T: 0 },
        "1285637": { team: B, T: 1 },
        "15030466": { team: B, T: 1 },
        "4075655": { team: B, T: 2 },
        "3635214": { team: B, T: 2 },
        "8192004": { team: B, T: 3 },
        "6938658": { team: B, T: 3 },
        "1646397": { team: C, T: 0 },
        "6752520": { team: C, T: 0 },
        "12585858": { team: C, T: 1 },
        "2984074": { team: C, T: 1 },
        "11042554": { team: C, T: 2 },
        "1766764": { team: C, T: 2 },
        "5179557": { team: C, T: 3 },
        "874891": { team: C, T: 3 },
        "4896825": { team: D, T: 0 },
        "5242158": { team: D, T: 0 },
        "18224888": { team: D, T: 1 },
        "2317789": { team: D, T: 1 },
        "6433183": { team: D, T: 2 },
        "4464845": { team: D, T: 2 },
        "7083079": { team: D, T: 3 },
        "1775182": { team: D, T: 3 },
        "5791401": { team: E, T: 0 },
        "6090175": { team: E, T: 0 },
        "1355695": { team: E, T: 1 },
        "7839397": { team: E, T: 1 },
        "13617153": { team: E, T: 2 },
        "1855908": { team: E, T: 2 },
        "7175234": { team: E, T: 3 },
        "10500832": { team: E, T: 3 },
        "4857328": { team: F, T: 0 },
        "16227745": { team: F, T: 0 },
        "2200982": { team: F, T: 1 },
        "7172340": { team: F, T: 1 },
        "18296925": { team: F, T: 2 },
        "17663666": { team: F, T: 2 },
        "10625776": { team: F, T: 3 },
        "5936405": { team: F, T: 3 },
        "15816872": { team: G, T: 0 },
        "20461077": { team: G, T: 0 },
        "2351439": { team: G, T: 1 },
        "6338477": { team: G, T: 1 },
        "7403461": { team: G, T: 2 },
        "6386735": { team: G, T: 2 },
        "3094900": { team: G, T: 3 },
        "10636530": { team: G, T: 3 },
        "1712195": { team: H, T: 0 },
        "12585048": { team: H, T: 0 },
        "7660383": { team: H, T: 1 },
        "5341033": { team: H, T: 1 },
        "8893772": { team: H, T: 2 },
        "14726718": { team: H, T: 2 },
        "9984860": { team: H, T: 3 },
        "16375942": { team: H, T: 3 }
    };
    var redTeamScore = 0, blueTeamScore = 0;
    const redColor = "red", blueColor = "DeepSkyBlue";
    var finalScoreTable = {};
    const compareByScore = (r, b) => (b.score - r.score);
    const compareByAcc = (r, b) => (b.acc - r.acc);
    const sum = (total, player) => (player.finalScore + total);
    function getFinalScore(redPlayer, blueTeam, color, rankingMethod) {
        blueTeam.push(redPlayer);
        if(rankingMethod) {
            blueTeam.sort(compareByScore);
        }
        else {
            blueTeam.sort(compareByAcc);
        }
        let rank = blueTeam.indexOf(redPlayer);
        redPlayer.setFinalScore(rank + 1);
        if(rankingMethod && rank < 4 && redPlayer.score > 2 * blueTeam[rank + 1].score && !blueTeam[rank + 1].highScoreFlag) {
            redPlayer.finalScore += 0.5;
            blueTeam[rank + 1].highScoreFlag = true;
        }
        
        blueTeam.splice(rank, 1);
        redPlayer.color = color;
        finalScoreTable[redPlayer.id] = redPlayer;
    }

    window.onload = function() {
        const title = $("h3")[0].innerHTML.replaceAll("（", "(").replaceAll("）", ")");
        const redTeamName = title.slice(title.indexOf("(") + 1, title.indexOf(")"));
        const blueTeamName = title.slice(title.lastIndexOf("(") + 1, title.lastIndexOf(")"));
        var games = $(".mp-history-game__player-scores.mp-history-game__player-scores--no-teams");
        for(let game of games) {
            try {
            let redTeam = [], blueTeam = [];
            let ranking = game.previousSibling.querySelector(".mp-history-game__stats-box").lastChild.innerHTML;
            // 不同语言环境下的判断条件？
            var rankingMethod = ranking == "最高分" || ranking == "Highest Score";
            for(let playerInfo of game.childNodes) {
                var playerId = playerInfo.getElementsByClassName("mp-history-player-score__username")[0].getAttribute("href").split("/").pop();
                var score = playerInfo.getElementsByClassName("mp-history-player-score__stat-number mp-history-player-score__stat-number--large")[0].innerHTML.replace(/,/g, "");
                if(score == 0 || playerData[playerId] == null) continue;
                var acc = playerInfo.getElementsByClassName("mp-history-player-score__stat mp-history-player-score__stat--accuracy")[0].lastChild.innerHTML.replace("%", "");
                var player = {
                    score: score,
                    id: playerId,
                    acc: acc,
                    T: playerData[playerId].T,
                    finalScore: -1,
                    highScoreFlag: false,
                    color: "",
                    setFinalScore: function(rank) {
                        var sc = 11 - 2 * rank;
                        var threshold = 9 - this.T * 2;
                        if(rank == 1) {
                            if (this.T == 0) {
                                sc = 10;
                            }
                            else {
                                sc = 9.5 - this.T;
                            }
                        }
                        else if(this.T != 0 && sc > threshold) {
                            sc = threshold + (sc - threshold) / 2;
                        }
                        this.finalScore = sc;
                    }
                };
                if(playerData[playerId].team == redTeamName) {
                    redTeam.push(player);
                }
                else if(playerData[playerId].team == blueTeamName) {
                    blueTeam.push(player)
                }
            }
            finalScoreTable = {};
            for(let redPlayer of redTeam) {
                getFinalScore(redPlayer, blueTeam, redColor, rankingMethod);
            }
            for(let bluePlayer of blueTeam) {
                getFinalScore(bluePlayer, redTeam, blueColor, rankingMethod);
            }
            for(let playerInfo of game.childNodes) {
                let playerId = playerInfo.getElementsByClassName("mp-history-player-score__username")[0].getAttribute("href").split("/").pop();
                let scoreNode = playerInfo.getElementsByClassName("mp-history-player-score__stat mp-history-player-score__stat--score")[0];
                let player = finalScoreTable[playerId];
                if(player == null) continue;
                let score = `
                <div class='mp-history-player-score__stat mp-history-player-score__stat--score'>
                    <span class="mp-history-player-score__stat-label mp-history-player-score__stat-label--small">计分</span>
                    <span class="mp-history-player-score__stat-number mp-history-player-score__stat-number--large" style='color: ${player.color}'>
                        ${player.finalScore}
                    </span>
                </div>
                `
                scoreNode.insertAdjacentHTML("afterend", score);

                let t = `<span class='mp-history-player-score__username' style='color: ${player.color}'>T${player.T + 1}</span>`;
                playerInfo.getElementsByClassName("mp-history-player-score__username")[0].insertAdjacentHTML("afterend", t);
            }
            var redSum = redTeam.reduce(sum, 0), blueSum = blueTeam.reduce(sum, 0);
            var win = redSum > blueSum;
            win ? redTeamScore++ : blueTeamScore++;
            var totalScore = `
                <p><div>
                    <span style='color: ${redColor}'>
                    ${redTeamName}：${redSum}
                    </span>
                    vs
                    <span style='color: ${blueColor}'>
                    ${blueTeamName}：${blueSum}
                    </span>&emsp;
                    <span style='color: ${win ? redColor : blueColor}'>
                    ${win ? redTeamName : blueTeamName}获胜！
                    </span>
                </div></p>
            `;
            game.insertAdjacentHTML("afterend", totalScore)
        }
        catch(err) {
            console.log(err);
        }
        }

    }
})();