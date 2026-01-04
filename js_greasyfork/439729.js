// ==UserScript==
// @name         Torn Travel Bazaar Inventory
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Inject Bazaar Info
// @author       Chriserino[2685070]
// @license MIT
// @match        https://www.torn.com/index.php
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/439729/Torn%20Travel%20Bazaar%20Inventory.user.js
// @updateURL https://update.greasyfork.org/scripts/439729/Torn%20Travel%20Bazaar%20Inventory.meta.js
// ==/UserScript==

let inventory;
let key = GM_getValue("tornApiKey");
let tornAPI = "https://api.torn.com/user/?selections=bazaar&key=" + key;
let itemTimer;

let divBazaar = document.createElement("div");
let divItems = document.createElement("div");
let divTitle = document.getElementById("content-title");
divBazaar.setAttribute("id", "divBazaar");
divItems.setAttribute("id", "divItems");
divBazaar.style["color"] = "green";
divItems.style["color"] = "green";

function keyCheck(){
    if(key == null || key == ""){
        var apiPrompt = prompt("First Time Setup. \nPlease enter your API Key (located on the preferences page under API Key.)");
        GM_setValue("tornApiKey", apiPrompt); //Saves API Key
    }
}

function checkPage(){
    if ($("#skip-to-content")[0].outerText == "Traveling"){return true;}
    else { return false;}
    console.log(checkPage());
}

function getInventoryJSON(){
    $.getJSON( tornAPI, function(json){
        try{
            inventory = json;
        } catch (err) {
            alert("There has been an error while fetching your data. Try resetting your API Key.");
            console.log("err | " + err);
        }

        if (Object.keys(inventory.bazaar).length > 0){
            itemTimer = setTimeout(updateText, 30000);
        }
        else {
            clearTimeout(itemTimer);
        }
        displayText(inventory);
    });
}

function getItems(inventory){
    let items = "";
    let count = Object.keys(inventory.bazaar).length;
    if (count > 0) {
        for (let i = 0; i < count; i++){
            //this formats the text for single / multiple items.
            if (count > 1) {
                //if this is the last one, do not add the comma
                if (i == count -1) { items += `<b>${inventory.bazaar[i].name} (${inventory.bazaar[i].quantity})</b>`; }
                //add comma at end to help separate items
                else {items += `<b>${inventory.bazaar[i].name} (${inventory.bazaar[i].quantity})</b>, `;}
            }
            //if there is only  one item, do not add comma
            else { items += `<b>${inventory.bazaar[i].name} (${inventory.bazaar[i].quantity})</b>`; }
        }
        return items;
    }
    else {return "";}
}

function displayText(inventory){
    let count = Object.keys(inventory.bazaar).length;
    divBazaar.innerHTML = `There are <b>${count}</b> items in your bazaar`;
    divItems.innerHTML = getItems(inventory);
    $( ".content-title" ).after(divBazaar, divItems);

}

function updateText(){
    getInventoryJSON();
}

$(window).load(function() {
    console.log("Bazaar Inv Running");
    keyCheck();
    if (checkPage()){
        getInventoryJSON();
    }
});