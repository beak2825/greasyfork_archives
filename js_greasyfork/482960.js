// ==UserScript==
// @name         Utopia Build Autofill
// @namespace    http://tampermonkey.net/
// @version      2023-12-23b
// @description  Allows the user to define and autofill builds.
// @author       Soupy
// @match        https://utopia-game.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482960/Utopia%20Build%20Autofill.user.js
// @updateURL https://update.greasyfork.org/scripts/482960/Utopia%20Build%20Autofill.meta.js
// ==/UserScript==

var buildingTypes = {'Homes': {'abbreviated': 'Homes', 'full': 'Homes'},
                     'Farms': {'abbreviated': 'Farms', 'full': 'Farms'},
                     'Mills': {'abbreviated': 'Mills', 'full': 'Mills'},
                     'Banks': {'abbreviated': 'Banks', 'full': 'Banks'},
                     'TGs': {'abbreviated': 'TGs', 'full': "Training Grounds"},
                     'Arms': {'abbreviated': 'Arms', 'full': 'Armouries'},
                     'Rax': {'abbreviated': 'Rax', 'full': 'Military Barracks'},
                     'Forts': {'abbreviated': 'Forts', 'full': 'Forts'},
                     'Cas': {'abbreviated': 'Cas', 'full': 'Castles'},
                     'Hosps': {'abbreviated': 'Hosps', 'full': 'Hospitals'},
                     'Guilds': {'abbreviated': 'Guilds', 'full': 'Guilds'},
                     'Towers': {'abbreviated': 'Towers', 'full': 'Towers'},
                     'TDs': {'abbreviated': 'TDs', 'full': "Thieves' Dens"},
                     'WTs': {'abbreviated': 'WTs', 'full': 'Watch Towers'},
                     'Unis': {'abbreviated': 'Unis', 'full': 'Universities'},
                     'Libs': {'abbreviated': 'Libs', 'full': 'Libraries'},
                     'Stables': {'abbreviated': 'Stables', 'full': 'Stables'},
                     'Dungs': {'abbreviated': 'Dungs', 'full': 'Dungeons'}};

var buildingPercentInputs = {};
var buildingRecommended = {};

var builds;
var stockBuilds = {
};

var provinceData = {};
var mutationsDetected = 0;

(function() {
    'use strict';
})();

window.addEventListener('load', function() {
    setTimeout(() => {

        initializeAutofill();

        var observer = new MutationObserver(function(mutations) {
            mutations.forEach((mutationRecord) => {
                //mutationsDetected++;
                //  If we detect 3 mutations
               // if(mutationsDetected == 3) {
                 //   mutationsDetected = 0;
                 //   console.log('AJAX page load detected, initializing Autofill');
                   // setTimeout(() => {
                  //      initializeAutofill();
                  //  }, 3000);
                //}
                if(window.location.href == 'https://utopia-game.com/wol/game/build'
                   || window.location.href == 'https://utopia-game.com/wol/game/raze') {
                    location.reload(true);
                }
            });
        });

        var target = document.getElementsByClassName('game-content');
        observer.observe(target[0], { attributes : true, attributeFilter : ['style'] });

    }, 3000);

}, false);

