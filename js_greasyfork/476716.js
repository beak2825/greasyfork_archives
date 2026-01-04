// ==UserScript==
// @name         Travian Hero freeze
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      0.3
// @description  Buildt in Hero freeze for travian.
// @author       bbbkada@gmail.com
// @include        *.travian.*/profile*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=travian.com
// @grant    GM_addStyle
// @grant    GM_getValue
// @grant    GM_setValue
// @grant    GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/476716/Travian%20Hero%20freeze.user.js
// @updateURL https://update.greasyfork.org/scripts/476716/Travian%20Hero%20freeze.meta.js
// ==/UserScript==

/* global $ */

const serverTimeOffSet = -1; // adjust localtime to match servers

function getUserId(){
    var navi_p = $("#sidebarBoxActiveVillage .playerName").text();
    return navi_p;
};

function waitForKeyElements ( // credit to BrockA - https://gist.github.com/BrockA/2625891
    selectorTxt, /* Required: The jQuery selector string that
                        specifies the desired element(s).
                    */
    actionFunction, /* Required: The code to run when elements are
                        found. It is passed a jNode to the matched
                        element.
                    */
    bWaitOnce, /* Optional: If false, will continue to scan for
                        new elements even after the first match is
                        found.
                    */
    iframeSelector /* Optional: If set, identifies the iframe to
                        search.
                    */
) {
    var targetNodes, btargetsFound;

    if (typeof iframeSelector == "undefined") {
        targetNodes = $(selectorTxt);
    } else {
        targetNodes = $(iframeSelector).contents().find (selectorTxt);
    }

    if (targetNodes && targetNodes.length > 0) {
        btargetsFound = true;
        /*--- Found target node(s).  Go through each and act if they
            are new.
        */
        targetNodes.each ( function () {
            var jThis = $(this);
            var alreadyFound = jThis.data ('alreadyFound') || false;

            if (!alreadyFound) {
                //--- Call the payload function.
                var cancelFound = actionFunction (jThis);
                if (cancelFound){
                    btargetsFound = false;
                } else {
                    jThis.data ('alreadyFound', true);
                }
            }
        } );
    }
    else {
        btargetsFound = false;
    }

    //--- Get the timer-control variable for this selector.
    var controlObj = waitForKeyElements.controlObj || {};
    var controlKey = selectorTxt.replace (/[^\w]/g, "_");
    var timeControl = controlObj [controlKey];

    //--- Now set or clear the timer as appropriate.
    if (btargetsFound && bWaitOnce && timeControl) {
        //--- The only condition where we need to clear the timer.
        clearInterval (timeControl);
        delete controlObj [controlKey]
    }
    else {
        //--- Set a timer, if needed.
        if ( ! timeControl) {
            timeControl = setInterval ( function () {waitForKeyElements (selectorTxt,actionFunction,bWaitOnce,iframeSelector);},300);
            controlObj [controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj = controlObj;
}

var userId = getUserId();
var userHost = window.location.hostname.split(".")[0]+"_"+userId;

//GM_deleteValue(userHost + "_PlayerArray"); // uncomment and run once with this to force delete all history

var playerName;
var myList = [];
var myListObj = GM_getValue (userHost + "_PlayerArray");
if (myListObj) {
    myList = JSON.parse (myListObj);
}

waitForKeyElements (".playerDetails table", parsePlayerTable);
//console.log(myListObj);

function parsePlayerTable (jNode) {

    playerName = $("#content .titleInHeader").text();

    // add space for Items array
    var heroItems = [];

    jNode.find('tr').each(function(){
        $(this).find('td').eq(1).css('white-space', 'nowrap');
        $(this).find('td').eq(1).after("<td style='white-space:nowrap;font: italic 11px/1 Arial,Helvetica,Verdana,sans-serif;'></td>");
    });
    jNode.find('tr:last').after("<tr><td colspan='100%' id='btnHolder'></td></tr>");

    //get all the current stats
    var $allyVills = jNode.find('tr').find("td:eq(0)");
    var $tds = jNode.find('tr').find("td:eq(1)");
    var $tdsCol = jNode.find('tr').find("td:eq(2)");

    var ally = $allyVills.eq(1).text();
    var nrVills = $allyVills.eq(2).text();
    var pop = $tds.eq(0).text().split(" ")[0];
    var attack = $tds.eq(1).text().split(" ")[0];
    var defense = $tds.eq(2).text().split(" ")[0];
    var hero = $tds.eq(3).text().split(" ")[0];

    var histAlly;
    var histNrVills;
    var histPop;
    var histAttack;
    var histDefense;
    var histHero;
    var histReset;

    // find player in data if previously saved
    var result = $.grep(myList, function(e){ return e.player === playerName; });

    var i = 0;
    // get current heroItems
    $("#playerProfile .heroItem").each(function() {
        heroItems.push($(this).find('.item').prop("classList")[1]);

        try {
            if ($(this).find('.item').prop("classList")[1] == result[0].heroItems[i]) {
                //$(this).css('outline', 'solid 8px #66a832'); // if you want green outline for unchanged equip.
            } else {
                $(this).css('outline', 'solid 5px #e87680');
                $(this).removeClass("disabled notClickable empty");
            }
        } catch { }

        i++;
    });

    if (result.length === 1) {

        console.log(result[0]);

        console.log("Array:" + heroItems);
        histAlly = result[0].ally;
        result[0].ally = ally;

        histNrVills = result[0].villages;
        result[0].villages = nrVills;

        histPop = pop - result[0].pop;
        result[0].pop = pop;

        histAttack = attack - result[0].attack;
        result[0].attack = attack;

        histDefense = defense - result[0].defense;
        result[0].defense = defense;

        histHero = hero - result[0].hero;
        result[0].hero = hero;

        result[0].heroItems = heroItems;

        histReset = result[0].reset;
        result[0].reset = getCurrTime();

    } else {
        // add player to myList
        var newPlayer = {
            player: '',
            ally: '',
            villages: '',
            pop: '',
            attack: '',
            defense: '',
            hero: '',
            heroItems: [],
            reset: ''
         };

        newPlayer.player = playerName;
        newPlayer.ally = ally;
        newPlayer.villages = nrVills;
        newPlayer.pop = pop;
        newPlayer.attack = attack;
        newPlayer.defense = defense;
        newPlayer.hero = hero;
        newPlayer.heroItems = heroItems;
        newPlayer.reset = getCurrTime();

        console.log("heroArray:" + heroItems);

        myList.push(newPlayer);

    };

    // add save button
    if (histReset == null) histReset = "-"
    $("#btnHolder").append ("<div style='position:absolute'>"
                            +"<button style='width:130px;height:25px;border-radius: 5px 25px;border:solid 2px black;color:black;background-color:grey;text-align: center;' id='resetButton' type='button'>Freeze</button><br>"
                            +"<button style='width:130px;height:25px;border-radius: 5px 25px;border:solid 2px black;color:black;background-color:grey;text-align: center;' id='clearAllButton' type='button'>Clear all history</button><div>"
                            +"<div style='position:absolute;width:230px;font-size:11px;color:light-gray;padding:20px 0 0 20px'>Last saved " + histReset + "</div>");

    $("#resetButton").on("click", function() {
        savePlayer();
    });

    $("#clearAllButton").on("click", function() {
        clearHistory();
    });
    // print history data if available
    if (histPop != null) {
        $tdsCol.eq(0).append("("+ ((histPop > 0) ? "+" : "") + histPop + ")");
        $tdsCol.eq(1).append("("+ ((histAttack > 0) ? "+" : "") + histAttack + ")");
        $tdsCol.eq(2).append("("+ ((histDefense > 0) ? "+" : "") + histDefense + ")");
        $tdsCol.eq(3).append("("+ ((histHero > 0) ? "+" : "") + histHero + ")");
    }
}

function getCurrTime(){
    var crTime = new Date();
    var year = crTime.getFullYear();
    var month = parseInt(crTime.getMonth()+1);
    var day = crTime.getDate();
    var hour = (crTime.getHours() + serverTimeOffSet );
    var minute = crTime.getMinutes();
    var second = crTime.getSeconds();
    if (month < 10) {month = "0" + month;}
    if (day < 10) {day = "0" + day;}
    if (hour < 10) {hour = "0" + hour;}
    if (minute < 10) {minute = "0" + minute;}
    if (second < 10) {second = "0" + second;}

    var res = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
    return res;
}

function savePlayer() {
    GM_setValue (userHost + "_PlayerArray", JSON.stringify (myList) );
    console.log ("Saved the list of items.");
    location.reload();
};
function clearHistory() {
    GM_setValue (userHost + "_PlayerArray", "" );
    console.log ("Cleared all history");
    location.reload();
};
