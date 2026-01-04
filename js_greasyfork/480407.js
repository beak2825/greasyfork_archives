// ==UserScript==
// @name         Travian Legends - Hourly Raid
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  Show hourly raid for top 10 raiders
// @author       You
// @match        https://*.travian.*/statistics/player/top10
// @icon         https://www.google.com/s2/favicons?sz=64&domain=travian.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/480407/Travian%20Legends%20-%20Hourly%20Raid.user.js
// @updateURL https://update.greasyfork.org/scripts/480407/Travian%20Legends%20-%20Hourly%20Raid.meta.js
// ==/UserScript==

(function() {
    // util
    function getMonday(d) {
        d = new Date(d);
        var day = d.getDay();
        var diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
        d.setDate(diff);
        d.setHours(0);
        d.setMinutes(0);
        d.setSeconds(0);
        return new Date(d);
    }
    function computeHourlyRaid(raid) {
        var now = new Date();
        var currUTC = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
        var firstDay = getMonday(currUTC);
        var totalHours = 1.0 * Math.abs(currUTC - firstDay) / 36e5;
        return Math.floor(1.0 * raid / totalHours).toString();
    }
    // main code
    for (let i = 1; i <= 12; i++) {
        if(i == 11) continue;
        var raid = Math.floor(document.querySelector("#top10_raiders > tbody > tr:nth-child(" + i + ") > td.val.lc").textContent);
        document.querySelector("#top10_raiders > tbody > tr:nth-child(" + i + ") > td.val.lc").textContent += "\n" + computeHourlyRaid(raid) + " /hr";
    }
})();