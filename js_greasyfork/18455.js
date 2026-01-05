// ==UserScript==
// @name        wrtbwmon Total Display
// @namespace   wrtbwmon total display
// @description Appends the Download and Upload totals to the default table for wrtbwmon.
// @include     http://192.168.1.1/cgi-bin/usage
// @include     http://192.168.1.1/usage.htm
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/18455/wrtbwmon%20Total%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/18455/wrtbwmon%20Total%20Display.meta.js
// ==/UserScript==
var oTable = document.getElementsByTagName('tbody');
var oRows = oTable[0].getElementsByTagName('tr');
var downloadTotal = 0;
var uploadTotal = 0;
var totalTotal = 0;
for (i = 1; i < oRows.length; i++) {
  var oCells = oRows[i].getElementsByTagName('td');
  if (oCells[1].innerHTML.endsWith('M') == true) {
    var download = parseFloat(oCells[1].innerHTML) / 1000;
  } else if (oCells[1].innerHTML.endsWith('k') == true) {
    var download = parseFloat(oCells[1].innerHTML) / 1000000;
  } else {
    var download = parseFloat(oCells[1].innerHTML);
  }
  if (oCells[2].innerHTML.endsWith('M') == true) {
    var upload = parseFloat(oCells[2].innerHTML) / 1000;
  } else if (oCells[2].innerHTML.endsWith('k') == true) {
    var upload = parseFloat(oCells[2].innerHTML) / 1000000;
  } else {
    var upload = parseFloat(oCells[2].innerHTML);
  }
  if (oCells[3].innerHTML.endsWith('M') == true) {
    var total = parseFloat(oCells[3].innerHTML) / 1000;
  } else if (oCells[3].innerHTML.endsWith('k') == true) {
    var total = parseFloat(oCells[3].innerHTML) / 1000000;
  } else {
    var total = parseFloat(oCells[3].innerHTML);
  }
  downloadTotal = downloadTotal + download;
  uploadTotal = uploadTotal + upload;
  totalTotal = totalTotal + total;
}
downloadTotal = Math.floor(downloadTotal * 1000) / 1000;
uploadTotal = Math.floor(uploadTotal * 1000) / 1000;
totalTotal = Math.floor(totalTotal * 1000) / 1000;
oTable[0].insertAdjacentHTML('beforeend', '<tr><td><b><h2>Total:</h2></b></td><td>' + downloadTotal + ' G</td><td>' + uploadTotal + ' G</td><td>' + totalTotal + ' G</td><td></td><td></td>')
