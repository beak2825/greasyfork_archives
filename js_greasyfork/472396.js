// ==UserScript==
// @name         Big in Japan Enhance
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  improves some things on Big in Japan
// @author       IxianNavigator
// @match        https://www.biginjap.com/en/order-history
// @icon         https://icons.duckduckgo.com/ip2/biginjap.com.ico
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472396/Big%20in%20Japan%20Enhance.user.js
// @updateURL https://update.greasyfork.org/scripts/472396/Big%20in%20Japan%20Enhance.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // improving order history

  GM_addStyle('#page{width:100%}#center_column,#right_column{float:none}.columns_inner{display:flex;justify-content:center}#center_column{flex:1 1 auto;width:initial}#center_column #center_column_inner{float:none;width:initial}#block-history{display:flex}#block-history #order-list{flex:1 1 auto}#block-history #block-order-detail{padding:10px;margin:10px;background:#fafafa;border:1px solid #e8e8e8}#block-history tr th{padding:2px}#block-history tr td{padding:2px;height:0}#block-history tr td.history_date{width:80px}#block-history tr.waiting{background-color:#cdedff}#block-history tr.completed{background-color:#b2ecc1}#block-history tr.payment-pending{background-color:#ffa58b}#block-history tr.paid{background-color:#e3bbf5}#block-history tr.selected{position:relative}#block-history tr.selected:after{content:"";background:rgba(0,0,255,.2);position:absolute;left:0;top:0;right:0;bottom:0;pointer-events:none}');

  const classesByState = {
    'Your order is awaiting Paypal invoicing': "waiting",
    'Your order is awaiting PayPal payment': 'payment-pending',
    'The payment of your order has been accepted': 'paid',
    'Your order has shipped': "completed",
    'Your order has been cancelled': "cancelled"
  };
  const tbody = document.querySelector("#block-history tbody");
  const rows = Array.from(tbody.querySelectorAll("tr"));
  rows.forEach((orderRow) => {
    orderRow.classList.add(classesByState[orderRow.querySelector(".history_state").innerText]);
    const historyDateCell = orderRow.querySelector(".history_date");
    const dateMatch = historyDateCell.innerText.match(/(\d{2})\/(\d{2})\/(\d{4})/);
    historyDateCell.innerText = `${dateMatch[3]}-${dateMatch[1]}-${dateMatch[2]}`;
  });

  Object.values(classesByState).forEach((className) => {
    rows.forEach((row) => {
      if (row.classList.contains(className)) {
        tbody.appendChild(row);
      }
    });
  });

  const originalShowOrder = window.showOrder;
  console.log("originalShowOrder", window.showOrder);
  window.showOrder = function(mode, var_content, file) {
    rows.forEach((row) => {
      const orderId = parseFloat(row.querySelector(".history_link a[href]").textContent);
      if (orderId === var_content) {
        row.classList.add("selected");
      } else {
        row.classList.remove("selected");
      }
    });
    originalShowOrder(mode, var_content, file)
  };

})();