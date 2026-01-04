// ==UserScript==
// @name        Daily values per capita
// @description Adds columns for new daily coronavirus information scaled per 1M population 
// @namespace   zamro
// @match       https://www.worldometers.info/coronavirus/
// @grant       none
// @version     0.1
// @author      Zamro, based on Alberto Chaparro script
// @downloadURL https://update.greasyfork.org/scripts/413611/Daily%20values%20per%20capita.user.js
// @updateURL https://update.greasyfork.org/scripts/413611/Daily%20values%20per%20capita.meta.js
// ==/UserScript==

function addColumnPerCapita(table, columnText) {
  var columnId = Array.from(table.tHead.rows[0].cells).findIndex(element => element.innerText.replace(/\s/g,"") == columnText)
  var popColumnId = Array.from(table.tHead.rows[0].cells).findIndex(element => element.innerText.replace(/\s/g,"") == 'Population')
  table.tHead.rows[0].insertCell(columnId+1).outerHTML = table.tHead.rows[0].cells[columnId].outerHTML
  table.tHead.rows[0].cells[columnId+1].innerText += "\n/1M pop"
    
  var rows = table.tBodies[0].rows;
  for (var i=0; i<rows.length; i++) {
      // insertNewRecoveries(rows[i], getRecoveries(document.getElementById('main_table_countries_yesterday').tBodies[0]))
    var row = rows[i]
    var val = parseInt(row.cells[columnId].innerText.replaceAll(",",""))
    var population = parseInt(row.cells[popColumnId].innerText.replaceAll(",",""))
    row.insertCell(columnId+1)
    if(!isNaN(val) && !isNaN(population) && population != 0)
    {
      row.cells[columnId+1].innerText = (val / population * 1000000).toFixed(2)
    }
  }
}

function addColumnsPerCapita(tableId) {
  var table = document.getElementById(tableId);
  addColumnPerCapita(table, 'NewCases');
  addColumnPerCapita(table, 'NewDeaths');
  addColumnPerCapita(table, 'ActiveCases');
}

// addColumn('main_table_countries_today')
addColumnsPerCapita('main_table_countries_today')
addColumnsPerCapita('main_table_countries_yesterday')
addColumnsPerCapita('main_table_countries_yesterday2')