function initializeAutofill() {

    if(window.location.href == 'https://utopia-game.com/wol/game/build'
       || window.location.href == 'https://utopia-game.com/wol/game/raze') {

        console.log('Initializing Autofill');
        var autofillDiv = document.createElement('div');
        autofillDiv.setAttribute('id', 'autofillDiv');

        const storedData = localStorage.getItem('provinceData');
        if(storedData) provinceData = JSON.parse(storedData);

        if(window.location.href == 'https://utopia-game.com/wol/game/build') {

            if(document.getElementById('savebuild')) {
                document.getElementById('savebuild').style.display = 'none';
                document.getElementById('loadbuild').style.display = 'none';
                document.getElementById('fillin').style.display = 'none';
            }

            var existingBuildDiv = document.getElementById('buildidfetch').parentElement;
            existingBuildDiv.innerHTML = '';
            existingBuildDiv.appendChild(autofillDiv);

            const dropdown = document.createElement("select");
            dropdown.setAttribute('id', 'buildDropdown');
            const promptOption = document.createElement("option");
            promptOption.value = "";
            promptOption.text = "Select a build...";
            dropdown.appendChild(promptOption);

            var buildData = localStorage.getItem('builds');
            if(!buildData) {
                builds = stockBuilds;
            } else {
                builds = JSON.parse(buildData);
            }

            for (const key in builds) {
                const option = document.createElement("option");
                option.value = key;
                option.text = key;
                dropdown.appendChild(option);
            }
            autofillDiv.appendChild(dropdown);

            const useBuildBtn = document.createElement('button');
            useBuildBtn.textContent = 'Use Build';
            useBuildBtn.setAttribute('id', 'useBuildBtn');
            autofillDiv.appendChild(document.createTextNode(" "));
            autofillDiv.appendChild(useBuildBtn);
            useBuildBtn.addEventListener("click", importPercentages, false);

            autofillDiv.appendChild(document.createTextNode(" --- "));

            // *********************************************
            //             Build Management Buttons

            const manageBtn = document.createElement('button');
            manageBtn.textContent = 'Manage';
            manageBtn.setAttribute('id', 'manageBtn');
            autofillDiv.appendChild(manageBtn);
            manageBtn.addEventListener("click", () => {document.getElementById('manageDiv').style.display = 'block';}, false);

            const manageDiv = document.createElement('div');
            manageDiv.setAttribute('id', 'manageDiv');

            const savenameInput = document.createElement('input');
            savenameInput.setAttribute('id', 'savename');
            savenameInput.setAttribute('type', 'text');
            savenameInput.setAttribute('value', '');
            manageDiv.appendChild(document.createTextNode(" "));
            manageDiv.appendChild(savenameInput);
            manageDiv.appendChild(document.createTextNode(" "));

            const saveBuildBtn = document.createElement('button');
            saveBuildBtn.textContent = 'Save Build';
            saveBuildBtn.setAttribute('id', 'saveBuildBtn');
            manageDiv.appendChild(saveBuildBtn);
            saveBuildBtn.addEventListener("click", saveBuild, false);

            manageDiv.appendChild(document.createElement('br'));

            const deleteDropdown = document.createElement("select");
            deleteDropdown.setAttribute('id', 'deleteDropdown');
            const deletePromptOption = document.createElement("option");
            deletePromptOption.value = "";
            deletePromptOption.text = "Select a build to delete...";
            deleteDropdown.appendChild(deletePromptOption);

            for (const key in builds) {
                const option = document.createElement("option");
                option.value = key;
                option.text = key;
                deleteDropdown.appendChild(option);
            }
            manageDiv.appendChild(deleteDropdown);

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete Build';
            deleteBtn.setAttribute('id', 'deleteBtn');
            manageDiv.appendChild(document.createTextNode(" "));
            manageDiv.appendChild(deleteBtn);
            deleteBtn.addEventListener("click", () => {removeBuild();}, false);

            manageDiv.appendChild(document.createElement('br'));

            // *********************************************
            //             Import / Export Buttons

            const importBox = document.createElement("input");
            importBox.setAttribute('type', 'text');
            importBox.setAttribute('id', 'importBox');
            importBox.style.width = "100px";
            manageDiv.appendChild(importBox);
            manageDiv.appendChild(document.createTextNode(" "));

            const importBtn = document.createElement('button');
            importBtn.textContent = 'Import Builds';
            importBtn.setAttribute('id', 'importBtn');
            manageDiv.appendChild(importBtn);
            importBtn.addEventListener("click", () => {
                if(document.getElementById('importBox').value != '') {
                    var data = JSON.parse(document.getElementById('importBox').value);
                    if(data) {
                        builds = data;
                        alert('Builds imported');
                    } else {
                        alert('Builds not imported, bad input');
                    }
                    storeData();
                }
            }, false);

            manageDiv.appendChild(document.createElement('br'));

            const exportBtn = document.createElement('button');
            exportBtn.textContent = 'Export Builds';
            exportBtn.setAttribute('id', 'exportBtn');
            manageDiv.appendChild(exportBtn);
            exportBtn.addEventListener("click", () => {
                document.getElementById('exportBox').value = JSON.stringify(builds);
                document.getElementById('exportBox').style.display = 'block';
                navigator.clipboard.writeText(JSON.stringify(builds)).then(() => {alert("Copied Builds to Clipboard");});
            }, false);
            const exportBox = document.createElement('textarea');
            exportBox.setAttribute('id', 'exportBox');
            manageDiv.appendChild(exportBox);
            exportBox.style.border = '2px dashed #bbb';
            exportBox.style.display = 'none';
            exportBox.style.margin = 'auto';
            exportBox.style.width = '90%';
            exportBox.style.height = 'auto';

            manageDiv.style.display = 'none';
            autofillDiv.appendChild(manageDiv);
            manageDiv.style.border = "1px solid #aaa";
            manageDiv.style.borderRadius = '10px';
            manageDiv.style.backgroundColor = '#555';
            manageDiv.style.margin = 'auto';
            manageDiv.style.lineHeight = '3em';
            manageDiv.style.width = '70%';

            // *********************************************
            //             Autofill Buttons

            autofillDiv.appendChild(document.createElement("br"));

            const autofillPercentBtn = document.createElement('button');
            autofillPercentBtn.textContent = 'Load Working Build';
            autofillPercentBtn.setAttribute('id', 'autofillPercentBtn');
            autofillDiv.appendChild(document.createTextNode(" "));
            autofillDiv.appendChild(autofillPercentBtn);
            autofillPercentBtn.addEventListener("click", fillPercentagesWorking, false);

            const autofillBuildBtn = document.createElement('button');
            autofillBuildBtn.textContent = 'Fill In';
            autofillBuildBtn.setAttribute('id', 'autofillBuildBtn');
            autofillDiv.appendChild(document.createTextNode(" "));
            autofillDiv.appendChild(autofillBuildBtn);
            autofillBuildBtn.addEventListener("click", fillBuild, false);

            const goToRazeBtn = document.createElement('button');
            goToRazeBtn.textContent = 'Go To Raze';
            goToRazeBtn.setAttribute('id', 'goToRazeBtn');
            autofillDiv.appendChild(document.createTextNode(" "));
            autofillDiv.appendChild(goToRazeBtn);
            goToRazeBtn.addEventListener("click", () => {window.location.href = '/wol/game/raze';}, false);

            for(const [type, data] of Object.entries(buildingTypes)) {
                buildingPercentInputs[type] = document.getElementById(type);
                buildingPercentInputs[type].addEventListener("focusout", () => {calculateBuild(); storeData();});
                buildingRecommended[type] = buildingPercentInputs[type].nextElementSibling;
            };

        } else if(window.location.href == 'https://utopia-game.com/wol/game/raze') {

            // *********************************************
            //             Raze Buttons

            const razeElement = document.getElementsByName('raze');
            razeElement[0].addEventListener('click', () => {setTimeout(() => {window.location.href = '/wol/game/build'}, 3000)});
            const buttonDiv = razeElement[0].parentElement.parentElement;

            const autofillRazeBtn = document.createElement('button');
            autofillRazeBtn.textContent = 'Fill Raze';
            autofillRazeBtn.setAttribute('id', 'autofillRaze');
            buttonDiv.appendChild(document.createElement("br"));
            buttonDiv.appendChild(autofillRazeBtn);
            autofillRazeBtn.addEventListener("click", fillRazes, false);

            const goToBuildBtn = document.createElement('button');
            goToBuildBtn.textContent = 'Go To Build';
            goToBuildBtn.setAttribute('id', 'goToBuildBtn');
            autofillDiv.appendChild(document.createTextNode(" "));
            autofillDiv.appendChild(goToBuildBtn);
            goToBuildBtn.addEventListener("click", () => {window.location.href = '/wol/game/build';}, false);
        }
    }
}

