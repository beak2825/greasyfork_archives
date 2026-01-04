// ==UserScript==
// @name         DailyMissionRewards
// @version      1.21
// @description  Daily Mission Reward Helper
// @author       ByBatu
// @copyright       2021, ByBatu (https://edom.ninja)
// @match        https://www.edominations.com/*/index
// @include      https://www.edominations.com/*/index
// @download https://greasyfork.org/scripts/457374-dailymissionrewards/code/DailyMissionRewards.user.js
// @update https://greasyfork.org/scripts/457374-dailymissionrewards/code/DailyMissionRewards.user.js
// @grant   GM_setValue
// @grant   GM_getValue
// @grant       GM_xmlhttpRequest
// @license         MIT
// @namespace https://greasyfork.org/users/1004839
// @downloadURL https://update.greasyfork.org/scripts/457374/DailyMissionRewards.user.js
// @updateURL https://update.greasyfork.org/scripts/457374/DailyMissionRewards.meta.js
// ==/UserScript==



var rewardList = [{
        context: ["your countries battle",""],
        rewards: ["10 Q3", "30 Gold"],
        image: ["/public/game/items/adrenaline-dose.png", "/public/game/icons/gold-icon-s.png"]
    },
    {
        context: ["your allies battle",""],
        rewards: ["1 Q4", "20 Gold"],
        image: ["/public/game/items/booster.png", "/public/game/icons/gold-icon-s.png"]
    },
    {
        context: ["resistance battles",""],
        rewards: ["20", "30 Gold"],
        image: ["/public/game/items/rocket.png", "/public/game/icons/gold-icon-s.png"]
    },
    {
        context: ["amount of any currency",""],
        rewards: ["50", "1 Gold"],
        image: ["/public/game/items/t90.png", "/public/game/icons/gold-icon-s.png"]
    },
    {
        context: ["Battle Hero medal",""],
        rewards: ["50", "15 Gold"],
        image: ["/public/game/items/energy-bar.png", "/public/game/icons/gold-icon-s.png"]
    },
    {
        context: ["Level up!",""],
        rewards: ["1 Q5", "1 Gold"],
        image: ["/public/game/items/reduction.png", "/public/game/icons/gold-icon-s.png"]
    },
    {
        context: ["Produce",""],
        rewards: ["20", "1 Gold", "3"],
        image: ["/public/game/items/mortar.png", "/public/game/icons/gold-icon-s.png", "/public/game/icons/employees.png"]
    },
    {
        context: ["Sell","any products"],
        rewards: ["25", "2 Gold"],
        image: ["/public/game/items/ak47.png", "/public/game/icons/gold-icon-s.png"]
    },
    {
        context: ["Trigger",""],
        rewards: ["100", "30 Gold"],
        image: ["/public/game/items/energy-bar.png", "/public/game/icons/gold-icon-s.png"]
    },
    {
        context: ["Buy"," any products"],
        rewards: ["300 Q3", "2 Gold"],
        image: ["/public/game/items/food.png", "/public/game/icons/gold-icon-s.png"]
    },
    {
        context: ["Campaign Hero medal",""],
        rewards: ["1 Q5", "50 Gold"],
        image: ["/public/game/items/reduction.png", "/public/game/icons/gold-icon-s.png"]
    }
];




$(document).ready(function(){
if ($(".oaMsg").length > 0) {
    $(".oAMsg-tab-left-button").prepend("<div class=\"oAMsg-tab-left\" ><b>REWARDS: </b><br><div id=\"rewardlists\"></div></div>");
    setTimeout(function() {
        for (i = 0; i < rewardList.length; i++) {
            if ($("#container-content > div > div > div > div.col-md-5 > div.oaMsg > div > div.oAMsg-tab-right > div.oAMsg-tab-right-text > li:contains(" + rewardList[i]["context"][0] + "):contains(" + rewardList[i]["context"][1] + ")").length > 0) {
                for (k = 0; k < rewardList[i]["rewards"].length; k++) {
                    $("#rewardlists").append(rewardList[i]["rewards"][k] + "<img src=" + rewardList[i]["image"][k] + " width=\"25px\" height=\"25px\"></img><br>");
                }
            }
        };
    }, 500);
};
});