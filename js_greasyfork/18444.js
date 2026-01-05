// ==UserScript==
// @name        UnipaSorter
// @namespace   magicleonSorter
// @include     https://immaweb.unipa.it/immaweb/private/docenti/esami/include/contenutiInsegnamentoMaterialeDidattico.seam*
// @version     3
// @grant       none
// @description This script sorts the table entry of the download section in the students portal from the University of Palermo
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
//@require http://tablesorter.com/addons/pager/jquery.tablesorter.pager.js
// @downloadURL https://update.greasyfork.org/scripts/18444/UnipaSorter.user.js
// @updateURL https://update.greasyfork.org/scripts/18444/UnipaSorter.meta.js
// ==/UserScript==
// Author: Antonello Galipò

//prendo la tabella di interesse
//tableRows = $('table[id="j_id71:materialeDidatticoList"] tr');
//è stata riscontrata una variazione dell'ID della tabella, ho modificato la presa del riferimento alla tabella di interesse col seguente statement
tableRows = $('table:has(thead) tr')
//elimino l'heading
tableRows.splice(0, 1);
//banale bubblesort per ordinare le righe cronologicamente
var swapped;
do {
  swapped = false;
  for (var i = 0; i < tableRows.length - 1; i++) {
    if (getDateFromRow(i) < getDateFromRow(i + 1)) {
      //console.log("swapping");
      swapRows(tableRows.eq(i), tableRows.eq(i + 1));
      swapped = true;
    }
  }
} while (swapped);


//swappa due <tr>
function swapRows(x, y) {
  xhtml = x.html();
  x.html(y.html());
  y.html(xhtml);
}
//converte una stringa in data
function getDateFromString(dateString) {
  // console.log("input = " + dateString);
  x = dateString.split(' ');
  y = x[0].split('/');
  // console.log("x = " + x);
  // console.log("y = " + y);
  date = y[1] + '/' + y[0] + '/' + y[2] + ' ' + x[1];
  // console.log("date = " + date);
  return new Date(date);
}
//prende la data come stringa dalla colonna di pertinenza della riga n-esima
function getDateFromRow(n) {
  console.log('per n = ' + n);
  return getDateFromString(tableRows.eq(n).children().eq(0).text().replace(/\s+/g, ' ').trim());
}
