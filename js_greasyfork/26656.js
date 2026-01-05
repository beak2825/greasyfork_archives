// ==UserScript==
// @name         Edgemax TrafficAnalysis
// @version      0.4
// @description  Adds auto sort to TrafficAnalysis and changes TX and RX to Upload and Download
// @author       You
// @include      https://192.168.1.1*
// @grant        none
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/26656/Edgemax%20TrafficAnalysis.user.js
// @updateURL https://update.greasyfork.org/scripts/26656/Edgemax%20TrafficAnalysis.meta.js
// ==/UserScript==

document.body.innerHTML = document.body.innerHTML.replace('Rx Rate', 'Download Rate');
document.body.innerHTML = document.body.innerHTML.replace('Rx Bytes', 'Total Download');
document.body.innerHTML = document.body.innerHTML.replace('Rx Bytes', 'Total Download');
document.body.innerHTML = document.body.innerHTML.replace('Tx Rate', 'Upload Rate');
document.body.innerHTML = document.body.innerHTML.replace('Tx Bytes', 'Total Upload');
document.body.innerHTML = document.body.innerHTML.replace('Tx Bytes', 'Total Upload');
var checkbox;

var checkbox1;

var checkExist = setInterval(function() {
 if ($('#DataTables_Table_1_wrapper').length) {
  DoMeEverySecond2();
  var timerVar = setInterval(function() {
   DoMeEverySecond();
  }, 1500);
  clearInterval(checkExist);
 }
}, 100); // check every 100ms

function DoMeEverySecond2() {
 var radio_home = document.getElementsByClassName("form options")[0];
 var newlabel = document.createElement("Span");
 newlabel.innerHTML = " || Auto Sort: ";
 radio_home.appendChild(newlabel);
 checkbox = document.createElement('input');
 checkbox.type = "checkbox";
 var labezl = document.createElement('labezl');
 labezl.appendChild(document.createTextNode(' Upload '));
 radio_home.appendChild(checkbox);
 radio_home.appendChild(labezl);
 checkbox1 = document.createElement('input');
 checkbox1.type = "checkbox";
 checkbox1.checked = true;
 var labelz2 = document.createElement('label');
 labelz2.appendChild(document.createTextNode(' Download '));
 radio_home.appendChild(checkbox1);
 radio_home.appendChild(labelz2);
}




function DoMeEverySecond() {
 if (checkbox1.checked === true) {
  document.querySelector('.rx.sorting.ui-state-default').click();
  document.querySelector('.rx.sorting.ui-state-default').click();
 }
 if (checkbox.checked === true) {
  document.querySelector('.tx.sorting.ui-state-default').click();
  document.querySelector('.tx.sorting.ui-state-default').click();
 }

}
