// ==UserScript==
// @name Scrape Unusual Whales Flow
// @namespace   Violentmonkey Scripts
// @author youngfranko
// @description 	This script will post Unusual Whales Data to a URL of my choosing.
// @grant 			none
// @version 		0.2
// @match 		https://unusualwhales.com/flow?*
// @downloadURL https://update.greasyfork.org/scripts/435924/Scrape%20Unusual%20Whales%20Flow.user.js
// @updateURL https://update.greasyfork.org/scripts/435924/Scrape%20Unusual%20Whales%20Flow.meta.js
// ==/UserScript==

setTimeout(() => {
  // add Button to Run Script
  let buttonToAppendNextTo = document.querySelector('.sc-dIUeWJ.cfGkDj > button:last-child')
  let buttonHtml =
    '<button type="button" id="runScript" class="btn gvaYMW btn-primary">Run Script</button>';
  buttonToAppendNextTo.insertAdjacentHTML('afterend', buttonHtml);

  // Add Event Listener to New Button
  let btn = document.getElementById('runScript');
  btn.addEventListener('click', () => {
    app();
  });
}, 2500);

function app() {
  let flowTableBody = document.querySelector('table > tbody');
  let flowTableRows = Array.from(flowTableBody.querySelectorAll('tr'));
  for (let i = 0; i < flowTableRows.length; i++) {
    const row = flowTableRows[i];
    let tableCellArray = Array.from(row.children);
    let rowObj = {};
    for (let z = 0; z < tableCellArray.length; z++) {
      const tableCell = tableCellArray[z];
      if (z === 1) {
        rowObj[1] = extractTicker(tableCell);
      } else if (z === 14) {
        rowObj.tags = extractTags(tableCell);
      } else {
        rowObj[z] = tableCell.innerText;
      }
    }
    addToDOM(rowObj);
  }
}

function extractTicker(tickerTableCell) {
  return tickerTableCell.getElementsByTagName('a')[0].innerText;
}
function extractTags(tagsTableCell) {
  if (tagsTableCell.innerText.match(/Bullish/g)) return 'Bullish';
  else return 'Bearish';
}

function addToDOM(rowObj) {
  var d = document;
  var o = document.getElementById('csvTextBox');

  if (o === null) {
    o = d.createElement('textarea');
    o.id = 'csvTextBox';
    o.style.cssText =
      'position:fixed;top:2%;padding:15px;left:3%;width:90%;height:10%;max-height:80%;z-index:999999 !important;border:4px solid #888;overflow-y:scroll;background-color:#f0f0f0;color:#000;font-size:10px; line-height:1em;';
    o.innerHTML = '';
  }

  for (const [key, value] of Object.entries(rowObj)) {
    o.innerHTML = o.innerHTML + value + ';';
  }
  o.innerHTML = o.innerHTML + '\r\n';
    o.innerHTML = o.innerHTML.replace(/;$/gm,"")

  if (o.innerHTML != '') d.body.appendChild(o);
 document.querySelector('.sc-jSgvzq.dXZAlu > button:nth-last-child(2)').click();
}
