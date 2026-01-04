// ==UserScript==
// @name         二手市场捡漏
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try
// @author       You
// @match        https://www.gamemale.com/wodexunzhang-showxunzhang.html?action=showjishou
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gamemale.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465181/%E4%BA%8C%E6%89%8B%E5%B8%82%E5%9C%BA%E6%8D%A1%E6%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/465181/%E4%BA%8C%E6%89%8B%E5%B8%82%E5%9C%BA%E6%8D%A1%E6%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
let targetMedals = [
        "克里斯·雷德菲尔德",
        "疾风剑豪",
        "艾吉奥",
        "光之战士",

        "虎克船长",
        "克里斯·埃文斯",
        "Joker",
        "西弗勒斯·斯内普",

        "浪潮之歌",

        "软泥怪蛋",

        "美恐：启程"
    ]
    // console.log(targetMedals[0]);
    //当二手市场勋章数>0时
    let medalsSelector = "#medalid_f > div > div.myfldiv.clearfix";
    let medals = document.querySelector(medalsSelector);
    let num = (medals.childNodes.length) / 2;
    num = Math.floor(num);
    console.log(num);
    if (num >= 1) {
        for (let i = num; i >= 1; i--) {
            let medalNameSelector = `#medalid_f > div > div.myfldiv.clearfix > div:nth-child(${i}) > div.myimg > p:nth-child(2) > b`;
            let medalName = document.querySelector(medalNameSelector).innerHTML;
            // console.log(medalName);
            for (let j = 0; j < targetMedals.length; j++) {
                if (medalName == targetMedals[j]) {
                    // console.log("buy"+medalName);
                    let buttonSelector = `#medalid_f > div > div.myfldiv.clearfix > div:nth-child(${i}) > div.myimg > p:nth-child(3) > button`;
                    document.querySelector(buttonSelector).click();
                    console.log("点击购买");
                }
            }
        }
    }

    console.log("10秒后刷新页面");
    setTimeout(function () {
        window.location.href = "https://www.gamemale.com/wodexunzhang-showxunzhang.html?action=showjishou"
    }, 10000)

})();