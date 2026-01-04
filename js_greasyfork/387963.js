// ==UserScript==
// @name     Display UserBenchmark Old Effective Speed
// @author   quanzi
// @version  0.6
// @description    Display old and new effective speeds side by side on UserBenchmark
// @grant    none
// @match    https://cpu.userbenchmark.com/Compare/*
// @require http://code.jquery.com/jquery-latest.js
// @namespace https://greasyfork.org/users/76976
// @downloadURL https://update.greasyfork.org/scripts/387963/Display%20UserBenchmark%20Old%20Effective%20Speed.user.js
// @updateURL https://update.greasyfork.org/scripts/387963/Display%20UserBenchmark%20Old%20Effective%20Speed.meta.js
// ==/UserScript==

function getBenchArray(tableName) {
  var tds = document.getElementById(tableName).getElementsByTagName("td");
  var values = new Array(0);
  for(var i = 0; i < tds.length; i++){
    var td = tds[i];
    if (td.className == "comp-valuecell" && td.innerText.includes("Pts")) {
      var value = parseInt(td.innerText.replace(' Pts',''),10);
      values.push(value);
    }
	}
  return values;
}

function addMoreSpeed(speedName, left, right, addCaret) {
  var effectiveContent = document.getElementById("effectivespeedtable");
  var effectiveHeader = effectiveContent.parentElement;
  
  var effectiveDescription = effectiveHeader.getElementsByClassName("compthcol comp-headercol")[0];
  var caret = addCaret?"<span class='caret caret-large' googl='true'></span>":"";
  effectiveDescription.innerHTML = speedName + caret
    + "<br>" + effectiveDescription.innerHTML;
  
  var effectiveRight = effectiveHeader.getElementsByClassName("innercolright")[0];
  var effectiveLeft = effectiveHeader.getElementsByClassName("innercolleft")[0];
  
  var newDifference = 0;
  if (left > right) {
    newDifference = Math.round((left/right)*100)-100;
    effectiveLeft.innerHTML = "+" + newDifference + "% " + "<span class='percbar-comparison-header pc-ani' style='width:" + newDifference + "%' ></span>" + "<br>" + effectiveLeft.innerHTML;
    effectiveRight.innerHTML = "<br>" + effectiveRight.innerHTML;
  } else {
    newDifference = Math.round((right/left)*100)-100;
    effectiveRight.innerHTML = "+" + newDifference + "% " + "<span class='percbar-comparison-header pc-ani' style='width:" + newDifference + "%' ></span>" + "<br>" + effectiveRight.innerHTML;
    effectiveLeft.innerHTML = "<br>" + effectiveLeft.innerHTML;
  }
}

function modifySpeed(tableName, newDifference) {
  var content = document.getElementById(tableName);
  var header = content.parentElement;
  
  var speedRight = header.getElementsByClassName("innercolright")[0];
  var speedLeft = header.getElementsByClassName("innercolleft")[0];
  
  if (newDifference > 0) {
    speedLeft.innerHTML = "+" + newDifference + "% " + "<span class='percbar-comparison-header pc-ani' style='width:" + newDifference + "%' ></span>";
    speedRight.innerHTML = "";
  } else {
    speedRight.innerHTML = "+" + Math.abs(newDifference) + "% " + "<span class='percbar-comparison-header pc-ani' style='width:" + Math.abs(newDifference) + "%' ></span>";
    speedLeft.innerHTML = "";
  }
}

