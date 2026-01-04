// ==UserScript==
// @name Scrape Unusual Whales Alerts
// @namespace   Violentmonkey Scripts
// @author youngfranko
// @description 	This script will post Unusual Whales Data to a URL of my choosing.
// @grant 			none
// @version 		0.2
// @match 		https://unusualwhales.com/alerts
// @downloadURL https://update.greasyfork.org/scripts/435925/Scrape%20Unusual%20Whales%20Alerts.user.js
// @updateURL https://update.greasyfork.org/scripts/435925/Scrape%20Unusual%20Whales%20Alerts.meta.js
// ==/UserScript==

setTimeout(() => {
  // add Button to Run Script
  let buttonToAppendNextTo = document.querySelector("#router-root > div.separate-page-styling > div > div.sc-bdfBQB.eoAzRf > div.sc-jSgvzq.dXZAlu > button")
  let buttonHtml =
    '<button id="runScript" class="sc-jSgvzq gvaYMW btn btn-outline-secondary"><ion-icon name="information-circle-outline" role="img" class="md hydrated" aria-label="information circle outline"></ion-icon>Run Script</button>';
  buttonToAppendNextTo.insertAdjacentHTML('afterend', buttonHtml);

  // Add Event Listener to New Button
  let btn = document.getElementById('runScript');
  btn.addEventListener('click', () => {
    app();
  });
}, 2500);

 var d = document;
  var o = document.getElementById('csvTextBox');

  if (o === null) {
    o = d.createElement('textarea');
    o.id = 'csvTextBox';
    o.style.cssText =
      'position:fixed;top:2%;padding:15px;left:3%;width:90%;height:35%;max-height:80%;z-index:999999 !important;border:4px solid #888;overflow-y:scroll;background-color:#f0f0f0;color:#000;font-size:10px; line-height:1em;';
    o.innerHTML = '';
  } else {
    o.innerHTML = '';
  }


function app() {
  let flowTableBody = document.querySelector('table > tbody');
  let flowTableRows = Array.from(flowTableBody.querySelectorAll('tr'));
  for (let i = 0; i < flowTableRows.length; i++) {
    const row = flowTableRows[i];
    let tableCellArray = Array.from(row.children);
    let rowObj = {};
    for (let z = 0; z < tableCellArray.length; z++) {
      const tableCell = tableCellArray[z];
      if (z === 0) {
        rowObj[0] = extractTicker(tableCell);
        rowObj[1] = extractStrike(tableCell);
      } else if (z === 14) {
        rowObj[z] = extractTags(tableCell);
      } else if (z === 1) {
      } else if (z === 6) {
      } else if (z === 7) {
      } else if (z === 12) {
      } else if (z === 15) {
      } else {
        rowObj[z + 2] = tableCell.innerText;
      }
    }
    addToDOM(rowObj);
  }
}

function extractTicker(tickerTableCell) {
  return tickerTableCell.innerText.match(/[A-Z]+/g)[0];
}
function extractStrike(tickerTableCell) {
  return tickerTableCell.innerText.match(/\d+/g)[0];
}
function extractTags(tagsTableCell) {
  if (tagsTableCell.innerText.match(/Bullish/g)) return 'Bullish';
  else return 'Bearish';
}

function addToDOM(rowObj) {
 

  for (const [key, value] of Object.entries(rowObj)) {
    o.innerHTML = o.innerHTML + value + ';';
  }
  o.innerHTML = o.innerHTML + '\r\n';
    o.innerHTML = o.innerHTML.replace(/;$/gm,"")

  if (o.innerHTML != '') d.body.appendChild(o);
}
