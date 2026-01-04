// ==UserScript==
// @name         AutoFarm
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  el del senyor
// @author       AnonymouseY
// @match		 https://*.grepolis.com/game/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grepolis.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487487/AutoFarm.user.js
// @updateURL https://update.greasyfork.org/scripts/487487/AutoFarm.meta.js
// ==/UserScript==


function getSelectAllCheckbox() {
    var townWrapper = document.getElementById("fto_town_wrapper");
    if(townWrapper != null) {
        var checkbox = townWrapper.querySelector(".checkbox");
        return checkbox;
    }
    else {
        console.log("getSelectAllCheckbox: Es probable que la vista de aldeas del capitan este cerrada.");
        return null;
    }
}


function checkSelectAllCheckbox(checkbox) {
    if(checkbox != null) {
        if(checkbox.className != 'checkbox select_all checked') { //Checkbox no está selecionado
            checkbox.click();
            return checkSelectAllCheckbox(checkbox); //Recursividad rica :) Esto lo hago así para que esta funcion me sirva como check booleano de si el checkbox está marcado.
        }
        else {
            console.log("El checkbox ya estaba seleccionado.");
            return true;
        }
    }
    else {
        console.log("El elemento checkbox es null");
        return false;
    }
}

function checkTownCheckbox(checkbox) { //Lo mismo que el select all, pero solo para town (como tienen diferente className, pues toca otro xD)
    if(checkbox != null) {
        if(checkbox.className != 'checkbox town_checkbox checked') { //Checkbox no está selecionado
            checkbox.click();
            return checkTownCheckbox(checkbox); //Recursividad rica :) Esto lo hago así para que esta funcion me sirva como check booleano de si el checkbox está marcado.
        }
        else {
            console.log("checkTownCheckbox: Checkbox seleccionado.");
            return true;
        }
    }
    else {
        console.log("checkTownCheckbox: El elemento checkbox es null");
        return false;
    }
}

function getTownMaxStoragePercentage(town) {
    var totalStorageTown = parseFloat(town.querySelector(".storage_icon.fto_resource_count").innerText);
    var woodStorageTown = parseFloat(town.querySelector(".resource_wood_icon.wood.fto_resource_count").innerText);
    var stoneStorageTown = parseFloat(town.querySelector(".resource_stone_icon.stone.fto_resource_count").innerText);
    var ironStorageTown = parseFloat(town.querySelector(".resource_iron_icon.iron.fto_resource_count").innerText);
    var woodPercentage = (woodStorageTown/totalStorageTown)*100;
    var stonePercentage = (stoneStorageTown/totalStorageTown)*100;
    var ironPercentage = (ironStorageTown/totalStorageTown)*100;
    return Math.max(woodPercentage, stonePercentage, ironPercentage);
}


function checkTownHasEnoughStorage(town, percentage) { //True si tiene suficiente espacio, false en caso contrario
    var maxPercentage = getTownMaxStoragePercentage(town);
    if(maxPercentage > percentage) {
        return false;
    }
    else {
        return true;
    }
}

function firstTownIsEmptier(firstTown, secondTown) { //True si la primera está mas vacía.
    return getTownMaxStoragePercentage(firstTown) < getTownMaxStoragePercentage(secondTown);
}

function getEligibleTowns(gameList) {
    if(gameList != null) {
        var items = gameList.getElementsByClassName("fto_town");
        var chosenTowns = [];
        var previousIslandId = '';
        var lastTown;
        for (var i = 0; i < items.length; i++) {
            let town = items[i];
            let checkboxTown = town.querySelector(".checkbox");
            let islandId = checkboxTown.getAttribute("data-island_id");
            if(previousIslandId == islandId) {
                if(firstTownIsEmptier(town, lastTown)) {
                    chosenTowns.pop();
                    chosenTowns.push(town);
                }
            }
            else {
                lastTown = town;
                chosenTowns.push(town);
            }
        }
        return chosenTowns;
    }
    else {
        console.log("selectEligibleTowns: Es probable que la vista de aldeas del capitan este cerrada.");
        return null;
    }
}

//TODO Tengo que revisar para que se pueda hacer un loop async y que el promise devuelva true si se han seleccionado ya todas las ciudades.
/*var i = 0; //  set your counter to 1

function checkTownsLoop(towns) {
    new Promise(resolve => {//  create a loop function
    setTimeout(function() {
        let town = towns[i];
        let townCheckbox = town.querySelector(".checkbox");
        if(checkTownHasEnoughStorage(town, 95)) {
            checkTownCheckbox(townCheckbox);
        }
        i++;
        if (i < towns.length) {
            checkTownsLoop(towns);
        }
        else {
            resolve(true);
        }
  }, 1000)
    });
}*/

function selectCheckboxForEligibleTowns(towns) {
    if(towns == null) {
        console.log("selectCheckboxForEligibleTowns: Parece que no hay ciudades elegibles.");
        return false; //No se ha podido seleccionar
    }
    var someTownSelected = false;
    for(var town of towns) {
        let townCheckbox = town.querySelector(".checkbox");
        if(checkTownHasEnoughStorage(town, 90)) {
            someTownSelected = checkTownCheckbox(townCheckbox) || someTownSelected;
        }
        else {
            console.log("selectCheckboxForEligibleTowns: Parece que la ciudad está por encima del máximo de recursos para pedir.");
        }
    }
    //checkTownsLoop(towns); //TODO Parte del codigo cometado. No se porque pero al marcar las ciudades tan rápido parece que saca un error (pinta a que para calcular los recursos)
    return someTownSelected;
}

