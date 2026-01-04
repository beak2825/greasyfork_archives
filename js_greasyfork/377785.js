// ==UserScript==
// @name         OhmzaoScript
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       You
// @include      *://ts3.*.travian.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377785/OhmzaoScript.user.js
// @updateURL https://update.greasyfork.org/scripts/377785/OhmzaoScript.meta.js
// ==/UserScript==

//const capacidadeTropasTeutao = [60, 40, 50, 0, 110, 80, 0, 0, 0, 3000];
//const capacidadeTropasRomano = [50, 20, 50, 0, 100, 70, 0, 0, 0, 3000];
// const capacidadeTropasGaules = [35, 45, 0, 75, 35, 65, 0, 0, 0, 3000];
//const capacidadeTropasHuno = [50, 30, 0, 75, 105, 80, 0, 0, 0, 3000];
//const capacidadeTropasEgipcio = [15, 50, 45, 0, 50, 70, 0, 0, 0, 3000];

const admissibleTroopNumbers = [2, 3, 5, 8, 10, 12, 15, 18]
const MIN_SLEEP_TIME = 2500;
const MAX_SLEEP_TIME = 3250;
// const SPY_VILLAGE = 18705;
const SPY_VILLAGE = 19373;
const MAX_WAITING_ITERATIONS = 10; 
const COLAPSE_LIST = true;
const SERVER_URL = window.location.origin

var nextA = 0;

// const infoIconBase64 = "data:image/gif;base64,R0lGODlhDAAMAMIEAACAgICAgICA/4D//////////////////yH5BAEKAAcALAAAAAAMAAwAAAMkeBohwio2R4OkhNQzqX9dplVf9pUjiaWgZ26TOALXR0fcBCkJADs="

var farmingTroops = [
    {
        name: "Espadachim",
        id: 2,
        capacity: 45
    },
    {
        name: "Trovão Theutate",
        id: 4,
        capacity: 70
    },
    {
        name: "Haeduano",
        id: 6,
        capacity: 65
    },
]

var farmLists = [
    // CAPITAL
    {
        "troopName": "Espadachim",
        "troopID": 2,
        "id": 1659,
        "minDistance": 0,
        "maxDistance": 75,
        "villageCoordinates": "-3|15",
        "isNatar": false
    },
    {
        "troopName": "Espadachim",
        "troopID": 2,
        "id": 2184,
        "minDistance": 75,
        "maxDistance": 300,
        "villageCoordinates": "-3|15",
        "isNatar": false
    },


    {
        "troopName": "Trovão Theutate",
        "troopID": 4,
        "id": 1298,
        "minDistance": 0,
        "maxDistance": 80,
        "villageCoordinates": "-3|15",
        "isNatar": false
    },
    {
        "troopName": "Trovão Theutate",
        "troopID": 4,
        "id": 1669,
        "minDistance": 80,
        "maxDistance": 350,
        "villageCoordinates": "-3|15",
        "isNatar": false
    },
    {
        "troopName": "Espadachim",
        "troopID": 2,
        "id": 2470,
        "minDistance": 0,
        "maxDistance": 80,
        "villageCoordinates": "-2|10",
        "isNatar": false
    },
    {
        "troopName": "Espadachim",
        "troopID": 2,
        "id": 2555,
        "minDistance": 80,
        "maxDistance": 150,
        "villageCoordinates": "-2|10",
        "isNatar": false
    },
    {
        "troopName": "Haeduano",
        "troopID": 6,
        "id": 2225,
        "minDistance": 0,
        "maxDistance": 80,
        "villageCoordinates": "-2|10",
        "isNatar": false
    },
    {
        "troopName": "Haeduano",
        "troopID": 6,
        "id": 2286,
        "minDistance": 80,
        "maxDistance": 175,
        "villageCoordinates": "-2|10",
        "isNatar": false
    },
    {
        "troopName": "Haeduano",
        "troopID": 6,
        "id": 2556,
        "minDistance": 175,
        "maxDistance": 400,
        "villageCoordinates": "-2|10",
        "isNatar": false
    }
]


var ammountOfTroops = []
farmingTroops.forEach(function (troop) {
    ammountOfTroops.push({
        name: troop.name,
        id: troop.id,
        ammount: 0
    });
});

async function waitForElement(cssSelector) {
    let iterations = 0;
    while (iterations < MAX_WAITING_ITERATIONS) {
        if (document.body.contains(document.querySelector(cssSelector))) {
            return true;
        } else {
            iterations += 1;
            await sleep(250, 750);
        }
    }

    console.log("[ERRO] Não foi possível encontrar um element necessário")
    return false;
}

function getNearestAdmissibleTroopAmmountToFarm(rawAmmountOfTroops) {
    return admissibleTroopNumbers.reduce(function (previous, current) {
        return (Math.abs(current - rawAmmountOfTroops) < Math.abs(previous - rawAmmountOfTroops) ? current : previous);
    });
}

async function removeOverlayingErrors() {
    while (document.querySelectorAll("div.dialog.white").length > 0) {
        document.querySelectorAll("div.dialog.white")[0].querySelector("#dialogCancelButton").click();
        await sleep(400, 600);
    }
}

function sleep(min, max) {
    return new Promise(resolve => setTimeout(resolve, Math.random() * (max - min) + min));
}

function xhttpRequest(url, httpMethod) {
    let xhttp = new XMLHttpRequest();

    xhttp.open(httpMethod, url, false);
    xhttp.send();

    if (xhttp.readyState === 4 && xhttp.status == 200) {
        let container = document.implementation.createHTMLDocument().documentElement;
        container.innerHTML = xhttp.responseText;
        return container;
    }
}

function villageCoordinatesFromHref(href) {
    return `x= ${href.split("x=")[1]}`;
}

function calculateEuclideanDistance(x1, y1, x2, y2) {
    const xs = x1 - x2;
    const ys = y1 - y2;
    return Math.round((Math.sqrt(xs * xs + ys * ys)) * 10) / 10;
}

async function sendSpy(spyType) {

    let spiesAmmount;
    let elementToWait;
    let spyTypeButton;

    if (spyType == 1) {
        spiesAmmount = 2;
        elementToWait = "#build > table > tbody:nth-child(4)";
        spyTypeButton = "#build > table > tbody:nth-child(4) > tr:nth-child(2) > td:nth-child(1) > input:nth-child(3)";
    } else {
        if (spyType == 2)
            spyTypeButton = "#build > table > tbody > tr:nth-child(2) > td:nth-child(1) > input:nth-child(1)";
        else
            spyTypeButton = "#build > table > tbody > tr:nth-child(2) > td:nth-child(1) > input:nth-child(3)";
        spiesAmmount = 1;
        elementToWait = "#build > table > tbody > tr:nth-child(2)";
    }

    document.querySelector('#troops > tbody > tr:nth-child(3) > td:nth-child(1) > input').value = 1; //meter um espião na input box
    document.querySelector('#build > div.a2b > form > div.option > label:nth-child(5) > input').click(); //mudar ataque para assalto
    if (await waitForElement("#build > table") == false) return;
    document.querySelector('#twb_multi').value = spiesAmmount;
    document.querySelector('#build > table > thead > tr > td:nth-child(1) > a').click();
    if (await waitForElement(elementToWait) == false) return;
    document.querySelector(spyTypeButton).click();
    document.querySelector("#build > table > tfoot > tr > td > button").click();
    localStorage.removeItem('spy');
}

function isTroopIgnored(url, troopName) {
    let ignoredTroops = JSON.parse(localStorage.getItem("ignored") || "[]");

    for (let i = 0; i < ignoredTroops.length; i++) {
        if (ignoredTroops[i].villageURL == url) {
            for (let j = 0; j < ignoredTroops[i].troop.length; j++) {
                if (ignoredTroops[i].troop[j] == troopName) {
                    return [i, j];
                }
            }
        }
    }
    return null;
}

