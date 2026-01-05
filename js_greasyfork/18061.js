// ==UserScript==
// @name           Średninator
// @namespace      http://przemub.pl
// @include        https://nasze.miasto.gdynia.pl/ed_miej/zest_ed_oceny_ucznia_szczegoly.pl*
// @version        0.3b
// @grant          none
// @description:pl Kalkulator średnich ocen na gdyńskim serwerze e-dziennika.
// @license        MIT
// @description Kalkulator średnich ocen na gdyńskim serwerze e-dziennika.
// @downloadURL https://update.greasyfork.org/scripts/18061/%C5%9Aredninator.user.js
// @updateURL https://update.greasyfork.org/scripts/18061/%C5%9Aredninator.meta.js
// ==/UserScript==

// Copyright (c) 2016 Przemysław Buczkowski

function srednia() {
  var rowy = document.getElementsByClassName("dataRow");
  var i;
  
  var kol = document.getElementsByClassName("colsSortLab");
  var kol_wart, kol_waga, kol_liczona;
  for (i = 0; i < kol.length; i++) {
   if (kol[i].innerHTML.indexOf("Wartość") > -1) 
     kol_wart = i;
    else if (kol[i].innerHTML.indexOf("Waga") > -1)
      kol_waga = i;
    else if (kol[i].innerHTML.indexOf("liczona") > -1)
      kol_liczona = i;
  }
  
  var l = 0.0;
  var m = 0.0;
  for (i = 0; i < rowy.length; i++) {
   if (rowy[i].cells.item(kol_liczona).innerHTML.indexOf("Nie") > -1)
     continue;
   
   var waga = parseFloat(rowy[i].cells.item(kol_waga).innerHTML);
   l += parseFloat(rowy[i].cells.item(kol_wart).innerHTML) * waga;
   m += waga;
  }
  
  var tab = document.getElementById("gridTable");
  var row = tab.insertRow(tab.rows.length);
  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1);
  var cell3 = row.insertCell(2);
  
  var sred = Math.round(l/m*100);
  cell1.innerHTML = "Średnia: " + Math.round(l/m*100) + "%<br>";
  
  if (sred < 40)
    cell3.innerHTML = 'Hoho, <span style="color:red">pała!</span>';
  else if (sred < 56)
    cell3.innerHTML = 'Ho, jakoś <font color=#ff0000>z</font><font color=#da6924>d</font><font color=#b6c048>a</font><font color=#91f46d>j</font><font color=#6dfc91>e</font><font color=#48d6b6>s</font><font color=#2489da>z</font>!';
  else if (sred < 71)
    cell3.innerHTML = '<span style="color:orange">Dostatecznie</span>, ale stabilnie!';
  else if (sred < 85)
    cell3.innerHTML = 'Jest <span style="color:green">dobrze!</span>';
  else if (sred < 96)
    cell3.innerHTML = '<font color=#ff0000>B</font><font color=#e93f15>a</font><font color=#d47a2a>r</font><font color=#bfad3f>d</font><font color=#aad655>z</font><font color=#94f16a>o</font> <font color=#6afa94>d</font><font color=#55e7aa>o</font><font color=#3fc6bf>b</font><font color=#2a98d4>r</font><font color=#1561e9>y</font>!';
  else
   cell3.innerHTML = 'Przebijasz skalę.<br>Uścisk dłoni Prezesa jest <b>Twój</b>.';
}

srednia();
