// ==UserScript==
// @name        World Contagion Stock Estimation
// @namespace   World Contagion
// @include     http://www.worldcontagion.com/contagion/*
// @version     0.1
// @grant       none
// @description Adds a time estimation for the stock to be full
// @downloadURL https://update.greasyfork.org/scripts/5160/World%20Contagion%20Stock%20Estimation.user.js
// @updateURL https://update.greasyfork.org/scripts/5160/World%20Contagion%20Stock%20Estimation.meta.js
// ==/UserScript==
var elems = document.getElementsByClassName("help");

for(var i=0; i<3; i++) {
  var temp = elems[i].title;
  temp = temp.replace(/ /g,'');
  var x = temp.match(/\d+/g);
  elems[i].title += "<br />Stock plein dans " + getTimeBeforeFullStock(parseInt(x[1]),parseInt(x[4]),parseInt(x[5])); 
}

function getTimeBeforeFullStock(hourlyProduction, actualStock, maxStock) {
  var prodPerMin = hourlyProduction/60;
  var minutes = 0;

  while(actualStock < maxStock) {
    actualStock += prodPerMin;
    minutes++;
  }

  if(minutes < 60) return minutes + " minutes";
  else if(minutes < 1440) return Math.floor(minutes/60) + " heures " + minutes%60 + " minutes";
  else return Math.floor(minutes/1440) + " jours " + Math.floor((minutes%1440)/60) + " heures " + minutes%60 + " minutes";
}