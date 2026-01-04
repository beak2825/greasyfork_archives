// ==UserScript==
// @name         ListWinners
// @namespace    Munzees_Monthly_Giveaway
// @version      0.2
// @description  Make Daniel's Life Better :D
// @author       CzPeet
// @match        https://www.random.org/integer-sets/?sets=1&*
// @update       https://greasyfork.org/hu/scripts/381209-listwinners
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381209/ListWinners.user.js
// @updateURL https://update.greasyfork.org/scripts/381209/ListWinners.meta.js
// ==/UserScript==

function getWinners()
{
    var rlr = document.getElementsByClassName("ruler")[0];
    var containR = document.getElementById("invisible");

    var x = document.createElement("TEXTAREA");

    x.placeholder = "Insert the players here";
    x.cols = 60;
    x.rows = 45;

    x.addEventListener("change", getTheWinners);

    containR.insertBefore(x,rlr);
}

function getTheWinners()
{
    var dataSetNumbers = document.getElementsByClassName("data")[0].children[0].innerText.replace("Set 1: ","").replace(/(, )/gm, ". ##").split("##");
    var players = this.value.replace(/(\r\n|\n|\r)/gm, "##").split("##");

    for (var p = players.length-1; p>=0; p--)
    {
        var isWinner = false;
        for (var w = 0; w<dataSetNumbers.length; w++)
        {
            if (players[p].startsWith(dataSetNumbers[w]))
            {
                isWinner = true;
                break;
            }
        }

        if (!isWinner)
        {
            players.splice(p,1);
        }
    }

    this.value = "";

    for (p = 0; p < players.length; p++)
    {
        this.value += players[p];
        this.value += "\r\n";
    }
}

$(document).ajaxSuccess(getWinners());