// ==UserScript==
// @name         OL: showEndOfTransferPeriode
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Zeigt das Ende der Transferphase an
// @author       König von Weiden
// @match        https://www.onlineliga.de/
// @icon         https://onlineliga.s3.eu-central-1.amazonaws.com/userimages/32830-5f7ec70c87047.png
// @downloadURL https://update.greasyfork.org/scripts/442993/OL%3A%20showEndOfTransferPeriode.user.js
// @updateURL https://update.greasyfork.org/scripts/442993/OL%3A%20showEndOfTransferPeriode.meta.js
// ==/UserScript==
 
/*********************************************
 * 0.1.0 09.04.2022 Release
 * 0.2.0 26.04.2022 Integration of SP

 *********************************************/

(function() { //ol-paragraph ol-player-evolution-table
    'use strict';
    $(document).ready(function(){
        const timeInterval = 1000;
        const currentWeek = $(".ol-header-current-week:first").text();
        let endOfTransferPeriodeDay, endOfTransferPeriodeMonth, endOfTransferPeriodeYear, endOfTransferPeriodeTime;
        let styleContainer = "font-weight:bold;margin-top:-16px;padding-right:10px;";
        let secondInterval = setInterval(checkDiv, timeInterval);

        async function checkDiv(){
            if((currentWeek==18 || currentWeek==19 || currentWeek==20 || currentWeek==38 || currentWeek==39 || currentWeek==40 || currentWeek==41 || currentWeek==42 || currentWeek==43 || currentWeek==44) && $(".ol-rest-transfer-time-container").length==0){
                let link = "/dashboard";
                let overviewData = $.ajax({type: "GET", url: link, async: false}).responseText;
                let endOfTransferPeriodeString = $("<div>" + overviewData + "</div>").find("span.adhoc-sub-2").text().trim();
                endOfTransferPeriodeDay = parseInt(endOfTransferPeriodeString.substring(9,11));
                endOfTransferPeriodeMonth = parseInt(endOfTransferPeriodeString.substring(12,14));
                endOfTransferPeriodeYear = parseInt(endOfTransferPeriodeString.substring(15,19));
                endOfTransferPeriodeTime = parseInt(endOfTransferPeriodeString.substring(23,25));
                transferTimeCounter(endOfTransferPeriodeDay, endOfTransferPeriodeMonth, endOfTransferPeriodeYear, endOfTransferPeriodeTime);
            }
            else if((currentWeek==18 || currentWeek==19 || currentWeek==20 || currentWeek==38 || currentWeek==39 || currentWeek==40 || currentWeek==41 || currentWeek==42 || currentWeek==43 || currentWeek==44) && $(".ol-rest-transfer-time-container").length==1){
                transferTimeCounter(endOfTransferPeriodeDay, endOfTransferPeriodeMonth, endOfTransferPeriodeYear, endOfTransferPeriodeTime);
            }
        }

        function transferTimeCounter(endOfTransferPeriodeDay, endOfTransferPeriodeMonth, endOfTransferPeriodeYear, endOfTransferPeriodeTime){
            let date = new Date();
            let restHours, restMinutes, restSeconds, restDays;
            let systemDay = parseInt((date.getDate()<10 ? "0" : "") + date.getDate());
            let systemMonth = parseInt((date.getMonth()<9 ? "0" : "") + (date.getMonth()+1));
            let systemYear = parseInt(date.getFullYear());
            let systemHours = parseInt(date.getHours());
            let systemMinutes = parseInt(date.getMinutes());
            let systemSeconds = parseInt(date.getSeconds());
            restHours = endOfTransferPeriodeTime-systemHours-1;
            restMinutes = 60-systemMinutes-1;
            restSeconds = 60-systemSeconds-1;
            if(endOfTransferPeriodeYear==systemYear && endOfTransferPeriodeMonth==systemMonth){
                restDays = endOfTransferPeriodeDay-systemDay;
            }
            else if(endOfTransferPeriodeYear==systemYear && endOfTransferPeriodeMonth!=systemMonth){
                switch(systemMonth){
                    case 1:
                    case 3:
                    case 5:
                    case 7:
                    case 8:
                    case 10:
                    case 12:
                        restDays = 31+endOfTransferPeriodeDay-systemDay
                        break;
                    case 4:
                    case 6:
                    case 9:
                    case 11:
                        restDays = 30+endOfTransferPeriodeDay-systemDay
                        break;
                    case 2:
                        restDays = 28+endOfTransferPeriodeDay-systemDay
                        break;
                }
            }
            $(".ol-rest-transfer-time-container").remove();
            if(restDays==0){
                $(".matchday-date-container").before(
                    "<div class=\"ol-rest-transfer-time-container\" style=\"color:#ae0000;"+styleContainer+"\">"+restDays+" T "+restHours+" H "+restMinutes+" M "+restSeconds+" S</div>"
                );
            }
            else{
                $(".matchday-date-container").before(
                    "<div class=\"ol-rest-transfer-time-container\" style=\""+styleContainer+"\">"+restDays+" T "+restHours+" H "+restMinutes+" M "+restSeconds+" S</div>"
                );
            }
        }
    });
})();