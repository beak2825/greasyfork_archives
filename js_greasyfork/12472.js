// ==UserScript==
// @name         Explore Script
// @version      0.4
// @description  Warring Factions Explore Script
// @author       Kevin Schlosser
// @match        http://*.war-facts.com/fleet.php*
// @match	http://*.war-facts.com/fleet/*
// @require     https://code.jquery.com/jquery-2.1.4.min.js
// @grant        none
// @namespace https://greasyfork.org/users/14655
// @downloadURL https://update.greasyfork.org/scripts/12472/Explore%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/12472/Explore%20Script.meta.js
// ==/UserScript==

//Configuration Options:
// Change this if you wish to exclude Fleets whose names contain the excludeString from being auto Selected as next explorer.
var useExcludeString = false;
// Change this to what you would like to put into a fleet's name in order to exclude it from being auto selected.
var excludeString = "#NotAuto#";
// How many milliseconds to wait between requests
var timeout = 500;

// Change this if you wish to auto Select Fleets as next explorer ONLY if their names contain the includeString.
var useIncludeString = false;
// Change this to what you would like to put into a fleet's name in order to include it into being auto selected.
var includeString = "#Auto#";

var explorerRegex = /Explorer/g;
var isExplorer = explorerRegex.test(document.getElementById('fleetClass').innerText);

var base = window.location.href;
var fleetIdRegex = /fleet.php.*fleet=(\d+)|fleet\/(\d+)/g;
var match = fleetIdRegex.exec(base);

var fleetNumber = match[1] === undefined ? match[2] : match[1];
var xmlhttp = new XMLHttpRequest();
var perimeterScan, hasWormhole, hasColony;
xmlhttp.onreadystatechange=function()
{
    if (xmlhttp.readyState==4 && xmlhttp.status==200)
    {
        perimeterScanHtml = xmlhttp.responseText;
        var dom = document.createElement('html');
        dom.innerHtml = perimeterScan;
        dom.getElementsByTagName('table');

        var el = $( '<div></div>' );
        el.html(perimeterScanHtml);
        var perimiterScan = $('table', el)[1];
        document.getElementById('missionData').appendChild(perimiterScan);
        hasWormhole = checkWH(perimiterScan.rows);
        hasColony = checkColony();
        if (!hasWormhole && !hasColony) {
            window.setTimeout(main,timeout);
        }
    }
};
if (isExplorer) {
    xmlhttp.open("GET", 'http://www.war-facts.com/extras/scan.php?fleet='+fleetNumber, true);
    xmlhttp.send();
}

function main() {
    if (isExplorer) {
        var info = document.getElementById('navData').getElementsByTagName('div')[4];
        var infoSpan = info.getElementsByTagName('span')[0];
        // not  containing world in the span.
        var isAtSystemEntrance  =  ! (document.evaluate("//text()[contains(.,'World:')]", infoSpan, null, XPathResult.BOOLEAN_TYPE, null).booleanValue);

        //alert("Is explorer = " + isExplorer);
        //alert("Is at system Entrance = " + isAtSystemEntrance);
        var currentPlanet = info.getElementsByTagName('a')[0].innerHTML;

        //alert(currentPlanet);
        var optionGroup = document.getElementById('target1');
        if (optionGroup === null) {
            window.setTimeout(main,timeout);
            return;
        }
        optionGroup = optionGroup.getElementsByTagName('optgroup')[0];
        optionGroup = optionGroup.getElementsByTagName('option');

        var i = 0 , found = false,  optionsLength = optionGroup.length;
        var nextPlanetOption, finishedSystem = false;

        //if PlanetLess system
        if (optionsLength === 0 ) {
            //            alert("Planetless System");
            found = true;
            finishedSystem = true;
        } else if (isAtSystemEntrance){ //if I am at system entrance
            //            alert("At System Entrance");
            found = true;
            nextPlanetOption = optionGroup[0].value;
        }

        // If I am at a planet, Find next planet through the local target option list

        while ( (i < optionsLength) && (found === false) ) {

            if (optionGroup[i].innerHTML == currentPlanet ){
                found = true;

                if ( i == optionsLength -1 ){
                    finishedSystem = true;

                } else {
                    nextPlanetOption = optionGroup[i+1].value;
                }
            }
            i++;
        }

        if (finishedSystem) {
            //            alert("Inside finished System");
            document.getElementById('missionData').innerHTML += '<input  class = "greenbutton darkbutton" type="button" id="nextPlanetButton" value = "Done" />';
            document.getElementById('nextPlanetButton').addEventListener('click', openStarMap, false);
        } else {
            //           alert("Inside NOT finished System");
            document.getElementById('missionData').innerHTML += '<input  class = "greenbutton darkbutton" type="button" id="nextPlanetButton" value = "Next Planet"  />';
            document.getElementById('nextPlanetButton').addEventListener('click', function() {
                jQuery('#target1').val(nextPlanetOption).trigger ('change');
                //window.setTimeout(launchFleet,timeout);
            }, false);
            selectNextPlanet(nextPlanetOption);
            //launchFleet();
            //autoSelectNextExplorer();

        }


    }
}