function storeData() {
    localStorage.setItem('provinceData', JSON.stringify(provinceData));
    localStorage.setItem('builds', JSON.stringify(builds));
}

function calculateBuild() {

    const futureLand = parseInt(document.getElementById('futureland').value);

    var landDiv = document.evaluate("//th[contains(., 'Total Land')]", document, null, XPathResult.ANY_TYPE, null).iterateNext();
    provinceData.land = parseInt(landDiv.nextElementSibling.textContent.replace(' acres', ''));

    var undevelopedDiv = document.evaluate("//th[contains(., 'Total Undeveloped land')]", document, null, XPathResult.ANY_TYPE, null).iterateNext();
    provinceData.undevelopedLand = parseInt(undevelopedDiv.nextElementSibling.textContent.replace(' acres', ''));

    var constructionDiv = document.evaluate("//th[contains(., 'Construction Cost')]", document, null, XPathResult.ANY_TYPE, null).iterateNext();
    provinceData.constructionCost = parseInt(constructionDiv.nextElementSibling.textContent.replace('gc per acre', ''));

    var razeDiv = document.evaluate("//th[contains(., 'Raze Cost')]", document, null, XPathResult.ANY_TYPE, null).iterateNext();
    provinceData.razeCost = parseInt(razeDiv.nextElementSibling.textContent.replace('gc per acre', ''));

    var creditDiv = document.evaluate("//th[contains(., 'Free Building Credits')]", document, null, XPathResult.ANY_TYPE, null).iterateNext();
    provinceData.constructionCredits = parseInt(creditDiv.nextElementSibling.textContent.replace('gc per acre', ''));

    var constructionTimeDiv = document.evaluate("//th[contains(., 'Construction Time')]", document, null, XPathResult.ANY_TYPE, null).iterateNext();
    provinceData.constructionTime = parseInt(constructionTimeDiv.nextElementSibling.textContent.replace(' days', ''));
    storeData();

    if (!(provinceData.land)) provinceData.land = 0;
    if (!(provinceData.futureLand)) provinceData.futureLand = 0;

    provinceData.totalLand = provinceData.land + provinceData.futureLand;

    var totalPercent = 0;
    var totalAcresToBuild = 0;
    var totalAcresToRaze = 0;
    var inputBox;

    provinceData.acres = {};

    for(const [type, data] of Object.entries(buildingTypes)) {

        provinceData.acres[type] = {};

        const thisDiv = document.evaluate('//th[contains(., "' + data.full + '")]', document, null, XPathResult.ANY_TYPE, null).iterateNext();
        if(!thisDiv) console.log("Could not find: " + type);

        provinceData.acres[type].built = parseInt(thisDiv.nextElementSibling.innerText);
        provinceData.acres[type].inProgress = parseInt(thisDiv.nextElementSibling.nextElementSibling.innerText);
        provinceData.acres[type].desiredPercent = parseFloat(buildingPercentInputs[type].value);
        provinceData.acres[type].desiredAcres = Math.round((provinceData.land / 100) * provinceData.acres[type].desiredPercent, 0);
        provinceData.acres[type].needToBuild = provinceData.acres[type].desiredAcres - (provinceData.acres[type].built + provinceData.acres[type].inProgress);

        if(provinceData.acres[type].needToBuild < 0) {
            provinceData.acres[type].needToRaze = -1 * provinceData.acres[type].needToBuild;
            provinceData.acres[type].needToBuild = 0;
            totalAcresToRaze += provinceData.acres[type].needToRaze;
        } else if(provinceData.acres[type].needToBuild == 0) {
            provinceData.acres[type].needToRaze = 0;
            provinceData.acres[type].needToBuild = 0;
        } else {
            provinceData.acres[type].needToRaze = 0;
            totalAcresToBuild += provinceData.acres[type].needToBuild;
        }

        totalPercent += parseFloat(buildingPercentInputs[type].value);

        if (provinceData.acres[type].needToBuild > 0) {
            buildingRecommended[type].innerText = provinceData.acres[type].needToBuild;
            buildingRecommended[type].style.backgroundColor = "green";
        } else if (provinceData.acres[type].needToRaze > 0) {
            buildingRecommended[type].innerText = '-' + provinceData.acres[type].needToRaze;
            buildingRecommended[type].style.backgroundColor = "red";
        } else {
            buildingRecommended[type].innerText = '0';
            buildingRecommended[type].style.backgroundColor = "grey";
        }

    };

    const costDiv = document.getElementById('rebuildcosts');
    costDiv.innerText = 'Build: ' + totalAcresToBuild + ' Raze: ' + totalAcresToRaze + ' Cost: ' + (((totalAcresToBuild - provinceData.constructionCredits) * provinceData.constructionCost) + (totalAcresToRaze * provinceData.razeCost));

    document.getElementById('totals').value = totalPercent;
}

