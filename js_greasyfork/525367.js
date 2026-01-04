// ==UserScript==
// @name           Userstyles World Stats Keeper v 1.19
// @version        1.19
// @description	   Keeps stats of number of install and show number of install since your last visit of the page and if you don't clear with it's button
// @icon           https://external-content.duckduckgo.com/ip3/userstyles.world.ico
// @namespace      https://greasyfork.org/users/8
// @match          https://userstyles.world/user/*

// @author         decembre
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/525367/Userstyles%20World%20Stats%20Keeper%20v%20119.user.js
// @updateURL https://update.greasyfork.org/scripts/525367/Userstyles%20World%20Stats%20Keeper%20v%20119.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Create a storage object to store the stats
  var storage = localStorage;

  // Function to get the style ID and installs from a card
  function getStyleStats(card) {
    var styleId = card.querySelector('.grid.flex.rwrap .card.col.gap .card-header.thumbnail').href.match(/\/style\/(\d+)/)[1];
    console.log('Number ID found:', styleId);
    var installs = card.querySelector('.grid.flex.rwrap .card.col.gap small:first-of-type +  small > [data-tooltip]').textContent;
    console.log('Number Install found:', installs);
    return { styleId: styleId, installs: installs };
  }

// Function to update the stats and show the difference
function updateStats(card) {
  console.log('Updating stats for card:', card);
  var styleId = getStyleStats(card).styleId;
  var installs = card.querySelector('.grid.flex.rwrap .card.col.gap small:first-of-type +  small > [data-tooltip]').textContent;
  console.log('Number Install found:', installs);
  var initialInstalls = storage.getItem(styleId + '_initial');
  if (!initialInstalls) {
    initialInstalls = installs;
    storage.setItem(styleId + '_initial', initialInstalls);
  }
  console.log('Création de l\'élément statsElement');
  var statsElement = document.createElement('span');
  statsElement.className = 'StatsKeeper';
  var installsInt = parseInt(installs.replace(/[^0-9]/g, '')); // Remove non-numeric characters
  var initialInstallsInt = parseInt(initialInstalls.replace(/[^0-9]/g, '')); // Remove non-numeric characters
  var diff = installsInt - initialInstallsInt;
  console.log('Diff:', diff);
  if (diff > 0) {
    statsElement.textContent = '+' + diff;
    statsElement.style.background = 'green';
    statsElement.style.borderRadius = '5px';
    statsElement.style.color = 'gold';
  } else {
    statsElement.textContent = '⦁ ⦁ ⦁';
    statsElement.style.color = 'gray';
  }
  console.log('Récupération de l\'élément timeElement');
  var timeElement = card.querySelector('.grid.flex.rwrap .card.col.gap small:first-of-type +  small > [data-tooltip]');
  if (timeElement) {
    console.log('Time element trouvé:', timeElement);
    timeElement.parentNode.insertBefore(statsElement, timeElement.nextSibling);
    console.log('StatsKeeper ajouté:', statsElement);
  } else {
    console.error('Time element non trouvé');
  }
}




  // Function to load stored stats
  function loadStats(cards) {
    cards.forEach(function(card) {
      var styleId = getStyleStats(card).styleId;
      var installs = getStyleStats(card).installs;
      var initialInstalls = storage.getItem(styleId + '_initial');
      if (initialInstalls) {
        var statsElement = document.createElement('span');
        statsElement.className = 'StatsKeeper';
        var installsInt = parseInt(installs.replace(/[^0-9]/g, '')); // Remove non-numeric characters
        var initialInstallsInt = parseInt(initialInstalls.replace(/[^0-9]/g, '')); // Remove non-numeric characters
        var diff = installsInt - initialInstallsInt;
        console.log('Diff:', diff);
        if (diff > 0) {
          statsElement.textContent = '+' + diff;
          statsElement.style.background = 'green';
          statsElement.style.borderRadius = '5px';
          statsElement.style.color = 'gold';
        } else {
          statsElement.textContent = '⦁ ⦁ ⦁';
          statsElement.style.color = 'gray';
        }
        console.log('Stats element:', statsElement);
        var timeElement = card.querySelector('.grid.flex.rwrap .card.col.gap small:first-of-type +  small > [data-tooltip]');
console.log('Time element:', timeElement);
timeElement.parentNode.insertBefore(statsElement, timeElement.nextSibling);
console.log('StatsKeeper added:', statsElement);
}
});
}

// Function to clear all stats
function clearStats() {
console.log('Clearing all stats');
storage.clear();
var statsElements = document.querySelectorAll('.StatsKeeper');
statsElements.forEach(function(element) {
element.parentNode.removeChild(element);
});
}

// Get all cards and update the stats
var cards = document.querySelectorAll('.grid.flex.rwrap .card.col.gap');
console.log('Cards:', cards);
// loadStats(cards);
cards.forEach(function(card) {
  updateStats(card);
});

// Add a style to the page
   var style = document.createElement('style');
    style.innerHTML = `
.card-body:has(.StatsKeeper) span.author {
    position: relative ;
    display: inline-block ;
    width: 57% !important;
    top: 0vh ;
    margin: 0vh 0 0 0px ;
    padding: 2px 5px;
    font-size: 12px ;
    border-radius: 5px;
/*border: 1px solid yellow */
}

/* NUMB INTALLS */

.card-footer small.flex:nth-child(2) span.StatsKeeper:not([style="color: gray;"]) {
    position: absolute ;
    display: inline-block ;
    width: 120px ;
    height: 1.5vh ;
    line-height: 1.1vh ;

    margin: 3.2vh 0 0 -10px ;
    padding: 2px 5px;
    font-size: 12px ;
    border-radius: 5px;
    text-align: center ;
color: gold ;
/*border: 1px solid aqua;*/
}

/* 3 DOT = NOT INSATLL */

.card-footer small.flex:nth-child(2) span.StatsKeeper[style="color: gray;"] {
    position: absolute ;
    display: inline-block ;
    width: 40px ;
    height: 1.5vh;
    line-height: 0.9vh;
    margin: 3.1vh 0 0 25px ;
    padding: 2px 5px;
    font-size: 8px;
    border-radius: 5px;
    text-align: center;
color: silver
border: none;
border: 1px solid silver;
}

.ClearStatsButton {
    position: absolute;
    margin: 0 0 0 -150px;
    padding: 2px 5px;
    border-radius: 5px;
    font-size: 12px;
    cursor: pointer;
color: #fff;
background-color: #4CAF50;
border: none;
}
    `;
    document.head.appendChild(style);

// Add a button to clear all stats
var clearButton = document.createElement('button');
clearButton.textContent = 'Clear StatsKeeper';
clearButton.className = 'ClearStatsButton';
clearButton.onclick = clearStats;
var countElement = document.querySelector('#content section#styles .flex p.count');
countElement.parentNode.appendChild(clearButton);
})();