var nextPlanetOption;

function checkWH(rows){
    for (var x = 1; x < rows.length; x++) {
        var cells = rows[x].cells;
        for (var y = 0; y < cells.length; y++) {
            if (cells[y].innerText.indexOf('Wormhole!') != -1) {
                return true;
            }
        }
    }
    return false;
}

function checkColony(){
    var links = $('a', document.getElementById('navData'));
    for (var x = 0; x < links.length; x++) {
        if (links[x].innerText.indexOf('(view colonies)') != -1) {
            return true;
        }
    }
    return false;
}

function launchFleet() {
    getMission('launch');   //Launch Fleet
    window.setTimeout(autoSelectNextExplorer, 100);
}

function openStarMap(){
    var info = document.getElementById('navData').getElementsByTagName('div')[4];
    var infoSpan = info.getElementsByTagName('span')[0];
    //var isAtSystemEntrance  =  ! (document.evaluate("//text()[contains(.,'World:')]", infoSpan, null, XPathResult.BOOLEAN_TYPE, null).booleanValue);

    var links = document.getElementById('navData').getElementsByTagName('a');
    var starMapTgt;
    var globalRegex = /\d+, \d+, \d+ global/g;
    for(var x = 0; x < links.length; x++) {
        var text = links[x].innerText;
        if (globalRegex.exec(text)) {
            starMapTgt = links[x].href;
            break;
        }
    }

    starMapTgt = starMapTgt.substring(19, starMapTgt.length - 3 );   //Keep only the link, throw away the functions
    // mapWin is war-facts.com function to open javascript map
    mapWin(starMapTgt);
}

function selectNextPlanet(nextPlanetOption){
    jQuery('#target1').val(nextPlanetOption).trigger ('change');
    window.setTimeout(launchFleet,timeout);
}

function autoSelectNextExplorer(){

    var explorerList = document.getElementById('fc_Explorer').children;
    var index = 0;
    var explorerListLength = explorerList.length;

    while (index < explorerListLength) {
        //           alert("Index = " +index);
        if (explorerList[index].children[0].style.color == "rgb(204, 204, 204)") {

            var link = explorerList[index].children[0].href;
            var fleet_with_id = link.substr(link.indexOf("fleet="));
            var name = explorerList[index].children[0].innerHTML;
            var current_window = window.location.href;
            //               alert("Fleet with  name " + name +" and with id " + fleet_with_id);

            if (
                ( ( !useIncludeString) || ( name.indexOf(includeString) > -1  )  ) //If not using include string or String is in name
                && ( ( !useExcludeString) || ( name.indexOf(excludeString) == -1 )  ) //If not using exclude string or String is NOT in name
                && ( current_window.indexOf(fleet_with_id) == -1  )//Make sure we are not chosing ourselve as this fleet is still "white"
            )
            {

                index = explorerListLength; //To make sure if load doesn't happen immediately it stops running through fleet list
                window.open(link, "_self");
            }
        }
        index++;
    }
}

// Replace the site's getMission function, so that when launch is pressed, it autoSelectsNextExplorer
var oldgetMission = window.getMission; 

window.getMission = function getMission(action, dType) {
    var executed = new oldgetMission(action, dType);
    if (action == 'launch'){            
        var classificationNode = document.getElementById('fleetClass');
        var isExplorer = document.evaluate("//text()[contains(.,'Explorer') or contains(.,'Sentry') or contains(.,'Probe Rush')]", classificationNode, null, XPathResult.BOOLEAN_TYPE, null).booleanValue;
        window.setTimeout(autoSelectNextExplorer,timeout);
    }

};