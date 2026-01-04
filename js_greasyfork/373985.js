// ==UserScript==
// @name         Auto Exploration
// @namespace    github.com/odahviing/warfacts
// @version      3.03
// @description  Ease your exploration mission with automatic smart exploring logic for probing, in a single click
// @author       Odahviing
// @match        http://www.war-facts.com/fleet*
// @match        http://www.war-facts.com/player.php
// @exclude      http://www.war-facts.com/fleet.php?mtype*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/373985/Auto%20Exploration.user.js
// @updateURL https://update.greasyfork.org/scripts/373985/Auto%20Exploration.meta.js
// ==/UserScript==

// Version 1.0 - Base Exploring Support
// Version 2.0 - JavaScript V2 Support [New Exploring System]
// -- Support auto-click
// -- Support refueling only if needing, if you have system near by and the fuel enough, go for it
// -- Using only jsmap_postload_v2 function to load data
// -- Avoid systems that will lock the probe without fuel to reach the planets

// Version 2.1
// -- Bug fix when the button is not ready to load
// -- Design a different way to auto-press the button

// Version 2.2 - Fix a stupid bug that ignore places that had x value of aboue 300000 (so almost every galaxy outside Alpha)
// Version 2.3 - Code Beautifier
// Version 2.4 - Change settings so the closest system will be explored, but without duplicate systems

// Version 2.5
// -- Change to only one data cycle, too heavy otherwise
// -- Fix a bug that if the page is loaded to fast, its not pressing explore at time

// Version 2.6 - Bug fix that cause fleets to not avoiding reaching planets that are already on the way to be explored

// Version 2.7
// -- Auto move to next free explorer
// -- Alert if enemy fleet detected

// Version 2.8 - Connect "sent to planet" script to Auto-Exploration
// Version 2.9 - Restore Old internal explore planets (auto-explore)
// Version 3.0 - Management Panel

// Default Settings
var autoSwitchToNextFleet = true;
var fullAuto = false;
var safeDistance = 5000000; // If the system is 2m km from the fleet range, we won't go there (need to fix the math a-bit)
var whiteList = false;
var fleetsName = [];
var abortletter = '#';
var showEnemies = true;
var enemiesFactions = ['Jarnekk','Scaldarians'];
var minimumFuelAmount = 50000000; // Will go fuel if below

var settings = loadSettings();

(function() {
    'use strict';

    if (document.URL.indexOf('player.php') >= 0) {
        buildMenu();
        return;
    }

    var timers = (settings.fullAuto == true) ?
        {button : 600, mission : 500, explore : 1000, refresh: 10000, hookPlanet: 500} :
    {button : 600, mission : 400, hookPlanet: 300};

    setTimeout(loadButton, timers.button);
    setTimeout(addInternalButton, timers.button);
    setTimeout(addVerifyPlanetButton, timers.hookPlanet);
    setTimeout(pressTheButton, timers.mission);
    if (settings.fullAuto == true)
    {
        setTimeout(pressExplore, timers.explore);
        setTimeout(reloadPage, timers.refresh);
    }
})();

// On-Load Functions

function loadButton() {
    let newButton = document.createElement('input');
    newButton.type = 'button'
    newButton.value = 'System';
    newButton.id = 'ExploreButton';
    newButton.style = 'width: 80px;'
    newButton.className = 'darkbutton dangerbutton';
    newButton.addEventListener("click", run);
    var buttonPlace = document.getElementsByClassName('iBlock tbborder padding5 fullwidth light')[0];
    if (buttonPlace)
        buttonPlace.insertBefore(newButton, null);
}

function pressTheButton() {
    if (document.URL.indexOf('callback=1') > 0) {
        document.getElementById('objective').value='explore';
        getMission('launch');
        if (settings.nextAuto == true)
            nextFleet();
    }
}

function pressExplore() {
    if (document.URL.indexOf('auto=1') > 0) {
        let getButton = document.getElementById('ExploreButton');
        if (getButton)
            getButton.click();
        else
            nextFleet();
    }
}

