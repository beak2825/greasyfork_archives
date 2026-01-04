// ==UserScript==
// @name Terra Mystica Stats from Players
// @author igor-ribeiiro
// @Email ribeiro_igor@hotmail.com
// @description Please, follow the tutorial to know how to use it: https://docs.google.com/document/d/1ZELdwSrIxInW8mzC8GBGdM2SsFzJikdPKKL0XR8Bgzc/edit?usp=sharing
// @include https://*boardgamearena.com/gamestats?*
// @version 1.1
// @require http://code.jquery.com/jquery-latest.js
// @namespace TerraMystica
// @downloadURL https://update.greasyfork.org/scripts/420834/Terra%20Mystica%20Stats%20from%20Players.user.js
// @updateURL https://update.greasyfork.org/scripts/420834/Terra%20Mystica%20Stats%20from%20Players.meta.js
// ==/UserScript==


window.addEventListener('load', function () {
    console.clear();

    var timeWaittingForPageToLoad = 0.7;
    var timeBetweenOpeningNewPages = 2.0;

    var openUntilIterator = 200;

    function click(str) {
        //console.log("In click function");
        //console.log(html2);
        var html2 = $(str)[0];
        if(html2 != undefined) {
            html2.click();
        }
    }

    var numberOfFinished4pGames = 0;
    var playerName = $('a[class=playername]')[0].innerHTML;
    var listOfVariables = ["_Alchemists_Total", "_Alchemists_Margin", "_Alchemists_Placement",
                           "_Auren_Total", "_Auren_Margin", "_Auren_Placement",
                           "_Chaos Magicians_Total", "_Chaos Magicians_Margin", "_Chaos Magicians_Placement",
                           "_Cultists_Total", "_Cultists_Margin", "_Cultists_Placement",
                           "_Darklings_Total", "_Darklings_Margin", "_Darklings_Placement",
                           "_Dwarves_Total", "_Dwarves_Margin", "_Dwarves_Placement",
                           "_Engineers_Total", "_Engineers_Margin", "_Engineers_Placement",
                           "_Fakirs_Total", "_Fakirs_Margin", "_Fakirs_Placement",
                           "_Giants_Total", "_Giants_Margin", "_Giants_Placement",
                           "_Halflings_Total", "_Halflings_Margin", "_Halflings_Placement",
                           "_Mermaids_Total", "_Mermaids_Margin", "_Mermaids_Placement",
                           "_Nomads_Total", "_Nomads_Margin", "_Nomads_Placement",
                           "_Swarmlings_Total", "_Swarmlings_Margin", "_Swarmlings_Placement",
                           "_Witches_Total", "_Witches_Margin", "_Witches_Placement"];

    function fillVariables() {
        listOfVariables.forEach(function(variable) {
            localStorage.setItem(playerName + variable, 0);
            //console.log(variable.split('_'));
        });
    }
    fillVariables();

    function printVariables() {
        console.log("");
        console.log("Playername = " + playerName);
        console.log("numberOfFinished4pRankedGames = " + numberOfFinished4pGames);

        listOfVariables.forEach(function(variable) {
            if(variable.split('_')[2] == 'Margin' || variable.split('_')[2] == 'Placement') {
                localStorage.setItem(playerName + variable, localStorage.getItem(playerName + variable)/localStorage.getItem(playerName + "_" + variable.split("_")[1] + '_Total'));
            }
            console.log(variable.substring(1) + ": " + localStorage.getItem(playerName + variable));
        });
    }

    function clickAllGames() {
        console.log("playerName = " + playerName);

        console.log("In function clickAllGames");
        var links = $('a[class=table_name]');

        var trs = $('tr');
        //console.log("trs.length = " + trs.length);

        var tds = $('td');
        //console.log("tds.length = " + tds.length);


        var i = 0;
        setInterval(function(){
            if (i < tds.length) {
                var link = links[i/4];
                //console.log(link);

                var numberOfPlayers = tds[i+2].innerHTML.split("simple-score-entry").length - 1;
                //console.log("Number of players for game " + i/4 + " = " + numberOfPlayers);

                var gameAbandoned = tds[i+3].innerHTML.split("(Game abandoned)").length-1 == 0 ? false : true;

                if(!gameAbandoned && numberOfPlayers == 4) {
                    //console.log("Game " + i/4 + " continued");

                    //console.log("numberOfFinished4pGames = " + numberOfFinished4pGames);

                    //console.log("urlId for game " + i/4 + " = " + urlId);

                    if(i/4 < openUntilIterator) {
                        numberOfFinished4pGames ++;
                        var urlId = link.innerHTML.split('#')[1].split('</span>')[0];
                        var url = "https://boardgamearena.com/table?table=" + urlId + "&" + playerName;
                        window.open(url);
                    }
                }
            }
            i += 4;
        }, timeBetweenOpeningNewPages * 1000);
    }

    var canStartClicking = false;
    setTimeout(function(){
        var numberOfGamesHTML = $('div[class=stats_by_game]')[0].innerHTML;
        var totalGames = numberOfGamesHTML.split(' games')[0].split('</a>: ')[1];
        console.log('totalGames = ' + totalGames);

        setInterval(function() {
            if(!canStartClicking) {
                var gamesOnScreen = $('span[class=gamename]').length;
                //console.log('gamesOnScreen = ' + gamesOnScreen);

                if(totalGames - gamesOnScreen > 10) {
                    click('a[id=see_more_tables]');
                }
                else {
                    clickAllGames();
                    canStartClicking = true;
                }
            }
        }, 0.10*1000);

        setTimeout(function(){
            printVariables();
        }, Math.min(openUntilIterator, totalGames) * (timeBetweenOpeningNewPages+0.5) * 1000);

    }, timeWaittingForPageToLoad*1000);
})();