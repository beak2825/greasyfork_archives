// ==UserScript==
// @name        Stock In like a Boss
// @namespace   Violentmonkey Scripts
// @include     http://192.168.1.182/inventory/stockIn.asp*
// @grant       none
// @run-at      document-idle
// @description   Violentmonkey Scripts
// @version 0.0.1.20210619071131
// @downloadURL https://update.greasyfork.org/scripts/428170/Stock%20In%20like%20a%20Boss.user.js
// @updateURL https://update.greasyfork.org/scripts/428170/Stock%20In%20like%20a%20Boss.meta.js
// ==/UserScript==

var title = document.getElementsByClassName("hdr")[0];

var pricelist = document.getElementsByClassName("row20px")[0].getElementsByTagName("tr");

function locationrr() {
  // for (var i = 0; i < pricelist.length; i++) {
  //   var td = pricelist[i].getElementsByTagName("td");
  //   if (td.length > 10) {
  //     if (td[11].innerHTML == "none - none") {
  //       td[11].innerHTML = "RR - RF Tech In/Out Place";
  //       td[11].title = "RR - RF Tech In/Out Place";
  //       gridBasic.cells(i, giColLocation).setValue("RR - RF Tech In/Out Place");
  //     }
  //   }
  // }
  for (var j = 1 ; j <= gridBasic.getRowsNum(); j++) {
    temp1 = gridBasic.cells(j, giColLocation).getValue();
      if (temp1.length == 0 || temp1 == "none"){
        gridBasic.cells(j, giColLocation).setValue("RR");
      }
  }
}

function pona() {
  for (var j = 1 ; j <= gridBasic.getRowsNum(); j++) {
    temp1 = gridBasic.cells(j, giColPONo).getValue();
      if (temp1.length == 0){
        gridBasic.cells(j, giColPONo).setValue("N/A");
      }
  }
}

function ppd() {
  for (var j = 1 ; j <= gridBasic.getRowsNum(); j++) {
    gridBasic.cells(j, giColVendor).setValue("3010004");
  }
}

function wo() {
  var wo = prompt("Please enter Work Order","");
  wo = wo.toUpperCase();
  for (var j = 1 ; j <= gridBasic.getRowsNum(); j++) {
    gridBasic.cells(j, giColPurpose).setValue("WO-" + wo + "-");
  }
}

var btn1 = document.createElement('input');
btn1.type = "button";
btn1.value = "RR";
btn1.onclick = locationrr;

var btn2 = document.createElement('input');
btn2.type = "button";
btn2.value = "N/A";
btn2.onclick = pona;

var btn3 = document.createElement('input');
btn3.type = "button";
btn3.value = "PPD";
btn3.onclick = ppd;

var btn4 = document.createElement('input');
btn4.type = "button";
btn4.value = "WO";
btn4.onclick = wo;

title.getElementsByTagName("td")[11].appendChild(btn1);
title.getElementsByTagName("td")[13].appendChild(btn2);
title.getElementsByTagName("td")[15].appendChild(btn3);
title.getElementsByTagName("td")[16].appendChild(btn4);
