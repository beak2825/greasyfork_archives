// ==UserScript==
// @name        NetSuite Order Info Hunter/Gatherer
// @namespace   NetSuite WG
// @description A script to help copy order info to clipboard
// @license MIT
// @match       https://1206578.app.netsuite.com/app/accounting/transactions/salesord.nl*
// @match       https://1206578.app.netsuite.com/app/accounting/transactions/estimate.nl*
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @version     1.4
// @downloadURL https://update.greasyfork.org/scripts/493974/NetSuite%20Order%20Info%20HunterGatherer.user.js
// @updateURL https://update.greasyfork.org/scripts/493974/NetSuite%20Order%20Info%20HunterGatherer.meta.js
// ==/UserScript==



// Get the size of the order's item table programmatically
// Content rows start at 2, accounting for header row
const getRowCount = () => {
  let testRows;
  let lastRow = 0;
  let y = 2;
  testRows = document.querySelector("#item_splits > tbody > tr:nth-child(2) > td:nth-child(1)");
  while (testRows) {
    lastRow = y - 1;
    testRows = document.querySelector(`#item_splits > tbody > tr:nth-child(${y}) > td:nth-child(1)`);
    y++;
  }
  return lastRow;
}

const getColumnCount = () => {
  let testColumns;
  let lastColumn = 0;
  let x = 1;
  testColumns = document.querySelector("#item_splits > tbody > tr:nth-child(2) > td:nth-child(1)");
  while (testColumns) {
    lastColumn = x - 1;
    testColumns = document.querySelector(`#item_splits > tbody > tr:nth-child(2) > td:nth-child(${x})`);
    x++;
  }
  return lastColumn;
}