function fillPercentagesWorking() {
    for(const [type, data] of Object.entries(buildingTypes)) {
        buildingPercentInputs[type].value = provinceData.acres[type].desiredPercent;
    };
    calculateBuild();
    storeData();
}

function importPercentages() {
    for(const [type, data] of Object.entries(buildingTypes)) {
        buildingPercentInputs[type].value = builds[document.getElementById('buildDropdown').value][type];
    };
    calculateBuild();
    storeData();
}

function fillBuild() {

    calculateBuild();

    var divs;
    var thisDiv;
    var inputBox;
    var hasRaze = false;

    console.log('Filling build');
    for(const [type, data] of Object.entries(buildingTypes)) {

        if(provinceData.acres[type].needToRaze > 0) hasRaze = true;
        if(provinceData.acres[type].needToBuild == 0) continue;
        divs = document.evaluate('//th[contains(., "' + data.full + '")]', document, null, XPathResult.ANY_TYPE, null);
        if(!divs) console.log('Could not find: ' + type);

        thisDiv = divs.iterateNext();
        inputBox = thisDiv.nextElementSibling.nextElementSibling.nextElementSibling.firstChild;

        inputBox.value = provinceData.acres[type].needToBuild;
    }

    if(hasRaze) alert('Raze before building');
    if(provinceData.constructionTime >= 10) alert('Building without Builder\' Boon');
}

function fillRazes() {

    var typeDiv
    var inputDiv;

    for(const [type, data] of Object.entries(buildingTypes)) {
        typeDiv = document.evaluate('//th[contains(., "' + data.full + '")]', document, null, XPathResult.ANY_TYPE, null).iterateNext();
        inputDiv = typeDiv.nextElementSibling.nextElementSibling.firstChild;
        inputDiv.value = provinceData.acres[type].needToRaze > 0 ? provinceData.acres[type].needToRaze : '';
    }
}

function saveBuild() {

    var build = {};
    for(const [type, data] of Object.entries(buildingTypes)) {
        build[type] = buildingPercentInputs[type].value;
    }

    builds[document.getElementById('savename').value] = build;
    localStorage.setItem('builds', JSON.stringify(builds));
}

function removeBuild() {
    delete builds[document.getElementById('deleteDropdown').value];
    localStorage.setItem('builds', JSON.stringify(builds));
}
console.log('Added Build Autofill Script');