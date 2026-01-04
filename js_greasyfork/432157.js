// ==UserScript==
// @name         Stock Autofill
// @namespace    PapaAndreas [2169463]
// @version      1.0
// @description  Autofills the values in the stock order page of a company
// @author       PapaAndreas [2169463]
// @match        https://www.torn.com/companies.php
// @license MIT
// @run-at document-end
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_xmlhttpRequest
// @connect api.torn.com
// @downloadURL https://update.greasyfork.org/scripts/432157/Stock%20Autofill.user.js
// @updateURL https://update.greasyfork.org/scripts/432157/Stock%20Autofill.meta.js
// ==/UserScript==

$(document).ajaxComplete((event, jqXHR, ajaxObj) => {
  if (jqXHR.responseText) {
    handle(jqXHR.responseText);
  }
});

function handle(responseText) {
  if (responseText.trim().startsWith('<div id="stock_message"')) {
    var API_KEY = GM_getValue("API_KEY", "insert API Key");
    if ($("#apikey").length == 0) {
      $('<input>').attr({
        type: 'text',
        id: 'apikey',
        value: API_KEY
      }).appendTo('#stock');
      var fillButton = $('<input type="button" class="btn-wrap silver" value="Autofill"/>');
      fillButton.appendTo('#stock');
      fillButton.click(function () {
        API_KEY = $("#apikey").first().val();
        GM_xmlhttpRequest({
          method: "GET",
          url: "https://api.torn.com/company?selections=detailed&key=" + API_KEY,
          onload: function (data) {
            data = JSON.parse(data.response);
            var storageSpace = data.company_detailed.upgrades.storage_space;
            var storageSpaceAvailable = storageSpace;
            if (storageSpace) { //API call was successfull:
              GM_setValue("API_KEY", API_KEY);
            }
            GM_xmlhttpRequest({
              method: "GET",
              url: "https://api.torn.com/company?selections=stock&key=" + API_KEY,
              onload: function (data) {
                data = JSON.parse(data.response);
                var totalSold = 0;
                $.each(data.company_stock, function (index, value) {
                  totalSold += value.sold_amount;
                  var stock = (value.on_order + value.in_stock);
                  if (stock > 0) storageSpaceAvailable -= stock;
                });

                var totalStocksNeeded = 0;
                $.each(data.company_stock, function (index, value) {
                  var sellingPercentage = value.sold_amount / totalSold;
                  var stocksNeeded = (sellingPercentage * storageSpace) - (value.on_order + value.in_stock);
                  if (stocksNeeded > 0) {
                    totalStocksNeeded += stocksNeeded;
                  }
                });
                var freeSpaceFactor = storageSpaceAvailable / totalStocksNeeded;
                $.each(data.company_stock, function (index, value) {
                  var sellingPercentage = value.sold_amount / totalSold;
                  var stocksNeeded = (sellingPercentage * storageSpace) - (value.on_order + value.in_stock);
                  if (stocksNeeded > 0) {
                    stocksNeeded *= freeSpaceFactor;
                    $('div:contains("' + index + '")').last().parent().find("input").val(Math.floor(stocksNeeded)).change();
                  }
                });
              }
            });
          }
        });
      });
    }
  }
}
