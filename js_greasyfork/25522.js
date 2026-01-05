// ==UserScript==
// @name         Better WooWee
// @version      0.2
// @description  try to take over the world!
// @author       SebRut
// @match        https://woowee.de/*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/25522/Better%20WooWee.user.js
// @updateURL https://update.greasyfork.org/scripts/25522/Better%20WooWee.meta.js
// ==/UserScript==


var timeRegEx = /(\d+) Min. (\d+) Sek./;
var secsTillNextTask = 0;
var autoAcceptAvTasks = false;

function updateTaskTimer() {
    secsTillNextTask--;
    if(secsTillNextTask <= 0) {
        location.reload();
        return;
    }
    taskTimer.text((secsTillNextTask >= 60 ? Math.floor(secsTillNextTask / 60) + " Minute(s), " : "") + secsTillNextTask%60 + " Second(s)");

    setTimeout(updateTaskTimer, 1000);
}

function prepareTaskTimer() {
    var nextTaskEl = $("body > div.body > div > div:nth-child(4) tbody").last().find("tr").first();

    if(nextTaskEl !== null) {
        var timeEl = $(nextTaskEl).find("td:nth-child(4)");
        if(timeEl !== null) {
            var mins = timeEl.text().match(timeRegEx)[1];
            var secs = timeEl.text().match(timeRegEx)[2];
            secsTillNextTask = eval(mins * 60) + eval(secs);
            console.log("Next task in " + mins + " mins, " + secs + " secs, = " + secsTillNextTask + " total secs");
            setTimeout(updateTaskTimer, 1000);
            return;
        }
    }
    taskTimer.text("No task available");
}

var taskTimer;
var autoAcceptToggleButton;

function setUpUI() {
    //$("body > div.body > div > div:nth-child(4) > div > div.col-md-9 > p.aligncenter.mt-100.mb-100").hide();
    $("body > div.body > div > div:nth-child(4) > div > div.col-md-9 > p:nth-child(5)").hide();
    var dashboardRoot = $("body > div.body > div > div:nth-child(2)");
    dashboardRoot.empty();

    var tDiv = $(document.createElement('div'));
    tDiv.addClass("table-responsive");

    var table = $(document.createElement('table'));
    table.addClass("table");

    var tBody = $(document.createElement('tbody'));

    var row = $(document.createElement('tr'));
    var leftCell = $(document.createElement('td'));
    leftCell.text("Time till next task");
    row.append(leftCell);
    var taskTimerCell = $(document.createElement('td'));
    taskTimerCell.addClass("alignright");
    taskTimer = $(document.createElement('strong'));
    taskTimer.text("unknown");
    taskTimerCell.append(taskTimer);
    row.append(taskTimerCell);
    tBody.append(row);

    row = $(document.createElement('tr'));
    var leftCell = $(document.createElement('td'));
    leftCell.text("Revenue/Payout Limit");
    row.append(leftCell);
    var rightCell = $(document.createElement('td'));
    rightCell.addClass("alignright");
    var val = $(document.createElement('strong'));
    var rev = $("body > div.body > div > div:nth-child(4) > div > div.col-md-3 > div > aside > p > strong:nth-child(3)").text().replace(" €", "").replace(",",".");
    var percentage = (eval(rev)/5 * 100).toFixed(2);
    val.text(parseFloat(rev).toFixed(2) + "€ / " + percentage + "%");
    rightCell.append(val);
    row.append(rightCell);
    tBody.append(row);

    row = $(document.createElement('tr'));
    var leftCell = $(document.createElement('td'));
    leftCell.text("Auto accept New Task");
    row.append(leftCell);
    rightCell = $(document.createElement('td'));
    rightCell.addClass("alignright");
    autoAcceptToggleButton = $(document.createElement('button'));
    autoAcceptToggleButton.addClass("btn btn-primary");
    autoAcceptToggleButton.attr("type", "button");
    autoAcceptToggleButton.attr("data-toggle", "button");
    autoAcceptToggleButton.attr("aria-pressed", autoAcceptAvTasks);
    autoAcceptToggleButton.attr("autocomplete", "off");
    autoAcceptToggleButton.text(autoAcceptAvTasks ? "On" : "Off");
    autoAcceptToggleButton.click(function() {
        autoAcceptAvTasks = !eval(autoAcceptToggleButton.attr("aria-pressed"));
        autoAcceptToggleButton.text(autoAcceptAvTasks ? "On" : "Off");
    });
    rightCell.append(autoAcceptToggleButton);
    row.append(rightCell);
    tBody.append(row);

    table.append(tBody);
    tDiv.append(table);
    dashboardRoot.append(tDiv);

    prepareTaskTimer();
}

function loadSettings() {
    autoAcceptAvTasks = eval(localStorage.autoAcceptAvTasks);
    if(autoAcceptAvTasks === undefined) autoAcceptAvTasks = false;
    console.log("settings loaded");
}

function saveSettings() {
    localStorage.autoAcceptAvTasks = autoAcceptAvTasks;
    console.log("settings saved");
}

function taskPage() {
    setUpUI();
    if(autoAcceptAvTasks) {
        var tbodies = $("body > div.body > div > div:nth-child(4) tbody").not("#task_run");
        if (tbodies.length >= 2) {
            $(tbodies.first()).find("tr").first().click();
        }

        setTimeout(function() {
            if($("#modal_form > div > strong").first().text().indexOf("Hoppla") != -1) {
                location.reload();
            }
            else if($("#submit").first().text().indexOf("abbrechen") == -1) {
                $("#submit").click();
            }}, 1000);
    }
}

function ajaxPage() {
        setTimeout(function() {
            if($("#modal_form > div > strong").first().text().indexOf("Hoppla") != -1) {
                location.reload();
            }
            else if($("#submit").first().text().indexOf("abbrechen") == -1) {
                $("#submit").click();
                
                setTimeout(function() { location.pathname="/aufgaben"; }, 1000);
            }}, 1000);
}

(function() {
    'use strict';

    window.onbeforeunload = saveSettings;
    loadSettings();

    if(location.pathname.indexOf("/ajax") != -1) {
ajaxPage();
    } 
    if(location.pathname.indexOf("/login") != -1) {
        location.pathname = "/aufgaben";
    }
    if(location.search !== "") {
        location.search = "";
    }

    if(location.pathname.indexOf("/aufgaben/") != -1) {
        taskPage();
    }


})();