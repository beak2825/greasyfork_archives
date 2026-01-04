// ==UserScript==
// @name         OL: showTransfermarketPlayerViewInjuries
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Zeigt zusätzliche Verletzungsinformationen in der Spieleransicht am Transfermarkt an
// @author       König von Weiden
// @match        https://www.onlineliga.de/transferlist/gettransferlistview
// @match        https://www.onlineliga.de/transferlist/getwatchlist
// @icon         https://onlineliga.s3.eu-central-1.amazonaws.com/userimages/32830-5f7ec70c87047.png
// @downloadURL https://update.greasyfork.org/scripts/442866/OL%3A%20showTransfermarketPlayerViewInjuries.user.js
// @updateURL https://update.greasyfork.org/scripts/442866/OL%3A%20showTransfermarketPlayerViewInjuries.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(document).ready(function(){
        const timeInterval = 1000;
        let i;
        let interval = setInterval(waitForKeyElement, timeInterval);

        async function waitForKeyElement(){
            if($("#playerView .player-injury-wrapper").length==1 && $(".ol-additional-injury-information").length==0){
                let playerID = parseInt($("span.player-steckbrief").eq(0).attr("onclick").match(/[0-9]+/g));
                getPlayerInjuryData(playerID);
            }
        }

        function getPlayerInjuryData(playerID){
            let link = "/player/injuries?playerId="+playerID;
            let playerData = $.ajax({type: "GET", url: link, async: false}).responseText;
            let totalDuration = $("<div>" + playerData + "</div>").find("span.bandarole-second-row span.player-info-bandarole-big-font").eq(0).text().trim();
            let averagePerSeason = $("<div>" + playerData + "</div>").find("span.bandarole-second-row span.player-info-bandarole-big-font").eq(1).text().trim();
            $(".transfer-player-ready.text-center").append(
                "<div class=\"ol-additional-injury-information\">"+
                    "<div class=\"ol-additional-injury-information-total-duration\">Gesamtdauer (Wochen): "+totalDuration+"</div>"+
                    "<div class=\"ol-additional-injury-information-average-per-season\">Ø pro Saison (Wochen): "+averagePerSeason+"</div>"+
                "</div>"
            );
            $(".ol-additional-injury-information-total-duration").attr("style","font-size:10pt;text-align:center;");
            $(".ol-additional-injury-information-average-per-season").attr("style","font-size:10pt;padding-bottom:18px;text-align:center;");
            $(".ol-youth-player-spacer.transfer-player-overview-spacer").remove();
        }
    });
})();