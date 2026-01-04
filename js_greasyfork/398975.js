// ==UserScript==
// @name        New coronavirus recoveries
// @description Adds a column for new daily coronavirus recoveries 
// @namespace   achaparro
// @match       https://www.worldometers.info/coronavirus/
// @grant       none
// @version     1.2
// @author      Alberto Chaparro
// @downloadURL https://update.greasyfork.org/scripts/398975/New%20coronavirus%20recoveries.user.js
// @updateURL https://update.greasyfork.org/scripts/398975/New%20coronavirus%20recoveries.meta.js
// ==/UserScript==
function addColumn(tableId)
{ 
  var tableHead = document.getElementById(tableId).tHead;
   
  var tableHeadRow = tableHead.rows[0];
  
  tableHeadRow.insertCell(6).outerHTML = "<th>New recoveries</th>"
  
  var tableBody = document.getElementById(tableId).tBodies[0];
  
  for (var i=0; i<tableBody.rows.length; i++) {
      insertNewRecoveries(tableBody.rows[i], getRecoveries(document.getElementById('main_table_countries_yesterday').tBodies[0]))
  }
  
  var tableTotalBody = document.getElementById(tableId).tBodies[1];
  
  for (var i=0; i<tableTotalBody.rows.length; i++) {
      insertNewRecoveries(tableTotalBody.rows[i], getRecoveries(document.getElementById('main_table_countries_yesterday').tBodies[1]))
  }
}

function getCountryName(tdCell) {
  var linkCountry = tdCell.getElementsByTagName('a')

  if (linkCountry.length == 0) {
    return tdCell.innerHTML
  }
  else {
    return linkCountry[0].innerHTML
  }
}

function getRecoveries(tableBody) {
  var recoveriesMap = new Map()
  
  for (var i=0; i<tableBody.rows.length; i++) {
    let totalRecoveries = tableBody.rows[i].cells[5].innerHTML.replace(/,/g, '')
    
    recoveriesMap.set(getCountryName(tableBody.rows[i].cells[0]), totalRecoveries)
  }
  
  return recoveriesMap
}

function insertNewRecoveries(row, yesterdayRecoveries) {
  let recoveries = row.cells[5].innerHTML.replace(/,/g, '')
  
  let newCell = row.insertCell(6);
  
  let newRecoveries = recoveries - yesterdayRecoveries.get(getCountryName(row.cells[0]))
  
  if (newRecoveries != 0) {
    newCell.outerHTML = "<td style='font-weight: bold; text-align:right;background-color:limeGreen; color:white'>" + 
                        "+" + newRecoveries + "</td>"
  }
}

addColumn('main_table_countries_today')