function collectResources() {
    var collectButton = document.getElementById("fto_claim_button");
    if(collectButton != null) {
        collectButton.click();
        setTimeout(function(){
            let confirmButton = document.querySelector(".btn_confirm.button_new");
            if(confirmButton != null) {
                confirmButton.click();
            }
            else {
                console.log("collectResources: Algo ha fallado al confirmar la recogida de recursos.");
            }
        }, 800);
    }
    else {
        console.log("collectResources: Es probable que la vista de aldeas del capitan este cerrada.");
    }
}


function randomIntFromInterval(min, max) { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min)
}

var timerID;

function mainAutoFarm() {
    var gameList = document.getElementById("fto_town_list");
    if(gameList != null) {
        let townsSelected = selectCheckboxForEligibleTowns(getEligibleTowns(gameList));
        if(townsSelected) { //Si no hay alguna seleccionada no dejará recolectar
            setTimeout(function(){ //Solo para darle un respiro y que pueda cargar correctamente (a demás que queda más natural si hay un intervalo entre acciones, pues somos humanos (?)).
                collectResources();
            }, 1000);
        }
    }
    else {
        console.log("startAutoFarm: Es probable que la vista de aldeas del capitan este cerrada.");
    }
}

function startAutoFarm() {
    stopAutoFarm(); //Por si hay alguno en ejecución, lo reiniciamos
    mainAutoFarm(); //Probaremos a ejecutar los recursos al menos la primera vez.
    timerID = setInterval(startAutoFarm, randomIntFromInterval(10*60000, 12*60000)); //Así no será el segundo exacto xD
}

function stopAutoFarm() {
    clearInterval(timerID);
}


function appendButtons(){
	var buttonStart = document.createElement("a");
    buttonStart.innerHTML = '<div class="menu_wrapper minimize closable" style="width: 61.3438px; float: right;"><ul class="menu_inner"><li><a data-menu_name="IniciarBot" class="submenu_link active" href="#" id="fto_claim"><span class="left"><span class="right"><span class="middle">IniciarBot</span></span></span></a></li></ul></div>';
    buttonStart.onclick = function () {
        startAutoFarm();
    };
    var buttonStop = document.createElement("a");
    buttonStop.innerHTML = '<div class="menu_wrapper minimize closable" style="width: 61.3438px; float: right;"><ul class="menu_inner"><li><a data-menu_name="PararBot" class="submenu_link active" href="#" id="fto_claim"><span class="left"><span class="right"><span class="middle">PararBot</span></span></span></a></li></ul></div>';
	buttonStop.onclick = function () {
        stopAutoFarm();
    };
    var popup = document.querySelector(".ui-dialog-titlebar.ui-corner-all.ui-widget-header.ui-helper-clearfix.ui-draggable-handle");
    if(!popup.innerText.includes("IniciarBot")) {
        popup.appendChild(buttonStart);
    }
    if(!popup.innerText.includes("PararBot")) {
        popup.appendChild(buttonStop);
    }
   }

function addOnClickToCaptainOverview() {
    setTimeout(function(){ //Solo para darle un respiro y que pueda cargar correctamente
        var overview = document.getElementById("overviews_link_hover_menu");
        var townButton = overview.querySelector(".farm_town_overview");
        townButton.onclick = function(){
            console.log("El capitán sale a navegar. (Espera 1s para alzar velas)");
            setTimeout(function(){ //Solo para darle un respiro y que pueda cargar correctamente
                appendButtons();
            }, 1000);
        };
    }, 2000);
}


function _appendScript(f, A) {
  var c = document.createElement("script");
  c.type = "text/javascript";
  c.id = f;
  c.textContent = A;
  document.body.appendChild(c);
}

_appendScript("timerID", "var timerID;");
_appendScript("startAutoFarm", startAutoFarm.toString());
_appendScript("appendButtons", appendButtons.toString());
_appendScript("stopAutoFarm", stopAutoFarm.toString());
_appendScript("mainAutoFarm", mainAutoFarm.toString());
_appendScript("randomIntFromInterval", randomIntFromInterval.toString());
_appendScript("collectResources", collectResources.toString());
_appendScript("selectCheckboxForEligibleTowns", selectCheckboxForEligibleTowns.toString());
_appendScript("firstTownIsEmptier", firstTownIsEmptier.toString());
_appendScript("checkTownHasEnoughStorage", checkTownHasEnoughStorage.toString());
_appendScript("getTownMaxStoragePercentage", getTownMaxStoragePercentage.toString());
_appendScript("checkTownCheckbox", checkTownCheckbox.toString());
_appendScript("checkSelectAllCheckbox", checkSelectAllCheckbox.toString());
_appendScript("getSelectAllCheckbox", getSelectAllCheckbox.toString());
_appendScript("addOnClickToCaptainOverview", addOnClickToCaptainOverview.toString());


window.onload = addOnClickToCaptainOverview();
console.log('%cCapitanAutoFarm está activo :)', 'color: green; font-size: 1.5em; font-weight: bolder; ');

