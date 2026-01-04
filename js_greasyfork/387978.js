// ==UserScript==
// @name     Display UserBenchmark Old and Better Effective Speed
// @author   quanzi
// @version  0.2
// @description    Display old and new effective speeds side by side on UserBenchmark
// @grant    none
// @match    https://cpu.userbenchmark.com/Compare/*
// @require http://code.jquery.com/jquery-latest.js
// @namespace https://greasyfork.org/users/76976
// @downloadURL https://update.greasyfork.org/scripts/387978/Display%20UserBenchmark%20Old%20and%20Better%20Effective%20Speed.user.js
// @updateURL https://update.greasyfork.org/scripts/387978/Display%20UserBenchmark%20Old%20and%20Better%20Effective%20Speed.meta.js
// ==/UserScript==

$(document).ready(function() {
  var tds = document.getElementById("primaryavgtable").getElementsByTagName("td");
  var values = new Array(0);
  for(var i = 0; i < tds.length; i++){
    var td = tds[i];
    if (td.className == "comp-valuecell") {
      var value = parseInt(td.innerText.replace(' Pts',''),10);
      values.push(value);
    }
	}
  var left = new Array(0);
  var right = new Array(0);
  
  left.push(values[0]); left.push(values[2]); left.push(values[4]);
  right.push(values[1]); right.push(values[3]); right.push(values[5]);
  
  var leftScore = left[0]*30+left[1]*60+left[2]*10;
  var rightScore = right[0]*30+right[1]*60+right[2]*10;
  
  var effectiveContent = document.getElementById("effectivespeedtable");
  var effectiveHeader = effectiveContent.parentElement;
  
  var effectiveRight = effectiveHeader.getElementsByClassName("innercolright")[0];
  var effectiveLeft = effectiveHeader.getElementsByClassName("innercolleft")[0];
  
  var newDifference = 0;
  if (leftScore > rightScore) {
    newDifference = Math.round((leftScore/rightScore)*100)-100;
    effectiveLeft.innerHTML = "+" + newDifference + "% " + "<span class='percbar-comparison-header pc-ani' style='width:" + newDifference + "%' zoompage-fontsize='17'></span>" + "<br>" + effectiveLeft.innerHTML;
    effectiveRight.innerHTML = "<br>" + effectiveRight.innerHTML;
  } else {
    newDifference = Math.round((rightScore/leftScore)*100)-100;
    effectiveRight.innerHTML = "+" + newDifference + "% " + "<span class='percbar-comparison-header pc-ani' style='width:" + newDifference + "%' zoompage-fontsize='17'></span>" + "<br>" + effectiveRight.innerHTML;
    effectiveLeft.innerHTML = "<br>" + effectiveLeft.innerHTML
  }

      var leftScore = left[0]*40+left[1]*40+left[2]*20;
  var rightScore = right[0]*40+right[1]*40+right[2]*20;

  var effectiveContent = document.getElementById("effectivespeedtable");
  var effectiveHeader = effectiveContent.parentElement;

  var effectiveDescription = effectiveHeader.getElementsByClassName("compthcol comp-headercol")[0];
  effectiveDescription.innerHTML = "Really Balanced Effective Speed" + "<span class='caret caret-large' zoompage-fontsize='17' googl='true'></span>" + "Balanced Effective Speed" + "<span class='caret caret-large' zoompage-fontsize='17' googl='true'></span>" + "<br>SC-Heavy Effective Speed";


  var effectiveRight = effectiveHeader.getElementsByClassName("innercolright")[0];
  var effectiveLeft = effectiveHeader.getElementsByClassName("innercolleft")[0];

  var newDifference = 0;
  if (leftScore > rightScore) {
    newDifference = Math.round((leftScore/rightScore)*100)-100;
    effectiveLeft.innerHTML = "+" + newDifference + "% " + "<span class='percbar-comparison-header pc-ani' style='width:" + newDifference + "%' zoompage-fontsize='17'></span>" + "<br>" + effectiveLeft.innerHTML;
    effectiveRight.innerHTML = "<br>" + effectiveRight.innerHTML;
  } else {
    newDifference = Math.round((rightScore/leftScore)*100)-100;
    effectiveRight.innerHTML = "+" + newDifference + "% " + "<span class='percbar-comparison-header pc-ani' style='width:" + newDifference + "%' zoompage-fontsize='17'></span>" + "<br>" + effectiveRight.innerHTML;
    effectiveLeft.innerHTML = "<br>" + effectiveLeft.innerHTML
  }
});