function nextFleet() {
    var allFleets = document.getElementsByClassName('padding5 inlineblock light box');
    if (settings.whiteList == false) {
        window.location = allFleets[0].href + (settings.fullAuto == true ? "#auto=1" : "");
        return;
    }

    for (let i = 0; i < allFleets.length; i++)
    {
        let exists = settings.goodNames.findIndex(x => allFleets[i].innerHTML.indexOf(x) >= 0);
        if (exists >= 0) {
            if (allFleets[i].innerHTML.indexOf(settings.badLetter) >= 0) continue;

            window.location = allFleets[i].href + (settings.fullAuto == true ? "#auto=1" : "");
            return;
        }
    }
}

function reloadPage() {
    if (document.URL.indexOf('auto=1') > 0)
        location.reload();
}

// End On-Load Functions

// Fleet Functions

var fleetNumber;
var fleetRange;
var fleetFuel;

function getFleetNumber() {
    let tmpUrl = document.URL;
    return tmpUrl.indexOf('?') > 0 ?
        tmpUrl.split('?')[1].split('=')[1] :
        tmpUrl.split('/')[4];
}

function getFleetRange() {
    let elem = document.getElementById('fleetRange').innerHTML;
    return parseInt(elem.replace(',','').replace(',','').replace(',','')) - settings.safeDistance;
}

function getFuelAmount() {
    var spanItem = document.getElementById('fleetRange').innerHTML.replace(',','').replace(',','').replace(',','');
    return parseInt(spanItem);
}

function run() {
    fleetNumber = getFleetNumber();
    fleetRange = getFleetRange();
    fleetFuel = getFuelAmount();
    findWH().then(function(status) {
        var baseUrlLink = getMapUrl();
        findUnexploredJSV2(baseUrlLink).then(function(result) {
            if (result == false) {
                if (fleetFuel < minimumFuelAmount) {
                    console.log(`Auto-Exploration: Will Try to Refuel Probe, Only Has: ${fleetFuel.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1,')} Left`);
                    let optionsElements = document.getElementById('target1').getElementsByTagName('option');
                    if (optionsElements.length == 2)
                        return alert('No Place To Re-fuel');
                    else {
                        let finalPlanet = optionsElements[2].value.split(',')[1]
                        document.getElementById('target1').value='tworld,' + finalPlanet;
                        getMission("verify", "target1")
                        setTimeout(getMission('launch'),250);
                        if (settings.nextAuto == true)
                            setTimeout(nextFleet(), 500);
                        return ;
                    }
                }
                else {
                    return alert('No System Were Found');
                }
            }
            else { // Found an Unexplored system
                window.location = result;
            }
        }).catch(function (reason) {
            console.log(reason);
        return false;
        })
    }).catch(function (reason) {
        console.log('Stopping: ' + reason);
        return false;
    });
}

function findWH(){
    var at100 = checkIf100x3();
    return new Promise(function (fulfill, reject){
        if (at100 == true)
        {
            checkForWH().then(function(isWH) {
                if (isWH == true){
                    alert('Wormhole! / Enemy');
                    return reject('Wormhole');
                }

                let fuelAmount = getFuelAmount();


                return fulfill(true);
            });
        }
        else
            return fulfill(true);
    });
}

function checkIf100x3() {
    var firstLine = document.getElementsByClassName('padding5 light tbborder')[0];
    if(firstLine.getElementsByTagName('span')[0].innerHTML == 'System: ')
        return true;
    else
        return false;
}

function checkForWH(){
    return new Promise(function (fulfill, reject){
        var link = document.getElementsByClassName('darkbutton')[3].onclick.toString();
        link = "http://www.war-facts.com/extras/scan.php" + link.substring(link.indexOf('?'), link.indexOf("')"));
        divAjaxRequest("GET", link, true, true, null).then(function(newDiv) {
            var All = newDiv.getElementsByTagName('i');
            for (let i = 0 ; i < All.length; i++)
            {
                if (All[i].innerHTML == 'Wormhole!')
                    return fulfill(true);
            }

            if (settings.alertEnemies == false)
                return fulfill(false);
            var fleets = newDiv.getElementsByClassName('tbborder padding5 light')
            for (let i =0 ; i < fleets.length; i++)
            {
                for (let j = 0; j < settings.enemiesFactions.length; j++)
                {
                    if (fleets[i].innerHTML.indexOf(settings.enemiesFactions[j]) > 0)
                        return fulfill(true);
                }
            }

            return fulfill(false);
        });
    });
}

// End Fleet Page Functions

// Javascript V2 - Functions

var mainCord;

function buildCordsObject(x,y,z) {
    return {X : parseInt(x), Y: parseInt(y), Z: parseInt(z)}
}

