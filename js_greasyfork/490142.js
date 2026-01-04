// ==UserScript==
// @name         Flight Rising Unclaimed Achievements Badge
// @namespace    http://circlejourney.net/
// @version      2024-03-22
// @description  Add unclaimed achievements and pursuits badge indicators to the Flight Rising GUI.
// @author       You
// @match        https://www1.flightrising.com/*
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=flightrising.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490142/Flight%20Rising%20Unclaimed%20Achievements%20Badge.user.js
// @updateURL https://update.greasyfork.org/scripts/490142/Flight%20Rising%20Unclaimed%20Achievements%20Badge.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener("load", get);
    function get() {
        let achievements = 0;
        let pursuits = 0;

        const getAch = $.get("/achievements", (data) => {
            const indicators = $(data).find(".common-tab-indicator");
            if(indicators.length == 0) return false;
            indicators.each((i, element) => { achievements += parseInt($(element).text()); });
        });

        const getPur = $.get("/achievements/pursuits/daily", (data) =>{
            const indicators = $(data).find(".common-tab-indicator");
            if(indicators.length == 0) return false;
            indicators.each((i, element) => { pursuits += parseInt($(element).text()); });
        });

        Promise.all([getAch, getPur]).then(() => {
            if(pursuits + achievements === 0) return false;

            const quests = $(".tabstat[data-tooltip-source='#loginbar-achievement-points-tooltip'] .loginlinks");
            const indicator = $("<div class='statdiv' style='left: calc(100% - 11px);'><span><div id='alerticon'></div></span></div>");
            quests.append(indicator);
            indicator.find("#alerticon").text(pursuits + achievements);

            const navIndicator = $("<div class='common-tab-indicator' style='right: 50px;'></div>");
            if($(".achievements-nav").length > 0 && pursuits > 0) {
                const nav = $(".achievements-nav");
                $(nav).append(navIndicator.text(pursuits));
                return false;
            }
            if($(".pursuits-nav").length > 0 && achievements > 0) {
                const nav = $(".pursuits-nav");
                $(nav).append(navIndicator.text(achievements));
                return false;
            }
        });
    }
})();