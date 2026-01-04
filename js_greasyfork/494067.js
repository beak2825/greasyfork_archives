// ==UserScript==
// @name           WEnhance
// @name:en        WEnhance
// @namespace      https://qmainconts.dev/
// @version        1.0.3
// @description    CHUNITHM-NETにおけるWORLD'S ENDレコードページに、通常楽曲と同様のハード・クリアランプ達成数などを表示します。
// @description:en At the WORLD'S END record page on CHUNITHM-NET displays the same number of hard clear ramp achievements and other information as for normal songs.
// @author         Kjuman Enobikto
// @match          https://new.chunithm-net.com/chuni-mobile/html/mobile/record/worldsEndList/
// @grant          none
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/494067/WEnhance.user.js
// @updateURL https://update.greasyfork.org/scripts/494067/WEnhance.meta.js
// ==/UserScript==

const urlBase = "https://new.chunithm-net.com/chuni-mobile/html/mobile/images/icon_$ICONNAME$.png";
const scoreListData = [
    [
        {
            "icon": "clear",
            "count": 0
        },
        {
            "icon": "hard",
            "count": 0
        },
        {
            "icon": "brave",
            "count": 0
        },
        {
            "icon": "absolute",
            "count": 0
        },
        {
            "icon": "catastrophy",
            "count": 0
        }
    ],
    [
        {
            "icon": "rank_8",
            "count": 0
        },
        {
            "icon": "rank_9",
            "count": 0
        },
        {
            "icon": "rank_10",
            "count": 0
        },
        {
            "icon": "rank_11",
            "count": 0
        },
        {
            "icon": "rank_12",
            "count": 0
        },
        {
            "icon": "rank_13",
            "count": 0
        },
    ],
    [
        {
            "icon": "fullcombo",
            "count": 0
        },
        {
            "icon": "alljustice",
            "count": 0
        },
        {
            "icon": "alljusticecritical",
            "count": 0
        },
        {
            "icon": "fullchain2",
            "count": 0
        },
        {
            "icon": "fullchain",
            "count": 0
        }
    ]
];

(function () {
    "use strict";

    const mainBox = document.querySelector(".box01.w420");
    if (!mainBox) return;

    // Songs information collection
    const songs = mainBox.querySelectorAll(".w388.musiclist_box.bg_worldsend");
    for (let i = 0; i < songs.length; i++) {
        const song = songs[i];

        // imgの数が……
        // 0: スキップ(未プレイ)
        // 1: rankのみ(未クリア)
        // 2: hard,rank
        // 3: hard,rank,fc/aj/ajc
        // 4: hard,rank,fc/aj/ajc,fullchain/fullchain2
        const imgs = song.querySelectorAll("img");

        for (let j = 0; j < imgs.length; j++) {
            const img = imgs[j];
            const src = img.src;

            if (src.includes("catastrophy")) {
                scoreListData[0][4].count++;
                scoreListData[0][3].count++;
                scoreListData[0][2].count++;
                scoreListData[0][1].count++;
                scoreListData[0][0].count++;
            } else if (src.includes("absolutep")) {
                scoreListData[0][3].count++;
                scoreListData[0][2].count++;
                scoreListData[0][1].count++;
                scoreListData[0][0].count++;
            } else if (src.includes("absolute")) {
                scoreListData[0][2].count++;
                scoreListData[0][1].count++;
                scoreListData[0][0].count++;
            } else if (src.includes("hard")) {
                scoreListData[0][1].count++;
                scoreListData[0][0].count++;
            } else if (src.includes("clear")) {
                scoreListData[0][0].count++;
            } else if (src.includes("rank_8")) {
                scoreListData[1][0].count++;
            } else if (src.includes("rank_9")) {
                scoreListData[1][0].count++;
                scoreListData[1][1].count++;
            } else if (src.includes("rank_10")) {
                scoreListData[1][0].count++;
                scoreListData[1][1].count++;
                scoreListData[1][2].count++;
            } else if (src.includes("rank_11")) {
                scoreListData[1][0].count++;
                scoreListData[1][1].count++;
                scoreListData[1][2].count++;
                scoreListData[1][3].count++;
            } else if (src.includes("rank_12")) {
                scoreListData[1][0].count++;
                scoreListData[1][1].count++;
                scoreListData[1][2].count++;
                scoreListData[1][3].count++;
                scoreListData[1][4].count++;
            } else if (src.includes("rank_13")) {
                scoreListData[1][0].count++;
                scoreListData[1][1].count++;
                scoreListData[1][2].count++;
                scoreListData[1][3].count++;
                scoreListData[1][4].count++;
                scoreListData[1][5].count++;
            } else if (src.includes("fullcombo")) {
                scoreListData[2][0].count++;
            } else if (src.includes("alljustice")) {
                scoreListData[2][0].count++;
                scoreListData[2][1].count++;
            } else if (src.includes("alljusticecritical")) {
                scoreListData[2][0].count++;
                scoreListData[2][1].count++;
                scoreListData[2][2].count++;
            } else if (src.includes("fullchain2")) {
                scoreListData[2][3].count++;
            } else if (src.includes("fullchain")) {
                scoreListData[2][3].count++;
                scoreListData[2][4].count++;
            }
        }
    }

    const allSongs = songs.length;

    const wrapper = document.createElement("div");
    wrapper.className = "box01 w420 font_0";

    const scoreListBlock = document.createElement("div");
    scoreListBlock.className = "score_list_block";

    for (let i = 0; i < scoreListData.length; i++) {
        for (let j = 0; j < scoreListData[i].length; j++) {
            const scoreList = document.createElement("div");
            scoreList.className = "score_list";

            const scoreListTop = document.createElement("div");
            scoreListTop.className = "score_list_top";
            scoreList.appendChild(scoreListTop);

            const scoreListBottom = document.createElement("div");
            scoreListBottom.className = "score_list_bottom";
            scoreList.appendChild(scoreListBottom);

            const scoreListIcon = document.createElement("img");
            scoreListIcon.src = urlBase.replace("$ICONNAME$", scoreListData[i][j].icon);
            scoreListTop.appendChild(scoreListIcon);

            const scoreNumText = document.createElement("div");
            scoreNumText.className = "score_num_text";
            scoreNumText.innerText = scoreListData[i][j].count;
            scoreListBottom.appendChild(scoreNumText);

            const scoreAllText = document.createElement("div");
            scoreAllText.className = "score_all_text font_small";
            scoreAllText.innerText = "/" + String(allSongs);
            scoreListBottom.appendChild(scoreAllText);

            scoreListBlock.appendChild(scoreList);
        }

        scoreListBlock.appendChild(document.createElement("br"));
    }

    wrapper.appendChild(scoreListBlock);
    mainBox.before(wrapper);
})();