// Declaring variables for various info fields
// BUT FIRST ERROR CATCHING
const orderInfo = {
  shipAddress : document.querySelector("#shipaddress_fs_lbl_uir_label") ? document.querySelector("#shipaddress_fs_lbl_uir_label").nextElementSibling.innerText : 'NA',
  shipPhone : document.querySelector("#custbodyshipphonenumber_fs_lbl_uir_label") ? document.querySelector("#custbodyshipphonenumber_fs_lbl_uir_label").nextElementSibling.innerText : 'NA',
  email : document.querySelector("#custbody5_fs_lbl_uir_label") ? document.querySelector("#custbody5_fs_lbl_uir_label").nextElementSibling.innerText : 'NA',
  shipMethod : document.querySelector("#shipmethod_fs_lbl_uir_label") ? document.querySelector("#shipmethod_fs_lbl_uir_label").nextElementSibling.innerText : 'NA',
  estPallets : document.querySelector("#custbody_freight_packages_fs_lbl_uir_label") ? document.querySelector("#custbody_freight_packages_fs_lbl_uir_label").nextElementSibling.innerHTML.trim().replace(/<br>/g,'\r\n').replace(/<\/*[bu]>|/g,"") : 'NA',
  shipRates : document.querySelector("#custbody_quoted_rates_fs_lbl_uir_label") ? document.querySelector("#custbody_quoted_rates_fs_lbl_uir_label").nextElementSibling.innerHTML.trim().replace(/<br>/g,'\r\n').replace(/<\/*[bu]>|/g,"") : 'NA',
  estFreight : document.querySelector("#custbodyfreightquote_fs_lbl_uir_label") ? document.querySelector("#custbodyfreightquote_fs_lbl_uir_label").nextElementSibling.innerText : 'NA',
  estParcel : document.querySelector("#custbodyparcelquote_fs_lbl_uir_label") ? document.querySelector("#custbodyparcelquote_fs_lbl_uir_label").nextElementSibling.innerText : 'NA',
  recordNumber : document.querySelector("#main_form > table > tbody > tr:nth-child(1) > td > div > div.uir-page-title-secondline > div.uir-record-id") ? document.querySelector("#main_form > table > tbody > tr:nth-child(1) > td > div > div.uir-page-title-secondline > div.uir-record-id").innerText : 'NA',
  recordURL : window.location.href
};

const infoValues = [orderInfo.shipAddress,orderInfo.shipPhone,orderInfo.email,orderInfo.shipMethod,orderInfo.estPallets,orderInfo.shipRates,orderInfo.recordNumber,orderInfo.recordURL];
const infoArray = infoValues.map((info) => `"${info}"`);

/* Individual variables rather than an object
const shipAddress = document.querySelector("#shipaddress_fs_lbl_uir_label").nextElementSibling.innerText;
const shipPhone = document.querySelector("#custbodyshipphonenumber_fs_lbl_uir_label").nextElementSibling.innerText;
const email = document.querySelector("#custbody5_fs_lbl_uir_label").nextElementSibling.innerText;
const shipMethod = document.querySelector("#shipmethod_fs_lbl_uir_label").nextElementSibling.innerText;
const estPallets = document.querySelector("#custbody_freight_packages_fs_lbl_uir_label").nextElementSibling.innerText;
const shipRates = document.querySelector("#custbody_quoted_rates_fs_lbl_uir_label").nextElementSibling.innerText;
const estFreight = document.querySelector("#custbodyfreightquote_fs_lbl_uir_label").nextElementSibling.innerText;
const estParcel = document.querySelector("#custbodyparcelquote_fs_lbl_uir_label").nextElementSibling.innerText;
*/

/* The estimated stock cost is loaded dynamically, would need to click() on the Billing tab to generate it in the first place (todo?)
// Following variable returns null on Estimates
if (document.querySelector("#recmachcustrecord_gp_sorow0 > td:nth-child(4)")) {
  const dvEst = document.querySelector("#recmachcustrecord_gp_sorow0 > td:nth-child(4)").innerText;
} else {console.log('Cannot get estimated stock cost on Estimate record')}
*/

// Build an array out of the table
// Newline/return replacement is commented out because surrounding elements with quotes eliminates the need to remove these
const buildItemTable = () => {
  const itemTable = [];
  const totalRows = getRowCount();
  const totalColumns = getColumnCount();
  let currentRow = [];
  let row = 2;
  let column = 1;
  let aRow;
  while (row <= totalRows) {
    currentRow = [];
    while (column <= totalColumns) {
      aRow = document.querySelector(`#item_splits > tbody > tr:nth-child(${row}) > td:nth-child(${column})`).innerText;
      aRow = `"${aRow./*replace(/[\n\r]/gm,' ').*/replace(/"/gm,'""')}"`
      currentRow.push(aRow);
      column++;
    };
    column = 1;
    itemTable.push(currentRow);
    row++
  };
  return itemTable;
}

// Create and download CSV with some array
function downloadTable() {
  let csvContent = "data:text/csv;charset=utf-8,";
  let itemTable = buildItemTable();
  itemTable.forEach(function(rowArray) {
    let thisRow = rowArray.join(",");
    csvContent += thisRow + "\r\n";
  });

  var encodedUri = encodeURI(csvContent);
  window.open(encodedUri);
}

// Same method but join with tab character instead of comma in order to paste directly into sheet
function copyTable() {
    let copyContent = '';
    let itemTable = buildItemTable();
    itemTable.forEach(function(rowArray) {
        let thisRow = rowArray.join("	");
        copyContent += thisRow + "\r\n";
    });

    navigator.clipboard.writeText(copyContent);
}

function copyAll() {
    let copyContent = '';
    let itemTable = buildItemTable();
    itemTable.push(['"Begin Order Info"']);
    itemTable.push(['"Address"','"Phone Number"','"Email"','"Shipping Method"','"Estimated Pallets"','"Shipping Estimates"','"Order Number"','"Order URL"']);
    itemTable.push(infoArray);
    itemTable.forEach(function(rowArray) {
        let thisRow = rowArray.join("	");
        copyContent += thisRow + "\r\n";
    });

    navigator.clipboard.writeText(copyContent);
}

// Add button that copies some text to clipboard to the page
const addCopyButton = () => {
    const btn = document.createElement("button");
    btn.innerHTML = "Copy Order Info to Clipboard";
    btn.onclick = () => {
      copyAll();
      return false;
    };
  // Choose element to attach button to
  document.querySelector(".uir_form_tab_container").before(btn);
};

/*
// Wait until field exists
VM.observe(document.body, () => {
  const node = document.querySelector(".uir_form_tab_container");
  if (node) {
    addCopyButton();
    console.log('Good job');
    return true;
  } else {console.log('Nope')}
});
*/


//Alternate method?
const disconnect = VM.observe(document.body, () => {
  // Find the target node
  const node = document.querySelector(".uir_form_tab_container");

  if (node) {
    addCopyButton();

    // disconnect observer
    return true;
  }
});
