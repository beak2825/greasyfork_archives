// ==UserScript==
// @name            Dislevtor
// @name:en         Dislevtor
// @namespace       https://qmainconts.dev/
// @version         1.1.1
// @description     CHUNITHM-NET上のレコードページのランプ部分に、ゲージや達成率を表示します。
// @description:en  Displays gauge and achievement rate in the lamp part of the record page on CHUNITHM-NET.
// @author          Kjuman Enobikto
// @match           https://new.chunithm-net.com/chuni-mobile/html/mobile/record/music*/*
// @match           https://new.chunithm-net.com/chuni-mobile/html/mobile/record/worldsEndList/
// @grant           none
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/494069/Dislevtor.user.js
// @updateURL https://update.greasyfork.org/scripts/494069/Dislevtor.meta.js
// ==/UserScript==


var intervalID = 0;
var retryCount = 0;

function findScoreListBlock() {
    "use strict";

    const scoreListBlock = document.querySelector(".score_list_block");
    retryCount++;
    if (retryCount > 100) {
        console.info("[Dislevtor] WEnhancer not found.");
        clearInterval(intervalID);
        return;
    }
    if (scoreListBlock) {
        clearInterval(intervalID);
        main();
    }
}

function main() {
    "use strict";

    const scoreListBlock = document.querySelector(".score_list_block");
    if (!scoreListBlock) return;
    scoreListBlock.style.userSelect = "none";
    const scoreListAll = scoreListBlock.querySelectorAll(".score_list");

    const scoreData = [[], [], []];
    let scoreDataOffset = 0;
    const scoreDataOffsetCounts = [5, 6, 5];
    let scoreOffset = 0;
    for (let i = 0; i < scoreListAll.length; i++) {
        const scoreList = scoreListAll[i];
        scoreList.style.height = "auto";

        const scoreListBottom = scoreList.querySelector(".score_list_bottom");
        scoreListBottom.style.height = "auto";
        const numerator = parseInt(scoreListBottom.querySelector(".score_num_text").innerText.replace(",", ""));
        const denominator = parseInt(scoreListBottom.querySelector(".score_all_text").innerText.replace("/", "").replace(",", ""));
        const percentage = numerator / denominator * 100;

        const scoreListPercentage = document.createElement("div");
        scoreListPercentage.className = "font_small";
        scoreListPercentage.innerText = percentage.toFixed(2) + "%";
        scoreListBottom.appendChild(scoreListPercentage);

        scoreList.style.background = "linear-gradient(90deg, #ff8888 " + percentage + "%, #ffffee " + percentage + "%)"

        if (scoreList.querySelector("img").src.includes("fullchain")) continue;
        scoreData[scoreDataOffset].push({ num: numerator, den: denominator, per: percentage });

        scoreOffset++;
        if (scoreOffset >= scoreDataOffsetCounts[scoreDataOffset]) {
            scoreDataOffset++;
            scoreOffset = 0;
        }
    }
}

(function () {
    if (location.href === "https://new.chunithm-net.com/chuni-mobile/html/mobile/record/worldsEndList/") {
        intervalID = setInterval(findScoreListBlock, 50);
    } else {
        main();
    }
})();