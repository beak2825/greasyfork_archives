// ==UserScript==
// @name         Neopets AutoDeposit Inventory
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically Deposit your whole Inventory in batches of 70
// @author       You
// @match        https://www.neopets.com/quickstock.phtml?r=
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/477408/Neopets%20AutoDeposit%20Inventory.user.js
// @updateURL https://update.greasyfork.org/scripts/477408/Neopets%20AutoDeposit%20Inventory.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // The URL to which you want to send the POST request
  var postUrl = "/process_quickstock.phtml";

  // Function to send data in batches
  function sendInBatches(startIndex, batchSize) {
    var radioValues = [];
    var idValues = [];

    // Collect the values of radio and ID inputs in the current batch
    for (var i = startIndex; i < startIndex + batchSize; i++) {
      var radioInput = $("input[name='radio_arr[" + i + "]'][value='deposit']");
      var idInput = $("input[name='id_arr[" + i + "]']");

      if (radioInput.length && idInput.length) {
        radioValues.push(radioInput.val());
        idValues.push(idInput.val());
      }
    }

    // Create the data object to send in the POST request
    var postData = {
      radio_arr: radioValues,
      id_arr: idValues,
    };
    if (radioValues.length > 0) {
      // Send a POST request using jQuery AJAX
      $.ajax({
        type: "POST",
        url: postUrl,
        data: postData,
        success: function (response) {
          console.log("Batch sent successfully:", response);
        },
        error: function (error) {
          console.error("Error sending batch:", error);
        },
        complete: function (data) {
          // Call the function to send the next batch
          sendInBatches(startIndex + batchSize, batchSize);
        },
      });
    } else {
      // All items have been processed, stop further processing
      console.log("All items have been deposited.");
    }
  }

  // Define the batch size
  var batchSize = 70;

  // Start sending batches from index 0
  var startIndex = 0;

  // Call the function to send data in batches
  sendInBatches(startIndex, batchSize);
})();
