// @require http://code.jquery.com/jquery-latest.js
// ==UserScript==
// @name         Accounting DropDown Fix
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Add links to accounting menu
// @author       Tyler
// @match        https://my.serviceautopilot.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/380726/Accounting%20DropDown%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/380726/Accounting%20DropDown%20Fix.meta.js
// ==/UserScript==

(function() {
  'use strict';
  $(document).ready(function() {
      document.getElementById("panelInvoices").removeAttribute("onclick");
      document.getElementById("panelPayments").removeAttribute("onclick");
      document.getElementById("panelCredits").removeAttribute("onclick");
      document.getElementById("panelExpenses").removeAttribute("onclick");
      document.getElementById("panelPurchaseOrders").removeAttribute("onclick");

      $('#panelInvoices').attr('href', 'https://my.serviceautopilot.com/InvoiceList.aspx');
      $('#panelPayments').attr('href', 'https://my.serviceautopilot.com/Payments.aspx');
      $('#panelCredits').attr('href', 'https://my.serviceautopilot.com/CreditList.aspx');
      $('#panelExpenses').attr('href', 'https://my.serviceautopilot.com/ExpenseList.aspx');
      $('#panelPurchaseOrders').attr('href', 'https://my.serviceautopilot.com/PurchaseOrderList.aspx');
    }
  )
}());