// ==UserScript==
// @name         Research Manager
// @namespace    Odahviing
// @version      1.63
// @description  The Research Team Builder
// @author       Odahviing
// @match        http://www.war-facts.com/science.php*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/371147/Research%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/371147/Research%20Manager.meta.js
// ==/UserScript==

// Consts
var normalize = 25;
var currentHighestValue = 22;
var points = 500;
var baseNegativeMulti = 0.7;
var blueLabel = 75;
var ignoreIng = false;
var ingMul = 1.03;
var formulaLink = 'https://raw.githubusercontent.com/odahviing/Warfacts-Greasemonkey/master/data.txt';

// Globals
var formulas = [];
var extraNames = ['Mines', 'Institutions', 'Attacking Hulls', 'Weapons', 'Colony Fun Transport GML', 'Drives', 'Probes'];

// Main Functions

function onBluePrintRequest() {
    let formula = getWantedFormula();
    if (formula == undefined) return;
    addFormulaLine(formula);
    let results = createResearchersList(formula);
    paintValues(results);
}

function addFormulaLine(formula) {
    let values = formula.formula;

    if (document.getElementById('formulanumbers') == null)
    {
        let newLine = document.createElement('tr');
        newLine.id = 'formulanumbers';
        newLine.classname = 'dark';

        newLine.append(buildTd(`empty1`, `  `));
        newLine.append(buildTd(`empty2`, `  `));
        newLine.append(buildTd(`formulaStr`, ''));
        newLine.append(buildTd(`empty4`, `  `));

        for (let i = 0; i < values.length; i++)
            newLine.append(buildTd(`formulaInc${i}`, ''));

        let tHead = document.getElementsByTagName('thead')[0];
        tHead.insertBefore(newLine, undefined)//, tHead.getElementsByClassName('dark')[0]);
    }

    document.getElementById('formulaStr').innerHTML = parseFloat(100 * Math.min(points,formula.power) / points).toFixed(1) + "%";

    for (let i = 0; i < values.length; i++)
        document.getElementById(`formulaInc${i}`).innerHTML = parseFloat(values[i]).toFixed(3);
}

function paintValues(orders) {
    if (document.getElementById('scriptRank') == null)
    {
        let headlineRow = document.getElementById('scitable').getElementsByClassName('dark')[0];
        headlineRow.insertBefore(buildTd('scriptRank', 'Rank'), headlineRow.getElementsByClassName('head')[1]);
        headlineRow.insertBefore(buildTd('scriptPoints', 'Points'), headlineRow.getElementsByClassName('head')[1]);
    }

    for (let i = 0; i < orders.length; i++)
    {
        let row = document.getElementById(`effect${orders[i].id}`);
        if (document.getElementById(`${orders[i].id}Rank`) == null)
        {
            row.insertBefore(buildTd(`${orders[i].id}Rank`), row.getElementsByClassName('strong')[1]);
            row.insertBefore(buildTd(`${orders[i].id}Points`), row.getElementsByClassName('strong')[1]);
        }

        document.getElementById(`${orders[i].id}Rank`).innerHTML = i+1;
        let orderRank = parseFloat(orders[i].rank).toFixed(3);
        document.getElementById(`${orders[i].id}Points`).innerHTML = `${orderRank} (-${parseInt(orders[i].negative)})`;
        document.getElementById(`${orders[i].id}Points`).style = "color:green";
        document.getElementById(`${orders[i].id}Rank`).style = "color:green";
        if (orderRank >= blueLabel && orders[i].negative <= 10)
        {
            document.getElementById(`${orders[i].id}Points`).style = "color:DodgerBlue";
            document.getElementById(`${orders[i].id}Rank`).style = "color:DodgerBlue";
        }

        if (orderRank < 0)
        {
            document.getElementById(`${orders[i].id}Points`).style = "color:LightCoral";
            document.getElementById(`${orders[i].id}Rank`).style = "color:LightCoral";
        }
    }
}

// End Main Functions

// Formula Working Class

function getWantedFormula() {
    let options = document.getElementById('item');
    let plan = formulas.find(x => x.id == options.value);
    if (plan == undefined) return undefined;
    return plan;
}

// End Formula Working Class

// Load Formula List

