// ==UserScript==
// @name        Soulforged Progress Bar Percentages
// @description Changes the progress bar display for quests to display the percent progress
// @version     1.1.6
// @include     *://soulforged.net:8443/*
// @include     *://soulforged.net/*
// @include     *://soulforged.westeurope.cloudapp.azure.com/*
// @include     *://play.soulforged.net/*
// @namespace   soulforged.net
// @grant       none
// @author      Sakir, with **heavy** inspiritation from Zap
// @downloadURL https://update.greasyfork.org/scripts/395784/Soulforged%20Progress%20Bar%20Percentages.user.js
// @updateURL https://update.greasyfork.org/scripts/395784/Soulforged%20Progress%20Bar%20Percentages.meta.js
// ==/UserScript==


function waitDecimalizeProgressBars() {
  setTimeout(decimalizeQuestBars, 25);
}


function decimalizeQuestBars() {
  let regexp = /\d+/g;
  let already_edited = /%/g;
  var playerQuests = document.getElementsByClassName("player-quests");
  var objectives = playerQuests[0].getElementsByClassName("objective");
  for(var objective of objectives) {
    var progress = objective.getElementsByClassName("fill")[0]
    .attributes.style.value.match(regexp)[0];
    if (!objective.getElementsByClassName("label")[0].innerHTML.match(already_edited) ) {
        var insideText = " ("+progress+"% completed)";
        objective.getElementsByClassName("label")[0].innerHTML += insideText;
    }
  }
}


//assuming there is just the one
window.addEventListener("click", waitDecimalizeProgressBars);