function getDistance(cordsA, cordsB) {
    let X = Math.pow(cordsA.X - cordsB.X, 2);
    let Y = Math.pow(cordsA.Y - cordsB.Y, 2);
    let Z = Math.pow(cordsA.Z - cordsB.Z, 2);
    let f = Math.sqrt(X + Y + Z);
    return 4000 * f;
}

function isEqule(cordsA, cordsB) {
    return (cordsA.X == cordsB.X && cordsA.Y == cordsB.Y && cordsA.Z == cordsB.Z);
}

function findUnexploredJSV2(url) {
    var newLink = extractLink(url);
    return new Promise(function (fulfill, reject){
        var allCurrentRoutes = [];
        var allOptions = [];
        sendAjaxRequest("GET", newLink, true, true, null).then(function(dom) {
            let eachLine = dom.split('\n');

            console.log(`Auto-Exploration: Got ${eachLine.length} Records To Check`);

            for (let i = 0; i < eachLine.length; i++)
            {
                let eachValue = eachLine[i].split('\t');
                if (eachValue[1] != 'f') continue;
                let cordsUsed = eachValue[7].split('');
                if (cordsUsed[0] == 0) continue;
                allCurrentRoutes.push(buildCordsObject(cordsUsed[0], cordsUsed[1], cordsUsed[2]));
            }

            console.log(`Auto-Exploration: Found ${allCurrentRoutes.length} Already Probes System`);

            for (let i = 0 ; i < eachLine.length; i++)
            {
                let eachValue = eachLine[i].split('\t');
                if (eachValue[6] != 'unexplored') continue;
                if (eachValue[1] == 'p') continue;

                let newCords = buildCordsObject(eachValue[3], eachValue[4], eachValue[5]);
                if (eachValue[3] > 1000000) continue;

                let distance = getDistance(newCords, mainCord);
                if (distance > fleetRange) continue;

                allOptions.push({C: newCords, D: distance});
            }

            console.log(`Auto-Exploration: Found ${allOptions.length} Possible Unexplored Systems To Explore`);
            allOptions.sort(function(a, b) {return a.D - b.D});

            for (let i = 0 ; i < allOptions.length; i++)
            {
                let exists = allCurrentRoutes.find(X => isEqule(X, allOptions[i].C));
                if (!exists)
                {
                    let newCords = allOptions[i].C;
                    console.log(`Auto-Exploration: Decided To Explore Option ${i+1}: (${newCords.X},${newCords.Y},${newCords.Z})`);
                    return fulfill(`http://www.war-facts.com/fleet.php?tpos=global&x=${newCords.X}&y=${newCords.Y}&z=${newCords.Z}&fleet=${fleetNumber}#callback=1`);
                }
            }
            return fulfill(false);
        });
    });
}

function getMapUrl() {
    var allNavs = document.getElementById('navData').getElementsByClassName('light tbborder padding5');
    var textItem = allNavs[allNavs.length - 1].innerHTML;
    let url = 'http://www.war-facts.com/extras/view_universe.php' + textItem.substring(textItem.indexOf('?'), textItem.indexOf("')")).replace('&amp;','&').replace('&amp;','&').replace('&amp;','&');
    return url;
}

function extractLink(url) {
    let values = url.split('?');
    let cords = values[1].split('&');
    let x = cords[0].split('=')[1];
    let y = cords[1].split('=')[1];
    let z = cords[2].split('=')[1];

    mainCord = buildCordsObject(x,y,z);
    return `http://www.war-facts.com/ajax/jsmap_postload_v2.php?centerX=${x}&centerY=${y}&centerZ=${z}&displayRange=25000`;
}

// End Find Unexplored System Functions

// Transfer to Planet Script

function addVerifyPlanetButton() {
    addOption();
    hookButton();
}

function addOption() {
    var fleetOption = document.getElementById('tpos');
    if (fleetOption)
        fleetOption.innerHTML = fleetOption.innerHTML + `<option value="planet">Planet</option>`;
}

function hookButton() {
    originalGetMission = getMission;
    getMission = function(str1, str2) {
        if (!document.getElementById('tpos') || document.getElementById('tpos').value != 'planet') {
            return originalGetMission(str1, str2);
        }
        else {
            let planetId = document.getElementById('xyz').value;
            let fleetId = getFleetNumber();
            window.location = `/fleet.php?tworld=${planetId}&fleet=${fleetId}#callback=1`;
            return;
        }
    }
}

