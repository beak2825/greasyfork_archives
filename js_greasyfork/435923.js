// ==UserScript==
// @name Scrape Unusual Whales Hot Chains
// @namespace   Violentmonkey Scripts
// @author youngfranko
// @description 	This script will post Unusual Whales Data to a URL of my choosing.
// @grant 			none
// @version 		0.2
// @match 		https://unusualwhales.com/flow/hot_chains
// @downloadURL https://update.greasyfork.org/scripts/435923/Scrape%20Unusual%20Whales%20Hot%20Chains.user.js
// @updateURL https://update.greasyfork.org/scripts/435923/Scrape%20Unusual%20Whales%20Hot%20Chains.meta.js
// ==/UserScript==

setTimeout(() => {
  // add Button to Run Script
  let buttonToAppendNextTo = document.querySelector("#router-root > div.Flow_Container__3agfm.Flow_OnFlowPath__3Ro-_ > div.MuiContainer-root.MuiContainer-maxWidthXl > div:nth-child(2) > select:nth-child(3)")
  let buttonHtml =
    '<button type="button" id="runScript1" class="btn btn-primary">Run Script</button>';
  buttonToAppendNextTo.insertAdjacentHTML('afterend', buttonHtml);

  // Add Event Listener to New Button
  let btn = document.getElementById('runScript1');
  btn.addEventListener('click', () => {
    console.log('button clicked');
    app();
  });
}, 2000);

function app() {
  let tickerTableBody = document.querySelectorAll('table > tbody')[0];
  let tickerTableRows = Array.from(tickerTableBody.querySelectorAll('tr'));
  for (let i = 0; i < tickerTableRows.length; i++) {
    const row = tickerTableRows[i];
    let tableCellArray = Array.from(row.children);
    let rowObj = cleanTableCellArray(tableCellArray);
    addToDOM(rowObj);
  }
}

function cleanTableCellArray(tableCellArray) {
  let firstCell = createObjectFromChainCell(tableCellArray[0]);
  let secondCell = createObjectFromBidAskCell(tableCellArray[1]);
  let thirdCell = tableCellArray[2].innerText;
  let fourthCell = tableCellArray[3].innerText;
  let obj = {
    ticker: firstCell.ticker,
    strike: firstCell.strike,
    callOrPut: firstCell.callOrPut,
    expiration: firstCell.expiration,
    bid: secondCell.bid,
    ask: secondCell.ask,
    volume: thirdCell,
    openInterest: fourthCell,
  };
  return obj;
}

function createObjectFromChainCell(chainCell) {
  let obj = {};
  obj.ticker = chainCell.innerText.match(/[A-Z]{1,5}/)[0];
  obj.strike = chainCell.innerText.match(/([0-9.]{1,5})/)[0];
  obj.callOrPut = chainCell.innerText.match(/(?<![A-Z])[C,P]/)[0];
  obj.expiration = chainCell.innerText.match(
    /([0-1]{1}[0-9]{1}-{1}[0-9]{2})/
  )[0];
  return obj;
}
function createObjectFromBidAskCell(bidAskCell) {
  let obj = {};
  obj.bid = bidAskCell.innerText.match(/([0-9.]{2,5})/g)[0];
  obj.ask = bidAskCell.innerText.match(/([0-9.]{2,5})/g)[1];
  return obj;
}

function addToDOM(rowObj) {
  var d = document;
  var o = document.getElementById('csvTextBox');

  if (o === null) {
    o = d.createElement('textarea');
    o.id = 'csvTextBox';
    o.style.cssText =
      'position:fixed;top:2%;padding:15px;left:3%;width:90%;height:35%;max-height:80%;z-index:999999 !important;border:4px solid #888;overflow-y:scroll;background-color:#f0f0f0;color:#000;font-size:10px; line-height:1em;';
    o.innerHTML = '';
  }

  for (const [key, value] of Object.entries(rowObj)) {
    o.innerHTML = o.innerHTML + value + ';';
  }
  o.innerHTML = o.innerHTML + '\r\n';
  o.innerHTML = o.innerHTML.replace(/;$/gm,"")

  if (o.innerHTML != '') d.body.appendChild(o);
}
