// ==UserScript==
// @name Terra Mystica Close Page
// @author igor-ribeiiro
// @Email ribeiro_igor@hotmail.com
// @include https://*boardgamearena.com/table?*
// @version 1.0
// @description Please, follow the tutorial to know how to use it: https://docs.google.com/document/d/1ZELdwSrIxInW8mzC8GBGdM2SsFzJikdPKKL0XR8Bgzc/edit?usp=sharing
// @require http://code.jquery.com/jquery-latest.js
// @namespace TerraMystica
// @downloadURL https://update.greasyfork.org/scripts/420835/Terra%20Mystica%20Close%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/420835/Terra%20Mystica%20Close%20Page.meta.js
// ==/UserScript==

window.addEventListener('load', function () {
    console.clear();

    var shouldClose = true;
    //shouldClose = false;

    var timeWaittingForPageToLoad = 0.7;

    setTimeout(function(){
        var timeBeforeClosing = 3.0;
        setTimeout(function(){
            console.log("Window will close");
            if(shouldClose)
                window.close();
        }, timeBeforeClosing*1000);

        var currentUrl = window.location.href;
        var playerName = currentUrl.split('&')[1];


        var trs = $('tr');
        //console.log(trs);
        var column = -1;

        //console.log(trs[0]);
        var aux = trs[0].innerHTML.split("<th");


        for(var i = 1; i <= 4; i ++) {
            var name = aux[i+1].split(">")[1].split("</th")[0];
            //console.log(name);

            if(name == playerName) {
                column = i;
            }
        }

        var factions = trs[4].innerHTML;
        var faction = factions.split("<td>")[column].split("</td")[0];
        //console.log("faction = " + faction);

        var points = trs[1].innerHTML;
        var totalPoints = 0;
        var playerPoint = -10000;
        var playerPlacement = -10000;

        for(i = 1; i <= 4; i ++) {
            var point = points.split("<td>")[i].split("(")[1].split("<")[0];
            totalPoints += parseInt(point);

            if(i == column) {
                playerPoint = parseInt(point);
                playerPlacement = points.split("<td>")[i].split(" (")[0];

                if(playerPlacement == "1st")
                    playerPlacement = 1;
                if(playerPlacement == "2nd")
                    playerPlacement = 2;
                if(playerPlacement == "3rd")
                    playerPlacement = 3;
                if(playerPlacement == "4th")
                    playerPlacement = 4;
            }
        }
        var avgPoints = totalPoints/4;
        console.log("avgPoints = " + avgPoints);
        console.log("playerPoint = " + playerPoint);

        console.log("playerPlacement = " + playerPlacement);


        localStorage.setItem(playerName + "_" + faction +"_Placement", parseInt(localStorage.getItem(playerName + "_" + faction + "_Placement")) + playerPlacement);
        localStorage.setItem(playerName + "_" + faction +"_Margin", parseInt(localStorage.getItem(playerName + "_" + faction + "_Margin")) + playerPoint-avgPoints);
        localStorage.setItem(playerName + "_" + faction +"_Total", parseInt(localStorage.getItem(playerName + "_" + faction + "_Total")) + 1);

    }, timeWaittingForPageToLoad*1000);

})();