function positionDetailsManager() {

    troopsOptimalAlgorithm();
    positionDetailsDesigner();

    if (!localStorage.hasOwnProperty("done"))
        loadChangesInSession();


    if (allowedToPerformFarmingAction("delete", window.location.href)) {
        sleep(250, 1000).then(v => document.getElementById('delete').click());
    }
    else if (allowedToPerformFarmingAction("autoAdjust", window.location.href)) {
        sleep(250, 1000).then(v => document.getElementById('ajustarlista').click());
    }

    function allowedToPerformFarmingAction(keyName, href) {
        let url = villageCoordinatesFromHref(href);
        let currentURLs = JSON.parse(localStorage.getItem(keyName));

        if (currentURLs == null) {
            return false;
        }

        if (currentURLs.includes(url)) {
            return true;
        }
        else {
            return false;
        }
    }

    function troopsOptimalAlgorithm() {

        let ammountFullBountyRaids = document.querySelectorAll(".full").length;
        let ammountEmptyRaids = document.querySelectorAll(".empty").length;
        let ammountHalfBountyRaids = document.querySelectorAll(".half").length;

        let ammountRaids = ammountFullBountyRaids + ammountEmptyRaids + ammountHalfBountyRaids;
        if (ammountRaids == 0) {
            return;
        }

        let uparsedResourcesAmmountArray = [];
        for (let i = 1; i <= ammountRaids; i++) {
            let unparsedQuantidadeRecursos = document.querySelector('#troop_info > tbody > tr:nth-child(' + i + ') > td > a:nth-child(4) > img');
            if (unparsedQuantidadeRecursos == undefined) {
                uparsedResourcesAmmountArray.push("0/0");
            } else {
                uparsedResourcesAmmountArray.push(unparsedQuantidadeRecursos.alt);
            }
        }

        let sumBountiesRaided = 0;
        let maxBountyRaided = 0;

        for (let i = 0; i < uparsedResourcesAmmountArray.length; i++) {
            let parsedRecursos = Number(uparsedResourcesAmmountArray[i].split('/')[0]);
            if (parsedRecursos > maxBountyRaided) {
                maxBountyRaided = parsedRecursos;
            }
            sumBountiesRaided += parsedRecursos;
        }

        let avgResources = sumBountiesRaided / uparsedResourcesAmmountArray.length;
        let optimalNumber = (avgResources + maxBountyRaided) / 2;

        if (ammountFullBountyRaids >= 3) {
            if (ammountFullBountyRaids == 5) {
                optimalNumber *= 2;
            } else if (ammountFullBountyRaids == 4) {
                optimalNumber *= 1.75;
            } else {
                optimalNumber *= 1.5;
            }
        } else if (ammountEmptyRaids >= 4) {
            //nao sei se falta meter tudo a 0
            return;
        }

        console.log("Max: " + maxBountyRaided + "; Media: " + avgResources + "; Num Otimo: " + optimalNumber);

        for (let i = 0; i < farmingTroops.length; i++) {
            let adjustedTroopNumber = Math.round(optimalNumber / farmingTroops[i].capacity);
            if (adjustedTroopNumber > 20) {
                ammountOfTroops[i].ammount = Math.ceil(adjustedTroopNumber / 5) * 5;
            }
            else {
                ammountOfTroops[i].ammount = getNearestAdmissibleTroopAmmountToFarm(adjustedTroopNumber);
            }
        }
    }

    function positionDetailsDesigner() {

        let villageOrOasis = isVillageOrOasis();

        somePageCleanup();
        troopsTextBoxs();
        adjustListsButton();
        deleteFarmButton();
        spyButtonAndSelectList(villageOrOasis);
        hasOasisButton(villageOrOasis);

        //###################### FUNCTIONS ######################//

        function somePageCleanup() {
            let scndFarmingButton = document.querySelector("div:nth-child(3) > div:nth-child(2) > a");

            if (document.body.contains(scndFarmingButton)) {
                scndFarmingButton.style.whiteSpace = "nowrap";
                scndFarmingButton.style.width = "320px";
            }
        }

        function troopsTextBoxs() {
            ammountOfTroops.forEach(function (troop) {
                let div = document.createElement('div');
                div.id = 'div' + troop.name.replace(" ", "");
                div.className = 'option';
                div.innerHTML = "Num. " + troop.name;
                div.style.display = "inline-block"

                let input = document.createElement('input');
                input.className = "troopsInputs"
                input.style.float = "right";
                input.style.marginRight = "55px";
                input.value = troop.ammount;
                input.style.textAlign = "center";
                input.onchange = function () {
                    saveChangesInSession(this);
                }

                let button = document.createElement("button");
                button.onclick = function () {
                    ignoreTroopToVillage(this, troop);
                }

                div.appendChild(input);
                div.appendChild(button);

                if (isTroopIgnored(villageCoordinatesFromHref(window.location.href), troop.name) != null) {
                    button.innerHTML = " &#10004";
                    button.title = "This troop WILL farm this village";
                    input.value = 0;
                }
                else {
                    button.innerHTML = "&#10008";
                    button.title = "This troop will NOT farm this village";
                }

                document.getElementsByClassName('tabContainer')[0].appendChild(div);

                function ignoreTroopToVillage(elem, troop) {
                    let url = villageCoordinatesFromHref(window.location.href);
                    let currentIgnored = JSON.parse(localStorage.getItem("ignored") || "[]");
                    let ignoredTroopIndex = isTroopIgnored(url, troop.name);

                    if (ignoredTroopIndex != null) { //des-ignore
                        elem.innerHTML = "&#10008";
                        elem.title = "This troop WILL farm this village";
                        removeTroopFromArray(currentIgnored, ignoredTroopIndex);
                        elem.parentElement.querySelector("input").value = troop.ammount;
                    }
                    else {
                        elem.innerHTML = " &#10004";
                        elem.title = "This troop will NOT farm this village";
                        addTroopToArray(currentIgnored, troop, url);
                        elem.parentElement.querySelector("input").value = 0;
                    }

                }

                function addTroopToArray(currentIgnored, troop, url) {
                    let newInfo = {
                        "villageURL": "",
                        "troop": []
                    };

                    for (let i = 0; i < currentIgnored.length; i++) {
                        if (currentIgnored[i].villageURL == url) {
                            newInfo = currentIgnored[i];
                            currentIgnored.splice(i, 1);
                        }
                    }

                    newInfo.villageURL = url;
                    newInfo.troop.push(troop.name)
                    newInfo.troop = [...new Set(newInfo.troop)]
                    currentIgnored.push(newInfo);

                    localStorage.setItem("ignored", JSON.stringify(currentIgnored));
                }

                function removeTroopFromArray(currentIgnored, troopIndexes) {
                    let i = troopIndexes[0];
                    let j = troopIndexes[1];

                    currentIgnored[i].troop.splice(j, 1);

                    if (currentIgnored[i].troop.length == 0) {
                        currentIgnored.splice(i, 1);
                    }

                    localStorage.setItem("ignored", JSON.stringify(currentIgnored));
                }
            });

            function saveChangesInSession(elem) {
                let newKey = { 'id': elem.parentElement.id, 'value': elem.value }
                let array = [];

                if (sessionStorage.hasOwnProperty("changedTroops")) {
                    array = JSON.parse(sessionStorage.getItem("changedTroops"));
                }
                array.push(newKey)
                sessionStorage.setItem("changedTroops", JSON.stringify(array));
            }
        }

        function adjustListsButton() {
            let elementToAppend = document.querySelector("#tileDetails > div > div:nth-child(1)");

            let adjustListDiv = document.createElement('div');
            adjustListDiv.className = 'option';

            let hyperLinkAdjustList = document.createElement('a');
            hyperLinkAdjustList.id = "ajustarlista";
            hyperLinkAdjustList.innerText = "Ajustar Lista";
            hyperLinkAdjustList.onclick = function () {
                adjustFarm();
            };

            if (document.querySelector('#tileDetails > div.detailImage > div.options > div:nth-child(1)').firstElementChild.className == "a arrow disabled") {
                hyperLinkAdjustList.className = "a arrow disabled";
            } else {
                hyperLinkAdjustList.className = "a arrow";
            }

            adjustListDiv.appendChild(hyperLinkAdjustList);
            elementToAppend.insertBefore(adjustListDiv, elementToAppend.children[3]);

            //###################### FUNCTIONS ######################//
            async function adjustFarm() {

                let adjustListElement = document.querySelector('#ajustarlista');
                // caso não haja tropas para farmar segue para o proximo farm
                if ([].slice.call(document.querySelectorAll(".troopsInputs")).every(elem => Number(elem.value) == 0)) {
                    functionCloser();
                    return;
                }

                let greenElement = document.querySelector('.titleInHeader').lastElementChild;
                if (greenElement.style.color == "rgb(0, 203, 0)") {
                    if (greenElement.innerText.includes("min")) {
                        functionCloser(adjustListElement);
                        return;
                    }
                }

                addKeyVillageURL("autoAdjust", window.location.href);

                // caso haja 2 elems para add/editar farm, tem que se apagar os farms para evitar confusão
                // if (document.querySelector("#tileDetails > div.detailImage > div:nth-child(3)").childElementCount == 2) {
                //     document.querySelector("#delete").click();
                //     return;
                // }

                adjustListElement.className = "a arrow disabled";
                adjustListElement.style.color = "red";

                ammountOfTroops.forEach(troop => {
                    troop.ammount = Number(document.querySelector("#div" + troop.name.replace(" ", "") + "> input").value);
                });


                for (const farmList of farmLists) {
                    let ammountOfTroop;
                    for (let j = 0; j < ammountOfTroops.length; j++) {
                        if (ammountOfTroops[j].name == farmList.troopName) {
                            ammountOfTroop = ammountOfTroops[j].ammount;
                            break;
                        }
                    }

                    let didPerform = await checksAdjustFarm(ammountOfTroop, farmList.troopID - 1, farmList.id, farmList.minDistance, farmList.maxDistance, farmList.villageCoordinates, farmList.isNatar);
                    if (didPerform == true) {
                        await sleep(1000, 2500);
                    }
                }

                functionCloser(adjustListElement);

                function functionCloser(elem) {
                    elem.className = "a arrow";
                    elem.style.color = "DarkGreen";
                    removeKeyVillageURL("autoAdjust", window.location.href);
                    if (localStorage.hasOwnProperty("done")) {
                        localStorage.setItem('done', "true")
                    }
                }
            }

            function isNatarVillage() {
                if (document.querySelector("#tileDetails > h1").innerText.includes("Natares")) {
                    return true
                }
                return false
            }

            async function checksAdjustFarm(troopAmmount, troopID, listID, minDistance, maxDistance, villageCoordinates, isNatar) {

                let myVillageX = Number(villageCoordinates.split("|")[0]);
                let myVillageY = Number(villageCoordinates.split("|")[1]);

                const unparsedCoord = window.location.href;
                const xRegex = /\?x=(-?\d+)&/;
                const yRegex = /&y=(-?\d+)/;
                let farmX = Number(unparsedCoord.match(xRegex)[1]);
                let farmY = Number(unparsedCoord.match(yRegex)[1]);

                let distanceBetweenVillageAndFarm = calculateEuclideanDistance(myVillageX, myVillageY, farmX, farmY);
                let isVillageNatarian = isNatarVillage();

                if (distanceBetweenVillageAndFarm >= minDistance && distanceBetweenVillageAndFarm < maxDistance && troopAmmount > 0 && isNatar == isVillageNatarian) {
                    if (isNatar == true) {
                        troopAmmount = 20;
                    }
                    await performAdjustFarm(listID, troopID, troopAmmount, farmX, farmY );
                    return true;
                }
                else {
                    return false;
                }
            }

            async function performAdjustFarm(idLista, index, numTropa, x, y) {
                
                let troopNumbers = []
                for(let i = 1; i <= 10; i++) {
                    if(i == index + 1) {
                        troopNumbers.push(numTropa)
                    }
                    else {
                        troopNumbers.push(0)
                    }
                }

                let body = {
                    cmd: "raidList",
                    listId: `${idLista}`,
                    method: "ActionAddSlot",
                    slots: null,
                    t1: troopNumbers[0],
                    t2: troopNumbers[1],
                    t3: troopNumbers[2],
                    t4: troopNumbers[3],
                    t5: troopNumbers[4],
                    t6: troopNumbers[5],
                    t7: troopNumbers[6],
                    t8: troopNumbers[7],
                    t9: troopNumbers[8],
                    t10: troopNumbers[9],
                    x: `${x}`,
                    y: `${y}`
                }
                body = JSON.stringify(body)

                let xhttp = new XMLHttpRequest();  
                xhttp.open('POST', SERVER_URL + '/api/v1/ajax', false);
                xhttp.setRequestHeader('Content-Type', 'application/json; charset=UTF-8')
                xhttp.setRequestHeader("authorization", `Bearer ${Travian.PolandHaneySlavered}`)
                xhttp.send(body);

                if (xhttp.readyState === 4 && xhttp.status == 200) {
                    console.log(xhttp.responseText)
                }
                // await removeOverlayingErrors();
                // document.querySelector('#crud-raidlist-button').click();
                // if (await waitForElement("#raidListSlot") == false) return;
                // document.querySelector('#lid').value = idLista;
                // document.querySelector('#lid').onchange();
                // var array = document.getElementsByClassName('text troop');
                // await sleep(600, 800);
                // for (let i = 0; i < array.length; i++) {
                //     array[i].value = 0;
                // }
                // array[index].value = numTropa;
                // document.querySelector('#save').click();
            }


            //#######################################################//
        }

        function deleteFarmButton() {
            let elementToAppend = document.querySelector("#tileDetails > div > div:nth-child(1)");

            let deleteDiv = document.createElement('div');
            deleteDiv.className = 'option';

            var hyperlinkDelete = document.createElement('a');
            hyperlinkDelete.id = "delete";
            hyperlinkDelete.innerText = "Apagar";
            hyperlinkDelete.onclick = function () {
                deleteFarm();
            }

            if (document.querySelectorAll('#crud-raidlist-button').length == 2) {
                hyperlinkDelete.className = "a arrow";
            } else {
                hyperlinkDelete.className = "a arrow disabled";
                removeKeyVillageURL("delete", window.location.href);
            }

            deleteDiv.appendChild(hyperlinkDelete);
            elementToAppend.insertBefore(deleteDiv, elementToAppend.children[4]);

            async function deleteFarm() {
                if (allowedToPerformFarmingAction("autoAdjust", window.location.href) == false) {
                    addKeyVillageURL("delete", window.location.href);
                }

                document.querySelectorAll('#crud-raidlist-button')[1].click();

                while (true) {
                    if (document.body.contains(document.querySelector("#raidListSlot")))
                        break;
                    else
                        await sleep(400, 800);
                }
                await sleep(250, 1000);
                document.querySelector("#delete").click();
                await sleep(250, 1000);
                document.querySelector('body > div:nth-child(1) > div > div > div.dialog-contents > form > div.buttons > button').click();
                await sleep(250, 1000);
                location.reload();
            }
        }

        function spyButtonAndSelectList(isVillageOrOasis) {
            let elementToAppend = document.querySelector("#tileDetails > div > div:nth-child(1)");
            let spyDiv = document.createElement('div');
            spyDiv.className = 'option';
            spyDiv.style.display = "inline-flex"

            let hyperlinkSpy = document.createElement('a');
            hyperlinkSpy.className = "a arrow";
            hyperlinkSpy.innerText = "Espiar";
            hyperlinkSpy.onclick = function () {
                if (isVillageOrOasis == 1) {
                    let value;
                    document.querySelectorAll("#spyOptions input").forEach(function (element) { if (element.checked) { value = element.value } })
                    localStorage.setItem("spy", value)
                }
                else {
                    localStorage.setItem("spy", "resources");
                }
                let newdid = document.querySelector('#tileDetails > div.detailImage > div > div:nth-child(2) > a').href.split('&z=')[1];
                window.location.assign(window.location.origin + "/build.php?newdid=" + SPY_VILLAGE + "&id=39&z=" + newdid + "&tt=2&gid=16");
                // firstTwoStepProcessSpy();

            };
            spyDiv.appendChild(hyperlinkSpy);

            if (isVillageOrOasis == 1) {
                let spyOptionsForm = document.createElement('form');
                spyOptionsForm.id = "spyOptions"
                spyOptionsForm.style.display = "inline-block";
                spyOptionsForm.style.marginLeft = "20px";

                let inputBoth = document.createElement("input")
                inputBoth.type = "radio";
                inputBoth.id = "inputBoth";
                inputBoth.name = "spyInput"
                inputBoth.style.display = "none";
                inputBoth.checked = "true"
                inputBoth.value = "both";
                inputBoth.onchange = function () {
                    if (this.checked) {
                        labelBoth.style.backgroundColor = "#99c01a";
                        labelResources.style.backgroundColor = "white";
                        labelTroops.style.backgroundColor = "white";
                    }
                }
                let inputResources = document.createElement("input")
                inputResources.type = "radio";
                inputResources.id = "inputResources";
                inputResources.name = "spyInput"
                inputResources.style.display = "none";
                inputResources.value = "resources"
                inputResources.onchange = function () {
                    if (this.checked) {
                        labelBoth.style.backgroundColor = "white";
                        labelResources.style.backgroundColor = "#99c01a";
                        labelTroops.style.backgroundColor = "white";
                    }
                }


                let inputTroops = document.createElement("input")
                inputTroops.type = "radio";
                inputTroops.id = "inputTroops";
                inputTroops.name = "spyInput";
                inputTroops.style.display = "none";
                inputTroops.value = "troops";
                inputTroops.onchange = function () {
                    if (this.checked) {
                        labelBoth.style.backgroundColor = "white";
                        labelResources.style.backgroundColor = "white";
                        labelTroops.style.backgroundColor = "#99c01a";
                    }
                }

                let labelBoth = document.createElement("label");
                labelBoth.htmlFor = "inputBoth"
                labelBoth.innerText = "Both";
                labelBoth.style.width = "auto"
                labelBoth.style.padding = "0px 10px"
                labelBoth.style.border = "solid 1px #ccc";
                labelBoth.style.transition = "all 0.3s"
                labelBoth.style.cursor = "pointer"
                labelBoth.style.fontSize = "x-small"
                labelBoth.style.fontWeight = "bold"
                labelBoth.style.backgroundColor = "#99c01a";

                let labelResources = document.createElement("label")
                labelResources.htmlFor = "inputResources"
                labelResources.innerText = "Resources"
                labelResources.style.width = "auto"
                labelResources.style.padding = "0px 10px"
                labelResources.style.border = "solid 1px #ccc";
                labelResources.style.transition = "all 0.3s"
                labelResources.style.cursor = "pointer"
                labelResources.style.fontSize = "x-small"
                labelResources.style.fontWeight = "bold"


                let labelTroops = document.createElement("label")
                labelTroops.htmlFor = "inputTroops"
                labelTroops.innerText = "Troops";
                labelTroops.style.width = "auto"
                labelTroops.style.padding = "0px 10px"
                labelTroops.style.border = "solid 1px #ccc";
                labelTroops.style.transition = "all 0.3s"
                labelTroops.style.cursor = "pointer"
                labelTroops.style.fontSize = "x-small"
                labelTroops.style.fontWeight = "bold"


                spyOptionsForm.appendChild(inputBoth)
                spyOptionsForm.appendChild(inputResources)
                spyOptionsForm.appendChild(inputTroops)
                spyOptionsForm.appendChild(labelBoth)
                spyOptionsForm.appendChild(labelResources)
                spyOptionsForm.appendChild(labelTroops)

                // let spySelect = document.createElement('select');
                // spySelect.id = "spySelectBox";
                // spySelect.appendChild(new Option('Both', 'both', false, false));
                // spySelect.appendChild(new Option('Resources', 'resources', false, false));
                // spySelect.appendChild(new Option('Troops', 'troops', false, false));
                // spySelect.style.marginLeft = "10px";
                // spySelect.style.height = "auto";

                spyDiv.appendChild(spyOptionsForm);
            }
            elementToAppend.insertBefore(spyDiv, elementToAppend.children[5]);

            // function firstTwoStepProcessSpy() {

            //     let tInputs = document.getElementsByTagName("INPUT");
            //     let t = '';
            //     var sParams = '';
            //     var cDescr = '';
            //     var needC = true;



            //     for( var i=0; i<tInputs.length; i++ ) {
            //         t = tInputs[i].name;
            //         if( /redeployHero/.test(t) ) {
            //             if( tInputs[i].checked ) {
            //                 sParams += "redeployHero=1&";
            //             }
            //         } else if ( /^t\d/.test(t) || /x|y/.test(t) ) {
            //             sParams += t + "=" + document.getElementsByName(t)[0].value + "&";
            //         } else if ( t == "c" ) {
            //             if ( needC ) {
            //                 var iAttackType = document.getElementsByName('c');
            //                 for (var q = 0; q < iAttackType.length; q++)
            //                     if( iAttackType[q].checked ) {
            //                         sParams += "c=" + (q+2) + "&";
            //                         cDescr = iAttackType[q].parentNode.textContent.trim();
            //                     }
            //                 needC = false;
            //             }
            //         } else {
            //             sParams += t + "=" + tInputs[i].value + "&";
            //         }
            //     }
            // }
        }

        function hasOasisButton(villageOrOasis) {
            if (villageOrOasis == 1) {
                let elementToAppend = document.querySelector("#tileDetails > div > div:nth-child(1)");

                let oasisDiv = document.createElement('div');
                oasisDiv.className = 'option';

                let hyperlinkOasis = document.createElement('a');
                hyperlinkOasis.onclick = function () {
                    hasOasis()
                };
                hyperlinkOasis.innerText = "Tem Oásis ?";
                hyperlinkOasis.id = "oasis";
                hyperlinkOasis.className = "a arrow";

                oasisDiv.appendChild(hyperlinkOasis);
                elementToAppend.insertBefore(oasisDiv, elementToAppend.children[5]);
            }

            function hasOasis() {
                let selectorHref = document.querySelector('#village_info > tbody > tr:nth-child(3) > td > a:nth-child(1)').href;
                let xhttp = new XMLHttpRequest();

                xhttp.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        let container = document.implementation.createHTMLDocument().documentElement;
                        container.innerHTML = xhttp.responseText;
                        let response = container.querySelectorAll('#villages > tbody > tr > td.oases.merged > i').length;
                        let element = document.querySelector("#oasis");
                        if (response == 0) {
                            element.style.color = "red";
                        }
                        else {
                            element.style.color = "green";
                            let hyperlinkOpen = document.createElement('a');
                            hyperlinkOpen.innerText = "  -> Abrir";
                            hyperlinkOpen.onclick = function () {
                                document.open();
                                document.write(xhttp.responseText);
                                document.close();
                            }
                            document.querySelector('#oasis').append(hyperlinkOpen);
                            let selector = container.querySelectorAll('#villages > tbody > tr > td.oases.merged > i');
                            for (let i = 0; i < selector.length; i++) {
                                console.log(selector[i].parentElement.parentElement.children[3].firstElementChild.href);
                            }
                        }
                    }
                }
                xhttp.open("GET", selectorHref, true);
                xhttp.send();
            }
        }
        //#######################################################//
    }

    function loadChangesInSession() {
        if (sessionStorage.hasOwnProperty("changedTroops")) {
            let array = JSON.parse(sessionStorage.getItem("changedTroops"));
            for (let element of array) {
                document.getElementById(element.id).firstElementChild.value = element.value;
            }
        }
    }

    function isVillageOrOasis() {
        if (document.body.contains(document.querySelector("#oasis2InstantTabs"))) {
            return 0; //is oasis
        }
        else if (document.querySelectorAll("#troop_info").length == 2) {
            return 0;
        }
        else {
            return 1; //is village
        }
    }

}