// End Transfer to Planet Script

// Internal Explore

var wantedPlanet;

function addInternalButton()
{
    if (document.URL.indexOf('callback=1') >= 0) return;
    let amIExplorer = document.getElementById('fleetClass').innerHTML;
    let planetsList = [];

    // Check if we have Explorer Fleet and that we are not flying
    if (amIExplorer != 'Explorer' && amIExplorer != 'Sentry') return;

    let objc = document.getElementById('objective');
    if (objc == undefined) return;
    objc.value='explore';

    // Get all Planets
    let optionsElements = document.getElementById('target1').getElementsByTagName('option');
    for (let index = 2; index < optionsElements.length; index++)
        planetsList.push(optionsElements[index].value.split(',')[1]);

    // Get My Location
    let myCords = document.getElementsByClassName('light tbborder padding5')[3].getElementsByTagName('a')[0].innerHTML;
    if (myCords == '100, 100, 100 local')
        wantedPlanet = planetsList[0];
    else
    {
        let baseLink = document.getElementsByClassName('tbborder highlight overauto')[0].getElementsByTagName('A')[0].href;
        if (baseLink.indexOf('colony') >= 0)
            baseLink = document.getElementsByClassName('tbborder highlight overauto')[0].getElementsByTagName('A')[1].href;
        let extractPlanet = baseLink.substring(baseLink.indexOf('planet=')+7, baseLink.indexOf('fleet=') -1);
        let tmpPlanet = planetsList.findIndex(x => x == extractPlanet);
        if (tmpPlanet == planetsList.length - 1)
            wantedPlanet = -1;
        else
            wantedPlanet = planetsList[tmpPlanet+1];
    }

    if (wantedPlanet == -1) return;

    let newButton = document.createElement('input');
    newButton.type = 'button'
    newButton.value = 'Planet';
    newButton.style = 'width: 80px;'
    newButton.className = 'darkbutton dangerbutton';
    newButton.addEventListener("click", exploreNextPlanet);
    document.getElementsByClassName('iBlock tbborder padding5 fullwidth light')[0].insertBefore(newButton, null);
}

function exploreNextPlanet() {
    let optionsElements = document.getElementById('target1')
    optionsElements.value='tworld,' + wantedPlanet;
    getMission("verify", "target1")
    setTimeout(getMission('launch'),100);
    if (settings.nextAuto == true)
        nextFleet();
}

// End Internal Explore

// Control Panel Functions

function buildMenu() {
    let lastEle = document.getElementsByClassName('margintop padding5 highlight bold centertext box')[5];
    let div = document.createElement('div');

    div.className = "light";
    div.innerHTML = addMenu('autoExplore', "Auto-Explore").outerHTML;
    div.innerHTML += addRow(addCheckBox('autoNext', 'Auto Choose Next Free Explorer', settings.nextAuto)).outerHTML;
    div.innerHTML += addRow(addCheckBox('fullAuto', 'Auto Send Probes to Exploration (Warning - Might not be allowed - Requires AutoNext)', settings.fullAuto)).outerHTML;
    div.innerHTML += addRow(addCheckBox('detectEnemies', 'Alert When Detect Enemies (Message Box)', settings.alertEnemies)).outerHTML;
    div.innerHTML += addRow(addTextBox('enemiesFactions', 'Add Enemies Factions (Fleets from this factions will be alerted (`;` between words))', settings.enemyFactions.join(';'), 100)).outerHTML;
    div.innerHTML += addRow(addTextBox('safeDistance', 'Safe Distance (km - Reduce Destination Range)', settings.safeDistance)).outerHTML;
    div.innerHTML += addRow(addCheckBox('whiteList', 'White List Fleets Name (Only Names Below Will Be Choosen as Next Explorer)', settings.whiteList)).outerHTML;
    div.innerHTML += addRow(addTextBox('fleetNames', 'Allowed Fleet Names (Fleet thats includes one of this words will be choosed (`;` between words))', settings.goodNames.join(';'), 100)).outerHTML;
    div.innerHTML += addRow(addTextBox('ignoreLetter', 'Ignore Symbol (Fleets with this symbol will be ignored)', settings.badLetter, 10)).outerHTML;
    div.innerHTML += addRow(addSubmit()).outerHTML;

    lastEle.parentElement.insertBefore(div, lastEle);
    document.getElementById('exploreSubmit').addEventListener('click', updateSettings);
}

