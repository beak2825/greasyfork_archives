// ==UserScript==
// @name         BL R9.75 Buy Health/Protection Script
// @namespace    https://greasyfork.org/en
// @version      0.0.3
// @description  Buy health and protection if injured
// @author       BD
// @include      https://www.bootleggers.us/gold.php*
// @include      https://www.bootleggers.us/buy.php*
// @update       https://greasyfork.org/scripts/376456-bl-r9-75-buy-health-protection-script/code/BL%20R975%20Buy%20HealthProtection%20Script.user.js
// @downloadURL https://update.greasyfork.org/scripts/376456/BL%20R975%20Buy%20HealthProtection%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/376456/BL%20R975%20Buy%20HealthProtection%20Script.meta.js
// ==/UserScript==

$(document).ready(function() {
    var health = document.querySelectorAll("[data-player-bar='protection']")[0].getElementsByClassName("label")[0].innerText;
    var protection = document.querySelectorAll("[data-player-bar='protection']")[0].getElementsByClassName("label")[0].innerText;
    if ((eval(health) < 1) && (window.location.href.includes("gold.php?b=1"))) {
        $("#row5").click();
        document.querySelectorAll("[value='Purchase!']")[0].click();
    }
    if ((eval(protection) < 1) && (window.location.href.includes("buy.php?b=1"))) {
        document.querySelectorAll("[value='Repair protection!']")[0].click();
    }
});