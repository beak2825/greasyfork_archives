// ==UserScript==
// @name         Single Lap Speedway
// @version      1.0
// @description  Start 1-lap speedway race quickly
// @author       echotte [2834135]
// @namespace    echotte.torn.com
// @match        *www.torn.com/loader.php?sid=racing*
// @icon         https://static.wikia.nocookie.net/cybernations/images/b/b8/NPObannerflagnew.png/revision/latest/scale-to-width-down/200?cb=20121128045516
// @grant        none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/505248/Single%20Lap%20Speedway.user.js
// @updateURL https://update.greasyfork.org/scripts/505248/Single%20Lap%20Speedway.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $('body').ajaxComplete(function(e, xhr, settings) {
        var url = settings.url;
        if (url.indexOf("tab=customrace") >= 0) {
            // render button
            let epoch_now = Math.floor(Date.now() / 1000)
            let speedway = `
                <a href="/loader.php?sid=racing&amp;tab=customrace&amp;section=getInRace&amp;step=getInRace&amp;id=&amp;carID=774801&amp;createRace=true&amp;title=Quick+Speedway+1+Lap&amp;minDrivers=2&amp;maxDrivers=2&amp;trackID=21&amp;laps=1&amp;minClass=5&amp;carsTypeAllowed=1&amp;carsAllowed=5&amp;betAmount=0&amp;waitTime=${epoch_now}"
                class="btn btn-action-tab torn-btn btn-dark-bg"
                tab-value="customrace"
                section-value="getInRace"
                step-value="getInRace"
                id-value=""
                carid-value="774801"
                racecreate-value="&amp;createRace=true&amp;title=Quick+Speedway+1+Lap&amp;minDrivers=2&amp;maxDrivers=2&amp;trackID=21&amp;laps=1&amp;minClass=5&amp;carsTypeAllowed=1&amp;carsAllowed=5&amp;betAmount=0&amp;waitTime=${epoch_now}"
                >
                Start Speedway 1-lap
                </a>
                &nbsp;
                <a href="/loader.php?sid=racing&amp;tab=customrace&amp;section=getInRace&amp;step=getInRace&amp;id=&amp;carID=774801&amp;password=a&amp;createRace=true&amp;title=Quick+Speedway+1+Lap&amp;minDrivers=2&amp;maxDrivers=2&amp;trackID=21&amp;laps=1&amp;minClass=5&amp;carsTypeAllowed=1&amp;carsAllowed=5&amp;betAmount=0&amp;waitTime=${epoch_now}"
                class="btn btn-action-tab torn-btn btn-dark-bg"
                tab-value="customrace"
                section-value="getInRace"
                step-value="getInRace"
                id-value=""
                carid-value="774801"
                racecreate-value="&amp;password=a&amp;createRace=true&amp;title=Quick+Speedway+1+Lap&amp;minDrivers=2&amp;maxDrivers=2&amp;trackID=21&amp;laps=1&amp;minClass=5&amp;carsTypeAllowed=1&amp;carsAllowed=5&amp;betAmount=0&amp;waitTime=${epoch_now}"
                >
                Start Speedway 1-lap (Password: A)
                </a>
                `;
            document.getElementsByClassName('btn-wrap silver c-pointer')[0].insertAdjacentHTML('beforeend', speedway);
        }
    });
})();