function addKeyVillageURL(keyName, href) {
    let url = villageCoordinatesFromHref(href);
    let currentVillages = JSON.parse(localStorage.getItem(keyName));

    if (currentVillages == null) {
        currentVillages = [];
    }

    currentVillages.push(url);
    let newURList = [...new Set(currentVillages)]
    localStorage.setItem(keyName, JSON.stringify(newURList));
}

function removeKeyVillageURL(keyName, href) {
    let url = villageCoordinatesFromHref(href);
    let currentURLs = JSON.parse(localStorage.getItem(keyName));

    if (currentURLs == null) {
        return;
    }

    let newListURL = currentURLs.filter(e => e !== url);
    if (newListURL.length == 0) {
        localStorage.removeItem(keyName);
    }
    else {
        localStorage.setItem(keyName, JSON.stringify(newListURL));
    }
}

function farmListsManager() {
    // localStorage.removeItem('autoAdjust');
    // localStorage.removeItem('done');

    if (COLAPSE_LIST == true) {
        for (let list of document.querySelectorAll('.switchOpened')) {
            list.click();
        }
    }

    farmingElementsDesigner();
    // if (sessionStorage.getItem("sendLists")) {
    //     document.querySelector("#farmListsSender").style.background = "#62da57";
    //     autoSendFarmLists();
    // }

    function farmingElementsDesigner() {

        topPageButtons();
        farmingButtons();
        farmingOptionsChecklists();

        function topPageButtons() {
            let parentDiv = document.createElement('div');
            parentDiv.style.marginBottom = "8px";
            parentDiv.style.marginTop = "-10px";

            let divAutoAdjustsFarmLists = document.createElement('div');
            divAutoAdjustsFarmLists.title = "Auto adjust farm lists";
            divAutoAdjustsFarmLists.innerText = "AL";
            divAutoAdjustsFarmLists.id = "autoAdjustFarmLists"
            // STYLE //
            divAutoAdjustsFarmLists.style.cursor = "pointer";
            divAutoAdjustsFarmLists.style.height = "25px";
            divAutoAdjustsFarmLists.style.width = "25px";
            divAutoAdjustsFarmLists.style.display = "inline-block";
            divAutoAdjustsFarmLists.style.textAlign = "center";
            divAutoAdjustsFarmLists.style.verticalAlign = "middle";
            divAutoAdjustsFarmLists.style.lineHeight = "25px";
            divAutoAdjustsFarmLists.style.borderRadius = "50%";
            divAutoAdjustsFarmLists.style.background = "#E0EBDF"
            divAutoAdjustsFarmLists.style.border = "1px solid #666";
            divAutoAdjustsFarmLists.style.color = "#666";
            divAutoAdjustsFarmLists.onclick = function () {
                this.style.background = "#62da57";
                autoAdjustLists()
            };

            let divEmptyFarms = document.createElement('div');
            divEmptyFarms.title = "Show EMPTY farms (open browser console)";
            divEmptyFarms.innerText = "EF";
            divEmptyFarms.id = "emptyFarms"
            // STYLE //
            divEmptyFarms.style.cursor = "pointer";
            divEmptyFarms.style.height = "25px";
            divEmptyFarms.style.width = "25px";
            divEmptyFarms.style.display = "inline-block";
            divEmptyFarms.style.textAlign = "center";
            divEmptyFarms.style.verticalAlign = "middle";
            divEmptyFarms.style.lineHeight = "25px";
            divEmptyFarms.style.borderRadius = "50%";
            divEmptyFarms.style.background = "#E0EBDF"
            divEmptyFarms.style.border = "1px solid #666";
            divEmptyFarms.style.color = "#666";
            divEmptyFarms.style.marginLeft = "5px";
            divEmptyFarms.onclick = function () {
                this.style.background = "#62da57";
                emptyFarms()
            };

            let divFullFarms = document.createElement('div');
            divFullFarms.title = "Show FULL farms (open browser console)";
            divFullFarms.innerText = "FF";
            divFullFarms.id = "fullFarms"
            // STYLE //1
            divFullFarms.style.cursor = "pointer";
            divFullFarms.style.height = "25px";
            divFullFarms.style.width = "25px";
            divFullFarms.style.display = "inline-block";
            divFullFarms.style.textAlign = "center";
            divFullFarms.style.verticalAlign = "middle";
            divFullFarms.style.lineHeight = "25px";
            divFullFarms.style.borderRadius = "50%";
            divFullFarms.style.background = "#E0EBDF"
            divFullFarms.style.border = "1px solid #666";
            divFullFarms.style.color = "#666";
            divFullFarms.style.marginLeft = "5px";
            divFullFarms.onclick = function () {
                this.style.background = "#62da57";
                fullFarms();
            };

            let divFarmListsSender = document.createElement('div');
            divFarmListsSender.title = "Auto send farm lists";
            divFarmListsSender.innerText = "SL";
            divFarmListsSender.id = "farmListsSender"
            // STYLE //
            divFarmListsSender.style.cursor = "pointer";
            divFarmListsSender.style.height = "25px";
            divFarmListsSender.style.width = "25px";
            divFarmListsSender.style.display = "inline-block";
            divFarmListsSender.style.float = "right";
            divFarmListsSender.style.textAlign = "center";
            divFarmListsSender.style.verticalAlign = "middle";
            divFarmListsSender.style.lineHeight = "25px";
            divFarmListsSender.style.borderRadius = "50%";
            divFarmListsSender.style.background = "#E0EBDF"
            divFarmListsSender.style.border = "1px solid #666";
            divFarmListsSender.style.color = "#666";
            divFarmListsSender.style.marginRight = "15px";
            divFarmListsSender.onclick = function () {
                this.style.background = "#62da57";
                autoSendFarmLists()
            };

            let divAdjustListsDistances = document.createElement('div');
            divAdjustListsDistances.title = "Adjust lists distances";
            divAdjustListsDistances.innerText = "AD";
            divAdjustListsDistances.id = "adjustListsDistances"
            // STYLE //
            divAdjustListsDistances.style.cursor = "pointer";
            divAdjustListsDistances.style.height = "25px";
            divAdjustListsDistances.style.width = "25px";
            divAdjustListsDistances.style.display = "inline-block";
            divAdjustListsDistances.style.textAlign = "center";
            divAdjustListsDistances.style.verticalAlign = "middle";
            divAdjustListsDistances.style.lineHeight = "25px";
            divAdjustListsDistances.style.borderRadius = "50%";
            divAdjustListsDistances.style.background = "#E0EBDF"
            divAdjustListsDistances.style.border = "1px solid #666";
            divAdjustListsDistances.style.color = "#666";
            divAdjustListsDistances.style.marginLeft = "5px";
            divAdjustListsDistances.onclick = function () {
                this.style.background = "#62da57";
                autoAdjustListDistances();
            };

            let divAdjustListsNames = document.createElement('div');
            divAdjustListsNames.title = "Adjust lists names";
            divAdjustListsNames.innerText = "AN";
            divAdjustListsNames.id = "adjustListsNames"
            // STYLE //1
            divAdjustListsNames.style.cursor = "pointer";
            divAdjustListsNames.style.height = "25px";
            divAdjustListsNames.style.width = "25px";
            divAdjustListsNames.style.display = "inline-block";
            divAdjustListsNames.style.textAlign = "center";
            divAdjustListsNames.style.verticalAlign = "middle";
            divAdjustListsNames.style.lineHeight = "25px";
            divAdjustListsNames.style.borderRadius = "50%";
            divAdjustListsNames.style.background = "#E0EBDF"
            divAdjustListsNames.style.border = "1px solid #666";
            divAdjustListsNames.style.color = "#666";
            divAdjustListsNames.style.marginLeft = "5px";
            divAdjustListsNames.onclick = function () {
                this.style.background = "#62da57";
                autoAdjustListNames()
            };

            let selectedElement = document.querySelector('#build');
            parentDiv.append(divAutoAdjustsFarmLists);
            parentDiv.append(divEmptyFarms);
            parentDiv.append(divFullFarms);
            parentDiv.append(divFarmListsSender);
            parentDiv.append(divAdjustListsDistances);
            parentDiv.append(divAdjustListsNames);

            selectedElement.insertBefore(parentDiv, selectedElement.firstChild);
        }

        function farmingButtons() {
            let appendableElements = document.querySelectorAll("div.raidListTitleButtons");

            for (let i = 0; i < appendableElements.length; i++) {
                let button = document.createElement('button');
                button.className = "farmListsSender"
                button.type = "button";
                button.style.backgroundColor = "green";
                button.style.float = "right";
                button.style.width = "24px";
                button.style.height = "24px";
                button.style.marginLeft = "2px";
                button.style.borderRadius = "50%";
                button.style.border = "2px solid white";
                button.style.gridColumnStart = "5";
                button.onclick = async function () {
                    this.parentElement.parentElement.style.backgroundColor = "#62da57";
                    let listID = this.parentElement.parentElement.parentElement.parentElement.id;
                    
                    //Farm sem losses
                    if (this.parentElement.parentElement.querySelector("input.noLossesFarms").checked == true) {
                        markOnlyFarmsWithNoLosses(this);
                    } else {
                        let markAllInputSelector = "#" + listID + " > form > div.listContent > div.detail > div.markAll > input[type=checkbox]:nth-child(1)";
                        if (await waitForElement(markAllInputSelector) == false) return;;
                        document.querySelector(markAllInputSelector).click();
                    }
                    await sleep(750, 1000);

                    var form = document.querySelector("#" + listID + " > form")
                    
                    if(nextA != 0) {
                        form.querySelector('input[type=hidden]:nth-child(2)').value = nextA;
                    }

                    var data = new URLSearchParams(new FormData(form)).toString()

                    let xhttp = new XMLHttpRequest();  
                    xhttp.open('POST', SERVER_URL + '/build.php?gid=16&tt=99', false);
                    xhttp.setRequestHeader("accept", 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9')
                    xhttp.setRequestHeader("accept-language", "en,pt;q=0.9,pt-PT;q=0.8,en-US;q=0.7")
                    xhttp.setRequestHeader("cache-control", "max-age=0")
                    xhttp.setRequestHeader("content-type", 'application/x-www-form-urlencoded')
                    // xhttp.setRequestHeader("sec-fetch-dest", "document")
                    // xhttp.setRequestHeader("sec-fetch-mode", "navigate")
                    // xhttp.setRequestHeader("sec-fetch-site", "same-origin")
                    // xhttp.setRequestHeader("sec-fetch-user", "?1")
                    xhttp.setRequestHeader("upgrade-insecure-requests", "1")
                    xhttp.send(data);

                    if (xhttp.readyState === 4 && xhttp.status == 200) {
                        this.parentElement.parentElement.style.backgroundColor = "#e0ebdf";

                        let container = document.implementation.createHTMLDocument().documentElement;
                        container.innerHTML = xhttp.responseText;
                        nextA = container.querySelector("form > input[type=hidden]:nth-child(2)").value
                    }

                }
                appendableElements[i].appendChild(button);
            }

            function markOnlyFarmsWithNoLosses(elem) {
                let slotRows = elem.parentElement.parentElement.parentElement.querySelectorAll("tr.slotRow");
                for (let slot of slotRows) {
                    if (slot.querySelector("img.iReport.iReport1") != null) {
                        slot.querySelector("input.markSlot.check").click();
                    }
                }
            }
        }

        function farmingOptionsChecklists() {

            let appendableElements = document.querySelectorAll("div.round.listTitle > div.listTitleText");

            for (let i = 0; i < appendableElements.length; i++) {
                let div = document.createElement("div")
                div.style.display = "inline-block";
                div.style.verticalAlign = "top";
                div.style.marginLeft = "10px";

                let input = document.createElement("input");
                input.title = "Active farmlist ?";
                input.className = "activeFarmList";

                let input1 = document.createElement("input");
                input1.style.marginLeft = "10px";
                input1.title = "Only no-loss farms ?";
                input1.className = "noLossesFarms";

                let inputs = []
                inputs.push(input, input1)
                inputs.forEach(element => {
                    element.type = "checkbox";
                    element.style.borderRadius = "50%";
                    element.onclick = function (event) {
                        if (event.shiftKey) {
                            multipleSelection(this, element.className, "shift");
                        }
                        else if (event.ctrlKey) {
                            multipleSelection(this, element.className, "ctrl");
                        }
                        saveInputsLocalStorage(element.className)
                    }
                    element.checked = isInputSelected(element.className, i);
                    div.appendChild(element);
                });

                appendableElements[i].append(div)
            }

            function isInputSelected(parameterName, index) {

                if (localStorage.getItem(parameterName) === null) {
                    return true;
                }

                let storedInputs = JSON.parse(localStorage.getItem(parameterName));
                for (let i = 0; i < storedInputs.length; i++) {
                    if (index == storedInputs[i]) {
                        return true;
                    }
                }
                return false;
            }

            function saveInputsLocalStorage(parameterName) {
                let inputs = document.querySelectorAll("." + parameterName);
                let strToSave = [];
                for (let i = 0; i < inputs.length; i++) {
                    if (inputs[i].checked)
                        strToSave.push(i);
                }
                localStorage.setItem(parameterName, JSON.stringify(strToSave));
            }

            function multipleSelection(element, className, key) {
                let activeElement = document.activeElement;
                if (activeElement.className == className) {
                    let checkboxs = document.getElementsByClassName(className);
                    let initialIndex = ([].slice.call(checkboxs)).indexOf(element);
                    if (key == "shift") {
                        for (let i = 0; i < initialIndex; i++) {
                            if (element.checked == true) {
                                checkboxs[i].checked = true;
                            }
                            else {
                                checkboxs[i].checked = false;
                            }
                        }
                    }
                    else {
                        for (let i = initialIndex; i < checkboxs.length; i++) {
                            if (element.checked == true) {
                                checkboxs[i].checked = true;
                            }
                            else {
                                checkboxs[i].checked = false;
                            }
                        }
                    }

                }
            }
        }
    }

    async function autoAdjustLists() {
        let villageHyperlink = document.querySelectorAll("td.village > a");
        let villageHrefs = [];

        for (let i = 0; i < villageHyperlink.length; i++) {
            if (villageHyperlink[i].innerText.includes("Natares") == false) {
                villageHrefs.push(villageHyperlink[i].href);
            }
        }
        let noRepeatedHrefs = [...new Set(villageHrefs)]

        // for(let i = 108; i < noRepeatedHrefs.length; i++) {
        for (let i = 0; i < noRepeatedHrefs.length; i++) {
            localStorage.setItem("aux", i)
            let container = await httpRequestToVillage(noRepeatedHrefs[i]);
            console.log("[" + (i + 1) + "/" + noRepeatedHrefs.length + "] " + container.querySelector("#tileDetails > h1").innerText)
            containerParser(container);
            await decisionMaker(noRepeatedHrefs[i]);
        }

        async function httpRequestToVillage(href) {
            let container = xhttpRequest(href, "GET");

            if (container == null) {
                console.log("An error has ocurred!");
                return null;
            }
            return container;
        }

        async function decisionMaker(href) {

            let unparsedFarmCoordinates = villageCoordinatesFromHref(href);
            let farmX = Number(unparsedFarmCoordinates.split('&y=')[0].split("x=")[1]);
            let farmY = Number(unparsedFarmCoordinates.split('y=')[1]);

            for (let list of farmLists) {

                let myVillageX = Number(list.villageCoordinates.split("|")[0]);
                let myVillageY = Number(list.villageCoordinates.split("|")[1]);
                // if(isNaN(farmX) || isNaN(farmY)){
                //     continue;
                // }

                let distance = calculateEuclideanDistance(myVillageX, myVillageY, farmX, farmY);
                if (distance >= list.minDistance && distance < list.maxDistance) {
                    let listEntries = document.querySelectorAll(".listEntry");

                    let index = -1;
                    let id;
                    for (let i = 0; i < listEntries.length; i++) {
                        id = Number(listEntries[i].id.replace("list", ""))
                        if (list.id == id) {
                            index = i;
                            break;
                        }
                    }

                    if (index == -1) {
                        console.log("Error");
                        return;
                    }

                    let slotRows = document.querySelectorAll("#list" + id + " .slotRow");
                    let found = false;
                    for (let slotRow of slotRows) {
                        if (slotRows[0].childElementCount == 1) {
                            break;
                        }

                        if (slotRow.querySelector("td.village > a").href == href) {
                            found = true;
                            await editTroopAmmount(slotRow, list.id, farmX, farmY);
                            break;
                        }
                    }

                    if (found == false) {
                        let form = document.querySelector("#list" + id + " form");;
                        await addNewTroopToFarm(form, list.troopName, farmX, farmY, list.id);
                    }
                    await sleep(750, 1500);
                    // await sleep(250, 750);
                }
                else {
                    await sleep(250, 500);
                    // await sleep(100, 250);
                }
            }
        }



        async function editTroopAmmount(slotRow, listID, x, y) {

            let troopName = slotRow.querySelector("td.troops > div > img").alt;
            let troopAmmount = Number(slotRow.querySelector("td.troops > div > span").innerText);

            let selectedTroop;
            ammountOfTroops.forEach(function (troop) {
                if (troop.name == troopName) {
                    selectedTroop = troop;
                }
            })

            if (selectedTroop.ammount == troopAmmount || selectedTroop.ammount == 0) {
                return;
            }

            let index = selectedTroop.id;
            let troopNumber = selectedTroop.ammount;
            let troopNumbers = []
                for(let i = 1; i <= 10; i++) {
                    if(i == index) {
                        troopNumbers.push(troopNumber.toString())
                    }
                    else {
                        troopNumbers.push("0")
                    }
                }

                let body = {
                    cmd: "raidList",
                    listId: `${listID}`,
                    method: "ActionAddSlot",
                    slots: [Number(slotRow.id.replace("slot-row-", ""))],
                    t1: troopNumbers[0],
                    t2: troopNumbers[1],
                    t3: troopNumbers[2],
                    t4: troopNumbers[3],
                    t5: troopNumbers[4],
                    t6: troopNumbers[5],
                    t7: troopNumbers[6],
                    t8: troopNumbers[7],
                    t9: troopNumbers[8],
                    t10: troopNumbers[9],
                    x: `${x}`,
                    y: `${y}`
                }
                body = JSON.stringify(body)

                let xhttp = new XMLHttpRequest();  
                xhttp.open('POST', SERVER_URL + '/api/v1/ajax', false);
                xhttp.setRequestHeader('Content-Type', 'application/json; charset=UTF-8')
                xhttp.setRequestHeader("authorization", `Bearer ${Travian.PolandHaneySlavered}`)
                xhttp.send(body);

                if (xhttp.readyState === 4 && xhttp.status == 200) {
                    console.log(xhttp.responseText)
                }

            // await removeOverlayingErrors();
            // slotRow.querySelector("td.action > a").click();
            // if (await waitForElement("#raidListSlot") == false) return;;

            // document.querySelector("#t" + selectedTroop.id).value = selectedTroop.ammount;
            // await sleep(750, 1500)
            // document.querySelector("#save").click();
        }

        async function addNewTroopToFarm(form, troopName, farmX, farmY, listID) {
            let selectedTroop;
            ammountOfTroops.forEach(function (troop) {
                if (troop.name == troopName) {
                    selectedTroop = troop;
                }
            })

            let index = selectedTroop.id;
            let troopNumber = selectedTroop.ammount;

            let troopNumbers = []
                for(let i = 1; i <= 10; i++) {
                    if(i == index) {
                        troopNumbers.push(troopNumber.toString)
                    }
                    else {
                        troopNumbers.push("0")
                    }
                }

                let body = {
                    cmd: "raidList",
                    listId: `${listID}`,
                    method: "ActionAddSlot",
                    slots: [Number(slotRow.id.replace("slot-row-", ""))],
                    t1: troopNumbers[0],
                    t2: troopNumbers[1],
                    t3: troopNumbers[2],
                    t4: troopNumbers[3],
                    t5: troopNumbers[4],
                    t6: troopNumbers[5],
                    t7: troopNumbers[6],
                    t8: troopNumbers[7],
                    t9: troopNumbers[8],
                    t10: troopNumbers[9],
                    x: `${farmX}`,
                    y: `${farmY}`
                }
                body = JSON.stringify(body)

                let xhttp = new XMLHttpRequest();  
                xhttp.open('POST', SERVER_URL + '/api/v1/ajax', false);
                xhttp.setRequestHeader('Content-Type', 'application/json; charset=UTF-8')
                xhttp.setRequestHeader("authorization", `Bearer ${Travian.PolandHaneySlavered}`)
                xhttp.send(body);

                if (xhttp.readyState === 4 && xhttp.status == 200) {
                    console.log(xhttp.responseText)
                }

            // form.querySelector("div.addSlot button").click();
            // if (await waitForElement("#raidListSlot") == false) return;;
            // var array = document.getElementsByClassName('text troop');
            // document.querySelector("#xCoordInput").value = farmX;
            // document.querySelector("#yCoordInput").value = farmY;
            // await sleep(500, 1000);
            // array[selectedTroop.id - 1].value = selectedTroop.ammount;
            // await sleep(750, 1500);
            // document.querySelector('#save').click();

            console.log("[INFO] Added " + troopName);
        }

        function containerParser(container) {

            let ammountFullBountyRaids = container.querySelectorAll(".full").length;
            let ammountEmptyRaids = container.querySelectorAll(".empty").length;
            let ammountHalfBountyRaids = container.querySelectorAll(".half").length;

            let ammountRaids = ammountFullBountyRaids + ammountEmptyRaids + ammountHalfBountyRaids;
            if (ammountRaids == 0) {
                ammountOfTroops.forEach(function (troop) {
                    troop.ammount = 0;
                });
                return;
            }
            troopsOptimalAlgorithm(ammountRaids, ammountFullBountyRaids, ammountEmptyRaids, container)
        }

        function troopsOptimalAlgorithm(ammountRaids, ammountFullBountyRaids, ammountEmptyRaids, container) {

            let uparsedResourcesAmmountArray = [];
            for (let i = 1; i <= ammountRaids; i++) {
                let unparsedQuantidadeRecursos = container.querySelector('#troop_info > tbody > tr:nth-child(' + i + ') > td > a:nth-child(3) > img');
                if (unparsedQuantidadeRecursos == undefined) {
                    uparsedResourcesAmmountArray.push("0/0");
                } else {
                    uparsedResourcesAmmountArray.push(unparsedQuantidadeRecursos.alt);
                }
            }

            let sumBountiesRaided = 0;
            let maxBountyRaided = 0;

            for (let i = 0; i < uparsedResourcesAmmountArray.length; i++) {
                let parsedRecursos = Number(uparsedResourcesAmmountArray[i].split('/')[0]);
                if (parsedRecursos > maxBountyRaided) {
                    maxBountyRaided = parsedRecursos;
                }
                sumBountiesRaided += parsedRecursos;
            }

            let avgResources = sumBountiesRaided / uparsedResourcesAmmountArray.length;
            let optimalNumber = (avgResources + maxBountyRaided) / 2;

            if (ammountFullBountyRaids >= 3) {
                if (ammountFullBountyRaids == 5) {
                    optimalNumber *= 2;
                } else if (ammountFullBountyRaids == 4) {
                    optimalNumber *= 1.75;
                } else {
                    optimalNumber *= 1.5;
                }
            } else if (ammountEmptyRaids >= 4) {
                //nao sei se falta meter tudo a 0
                return;
            }

            console.log("Max: " + maxBountyRaided + "; Media: " + avgResources + "; Num Otimo: " + optimalNumber);

            for (let i = 0; i < farmingTroops.length; i++) {
                let adjustedTroopNumber = Math.round(optimalNumber / farmingTroops[i].capacity);
                if (adjustedTroopNumber > 20) {
                    ammountOfTroops[i].ammount = Math.ceil(adjustedTroopNumber / 5) * 5;
                }
                else {
                    ammountOfTroops[i].ammount = getNearestAdmissibleTroopAmmountToFarm(adjustedTroopNumber);
                }
            }
        }
    }

    function emptyFarms() {
        let elementsArray = [];
        let selectedRows = document.querySelectorAll(".slotRow");

        for (let i = 0; i < selectedRows.length; i++) {
            let bountyImage = selectedRows[i].querySelector("td.lastRaid > img:nth-child(2)");
            if (bountyImage == null) { continue; }
            if (bountyImage.className == "carry empty") {
                elementsArray.push(selectedRows[i]);
            }
        }

        parseURLs(elementsArray);


        function parseURLs(elements) {
            urlArray = []
            for (let i = 0; i < elements.length; i++) {
                let url = elements[i].querySelector("td.village > a").href;
                urlArray.push(url);
            }
            analyzeEmptyFarms([...new Set(urlArray)])
        }

        async function analyzeEmptyFarms(urlList) {
            for (let i = 0; i < urlList.length; i++) {
                console.log("[" + (i + 1) + "/" + urlList.length + "]");

                let container = xhttpRequest(urlList[i], "GET");
                if (container == null) {
                    console.log("An error has ocurred!");
                    continue;
                }

                let emptyBountiesLength = container.querySelectorAll('.empty').length;
                if (emptyBountiesLength > 4) {
                    console.log("%cEmpty %c" + urlList[i], "color:green", "color:black");
                } else {
                    console.log("%cFalse positive", "color: red");
                }
                await sleep(3000, 5000);
            }

            console.log("End of analysis");
            document.querySelector("#emptyFarms").style.backgroundColor = "#E0EBDF";
        }
    }

    function fullFarms() {
        let elementsArray = [];
        let selectedRows = document.querySelectorAll(".slotRow");

        for (let i = 0; i < selectedRows.length; i++) {
            let bountyImage = selectedRows[i].querySelector("td.lastRaid > img:nth-child(2)");
            if (bountyImage == null) { continue; }
            if (bountyImage.className == "carry full") {
                elementsArray.push(selectedRows[i]);
            }
        }

        parseURLs(elementsArray);

        function parseURLs(elements) {
            urlArray = []
            for (let i = 0; i < elements.length; i++) {
                let url = elements[i].querySelector("td.village > a").href;
                urlArray.push(url);
            }
            analyzeFullFarms([...new Set(urlArray)])
        }

        async function analyzeFullFarms(urlList) {
            for (let i = 0; i < urlList.length; i++) {
                console.log("[" + (i + 1) + "/" + urlList.length + "]");

                let container = xhttpRequest(urlList[i], "GET");
                if (container == null) {
                    console.log("An error has ocurred!");
                    continue;
                }

                let fullBountiesLength = container.querySelectorAll('.full').length;
                if (fullBountiesLength > 3) {
                    console.log("%cFull %c" + urlList[i], "color:green", "color:black");
                } else {
                    console.log("%cFalse positive", "color: red");
                }
                await sleep(3000, 5000);
            }

            console.log("End of analysis");
            document.querySelector("#fullFarms").style.backgroundColor = "#E0EBDF";
        }
    }

    async function autoSendFarmLists() {

        const sendListButtons = document.querySelectorAll('.farmListsSender')
        document.querySelector("#farmListsSender").style.backgroundColor = "#E0EBDF"
        for(let i = 0; i < sendListButtons.length; i++){
            sendListButtons[i].click();

            await sleep(2000, 4000)
        }
        // Quando se carrega no botão
        // if (!sessionStorage.hasOwnProperty("sendLists")) {
        //     sessionStorage.setItem("sendLists", "0");
        // }

        // let currentSendingList = Number(sessionStorage.getItem("sendLists"));
        // let listButtonsRaid = document.querySelectorAll(".farmListsSender");

        // if (currentSendingList + 1 == listButtonsRaid.length + 1) {
        //     document.querySelector("#farmListsSender").style.backgroundColor = "#E0EBDF"
        //     sessionStorage.removeItem("sendLists");
        //     return;
        // }

        // let activeLists = document.querySelectorAll(".activeFarmList");
        // let isActive = activeLists[currentSendingList].checked;

        // if (isActive) {
        //     listButtonsRaid[currentSendingList].click();
        // }
        // currentSendingList += 1;
        // sessionStorage.setItem("sendLists", currentSendingList);

        // if (!isActive) {
        //     autoSendFarmLists();
        // }
    }

    async function autoAdjustListDistances() {

        for (let list of farmLists) {
            let slotRows = document.querySelectorAll("#list" + list.id + " tr.slotRow");
            for (let slotRow of slotRows) {
                if (slotRow.childElementCount == 1) {
                    continue;
                }
                let parsedDistance = Number(slotRow.querySelector("td.distance").innerText);
                if ((parsedDistance < list.minDistance || parsedDistance >= list.maxDistance) && list.isNatar == false) {
                    if (await checkIfItIsRepeated(slotRow, list) == 1) {
                        await performAdjust(slotRow, parsedDistance, list);
                    }
                }
            }
        }

        document.querySelector("#adjustListsDistances").style.backgroundColor = "#E0EBDF";

        async function checkIfItIsRepeated(slotRow, list) {
            for (let farmList of farmLists) {
                if (list.id == farmList.id) {
                    continue;
                }
                if (farmList.villageCoordinates == list.villageCoordinates && farmList.troopName == list.troopName) {
                    let slotRows = document.querySelectorAll("#list" + farmList.id + " tr.slotRow");
                    for (let novelSlotRow of slotRows) {
                        if (slotRow.querySelector("td.village > a").href == novelSlotRow.querySelector("td.village > a").href) {
                            await removeOverlayingErrors()
                            slotRow.querySelector("td.action > a").click();
                            if (await waitForElement("#raidListSlot") == false) return;;
                            await sleep(600, 800);
                            document.querySelector('#delete').click();
                            await sleep(250, 300)
                            document.querySelector("div.dialog-contents > form > div.buttons > button").click();
                            await sleep(750, 1500)
                            return 0;
                        }
                    }
                }
            }
            return 1;

        }

        async function performAdjust(slotRow, parsedDistance, list) {
            for (let farmList of farmLists) {
                if (farmList.villageCoordinates == list.villageCoordinates && farmList.troopID == list.troopID) {
                    if (parsedDistance >= farmList.minDistance && parsedDistance < farmList.maxDistance) {
                        await removeOverlayingErrors()
                        slotRow.querySelector("td.action > a").click();
                        if (await waitForElement("#raidListSlot") == false) return;;
                        document.querySelector('#lid').value = farmList.id;
                        document.querySelector('#lid').onchange();
                        await sleep(600, 800);
                        document.querySelector('#save').click();
                        await sleep(1000, 2000)
                        break;
                    }
                }
            }
        }
    }

    async function autoAdjustListNames() {
        for (let list of farmLists) {
            let listName = document.querySelector("#list" + list.id + " > form > div.round.listTitle > div.listTitleText").innerText;
            if (listName.includes("Natares")) {
                continue
            }
            let troopName = listName.split("-")[1].split("[")[0].slice(1, -1);
            let listDistances = listName.split("[")[1].split("-");
            let minDistance = Number(listDistances[0]);
            let maxDistance = Number(listDistances[1].slice(0, -2));

            if (list.troopName != troopName || list.minDistance != minDistance || list.maxDistance != maxDistance) {
                document.querySelector("#list" + list.id + " #updateRaidList" + list.id).click();
                if (await waitForElement("#raidListCreate") == false) return;;
                document.querySelector("#name").value = list.troopName + " [" + ("000" + list.minDistance).substr(-3) + "-" + ('000' + list.maxDistance).substr(-3) + "]";
                document.querySelector("#raidListCreate form > button").click();
                return;
            }
        }
        document.querySelector("#adjustListsNames").style.backgroundColor = "#E0EBDF";
    }
}

function MandarTropasEmboraUI() {

    if (localStorage.getItem('embora')) {
        MandarEmbora();
    }

    var elementSelector = document.querySelector('#build > div.data');
    var aEmbora = document.createElement('a');
    aEmbora.innerText = "Mandar Tudo Embora";
    aEmbora.onclick = function () {
        MandarEmbora();
        localStorage.setItem('embora', "true")
    };
    elementSelector.insertBefore(aEmbora, elementSelector.firstChild);

    async function MandarEmbora() {

        var devolver = document.getElementsByClassName('arrow');
        if (devolver) {
            devolver[0].click();
            await sleep(500, 1000)
        } else {
            localStorage.removeItem('embora');
        }
    }
}

function reportsManager(currentURL) {

    if (currentURL.includes("t=2") ||
        currentURL.includes("t=4") ||
        currentURL.includes("t=5") ||
        currentURL.includes("t=6")) {
        ;
    } else if (currentURL.includes("t=3")) {
        selectSpyReports();
    } else {
        // infoDesigner();
        reportsEfficiency();
        selectRepeatedVillageReports();
    }
}

// function infoDesigner() {
//     let img = document.createElement("img");
//     img.src = infoIconBase64;
//     img.style.display = "block"
//     document.querySelector("#reportsForm > div:nth-child(6)").appendChild(img)
// }

function reportsEfficiency() {

    let textAppender = document.querySelector('#overview > thead > tr > th:nth-child(1)');
    if (document.body.contains(textAppender) == false || document.querySelectorAll("#overview > tbody > tr").length == 1) {
        return;
    }

    let soma = 0;
    let array = document.querySelectorAll('img.reportInfo.carry');

    for (let i = 0; i < array.length; i++) {
        let str = array[i].alt.split("/");
        if (str != undefined && str.length > 1)
            soma += Number(str[0]) / Number(str[1].replace(/\D/g, '')) * 100;
    }
    let average = Math.round(soma / array.length);
    if (isNaN(average)) {
        average = 0;
    }

    textAppender.innerText = "Aproveitamento: " + average + "%";
    // let img = document.createElement("img");
    //     img.src = infoIconBase64;
    //     img.style.display = "inline-block";
    //     img.style.marginLeft = "10px";
    // img.style.verticalAlign = "middle";

    // element.style {
    //     left: 838px;
    //     top: 469px;
    // }
    // <style>
    // div#hbymttlt {
    //     position: absolute;
    //     z-index: 10000;
    //     border: 1px solid silver;
    //     text-align: center;
    //     background-color: #FFFFE0;
    // }

    // textAppender.appendChild(img)
}


function selectRepeatedVillageReports() {
    let reportsEntries = document.querySelectorAll("#overview > tbody > tr")
    let reportsEntriesA = document.querySelectorAll("#overview > tbody > tr > td.sub > div > a")

    if (reportsEntries.length == 1 && reportsEntries[0].childElementCount == 1) {
        return;
    }

    for (let reportEntry of reportsEntries) {
        reportEntry.querySelector(".check").onclick = function () {
            if (event.ctrlKey) {
                let it = reportEntry.querySelector("td.sub > div > a").innerText;
                let villageName;
                if (it.split("assalta").length == 2) {
                    villageName = it.split(" assalta ")[1]
                }
                else {
                    villageName = it.split(" ataca ")[1]
                }

                reportEntry.querySelector(".check").click();
                for (let otherReports of reportsEntriesA) {
                    if (otherReports.innerText.includes(villageName)) {
                        otherReports.parentElement.parentElement.parentElement.querySelector(".check").click();
                    }
                }
            }
        }
    }
}

// function QuarteisUI() {

//     let selector = document.querySelectorAll('div.action.troop > div > div.details > div.tit > span')
//     let tempos = document.querySelectorAll('div.action.troop > div > div.details > div.inlineIcon.duration > span')
//     for (let i = 0; i < selector.length; i++) {
//         let auxTempo = tempos[i].innerText.split(':');
//         let seconds = (+auxTempo[0]) * 60 * 60 + (+auxTempo[1]) * 60 + (+auxTempo[2]);
//         selector[i].innerText += " ----> Por Hora: " + Math.round(3600 / seconds);
//     }
// }

function incomingAttacksManager() {

    let attackRows = document.querySelectorAll('td.troopHeadline');

    for (let i = 0; i < attackRows.length; i++) {
        let a = document.createElement('a');
        a.innerText = " -> Analisar ataque";
        a.style.color = "red";
        a.onclick = function () {
            this.style.color = "yellow";
            let attackDate = getAttackTime(this);
            AjaxPositionDetails(this, attackDate);
        }
        attackRows[i].append(a);
    }

    function getAttackTime(elem) {

        let serverDate = document.querySelector('#servertime > span.timer').innerText.split(":");

        let svDateObject = new Date();
        svDateObject.setHours(serverDate[0]);
        svDateObject.setMinutes(serverDate[1]);
        svDateObject.setSeconds(serverDate[2]);

        let remainingTimeUntilAttack = elem.parentElement.parentElement.parentElement.parentElement.lastElementChild.querySelector('div.in > span').innerText.split(":");
        let attackDate = svDateObject;

        attackDate.setHours(svDateObject.getHours() + Number(remainingTimeUntilAttack[0]));
        attackDate.setMinutes(svDateObject.getMinutes() + Number(remainingTimeUntilAttack[1]));
        attackDate.setSeconds(svDateObject.getSeconds() + Number(remainingTimeUntilAttack[2]));

        let month = "" + (attackDate.getMonth() + 1);
        if (month.length == 1) {
            month = "0" + month;
        }
        let day = "" + attackDate.getDate();
        if (day.length == 1) {
            day = "0" + day;
        }
        let hour = "" + attackDate.getHours();
        if (hour.length == 1) {
            hour = "0" + hour;
        }
        let minute = "" + attackDate.getMinutes();
        if (minute.length == 1) {
            minute = "0" + minute;
        }
        let second = "" + attackDate.getSeconds();
        if (second.length == 1) {
            second = "0" + second;
        }

        return day + "/" + month + " " + hour + ":" + minute + ":" + second;
    }

    async function AjaxPositionDetails(element, attackDate) {

        let selectorHref = element.parentElement.parentElement.querySelector('td.role > a').href;
        let container = await xhttpRequest(selectorHref, "GET");
        if (container == null) {
            console.log("An error has ocurred!")
            return;
        }
        let playerName = container.querySelector('#village_info > tbody > tr:nth-child(3) > td > a').innerText;
        let hrefPlayer = container.querySelector('#village_info > tbody > tr:nth-child(3) > td > a').href;
        playerPageAjax(element, attackDate, playerName, hrefPlayer);
    }

    async function playerPageAjax(element, attackDate, playerName, hrefPlayer) {

        let container = await xhttpRequest(hrefPlayer, "GET");
        if (container == null) {
            console.log("An error has ocurred!")
            return;
        }
        let heroSource = container.querySelector('#content > img').src;
        let heroCode = heroSource.split("/hero_body.php?code=")[1];
        heroCode = heroCode.replace("&size=profile", "");
        playerStatsAjax(element, attackDate, playerName, heroCode);
    }

    async function playerStatsAjax(element, attackDate, playerName, heroCode) {

        let url = "statistiken.php?id=3&rank=&name=" + playerName + "&submit=OK";
        let container = await xhttpRequest(url, "GET");
        if (container == null) {
            console.log("An error has ocurred!")
            return;
        }
        let heroExperience = container.querySelector('#heroes > tbody > tr.hl').lastElementChild.innerText;
        analyseIncomingAttack(element, attackDate, playerName, heroCode, heroExperience);

    }

    function analyseIncomingAttack(element, attackDate, playerName, heroCode, currentHeroExp) {

        let nameAndDateString = playerName + "(" + attackDate + ")";

        if (!localStorage.hasOwnProperty(nameAndDateString)) {
            localStorage.setItem(nameAndDateString, currentHeroExp + ", " + heroCode);
            console.log("Hero information saved");
        } else {
            let output = nameAndDateString + " --> ";

            let savedHeroInformation = localStorage.getItem(nameAndDateString).split(", ");
            let savedHeroExp = savedHeroInformation[0];
            let savedHeroItens = savedHeroInformation[1];

            if (Number(currentHeroExp) != Number(savedHeroExp)) {
                var diferencaExp = Number(currentHeroExp) - Number(savedHeroExp);
                output += "EXP CHANGED" + diferencaExp;
            } else {
                output += "EXP DIDNT CHANGE";
            }

            if (heroCode == savedHeroItens) {
                output += ", DIDNT CHANGE EQUIPMENT"
            } else {
                output += ", CHANGED EQUIPMENT"
            }

            console.log(output);
            localStorage.setItem(nameAndDateString, currentHeroExp + ", " + heroCode);
            element.style.color = "green";
        }
    }
}

function resourcesPercentageToBuild() {

    let woodElement = document.querySelector("#contract > div.inlineIconList.resourceWrapper > div:nth-child(1) > span");
    let clayElement = document.querySelector("#contract > div.inlineIconList.resourceWrapper > div:nth-child(2) > span");
    let ironElement = document.querySelector("#contract > div.inlineIconList.resourceWrapper > div:nth-child(3) > span");
    let cropElement = document.querySelector("#contract > div.inlineIconList.resourceWrapper > div:nth-child(4) > span");

    if (document.body.contains(woodElement) == false) {
        return;
    }

    let totalResources = Number(woodElement.innerText) + Number(clayElement.innerText) + Number(ironElement.innerText) + Number(cropElement.innerText);

    let woodPercentage = (Number(woodElement.innerText) * 100 / totalResources).toFixed(2);
    let clayPercentage = (Number(clayElement.innerText) * 100 / totalResources).toFixed(2);
    let ironPercentage = (Number(ironElement.innerText) * 100 / totalResources).toFixed(2);
    let cropPercentage = (Number(cropElement.innerText) * 100 / totalResources).toFixed(2);

    woodElement.innerText += " (" + woodPercentage + ")";
    clayElement.innerText += " (" + clayPercentage + ")";
    ironElement.innerText += " (" + ironPercentage + ")";
    cropElement.innerText += " (" + cropPercentage + ")";
}

function autoBalanceResources() {

    let appendableElement = document.querySelector("#build > div.buildingDescription > div.description");

    if (document.body.contains(appendableElement) == false) {
        return;
    }
    let button = document.createElement('button');
    button.className = "textButtonV1 gold builder";
    button.innerText = "Auto Balance Resources";
    button.style.display = "block";
    button.style.margin = "auto";
    button.style.marginTop = "10px";
    button.onclick = function () {
        proceedAutoResourcesBalance()
    }
    appendableElement.append(button)
}

async function proceedAutoResourcesBalance() {

    document.querySelectorAll('.textButtonV1.gold')[1].click();
    if (await waitForElement("body > div.dialogWrapper > div > div > div.dialog-contents") == false) return;
    let woodPercentage = document.querySelector("#contract > div.inlineIconList.resourceWrapper > div:nth-child(1) > span").innerText.split('(').pop().split(')')[0];
    let clayPercentage = document.querySelector("#contract > div.inlineIconList.resourceWrapper > div:nth-child(2) > span").innerText.split('(').pop().split(')')[0];
    let ironPercentage = document.querySelector("#contract > div.inlineIconList.resourceWrapper > div:nth-child(3) > span").innerText.split('(').pop().split(')')[0];
    let cropPercentage = document.querySelector("#contract > div.inlineIconList.resourceWrapper > div:nth-child(4) > span").innerText.split('(').pop().split(')')[0];

    var sum = Number(document.querySelector("#sum").innerText);
    woodAmmount = Number(woodPercentage) / 100 * sum;
    clayAmmount = Number(clayPercentage) / 100 * sum;
    ironAmmount = Number(ironPercentage) / 100 * sum;
    cropAmmount = Number(cropPercentage) / 100 * sum;

    document.querySelector("#npc > tbody > tr:nth-child(1) > td:nth-child(1) > input").value = Math.round(woodAmmount);
    document.querySelector("#npc > tbody > tr:nth-child(1) > td:nth-child(2) > input").value = Math.round(clayAmmount);
    document.querySelector("#npc > tbody > tr:nth-child(1) > td:nth-child(3) > input").value = Math.round(ironAmmount);
    document.querySelector("#npc > tbody > tr:nth-child(1) > td:nth-child(4) > input").value = Math.round(cropAmmount);

    document.querySelector("#submitText > button").click();
}

function selectSpyReports() {

    let parentElement = document.querySelector(".footer");
    let redReportImgSelector = document.querySelector("#reportsForm > div.boxes.boxesColor.gray.reportFilter > div.boxes-contents.cf > button:nth-child(3) > img");
    let yellowReportImgSelector = document.querySelector("#reportsForm > div.boxes.boxesColor.gray.reportFilter > div.boxes-contents.cf > button:nth-child(2) > img");

    // let markAllInputSelector = document.querySelector("#markAll");
    // markAllInputSelector.style.marginLeft = "0px";


    let div = document.createElement("div");
    div.id = "markAll";

    let input = document.createElement("input");
    input.type = "checkbox";
    input.className = "check";
    input.style.verticalAlign = "top";
    input.onclick = function () {
        let yellowReports = document.querySelectorAll("#overview > tbody > tr > td.sub > img.iReport.iReport17");
        for (let report of yellowReports) {
            report.parentElement.parentElement.firstElementChild.firstElementChild.click();
        }
    }
    let span = document.createElement("span");
    let img = document.createElement("img");
    img = redReportImgSelector.cloneNode(true);
    span.appendChild(img);
    div.appendChild(input);
    div.appendChild(span);
    parentElement.insertBefore(div, document.querySelector('.paginator'));



    let div1 = document.createElement("div");
    div1.id = "markAll";

    let input1 = document.createElement("input");
    input1.type = "checkbox";
    input1.className = "check";
    input1.style.verticalAlign = "top";
    input1.onclick = function () {
        let yellowReports = document.querySelectorAll("#overview > tbody > tr > td.sub > img.iReport.iReport16");
        for (let report of yellowReports) {
            report.parentElement.parentElement.firstElementChild.firstElementChild.click();
        }
    }

    let span1 = document.createElement("span");
    let img1 = document.createElement("img");
    img1.className = "iReport iReport16";
    img1.src = "img/x.gif";

    span1.appendChild(img1);
    div1.appendChild(input1);
    div1.appendChild(span1);

    parentElement.insertBefore(div1, document.querySelector('.paginator'));

}

(function () {

    'use strict';

    var currentURL = window.location.href;

    //dorf1 and build pages won't reload with troop arrival, build upgrading, troop trained, etc...
    if (currentURL.includes("dorf1.php") || currentURL.includes("build.php")) {
        auto_reload = false;
    }

    if (currentURL.includes("login.php")) {
        document.querySelector("input[name=name]").focus();
    }
    //modified UI in position details' pages 
    else if (currentURL.includes("position_details.php")) {
        positionDetailsManager();
    }
    else if (currentURL.includes("build.php")) {
        resourcesPercentageToBuild();
        autoBalanceResources();
        if (currentURL.includes("id=39") && currentURL.includes("tt=2")) {
            if (localStorage.getItem("spy")) {
                if (localStorage.getItem("spy") == "both") {
                    sendSpy(1);
                } else if (localStorage.getItem("spy") == "resources") {
                    sendSpy(2);
                } else if (localStorage.getItem("spy") == "troops") {
                    sendSpy(3);
                }
            }
        }
        else if (currentURL.includes("tt=99")) {
            farmListsManager();
        }
        else if (/build.php\?gid=16&tt=1&filter=3/.test(currentURL)) {
            MandarTropasEmboraUI();
        }
        else if (currentURL.includes("gid=16&tt=2&filter=3")) {
            // document.querySelector("#btn_ok").click();
        }
        else if (/build.php\?id=23/.test(currentURL) || /build.php\?id=25/.test(currentURL) || /build.php\?id=32/.test(currentURL)) {
            QuarteisUI();
        }
        else if (/build.php\?gid=16&tt=1&filter=1&subfilters=1/.test(currentURL)) {
            incomingAttacksManager();
        }
    }
    else if (currentURL.includes("berichte.php")) {
        reportsManager(currentURL);
    }
})();


//TO-DO LIST
//  - IGNORED VILLAGES
//  - POSTERIORMENTE, FAZER O SISTEMA DE AJUSTAR LISTAS EM CONDIÇÕES
// BUGS
//  - caso tire o travian resource bar plus da merda no calculo do algoritmo de numero otimo de tropas
// limepza de codigo
//  - função optimal troops está a modos que duplicada

// meter no browser
// ==UserScript==
// @name         OhmzaoScript
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  try to take over the world!
// @author       You
// @include      *://ts3.*.travian.com/*
// @require      file://C:\Users\claro\OneDrive\Ambiente de Trabalho\OhmzaoScript.user.js
// @grant        none
// ==/UserScript==


// VERIFICAÇÕES :
//  - VERIFCAR SE O FARM ESTÁ DENTRO DO RANGE


// fetch("https://ts3.lusobrasileiro.travian.com/api/v1/ajax", {
//   "headers": {
//     "accept": "application/json, text/javascript, */*; q=0.01",
//     "accept-language": "en,pt;q=0.9,pt-PT;q=0.8,en-US;q=0.7",
//     "authorization": "Bearer 48a4913e0a5f245983c13c07d14db519",
//     "content-type": "application/json; charset=UTF-8",
//     "sec-fetch-dest": "empty",
//     "sec-fetch-mode": "cors",
//     "sec-fetch-site": "same-origin",
//     "x-requested-with": "XMLHttpRequest"
//   },
//   "referrer": "https://ts3.lusobrasileiro.travian.com/position_details.php?x=11&y=23&lid=1669&xx=1594402617",
//   "referrerPolicy": "no-referrer-when-downgrade",
//   "body": "{\"cmd\":\"raidList\",\"method\":\"ActionCheckForForeignSlotEntry\",\"listId\":\"2470\",\"slots\":null,\"x\":\"11\",\"y\":\"23\"}",
//   "method": "POST",
//   "mode": "cors",
//   "credentials": "include"
// });