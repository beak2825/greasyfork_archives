// ==UserScript==
// @name        Pardus Goods Unpacker
// @namespace   fear.math@gmail.com
// @description Quickly unpacks a preset number of bots or drugs at the press of a hotkey.
// @include     http*://*.pardus.at/main.php*
// @include     http*://*.pardus.at/pack_goods.php*
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/17400/Pardus%20Goods%20Unpacker.user.js
// @updateURL https://update.greasyfork.org/scripts/17400/Pardus%20Goods%20Unpacker.meta.js
// ==/UserScript==

// --------User Variables--------

//Set which keys you want to use to unpack bots and drugs.
var bot_key = "O";
var drug_key = "P";

//Choose the number of bots and drugs you'd like to unpack on each keypress. You'll withdraw as many as you have available and can hold up to that amount, so choose 999 if you just want to withdraw as many as possible.
var bot_amount = 5;
var drug_amount = 5;

// ------End User Variables------

window.addEventListener('keydown', unpackGoods);

function unpackGoods(e) {
  if (String.fromCharCode(e.keyCode) == bot_key || String.fromCharCode(e.keyCode) == drug_key) {
    if (location.href.indexOf("pack_goods") === -1) {
      location.assign(location.href.substr(0,location.href.indexOf("pardus.at")+9) + "/pack_goods.php");
  	} else {
      var button = document.getElementById("btn_unpack");
	  if (String.fromCharCode(e.keyCode) == bot_key) {
        var tons = calcNumToBeUnpacked("Robots");
        document.getElementById("packed_8").value = tons;
      } else {
        var tons = calcNumToBeUnpacked("Drugs");
        document.getElementById("packed_51").value = tons;
      }
      document.getElementById("btn_unpack").click();
    }
  }
}

function calcNumToBeUnpacked(type) {
  //find the amount of free space
  var tables = document.getElementsByTagName("table");
  var freeText = tables[4].rows[tables[4].rows.length-1].cells[1].innerHTML;
  freeText = freeText.substr(0,freeText.indexOf("<")); //remove excess
  if (freeText.indexOf("+") > -1) { //trim the " + 150" if magscoop is open
    var free = parseInt(freeText.substr(0,freeText.indexOf("+")-1));
  } else {
    var free = parseInt(freeText);
  }
  
  //find the total number packed and the space they'll take up unpacked
  var packed = unsafeWindow.tPacked;
  var unpacked = unsafeWindow.numPacked;
  
  //find the number of tons of the good available to unpack
  var rows = tables[5].rows;
  for (var i=1; i < rows.length; i++) {
    if (rows[i].cells[1].innerHTML === type) {
      var available = rows[i].cells[2].firstChild.innerHTML;
      break;
    }
  }
  
  //find preset amount to unpack if possible
  if (type === "Robots") {
    var amount = bot_amount;
  } else {
    var amount = drug_amount;
  }
  
  //find the packing ratio
  var packRatio = unsafeWindow.getPackFactor();
  
  //find the maximum number of tons that can be unpacked
  for (var i=0; i<=amount; i++) {
    if ((i + Math.floor((unpacked-i)*packRatio+0.5) - packed) > free) {
      break;
    }
    var max = i;    
  }
  
  return Math.min(max, available);
}