function makeFormulaList(){
    getRemoteFormula().then(function (tempObject) {
        formulas.push({id: 2, name: 'Iron Mine', formula: []});
        formulas.push({id: 3, name: 'Copper Mine', formula: []});
        formulas.push({id: 4, name: 'Silver Mine', formula: []});
        formulas.push({id: 5, name: 'Titanium Mine', formula: []});
        formulas.push({id: 6, name: 'Gold Mine', formula: []});
        formulas.push({id: 7, name: 'Uranium Mine', formula: []});
        formulas.push({id: 8, name: 'Platinum Mine', formula: []});
        formulas.push({id: 9, name: 'Diamond Mine', formula: []});
        formulas.push({id: 10, name: 'Drilling Rig', formula: []});
        formulas.push({id: 11, name: 'Well', formula: []});
        formulas.push({id: 12, name: 'Farm', formula: []});
        formulas.push({id: 14, name: 'Entertainment Facility', formula: []});
        formulas.push({id: 15, name: 'School', formula: []});
        formulas.push({id: 16, name: 'Hospital', formula: []});
        formulas.push({id: 17, name: 'Police Station', formula: []});
        formulas.push({id: 18, name: 'Research Facility', formula: []});
        formulas.push({id: 19, name: 'Empire Administration', formula: []});
        formulas.push({id: 20, name: 'Terraformer', formula: []});
        formulas.push({id: 21, name: 'Mall', formula: []});
        formulas.push({id: 23, name: 'Fighter Hull', formula: []});
        formulas.push({id: 24, name: 'Transport Hull', formula: []});
        formulas.push({id: 25, name: 'Colony Ship Hull', formula: []});
        formulas.push({id: 26, name: 'Carrier Hull', formula: []});
        formulas.push({id: 27, name: 'Bomber Hull', formula: []});
        formulas.push({id: 28, name: 'Battleship Hull', formula: []});
        formulas.push({id: 29, name: 'Probe Hull', formula: []});
        formulas.push({id: 30, name: 'Space Station Hull', formula: []});
        formulas.push({id: 31, name: 'Destroyer Hull', formula: []});
        formulas.push({id: 32, name: 'Corvette Hull', formula: []});
        formulas.push({id: 34, name: 'Troop Transport', formula: []});
        formulas.push({id: 37, name: 'Command Frigate', formula: []});
        formulas.push({id: 39, name: 'Surveyor Hull', formula: []});
        formulas.push({id: 55, name: 'Genesis Hull', formula: []});
        formulas.push({id: 41, name: 'Single Barrel Gun', formula: []});
        formulas.push({id: 42, name: 'Cannon', formula: []});
        formulas.push({id: 43, name: 'Gun Battery', formula: []});
        formulas.push({id: 45, name: 'Armor Plating', formula: []});
        formulas.push({id: 46, name: 'Energy Shield', formula: []});
        formulas.push({id: 48, name: 'Small Vessel Drive', formula: []});
        formulas.push({id: 49, name: 'Capital Ship Drive', formula: []});
        formulas.push({id: 53, name: 'AA Battery', formula: []});
        formulas.push({id: 54, name: 'Guided Missile Launcher', formula: []});

        extraNames.forEach((x,i) => {formulas.push({id: 60 + i, name: x, formula: []}); });

        for (let i = 0; i < formulas.length; i++)
        {
            let obje = tempObject.find(x => x.name == formulas[i].name);
            if (!obje) continue;
            formulas[i].formula = JSON.parse(obje.formula);
            formulas[i].power = obje.power;
            formulas[i].sum = formulas[i].formula.reduce((a,b) => a+b, 0);
        }
    });
}

function addUniqueFormulas() {
    let newItem = document.createElement('optgroup');
    let innerHTMLText = '';
    extraNames.forEach((x,i) => {innerHTMLText += `<option value="${60+i}">${x}</option>`;});

    newItem.label='Formulas';
    newItem.innerHTML =innerHTMLText;

    document.getElementById('item').insertBefore(newItem, undefined);
}

function getRemoteFormula() {
    return new Promise(function (fulfill){
        let tmpHelper = [];
        sendAjaxRequest(formulaLink).then(function (data) {
            let lines = data.split('\n');
            for (let i = 0; i < lines.length ; i++)
            {
                let items = lines[i].split('&');
                tmpHelper.push({ name: items[0], formula: items[1], power: items[2]});
            }
            return fulfill(tmpHelper);
        });
    });
}

