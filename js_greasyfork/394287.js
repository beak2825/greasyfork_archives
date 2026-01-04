// ==UserScript==
// @name         Wave Reconciliation-Reviewed
// @description  Adding Ability to see reviewed transactions on the reconciliation page
// @author       Seth Parrish
// @namespace    https://sethp.cc
// @version      0.5
// @icon         https://raw.githubusercontent.com/xthexder/wide-github/master/icon.png
// @homepageURL  https://greasyfork.org/en/scripts/394287-wave-reconciliation-reviewed
// @supportURL   https://greasyfork.org/en/scripts/394287-wave-reconciliation-reviewed
// @match        https://next.waveapps.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/394287/Wave%20Reconciliation-Reviewed.user.js
// @updateURL https://update.greasyfork.org/scripts/394287/Wave%20Reconciliation-Reviewed.meta.js
// ==/UserScript==
"use strict";

// Global Vars & Storage Object
// var d = document
// var b = d.body
var DBNAME = "reviewed_db";
var db = GM_getValue(DBNAME) || [];
console.log("DB:", db);

// Add GM DB deletion option
GM_registerMenuCommand("Clear Stored Data", () => {
  var shouldClear = confirm(
    'Do you want to clear the "seen" reviewed transactions? (this will not effect data in wave)'
  );
  if (shouldClear) {
    db = [];
    GM_setValue(DBNAME, db);
    GM_deleteValue(DBNAME);
    console.log("DB:", db);
  }
});

// Add 'unmatch all' button
GM_registerMenuCommand("Unmatch All Transactions on screen", () => {
  var shouldGo = confirm(
    "Do you want to unmatch all the transactions currently on the page?"
  );
  if (shouldGo) {
    var className = "account-recv2__reconciliation__table__matched-icon--true";
    var icons = Array.from(document.getElementsByClassName(className));
    icons.forEach(function (x) {
      x.click();
    });
    console.log("Finished Unmatching Transactions");
  }
});

// Find transaction from reconciliaton
var lastPicked = "";

function findTransaction() {
  if (lastPicked != "") {
    var url = window.location.href.split("account-")[0];
    window.open(url + "transactions/" + lastPicked);
  } else {
    alert("You haven't picked a transaction yet");
  }
  console.log("Looking for transaction");
}

GM_registerMenuCommand("Find Transaction", () => {
  findTransaction();
});

// Adding Custom CSS
GM_addStyle(
  ".account-recv2__reconciliation__table__reviewed--true {background: #dec9ff !important;color: #849194 !important;}"
);

// Check for Reviewed Status and add to the DB
function processLatestTransactions(res) {
  var isReviewed = (x) => Boolean(x.transaction_status.value);
  var isInDB = (x) => db.some((e) => e.transaction_guid === x.transaction_guid);
  res.latest_transactions.forEach((x) => {
    if (isReviewed(x) && !isInDB(x)) {
      db.push(x);
    }
  });
  GM_setValue(DBNAME, db);
  console.log("DB: ", db);
}

// Handle changing the status of a single transaction
function processTransactionStatusChange(res) {
  // Do not run if we are marking as reviewed (other case handles)
  if (res.transaction_status.value) {
    return;
  }
  for (var i = 0; i < db.length; i++) {
    if (db[i].transaction_guid === res.guid) {
      db.splice(i, 1);
    }
  }
  GM_setValue("reviewed_db", db);
  console.log("DB: ", db);
}

// Utility function to apply custom css to a row with matching data
function turnGreen(date, desc, price_formatted) {
  var datedRows = Array.apply(
    null,
    document.querySelectorAll(`time[datetime="${date}"]`)
  ).map(function (x) {
    return x.parentNode.parentElement.parentElement.parentElement.parentElement;
  });
  if (datedRows.length === 0) {
    return;
  }
  var el = datedRows.find(function (x) {
    var txt = x.textContent; // Eg. "Nov 29, 2019Steam Games$13.90$1,568.22"
    return (
      txt.includes(date.split("-")[0]) &&
      txt.includes(desc) &&
      txt.includes(price_formatted)
    );
  });
  el.className += " account-recv2__reconciliation__table__reviewed--true ";
}

// Iterate DB and apply styles
function processReconciliationPage(res) {
  // Deal with this page's transaction data
  // var matched = res.transactions.filter(x => Boolean(x.is_matched))
  db.forEach(function (x) {
    turnGreen(
      x.transaction_date,
      x.transaction_description,
      x.transaction_total.transaction.formatted_string
    );
  });
}

// HTTP Listener
(function (open) {
  XMLHttpRequest.prototype.open = function () {
    this.addEventListener(
      "readystatechange",
      function () {
        var json = this.responseText ? JSON.parse(this.responseText) : {};
        var doneAndIncludes = (x) =>
          this.readyState === 4 && this.responseURL.includes(x);

        if (doneAndIncludes("/transactions/latest/")) {
          // Check for a finished request dealing with latest transactions
          processLatestTransactions(json);
        } else if (doneAndIncludes("/transactions/status/")) {
          // Check for a finished request, marking a transaction as "un-reviewed"
          processTransactionStatusChange(json);
        } else if (
          doneAndIncludes("/account_reconciliation/reconciliation_by_period/")
        ) {
          // Check for a finished request dealing with reconciliation transactions
          processReconciliationPage(json);
        } else if (
          doneAndIncludes("transactions/") &&
          this.responseURL.split("/").length == 8
        ) {
          // Grab last (selected) transaction and save to variable
          lastPicked = this.responseURL.split("/")[6];
          console.log("Last Picked Updated: ", lastPicked);
        }
      },
      false
    );
    open.apply(this, arguments);
  };
})(XMLHttpRequest.prototype.open);

// Keyboard Listener
function keyPress(e) {
  // this would test for whichever key is alt and the ctrl key at the same time
  if (e.ctrlKey && e.keyCode == 18) {
    findTransaction();
  }
}

// register the handler
document.addEventListener("keydown", keyPress);

// The End :)