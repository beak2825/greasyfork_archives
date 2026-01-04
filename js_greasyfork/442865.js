// ==UserScript==
// @name         OL: showRealStrengthValuesOfPlayersOnTM
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  Zeigt die wahre Stärke der Spieler am TM in der Spieleransicht sowie eine Entwicklungsprogrnose bis 30 Jahren
// @author       König von Weiden
// @match        https://www.onlineliga.de/transferlist/gettransferlistview
// @match        https://www.onlineliga.de/transferlist/getwatchlist
// @icon         https://onlineliga.s3.eu-central-1.amazonaws.com/userimages/32830-5f7ec70c87047.png
// @downloadURL https://update.greasyfork.org/scripts/442865/OL%3A%20showRealStrengthValuesOfPlayersOnTM.user.js
// @updateURL https://update.greasyfork.org/scripts/442865/OL%3A%20showRealStrengthValuesOfPlayersOnTM.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(document).ready(function(){
        const currentSeason = parseInt($(".ol-header-current-season:first").text());
        const currentWeek = parseInt($(".ol-header-current-week:first").text());
        const timeInterval = 500;
        let i, j;
        let interval = setInterval(waitForKeyElement, timeInterval);

        function showRealPositionValues(numberOfFormation){
            let playerData = new Player();
            playerData.ID = parseInt($("span.player-steckbrief").attr("onclick").match(/playerId:\s*(\d+)/)[1]);
            let link = "/player/overview?playerId="+playerData.ID;
            let playerOverview = $.ajax({type: "GET", url: link, async: false}).responseText;
            playerData.birthday = parseInt($("<div>" + playerOverview + "</div>").find(".col-md-8.col-lg-8.col-sm-12.col-xs-7").eq(7).text().trim().substring(6,8).trim());
            playerData.age = parseInt($("<div>" + playerOverview + "</div>").find(".ol-player-overview-player-position-age").text().trim().match(/[0-9]+/g));
            let trainingsslot = new Trainingsslot();
            $(".ol-container-transfer-real-strenght-values").before(
                "<div class=\"ol-transfer-position-container-1\"></div>"
            );
            $(".ol-transfer-position-container-1").css({"display":"inline-block","margin":"2px 4px"});
            if($(".transfer-player-attributes-container span.ol-value-bar-small-label-value").length==14){
                playerData.leftfoot = parseInt($(".transfer-player-attributes-container span.ol-value-bar-small-label-value").eq(0).text().trim());
                playerData.rightfoot = parseInt($(".transfer-player-attributes-container span.ol-value-bar-small-label-value").eq(1).text().trim());
                playerData.strength = parseInt($(".transfer-player-attributes-container span.ol-value-bar-small-label-value").eq(2).text().trim());
                playerData.condition = parseInt($(".transfer-player-attributes-container span.ol-value-bar-small-label-value").eq(4).text().trim());
                playerData.speed = parseInt($(".transfer-player-attributes-container span.ol-value-bar-small-label-value").eq(5).text().trim());
                playerData.technique = parseInt($(".transfer-player-attributes-container span.ol-value-bar-small-label-value").eq(6).text().trim());
                playerData.shootingtechnique = parseInt($(".transfer-player-attributes-container span.ol-value-bar-small-label-value").eq(7).text().trim());
                playerData.shootingpower = parseInt($(".transfer-player-attributes-container span.ol-value-bar-small-label-value").eq(8).text().trim());
                playerData.header = parseInt($(".transfer-player-attributes-container span.ol-value-bar-small-label-value").eq(9).text().trim());
                playerData.duel = parseInt($(".transfer-player-attributes-container span.ol-value-bar-small-label-value").eq(10).text().trim());
                playerData.tactics = parseInt($(".transfer-player-attributes-container span.ol-value-bar-small-label-value").eq(11).text().trim());
                playerData.athletics = parseInt($(".transfer-player-attributes-container span.ol-value-bar-small-label-value").eq(12).text().trim());
                playerData.talent = parseInt($(".transfer-player-attributes-container span.ol-value-bar-small-label-value").eq(13).text().trim());
                let positionValues = new Array(10);
                for(i=0;i<10;i++){
                    positionValues[i] = new Array(4);
                }
                switch(numberOfFormation){
                    case 1: // 3-4-3 Dreierkette (offensiv)
                        positionValues[0][0] = "LIV";
                        positionValues[0][1] = Math.round(((playerData.leftfoot*3+playerData.rightfoot*1+playerData.condition*2+playerData.speed*8+playerData.technique*4+playerData.shootingtechnique*5+playerData.shootingpower*2+playerData.header*8+playerData.duel*9+playerData.tactics*8+playerData.athletics*6)/56)*10)/10;
                        positionValues[0][2] = Math.round((positionValues[0][1]-playerData.strength)*10)/10;
                        positionValues[0][3] = Math.round((positionValues[0][2]/playerData.strength)*1000)/10;
                        positionValues[1][0] = "ZIV";
                        positionValues[1][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*1+playerData.condition*2+playerData.speed*8+playerData.technique*3+playerData.shootingtechnique*5+playerData.shootingpower*2+playerData.header*9+playerData.duel*10+playerData.tactics*8+playerData.athletics*6)/55)*10)/10;
                        positionValues[1][2] = Math.round((positionValues[1][1]-playerData.strength)*10)/10;
                        positionValues[1][3] = Math.round((positionValues[1][2]/playerData.strength)*1000)/10;
                        positionValues[2][0] = "RIV";
                        positionValues[2][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*3+playerData.condition*2+playerData.speed*8+playerData.technique*4+playerData.shootingtechnique*5+playerData.shootingpower*2+playerData.header*8+playerData.duel*9+playerData.tactics*8+playerData.athletics*6)/56)*10)/10;
                        positionValues[2][2] = Math.round((positionValues[2][1]-playerData.strength)*10)/10;
                        positionValues[2][3] = Math.round((positionValues[2][2]/playerData.strength)*1000)/10;
                        positionValues[3][0] = "LOM";
                        positionValues[3][1] = Math.round(((playerData.leftfoot*4+playerData.rightfoot*1+playerData.condition*1+playerData.speed*9+playerData.technique*8+playerData.shootingtechnique*8+playerData.shootingpower*1+playerData.header*1+playerData.duel*5+playerData.tactics*4+playerData.athletics*2)/44)*10)/10;
                        positionValues[3][2] = Math.round((positionValues[3][1]-playerData.strength)*10)/10;
                        positionValues[3][3] = Math.round((positionValues[3][2]/playerData.strength)*1000)/10;
                        positionValues[4][0] = "ZLOM";
                        positionValues[4][1] = Math.round(((playerData.leftfoot*3+playerData.rightfoot*1+playerData.condition*1+playerData.speed*8+playerData.technique*8+playerData.shootingtechnique*7+playerData.shootingpower*1+playerData.header*2+playerData.duel*7+playerData.tactics*5+playerData.athletics*2)/45)*10)/10;
                        positionValues[4][2] = Math.round((positionValues[4][1]-playerData.strength)*10)/10;
                        positionValues[4][3] = Math.round((positionValues[4][2]/playerData.strength)*1000)/10;
                        positionValues[5][0] = "ZROM";
                        positionValues[5][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*3+playerData.condition*1+playerData.speed*8+playerData.technique*8+playerData.shootingtechnique*7+playerData.shootingpower*1+playerData.header*2+playerData.duel*7+playerData.tactics*5+playerData.athletics*2)/45)*10)/10;
                        positionValues[5][2] = Math.round((positionValues[5][1]-playerData.strength)*10)/10;
                        positionValues[5][3] = Math.round((positionValues[5][2]/playerData.strength)*1000)/10;
                        positionValues[6][0] = "ROM";
                        positionValues[6][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*4+playerData.condition*1+playerData.speed*9+playerData.technique*8+playerData.shootingtechnique*8+playerData.shootingpower*1+playerData.header*1+playerData.duel*5+playerData.tactics*4+playerData.athletics*2)/44)*10)/10;
                        positionValues[6][2] = Math.round((positionValues[6][1]-playerData.strength)*10)/10;
                        positionValues[6][3] = Math.round((positionValues[6][2]/playerData.strength)*1000)/10;
                        positionValues[7][0] = "LST";
                        positionValues[7][1] = Math.round(((playerData.leftfoot*4+playerData.rightfoot*1+playerData.condition*1+playerData.speed*8+playerData.technique*9+playerData.shootingtechnique*8+playerData.shootingpower*1+playerData.header*3+playerData.duel*2+playerData.tactics*4+playerData.athletics*3)/44)*10)/10;
                        positionValues[7][2] = Math.round((positionValues[7][1]-playerData.strength)*10)/10;
                        positionValues[7][3] = Math.round((positionValues[7][2]/playerData.strength)*1000)/10;
                        positionValues[8][0] = "ST";
                        positionValues[8][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*1+playerData.condition*1+playerData.speed*8+playerData.technique*9+playerData.shootingtechnique*5+playerData.shootingpower*1+playerData.header*9+playerData.duel*2+playerData.tactics*3+playerData.athletics*7)/47)*10)/10;
                        positionValues[8][2] = Math.round((positionValues[8][1]-playerData.strength)*10)/10;
                        positionValues[8][3] = Math.round((positionValues[8][2]/playerData.strength)*1000)/10;
                        positionValues[9][0] = "RST";
                        positionValues[9][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*4+playerData.condition*1+playerData.speed*8+playerData.technique*9+playerData.shootingtechnique*8+playerData.shootingpower*1+playerData.header*3+playerData.duel*2+playerData.tactics*4+playerData.athletics*3)/44)*10)/10;
                        positionValues[9][2] = Math.round((positionValues[9][1]-playerData.strength)*10)/10;
                        positionValues[9][3] = Math.round((positionValues[9][2]/playerData.strength)*1000)/10;
                    break;
                    case 2: // 3-5-2 Dreierkette, Kompaktes Mittelfeld
                        positionValues[0][0] = "LIV";
                        positionValues[0][1] = Math.round(((playerData.leftfoot*7+playerData.rightfoot*1+playerData.condition*6+playerData.speed*6+playerData.technique*5+playerData.shootingtechnique*5+playerData.shootingpower*4+playerData.header*7+playerData.duel*8+playerData.tactics*6+playerData.athletics*6)/61)*10)/10;
                        positionValues[0][2] = Math.round((positionValues[0][1]-playerData.strength)*10)/10;
                        positionValues[0][3] = Math.round((positionValues[0][2]/playerData.strength)*1000)/10;
                        positionValues[1][0] = "ZIV";
                        positionValues[1][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*1+playerData.condition*1+playerData.speed*5+playerData.technique*2+playerData.shootingtechnique*3+playerData.shootingpower*2+playerData.header*9+playerData.duel*9+playerData.tactics*7+playerData.athletics*6)/46)*10)/10;
                        positionValues[1][2] = Math.round((positionValues[1][1]-playerData.strength)*10)/10;
                        positionValues[1][3] = Math.round((positionValues[1][2]/playerData.strength)*1000)/10;
                        positionValues[2][0] = "RIV";
                        positionValues[2][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*3+playerData.condition*1+playerData.speed*5+playerData.technique*3+playerData.shootingtechnique*4+playerData.shootingpower*2+playerData.header*7+playerData.duel*9+playerData.tactics*7+playerData.athletics*6)/48)*10)/10;
                        positionValues[2][2] = Math.round((positionValues[2][1]-playerData.strength)*10)/10;
                        positionValues[2][3] = Math.round((positionValues[2][2]/playerData.strength)*1000)/10;
                        positionValues[3][0] = "LDM";
                        positionValues[3][1] = Math.round(((playerData.leftfoot*7+playerData.rightfoot*1+playerData.condition*6+playerData.speed*6+playerData.technique*5+playerData.shootingtechnique*5+playerData.shootingpower*5+playerData.header*5+playerData.duel*7+playerData.tactics*6+playerData.athletics*6)/59)*10)/10;
                        positionValues[3][2] = Math.round((positionValues[3][1]-playerData.strength)*10)/10;
                        positionValues[3][3] = Math.round((positionValues[3][2]/playerData.strength)*1000)/10;
                        positionValues[4][0] = "RDM";
                        positionValues[4][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*3+playerData.condition*1+playerData.speed*3+playerData.technique*6+playerData.shootingtechnique*7+playerData.shootingpower*1+playerData.header*4+playerData.duel*9+playerData.tactics*7+playerData.athletics*1)/43)*10)/10;
                        positionValues[4][2] = Math.round((positionValues[4][1]-playerData.strength)*10)/10;
                        positionValues[4][3] = Math.round((positionValues[4][2]/playerData.strength)*1000)/10;
                        positionValues[5][0] = "LOM";
                        positionValues[5][1] = Math.round(((playerData.leftfoot*8+playerData.rightfoot*1+playerData.condition*8+playerData.speed*8+playerData.technique*7+playerData.shootingtechnique*6+playerData.shootingpower*5+playerData.header*4+playerData.duel*6+playerData.tactics*6+playerData.athletics*8)/67)*10)/10;
                        positionValues[5][2] = Math.round((positionValues[5][1]-playerData.strength)*10)/10;
                        positionValues[5][3] = Math.round((positionValues[5][2]/playerData.strength)*1000)/10;
                        positionValues[6][0] = "ZOM";
                        positionValues[6][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*1+playerData.condition*1+playerData.speed*4+playerData.technique*9+playerData.shootingtechnique*9+playerData.shootingpower*1+playerData.header*6+playerData.duel*4+playerData.tactics*8+playerData.athletics*4)/48)*10)/10;
                        positionValues[6][2] = Math.round((positionValues[6][1]-playerData.strength)*10)/10;
                        positionValues[6][3] = Math.round((positionValues[6][2]/playerData.strength)*1000)/10;
                        positionValues[7][0] = "ROM";
                        positionValues[7][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*3+playerData.condition*1+playerData.speed*8+playerData.technique*7+playerData.shootingtechnique*9+playerData.shootingpower*1+playerData.header*3+playerData.duel*5+playerData.tactics*4+playerData.athletics*4)/46)*10)/10;
                        positionValues[7][2] = Math.round((positionValues[7][1]-playerData.strength)*10)/10;
                        positionValues[7][3] = Math.round((positionValues[7][2]/playerData.strength)*1000)/10;
                        positionValues[8][0] = "ST(L)";
                        positionValues[8][1] = Math.round(((playerData.leftfoot*6+playerData.rightfoot*6+playerData.condition*5+playerData.speed*6+playerData.technique*5+playerData.shootingtechnique*6+playerData.shootingpower*7+playerData.header*7+playerData.duel*5+playerData.tactics*6+playerData.athletics*5)/64)*10)/10;
                        positionValues[8][2] = Math.round((positionValues[8][1]-playerData.strength)*10)/10;
                        positionValues[8][3] = Math.round((positionValues[8][2]/playerData.strength)*1000)/10;
                        positionValues[9][0] = "ST(R)";
                        positionValues[9][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*2+playerData.condition*1+playerData.speed*7+playerData.technique*7+playerData.shootingtechnique*5+playerData.shootingpower*1+playerData.header*3+playerData.duel*2+playerData.tactics*4+playerData.athletics*4)/37)*10)/10;
                        positionValues[9][2] = Math.round((positionValues[9][1]-playerData.strength)*10)/10;
                        positionValues[9][3] = Math.round((positionValues[9][2]/playerData.strength)*1000)/10;
                    break;
                    case 3: // 4-1-4-1 Defensiv, Konter
                        positionValues[0][0] = "LAV";
                        positionValues[0][1] = Math.round(((playerData.leftfoot*4+playerData.rightfoot*1+playerData.condition*1+playerData.speed*8+playerData.technique*4+playerData.shootingtechnique*8+playerData.shootingpower*1+playerData.header*1+playerData.duel*8+playerData.tactics*3+playerData.athletics*2)/41)*10)/10;
                        positionValues[0][2] = Math.round((positionValues[0][1]-playerData.strength)*10)/10;
                        positionValues[0][3] = Math.round((positionValues[0][2]/playerData.strength)*1000)/10;
                        positionValues[1][0] = "LIV";
                        positionValues[1][1] = Math.round(((playerData.leftfoot*3+playerData.rightfoot*1+playerData.condition*1+playerData.speed*2+playerData.technique*2+playerData.shootingtechnique*1+playerData.shootingpower*2+playerData.header*10+playerData.duel*10+playerData.tactics*8+playerData.athletics*6)/46)*10)/10;
                        positionValues[1][2] = Math.round((positionValues[1][1]-playerData.strength)*10)/10;
                        positionValues[1][3] = Math.round((positionValues[1][2]/playerData.strength)*1000)/10;
                        positionValues[2][0] = "RIV";
                        positionValues[2][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*3+playerData.condition*1+playerData.speed*2+playerData.technique*2+playerData.shootingtechnique*1+playerData.shootingpower*2+playerData.header*10+playerData.duel*10+playerData.tactics*8+playerData.athletics*6)/46)*10)/10;
                        positionValues[2][2] = Math.round((positionValues[2][1]-playerData.strength)*10)/10;
                        positionValues[2][3] = Math.round((positionValues[2][2]/playerData.strength)*1000)/10;
                        positionValues[3][0] = "RAV";
                        positionValues[3][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*4+playerData.condition*1+playerData.speed*8+playerData.technique*4+playerData.shootingtechnique*8+playerData.shootingpower*1+playerData.header*1+playerData.duel*8+playerData.tactics*3+playerData.athletics*2)/41)*10)/10;
                        positionValues[3][2] = Math.round((positionValues[3][1]-playerData.strength)*10)/10;
                        positionValues[3][3] = Math.round((positionValues[3][2]/playerData.strength)*1000)/10;
                        positionValues[4][0] = "DM";
                        positionValues[4][1] = Math.round(((playerData.leftfoot*7+playerData.rightfoot*7+playerData.condition*8+playerData.speed*8+playerData.technique*7+playerData.shootingtechnique*6+playerData.shootingpower*5+playerData.header*8+playerData.duel*8+playerData.tactics*10+playerData.athletics*8)/82)*10)/10;
                        positionValues[4][2] = Math.round((positionValues[4][1]-playerData.strength)*10)/10;
                        positionValues[4][3] = Math.round((positionValues[4][2]/playerData.strength)*1000)/10;
                        positionValues[5][0] = "LOM";
                        positionValues[5][1] = Math.round(((playerData.leftfoot*4+playerData.rightfoot*1+playerData.condition*2+playerData.speed*8+playerData.technique*9+playerData.shootingtechnique*7+playerData.shootingpower*1+playerData.header*2+playerData.duel*1+playerData.tactics*8+playerData.athletics*5)/48)*10)/10;
                        positionValues[5][2] = Math.round((positionValues[5][1]-playerData.strength)*10)/10;
                        positionValues[5][3] = Math.round((positionValues[5][2]/playerData.strength)*1000)/10;
                        positionValues[6][0] = "ZOM(L)";
                        positionValues[6][1] = Math.round(((playerData.leftfoot*3+playerData.rightfoot*1+playerData.condition*1+playerData.speed*8+playerData.technique*5+playerData.shootingtechnique*7+playerData.shootingpower*1+playerData.header*3+playerData.duel*6+playerData.tactics*7+playerData.athletics*5)/47)*10)/10;
                        positionValues[6][2] = Math.round((positionValues[6][1]-playerData.strength)*10)/10;
                        positionValues[6][3] = Math.round((positionValues[6][2]/playerData.strength)*1000)/10;
                        positionValues[7][0] = "ZOM(R)";
                        positionValues[7][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*3+playerData.condition*1+playerData.speed*8+playerData.technique*5+playerData.shootingtechnique*7+playerData.shootingpower*1+playerData.header*3+playerData.duel*6+playerData.tactics*7+playerData.athletics*5)/47)*10)/10;
                        positionValues[7][2] = Math.round((positionValues[7][1]-playerData.strength)*10)/10;
                        positionValues[7][3] = Math.round((positionValues[7][2]/playerData.strength)*1000)/10;
                        positionValues[8][0] = "ROM";
                        positionValues[8][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*4+playerData.condition*2+playerData.speed*8+playerData.technique*6+playerData.shootingtechnique*7+playerData.shootingpower*1+playerData.header*2+playerData.duel*1+playerData.tactics*8+playerData.athletics*5)/45)*10)/10;
                        positionValues[8][2] = Math.round((positionValues[8][1]-playerData.strength)*10)/10;
                        positionValues[8][3] = Math.round((positionValues[8][2]/playerData.strength)*1000)/10;
                        positionValues[9][0] = "ST";
                        positionValues[9][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*1+playerData.condition*1+playerData.speed*8+playerData.technique*7+playerData.shootingtechnique*7+playerData.shootingpower*1+playerData.header*8+playerData.duel*5+playerData.tactics*3+playerData.athletics*6)/48)*10)/10;
                        positionValues[9][2] = Math.round((positionValues[9][1]-playerData.strength)*10)/10;
                        positionValues[9][3] = Math.round((positionValues[9][2]/playerData.strength)*1000)/10;
                    break;
                    case 4: // 4-1-5-0 Falsche Neun
                        positionValues[0][0] = "LAV";
                        positionValues[0][1] = Math.round(((playerData.leftfoot*3+playerData.rightfoot*1+playerData.condition*1+playerData.speed*8+playerData.technique*6+playerData.shootingtechnique*8+playerData.shootingpower*1+playerData.header*1+playerData.duel*8+playerData.tactics*7+playerData.athletics*1)/45)*10)/10;
                        positionValues[0][2] = Math.round((positionValues[0][1]-playerData.strength)*10)/10;
                        positionValues[0][3] = Math.round((positionValues[0][2]/playerData.strength)*1000)/10;
                        positionValues[1][0] = "LIV";
                        positionValues[1][1] = Math.round(((playerData.leftfoot*4+playerData.rightfoot*1+playerData.condition*1+playerData.speed*7+playerData.technique*4+playerData.shootingtechnique*6+playerData.shootingpower*1+playerData.header*9+playerData.duel*10+playerData.tactics*8+playerData.athletics*6)/57)*10)/10;
                        positionValues[1][2] = Math.round((positionValues[1][1]-playerData.strength)*10)/10;
                        positionValues[1][3] = Math.round((positionValues[1][2]/playerData.strength)*1000)/10;
                        positionValues[2][0] = "RIV";
                        positionValues[2][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*4+playerData.condition*1+playerData.speed*7+playerData.technique*4+playerData.shootingtechnique*6+playerData.shootingpower*1+playerData.header*9+playerData.duel*10+playerData.tactics*8+playerData.athletics*6)/57)*10)/10;
                        positionValues[2][2] = Math.round((positionValues[2][1]-playerData.strength)*10)/10;
                        positionValues[2][3] = Math.round((positionValues[2][2]/playerData.strength)*1000)/10;
                        positionValues[3][0] = "RAV";
                        positionValues[3][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*3+playerData.condition*1+playerData.speed*8+playerData.technique*6+playerData.shootingtechnique*8+playerData.shootingpower*1+playerData.header*1+playerData.duel*8+playerData.tactics*7+playerData.athletics*1)/45)*10)/10;
                        positionValues[3][2] = Math.round((positionValues[3][1]-playerData.strength)*10)/10;
                        positionValues[3][3] = Math.round((positionValues[3][2]/playerData.strength)*1000)/10;
                        positionValues[4][0] = "DM";
                        positionValues[4][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*1+playerData.condition*2+playerData.speed*5+playerData.technique*7+playerData.shootingtechnique*3+playerData.shootingpower*2+playerData.header*5+playerData.duel*9+playerData.tactics*7+playerData.athletics*6)/48)*10)/10;
                        positionValues[4][2] = Math.round((positionValues[4][1]-playerData.strength)*10)/10;
                        positionValues[4][3] = Math.round((positionValues[4][2]/playerData.strength)*1000)/10;
                        positionValues[5][0] = "LOM";
                        positionValues[5][1] = Math.round(((playerData.leftfoot*3+playerData.rightfoot*1+playerData.condition*1+playerData.speed*8+playerData.technique*8+playerData.shootingtechnique*8+playerData.shootingpower*1+playerData.header*2+playerData.duel*3+playerData.tactics*7+playerData.athletics*3)/45)*10)/10;
                        positionValues[5][2] = Math.round((positionValues[5][1]-playerData.strength)*10)/10;
                        positionValues[5][3] = Math.round((positionValues[5][2]/playerData.strength)*1000)/10;
                        positionValues[6][0] = "ZOM";
                        positionValues[6][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*1+playerData.condition*1+playerData.speed*8+playerData.technique*9+playerData.shootingtechnique*7+playerData.shootingpower*1+playerData.header*2+playerData.duel*4+playerData.tactics*8+playerData.athletics*3)/45)*10)/10;
                        positionValues[6][2] = Math.round((positionValues[6][1]-playerData.strength)*10)/10;
                        positionValues[6][3] = Math.round((positionValues[6][2]/playerData.strength)*1000)/10;
                        positionValues[7][0] = "ROM";
                        positionValues[7][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*3+playerData.condition*1+playerData.speed*8+playerData.technique*8+playerData.shootingtechnique*8+playerData.shootingpower*1+playerData.header*2+playerData.duel*3+playerData.tactics*7+playerData.athletics*3)/45)*10)/10;
                        positionValues[7][2] = Math.round((positionValues[7][1]-playerData.strength)*10)/10;
                        positionValues[7][3] = Math.round((positionValues[7][2]/playerData.strength)*1000)/10;
                        positionValues[8][0] = "LST";
                        positionValues[8][1] = Math.round(((playerData.leftfoot*4+playerData.rightfoot*1+playerData.condition*1+playerData.speed*8+playerData.technique*8+playerData.shootingtechnique*9+playerData.shootingpower*1+playerData.header*1+playerData.duel*2+playerData.tactics*7+playerData.athletics*2)/44)*10)/10;
                        positionValues[8][2] = Math.round((positionValues[8][1]-playerData.strength)*10)/10;
                        positionValues[8][3] = Math.round((positionValues[8][2]/playerData.strength)*1000)/10;
                        positionValues[9][0] = "RST";
                        positionValues[9][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*4+playerData.condition*1+playerData.speed*8+playerData.technique*8+playerData.shootingtechnique*9+playerData.shootingpower*1+playerData.header*1+playerData.duel*2+playerData.tactics*7+playerData.athletics*2)/44)*10)/10;
                        positionValues[9][2] = Math.round((positionValues[9][1]-playerData.strength)*10)/10;
                        positionValues[9][3] = Math.round((positionValues[9][2]/playerData.strength)*1000)/10;
                    break;
                    case 5: // 4-2-3-1 Defensiv, Konter
                        positionValues[0][0] = "LAV";
                        positionValues[0][1] = Math.round(((playerData.leftfoot*3+playerData.rightfoot*1+playerData.condition*1+playerData.speed*7+playerData.technique*4+playerData.shootingtechnique*7+playerData.shootingpower*1+playerData.header*2+playerData.duel*9+playerData.tactics*7+playerData.athletics*2)/44)*10)/10;
                        positionValues[0][2] = Math.round((positionValues[0][1]-playerData.strength)*10)/10;
                        positionValues[0][3] = Math.round((positionValues[0][2]/playerData.strength)*1000)/10;
                        positionValues[1][0] = "LIV";
                        positionValues[1][1] = Math.round(((playerData.leftfoot*4+playerData.rightfoot*1+playerData.condition*1+playerData.speed*1+playerData.technique*2+playerData.shootingtechnique*2+playerData.shootingpower*2+playerData.header*10+playerData.duel*10+playerData.tactics*8+playerData.athletics*4)/45)*10)/10;
                        positionValues[1][2] = Math.round((positionValues[1][1]-playerData.strength)*10)/10;
                        positionValues[1][3] = Math.round((positionValues[1][2]/playerData.strength)*1000)/10;
                        positionValues[2][0] = "RIV";
                        positionValues[2][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*4+playerData.condition*1+playerData.speed*1+playerData.technique*2+playerData.shootingtechnique*2+playerData.shootingpower*2+playerData.header*10+playerData.duel*10+playerData.tactics*8+playerData.athletics*4)/45)*10)/10;
                        positionValues[2][2] = Math.round((positionValues[2][1]-playerData.strength)*10)/10;
                        positionValues[2][3] = Math.round((positionValues[2][2]/playerData.strength)*1000)/10;
                        positionValues[3][0] = "RAV";
                        positionValues[3][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*3+playerData.condition*1+playerData.speed*7+playerData.technique*4+playerData.shootingtechnique*7+playerData.shootingpower*1+playerData.header*2+playerData.duel*9+playerData.tactics*7+playerData.athletics*2)/44)*10)/10;
                        positionValues[3][2] = Math.round((positionValues[3][1]-playerData.strength)*10)/10;
                        positionValues[3][3] = Math.round((positionValues[3][2]/playerData.strength)*1000)/10;
                        positionValues[4][0] = "LDM";
                        positionValues[4][1] = Math.round(((playerData.leftfoot*3+playerData.rightfoot*1+playerData.condition*1+playerData.speed*2+playerData.technique*6+playerData.shootingtechnique*8+playerData.shootingpower*1+playerData.header*5+playerData.duel*10+playerData.tactics*3+playerData.athletics*5)/45)*10)/10;
                        positionValues[4][2] = Math.round((positionValues[4][1]-playerData.strength)*10)/10;
                        positionValues[4][3] = Math.round((positionValues[4][2]/playerData.strength)*1000)/10;
                        positionValues[5][0] = "LDM(O)";
                        positionValues[5][1] = Math.round(((playerData.leftfoot*3+playerData.rightfoot*1+playerData.condition*2+playerData.speed*7+playerData.technique*7+playerData.shootingtechnique*8+playerData.shootingpower*1+playerData.header*1+playerData.duel*6+playerData.tactics*7+playerData.athletics*2)/45)*10)/10;
                        positionValues[5][2] = Math.round((positionValues[5][1]-playerData.strength)*10)/10;
                        positionValues[5][3] = Math.round((positionValues[5][2]/playerData.strength)*1000)/10;
                        positionValues[6][0] = "RDM(O)";
                        positionValues[6][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*3+playerData.condition*2+playerData.speed*7+playerData.technique*7+playerData.shootingtechnique*8+playerData.shootingpower*1+playerData.header*1+playerData.duel*6+playerData.tactics*7+playerData.athletics*2)/45)*10)/10;
                        positionValues[6][2] = Math.round((positionValues[6][1]-playerData.strength)*10)/10;
                        positionValues[6][3] = Math.round((positionValues[6][2]/playerData.strength)*1000)/10;
                        positionValues[7][0] = "RDM";
                        positionValues[7][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*3+playerData.condition*1+playerData.speed*2+playerData.technique*6+playerData.shootingtechnique*8+playerData.shootingpower*1+playerData.header*5+playerData.duel*10+playerData.tactics*3+playerData.athletics*5)/45)*10)/10;
                        positionValues[7][2] = Math.round((positionValues[7][1]-playerData.strength)*10)/10;
                        positionValues[7][3] = Math.round((positionValues[7][2]/playerData.strength)*1000)/10;
                        positionValues[8][0] = "ZOM";
                        positionValues[8][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*1+playerData.condition*1+playerData.speed*8+playerData.technique*8+playerData.shootingtechnique*9+playerData.shootingpower*1+playerData.header*6+playerData.duel*3+playerData.tactics*6+playerData.athletics*4)/48)*10)/10;
                        positionValues[8][2] = Math.round((positionValues[8][1]-playerData.strength)*10)/10;
                        positionValues[8][3] = Math.round((positionValues[8][2]/playerData.strength)*1000)/10;
                        positionValues[9][0] = "ST";
                        positionValues[9][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*1+playerData.condition*2+playerData.speed*9+playerData.technique*4+playerData.shootingtechnique*5+playerData.shootingpower*1+playerData.header*7+playerData.duel*3+playerData.tactics*6+playerData.athletics*7)/46)*10)/10;
                        positionValues[9][2] = Math.round((positionValues[9][1]-playerData.strength)*10)/10;
                        positionValues[9][3] = Math.round((positionValues[9][2]/playerData.strength)*1000)/10;
                    break;
                    case 6: // 4-2-3-1 Kontrollierte Offensive
                        positionValues[0][0] = "LAV";
                        positionValues[0][1] = Math.round(((playerData.leftfoot*8+playerData.rightfoot*1+playerData.condition*7+playerData.speed*7+playerData.technique*4+playerData.shootingtechnique*5+playerData.shootingpower*5+playerData.header*4+playerData.duel*8+playerData.tactics*6+playerData.athletics*4)/59)*10)/10;
                        positionValues[0][2] = Math.round((positionValues[0][1]-playerData.strength)*10)/10;
                        positionValues[0][3] = Math.round((positionValues[0][2]/playerData.strength)*1000)/10;
                        positionValues[1][0] = "LIV";
                        positionValues[1][1] = Math.round(((playerData.leftfoot*8+playerData.rightfoot*1+playerData.condition*3+playerData.speed*6+playerData.technique*4+playerData.shootingtechnique*3+playerData.shootingpower*4+playerData.header*8+playerData.duel*9+playerData.tactics*6+playerData.athletics*4)/56)*10)/10;
                        positionValues[1][2] = Math.round((positionValues[1][1]-playerData.strength)*10)/10;
                        positionValues[1][3] = Math.round((positionValues[1][2]/playerData.strength)*1000)/10;
                        positionValues[2][0] = "RIV";
                        positionValues[2][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*4+playerData.condition*1+playerData.speed*2+playerData.technique*2+playerData.shootingtechnique*6+playerData.shootingpower*1+playerData.header*10+playerData.duel*10+playerData.tactics*7+playerData.athletics*4)/48)*10)/10;
                        positionValues[2][2] = Math.round((positionValues[2][1]-playerData.strength)*10)/10;
                        positionValues[2][3] = Math.round((positionValues[2][2]/playerData.strength)*1000)/10;
                        positionValues[3][0] = "RAV";
                        positionValues[3][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*4+playerData.condition*1+playerData.speed*7+playerData.technique*4+playerData.shootingtechnique*8+playerData.shootingpower*2+playerData.header*1+playerData.duel*10+playerData.tactics*6+playerData.athletics*1)/45)*10)/10;
                        positionValues[3][2] = Math.round((positionValues[3][1]-playerData.strength)*10)/10;
                        positionValues[3][3] = Math.round((positionValues[3][2]/playerData.strength)*1000)/10;
                        positionValues[4][0] = "LDM";
                        positionValues[4][1] = Math.round(((playerData.leftfoot*3+playerData.rightfoot*1+playerData.condition*1+playerData.speed*2+playerData.technique*1+playerData.shootingtechnique*7+playerData.shootingpower*3+playerData.header*6+playerData.duel*9+playerData.tactics*6+playerData.athletics*4)/43)*10)/10;
                        positionValues[4][2] = Math.round((positionValues[4][1]-playerData.strength)*10)/10;
                        positionValues[4][3] = Math.round((positionValues[4][2]/playerData.strength)*1000)/10;
                        positionValues[5][0] = "RDM";
                        positionValues[5][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*3+playerData.condition*1+playerData.speed*2+playerData.technique*1+playerData.shootingtechnique*7+playerData.shootingpower*3+playerData.header*6+playerData.duel*9+playerData.tactics*6+playerData.athletics*4)/43)*10)/10;
                        positionValues[5][2] = Math.round((positionValues[5][1]-playerData.strength)*10)/10;
                        positionValues[5][3] = Math.round((positionValues[5][2]/playerData.strength)*1000)/10;
                        positionValues[6][0] = "LOM";
                        positionValues[6][1] = Math.round(((playerData.leftfoot*4+playerData.rightfoot*1+playerData.condition*2+playerData.speed*10+playerData.technique*5+playerData.shootingtechnique*8+playerData.shootingpower*2+playerData.header*1+playerData.duel*4+playerData.tactics*6+playerData.athletics*2)/45)*10)/10;
                        positionValues[6][2] = Math.round((positionValues[6][1]-playerData.strength)*10)/10;
                        positionValues[6][3] = Math.round((positionValues[6][2]/playerData.strength)*1000)/10;
                        positionValues[7][0] = "ZOM";
                        positionValues[7][1] = Math.round(((playerData.leftfoot*6+playerData.rightfoot*6+playerData.condition*7+playerData.speed*6+playerData.technique*8+playerData.shootingtechnique*7+playerData.shootingpower*6+playerData.header*6+playerData.duel*4+playerData.tactics*6+playerData.athletics*5)/67)*10)/10;
                        positionValues[7][2] = Math.round((positionValues[7][1]-playerData.strength)*10)/10;
                        positionValues[7][3] = Math.round((positionValues[7][2]/playerData.strength)*1000)/10;
                        positionValues[8][0] = "ROM";
                        positionValues[8][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*4+playerData.condition*2+playerData.speed*10+playerData.technique*5+playerData.shootingtechnique*8+playerData.shootingpower*2+playerData.header*1+playerData.duel*4+playerData.tactics*6+playerData.athletics*2)/45)*10)/10;
                        positionValues[8][2] = Math.round((positionValues[8][1]-playerData.strength)*10)/10;
                        positionValues[8][3] = Math.round((positionValues[8][2]/playerData.strength)*1000)/10;
                        positionValues[9][0] = "ST";
                        positionValues[9][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*1+playerData.condition*1+playerData.speed*9+playerData.technique*4+playerData.shootingtechnique*4+playerData.shootingpower*1+playerData.header*8+playerData.duel*5+playerData.tactics*2+playerData.athletics*8)/44)*10)/10;
                        positionValues[9][2] = Math.round((positionValues[9][1]-playerData.strength)*10)/10;
                        positionValues[9][3] = Math.round((positionValues[9][2]/playerData.strength)*1000)/10;
                    break;
                    case 7: // 4-2-4-0 Falsche Neun
                        positionValues[0][0] = "LAV";
                        positionValues[0][1] = Math.round(((playerData.leftfoot*3+playerData.rightfoot*1+playerData.condition*1+playerData.speed*8+playerData.technique*5+playerData.shootingtechnique*8+playerData.shootingpower*1+playerData.header*1+playerData.duel*8+playerData.tactics*5+playerData.athletics*1)/42)*10)/10;
                        positionValues[0][2] = Math.round((positionValues[0][1]-playerData.strength)*10)/10;
                        positionValues[0][3] = Math.round((positionValues[0][2]/playerData.strength)*1000)/10;
                        positionValues[1][0] = "LIV";
                        positionValues[1][1] = Math.round(((playerData.leftfoot*4+playerData.rightfoot*1+playerData.condition*1+playerData.speed*7+playerData.technique*4+playerData.shootingtechnique*6+playerData.shootingpower*1+playerData.header*9+playerData.duel*9+playerData.tactics*7+playerData.athletics*6)/55)*10)/10;
                        positionValues[1][2] = Math.round((positionValues[1][1]-playerData.strength)*10)/10;
                        positionValues[1][3] = Math.round((positionValues[1][2]/playerData.strength)*1000)/10;
                        positionValues[2][0] = "RIV";
                        positionValues[2][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*4+playerData.condition*1+playerData.speed*7+playerData.technique*4+playerData.shootingtechnique*6+playerData.shootingpower*1+playerData.header*9+playerData.duel*9+playerData.tactics*7+playerData.athletics*6)/55)*10)/10;
                        positionValues[2][2] = Math.round((positionValues[2][1]-playerData.strength)*10)/10;
                        positionValues[2][3] = Math.round((positionValues[2][2]/playerData.strength)*1000)/10;
                        positionValues[3][0] = "RAV";
                        positionValues[3][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*3+playerData.condition*1+playerData.speed*8+playerData.technique*5+playerData.shootingtechnique*8+playerData.shootingpower*1+playerData.header*1+playerData.duel*8+playerData.tactics*5+playerData.athletics*1)/42)*10)/10;
                        positionValues[3][2] = Math.round((positionValues[3][1]-playerData.strength)*10)/10;
                        positionValues[3][3] = Math.round((positionValues[3][2]/playerData.strength)*1000)/10;
                        positionValues[4][0] = "LDM";
                        positionValues[4][1] = Math.round(((playerData.leftfoot*3+playerData.rightfoot*1+playerData.condition*1+playerData.speed*2+playerData.technique*5+playerData.shootingtechnique*6+playerData.shootingpower*2+playerData.header*5+playerData.duel*8+playerData.tactics*3+playerData.athletics*5)/41)*10)/10;
                        positionValues[4][2] = Math.round((positionValues[4][1]-playerData.strength)*10)/10;
                        positionValues[4][3] = Math.round((positionValues[4][2]/playerData.strength)*1000)/10;
                        positionValues[5][0] = "RDM";
                        positionValues[5][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*3+playerData.condition*1+playerData.speed*2+playerData.technique*5+playerData.shootingtechnique*6+playerData.shootingpower*2+playerData.header*5+playerData.duel*8+playerData.tactics*3+playerData.athletics*5)/41)*10)/10;
                        positionValues[5][2] = Math.round((positionValues[5][1]-playerData.strength)*10)/10;
                        positionValues[5][3] = Math.round((positionValues[5][2]/playerData.strength)*1000)/10;
                        positionValues[6][0] = "LOM";
                        positionValues[6][1] = Math.round(((playerData.leftfoot*4+playerData.rightfoot*1+playerData.condition*1+playerData.speed*8+playerData.technique*8+playerData.shootingtechnique*9+playerData.shootingpower*1+playerData.header*1+playerData.duel*2+playerData.tactics*5+playerData.athletics*2)/42)*10)/10;
                        positionValues[6][2] = Math.round((positionValues[6][1]-playerData.strength)*10)/10;
                        positionValues[6][3] = Math.round((positionValues[6][2]/playerData.strength)*1000)/10;
                        positionValues[7][0] = "ZOM(L)";
                        positionValues[7][1] = Math.round(((playerData.leftfoot*3+playerData.rightfoot*1+playerData.condition*1+playerData.speed*7+playerData.technique*9+playerData.shootingtechnique*8+playerData.shootingpower*1+playerData.header*4+playerData.duel*4+playerData.tactics*5+playerData.athletics*3)/46)*10)/10;
                        positionValues[7][2] = Math.round((positionValues[7][1]-playerData.strength)*10)/10;
                        positionValues[7][3] = Math.round((positionValues[7][2]/playerData.strength)*1000)/10;
                        positionValues[8][0] = "ZOM(R)";
                        positionValues[8][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*3+playerData.condition*1+playerData.speed*7+playerData.technique*9+playerData.shootingtechnique*8+playerData.shootingpower*1+playerData.header*4+playerData.duel*4+playerData.tactics*5+playerData.athletics*3)/46)*10)/10;
                        positionValues[8][2] = Math.round((positionValues[8][1]-playerData.strength)*10)/10;
                        positionValues[8][3] = Math.round((positionValues[8][2]/playerData.strength)*1000)/10;
                        positionValues[9][0] = "ROM";
                        positionValues[9][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*4+playerData.condition*1+playerData.speed*8+playerData.technique*8+playerData.shootingtechnique*9+playerData.shootingpower*1+playerData.header*1+playerData.duel*2+playerData.tactics*5+playerData.athletics*2)/42)*10)/10;
                        positionValues[9][2] = Math.round((positionValues[9][1]-playerData.strength)*10)/10;
                        positionValues[9][3] = Math.round((positionValues[9][2]/playerData.strength)*1000)/10;
                    break;
                    case 8: // 4-3-3 Halb offensiv, Konter
                        positionValues[0][0] = "LAV";
                        positionValues[0][1] = Math.round(((playerData.leftfoot*4+playerData.rightfoot*1+playerData.condition*2+playerData.speed*7+playerData.technique*3+playerData.shootingtechnique*7+playerData.shootingpower*2+playerData.header*1+playerData.duel*10+playerData.tactics*6+playerData.athletics*1)/44)*10)/10;
                        positionValues[0][2] = Math.round((positionValues[0][1]-playerData.strength)*10)/10;
                        positionValues[0][3] = Math.round((positionValues[0][2]/playerData.strength)*1000)/10;
                        positionValues[1][0] = "LIV";
                        positionValues[1][1] = Math.round(((playerData.leftfoot*4+playerData.rightfoot*1+playerData.condition*1+playerData.speed*2+playerData.technique*2+playerData.shootingtechnique*3+playerData.shootingpower*1+playerData.header*10+playerData.duel*10+playerData.tactics*8+playerData.athletics*4)/46)*10)/10;
                        positionValues[1][2] = Math.round((positionValues[1][1]-playerData.strength)*10)/10;
                        positionValues[1][3] = Math.round((positionValues[1][2]/playerData.strength)*1000)/10;
                        positionValues[2][0] = "RIV";
                        positionValues[2][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*4+playerData.condition*1+playerData.speed*2+playerData.technique*2+playerData.shootingtechnique*3+playerData.shootingpower*1+playerData.header*10+playerData.duel*10+playerData.tactics*8+playerData.athletics*4)/46)*10)/10;
                        positionValues[2][2] = Math.round((positionValues[2][1]-playerData.strength)*10)/10;
                        positionValues[2][3] = Math.round((positionValues[2][2]/playerData.strength)*1000)/10;
                        positionValues[3][0] = "RAV";
                        positionValues[3][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*4+playerData.condition*2+playerData.speed*7+playerData.technique*3+playerData.shootingtechnique*7+playerData.shootingpower*2+playerData.header*1+playerData.duel*10+playerData.tactics*6+playerData.athletics*1)/44)*10)/10;
                        positionValues[3][2] = Math.round((positionValues[3][1]-playerData.strength)*10)/10;
                        positionValues[3][3] = Math.round((positionValues[3][2]/playerData.strength)*1000)/10;
                        positionValues[4][0] = "DM";
                        positionValues[4][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*1+playerData.condition*1+playerData.speed*2+playerData.technique*2+playerData.shootingtechnique*7+playerData.shootingpower*3+playerData.header*8+playerData.duel*10+playerData.tactics*7+playerData.athletics*5)/47)*10)/10;
                        positionValues[4][2] = Math.round((positionValues[4][1]-playerData.strength)*10)/10;
                        positionValues[4][3] = Math.round((positionValues[4][2]/playerData.strength)*1000)/10;
                        positionValues[5][0] = "LOM";
                        positionValues[5][1] = Math.round(((playerData.leftfoot*3+playerData.rightfoot*1+playerData.condition*2+playerData.speed*4+playerData.technique*4+playerData.shootingtechnique*6+playerData.shootingpower*2+playerData.header*3+playerData.duel*8+playerData.tactics*7+playerData.athletics*2)/42)*10)/10;
                        positionValues[5][2] = Math.round((positionValues[5][1]-playerData.strength)*10)/10;
                        positionValues[5][3] = Math.round((positionValues[5][2]/playerData.strength)*1000)/10;
                        positionValues[6][0] = "ROM";
                        positionValues[6][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*3+playerData.condition*2+playerData.speed*4+playerData.technique*4+playerData.shootingtechnique*6+playerData.shootingpower*2+playerData.header*3+playerData.duel*8+playerData.tactics*7+playerData.athletics*2)/42)*10)/10;
                        positionValues[6][2] = Math.round((positionValues[6][1]-playerData.strength)*10)/10;
                        positionValues[6][3] = Math.round((positionValues[6][2]/playerData.strength)*1000)/10;
                        positionValues[7][0] = "LST";
                        positionValues[7][1] = Math.round(((playerData.leftfoot*5+playerData.rightfoot*1+playerData.condition*2+playerData.speed*10+playerData.technique*7+playerData.shootingtechnique*9+playerData.shootingpower*3+playerData.header*2+playerData.duel*2+playerData.tactics*8+playerData.athletics*2)/51)*10)/10;
                        positionValues[7][2] = Math.round((positionValues[7][1]-playerData.strength)*10)/10;
                        positionValues[7][3] = Math.round((positionValues[7][2]/playerData.strength)*1000)/10;
                        positionValues[8][0] = "ST";
                        positionValues[8][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*1+playerData.condition*2+playerData.speed*10+playerData.technique*3+playerData.shootingtechnique*7+playerData.shootingpower*1+playerData.header*9+playerData.duel*4+playerData.tactics*5+playerData.athletics*4)/47)*10)/10;
                        positionValues[8][2] = Math.round((positionValues[8][1]-playerData.strength)*10)/10;
                        positionValues[8][3] = Math.round((positionValues[8][2]/playerData.strength)*1000)/10;
                        positionValues[9][0] = "RST";
                        positionValues[9][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*5+playerData.condition*2+playerData.speed*10+playerData.technique*7+playerData.shootingtechnique*9+playerData.shootingpower*3+playerData.header*2+playerData.duel*2+playerData.tactics*8+playerData.athletics*2)/51)*10)/10;
                        positionValues[9][2] = Math.round((positionValues[9][1]-playerData.strength)*10)/10;
                        positionValues[9][3] = Math.round((positionValues[9][2]/playerData.strength)*1000)/10;
                    break;
                    case 9: // 4-3-3 Offensiv
                        positionValues[0][0] = "LAV";
                        positionValues[0][1] = Math.round(((playerData.leftfoot*2+playerData.rightfoot*1+playerData.condition*2+playerData.speed*9+playerData.technique*7+playerData.shootingtechnique*9+playerData.shootingpower*1+playerData.header*1+playerData.duel*8+playerData.tactics*7+playerData.athletics*1)/48)*10)/10;
                        positionValues[0][2] = Math.round((positionValues[0][1]-playerData.strength)*10)/10;
                        positionValues[0][3] = Math.round((positionValues[0][2]/playerData.strength)*1000)/10;
                        positionValues[1][0] = "LIV";
                        positionValues[1][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*4+playerData.condition*1+playerData.speed*10+playerData.technique*5+playerData.shootingtechnique*7+playerData.shootingpower*1+playerData.header*8+playerData.duel*10+playerData.tactics*10+playerData.athletics*7)/64)*10)/10;
                        positionValues[1][2] = Math.round((positionValues[1][1]-playerData.strength)*10)/10;
                        positionValues[1][3] = Math.round((positionValues[1][2]/playerData.strength)*1000)/10;
                        positionValues[2][0] = "RIV";
                        positionValues[2][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*4+playerData.condition*1+playerData.speed*10+playerData.technique*5+playerData.shootingtechnique*7+playerData.shootingpower*1+playerData.header*8+playerData.duel*10+playerData.tactics*10+playerData.athletics*7)/64)*10)/10;
                        positionValues[2][2] = Math.round((positionValues[2][1]-playerData.strength)*10)/10;
                        positionValues[2][3] = Math.round((positionValues[2][2]/playerData.strength)*1000)/10;
                        positionValues[3][0] = "RAV";
                        positionValues[3][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*2+playerData.condition*2+playerData.speed*9+playerData.technique*7+playerData.shootingtechnique*9+playerData.shootingpower*1+playerData.header*1+playerData.duel*8+playerData.tactics*7+playerData.athletics*1)/48)*10)/10;
                        positionValues[3][2] = Math.round((positionValues[3][1]-playerData.strength)*10)/10;
                        positionValues[3][3] = Math.round((positionValues[3][2]/playerData.strength)*1000)/10;
                        positionValues[4][0] = "DM";
                        positionValues[4][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*1+playerData.condition*2+playerData.speed*4+playerData.technique*8+playerData.shootingtechnique*3+playerData.shootingpower*3+playerData.header*5+playerData.duel*8+playerData.tactics*8+playerData.athletics*8)/51)*10)/10;
                        positionValues[4][2] = Math.round((positionValues[4][1]-playerData.strength)*10)/10;
                        positionValues[4][3] = Math.round((positionValues[4][2]/playerData.strength)*1000)/10;
                        positionValues[5][0] = "LOM";
                        positionValues[5][1] = Math.round(((playerData.leftfoot*3+playerData.rightfoot*1+playerData.condition*1+playerData.speed*8+playerData.technique*9+playerData.shootingtechnique*8+playerData.shootingpower*1+playerData.header*1+playerData.duel*4+playerData.tactics*4+playerData.athletics*2)/42)*10)/10;
                        positionValues[5][2] = Math.round((positionValues[5][1]-playerData.strength)*10)/10;
                        positionValues[5][3] = Math.round((positionValues[5][2]/playerData.strength)*1000)/10;
                        positionValues[6][0] = "ROM";
                        positionValues[6][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*3+playerData.condition*1+playerData.speed*8+playerData.technique*9+playerData.shootingtechnique*8+playerData.shootingpower*1+playerData.header*1+playerData.duel*4+playerData.tactics*4+playerData.athletics*2)/42)*10)/10;
                        positionValues[6][2] = Math.round((positionValues[6][1]-playerData.strength)*10)/10;
                        positionValues[6][3] = Math.round((positionValues[6][2]/playerData.strength)*1000)/10;
                        positionValues[7][0] = "LST";
                        positionValues[7][1] = Math.round(((playerData.leftfoot*4+playerData.rightfoot*1+playerData.condition*1+playerData.speed*9+playerData.technique*9+playerData.shootingtechnique*8+playerData.shootingpower*1+playerData.header*1+playerData.duel*2+playerData.tactics*4+playerData.athletics*4)/44)*10)/10;
                        positionValues[7][2] = Math.round((positionValues[7][1]-playerData.strength)*10)/10;
                        positionValues[7][3] = Math.round((positionValues[7][2]/playerData.strength)*1000)/10;
                        positionValues[8][0] = "ST";
                        positionValues[8][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*1+playerData.condition*1+playerData.speed*7+playerData.technique*7+playerData.shootingtechnique*2+playerData.shootingpower*1+playerData.header*9+playerData.duel*4+playerData.tactics*2+playerData.athletics*7)/42)*10)/10;
                        positionValues[8][2] = Math.round((positionValues[8][1]-playerData.strength)*10)/10;
                        positionValues[8][3] = Math.round((positionValues[8][2]/playerData.strength)*1000)/10;
                        positionValues[9][0] = "RST";
                        positionValues[9][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*4+playerData.condition*1+playerData.speed*9+playerData.technique*9+playerData.shootingtechnique*8+playerData.shootingpower*1+playerData.header*1+playerData.duel*2+playerData.tactics*4+playerData.athletics*4)/44)*10)/10;
                        positionValues[9][2] = Math.round((positionValues[9][1]-playerData.strength)*10)/10;
                        positionValues[9][3] = Math.round((positionValues[9][2]/playerData.strength)*1000)/10;
                    break;
                    case 10: // 4-4-2 Flach
                        positionValues[0][0] = "LAV";
                        positionValues[0][1] = Math.round(((playerData.leftfoot*4+playerData.rightfoot*1+playerData.condition*1+playerData.speed*7+playerData.technique*4+playerData.shootingtechnique*7+playerData.shootingpower*2+playerData.header*1+playerData.duel*9+playerData.tactics*7+playerData.athletics*2)/45)*10)/10;
                        positionValues[0][2] = Math.round((positionValues[0][1]-playerData.strength)*10)/10;
                        positionValues[0][3] = Math.round((positionValues[0][2]/playerData.strength)*1000)/10;
                        positionValues[1][0] = "LIV";
                        positionValues[1][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*4+playerData.condition*1+playerData.speed*3+playerData.technique*1+playerData.shootingtechnique*1+playerData.shootingpower*1+playerData.header*10+playerData.duel*10+playerData.tactics*7+playerData.athletics*4)/43)*10)/10;
                        positionValues[1][2] = Math.round((positionValues[1][1]-playerData.strength)*10)/10;
                        positionValues[1][3] = Math.round((positionValues[1][2]/playerData.strength)*1000)/10;
                        positionValues[2][0] = "RIV";
                        positionValues[2][1] = Math.round(((playerData.leftfoot*4+playerData.rightfoot*1+playerData.condition*1+playerData.speed*3+playerData.technique*1+playerData.shootingtechnique*1+playerData.shootingpower*1+playerData.header*10+playerData.duel*10+playerData.tactics*7+playerData.athletics*4)/43)*10)/10;
                        positionValues[2][2] = Math.round((positionValues[2][1]-playerData.strength)*10)/10;
                        positionValues[2][3] = Math.round((positionValues[2][2]/playerData.strength)*1000)/10;
                        positionValues[3][0] = "RAV";
                        positionValues[3][1] = Math.round(((playerData.leftfoot*4+playerData.rightfoot*1+playerData.condition*1+playerData.speed*7+playerData.technique*4+playerData.shootingtechnique*7+playerData.shootingpower*2+playerData.header*1+playerData.duel*9+playerData.tactics*7+playerData.athletics*2)/45)*10)/10;
                        positionValues[3][2] = Math.round((positionValues[3][1]-playerData.strength)*10)/10;
                        positionValues[3][3] = Math.round((positionValues[3][2]/playerData.strength)*1000)/10;
                        positionValues[4][0] = "LDM";
                        positionValues[4][1] = Math.round(((playerData.leftfoot*3+playerData.rightfoot*1+playerData.condition*1+playerData.speed*5+playerData.technique*9+playerData.shootingtechnique*6+playerData.shootingpower*1+playerData.header*6+playerData.duel*7+playerData.tactics*3+playerData.athletics*2)/44)*10)/10;
                        positionValues[4][2] = Math.round((positionValues[4][1]-playerData.strength)*10)/10;
                        positionValues[4][3] = Math.round((positionValues[4][2]/playerData.strength)*1000)/10;
                        positionValues[5][0] = "RDM";
                        positionValues[5][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*3+playerData.condition*1+playerData.speed*5+playerData.technique*9+playerData.shootingtechnique*6+playerData.shootingpower*1+playerData.header*6+playerData.duel*7+playerData.tactics*3+playerData.athletics*2)/44)*10)/10;
                        positionValues[5][2] = Math.round((positionValues[5][1]-playerData.strength)*10)/10;
                        positionValues[5][3] = Math.round((positionValues[5][2]/playerData.strength)*1000)/10;
                        positionValues[6][0] = "LOM";
                        positionValues[6][1] = Math.round(((playerData.leftfoot*4+playerData.rightfoot*1+playerData.condition*1+playerData.speed*8+playerData.technique*7+playerData.shootingtechnique*8+playerData.shootingpower*1+playerData.header*2+playerData.duel*5+playerData.tactics*3+playerData.athletics*1)/41)*10)/10;
                        positionValues[6][2] = Math.round((positionValues[6][1]-playerData.strength)*10)/10;
                        positionValues[6][3] = Math.round((positionValues[6][2]/playerData.strength)*1000)/10;
                        positionValues[7][0] = "ROM";
                        positionValues[7][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*4+playerData.condition*1+playerData.speed*8+playerData.technique*7+playerData.shootingtechnique*8+playerData.shootingpower*1+playerData.header*2+playerData.duel*5+playerData.tactics*3+playerData.athletics*1)/41)*10)/10;
                        positionValues[7][2] = Math.round((positionValues[7][1]-playerData.strength)*10)/10;
                        positionValues[7][3] = Math.round((positionValues[7][2]/playerData.strength)*1000)/10;
                        positionValues[8][0] = "ST(L)";
                        positionValues[8][1] = Math.round(((playerData.leftfoot*3+playerData.rightfoot*1+playerData.condition*1+playerData.speed*6+playerData.technique*4+playerData.shootingtechnique*5+playerData.shootingpower*1+playerData.header*8+playerData.duel*1+playerData.tactics*3+playerData.athletics*5)/38)*10)/10;
                        positionValues[8][2] = Math.round((positionValues[8][1]-playerData.strength)*10)/10;
                        positionValues[8][3] = Math.round((positionValues[8][2]/playerData.strength)*1000)/10;
                        positionValues[9][0] = "ST(R)";
                        positionValues[9][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*3+playerData.condition*1+playerData.speed*6+playerData.technique*4+playerData.shootingtechnique*5+playerData.shootingpower*1+playerData.header*8+playerData.duel*1+playerData.tactics*3+playerData.athletics*5)/38)*10)/10;
                        positionValues[9][2] = Math.round((positionValues[9][1]-playerData.strength)*10)/10;
                        positionValues[9][3] = Math.round((positionValues[9][2]/playerData.strength)*1000)/10;
                    break;
                    case 11: // 4-4-2 Flügel
                        positionValues[0][0] = "LAV";
                        positionValues[0][1] = Math.round(((playerData.leftfoot*8+playerData.rightfoot*1+playerData.condition*6+playerData.speed*4+playerData.technique*3+playerData.shootingtechnique*10+playerData.shootingpower*5+playerData.header*1+playerData.duel*7+playerData.tactics*8+playerData.athletics*1)/54)*10)/10;
                        positionValues[0][2] = Math.round((positionValues[0][1]-playerData.strength)*10)/10;
                        positionValues[0][3] = Math.round((positionValues[0][2]/playerData.strength)*1000)/10;
                        positionValues[1][0] = "LIV";
                        positionValues[1][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*4+playerData.condition*1+playerData.speed*2+playerData.technique*3+playerData.shootingtechnique*4+playerData.shootingpower*2+playerData.header*10+playerData.duel*10+playerData.tactics*8+playerData.athletics*4)/49)*10)/10;
                        positionValues[1][2] = Math.round((positionValues[1][1]-playerData.strength)*10)/10;
                        positionValues[1][3] = Math.round((positionValues[1][2]/playerData.strength)*1000)/10;
                        positionValues[2][0] = "RIV";
                        positionValues[2][1] = Math.round(((playerData.leftfoot*4+playerData.rightfoot*1+playerData.condition*1+playerData.speed*2+playerData.technique*3+playerData.shootingtechnique*4+playerData.shootingpower*2+playerData.header*10+playerData.duel*10+playerData.tactics*8+playerData.athletics*4)/49)*10)/10;
                        positionValues[2][2] = Math.round((positionValues[2][1]-playerData.strength)*10)/10;
                        positionValues[2][3] = Math.round((positionValues[2][2]/playerData.strength)*1000)/10;
                        positionValues[3][0] = "RAV";
                        positionValues[3][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*8+playerData.condition*6+playerData.speed*4+playerData.technique*3+playerData.shootingtechnique*10+playerData.shootingpower*5+playerData.header*1+playerData.duel*7+playerData.tactics*8+playerData.athletics*1)/54)*10)/10;
                        positionValues[3][2] = Math.round((positionValues[3][1]-playerData.strength)*10)/10;
                        positionValues[3][3] = Math.round((positionValues[3][2]/playerData.strength)*1000)/10;
                        positionValues[4][0] = "DM";
                        positionValues[4][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*1+playerData.condition*2+playerData.speed*3+playerData.technique*2+playerData.shootingtechnique*4+playerData.shootingpower*1+playerData.header*8+playerData.duel*9+playerData.tactics*8+playerData.athletics*7)/46)*10)/10;
                        positionValues[4][2] = Math.round((positionValues[4][1]-playerData.strength)*10)/10;
                        positionValues[4][3] = Math.round((positionValues[4][2]/playerData.strength)*1000)/10;
                        positionValues[5][0] = "LOM";
                        positionValues[5][1] = Math.round(((playerData.leftfoot*4+playerData.rightfoot*1+playerData.condition*3+playerData.speed*10+playerData.technique*8+playerData.shootingtechnique*8+playerData.shootingpower*3+playerData.header*1+playerData.duel*5+playerData.tactics*8+playerData.athletics*7)/58)*10)/10;
                        positionValues[5][2] = Math.round((positionValues[5][1]-playerData.strength)*10)/10;
                        positionValues[5][3] = Math.round((positionValues[5][2]/playerData.strength)*1000)/10;
                        positionValues[6][0] = "ZOM";
                        positionValues[6][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*1+playerData.condition*2+playerData.speed*5+playerData.technique*9+playerData.shootingtechnique*8+playerData.shootingpower*1+playerData.header*6+playerData.duel*4+playerData.tactics*8+playerData.athletics*3)/48)*10)/10;
                        positionValues[6][2] = Math.round((positionValues[6][1]-playerData.strength)*10)/10;
                        positionValues[6][3] = Math.round((positionValues[6][2]/playerData.strength)*1000)/10;
                        positionValues[7][0] = "ROM";
                        positionValues[7][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*4+playerData.condition*3+playerData.speed*10+playerData.technique*8+playerData.shootingtechnique*8+playerData.shootingpower*3+playerData.header*1+playerData.duel*5+playerData.tactics*8+playerData.athletics*7)/58)*10)/10;
                        positionValues[7][2] = Math.round((positionValues[7][1]-playerData.strength)*10)/10;
                        positionValues[7][3] = Math.round((positionValues[7][2]/playerData.strength)*1000)/10;
                        positionValues[8][0] = "ST(L)";
                        positionValues[8][1] = Math.round(((playerData.leftfoot*2+playerData.rightfoot*1+playerData.condition*1+playerData.speed*8+playerData.technique*6+playerData.shootingtechnique*5+playerData.shootingpower*1+playerData.header*5+playerData.duel*2+playerData.tactics*3+playerData.athletics*6)/40)*10)/10;
                        positionValues[8][2] = Math.round((positionValues[8][1]-playerData.strength)*10)/10;
                        positionValues[8][3] = Math.round((positionValues[8][2]/playerData.strength)*1000)/10;
                        positionValues[9][0] = "ST(R)";
                        positionValues[9][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*2+playerData.condition*1+playerData.speed*8+playerData.technique*6+playerData.shootingtechnique*5+playerData.shootingpower*1+playerData.header*5+playerData.duel*2+playerData.tactics*3+playerData.athletics*6)/40)*10)/10;
                        positionValues[9][2] = Math.round((positionValues[9][1]-playerData.strength)*10)/10;
                        positionValues[9][3] = Math.round((positionValues[9][2]/playerData.strength)*1000)/10;
                    break;
                    case 12: // 4-4-2 Raute
                        positionValues[0][0] = "LAV";
                        positionValues[0][1] = Math.round(((playerData.leftfoot*4+playerData.rightfoot*1+playerData.condition*2+playerData.speed*8+playerData.technique*5+playerData.shootingtechnique*7+playerData.shootingpower*1+playerData.header*1+playerData.duel*8+playerData.tactics*8+playerData.athletics*2)/47)*10)/10;
                        positionValues[0][2] = Math.round((positionValues[0][1]-playerData.strength)*10)/10;
                        positionValues[0][3] = Math.round((positionValues[0][2]/playerData.strength)*1000)/10;
                        positionValues[1][0] = "LIV";
                        positionValues[1][1] = Math.round(((playerData.leftfoot*4+playerData.rightfoot*1+playerData.condition*1+playerData.speed*8+playerData.technique*2+playerData.shootingtechnique*1+playerData.shootingpower*1+playerData.header*10+playerData.duel*10+playerData.tactics*8+playerData.athletics*5)/51)*10)/10;
                        positionValues[1][2] = Math.round((positionValues[1][1]-playerData.strength)*10)/10;
                        positionValues[1][3] = Math.round((positionValues[1][2]/playerData.strength)*1000)/10;
                        positionValues[2][0] = "RIV";
                        positionValues[2][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*4+playerData.condition*1+playerData.speed*8+playerData.technique*2+playerData.shootingtechnique*1+playerData.shootingpower*1+playerData.header*10+playerData.duel*10+playerData.tactics*8+playerData.athletics*5)/51)*10)/10;
                        positionValues[2][2] = Math.round((positionValues[2][1]-playerData.strength)*10)/10;
                        positionValues[2][3] = Math.round((positionValues[2][2]/playerData.strength)*1000)/10;
                        positionValues[3][0] = "RAV";
                        positionValues[3][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*4+playerData.condition*2+playerData.speed*8+playerData.technique*5+playerData.shootingtechnique*7+playerData.shootingpower*1+playerData.header*1+playerData.duel*8+playerData.tactics*8+playerData.athletics*2)/47)*10)/10;
                        positionValues[3][2] = Math.round((positionValues[3][1]-playerData.strength)*10)/10;
                        positionValues[3][3] = Math.round((positionValues[3][2]/playerData.strength)*1000)/10;
                        positionValues[4][0] = "DM";
                        positionValues[4][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*1+playerData.condition*2+playerData.speed*2+playerData.technique*2+playerData.shootingtechnique*1+playerData.shootingpower*2+playerData.header*2+playerData.duel*8+playerData.tactics*8+playerData.athletics*7)/36)*10)/10;
                        positionValues[4][2] = Math.round((positionValues[4][1]-playerData.strength)*10)/10;
                        positionValues[4][3] = Math.round((positionValues[4][2]/playerData.strength)*1000)/10;
                        positionValues[5][0] = "LOM";
                        positionValues[5][1] = Math.round(((playerData.leftfoot*3+playerData.rightfoot*1+playerData.condition*2+playerData.speed*6+playerData.technique*8+playerData.shootingtechnique*7+playerData.shootingpower*1+playerData.header*6+playerData.duel*3+playerData.tactics*3+playerData.athletics*1)/41)*10)/10;
                        positionValues[5][2] = Math.round((positionValues[5][1]-playerData.strength)*10)/10;
                        positionValues[5][3] = Math.round((positionValues[5][2]/playerData.strength)*1000)/10;
                        positionValues[6][0] = "ZOM";
                        positionValues[6][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*1+playerData.condition*1+playerData.speed*3+playerData.technique*8+playerData.shootingtechnique*9+playerData.shootingpower*1+playerData.header*5+playerData.duel*3+playerData.tactics*9+playerData.athletics*2)/43)*10)/10;
                        positionValues[6][2] = Math.round((positionValues[6][1]-playerData.strength)*10)/10;
                        positionValues[6][3] = Math.round((positionValues[6][2]/playerData.strength)*1000)/10;
                        positionValues[7][0] = "ROM";
                        positionValues[7][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*3+playerData.condition*2+playerData.speed*6+playerData.technique*8+playerData.shootingtechnique*7+playerData.shootingpower*1+playerData.header*6+playerData.duel*3+playerData.tactics*3+playerData.athletics*1)/41)*10)/10;
                        positionValues[7][2] = Math.round((positionValues[7][1]-playerData.strength)*10)/10;
                        positionValues[7][3] = Math.round((positionValues[7][2]/playerData.strength)*1000)/10;
                        positionValues[8][0] = "ST(L)";
                        positionValues[8][1] = Math.round(((playerData.leftfoot*2+playerData.rightfoot*1+playerData.condition*1+playerData.speed*8+playerData.technique*5+playerData.shootingtechnique*5+playerData.shootingpower*1+playerData.header*8+playerData.duel*1+playerData.tactics*3+playerData.athletics*5)/40)*10)/10;
                        positionValues[8][2] = Math.round((positionValues[8][1]-playerData.strength)*10)/10;
                        positionValues[8][3] = Math.round((positionValues[8][2]/playerData.strength)*1000)/10;
                        positionValues[9][0] = "ST(R)";
                        positionValues[9][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*2+playerData.condition*1+playerData.speed*8+playerData.technique*5+playerData.shootingtechnique*5+playerData.shootingpower*1+playerData.header*8+playerData.duel*1+playerData.tactics*3+playerData.athletics*5)/40)*10)/10;
                        positionValues[9][2] = Math.round((positionValues[9][1]-playerData.strength)*10)/10;
                        positionValues[9][3] = Math.round((positionValues[9][2]/playerData.strength)*1000)/10;
                    break;
                }
                let maxValue = positionValues[0][1];
                let maxValueIndex = 0;
                for(i=1;i<10;i++){
                    if(positionValues[i][1]>maxValue){
                        maxValue = positionValues[i][1];
                        maxValueIndex = i;
                    }
                }
                let secondMaxValue;
                let secondMaxValueIndex = 0;
                if(maxValueIndex!=0){
                    secondMaxValue = positionValues[0][1];
                }
                else{
                    secondMaxValue = positionValues[1][1];
                }
                for(i=1;i<10;i++){
                    if(positionValues[i][1]>secondMaxValue && i!=maxValueIndex){
                        secondMaxValue = positionValues[i][1];
                        secondMaxValueIndex = i;
                    }
                }
                let thirdMaxValue;
                let thirdMaxValueIndex = 0;
                if(maxValueIndex!=0 && secondMaxValueIndex!=0){
                    thirdMaxValue = positionValues[0][1];
                }
                else if((maxValueIndex!=1 && secondMaxValueIndex!=1) || (maxValueIndex!=0 && secondMaxValueIndex!=1) || (maxValueIndex!=1 && secondMaxValueIndex!=0)){
                    thirdMaxValue = positionValues[1][1];
                }
                else{
                    thirdMaxValue = positionValues[2][1];
                }
                for(i=1;i<10;i++){
                    if(positionValues[i][1]>thirdMaxValue && i!=maxValueIndex && i!=secondMaxValueIndex){
                        thirdMaxValue = positionValues[i][1];
                        thirdMaxValueIndex = i;
                    }
                }
                for(i=0;i<10;i++){
                    let fontColorDifferenz;
                    let fontColor = "#404040";
                    if(positionValues[i][2]>0){
                        fontColorDifferenz = "#63bf7c";
                    }
                    else if (positionValues[i][2]<0){
                        fontColorDifferenz = "#f8696b";
                    }
                    else{
                        fontColorDifferenz = "#404040";
                    }
                    if(i==maxValueIndex || i==secondMaxValueIndex || i==thirdMaxValueIndex){
                        fontColor = "purple";
                    }
                    $(".ol-transfer-position-container-1").append(
                        "<div class=\"ol-transfer-position\">"+
                            "<span class=\"ol-transfer-span\" style=\"color:#404040;display:block;font-weight:bold;width:35px;font-size:13px;\">"+positionValues[i][0]+"</span>"+
                            "<span class=\"ol-transfer-span\" style=\"color:"+fontColor+";display:block;font-weight:bold;width:35px;font-size:13px;\">"+positionValues[i][1]+"</span>"+
                            "<span class=\"ol-transfer-span\" style=\"color:"+fontColorDifferenz+";display:block;font-weight:bold;width:35px;font-size:13px;\">"+positionValues[i][2]+"</span>"+
                            "<span class=\"ol-transfer-span\" style=\"color:"+fontColorDifferenz+";display:block;font-weight:bold;width:35px;font-size:13px;\">"+positionValues[i][3]+"%</span>"+
                        "</div>"
                    );
                }
                $(".ol-transfer-position").eq(9).after("</div>");
                $(".ol-transfer-position").eq(0).before("<div>");
                trainingsslot.stabi = 150;
                trainingsslot.goalkeeping = 0;
            }
            else if($(".transfer-player-attributes-container span.ol-value-bar-small-label-value").length==9){
                playerData.strength = parseInt($(".transfer-player-attributes-container span.ol-value-bar-small-label-value").eq(0).text().trim());
                playerData.line = parseInt($(".transfer-player-attributes-container span.ol-value-bar-small-label-value").eq(2).text().trim());
                playerData.libero = parseInt($(".transfer-player-attributes-container span.ol-value-bar-small-label-value").eq(3).text().trim());
                playerData.foot = parseInt($(".transfer-player-attributes-container span.ol-value-bar-small-label-value").eq(4).text().trim());
                playerData.gameopening = parseInt($(".transfer-player-attributes-container span.ol-value-bar-small-label-value").eq(5).text().trim());
                playerData.runout = parseInt($(".transfer-player-attributes-container span.ol-value-bar-small-label-value").eq(6).text().trim());
                playerData.penaltyarea = parseInt($(".transfer-player-attributes-container span.ol-value-bar-small-label-value").eq(7).text().trim());
                playerData.talent = parseInt($(".transfer-player-attributes-container span.ol-value-bar-small-label-value").eq(8).text().trim());
                let positionValue = new Array(4);
                switch(numberOfFormation){
                    case 1: // 3-4-3 Dreierkette (offensiv)
                        positionValue[0] = "TW";
                        positionValue[1] = Math.round(((playerData.line*1+playerData.libero*5+playerData.foot*3+playerData.gameopening*3+playerData.runout*2+playerData.penaltyarea*1)/15)*10)/10;
                        positionValue[2] = Math.round((positionValue[1]-playerData.strength)*10)/10;
                        positionValue[3] = Math.round((positionValue[2]/playerData.strength)*1000)/10;
                    break;
                    case 2: // 3-5-2 Dreierkette, Kompaktes Mittelfeld
                        positionValue[0] = "TW";
                        positionValue[1] = Math.round(((playerData.line*1+playerData.libero*1+playerData.foot*2+playerData.gameopening*4+playerData.runout*1+playerData.penaltyarea*1)/10)*10)/10;
                        positionValue[2] = Math.round((positionValue[1]-playerData.strength)*10)/10;
                        positionValue[3] = Math.round((positionValue[2]/playerData.strength)*1000)/10;
                    break;
                    case 3: // 4-1-4-1 Defensiv, Konter
                        positionValue[0] = "TW";
                        positionValue[1] = Math.round(((playerData.line*1+playerData.libero*1+playerData.foot*2+playerData.gameopening*4+playerData.runout*2+playerData.penaltyarea*1)/11)*10)/10;
                        positionValue[2] = Math.round((positionValue[1]-playerData.strength)*10)/10;
                        positionValue[3] = Math.round((positionValue[2]/playerData.strength)*1000)/10;
                    break;
                    case 4: // 4-1-5-0 Falsche Neun
                        positionValue[0] = "TW";
                        positionValue[1] = Math.round(((playerData.line*1+playerData.libero*6+playerData.foot*4+playerData.gameopening*2+playerData.runout*2+playerData.penaltyarea*1)/16)*10)/10;
                        positionValue[2] = Math.round((positionValue[1]-playerData.strength)*10)/10;
                        positionValue[3] = Math.round((positionValue[2]/playerData.strength)*1000)/10;
                    break;
                    case 5: // 4-2-3-1 Defensiv, Konter
                        positionValue[0] = "TW";
                        positionValue[1] = Math.round(((playerData.line*1+playerData.libero*2+playerData.foot*1+playerData.gameopening*3+playerData.runout*1+playerData.penaltyarea*1)/9)*10)/10;
                        positionValue[2] = Math.round((positionValue[1]-playerData.strength)*10)/10;
                        positionValue[3] = Math.round((positionValue[2]/playerData.strength)*1000)/10;
                    break;
                    case 6: // 4-2-3-1 Kontrollierte Offensive
                        positionValue[0] = "TW";
                        positionValue[1] = Math.round(((playerData.line*1+playerData.libero*2+playerData.foot*2+playerData.gameopening*3+playerData.runout*1+playerData.penaltyarea*1)/10)*10)/10;
                        positionValue[2] = Math.round((positionValue[1]-playerData.strength)*10)/10;
                        positionValue[3] = Math.round((positionValue[2]/playerData.strength)*1000)/10;
                    break;
                    case 7: // 4-2-4-0 Falsche Neun
                        positionValue[0] = "TW";
                        positionValue[1] = Math.round(((playerData.line*1+playerData.libero*6+playerData.foot*4+playerData.gameopening*2+playerData.runout*2+playerData.penaltyarea*1)/16)*10)/10;
                        positionValue[2] = Math.round((positionValue[1]-playerData.strength)*10)/10;
                        positionValue[3] = Math.round((positionValue[2]/playerData.strength)*1000)/10;
                    break;
                    case 8: // 4-3-3 Halb offensiv, Konter
                        positionValue[0] = "TW";
                        positionValue[1] = Math.round(((playerData.line*1+playerData.libero*3+playerData.foot*2+playerData.gameopening*4+playerData.runout*1+playerData.penaltyarea*1)/12)*10)/10;
                        positionValue[2] = Math.round((positionValue[1]-playerData.strength)*10)/10;
                        positionValue[3] = Math.round((positionValue[2]/playerData.strength)*1000)/10;
                    break;
                    case 9: // 4-3-3 Offensiv
                        positionValue[0] = "TW";
                        positionValue[1] = Math.round(((playerData.line*1+playerData.libero*7+playerData.foot*3+playerData.gameopening*5+playerData.runout*2+playerData.penaltyarea*1)/19)*10)/10;
                        positionValue[2] = Math.round((positionValue[1]-playerData.strength)*10)/10;
                        positionValue[3] = Math.round((positionValue[2]/playerData.strength)*1000)/10;
                    break;
                    case 10: // 4-4-2 Flach
                        positionValue[0] = "TW";
                        positionValue[1] = Math.round(((playerData.line*1+playerData.libero*2+playerData.foot*3+playerData.gameopening*3+playerData.runout*1+playerData.penaltyarea*1)/11)*10)/10;
                        positionValue[2] = Math.round((positionValue[1]-playerData.strength)*10)/10;
                        positionValue[3] = Math.round((positionValue[2]/playerData.strength)*1000)/10;
                    break;
                    case 11: // 4-4-2 Flügel
                        positionValue[0] = "TW";
                        positionValue[1] = Math.round(((playerData.line*1+playerData.libero*2+playerData.foot*2+playerData.gameopening*4+playerData.runout*1+playerData.penaltyarea*1)/11)*10)/10;
                        positionValue[2] = Math.round((positionValue[1]-playerData.strength)*10)/10;
                        positionValue[3] = Math.round((positionValue[2]/playerData.strength)*1000)/10;
                    break;
                    case 12: // 4-4-2 Raute
                        positionValue[0] = "TW";
                        positionValue[1] = Math.round(((playerData.line*1+playerData.libero*5+playerData.foot*4+playerData.gameopening*3+playerData.runout*1+playerData.penaltyarea*1)/15)*10)/10;
                        positionValue[2] = Math.round((positionValue[1]-playerData.strength)*10)/10;
                        positionValue[3] = Math.round((positionValue[2]/playerData.strength)*1000)/10;
                    break;
                }
                let fontColorDifferenz;
                if(positionValue[2]>0){
                    fontColorDifferenz = "#63bf7c";
                }
                else if (positionValue[2]<0){
                    fontColorDifferenz = "#f8696b";
                }
                else{
                    fontColorDifferenz = "#404040";
                }
                $(".ol-transfer-position-container-1").append(
                    "<div class=\"ol-transfer-position\">"+
                        "<span class=\"ol-transfer-span\" style=\"color:#404040;display:block;font-weight:bold;width:35px;font-size:13px;\">"+positionValue[0]+"</span>"+
                        "<span class=\"ol-transfer-span\" style=\"display:block;font-weight:bold;width:35px;font-size:13px;\">"+positionValue[1]+"</span>"+
                        "<span class=\"ol-transfer-span\" style=\"color:"+fontColorDifferenz+";display:block;font-weight:bold;width:35px;font-size:13px;\">"+positionValue[2]+"</span>"+
                        "<span class=\"ol-transfer-span\" style=\"color:"+fontColorDifferenz+";display:block;font-weight:bold;width:35px;font-size:13px;\">"+positionValue[3]+"%</span>"+
                    "</div>"
                );
                trainingsslot.goalkeeping = 105;
                trainingsslot.stabi = 0;
            }
            else{
                console.log("Spielertyp konnte nicht erkannt werden!");
            }
            $("#ol-container-transfer-real-strenght").attr("style","display:inline-block;");
            $(".ol-container-transfer-real-strenght-select").attr("style","margin-bottom:6px;");
            $(".ol-transfer-position").attr("style","background-color:#f2f2f2;display:inline-block;");

            // Development Forecast
            trainingsslot.coordination = 90;
            trainingsslot.tactics = 90;
            trainingsslot.standards = 120;
            trainingsslot.technique = 240;
            trainingsslot.shooting = 240;
            $(".row.player-view-detail.border-bottom").parent().before(
                "<div class=\"training-slots-adjustments\">"+
                    "<span style=\"font-weight:bold;\">Trainingsdaten: </span>"+
                    "<span>Koordination </span><span class=\"training-slots-adjustments-minutes\">"+trainingsslot.coordination+"min |</span>"+
                    "<span>Taktik </span><span class=\"training-slots-adjustments-minutes\">"+trainingsslot.tactics+"min |</span>"+
                    "<span>Technik </span><span class=\"training-slots-adjustments-minutes\">"+trainingsslot.technique+"min |</span>"+
                    "<span>Standards </span><span class=\"training-slots-adjustments-minutes\">"+trainingsslot.standards+"min |</span>"+
                    "<span>Schusstraining </span><span class=\"training-slots-adjustments-minutes\">"+trainingsslot.shooting+"min |</span>"+
                    "<span>Stabilisationstraining </span><span class=\"training-slots-adjustments-minutes\">"+trainingsslot.stabi+"min |</span>"+
                    "<span>Torwarttraining </span><span class=\"training-slots-adjustments-minutes\">"+trainingsslot.goalkeeping+"min</span>"+
                "</div>"
            );
            $(".training-slots-adjustments").css({"padding":"0 15px","text-align":"center"});
            $(".training-slots-adjustments-minutes").css("font-weight", "bold");

            if(playerData.age<30){
                $(".ol-container-transfer-real-strenght-values").before(
                    "<div class=\"ol-transfer-position-container-2\"></div>"
                );
                $(".ol-transfer-position-container-2").css({"display":"inline-block","margin":"2px 4px"});
                let numberOfSeasonsForDevelopmentCalculation = 30-playerData.age;
                for(i=0;i<numberOfSeasonsForDevelopmentCalculation;i++){
                    let ageFactor;
                    if(playerData.age+i==17){
                        ageFactor = 1.3;
                    }
                    else if(playerData.age+i==18){
                        ageFactor = 1.2;
                    }
                    else if(playerData.age+i==19){
                        ageFactor = 1.1;
                    }
                    else if(playerData.age+i>19 && playerData.age+i<26){
                        ageFactor = 1;
                    }
                    else if(playerData.age+i>25 && playerData.age+i<28){
                        ageFactor = 0.9;
                    }
                    else if(playerData.age+i==28){
                        ageFactor = 0.8;
                    }
                    else if(playerData.age+i==29){
                        ageFactor = 0.7;
                    }
                    let numberOfWeeks;
                    if(i==0){
                        if(playerData.birthday>currentWeek){
                            numberOfWeeks = playerData.birthday-currentWeek;
                        }
                        else{
                            numberOfWeeks = 44-currentWeek+playerData.birthday;
                        }
                    }
                    else{
                        numberOfWeeks = 44;
                    }
                    if($(".transfer-player-attributes-container span.ol-value-bar-small-label-value").length==9){
                        // Taktik
                        playerData.libero += (1/300)*(2*(trainingsslot.tactics/15))*(playerData.talent/100)*ageFactor*((100-playerData.libero)/100)*numberOfWeeks;
                        playerData.gameopening += (1/300)*(3*(trainingsslot.tactics/15))*(playerData.talent/100)*ageFactor*((100-playerData.gameopening)/100)*numberOfWeeks;
                        // Technik
                        playerData.libero += (1/300)*(1*(trainingsslot.technique/15))*(playerData.talent/100)*ageFactor*((100-playerData.libero)/100)*numberOfWeeks;
                        playerData.foot += (1/300)*(6*(trainingsslot.technique/15))*(playerData.talent/100)*ageFactor*((100-playerData.foot)/100)*numberOfWeeks;
                        playerData.gameopening += (1/300)*(2*(trainingsslot.technique/15))*(playerData.talent/100)*ageFactor*((100-playerData.gameopening)/100)*numberOfWeeks;
                        // Schusstraining
                        playerData.libero += (1/300)*(1*(trainingsslot.shooting/15))*(playerData.talent/100)*ageFactor*((100-playerData.libero)/100)*numberOfWeeks;
                        playerData.foot += (1/300)*(6*(trainingsslot.shooting/15))*(playerData.talent/100)*ageFactor*((100-playerData.foot)/100)*numberOfWeeks;
                        playerData.gameopening += (1/300)*(2*(trainingsslot.shooting/15))*(playerData.talent/100)*ageFactor*((100-playerData.gameopening)/100)*numberOfWeeks;
                        // Standardsituationen
                        playerData.line += (1/300)*(6*(trainingsslot.standards/15))*(playerData.talent/100)*ageFactor*((100-playerData.line)/100)*numberOfWeeks;
                        playerData.libero += (1/300)*(1*(trainingsslot.standards/15))*(playerData.talent/100)*ageFactor*((100-playerData.libero)/100)*numberOfWeeks;
                        playerData.foot += (1/300)*(2*(trainingsslot.standards/15))*(playerData.talent/100)*ageFactor*((100-playerData.foot)/100)*numberOfWeeks;
                        playerData.runout += (1/300)*(2*(trainingsslot.standards/15))*(playerData.talent/100)*ageFactor*((100-playerData.runout)/100)*numberOfWeeks;
                        playerData.penaltyarea += (1/300)*(8*(trainingsslot.standards/15))*(playerData.talent/100)*ageFactor*((100-playerData.penaltyarea)/100)*numberOfWeeks;
                        // Spielformen 5-5 - todo
                        // Trainingsspiel - todo
                        // Torwarttraining
                        playerData.line += (1/300)*(10*(trainingsslot.goalkeeping/15))*(playerData.talent/100)*ageFactor*((100-playerData.line)/100)*numberOfWeeks;
                        playerData.libero += (1/300)*(1*(trainingsslot.goalkeeping/15))*(playerData.talent/100)*ageFactor*((100-playerData.libero)/100)*numberOfWeeks;
                        playerData.foot += (1/300)*(5*(trainingsslot.goalkeeping/15))*(playerData.talent/100)*ageFactor*((100-playerData.foot)/100)*numberOfWeeks;
                        playerData.gameopening += (1/300)*(2*(trainingsslot.goalkeeping/15))*(playerData.talent/100)*ageFactor*((100-playerData.gameopening)/100)*numberOfWeeks;
                        playerData.runout += (1/300)*(8*(trainingsslot.goalkeeping/15))*(playerData.talent/100)*ageFactor*((100-playerData.runout)/100)*numberOfWeeks;
                        playerData.penaltyarea += (1/300)*(8*(trainingsslot.goalkeeping/15))*(playerData.talent/100)*ageFactor*((100-playerData.penaltyarea)/100)*numberOfWeeks;
                        // Spielformen 4-4 - todo
                        // Schnellkraft - todo
                    }
                    else{
                        // Taktik
                        playerData.tactics += (1/300)*(10*(trainingsslot.tactics/15))*(playerData.talent/100)*ageFactor*((100-playerData.tactics)/100)*numberOfWeeks;
                        // Koordination
                        playerData.condition += (1/300)*(3*(trainingsslot.coordination/15))*(playerData.talent/100)*ageFactor*((100-playerData.condition)/100)*numberOfWeeks;
                        playerData.speed += (1/300)*(2*(trainingsslot.coordination/15))*(playerData.talent/100)*ageFactor*((100-playerData.speed)/100)*numberOfWeeks;
                        playerData.duel += (1/300)*(2*(trainingsslot.coordination/15))*(playerData.talent/100)*ageFactor*((100-playerData.duel)/100)*numberOfWeeks;
                        playerData.athletics += (1/300)*(4*(trainingsslot.coordination/15))*(playerData.talent/100)*ageFactor*((100-playerData.athletics)/100)*numberOfWeeks;
                        // Technik
                        playerData.technique += (1/300)*(10*(trainingsslot.technique/15))*(playerData.talent/100)*ageFactor*((100-playerData.technique)/100)*numberOfWeeks;
                        playerData.shootingtechnique += (1/300)*(3*(trainingsslot.technique/15))*(playerData.talent/100)*ageFactor*((100-playerData.shootingtechnique)/100)*numberOfWeeks;
                        // Schusstraining
                        playerData.shootingtechnique += (1/300)*(10*(trainingsslot.shooting/15))*(playerData.talent/100)*ageFactor*((100-playerData.shootingtechnique)/100)*numberOfWeeks;
                        playerData.shootingpower += (1/300)*(4*(trainingsslot.shooting/15))*(playerData.talent/100)*ageFactor*((100-playerData.shootingpower)/100)*numberOfWeeks;
                        playerData.leftfoot += (1/300)*(5*(trainingsslot.shooting/15))*(playerData.talent/100)*ageFactor*((100-playerData.leftfoot)/100)*numberOfWeeks;
                        playerData.rightfoot += (1/300)*(5*(trainingsslot.shooting/15))*(playerData.talent/100)*ageFactor*((100-playerData.rightfoot)/100)*numberOfWeeks;
                        // Standardsituationen
                        playerData.shootingtechnique += (1/300)*(2*(trainingsslot.standards/15))*(playerData.talent/100)*ageFactor*((100-playerData.shootingtechnique)/100)*numberOfWeeks;
                        playerData.header += (1/300)*(4*(trainingsslot.standards/15))*(playerData.talent/100)*ageFactor*((100-playerData.header)/100)*numberOfWeeks;
                        playerData.duel += (1/300)*(2*(trainingsslot.standards/15))*(playerData.talent/100)*ageFactor*((100-playerData.duel)/100)*numberOfWeeks;
                        playerData.leftfoot += (1/300)*(1*(trainingsslot.standards/15))*(playerData.talent/100)*ageFactor*((100-playerData.leftfoot)/100)*numberOfWeeks;
                        playerData.rightfoot += (1/300)*(1*(trainingsslot.standards/15))*(playerData.talent/100)*ageFactor*((100-playerData.rightfoot)/100)*numberOfWeeks;
                        // Stabilisationstraining
                        //playerData.condition += (1/300)*(1*(trainingsslot.stabi/15))*(playerData[i].talent/100)*ageFactor*((100-playerData[i].condition)/100)*numberOfWeeks;
                        //playerData.athletics += (1/300)*(10*(trainingsslot.stabi/15))*(playerData[i].talent/100)*ageFactor*((100-playerData[i].athletics)/100)*numberOfWeeks;
                        // Spielformen 5-5 - todo
                        // Trainingsspiel - todo
                        // Kondition
                        //playerData.condition += (1/300)*(10*(trainingsslot.condition/15))*(playerData.talent/100)*ageFactor*((100-playerData.condition)/100)*numberOfWeeks;
                        // Spielformen 4-4 - todo
                        // Schnellkraft - todo
                    }
                    if($(".transfer-player-attributes-container span.ol-value-bar-small-label-value").length==9){
                        playerData.strength = (playerData.line+playerData.libero+playerData.foot+playerData.gameopening+playerData.runout+playerData.penaltyarea)/6;
                    }
                    else{
                        playerData.strength = (playerData.condition+playerData.speed+playerData.technique+playerData.shootingtechnique+playerData.shootingpower+playerData.header+playerData.duel+playerData.tactics+playerData.leftfoot+playerData.rightfoot+playerData.athletics)/11;
                    }
                }
                let numberOfAttributes = $(".attributes-characteristic.ol-font-standard .player-attributes-bar").length;
                for(i=0;i<numberOfAttributes;i++){
                    let forecastValue;
                    let backgroundOpacity;
                    if($(".transfer-player-attributes-container span.ol-value-bar-small-label-value").length==14){
                        switch(i){
                            case 0:
                                forecastValue = playerData.leftfoot.toFixed(1);
                                backgroundOpacity = playerData.leftfoot*0.008+0.2;
                                break;
                            case 1:
                                forecastValue = playerData.rightfoot.toFixed(1);
                                backgroundOpacity = playerData.rightfoot*0.008+0.2;
                                break;
                            case 2:
                                forecastValue = playerData.strength.toFixed(1);
                                backgroundOpacity = playerData.strength*0.008+0.2;
                                break;
                            case 3:
                                forecastValue = 100;
                                backgroundOpacity = 1;
                                break;
                            case 4:
                                forecastValue = playerData.condition.toFixed(1);
                                backgroundOpacity = playerData.condition*0.008+0.2;
                                break;
                            case 5:
                                forecastValue = playerData.speed.toFixed(1);
                                backgroundOpacity = playerData.speed*0.008+0.2;
                                break;
                            case 6:
                                forecastValue = playerData.technique.toFixed(1);
                                backgroundOpacity = playerData.technique*0.008+0.2;
                                break;
                            case 7:
                                forecastValue = playerData.shootingtechnique.toFixed(1);
                                backgroundOpacity = playerData.shootingtechnique*0.008+0.2;
                                break;
                            case 8:
                                forecastValue = playerData.shootingpower.toFixed(1);
                                backgroundOpacity = playerData.shootingpower*0.008+0.2;
                                break;
                            case 9:
                                forecastValue = playerData.header.toFixed(1);
                                backgroundOpacity = playerData.header*0.008+0.2;
                                break;
                            case 10:
                                forecastValue = playerData.duel.toFixed(1);
                                backgroundOpacity = playerData.duel*0.008+0.2;
                                break;
                            case 11:
                                forecastValue = playerData.tactics.toFixed(1);
                                backgroundOpacity = playerData.tactics*0.008+0.2;
                                break;
                            case 12:
                                forecastValue = playerData.athletics.toFixed(1);
                                backgroundOpacity = playerData.athletics*0.008+0.2;
                                break;
                            case 13:
                                forecastValue = playerData.talent;
                                backgroundOpacity = playerData.talent*0.008+0.2;
                                break;
                        }
                    }
                    else{
                        switch(i){
                            case 0:
                                forecastValue = playerData.strength.toFixed(1);
                                backgroundOpacity = playerData.strength*0.008+0.2;
                                break;
                            case 1:
                                forecastValue = 100;
                                backgroundOpacity = 1;
                                break;
                            case 2:
                                forecastValue = playerData.line.toFixed(1);
                                backgroundOpacity = playerData.line*0.008+0.2;
                                break;
                            case 3:
                                forecastValue = playerData.libero.toFixed(1);
                                backgroundOpacity = playerData.libero*0.008+0.2;
                                break;
                            case 4:
                                forecastValue = playerData.foot.toFixed(1);
                                backgroundOpacity = playerData.foot*0.008+0.2;
                                break;
                            case 5:
                                forecastValue = playerData.gameopening.toFixed(1);
                                backgroundOpacity = playerData.gameopening*0.008+0.2;
                                break;
                            case 6:
                                forecastValue = playerData.runout.toFixed(1);
                                backgroundOpacity = playerData.runout*0.008+0.2;
                                break;
                            case 7:
                                forecastValue = playerData.penaltyarea.toFixed(1);
                                backgroundOpacity = playerData.penaltyarea*0.008+0.2;
                                break;
                            case 8:
                                forecastValue = playerData.talent.toFixed(1);
                                backgroundOpacity = playerData.talent*0.008+0.2;
                                break;
                        }
                    }
                    $(".attributes-characteristic.ol-font-standard .player-attributes-bar .col-lg-8.col-sm-8.col-md-7.col-xs-8").eq(i).before(
                        "<div class=\"development-forecast\" style=\"opacity:"+backgroundOpacity.toFixed(3)+"\">"+
                        forecastValue+
                        "</div>"
                    );
                    $(".ol-paragraph-2.attributes-characteristic .player-attributes-bar .col-lg-8.col-sm-8.col-md-7.col-xs-8").eq(i).before(
                        "<div class=\"development-forecast\" style=\"opacity:"+backgroundOpacity.toFixed(3)+"\">"+
                        forecastValue+
                        "</div>"
                    );
                }
                $(".development-forecast").css({"width":"13%","font-size":"14px","float":"left","margin":"2px 2px 0px 0px","padding-top":"2px 2px 0px 2px","text-align":"center","color":"white","border-radius":"5px","background-color":"#000"});
                $(".attributes-characteristic.ol-font-standard .player-attributes-bar .col-lg-4.col-sm-4.col-md-5.col-xs-4").css({"width":"35%","padding-right":"0px"});
                $(".attributes-characteristic.ol-font-standard .player-attributes-bar .col-lg-8.col-sm-8.col-md-7.col-xs-8").css({"width":"50%","padding-left":"0px"});
                $(".ol-paragraph-2.attributes-characteristic .player-attributes-bar .col-lg-4.col-sm-4.col-md-5.col-xs-4").css({"width":"35%","padding-right":"0px"});
                $(".ol-paragraph-2.attributes-characteristic .player-attributes-bar .col-lg-8.col-sm-8.col-md-7.col-xs-8").css({"width":"50%","padding-left":"0px"});

                if($(".transfer-player-attributes-container span.ol-value-bar-small-label-value").length==14){
                    let positionValues = new Array(10);
                    for(i=0;i<10;i++){
                        positionValues[i] = new Array(4);
                    }
                    switch(numberOfFormation){
                        case 1: // 3-4-3 Dreierkette (offensiv)
                            positionValues[0][0] = "LIV";
                            positionValues[0][1] = Math.round(((playerData.leftfoot*3+playerData.rightfoot*1+playerData.condition*2+playerData.speed*8+playerData.technique*4+playerData.shootingtechnique*5+playerData.shootingpower*2+playerData.header*8+playerData.duel*9+playerData.tactics*8+playerData.athletics*6)/56)*10)/10;
                            positionValues[0][2] = Math.round((positionValues[0][1]-playerData.strength)*10)/10;
                            positionValues[0][3] = Math.round((positionValues[0][2]/playerData.strength)*1000)/10;
                            positionValues[1][0] = "ZIV";
                            positionValues[1][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*1+playerData.condition*2+playerData.speed*8+playerData.technique*3+playerData.shootingtechnique*5+playerData.shootingpower*2+playerData.header*9+playerData.duel*10+playerData.tactics*8+playerData.athletics*6)/55)*10)/10;
                            positionValues[1][2] = Math.round((positionValues[1][1]-playerData.strength)*10)/10;
                            positionValues[1][3] = Math.round((positionValues[1][2]/playerData.strength)*1000)/10;
                            positionValues[2][0] = "RIV";
                            positionValues[2][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*3+playerData.condition*2+playerData.speed*8+playerData.technique*4+playerData.shootingtechnique*5+playerData.shootingpower*2+playerData.header*8+playerData.duel*9+playerData.tactics*8+playerData.athletics*6)/56)*10)/10;
                            positionValues[2][2] = Math.round((positionValues[2][1]-playerData.strength)*10)/10;
                            positionValues[2][3] = Math.round((positionValues[2][2]/playerData.strength)*1000)/10;
                            positionValues[3][0] = "LOM";
                            positionValues[3][1] = Math.round(((playerData.leftfoot*4+playerData.rightfoot*1+playerData.condition*1+playerData.speed*9+playerData.technique*8+playerData.shootingtechnique*8+playerData.shootingpower*1+playerData.header*1+playerData.duel*5+playerData.tactics*4+playerData.athletics*2)/44)*10)/10;
                            positionValues[3][2] = Math.round((positionValues[3][1]-playerData.strength)*10)/10;
                            positionValues[3][3] = Math.round((positionValues[3][2]/playerData.strength)*1000)/10;
                            positionValues[4][0] = "ZLOM";
                            positionValues[4][1] = Math.round(((playerData.leftfoot*3+playerData.rightfoot*1+playerData.condition*1+playerData.speed*8+playerData.technique*8+playerData.shootingtechnique*7+playerData.shootingpower*1+playerData.header*2+playerData.duel*7+playerData.tactics*5+playerData.athletics*2)/45)*10)/10;
                            positionValues[4][2] = Math.round((positionValues[4][1]-playerData.strength)*10)/10;
                            positionValues[4][3] = Math.round((positionValues[4][2]/playerData.strength)*1000)/10;
                            positionValues[5][0] = "ZROM";
                            positionValues[5][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*3+playerData.condition*1+playerData.speed*8+playerData.technique*8+playerData.shootingtechnique*7+playerData.shootingpower*1+playerData.header*2+playerData.duel*7+playerData.tactics*5+playerData.athletics*2)/45)*10)/10;
                            positionValues[5][2] = Math.round((positionValues[5][1]-playerData.strength)*10)/10;
                            positionValues[5][3] = Math.round((positionValues[5][2]/playerData.strength)*1000)/10;
                            positionValues[6][0] = "ROM";
                            positionValues[6][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*4+playerData.condition*1+playerData.speed*9+playerData.technique*8+playerData.shootingtechnique*8+playerData.shootingpower*1+playerData.header*1+playerData.duel*5+playerData.tactics*4+playerData.athletics*2)/44)*10)/10;
                            positionValues[6][2] = Math.round((positionValues[6][1]-playerData.strength)*10)/10;
                            positionValues[6][3] = Math.round((positionValues[6][2]/playerData.strength)*1000)/10;
                            positionValues[7][0] = "LST";
                            positionValues[7][1] = Math.round(((playerData.leftfoot*4+playerData.rightfoot*1+playerData.condition*1+playerData.speed*8+playerData.technique*9+playerData.shootingtechnique*8+playerData.shootingpower*1+playerData.header*3+playerData.duel*2+playerData.tactics*4+playerData.athletics*3)/44)*10)/10;
                            positionValues[7][2] = Math.round((positionValues[7][1]-playerData.strength)*10)/10;
                            positionValues[7][3] = Math.round((positionValues[7][2]/playerData.strength)*1000)/10;
                            positionValues[8][0] = "ST";
                            positionValues[8][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*1+playerData.condition*1+playerData.speed*8+playerData.technique*9+playerData.shootingtechnique*5+playerData.shootingpower*1+playerData.header*9+playerData.duel*2+playerData.tactics*3+playerData.athletics*7)/47)*10)/10;
                            positionValues[8][2] = Math.round((positionValues[8][1]-playerData.strength)*10)/10;
                            positionValues[8][3] = Math.round((positionValues[8][2]/playerData.strength)*1000)/10;
                            positionValues[9][0] = "RST";
                            positionValues[9][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*4+playerData.condition*1+playerData.speed*8+playerData.technique*9+playerData.shootingtechnique*8+playerData.shootingpower*1+playerData.header*3+playerData.duel*2+playerData.tactics*4+playerData.athletics*3)/44)*10)/10;
                            positionValues[9][2] = Math.round((positionValues[9][1]-playerData.strength)*10)/10;
                            positionValues[9][3] = Math.round((positionValues[9][2]/playerData.strength)*1000)/10;
                            break;
                        case 2: // 3-5-2 Dreierkette, Kompaktes Mittelfeld
                            positionValues[0][0] = "LIV";
                            positionValues[0][1] = Math.round(((playerData.leftfoot*7+playerData.rightfoot*1+playerData.condition*6+playerData.speed*6+playerData.technique*5+playerData.shootingtechnique*5+playerData.shootingpower*4+playerData.header*7+playerData.duel*8+playerData.tactics*6+playerData.athletics*6)/61)*10)/10;
                            positionValues[0][2] = Math.round((positionValues[0][1]-playerData.strength)*10)/10;
                            positionValues[0][3] = Math.round((positionValues[0][2]/playerData.strength)*1000)/10;
                            positionValues[1][0] = "ZIV";
                            positionValues[1][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*1+playerData.condition*1+playerData.speed*5+playerData.technique*2+playerData.shootingtechnique*3+playerData.shootingpower*2+playerData.header*9+playerData.duel*9+playerData.tactics*7+playerData.athletics*6)/46)*10)/10;
                            positionValues[1][2] = Math.round((positionValues[1][1]-playerData.strength)*10)/10;
                            positionValues[1][3] = Math.round((positionValues[1][2]/playerData.strength)*1000)/10;
                            positionValues[2][0] = "RIV";
                            positionValues[2][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*3+playerData.condition*1+playerData.speed*5+playerData.technique*3+playerData.shootingtechnique*4+playerData.shootingpower*2+playerData.header*7+playerData.duel*9+playerData.tactics*7+playerData.athletics*6)/48)*10)/10;
                            positionValues[2][2] = Math.round((positionValues[2][1]-playerData.strength)*10)/10;
                            positionValues[2][3] = Math.round((positionValues[2][2]/playerData.strength)*1000)/10;
                            positionValues[3][0] = "LDM";
                            positionValues[3][1] = Math.round(((playerData.leftfoot*7+playerData.rightfoot*1+playerData.condition*6+playerData.speed*6+playerData.technique*5+playerData.shootingtechnique*5+playerData.shootingpower*5+playerData.header*5+playerData.duel*7+playerData.tactics*6+playerData.athletics*6)/59)*10)/10;
                            positionValues[3][2] = Math.round((positionValues[3][1]-playerData.strength)*10)/10;
                            positionValues[3][3] = Math.round((positionValues[3][2]/playerData.strength)*1000)/10;
                            positionValues[4][0] = "RDM";
                            positionValues[4][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*3+playerData.condition*1+playerData.speed*3+playerData.technique*6+playerData.shootingtechnique*7+playerData.shootingpower*1+playerData.header*4+playerData.duel*9+playerData.tactics*7+playerData.athletics*1)/43)*10)/10;
                            positionValues[4][2] = Math.round((positionValues[4][1]-playerData.strength)*10)/10;
                            positionValues[4][3] = Math.round((positionValues[4][2]/playerData.strength)*1000)/10;
                            positionValues[5][0] = "LOM";
                            positionValues[5][1] = Math.round(((playerData.leftfoot*8+playerData.rightfoot*1+playerData.condition*8+playerData.speed*8+playerData.technique*7+playerData.shootingtechnique*6+playerData.shootingpower*5+playerData.header*4+playerData.duel*6+playerData.tactics*6+playerData.athletics*8)/67)*10)/10;
                            positionValues[5][2] = Math.round((positionValues[5][1]-playerData.strength)*10)/10;
                            positionValues[5][3] = Math.round((positionValues[5][2]/playerData.strength)*1000)/10;
                            positionValues[6][0] = "ZOM";
                            positionValues[6][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*1+playerData.condition*1+playerData.speed*4+playerData.technique*9+playerData.shootingtechnique*9+playerData.shootingpower*1+playerData.header*6+playerData.duel*4+playerData.tactics*8+playerData.athletics*4)/48)*10)/10;
                            positionValues[6][2] = Math.round((positionValues[6][1]-playerData.strength)*10)/10;
                            positionValues[6][3] = Math.round((positionValues[6][2]/playerData.strength)*1000)/10;
                            positionValues[7][0] = "ROM";
                            positionValues[7][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*3+playerData.condition*1+playerData.speed*8+playerData.technique*7+playerData.shootingtechnique*9+playerData.shootingpower*1+playerData.header*3+playerData.duel*5+playerData.tactics*4+playerData.athletics*4)/46)*10)/10;
                            positionValues[7][2] = Math.round((positionValues[7][1]-playerData.strength)*10)/10;
                            positionValues[7][3] = Math.round((positionValues[7][2]/playerData.strength)*1000)/10;
                            positionValues[8][0] = "ST(L)";
                            positionValues[8][1] = Math.round(((playerData.leftfoot*6+playerData.rightfoot*6+playerData.condition*5+playerData.speed*6+playerData.technique*5+playerData.shootingtechnique*6+playerData.shootingpower*7+playerData.header*7+playerData.duel*5+playerData.tactics*6+playerData.athletics*5)/64)*10)/10;
                            positionValues[8][2] = Math.round((positionValues[8][1]-playerData.strength)*10)/10;
                            positionValues[8][3] = Math.round((positionValues[8][2]/playerData.strength)*1000)/10;
                            positionValues[9][0] = "ST(R)";
                            positionValues[9][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*2+playerData.condition*1+playerData.speed*7+playerData.technique*7+playerData.shootingtechnique*5+playerData.shootingpower*1+playerData.header*3+playerData.duel*2+playerData.tactics*4+playerData.athletics*4)/37)*10)/10;
                            positionValues[9][2] = Math.round((positionValues[9][1]-playerData.strength)*10)/10;
                            positionValues[9][3] = Math.round((positionValues[9][2]/playerData.strength)*1000)/10;
                            break;
                        case 3: // 4-1-4-1 Defensiv, Konter
                            positionValues[0][0] = "LAV";
                            positionValues[0][1] = Math.round(((playerData.leftfoot*4+playerData.rightfoot*1+playerData.condition*1+playerData.speed*8+playerData.technique*4+playerData.shootingtechnique*8+playerData.shootingpower*1+playerData.header*1+playerData.duel*8+playerData.tactics*3+playerData.athletics*2)/41)*10)/10;
                            positionValues[0][2] = Math.round((positionValues[0][1]-playerData.strength)*10)/10;
                            positionValues[0][3] = Math.round((positionValues[0][2]/playerData.strength)*1000)/10;
                            positionValues[1][0] = "LIV";
                            positionValues[1][1] = Math.round(((playerData.leftfoot*3+playerData.rightfoot*1+playerData.condition*1+playerData.speed*2+playerData.technique*2+playerData.shootingtechnique*1+playerData.shootingpower*2+playerData.header*10+playerData.duel*10+playerData.tactics*8+playerData.athletics*6)/46)*10)/10;
                            positionValues[1][2] = Math.round((positionValues[1][1]-playerData.strength)*10)/10;
                            positionValues[1][3] = Math.round((positionValues[1][2]/playerData.strength)*1000)/10;
                            positionValues[2][0] = "RIV";
                            positionValues[2][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*3+playerData.condition*1+playerData.speed*2+playerData.technique*2+playerData.shootingtechnique*1+playerData.shootingpower*2+playerData.header*10+playerData.duel*10+playerData.tactics*8+playerData.athletics*6)/46)*10)/10;
                            positionValues[2][2] = Math.round((positionValues[2][1]-playerData.strength)*10)/10;
                            positionValues[2][3] = Math.round((positionValues[2][2]/playerData.strength)*1000)/10;
                            positionValues[3][0] = "RAV";
                            positionValues[3][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*4+playerData.condition*1+playerData.speed*8+playerData.technique*4+playerData.shootingtechnique*8+playerData.shootingpower*1+playerData.header*1+playerData.duel*8+playerData.tactics*3+playerData.athletics*2)/41)*10)/10;
                            positionValues[3][2] = Math.round((positionValues[3][1]-playerData.strength)*10)/10;
                            positionValues[3][3] = Math.round((positionValues[3][2]/playerData.strength)*1000)/10;
                            positionValues[4][0] = "DM";
                            positionValues[4][1] = Math.round(((playerData.leftfoot*7+playerData.rightfoot*7+playerData.condition*8+playerData.speed*8+playerData.technique*7+playerData.shootingtechnique*6+playerData.shootingpower*5+playerData.header*8+playerData.duel*8+playerData.tactics*10+playerData.athletics*8)/82)*10)/10;
                            positionValues[4][2] = Math.round((positionValues[4][1]-playerData.strength)*10)/10;
                            positionValues[4][3] = Math.round((positionValues[4][2]/playerData.strength)*1000)/10;
                            positionValues[5][0] = "LOM";
                            positionValues[5][1] = Math.round(((playerData.leftfoot*4+playerData.rightfoot*1+playerData.condition*2+playerData.speed*8+playerData.technique*9+playerData.shootingtechnique*7+playerData.shootingpower*1+playerData.header*2+playerData.duel*1+playerData.tactics*8+playerData.athletics*5)/48)*10)/10;
                            positionValues[5][2] = Math.round((positionValues[5][1]-playerData.strength)*10)/10;
                            positionValues[5][3] = Math.round((positionValues[5][2]/playerData.strength)*1000)/10;
                            positionValues[6][0] = "ZOM(L)";
                            positionValues[6][1] = Math.round(((playerData.leftfoot*3+playerData.rightfoot*1+playerData.condition*1+playerData.speed*8+playerData.technique*5+playerData.shootingtechnique*7+playerData.shootingpower*1+playerData.header*3+playerData.duel*6+playerData.tactics*7+playerData.athletics*5)/47)*10)/10;
                            positionValues[6][2] = Math.round((positionValues[6][1]-playerData.strength)*10)/10;
                            positionValues[6][3] = Math.round((positionValues[6][2]/playerData.strength)*1000)/10;
                            positionValues[7][0] = "ZOM(R)";
                            positionValues[7][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*3+playerData.condition*1+playerData.speed*8+playerData.technique*5+playerData.shootingtechnique*7+playerData.shootingpower*1+playerData.header*3+playerData.duel*6+playerData.tactics*7+playerData.athletics*5)/47)*10)/10;
                            positionValues[7][2] = Math.round((positionValues[7][1]-playerData.strength)*10)/10;
                            positionValues[7][3] = Math.round((positionValues[7][2]/playerData.strength)*1000)/10;
                            positionValues[8][0] = "ROM";
                            positionValues[8][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*4+playerData.condition*2+playerData.speed*8+playerData.technique*6+playerData.shootingtechnique*7+playerData.shootingpower*1+playerData.header*2+playerData.duel*1+playerData.tactics*8+playerData.athletics*5)/45)*10)/10;
                            positionValues[8][2] = Math.round((positionValues[8][1]-playerData.strength)*10)/10;
                            positionValues[8][3] = Math.round((positionValues[8][2]/playerData.strength)*1000)/10;
                            positionValues[9][0] = "ST";
                            positionValues[9][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*1+playerData.condition*1+playerData.speed*8+playerData.technique*7+playerData.shootingtechnique*7+playerData.shootingpower*1+playerData.header*8+playerData.duel*5+playerData.tactics*3+playerData.athletics*6)/48)*10)/10;
                            positionValues[9][2] = Math.round((positionValues[9][1]-playerData.strength)*10)/10;
                            positionValues[9][3] = Math.round((positionValues[9][2]/playerData.strength)*1000)/10;
                            break;
                        case 4: // 4-1-5-0 Falsche Neun
                            positionValues[0][0] = "LAV";
                            positionValues[0][1] = Math.round(((playerData.leftfoot*3+playerData.rightfoot*1+playerData.condition*1+playerData.speed*8+playerData.technique*6+playerData.shootingtechnique*8+playerData.shootingpower*1+playerData.header*1+playerData.duel*8+playerData.tactics*7+playerData.athletics*1)/45)*10)/10;
                            positionValues[0][2] = Math.round((positionValues[0][1]-playerData.strength)*10)/10;
                            positionValues[0][3] = Math.round((positionValues[0][2]/playerData.strength)*1000)/10;
                            positionValues[1][0] = "LIV";
                            positionValues[1][1] = Math.round(((playerData.leftfoot*4+playerData.rightfoot*1+playerData.condition*1+playerData.speed*7+playerData.technique*4+playerData.shootingtechnique*6+playerData.shootingpower*1+playerData.header*9+playerData.duel*10+playerData.tactics*8+playerData.athletics*6)/57)*10)/10;
                            positionValues[1][2] = Math.round((positionValues[1][1]-playerData.strength)*10)/10;
                            positionValues[1][3] = Math.round((positionValues[1][2]/playerData.strength)*1000)/10;
                            positionValues[2][0] = "RIV";
                            positionValues[2][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*4+playerData.condition*1+playerData.speed*7+playerData.technique*4+playerData.shootingtechnique*6+playerData.shootingpower*1+playerData.header*9+playerData.duel*10+playerData.tactics*8+playerData.athletics*6)/57)*10)/10;
                            positionValues[2][2] = Math.round((positionValues[2][1]-playerData.strength)*10)/10;
                            positionValues[2][3] = Math.round((positionValues[2][2]/playerData.strength)*1000)/10;
                            positionValues[3][0] = "RAV";
                            positionValues[3][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*3+playerData.condition*1+playerData.speed*8+playerData.technique*6+playerData.shootingtechnique*8+playerData.shootingpower*1+playerData.header*1+playerData.duel*8+playerData.tactics*7+playerData.athletics*1)/45)*10)/10;
                            positionValues[3][2] = Math.round((positionValues[3][1]-playerData.strength)*10)/10;
                            positionValues[3][3] = Math.round((positionValues[3][2]/playerData.strength)*1000)/10;
                            positionValues[4][0] = "DM";
                            positionValues[4][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*1+playerData.condition*2+playerData.speed*5+playerData.technique*7+playerData.shootingtechnique*3+playerData.shootingpower*2+playerData.header*5+playerData.duel*9+playerData.tactics*7+playerData.athletics*6)/48)*10)/10;
                            positionValues[4][2] = Math.round((positionValues[4][1]-playerData.strength)*10)/10;
                            positionValues[4][3] = Math.round((positionValues[4][2]/playerData.strength)*1000)/10;
                            positionValues[5][0] = "LOM";
                            positionValues[5][1] = Math.round(((playerData.leftfoot*3+playerData.rightfoot*1+playerData.condition*1+playerData.speed*8+playerData.technique*8+playerData.shootingtechnique*8+playerData.shootingpower*1+playerData.header*2+playerData.duel*3+playerData.tactics*7+playerData.athletics*3)/45)*10)/10;
                            positionValues[5][2] = Math.round((positionValues[5][1]-playerData.strength)*10)/10;
                            positionValues[5][3] = Math.round((positionValues[5][2]/playerData.strength)*1000)/10;
                            positionValues[6][0] = "ZOM";
                            positionValues[6][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*1+playerData.condition*1+playerData.speed*8+playerData.technique*9+playerData.shootingtechnique*7+playerData.shootingpower*1+playerData.header*2+playerData.duel*4+playerData.tactics*8+playerData.athletics*3)/45)*10)/10;
                            positionValues[6][2] = Math.round((positionValues[6][1]-playerData.strength)*10)/10;
                            positionValues[6][3] = Math.round((positionValues[6][2]/playerData.strength)*1000)/10;
                            positionValues[7][0] = "ROM";
                            positionValues[7][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*3+playerData.condition*1+playerData.speed*8+playerData.technique*8+playerData.shootingtechnique*8+playerData.shootingpower*1+playerData.header*2+playerData.duel*3+playerData.tactics*7+playerData.athletics*3)/45)*10)/10;
                            positionValues[7][2] = Math.round((positionValues[7][1]-playerData.strength)*10)/10;
                            positionValues[7][3] = Math.round((positionValues[7][2]/playerData.strength)*1000)/10;
                            positionValues[8][0] = "LST";
                            positionValues[8][1] = Math.round(((playerData.leftfoot*4+playerData.rightfoot*1+playerData.condition*1+playerData.speed*8+playerData.technique*8+playerData.shootingtechnique*9+playerData.shootingpower*1+playerData.header*1+playerData.duel*2+playerData.tactics*7+playerData.athletics*2)/44)*10)/10;
                            positionValues[8][2] = Math.round((positionValues[8][1]-playerData.strength)*10)/10;
                            positionValues[8][3] = Math.round((positionValues[8][2]/playerData.strength)*1000)/10;
                            positionValues[9][0] = "RST";
                            positionValues[9][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*4+playerData.condition*1+playerData.speed*8+playerData.technique*8+playerData.shootingtechnique*9+playerData.shootingpower*1+playerData.header*1+playerData.duel*2+playerData.tactics*7+playerData.athletics*2)/44)*10)/10;
                            positionValues[9][2] = Math.round((positionValues[9][1]-playerData.strength)*10)/10;
                            positionValues[9][3] = Math.round((positionValues[9][2]/playerData.strength)*1000)/10;
                            break;
                        case 5: // 4-2-3-1 Defensiv, Konter
                            positionValues[0][0] = "LAV";
                            positionValues[0][1] = Math.round(((playerData.leftfoot*3+playerData.rightfoot*1+playerData.condition*1+playerData.speed*7+playerData.technique*4+playerData.shootingtechnique*7+playerData.shootingpower*1+playerData.header*2+playerData.duel*9+playerData.tactics*7+playerData.athletics*2)/44)*10)/10;
                            positionValues[0][2] = Math.round((positionValues[0][1]-playerData.strength)*10)/10;
                            positionValues[0][3] = Math.round((positionValues[0][2]/playerData.strength)*1000)/10;
                            positionValues[1][0] = "LIV";
                            positionValues[1][1] = Math.round(((playerData.leftfoot*4+playerData.rightfoot*1+playerData.condition*1+playerData.speed*1+playerData.technique*2+playerData.shootingtechnique*2+playerData.shootingpower*2+playerData.header*10+playerData.duel*10+playerData.tactics*8+playerData.athletics*4)/45)*10)/10;
                            positionValues[1][2] = Math.round((positionValues[1][1]-playerData.strength)*10)/10;
                            positionValues[1][3] = Math.round((positionValues[1][2]/playerData.strength)*1000)/10;
                            positionValues[2][0] = "RIV";
                            positionValues[2][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*4+playerData.condition*1+playerData.speed*1+playerData.technique*2+playerData.shootingtechnique*2+playerData.shootingpower*2+playerData.header*10+playerData.duel*10+playerData.tactics*8+playerData.athletics*4)/45)*10)/10;
                            positionValues[2][2] = Math.round((positionValues[2][1]-playerData.strength)*10)/10;
                            positionValues[2][3] = Math.round((positionValues[2][2]/playerData.strength)*1000)/10;
                            positionValues[3][0] = "RAV";
                            positionValues[3][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*3+playerData.condition*1+playerData.speed*7+playerData.technique*4+playerData.shootingtechnique*7+playerData.shootingpower*1+playerData.header*2+playerData.duel*9+playerData.tactics*7+playerData.athletics*2)/44)*10)/10;
                            positionValues[3][2] = Math.round((positionValues[3][1]-playerData.strength)*10)/10;
                            positionValues[3][3] = Math.round((positionValues[3][2]/playerData.strength)*1000)/10;
                            positionValues[4][0] = "LDM";
                            positionValues[4][1] = Math.round(((playerData.leftfoot*3+playerData.rightfoot*1+playerData.condition*1+playerData.speed*2+playerData.technique*6+playerData.shootingtechnique*8+playerData.shootingpower*1+playerData.header*5+playerData.duel*10+playerData.tactics*3+playerData.athletics*5)/45)*10)/10;
                            positionValues[4][2] = Math.round((positionValues[4][1]-playerData.strength)*10)/10;
                            positionValues[4][3] = Math.round((positionValues[4][2]/playerData.strength)*1000)/10;
                            positionValues[5][0] = "LDM(O)";
                            positionValues[5][1] = Math.round(((playerData.leftfoot*3+playerData.rightfoot*1+playerData.condition*2+playerData.speed*7+playerData.technique*7+playerData.shootingtechnique*8+playerData.shootingpower*1+playerData.header*1+playerData.duel*6+playerData.tactics*7+playerData.athletics*2)/45)*10)/10;
                            positionValues[5][2] = Math.round((positionValues[5][1]-playerData.strength)*10)/10;
                            positionValues[5][3] = Math.round((positionValues[5][2]/playerData.strength)*1000)/10;
                            positionValues[6][0] = "RDM(O)";
                            positionValues[6][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*3+playerData.condition*2+playerData.speed*7+playerData.technique*7+playerData.shootingtechnique*8+playerData.shootingpower*1+playerData.header*1+playerData.duel*6+playerData.tactics*7+playerData.athletics*2)/45)*10)/10;
                            positionValues[6][2] = Math.round((positionValues[6][1]-playerData.strength)*10)/10;
                            positionValues[6][3] = Math.round((positionValues[6][2]/playerData.strength)*1000)/10;
                            positionValues[7][0] = "RDM";
                            positionValues[7][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*3+playerData.condition*1+playerData.speed*2+playerData.technique*6+playerData.shootingtechnique*8+playerData.shootingpower*1+playerData.header*5+playerData.duel*10+playerData.tactics*3+playerData.athletics*5)/45)*10)/10;
                            positionValues[7][2] = Math.round((positionValues[7][1]-playerData.strength)*10)/10;
                            positionValues[7][3] = Math.round((positionValues[7][2]/playerData.strength)*1000)/10;
                            positionValues[8][0] = "ZOM";
                            positionValues[8][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*1+playerData.condition*1+playerData.speed*8+playerData.technique*8+playerData.shootingtechnique*9+playerData.shootingpower*1+playerData.header*6+playerData.duel*3+playerData.tactics*6+playerData.athletics*4)/48)*10)/10;
                            positionValues[8][2] = Math.round((positionValues[8][1]-playerData.strength)*10)/10;
                            positionValues[8][3] = Math.round((positionValues[8][2]/playerData.strength)*1000)/10;
                            positionValues[9][0] = "ST";
                            positionValues[9][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*1+playerData.condition*2+playerData.speed*9+playerData.technique*4+playerData.shootingtechnique*5+playerData.shootingpower*1+playerData.header*7+playerData.duel*3+playerData.tactics*6+playerData.athletics*7)/46)*10)/10;
                            positionValues[9][2] = Math.round((positionValues[9][1]-playerData.strength)*10)/10;
                            positionValues[9][3] = Math.round((positionValues[9][2]/playerData.strength)*1000)/10;
                            break;
                        case 6: // 4-2-3-1 Kontrollierte Offensive
                            positionValues[0][0] = "LAV";
                            positionValues[0][1] = Math.round(((playerData.leftfoot*8+playerData.rightfoot*1+playerData.condition*7+playerData.speed*7+playerData.technique*4+playerData.shootingtechnique*5+playerData.shootingpower*5+playerData.header*4+playerData.duel*8+playerData.tactics*6+playerData.athletics*4)/59)*10)/10;
                            positionValues[0][2] = Math.round((positionValues[0][1]-playerData.strength)*10)/10;
                            positionValues[0][3] = Math.round((positionValues[0][2]/playerData.strength)*1000)/10;
                            positionValues[1][0] = "LIV";
                            positionValues[1][1] = Math.round(((playerData.leftfoot*8+playerData.rightfoot*1+playerData.condition*3+playerData.speed*6+playerData.technique*4+playerData.shootingtechnique*3+playerData.shootingpower*4+playerData.header*8+playerData.duel*9+playerData.tactics*6+playerData.athletics*4)/56)*10)/10;
                            positionValues[1][2] = Math.round((positionValues[1][1]-playerData.strength)*10)/10;
                            positionValues[1][3] = Math.round((positionValues[1][2]/playerData.strength)*1000)/10;
                            positionValues[2][0] = "RIV";
                            positionValues[2][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*4+playerData.condition*1+playerData.speed*2+playerData.technique*2+playerData.shootingtechnique*6+playerData.shootingpower*1+playerData.header*10+playerData.duel*10+playerData.tactics*7+playerData.athletics*4)/48)*10)/10;
                            positionValues[2][2] = Math.round((positionValues[2][1]-playerData.strength)*10)/10;
                            positionValues[2][3] = Math.round((positionValues[2][2]/playerData.strength)*1000)/10;
                            positionValues[3][0] = "RAV";
                            positionValues[3][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*4+playerData.condition*1+playerData.speed*7+playerData.technique*4+playerData.shootingtechnique*8+playerData.shootingpower*2+playerData.header*1+playerData.duel*10+playerData.tactics*6+playerData.athletics*1)/45)*10)/10;
                            positionValues[3][2] = Math.round((positionValues[3][1]-playerData.strength)*10)/10;
                            positionValues[3][3] = Math.round((positionValues[3][2]/playerData.strength)*1000)/10;
                            positionValues[4][0] = "LDM";
                            positionValues[4][1] = Math.round(((playerData.leftfoot*3+playerData.rightfoot*1+playerData.condition*1+playerData.speed*2+playerData.technique*1+playerData.shootingtechnique*7+playerData.shootingpower*3+playerData.header*6+playerData.duel*9+playerData.tactics*6+playerData.athletics*4)/43)*10)/10;
                            positionValues[4][2] = Math.round((positionValues[4][1]-playerData.strength)*10)/10;
                            positionValues[4][3] = Math.round((positionValues[4][2]/playerData.strength)*1000)/10;
                            positionValues[5][0] = "RDM";
                            positionValues[5][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*3+playerData.condition*1+playerData.speed*2+playerData.technique*1+playerData.shootingtechnique*7+playerData.shootingpower*3+playerData.header*6+playerData.duel*9+playerData.tactics*6+playerData.athletics*4)/43)*10)/10;
                            positionValues[5][2] = Math.round((positionValues[5][1]-playerData.strength)*10)/10;
                            positionValues[5][3] = Math.round((positionValues[5][2]/playerData.strength)*1000)/10;
                            positionValues[6][0] = "LOM";
                            positionValues[6][1] = Math.round(((playerData.leftfoot*4+playerData.rightfoot*1+playerData.condition*2+playerData.speed*10+playerData.technique*5+playerData.shootingtechnique*8+playerData.shootingpower*2+playerData.header*1+playerData.duel*4+playerData.tactics*6+playerData.athletics*2)/45)*10)/10;
                            positionValues[6][2] = Math.round((positionValues[6][1]-playerData.strength)*10)/10;
                            positionValues[6][3] = Math.round((positionValues[6][2]/playerData.strength)*1000)/10;
                            positionValues[7][0] = "ZOM";
                            positionValues[7][1] = Math.round(((playerData.leftfoot*6+playerData.rightfoot*6+playerData.condition*7+playerData.speed*6+playerData.technique*8+playerData.shootingtechnique*7+playerData.shootingpower*6+playerData.header*6+playerData.duel*4+playerData.tactics*6+playerData.athletics*5)/67)*10)/10;
                            positionValues[7][2] = Math.round((positionValues[7][1]-playerData.strength)*10)/10;
                            positionValues[7][3] = Math.round((positionValues[7][2]/playerData.strength)*1000)/10;
                            positionValues[8][0] = "ROM";
                            positionValues[8][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*4+playerData.condition*2+playerData.speed*10+playerData.technique*5+playerData.shootingtechnique*8+playerData.shootingpower*2+playerData.header*1+playerData.duel*4+playerData.tactics*6+playerData.athletics*2)/45)*10)/10;
                            positionValues[8][2] = Math.round((positionValues[8][1]-playerData.strength)*10)/10;
                            positionValues[8][3] = Math.round((positionValues[8][2]/playerData.strength)*1000)/10;
                            positionValues[9][0] = "ST";
                            positionValues[9][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*1+playerData.condition*1+playerData.speed*9+playerData.technique*4+playerData.shootingtechnique*4+playerData.shootingpower*1+playerData.header*8+playerData.duel*5+playerData.tactics*2+playerData.athletics*8)/44)*10)/10;
                            positionValues[9][2] = Math.round((positionValues[9][1]-playerData.strength)*10)/10;
                            positionValues[9][3] = Math.round((positionValues[9][2]/playerData.strength)*1000)/10;
                            break;
                        case 7: // 4-2-4-0 Falsche Neun
                            positionValues[0][0] = "LAV";
                            positionValues[0][1] = Math.round(((playerData.leftfoot*3+playerData.rightfoot*1+playerData.condition*1+playerData.speed*8+playerData.technique*5+playerData.shootingtechnique*8+playerData.shootingpower*1+playerData.header*1+playerData.duel*8+playerData.tactics*5+playerData.athletics*1)/42)*10)/10;
                            positionValues[0][2] = Math.round((positionValues[0][1]-playerData.strength)*10)/10;
                            positionValues[0][3] = Math.round((positionValues[0][2]/playerData.strength)*1000)/10;
                            positionValues[1][0] = "LIV";
                            positionValues[1][1] = Math.round(((playerData.leftfoot*4+playerData.rightfoot*1+playerData.condition*1+playerData.speed*7+playerData.technique*4+playerData.shootingtechnique*6+playerData.shootingpower*1+playerData.header*9+playerData.duel*9+playerData.tactics*7+playerData.athletics*6)/55)*10)/10;
                            positionValues[1][2] = Math.round((positionValues[1][1]-playerData.strength)*10)/10;
                            positionValues[1][3] = Math.round((positionValues[1][2]/playerData.strength)*1000)/10;
                            positionValues[2][0] = "RIV";
                            positionValues[2][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*4+playerData.condition*1+playerData.speed*7+playerData.technique*4+playerData.shootingtechnique*6+playerData.shootingpower*1+playerData.header*9+playerData.duel*9+playerData.tactics*7+playerData.athletics*6)/55)*10)/10;
                            positionValues[2][2] = Math.round((positionValues[2][1]-playerData.strength)*10)/10;
                            positionValues[2][3] = Math.round((positionValues[2][2]/playerData.strength)*1000)/10;
                            positionValues[3][0] = "RAV";
                            positionValues[3][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*3+playerData.condition*1+playerData.speed*8+playerData.technique*5+playerData.shootingtechnique*8+playerData.shootingpower*1+playerData.header*1+playerData.duel*8+playerData.tactics*5+playerData.athletics*1)/42)*10)/10;
                            positionValues[3][2] = Math.round((positionValues[3][1]-playerData.strength)*10)/10;
                            positionValues[3][3] = Math.round((positionValues[3][2]/playerData.strength)*1000)/10;
                            positionValues[4][0] = "LDM";
                            positionValues[4][1] = Math.round(((playerData.leftfoot*3+playerData.rightfoot*1+playerData.condition*1+playerData.speed*2+playerData.technique*5+playerData.shootingtechnique*6+playerData.shootingpower*2+playerData.header*5+playerData.duel*8+playerData.tactics*3+playerData.athletics*5)/41)*10)/10;
                            positionValues[4][2] = Math.round((positionValues[4][1]-playerData.strength)*10)/10;
                            positionValues[4][3] = Math.round((positionValues[4][2]/playerData.strength)*1000)/10;
                            positionValues[5][0] = "RDM";
                            positionValues[5][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*3+playerData.condition*1+playerData.speed*2+playerData.technique*5+playerData.shootingtechnique*6+playerData.shootingpower*2+playerData.header*5+playerData.duel*8+playerData.tactics*3+playerData.athletics*5)/41)*10)/10;
                            positionValues[5][2] = Math.round((positionValues[5][1]-playerData.strength)*10)/10;
                            positionValues[5][3] = Math.round((positionValues[5][2]/playerData.strength)*1000)/10;
                            positionValues[6][0] = "LOM";
                            positionValues[6][1] = Math.round(((playerData.leftfoot*4+playerData.rightfoot*1+playerData.condition*1+playerData.speed*8+playerData.technique*8+playerData.shootingtechnique*9+playerData.shootingpower*1+playerData.header*1+playerData.duel*2+playerData.tactics*5+playerData.athletics*2)/42)*10)/10;
                            positionValues[6][2] = Math.round((positionValues[6][1]-playerData.strength)*10)/10;
                            positionValues[6][3] = Math.round((positionValues[6][2]/playerData.strength)*1000)/10;
                            positionValues[7][0] = "ZOM(L)";
                            positionValues[7][1] = Math.round(((playerData.leftfoot*3+playerData.rightfoot*1+playerData.condition*1+playerData.speed*7+playerData.technique*9+playerData.shootingtechnique*8+playerData.shootingpower*1+playerData.header*4+playerData.duel*4+playerData.tactics*5+playerData.athletics*3)/46)*10)/10;
                            positionValues[7][2] = Math.round((positionValues[7][1]-playerData.strength)*10)/10;
                            positionValues[7][3] = Math.round((positionValues[7][2]/playerData.strength)*1000)/10;
                            positionValues[8][0] = "ZOM(R)";
                            positionValues[8][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*3+playerData.condition*1+playerData.speed*7+playerData.technique*9+playerData.shootingtechnique*8+playerData.shootingpower*1+playerData.header*4+playerData.duel*4+playerData.tactics*5+playerData.athletics*3)/46)*10)/10;
                            positionValues[8][2] = Math.round((positionValues[8][1]-playerData.strength)*10)/10;
                            positionValues[8][3] = Math.round((positionValues[8][2]/playerData.strength)*1000)/10;
                            positionValues[9][0] = "ROM";
                            positionValues[9][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*4+playerData.condition*1+playerData.speed*8+playerData.technique*8+playerData.shootingtechnique*9+playerData.shootingpower*1+playerData.header*1+playerData.duel*2+playerData.tactics*5+playerData.athletics*2)/42)*10)/10;
                            positionValues[9][2] = Math.round((positionValues[9][1]-playerData.strength)*10)/10;
                            positionValues[9][3] = Math.round((positionValues[9][2]/playerData.strength)*1000)/10;
                            break;
                        case 8: // 4-3-3 Halb offensiv, Konter
                            positionValues[0][0] = "LAV";
                            positionValues[0][1] = Math.round(((playerData.leftfoot*4+playerData.rightfoot*1+playerData.condition*2+playerData.speed*7+playerData.technique*3+playerData.shootingtechnique*7+playerData.shootingpower*2+playerData.header*1+playerData.duel*10+playerData.tactics*6+playerData.athletics*1)/44)*10)/10;
                            positionValues[0][2] = Math.round((positionValues[0][1]-playerData.strength)*10)/10;
                            positionValues[0][3] = Math.round((positionValues[0][2]/playerData.strength)*1000)/10;
                            positionValues[1][0] = "LIV";
                            positionValues[1][1] = Math.round(((playerData.leftfoot*4+playerData.rightfoot*1+playerData.condition*1+playerData.speed*2+playerData.technique*2+playerData.shootingtechnique*3+playerData.shootingpower*1+playerData.header*10+playerData.duel*10+playerData.tactics*8+playerData.athletics*4)/46)*10)/10;
                            positionValues[1][2] = Math.round((positionValues[1][1]-playerData.strength)*10)/10;
                            positionValues[1][3] = Math.round((positionValues[1][2]/playerData.strength)*1000)/10;
                            positionValues[2][0] = "RIV";
                            positionValues[2][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*4+playerData.condition*1+playerData.speed*2+playerData.technique*2+playerData.shootingtechnique*3+playerData.shootingpower*1+playerData.header*10+playerData.duel*10+playerData.tactics*8+playerData.athletics*4)/46)*10)/10;
                            positionValues[2][2] = Math.round((positionValues[2][1]-playerData.strength)*10)/10;
                            positionValues[2][3] = Math.round((positionValues[2][2]/playerData.strength)*1000)/10;
                            positionValues[3][0] = "RAV";
                            positionValues[3][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*4+playerData.condition*2+playerData.speed*7+playerData.technique*3+playerData.shootingtechnique*7+playerData.shootingpower*2+playerData.header*1+playerData.duel*10+playerData.tactics*6+playerData.athletics*1)/44)*10)/10;
                            positionValues[3][2] = Math.round((positionValues[3][1]-playerData.strength)*10)/10;
                            positionValues[3][3] = Math.round((positionValues[3][2]/playerData.strength)*1000)/10;
                            positionValues[4][0] = "DM";
                            positionValues[4][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*1+playerData.condition*1+playerData.speed*2+playerData.technique*2+playerData.shootingtechnique*7+playerData.shootingpower*3+playerData.header*8+playerData.duel*10+playerData.tactics*7+playerData.athletics*5)/47)*10)/10;
                            positionValues[4][2] = Math.round((positionValues[4][1]-playerData.strength)*10)/10;
                            positionValues[4][3] = Math.round((positionValues[4][2]/playerData.strength)*1000)/10;
                            positionValues[5][0] = "LOM";
                            positionValues[5][1] = Math.round(((playerData.leftfoot*3+playerData.rightfoot*1+playerData.condition*2+playerData.speed*4+playerData.technique*4+playerData.shootingtechnique*6+playerData.shootingpower*2+playerData.header*3+playerData.duel*8+playerData.tactics*7+playerData.athletics*2)/42)*10)/10;
                            positionValues[5][2] = Math.round((positionValues[5][1]-playerData.strength)*10)/10;
                            positionValues[5][3] = Math.round((positionValues[5][2]/playerData.strength)*1000)/10;
                            positionValues[6][0] = "ROM";
                            positionValues[6][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*3+playerData.condition*2+playerData.speed*4+playerData.technique*4+playerData.shootingtechnique*6+playerData.shootingpower*2+playerData.header*3+playerData.duel*8+playerData.tactics*7+playerData.athletics*2)/42)*10)/10;
                            positionValues[6][2] = Math.round((positionValues[6][1]-playerData.strength)*10)/10;
                            positionValues[6][3] = Math.round((positionValues[6][2]/playerData.strength)*1000)/10;
                            positionValues[7][0] = "LST";
                            positionValues[7][1] = Math.round(((playerData.leftfoot*5+playerData.rightfoot*1+playerData.condition*2+playerData.speed*10+playerData.technique*7+playerData.shootingtechnique*9+playerData.shootingpower*3+playerData.header*2+playerData.duel*2+playerData.tactics*8+playerData.athletics*2)/51)*10)/10;
                            positionValues[7][2] = Math.round((positionValues[7][1]-playerData.strength)*10)/10;
                            positionValues[7][3] = Math.round((positionValues[7][2]/playerData.strength)*1000)/10;
                            positionValues[8][0] = "ST";
                            positionValues[8][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*1+playerData.condition*2+playerData.speed*10+playerData.technique*3+playerData.shootingtechnique*7+playerData.shootingpower*1+playerData.header*9+playerData.duel*4+playerData.tactics*5+playerData.athletics*4)/47)*10)/10;
                            positionValues[8][2] = Math.round((positionValues[8][1]-playerData.strength)*10)/10;
                            positionValues[8][3] = Math.round((positionValues[8][2]/playerData.strength)*1000)/10;
                            positionValues[9][0] = "RST";
                            positionValues[9][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*5+playerData.condition*2+playerData.speed*10+playerData.technique*7+playerData.shootingtechnique*9+playerData.shootingpower*3+playerData.header*2+playerData.duel*2+playerData.tactics*8+playerData.athletics*2)/51)*10)/10;
                            positionValues[9][2] = Math.round((positionValues[9][1]-playerData.strength)*10)/10;
                            positionValues[9][3] = Math.round((positionValues[9][2]/playerData.strength)*1000)/10;
                            break;
                        case 9: // 4-3-3 Offensiv
                            positionValues[0][0] = "LAV";
                            positionValues[0][1] = Math.round(((playerData.leftfoot*2+playerData.rightfoot*1+playerData.condition*2+playerData.speed*9+playerData.technique*7+playerData.shootingtechnique*9+playerData.shootingpower*1+playerData.header*1+playerData.duel*8+playerData.tactics*7+playerData.athletics*1)/48)*10)/10;
                            positionValues[0][2] = Math.round((positionValues[0][1]-playerData.strength)*10)/10;
                            positionValues[0][3] = Math.round((positionValues[0][2]/playerData.strength)*1000)/10;
                            positionValues[1][0] = "LIV";
                            positionValues[1][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*4+playerData.condition*1+playerData.speed*10+playerData.technique*5+playerData.shootingtechnique*7+playerData.shootingpower*1+playerData.header*8+playerData.duel*10+playerData.tactics*10+playerData.athletics*7)/64)*10)/10;
                            positionValues[1][2] = Math.round((positionValues[1][1]-playerData.strength)*10)/10;
                            positionValues[1][3] = Math.round((positionValues[1][2]/playerData.strength)*1000)/10;
                            positionValues[2][0] = "RIV";
                            positionValues[2][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*4+playerData.condition*1+playerData.speed*10+playerData.technique*5+playerData.shootingtechnique*7+playerData.shootingpower*1+playerData.header*8+playerData.duel*10+playerData.tactics*10+playerData.athletics*7)/64)*10)/10;
                            positionValues[2][2] = Math.round((positionValues[2][1]-playerData.strength)*10)/10;
                            positionValues[2][3] = Math.round((positionValues[2][2]/playerData.strength)*1000)/10;
                            positionValues[3][0] = "RAV";
                            positionValues[3][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*2+playerData.condition*2+playerData.speed*9+playerData.technique*7+playerData.shootingtechnique*9+playerData.shootingpower*1+playerData.header*1+playerData.duel*8+playerData.tactics*7+playerData.athletics*1)/48)*10)/10;
                            positionValues[3][2] = Math.round((positionValues[3][1]-playerData.strength)*10)/10;
                            positionValues[3][3] = Math.round((positionValues[3][2]/playerData.strength)*1000)/10;
                            positionValues[4][0] = "DM";
                            positionValues[4][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*1+playerData.condition*2+playerData.speed*4+playerData.technique*8+playerData.shootingtechnique*3+playerData.shootingpower*3+playerData.header*5+playerData.duel*8+playerData.tactics*8+playerData.athletics*8)/51)*10)/10;
                            positionValues[4][2] = Math.round((positionValues[4][1]-playerData.strength)*10)/10;
                            positionValues[4][3] = Math.round((positionValues[4][2]/playerData.strength)*1000)/10;
                            positionValues[5][0] = "LOM";
                            positionValues[5][1] = Math.round(((playerData.leftfoot*3+playerData.rightfoot*1+playerData.condition*1+playerData.speed*8+playerData.technique*9+playerData.shootingtechnique*8+playerData.shootingpower*1+playerData.header*1+playerData.duel*4+playerData.tactics*4+playerData.athletics*2)/42)*10)/10;
                            positionValues[5][2] = Math.round((positionValues[5][1]-playerData.strength)*10)/10;
                            positionValues[5][3] = Math.round((positionValues[5][2]/playerData.strength)*1000)/10;
                            positionValues[6][0] = "ROM";
                            positionValues[6][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*3+playerData.condition*1+playerData.speed*8+playerData.technique*9+playerData.shootingtechnique*8+playerData.shootingpower*1+playerData.header*1+playerData.duel*4+playerData.tactics*4+playerData.athletics*2)/42)*10)/10;
                            positionValues[6][2] = Math.round((positionValues[6][1]-playerData.strength)*10)/10;
                            positionValues[6][3] = Math.round((positionValues[6][2]/playerData.strength)*1000)/10;
                            positionValues[7][0] = "LST";
                            positionValues[7][1] = Math.round(((playerData.leftfoot*4+playerData.rightfoot*1+playerData.condition*1+playerData.speed*9+playerData.technique*9+playerData.shootingtechnique*8+playerData.shootingpower*1+playerData.header*1+playerData.duel*2+playerData.tactics*4+playerData.athletics*4)/44)*10)/10;
                            positionValues[7][2] = Math.round((positionValues[7][1]-playerData.strength)*10)/10;
                            positionValues[7][3] = Math.round((positionValues[7][2]/playerData.strength)*1000)/10;
                            positionValues[8][0] = "ST";
                            positionValues[8][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*1+playerData.condition*1+playerData.speed*7+playerData.technique*7+playerData.shootingtechnique*2+playerData.shootingpower*1+playerData.header*9+playerData.duel*4+playerData.tactics*2+playerData.athletics*7)/42)*10)/10;
                            positionValues[8][2] = Math.round((positionValues[8][1]-playerData.strength)*10)/10;
                            positionValues[8][3] = Math.round((positionValues[8][2]/playerData.strength)*1000)/10;
                            positionValues[9][0] = "RST";
                            positionValues[9][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*4+playerData.condition*1+playerData.speed*9+playerData.technique*9+playerData.shootingtechnique*8+playerData.shootingpower*1+playerData.header*1+playerData.duel*2+playerData.tactics*4+playerData.athletics*4)/44)*10)/10;
                            positionValues[9][2] = Math.round((positionValues[9][1]-playerData.strength)*10)/10;
                            positionValues[9][3] = Math.round((positionValues[9][2]/playerData.strength)*1000)/10;
                            break;
                        case 10: // 4-4-2 Flach
                            positionValues[0][0] = "LAV";
                            positionValues[0][1] = Math.round(((playerData.leftfoot*4+playerData.rightfoot*1+playerData.condition*1+playerData.speed*7+playerData.technique*4+playerData.shootingtechnique*7+playerData.shootingpower*2+playerData.header*1+playerData.duel*9+playerData.tactics*7+playerData.athletics*2)/45)*10)/10;
                            positionValues[0][2] = Math.round((positionValues[0][1]-playerData.strength)*10)/10;
                            positionValues[0][3] = Math.round((positionValues[0][2]/playerData.strength)*1000)/10;
                            positionValues[1][0] = "LIV";
                            positionValues[1][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*4+playerData.condition*1+playerData.speed*3+playerData.technique*1+playerData.shootingtechnique*1+playerData.shootingpower*1+playerData.header*10+playerData.duel*10+playerData.tactics*7+playerData.athletics*4)/43)*10)/10;
                            positionValues[1][2] = Math.round((positionValues[1][1]-playerData.strength)*10)/10;
                            positionValues[1][3] = Math.round((positionValues[1][2]/playerData.strength)*1000)/10;
                            positionValues[2][0] = "RIV";
                            positionValues[2][1] = Math.round(((playerData.leftfoot*4+playerData.rightfoot*1+playerData.condition*1+playerData.speed*3+playerData.technique*1+playerData.shootingtechnique*1+playerData.shootingpower*1+playerData.header*10+playerData.duel*10+playerData.tactics*7+playerData.athletics*4)/43)*10)/10;
                            positionValues[2][2] = Math.round((positionValues[2][1]-playerData.strength)*10)/10;
                            positionValues[2][3] = Math.round((positionValues[2][2]/playerData.strength)*1000)/10;
                            positionValues[3][0] = "RAV";
                            positionValues[3][1] = Math.round(((playerData.leftfoot*4+playerData.rightfoot*1+playerData.condition*1+playerData.speed*7+playerData.technique*4+playerData.shootingtechnique*7+playerData.shootingpower*2+playerData.header*1+playerData.duel*9+playerData.tactics*7+playerData.athletics*2)/45)*10)/10;
                            positionValues[3][2] = Math.round((positionValues[3][1]-playerData.strength)*10)/10;
                            positionValues[3][3] = Math.round((positionValues[3][2]/playerData.strength)*1000)/10;
                            positionValues[4][0] = "LDM";
                            positionValues[4][1] = Math.round(((playerData.leftfoot*3+playerData.rightfoot*1+playerData.condition*1+playerData.speed*5+playerData.technique*9+playerData.shootingtechnique*6+playerData.shootingpower*1+playerData.header*6+playerData.duel*7+playerData.tactics*3+playerData.athletics*2)/44)*10)/10;
                            positionValues[4][2] = Math.round((positionValues[4][1]-playerData.strength)*10)/10;
                            positionValues[4][3] = Math.round((positionValues[4][2]/playerData.strength)*1000)/10;
                            positionValues[5][0] = "RDM";
                            positionValues[5][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*3+playerData.condition*1+playerData.speed*5+playerData.technique*9+playerData.shootingtechnique*6+playerData.shootingpower*1+playerData.header*6+playerData.duel*7+playerData.tactics*3+playerData.athletics*2)/44)*10)/10;
                            positionValues[5][2] = Math.round((positionValues[5][1]-playerData.strength)*10)/10;
                            positionValues[5][3] = Math.round((positionValues[5][2]/playerData.strength)*1000)/10;
                            positionValues[6][0] = "LOM";
                            positionValues[6][1] = Math.round(((playerData.leftfoot*4+playerData.rightfoot*1+playerData.condition*1+playerData.speed*8+playerData.technique*7+playerData.shootingtechnique*8+playerData.shootingpower*1+playerData.header*2+playerData.duel*5+playerData.tactics*3+playerData.athletics*1)/41)*10)/10;
                            positionValues[6][2] = Math.round((positionValues[6][1]-playerData.strength)*10)/10;
                            positionValues[6][3] = Math.round((positionValues[6][2]/playerData.strength)*1000)/10;
                            positionValues[7][0] = "ROM";
                            positionValues[7][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*4+playerData.condition*1+playerData.speed*8+playerData.technique*7+playerData.shootingtechnique*8+playerData.shootingpower*1+playerData.header*2+playerData.duel*5+playerData.tactics*3+playerData.athletics*1)/41)*10)/10;
                            positionValues[7][2] = Math.round((positionValues[7][1]-playerData.strength)*10)/10;
                            positionValues[7][3] = Math.round((positionValues[7][2]/playerData.strength)*1000)/10;
                            positionValues[8][0] = "ST(L)";
                            positionValues[8][1] = Math.round(((playerData.leftfoot*3+playerData.rightfoot*1+playerData.condition*1+playerData.speed*6+playerData.technique*4+playerData.shootingtechnique*5+playerData.shootingpower*1+playerData.header*8+playerData.duel*1+playerData.tactics*3+playerData.athletics*5)/38)*10)/10;
                            positionValues[8][2] = Math.round((positionValues[8][1]-playerData.strength)*10)/10;
                            positionValues[8][3] = Math.round((positionValues[8][2]/playerData.strength)*1000)/10;
                            positionValues[9][0] = "ST(R)";
                            positionValues[9][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*3+playerData.condition*1+playerData.speed*6+playerData.technique*4+playerData.shootingtechnique*5+playerData.shootingpower*1+playerData.header*8+playerData.duel*1+playerData.tactics*3+playerData.athletics*5)/38)*10)/10;
                            positionValues[9][2] = Math.round((positionValues[9][1]-playerData.strength)*10)/10;
                            positionValues[9][3] = Math.round((positionValues[9][2]/playerData.strength)*1000)/10;
                            break;
                        case 11: // 4-4-2 Flügel
                            positionValues[0][0] = "LAV";
                            positionValues[0][1] = Math.round(((playerData.leftfoot*8+playerData.rightfoot*1+playerData.condition*6+playerData.speed*4+playerData.technique*3+playerData.shootingtechnique*10+playerData.shootingpower*5+playerData.header*1+playerData.duel*7+playerData.tactics*8+playerData.athletics*1)/54)*10)/10;
                            positionValues[0][2] = Math.round((positionValues[0][1]-playerData.strength)*10)/10;
                            positionValues[0][3] = Math.round((positionValues[0][2]/playerData.strength)*1000)/10;
                            positionValues[1][0] = "LIV";
                            positionValues[1][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*4+playerData.condition*1+playerData.speed*2+playerData.technique*3+playerData.shootingtechnique*4+playerData.shootingpower*2+playerData.header*10+playerData.duel*10+playerData.tactics*8+playerData.athletics*4)/49)*10)/10;
                            positionValues[1][2] = Math.round((positionValues[1][1]-playerData.strength)*10)/10;
                            positionValues[1][3] = Math.round((positionValues[1][2]/playerData.strength)*1000)/10;
                            positionValues[2][0] = "RIV";
                            positionValues[2][1] = Math.round(((playerData.leftfoot*4+playerData.rightfoot*1+playerData.condition*1+playerData.speed*2+playerData.technique*3+playerData.shootingtechnique*4+playerData.shootingpower*2+playerData.header*10+playerData.duel*10+playerData.tactics*8+playerData.athletics*4)/49)*10)/10;
                            positionValues[2][2] = Math.round((positionValues[2][1]-playerData.strength)*10)/10;
                            positionValues[2][3] = Math.round((positionValues[2][2]/playerData.strength)*1000)/10;
                            positionValues[3][0] = "RAV";
                            positionValues[3][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*8+playerData.condition*6+playerData.speed*4+playerData.technique*3+playerData.shootingtechnique*10+playerData.shootingpower*5+playerData.header*1+playerData.duel*7+playerData.tactics*8+playerData.athletics*1)/54)*10)/10;
                            positionValues[3][2] = Math.round((positionValues[3][1]-playerData.strength)*10)/10;
                            positionValues[3][3] = Math.round((positionValues[3][2]/playerData.strength)*1000)/10;
                            positionValues[4][0] = "DM";
                            positionValues[4][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*1+playerData.condition*2+playerData.speed*3+playerData.technique*2+playerData.shootingtechnique*4+playerData.shootingpower*1+playerData.header*8+playerData.duel*9+playerData.tactics*8+playerData.athletics*7)/46)*10)/10;
                            positionValues[4][2] = Math.round((positionValues[4][1]-playerData.strength)*10)/10;
                            positionValues[4][3] = Math.round((positionValues[4][2]/playerData.strength)*1000)/10;
                            positionValues[5][0] = "LOM";
                            positionValues[5][1] = Math.round(((playerData.leftfoot*4+playerData.rightfoot*1+playerData.condition*3+playerData.speed*10+playerData.technique*8+playerData.shootingtechnique*8+playerData.shootingpower*3+playerData.header*1+playerData.duel*5+playerData.tactics*8+playerData.athletics*7)/58)*10)/10;
                            positionValues[5][2] = Math.round((positionValues[5][1]-playerData.strength)*10)/10;
                            positionValues[5][3] = Math.round((positionValues[5][2]/playerData.strength)*1000)/10;
                            positionValues[6][0] = "ZOM";
                            positionValues[6][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*1+playerData.condition*2+playerData.speed*5+playerData.technique*9+playerData.shootingtechnique*8+playerData.shootingpower*1+playerData.header*6+playerData.duel*4+playerData.tactics*8+playerData.athletics*3)/48)*10)/10;
                            positionValues[6][2] = Math.round((positionValues[6][1]-playerData.strength)*10)/10;
                            positionValues[6][3] = Math.round((positionValues[6][2]/playerData.strength)*1000)/10;
                            positionValues[7][0] = "ROM";
                            positionValues[7][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*4+playerData.condition*3+playerData.speed*10+playerData.technique*8+playerData.shootingtechnique*8+playerData.shootingpower*3+playerData.header*1+playerData.duel*5+playerData.tactics*8+playerData.athletics*7)/58)*10)/10;
                            positionValues[7][2] = Math.round((positionValues[7][1]-playerData.strength)*10)/10;
                            positionValues[7][3] = Math.round((positionValues[7][2]/playerData.strength)*1000)/10;
                            positionValues[8][0] = "ST(L)";
                            positionValues[8][1] = Math.round(((playerData.leftfoot*2+playerData.rightfoot*1+playerData.condition*1+playerData.speed*8+playerData.technique*6+playerData.shootingtechnique*5+playerData.shootingpower*1+playerData.header*5+playerData.duel*2+playerData.tactics*3+playerData.athletics*6)/40)*10)/10;
                            positionValues[8][2] = Math.round((positionValues[8][1]-playerData.strength)*10)/10;
                            positionValues[8][3] = Math.round((positionValues[8][2]/playerData.strength)*1000)/10;
                            positionValues[9][0] = "ST(R)";
                            positionValues[9][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*2+playerData.condition*1+playerData.speed*8+playerData.technique*6+playerData.shootingtechnique*5+playerData.shootingpower*1+playerData.header*5+playerData.duel*2+playerData.tactics*3+playerData.athletics*6)/40)*10)/10;
                            positionValues[9][2] = Math.round((positionValues[9][1]-playerData.strength)*10)/10;
                            positionValues[9][3] = Math.round((positionValues[9][2]/playerData.strength)*1000)/10;
                            break;
                        case 12: // 4-4-2 Raute
                            positionValues[0][0] = "LAV";
                            positionValues[0][1] = Math.round(((playerData.leftfoot*4+playerData.rightfoot*1+playerData.condition*2+playerData.speed*8+playerData.technique*5+playerData.shootingtechnique*7+playerData.shootingpower*1+playerData.header*1+playerData.duel*8+playerData.tactics*8+playerData.athletics*2)/47)*10)/10;
                            positionValues[0][2] = Math.round((positionValues[0][1]-playerData.strength)*10)/10;
                            positionValues[0][3] = Math.round((positionValues[0][2]/playerData.strength)*1000)/10;
                            positionValues[1][0] = "LIV";
                            positionValues[1][1] = Math.round(((playerData.leftfoot*4+playerData.rightfoot*1+playerData.condition*1+playerData.speed*8+playerData.technique*2+playerData.shootingtechnique*1+playerData.shootingpower*1+playerData.header*10+playerData.duel*10+playerData.tactics*8+playerData.athletics*5)/51)*10)/10;
                            positionValues[1][2] = Math.round((positionValues[1][1]-playerData.strength)*10)/10;
                            positionValues[1][3] = Math.round((positionValues[1][2]/playerData.strength)*1000)/10;
                            positionValues[2][0] = "RIV";
                            positionValues[2][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*4+playerData.condition*1+playerData.speed*8+playerData.technique*2+playerData.shootingtechnique*1+playerData.shootingpower*1+playerData.header*10+playerData.duel*10+playerData.tactics*8+playerData.athletics*5)/51)*10)/10;
                            positionValues[2][2] = Math.round((positionValues[2][1]-playerData.strength)*10)/10;
                            positionValues[2][3] = Math.round((positionValues[2][2]/playerData.strength)*1000)/10;
                            positionValues[3][0] = "RAV";
                            positionValues[3][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*4+playerData.condition*2+playerData.speed*8+playerData.technique*5+playerData.shootingtechnique*7+playerData.shootingpower*1+playerData.header*1+playerData.duel*8+playerData.tactics*8+playerData.athletics*2)/47)*10)/10;
                            positionValues[3][2] = Math.round((positionValues[3][1]-playerData.strength)*10)/10;
                            positionValues[3][3] = Math.round((positionValues[3][2]/playerData.strength)*1000)/10;
                            positionValues[4][0] = "DM";
                            positionValues[4][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*1+playerData.condition*2+playerData.speed*2+playerData.technique*2+playerData.shootingtechnique*1+playerData.shootingpower*2+playerData.header*2+playerData.duel*8+playerData.tactics*8+playerData.athletics*7)/36)*10)/10;
                            positionValues[4][2] = Math.round((positionValues[4][1]-playerData.strength)*10)/10;
                            positionValues[4][3] = Math.round((positionValues[4][2]/playerData.strength)*1000)/10;
                            positionValues[5][0] = "LOM";
                            positionValues[5][1] = Math.round(((playerData.leftfoot*3+playerData.rightfoot*1+playerData.condition*2+playerData.speed*6+playerData.technique*8+playerData.shootingtechnique*7+playerData.shootingpower*1+playerData.header*6+playerData.duel*3+playerData.tactics*3+playerData.athletics*1)/41)*10)/10;
                            positionValues[5][2] = Math.round((positionValues[5][1]-playerData.strength)*10)/10;
                            positionValues[5][3] = Math.round((positionValues[5][2]/playerData.strength)*1000)/10;
                            positionValues[6][0] = "ZOM";
                            positionValues[6][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*1+playerData.condition*1+playerData.speed*3+playerData.technique*8+playerData.shootingtechnique*9+playerData.shootingpower*1+playerData.header*5+playerData.duel*3+playerData.tactics*9+playerData.athletics*2)/43)*10)/10;
                            positionValues[6][2] = Math.round((positionValues[6][1]-playerData.strength)*10)/10;
                            positionValues[6][3] = Math.round((positionValues[6][2]/playerData.strength)*1000)/10;
                            positionValues[7][0] = "ROM";
                            positionValues[7][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*3+playerData.condition*2+playerData.speed*6+playerData.technique*8+playerData.shootingtechnique*7+playerData.shootingpower*1+playerData.header*6+playerData.duel*3+playerData.tactics*3+playerData.athletics*1)/41)*10)/10;
                            positionValues[7][2] = Math.round((positionValues[7][1]-playerData.strength)*10)/10;
                            positionValues[7][3] = Math.round((positionValues[7][2]/playerData.strength)*1000)/10;
                            positionValues[8][0] = "ST(L)";
                            positionValues[8][1] = Math.round(((playerData.leftfoot*2+playerData.rightfoot*1+playerData.condition*1+playerData.speed*8+playerData.technique*5+playerData.shootingtechnique*5+playerData.shootingpower*1+playerData.header*8+playerData.duel*1+playerData.tactics*3+playerData.athletics*5)/40)*10)/10;
                            positionValues[8][2] = Math.round((positionValues[8][1]-playerData.strength)*10)/10;
                            positionValues[8][3] = Math.round((positionValues[8][2]/playerData.strength)*1000)/10;
                            positionValues[9][0] = "ST(R)";
                            positionValues[9][1] = Math.round(((playerData.leftfoot*1+playerData.rightfoot*2+playerData.condition*1+playerData.speed*8+playerData.technique*5+playerData.shootingtechnique*5+playerData.shootingpower*1+playerData.header*8+playerData.duel*1+playerData.tactics*3+playerData.athletics*5)/40)*10)/10;
                            positionValues[9][2] = Math.round((positionValues[9][1]-playerData.strength)*10)/10;
                            positionValues[9][3] = Math.round((positionValues[9][2]/playerData.strength)*1000)/10;
                            break;
                    }
                    let maxValue = positionValues[0][1];
                    let maxValueIndex = 0;
                    for(i=1;i<10;i++){
                        if(positionValues[i][1]>maxValue){
                            maxValue = positionValues[i][1];
                            maxValueIndex = i;
                        }
                    }
                    let secondMaxValue;
                    let secondMaxValueIndex = 0;
                    if(maxValueIndex!=0){
                        secondMaxValue = positionValues[0][1];
                    }
                    else{
                        secondMaxValue = positionValues[1][1];
                    }
                    for(i=1;i<10;i++){
                        if(positionValues[i][1]>secondMaxValue && i!=maxValueIndex){
                            secondMaxValue = positionValues[i][1];
                            secondMaxValueIndex = i;
                        }
                    }
                    let thirdMaxValue;
                    let thirdMaxValueIndex = 0;
                    if(maxValueIndex!=0 && secondMaxValueIndex!=0){
                        thirdMaxValue = positionValues[0][1];
                    }
                    else if((maxValueIndex!=1 && secondMaxValueIndex!=1) || (maxValueIndex!=0 && secondMaxValueIndex!=1) || (maxValueIndex!=1 && secondMaxValueIndex!=0)){
                        thirdMaxValue = positionValues[1][1];
                    }
                    else{
                        thirdMaxValue = positionValues[2][1];
                    }
                    for(i=1;i<10;i++){
                        if(positionValues[i][1]>thirdMaxValue && i!=maxValueIndex && i!=secondMaxValueIndex){
                            thirdMaxValue = positionValues[i][1];
                            thirdMaxValueIndex = i;
                        }
                    }
                    for(i=0;i<10;i++){
                        let fontColorDifferenz;
                        let fontColor = "#404040";
                        if(positionValues[i][2]>0){
                            fontColorDifferenz = "#63bf7c";
                        }
                        else if (positionValues[i][2]<0){
                            fontColorDifferenz = "#f8696b";
                        }
                        else{
                            fontColorDifferenz = "#404040";
                        }
                        if(i==maxValueIndex || i==secondMaxValueIndex || i==thirdMaxValueIndex){
                            fontColor = "purple";
                        }
                        $(".ol-transfer-position-container-2").append(
                            "<div class=\"ol-transfer-position\">"+
                            "<span class=\"ol-transfer-span\" style=\"color:#404040;display:block;font-weight:bold;width:35px;font-size:13px;\">"+positionValues[i][0]+"</span>"+
                            "<span class=\"ol-transfer-span\" style=\"color:"+fontColor+";display:block;font-weight:bold;width:35px;font-size:13px;\">"+positionValues[i][1]+"</span>"+
                            "<span class=\"ol-transfer-span\" style=\"color:"+fontColorDifferenz+";display:block;font-weight:bold;width:35px;font-size:13px;\">"+positionValues[i][2]+"</span>"+
                            "<span class=\"ol-transfer-span\" style=\"color:"+fontColorDifferenz+";display:block;font-weight:bold;width:35px;font-size:13px;\">"+positionValues[i][3]+"%</span>"+
                            "</div>"
                        );
                    }
                    trainingsslot.stabi = 150;
                    trainingsslot.goalkeeping = 0;
                }
                else if($(".transfer-player-attributes-container span.ol-value-bar-small-label-value").length==9){
                    let positionValue = new Array(4);
                    switch(numberOfFormation){
                        case 1: // 3-4-3 Dreierkette (offensiv)
                            positionValue[0] = "TW";
                            positionValue[1] = Math.round(((playerData.line*1+playerData.libero*5+playerData.foot*3+playerData.gameopening*3+playerData.runout*2+playerData.penaltyarea*1)/15)*10)/10;
                            positionValue[2] = Math.round((positionValue[1]-playerData.strength)*10)/10;
                            positionValue[3] = Math.round((positionValue[2]/playerData.strength)*1000)/10;
                            break;
                        case 2: // 3-5-2 Dreierkette, Kompaktes Mittelfeld
                            positionValue[0] = "TW";
                            positionValue[1] = Math.round(((playerData.line*1+playerData.libero*1+playerData.foot*2+playerData.gameopening*4+playerData.runout*1+playerData.penaltyarea*1)/10)*10)/10;
                            positionValue[2] = Math.round((positionValue[1]-playerData.strength)*10)/10;
                            positionValue[3] = Math.round((positionValue[2]/playerData.strength)*1000)/10;
                            break;
                        case 3: // 4-1-4-1 Defensiv, Konter
                            positionValue[0] = "TW";
                            positionValue[1] = Math.round(((playerData.line*1+playerData.libero*1+playerData.foot*2+playerData.gameopening*4+playerData.runout*2+playerData.penaltyarea*1)/11)*10)/10;
                            positionValue[2] = Math.round((positionValue[1]-playerData.strength)*10)/10;
                            positionValue[3] = Math.round((positionValue[2]/playerData.strength)*1000)/10;
                            break;
                        case 4: // 4-1-5-0 Falsche Neun
                            positionValue[0] = "TW";
                            positionValue[1] = Math.round(((playerData.line*1+playerData.libero*6+playerData.foot*4+playerData.gameopening*2+playerData.runout*2+playerData.penaltyarea*1)/16)*10)/10;
                            positionValue[2] = Math.round((positionValue[1]-playerData.strength)*10)/10;
                            positionValue[3] = Math.round((positionValue[2]/playerData.strength)*1000)/10;
                            break;
                        case 5: // 4-2-3-1 Defensiv, Konter
                            positionValue[0] = "TW";
                            positionValue[1] = Math.round(((playerData.line*1+playerData.libero*2+playerData.foot*1+playerData.gameopening*3+playerData.runout*1+playerData.penaltyarea*1)/9)*10)/10;
                            positionValue[2] = Math.round((positionValue[1]-playerData.strength)*10)/10;
                            positionValue[3] = Math.round((positionValue[2]/playerData.strength)*1000)/10;
                            break;
                        case 6: // 4-2-3-1 Kontrollierte Offensive
                            positionValue[0] = "TW";
                            positionValue[1] = Math.round(((playerData.line*1+playerData.libero*2+playerData.foot*2+playerData.gameopening*3+playerData.runout*1+playerData.penaltyarea*1)/10)*10)/10;
                            positionValue[2] = Math.round((positionValue[1]-playerData.strength)*10)/10;
                            positionValue[3] = Math.round((positionValue[2]/playerData.strength)*1000)/10;
                            break;
                        case 7: // 4-2-4-0 Falsche Neun
                            positionValue[0] = "TW";
                            positionValue[1] = Math.round(((playerData.line*1+playerData.libero*6+playerData.foot*4+playerData.gameopening*2+playerData.runout*2+playerData.penaltyarea*1)/16)*10)/10;
                            positionValue[2] = Math.round((positionValue[1]-playerData.strength)*10)/10;
                            positionValue[3] = Math.round((positionValue[2]/playerData.strength)*1000)/10;
                            break;
                        case 8: // 4-3-3 Halb offensiv, Konter
                            positionValue[0] = "TW";
                            positionValue[1] = Math.round(((playerData.line*1+playerData.libero*3+playerData.foot*2+playerData.gameopening*4+playerData.runout*1+playerData.penaltyarea*1)/12)*10)/10;
                            positionValue[2] = Math.round((positionValue[1]-playerData.strength)*10)/10;
                            positionValue[3] = Math.round((positionValue[2]/playerData.strength)*1000)/10;
                            break;
                        case 9: // 4-3-3 Offensiv
                            positionValue[0] = "TW";
                            positionValue[1] = Math.round(((playerData.line*1+playerData.libero*7+playerData.foot*3+playerData.gameopening*5+playerData.runout*2+playerData.penaltyarea*1)/19)*10)/10;
                            positionValue[2] = Math.round((positionValue[1]-playerData.strength)*10)/10;
                            positionValue[3] = Math.round((positionValue[2]/playerData.strength)*1000)/10;
                            break;
                        case 10: // 4-4-2 Flach
                            positionValue[0] = "TW";
                            positionValue[1] = Math.round(((playerData.line*1+playerData.libero*2+playerData.foot*3+playerData.gameopening*3+playerData.runout*1+playerData.penaltyarea*1)/11)*10)/10;
                            positionValue[2] = Math.round((positionValue[1]-playerData.strength)*10)/10;
                            positionValue[3] = Math.round((positionValue[2]/playerData.strength)*1000)/10;
                            break;
                        case 11: // 4-4-2 Flügel
                            positionValue[0] = "TW";
                            positionValue[1] = Math.round(((playerData.line*1+playerData.libero*2+playerData.foot*2+playerData.gameopening*4+playerData.runout*1+playerData.penaltyarea*1)/11)*10)/10;
                            positionValue[2] = Math.round((positionValue[1]-playerData.strength)*10)/10;
                            positionValue[3] = Math.round((positionValue[2]/playerData.strength)*1000)/10;
                            break;
                        case 12: // 4-4-2 Raute
                            positionValue[0] = "TW";
                            positionValue[1] = Math.round(((playerData.line*1+playerData.libero*5+playerData.foot*4+playerData.gameopening*3+playerData.runout*1+playerData.penaltyarea*1)/15)*10)/10;
                            positionValue[2] = Math.round((positionValue[1]-playerData.strength)*10)/10;
                            positionValue[3] = Math.round((positionValue[2]/playerData.strength)*1000)/10;
                            break;
                    }
                    let fontColorDifferenz;
                    if(positionValue[2]>0){
                        fontColorDifferenz = "#63bf7c";
                    }
                    else if (positionValue[2]<0){
                        fontColorDifferenz = "#f8696b";
                    }
                    else{
                        fontColorDifferenz = "#404040";
                    }
                    $(".ol-transfer-position-container-2").append(
                        "<div class=\"ol-transfer-position\">"+
                        "<span class=\"ol-transfer-span\" style=\"color:#404040;display:block;font-weight:bold;width:48px;\">"+positionValue[0]+"</span>"+
                        "<span class=\"ol-transfer-span\" style=\"display:block;font-weight:bold;width:48px;\">"+positionValue[1]+"</span>"+
                        "<span class=\"ol-transfer-span\" style=\"color:"+fontColorDifferenz+";display:block;font-weight:bold;width:48px;\">"+positionValue[2]+"</span>"+
                        "<span class=\"ol-transfer-span\" style=\"color:"+fontColorDifferenz+";display:block;font-weight:bold;width:48px;\">"+positionValue[3]+"%</span>"+
                        "</div>"
                    );
                    trainingsslot.goalkeeping = 105;
                    trainingsslot.stabi = 0;
                }
                else{
                    console.log("Spielertyp konnte nicht erkannt werden!");
                }
                $("#ol-container-transfer-real-strenght").attr("style","display:inline-block;");
                $(".ol-container-transfer-real-strenght-select").attr("style","margin-bottom:6px;");
                $(".ol-transfer-position").attr("style","background-color:#f2f2f2;display:inline-block;");
            }
        }

        async function waitForKeyElement(){
            $("#playerViewContent > div:first-child").attr("style","display:block;margin-bottom:30px;padding-top:12px;text-align:center;");
            $("#playerViewContent > div:nth-child(2)").attr("style","display:block;margin-bottom:18px;padding-top:12px;text-align:center;");
            $(".back-to-transfer").attr("style","top:-24px;");
            $("#playerViewContent .transfer-refresh-icon").attr("style","top:-30px;");
            if($("#playerViewContent .transfer-player-attributes-container").length==1 && $("#ol-container-transfer-real-strenght").length==0){
                $("#playerViewContent").prepend(
                    "<div id=\"ol-container-transfer-real-strenght\">"+
                        "<div class=\"ol-container-transfer-real-strenght-select\">"+
                            "<select id=\"ol-transfer-real-strenght-select\">"+
                                "<option value=\"1\">3-4-3 Dreierkette (offensiv)</option>"+
                                "<option value=\"2\">3-5-2 Dreierkette, Kompaktes Mittelfeld</option>"+
                                "<option value=\"3\">4-1-4-1 Defensiv, Konter</option>"+
                                "<option value=\"4\">4-1-5-0 Falsche Neun</option>"+
                                "<option value=\"5\">4-2-3-1 Defensiv, Konter</option>"+
                                "<option value=\"6\">4-2-3-1 Kontrollierte Offensive</option>"+
                                "<option value=\"7\">4-2-4-0 Falsche Neun</option>"+
                                "<option value=\"8\">4-3-3 Halb offensiv, Konter</option>"+
                                "<option value=\"9\">4-3-3 Offensiv</option>"+
                                "<option value=\"10\">4-4-2 Flach</option>"+
                                "<option value=\"11\">4-4-2 Flügel</option>"+
                                "<option value=\"12\">4-4-2 Raute</option>"+
                            "</select>"+
                        "</div>"+
                        "<div class=\"ol-container-transfer-real-strenght-values\">"+
                        "</div>"+
                    "</div>"
                );
                $(".ol-transfer-detail-btns").attr("style","top:-30px;");
                showRealPositionValues(1);
                $("#ol-transfer-real-strenght-select").change(function() {
                    $(".ol-transfer-position").remove();
                    $(".training-slots-adjustments").remove();
                    $(".development-forecast").remove();
                    let numberOfFormation = parseInt($("#ol-transfer-real-strenght-select").val());
                    showRealPositionValues(numberOfFormation);
                });
            }
        }

        class Player{
            constructor(){
                this.ID;
                this.name;
                this.age;
                this.birthday;
                this.positions;
                this.strength;
                this.talent;
                this.isTalentDetermined;
                this.line;
                this.libero;
                this.foot;
                this.gameopening;
                this.runout;
                this.penaltyarea;
                this.condition;
                this.speed;
                this.technique;
                this.shootingtechnique;
                this.shootingpower;
                this.header;
                this.duel;
                this.tactics;
                this.leftfoot;
                this.rightfoot;
                this.athletics;
            }
        }

        class Trainingsslot{
            constructor(){
                this.tactics;
                this.coordination;
                this.technique;
                this.shooting;
                this.standards;
                this.stabi;
                this.smallgameform;
                this.biggameform;
                this.tainingsgame;
                this.condition;
                this.speedstrength;
                this.goalkeeping;
            }
        }
    })
})();