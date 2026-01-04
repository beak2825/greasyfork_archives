// ==UserScript==
// @name Scrape Unusual Whales Hot Tickers
// @namespace   Violentmonkey Scripts
// @author youngfranko
// @description 	This script will post Unusual Whales Data to a URL of my choosing.
// @grant 			none
// @version 		0.2
// @match 		https://unusualwhales.com/flow/hot_chains
// @downloadURL https://update.greasyfork.org/scripts/435922/Scrape%20Unusual%20Whales%20Hot%20Tickers.user.js
// @updateURL https://update.greasyfork.org/scripts/435922/Scrape%20Unusual%20Whales%20Hot%20Tickers.meta.js
// ==/UserScript==

setTimeout(() => {
  // add Button to Run Script
  let buttonToAppendNextTo = document.querySelector(
    '#router-root > div > div.container-fluid > div:nth-child(3) > div:nth-child(1) > div.row.react-bootstrap-table-pagination'
  );
  let buttonHtml =
    '<button type="button" id="runScript" class="btn btn-primary">Run Script</button>';
  buttonToAppendNextTo.insertAdjacentHTML('afterend', buttonHtml);

  // Add Event Listener to New Button
  let btn = document.getElementById('runScript');
  btn.addEventListener('click', () => {
    console.log('button clicked')
    app();
  });
}, 2000);

function app() {
  let tickerTableBody = document.querySelector('table > tbody');
  let tickerTableRows = Array.from(tickerTableBody.querySelectorAll('tr'));
  for (let i = 0; i < tickerTableRows.length; i++) {
    const row = tickerTableRows[i];
    let tableCellArray = Array.from(row.children);
    let rowObj = cleanTableCellArray(tableCellArray);
    if (checkUnusualDrippyCriteria(rowObj)) {
      addToDOM(rowObj);
    }
  }
}

function cleanTableCellArray(tableCellArray) {
  let ticker = tableCellArray[0];
  let callVol = tableCellArray[1];
  let putVol = tableCellArray[2];
  let callVolumePercentageOfTotal = tableCellArray[3];
  let callPremiumPercent = tableCellArray[4];
  [callVolume, callVolPercentVsYesterday] = filterCallVol(callVol);
  [putVolume, putVolPercentVsYesterday] = filterPutVol(putVol);
  [todayCallVolumeTotalPercent, yesterdayCallVolumeTotalPercent] =
    filterCallVolumePercentageOfTotal(callVolumePercentageOfTotal);
  [todayCallPremiumPercentage, yesterdayCallPremiumPercentage] =
    filterCallPremiumPercentageOfTotal(callPremiumPercent);
  [tickerLink, tickerSymbol] = filterTicker(ticker);
  let obj = {
    tickerSymbol: tickerSymbol,
    tickerLink: tickerLink,
    callVolume: Number(callVolume.replace(/,/g, '')),
    callVolPercentVsYesterday: Number(callVolPercentVsYesterday),
    putVolume: Number(putVolume.replace(/,/g, '')),
    putVolPercentVsYesterday: Number(putVolPercentVsYesterday),
    todayCallVolumeTotalPercent: Number(todayCallVolumeTotalPercent),
    yesterdayCallVolumeTotalPercent: Number(yesterdayCallVolumeTotalPercent),
    todayCallPremiumPercentage: Number(todayCallPremiumPercentage),
    yesterdayCallPremiumPercentage: Number(yesterdayCallPremiumPercentage),
  };
  return obj;
}

function filterTicker(ticker) {
  let arr = [];
  let tickerLink = ticker.getElementsByTagName('a')[0].href;
  arr.push(tickerLink);
  let tickerSymbol = ticker.innerText;
  tickerSymbol = tickerSymbol.replace('$', '');
  arr.push(tickerSymbol);
  return arr;
}

function filterCallVol(callVol) {
  let arr = [];
  let callVolume = callVol.getElementsByTagName('span')[0].innerText;
  arr.push(callVolume);
  let callVolPercent = callVol.childNodes[2].nodeValue;
  callVolPercent = callVolPercent.replace('%', '');
  arr.push(callVolPercent);
  return arr;
}

function filterPutVol(putVol) {
  let arr = [];
  let putVolume = putVol.getElementsByTagName('span')[0].innerText;
  arr.push(putVolume);
  let putVolPercent = putVol.childNodes[2].nodeValue;
  putVolPercent = putVolPercent.replace('%', '');
  arr.push(putVolPercent);
  return arr;
}

function filterCallVolumePercentageOfTotal(callVolumeTotalPercent) {
  let arr = [];
  let callVolumePercentageOfTotal =
    callVolumeTotalPercent.getElementsByTagName('span')[0].innerText;
  callVolumePercentageOfTotal = callVolumePercentageOfTotal.replace('%', '');
  arr.push(callVolumePercentageOfTotal);
  let callVolumePercentageOfTotalPercent =
    callVolumeTotalPercent.getElementsByTagName('span')[1].innerText;
  callVolumePercentageOfTotalPercent =
    callVolumePercentageOfTotalPercent.replace(/[\(\)%]/g, '');
  arr.push(callVolumePercentageOfTotalPercent);
  return arr;
}
function filterCallPremiumPercentageOfTotal(callPremiumPercentage) {
  let arr = [];
  let callPremiumPercentTotal =
    callPremiumPercentage.getElementsByTagName('span')[0].innerText;
  callPremiumPercentTotal = callPremiumPercentTotal.replace('%', '');
  arr.push(callPremiumPercentTotal);
  let callPremiumPercentTotalPercent =
    callPremiumPercentage.getElementsByTagName('span')[1].innerText;
  callPremiumPercentTotalPercent = callPremiumPercentTotalPercent.replace(
    /[\(\)%]/g,
    ''
  );
  arr.push(callPremiumPercentTotalPercent);
  return arr;
}

// Criteria To Check
let callVolumeMin = 20000;
let callVolPercentVsYesterdayMin = 200;
let todayCallVolumeTotalPercentMin = 70;
let yesterdayCallVolumeTotalPercentMin = 60;
let todayCallPremiumPercentageMin = 70;
let yesterdayCallPremiumPercentageMin = 50;

// Stocks to be filtered out
let stocksToIgnore = [
  'PWR',
  'DAR',
  'HAS',
  'SYF',
  'FOXA',
  'WAB',
  'JEF',
  'XPO',
  'EFX',
  'SPGI',
  'HWM',
  'EXC',
  'DBX',
  'APD',
  'TJX',
  'TECL',
  'WMG',
  'CPRI',
  'MGNI',
  'MPC',
  'IAA',
  'PRCH',
  'ADTX',
  'STNG',
  'ROOT',
  'HLT',
  'CF',
  'ORGN',
  'UPH',
  'FCX',
  'EBON',
];

function checkUnusualDrippyCriteria(rowObj) {
   if (
    !stocksToIgnore.includes(rowObj.tickerSymbol) &&
    rowObj.callVolume > callVolumeMin &&
    rowObj.callVolPercentVsYesterday > callVolPercentVsYesterdayMin &&
    rowObj.todayCallVolumeTotalPercent > todayCallVolumeTotalPercentMin &&
    rowObj.yesterdayCallVolumeTotalPercent >
      yesterdayCallVolumeTotalPercentMin &&
    rowObj.todayCallPremiumPercentage > todayCallVolumeTotalPercentMin &&
    rowObj.yesterdayCallPremiumPercentage > yesterdayCallPremiumPercentageMin
  ) {
    return true;
  }
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

  if (o.innerHTML != '') d.body.appendChild(o);
}
