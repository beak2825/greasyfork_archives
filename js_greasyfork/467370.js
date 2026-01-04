// ==UserScript==
// @name         自动签到
// @namespace    ke3470.com
// @version      0.0.1
// @description  Zod自动签到
// @author       ke3470
// @license      GPL-3.0 License
// @match        https://zodgame.xyz/plugin.php?id=dsu_paulsig
// @match        https://zodgame.xyz/plugin.php?id=dsu_paulsign:sign
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zodgame.xyz
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467370/%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/467370/%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

/* jshint esversion: 11 */

(async function() {
    'use strict';

    const minCheckInHour = 7;
    const minCheckInMinute = 59;
    const minCheckInSecond = 50;

    const maxCheckInHour = 8;
    const maxCheckInMinute = 0;
    const maxCheckInSecond = 10;

    await run();

    async function run() {
        await waitUntilLoaded();
        await checkIn();
        await waitUntilRefresh();
        await delay(5);
    }

    async function waitUntilLoaded() {
        var sign = null;
        do {
            await delay(0.1);
            sign = document.querySelector("#ct > font > b > div.sd > div.bm > div.bm_c");
        } while (sign == null);
        console.log("loaded", new Date());
    }

    async function checkIn() {
        var mood = document.querySelector("#fd > center > img");
        var checkIn = document.querySelector("#qiandao > table > tbody > tr > td > div > a");

        if (mood != null && checkIn != null) {
            mood.click();
            checkIn.click();
        }
    }

    async function waitUntilRefresh() {
        var now = new Date();
        var hour = now.getHours();
        var minute = now.getMinutes();
        var seconds = now.getSeconds();
        if (((hour == minCheckInHour && minute == minCheckInMinute && seconds > minCheckInSecond)
        || (now.getHours() == maxCheckInHour && minute == maxCheckInMinute && seconds < maxCheckInSecond))
        && !isCheckIn()) {
            reloadpage();
            return;
        }

        var nextCheckTime = new Date(now.getFullYear(), now.getMonth(), now.getDate()+1, minCheckInHour, minCheckInMinute, minCheckInSecond);
        console.log("next check in time", nextCheckTime);

        while (now < nextCheckTime) {
            var diff = Math.floor((nextCheckTime - now)/1000);
            var maxGap = 30*60;
            await delay(diff > maxGap ? maxGap : diff);
            now = new Date();
        }
        reloadpage();
    }

    function isCheckIn() {
        var sign = document.querySelector("#ct > div > h1");
        var res = sign != null && sign.innerHTML == "您今天已经签到过了或者签到时间还未开始";

        var strLastCheckInDate = document.querySelector("#ct > div > p:nth-child(4) > font")?.innerHTML?.match(/\d+/g);
        if (strLastCheckInDate != null) {
            var lastCheckInDate = new Date(strLastCheckInDate[0], strLastCheckInDate[1]-1, strLastCheckInDate[2], strLastCheckInDate[3], strLastCheckInDate[4]);
            var minCheckInLastDate = (new Date()).setHours(minCheckInHour, minCheckInMinute, minCheckInSecond);
            var maxCheckInLastDate = (new Date()).setHours(maxCheckInHour, maxCheckInMinute, maxCheckInSecond);
            res = res && (lastCheckInDate >= minCheckInLastDate && lastCheckInDate <= maxCheckInLastDate);
        }

        return res;
    }

    function delay(seconds){
        return new Promise(resolve => {
            setTimeout(resolve, seconds*1000);
        });
    }

    function reloadpage() {
        location.reload();
    }

})();