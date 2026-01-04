// ==UserScript==
// @name         Item Sets
// @namespace    http://talibri.com/
// @version      0.101
// @description  Adds item set functionality and some minor UI changes to the Equipment panel
// @author       Subglacious
// @match        *talibri.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38487/Item%20Sets.user.js
// @updateURL https://update.greasyfork.org/scripts/38487/Item%20Sets.meta.js
// ==/UserScript==

function resize() {
    var panel = $("div.col-xs-8");
    panel.css("overflow-y", "auto");

    var subPanel = $("div.panel-body", panel);
    subPanel.css("max-height", "70vh");
}


function changePanel() {
    if (!location.href.includes("talibri.com/user/" + playerId + "/profile")) {
        return;
    }

    // Resize and hijack the Equipment tab button to make sure the table stays resized after switching tabs
    resize();
    $("a[href*='/equipment']").click(function() {
        $.get("https://talibri.com/user/" + playerId + "/equipment", function(data) {changePanel();});
        return false;
    });

    $(".actions").css("white-space","nowrap");
    actions = $("table.table.tablesorter th:contains('Action')")[0];
    actions.innerHTML = actions.innerHTML.replace("Action", "Actions");

    // Rewrite the Equipment div as a span to allow room for the new buttons
    $(".panel-heading > .panel-title:contains('Equipment')").replaceWith(function() {
        return this.outerHTML.replace("<div ", "<span ").replace("</div>", "</span>");
    });
    var header = $(".panel-heading > .panel-title:contains('Equipment')")[0].parentElement;

    // There's probably a better way to do this :shrug:
    var setList = document.createElement("span");
    setList.innerHTML = "<select id='setList'></select>";
    setList.style.cssText = "padding: 0px 5px;";

    var wearButton = document.createElement("span");
    wearButton.innerHTML = "<button id='wearButton'>Wear</button>";
    wearButton.style.cssText = "padding-right: 5px;";

    var deleteButton = document.createElement("span");
    deleteButton.innerHTML = "<button id='deleteButton'>Delete</button>";
    deleteButton.style.cssText = "padding-right: 30px;";

    var saveButton = document.createElement("span");
    saveButton.innerHTML = "<button id='saveButton'>Save Current</button>";
    saveButton.style.cssText = "padding-right: 30px;";

    var stripButton = document.createElement("span");
    stripButton.innerHTML = "<button id='stripButton'>Get Nekid</button>";
    stripButton.style.cssText = "padding-right: 30px;";

    var destroyButton = document.createElement("span");
    destroyButton.innerHTML = "<button id='destroyButton'>Delete All Sets</button>";

    for (let x of [setList, wearButton, deleteButton, saveButton, stripButton, destroyButton]) {
        header.appendChild(x);
    }
    $("#deleteButton").css("color", "#f40000");
    $("#destroyButton").css("color", "#f40000");


    $("#wearButton").click(wearSet);
    $("#deleteButton").click(deleteSet);
    $("#saveButton").click(saveSet);
    $("#stripButton").click(stripGear);
    $("#destroyButton").click(destroySets);
    updateSetList();
}


function saveSet() {
    var setStats = $("#equipment-stats")[0].innerHTML.replace(/[\t\n]/g, "");    // I want to display this in a pretty tooltip, but I don't know how...
    var setItems = [];
    $("tr[id^='user-equipment-'].success").each(function() {
        let x = this.id;
        setItems.push(x);
    });
    var setName = prompt("Please enter a name for this item set:");
    if (!setName) {return;} // if the user hits Cancel or enters nothing

    var itemSets = JSON.parse(localStorage.itemSets);
    itemSets.push([setName, setStats, setItems]);
    localStorage.itemSets = JSON.stringify(itemSets);

    updateSetList();
}


function wearSet() {
    var index = $("#setList :selected")[0].value;
    if (!index) {return;} // return if no option was selected

    // Get the selected set, equip gear - ignore gear that's already equipped
    var set = JSON.parse(localStorage.itemSets)[index];
    var items = set[2];
    for (let i=0; i < items.length; i++) {
        let x = $("tr[id=" + items[i] + "] button:contains('Equip')");
        if (x.length > 0) {x[0].click();}
    }
}


function deleteSet() {
    var index = $("#setList :selected")[0].value;
    if (!index) {return;} // return if no option was selected

    var c = confirm("Are you sure you want to delete this set?");
    if (!c) {return;}

    var itemSets = JSON.parse(localStorage.itemSets);
    itemSets.splice(index, 1);
    localStorage.itemSets = JSON.stringify(itemSets);

    updateSetList();
}


function destroySets() {
    var c = confirm("This will delete all sets! Are you SURE?");
    if (!c) {return;}

    c = confirm("Okay, don't blame me...");
    if (!c) {return;}

    localStorage.itemSets = "[]";
    updateSetList();
}


function updateSetList() {
    var itemSets = JSON.parse(localStorage.itemSets);
    var setList = $("#setList")[0];
    setList.innerHTML = "<option disabled selected value> -- select a set -- </option>";

    // Guaranteed to fill setList in the same order the sets were stored
    for (let i=0; i < itemSets.length; i++) {
        var set = itemSets[i];
        var option = document.createElement("option");
        option.text = set[0];
        option.value = i;
        setList.options.add(option);
    }
}


function stripGear() {
    $("tr[id^='user-equipment-'].success button:contains('Take Off')").each(function() {
        this.click();
    });
}


// Set initial value for itemSets
if (!("itemSets"  in localStorage)) {localStorage.itemSets = "[]";}

var playerId = $("li > a[href*='/profile']").attr("href").match(/([0-9]+)/)[1];
changePanel();
$(document).on('turbolinks:load', function() {
    changePanel();
});