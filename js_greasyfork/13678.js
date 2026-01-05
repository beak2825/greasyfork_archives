// ==UserScript==
// @name        Intelligence Auto Setup
// @namespace   github.com/odahviing
// @author      Odahviing
// @include     http://*.war-facts.com/intelligence.php
// @include     http://*.war-facts.com/empire_known_universe.php
// @description Script to auto-setup of search settings and improve results
// @version     2.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/13678/Intelligence%20Auto%20Setup.user.js
// @updateURL https://update.greasyfork.org/scripts/13678/Intelligence%20Auto%20Setup.meta.js
// ==/UserScript==

// Version 1.3 - Add distance from target
// Version 2.0 - Rebuilding the script with multiple new options

// TODO: Sort By Distance

setupButtons();
addDataToResults();

/* Button Actions Functions */

function setupButtons() {
    createButton('xyz', 'Mining Colony', setupMiningColony);
    createButton('xyz', 'Urban Colony', setupUrbanColony);
    createButton('habit', 'Remove Colonized Systems', removeColonizedPlanets);
}

function removeColonizedPlanets() {
  var mainTable = document.getElementsByTagName('table');
  var allColonies = mainTable[0].rows;
  var removeRows = []
  for (index = 1; index <allColonies.length ; index = index + 2)
  {
    var innerTableRow = allColonies[index].getElementsByTagName('table')[0].rows[0];
    var cell = innerTableRow.cells[1];
    if (cell.innerHTML != '&nbsp;')
    {
      removeRows.push(index-1);
      removeRows.push(index);
    }
  }

  for (index = removeRows.length -1; index >=0; index --)
    mainTable[0].deleteRow(removeRows[index]);
}

function setupUrbanColony() {
    $('[name=habit]').val(50);
    $('[name=landmass]').val(5000000000);
    $('[name=orderType]').val("hab")
    $('[name=radius]').val(100000000);
    $('[name=orderDirection]').val("desc");
    $('[name=ressel]').val(1)
    setupARPlanet();
}

function setupMiningColony() {
    $('[name=habit]').val(40);
    $('[name=landmass]').val(1000000000);
    $('[name=orderType]').val("hab")
    $('[name=radius]').val(100000000);
    $('[name=orderDirection]').val("desc");
    $('[name=ressel]').val(1)
    setupARPlanet();
    setupResourcesThreshold(10,10,10,10,10,10,10,10,10,10,10);
}

/* End Button Actions Functions */

/* Internal Actions Options */

function setupARPlanet() {
    var allBoxes = $("input[type=checkbox]");
    $.each(allBoxes, function( index, value ) {
        var checkBox = value;
        if (checkBox.name == "colonized") return true; // On empire page, we had extra checkBox
        checkBox.checked = true;
    });
}

function setupResourcesThreshold(carbon, iron, copper, silver, titanium, gold, uranium, platinum, oil, water, fert) {
    toggleThreshold();
    let res = [carbon, iron, copper, silver, titanium, gold, uranium, platinum, oil, water, fert];
    let mainObj = document.getElementsByClassName('light padding5 box fullwidth')[1];
    let allObjects = mainObj.getElementsByTagName('input');
    let startId = allObjects.length - 11;

    for (; startId < allObjects.length; startId++)
        allObjects[startId].value = res[startId - 12];
}

/* End Internal Actions Options */

/* Add Data To Results */

function addDataToResults() {
    if (detectIfCallBack() == false) return;
    var getWantedCords = document.getElementById('xyz').value;
    getWantedCords = getWantedCords.trim().replace(' ','').replace(' ','');
    if (getWantedCords == '') return;

    let cords = buildCordsObjectFromText(getWantedCords);

    let mainTable = document.getElementsByTagName('table')[0];
    let allRows = mainTable.getElementsByTagName('tr');
    if (allRows.length > 200) return;

    for (let i = 0; i < allRows.length; i ++)
    {
        var headObject = allRows[i].getElementsByClassName('head');
        if (headObject.length == 0) continue;

        let text = headObject[1].innerHTML;
        let cordsText = text.substring(text.indexOf('(') + 1 , text.indexOf(')'));
        var lineCords = new buildCordsObjectFromText(cordsText);
        let currentDistance = getDistance(cords, lineCords);
        var myp = document.createElement("span");
        myp.style.color = "yellow";
        myp.innerHTML = currentDistance.toFixed(0).replace(/(\d)(?=(\d{3})+$)/g, '$1,') + " km";
        allRows[i].getElementsByClassName('head')[1].outerHTML = myp.outerHTML + allRows[i].getElementsByClassName('head')[1].outerHTML;

        var myp1 = document.createElement("button");
        var link = allRows[i].getElementsByTagName('a')[0].innerHTML;
        myp1.value=`${lineCords.X}&${lineCords.Y}&${lineCords.Z}&${link}`;
        myp1.innerHTML= `Bookmark`;
        myp1.id= `bookmarkButton${i}`;
        myp1.addEventListener("click", buttonOnClickEvent, false);
        allRows[i].getElementsByClassName('head')[1].outerHTML = allRows[i].getElementsByClassName('head')[1].outerHTML + myp1.outerHTML;
        document.getElementById(myp1.id).addEventListener("click", buttonOnClickEvent, false);
    }
}

function detectIfCallBack() {
    let tables = document.getElementsByTagName('table');
    return tables.length > 1;
}

function buttonOnClickEvent() {
    var allValues = this.value.split('&');
    window.location = `/player_map.php?x=${allValues[0]}&y=${allValues[1]}&z=${allValues[2]}&name=${allValues[3]}`;
}

/* End Data To Results */

/* Utilities Functions */

function createButton(elementIdName, buttonText, callbackFunction) {
  var buttonName = `btn-${buttonText.replace(' ','').replace(' ','')}`;
  var row = document.getElementById(elementIdName);
  if (row == undefined) {
      attachIdByName(elementIdName);
      row = document.getElementById(elementIdName);
  }
  row.outerHTML = row.outerHTML + `<input type='button' class='darkbutton' id='${buttonName}' value='${buttonText}'>`;
  var button = document.getElementById(buttonName);
  button.addEventListener("click", callbackFunction, false);
}

function buildCordsObjectFromText(str) {
    let cords = str.split(',');
    return buildCordsObject(cords[0], cords[1], cords[2]);
}

function buildCordsObject(x,y,z) {
    return {X : parseInt(x), Y: parseInt(y), Z: parseInt(z)}
}

function isEqule(cordsA, cordsB) {
    return (cordsA.X == cordsB.X && cordsA.Y == cordsB.Y && cordsA.Z == cordsB.Z);
}

function getDistance(cordsA, cordsB) {
    let X = Math.pow(cordsA.X - cordsB.X, 2);
    let Y = Math.pow(cordsA.Y - cordsB.Y, 2);
    let Z = Math.pow(cordsA.Z - cordsB.Z, 2);
    let f = Math.sqrt(X + Y + Z);
    return 4000 * f;
}

function attachIdByName(name) {
    $(`[name=${name}]`)[0].id = name;
}

/* End Utilities Functions */