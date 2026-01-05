// ==UserScript==
// @name         WurzelImperium
// @version      0.12
// @description  Half automate Wurzelimperium
// @author       Redcrafter
// @include      *wurzelimperium.de/*
// @grant        none
// @namespace https://greasyfork.org/users/126269
// @downloadURL https://update.greasyfork.org/scripts/29975/WurzelImperium.user.js
// @updateURL https://update.greasyfork.org/scripts/29975/WurzelImperium.meta.js
// ==/UserScript==

var elements;
var data;
var length;

setTimeout(main,1000);

function main(){
    var button = document.createElement("button");
    button.innerText = "Automate";
    button.onclick = function(){run();};
    document.getElementById("ingame-footer").append(button);
    
    var button1 = document.createElement("button");
    button1.innerText = "Water";
    button1.style.marginLeft = "5px";
    button1.onclick = function(){water();};
    document.getElementById("ingame-footer").append(button1);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function run() {
    elements = gardenjs.getElements();
    data = gardenjs.getGrid();
    length = Object.keys(elements).length;

    plant();
}

function harvest(){
    gardenjs.harvestAll();
    setTimeout(gardenjs.closeDialogs,1000);
    console.info("Harvested");
}

async function plant(){
    //selectMode(0,true,selected);
    //var selected = $("regal").children;
    //selected[1].click();

    var planted = [];

    for(var i = 1; i <= length; i++){
        if(data[i].finished === 0){
            await sleep(Math.random() * 100 + 100);
            elements[i].f.click();
            planted[planted.length] = elements[i];
        }
    }

    console.info("Planted");
    await sleep(1000);

    selectMode(2,true,selected);
    console.log(planted);

    for(i of planted){
        await sleep(Math.random() * 100 + 100);
        i.f.click();
    }

    console.info("Watered");

    var timeout = regal.getProductInfos(regal.selectedProduct).time;
    setTimeout(harvest,timeout * 1000 + 10000);
}

async function water(){
    elements = gardenjs.getElements();
    data = gardenjs.getGrid();
    length = Object.keys(elements).length;
    
    selectMode(2,true,selected);

    for(var i = 1; i <= length; i++){
        if(data[i].category == "v" && data[i].finished != 1){
            await sleep(Math.random() * 100 + 100);
            elements[i].f.click();
        }
    }
    console.info("Watered");
}