function addMenu(id, text) {
    let div = document.createElement('div');
    div.className = "margintop padding5 highlight bold centertext box";
    div.id = id;
    div.innerHTML = text;
    return div;
}

function addCheckBox(id, header, checked) {
    let div = addItem(header);
    header = header.split(' ')[0];
    div.innerHTML += `<input type="checkbox" class="checkbox" id="${id}" ${checked == 1 ? "checked" : ""}>`;
    return div;
}

function addTextBox(id, header, data, big = 10) {
    let div = addItem(header);
    header = header.split(' ')[0];
    div.innerHTML += `<input type="text" class="text" id="${id}" value="${data}" size="${big}" maxlength="${big}">`;
    return div;
}

function addSubmit() {
    let div = document.createElement('input');
    div.type = "submit";
    div.className = "darkbutton greenbutton width75";
    div.value = "Modify";
    div.id = "exploreSubmit";
    return div;
}

function addRow(item) {
    let div = document.createElement('div');
    div.className = "tbborder padding5";
    div.innerHTML = item.outerHTML;
    return div;
}
function addItem(header) {
    let div = document.createElement('div');
    div.className = 'light padding5';
    div.innerHTML = `${header}: `;
    return div;
}

function loadSettings() {
    let data = GM_getValue('auto-explore-settings');
    if (!data)
        return getSettings(fullAuto, autoSwitchToNextFleet, showEnemies, safeDistance, whiteList, fleetsName, abortletter, enemiesFactions)

    var allData = data.split('&');

    return getSettings(
        allData[0] == 0 ? false : true,
        allData[1] == 0 ? false : true,
        allData[2] == 0 ? false : true,
        allData[3],
        allData[4] == 0 ? false : true,
        allData[5].split(';'),
        allData[6],
        allData[7].split(';')
    );
}

function updateSettings() {
    let autoNext = document.getElementById('autoNext').checked;
    let fullAuto = document.getElementById('fullAuto').checked;
    let detectEnemies = document.getElementById('detectEnemies').checked;
    let safeDistance = document.getElementById('safeDistance').value;
    let whiteList = document.getElementById('whiteList').checked;
    let fleetNames = document.getElementById('fleetNames').value;
    let ignoreLetter = document.getElementById('ignoreLetter').value;
    let enemiesFactions = document.getElementById('enemiesFactions').value;

    saveSettings(fullAuto, autoNext, detectEnemies, safeDistance, whiteList, fleetNames, ignoreLetter, enemiesFactions);
}

function saveSettings(full, next, alert, safe, white, gNames, bNames, eFactions) {
    let data = getSettings(
        full == false ? 0 : 1,
        next == false ? 0 : 1,
        alert == false ? 0 : 1,
        safe,
        white == false ? 0 : 1,
        gNames,
        bNames,
        eFactions
     );

    let makestring = `${data.fullAuto}&${data.nextAuto}&${data.alertEnemies}&${data.safeDistance}&${data.whiteList}&${data.goodNames}&${data.badLetter}&${data.enemyFactions}`;
    GM_setValue('auto-explore-settings', makestring);
    location.reload();
}

function getSettings(full, next, alert, safe, white, gNames, bNames, eFactions) {
    return { fullAuto: full, nextAuto: next, alertEnemies: alert, safeDistance:safe, whiteList:white, goodNames: gNames, badLetter: bNames, enemyFactions: eFactions };
}

// End Settings

// Utilities

function sendAjaxRequest(type, link, async, withResponse, params) {
    return new Promise(function (fulfill, reject){
        var xhttp = new XMLHttpRequest();
        xhttp.open(type, link , true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send(params);
        xhttp.onreadystatechange = function () {
          if(xhttp.readyState === 4 && xhttp.status === 200) {
              if (withResponse == true)
                  fulfill(xhttp.responseText);
              else
                  fulfill();
          }
        };
    });
}

function divAjaxRequest(type, link, async, withResponse, params) {
    return new Promise(function (fulfill, reject){
        sendAjaxRequest(type, link, async, withResponse, params).then(function(html){
            var div = document.createElement('div');
            div.innerHTML = html;
            return fulfill(div);
        });
    });
}
