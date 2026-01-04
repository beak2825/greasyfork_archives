// ==UserScript==
// @name         Better Dailys
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Daily notification on server restart to claim you dailies
// @author       Love me oniichan
// @license      GNU GPLv3
// @match        https://web.simple-mmo.com/*
// @icon         https://icons.duckduckgo.com/ip2/simple-mmo.com.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/502102/Better%20Dailys.user.js
// @updateURL https://update.greasyfork.org/scripts/502102/Better%20Dailys.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function dailyReward(){

        var url = "/api/dailyreward/claim";
        var title = "Daily Reward (Extension)";
        var content = "Are you sure that you want to redeem your daily reward?";
        var button = "Yes";
        var image = "/img/icons/I_Chest01.png";

        var response = postPopup(title, content, url, button, image, false, false);
    }
    let interval_daily = setInterval(() => {
        let current_day = new Date().getUTCDate()
        let last_daily_redeem = GM_getValue("last_daily_redeem")
        if(last_daily_redeem){
            if(current_day == last_daily_redeem){
                clearInterval(interval_daily)
                return;
            }
            if(current_day-1 == last_daily_redeem && new Date().getUTCHours()<12){
                clearInterval(interval_daily)
                return;
            }
        }
        if(postPopup){
            if(new Date().getUTCHours() ==12 && new Date().getUTCMinutes <5 ){return;}
            dailyReward()
            if(new Date().getUTCHours() < 12){current_day=current_day -1}
            GM_setValue("last_daily_redeem",current_day)
            clearInterval(interval_daily)
        }
    },200)
})();