// ==UserScript==
// @name         Text2Mindmap Autosave
// @version      0.02
// @description  Autosaves mindmaps on Text2Mindmap
// @author       Domination9987
// @match        http*://www.text2mindmap.com/***********************************************************************************************************************
// @grant        none
// @namespace http://your.homepage/
// @downloadURL https://update.greasyfork.org/scripts/11312/Text2Mindmap%20Autosave.user.js
// @updateURL https://update.greasyfork.org/scripts/11312/Text2Mindmap%20Autosave.meta.js
// ==/UserScript==

//Plans
//* Allow autosave without refreshing - Add an event listener to the close button, and inititate then
//* Add a method of changing autosave time (input box)

var checkInt, saveInt;
var timerInt = false;
var currentTime = 0;
var autosaveTime = localStorage.autosaveTime || 10;
var saveCountdown = localStorage.saveCountdown || false;

Init();
setTimeout(Init2, 1000);

function Init(){
    SaveFile();
}

function Init2(){
    if ($("#savingStateSaved").css("display") == "inline"){
        CheckIfSaveNeeded();
        saveInt = setInterval(CheckIfSaveNeeded, 3000);
    } else {
        SetText("(Auto N/A)");
    }
}

//Check if required to time
function CheckIfSaveNeeded(){
    if ($(".saveMsg").css("display") === "none"){
        window.onbeforeunload = null;
        SetText("(saved)");
        StopTimer();
    } else {
        if (timerInt === false){
            window.onbeforeunload = function() {
                return "You have unsaved changes!";
            };
            timerInt = setInterval(Timer, 1000);
            clearInterval(saveInt);
        }
    }
}

//Timer, called every second
function Timer(){
    currentTime += 1;
    modulo = currentTime % autosaveTime;
    if (modulo === 0){
        SaveFile();
        SetText("(saving...)");
        StopTimer();
    } else {
        if (saveCountdown){
            SetText("(autosave " + (autosaveTime - (modulo)).toString() + ")");
        } else {
            SetText("(unsaved)");
        }
    }
}

//Stops timer
function StopTimer(){
    clearInterval(timerInt);
    timerInt = false;
}

//Saving functions, called every 30 seconds
function SaveFile(){
    OpenSave();
    checkInt = setInterval(CheckDone, 500);
}

function CheckDone(){
    if ($("#savingFinished").css("display") == "block" || $("#savingStateUnsaved").css("display") == "block"){
        CloseSave();
        clearInterval(checkInt);
        TextFocus();
        saveInt = setInterval(CheckIfSaveNeeded, 3000);
    }
}

//Changes the text
function SetText(text){
    $('.tab-pane td').eq(1).find('h4').text("Outline your text " + text);
}

//This function refocuses on the text area after being saved
function TextFocus(){
    scrollTop = $("#textArea").scrollTop();
    scrollLeft = $("#textArea").scrollLeft();
    $("#textArea").focus();
    $("#textArea").scrollLeft(scrollLeft);
    $("#textArea").scrollTop(scrollTop);
}

//This function opens a hidden save box
function OpenSave(){
    $("#saveBtn").click();
    $(".modal-backdrop").css("display", "none");
    $("#saveModal").css("display", "none");
}

//This function closes a hidden save box
function CloseSave(){
    $("#saveModal").css("display", "");
    $(".modal-backdrop").css("display", "");
    $(".icon-close").parent().click();
}


//Keyboard Events
$("#textArea").keydown(function (){
    modulo = currentTime % autosaveTime;
    if (modulo > autosaveTime - 3){
        currentTime += modulo - autosaveTime;
    }
});