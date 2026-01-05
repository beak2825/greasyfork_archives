// ==UserScript==
// @name        Citysatoshi and Cannonsatoshi Alerter
// @description Show fuels and foods in tabs and show a popup when your fuels is below 50% and 25%
// @namespace   HPrivakosScripts
// @include     *://citysatoshi.com/*
// @include     *://cannonsatoshi.com/*
// @version     1.02
// @grant       none
// @author      HPrivakos
// @downloadURL https://update.greasyfork.org/scripts/16368/Citysatoshi%20and%20Cannonsatoshi%20Alerter.user.js
// @updateURL https://update.greasyfork.org/scripts/16368/Citysatoshi%20and%20Cannonsatoshi%20Alerter.meta.js
// ==/UserScript==

var maximum = $(".text_max")[0].innerHTML.substring(5, 100);
console.log(maximum + "->");
var max = maximum.replace(/ /g, "");
console.log("To ->" + max);
var VarName = "None";
var VarFuel = "None";
var FuelName = "None";
var alert50 = 0;
var alert25 = 0;
console.log(max);

if(document.domain == "citysatoshi.com"){
  var FuelName = "bread";
  var VarName = "CitySatoshi";
  var VarFuel = "warehouse of bread";
}
else{
  var FuelName = "gallons";
  var VarName = "CannonSatoshi";
  var VarFuel = "tank of oil";
}

Fuel();

function Fuel(){
  var fuel2 = document.getElementById('fuel_value').innerHTML;
  var fuel = fuel2.replace(/ /g, "");
  fuel = fuel.replace(/,/g, "");
  var percentage = fuel/max * 100;
  var percentageround = Math.round(percentage);
  console.log(fuel);
  document.title = fuel + " " + FuelName + " - " + percentageround + "% - " + VarName;
  setTimeout(function(){ Fuel(); }, 5000);
  if(percentageround<51 && percentageround>46 && alert50 === 0){
    alert("Your " + VarFuel + " is below 50%");
    alert50 = alert50 + 1;
  }
  else if(percentageround<26 && percentageround>21 && alert25 === 0){
    alert("Your " + VarFuel + " is below 25%");
    alert25 = alert25 + 1;
  }
}