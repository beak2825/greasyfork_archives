// ==UserScript==
// @name         MissionShopDB
// @namespace    de.sabbasofa.missionrewarddb
// @version      1.0.3
// @description  Collecting anonymous data about mission rewards
// @author       Hemicopter [2780600], Lazerpent [2112641]
// @match        https://www.torn.com/loader.php?sid=missions*
// @icon         https://torn.com/loader.php?sid=missions*
// @grant        GM_xmlhttpRequest
// @connect      api.lzpt.io
// @downloadURL https://update.greasyfork.org/scripts/503602/MissionShopDB.user.js
// @updateURL https://update.greasyfork.org/scripts/503602/MissionShopDB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(getRewardData, 1000);

    function getRewardData() {
        try {
            if(!document.getElementsByClassName("rewards-list")[0]) return;
            let bundle = [];

            for(let list of document.getElementsByClassName("rewards-list")) {
                let rewards = list.children;

                for (let reward of rewards) {
                    let data = JSON.parse(reward.attributes["data-ammo-info"].value);
                    let rewardData = {};
                    rewardData.timestamp = data.timestamp;
                    rewardData.name = data.name;
                    rewardData.amount = data.amount;
                    rewardData.points = data.points;
                    rewardData.label = data.label? data.label : "none";
                    bundle.push(rewardData);
                }

            }

            console.log("[MissionShopDB] Ready to send bundle.", JSON.stringify(bundle));
            sendBundleToAPI(bundle);

        } catch(error) {
            console.error("[MissionShopDB] Error sending bundle to API:", error);
            alert("MissionShopDB error #42. Please check console and report this to Lazerpent [2112641] or Hemicopter [2780600]: " + error);
        }
    }

    function sendBundleToAPI(bundle) {
        GM_xmlhttpRequest({
            method: "POST",
            url: "https://api.lzpt.io/missionshopdb",
            headers: {"Content-Type": "application/json"},
            data: JSON.stringify(bundle),
            onload: function (response) {
                if(!response) return; // because pda doesn't know how to network i guess
                console.log("[MissionShopDB] Bundle successfully sent to API:", response.responseText);

                const json = JSON.parse(response.responseText);
                if (json.error) {
                    alert("MissionShopDB error #58. Please check console and report this to Lazerpent [2112641] or Hemicopter [2780600]: " + response.responseText);
                }
            },
            onerror: function (error) {
                console.error("[MissionShopDB] Error sending bundle to API:", error);
                alert("MissionShopDB error #63. Please check console and report this to Lazerpent [2112641] or Hemicopter [2780600]: " + error);
            }
        });
    }
})();