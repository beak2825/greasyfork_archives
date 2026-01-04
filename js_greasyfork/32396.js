// ==UserScript==
// @name         Oculus Rift Experiences Filter
// @namespace    http://slugsource.com/
// @version      1.0
// @description  Filters out non-free games
// @author       Natalie Fearnley
// @match        https://www.oculus.com/experiences/rift/
// @grant        none
// @require http://code.jquery.com/jquery-latest.min.js
// @downloadURL https://update.greasyfork.org/scripts/32396/Oculus%20Rift%20Experiences%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/32396/Oculus%20Rift%20Experiences%20Filter.meta.js
// ==/UserScript==

function getPrice(game)
{
    return game.find("._5xkb").text();
}

function isFree()
{
    var text = getPrice($(this));
    return text === "Free";
}

function isPaid()
{
    var text = getPrice($(this));
    return text !== "Free" & text !== "";
}

function isPaidOnlyRow()
{
    var games = $(this).find("._tco");
    return games.filter(isFree).length === 0;
}

function hidePaid() {
    FreeGames = $("._tco").filter(isFree);
    PaidGames = $("._tco").filter(isPaid);
    PaidGames.hide();
    PaidOnlyRows = $("._tcj").filter(isPaidOnlyRow);
    PaidOnlyRows.hide();
}

$().ready(hidePaid);