$(document).ready(function() {
  
  // Remove "Game Effective Fps" if exists
  var removeGameEffectiveSpeed = true;
  
  if (removeGameEffectiveSpeed) {
    var divEFps = document.getElementById("videotable");
    if (divEFps != null)
    	divEFps.parentElement.remove();
  }
  
  // Move 64-Core Speeds to primary table
  var move64CoreToPrimary = true;
  
  // Set your preferred ratios here
  var ratio1 = 30;
  var ratio2 = 0;
  var ratio4 = 60;
  var ratio8 = 0;
  var ratio64 = 10;
  
    
  var values = getBenchArray("primaryavgtable");
  var values2nd = getBenchArray("secondarytable");
  var valuesOC = getBenchArray("primarytable");
    
  var left1 = values[0], right1 = values[1], left1OC = valuesOC[0], right1OC = valuesOC[1];
  var left2 = values[2], right2 = values[3], left2OC = valuesOC[2], right2OC = valuesOC[3];
  var left4 = values[4], right4 = values[5], left4OC = valuesOC[4], right4OC = valuesOC[5];
  var left8 = values[6], right8 = values[7], left8OC = valuesOC[6], right8OC = valuesOC[7];
  var left64 = values2nd[2], right64 = values2nd[3], left64OC = values2nd[0], right64OC = values2nd[1];
  
  
  var leftEffective = left1*ratio1 + left2*ratio2 + left4*ratio4 + left8*ratio8 + left64*ratio64;
  var rightEffective = right1*ratio1 + right2*ratio2 + right4*ratio4 + right8*ratio8 + right64*ratio64;
  var leftOCEffective = left1OC*ratio1 + left2OC*ratio2 + left4OC*ratio4 + left8OC*ratio8 + left64OC*ratio64;
  var rightOCEffective = right1OC*ratio1 + right2OC*ratio2 + right4OC*ratio4 + right8OC*ratio8 + right64OC*ratio64;
  
  // For debugging purposes
  //alert(leftEffective);alert(rightEffective);
  //alert(leftOCEffective);alert(rightOCEffective);
  
  document.getElementById("effectivespeedtable").parentElement.getElementsByClassName("compthcol comp-headercol")[0].innerText = "SC-Heavy Effective Speed";
  
  addMoreSpeed("Balanced OC Effective Speed", leftOCEffective, rightOCEffective, false);
  addMoreSpeed("Balanced Effective Speed", leftEffective, rightEffective, true);
  
  if (move64CoreToPrimary) {
    var trs = document.getElementById("secondarytable").getElementsByTagName("tr");
    document.getElementById("primaryavgtable").getElementsByTagName("tbody")[0].append(trs[trs.length-1]);
    document.getElementById("primarytable").getElementsByTagName("tbody")[0].append(trs[trs.length-1]);
    
    // Recalculating
    
    // "Wrong" formula, it's not actually based on the difference between total points...
    //modifySpeed("primaryavgtable", left1+left2+left4+left8+left64, right1+right2+right4+right8+right64);
    //modifySpeed("primarytable", left1OC+left2OC+left4OC+left8OC+left64OC, right1OC+right2OC+right4OC+right8OC+right64OC);
    
    // ...but on the average difference of each point category
    var avgDifference = Math.round((Math.round(100*(left1>right1?(left1/right1-1):-(right1/left1-1)))
                      + Math.round(100*(left2>right2?(left2/right2-1):-(right2/left2-1)))
                      + Math.round(100*(left4>right4?(left4/right4-1):-(right4/left4-1)))
                      + Math.round(100*(left8>right8?(left8/right8-1):-(right8/left8-1)))
                      + Math.round(100*(left64>right64?(left64/right64-1):-(right64/left64-1))))/5);
    //alert(avgDifference);
    
    var avgOCDifference = Math.round((Math.round(100*(left1OC>right1OC?(left1OC/right1OC-1):-(right1OC/left1OC-1)))
                      + Math.round(100*(left2OC>right2OC?(left2OC/right2OC-1):-(right2OC/left2OC-1)))
                      + Math.round(100*(left4OC>right4OC?(left4OC/right4OC-1):-(right4OC/left4OC-1)))
                      + Math.round(100*(left8OC>right8OC?(left8OC/right8OC-1):-(right8OC/left8OC-1)))
                      + Math.round(100*(left64OC>right64OC?(left64OC/right64OC-1):-(right64OC/left64OC-1))))/5);
    //alert(avgOCDifference);
          
    modifySpeed("primaryavgtable", avgDifference);
    modifySpeed("primarytable", avgOCDifference);
  }
});