// End Load Formula List

// Researchers Class

function createResearchersList(wantedRatio){
    let finalRanks = [];
    let mainObject = document.getElementById('scitable');
    let allPeople = mainObject.getElementsByClassName('highlight tbborder scitable');

    for (let i = 0; i < allPeople.length; i++)
    {
        let result = getSingleResearcher(allPeople[i], wantedRatio.formula, wantedRatio.sum);
        let id = allPeople[i].id.replace('effect','');
        finalRanks.push({id: id, rank: result.result, max: result.max, sum: result.sum, negative: result.negative});
    }

    finalRanks.sort((a,b) => b.rank - a.rank);
    return finalRanks;
}

function losePoints(researcherValue, ratio, multi) {
    if (researcherValue < ratio * multi) return 0;
    return (researcherValue - ratio * multi) * baseNegativeMulti * (1 - ratio / normalize);
}

function getSingleResearcher(elem, ratio, ratioSum) {

    let researcherValues = [];
    let max = 0;
    let sum = 0;
    let mainValues = elem.getElementsByClassName('strong');

    let i = (mainValues.length > 14) ? 4 : 2; // If its second run - we need to skip the two new columns + ING, if its only the first run - then only ING

    for (; i < mainValues.length - 1; i++)
    {
        let currentValue = parseInt(mainValues[i].innerHTML);
        if (i != 2)
        {
            sum = sum + currentValue;
            if (max < currentValue)
                max = currentValue;
        }

        researcherValues.push(currentValue);
    }

    let rightMultiple = currentHighestValue / normalize;
    //let leftMultiple = normalize / max;

    let result = 0;
    let negative = 0;

    for (let i = 1 /* Skipping ING */; i < researcherValues.length ; i++)
    {
        result += Math.min(researcherValues[i], ratio[i] * rightMultiple);
        let negativeValue =  losePoints(researcherValues[i], ratio[i], rightMultiple);
        negative += negativeValue;
        result -= negativeValue;
    }

    if (ignoreIng == false)
        result = (result > 0) ? result * Math.pow(ingMul, researcherValues[0]) : result * Math.pow(2 - ingMul, researcherValues[0])

    // Try
    result = result * 100 / ratioSum;

    return {result: result, max: max, sum :sum, negative: negative};
}

// End Researchers Class

// Helpers

function buildTd(id, text) {
    let newTd = document.createElement('td');
    newTd.id = id;
    newTd.style = "color:green";
    newTd.className = 'strong';
    newTd.innerHTML = text != undefined ? text : '';
    return newTd;
}

function textReplacer(elem, index, text) {
    let mainText = elem[index].innerHTML;
    if (mainText.indexOf('<img') > -1)
        mainText = mainText.substring(0, elem[index].innerHTML.indexOf('<img'));
    let days = mainText.replace(`${text}:`,'').replace('days','').trim();
    days = Math.round((days * 24) / 60);
    elem[index].innerHTML = elem[index].innerHTML.replace('days', `days (${days} hours)`);
}

function sendAjaxRequest(link) {
    return new Promise(function (fulfill) {
        var xhttp = new XMLHttpRequest();
        xhttp.open('GET', link , true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send();
        xhttp.onload = function (e) {
            if (xhttp.readyState === 4)
                if (xhttp.status === 200)
                    return fulfill(xhttp.responseText);
        };
    });
}

// End Helpers

(function() {
    'use strict';

    /* Setup Formula Settings */
    makeFormulaList();
    addUniqueFormulas();
    document.getElementById('item').onchange = onBluePrintRequest;

    /* Add Real-Life Time */
    let projectFrames = document.getElementsByClassName('clear light tbborder padding5 width50 left');
    for (let i = 0; i < projectFrames.length; i++)
    {
        let singleProject = projectFrames[i].getElementsByClassName('light padding5 tbborder');
        textReplacer(singleProject, 4, 'Current');
        textReplacer(singleProject, 5, 'Estimated');
        textReplacer(singleProject, 6, 'Maturity');
    }

    console.log('Research Manager Loaded');
})();